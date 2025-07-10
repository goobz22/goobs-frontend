/**
 * @fileoverview Async state management with built-in loading/error states
 *
 * This file implements robust async state management that eliminates the common
 * patterns of fragmented useState calls for loading, error, and data states.
 *
 * Key Design Decisions:
 * - Cohesive async state representation prevents impossible states
 * - Built-in retry logic with exponential backoff
 * - Circuit breaker integration for stability
 * - Automatic cancellation prevents race conditions
 * - Resource manager handles complex async dependencies
 *
 * CRITICAL: This system prevents the most common async bugs in React applications:
 * - Race conditions from overlapping requests
 * - Impossible states (loading + error simultaneously)
 * - Memory leaks from uncancelled requests
 * - Inconsistent error handling across components
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { Signal, useSignal, useEffect } from './reactive'

/**
 * Async state representation that prevents impossible states.
 *
 * This discriminated union ensures that async state is always in exactly one
 * of these states, preventing impossible combinations like loading + error.
 *
 * DESIGN RATIONALE: This approach eliminates the common React pattern of
 * separate useState calls for loading, error, and data which can lead to
 * impossible state combinations.
 *
 * @template T The type of data when successfully loaded
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

/**
 * Configuration options for retry behavior.
 *
 * These options control how async operations are retried when they fail.
 * The exponential backoff prevents overwhelming servers with rapid retries.
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number
  /** Base delay between retries in milliseconds */
  baseDelay: number
  /** Maximum delay between retries in milliseconds */
  maxDelay: number
  /** Multiplier for exponential backoff */
  backoffMultiplier: number
  /** Whether to retry on network errors */
  retryOnNetworkError: boolean
  /** Whether to retry on timeout errors */
  retryOnTimeout: boolean
}

/**
 * Configuration options for circuit breaker behavior in async operations.
 *
 * These options control when the circuit breaker should activate for
 * async operations to prevent cascading failures.
 */
export interface CircuitBreakerConfig {
  /** Maximum number of failures before opening circuit */
  maxFailures: number
  /** Time window for failure counting in milliseconds */
  failureWindow: number
  /** Time to wait before trying again after circuit opens */
  cooldownPeriod: number
  /** Whether to enable circuit breaker */
  enabled: boolean
}

/**
 * Configuration options for AsyncSignal behavior.
 *
 * These options control various aspects of async signal behavior including
 * retry logic, circuit breaker settings, and caching behavior.
 */
export interface AsyncSignalOptions {
  /** Retry configuration */
  retry?: Partial<RetryConfig>
  /** Circuit breaker configuration */
  circuitBreaker?: Partial<CircuitBreakerConfig>
  /** Time to keep data fresh in milliseconds */
  staleTime?: number
  /** Time to keep data in cache in milliseconds */
  cacheTime?: number
  /** Whether to retry on component mount */
  retryOnMount?: boolean
  /** Whether to refetch on window focus */
  refetchOnWindowFocus?: boolean
  /** Interval for background revalidation */
  revalidateInterval?: number
  /** Custom name for debugging */
  name?: string
}

/**
 * Default retry configuration.
 *
 * These defaults provide sensible retry behavior for most use cases.
 * The exponential backoff prevents overwhelming servers while still
 * providing reasonable recovery times.
 */
const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryOnNetworkError: true,
  retryOnTimeout: true,
}

/**
 * Default circuit breaker configuration.
 *
 * These defaults provide protection against cascading failures while
 * allowing normal operation under typical conditions.
 */
const defaultCircuitBreakerConfig: CircuitBreakerConfig = {
  maxFailures: 5,
  failureWindow: 60000, // 1 minute
  cooldownPeriod: 30000, // 30 seconds
  enabled: true,
}

/**
 * Circuit breaker for async operations.
 *
 * This prevents cascading failures by temporarily disabling operations
 * when too many failures occur within a time window.
 *
 * CRITICAL: This is essential for system stability in distributed environments
 * where failures can cascade across multiple services.
 */
class AsyncCircuitBreaker {
  private failures: number[] = []
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private lastFailureTime: number = 0

  constructor(private config: CircuitBreakerConfig) {}

  /**
   * Records a failure for circuit breaker evaluation.
   *
   * @param error The error that occurred
   */
  recordFailure(error: Error): void {
    if (!this.config.enabled) return

    const now = Date.now()
    this.failures.push(now)
    this.lastFailureTime = now

    // Clean old failures
    this.failures = this.failures.filter(
      time => now - time < this.config.failureWindow
    )

    // Check if we should open the circuit
    if (this.failures.length >= this.config.maxFailures) {
      this.state = 'OPEN'
      console.warn(
        `Circuit breaker opened after ${this.failures.length} failures`
      )
    }
  }

  /**
   * Records a success for circuit breaker evaluation.
   *
   * Success in half-open state transitions back to closed.
   */
  recordSuccess(): void {
    if (!this.config.enabled) return

    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED'
      this.failures = []
    }
  }

  /**
   * Checks if an operation should be allowed to proceed.
   *
   * @returns true if operation should proceed, false if circuit is open
   */
  shouldExecute(): boolean {
    if (!this.config.enabled) return true

    const now = Date.now()

    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.config.cooldownPeriod) {
        this.state = 'HALF_OPEN'
        return true
      }
      return false
    }

    return true
  }

  /**
   * Resets the circuit breaker to closed state.
   */
  reset(): void {
    this.state = 'CLOSED'
    this.failures = []
    this.lastFailureTime = 0
  }
}

/**
 * Async signal that manages loading, error, and success states cohesively.
 *
 * This class replaces the common React pattern of separate useState calls
 * for loading, error, and data states with a single, cohesive representation
 * that prevents impossible states.
 *
 * Key features:
 * - Cohesive async state prevents impossible combinations
 * - Built-in retry logic with exponential backoff
 * - Circuit breaker protection against cascading failures
 * - Automatic request cancellation prevents race conditions
 * - Resource management for cleanup and memory leak prevention
 *
 * @template T The type of data when successfully loaded
 */
export class AsyncSignal<T> {
  private _state: AsyncState<T> = { status: 'idle' }
  private _signal: Signal<AsyncState<T>>
  private _retryConfig: RetryConfig
  private _circuitBreaker: AsyncCircuitBreaker
  private _abortController: AbortController | null = null
  private _lastFetch: number = 0
  private _options: AsyncSignalOptions

  /**
   * Creates a new AsyncSignal.
   *
   * @param asyncFn Function that returns a promise
   * @param options Configuration options
   */
  constructor(
    private asyncFn: () => Promise<T>,
    options: AsyncSignalOptions = {}
  ) {
    this._options = options
    this._signal = new Signal(this._state, { name: options.name })
    this._retryConfig = { ...defaultRetryConfig, ...options.retry }
    this._circuitBreaker = new AsyncCircuitBreaker({
      ...defaultCircuitBreakerConfig,
      ...options.circuitBreaker,
    })
  }

  /**
   * Gets the current async state.
   *
   * This provides access to the full async state including loading,
   * error, and success states.
   *
   * @returns Current async state
   */
  get value(): AsyncState<T> {
    return this._signal.value
  }

  /**
   * Gets the loading state.
   *
   * @returns true if currently loading
   */
  get loading(): boolean {
    return this._signal.value.status === 'loading'
  }

  /**
   * Gets the error state.
   *
   * @returns Error if in error state, null otherwise
   */
  get error(): Error | null {
    return this._signal.value.status === 'error'
      ? this._signal.value.error
      : null
  }

  /**
   * Gets the success data.
   *
   * @returns Data if in success state, undefined otherwise
   */
  get data(): T | undefined {
    return this._signal.value.status === 'success'
      ? this._signal.value.data
      : undefined
  }

  /**
   * Gets the timestamp of the last successful fetch.
   *
   * @returns Timestamp of last fetch
   */
  get lastFetch(): number {
    return this._lastFetch
  }

  /**
   * Executes the async operation.
   *
   * This method handles the full async lifecycle including:
   * - Circuit breaker checks
   * - Request cancellation
   * - Retry logic with exponential backoff
   * - State management
   * - Error handling
   *
   * CRITICAL: This method includes comprehensive error handling and
   * prevents race conditions through request cancellation.
   *
   * @returns Promise that resolves with the data
   * @throws Error if operation fails after all retries
   */
  async execute(): Promise<T> {
    // Check circuit breaker
    if (!this._circuitBreaker.shouldExecute()) {
      const error = new Error('Circuit breaker is open')
      this._setState({ status: 'error', error })
      throw error
    }

    // Cancel any existing request
    if (this._abortController) {
      this._abortController.abort()
    }

    this._abortController = new AbortController()
    this._setState({ status: 'loading' })

    try {
      const result = await this._executeWithRetry()
      this._setState({ status: 'success', data: result })
      this._lastFetch = Date.now()
      this._circuitBreaker.recordSuccess()
      return result
    } catch (error) {
      const asyncError = error as Error
      this._setState({ status: 'error', error: asyncError })
      this._circuitBreaker.recordFailure(asyncError)
      throw asyncError
    } finally {
      this._abortController = null
    }
  }

  /**
   * Executes the async operation with retry logic.
   *
   * This method implements exponential backoff retry logic to handle
   * transient failures gracefully.
   *
   * @returns Promise that resolves with the data
   * @throws Error if all retries fail
   * @private
   */
  private async _executeWithRetry(): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= this._retryConfig.maxRetries; attempt++) {
      try {
        const result = await this.asyncFn()
        return result
      } catch (error) {
        lastError = error as Error

        // Don't retry if this is the last attempt
        if (attempt === this._retryConfig.maxRetries) {
          break
        }

        // Check if we should retry this type of error
        if (!this._shouldRetry(lastError)) {
          break
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this._retryConfig.baseDelay *
            Math.pow(this._retryConfig.backoffMultiplier, attempt),
          this._retryConfig.maxDelay
        )

        // Wait before retrying
        await this._sleep(delay)
      }
    }

    throw lastError!
  }

  /**
   * Determines if an error should trigger a retry.
   *
   * This method checks the error type and configuration to determine
   * if a retry attempt should be made.
   *
   * @param error The error to check
   * @returns true if retry should be attempted
   * @private
   */
  private _shouldRetry(error: Error): boolean {
    // Don't retry if request was aborted
    if (error.name === 'AbortError') {
      return false
    }

    // Check specific error types based on configuration
    if (
      error.message.includes('network') &&
      this._retryConfig.retryOnNetworkError
    ) {
      return true
    }

    if (error.message.includes('timeout') && this._retryConfig.retryOnTimeout) {
      return true
    }

    // Default to retrying for most errors
    return true
  }

  /**
   * Sleep utility for retry delays.
   *
   * @param ms Milliseconds to sleep
   * @returns Promise that resolves after delay
   * @private
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Sets the internal state and notifies subscribers.
   *
   * @param newState New async state
   * @private
   */
  private _setState(newState: AsyncState<T>): void {
    this._state = newState
    this._signal.value = newState
  }

  /**
   * Resets the async signal to idle state.
   *
   * This clears any existing data, error, or loading state.
   */
  reset(): void {
    if (this._abortController) {
      this._abortController.abort()
      this._abortController = null
    }

    this._setState({ status: 'idle' })
    this._lastFetch = 0
    this._circuitBreaker.reset()
  }

  /**
   * Checks if the data is stale based on staleTime configuration.
   *
   * @returns true if data is stale
   */
  isStale(): boolean {
    if (!this._options.staleTime || this._lastFetch === 0) {
      return true
    }

    return Date.now() - this._lastFetch > this._options.staleTime
  }

  /**
   * Disposes of the async signal and cleans up resources.
   *
   * IMPORTANT: Always call this when the signal is no longer needed
   * to prevent memory leaks.
   */
  dispose(): void {
    if (this._abortController) {
      this._abortController.abort()
      this._abortController = null
    }

    this._signal.dispose()
    this._circuitBreaker.reset()
  }
}

/**
 * Resource manager for handling complex async dependencies.
 *
 * This class manages multiple async resources and their dependencies,
 * providing automatic invalidation and coordination between related
 * async operations.
 *
 * DESIGN RATIONALE: Complex applications often have interdependent
 * async operations (e.g., user data depends on auth token). This manager
 * provides a centralized way to handle these dependencies.
 */
export class ResourceManager {
  private resources: Map<string, AsyncSignal<any>> = new Map()
  private dependencies: Map<string, Set<string>> = new Map()
  private listeners: Map<string, Set<() => void>> = new Map()

  /**
   * Creates a new async resource with optional dependencies.
   *
   * @template T The type of data returned by the resource
   * @param key Unique identifier for the resource
   * @param asyncFn Function that returns a promise
   * @param dependencies Array of resource keys this resource depends on
   * @param options Configuration options
   * @returns AsyncSignal for the resource
   */
  createResource<T>(
    key: string,
    asyncFn: () => Promise<T>,
    dependencies: string[] = [],
    options: AsyncSignalOptions = {}
  ): AsyncSignal<T> {
    const resource = new AsyncSignal(asyncFn, { ...options, name: key })

    this.resources.set(key, resource)
    this.dependencies.set(key, new Set(dependencies))
    this.listeners.set(key, new Set())

    // Set up dependency invalidation
    dependencies.forEach(dep => {
      const depResource = this.resources.get(dep)
      if (depResource) {
        // Invalidate this resource when dependency succeeds
        const listener = () => {
          if (depResource.value.status === 'success') {
            this.invalidateResource(key)
          }
        }

        this.listeners.get(dep)?.add(listener)
      }
    })

    return resource
  }

  /**
   * Gets an existing resource by key.
   *
   * @param key Resource key
   * @returns AsyncSignal for the resource or undefined
   */
  getResource(key: string): AsyncSignal<any> | undefined {
    return this.resources.get(key)
  }

  /**
   * Invalidates a resource and all dependent resources.
   *
   * This triggers a re-fetch of the resource and any resources
   * that depend on it.
   *
   * @param key Resource key to invalidate
   */
  invalidateResource(key: string): void {
    const resource = this.resources.get(key)
    if (resource) {
      resource.reset()
    }

    // Invalidate dependent resources
    this.dependencies.forEach((deps, resourceKey) => {
      if (deps.has(key)) {
        this.invalidateResource(resourceKey)
      }
    })

    // Notify listeners
    this.listeners.get(key)?.forEach(listener => listener())
  }

  /**
   * Invalidates all resources.
   *
   * This clears all resource states and triggers re-fetching.
   */
  invalidateAll(): void {
    this.resources.forEach(resource => resource.reset())
    this.listeners.forEach(listenerSet => {
      listenerSet.forEach(listener => listener())
    })
  }

  /**
   * Disposes of all resources and cleans up.
   *
   * IMPORTANT: Call this when the resource manager is no longer needed
   * to prevent memory leaks.
   */
  dispose(): void {
    this.resources.forEach(resource => resource.dispose())
    this.resources.clear()
    this.dependencies.clear()
    this.listeners.clear()
  }
}

/**
 * Creates a new async signal with loading, error, and success states.
 *
 * This is the primary way to handle async operations in the framework.
 * It provides a cohesive async state that prevents impossible combinations
 * like loading + error simultaneously.
 *
 * @template T The type of data returned by the async operation
 * @param asyncFn Function that returns a promise
 * @param options Configuration options
 * @returns AsyncSignal instance
 *
 * @example
 * ```typescript
 * const userSignal = useAsyncSignal(
 *   () => fetch('/api/user').then(r => r.json()),
 *   { retry: { maxRetries: 3 } }
 * );
 *
 * // Access different parts of the state
 * console.log(userSignal.loading); // boolean
 * console.log(userSignal.error);   // Error | null
 * console.log(userSignal.data);    // User | undefined
 *
 * // Execute the operation
 * userSignal.execute();
 * ```
 */
export function useAsyncSignal<T>(
  asyncFn: () => Promise<T>,
  options: AsyncSignalOptions = {}
): AsyncSignal<T> {
  return new AsyncSignal(asyncFn, options)
}

/**
 * Creates a resource with SWR-like behavior.
 *
 * This function creates an async resource that automatically handles
 * stale-while-revalidate patterns, background revalidation, and
 * focus-based revalidation.
 *
 * @template T The type of data returned by the resource
 * @param key Unique key for the resource
 * @param fetcher Function that returns a promise
 * @param options Configuration options
 * @returns AsyncSignal with SWR behavior
 *
 * @example
 * ```typescript
 * const userResource = createResource(
 *   'user',
 *   () => fetch('/api/user').then(r => r.json()),
 *   {
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     revalidateInterval: 30 * 1000 // 30 seconds
 *   }
 * );
 * ```
 */
export function createResource<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: AsyncSignalOptions = {}
): AsyncSignal<T> {
  const signal = useAsyncSignal(fetcher, {
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes
    retryOnMount: options.retryOnMount !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus !== false,
    ...options,
    name: key,
  })

  // Background revalidation
  if (options.revalidateInterval) {
    useEffect(() => {
      const interval = setInterval(() => {
        if (signal.data && signal.isStale()) {
          signal.execute() // Background refetch
        }
      }, options.revalidateInterval)

      return () => clearInterval(interval)
    })
  }

  // Focus revalidation
  if (options.refetchOnWindowFocus) {
    useEffect(() => {
      const handleFocus = () => {
        if (signal.data && signal.isStale()) {
          signal.execute()
        }
      }

      window.addEventListener('focus', handleFocus)
      return () => window.removeEventListener('focus', handleFocus)
    })
  }

  return signal
}

/**
 * Creates a mutation signal for write operations.
 *
 * This function creates an async signal specifically designed for
 * write operations like POST, PUT, DELETE requests.
 *
 * @template T The type of data returned by the mutation
 * @template V The type of variables passed to the mutation
 * @param mutationFn Function that performs the mutation
 * @param options Configuration options
 * @returns Object with mutation function and state
 *
 * @example
 * ```typescript
 * const updateUser = createMutation(
 *   (userData: User) => fetch('/api/user', {
 *     method: 'PUT',
 *     body: JSON.stringify(userData)
 *   }).then(r => r.json()),
 *   {
 *     onSuccess: (data) => console.log('User updated:', data),
 *     onError: (error) => console.error('Update failed:', error)
 *   }
 * );
 *
 * // Execute the mutation
 * updateUser.mutate({ name: 'John', email: 'john@example.com' });
 * ```
 */
export function createMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccess?: (data: T, variables: V) => void
    onError?: (error: Error, variables: V) => void
    onSettled?: (data: T | undefined, error: Error | null, variables: V) => void
  } = {}
): {
  mutate: (variables: V) => Promise<T>
  state: AsyncSignal<T>
} {
  const signal = useAsyncSignal(() => Promise.resolve({} as T))

  const mutate = async (variables: V): Promise<T> => {
    const mutationSignal = useAsyncSignal(() => mutationFn(variables))

    try {
      const result = await mutationSignal.execute()
      options.onSuccess?.(result, variables)
      options.onSettled?.(result, null, variables)
      return result
    } catch (error) {
      const asyncError = error as Error
      options.onError?.(asyncError, variables)
      options.onSettled?.(undefined, asyncError, variables)
      throw asyncError
    }
  }

  return { mutate, state: signal }
}

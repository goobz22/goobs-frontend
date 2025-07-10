import { CircuitBreaker } from '../core/circuit-breaker'
import { Signal, ComputedSignal } from '../core/reactive'

export interface MemoizationOptions {
  maxCacheSize?: number
  ttl?: number // Time to live in milliseconds
  enableCircuitBreaker?: boolean
  circuitBreakerOptions?: {
    maxRevisions: number
    timeWindow: number
    cooldownPeriod: number
  }
  keyGenerator?: (...args: any[]) => string
  shouldInvalidate?: (oldArgs: any[], newArgs: any[]) => boolean
}

export interface MemoizedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>
  cache: Map<string, CacheEntry<ReturnType<T>>>
  clear: () => void
  invalidate: (key?: string) => void
  getStats: () => MemoizationStats
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  accessCount: number
  lastAccessed: number
  dependencies: Set<Signal<any> | ComputedSignal<any>>
  isValid: boolean
}

export interface MemoizationStats {
  cacheSize: number
  hitCount: number
  missCount: number
  totalExecutions: number
  averageExecutionTime: number
  circuitBreakerStats?: any
}

export interface DependencyTracker {
  startTracking(): void
  stopTracking(): Set<Signal<any> | ComputedSignal<any>>
  clear(): void
}

// Dependency tracking for automatic invalidation
class DependencyTracker {
  private dependencies: Set<Signal<any> | ComputedSignal<any>> = new Set()
  private isTracking = false
  private originalGetters: WeakMap<any, any> = new WeakMap()

  startTracking(): void {
    if (this.isTracking) return
    this.isTracking = true
    this.dependencies.clear()
    this.setupDependencyTracking()
  }

  stopTracking(): Set<Signal<any> | ComputedSignal<any>> {
    if (!this.isTracking) return new Set()
    this.isTracking = false
    this.teardownDependencyTracking()
    return new Set(this.dependencies)
  }

  private setupDependencyTracking(): void {
    // This would need to be implemented to track access to reactive values
    // For now, we'll use a simpler approach
  }

  private teardownDependencyTracking(): void {
    // Restore original getters
    this.originalGetters = new WeakMap()
  }

  clear(): void {
    this.dependencies.clear()
  }
}

// Memoization cache with automatic cleanup
export class MemoizationCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private hitCount = 0
  private missCount = 0
  private totalExecutions = 0
  private totalExecutionTime = 0
  private options: Required<MemoizationOptions>
  private circuitBreaker?: CircuitBreaker
  private cleanupInterval?: NodeJS.Timeout

  constructor(options: MemoizationOptions = {}) {
    this.options = {
      maxCacheSize: options.maxCacheSize || 1000,
      ttl: options.ttl || 300000, // 5 minutes
      enableCircuitBreaker: options.enableCircuitBreaker !== false,
      circuitBreakerOptions: options.circuitBreakerOptions || {
        maxRevisions: 1000,
        timeWindow: 1000,
        cooldownPeriod: 5000,
      },
      keyGenerator: options.keyGenerator || this.defaultKeyGenerator,
      shouldInvalidate:
        options.shouldInvalidate || this.defaultShouldInvalidate,
    }

    if (this.options.enableCircuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(
        this.options.circuitBreakerOptions
      )
    }

    // Set up periodic cleanup
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      this.options.ttl / 2
    )
  }

  get<Args extends any[]>(
    key: string,
    fn: (...args: Args) => T,
    args: Args
  ): T {
    const now = Date.now()
    const entry = this.cache.get(key)

    // Check if we have a valid cached entry
    if (entry && this.isEntryValid(entry, now)) {
      entry.accessCount++
      entry.lastAccessed = now
      this.hitCount++

      // Check if dependencies are still valid
      if (this.areDependenciesValid(entry)) {
        return entry.value
      }
    }

    // Cache miss or invalid entry
    this.missCount++
    this.totalExecutions++

    // Check circuit breaker
    if (this.circuitBreaker && !this.circuitBreaker.canExecute()) {
      if (entry) {
        return entry.value // Return stale value if circuit breaker is open
      }
      throw new Error('Circuit breaker is open and no cached value available')
    }

    // Execute function and cache result
    const startTime = performance.now()

    try {
      const dependencyTracker = new DependencyTracker()
      dependencyTracker.startTracking()

      const result = fn(...args)

      const dependencies = dependencyTracker.stopTracking()
      const executionTime = performance.now() - startTime

      this.totalExecutionTime += executionTime

      // Create cache entry
      const newEntry: CacheEntry<T> = {
        value: result,
        timestamp: now,
        accessCount: 1,
        lastAccessed: now,
        dependencies,
        isValid: true,
      }

      this.cache.set(key, newEntry)

      // Setup dependency invalidation
      this.setupDependencyInvalidation(key, dependencies)

      // Cleanup if cache is too large
      if (this.cache.size > this.options.maxCacheSize) {
        this.evictLeastRecentlyUsed()
      }

      if (this.circuitBreaker) {
        this.circuitBreaker.recordExecution()
      }

      return result
    } catch (error) {
      // Return stale value if available
      if (entry) {
        console.warn('Function execution failed, returning stale value:', error)
        return entry.value
      }
      throw error
    }
  }

  private isEntryValid(entry: CacheEntry<T>, now: number): boolean {
    return (
      entry.isValid &&
      now - entry.timestamp < this.options.ttl &&
      this.areDependenciesValid(entry)
    )
  }

  private areDependenciesValid(entry: CacheEntry<T>): boolean {
    // Check if any dependencies have changed
    for (const dep of entry.dependencies) {
      if (dep instanceof Signal || dep instanceof ComputedSignal) {
        // Would need to implement dependency change detection
        // For now, assume dependencies are valid
      }
    }
    return true
  }

  private setupDependencyInvalidation(
    key: string,
    dependencies: Set<Signal<any> | ComputedSignal<any>>
  ): void {
    dependencies.forEach(dep => {
      if (dep instanceof Signal) {
        dep.subscribe(() => {
          this.invalidate(key)
        })
      } else if (dep instanceof ComputedSignal) {
        dep.subscribe(() => {
          this.invalidate(key)
        })
      }
    })
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey: string | null = null
    let lruTime = Infinity

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed
        lruKey = key
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > this.options.ttl) {
        toDelete.push(key)
      }
    }

    toDelete.forEach(key => this.cache.delete(key))
  }

  private defaultKeyGenerator(...args: any[]): string {
    return JSON.stringify(args)
  }

  private defaultShouldInvalidate(oldArgs: any[], newArgs: any[]): boolean {
    return JSON.stringify(oldArgs) !== JSON.stringify(newArgs)
  }

  invalidate(key?: string): void {
    if (key) {
      const entry = this.cache.get(key)
      if (entry) {
        entry.isValid = false
      }
    } else {
      for (const entry of this.cache.values()) {
        entry.isValid = false
      }
    }
  }

  clear(): void {
    this.cache.clear()
    this.hitCount = 0
    this.missCount = 0
    this.totalExecutions = 0
    this.totalExecutionTime = 0
  }

  getStats(): MemoizationStats {
    return {
      cacheSize: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      totalExecutions: this.totalExecutions,
      averageExecutionTime:
        this.totalExecutions > 0
          ? this.totalExecutionTime / this.totalExecutions
          : 0,
      circuitBreakerStats: this.circuitBreaker?.getStats(),
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

// Main memoization function
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizationOptions = {}
): MemoizedFunction<T> {
  const cache = new MemoizationCache<ReturnType<T>>(options)

  const memoizedFn = ((...args: Parameters<T>): ReturnType<T> => {
    const key = options.keyGenerator
      ? options.keyGenerator(...args)
      : JSON.stringify(args)
    return cache.get(key, fn, args)
  }) as MemoizedFunction<T>

  memoizedFn.cache = new Map() // Expose cache for inspection
  memoizedFn.clear = () => cache.clear()
  memoizedFn.invalidate = (key?: string) => cache.invalidate(key)
  memoizedFn.getStats = () => cache.getStats()

  return memoizedFn
}

// Component memoization with shallow comparison
export function memoizeComponent<Props extends Record<string, any>>(
  component: (props: Props) => any,
  options: MemoizationOptions & {
    compareProps?: (prev: Props, next: Props) => boolean
  } = {}
): MemoizedFunction<(props: Props) => any> {
  const compareProps = options.compareProps || shallowEqual

  return memoize(component, {
    ...options,
    shouldInvalidate: (oldArgs, newArgs) => {
      const [oldProps] = oldArgs
      const [newProps] = newArgs
      return !compareProps(oldProps, newProps)
    },
  })
}

// Shallow comparison for props
function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

// Auto-memoization decorator
export function autoMemoize<T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value

  if (typeof originalMethod !== 'function') {
    throw new Error('autoMemoize can only be applied to methods')
  }

  const memoizedMethod = memoize(originalMethod, {
    maxCacheSize: 100,
    ttl: 60000, // 1 minute
    enableCircuitBreaker: true,
  })

  descriptor.value = memoizedMethod
  return descriptor
}

// Global memoization registry
export class MemoizationRegistry {
  private static instance: MemoizationRegistry
  private memoizedFunctions = new Map<string, MemoizedFunction<any>>()

  static getInstance(): MemoizationRegistry {
    if (!MemoizationRegistry.instance) {
      MemoizationRegistry.instance = new MemoizationRegistry()
    }
    return MemoizationRegistry.instance
  }

  register<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    options?: MemoizationOptions
  ): MemoizedFunction<T> {
    const memoizedFn = memoize(fn, options)
    this.memoizedFunctions.set(name, memoizedFn)
    return memoizedFn
  }

  get(name: string): MemoizedFunction<any> | undefined {
    return this.memoizedFunctions.get(name)
  }

  invalidate(name?: string): void {
    if (name) {
      const fn = this.memoizedFunctions.get(name)
      if (fn) {
        fn.invalidate()
      }
    } else {
      this.memoizedFunctions.forEach(fn => fn.invalidate())
    }
  }

  clear(name?: string): void {
    if (name) {
      const fn = this.memoizedFunctions.get(name)
      if (fn) {
        fn.clear()
      }
    } else {
      this.memoizedFunctions.forEach(fn => fn.clear())
    }
  }

  getStats(): Map<string, MemoizationStats> {
    const stats = new Map<string, MemoizationStats>()
    this.memoizedFunctions.forEach((fn, name) => {
      stats.set(name, fn.getStats())
    })
    return stats
  }
}

// Convenience functions
export const memo = memoize
export const registry = MemoizationRegistry.getInstance()

// Export utility functions
export function createMemoizedGetter<T>(
  getter: () => T,
  options?: MemoizationOptions
): () => T {
  return memoize(getter, options)
}

export function createMemoizedSetter<T>(
  setter: (value: T) => void,
  options?: MemoizationOptions
): (value: T) => void {
  return memoize(setter, options)
}

/**
 * @fileoverview Core reactive system implementation with signal-based state management
 *
 * This file implements the fundamental reactive primitives that replace React's useState/useEffect
 * with automatic dependency tracking and built-in circuit breakers to prevent infinite loops.
 *
 * Key Design Decisions:
 * - Signal-based reactivity eliminates manual dependency arrays
 * - Circuit breakers prevent runaway effects and infinite loops
 * - Automatic cleanup prevents memory leaks
 * - Batch updates optimize performance
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

/**
 * Global effect runner used for automatic dependency tracking.
 *
 * CRITICAL: This variable tracks the currently executing effect to automatically
 * register dependencies. Do not modify this directly - use the EffectRunner class.
 *
 * @internal
 */
let currentEffect: EffectRunner | null = null

/**
 * Global component tracker for automatic signal subscription.
 *
 * When a component render function is executing, this tracks it so that
 * any signals read during rendering automatically subscribe the component.
 *
 * @internal
 */
let currentComponent: ComponentRenderer | null = null

/**
 * Global circuit breaker coordinator to prevent system-wide infinite loops.
 * This tracks all reactive activity across the entire system.
 *
 * @internal
 */
class InfiniteLoopDetector {
  private static instance: InfiniteLoopDetector | null = null
  private blockedOperations: Set<string> = new Set()
  private executionStack: string[] = []
  private readonly maxStackDepth = 50

  static getInstance(): InfiniteLoopDetector {
    if (!InfiniteLoopDetector.instance) {
      InfiniteLoopDetector.instance = new InfiniteLoopDetector()
    }
    return InfiniteLoopDetector.instance
  }

  shouldExecute(operation: string): boolean {
    // If this operation is permanently blocked due to infinite loop, don't allow
    if (this.blockedOperations.has(operation)) {
      console.warn(`🚫 InfiniteLoopDetector: Operation "${operation}" is permanently blocked due to detected infinite loop`)
      return false
    }

    // Check if we're in a circular dependency by looking at the execution stack
    const operationIndex = this.executionStack.indexOf(operation)
    if (operationIndex !== -1) {
      // We found this operation already in the stack - this is a circular dependency!
      const cycle = this.executionStack.slice(operationIndex)
      console.error(`🔄 InfiniteLoopDetector: CIRCULAR DEPENDENCY DETECTED!`)
      console.error(`   Cycle: ${cycle.join(' → ')} → ${operation}`)
      
      // Block all operations in this cycle permanently
      cycle.forEach(op => this.blockedOperations.add(op))
      this.blockedOperations.add(operation)
      
      // Clear the stack since we've detected the problem
      this.executionStack = []
      
      return false
    }

    // Check if stack is getting too deep (potential infinite recursion)
    if (this.executionStack.length >= this.maxStackDepth) {
      console.error(`🌪️ InfiniteLoopDetector: STACK OVERFLOW DETECTED!`)
      console.error(`   Current stack: ${this.executionStack.slice(-10).join(' → ')}`)
      console.error(`   Blocking operation: ${operation}`)
      
      // Block the current operation that would overflow
      this.blockedOperations.add(operation)
      
      // Clear the stack
      this.executionStack = []
      
      return false
    }

    // Add to execution stack
    this.executionStack.push(operation)
    
    return true
  }

  exitOperation(operation: string): void {
    // Remove from execution stack when operation completes
    const lastOp = this.executionStack.pop()
    if (lastOp !== operation) {
      console.warn(`⚠️ InfiniteLoopDetector: Stack mismatch - expected "${operation}" but got "${lastOp}"`)
    }
  }

  unblockOperation(operation: string): void {
    console.log(`🔓 InfiniteLoopDetector: Manually unblocking "${operation}"`)
    this.blockedOperations.delete(operation)
  }

  reset(): void {
    console.log('🔄 InfiniteLoopDetector: Resetting all blocked operations')
    this.blockedOperations.clear()
    this.executionStack = []
  }

  getStatus(): { 
    blockedOperations: string[]
    currentStack: string[]
    stackDepth: number
  } {
    return {
      blockedOperations: Array.from(this.blockedOperations),
      currentStack: [...this.executionStack],
      stackDepth: this.executionStack.length
    }
  }
}

const infiniteLoopDetector = InfiniteLoopDetector.getInstance()

/**
 * Sets the current component for signal tracking.
 * @internal
 */
function setCurrentComponent(component: ComponentRenderer | null): void {
  currentComponent = component
}

/**
 * Interface for objects that can receive signal updates.
 */
interface SignalSubscriber {
  update(): void
}

/**
 * Component renderer that manages automatic signal subscriptions.
 */
export class ComponentRenderer implements SignalSubscriber {
  private _renderFn: () => unknown
  private _dependencies: Set<Signal<unknown>> = new Set()
  private _onUpdate: () => void
  private _circuitBreaker: CircuitBreaker
  private _signalRegistry: _SignalRegistry

  constructor(
    renderFn: () => unknown,
    onUpdate: () => void,
    options: SignalOptions = {}
  ) {
    this._renderFn = renderFn
    this._onUpdate = onUpdate
    this._signalRegistry = new _SignalRegistry()
    this._circuitBreaker = new CircuitBreaker({
      maxExecutions: options.maxExecutions || 500,
      timeWindow: options.timeWindow || 1000,
      threshold: options.threshold || 15,
    })
    console.log(`🏗️ ComponentRenderer: Created new component renderer`)
  }

  /**
   * Executes the render function and tracks signal dependencies.
   */
  render(): unknown {
    console.log(
      `🎬 ComponentRenderer: Starting render, had ${this._dependencies.size} dependencies`
    )

    // Component renders are always allowed to preserve UI state during circuit breaker cooldown

    if (!this._circuitBreaker.shouldExecute()) {
      console.warn('Circuit breaker triggered for component renderer')
      return null
    }

    // Clear old dependencies
    this._dependencies.forEach(signal => {
      signal.unsubscribeComponent(this)
    })
    const oldDepsCount = this._dependencies.size
    this._dependencies.clear()
    console.log(
      `🧹 ComponentRenderer: Cleared ${oldDepsCount} old dependencies`
    )

    // Reset signal counter for new render cycle
    this._signalRegistry.resetCounter()

    // Set as current component for signal tracking
    const previousComponent = currentComponent
    setCurrentComponent(this)
    console.log(`📍 ComponentRenderer: Set as current component for tracking`)

    try {
      const result = this._renderFn()
      console.log(
        `✅ ComponentRenderer: Render completed, now has ${this._dependencies.size} dependencies`
      )
      return result
    } finally {
      // Restore previous component context
      setCurrentComponent(previousComponent)
      console.log(`📍 ComponentRenderer: Restored previous component context`)
    }
  }

  /**
   * Called when a dependency signal changes to trigger re-render.
   */
  update(): void {
    console.log(
      '🔄 ComponentRenderer: Signal dependency changed, triggering update callback'
    )
    try {
      this._onUpdate()
      console.log(
        '✅ ComponentRenderer: Update callback completed successfully'
      )
    } catch (error) {
      console.error('❌ ComponentRenderer: Update callback failed:', error)
    }
  }

  /**
   * Adds a signal dependency to this component.
   */
  addDependency(signal: Signal<unknown>): void {
    const signalName =
      (signal as unknown as { _name?: string })._name || 'unnamed'
    if (!this._dependencies.has(signal)) {
      this._dependencies.add(signal)
      signal.subscribeComponent(this)
      console.log(
        `➕ ComponentRenderer: Added dependency on signal ${signalName}, total dependencies: ${this._dependencies.size}`
      )
    } else {
      console.log(
        `⚪ ComponentRenderer: Already has dependency on signal ${signalName}`
      )
    }
  }

  /**
   * Generates a unique key for a signal based on call order.
   *
   * @param name Optional name for the signal
   * @returns Unique key for the signal
   */
  generateSignalKey(name?: string): string {
    return this._signalRegistry.generateKey(name)
  }

  /**
   * Gets or creates a signal with the given key.
   *
   * @param key Unique key for the signal
   * @param initialValue Initial value if creating a new signal
   * @param options Signal configuration options
   * @returns Existing or new signal
   */
  getOrCreateSignal<T>(
    key: string,
    initialValue: T,
    options?: SignalOptions
  ): Signal<T> {
    return this._signalRegistry.getOrCreateSignal(key, initialValue, options)
  }

  /**
   * Disposes of this component renderer and cleans up subscriptions.
   */
  dispose(): void {
    this._dependencies.forEach(signal => {
      signal.unsubscribeComponent(this)
    })
    this._dependencies.clear()
    this._signalRegistry.dispose()
    this._circuitBreaker.reset()
  }
}

/**
 * Batch update queue for performance optimization.
 *
 * IMPORTANT: All signal updates are batched to prevent unnecessary re-renders.
 * This is crucial for performance when multiple signals update simultaneously.
 *
 * @internal
 */
let batchUpdateQueue: Set<() => void> = new Set()
let isBatchingUpdates = false

/**
 * Configuration options for Signal creation.
 *
 * These options control circuit breaker behavior and are essential for preventing
 * infinite loops in reactive systems.
 */
interface SignalOptions {
  /** Maximum number of executions within timeWindow before circuit breaker triggers */
  maxExecutions?: number
  /** Time window in milliseconds for tracking executions */
  timeWindow?: number
  /** Threshold for circuit breaker activation */
  threshold?: number
  /** Custom name for debugging purposes */
  name?: string
}

/**
 * Circuit breaker implementation to prevent infinite loops and runaway effects.
 *
 * This is a critical safety mechanism that prevents the system from becoming
 * unresponsive due to infinite update loops - a common problem in reactive systems.
 *
 * Design rationale:
 * - Tracks execution frequency to detect potential infinite loops
 * - Provides automatic recovery with exponential backoff
 * - Maintains system stability under error conditions
 */
class CircuitBreaker {
  private executions: number[] = []
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private lastFailure: number = 0
  private cooldownPeriod: number = 1000 // 1 second

  /**
   * Creates a new circuit breaker with specified configuration.
   *
   * @param options Configuration for circuit breaker behavior
   * @param options.maxExecutions Maximum executions before triggering (default: 100)
   * @param options.timeWindow Time window for tracking executions (default: 1000ms)
   * @param options.threshold Failure threshold (default: 5)
   */
  constructor(
    private options: {
      maxExecutions: number
      timeWindow: number
      threshold: number
    }
  ) {}

  /**
   * Determines if an execution should proceed based on circuit breaker state.
   *
   * Only blocks on actual infinite loops (rapid successive executions), not normal operation.
   *
   * @returns true if execution should proceed, false if circuit breaker is open
   */
  shouldExecute(): boolean {
    const now = Date.now()
    this.cleanOldExecutions()

    if (this.state === 'OPEN') {
      if (now - this.lastFailure > this.cooldownPeriod) {
        this.state = 'HALF_OPEN'
        return true
      }
      return false
    }

    // Check for rapid successive executions (actual infinite loop)
    const rapidWindow = 50 // 50ms window
    const recentRapidExecutions = this.executions.filter(time => (now - time) < rapidWindow)
    
    if (recentRapidExecutions.length >= 15) {
      this.state = 'OPEN'
      this.lastFailure = now
      console.warn(
        `Circuit breaker opened - rapid infinite loop detected (${recentRapidExecutions.length} executions in ${rapidWindow}ms)`
      )
      return false
    }

    this.executions.push(now)
    return true
  }

  /**
   * Removes old executions outside the time window.
   *
   * This cleanup is essential for accurate frequency tracking and prevents
   * false positives from old execution history.
   *
   * @private
   */
  private cleanOldExecutions(): void {
    const now = Date.now()
    this.executions = this.executions.filter(
      time => now - time < this.options.timeWindow
    )
  }

  /**
   * Resets the circuit breaker to its initial state.
   *
   * Use this carefully - only when you're certain the cause of the circuit
   * breaker activation has been resolved.
   */
  reset(): void {
    this.executions = []
    this.state = 'CLOSED'
    this.lastFailure = 0
  }
}

/**
 * Core reactive primitive that holds a value and notifies subscribers of changes.
 *
 * This is the fundamental building block of our reactive system. It replaces
 * React's useState with automatic dependency tracking and built-in safety mechanisms.
 *
 * Key features:
 * - Automatic dependency tracking (no manual dependency arrays)
 * - Built-in circuit breaker prevents infinite loops
 * - Automatic cleanup prevents memory leaks
 * - Batch updates for performance
 *
 * @template T The type of value held by this signal
 */
export class Signal<T> {
  private _value: T
  private _revision: number = 0
  private _subscribers: Set<EffectRunner> = new Set()
  private _componentSubscribers: Set<SignalSubscriber> = new Set()
  private _circuitBreaker: CircuitBreaker
  private _name?: string

  /**
   * Creates a new Signal with an initial value.
   *
   * @param initialValue The initial value for this signal
   * @param options Configuration options for signal behavior
   */
  constructor(initialValue: T, options: SignalOptions = {}) {
    this._value = initialValue
    this._name = options.name
    this._circuitBreaker = new CircuitBreaker({
      maxExecutions: options.maxExecutions || 100,
      timeWindow: options.timeWindow || 1000,
      threshold: options.threshold || 5,
    })
  }

  /**
   * Gets the current value of the signal.
   *
   * IMPORTANT: This getter automatically registers the current effect as a
   * subscriber, enabling automatic dependency tracking. This is how we eliminate
   * the need for manual dependency arrays.
   *
   * @returns The current value
   */
  get value(): T {
    console.log(
      `📖 SIGNAL READ: ${this._name || 'unnamed'} = ${String(this._value)}, currentComponent: ${!!currentComponent}, currentEffect: ${!!currentEffect}`
    )

    // Automatic dependency tracking - register current effect as subscriber
    if (currentEffect) {
      this._subscribers.add(currentEffect)
      currentEffect.addDependency(this)
      console.log(
        `📝 SIGNAL: Registered effect subscriber for ${this._name || 'unnamed'}`
      )
    }

    // Automatic component dependency tracking
    if (currentComponent) {
      currentComponent.addDependency(this)
      console.log(
        `📝 SIGNAL: Registered component subscriber for ${this._name || 'unnamed'}`
      )
    }

    return this._value
  }

  /**
   * Sets a new value for the signal.
   *
   * This setter includes circuit breaker protection to prevent infinite loops.
   * All subscriber notifications are batched for performance.
   *
   * CRITICAL: The circuit breaker check is essential - never bypass it as it
   * prevents the system from becoming unresponsive due to infinite update loops.
   *
   * @param newValue The new value to set
   */
  set value(newValue: T) {
    console.log(
      `📝 SIGNAL WRITE: ${this._name || 'unnamed'} changing from ${String(this._value)} to ${String(newValue)}`
    )

    const operationName = `signal-write:${this._name || 'unnamed'}`
    
    // Infinite loop detection - prevents system-wide circular dependencies
    if (!infiniteLoopDetector.shouldExecute(operationName)) {
      console.warn(
        `🚨 InfiniteLoopDetector: Blocking signal write for ${this._name || 'unnamed'}`
      )
      return
    }

    try {
      // Individual circuit breaker protection - prevents infinite loops
      if (!this._circuitBreaker.shouldExecute()) {
        console.warn(
          `Circuit breaker triggered for signal ${this._name || 'unnamed'}`
        )
        return
      }

      // Only update if value actually changed
      if (this._value !== newValue) {
        const oldValue = this._value
        this._value = newValue
        this._revision++
        console.log(
          `✅ SIGNAL CHANGED: ${this._name || 'unnamed'} from ${String(oldValue)} to ${String(newValue)}, notifying ${this._subscribers.size} effects and ${this._componentSubscribers.size} components`
        )
        this._notifySubscribers()
      } else {
        console.log(
          `⚪ SIGNAL UNCHANGED: ${this._name || 'unnamed'} already ${String(newValue)}`
        )
      }
    } finally {
      // Always exit the operation to maintain stack integrity
      infiniteLoopDetector.exitOperation(operationName)
    }
  }

  /**
   * Gets the current revision number of this signal.
   *
   * Revision numbers are used for efficient change detection and cache invalidation.
   * This is more efficient than deep equality checks.
   *
   * @returns Current revision number
   */
  get revision(): number {
    return this._revision
  }

  /**
   * Notifies all subscribers of a value change.
   *
   * Uses batching to optimize performance when multiple signals update simultaneously.
   * This prevents unnecessary re-renders and effect executions.
   *
   * @private
   */
  private _notifySubscribers(): void {
    console.log(
      `🔔 SIGNAL NOTIFY: ${this._name || 'unnamed'} notifying ${this._subscribers.size} effects and ${this._componentSubscribers.size} components`
    )

    // Notify effect subscribers
    this._subscribers.forEach(effect => {
      console.log(
        `📤 SIGNAL: Queuing effect update for ${this._name || 'unnamed'}`
      )
      batchUpdateQueue.add(() => effect.run())
    })

    // Notify component subscribers
    this._componentSubscribers.forEach(component => {
      console.log(
        `📤 SIGNAL: Queuing component update for ${this._name || 'unnamed'}`
      )
      batchUpdateQueue.add(() => component.update())
    })

    console.log(
      `📦 SIGNAL: Queued ${batchUpdateQueue.size} total updates, isBatchingUpdates: ${isBatchingUpdates}`
    )

    if (!isBatchingUpdates) {
      this._flushBatchUpdates()
    }
  }

  /**
   * Flushes all batched updates.
   *
   * This ensures all pending updates are executed in a single batch,
   * preventing cascading re-renders.
   *
   * @private
   */
  private _flushBatchUpdates(): void {
    console.log(
      `🚀 SIGNAL FLUSH: Executing ${batchUpdateQueue.size} batched updates`
    )
    isBatchingUpdates = true

    try {
      let updateCount = 0
      batchUpdateQueue.forEach(update => {
        console.log(`🔄 SIGNAL: Executing batched update ${updateCount++}`)
        update()
      })
      batchUpdateQueue.clear()
      console.log(`✅ SIGNAL FLUSH: Completed ${updateCount} updates`)
    } finally {
      isBatchingUpdates = false
    }
  }

  /**
   * Subscribes an effect to this signal.
   *
   * This is typically called automatically during dependency tracking.
   * Manual subscription is rarely needed.
   *
   * @param effect The effect to subscribe
   * @returns Unsubscribe function
   */
  subscribe(effect: EffectRunner): () => void {
    this._subscribers.add(effect)

    return () => {
      this._subscribers.delete(effect)
    }
  }

  /**
   * Subscribes a component to this signal.
   *
   * @param component The component to subscribe
   * @returns Unsubscribe function
   */
  subscribeComponent(component: SignalSubscriber): () => void {
    this._componentSubscribers.add(component)

    return () => {
      this._componentSubscribers.delete(component)
    }
  }

  /**
   * Unsubscribes a component from this signal.
   *
   * @param component The component to unsubscribe
   */
  unsubscribeComponent(component: SignalSubscriber): void {
    this._componentSubscribers.delete(component)
  }

  /**
   * Disposes of this signal and cleans up all subscriptions.
   *
   * IMPORTANT: Always call this when a signal is no longer needed to prevent
   * memory leaks. This is automatically handled by the framework in most cases.
   */
  dispose(): void {
    this._subscribers.clear()
    this._circuitBreaker.reset()
  }
}

/**
 * A computed signal that automatically updates when its dependencies change.
 *
 * This replaces React's useMemo with automatic dependency tracking.
 * The compute function is only re-executed when its dependencies actually change.
 *
 * Key features:
 * - Automatic dependency tracking (no manual dependency arrays)
 * - Lazy evaluation - only computes when accessed
 * - Efficient caching with revision-based invalidation
 * - Built-in circuit breaker protection
 *
 * @template T The type of value computed by this signal
 */
export class ComputedSignal<T> {
  private _value: T | undefined
  private _computed: boolean = false
  private _dependencies: Set<Signal<unknown>> = new Set()
  private _dependencyRevisions: Map<Signal<unknown>, number> = new Map()
  private _circuitBreaker: CircuitBreaker
  private _name?: string

  /**
   * Creates a new computed signal.
   *
   * @param computeFn Function that computes the value
   * @param options Configuration options
   */
  constructor(
    private computeFn: () => T,
    options: SignalOptions = {}
  ) {
    this._name = options.name
    this._circuitBreaker = new CircuitBreaker({
      maxExecutions: options.maxExecutions || 100,
      timeWindow: options.timeWindow || 1000,
      threshold: options.threshold || 5,
    })
  }

  /**
   * Gets the computed value, recomputing if dependencies have changed.
   *
   * This implements lazy evaluation - the compute function is only called
   * when the value is actually accessed and dependencies have changed.
   *
   * @returns The computed value
   */
  get value(): T {
    if (!this._computed || this._shouldRecompute()) {
      this._recompute()
    }
    return this._value!
  }

  /**
   * Checks if recomputation is needed based on dependency changes.
   *
   * Uses revision numbers for efficient change detection instead of
   * deep equality checks.
   *
   * @returns true if recomputation is needed
   * @private
   */
  private _shouldRecompute(): boolean {
    return Array.from(this._dependencies).some(dep => {
      const lastRevision = this._dependencyRevisions.get(dep)
      return lastRevision !== dep.revision
    })
  }

  /**
   * Recomputes the value and updates dependency tracking.
   *
   * CRITICAL: This method temporarily sets the global currentEffect to track
   * dependencies. This is how automatic dependency tracking works.
   *
   * @private
   */
  private _recompute(): void {
    const operationName = `computed-recompute:${this._name || 'unnamed'}`
    
    // Infinite loop detection - prevents system-wide circular dependencies
    if (!infiniteLoopDetector.shouldExecute(operationName)) {
      console.warn(
        `🚨 InfiniteLoopDetector: Blocking computed recompute for ${this._name || 'unnamed'}`
      )
      return
    }

    try {
      if (!this._circuitBreaker.shouldExecute()) {
        console.warn(
          `Circuit breaker triggered for computed signal ${this._name || 'unnamed'}`
        )
        return
      }

      // Save current effect context
      const previousEffect = currentEffect

      // Create temporary effect for dependency tracking
      currentEffect = new EffectRunner(() => {
        this._value = this.computeFn()
      })

      try {
        // Clear old dependencies
        this._dependencies.clear()
        this._dependencyRevisions.clear()

        // Run computation and track dependencies
        currentEffect.run()

        // Store new dependencies and their revisions
        this._dependencies = new Set(currentEffect.dependencies)
        this._dependencies.forEach(dep => {
          this._dependencyRevisions.set(dep, dep.revision)
        })

        this._computed = true
      } finally {
        // Restore previous effect context
        currentEffect = previousEffect
      }
    } finally {
      // Always exit the operation to maintain stack integrity
      infiniteLoopDetector.exitOperation(operationName)
    }
  }

  /**
   * Gets the current revision number of this computed signal.
   *
   * @returns Current revision number
   */
  get revision(): number {
    // Ensure we have a computed value
    if (!this._computed) {
      this._recompute()
    }

    // Use the maximum revision of all dependencies
    let maxRevision = 0
    this._dependencies.forEach(dep => {
      maxRevision = Math.max(maxRevision, dep.revision)
    })

    return maxRevision
  }

  /**
   * Disposes of this computed signal and cleans up dependencies.
   */
  dispose(): void {
    this._dependencies.clear()
    this._dependencyRevisions.clear()
    this._circuitBreaker.reset()
    this._computed = false
  }
}

/**
 * Effect runner that executes side effects and tracks dependencies.
 *
 * This replaces React's useEffect with automatic dependency tracking.
 * Effects are automatically re-run when their dependencies change.
 *
 * Key features:
 * - Automatic dependency tracking
 * - Automatic cleanup of previous effects
 * - Built-in circuit breaker protection
 * - Proper disposal to prevent memory leaks
 */
export class EffectRunner {
  private _dependencies: Set<Signal<unknown>> = new Set()
  private _cleanup: (() => void) | null = null
  private _circuitBreaker: CircuitBreaker
  private _name?: string

  /**
   * Creates a new effect runner.
   *
   * @param effectFn The effect function to run
   * @param options Configuration options
   */
  constructor(
    private effectFn: () => void | (() => void),
    options: SignalOptions = {}
  ) {
    this._name = options.name
    this._circuitBreaker = new CircuitBreaker({
      maxExecutions: options.maxExecutions || 100,
      timeWindow: options.timeWindow || 1000,
      threshold: options.threshold || 5,
    })
  }

  /**
   * Gets the current dependencies of this effect.
   *
   * @returns Set of signal dependencies
   */
  get dependencies(): Set<Signal<unknown>> {
    return this._dependencies
  }

  /**
   * Adds a dependency to this effect.
   *
   * This is called automatically during dependency tracking.
   *
   * @param signal The signal to add as a dependency
   */
  addDependency(signal: Signal<unknown>): void {
    this._dependencies.add(signal)
  }

  /**
   * Runs the effect function with dependency tracking.
   *
   * CRITICAL: This method sets the global currentEffect to enable automatic
   * dependency tracking. It also handles cleanup of previous effect runs.
   */
  run(): void {
    // Global circuit breaker protection
    if (!this._circuitBreaker.shouldExecute()) {
      console.warn(
        `Circuit breaker triggered for effect ${this._name || 'unnamed'}`
      )
      return
    }

    // Clean up previous effect run
    if (this._cleanup) {
      this._cleanup()
      this._cleanup = null
    }

    // Save current effect context
    const previousEffect = currentEffect
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    currentEffect = this

    try {
      // Clear old dependencies
      this._dependencies.clear()

      // Run effect and capture cleanup function
      const cleanup = this.effectFn()
      if (typeof cleanup === 'function') {
        this._cleanup = cleanup
      }
    } finally {
      // Restore previous effect context
      currentEffect = previousEffect
    }
  }

  /**
   * Disposes of this effect runner and cleans up.
   *
   * IMPORTANT: Always call this when an effect is no longer needed to prevent
   * memory leaks and ensure proper cleanup.
   */
  dispose(): void {
    if (this._cleanup) {
      this._cleanup()
      this._cleanup = null
    }
    this._dependencies.clear()
    this._circuitBreaker.reset()
  }
}

/**
 * Component-level signal registry for maintaining signal identity across re-renders.
 * Each ComponentRenderer has its own signal registry to ensure signals persist.
 */
class _SignalRegistry {
  private _signals: Map<string, Signal<unknown>> = new Map()
  private _signalCounter: number = 0

  /**
   * Gets or creates a signal with the given key.
   *
   * @param key Unique key for the signal
   * @param initialValue Initial value if creating a new signal
   * @param options Signal configuration options
   * @returns Existing or new signal
   */
  getOrCreateSignal<T>(
    key: string,
    initialValue: T,
    options?: SignalOptions
  ): Signal<T> {
    if (this._signals.has(key)) {
      console.log(`🔄 SIGNAL REUSED: ${key} (existing signal)`)
      return this._signals.get(key) as Signal<T>
    }

    const signal = new Signal(initialValue, options)
    this._signals.set(key, signal)
    console.log(
      `🆕 SIGNAL CREATED: ${key} with initial value ${String(initialValue)}`
    )
    return signal
  }

  /**
   * Generates a unique key for a signal based on call order.
   *
   * @param name Optional name for the signal
   * @returns Unique key
   */
  generateKey(name?: string): string {
    const key = name || `signal_${this._signalCounter++}`
    return key
  }

  /**
   * Resets the signal counter for a new render cycle.
   */
  resetCounter(): void {
    this._signalCounter = 0
  }

  /**
   * Disposes all signals in the registry.
   */
  dispose(): void {
    this._signals.forEach(signal => signal.dispose())
    this._signals.clear()
    this._signalCounter = 0
  }
}

/**
 * Creates a new reactive signal with an initial value.
 *
 * This is the primary way to create reactive state in the framework.
 * It replaces React's useState with automatic dependency tracking.
 *
 * IMPORTANT: This function maintains signal identity across re-renders by using
 * a component-level registry. The same signal instance is returned on subsequent
 * calls with the same parameters.
 *
 * @template T The type of value held by the signal
 * @param initialValue The initial value for the signal
 * @param options Configuration options for the signal
 * @returns A Signal instance (existing or new)
 *
 * @example
 * ```typescript
 * const count = useSignal(0);
 * const doubled = useComputed(() => count.value * 2);
 *
 * // Later...
 * count.value = 5; // doubled automatically updates to 10
 * ```
 */
export function useSignal<T>(
  initialValue: T,
  options?: SignalOptions
): Signal<T> {
  // If we have a current component, use its signal registry
  if (currentComponent) {
    const key = currentComponent.generateSignalKey(options?.name)
    return currentComponent.getOrCreateSignal(key, initialValue, options)
  }

  // Fallback: create a new signal (for non-component usage)
  const signal = new Signal(initialValue, options)
  console.log(
    `🆕 SIGNAL CREATED: ${options?.name || 'unnamed'} with initial value ${String(initialValue)} (no component context)`
  )
  return signal
}

/**
 * Creates a computed signal that automatically updates when dependencies change.
 *
 * This replaces React's useMemo with automatic dependency tracking.
 * The compute function is only re-executed when its dependencies change.
 *
 * @template T The type of value computed by the signal
 * @param computeFn Function that computes the value
 * @param options Configuration options for the computed signal
 * @returns A new ComputedSignal instance
 *
 * @example
 * ```typescript
 * const firstName = useSignal('John');
 * const lastName = useSignal('Doe');
 * const fullName = useComputed(() => `${firstName.value} ${lastName.value}`);
 *
 * // fullName automatically updates when firstName or lastName changes
 * ```
 */
export function useComputed<T>(
  computeFn: () => T,
  options?: SignalOptions
): ComputedSignal<T> {
  return new ComputedSignal(computeFn, options)
}

/**
 * Creates an effect that runs when its dependencies change.
 *
 * This replaces React's useEffect with automatic dependency tracking.
 * No dependency array is needed - dependencies are tracked automatically.
 *
 * @param effectFn The effect function to run
 * @param deps Optional dependency array (for React-like compatibility, but not used)
 * @param options Configuration options for the effect
 * @returns Cleanup function to dispose of the effect
 *
 * @example
 * ```typescript
 * const name = useSignal('John');
 *
 * useEffect(() => {
 *   console.log(`Name changed to: ${name.value}`);
 *
 *   // Return cleanup function if needed
 *   return () => {
 *     console.log('Cleaning up effect');
 *   };
 * });
 * ```
 */
export function useEffect(
  effectFn: () => void | (() => void),
  _deps?: unknown[],
  options?: SignalOptions
): () => void {
  const effect = new EffectRunner(effectFn, options)
  effect.run()

  return () => effect.dispose()
}

/**
 * Batches multiple signal updates into a single update cycle.
 *
 * This is useful for performance optimization when you need to update
 * multiple signals and want to prevent intermediate re-renders.
 *
 * @param updateFn Function that performs the updates
 *
 * @example
 * ```typescript
 * const name = useSignal('John');
 * const age = useSignal(25);
 *
 * batch(() => {
 *   name.value = 'Jane';
 *   age.value = 30;
 * }); // Only one update cycle, not two
 * ```
 */
export function batch(updateFn: () => void): void {
  const wasBatching = isBatchingUpdates
  isBatchingUpdates = true

  try {
    updateFn()
  } finally {
    isBatchingUpdates = wasBatching

    // Flush updates if we're no longer batching
    if (!wasBatching) {
      batchUpdateQueue.forEach(update => update())
      batchUpdateQueue.clear()
    }
  }
}

/**
 * A specialized signal for measuring DOM element dimensions.
 *
 * This signal automatically measures element dimensions using a ResizeObserver
 * and provides a clean reactive interface for size-dependent calculations.
 */
export class MeasureSignal extends Signal<{ width: number; height: number }> {
  private _element: HTMLElement | null = null
  private _observer: ResizeObserver

  constructor(options: SignalOptions = {}) {
    super({ width: 0, height: 0 }, options)

    this._observer = new ResizeObserver(entries => {
      console.log('📏 MeasureSignal: ResizeObserver callback fired.');
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        console.log(`📏 MeasureSignal: Checking entry. New dimensions: ${width}x${height}. Current signal value: ${this.value.width}x${this.value.height}`);

        // Only update if the dimensions have actually changed from what we have stored.
        // This prevents the observer from causing an update loop on initial attachment.
        if (
          Math.abs(this.value.width - width) > 0.1 ||
          Math.abs(this.value.height - height) > 0.1
        ) {
          console.log(
            `📏 MeasureSignal: Observer detected SIGNIFICANT resize to ${width}x${height}. Updating signal.`
          )
          this.value = { width, height }
        } else {
          console.log(`📏 MeasureSignal: Resize detected but NOT significant. Ignoring.`);
        }
      }
    })
  }

  /**
   * Attaches measurement to an element. It performs an initial measurement
   * and then uses ResizeObserver for subsequent changes.
   *
   * @param element The element to measure
   */
  attachTo(element: HTMLElement | null): void {
    console.log(`📏 MeasureSignal: attachTo called for element:`, { 
      element: element?.tagName || 'null', 
      elementId: element?.id || 'no-id',
      current: this._element?.tagName || 'null',
      currentId: this._element?.id || 'no-id',
      isSameReference: this._element === element,
      isSameElement: this._element && element && this._element.isSameNode(element)
    });
    
    // If we're already observing this exact element, do nothing.
    // This is the critical check to prevent the infinite loop.
    // Use isSameNode to check if it's the same DOM element even if ref changed
    if (this._element === element || (this._element && element && this._element.isSameNode(element))) {
      console.log(`📏 MeasureSignal: Same element detected, skipping reattachment`);
      return
    }

    // If we were observing a different element, unobserve it first.
    if (this._element) {
      console.log(`📏 MeasureSignal: Detaching from previous element:`, {
        tag: this._element.tagName,
        id: this._element.id || 'no-id'
      });
      this._observer.unobserve(this._element)
    }

    this._element = element

    if (element) {
      console.log(`📏 MeasureSignal: Attaching observer to new element:`, {
        tag: element.tagName,
        id: element.id || 'no-id'
      });
      // The ResizeObserver will be called automatically when the element is
      // first rendered or when its size changes. This is asynchronous and
      // will not cause an infinite loop.
      this._observer.observe(element)
    }
  }

  /**
   * Gets the current width of the measured element.
   */
  get width(): number {
    return this.value.width
  }

  /**
   * Gets the current height of the measured element.
   */
  get height(): number {
    return this.value.height
  }

  /**
   * Checks if the given element is the same as the currently measured element.
   */
  isSameElement(element: HTMLElement | null): boolean {
    return this._element === element || (this._element && element && this._element.isSameNode(element))
  }

  /**
   * Detaches measurement from the current element.
   */
  private _detach(): void {
    if (this._element) {
      this._observer.unobserve(this._element)
    }
    this._element = null
  }

  /**
   * Disposes of the measure signal and cleans up observers.
   */
  dispose(): void {
    this._observer.disconnect()
    this._detach()
    super.dispose()
  }
}

/**
 * A specialized signal for managing focus state with automatic event handling.
 *
 * This signal automatically handles focus/blur events and provides a clean
 * reactive interface for focus state management.
 */
export class FocusSignal extends Signal<boolean> {
  private _element: HTMLElement | null = null
  private _focusHandler: ((e: FocusEvent) => void) | null = null
  private _blurHandler: ((e: FocusEvent) => void) | null = null
  private _contentCallback: (() => boolean) | null = null

  constructor(options: SignalOptions = {}) {
    super(false, options)
  }

  /**
   * Attaches focus/blur event handlers to an element.
   *
   * @param element The element to attach handlers to
   * @param contentCallback Optional callback to check if element has content
   */
  attachTo(element: HTMLElement | null, contentCallback?: () => boolean): void {
    console.log(`🧠 FocusSignal: attachTo called for element:`, element);
    if (this._element) {
      this._detach()
    }

    this._element = element
    this._contentCallback = contentCallback || null

    if (!element) return

    this._focusHandler = () => {
      console.log('🧠 FocusSignal: _focusHandler fired. Setting value to true.');
      this.value = true
    }

    this._blurHandler = () => {
      console.log('🧠 FocusSignal: _blurHandler fired.');
      if (this._contentCallback) {
        const hasContent = this._contentCallback()
        console.log(`🧠 FocusSignal: Content check returned ${hasContent}. Setting value to ${hasContent}.`);
        this.value = hasContent
      } else {
        console.log('🧠 FocusSignal: No content callback. Setting value to false.');
        this.value = false
      }
    }

    console.log('🧠 FocusSignal: Adding focus/blur event listeners.');
    element.addEventListener('focus', this._focusHandler)
    element.addEventListener('blur', this._blurHandler)
  }

  /**
   * Programmatically focus the attached element.
   */
  focus(): void {
    if (this._element) {
      this._element.focus()
    }
  }

  /**
   * Programmatically blur the attached element.
   */
  blur(): void {
    if (this._element) {
      this._element.blur()
    }
  }

  /**
   * Detaches event handlers from the current element.
   */
  private _detach(): void {
    if (this._element && this._focusHandler && this._blurHandler) {
      console.log('🧠 FocusSignal: Detaching and removing event listeners from:', this._element);
      this._element.removeEventListener('focus', this._focusHandler)
      this._element.removeEventListener('blur', this._blurHandler)
    }
    this._element = null
    this._focusHandler = null
    this._blurHandler = null
    this._contentCallback = null
  }

  /**
   * Disposes of the focus signal and cleans up event handlers.
   */
  dispose(): void {
    this._detach()
    super.dispose()
  }
}

/**
 * Creates a measure signal that automatically measures DOM element dimensions.
 *
 * @param options Signal configuration options
 * @returns A new MeasureSignal instance
 */
export function useMeasureSignal(options: SignalOptions = {}): MeasureSignal {
  return new MeasureSignal(options)
}

/**
 * Creates a focus signal that automatically manages focus state.
 *
 * @param options Signal configuration options
 * @returns A new FocusSignal instance
 */
export function useFocusSignal(options: SignalOptions = {}): FocusSignal {
  return new FocusSignal(options)
}

/**
 * Creates a reactive component that automatically re-renders when signals change.
 *
 * @param renderFn The component render function
 * @param onUpdate Callback when component needs to re-render
 * @returns ComponentRenderer instance
 */
export function createReactiveComponent(
  renderFn: () => unknown,
  onUpdate: () => void
): ComponentRenderer {
  return new ComponentRenderer(renderFn, onUpdate)
}

/**
 * Gets the current status of the infinite loop detector for debugging.
 *
 * @returns Object with detector status information
 */
export function getInfiniteLoopDetectorStatus(): {
  blockedOperations: string[]
  currentStack: string[]
  stackDepth: number
} {
  return infiniteLoopDetector.getStatus()
}

/**
 * Manually resets the infinite loop detector.
 * Use with caution - only when you're certain the cause of loops has been resolved.
 */
export function resetInfiniteLoopDetector(): void {
  console.log('🔄 Manually resetting infinite loop detector')
  infiniteLoopDetector.reset()
}

/**
 * @deprecated Use getInfiniteLoopDetectorStatus() instead
 */
export function getGlobalCircuitBreakerStatus(): {
  isTripped: boolean
  executionCount: number
} {
  const status = infiniteLoopDetector.getStatus()
  return {
    isTripped: status.blockedOperations.length > 0,
    executionCount: status.stackDepth
  }
}

/**
 * @deprecated Use resetInfiniteLoopDetector() instead
 */
export function resetGlobalCircuitBreaker(): void {
  console.log('🔄 Manually resetting infinite loop detector (deprecated)')
  infiniteLoopDetector.reset()
}

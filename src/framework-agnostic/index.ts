/**
 * @fileoverview Main entry point for the framework-agnostic system.
 *
 * This file explicitly exports the public API of the entire system, providing a
 * single, clear entry point for consumers. Each module is documented to explain
 * its purpose and location within the `/framework-agnostic` directory structure.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

// --- Core Reactive System ---
// Location: /core/reactive.ts
// Description: The fundamental building blocks of the reactive system, including
// Signals, Computed Signals, and Effects. These are the low-level primitives.
export {
  Signal,
  ComputedSignal,
  EffectRunner,
  FocusSignal,
  MeasureSignal,
  batch,
  useSignal as createRawSignal,
  useComputed as createRawComputed,
  useEffect as createRawEffect,
  useFocusSignal,
  useMeasureSignal,
  getInfiniteLoopDetectorStatus,
  resetInfiniteLoopDetector,
  getGlobalCircuitBreakerStatus,
  resetGlobalCircuitBreaker,
} from './core/reactive'

// --- Core Async Primitives ---
// Location: /core/async.ts
// Description: Core utilities for handling asynchronous operations, including
// the base AsyncSignal class and resource management.
export { AsyncSignal, ResourceManager, useAsyncSignal } from './core/async'
export type { AsyncState } from './core/async'

// --- Higher-Level Async Abstractions ---
// Location: /async/*.ts
// Description: Provides familiar, higher-level abstractions for data fetching
// and mutation, built on top of the core async primitives.
export { createResource } from './async/resource'
export { createQuery } from './async/query'
export { createMutation } from './async/mutation'

// --- State Management ---
// Location: /state/machine.ts
// Description: A state machine implementation for managing complex states.
export { createStateMachine } from './state/machine'
export type {
  StateMachine,
  MachineState,
  StateMachineConfig,
  StateNodeConfig,
} from './state/machine'

// --- Real-Time Connections ---
// Location: /realtime/connection.ts
// Description: A protocol-agnostic system for managing real-time data streams.
export { createLiveResource, WebSocketTransport } from './realtime/connection'
export type {
  Transport,
  LiveResource,
  ConnectionStatus,
} from './realtime/connection'

// --- Caching System ---
// Location: /cache/index.ts
// Description: A generic caching system with a swappable storage backend.
export { createCache, Cache, InMemoryStorage } from './cache'
export type { Storage, CacheEntry, CacheOptions } from './cache'

// --- Error Handling ---
// Location: /error/*.ts
// Description: Utilities for advanced error handling and recovery.
export { createErrorBoundary, ErrorBoundary } from './error/boundary'
export type { ErrorBoundaryState } from './error/boundary'
export { withRetry } from './error/recovery'
export type { RetryOptions } from './error/recovery'

// --- Memoization Utilities ---
// Location: /utils/memoization.ts
// Description: Functions for memoizing expensive computations to improve performance.
export {
  memoize,
  memoizeComponent,
  registry as memoizationRegistry,
} from './utils/memoization'
export type { MemoizationOptions } from './utils/memoization'

// --- Resource Lifecycle Management ---
// Location: /lifecycle/resources.ts
// Description: A manager for automatically cleaning up resources to prevent leaks.
export { createLifecycleManager, LifecycleManager } from './lifecycle/resources'
export type { Disposable } from './lifecycle/resources'

// --- Runtime: Element and Component Primitives ---
// Location: /runtime/*.ts
// Description: These modules define how components are created, rendered, and managed.
// They include component-aware hooks that should be used within components.
export { createElement, createRef, Fragment } from './runtime/element'
export {
  defineComponent,
  onMount,
  onUnmount,
  memo,
  useFocus,
} from './runtime/component'
export {
  getGlobalEventManager,
  ComponentEventManagerImpl,
  LifecycleManager as EventLifecycleManager, // Renamed to avoid conflict
  EventUtils,
} from './runtime/event-system'

// --- Type Definitions ---
// Location: /types/index.ts
// Description: Centralized, React-compatible type definitions for props,
// events, and HTML attributes to ensure a consistent API.
export * from './types'

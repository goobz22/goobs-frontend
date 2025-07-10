/**
 * @fileoverview Advanced error boundary for graceful error handling and recovery.
 *
 * This file implements an `ErrorBoundary` class that provides more robust error
 * handling than React's traditional error boundaries. It allows for more granular
 * control over error state and recovery attempts.
 *
 * Key Design Decisions:
 * - Error state is managed by a signal for automatic reactivity.
 * - `catchError` method allows wrapping function calls to trap errors.
 * - Includes a `retry` mechanism to re-run the failed operation.
 * - Decoupled from rendering, can be used in any part of the application.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { Signal, useSignal } from '../core/reactive'

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * An ErrorBoundary provides a mechanism to catch errors that occur in a
 * designated scope and to display a fallback UI.
 */
export class ErrorBoundary {
  private state: Signal<ErrorBoundaryState>
  private lastAction: (() => void) | null = null

  constructor() {
    this.state = useSignal<ErrorBoundaryState>({
      hasError: false,
      error: null,
    })
  }

  /**
   * The reactive state of the error boundary.
   */
  get value(): ErrorBoundaryState {
    return this.state.value
  }

  /**
   * Executes a function and catches any errors it throws.
   *
   * @param action The function to execute.
   */
  catchError(action: () => void): void {
    this.lastAction = action
    try {
      action()
    } catch (error) {
      this.state.value = {
        hasError: true,
        error: error as Error,
      }
    }
  }

  /**
   * Resets the error boundary to its non-errored state.
   */
  reset(): void {
    this.state.value = {
      hasError: false,
      error: null,
    }
    this.lastAction = null
  }

  /**
   * Attempts to re-run the last action that caused an error.
   */
  retry(): void {
    if (this.lastAction) {
      this.state.value = { hasError: false, error: null }
      this.catchError(this.lastAction)
    } else {
      console.warn('ErrorBoundary: No action to retry.')
    }
  }
}

/**
 * Factory function to create a new ErrorBoundary instance.
 *
 * @returns A new ErrorBoundary instance.
 */
export function createErrorBoundary(): ErrorBoundary {
  return new ErrorBoundary()
}

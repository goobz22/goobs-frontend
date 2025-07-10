/**
 * @fileoverview Automatic resource lifecycle management.
 *
 * This file provides a `LifecycleManager` to automatically track and clean up
 * resources like timers, event listeners, and connections, preventing memory leaks.
 *
 * Key Design Decisions:
 * - A central `LifecycleManager` tracks all disposable resources.
 * - `add` method registers resources and their cleanup functions.
 * - `dispose` method cleans up all registered resources at once.
 * - This abstracts away manual cleanup, a common source of bugs.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

type CleanupFunction = () => void

export interface Disposable {
  dispose: CleanupFunction
}

/**
 * Manages the lifecycle of disposable resources.
 */
export class LifecycleManager {
  private resources: Set<Disposable | CleanupFunction> = new Set()

  /**
   * Adds a disposable resource or a cleanup function to the manager.
   *
   * @param resource The resource to track. It can be an object with a `dispose`
   *   method or a simple cleanup function.
   * @returns A function to remove the resource from the manager.
   */
  add(resource: Disposable | CleanupFunction): () => void {
    this.resources.add(resource)
    return () => {
      this.resources.delete(resource)
    }
  }

  /**
   * Disposes all tracked resources.
   *
   * This calls the `dispose` method on all disposable objects and executes
   * all cleanup functions.
   */
  dispose(): void {
    for (const resource of this.resources) {
      try {
        if (typeof resource === 'function') {
          resource()
        } else {
          resource.dispose()
        }
      } catch (error) {
        console.error('Error during resource disposal:', error)
      }
    }
    this.resources.clear()
  }
}

/**
 * Factory function to create a new LifecycleManager instance.
 * @returns A new LifecycleManager instance.
 */
export function createLifecycleManager(): LifecycleManager {
  return new LifecycleManager()
}

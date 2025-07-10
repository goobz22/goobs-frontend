/**
 * @fileoverview Utilities for advanced error recovery, such as retry logic.
 *
 * This file provides functions to help with recovering from errors, particularly
 * in async operations.
 *
 * Key Design Decisions:
 * - `withRetry` is a higher-order function that encapsulates retry logic.
 * - Supports configurable retry attempts and exponential backoff for flexibility.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

export interface RetryOptions {
  /** The maximum number of retry attempts. */
  retries?: number
  /** The base delay for exponential backoff in milliseconds. */
  delay?: number
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Wraps an async function with automatic retry logic.
 *
 * @template T The return type of the async function.
 * @param fn The async function to wrap.
 * @param options Configuration for the retry behavior.
 * @returns A new function that will automatically retry on failure.
 *
 * @example
 * ```typescript
 * const fetchWithRetry = withRetry(
 *   () => fetch('/api/data'),
 *   { retries: 3, delay: 1000 }
 * );
 *
 * try {
 *   const response = await fetchWithRetry();
 * } catch (error) {
 *   console.error('Fetching failed after all retries:', error);
 * }
 * ```
 */
export function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): () => Promise<T> {
  const { retries = 3, delay = 1000 } = options

  return async () => {
    let lastError: Error | null = null
    for (let i = 0; i < retries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        if (i < retries - 1) {
          const backoffDelay = delay * Math.pow(2, i)
          await sleep(backoffDelay)
        }
      }
    }
    throw lastError
  }
}

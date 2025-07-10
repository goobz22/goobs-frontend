/**
 * @fileoverview SWR-like resource management with signal-based state
 *
 * This file implements a `createResource` function that provides stale-while-revalidate
 * caching strategies, automatic revalidation on focus, and interval-based polling.
 *
 * Key Design Decisions:
 * - Follows the SWR (stale-while-revalidate) pattern for a good user experience.
 * - Integrates with AsyncSignal to manage loading/error/success states.
 * - Provides hooks for window focus and interval-based revalidation.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { AsyncSignal, AsyncSignalOptions, useAsyncSignal } from '../core/async'
import { useEffect } from '../core/reactive'

/**
 * Creates a resource with SWR-like behavior.
 *
 * This function creates an async resource that automatically handles
 * stale-while-revalidate patterns, background revalidation, and
 * focus-based revalidation.
 *
 * @template T The type of data returned by the resource
 * @param fetcher Function that returns a promise
 * @param options Configuration options
 * @returns AsyncSignal with SWR behavior
 *
 * @example
 * ```typescript
 * const userResource = createResource(
 *   () => fetch('/api/user').then(r => r.json()),
 *   {
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     revalidateInterval: 30 * 1000 // 30 seconds
 *   }
 * );
 * ```
 */
export function createResource<T>(
  fetcher: () => Promise<T>,
  options: AsyncSignalOptions = {}
): AsyncSignal<T> {
  const signal = useAsyncSignal(fetcher, {
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes
    retryOnMount: options.retryOnMount !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus !== false,
    ...options,
  })

  // Initial fetch
  useEffect(() => {
    if (signal.value.status === 'idle') {
      signal.execute()
    }
  })

  // Background revalidation
  if (options.revalidateInterval) {
    useEffect(() => {
      const interval = setInterval(() => {
        if (signal.isStale()) {
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
        if (signal.isStale()) {
          signal.execute()
        }
      }

      window.addEventListener('focus', handleFocus)
      return () => window.removeEventListener('focus', handleFocus)
    })
  }

  return signal
}

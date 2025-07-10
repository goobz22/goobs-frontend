/**
 * @fileoverview Data fetching with signal-based state management
 *
 * This file implements a `createQuery` function that provides a declarative
 * API for data fetching, built on top of `createResource`.
 *
 * Key Design Decisions:
 * - Provides a familiar `createQuery` API for data fetching.
 * - Leverages the power of `createResource` for caching and revalidation.
 * - Clearly separates queries (reads) from mutations (writes).
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { AsyncSignal, AsyncSignalOptions } from '../core/async'
import { createResource } from './resource'

/**
 * Creates a query for data fetching with SWR-like behavior.
 *
 * This is a convenience wrapper around `createResource` to provide a more
 * explicit API for data fetching operations.
 *
 * @template T The type of data returned by the query
 * @param queryFn Function that returns a promise
 * @param options Configuration options
 * @returns AsyncSignal with SWR behavior
 *
 * @example
 * ```typescript
 * const userQuery = createQuery(
 *   () => fetch('/api/user').then(r => r.json()),
 *   { staleTime: 10000 }
 * );
 * ```
 */
export function createQuery<T>(
  queryFn: () => Promise<T>,
  options: AsyncSignalOptions = {}
): AsyncSignal<T> {
  return createResource(queryFn, options)
}

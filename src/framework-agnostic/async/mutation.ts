/**
 * @fileoverview Mutation management for async write operations
 *
 * This file implements a `createMutation` function to handle async write
 * operations (e.g., POST, PUT, DELETE) and manage their state.
 *
 * Key Design Decisions:
 * - Provides a clear and explicit API for mutations.
 * - Manages loading and error states for the mutation operation.
 * - Offers `onSuccess`, `onError`, and `onSettled` callbacks for side effects.
 *
 * @author Framework-Agnostic Team
 * @version 1.0.0
 */

import { AsyncSignal, useAsyncSignal } from '../core/async'

/**
 * Creates a mutation signal for async write operations.
 *
 * @template TData The type of data returned by the mutation.
 * @template TVariables The type of variables passed to the mutation function.
 * @param mutationFn The function that performs the mutation.
 * @param options Callbacks for `onSuccess`, `onError`, and `onSettled`.
 * @returns An object with the `mutate` function and the reactive `state`.
 *
 * @example
 * ```typescript
 * const updateUser = createMutation(
 *   (userData: { id: number; name: string }) =>
 *     fetch(`/api/users/${userData.id}`, {
 *       method: 'PUT',
 *       body: JSON.stringify(userData),
 *     }).then(r => r.json()),
 *   {
 *     onSuccess: (data) => console.log('User updated:', data),
 *     onError: (error) => console.error('Update failed:', error),
 *   }
 * );
 *
 * // In a component:
 * // updateUser.mutate({ id: 1, name: 'New Name' });
 * ```
 */
export function createMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: Error, variables: TVariables) => void
    onSettled?: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables
    ) => void
  } = {}
): {
  mutate: (variables: TVariables) => Promise<TData>
  state: AsyncSignal<TData>
} {
  const signal = useAsyncSignal<TData>(() => new Promise(() => {}))

  const mutate = async (variables: TVariables): Promise<TData> => {
    const mutationExecution = useAsyncSignal(() => mutationFn(variables))

    // Subscribe to the execution state to update the main signal
    mutationExecution.subscribe(execState => {
      signal.value = execState
    })

    try {
      const result = await mutationExecution.execute()
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

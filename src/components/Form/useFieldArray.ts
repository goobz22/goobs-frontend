'use client'

/**
 * =============================================================================
 * useFieldArray — ergonomic binding for a `z.array(z.object())` form field
 * =============================================================================
 *
 * The escape hatch for a DYNAMIC list of sub-objects (add / remove / reorder)
 * stored on the form engine at an array path. Each item's child fields bind via
 * dotted paths (`items.0.label`) using a goobs field's `name` or `useFormField`
 * — the engine already reads/writes nested paths via lodash get/set, so the
 * whole array lives in the validated form state (no parallel React state).
 *
 *   function FeaturesEditor() {
 *     const { items, append, remove, itemName } = useFieldArray<FeatureInput>('features')
 *     return (
 *       <>
 *         {items.map((_, i) => (
 *           <TextField key={i} name={`${itemName(i)}.label`} label="Feature" />
 *         ))}
 *         <Button text="Add" onClick={() => append({ label: '' })} />
 *       </>
 *     )
 *   }
 *
 * Mutators read the CURRENT engine value (not a closed-over snapshot) so they
 * never operate on a stale array.
 */

import { useCallback } from 'react'
import { useFormContext } from './context'

export interface FieldArrayBinding<T> {
  /** The current array (empty when unset / not an array). */
  items: T[]
  /** Append an item to the end. */
  append: (item: T) => void
  /** Remove the item at `index`. */
  remove: (index: number) => void
  /** Replace the item at `index`. */
  update: (index: number, item: T) => void
  /** Move an item from one index to another (reorder). No-op on out-of-range. */
  move: (from: number, to: number) => void
  /**
   * The dotted field-name prefix for item `index` (e.g. `"features.0"`). Compose
   * a child field's `name` as `` `${itemName(i)}.<key>` ``.
   */
  itemName: (index: number) => string
}

export function useFieldArray<T = unknown>(name: string): FieldArrayBinding<T> {
  const { engine } = useFormContext()

  const current = engine.getValue(name)
  const items = (Array.isArray(current) ? current : []) as T[]

  const readArray = useCallback(
    (): T[] => {
      const value = engine.getValue(name)
      return (Array.isArray(value) ? value : []) as T[]
    },
    [engine, name]
  )

  const append = useCallback(
    (item: T): void => engine.setValue(name, [...readArray(), item]),
    [engine, name, readArray]
  )

  const remove = useCallback(
    (index: number): void =>
      engine.setValue(
        name,
        readArray().filter((_, i) => i !== index)
      ),
    [engine, name, readArray]
  )

  const update = useCallback(
    (index: number, item: T): void =>
      engine.setValue(
        name,
        readArray().map((existing, i) => (i === index ? item : existing))
      ),
    [engine, name, readArray]
  )

  const move = useCallback(
    (from: number, to: number): void => {
      const next = readArray()
      if (from < 0 || from >= next.length || to < 0 || to >= next.length) return
      const [moved] = next.splice(from, 1)
      if (moved === undefined) return
      next.splice(to, 0, moved)
      engine.setValue(name, next)
    },
    [engine, name, readArray]
  )

  const itemName = useCallback(
    (index: number): string => `${name}.${index}`,
    [name]
  )

  return { items, append, remove, update, move, itemName }
}

'use client'

/**
 * =============================================================================
 * useFieldValues — ergonomic binding for a `z.record(...)` form field
 * =============================================================================
 *
 * The Record analogue of {@link useFieldArray}: the escape hatch for a DYNAMIC
 * field-SET — a map of runtime-keyed values stored on the form engine at a single
 * object path (e.g. `fieldValues`). Each entry's child field binds via a dotted
 * path (`fieldValues.summary`) using a goobs field's `name` or `useFormField` —
 * the engine reads/writes nested paths via lodash get/set, so the whole map lives
 * in the validated form state (no parallel React state).
 *
 *   function ArticleFields({ template }: { template: FieldConfig[] }) {
 *     const { fieldName } = useFieldValues<string>('fieldValues')
 *     return (
 *       <>
 *         {template.map(f => (
 *           <TextField key={f.fieldId} name={fieldName(f.fieldId)} label={f.label} />
 *         ))}
 *       </>
 *     )
 *   }
 *
 * Use the imperative `setValue`/`removeKey`/`setAll` for keys not driven by a
 * bound field (programmatic updates). Mutators read the CURRENT engine value (not
 * a closed-over snapshot) so they never operate on a stale record.
 *
 * NOTE: keys are composed into the dotted path verbatim, so a key containing `.`
 * would be read by the engine as a nested path. Field-set keys are slugs/ids
 * (`summary`, `content`) in practice; if a key can contain `.`, bind it via the
 * imperative `setValue(key, …)` (which sets the whole record) rather than a dotted
 * field `name`.
 */

import { useCallback } from 'react'
import { useFormContext } from './context'

export interface FieldValuesBinding<V> {
  /** The current record (empty object when unset / not a plain object). */
  values: Record<string, V>
  /** The current keys of the record. */
  keys: string[]
  /** Read a single entry (undefined when absent). */
  getValue: (key: string) => V | undefined
  /** Set a single entry (merges into the existing record). */
  setValue: (key: string, value: V) => void
  /** Remove a single entry. */
  removeKey: (key: string) => void
  /** Replace the whole record. */
  setAll: (record: Record<string, V>) => void
  /**
   * The dotted field-name for entry `key` (e.g. `"fieldValues.summary"`).
   * Compose a child field's `name` as `fieldName(key)`.
   */
  fieldName: (key: string) => string
}

function asRecord<V>(value: unknown): Record<string, V> {
  return (
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Record<string, V>)
      : {}
  )
}

export function useFieldValues<V = unknown>(
  name: string
): FieldValuesBinding<V> {
  const { engine } = useFormContext()

  const values = asRecord<V>(engine.getValue(name))

  const readRecord = useCallback(
    (): Record<string, V> => asRecord<V>(engine.getValue(name)),
    [engine, name]
  )

  const getValue = useCallback(
    (key: string): V | undefined => readRecord()[key],
    [readRecord]
  )

  const setValue = useCallback(
    (key: string, value: V): void =>
      engine.setValue(name, { ...readRecord(), [key]: value }),
    [engine, name, readRecord]
  )

  const removeKey = useCallback(
    (key: string): void => {
      const next = { ...readRecord() }
      delete next[key]
      engine.setValue(name, next)
    },
    [engine, name, readRecord]
  )

  const setAll = useCallback(
    (record: Record<string, V>): void => engine.setValue(name, { ...record }),
    [engine, name]
  )

  const fieldName = useCallback(
    (key: string): string => `${name}.${key}`,
    [name]
  )

  return {
    values,
    keys: Object.keys(values),
    getValue,
    setValue,
    removeKey,
    setAll,
    fieldName,
  }
}

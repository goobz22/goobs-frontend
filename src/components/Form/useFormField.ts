'use client'

/**
 * =============================================================================
 * useFormField — imperative field binding for custom field UIs
 * =============================================================================
 *
 * The escape hatch for callers who render their OWN input (not a goobs field)
 * but still want it wired to the form engine. Returns the value, change/blur
 * handlers, current error, and derived `required` for a single field by name.
 *
 *   function MyCustomColorPicker() {
 *     const { value, onChange, onBlur, error, required } = useFormField('accent')
 *     return <ColorWheel value={value} onChange={onChange} onBlur={onBlur} />
 *   }
 *
 * goobs fields don't need this — they auto-bind via FieldShell's
 * `useFieldBinding`. This is for bespoke field UIs that aren't goobs fields.
 */

import { useCallback } from 'react'
import { useFormContext } from './context'
import { deriveRequiredFromSchema } from './schema'

export interface FormFieldBinding {
  /** The field name (echoed back for convenience). */
  name: string
  /** Current value at the field path. */
  value: unknown
  /** Write a new value (re-validates the form). */
  onChange: (value: unknown) => void
  /** Mark the field touched (call on blur). */
  onBlur: () => void
  /** Current error message, or `undefined` when valid / untouched. */
  error: string | undefined
  /** Whether the schema marks this field required. */
  required: boolean
}

export function useFormField(name: string): FormFieldBinding {
  const { engine, schema } = useFormContext()

  const onChange = useCallback(
    (value: unknown): void => {
      engine.setValue(name, value)
    },
    [engine, name]
  )

  const onBlur = useCallback((): void => {
    engine.setTouched(name, true)
  }, [engine, name])

  return {
    name,
    value: engine.getValue(name),
    onChange,
    onBlur,
    error: engine.getError(name),
    required: deriveRequiredFromSchema(schema, name),
  }
}

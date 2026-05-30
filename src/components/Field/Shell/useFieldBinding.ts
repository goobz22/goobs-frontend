'use client'

/**
 * =============================================================================
 * useFieldBinding — auto-bind a goobs field to the form engine, by name
 * =============================================================================
 *
 * The seam that lets a goobs field component (TextField, Dropdown, DateField,
 * …) bind to the surrounding `<Form>` engine WITHOUT the caller wiring
 * value/onChange per field — they just pass `name`.
 *
 *   <Form schema={S} initialValues={d} onSubmit={save}>
 *     <TextField name="contractName" label="Contract Name" />   // auto-bound
 *   </Form>
 *
 * BACK-COMPAT IS NON-NEGOTIABLE. ~159 existing callsites pass an explicit
 * `value` (and usually `onChange`). For ALL of those, this hook returns
 * `{ value, onChange, onBlur }` UNCHANGED — it only takes over when a field is
 * inside a `<Form>`, has a `name`, AND the caller did NOT pass an explicit
 * `value`. Outside a form, or with an explicit value, the field behaves exactly
 * as it does today.
 *
 * Binding is gated on `Boolean(ctx && name && value === undefined)`.
 */

import { useCallback } from 'react'
import { useOptionalFormContext } from '../../Form/context'

/**
 * Adapter for fields whose UI value type `T` differs from the value stored in
 * the form engine (e.g. a DateField surfaces `Date | null` but the schema /
 * store may keep an ISO string). `valueFromStore` maps store→UI on read;
 * `payloadToStore` maps UI→store on change.
 */
export interface FieldBindingAdapter<T> {
  valueFromStore: (stored: unknown) => T
  payloadToStore: (payload: T) => unknown
}

export interface UseFieldBindingArgs<T> {
  /** The field name. When absent, the field is never auto-bound. */
  name?: string | undefined
  /**
   * The caller's explicit value. When defined, the field is controlled by the
   * caller and this hook is a pass-through (back-compat path).
   */
  value?: T | undefined
  /** The caller's explicit onChange (preserved and chained after binding). */
  onChange?: ((next: T) => void) | undefined
  /** The caller's explicit onBlur (preserved and chained after binding). */
  onBlur?: (() => void) | undefined
  /** Optional store⇄UI value adapter. */
  adapter?: FieldBindingAdapter<T> | undefined
}

export interface UseFieldBindingResult<T> {
  value?: T | undefined
  onChange?: ((next: T) => void) | undefined
  onBlur?: (() => void) | undefined
}

export function useFieldBinding<T>({
  name,
  value,
  onChange: originalOnChange,
  onBlur: originalOnBlur,
  adapter,
}: UseFieldBindingArgs<T>): UseFieldBindingResult<T> {
  const ctx = useOptionalFormContext()

  // Bind ONLY when inside a form, a name is present, and the caller did not
  // supply an explicit value. Anything else is the untouched back-compat path.
  const shouldBind = Boolean(ctx && name && value === undefined)

  const boundOnChange = useCallback(
    (next: T): void => {
      if (!ctx || !name) return
      ctx.engine.setValue(name, adapter ? adapter.payloadToStore(next) : next)
      originalOnChange?.(next)
    },
    [ctx, name, adapter, originalOnChange]
  )

  const boundOnBlur = useCallback((): void => {
    if (!ctx || !name) return
    ctx.engine.setTouched(name, true)
    originalOnBlur?.()
  }, [ctx, name, originalOnBlur])

  if (!shouldBind || !ctx || !name) {
    // Back-compat: return everything the caller passed, untouched.
    return { value, onChange: originalOnChange, onBlur: originalOnBlur }
  }

  const storedValue = ctx.engine.getValue(name)
  const boundValue = (
    adapter ? adapter.valueFromStore(storedValue) : storedValue
  ) as T

  return {
    value: boundValue,
    onChange: boundOnChange,
    onBlur: boundOnBlur,
  }
}

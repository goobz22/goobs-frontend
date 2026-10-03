'use client'

/**
 * =============================================================================
 * useZodFormEngine — the goobs-owned, zod-native controlled form engine
 * =============================================================================
 *
 * Implements the `FormEngine` seam (see `Form/context.ts`) on top of plain
 * React state + a zod schema. NO third-party form library — values, touched,
 * errors and the submitting flag are ordinary `useState`, and validation is a
 * single `schema.safeParse` whose issues are flattened into a
 * `Record<dottedPath, message>`.
 *
 * Nested paths (`address.line1`, `items.0.qty`) are read/written through
 * lodash `get`/`set` against a `cloneDeep` of the values — state is never
 * mutated in place, so React sees a fresh reference on every change.
 *
 * Diagnostics: `handleSubmit` emits `form.submit.attempt` (with the field
 * snapshot) once validation passes, and `form.validation.passed` after a
 * successful `onSubmit`. Per-field `form.validation.failed` beacons are emitted
 * by `<FieldShell>`, which already owns that edge-trigger.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import set from 'lodash/set'
import { emitDiag } from '../../../utils/diag'
import type { FormEngine } from '../context'

/** Structural view of the zod schema surface the engine uses. */
interface ZodSchemaLike<TValues> {
  safeParse: (value: unknown) => ZodSafeParseResult<TValues>
  shape?: Record<string, unknown>
}

type ZodSafeParseResult<TValues> =
  | { success: true; data: TValues }
  | {
      success: false
      error: {
        issues?: ReadonlyArray<{
          path: ReadonlyArray<PropertyKey>
          message: string
        }>
      }
    }

export interface UseZodFormEngineArgs<TValues extends Record<string, unknown>> {
  /** The zod object schema the form validates against. */
  schema: ZodSchemaLike<TValues>
  /** Initial field values. */
  initialValues: TValues
  /** Called with validated values once submission passes validation. */
  onSubmit: (values: TValues) => void | Promise<void>
  /** Stable form id used for diagnostics (`formId`). */
  formId?: string
}

/**
 * Flatten a zod `safeParse` failure into `{ 'a.b.c': 'first message' }`. Only
 * the first message per path is kept (the one a single-line field error shows).
 */
function flattenIssues(
  result: ZodSafeParseResult<unknown>
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (result.success) return errors
  const issues = result.error?.issues
  if (!issues) return errors
  for (const issue of issues) {
    const path = issue.path.map(segment => String(segment)).join('.')
    // First message per path wins — later issues for the same path are ignored.
    if (errors[path] === undefined) {
      errors[path] = issue.message
    }
  }
  return errors
}

/** Collect the top-level schema keys so submit can mark every field touched. */
function schemaKeys(schema: ZodSchemaLike<unknown>): string[] {
  const shape = schema.shape
  if (shape && typeof shape === 'object') return Object.keys(shape)
  return []
}

export function useZodFormEngine<TValues extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
  formId,
}: UseZodFormEngineArgs<TValues>): FormEngine<TValues> {
  const [values, setValues] = useState<TValues>(() => cloneDeep(initialValues))
  // A mutation must observe earlier writes in the same event, before React
  // renders again. Rendered values remain immutable snapshots of this store.
  const currentValues = useRef(values)
  const [touched, setTouchedState] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  // EXTERNAL (server-side) per-field errors, injected via setExternalErrors.
  // Kept separate from the zod `errors` so a re-validate doesn't wipe them and
  // so they surface regardless of touched state.
  const [externalErrors, setExternalErrorsState] = useState<
    Record<string, string>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitInFlight = useRef(false)

  /** Validate a candidate value set and return the flattened error map. */
  const validate = useCallback(
    (candidate: TValues): Record<string, string> => {
      const result = schema.safeParse(candidate)
      if (result.success) return {}
      return flattenIssues(result)
    },
    [schema]
  )

  const getValue = useCallback(
    (name: string): unknown => get(currentValues.current, name),
    []
  )

  const setValue = useCallback(
    (name: string, value: unknown): void => {
      const next = cloneDeep(currentValues.current)
      set(next as Record<string, unknown>, name, cloneDeep(value))
      const nextErrors = validate(next)
      currentValues.current = next
      setValues(next)
      // Keep validation outside a React state updater (which may be replayed).
      setErrors(nextErrors)
      // Editing a field invalidates any stale server verdict for it.
      setExternalErrorsState(previous => {
        if (previous[name] === undefined) return previous
        const next = { ...previous }
        delete next[name]
        return next
      })
    },
    [validate]
  )

  const getError = useCallback(
    (name: string): string | undefined => {
      // An external (server) error takes precedence and shows regardless of
      // touched state — the server has already judged the submitted value.
      const external = externalErrors[name]
      if (external !== undefined) return external
      return touched[name] ? errors[name] : undefined
    },
    [touched, errors, externalErrors]
  )

  const setExternalErrors = useCallback(
    (next: Record<string, string>): void => {
      setExternalErrorsState(next)
    },
    []
  )

  const getTouched = useCallback(
    (name: string): boolean => Boolean(touched[name]),
    [touched]
  )

  const setTouched = useCallback((name: string, isTouched: boolean): void => {
    setTouchedState(previous => ({ ...previous, [name]: isTouched }))
  }, [])

  const handleSubmit = useCallback(
    (event?: React.FormEvent): void => {
      event?.preventDefault()
      if (submitInFlight.current) return

      const parsed = schema.safeParse(currentValues.current)
      const validationErrors = flattenIssues(parsed)
      setErrors(validationErrors)

      // Mark every schema field touched so errors surface on submit even for
      // fields the user never focused.
      const keys = [...schemaKeys(schema), ...Object.keys(validationErrors)]
      setTouchedState(previous => {
        const next = { ...previous }
        for (const key of keys) next[key] = true
        return next
      })

      if (!parsed.success) return
      // State alone cannot guard two submits before the next React commit.
      submitInFlight.current = true
      setIsSubmitting(true)

      emitDiag({
        type: 'form.submit.attempt',
        formId: formId ?? '',
        fields: parsed.data,
      })

      // Run onSubmit (sync or async) and always clear the submitting flag.
      void Promise.resolve()
        .then(() => onSubmit(parsed.data))
        .then(() => {
          emitDiag({ type: 'form.validation.passed', formId: formId ?? '' })
        })
        .finally(() => {
          submitInFlight.current = false
          setIsSubmitting(false)
        })
    },
    [schema, formId, onSubmit]
  )

  return useMemo<FormEngine<TValues>>(
    () => ({
      getValue,
      setValue,
      getError,
      getTouched,
      setTouched,
      isSubmitting,
      handleSubmit,
      values,
      setExternalErrors,
    }),
    [
      getValue,
      setValue,
      getError,
      getTouched,
      setTouched,
      isSubmitting,
      handleSubmit,
      values,
      setExternalErrors,
    ]
  )
}

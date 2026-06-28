/**
 * =============================================================================
 * FORM CONTEXT — JSX-free engine seam
 * =============================================================================
 *
 * This module is deliberately JSX-free so it can be imported by leaf field
 * components (notably `<FieldShell>` via `useFieldBinding`) WITHOUT creating an
 * import cycle through `Form/index.tsx`. FieldShell reaches up to the optional
 * form context to auto-bind its value/error/required; the JSX provider that
 * publishes this context lives in `Form/index.tsx`.
 *
 * The `FormEngine` is the 9-method seam the controlled form engine exposes.
 * Any engine implementation (the zod-native one in `engine/zod.ts`, or a
 * future one) only has to satisfy this structural contract — the rest of the
 * form surface (Form, AutoFields, useFormField, useFieldBinding, FieldShell
 * auto-binding) is engine-agnostic and talks only to these methods.
 */

import React from 'react'

/**
 * The controlled form engine seam. Get/set value, get error, get/set touched,
 * submitting flag, submit handler, and inject external (server) errors. Field
 * components and the binding hooks talk only to this interface; the concrete
 * engine implementation (zod-native) lives behind it.
 */
export interface FormEngine<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Read the current value at a (possibly dotted) field path. */
  getValue: (name: string) => unknown
  /** Write a value at a (possibly dotted) field path and re-validate. */
  setValue: (name: string, value: unknown) => void
  /**
   * Current error message for a field, or `undefined` when the field is
   * either valid or has not been touched yet. Untouched-field errors are
   * suppressed so a pristine form doesn't show red on first paint.
   */
  getError: (name: string) => string | undefined
  /** Whether the field has been blurred / interacted with. */
  getTouched: (name: string) => boolean
  /** Mark a field touched (typically on blur). */
  setTouched: (name: string, touched: boolean) => void
  /** True while an async `onSubmit` is in flight. */
  isSubmitting: boolean
  /**
   * Submit handler wired to the `<form onSubmit>`. Prevents the native submit,
   * marks every field touched, validates, and — when valid — awaits the
   * caller's `onSubmit`.
   */
  handleSubmit: (event?: React.FormEvent) => void
  /** The current form values (read-only snapshot). */
  values: TValues
  /**
   * Inject EXTERNAL (server-side) per-field errors keyed by field `name`, e.g.
   * the `fieldErrors` map a backend returns for a validation failure. They are
   * surfaced by `getError` regardless of touched state (the server has already
   * judged the value) and are cleared for a field on its next `setValue` (the
   * user is editing it, so the stale server verdict no longer applies). Passing
   * `{}` clears all external errors. Client-side zod validation is unaffected.
   */
  setExternalErrors: (errors: Record<string, string>) => void
}

/**
 * The value published on `FormContext`. Carries the live engine plus the
 * schema (so FieldShell can derive `required` from it) and the optional
 * form identity used for diagnostics and test selectors.
 */
export interface FormContextValue {
  engine: FormEngine
  /**
   * The zod schema the form validates against. Typed `unknown` here to keep
   * this module zod-agnostic; consumers narrow it via the helpers in
   * `Form/schema.ts`.
   */
  schema: unknown
  /** Stable form id — emitted as `data-form` and used as the diag `formId`. */
  formId?: string
  /** Human/entity subject (e.g. `"contract"`) — emitted as `data-subject`. */
  subject?: string
}

/**
 * The form context. `null` when a field is rendered outside any `<Form>` —
 * which is the back-compat path the ~159 existing explicit-prop callsites take.
 */
export const FormContext = React.createContext<FormContextValue | null>(null)

/**
 * Read the form context, throwing if used outside a `<Form>`. Use this from
 * components that ONLY make sense inside a form (AutoFields, useFormField).
 */
export function useFormContext(): FormContextValue {
  const ctx = React.useContext(FormContext)
  if (!ctx) {
    throw new Error(
      'useFormContext must be used inside <Form>. ' +
        'Wrap the consuming component in <Form>...</Form>.'
    )
  }
  return ctx
}

/**
 * Read the form context without throwing. Returns `null` outside a `<Form>`.
 * Use this from components that work BOTH inside and outside a form — notably
 * `<FieldShell>`, which must stay byte-for-byte identical to its legacy
 * behaviour when no form is present.
 */
export function useOptionalFormContext(): FormContextValue | null {
  return React.useContext(FormContext)
}

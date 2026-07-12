'use client'

/**
 * =============================================================================
 * FORM — goobs-owned, zod-native, controlled form engine
 * =============================================================================
 *
 * `<Form schema initialValues onSubmit>` is the root. It instantiates the
 * zod-native engine (`useZodFormEngine`) and publishes it on `FormContext`, so
 * any goobs field rendered inside auto-binds its value / error / required by
 * `name` — WITHOUT the caller wiring `value`/`onChange` per field.
 *
 *   <Form schema={ContractSchema} initialValues={draft} onSubmit={save} subject="contract">
 *     <TextField name="contractName" label="Contract Name" />
 *     <DateField name="startDate" label="Start Date" />
 *     <CustomButton type="submit" text="Save" />
 *   </Form>
 *
 * Fields stay hand-placed by default (the caller controls layout). For
 * scaffolding / quick forms, `<Form.AutoFields />` walks the schema and emits
 * one goobs field per key — an escape hatch, not the default.
 *
 * NO third-party form library: zod v4 + lodash + React state only. The engine
 * lives behind the 8-method `FormEngine` seam (`./context`), so the JSX here
 * never reaches into validation internals.
 *
 * Compound-component assembly mirrors `<Card>`: the inner function component is
 * reassigned `as unknown as FormComponent` with the static `AutoFields`
 * attached, exactly like `Card.Header` etc.
 */

import React, {
  useCallback,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { z } from 'zod'
import { FormContext, type FormContextValue, type FormEngine } from './context'
import { useZodFormEngine } from './engine/zod'
import AutoFields from './AutoFields'
import cssStyles from './Form.module.css'

/**
 * Structural view of a zod `safeParse` failure — mirrors the engine's own
 * defensive shape so the submit-status summary doesn't hard-couple to zod's
 * TS surface.
 */
interface SafeParseLike {
  success: boolean
  error?: {
    issues?: ReadonlyArray<{ path: ReadonlyArray<PropertyKey> }>
  }
}

export interface FormProps<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * The zod object schema the form validates against. Drives validation,
   * per-field `required` derivation, and (for `<Form.AutoFields>`) the set of
   * fields to render.
   */
  schema: z.ZodType<TValues>
  /** Initial field values. */
  initialValues: TValues
  /** Called with validated values once the form passes validation on submit. */
  onSubmit: (values: TValues) => void | Promise<void>
  /**
   * Entity/human subject (e.g. `"contract"`). Emitted as `data-subject` and
   * used as the form's `aria-label` when no explicit label is provided.
   */
  subject?: string
  /** Stable form id — emitted as `data-form` and used as the diag `formId`. */
  id?: string
  /** Form body — hand-placed goobs fields, or `<Form.AutoFields />`. */
  children: ReactNode
  className?: string
  style?: CSSProperties
}

interface FormComponent {
  <TValues extends Record<string, unknown> = Record<string, unknown>>(
    props: FormProps<TValues>
  ): ReactElement | null
  displayName?: string
  AutoFields: typeof AutoFields
}

/**
 * Root of the goobs zod-native, controlled form engine: validates against a zod
 * schema and publishes a context so any child goobs field auto-binds its value,
 * error, and required state by `name`. Exposes a static `Form.AutoFields` that
 * renders one field per schema key.
 */
function FormInner<TValues extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
  subject,
  id,
  children,
  className,
  style,
}: FormProps<TValues>): ReactElement | null {
  // The zod schema's runtime surface (safeParse, .shape) satisfies the engine's
  // structural contract; the compile-time generic is `z.ZodType<TValues>`.
  const engine = useZodFormEngine<TValues>({
    schema: schema as unknown as Parameters<
      typeof useZodFormEngine<TValues>
    >[0]['schema'],
    initialValues,
    onSubmit,
    ...(id !== undefined && { formId: id }),
  })

  const contextValue: FormContextValue = {
    engine: engine as unknown as FormEngine,
    schema,
    ...(id !== undefined && { formId: id }),
    ...(subject !== undefined && { subject }),
  }

  // Form-level submit-status announcement (WCAG 4.1.3 Status Messages). When a
  // submit is blocked by validation, the per-field errors surface WITHOUT moving
  // focus, so a screen-reader user gets no feedback that the submit failed. This
  // wrapper re-parses the current values (the same verdict the engine reaches)
  // and pushes a concise summary into the role="alert" live region below, then
  // delegates to the engine's real submit handler. It never changes the engine's
  // behaviour — it only adds the announcement.
  const [submitStatus, setSubmitStatus] = useState('')

  const handleFormSubmit = useCallback(
    (event: FormEvent): void => {
      const parsed = schema.safeParse(engine.values) as unknown as SafeParseLike
      if (parsed.success) {
        setSubmitStatus('')
      } else {
        const invalidPaths = new Set(
          (parsed.error?.issues ?? []).map(issue =>
            issue.path.map(segment => String(segment)).join('.')
          )
        )
        const count = invalidPaths.size
        const message =
          count === 1
            ? '1 field needs attention. Review the highlighted field below.'
            : `${count} fields need attention. Review the highlighted fields below.`
        // Re-announce on EVERY blocked submit, even when the summary text is
        // unchanged. An assertive live region only fires on a DOM text mutation,
        // so re-submitting a still-invalid form with the SAME field count would
        // set an identical string — React commits no change and the screen
        // reader stays silent (a user who submits the same invalid form twice
        // hears the summary only once). Force a real mutation by synchronously
        // flushing the region to empty first, then setting the message, so each
        // blocked submit produces a fresh announcement. (WCAG 4.1.3 — the status
        // must be conveyed each time it occurs.)
        flushSync(() => setSubmitStatus(''))
        setSubmitStatus(message)
      }
      engine.handleSubmit(event)
    },
    [schema, engine]
  )

  // A native `<form>` is exposed as a `form` LANDMARK only when it has an
  // accessible name; emitting an explicit `role="form"` with no name creates a
  // NAMELESS landmark, which ARIA discourages (landmark noise with nothing to
  // announce). So expose the form landmark — `role="form"` + `aria-label` — ONLY
  // when we actually have a name (`subject`, else `id`); otherwise render a
  // plain, non-landmark `<form>`. Named forms (the common case) are unchanged.
  const accessibleName = subject ?? id

  return (
    <form
      data-component="Form"
      {...(id !== undefined && { 'data-form': id })}
      {...(subject !== undefined && { 'data-subject': subject })}
      {...(accessibleName !== undefined && {
        role: 'form',
        'aria-label': accessibleName,
      })}
      onSubmit={handleFormSubmit}
      {...(className !== undefined && { className })}
      {...(style !== undefined && { style })}
    >
      <FormContext.Provider value={contextValue}>
        {children}
      </FormContext.Provider>
      {/* Live region: announces the form-level validation summary on a blocked
          submit. Empty (silent) until a submit fails; cleared on a valid submit.
          Visually hidden — the visible per-field errors are the sighted
          equivalent. */}
      <div
        className={cssStyles.visuallyHidden}
        role="alert"
        data-form-status=""
      >
        {submitStatus}
      </div>
    </form>
  )
}

// Mirror Card's compound-component assembly: reassign the inner function with
// the static subcomponent attached. The cast is required because attaching a
// static property to a generic function component isn't expressible inline.
const Form = FormInner as unknown as FormComponent
Form.AutoFields = AutoFields
Form.displayName = 'Form'

export default Form
export {
  useFormContext,
  useOptionalFormContext,
  type FormEngine,
  type FormContextValue,
} from './context'
export { useFormField } from './useFormField'
export { useFieldArray, type FieldArrayBinding } from './useFieldArray'
export { useFieldValues, type FieldValuesBinding } from './useFieldValues'
export type { AutoFieldsProps } from './AutoFields'

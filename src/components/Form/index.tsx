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
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { z } from 'zod'
import { FormContext, type FormContextValue, type FormEngine } from './context'
import { useZodFormEngine } from './engine/zod'
import AutoFields from './AutoFields'

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

  return (
    <form
      data-component="Form"
      {...(id !== undefined && { 'data-form': id })}
      {...(subject !== undefined && { 'data-subject': subject })}
      role="form"
      aria-label={subject ?? id}
      onSubmit={engine.handleSubmit}
      {...(className !== undefined && { className })}
      {...(style !== undefined && { style })}
    >
      <FormContext.Provider value={contextValue}>
        {children}
      </FormContext.Provider>
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
export type { AutoFieldsProps } from './AutoFields'

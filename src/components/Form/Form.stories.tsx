/**
 * @fileoverview Storybook stories for the zod-native Form component.
 * These stories showcase the Form across the three goobs themes plus its
 * hand-placed vs. AutoFields authoring styles, demonstrating its usage with
 * React and JSX.
 *
 * NOTE on theming: `<Form>` itself does NOT take a `styles`/`theme` prop — it is
 * a controlled form engine (`schema` + `initialValues` + `onSubmit` + children).
 * Theme is expressed by the goobs fields/buttons rendered inside it, so each
 * themed story themes its child components and sets `parameters.backgrounds`
 * to match (light bg for light, dark bg for dark + sacred), like the Button
 * exemplar.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent, waitFor } from 'storybook/test'
import { z } from 'zod'
import Form from './index'
import Button from '../Button'
import { useFormContext } from './context'
import { useFormField } from './useFormField'
import { useFieldArray } from './useFieldArray'
import { useFieldValues } from './useFieldValues'
import TextField from '../Field/Text'

// --------------------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------------------

type Theme = 'light' | 'dark' | 'sacred'

const ContactSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  company: z.string().optional(),
  subscribe: z.boolean(),
})

type ContactValues = z.infer<typeof ContactSchema>

const initialContact: ContactValues = {
  fullName: '',
  email: '',
  company: '',
  subscribe: false,
}

/**
 * Stateful wrapper: `<Form>` is controlled and requires `schema` /
 * `initialValues` / `onSubmit` / children, so every story drives it through
 * this harness. `theme` is forwarded to the child goobs components (the Form
 * itself is theme-agnostic).
 */
const ThemedContactForm: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [submitted, setSubmitted] = useState<ContactValues | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Form
        schema={ContactSchema}
        initialValues={initialContact}
        subject="contact"
        id="contact-form"
        onSubmit={values => setSubmitted(values)}
      >
        <Form.AutoFields theme={theme} />
        <Button
          type="submit"
          action="submit"
          subject="contact"
          text="Submit"
          styles={{ theme }}
        />
      </Form>
      {submitted && (
        <pre
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}

/**
 * Harness button (inside <Form>) that injects EXTERNAL server-side field errors
 * via the engine — simulating a backend validation response (the `fieldErrors`
 * map). Reads the engine from form context.
 */
const InjectServerErrorButton: React.FC<{ theme: Theme }> = ({ theme }) => {
  const { engine } = useFormContext()
  return (
    <Button
      type="button"
      action="apply"
      text="Simulate server error"
      onClick={() =>
        engine.setExternalErrors({
          fullName: 'That name is already taken',
          email: 'This email is already registered',
        })
      }
      styles={{ theme }}
    />
  )
}

/** A form whose only control injects external (server) errors on click. */
const ServerErrorForm: React.FC<{ theme: Theme }> = ({ theme }) => (
  <Form
    schema={ContactSchema}
    initialValues={initialContact}
    subject="contact"
    id="contact-server-error"
    onSubmit={() => undefined}
  >
    <Form.AutoFields only={['fullName', 'email']} theme={theme} />
    <InjectServerErrorButton theme={theme} />
  </Form>
)

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '2rem', minWidth: '20rem' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Form>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * A contact form with light theme styling on its fields and submit button.
 */
export const LightTheme: Story = {
  render: () => <ThemedContactForm theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A contact form with dark theme styling on its fields and submit button.
 */
export const DarkTheme: Story = {
  render: () => <ThemedContactForm theme="dark" />,
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * A contact form with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  render: () => <ThemedContactForm theme="sacred" />,
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// AUTHORING-STYLE STORIES
// --------------------------------------------------------------------------

/**
 * The schema-driven escape hatch: `<Form.AutoFields>` walks the zod schema and
 * emits one goobs field per key, with no per-field wiring by the caller.
 */
export const AutoFieldsScaffold: Story = {
  name: 'Authoring/AutoFields',
  render: () => (
    <Form
      schema={ContactSchema}
      initialValues={initialContact}
      subject="contact"
      onSubmit={() => undefined}
    >
      <Form.AutoFields theme="light" />
      <Button
        type="submit"
        action="submit"
        text="Save"
        styles={{ theme: 'light' }}
      />
    </Form>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// EXTERNAL SERVER ERRORS (regression for engine.setExternalErrors)
// --------------------------------------------------------------------------

/**
 * Regression test for `engine.setExternalErrors` (the 9th FormEngine method):
 * server-side per-field errors injected via the engine surface on the matching
 * fields REGARDLESS of touched state, and clear for a field on its next edit.
 *
 * Click "Simulate server error" → both `fullName` and `email` show their server
 * message even though they were never focused; typing into a field clears its
 * message. This is the goobs-side of the unified error story — the inline
 * counterpart to ThothOS's `<FormError>` banner (server `fieldErrors` mapped
 * onto the actual fields by `name`).
 */
export const ExternalServerErrors: Story = {
  name: 'External server errors (setExternalErrors)',
  render: () => <ServerErrorForm theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// FIELD ARRAY (regression for useFieldArray)
// --------------------------------------------------------------------------

const ChecklistSchema = z.object({
  title: z.string().min(1),
  tasks: z.array(z.object({ label: z.string().min(1) })).min(1),
})
type ChecklistValues = z.infer<typeof ChecklistSchema>
const initialChecklist: ChecklistValues = { title: '', tasks: [{ label: '' }] }

/** One array-item field, bound by its dotted path (e.g. `tasks.0.label`). */
const TaskLabelField: React.FC<{ name: string }> = ({ name }) => {
  const { value, onChange, onBlur, error } = useFormField(name)
  return (
    <TextField
      name={name}
      label="Task"
      value={typeof value === 'string' ? value : ''}
      onChange={next => onChange(next)}
      onBlur={onBlur}
      error={error}
      styles={{ theme: 'light' }}
    />
  )
}

/** Dynamic list of sub-objects driven entirely by useFieldArray. */
const TasksEditor: React.FC = () => {
  const { items, append, remove, itemName } =
    useFieldArray<{ label: string }>('tasks')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((_, index) => (
        <div
          key={index}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}
        >
          <TaskLabelField name={`${itemName(index)}.label`} />
          <Button
            type="button"
            action="delete"
            text="Remove"
            onClick={() => remove(index)}
            styles={{ theme: 'light' }}
          />
        </div>
      ))}
      <Button
        type="button"
        action="create"
        text="Add task"
        onClick={() => append({ label: '' })}
        styles={{ theme: 'light' }}
      />
    </div>
  )
}

const ChecklistForm: React.FC = () => {
  const [submitted, setSubmitted] = useState<ChecklistValues | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Form
        schema={ChecklistSchema}
        initialValues={initialChecklist}
        subject="checklist"
        id="checklist-form"
        onSubmit={values => setSubmitted(values)}
      >
        <Form.AutoFields only={['title']} theme="light" />
        <TasksEditor />
        <Button type="submit" action="submit" text="Save" styles={{ theme: 'light' }} />
      </Form>
      {submitted && (
        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}

/**
 * Regression for `useFieldArray`: a dynamic list of sub-objects (add/remove)
 * stored on the engine at `tasks`, each item field bound by its dotted path
 * (`tasks.N.label`). Add appends an item, Remove deletes one, and the whole
 * array validates as `z.array(z.object()).min(1)` — no parallel React state.
 */
export const FieldArray: Story = {
  name: 'Field array (useFieldArray)',
  render: () => <ChecklistForm />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DYNAMIC FIELD-SET (regression for useFieldValues)
// --------------------------------------------------------------------------

/** A runtime-determined template: keys + labels come from data, not the schema. */
const ARTICLE_TEMPLATE = [
  { fieldId: 'summary', label: 'Summary' },
  { fieldId: 'resolution', label: 'Resolution' },
]

const ArticleSchema = z.object({
  title: z.string().min(1),
  // The dynamic field-set: a map of runtime-keyed string values.
  fieldValues: z.record(z.string(), z.string()),
})
type ArticleValues = z.infer<typeof ArticleSchema>
const initialArticle: ArticleValues = {
  title: '',
  fieldValues: { summary: '', resolution: '' },
}

/** One dynamic field, bound by its dotted path via useFieldValues.fieldName. */
const DynamicField: React.FC<{ name: string; label: string }> = ({
  name,
  label,
}) => {
  const { value, onChange, onBlur, error } = useFormField(name)
  return (
    <TextField
      name={name}
      label={label}
      value={typeof value === 'string' ? value : ''}
      onChange={next => onChange(next)}
      onBlur={onBlur}
      error={error}
      styles={{ theme: 'light' }}
    />
  )
}

/** The template fields, each composed onto the `fieldValues` record path. */
const DynamicFieldSet: React.FC = () => {
  const { fieldName } = useFieldValues<string>('fieldValues')
  return (
    <>
      {ARTICLE_TEMPLATE.map(f => (
        <DynamicField key={f.fieldId} name={fieldName(f.fieldId)} label={f.label} />
      ))}
    </>
  )
}

const ArticleForm: React.FC = () => {
  const [submitted, setSubmitted] = useState<ArticleValues | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Form
        schema={ArticleSchema}
        initialValues={initialArticle}
        subject="article"
        id="article-form"
        onSubmit={values => setSubmitted(values)}
      >
        <Form.AutoFields only={['title']} theme="light" />
        <DynamicFieldSet />
        <Button type="submit" action="submit" text="Save" styles={{ theme: 'light' }} />
      </Form>
      {submitted && (
        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}

/**
 * Regression for `useFieldValues`: a DYNAMIC field-set (`fieldValues`) whose keys
 * come from a runtime template, each item bound by its dotted path
 * (`fieldValues.summary`) and validated as `z.record(z.string(), z.string())` —
 * no parallel React state. The Record analogue of the FieldArray story.
 */
export const DynamicFieldValues: Story = {
  name: 'Dynamic field-set (useFieldValues)',
  render: () => <ArticleForm />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// SUBMIT STATUS ANNOUNCEMENT (regression for the role="alert" live region)
// --------------------------------------------------------------------------

/**
 * Regression for the form-level submit-status announcement (WCAG 4.1.3 Status
 * Messages). Submitting the pristine (empty) contact form blocks on validation
 * — the per-field errors appear WITHOUT moving focus, so a screen-reader user
 * would otherwise get no feedback that the submit failed. The visually-hidden
 * `role="alert"` region announces a concise field-count summary ("2 fields need
 * attention…"), the audible counterpart to the visible per-field errors.
 *
 * The play scopes to the specific `[data-form-status]` node rather than
 * `getByRole('alert')`: a blocked empty submit ALSO renders a FieldShell
 * `role="alert"` error region for each required field (fullName + email), so
 * `getByRole('alert')` would match three elements and throw. It then re-submits
 * to prove the summary re-announces even with an unchanged field count (the
 * live region must produce a fresh DOM mutation each time — the flushSync
 * clear-then-set — or a repeat submit is silent to assistive tech).
 */
export const SubmitStatusAnnouncement: Story = {
  name: 'Submit status announcement (role=alert)',
  render: () => <ThemedContactForm theme="light" />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The form-level live region is the specific [data-form-status] node — NOT
    // getByRole('alert'), which on a blocked empty submit also matches each
    // field's FieldShell error region and would throw on "multiple elements".
    const statusRegion = canvasElement.querySelector<HTMLElement>(
      '[data-form-status]'
    )
    if (!statusRegion) throw new Error('form-level status region is missing')

    // Submit the empty form → validation blocks it (fullName + email required).
    const submit = canvas.getByRole('button', { name: /submit/i })
    await userEvent.click(submit)
    // The form-level region announces the count of fields needing attention.
    await waitFor(() =>
      expect(statusRegion).toHaveTextContent(/fields need attention/i)
    )

    // Re-announce on a REPEATED still-invalid submit with the SAME field count.
    // An assertive live region only fires on a DOM mutation, so re-setting the
    // identical summary string must STILL mutate the region's text. Observe the
    // region across the second submit and assert it mutated (regression for the
    // flushSync clear-then-set; without it React commits no change on an
    // identical value and a screen-reader user hears the summary only once).
    let mutationCount = 0
    const observer = new MutationObserver(() => {
      mutationCount += 1
    })
    observer.observe(statusRegion, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    await userEvent.click(submit)
    await waitFor(() => expect(mutationCount).toBeGreaterThan(0))
    observer.disconnect()

    // The summary is still present after the re-announcement.
    expect(statusRegion).toHaveTextContent(/fields need attention/i)
  },
}

/**
 * Regression for focus-first-invalid on a validation-blocked submit (WCAG 3.3.1
 * Error Identification / 2.4.3 Focus Order). Submitting the pristine (empty)
 * contact form blocks on validation — `fullName` and `email` are both required,
 * so the FIRST invalid field is `fullName`. Beyond announcing the summary, the
 * Form moves keyboard focus onto that first invalid control so a keyboard/AT user
 * is placed ON the problem instead of left on the submit button. The play submits
 * the empty form and asserts focus lands on the `fullName` input (queried by its
 * stable `data-field-name`, not label text). A regression that drops the
 * requestAnimationFrame focus move fails here.
 */
export const FocusFirstInvalidOnSubmit: Story = {
  name: 'Focus first invalid on submit (WCAG 3.3.1/2.4.3)',
  render: () => <ThemedContactForm theme="light" />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Submit the empty form → validation blocks it (fullName + email required),
    // so fullName is the first invalid field in DOM order.
    const submit = canvas.getByRole('button', { name: /submit/i })
    await userEvent.click(submit)

    // The first invalid field's control receives focus (queried by the stable
    // data-field-name so the assertion survives label-text changes). The move is
    // deferred to the next frame (aria-invalid appears only after the engine's
    // touch-all re-render), so poll for it.
    const fullNameInput = canvasElement.querySelector<HTMLInputElement>(
      '[data-field-name="fullName"] input'
    )
    if (!fullNameInput) throw new Error('fullName input is missing')
    await waitFor(() => expect(fullNameInput).toHaveFocus())
  },
}

/**
 * Regression for the form landmark's accessible name (ARIA landmark hygiene). A
 * native `<form>` is exposed as a `form` LANDMARK only when it has an accessible
 * name; emitting an explicit `role="form"` with no name creates a nameless
 * landmark (ARIA discourages this — landmark noise with nothing to announce). So
 * the Form exposes `role="form"` + `aria-label` ONLY when a `subject` (else
 * `id`) is present, and renders a plain, non-landmark `<form>` otherwise. This
 * story renders one named and one unnamed Form and asserts both cases.
 */
export const FormLandmarkNaming: Story = {
  name: 'Form landmark naming (role=form only when named)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Form
        schema={ContactSchema}
        initialValues={initialContact}
        subject="contact"
        onSubmit={() => undefined}
      >
        <Form.AutoFields only={['fullName']} theme="light" />
      </Form>
      <Form
        schema={ContactSchema}
        initialValues={initialContact}
        onSubmit={() => undefined}
      >
        <Form.AutoFields only={['fullName']} theme="light" />
      </Form>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const namedForm = canvasElement.querySelector<HTMLElement>(
      'form[data-subject="contact"]'
    )
    const unnamedForm = canvasElement.querySelector<HTMLElement>(
      'form[data-component="Form"]:not([data-subject]):not([data-form])'
    )
    if (!namedForm || !unnamedForm) {
      throw new Error('expected a named and an unnamed Form to render')
    }
    // Named form (subject="contact") → a named `form` landmark.
    expect(namedForm).toHaveAttribute('role', 'form')
    expect(namedForm).toHaveAttribute('aria-label', 'contact')
    // Unnamed form (no subject/id) → NOT a landmark: neither an explicit
    // role="form" nor a dangling nameless aria-label.
    expect(unnamedForm).not.toHaveAttribute('role')
    expect(unnamedForm).not.toHaveAttribute('aria-label')
  },
}

/**
 * Rendering only a subset of the schema's fields via `only`, demonstrating that
 * the caller controls which keys the form surfaces.
 */
export const PartialFields: Story = {
  name: 'Authoring/Partial (only)',
  render: () => (
    <Form
      schema={ContactSchema}
      initialValues={initialContact}
      subject="contact"
      onSubmit={() => undefined}
    >
      <Form.AutoFields only={['fullName', 'email']} theme="light" />
      <Button
        type="submit"
        action="submit"
        text="Save"
        styles={{ theme: 'light' }}
      />
    </Form>
  ),
  globals: { backgrounds: { value: 'light' } },
}

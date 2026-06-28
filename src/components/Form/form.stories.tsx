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
import type { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import Form from './index'
import Button from '../Button'
import { useFormContext } from './context'
import { useFormField } from './useFormField'
import { useFieldArray } from './useFieldArray'
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
        <Form.AutoFields />
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
    <Form.AutoFields only={['fullName', 'email']} />
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
  tags: ['autodocs'],
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
  name: 'Light Theme',
  render: () => <ThemedContactForm theme="light" />,
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/**
 * A contact form with dark theme styling on its fields and submit button.
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => <ThemedContactForm theme="dark" />,
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * A contact form with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: () => <ThemedContactForm theme="sacred" />,
  parameters: {
    backgrounds: { default: 'dark' },
  },
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
      <Form.AutoFields />
      <Button
        type="submit"
        action="submit"
        text="Save"
        styles={{ theme: 'light' }}
      />
    </Form>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
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
  parameters: {
    backgrounds: { default: 'light' },
  },
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
        <Form.AutoFields only={['title']} />
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
  parameters: {
    backgrounds: { default: 'light' },
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
      <Form.AutoFields only={['fullName', 'email']} />
      <Button
        type="submit"
        action="submit"
        text="Save"
        styles={{ theme: 'light' }}
      />
    </Form>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

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
      <Button type="submit" action="submit" text="Save" styles={{ theme: 'light' }} />
    </Form>
  ),
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
      <Button type="submit" action="submit" text="Save" styles={{ theme: 'light' }} />
    </Form>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

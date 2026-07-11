/**
 * @fileoverview Storybook stories for SignatureField — the canvas signature pad.
 * Covers the standalone controlled component (value/onChange) and the in-<Form>
 * auto-bound path across the goobs themes.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { z } from 'zod'
import SignatureField from './index'
import Form from '../../Form'
import Button from '../../Button'

const meta: Meta<typeof SignatureField> = {
  title: 'Components/Field/Signature',
  component: SignatureField,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={{ padding: '2rem', width: '32rem', maxWidth: '90vw' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SignatureField>

/** Controlled standalone use: value/onChange, draw then read back the data-URL. */
const ControlledSignature: React.FC<{ theme: 'light' | 'dark' | 'sacred' }> = ({
  theme,
}) => {
  const [value, setValue] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <SignatureField
        label="Signature"
        value={value}
        onChange={setValue}
        helperText="Draw above with a mouse, pen, or finger."
        styles={{ theme }}
      />
      <div
        style={{
          fontSize: '0.75rem',
          color: theme === 'light' ? '#333' : '#ccc',
        }}
      >
        {value ? `Captured ${value.length} chars of PNG data-URL` : 'Empty'}
      </div>
    </div>
  )
}

export const LightTheme: Story = {
  render: () => <ControlledSignature theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => <ControlledSignature theme="dark" />,
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => <ControlledSignature theme="sacred" />,
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// IN-FORM (auto-bound by name; required schema rejects an unsigned field)
// --------------------------------------------------------------------------

const SignOffSchema = z.object({
  signerName: z.string().trim().min(1),
  signatureImage: z.string().min(1, 'Signature is required'),
})
type SignOffValues = z.infer<typeof SignOffSchema>
const initialSignOff: SignOffValues = { signerName: '', signatureImage: '' }

const SignOffForm: React.FC = () => {
  const [submitted, setSubmitted] = useState<SignOffValues | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Form
        schema={SignOffSchema}
        initialValues={initialSignOff}
        subject="signoff"
        id="signoff-form"
        onSubmit={values => setSubmitted(values)}
      >
        {/* theme="light" threads the surrounding surface's theme into the
            auto-emitted TextField — without it, FieldShell defaults to sacred
            (gold label #ffdf33, unreadable on this story's white canvas). */}
        <Form.AutoFields only={['signerName']} theme="light" />
        <SignatureField
          name="signatureImage"
          label="Signature"
          styles={{ theme: 'light' }}
        />
        <Button type="submit" action="submit" text="Submit" styles={{ theme: 'light' }} />
      </Form>
      {submitted && (
        <pre style={{ margin: 0, fontSize: '0.7rem' }}>
          signed: {submitted.signerName} ·{' '}
          {submitted.signatureImage ? 'has signature' : 'no signature'}
        </pre>
      )}
    </div>
  )
}

/**
 * In-<Form> regression: SignatureField auto-binds by `name="signatureImage"`,
 * stores the PNG data-URL on the engine, and the `z.string().min(1)` schema
 * blocks submit (with an inline error) until the field is signed.
 */
export const InForm: Story = {
  name: 'In Form (auto-bound, required)',
  render: () => <SignOffForm />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY states — exercises the a11y wiring added 2026-07-11:
//   • canvas is keyboard-focusable (tabIndex=0) with a :focus-visible ring
//   • canvas accessible name reflects signed/empty + required state
//   • a role="status" live region announces "Signature captured/cleared"
//   • disabled removes focusability and disables the Clear button
// --------------------------------------------------------------------------

// A minimal 1×1 opaque PNG data-URL — any non-empty value paints as "signed",
// so this drives the signed-state accessible name ("…, signature present") and
// the enabled Clear button without needing a real hand-drawn stroke.
const SIGNED_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC'

/**
 * Empty + required. The canvas exposes an accessible name of
 * "Signature, required, no signature, draw to sign" and is reachable by Tab
 * (focus ring visible). The Clear button is disabled until a stroke exists.
 */
export const RequiredEmpty: Story = {
  name: 'Required (empty — keyboard-focusable, stateful name)',
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SignatureField
        label="Signature"
        required
        value={value}
        onChange={setValue}
        helperText="Draw above with a mouse, pen, or finger."
        styles={{ theme: 'light' }}
      />
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Pre-filled (edit mode). A non-empty incoming `value` paints onto the canvas,
 * so `hasInk` is true: the accessible name reads "…, signature present", the
 * Clear button is enabled, and the placeholder is hidden.
 */
export const Prefilled: Story = {
  name: 'Prefilled / signed (edit mode)',
  render: () => {
    const [value, setValue] = useState<string>(SIGNED_PNG)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <SignatureField
          label="Signature"
          value={value}
          onChange={setValue}
          helperText="An existing signature is loaded; clear to re-sign."
          styles={{ theme: 'light' }}
        />
        <div style={{ fontSize: '0.75rem', color: '#333' }}>
          {value ? 'signature present' : 'no signature'}
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Error state: an explicit `error` string sets `aria-invalid` on the canvas and
 * renders the message in FieldShell's `role="alert"` region, linked to the
 * canvas via `aria-describedby` (WCAG 3.3.1 / 4.1.2). Not colour-alone — the
 * message text carries the meaning.
 */
export const WithError: Story = {
  name: 'Error (aria-invalid + associated alert text)',
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SignatureField
        label="Signature"
        required
        value={value}
        onChange={setValue}
        error="Signature is required"
        styles={{ theme: 'light' }}
      />
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Disabled: the canvas is removed from the tab order (`tabIndex=-1`), pointer
 * drawing is inert, and the Clear button is disabled. `aria-disabled` is
 * conveyed via FieldShell's `inputAriaProps`.
 */
export const Disabled: Story = {
  render: () => (
    <SignatureField
      label="Signature"
      disabled
      value={SIGNED_PNG}
      helperText="This field is disabled."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

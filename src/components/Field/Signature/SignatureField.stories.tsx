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
        <Form.AutoFields only={['signerName']} />
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

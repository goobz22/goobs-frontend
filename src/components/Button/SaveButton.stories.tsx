/**
 * @fileoverview Storybook stories for SaveButton — the thin CustomButton
 * wrapper that gates Save on `valid` / `pending`. The form-bound story drives
 * `valid`/`pending` from a real `<Form>` so the green↔grey gating and the
 * spinner swap are exercised end-to-end.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import { z } from 'zod'
import SaveButton from './SaveButton'
import Form from '../Form'
import TextField from '../Field/Text'

const meta: Meta<typeof SaveButton> = {
  title: 'Components/Button/SaveButton',
  component: SaveButton,
  argTypes: {
    valid: { control: 'boolean' },
    pending: { control: 'boolean' },
    label: { control: 'text' },
    pendingLabel: { control: 'text' },
    subject: { control: 'text' },
    onSave: { action: 'save' },
  },
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof SaveButton>

/** Enabled: valid form, not saving — clickable green primary. */
export const ValidAndIdle: Story = {
  name: 'Valid + Idle (enabled)',
  args: { valid: true, pending: false, subject: 'contract' },
}

/** Disabled: form not yet valid — greyed out, not clickable. */
export const InvalidAndIdle: Story = {
  name: 'Invalid + Idle (disabled)',
  args: { valid: false, pending: false, subject: 'contract' },
}

/**
 * Saving: spinner + "Saving…" label, disabled to block double-submit. The busy
 * state is exposed programmatically — `aria-busy="true"` on the button and a
 * polite live region carrying "Saving…" — so assistive tech announces the
 * in-flight save even though the control is disabled (WCAG 4.1.3). The spinner
 * is `aria-hidden`, so it never leaks into the accessible name.
 */
export const Pending: Story = {
  name: 'Pending (spinner)',
  args: { valid: true, pending: true, subject: 'contract' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /Saving/ })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-busy', 'true')
    // The polite live region carries the busy announcement.
    await expect(canvas.getByRole('status')).toHaveTextContent(/Saving/)
  },
}

/**
 * Form-bound: the SaveButton derives nothing magically — the parent owns
 * `valid` (here: name is non-empty) and `pending` (here: a simulated async
 * save). Type a name to enable; click Save to watch the spinner.
 */
const FormBoundSchema = z.object({
  contractName: z.string().min(1, 'Name is required'),
})

const FormBoundDemo: React.FC = () => {
  const [name, setName] = useState('')
  const [pending, setPending] = useState(false)
  const valid = name.trim().length > 0

  const handleSave = () => {
    setPending(true)
    window.setTimeout(() => setPending(false), 1500)
  }

  return (
    <Form
      schema={FormBoundSchema}
      initialValues={{ contractName: '' }}
      onSubmit={() => handleSave()}
      subject="contract"
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}
    >
      <TextField
        name="contractName"
        label="Contract Name"
        value={name}
        onChange={setName}
        required
      />
      <SaveButton
        valid={valid}
        pending={pending}
        onSave={handleSave}
        subject="contract"
      />
    </Form>
  )
}

export const FormBound: Story = {
  name: 'Form-bound (live gating)',
  render: () => <FormBoundDemo />,
}

/**
 * @fileoverview Storybook stories for SaveButton — the thin CustomButton
 * wrapper that gates Save on `valid` / `pending`. The form-bound story drives
 * `valid`/`pending` from a real `<Form>` so the green↔grey gating and the
 * spinner swap are exercised end-to-end.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent } from 'storybook/test'
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
    completedLabel: { control: 'text' },
    failedLabel: { control: 'text' },
    outcome: { control: 'select', options: [undefined, 'success', 'error'] },
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
 * The busy lifecycle is announced at BOTH edges (WCAG 4.1.3): the polite
 * `role="status"` region carries `pendingLabel` when a save starts and
 * `completedLabel` when it finishes. This pins the completion edge — before the
 * fix the region cleared to `''` on `pending: true → false`, so an AT user
 * heard "Saving…" but never that the save concluded. The toggle drives a real
 * `pending` transition in both directions so both announcements are asserted.
 */
const BusyLifecycleDemo: React.FC = () => {
  const [pending, setPending] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button type="button" onClick={() => setPending(p => !p)}>
        toggle pending
      </button>
      <SaveButton valid pending={pending} subject="contract" />
    </div>
  )
}

/**
 * Pins BOTH edges of the busy lifecycle in the polite live region: on
 * `pending: false → true` it reads the pending label ("Saving…"), and on
 * `true → false` it reads `completedLabel` ("Save complete"). The completion
 * edge is the regression: the region used to clear to `''` instead, so an AT
 * user heard the save start and never heard it finish.
 */
export const CompletionAnnounced: Story = {
  name: 'Busy lifecycle announced (start + completion)',
  render: () => <BusyLifecycleDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    const toggle = canvas.getByRole('button', { name: 'toggle pending' })

    // Start the save → the region announces the pending label.
    await userEvent.click(toggle)
    await expect(status).toHaveTextContent(/Saving/)

    // Finish the save → the region announces completion (was silently cleared
    // before the fix; this assertion fails if the completion edge regresses).
    await userEvent.click(toggle)
    await expect(status).toHaveTextContent(/Save complete/)
  },
}

/**
 * REGRESSION PIN — a FAILED save must not announce completion. The caller
 * reports the outcome in the same state update that clears `pending`; when that
 * outcome is `'error'` the polite region announces `failedLabel` (default `''`
 * = silent, because the caller's own `role="alert"` is the announcer) instead
 * of `completedLabel`. Before the fix the region announced "Save complete" on
 * ANY `pending: true → false`, so a screen-reader user heard "Save complete"
 * beside the error alert.
 *
 * The demo mirrors a real caller: ONE state object flips `pending` on and, on
 * the way back down, carries the resolved outcome — never inferred by
 * SaveButton.
 */
const OutcomeLifecycleDemo: React.FC<{
  outcome: 'success' | 'error'
  failedLabel?: string
}> = ({ outcome, failedLabel }) => {
  const [save, setSave] = useState<{
    pending: boolean
    outcome?: 'success' | 'error'
  }>({ pending: false })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        type="button"
        onClick={() =>
          setSave(s =>
            s.pending ? { pending: false, outcome } : { pending: true }
          )
        }
      >
        toggle pending
      </button>
      <SaveButton
        valid
        pending={save.pending}
        subject="contract"
        {...(save.outcome !== undefined && { outcome: save.outcome })}
        {...(failedLabel !== undefined && { failedLabel })}
      />
      {/* The caller's own failure announcer — the reason `failedLabel`
          defaults to silence. */}
      {save.outcome === 'error' && failedLabel === undefined && (
        <span role="alert">Could not save the contract</span>
      )}
    </div>
  )
}

/**
 * Pins the FAILED save: after `pending: true → false` carrying
 * `outcome: 'error'`, the polite region is EMPTY — it must not claim
 * "Save complete" — and the caller's own `role="alert"` is what a screen
 * reader hears. Silence is the default because `failedLabel` defaults to `''`.
 */
export const FailureAnnouncesNoCompletion: Story = {
  name: 'Failed save announces no completion',
  render: () => <OutcomeLifecycleDemo outcome="error" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    const toggle = canvas.getByRole('button', { name: 'toggle pending' })

    // Start the save → the region announces the pending label.
    await userEvent.click(toggle)
    await expect(status).toHaveTextContent(/Saving/)

    // Finish it as a FAILURE → the region must NOT claim completion. This is
    // the assertion that fails if the completion edge stops reading `outcome`.
    await userEvent.click(toggle)
    await expect(status).not.toHaveTextContent(/Save complete/)
    // Silent by default (jest-dom rejects toHaveTextContent('')).
    await expect(status).toBeEmptyDOMElement()

    // The caller's alert is what a screen reader hears instead.
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      /Could not save/
    )
  },
}

/**
 * A caller with NO error alert of its own may give the failure words by passing
 * `failedLabel`; the polite region then announces those words on the error
 * edge (and still never `completedLabel`).
 */
export const FailureWithCustomLabel: Story = {
  name: 'Failed save with a custom failedLabel',
  render: () => (
    <OutcomeLifecycleDemo outcome="error" failedLabel="Save failed" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    const toggle = canvas.getByRole('button', { name: 'toggle pending' })

    await userEvent.click(toggle)
    await expect(status).toHaveTextContent(/Saving/)

    await userEvent.click(toggle)
    await expect(status).toHaveTextContent('Save failed')
    await expect(status).not.toHaveTextContent(/Save complete/)
  },
}

/**
 * The success edge is unchanged: `outcome="success"` announces `completedLabel`
 * exactly as an outcome-less caller does, so adding the prop breaks nobody.
 */
export const SuccessStillAnnouncesCompletion: Story = {
  name: 'Successful save still announces completion',
  render: () => <OutcomeLifecycleDemo outcome="success" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    const toggle = canvas.getByRole('button', { name: 'toggle pending' })

    await userEvent.click(toggle)
    await expect(status).toHaveTextContent(/Saving/)

    await userEvent.click(toggle)
    await expect(status).toHaveTextContent(/Save complete/)
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

/**
 * Live gating inside a goobs `<Form>`: the button is disabled while the
 * required Contract Name is empty, enables the moment it is non-empty, and
 * shows the busy state for the 1.5s simulated save. Nothing is derived by
 * SaveButton — the parent owns both `valid` and `pending`.
 */
export const FormBound: Story = {
  name: 'Form-bound (live gating)',
  render: () => <FormBoundDemo />,
}

/**
 * REGRESSION PIN — SaveButton must render `type="submit"`. CustomButton's
 * default flipped to `type="button"` (96486d1c, WCAG 3.2.2) on the stated
 * premise that SaveButton passed its own `type="submit"` — it did not, so
 * every consumer relying on native form submit (the documented `onSave`
 * contract: "some forms submit via the surrounding <form>") went silent:
 * click emitted the action.invoke diag, the form's submit never dispatched,
 * no validation, no mutation, no error. Surfaced as 25 failing outcome specs
 * in the ThothOS 2026-08-19 G4 sweep. SaveButtonProps `Omit<'type'>` makes
 * the attribute un-overridable, so this assertion pins the ONLY value it can
 * ever have.
 */
export const SubmitsTheForm: Story = {
  name: 'type="submit" (regression pin)',
  args: { valid: true, pending: false, subject: 'contract' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /Save/ })
    await expect(button).toHaveAttribute('type', 'submit')
  },
}

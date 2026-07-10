/**
 * @fileoverview Storybook stories for the Tier-1 form-binding contract across
 * the eight bound components that previously had ZERO binding-path coverage:
 * Select, Switch, TransferList, ConfirmationCodeInput, ComplexTextEditor,
 * RadioGroup, ToggleButtonGroup, and Checkbox. A single `<Form schema>` binds
 * all eight by `name` alone (no per-field value/onChange wiring), pinning the
 * `useFieldBinding` auto-bind gate, the `data-field-name` / `data-filled`
 * selector emission, and the engine round-trip (UI change → engine.setValue →
 * re-render) that the whole ThothOS form migration rides on.
 * These stories are the form-binding-path regression spec — goobs has no unit
 * tests.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, within } from 'storybook/test'
import { z } from 'zod'
import Form, { useFormContext } from './index'
import Select from '../Select'
import Switch from '../Switch'
import TransferList from '../TransferList'
import ConfirmationCodeInputs from '../ConfirmationCodeInput'
import ComplexTextEditor from '../ComplexTextEditor'
import RadioGroup, { type RadioOption } from '../RadioGroup'
import { ToggleButton, ToggleButtonGroup } from '../ToggleButton'
import Checkbox from '../Checkbox'
import Button from '../Button'

// --------------------------------------------------------------------------
// SCHEMA + INITIAL VALUES — one zod key per bound component
// --------------------------------------------------------------------------

type Theme = 'light' | 'dark' | 'sacred'

const BoundFieldsSchema = z.object({
  /** Select — string option value. */
  plan: z.string().min(1),
  /** Switch — boolean. */
  notificationsEnabled: z.boolean(),
  /** TransferList — the assigned (right) list is the field's string[] value. */
  assignedSkills: z.array(z.string()),
  /** ConfirmationCodeInput — the concatenated digit string. */
  confirmationCode: z.string(),
  /** ComplexTextEditor — the editor's string content. */
  meetingNotes: z.string(),
  /** RadioGroup — the selected option label. */
  contactMethod: z.string().min(1),
  /** ToggleButtonGroup — selected value; null = exclusive "no selection". */
  billingCycle: z.string().nullable(),
  /** Checkbox — boolean. */
  acceptTerms: z.boolean(),
})

type BoundFieldsValues = z.infer<typeof BoundFieldsSchema>

const initialBoundValues: BoundFieldsValues = {
  plan: 'pro',
  notificationsEnabled: false,
  assignedSkills: ['Invoicing'],
  confirmationCode: '',
  meetingNotes: '',
  contactMethod: '',
  billingCycle: 'monthly',
  acceptTerms: false,
}

const ALL_SKILLS = ['Invoicing', 'Scheduling', 'Inventory', 'Payroll']

const contactOptions: RadioOption[] = [
  { label: 'Email' },
  { label: 'Phone' },
  { label: 'Portal message' },
]

// Module-scope spies: the stories only pin the ENGINE round-trip, so the
// caller-facing callbacks (still invoked alongside the engine write) are inert
// fn() spies rather than parallel React state.
const onFormSubmit = fn()
const onSkillsTransfer = fn()
const onBillingCycleChange = fn()
const onDisableVerification = fn()

/**
 * The eight bound fields, hand-placed inside the surrounding `<Form>`. Rendered
 * as a child component so it can read the live engine via `useFormContext`:
 * TransferList derives its available (left) list from the engine's assigned
 * list, ConfirmationCodeInput derives `isValid` from the engine's code value,
 * and the `<pre data-testid="engine-values">` readout serializes
 * `engine.values` — making every binding's round-trip observable in the DOM.
 */
const BoundFieldsInner: React.FC<{ theme: Theme }> = ({ theme }) => {
  const { engine } = useFormContext()

  const assignedRaw = engine.getValue('assignedSkills')
  const assignedSkills = Array.isArray(assignedRaw)
    ? (assignedRaw as string[])
    : []
  const availableSkills = ALL_SKILLS.filter(
    skill => !assignedSkills.includes(skill)
  )

  const codeRaw = engine.getValue('confirmationCode')
  const codeValue = typeof codeRaw === 'string' ? codeRaw : ''

  const captionStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: `var(--goobs-${theme}-text-secondary)`,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <span style={captionStyle}>Plan (Select)</span>
      <Select name="plan" aria-label="Plan" fullWidth styles={{ theme }}>
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </Select>

      <span style={captionStyle}>Notifications (Switch)</span>
      <Switch
        name="notificationsEnabled"
        rightLabel="Enable notifications"
        styles={{ theme }}
      />

      <span style={captionStyle}>Skills (TransferList)</span>
      {/* TransferList only themes light/sacred; dark reuses light. The left
          list is derived from the engine value so a transfer moves the item
          out of "Available" AND into the engine's string[] in one write. */}
      <TransferList
        name="assignedSkills"
        leftItems={availableSkills}
        leftTitle="Available"
        rightTitle="Assigned"
        onChange={onSkillsTransfer}
        sacredtheme={theme === 'sacred'}
      />

      <span style={captionStyle}>Verification code (ConfirmationCodeInput)</span>
      <ConfirmationCodeInputs
        name="confirmationCode"
        aria-label="Confirmation Code"
        isValid={codeValue.length === 6}
        onDisableVerification={onDisableVerification}
        styles={{ theme }}
      />

      <span style={captionStyle}>Meeting notes (ComplexTextEditor)</span>
      <ComplexTextEditor
        name="meetingNotes"
        editorType="simple"
        label="Meeting notes"
        minRows={3}
        styles={{ theme }}
      />

      <RadioGroup
        name="contactMethod"
        label="Preferred contact method (RadioGroup)"
        options={contactOptions}
        styles={{ theme }}
      />

      <span style={captionStyle}>Billing cycle (ToggleButtonGroup)</span>
      <ToggleButtonGroup
        name="billingCycle"
        exclusive
        onChange={onBillingCycleChange}
        styles={{ theme }}
      >
        <ToggleButton value="monthly">Monthly</ToggleButton>
        <ToggleButton value="annual">Annual</ToggleButton>
      </ToggleButtonGroup>

      <Checkbox name="acceptTerms" styles={{ theme }}>
        I accept the terms
      </Checkbox>

      <Button type="submit" action="save" text="Save" styles={{ theme }} />

      {/* Live engine snapshot — the observable proof of every round-trip. */}
      <pre
        data-testid="engine-values"
        style={{
          margin: 0,
          fontSize: '0.7rem',
          color: `var(--goobs-${theme}-text)`,
        }}
      >
        {JSON.stringify(engine.values, null, 2)}
      </pre>
    </div>
  )
}

/** The full harness: one `<Form schema>` binding all eight components by name. */
const BoundFieldsForm: React.FC<{ theme: Theme }> = ({ theme }) => (
  <Form
    schema={BoundFieldsSchema}
    initialValues={initialBoundValues}
    subject="workspace settings"
    id="bound-fields-form"
    onSubmit={onFormSubmit}
  >
    <BoundFieldsInner theme={theme} />
  </Form>
)

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Form> = {
  title: 'Components/Form/BoundFields',
  component: Form,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: '46rem', margin: '0 auto', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Form>

// --------------------------------------------------------------------------
// THEME TRIO
// --------------------------------------------------------------------------

/**
 * All eight bound fields in the sacred theme on a dark canvas. Pins the
 * bound INITIAL state flowing engine→UI with zero per-field wiring: Select
 * shows "Pro", the "Invoicing" skill sits in the Assigned column (and is
 * absent from Available), the "Monthly" toggle renders pressed, the Switch /
 * Checkbox render unchecked, code + notes render empty, no radio is selected,
 * and the engine-values readout serializes exactly `initialBoundValues`.
 */
export const SacredTheme: Story = {
  render: () => <BoundFieldsForm theme="sacred" />,
  // Pin the DARK canvas (#111827), not 'sacred' (#0e0e0e). 'sacred' equals the
  // preview's `initialGlobals` default, so setting it is a no-op the backgrounds
  // decorator may not re-apply — leaving the sacred translucent surfaces on a
  // mid-gray fallback where the gold/light text fails contrast. Pinning 'dark'
  // (a value that differs from the initial global) reliably applies a near-black
  // canvas on which every sacred field passes. Matches the house pattern
  // (Content.stories.tsx SacredTheme, which pins 'dark' for the same reason).
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * The same bound form in the light theme. The play function exercises the
 * engine ROUND-TRIP for the two boolean bindings: clicking the Switch and the
 * Checkbox flips their controlled inputs to checked (the value is owned by the
 * engine, so a checked input proves UI→setValue→re-render→UI), and the
 * engine-values readout shows `notificationsEnabled` and `acceptTerms` as
 * `true`.
 */
export const LightTheme: Story = {
  render: () => <BoundFieldsForm theme="light" />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Switch: bound boolean starts false, click flips it through the engine.
    const switchInput = canvas.getByRole('checkbox', {
      name: /enable notifications/i,
    })
    await expect(switchInput).not.toBeChecked()
    await userEvent.click(switchInput)
    await expect(switchInput).toBeChecked()

    // Checkbox: same round-trip on its own engine key.
    const termsInput = canvas.getByRole('checkbox', {
      name: /accept the terms/i,
    })
    await expect(termsInput).not.toBeChecked()
    await userEvent.click(termsInput)
    await expect(termsInput).toBeChecked()

    // The engine snapshot proves both writes landed in the form engine (the
    // inputs above are controlled BY that engine, so this is the full loop).
    const readout = canvas.getByTestId('engine-values')
    await expect(readout).toHaveTextContent('"notificationsEnabled": true')
    await expect(readout).toHaveTextContent('"acceptTerms": true')
  },
}

/**
 * The same bound form in the dark theme on the dark canvas. Pins the dark
 * variants of every bound component rendering the identical engine-fed initial
 * state (TransferList reuses its light palette — it has no dark variant).
 */
export const DarkTheme: Story = {
  render: () => <BoundFieldsForm theme="dark" />,
  globals: { backgrounds: { value: 'dark' } },
}

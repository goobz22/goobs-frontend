/**
 * @fileoverview Storybook stories for the RadioGroup component.
 * These stories showcase the various themes and options for the RadioGroup component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, fn, userEvent } from 'storybook/test'
import { z } from 'zod'
import RadioGroup, { RadioOption } from './index'
import Form from '../Form'
import Button from '../Button'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    labelText: { control: 'text' },
    defaultValue: { control: 'text' },
    options: { control: 'object' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

// Sample options for stories
const basicOptions: RadioOption[] = [
  { label: 'Option 1' },
  { label: 'Option 2' },
  { label: 'Option 3' },
]

const coloredOptions: RadioOption[] = [
  { label: 'Red Option', color: '#dc2626' },
  { label: 'Blue Option', color: '#2563eb' },
  // green-700 — #16a34a is only 3.30:1 on the white canvas (needs 4.5)
  { label: 'Green Option', color: '#15803d' },
  { label: 'Purple Option', color: '#9333ea' },
]

const preferenceOptions: RadioOption[] = [
  { label: 'Email notifications' },
  { label: 'SMS notifications' },
  { label: 'Push notifications' },
  { label: 'No notifications' },
]

const planOptions: RadioOption[] = [
  { label: 'Basic Plan - $9/month' },
  { label: 'Pro Plan - $19/month' },
  { label: 'Enterprise Plan - $49/month' },
]

const mysticalOptions: RadioOption[] = [
  { label: 'Divine Insight' },
  { label: 'Sacred Lightning' },
  { label: 'Lunar Wisdom' },
  { label: 'Phoenix Fire' },
]

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const Light: Story = {
  name: 'Light/Basic',
  args: {
    name: 'basic-radio',
    label: 'Choose an option',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const LightWithLabelText: Story = {
  name: 'Light/With Label Text',
  args: {
    name: 'preference-radio',
    labelText: 'Notification Preferences',
    options: preferenceOptions,
    defaultValue: 'Email notifications',
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const LightWithColoredOptions: Story = {
  name: 'Light/Colored Options',
  args: {
    name: 'colored-radio',
    label: 'Select your favorite color',
    options: coloredOptions,
    defaultValue: 'Blue Option',
    styles: {
      theme: 'light',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const LightCustomSize: Story = {
  name: 'Light/Custom Size',
  args: {
    name: 'size-radio',
    label: 'Custom sized radio buttons',
    options: basicOptions,
    defaultValue: 'Option 2',
    styles: {
      theme: 'light',
      radioSize: '24px',
      labelFontSize: '1rem',
      padding: '0.75rem 0',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Light theme with NO initial selection. Every radio renders in its unchecked
 * state, so this is the visual baseline for the unchecked radio-ring boundary
 * contrast (WCAG 2.2 1.4.11 Non-text Contrast: the ring must hold ≥3:1 against
 * the white canvas — it now uses the text-muted grey #4b5563 at 7.56:1, not the
 * old #cbd5e1 at 1.48:1). The group still exposes its accessible name and stays
 * fully keyboard-operable with nothing checked, and the root reports the empty
 * state via `data-filled="false"`.
 */
export const LightNoSelection: Story = {
  name: 'Light/No Selection',
  args: {
    name: 'no-selection-radio',
    label: 'Pick one (nothing selected yet)',
    options: basicOptions,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The group advertises its accessible name even with no selection.
    const group = canvas.getByRole('radiogroup', {
      name: 'Pick one (nothing selected yet)',
    })
    await expect(group).toBeInTheDocument()

    // All three options render as reachable, UNCHECKED radios.
    const radios = canvas.getAllByRole('radio')
    await expect(radios).toHaveLength(3)
    for (const radio of radios) {
      await expect(radio).not.toBeChecked()
    }

    // Root reflects the empty state for the machine-test selector contract.
    const root = canvasElement.querySelector('[data-component="RadioGroup"]')
    await expect(root).toHaveAttribute('data-filled', 'false')
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const Dark: Story = {
  name: 'Dark/Default',
  args: {
    name: 'dark-radio',
    label: 'Choose your plan',
    options: planOptions,
    defaultValue: 'Pro Plan - $19/month',
    styles: {
      theme: 'dark',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Dark theme with caller-supplied radio colors. `radioInnerColor` opts into
 * the ring-and-dot presentation: the checked option renders a hollow outer
 * ring with a #60a5fa inner dot (root emits `data-inner-dot="true"`), and
 * hovering an unchecked row shows the #60a5fa hover border.
 */
export const DarkWithCustomColors: Story = {
  name: 'Dark/Custom Colors',
  args: {
    name: 'dark-custom-radio',
    label: 'Select notification type',
    options: preferenceOptions,
    defaultValue: 'Push notifications',
    styles: {
      theme: 'dark',
      radioInnerColor: '#60a5fa',
      radioOuterBorderColor: '#6b7280',
      radioHoverBorderColor: '#60a5fa',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES (CONTINUED)
// --------------------------------------------------------------------------

export const DarkBasic: Story = {
  name: 'Dark/Basic Options',
  args: {
    name: 'dark-basic-radio',
    label: 'Choose Your Power',
    options: mysticalOptions,
    defaultValue: 'Divine Insight',
    styles: {
      theme: 'dark',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Dark theme addressed via `labelText` (the group heading prop that wins over
 * `label`). Renders the standard dark palette: default 20px radios with the
 * checked option shown as a solid-filled ring — no extra ornamentation.
 */
export const DarkWithLabelText: Story = {
  name: 'Dark/With Label Text',
  args: {
    name: 'dark-labeltext-radio',
    labelText: 'Select Your Divine Blessing',
    options: mysticalOptions,
    defaultValue: 'Sacred Lightning',
    styles: {
      theme: 'dark',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Dark theme with size/spacing overrides: 22px radio rings, 1rem group label,
 * and roomier 0.75rem vertical option padding. Checked state stays the default
 * solid-filled ring (no `radioInnerColor`, so no inner dot).
 */
export const DarkCustomized: Story = {
  name: 'Dark/Customized',
  args: {
    name: 'dark-custom-radio',
    labelText: 'Channel Arcane Energy',
    options: mysticalOptions,
    defaultValue: 'Lunar Wisdom',
    styles: {
      theme: 'dark',
      radioSize: '22px',
      labelFontSize: '1rem',
      padding: '0.75rem 0',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

/**
 * Dedicated sacred baseline. Passes the component's real theme prop
 * (`styles: { theme: 'sacred' }`), so the root emits `data-theme="sacred"`
 * and the CSS override block re-points the token palette: gold group label
 * and option text in `--goobs-font-sacred`, gold radio rings with the checked
 * option solid-filled, and the premium 400ms hover transition.
 */
export const SacredTheme: Story = {
  name: 'Themes/Sacred',
  args: {
    name: 'sacred-radio',
    label: 'Choose Your Blessing',
    options: mysticalOptions,
    defaultValue: 'Divine Insight',
    styles: {
      theme: 'sacred',
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// CUSTOMIZATION STORIES
// --------------------------------------------------------------------------

/**
 * Light theme fully re-pointed to an emerald brand palette. Because
 * `radioInnerColor` is set, the checked option renders the ring-and-dot
 * presentation: hollow #059669-bordered outer ring with a #059669 inner dot
 * (instead of the default solid fill); label and option text are emerald too.
 */
export const CustomBrandColors: Story = {
  name: 'Customization/Brand Colors',
  args: {
    name: 'brand-radio',
    label: 'Brand themed radio group',
    options: basicOptions,
    defaultValue: 'Option 2',
    styles: {
      theme: 'light',
      // emerald-700 label — #059669 is only 3.77:1 on the white canvas
      // (needs 4.5); the controls keep the brighter #059669 brand emerald
      labelColor: '#047857',
      radioOuterBorderColor: '#059669',
      radioInnerColor: '#059669',
      radioHoverBorderColor: '#047857',
      textColor: '#065f46',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const CustomSizing: Story = {
  name: 'Customization/Custom Sizing',
  args: {
    name: 'sizing-radio',
    label: 'Large radio buttons',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: {
      theme: 'light',
      radioSize: '28px',
      labelFontSize: '1.125rem',
      textFontSize: '1rem',
      padding: '1rem 0',
      marginBottom: '1rem',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const CustomFonts: Story = {
  name: 'Customization/Custom Fonts',
  args: {
    name: 'font-radio',
    label: 'Custom typography',
    options: planOptions,
    defaultValue: 'Basic Plan - $9/month',
    styles: {
      theme: 'light',
      labelFontFamily: 'Georgia, serif',
      labelFontWeight: 'bold',
      textFontFamily: 'Georgia, serif',
      labelFontSize: '1.125rem',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTIVE STORIES
// --------------------------------------------------------------------------

// Component for Interactive Demo
const InteractiveDemoComponent: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('Option 2')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <strong>Current selection: </strong>
        <span style={{ color: '#2563eb' }}>{selectedValue}</span>
      </div>

      <RadioGroup
        name="interactive-radio"
        label="Interactive Radio Group"
        options={basicOptions}
        defaultValue={selectedValue}
        onChange={handleChange}
        styles={{ theme: 'light' }}
      />

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
        }}
      >
        <small>Selection updates in real-time</small>
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive/State Management',
  render: () => <InteractiveDemoComponent />,
  globals: { backgrounds: { value: 'light' } },
}

export const MultipleGroups: Story = {
  name: 'Interactive/Multiple Groups',
  render: () => {
    return (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: '250px' }}>
          <RadioGroup
            name="group1"
            label="Notification Settings"
            options={preferenceOptions}
            defaultValue="Email notifications"
            styles={{ theme: 'light' }}
          />
        </div>

        <div style={{ minWidth: '250px' }}>
          <RadioGroup
            name="group2"
            label="Subscription Plan"
            options={planOptions}
            defaultValue="Pro Plan - $19/month"
            styles={{ theme: 'light' }}
          />
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// FORM INTEGRATION STORY
// --------------------------------------------------------------------------

// Component for Form Integration
const FormIntegrationComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    notifications: 'Email notifications',
    plan: 'Pro Plan - $19/month',
    theme: 'Divine Insight',
  })

  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, notifications: event.target.value }))
  }

  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, plan: event.target.value }))
  }

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, theme: event.target.value }))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
        User Preferences Form
      </h3>

      <div style={{ marginBottom: '30px' }}>
        <RadioGroup
          name="notifications"
          labelText="How would you like to receive notifications?"
          options={preferenceOptions}
          defaultValue={formData.notifications}
          onChange={handleNotificationChange}
          styles={{ theme: 'light' }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <RadioGroup
          name="plan"
          labelText="Select your subscription plan:"
          options={planOptions}
          defaultValue={formData.plan}
          onChange={handlePlanChange}
          styles={{ theme: 'light' }}
        />
      </div>

      {/* Dark-themed group rendered on its own dark surface so the dark
          palette (#e2e8f0 / #cbd5e1 text) stays compliant on the story's
          light canvas (14.39:1 / 11.95:1 on #111827). */}
      <div
        style={{
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: '#111827',
          borderRadius: '8px',
        }}
      >
        <RadioGroup
          name="theme"
          labelText="Choose your theme:"
          options={mysticalOptions}
          defaultValue={formData.theme}
          onChange={handleThemeChange}
          styles={{ theme: 'dark' }}
        />
      </div>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Form Data:</h4>
        <pre style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export const FormIntegration: Story = {
  name: 'Interactive/Form Integration',
  render: () => <FormIntegrationComponent />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  args: {
    name: 'test-radio',
    label: 'Test Radio Group',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check label is visible
    const label = canvas.getByText('Test Radio Group')
    await expect(label).toBeVisible()

    // Check all options are visible
    const option1 = canvas.getByText('Option 1')
    const option2 = canvas.getByText('Option 2')
    const option3 = canvas.getByText('Option 3')

    await expect(option1).toBeVisible()
    await expect(option2).toBeVisible()
    await expect(option3).toBeVisible()

    // Check first option is selected by default
    const radio1 = canvas.getByDisplayValue('Option 1')
    await expect(radio1).toBeChecked()

    // Test selecting different option
    await userEvent.click(option2)
    const radio2 = canvas.getByDisplayValue('Option 2')
    await expect(radio2).toBeChecked()
    await expect(radio1).not.toBeChecked()
  },
}

/**
 * A11y regression guard for the visually-hidden-but-accessible native inputs.
 * The radios must stay in the accessibility tree and the keyboard tab order
 * (they are clipped to 1px, NEVER `display:none`). This story fails against the
 * old `display:none` markup: `getAllByRole('radio')` returns nothing when the
 * inputs are removed from the a11y tree, and Tab never lands on a radio. It
 * verifies the radiogroup exposes its accessible name (WCAG 4.1.2), every
 * option is a reachable `radio` role, Tab moves focus into the group onto the
 * checked radio (native roving tab-stop — WCAG 2.1.1), and the Arrow key moves
 * selection to the next option (native radiogroup keyboard interaction).
 */
export const KeyboardA11y: Story = {
  name: 'A11y/Keyboard Navigation',
  args: {
    name: 'keyboard-radio',
    label: 'Keyboard accessible radio group',
    options: basicOptions,
    defaultValue: 'Option 1',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The radiogroup advertises an accessible name via aria-labelledby.
    const group = canvas.getByRole('radiogroup', {
      name: 'Keyboard accessible radio group',
    })
    await expect(group).toBeInTheDocument()

    // All three options are real, accessible `radio` roles. This query returns
    // [] when the input is `display:none` (removed from the a11y tree), so it
    // is the primary regression guard for the visually-hidden fix.
    const radios = canvas.getAllByRole('radio')
    await expect(radios).toHaveLength(3)

    // Default selection is exposed programmatically to assistive tech.
    const radio1 = canvas.getByRole('radio', { name: 'Option 1' })
    await expect(radio1).toBeChecked()

    // Tab moves focus INTO the group and lands on the checked radio (native
    // roving tab-stop) — impossible when the input is display:none.
    await userEvent.tab()
    await expect(radio1).toHaveFocus()

    // Arrow key moves selection to the next option (native radiogroup keyboard).
    await userEvent.keyboard('{ArrowDown}')
    const radio2 = canvas.getByRole('radio', { name: 'Option 2' })
    await expect(radio2).toBeChecked()
    await expect(radio1).not.toBeChecked()
  },
}

// --------------------------------------------------------------------------
// VALIDATION AFFORDANCE (required + error) STORIES
// --------------------------------------------------------------------------

/**
 * Standalone validation affordance driven by the additive `required` + `error`
 * props (no `<Form>`). This is the per-field feedback a required RadioGroup must
 * render when its value fails validation — before this pass the component
 * emitted NONE of it (no `aria-required`, no `aria-invalid`, no error region, no
 * required indicator). The `play` test fails against that pre-fix markup:
 *
 *  - the heading shows the required indicator (`Choose a plan *`),
 *  - the `role="radiogroup"` exposes `aria-required` AND `aria-invalid` (state
 *    is programmatic, not colour-only — WCAG 1.4.1 / 4.1.2),
 *  - the error text is announced by a `role="alert"` region that the group
 *    points at via `aria-describedby` (WCAG 3.3.1 Error Identification), and
 *  - the root advertises `data-state="error"` for the machine-test contract.
 */
export const RequiredWithError: Story = {
  name: 'A11y/Required + Error',
  args: {
    name: 'plan',
    label: 'Choose a plan',
    options: planOptions,
    required: true,
    error: 'Please select a plan to continue',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The group advertises required + invalid programmatically to assistive
    // tech (the accessible name excludes the aria-hidden required indicator).
    const group = canvas.getByRole('radiogroup', { name: /choose a plan/i })
    await expect(group).toHaveAttribute('aria-required', 'true')
    await expect(group).toHaveAttribute('aria-invalid', 'true')

    // The error message is announced and tied back to the group.
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('Please select a plan to continue')
    await expect(group).toHaveAttribute('aria-describedby', alert.id)

    // The visible required indicator sits on the heading (aria-hidden, so it is
    // NOT part of the accessible name matched above).
    const heading = canvasElement.querySelector('#plan-label')
    await expect(heading).toHaveTextContent('Choose a plan *')

    // Root reflects the error state for the Playwright selector contract.
    const root = canvasElement.querySelector('[data-component="RadioGroup"]')
    await expect(root).toHaveAttribute('data-state', 'error')
  },
}

// The bound-path schema: a required single-choice field. `.min(1)` makes the
// empty initial value invalid until an option is chosen.
const shippingSchema = z.object({
  shippingSpeed: z.string().min(1, 'Choose a shipping speed'),
})

const shippingOptions: RadioOption[] = [
  { label: 'Standard' },
  { label: 'Express' },
  { label: 'Overnight' },
]

// Inert submit spy — onSubmit only fires on a VALID submit, which this story
// never reaches (it asserts the blocked path), so no parallel React state.
const onShippingSubmit = fn()

/**
 * The bound path the review flagged: a required RadioGroup inside a `<Form>`,
 * deriving BOTH its required marker (from the zod schema) and its error (from
 * the form engine) with zero per-field wiring — just `name`. Submitting with
 * nothing selected marks the field touched, validates, and surfaces the error
 * ON THIS FIELD; selecting an option clears it. Pristine (untouched) the group
 * is required but not yet invalid, matching the engine's touched-gated error
 * suppression. The field's own `role="alert"` region is targeted by id, since
 * `<Form>` also renders a form-level status alert.
 */
export const FormValidationError: Story = {
  name: 'A11y/Form Validation Error',
  render: () => (
    <Form
      schema={shippingSchema}
      initialValues={{ shippingSpeed: '' }}
      id="shipping-form"
      subject="shipping"
      onSubmit={onShippingSubmit}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup
          name="shippingSpeed"
          label="Shipping speed"
          options={shippingOptions}
          styles={{ theme: 'light' }}
        />
        <Button
          type="submit"
          action="save"
          text="Save"
          styles={{ theme: 'light' }}
        />
      </div>
    </Form>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const group = canvas.getByRole('radiogroup', { name: /shipping speed/i })

    // Schema-derived required is exposed immediately; the error is touched-gated,
    // so the pristine group is required but NOT yet invalid.
    await expect(group).toHaveAttribute('aria-required', 'true')
    await expect(group).not.toHaveAttribute('aria-invalid')

    // Submit with nothing selected → engine validates → per-field error surfaces.
    await userEvent.click(canvas.getByRole('button', { name: /save/i }))
    await expect(group).toHaveAttribute('aria-invalid', 'true')
    await expect(group).toHaveAttribute('aria-describedby', 'shippingSpeed-helper')

    // Target the FIELD's error region by id (the Form renders a separate
    // form-level status alert, so role="alert" alone is ambiguous).
    const fieldError = canvasElement.querySelector('#shippingSpeed-helper')
    await expect(fieldError).toHaveAttribute('role', 'alert')
    await expect(fieldError).toHaveTextContent('Choose a shipping speed')

    // Choosing an option writes through the engine and clears the error.
    await userEvent.click(canvas.getByRole('radio', { name: 'Overnight' }))
    await expect(group).not.toHaveAttribute('aria-invalid')
  },
}

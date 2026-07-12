/**
 * @fileoverview Storybook stories for the Percentage component.
 * These stories showcase the various states, themes, and styling capabilities of the Percentage field.
 * The Percentage component provides percentage input with validation and formatting.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn } from 'storybook/test'
import PercentageField from './index'

// Wrapper component for state management
const PercentageFieldWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | number
  ) => {
    if (typeof event === 'number') {
      setValue(event.toString())
    } else {
      setValue(event.target.value)
    }
  }
  return <PercentageField {...props} value={value} onChange={handleChange} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof PercentageField> = {
  title: 'Components/Field/Percentage',
  component: PercentageField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showPercentSymbol: { control: 'boolean' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PercentageField>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <PercentageFieldWithState
      label="Percentage"
      placeholder="Enter percentage"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <PercentageFieldWithState
      label="Completion Rate"
      placeholder="Enter completion rate"
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <PercentageFieldWithState
      label="Divine Proportion"
      placeholder="Enter sacred ratio..."
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <PercentageFieldWithState
      label="Custom Percentage"
      placeholder="Enter percentage"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(245, 245, 255, 0.95)',
        borderColor: 'rgba(99, 102, 241, 0.4)',
        borderFocusedColor: 'rgba(99, 102, 241, 1)',
        textColor: 'rgba(67, 56, 202, 1)',
        // Full-opacity indigo: at 0.7 alpha the label composited to
        // #7b74da on white (3.92:1); #4338ca is 7.90:1.
        labelColor: 'rgba(67, 56, 202, 1)',
      }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <PercentageFieldWithState
      label="Neon Percentage"
      placeholder="Enter percentage"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderFocusedColor: 'rgba(168, 85, 247, 1)',
        textColor: 'rgba(168, 85, 247, 1)',
        // Lighter neon purple for the label, which sits on the #111827
        // canvas: 0.7-alpha #a855f7 composited to 2.82:1 and even full
        // opacity only reaches 4.48:1; #c084fc is 6.71:1.
        labelColor: 'rgba(192, 132, 252, 1)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// LAYOUT AND SPACING STORIES
// --------------------------------------------------------------------------

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PercentageFieldWithState
        label="Large Padding"
        placeholder="Enter percentage"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <PercentageFieldWithState
        label="Custom Dimensions"
        placeholder="Fixed height"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <PercentageFieldWithState
        label="Asymmetric Padding"
        placeholder="Different padding sides"
        styles={{
          theme: 'light',
          paddingLeft: '32px',
          paddingRight: '16px',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PercentageFieldWithState
        label="Large Text"
        placeholder="Enter percentage"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <PercentageFieldWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <PercentageFieldWithState
        label="Small & Light"
        placeholder="Enter percentage"
        styles={{
          theme: 'light',
          fontSize: '14px',
          fontWeight: 300,
          padding: '12px',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Mixed-theme story on the sacred canvas: the light-themed field sits
          on its own light surface so its danger-red label/helper are read
          against white (#b91c1c is 6.47:1 on white, only 2.98:1 on #0e0e0e). */}
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <PercentageFieldWithState
          label="Percentage"
          initialValue="150"
          error="Percentage cannot exceed 100%."
          styles={{ theme: 'light' }}
        />
      </div>
      <PercentageFieldWithState
        label="Completion Rate"
        placeholder="Enter completion rate"
        error="Percentage value is required."
        styles={{
          theme: 'dark',
          borderErrorColor: 'rgba(255, 99, 71, 1)',
          labelErrorColor: 'rgba(255, 99, 71, 1)',
          footerTextErrorColor: 'rgba(255, 99, 71, 1)',
        }}
      />
      <PercentageFieldWithState
        label="Divine Proportion"
        initialValue="-25"
        error="Sacred ratios cannot be negative."
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Mixed-theme story on the sacred canvas: light-themed fields sit on
          their own light surface so their labels are read against white. */}
      <div
        style={{
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <PercentageFieldWithState
          label="Required Percentage"
          placeholder="Enter percentage"
          required
          styles={{ theme: 'light' }}
        />
        <PercentageFieldWithState
          label="Completion Rate"
          placeholder="Enter completion rate"
          required
          error="This field is required"
          styles={{ theme: 'light' }}
        />
      </div>
      <PercentageFieldWithState
        label="Progress Percentage"
        placeholder="Enter progress"
        required
        styles={{ theme: 'dark' }}
      />
      <PercentageFieldWithState
        label="Custom Required Percentage"
        placeholder="Enter sacred ratio"
        required
        styles={{
          theme: 'sacred',
          requiredIndicatorText: ' (required)',
          requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
        }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PercentageFieldWithState
            label="Basic Percentage"
            placeholder="Enter percentage"
            styles={{ theme: 'light' }}
          />
          <PercentageFieldWithState
            label="Percentage Field"
            initialValue="150"
            error="Exceeds 100%"
            styles={{ theme: 'light' }}
          />
          <PercentageFieldWithState
            label="Required Percentage"
            placeholder="Required field"
            required
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section — on its own dark surface so dark-themed
          labels/headings are read against #111827, not the light canvas */}
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PercentageFieldWithState
            label="Basic Dark"
            placeholder="Enter percentage"
            styles={{ theme: 'dark' }}
          />
          <PercentageFieldWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <PercentageFieldWithState
            label="Large Size"
            placeholder="Enter percentage"
            styles={{
              theme: 'dark',
              fontSize: '18px',
              padding: '20px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — gold-on-near-black is the sacred design
          language; the near-black surface is what makes the gold headings,
          labels, and translucent control backgrounds compliant */}
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PercentageFieldWithState
            label="Divine Proportion"
            placeholder="Sacred ratio"
            styles={{ theme: 'sacred' }}
          />
          <PercentageFieldWithState
            label="Sacred Percentage"
            initialValue="-25"
            error="Cannot be negative"
            styles={{ theme: 'sacred' }}
          />
          <PercentageFieldWithState
            label="Holy Percentage"
            placeholder="Enter divine ratio"
            styles={{
              theme: 'sacred',
              borderRadius: '16px',
              padding: '18px',
            }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PercentageFieldWithState
            label="Neon Style"
            placeholder="Enter percentage"
            styles={{
              theme: 'dark',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderFocusedColor: 'rgba(147, 51, 234, 1)',
              // Light neon purple on the near-black input (#9333ea was
              // 3.61:1 there; #c084fc is 7.36:1)…
              textColor: 'rgba(192, 132, 252, 1)',
              // …and full-opacity deep purple for the label on the white
              // canvas (0.8 alpha composited to 3.85:1; #9333ea is 5.38:1).
              labelColor: 'rgba(147, 51, 234, 1)',
              borderRadius: '20px',
              borderWidth: '2px',
            }}
          />
          <PercentageFieldWithState
            label="Soft Rounded"
            placeholder="Enter percentage"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <PercentageFieldWithState
            label="Minimal"
            placeholder="Enter percentage"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0px',
              borderWidth: '0px 0px 2px 0px',
              padding: '12px 0px',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Mixed-theme story on the sacred canvas: the light-themed field
          sits on its own light surface so its label reads against white. */}
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <PercentageFieldWithState
          label="Disabled Light"
          initialValue="75"
          disabled
          styles={{ theme: 'light' }}
        />
      </div>
      <PercentageFieldWithState
        label="Disabled Dark"
        initialValue="50"
        disabled
        styles={{ theme: 'dark' }}
      />
      <PercentageFieldWithState
        label="Disabled Sacred"
        initialValue="100"
        disabled
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

const onValidationSuccess = fn()

const PercentageValidationDemo = () => {
  const [percentage, setPercentage] = useState('')
  const [error, setError] = useState('')

  const validatePercentage = (value: string) => {
    const numValue = parseFloat(value)
    if (value.trim() === '') {
      setError('Percentage is required')
    } else if (isNaN(numValue)) {
      setError('Please enter a valid number')
    } else if (numValue < 0) {
      setError('Percentage cannot be negative')
    } else if (numValue > 100) {
      setError('Percentage cannot exceed 100%')
    } else {
      setError('')
    }
  }

  const handleSubmit = () => {
    validatePercentage(percentage)
    if (error === '' && percentage.trim() !== '') {
      onValidationSuccess('Percentage validated successfully!')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '400px',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Percentage Validation</h3>
      <PercentageField
        label="Completion Percentage"
        placeholder="Enter percentage (0-100)"
        value={percentage}
        onChange={(event: React.ChangeEvent<HTMLInputElement> | number) => {
          const value =
            typeof event === 'number' ? event.toString() : event.target.value
          setPercentage(value)
          if (error) validatePercentage(value)
        }}
        helperText={error}
        styles={{ theme: 'light', required: true }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // Blue-600: white on #3B82F6 was 3.67:1; on #2563EB it is 5.17:1.
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        Validate Percentage
      </button>
      <div style={{ fontSize: '14px', color: '#6B7280' }}>
        <p>Percentage validation rules:</p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Must be a valid number</li>
          <li>Cannot be negative</li>
          <li>Cannot exceed 100%</li>
          <li>Required field</li>
        </ul>
      </div>
    </div>
  )
}

export const ValidationDemo: Story = {
  render: () => <PercentageValidationDemo />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <PercentageFieldWithState
      label="Test Percentage Input"
      placeholder="Enter percentage for testing"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Enter percentage for testing')
    const label = canvas.getByText('Test Percentage Input')

    // Initial state
    expect(label).toBeVisible()
    expect(input).toBeVisible()

    // Focus and type
    await userEvent.click(input)
    await userEvent.type(input, '75.5', { delay: 50 })

    // Check value. The displayed value carries the '%' suffix by design
    // (showPercentSymbol defaults to true); the decimal must survive typing
    // — the old keystroke reformatter turned '75.5' into '100%'.
    await expect(input).toHaveValue('75.5%')
  },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY: SPINBUTTON SEMANTICS + KEYBOARD STEPPING
// --------------------------------------------------------------------------

/**
 * The field is exposed as a WAI-ARIA `spinbutton`: it carries
 * aria-valuenow / aria-valuemin / aria-valuemax and a human-readable
 * aria-valuetext ("50%"), and it steps with ArrowUp / ArrowDown — matching a
 * native <input type="number">. This is the primary keyboard path for users
 * who never touch the +/- buttons (WCAG 4.1.2, 2.1.1).
 */
export const KeyboardStepping: Story = {
  name: 'A11y — Keyboard Stepping (Arrow keys)',
  render: () => (
    <PercentageFieldWithState
      label="Keyboard Percentage"
      initialValue="50"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton', { name: /Keyboard Percentage/i })

    // Spinbutton value semantics are exposed to assistive technology.
    await expect(input).toHaveAttribute('aria-valuemin', '0')
    await expect(input).toHaveAttribute('aria-valuemax', '100')
    await expect(input).toHaveAttribute('aria-valuenow', '50')
    await expect(input).toHaveAttribute('aria-valuetext', '50%')

    // ArrowUp / ArrowDown step by `step` (default 1) and keep the exposed
    // value in sync — no mouse required.
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowUp}')
    await expect(input).toHaveValue('51%')
    await expect(input).toHaveAttribute('aria-valuenow', '51')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(input).toHaveValue('49%')
    await expect(input).toHaveAttribute('aria-valuenow', '49')
  },
}

/**
 * The +/- buttons are reachable by Tab and activate with Enter/Space — a
 * regression guard for the old mousedown-only handlers, which fired on
 * `mousedown` only and were completely inert for keyboard users (WCAG 2.1.1).
 * Each stepper's accessible name references the field label ("Increase Stepper
 * Percentage" / "Decrease Stepper Percentage") so multiple steppers on a page
 * stay distinguishable to AT (WCAG 2.4.6 / 4.1.2).
 */
export const ButtonKeyboardActivation: Story = {
  name: 'A11y — Button Keyboard Activation (Tab + Enter)',
  render: () => (
    <PercentageFieldWithState
      label="Stepper Percentage"
      initialValue="10"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton', { name: /Stepper Percentage/i })
    // The stepper names are label-scoped, not the bare "increment"/"decrement".
    const incrementButton = canvas.getByRole('button', {
      name: 'Increase Stepper Percentage',
    })
    const decrementButton = canvas.getByRole('button', {
      name: 'Decrease Stepper Percentage',
    })

    // Tab from the input reaches the increment button, and Enter activates it.
    await userEvent.click(input)
    await userEvent.tab()
    await expect(incrementButton).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('11%')

    // Tab again to the decrement button; Space activates it.
    await userEvent.tab()
    await expect(decrementButton).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(input).toHaveValue('10%')

    // The data-action selector contract the ThothOS Playwright suite keys on is
    // preserved even though the aria-label is now label-scoped.
    await expect(incrementButton).toHaveAttribute('data-action', 'increment')
    await expect(decrementButton).toHaveAttribute('data-action', 'decrement')
  },
}

/**
 * Out-of-range seeds must not leak an aria-valuenow that violates the declared
 * min/max: with initialValue "150" against the default max=100 (the error-state
 * case), the spinbutton exposes aria-valuenow clamped to "100" while the visible
 * display and aria-valuetext still show the true "150%". Guards the WAI-ARIA
 * spinbutton range constraint (aria-valuenow ∈ [aria-valuemin, aria-valuemax]).
 */
export const OutOfRangeAriaClamp: Story = {
  name: 'A11y — aria-valuenow Clamped To Range (out-of-range seed)',
  render: () => (
    <PercentageField
      label="Over Max Percentage"
      initialValue="150"
      error="Percentage cannot exceed 100%."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton', {
      name: /Over Max Percentage/i,
    })

    // The declared range and the true human-readable value.
    await expect(input).toHaveAttribute('aria-valuemin', '0')
    await expect(input).toHaveAttribute('aria-valuemax', '100')
    await expect(input).toHaveValue('150%')
    await expect(input).toHaveAttribute('aria-valuetext', '150%')

    // aria-valuenow is clamped into [min, max] — never the raw out-of-range 150.
    await expect(input).toHaveAttribute('aria-valuenow', '100')
  },
}

/**
 * The below-min mirror of the clamp: initialValue "-25" against the default
 * min=0 must expose aria-valuenow "0" (not the raw -25) while the display and
 * aria-valuetext keep the truthful "-25%".
 */
export const BelowMinAriaClamp: Story = {
  name: 'A11y — aria-valuenow Clamped To Range (below-min seed)',
  render: () => (
    <PercentageField
      label="Under Min Percentage"
      initialValue="-25"
      error="Percentage cannot be negative."
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton', {
      name: /Under Min Percentage/i,
    })

    await expect(input).toHaveAttribute('aria-valuemin', '0')
    await expect(input).toHaveValue('-25%')
    await expect(input).toHaveAttribute('aria-valuetext', '-25%')
    // Clamped up to the floor, never the raw -25.
    await expect(input).toHaveAttribute('aria-valuenow', '0')
  },
}

/**
 * Pins the two CSS-only a11y states that the Chromatic baseline is the only
 * regression test for: (1) the keyboard focus rings on the input and the +/-
 * buttons (`.input:focus-visible` / `.button:focus-visible`, WCAG 2.4.7), and
 * (2) the prefers-reduced-motion transition-off guard (WCAG 2.3.3). Keyboard
 * focus (via Tab) triggers :focus-visible so the ring renders in the snapshot,
 * and the play function asserts a real outline is applied. The reduced-motion
 * rule is asserted structurally from the injected stylesheet so a rebuild that
 * drops it fails here regardless of the runner's OS motion setting.
 */
export const FocusVisibleAndReducedMotion: Story = {
  name: 'A11y — Focus Rings + Reduced-Motion Guard',
  render: () => (
    <PercentageFieldWithState
      label="Focus Ring Percentage"
      initialValue="42"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton', {
      name: /Focus Ring Percentage/i,
    })
    const incrementButton = canvas.getByRole('button', {
      name: 'Increase Focus Ring Percentage',
    })

    // Keyboard focus (Tab) → :focus-visible applies a real outline ring on the
    // input. Programmatic .focus() would not reliably match :focus-visible, so
    // drive it with the keyboard the way a real AT/keyboard user would.
    await userEvent.tab()
    await expect(input).toHaveFocus()
    const inputOutline = getComputedStyle(input).outlineStyle
    expect(inputOutline).toBe('solid')

    // Tab onward to the increment stepper — it, too, shows its own ring so a
    // keyboard user can tell WHICH control is focused.
    await userEvent.tab()
    await expect(incrementButton).toHaveFocus()
    const buttonOutline = getComputedStyle(incrementButton).outlineStyle
    expect(buttonOutline).toBe('solid')

    // Structural guard for the reduced-motion rule: a
    // @media (prefers-reduced-motion: reduce) block that zeroes the transition
    // must exist in the injected CSS, independent of the runner's motion pref.
    const hasReducedMotionRule = Array.from(document.styleSheets).some(sheet => {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        // Cross-origin sheet — skip.
        return false
      }
      return Array.from(rules).some(
        rule =>
          rule instanceof CSSMediaRule &&
          rule.conditionText.includes('prefers-reduced-motion') &&
          Array.from(rule.cssRules).some(
            inner =>
              inner instanceof CSSStyleRule &&
              // `transition: none` can serialize as "none" or "none 0s ease 0s"
              // depending on the engine — match either, and fail if a real
              // (non-none) transition is ever reintroduced under reduced-motion.
              inner.style.transition.includes('none')
          )
      )
    })
    expect(hasReducedMotionRule).toBe(true)
  },
}

/**
 * Accessible name for a LABEL-LESS field. A bare percentage spinbutton (a
 * compact filter or table cell rendered with no visible `label`) is anonymous
 * to screen readers. Passing `ariaLabel` forwards through FieldShell, which
 * applies it as `aria-label` on the input when no visible `<label>` renders, so
 * the field is still named (WCAG 4.1.2). The play function renders WITHOUT a
 * label and asserts the spinbutton carries the programmatic name.
 */
export const AriaLabelWhenLabelless: Story = {
  name: 'Aria-label (label-less)',
  render: args => <PercentageField {...args} />,
  args: {
    ariaLabel: 'Discount rate',
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The input has role="spinbutton"; its accessible name comes from the
    // forwarded aria-label since no visible <label> is rendered.
    const input = canvas.getByRole('spinbutton', { name: 'Discount rate' })
    await expect(input).toHaveAttribute('aria-label', 'Discount rate')
  },
}

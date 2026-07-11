/**
 * @fileoverview Storybook stories for the PhoneNumber component.
 * These stories showcase the various states, themes, and styling capabilities of the PhoneNumber field.
 * The PhoneNumber component provides formatted phone number input with validation.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn } from 'storybook/test'
import PhoneNumberField from './index'

// Wrapper component for state management
const PhoneNumberFieldWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  return <PhoneNumberField {...props} value={value} onChange={setValue} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof PhoneNumberField> = {
  title: 'Components/Field/PhoneNumber',
  component: PhoneNumberField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
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
type Story = StoryObj<typeof PhoneNumberField>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <PhoneNumberFieldWithState
      label="Phone Number"
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content must not sit on the default sacred canvas.
  globals: { backgrounds: { value: 'light' } },
}

export const DefaultPlaceholder: Story = {
  render: () => (
    // Mixed-theme story: each field sits on its own theme-matched surface so
    // light/dark content never renders on the default sacred canvas.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Light Theme - Default Placeholder"
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Dark Theme - Default Placeholder"
          styles={{ theme: 'dark' }}
        />
      </div>
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Sacred Theme - Default Placeholder"
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
}

export const DarkTheme: Story = {
  render: () => (
    <PhoneNumberFieldWithState
      label="Contact Number"
      placeholder="Enter phone number"
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <PhoneNumberFieldWithState
      label="Divine Communication"
      placeholder="Sacred contact..."
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
    <PhoneNumberFieldWithState
      label="Custom Styled Phone"
      placeholder="(555) 123-4567"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(240, 248, 255, 0.95)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderFocusedColor: 'rgba(59, 130, 246, 1)',
        textColor: 'rgba(30, 64, 175, 1)',
        // 0.85 alpha composites to #405dbb on white — 6.00:1 (0.7 was 4.13:1).
        labelColor: 'rgba(30, 64, 175, 0.85)',
      }}
    />
  ),
  // Light-themed demo: pin the light canvas (was inheriting sacred #0e0e0e).
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <PhoneNumberFieldWithState
      label="Neon Phone Input"
      placeholder="(555) 123-4567"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderFocusedColor: 'rgba(34, 197, 94, 1)',
        textColor: 'rgba(34, 197, 94, 1)',
        // 0.8 alpha composites to #1fa253 on the #111827 canvas — 5.37:1
        // (0.7 landed at 4.40:1, just under the 4.5 requirement).
        labelColor: 'rgba(34, 197, 94, 0.8)',
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
      <PhoneNumberFieldWithState
        label="Large Padding"
        placeholder="(555) 123-4567"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <PhoneNumberFieldWithState
        label="Custom Dimensions"
        placeholder="Fixed height"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <PhoneNumberFieldWithState
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
  // All-light-themed demo: pin the light canvas (was inheriting sacred).
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneNumberFieldWithState
        label="Large Text"
        placeholder="(555) 123-4567"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <PhoneNumberFieldWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <PhoneNumberFieldWithState
        label="Small & Light"
        placeholder="(555) 123-4567"
        styles={{
          theme: 'light',
          fontSize: '14px',
          fontWeight: 300,
          padding: '12px',
        }}
      />
    </div>
  ),
  // All-light-themed demo: pin the light canvas (was inheriting sacred).
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  render: () => (
    // Mixed-theme story: each field sits on its own theme-matched surface so
    // the light-theme danger text (#b91c1c) isn't measured against the default
    // sacred canvas (#0e0e0e) — it was 2.98:1 there, 6.47:1 on white.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Phone Number"
          initialValue="555-123"
          error="Please enter a valid phone number."
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Contact Number"
          placeholder="This field is required"
          error="Phone number is required."
          styles={{
            theme: 'dark',
            borderErrorColor: 'rgba(255, 99, 71, 1)',
            labelErrorColor: 'rgba(255, 99, 71, 1)',
            footerTextErrorColor: 'rgba(255, 99, 71, 1)',
          }}
        />
      </div>
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Sacred Contact"
          initialValue="invalid-number"
          error="The sacred digits are not aligned."
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  render: () => (
    // Mixed-theme story: each theme block sits on its own matched surface so
    // light/dark content never renders on the default sacred canvas.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        <PhoneNumberFieldWithState
          label="Required Phone"
          placeholder="(555) 123-4567"
          required
          styles={{ theme: 'light' }}
        />
        <PhoneNumberFieldWithState
          label="Emergency Contact"
          placeholder="Enter emergency contact"
          required
          error="This field is required"
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Business Phone"
          placeholder="Enter business number"
          required
          styles={{ theme: 'dark' }}
        />
      </div>
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Custom Required Indicator"
          placeholder="Enter divine number"
          required
          styles={{
            theme: 'sacred',
            requiredIndicatorText: ' (required)',
            requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
          }}
        />
      </div>
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
          <PhoneNumberFieldWithState
            label="Basic Phone"
            placeholder="(555) 123-4567"
            styles={{ theme: 'light' }}
          />
          <PhoneNumberFieldWithState
            label="Phone Number"
            initialValue="555-123"
            error="Invalid format"
            styles={{ theme: 'light' }}
          />
          <PhoneNumberFieldWithState
            label="Emergency Contact"
            placeholder="Required field"
            required
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section — rendered on its own dark surface so the
          dark-themed labels/heading aren't measured against the light canvas */}
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PhoneNumberFieldWithState
            label="Basic Dark"
            placeholder="(555) 123-4567"
            styles={{ theme: 'dark' }}
          />
          <PhoneNumberFieldWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <PhoneNumberFieldWithState
            label="Large Size"
            placeholder="(555) 123-4567"
            styles={{
              theme: 'dark',
              fontSize: '18px',
              padding: '20px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — rendered on its own near-black surface (the
          sacred control bg is translucent black, unreadable over white) */}
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PhoneNumberFieldWithState
            label="Divine Contact"
            placeholder="Sacred numbers"
            styles={{ theme: 'sacred' }}
          />
          <PhoneNumberFieldWithState
            label="Sacred Phone"
            initialValue="forbidden"
            error="Invalid sacred digits"
            styles={{ theme: 'sacred' }}
          />
          <PhoneNumberFieldWithState
            label="Holy Number"
            placeholder="Enter divine digits"
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
          {/* Dark neon field on a matching dark sub-surface; purple-400
              #c084fc reads 6.71:1 on #111827 and 7.90:1 on the near-black
              input bg (the old #9333ea was 3.61:1 on its own background). */}
          <div
            style={{
              background: '#111827',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <PhoneNumberFieldWithState
              label="Neon Style"
              placeholder="(555) 123-4567"
              styles={{
                theme: 'dark',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderColor: 'rgba(147, 51, 234, 0.5)',
                borderFocusedColor: 'rgba(147, 51, 234, 1)',
                textColor: 'rgba(192, 132, 252, 1)',
                labelColor: 'rgba(192, 132, 252, 1)',
                borderRadius: '20px',
                borderWidth: '2px',
              }}
            />
          </div>
          <PhoneNumberFieldWithState
            label="Soft Rounded"
            placeholder="(555) 123-4567"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <PhoneNumberFieldWithState
            label="Minimal"
            placeholder="(555) 123-4567"
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
    // Mixed-theme story: each field sits on its own theme-matched surface so
    // light/dark content never renders on the default sacred canvas.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Disabled Light"
          initialValue="(555) 123-4567"
          disabled
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Disabled Dark"
          initialValue="(555) 123-4567"
          disabled
          styles={{ theme: 'dark' }}
        />
      </div>
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <PhoneNumberFieldWithState
          label="Disabled Sacred"
          initialValue="(555) 123-4567"
          disabled
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

const onValidationSuccess = fn()

const PhoneValidationDemo = () => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const validatePhone = (value: string) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
    if (value.trim() === '') {
      setError('Phone number is required')
    } else if (!phoneRegex.test(value)) {
      setError('Please enter a valid phone number format: (555) 123-4567')
    } else {
      setError('')
    }
  }

  const handleSubmit = () => {
    validatePhone(phone)
    if (error === '' && phone.trim() !== '') {
      onValidationSuccess('Phone number validated successfully!')
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Phone Number Validation</h3>
      <PhoneNumberField
        label="Phone Number"
        placeholder="(555) 123-4567"
        value={phone}
        onChange={value => {
          setPhone(value)
          if (error) validatePhone(value)
        }}
        helperText={error}
        styles={{ theme: 'light', required: true }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // Blue-600: white text reads 5.17:1 (blue-500 #3B82F6 was 3.67:1).
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        Validate Phone
      </button>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        Enter a phone number in the format (555) 123-4567 to see validation in
        action.
      </p>
    </div>
  )
}

export const ValidationDemo: Story = {
  render: () => <PhoneValidationDemo />,
  // Light-themed demo (default-color heading/copy + light field): pin the
  // light canvas — on the inherited sacred canvas the #000 heading was 1.08:1.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <PhoneNumberFieldWithState
      label="Test Phone Input"
      placeholder="(555) 123-4567"
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content: pin the light canvas (same canvas-mismatch class
  // as LightTheme; unflagged only because the play fn fills the field).
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('(555) 123-4567')
    const label = canvas.getByText('Test Phone Input')

    // Initial state
    expect(label).toBeVisible()
    expect(input).toBeVisible()

    // Focus and type
    await userEvent.click(input)
    await userEvent.type(input, '5551234567', { delay: 50 })

    // Check that phone formatting is applied
    await expect(input).toHaveValue('(555) 123-4567')
  },
}

// --------------------------------------------------------------------------
// A11Y: KEYBOARD FOCUS INDICATOR (WCAG 2.1.1 + 2.4.7)
// --------------------------------------------------------------------------

/**
 * Regression guard for the visible focus indicator. The input sets
 * `outline: none` and renders inside PhoneNumber's own `.inputWrapper` (not
 * FieldShell's `.inputSlot`), so a keyboard user would get no visible focus
 * indication unless the `.inputWrapper:focus-within` ring is present. The play
 * fn Tab-reaches the input (keyboard operability, WCAG 2.1.1) and asserts the
 * wrapper renders a focus ring (box-shadow) only while focused (WCAG 2.4.7).
 */
export const FocusIndicatorTest: Story = {
  render: () => (
    <PhoneNumberFieldWithState
      label="Keyboard Focus"
      placeholder="555-555-5555"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('555-555-5555')
    // The input's direct parent is the .inputWrapper (prefix + input siblings).
    const wrapper = input.parentElement as HTMLElement

    // Before focus: no ring on the wrapper.
    expect(getComputedStyle(wrapper).boxShadow).toBe('none')

    // Keyboard-reachable: a single Tab from the canvas lands on the input.
    await userEvent.tab()
    await expect(input).toHaveFocus()

    // While focused: the :focus-within ring is applied (visible indicator).
    expect(getComputedStyle(wrapper).boxShadow).not.toBe('none')
  },
}

// --------------------------------------------------------------------------
// A11Y: AUTOCOMPLETE / INPUT PURPOSE (WCAG 1.3.5)
// --------------------------------------------------------------------------

/**
 * Regression guard for input-purpose identification. The field defaults its
 * native `autocomplete` to `'tel'` so browsers / assistive tech can identify
 * the input purpose and offer the stored phone number for autofill (WCAG
 * 1.3.5). A caller-supplied token still overrides the default.
 */
export const AutocompleteDefault: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneNumberFieldWithState
        label="Default (tel)"
        placeholder="555-555-5555"
        styles={{ theme: 'light' }}
      />
      <PhoneNumberFieldWithState
        label="Override (off)"
        placeholder="No autofill"
        autoComplete="off"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const defaultInput = canvas.getByPlaceholderText('555-555-5555')
    const overrideInput = canvas.getByPlaceholderText('No autofill')

    // Accessible-by-default: purpose identified as a telephone number.
    expect(defaultInput).toHaveAttribute('autocomplete', 'tel')
    // Caller override still wins.
    expect(overrideInput).toHaveAttribute('autocomplete', 'off')
  },
}

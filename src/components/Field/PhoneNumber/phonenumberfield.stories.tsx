/**
 * @fileoverview Storybook stories for the PhoneNumber component.
 * These stories showcase the various states, themes, and styling capabilities of the PhoneNumber field.
 * The PhoneNumber component provides formatted phone number input with validation.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
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
  tags: ['autodocs'],
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
}

export const DefaultPlaceholder: Story = {
  name: 'Default Placeholder',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneNumberFieldWithState
        label="Light Theme - Default Placeholder"
        styles={{ theme: 'light' }}
      />
      <PhoneNumberFieldWithState
        label="Dark Theme - Default Placeholder"
        styles={{ theme: 'dark' }}
      />
      <PhoneNumberFieldWithState
        label="Sacred Theme - Default Placeholder"
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <PhoneNumberFieldWithState
      label="Contact Number"
      placeholder="Enter phone number"
      styles={{ theme: 'dark' }}
    />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: () => (
    <PhoneNumberFieldWithState
      label="Divine Communication"
      placeholder="Sacred contact..."
      styles={{ theme: 'sacred' }}
    />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Custom Colors',
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
        labelColor: 'rgba(30, 64, 175, 0.7)',
      }}
    />
  ),
}

export const NeonStyle: Story = {
  name: 'Neon Style',
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
        labelColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
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
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  name: 'Custom Typography',
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
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  name: 'Error States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneNumberFieldWithState
        label="Phone Number"
        initialValue="555-123"
        error="Please enter a valid phone number."
        styles={{ theme: 'light' }}
      />
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
      <PhoneNumberFieldWithState
        label="Sacred Contact"
        initialValue="invalid-number"
        error="The sacred digits are not aligned."
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  name: 'Required Fields',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
      <PhoneNumberFieldWithState
        label="Business Phone"
        placeholder="Enter business number"
        required
        styles={{ theme: 'dark' }}
      />
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
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  name: 'Comprehensive Showcase',
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

      {/* Dark Theme Section */}
      <div>
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

      {/* Sacred Theme Section */}
      <div>
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
          <PhoneNumberFieldWithState
            label="Neon Style"
            placeholder="(555) 123-4567"
            styles={{
              theme: 'dark',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderFocusedColor: 'rgba(147, 51, 234, 1)',
              textColor: 'rgba(147, 51, 234, 1)',
              labelColor: 'rgba(147, 51, 234, 0.8)',
              borderRadius: '20px',
              borderWidth: '2px',
            }}
          />
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
    backgrounds: { default: 'light' },
  },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  name: 'Disabled States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneNumberFieldWithState
        label="Disabled Light"
        initialValue="(555) 123-4567"
        disabled
        styles={{ theme: 'light' }}
      />
      <PhoneNumberFieldWithState
        label="Disabled Dark"
        initialValue="(555) 123-4567"
        disabled
        styles={{ theme: 'dark' }}
      />
      <PhoneNumberFieldWithState
        label="Disabled Sacred"
        initialValue="(555) 123-4567"
        disabled
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

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
      alert('Phone number validated successfully!')
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
          backgroundColor: '#3B82F6',
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
  name: 'Validation Demo',
  render: () => <PhoneValidationDemo />,
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  render: () => (
    <PhoneNumberFieldWithState
      label="Test Phone Input"
      placeholder="(555) 123-4567"
      styles={{ theme: 'light' }}
    />
  ),
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

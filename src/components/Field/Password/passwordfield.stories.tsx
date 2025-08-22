/**
 * @fileoverview Storybook stories for the Password component.
 * These stories showcase the various states, themes, and styling capabilities of the Password field.
 * The Password component provides secure password input with visibility toggle functionality.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import PasswordField from './index'

// Wrapper component for state management
const PasswordFieldWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return <PasswordField {...props} value={value} onChange={handleChange} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof PasswordField> = {
  title: 'Components/Field/Password',
  component: PasswordField,
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
type Story = StoryObj<typeof PasswordField>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <PasswordFieldWithState
      label="Password"
      placeholder="Enter your password"
      styles={{ theme: 'light' }}
    />
  ),
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <PasswordFieldWithState
      label="Secure Password"
      placeholder="Enter secure password"
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
    <PasswordFieldWithState
      label="Secret Incantation"
      placeholder="Enter sacred words..."
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
    <PasswordFieldWithState
      label="Custom Styled Password"
      placeholder="Enter password"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 235, 238, 0.95)',
        borderColor: 'rgba(220, 38, 127, 0.4)',
        borderFocusedColor: 'rgba(220, 38, 127, 1)',
        textColor: 'rgba(136, 19, 55, 1)',
        labelColor: 'rgba(136, 19, 55, 0.7)',
      }}
    />
  ),
}

export const NeonStyle: Story = {
  name: 'Neon Style',
  render: () => (
    <PasswordFieldWithState
      label="Neon Password"
      placeholder="Enter neon password"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderFocusedColor: 'rgba(255, 215, 0, 1)',
        textColor: 'rgba(255, 215, 0, 1)',
        labelColor: 'rgba(255, 215, 0, 0.7)',
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
      <PasswordFieldWithState
        label="Large Padding"
        placeholder="Extra space inside"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <PasswordFieldWithState
        label="Custom Dimensions"
        placeholder="Fixed height"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <PasswordFieldWithState
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
      <PasswordFieldWithState
        label="Large Text"
        placeholder="Bigger password field"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <PasswordFieldWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <PasswordFieldWithState
        label="Small & Light"
        placeholder="Subtle appearance"
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
      <PasswordFieldWithState
        label="Password"
        initialValue="weak"
        error="Password is too weak. Must be at least 8 characters."
        styles={{ theme: 'light' }}
      />
      <PasswordFieldWithState
        label="Confirm Password"
        placeholder="Confirm your password"
        error="Passwords do not match."
        styles={{
          theme: 'dark',
          borderErrorColor: 'rgba(255, 99, 71, 1)',
          labelErrorColor: 'rgba(255, 99, 71, 1)',
          footerTextErrorColor: 'rgba(255, 99, 71, 1)',
        }}
      />
      <PasswordFieldWithState
        label="Sacred Key"
        initialValue="forbidden"
        error="The sacred key is corrupted."
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
      <PasswordFieldWithState
        label="Required Password"
        placeholder="Enter your password"
        required
        styles={{ theme: 'light' }}
      />
      <PasswordFieldWithState
        label="Current Password"
        placeholder="Enter current password"
        required
        error="This field is required"
        styles={{ theme: 'light' }}
      />
      <PasswordFieldWithState
        label="New Password"
        placeholder="Enter new password"
        required
        styles={{ theme: 'dark' }}
      />
      <PasswordFieldWithState
        label="Custom Required Password"
        placeholder="Enter sacred password"
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
          <PasswordFieldWithState
            label="Basic Password"
            placeholder="Enter password"
            styles={{ theme: 'light' }}
          />
          <PasswordFieldWithState
            label="Password Field"
            initialValue="weak"
            error="Password too weak"
            styles={{ theme: 'light' }}
          />
          <PasswordFieldWithState
            label="Required Password"
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
          <PasswordFieldWithState
            label="Basic Dark"
            placeholder="Enter password"
            styles={{ theme: 'dark' }}
          />
          <PasswordFieldWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <PasswordFieldWithState
            label="Large Size"
            placeholder="Enter password"
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
          <PasswordFieldWithState
            label="Sacred Key"
            placeholder="Secret incantation"
            styles={{ theme: 'sacred' }}
          />
          <PasswordFieldWithState
            label="Sacred Password"
            initialValue="forbidden"
            error="Key corrupted"
            styles={{ theme: 'sacred' }}
          />
          <PasswordFieldWithState
            label="Divine Password"
            placeholder="Enter divine key"
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
          <PasswordFieldWithState
            label="Neon Style"
            placeholder="Enter password"
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
          <PasswordFieldWithState
            label="Soft Rounded"
            placeholder="Enter password"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <PasswordFieldWithState
            label="Minimal"
            placeholder="Enter password"
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
      <PasswordFieldWithState
        label="Disabled Light"
        initialValue="cannot-edit"
        disabled
        styles={{ theme: 'light' }}
      />
      <PasswordFieldWithState
        label="Disabled Dark"
        initialValue="locked-password"
        disabled
        styles={{ theme: 'dark' }}
      />
      <PasswordFieldWithState
        label="Disabled Sacred"
        initialValue="sealed-key"
        disabled
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

const PasswordValidationDemo = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' })

  const validatePassword = (pwd: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

    if (pwd.length < minLength) {
      return 'Password must be at least 8 characters long'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    return ''
  }

  const validateConfirmPassword = (pwd: string, confirmPwd: string) => {
    if (pwd !== confirmPwd) {
      return 'Passwords do not match'
    }
    return ''
  }

  const handleSubmit = () => {
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    )

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
    setPassword(newPassword)
    setErrors(prev => ({
      ...prev,
      password: validatePassword(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    }))
  }

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = event.target.value
    setConfirmPassword(newConfirmPassword)
    setErrors(prev => ({
      ...prev,
      confirmPassword: validateConfirmPassword(password, newConfirmPassword),
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={handlePasswordChange}
        helperText={errors.password}
        styles={{ theme: 'light', required: true }}
      />
      <PasswordField
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        helperText={errors.confirmPassword}
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
        }}
      >
        Validate
      </button>
    </div>
  )
}

export const ValidationDemo: Story = {
  name: 'Validation Demo',
  render: () => <PasswordValidationDemo />,
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  render: () => (
    <PasswordFieldWithState
      label="Test Password Input"
      placeholder="Enter password for testing"
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Enter password for testing')
    const label = canvas.getByText('Test Password Input')

    // Initial state
    expect(label).toBeVisible()
    expect(input).toBeVisible()

    // Check that input type is password
    expect(input).toHaveAttribute('type', 'password')

    // Focus and type
    await userEvent.click(input)
    await userEvent.type(input, 'SecurePassword123!', { delay: 50 })

    // Check value (should be masked)
    await expect(input).toHaveValue('SecurePassword123!')
  },
}

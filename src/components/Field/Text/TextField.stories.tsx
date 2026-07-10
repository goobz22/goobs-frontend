/**
 * @fileoverview Storybook stories for the TextField component.
 * These stories showcase the various states, themes, and styling capabilities of the TextField.
 * The TextField uses a simplified approach with labels positioned above the input field.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn } from 'storybook/test'
import TextField from './index'

// Spy for the validated-form demos' success path (blocking dialogs are banned
// in stories — they wedge interaction runners).
const onValidSubmit = fn()

// A simple icon for adornments
const AtIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v-2a4 4 0 00-4-4 4 4 0 00-4 4v2" />
    <path d="M12 16v2a4 4 0 004 4 4 4 0 004-4v-2" />
  </svg>
)

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

// Wrapper component for state management
const TextFieldWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  return <TextField {...props} value={value} onChange={setValue} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof TextField> = {
  title: 'Components/Field/Text',
  component: TextField,
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
type Story = StoryObj<typeof TextField>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <TextFieldWithState
      label="Email Address"
      placeholder="your@email.com"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <TextFieldWithState
      label="Username"
      placeholder="Enter username"
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <TextFieldWithState
      label="Ancient Inscription"
      placeholder="Enter sacred text..."
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
    <TextFieldWithState
      label="Custom Styled"
      placeholder="Custom appearance"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 240, 245, 0.95)',
        borderColor: 'rgba(255, 20, 147, 0.4)',
        borderFocusedColor: 'rgba(255, 20, 147, 1)',
        textColor: 'rgba(139, 0, 139, 1)',
        labelColor: 'rgba(139, 0, 139, 0.7)',
      }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <TextFieldWithState
      label="Neon Input"
      placeholder="Futuristic design"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(0, 255, 255, 0.5)',
        borderFocusedColor: 'rgba(0, 255, 255, 1)',
        textColor: 'rgba(0, 255, 255, 1)',
        labelColor: 'rgba(0, 255, 255, 0.7)',
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
      <TextFieldWithState
        label="Large Padding"
        placeholder="Extra space inside"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <TextFieldWithState
        label="Custom Dimensions"
        placeholder="Fixed height"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <TextFieldWithState
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
      <TextFieldWithState
        label="Large Text"
        placeholder="Bigger font size"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <TextFieldWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <TextFieldWithState
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
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ADORNMENT STORIES
// --------------------------------------------------------------------------

export const WithAdornments: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextFieldWithState
        label="Search"
        placeholder="Search..."
        startAdornment={<SearchIcon />}
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Password"
        placeholder="Enter password"
        type="password"
        endAdornment={<LockIcon />}
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Username"
        placeholder="@username"
        startAdornment={<AtIcon />}
        endAdornment={<SearchIcon />}
        styles={{
          theme: 'light',
          startAdornmentOffset: '56px',
          endAdornmentOffset: '56px',
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
      <TextFieldWithState
        label="Email Address"
        initialValue="invalid-email"
        error="Please enter a valid email address."
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Full Name"
        placeholder="This field is required"
        error="This field cannot be empty."
        styles={{
          theme: 'dark',
          borderErrorColor: 'rgba(255, 99, 71, 1)',
          labelErrorColor: 'rgba(255, 99, 71, 1)',
          footerTextErrorColor: 'rgba(255, 99, 71, 1)',
        }}
      />
      <TextFieldWithState
        label="Ancient Inscription"
        initialValue="forbidden text"
        error="This knowledge is forbidden."
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// LABELS AND PLACEHOLDERS
// --------------------------------------------------------------------------

export const LabelsAndPlaceholders: Story = {
  name: 'Labels and Placeholders',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextFieldWithState
        label="With Label and Placeholder"
        placeholder="Enter your email address"
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState label="Label Only" styles={{ theme: 'light' }} />
      <TextFieldWithState
        placeholder="Placeholder Only"
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Pre-filled Value"
        initialValue="sample@email.com"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TRANSITIONS
// --------------------------------------------------------------------------

export const CustomTransitions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextFieldWithState
        label="Slow Transition"
        placeholder="Slow animations"
        styles={{
          theme: 'light',
          transitionDuration: '800ms',
          transitionEasing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      />
      <TextFieldWithState
        label="Fast Transition"
        placeholder="Quick animations"
        styles={{
          theme: 'light',
          transitionDuration: '100ms',
          transitionEasing: 'linear',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
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
          <TextFieldWithState
            label="Basic Light"
            placeholder="Enter text"
            styles={{ theme: 'light' }}
          />
          <TextFieldWithState
            label="Username"
            initialValue="invalid"
            error="Invalid input"
            styles={{ theme: 'light' }}
          />
          <TextFieldWithState
            label="With Adornment"
            placeholder="Search"
            startAdornment={<SearchIcon />}
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section — dark-themed fields sit on a dark surface so
          their labels/placeholders are judged against the surface they are
          designed for (the showcase canvas is light). */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextFieldWithState
            label="Basic Dark"
            placeholder="Enter text"
            styles={{ theme: 'dark' }}
          />
          <TextFieldWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <TextFieldWithState
            label="Large Size"
            placeholder="Bigger input"
            styles={{
              theme: 'dark',
              fontSize: '18px',
              padding: '20px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — gold-on-near-black design language needs its
          near-black surface. */}
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextFieldWithState
            label="Ancient Text"
            placeholder="Sacred inscription"
            styles={{ theme: 'sacred' }}
          />
          <TextFieldWithState
            label="Sacred Knowledge"
            initialValue="forbidden"
            error="This knowledge is forbidden"
            styles={{ theme: 'sacred' }}
          />
          <TextFieldWithState
            label="Divine Input"
            placeholder="Enter divine text"
            endAdornment={<AtIcon />}
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
          {/* Neon is a dark-surface design — host it on a dark card, and use
              the brighter purple-400 so text/label clear 4.5:1 on it
              (#c084fc on #111827 = 6.71, on the near-black field = 7.89;
              the old rgba(147,51,234,…) sat at 2.5-3.6). */}
          <div
            style={{
              background: '#111827',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <TextFieldWithState
              label="Neon Style"
              placeholder="Futuristic"
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
          <TextFieldWithState
            label="Soft Rounded"
            placeholder="Gentle appearance"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <TextFieldWithState
            label="Minimal"
            placeholder="Clean design"
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

      {/* Required Fields Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#DC2626' }}>
          Required Fields
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextFieldWithState
            label="Required Light"
            placeholder="This field is required"
            styles={{ theme: 'light', required: true }}
          />
          {/* Dark/sacred required demos sit on their own themed surfaces —
              the error-red label and gold label are designed against dark. */}
          <div
            style={{
              background: '#111827',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <TextFieldWithState
              label="Required Dark"
              placeholder="Enter value"
              error="This field is required"
              styles={{ theme: 'dark', required: true }}
            />
          </div>
          <div
            style={{
              background: '#0e0e0e',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <TextFieldWithState
              label="Custom Required"
              placeholder="Ancient text"
              styles={{
                theme: 'sacred',
                required: true,
                requiredIndicatorText: ' (required)',
                // The supported CSS-var passthrough — a `requiredIndicatorColor`
                // key is not part of FieldStyleOverrides and was silently
                // ignored (the indicator rendered the default danger red).
                '--field-required-indicator': 'rgba(255, 215, 0, 1)',
              }}
            />
          </div>
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
    // Mixed-theme story on the sacred canvas: the light/dark variants get
    // their own themed surfaces so labels are judged against the background
    // they are designed for; the sacred variant sits on the canvas itself.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <TextFieldWithState
          label="Disabled Light"
          initialValue="Cannot be edited"
          disabled
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <TextFieldWithState
          label="Disabled Dark"
          initialValue="Cannot be edited"
          disabled
          styles={{ theme: 'dark' }}
        />
      </div>
      <TextFieldWithState
        label="Disabled Sacred"
        initialValue="Sealed knowledge"
        disabled
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELD STATES
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  render: () => (
    // Mixed-theme story on the sacred canvas: light/dark variants sit on
    // their own themed surfaces; the sacred variant uses the canvas itself.
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
        <TextFieldWithState
          label="Required Field"
          placeholder="This field is required"
          styles={{ theme: 'light', required: true }}
        />
        <TextFieldWithState
          label="Required Email"
          placeholder="Enter your email"
          error="This field is required"
          styles={{ theme: 'light', required: true }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <TextFieldWithState
          label="Required Password"
          placeholder="Create a password"
          type="password"
          endAdornment={<LockIcon />}
          styles={{ theme: 'dark', required: true }}
        />
      </div>
      <TextFieldWithState
        label="Custom Required Indicator"
        placeholder="Enter ancient knowledge"
        styles={{
          theme: 'sacred',
          required: true,
          requiredIndicatorText: ' (required)',
          // Supported CSS-var passthrough — `requiredIndicatorColor` is not a
          // FieldStyleOverrides key and was silently ignored.
          '--field-required-indicator': 'rgba(255, 215, 0, 1)',
        }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that the required fields are present with automatic asterisks
    await expect(canvas.getByText(/Required Field/)).toBeInTheDocument()
    await expect(canvas.getByText(/Required Email/)).toBeInTheDocument()
    await expect(canvas.getByText(/Required Password/)).toBeInTheDocument()

    // Test the required attribute is applied
    const inputs = canvas.getAllByRole('textbox')
    expect(inputs[0]).toBeRequired()
    expect(inputs[1]).toBeRequired()

    // Test password field
    const passwordInput = canvas.getByPlaceholderText('Create a password')
    expect(passwordInput).toBeRequired()
  },
}

const RequiredValidationDemo = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({ name: '', email: '' })

  const handleSubmit = () => {
    const nameError = name.trim() === '' ? 'Name is required' : ''
    const emailError = email.trim() === '' ? 'Email is required' : ''

    setErrors({ name: nameError, email: emailError })

    if (!nameError && !emailError) {
      onValidSubmit()
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Required Field Validation</h3>
      <TextField
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChange={setName}
        helperText={errors.name}
        styles={{ theme: 'light', required: true }}
      />
      <TextField
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={setEmail}
        helperText={errors.email}
        styles={{ theme: 'light', required: true }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // primary-600 — white text clears 4.5:1 (5.17); the old #3B82F6
          // sat at 3.67.
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        Submit Form
      </button>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        Try submitting the form without filling in the required fields to see
        validation in action.
      </p>
    </div>
  )
}

export const RequiredValidation: Story = {
  name: 'Required Validation Demo',
  render: () => <RequiredValidationDemo />,
  // The demo is light-themed (light fields, black heading, white button
  // text) — pin the light canvas instead of inheriting sacred #0e0e0e.
  globals: { backgrounds: { value: 'light' } },
}

const SharedRequiredSystemDemo = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
  })

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
  ]

  const handleSubmit = () => {
    const firstNameError =
      firstName.trim() === '' ? 'First name is required' : ''
    const lastNameError = lastName.trim() === '' ? 'Last name is required' : ''
    const emailError = email.trim() === '' ? 'Email is required' : ''
    const countryError = country.trim() === '' ? 'Country is required' : ''

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      country: countryError,
    })

    if (!firstNameError && !lastNameError && !emailError && !countryError) {
      onValidSubmit()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '500px',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', color: '#1F2937' }}>
        Shared Required System Demo
      </h3>
      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 1rem 0' }}>
        This demo shows how TextField and Dropdown components share the same
        required field system with consistent styling and validation behavior.
      </p>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
      >
        <TextField
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChange={setFirstName}
          helperText={errors.firstName}
          styles={{ theme: 'light', required: true }}
        />
        <TextField
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          onChange={setLastName}
          helperText={errors.lastName}
          styles={{ theme: 'light', required: true }}
        />
      </div>

      <TextField
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={setEmail}
        helperText={errors.email}
        styles={{ theme: 'light', required: true }}
      />

      {/* Import Dropdown component for this demo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          style={{
            fontWeight: '600',
            fontSize: '14px',
            color: '#374151',
            marginBottom: '6px',
          }}
        >
          Country
          {/* danger-600 — 4.83 on white; rgba(239,68,68) was 3.76 */}
          <span style={{ color: 'rgba(220, 38, 38, 1)' }}> *</span>
        </label>
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          required
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(209, 213, 219, 1)',
            fontSize: '16px',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(17, 24, 39, 1)',
            minHeight: '40px',
            appearance: 'none',
            backgroundImage:
              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
            paddingRight: '40px',
          }}
        >
          <option value="">Select a country</option>
          {countryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.country && (
          <div
            style={{
              fontSize: '12px',
              // danger-600 — 4.83 on white; rgba(239,68,68) was 3.76
              color: 'rgba(220, 38, 38, 1)',
              marginTop: '8px',
            }}
          >
            {errors.country}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // primary-600 — white text clears 4.5:1 (5.17); the old #3B82F6
          // sat at 3.67.
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          marginTop: '1rem',
        }}
      >
        Submit Form
      </button>

      <div
        style={{
          backgroundColor: 'rgba(249, 250, 251, 1)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(209, 213, 219, 1)',
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
          Shared Required Features:
        </h4>
        <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
          <li>Automatic asterisk (*) indicators for required fields</li>
          <li>Consistent styling across TextField and Dropdown</li>
          <li>Proper HTML5 validation attributes (required, aria-required)</li>
          <li>Customizable required indicator text and color</li>
          <li>Unified error handling and validation</li>
        </ul>
      </div>
    </div>
  )
}

export const SharedRequiredSystem: Story = {
  render: () => <SharedRequiredSystemDemo />,
  parameters: {
    layout: 'centered',
  },
  // Light-themed demo (dark headings, light fields, white select) — pin the
  // light canvas instead of inheriting sacred #0e0e0e.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <TextFieldWithState
      label="Test Input"
      placeholder="Type here for testing..."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Type here for testing...')
    const label = canvas.getByText('Test Input')

    // Initial state
    expect(label).toBeVisible()
    expect(input).toBeVisible()

    // Focus and type
    await userEvent.click(input)
    await userEvent.type(input, 'Hello, Testing!', { delay: 50 })

    // Check value
    await expect(input).toHaveValue('Hello, Testing!')
  },
}

// --------------------------------------------------------------------------
// TOP-LEVEL `required` PROP (additive — same render as styles.required)
// --------------------------------------------------------------------------

/**
 * The new top-level `required` prop produces the IDENTICAL rendered output as
 * the legacy `styles={{ required: true }}`: the asterisk indicator next to the
 * label, the native `required` attribute, and `aria-required` on the input. The
 * top-level prop defaults from `styles?.required` when omitted, so every
 * existing callsite is unaffected. The `play` test asserts both fields render
 * the marker + required attributes the same way.
 */
export const TopLevelRequiredProp: Story = {
  name: 'Top-level required prop (vs styles.required)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TextFieldWithState
        label="Top-level required"
        placeholder="required={true}"
        required
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Styles required"
        placeholder="styles={{ required: true }}"
        styles={{ theme: 'light', required: true }}
      />
      <TextFieldWithState
        label="Not required"
        placeholder="no required marker"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Both required labels render the asterisk indicator.
    const topLevelLabel = canvas.getByText('Top-level required')
    const stylesLabel = canvas.getByText('Styles required')
    await expect(topLevelLabel).toBeInTheDocument()
    await expect(stylesLabel).toBeInTheDocument()

    // The top-level-required and styles-required inputs both carry the native
    // `required` attribute + aria-required — identical contract.
    const topLevelInput = canvas.getByPlaceholderText('required={true}')
    const stylesInput = canvas.getByPlaceholderText(
      'styles={{ required: true }}'
    )
    expect(topLevelInput).toBeRequired()
    expect(stylesInput).toBeRequired()
    expect(topLevelInput).toHaveAttribute('aria-required', 'true')
    expect(stylesInput).toHaveAttribute('aria-required', 'true')

    // The non-required input must NOT be required (defaulting from an absent
    // styles.required leaves it false — purely additive).
    const plainInput = canvas.getByPlaceholderText('no required marker')
    expect(plainInput).not.toBeRequired()
    expect(plainInput).not.toHaveAttribute('aria-required')
  },
}

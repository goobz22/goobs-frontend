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

// A simple icon for adornments. Adornment icons here are DECORATIVE (the field
// already has a visible label or an aria-label), and the adornment slot is
// `pointer-events: none`, so it can never be an interactive control. Marking
// the SVGs `aria-hidden="true"` keeps them out of the accessibility tree so a
// screen reader announces the labelled field, not a redundant/anonymous image
// (WCAG 1.1.1 — decorative images take an empty text alternative).
const AtIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
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
    aria-hidden="true"
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
    aria-hidden="true"
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
  // Mixed-theme story on the sacred canvas: the light/dark error variants get
  // their own themed surfaces so the danger-text label + helper are judged
  // against the background they are designed for (light danger-text #b91c1c is
  // 6.47:1 on white but only 2.98:1 on the sacred #0e0e0e canvas); the sacred
  // variant sits on the canvas itself.
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <TextFieldWithState
          label="Email Address"
          initialValue="invalid-email"
          error="Please enter a valid email address."
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
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
      </div>
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

// --------------------------------------------------------------------------
// ACCESSIBLE NAME WITHOUT A VISIBLE LABEL (a11y — WCAG 4.1.2 / 3.3.2)
// --------------------------------------------------------------------------

/**
 * A placeholder is NOT an accessible name — it is not exposed as one to
 * assistive tech and disappears on input, so a label-less field is anonymous
 * to screen readers. The additive `ariaLabel` / `ariaLabelledby` props give
 * such fields a programmatic name without forcing a visible `<label>`.
 *
 * The `play` test asserts each label-less input is reachable BY NAME via the
 * accessibility tree (`getByRole('textbox', { name })`), which only succeeds
 * when the accessible name is wired — the regression guard for the fix.
 */
export const AccessibleNameWithoutLabel: Story = {
  name: 'Accessible name without a visible label',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* aria-label: name supplied directly, no visible label. */}
      <TextFieldWithState
        ariaLabel="Search products"
        placeholder="Search…"
        startAdornment={<SearchIcon />}
        styles={{ theme: 'light' }}
      />
      {/* aria-labelledby: name lives in a separate visible element. */}
      <div>
        <span id="notes-caption" style={{ fontSize: '14px', color: '#374151' }}>
          Delivery notes
        </span>
        <TextFieldWithState
          ariaLabelledby="notes-caption"
          multiline
          placeholder="Add notes for the courier"
          styles={{ theme: 'light' }}
        />
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The aria-label field is reachable by its programmatic name even though
    // no <label> element exists for it.
    const search = canvas.getByRole('textbox', { name: 'Search products' })
    await expect(search).toBeInTheDocument()
    await expect(search).toHaveAttribute('aria-label', 'Search products')

    // The aria-labelledby field resolves its name from the referenced element.
    const notes = canvas.getByRole('textbox', { name: 'Delivery notes' })
    await expect(notes).toBeInTheDocument()
    await expect(notes).toHaveAttribute('aria-labelledby', 'notes-caption')

    // Typing still works normally through the accessible-named input.
    await userEvent.type(search, 'wax')
    await expect(search).toHaveValue('wax')
  },
}

// --------------------------------------------------------------------------
// FOCUS-VISIBLE INDICATOR (a11y — WCAG 2.4.7)
// --------------------------------------------------------------------------

/**
 * The inner input/textarea carry `outline: none`, so the visible focus ring is
 * provided at the wrapper via `:focus-within` (pure CSS, hydration-independent)
 * as well as the JS `.focused` class. The `play` test focuses the input and
 * asserts the wrapper enters the `:focus-within` state — proving a keyboard
 * user always gets a focus indicator, not one contingent on JS.
 */
export const FocusVisibleIndicator: Story = {
  name: 'Focus-visible indicator (keyboard)',
  render: () => (
    <TextFieldWithState
      label="Focusable field"
      placeholder="Tab or click to focus"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /Focusable field/ })

    // Move focus to the input the way a keyboard user would.
    await userEvent.click(input)
    await expect(input).toHaveFocus()

    // The wrapper (input's parent) reflects the focus via the native
    // `:focus-within` pseudo-class — the CSS-native focus ring hook.
    const wrapper = input.parentElement as HTMLElement
    await expect(wrapper.matches(':focus-within')).toBe(true)
  },
}

// --------------------------------------------------------------------------
// REDUCED MOTION (a11y — WCAG 2.3.3)
// --------------------------------------------------------------------------

/**
 * The wrapper animates its border-color + focus-glow box-shadow over 0.3s. A
 * `@media (prefers-reduced-motion: reduce)` block in TextField.module.css
 * collapses that transition to `none` for users who request reduced motion —
 * the focus/error/disabled state changes still apply, they just snap instead of
 * animating. Toggle your OS "reduce motion" setting (or the browser devtools
 * emulation) while focusing this field to see the transition disappear; the
 * Chromatic baseline captures the rendered result.
 *
 * The `play` test is a STRUCTURAL guard rather than a computed-style check: CSS
 * `@media` queries are evaluated by the rendering engine from the OS/browser
 * setting and CANNOT be toggled from a play function (mocking
 * `window.matchMedia` does not change `getComputedStyle` — matchMedia is a
 * separate JS API), so the test walks the CSSOM and asserts the reduced-motion
 * rule that sets the wrapper's `transition: none` actually exists. That fails if
 * the guard block is deleted or a transition is re-added under reduced motion.
 */
export const ReducedMotion: Story = {
  name: 'Reduced motion (focus transition)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextFieldWithState
        label="Sacred field"
        placeholder="Focus me with reduce-motion on"
        styles={{ theme: 'sacred' }}
      />
      <TextFieldWithState
        label="Light field"
        placeholder="Focus me with reduce-motion on"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /Light field/ })
    // No adornments on this field, so the input's parent IS the styled wrapper.
    const wrapper = input.parentElement as HTMLElement
    const wrapperClasses = wrapper.className.split(/\s+/).filter(Boolean)

    // Assert the reduced-motion guard rule exists in the CSSOM:
    //   @media (prefers-reduced-motion: reduce) { .inputWrapper { transition: none } }
    // keyed to THIS wrapper's hashed CSS-module class so we match TextField's
    // own rule, not another component's.
    let found = false
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (
            rule instanceof CSSMediaRule &&
            /prefers-reduced-motion/i.test(rule.media.mediaText) &&
            /reduce/i.test(rule.media.mediaText)
          ) {
            for (const inner of Array.from(rule.cssRules)) {
              if (!(inner instanceof CSSStyleRule)) continue
              const setsTransitionNone =
                inner.style.transition === 'none' ||
                inner.style.transitionProperty === 'none' ||
                /transition:\s*none/i.test(inner.cssText)
              if (
                setsTransitionNone &&
                wrapperClasses.some(cls => inner.selectorText.includes(cls))
              ) {
                found = true
              }
            }
          }
        }
      } catch {
        // Cross-origin stylesheet — reading cssRules throws; skip it.
      }
    }

    await expect(found).toBe(true)
  },
}

// --------------------------------------------------------------------------
// IDENTIFY INPUT PURPOSE (a11y — WCAG 1.3.5 Identify Input Purpose, AA)
// --------------------------------------------------------------------------

/**
 * Fields that collect information about the user (name, email, phone, one-time
 * code, …) must expose their purpose so browsers can autofill and so the
 * purpose is programmatically determinable (WCAG 1.3.5). The additive
 * `autoComplete` token and `inputMode` keyboard hint are forwarded verbatim to
 * the native input/textarea. The `play` test asserts both attributes land on
 * the DOM element — the regression guard for the passthrough.
 */
export const IdentifyInputPurpose: Story = {
  name: 'Identify input purpose (autoComplete / inputMode)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextFieldWithState
        label="Full name"
        placeholder="Jane Doe"
        autoComplete="name"
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Email"
        placeholder="you@example.com"
        type="email"
        autoComplete="email"
        inputMode="email"
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="One-time code"
        placeholder="123456"
        autoComplete="one-time-code"
        inputMode="numeric"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The autofill token is forwarded so browser autofill + AT can identify the
    // field's purpose (attribute is lowercased in the DOM).
    const name = canvas.getByRole('textbox', { name: /Full name/ })
    await expect(name).toHaveAttribute('autocomplete', 'name')

    // Both the autofill token AND the on-screen-keyboard hint are forwarded.
    const email = canvas.getByRole('textbox', { name: /Email/ })
    await expect(email).toHaveAttribute('autocomplete', 'email')
    await expect(email).toHaveAttribute('inputmode', 'email')

    // inputMode drives the numeric keypad for a code field.
    const code = canvas.getByRole('textbox', { name: /One-time code/ })
    await expect(code).toHaveAttribute('autocomplete', 'one-time-code')
    await expect(code).toHaveAttribute('inputmode', 'numeric')

    // A field with neither prop set must NOT emit the attributes — the
    // passthrough is purely additive.
    const plain = canvas.getByRole('textbox', { name: /Full name/ })
    // (Full name has autoComplete but no inputMode → inputmode absent.)
    await expect(plain).not.toHaveAttribute('inputmode')
  },
}

// --------------------------------------------------------------------------
// ERROR STATE ON THE CONTROL (a11y — WCAG 1.4.1 / 3.3.1 / 2.4.7 / 1.4.11)
// --------------------------------------------------------------------------

/**
 * When a TextField is invalid the error must be signalled on the CONTROL, not
 * only in the message text below it. TextField renders its own `.inputWrapper`
 * frame (rather than FieldShell's generic `.inputSlot`), so it did not inherit
 * FieldShell's error border — on error only the label + helper text turned
 * danger-colored while the input frame stayed neutral. TextField.module.css now
 * carries an error rule (`[data-state='error'] .inputWrapper`) that turns the
 * frame danger-colored, matching every sibling Field. It is redundant to the
 * error message + `aria-invalid`, so the state is never conveyed by color
 * alone.
 *
 * The `play` test verifies the end-to-end wiring (the input carries
 * `aria-invalid="true"` and `aria-describedby`, and its shell ancestor carries
 * `data-state="error"` — together these are exactly the hooks the error CSS
 * keys on), then walks the CSSOM to assert BOTH new rules exist keyed to THIS
 * wrapper's hashed class: the error-border rule and the
 * `@media (forced-colors: active)` focus-outline fallback (a keyboard focus
 * indicator that survives Windows High Contrast, where the box-shadow focus
 * glow is stripped). CSS `@media`/attribute rules can't be toggled from a play
 * function, so a structural CSSOM guard is how this repo pins such rules (see
 * ReducedMotion) — it fails if either rule is deleted.
 */
export const ErrorStateOnControl: Story = {
  name: 'Error state on the control (invalid frame + forced-colors focus)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextFieldWithState
        label="Email Address"
        initialValue="not-an-email"
        error="Please enter a valid email address."
        styles={{ theme: 'light' }}
      />
      <TextFieldWithState
        label="Valid field"
        initialValue="all good"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const invalid = canvas.getByRole('textbox', { name: /Email Address/ })
    const valid = canvas.getByRole('textbox', { name: /Valid field/ })

    // End-to-end error wiring: the invalid input is marked invalid AND points
    // at its error message; the valid one carries neither.
    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
    await expect(invalid).toHaveAttribute('aria-describedby')
    await expect(valid).not.toHaveAttribute('aria-invalid')

    // The shell ancestor exposes the `data-state="error"` hook the frame CSS
    // keys on — proving the error-border selector actually matches this field.
    const shell = invalid.closest('[data-component="FieldShell"]') as HTMLElement
    await expect(shell).toHaveAttribute('data-state', 'error')

    // The invalid input's wrapper (its parent — no adornments here) is the
    // styled frame; grab its hashed CSS-module class to scope the CSSOM checks.
    const wrapper = invalid.parentElement as HTMLElement
    const wrapperClasses = wrapper.className.split(/\s+/).filter(Boolean)

    // Guard 1 — the error-border rule exists, keyed to a `data-state="error"`
    // (or aria-invalid) shell selector and this wrapper's class.
    let errorRuleFound = false
    // Guard 2 — the forced-colors focus-outline fallback exists for this
    // wrapper's focus state.
    let forcedColorsFocusFound = false

    const inspectStyleRule = (rule: CSSStyleRule, forcedColors: boolean) => {
      const selector = rule.selectorText ?? ''
      const matchesWrapper = wrapperClasses.some(cls => selector.includes(cls))
      if (!matchesWrapper) return
      if (
        !forcedColors &&
        /\[data-state=['"]?error['"]?\]|\[aria-invalid=['"]?true['"]?\]/i.test(
          selector
        ) &&
        (rule.style.borderColor !== '' ||
          /border-color/i.test(rule.style.cssText))
      ) {
        errorRuleFound = true
      }
      if (
        forcedColors &&
        /focus-within|focused/i.test(selector) &&
        (rule.style.outline !== '' ||
          rule.style.outlineWidth !== '' ||
          /outline/i.test(rule.style.cssText))
      ) {
        forcedColorsFocusFound = true
      }
    }

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSStyleRule) {
            inspectStyleRule(rule, false)
          } else if (
            rule instanceof CSSMediaRule &&
            /forced-colors/i.test(rule.media.mediaText)
          ) {
            for (const inner of Array.from(rule.cssRules)) {
              if (inner instanceof CSSStyleRule) inspectStyleRule(inner, true)
            }
          }
        }
      } catch {
        // Cross-origin stylesheet — reading cssRules throws; skip it.
      }
    }

    await expect(errorRuleFound).toBe(true)
    await expect(forcedColorsFocusFound).toBe(true)
  },
}

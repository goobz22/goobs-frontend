/**
 * @fileoverview Storybook stories for the Percentage component.
 * These stories showcase the various states, themes, and styling capabilities of the Percentage field.
 * The Percentage component provides percentage input with validation and formatting.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
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
  tags: ['autodocs'],
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
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <PercentageFieldWithState
      label="Completion Rate"
      placeholder="Enter completion rate"
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
    <PercentageFieldWithState
      label="Divine Proportion"
      placeholder="Enter sacred ratio..."
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
    <PercentageFieldWithState
      label="Custom Percentage"
      placeholder="Enter percentage"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(245, 245, 255, 0.95)',
        borderColor: 'rgba(99, 102, 241, 0.4)',
        borderFocusedColor: 'rgba(99, 102, 241, 1)',
        textColor: 'rgba(67, 56, 202, 1)',
        labelColor: 'rgba(67, 56, 202, 0.7)',
      }}
    />
  ),
}

export const NeonStyle: Story = {
  name: 'Neon Style',
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
        labelColor: 'rgba(168, 85, 247, 0.7)',
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
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  name: 'Custom Typography',
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
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  name: 'Error States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PercentageFieldWithState
        label="Percentage"
        initialValue="150"
        error="Percentage cannot exceed 100%."
        styles={{ theme: 'light' }}
      />
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
  name: 'Required Fields',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

      {/* Dark Theme Section */}
      <div>
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

      {/* Sacred Theme Section */}
      <div>
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
              textColor: 'rgba(147, 51, 234, 1)',
              labelColor: 'rgba(147, 51, 234, 0.8)',
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
      <PercentageFieldWithState
        label="Disabled Light"
        initialValue="75"
        disabled
        styles={{ theme: 'light' }}
      />
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
      alert('Percentage validated successfully!')
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
          backgroundColor: '#3B82F6',
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
  name: 'Validation Demo',
  render: () => <PercentageValidationDemo />,
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  render: () => (
    <PercentageFieldWithState
      label="Test Percentage Input"
      placeholder="Enter percentage for testing"
      styles={{ theme: 'light' }}
    />
  ),
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

    // Check value
    await expect(input).toHaveValue('75.5')
  },
}

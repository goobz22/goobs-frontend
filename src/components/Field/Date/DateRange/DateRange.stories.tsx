/**
 * @fileoverview Storybook stories for the DateRange component.
 * These stories showcase the various states, themes, and styling capabilities of the DateRange field.
 * The DateRange component provides dual date picker inputs for selecting date ranges.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'
import DateRangeComponent, { DateRange } from './index'

// Wrapper component for state management
const DateRangeWithState = ({
  initialValue = { start: null, end: null } as DateRange,
  ...props
}) => {
  const [value, setValue] = useState<DateRange>(initialValue)
  const handleChange = (dateRange: DateRange) => {
    setValue(dateRange)
  }
  return <DateRangeComponent {...props} value={value} onChange={handleChange} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof DateRangeComponent> = {
  title: 'Components/Field/Date/DateRange',
  component: DateRangeComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    startLabel: { control: 'text' },
    endLabel: { control: 'text' },
    error: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '600px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DateRangeComponent>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <DateRangeWithState
      startLabel="Start Date"
      endLabel="End Date"
      styles={{ theme: 'light' }}
    />
  ),
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <DateRangeWithState
      startLabel="From Date"
      endLabel="To Date"
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
    <DateRangeWithState
      startLabel="Era Beginning"
      endLabel="Era End"
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
    <DateRangeWithState
      startLabel="Custom Start"
      endLabel="Custom End"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 248, 220, 0.95)',
        borderColor: 'rgba(255, 165, 0, 0.4)',
        borderFocusedColor: 'rgba(255, 165, 0, 1)',
        textColor: 'rgba(139, 69, 19, 1)',
        labelColor: 'rgba(139, 69, 19, 0.7)',
      }}
    />
  ),
}

export const NeonStyle: Story = {
  name: 'Neon Style',
  render: () => (
    <DateRangeWithState
      startLabel="Neon Start"
      endLabel="Neon End"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 0, 255, 0.5)',
        borderFocusedColor: 'rgba(255, 0, 255, 1)',
        textColor: 'rgba(255, 0, 255, 1)',
        labelColor: 'rgba(255, 0, 255, 0.7)',
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
      <DateRangeWithState
        startLabel="Large Padding"
        endLabel="Large Padding"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <DateRangeWithState
        startLabel="Custom Dimensions"
        endLabel="Custom Dimensions"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <DateRangeWithState
        startLabel="Asymmetric Padding"
        endLabel="Asymmetric Padding"
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
      <DateRangeWithState
        startLabel="Large Text Start"
        endLabel="Large Text End"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <DateRangeWithState
        startLabel="Custom Font Start"
        endLabel="Custom Font End"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <DateRangeWithState
        startLabel="Small & Light Start"
        endLabel="Small & Light End"
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
      <DateRangeWithState
        startLabel="Start Date"
        endLabel="End Date"
        error="Please select a valid date range."
        styles={{ theme: 'light' }}
      />
      <DateRangeWithState
        startLabel="From Date"
        endLabel="To Date"
        error="End date cannot be before start date."
        styles={{
          theme: 'dark',
          borderErrorColor: 'rgba(255, 99, 71, 1)',
          labelErrorColor: 'rgba(255, 99, 71, 1)',
          footerTextErrorColor: 'rgba(255, 99, 71, 1)',
        }}
      />
      <DateRangeWithState
        startLabel="Era Beginning"
        endLabel="Era End"
        error="The sacred timeline is misaligned."
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
      <DateRangeWithState
        startLabel="Required Start"
        endLabel="Required End"
        required
        styles={{ theme: 'light' }}
      />
      <DateRangeWithState
        startLabel="Project Start"
        endLabel="Project End"
        required
        error="Both dates are required"
        styles={{ theme: 'light' }}
      />
      <DateRangeWithState
        startLabel="Planning Start"
        endLabel="Planning End"
        required
        styles={{ theme: 'dark' }}
      />
      <DateRangeWithState
        startLabel="Custom Required Start"
        endLabel="Custom Required End"
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DateRangeWithState
            startLabel="Basic Start"
            endLabel="Basic End"
            styles={{ theme: 'light' }}
          />
          <DateRangeWithState
            startLabel="With Error"
            endLabel="With Error"
            error="Invalid date range"
            styles={{ theme: 'light' }}
          />
          <DateRangeWithState
            startLabel="Required Start"
            endLabel="Required End"
            required
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DateRangeWithState
            startLabel="Basic Dark Start"
            endLabel="Basic Dark End"
            styles={{ theme: 'dark' }}
          />
          <DateRangeWithState
            startLabel="Custom Colors"
            endLabel="Custom Colors"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <DateRangeWithState
            startLabel="Large Size"
            endLabel="Large Size"
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
          <DateRangeWithState
            startLabel="Era Beginning"
            endLabel="Era End"
            styles={{ theme: 'sacred' }}
          />
          <DateRangeWithState
            startLabel="Sacred Start"
            endLabel="Sacred End"
            error="Timeline misaligned"
            styles={{ theme: 'sacred' }}
          />
          <DateRangeWithState
            startLabel="Divine Start"
            endLabel="Divine End"
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
          <DateRangeWithState
            startLabel="Neon Start"
            endLabel="Neon End"
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
          <DateRangeWithState
            startLabel="Soft Start"
            endLabel="Soft End"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <DateRangeWithState
            startLabel="Minimal Start"
            endLabel="Minimal End"
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
      <DateRangeWithState
        startLabel="Disabled Light Start"
        endLabel="Disabled Light End"
        initialValue={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
        disabled
        styles={{ theme: 'light' }}
      />
      <DateRangeWithState
        startLabel="Disabled Dark Start"
        endLabel="Disabled Dark End"
        initialValue={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
        disabled
        styles={{ theme: 'dark' }}
      />
      <DateRangeWithState
        startLabel="Disabled Sacred Start"
        endLabel="Disabled Sacred End"
        initialValue={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
        disabled
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

const DateRangeValidationDemo = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  })
  const [error, setError] = useState('')

  const validateDateRange = (range: DateRange) => {
    if (!range.start || !range.end) {
      setError('Both start and end dates are required')
    } else if (range.start > range.end) {
      setError('End date cannot be before start date')
    } else {
      setError('')
    }
  }

  const handleSubmit = () => {
    validateDateRange(dateRange)
    if (error === '' && dateRange.start && dateRange.end) {
      alert('Date range validated successfully!')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '500px',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Date Range Validation</h3>
      <DateRangeComponent
        startLabel="Start Date"
        endLabel="End Date"
        value={dateRange}
        onChange={value => {
          setDateRange(value)
          if (error) validateDateRange(value)
        }}
        required
        error={error}
        styles={{ theme: 'light' }}
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
        Validate Date Range
      </button>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        Select both start and end dates to see validation in action.
      </p>
    </div>
  )
}

export const ValidationDemo: Story = {
  name: 'Validation Demo',
  render: () => <DateRangeValidationDemo />,
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  render: () => (
    <DateRangeWithState
      startLabel="Test Start Date"
      endLabel="Test End Date"
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that labels are present
    await expect(canvas.getByText('Test Start Date')).toBeInTheDocument()
    await expect(canvas.getByText('Test End Date')).toBeInTheDocument()

    // Check that date inputs are present
    const startInput = canvas.getByLabelText('Test Start Date')
    const endInput = canvas.getByLabelText('Test End Date')

    expect(startInput).toBeVisible()
    expect(endInput).toBeVisible()
  },
}

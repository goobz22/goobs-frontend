/**
 * @fileoverview Storybook stories for the USD field component.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import USDField from './index'

const meta: Meta<typeof USDField> = {
  title: 'Components/Field/USD',
  component: USDField,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label text for the USD field',
    },
    initialValue: {
      control: { type: 'text' },
      description: 'Initial value for the USD field',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled value for the USD field',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum allowed value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum allowed value',
    },
    enableIncrement: {
      control: { type: 'boolean' },
      description: 'Whether to show increment/decrement buttons',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text displayed below the field',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof USDField>

const commonArgs = {
  label: 'Amount',
  initialValue: '123.45',
  enableIncrement: true,
  helperText: 'Enter a USD amount',
}

export const LightTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> Clean and professional USD field with
          light backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for readability in bright
          environments, currency formatting, and accessible design.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> Developer-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          styling, and smooth USD input interactions.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical and spiritual USD field with
          sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative financial
          sessions, sacred golden colors, and transcendent user experience.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

export const WithIncrementButtons: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>With Increment Buttons:</strong> USD field with increment and
          decrement buttons for easy value adjustment.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    enableIncrement: true,
    styles: {
      theme: 'light',
    },
  },
}

export const WithoutIncrementButtons: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Without Increment Buttons:</strong> Clean USD field without
          increment buttons for minimal design.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    enableIncrement: false,
    styles: {
      theme: 'dark',
    },
  },
}

export const WithMinMax: Story = {
  name: 'With Min/Max Values',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>With Min/Max Values:</strong> USD field with minimum and
          maximum value constraints for validation.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    min: 0,
    max: 1000,
    helperText: 'Value must be between $0 and $1000',
    styles: {
      theme: 'light',
    },
  },
}

export const LargeAmount: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Large Amount:</strong> USD field handling large monetary
          values with proper formatting and sacred theme styling.
        </div>
        <USDField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '12345.67',
    label: 'Transaction Amount',
    helperText: 'Enter the transaction amount',
    styles: {
      theme: 'sacred',
    },
  },
}

const InteractiveDemoComponent = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [value, setValue] = React.useState('99.99')
  const [increment, setIncrement] = React.useState(true)
  const [min, setMin] = React.useState<number | undefined>(undefined)
  const [max, setMax] = React.useState<number | undefined>(undefined)

  const getBackgroundColor = () => {
    switch (theme) {
      case 'dark':
        return '#0f172a'
      case 'sacred':
        return '#1C1917'
      default:
        return '#f8fafc'
    }
  }

  const getTextColor = () => {
    switch (theme) {
      case 'dark':
        return '#94a3b8'
      case 'sacred':
        return '#FFD700'
      default:
        return '#475569'
    }
  }

  return (
    <div
      style={{
        backgroundColor: getBackgroundColor(),
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div
          style={{
            marginBottom: '1rem',
            fontSize: '14px',
            color: getTextColor(),
          }}
        >
          <strong>Interactive Demo:</strong> Try different themes and settings
          to see how the USD field adapts.
        </div>
        <div
          style={{
            padding: '1rem',
            border: `1px solid ${theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor:
              theme === 'sacred'
                ? 'rgba(255, 215, 0, 0.1)'
                : theme === 'dark'
                  ? 'rgba(51, 65, 85, 0.3)'
                  : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <h3
            style={{
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: getTextColor(),
            }}
          >
            Controls
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <label style={{ color: getTextColor() }}>
              <input
                type="checkbox"
                checked={disabled}
                onChange={e => setDisabled(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Disabled
            </label>
            <label style={{ color: getTextColor() }}>
              <input
                type="checkbox"
                checked={error}
                onChange={e => setError(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Error
            </label>
            <label style={{ color: getTextColor() }}>
              <input
                type="checkbox"
                checked={increment}
                onChange={e => setIncrement(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Increment
            </label>
            <label style={{ color: getTextColor() }}>
              <input
                type="checkbox"
                checked={min !== undefined}
                onChange={e => setMin(e.target.checked ? 0 : undefined)}
                style={{ marginRight: '0.5rem' }}
              />
              Min ($0)
            </label>
            <label style={{ color: getTextColor() }}>
              <input
                type="checkbox"
                checked={max !== undefined}
                onChange={e => setMax(e.target.checked ? 1000 : undefined)}
                style={{ marginRight: '0.5rem' }}
              />
              Max ($1000)
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ color: getTextColor() }}>
              Theme:
              <select
                value={theme}
                onChange={e =>
                  setTheme(e.target.value as 'light' | 'dark' | 'sacred')
                }
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  border: `1px solid ${theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                  backgroundColor:
                    theme === 'sacred'
                      ? '#1C1917'
                      : theme === 'dark'
                        ? '#0f172a'
                        : '#ffffff',
                  color: getTextColor(),
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sacred">Sacred</option>
              </select>
            </label>
          </div>
        </div>
        <USDField
          label="Enter Amount"
          value={value}
          onChange={val => setValue(val)}
          enableIncrement={increment}
          {...(min !== undefined ? { min } : {})}
          {...(max !== undefined ? { max } : {})}
          helperText={
            error
              ? 'Invalid amount'
              : min !== undefined && max !== undefined
                ? `Enter amount between $${min} and $${max}`
                : 'Please enter a USD value'
          }
          styles={{
            theme: theme,
            disabled: disabled,
          }}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
}

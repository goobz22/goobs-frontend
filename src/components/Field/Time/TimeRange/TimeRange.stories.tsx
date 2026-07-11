/**
 * @fileoverview Storybook stories for the TimeRange component.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import TimeRangeComponent, { TimeRange } from './index'

const meta: Meta<typeof TimeRangeComponent> = {
  title: 'Components/Field/Time/TimeRange',
  component: TimeRangeComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    startLabel: {
      control: { type: 'text' },
      description: 'Label for the start time field',
    },
    endLabel: {
      control: { type: 'text' },
      description: 'Label for the end time field',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof TimeRangeComponent>

const commonArgs = {
  startLabel: 'Start Time',
  endLabel: 'End Time',
  value: {
    start: new Date(),
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
  },
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
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> Clean and professional time range picker
          with light backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for readability in bright
          environments, intuitive time selection, and accessible design.
        </div>
        <TimeRangeComponent {...args} />
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
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> Developer-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          styling, and smooth time selection interactions.
        </div>
        <TimeRangeComponent {...args} />
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
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical and spiritual time range
          picker with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative scheduling
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <TimeRangeComponent {...args} />
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

export const CustomLabels: Story = {
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
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Custom Labels:</strong> Time range picker with custom field
          labels for specific use cases.
        </div>
        <TimeRangeComponent {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    startLabel: 'Meeting Start',
    endLabel: 'Meeting End',
    styles: {
      theme: 'dark',
    },
  },
}

const InteractiveDemoComponent = () => {
  const [value, setValue] = React.useState<TimeRange>({
    start: new Date(),
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
  })
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')

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
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{
            marginBottom: '1rem',
            fontSize: '14px',
            color: getTextColor(),
          }}
        >
          <strong>Interactive Demo:</strong> Try different themes to see how the
          time range picker adapts.
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.5rem',
            }}
          >
            <label style={{ color: getTextColor() }}>
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
              Theme
            </label>
          </div>
        </div>
        <TimeRangeComponent
          value={value}
          onChange={setValue}
          styles={{ theme }}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
}

// --------------------------------------------------------------------------
// A11y: GROUP SEMANTICS & RANGE ERROR (WCAG 1.3.1 / 4.1.2 / 4.1.3 / 1.4.1)
//
// The start/end inputs are two related controls forming ONE range, so the
// wrapper is exposed as a named role="group". A cross-field error (end before
// start) is a property of the whole range, so it must mark BOTH inputs
// aria-invalid — not just the start — and be announced once via a role="alert"
// live region that programmatically describes the start input.
// --------------------------------------------------------------------------

export const GroupSemanticsAndError: Story = {
  name: 'A11y: Group Semantics & Range Error',
  render: () => (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <TimeRangeComponent
        startLabel="Meeting Start"
        endLabel="Meeting End"
        ariaLabel="Meeting time range"
        error="End time cannot be before start time."
        value={{ start: new Date(), end: new Date() }}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The pair is announced as one named group.
    const group = canvas.getByRole('group', { name: 'Meeting time range' })
    await expect(group).toBeInTheDocument()

    // A cross-field error marks BOTH time inputs invalid, not just the start.
    const startInput = canvas.getByLabelText('Meeting Start')
    const endInput = canvas.getByLabelText('Meeting End')
    await expect(startInput).toHaveAttribute('aria-invalid', 'true')
    await expect(endInput).toHaveAttribute('aria-invalid', 'true')

    // The message is announced once via a live alert region and the start
    // input is programmatically described by it.
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent(
      'End time cannot be before start time.'
    )
    await expect(startInput).toHaveAttribute('aria-describedby', alert.id)
  },
}

// The wrapper is always a named group even without an explicit ariaLabel —
// the default accessible name is 'Time range'.
export const DefaultGroupLabel: Story = {
  name: 'A11y: Default Group Label',
  render: () => (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <TimeRangeComponent
        startLabel="Start Time"
        endLabel="End Time"
        value={{ start: null, end: null }}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Time range' })
    ).toBeInTheDocument()
  },
}

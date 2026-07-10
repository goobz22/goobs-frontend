/**
 * @fileoverview Storybook stories for the TimeField component.
 * These stories showcase the various themes and states of the native
 * time-input-backed TimeField, which composes the shared FieldShell. The value
 * is a Date whose hours/minutes are formatted as HH:MM for the native input.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import TimeField from './index'

// Build a Date carrying a specific local time-of-day for seeding stories.
const timeAt = (hours: number, minutes: number): Date => {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

// Wrapper component for state management. TimeField is controlled — onChange
// forwards a Date | null.
const TimeFieldWithState = ({
  initialValue = null,
  ...props
}: React.ComponentProps<typeof TimeField> & { initialValue?: Date | null }) => {
  const [value, setValue] = useState<Date | null>(initialValue)
  return <TimeField {...props} value={value} onChange={setValue} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof TimeField> = {
  title: 'Components/Field/Time/TimeField',
  component: TimeField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    styles: {
      control: 'object',
      description: 'Per-instance style overrides including theme/disabled/required',
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
type Story = StoryObj<typeof TimeField>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  render: () => (
    <TimeFieldWithState label="Start Time" styles={{ theme: 'light' }} />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <TimeFieldWithState label="Start Time" styles={{ theme: 'dark' }} />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <TimeFieldWithState label="Ritual Hour" styles={{ theme: 'sacred' }} />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// WITH VALUE (pre-filled time)
// --------------------------------------------------------------------------

export const WithValue: Story = {
  render: () => (
    <TimeFieldWithState
      label="Appointment"
      initialValue={timeAt(14, 30)}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// WITH HELPER TEXT
// --------------------------------------------------------------------------

export const WithHelperText: Story = {
  render: () => (
    <TimeFieldWithState
      label="Meeting Time"
      initialValue={timeAt(9, 0)}
      helperText="Choose a time within business hours"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATE
// --------------------------------------------------------------------------

export const WithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Each error field sits on the surface its theme is designed for so its
          danger-text grade meets contrast: light danger #b91c1c is 6.47:1 on
          white but only 2.98:1 on the default sacred canvas; dark danger
          #f87171 is 6.41:1 on the dark #111827 surface. */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <TimeFieldWithState
          label="Start Time"
          initialValue={timeAt(22, 0)}
          error="Outside allowed hours"
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{
          backgroundColor: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <TimeFieldWithState
          label="Start Time"
          initialValue={timeAt(22, 0)}
          error="Outside allowed hours"
          styles={{ theme: 'dark' }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TimeFieldWithState
        label="Disabled Light"
        initialValue={timeAt(12, 0)}
        styles={{ theme: 'light', disabled: true }}
      />
      <TimeFieldWithState
        label="Disabled Dark"
        initialValue={timeAt(12, 0)}
        styles={{ theme: 'dark', disabled: true }}
      />
      <TimeFieldWithState
        label="Disabled Sacred"
        initialValue={timeAt(12, 0)}
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED STATE
// --------------------------------------------------------------------------

export const Required: Story = {
  render: () => (
    <TimeFieldWithState
      label="Departure Time"
      styles={{ theme: 'light', required: true }}
    />
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
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TimeFieldWithState label="Empty" styles={{ theme: 'light' }} />
          <TimeFieldWithState
            label="With Value"
            initialValue={timeAt(8, 15)}
            styles={{ theme: 'light' }}
          />
          <TimeFieldWithState
            label="With Error"
            initialValue={timeAt(23, 45)}
            error="Too late"
            styles={{ theme: 'light' }}
          />
          <TimeFieldWithState
            label="Required"
            styles={{ theme: 'light', required: true }}
          />
        </div>
      </div>

      {/* Dark-themed block sits on its own dark surface so the dark-theme
          labels/inputs (and the muted heading, 6.99:1 on #111827) are judged
          against the surface they're designed for, not the light canvas. */}
      <div
        style={{
          backgroundColor: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TimeFieldWithState label="Empty" styles={{ theme: 'dark' }} />
          <TimeFieldWithState
            label="With Value"
            initialValue={timeAt(8, 15)}
            styles={{ theme: 'dark' }}
          />
          <TimeFieldWithState
            label="Disabled"
            initialValue={timeAt(8, 15)}
            styles={{ theme: 'dark', disabled: true }}
          />
        </div>
      </div>

      {/* Sacred is gold-on-near-black by design — its translucent control bg
          and gold labels only meet contrast on a near-black surface
          (gold #FFD700 heading is 13.76:1 on #0e0e0e vs 1.4:1 on white). */}
      <div
        style={{
          backgroundColor: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TimeFieldWithState label="Empty" styles={{ theme: 'sacred' }} />
          <TimeFieldWithState
            label="With Value"
            initialValue={timeAt(18, 0)}
            helperText="Twilight hour"
            styles={{ theme: 'sacred' }}
          />
          <TimeFieldWithState
            label="Disabled"
            initialValue={timeAt(18, 0)}
            styles={{ theme: 'sacred', disabled: true }}
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

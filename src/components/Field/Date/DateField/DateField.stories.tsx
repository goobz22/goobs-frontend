'use client'

import React from 'react'
import { Meta, StoryObj } from '@storybook/nextjs'
import DateField from './index'

const meta: Meta<typeof DateField> = {
  title: 'Components/Field/Date/DateField',
  component: DateField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    styles: { control: 'object' },
  },
}

export default meta

type Story = StoryObj<typeof DateField>

export const LightTheme: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Select Date',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  decorators: [
    Story => (
      <div
        style={{ width: '400px', padding: '2rem', backgroundColor: '#f9fafb' }}
      >
        <Story />
      </div>
    ),
  ],
}

export const DarkTheme: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Select Date',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
  decorators: [
    Story => (
      <div
        style={{ width: '400px', padding: '2rem', backgroundColor: '#1f2937' }}
      >
        <Story />
      </div>
    ),
  ],
}

export const SacredTheme: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Select Date',
    styles: { theme: 'sacred' },
  },
  decorators: [
    Story => (
      <div
        style={{ width: '400px', padding: '2rem', backgroundColor: '#000000' }}
      >
        <Story />
      </div>
    ),
  ],
}

// The light-themed stories below pin the light canvas: without a pin they
// inherit the sacred #0e0e0e default canvas, putting the light-theme muted
// label on a near-black surface (axe: 3.99 < 4.5). On the light canvas the
// label token passes (var(--goobs-light-text-muted) #4b5563 on #ffffff = 7.56).
export const Disabled: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Disabled Date',
    styles: { theme: 'light', disabled: true },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const WithError: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Date with Error',
    styles: { theme: 'light', helperTextType: 'error' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Required: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Required Date',
    styles: { theme: 'light', required: true },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const CustomStyled: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Custom Date',
    styles: {
      theme: 'light',
      height: '50px',
      fontSize: '18px',
      borderRadius: '12px',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

// Demo-chrome surface + text color that follow the selected theme, so the
// story's own control labels stay WCAG-compliant on every theme. Verified
// ratios: light #111827/#ffffff = 17.74, dark #f9fafb/#111827 = 16.98,
// sacred #ffd700 (--goobs-gold) /#0e0e0e = 13.76 — all >= 4.5.
const demoSurfaces: Record<
  'light' | 'dark' | 'sacred',
  { backgroundColor: string; color: string }
> = {
  light: { backgroundColor: '#ffffff', color: '#111827' },
  dark: { backgroundColor: '#111827', color: '#f9fafb' },
  sacred: { backgroundColor: '#0e0e0e', color: '#ffd700' },
}

const InteractiveComponent = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [disabled, setDisabled] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [value, setValue] = React.useState<Date | null>(null)

  return (
    <div style={{ width: '500px', padding: '2rem', ...demoSurfaces[theme] }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Theme: </label>
        <select
          value={theme}
          onChange={e =>
            setTheme(e.target.value as 'light' | 'dark' | 'sacred')
          }
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="sacred">Sacred</option>
        </select>
      </div>
      <label>
        <input
          type="checkbox"
          checked={disabled}
          onChange={e => setDisabled(e.target.checked)}
        />{' '}
        Disabled
      </label>
      <div>
        <label>Error: </label>
        <input value={error} onChange={e => setError(e.target.value)} />
      </div>
      <DateField
        label="Interactive DateField"
        value={value}
        onChange={(d: Date | null) => setValue(d)}
        styles={{
          theme,
          disabled,
          ...(error ? { helperTextType: 'error' } : {}),
        }}
      />
    </div>
  )
}

export const InteractiveDemo: Story = {
  render: () => <InteractiveComponent />,
  // Initial demo state is theme 'light'; pin the matching canvas (the demo
  // wrapper above carries its own themed surface when the theme is switched).
  globals: { backgrounds: { value: 'light' } },
}

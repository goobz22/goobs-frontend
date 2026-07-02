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

export const Disabled: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Disabled Date',
    styles: { theme: 'light', disabled: true },
  },
}

export const WithError: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Date with Error',
    styles: { theme: 'light', helperTextType: 'error' },
  },
}

export const Required: Story = {
  render: args => <DateField {...args} />,
  args: {
    label: 'Required Date',
    styles: { theme: 'light', required: true },
  },
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
}

const InteractiveComponent = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [disabled, setDisabled] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [value, setValue] = React.useState<Date | null>(null)

  return (
    <div style={{ width: '500px', padding: '2rem' }}>
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
}

// src/components/PasswordField/passwordfield.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import PasswordField from './index'

const meta: Meta<typeof PasswordField> = {
  title: 'Components/Field/Password',
  component: PasswordField,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof PasswordField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <PasswordField {...args} />
    </div>
  ),
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <PasswordField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    label: 'Sacred Key',
    placeholder: 'Scribe your sacred key...',
    sacredtheme: true,
  },
}

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    ...PremiumTheme.args,
    label: 'Error Input',
    value: 'Invalid value',
    error: true,
  },
}

export const DisabledState: Story = {
  name: 'Disabled State',
  args: {
    ...PremiumTheme.args,
    label: 'Disabled Field',
    value: 'Cannot edit',
    disabled: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [value, setValue] = React.useState('')
  const [sacred, setSacred] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)

  return (
    <div className="w-[500px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div className="grid grid-cols-3 gap-2">
          <label>
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />{' '}
            Sacred
          </label>
          <label>
            <input
              type="checkbox"
              checked={error}
              onChange={e => setError(e.target.checked)}
            />{' '}
            Error
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />{' '}
            Disabled
          </label>
        </div>
      </div>
      <div className={`p-6 rounded-lg ${sacred ? 'bg-black' : 'bg-gray-50'}`}>
        <PasswordField
          label="Interactive Field"
          placeholder="Type to see changes"
          value={value}
          onChange={e => setValue(e.target.value)}
          sacredtheme={sacred}
          error={error}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

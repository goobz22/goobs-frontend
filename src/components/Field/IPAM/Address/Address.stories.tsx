import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import IPAddressField from '.'

const meta: Meta<typeof IPAddressField> = {
  title: 'Components/Field/IPAM/Address',
  component: IPAddressField,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'text' },
    styles: { control: 'object' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof IPAddressField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <IPAddressField {...args} />
    </div>
  ),
  args: {
    label: 'IP Address',
    styles: { theme: 'light' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <IPAddressField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    styles: { theme: 'sacred' },
  },
}

const InteractiveAddressDemo: React.FC = () => {
  const [sacredtheme, setsacredtheme] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [showError, setShowError] = React.useState(false)
  const [value, setValue] = React.useState('192.168.1.1')

  return (
    <div className="w-[500px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div className="grid grid-cols-3 gap-2">
          <label>
            <input
              type="checkbox"
              checked={sacredtheme}
              onChange={e => setsacredtheme(e.target.checked)}
            />{' '}
            Sacred
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />{' '}
            Disabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={showError}
              onChange={e => setShowError(e.target.checked)}
            />{' '}
            Error
          </label>
        </div>
      </div>
      <div
        className={`p-6 rounded-lg ${sacredtheme ? 'bg-black' : 'bg-gray-50'}`}
      >
        <IPAddressField
          label="Interactive IP Address"
          initialValue={value}
          onChange={e => setValue(e.target.value)}
          styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
          disabled={disabled}
          error={showError ? 'Invalid IP address' : undefined}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveAddressDemo />,
}

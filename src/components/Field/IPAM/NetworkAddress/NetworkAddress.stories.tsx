import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import NetworkAddressField from '.'

const meta: Meta<typeof NetworkAddressField> = {
  title: 'Components/Field/IPAM/NetworkAddress',
  component: NetworkAddressField,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof NetworkAddressField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <NetworkAddressField {...args} />
    </div>
  ),
  args: {
    label: 'Network Address',
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <NetworkAddressField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveNetworkAddressDemo: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [value, setValue] = React.useState('192.168.1.0')

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
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />{' '}
            Disabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={error}
              onChange={e => setError(e.target.checked)}
            />{' '}
            Error
          </label>
        </div>
      </div>
      <div className={`p-6 rounded-lg ${sacred ? 'bg-black' : 'bg-gray-50'}`}>
        <NetworkAddressField
          label="Interactive Network Address"
          initialValue={value}
          onChange={e => setValue(e.target.value)}
          sacredtheme={sacred}
          disabled={disabled}
          error={error}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveNetworkAddressDemo />,
}

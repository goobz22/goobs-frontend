import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import MACAddressField from '.'

const meta: Meta<typeof MACAddressField> = {
  title: 'Components/Field/IPAM/MACAddress',
  component: MACAddressField,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    styles: { control: 'object' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof MACAddressField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <MACAddressField {...args} />
    </div>
  ),
  args: {
    label: 'MAC Address',
    styles: { theme: 'light' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <MACAddressField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    styles: { theme: 'sacred' },
  },
}

const InteractiveMACAddressDemo: React.FC = () => {
  const [sacredtheme, setsacredtheme] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [showHelperText, setShowHelperText] = React.useState(false)
  const [value, setValue] = React.useState('00:1A:2B:3C:4D:5E')

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
              checked={showHelperText}
              onChange={e => setShowHelperText(e.target.checked)}
            />{' '}
            Helper Text
          </label>
        </div>
      </div>
      <div
        className={`p-6 rounded-lg ${sacredtheme ? 'bg-black' : 'bg-gray-50'}`}
      >
        <MACAddressField
          label="Interactive MAC Address"
          initialValue={value}
          onChange={e => setValue(e.target.value)}
          styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
          disabled={disabled}
          helperText={showHelperText ? 'Enter a valid MAC address' : undefined}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveMACAddressDemo />,
}

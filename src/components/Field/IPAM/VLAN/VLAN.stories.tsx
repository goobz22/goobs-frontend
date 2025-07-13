import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import VLANField from '.'

const meta: Meta<typeof VLANField> = {
  title: 'Components/Field/IPAM/VLAN',
  component: VLANField,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    styles: { control: 'object' },
    reservedVLANs: { control: 'object' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof VLANField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <VLANField {...args} />
    </div>
  ),
  args: {
    label: 'VLAN ID',
    onChange: event => console.log('Value changed:', event.target.value),
    styles: { theme: 'light' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <VLANField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    styles: { theme: 'sacred' },
  },
}

const InteractiveDemoRenderer = () => {
  const [sacredtheme, setsacredtheme] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [showReservedVLANs, setShowReservedVLANs] = React.useState(false)
  const [value, setValue] = React.useState('100')

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
              checked={showReservedVLANs}
              onChange={e => setShowReservedVLANs(e.target.checked)}
            />{' '}
            Reserved VLANs
          </label>
        </div>
      </div>
      <div
        className={`p-6 rounded-lg ${sacredtheme ? 'bg-black' : 'bg-gray-50'}`}
      >
        <VLANField
          label="Interactive VLAN"
          initialValue={value}
          onChange={e => setValue(e.target.value)}
          styles={{ theme: sacredtheme ? 'sacred' : 'light', disabled }}
          reservedVLANs={showReservedVLANs ? [50, 100, 150, 200] : []}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

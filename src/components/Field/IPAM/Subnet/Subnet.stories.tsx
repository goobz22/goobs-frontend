import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import SubnetField from '.'

const meta: Meta<typeof SubnetField> = {
  title: 'Components/Field/IPAM/Subnet',
  component: SubnetField,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof SubnetField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <SubnetField {...args} />
    </div>
  ),
  args: {
    label: 'Subnet Mask',
    value: { address: '', mask: 24 },
    onChange: value => console.log('Value changed:', value),
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <SubnetField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
  },
}

const InteractiveSubnetDemo: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [value, setValue] = React.useState({ address: '', mask: 24 })

  return (
    <div className="w-[500px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div className="grid grid-cols-2 gap-2">
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
        </div>
      </div>
      <div className={`p-6 rounded-lg ${sacred ? 'bg-black' : 'bg-gray-50'}`}>
        <SubnetField
          label="Interactive Subnet"
          value={value}
          onChange={setValue}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveSubnetDemo />,
}

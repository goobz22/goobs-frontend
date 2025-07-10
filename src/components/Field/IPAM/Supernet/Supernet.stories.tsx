import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import SupernetField from '.'

const meta: Meta<typeof SupernetField> = {
  title: 'Components/Field/IPAM/Supernet',
  component: SupernetField,
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof SupernetField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <SupernetField {...args} />
    </div>
  ),
  args: {
    label: 'Supernet Mask',
    value: { address: '', mask: 16 },
    onChange: value => console.log('Value changed:', value),
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <SupernetField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
  },
}

const InteractiveDemoRenderer = () => {
  const [value, setValue] = React.useState({ address: '', mask: 16 })

  return (
    <div className="w-[500px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          <span>Interactive controls can be added here when needed</span>
        </div>
      </div>
      <div className="p-6 rounded-lg bg-gray-50">
        <SupernetField
          label="Interactive Supernet"
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

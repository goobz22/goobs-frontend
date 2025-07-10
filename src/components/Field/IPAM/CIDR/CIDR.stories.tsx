import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import CIDRField from '.'

const meta: Meta<typeof CIDRField> = {
  title: 'Components/Field/IPAM/CIDR',
  component: CIDRField,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    showSubnetInfo: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    minCidr: { control: 'number' },
    maxCidr: { control: 'number' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof CIDRField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <CIDRField {...args} />
    </div>
  ),
  args: {
    label: 'CIDR',
    minCidr: 8,
    maxCidr: 32,
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <CIDRField {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveCIDRDemo: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [showInfo, setShowInfo] = React.useState(true)
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
              checked={showInfo}
              onChange={e => setShowInfo(e.target.checked)}
            />{' '}
            Show Info
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
        <CIDRField
          sacredtheme={sacred}
          showSubnetInfo={showInfo}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveCIDRDemo />,
}

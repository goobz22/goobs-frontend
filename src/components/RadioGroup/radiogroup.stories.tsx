import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import RadioGroup from './index'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    label: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const premiumOptions = [
  { label: 'Option 1' },
  { label: 'Option 2' },
  { label: 'Option 3' },
]

const sacredOptions = [
  { label: 'Ankh of Life' },
  { label: 'Scarab of Rebirth' },
  { label: 'Eye of Horus' },
]

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="p-8 bg-gray-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-inter">
        Premium RadioGroup
      </h3>
      <RadioGroup {...args} />
    </div>
  ),
  args: {
    name: 'premium-radio-group',
    labelText: 'Choose an option',
    options: premiumOptions,
    defaultValue: 'Option 1',
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="p-8 bg-black/90 rounded-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow">
        Sacred RadioGroup
      </h3>
      <RadioGroup {...args} />
    </div>
  ),
  args: {
    name: 'sacred-radio-group',
    labelText: 'Select a Sacred Relic',
    sacredtheme: true,
    options: sacredOptions,
    defaultValue: 'Scarab of Rebirth',
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [value, setValue] = React.useState('Option 1')

  return (
    <div className="w-[500px] space-y-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          RadioGroup Configuration
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />
            <span className="ml-2">Sacred Theme</span>
          </label>
        </div>
      </div>
      <div
        className={`p-8 rounded-xl flex justify-center items-center ${sacred ? 'bg-black/90' : 'bg-gray-50'}`}
      >
        <RadioGroup
          name="interactive-radio-group"
          labelText={sacred ? 'Choose your destiny' : 'Select an option'}
          options={sacred ? sacredOptions : premiumOptions}
          defaultValue={value}
          onChange={e => setValue(e.target.value)}
          sacredtheme={sacred}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

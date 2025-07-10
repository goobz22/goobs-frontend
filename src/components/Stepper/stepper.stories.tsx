// src/components/Stepper/stepper.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CustomStepper, CustomStepperProps } from './index'

const basicSteps: CustomStepperProps['steps'] = [
  { stepNumber: 1, label: 'Step One', stepLink: '#step1', status: 'completed' },
  { stepNumber: 2, label: 'Step Two', stepLink: '#step2', status: 'active' },
  {
    stepNumber: 3,
    label: 'Step Three',
    stepLink: '#step3',
    status: 'inactive',
  },
]

const errorSteps: CustomStepperProps['steps'] = [
  {
    stepNumber: 1,
    label: 'First Step',
    stepLink: '#first',
    status: 'completed',
  },
  {
    stepNumber: 2,
    label: 'Second Step (Error)',
    stepLink: '#second',
    status: 'error',
    description: 'Something went wrong here!',
  },
  {
    stepNumber: 3,
    label: 'Final Step',
    stepLink: '#final',
    status: 'inactive',
  },
]

const meta: Meta<typeof CustomStepper> = {
  title: 'Components/Stepper',
  component: CustomStepper,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof CustomStepper>

/**
 * 1) Premium Theme
 */
export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[600px] p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 font-inter">
        Premium Stepper
      </h3>
      <CustomStepper {...args} />
    </div>
  ),
  args: {
    steps: basicSteps,
    orientation: 'horizontal',
    sacredtheme: false,
  },
}

/**
 * 2) Sacred Theme
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[600px] p-6 bg-black/90 rounded-lg border border-yellow-400/30">
      <h3 className="text-xl font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
        Sacred Stepper
      </h3>
      <CustomStepper {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    steps: errorSteps,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [orientation, setOrientation] = React.useState<
    'horizontal' | 'vertical'
  >('horizontal')

  return (
    <div className="w-[700px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />
            Sacred Theme
          </label>
          <select
            value={orientation}
            onChange={e =>
              setOrientation(e.target.value as 'horizontal' | 'vertical')
            }
            className="p-1 border rounded"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
      </div>
      <div
        className={`p-6 rounded-lg ${sacred ? 'bg-black/90 border border-yellow-400/30' : 'bg-gray-50'}`}
      >
        <CustomStepper
          steps={basicSteps}
          orientation={orientation}
          sacredtheme={sacred}
        />
      </div>
    </div>
  )
}

/**
 * 3) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

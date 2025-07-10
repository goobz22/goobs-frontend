// src/components/Field/Date/DateRange/DateRange.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import DateRangeComponent, { DateRange } from './index'

const meta: Meta<typeof DateRangeComponent> = {
  title: 'Components/Field/Date/DateRange',
  component: DateRangeComponent,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    startLabel: { control: 'text' },
    endLabel: { control: 'text' },
    helperText: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof DateRangeComponent>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[600px] p-6 bg-gray-50 rounded-lg">
      <DateRangeComponent {...args} />
    </div>
  ),
  args: {
    sacredtheme: false,
    startLabel: 'Start Date',
    endLabel: 'End Date',
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[600px] p-6 bg-black rounded-lg">
      <DateRangeComponent {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
    startLabel: 'Start of Era',
    endLabel: 'End of Era',
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [value, setValue] = React.useState<DateRange>({
    start: new Date(),
    end: null,
  })

  return (
    <div className="w-[700px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <div className="grid grid-cols-3 gap-4">
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
        <DateRangeComponent
          sacredtheme={sacred}
          error={error}
          disabled={disabled}
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

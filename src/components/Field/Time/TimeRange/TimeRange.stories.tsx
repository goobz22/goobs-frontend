import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import TimeRangeComponent, { TimeRange } from './index'

const meta: Meta<typeof TimeRangeComponent> = {
  title: 'Components/Field/Time/TimeRange',
  component: TimeRangeComponent,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    showTimezone: { control: 'boolean' },
    timezone: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof TimeRangeComponent>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{
        width: '500px',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <TimeRangeComponent {...args} />
    </div>
  ),
  args: {
    startLabel: 'Start Time',
    endLabel: 'End Time',
    sacredtheme: false,
    value: {
      start: new Date(),
      end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        width: '500px',
        padding: '2rem',
        backgroundColor: '#000',
        borderRadius: '8px',
      }}
    >
      <TimeRangeComponent {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [showTimezone, setShowTimezone] = React.useState(true)
  const [value, setValue] = React.useState<TimeRange>({
    start: new Date(),
    end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
  })

  return (
    <div
      style={{
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />
            Sacred
          </label>
          <label>
            <input
              type="checkbox"
              checked={showTimezone}
              onChange={e => setShowTimezone(e.target.checked)}
            />
            Show Timezone
          </label>
        </div>
      </div>
      <div
        style={{
          padding: '2rem',
          borderRadius: '8px',
          backgroundColor: sacred ? 'black' : '#f9fafb',
        }}
      >
        <TimeRangeComponent
          value={value}
          onChange={setValue}
          sacredtheme={sacred}
          showTimezone={showTimezone}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

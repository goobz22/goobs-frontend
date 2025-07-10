// src/components/Field/Percentage/percentagefield.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import PercentageField from './index'

const meta: Meta<typeof PercentageField> = {
  title: 'Components/Field/Percentage',
  component: PercentageField,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof PercentageField>

export const Premium: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
      }}
    >
      <PercentageField {...args} />
    </div>
  ),
  args: {
    label: 'Discount Percentage',
    initialValue: '10',
    sacredtheme: false,
  },
}

export const Sacred: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: 'black',
        borderRadius: '0.5rem',
      }}
    >
      <PercentageField {...args} />
    </div>
  ),
  args: {
    ...Premium.args,
    sacredtheme: true,
  },
}

const InteractiveRenderer = () => {
  const [sacred, setSacred] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [value, setValue] = React.useState('25')

  return (
    <div
      style={{
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.5rem',
          }}
        >
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
      <div
        style={{
          padding: '2rem',
          borderRadius: '0.5rem',
          backgroundColor: sacred ? 'black' : '#f3f4f6',
        }}
      >
        <PercentageField
          label="Tax Rate"
          initialValue={value}
          onChange={e => {
            if (typeof e === 'number') setValue(String(e))
            else setValue(e.target.value)
          }}
          sacredtheme={sacred}
          disabled={disabled}
          error={error}
          min={0}
          max={100}
          step={0.5}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveRenderer />,
}

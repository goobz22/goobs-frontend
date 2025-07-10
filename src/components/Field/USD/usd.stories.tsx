import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import USDField from './index'

const meta: Meta<typeof USDField> = {
  title: 'Components/Field/USD',
  component: USDField,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    enableIncrement: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof USDField>

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
      <USDField {...args} />
    </div>
  ),
  args: {
    label: 'Amount',
    initialValue: '123.45',
    sacredtheme: false,
    enableIncrement: true,
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
      <USDField {...args} />
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
  const [value, setValue] = React.useState('99.99')
  const [increment, setIncrement] = React.useState(true)

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
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
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
          <label>
            <input
              type="checkbox"
              checked={increment}
              onChange={e => setIncrement(e.target.checked)}
            />{' '}
            Increment
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
        <USDField
          label="Enter Amount"
          value={value}
          onChange={val => setValue(val)}
          sacredtheme={sacred}
          disabled={disabled}
          error={error}
          enableIncrement={increment}
          helperText={error ? 'Invalid amount' : 'Please enter a USD value'}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveRenderer />,
}

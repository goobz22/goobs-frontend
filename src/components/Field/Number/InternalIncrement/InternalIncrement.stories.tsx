import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import InternalIncrementNumberField from './index'

const meta: Meta<typeof InternalIncrementNumberField> = {
  title: 'Components/Field/Number/InternalIncrement',
  component: InternalIncrementNumberField,
  argTypes: {
    styles: { control: 'object' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    initialValue: { control: 'text' },
    initialDelay: { control: 'number' },
    repeatInterval: { control: 'number' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof InternalIncrementNumberField>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      <InternalIncrementNumberField {...args} />
    </div>
  ),
  args: {
    label: 'Quantity',
    initialValue: '1',
    styles: { theme: 'light' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: '#000',
        borderRadius: '8px',
      }}
    >
      <InternalIncrementNumberField {...args} />
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
  const [value, setValue] = React.useState('10')

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
              checked={sacredtheme}
              onChange={e => setsacredtheme(e.target.checked)}
            />
            Sacred
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />
            Disabled
          </label>
        </div>
      </div>
      <div
        style={{
          padding: '2rem',
          borderRadius: '8px',
          backgroundColor: sacredtheme ? 'black' : '#f9fafb',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <InternalIncrementNumberField
          label="Amount"
          initialValue={value}
          onChange={e => {
            if (typeof e === 'number') {
              setValue(String(e))
            } else {
              setValue(e.target.value)
            }
          }}
          styles={{
            theme: sacredtheme ? 'sacred' : 'light',
            disabled: disabled,
          }}
          min={0}
          max={100}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

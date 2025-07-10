import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import CVV from './index'

const meta: Meta<typeof CVV> = {
  title: 'Components/Field/Number/CVV',
  component: CVV,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    isDefaultValue: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof CVV>

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
      <CVV {...args} />
    </div>
  ),
  args: {
    label: 'CVV',
    sacredtheme: false,
    placeholder: '123',
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
      <CVV {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveCVVDemo: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [isDefault, setIsDefault] = React.useState(true)
  const [value, setValue] = React.useState('123')
  const [isValid, setIsValid] = React.useState(true)

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
            gridTemplateColumns: 'repeat(3, 1fr)',
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
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />
            Disabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={e => setIsDefault(e.target.checked)}
            />
            Is Default Value
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
        <CVV
          label="Interactive CVV"
          value={value}
          onChange={(val, valid) => {
            setValue(val)
            setIsValid(valid)
          }}
          sacredtheme={sacred}
          disabled={disabled}
          isDefaultValue={isDefault}
          errorMessage={!isValid ? 'Invalid CVV' : undefined}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveCVVDemo />,
}

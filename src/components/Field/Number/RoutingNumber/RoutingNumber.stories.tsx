import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import RoutingNumber from './index'

const meta: Meta<typeof RoutingNumber> = {
  title: 'Components/Field/Number/RoutingNumber',
  component: RoutingNumber,
  argTypes: {
    styles: { control: 'object' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    isDefaultValue: { control: 'boolean' },
    useChecksum: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof RoutingNumber>

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
      <RoutingNumber {...args} />
    </div>
  ),
  args: {
    label: 'Routing Number',
    placeholder: '021000021',
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
      <RoutingNumber {...args} />
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
  const [isDefault, setIsDefault] = React.useState(true)
  const [value, setValue] = React.useState('021000021')
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
          backgroundColor: sacredtheme ? 'black' : '#f9fafb',
        }}
      >
        <RoutingNumber
          label="Interactive Routing Number"
          value={value}
          onChange={(val, valid) => {
            setValue(val)
            setIsValid(valid)
          }}
          styles={{
            theme: sacredtheme ? 'sacred' : 'light',
            disabled: disabled,
          }}
          isDefaultValue={isDefault}
          helperText={!isValid ? 'Invalid routing number' : undefined}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

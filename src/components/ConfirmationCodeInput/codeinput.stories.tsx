// File: src/components/ConfirmationCodeInput/codeinput.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import ConfirmationCodeInputs from './index'

const meta: Meta<typeof ConfirmationCodeInputs> = {
  title: 'Components/ConfirmationCodeInputs',
  component: ConfirmationCodeInputs,
  argTypes: {
    codeLength: { control: 'number' },
    showActionButtons: { control: 'boolean' },
    showSendResendButton: { control: 'boolean' },
    showSuccessState: { control: 'boolean' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof ConfirmationCodeInputs>

export const Premium: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
      }}
    >
      <ConfirmationCodeInputs {...args} />
    </div>
  ),
  args: {
    isValid: true,
    styles: {
      theme: 'light',
    },
    onDisableVerification: () => alert('Verification disabled'),
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        padding: '2rem',
        backgroundColor: 'black',
        borderRadius: '0.5rem',
      }}
    >
      <ConfirmationCodeInputs {...args} />
    </div>
  ),
  args: {
    isValid: true,
    styles: {
      theme: 'sacred',
    },
    onDisableVerification: () => alert('Verification disabled'),
  },
}

const InteractiveDemo: React.FC = () => {
  const [sacredTheme, setSacredTheme] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [isValid, setIsValid] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  React.useEffect(() => {
    setIsValid(value.length === 6 && /^\d+$/.test(value))
  }, [value])

  const handleVerify = () => {
    if (isValid) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setValue('')
      }, 3000)
    }
  }

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
          borderRadius: '0.5rem',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <label>
          <input
            type="checkbox"
            checked={sacredTheme}
            onChange={e => setSacredTheme(e.target.checked)}
          />{' '}
          Sacred Theme
        </label>
      </div>
      <div
        style={{
          padding: '2rem',
          borderRadius: '0.5rem',
          backgroundColor: sacredTheme ? 'black' : '#f3f4f6',
        }}
      >
        <ConfirmationCodeInputs
          value={value}
          onChange={setValue}
          isValid={isValid}
          onVerify={handleVerify}
          styles={{
            theme: sacredTheme ? 'sacred' : 'light',
          }}
          showActionButtons={true}
          showSuccessState={showSuccess}
          onDisableVerification={() => alert('Disabled')}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
}

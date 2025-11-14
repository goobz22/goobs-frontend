/**
 * @fileoverview Storybook stories for the QRCode component.
 * These stories showcase the various themes and states for the QRCode component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'
import QRCodeComponent from './index'

const meta: Meta<typeof QRCodeComponent> = {
  title: 'Components/QRCode',
  component: QRCodeComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    username: { control: 'text' },
    appName: { control: 'text' },
    title: { control: 'text' },
    size: { control: 'number' },
    showVerifyButton: { control: 'boolean' },
    showSuccessState: { control: 'boolean' },
    showConfirmationInput: { control: 'boolean' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof QRCodeComponent>

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

export const Light: Story = {
  name: 'Light/Basic',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Two-Factor Authentication Setup',
    styles: {
      theme: 'light',
    },
  },
}

export const LightWithButton: Story = {
  name: 'Light/With Verify Button',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Complete Setup',
    showVerifyButton: true,
    styles: {
      theme: 'light',
    },
  },
}

export const LightWithConfirmation: Story = {
  name: 'Light/With Confirmation Input',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Enter Verification Code',
    showVerifyButton: true,
    showConfirmationInput: true,
    confirmationCode: '123456',
    styles: {
      theme: 'light',
    },
  },
}

export const LightWithBothButtons: Story = {
  name: 'Light/With Send/Resend + Verify Buttons',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Complete Authentication Setup',
    showVerifyButton: false,
    showConfirmationInput: true,
    confirmationCode: '123456',
    confirmationCodeProps: {
      showActionButtons: true,
      showSendResendButton: true,
      codeSent: true,
    },
    styles: {
      theme: 'light',
    },
  },
}

export const LightSuccess: Story = {
  name: 'Light/Success State',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    showSuccessState: true,
    successMessage: 'Authentication successfully enabled!',
    styles: {
      theme: 'light',
    },
  },
}

export const LightCustomSize: Story = {
  name: 'Light/Custom Size',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Large QR Code',
    size: 320,
    styles: {
      theme: 'light',
      maxWidth: '400px',
    },
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const Dark: Story = {
  name: 'Dark/Basic',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Two-Factor Authentication Setup',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithButton: Story = {
  name: 'Dark/With Verify Button',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Complete Setup',
    showVerifyButton: true,
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkSuccess: Story = {
  name: 'Dark/Success State',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    showSuccessState: true,
    successMessage: 'Authentication successfully enabled!',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES (CONTINUED)
// --------------------------------------------------------------------------

export const DarkBasic: Story = {
  name: 'Dark/Basic Setup',
  args: {
    username: 'mystic.user@example.com',
    appName: 'AuthApp',
    title: 'Authentication Portal',
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithElements: Story = {
  name: 'Dark/With Elements',
  args: {
    username: 'mystic.user@example.com',
    appName: 'AuthApp',
    title: 'Channel Divine Power',
    showVerifyButton: true,
    styles: {
      theme: 'dark',
      showGlyphs: true,
    },
    verifyButtonProps: {
      text: 'Activate Shield',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkWithBothButtons: Story = {
  name: 'Dark/With Send/Resend + Verify Buttons',
  args: {
    username: 'mystic.user@example.com',
    appName: 'AuthApp',
    title: 'Authentication Portal',
    showVerifyButton: false,
    showConfirmationInput: true,
    confirmationCode: '123456',
    confirmationCodeProps: {
      showActionButtons: true,
      showSendResendButton: true,
      codeSent: true,
    },
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const DarkSuccess: Story = {
  name: 'Dark/Success State',
  args: {
    username: 'mystic.user@example.com',
    appName: 'AuthApp',
    showSuccessState: true,
    successMessage: 'Protection Activated!',
    styles: {
      theme: 'dark',
    },
    disableVerificationButtonProps: {
      text: 'Deactivate Shield',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOMIZATION STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Customization/Custom Colors',
  args: {
    username: 'john.doe@example.com',
    appName: 'BrandApp',
    title: 'Brand Authentication',
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(239, 246, 255, 0.95)',
      borderColor: '#3b82f6',
      titleColor: '#1d4ed8',
      qrBorderColor: '#3b82f6',
    },
  },
}

export const CustomSizing: Story = {
  name: 'Customization/Custom Sizing',
  args: {
    username: 'john.doe@example.com',
    appName: 'MyApp',
    title: 'Custom Sized Setup',
    size: 200,
    styles: {
      theme: 'light',
      padding: '2rem',
      maxWidth: '500px',
    },
  },
}

// --------------------------------------------------------------------------
// INTERACTIVE STORIES
// --------------------------------------------------------------------------

// Component for Send/Resend + Verify Buttons
const SendResendVerifyComponent: React.FC = () => {
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSendResend = () => {
    setCodeSent(true)
    setCode('')
    console.log(codeSent ? 'Resending code...' : 'Sending code...')
  }

  const handleVerify = () => {
    if (code.length === 6) {
      setShowSuccess(true)
    }
  }

  const handleDisable = () => {
    setShowSuccess(false)
    setCodeSent(false)
    setCode('')
  }

  if (showSuccess) {
    return (
      <QRCodeComponent
        username="demo@example.com"
        appName="DemoApp"
        showSuccessState={true}
        successMessage="Two-Factor Authentication Verified!"
        onDisableVerification={handleDisable}
        styles={{ theme: 'light' }}
      />
    )
  }

  return (
    <QRCodeComponent
      username="demo@example.com"
      appName="DemoApp"
      title="Setup Two-Factor Authentication"
      showVerifyButton={false} // We'll use the confirmation input buttons instead
      showConfirmationInput={true}
      confirmationCode={code}
      onConfirmationCodeChange={setCode}
      confirmationCodeProps={{
        showActionButtons: true,
        showSendResendButton: true,
        codeSent: codeSent,
        onSendResend: handleSendResend,
        onVerify: handleVerify,
      }}
      styles={{ theme: 'light' }}
    />
  )
}

export const SendResendAndVerify: Story = {
  name: 'Interactive/Send/Resend + Verify Buttons',
  render: () => <SendResendVerifyComponent />,
}

// Component for Dark Send/Resend + Verify Buttons
const DarkSendResendVerifyComponent: React.FC = () => {
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSendResend = () => {
    setCodeSent(true)
    setCode('')
    console.log(codeSent ? 'Resending code...' : 'Sending code...')
  }

  const handleVerify = () => {
    if (code.length === 6) {
      setShowSuccess(true)
    }
  }

  const handleDisable = () => {
    setShowSuccess(false)
    setCodeSent(false)
    setCode('')
  }

  if (showSuccess) {
    return (
      <QRCodeComponent
        username="mystic.user@example.com"
        appName="AuthApp"
        showSuccessState={true}
        successMessage="Authentication Verified!"
        onDisableVerification={handleDisable}
        styles={{ theme: 'dark' }}
        disableVerificationButtonProps={{
          text: 'Deactivate Shield',
        }}
      />
    )
  }

  return (
    <QRCodeComponent
      username="mystic.user@example.com"
      appName="AuthApp"
      title="Authentication Portal"
      showVerifyButton={false}
      showConfirmationInput={true}
      confirmationCode={code}
      onConfirmationCodeChange={setCode}
      confirmationCodeProps={{
        showActionButtons: true,
        showSendResendButton: true,
        codeSent: codeSent,
        onSendResend: handleSendResend,
        onVerify: handleVerify,
        sendResendButtonProps: {
          text: codeSent ? 'Resend Code' : 'Send Code',
        },
        verifyButtonProps: {
          text: 'Verify Code',
        },
      }}
      styles={{ theme: 'dark' }}
    />
  )
}

export const DarkSendResendAndVerify: Story = {
  name: 'Dark/Send/Resend + Verify Buttons',
  render: () => <DarkSendResendVerifyComponent />,
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// Component for Interactive Setup
const InteractiveSetupComponent: React.FC = () => {
  const [step, setStep] = useState<'qr' | 'verify' | 'success'>('qr')
  const [code, setCode] = useState('')

  const handleVerify = () => {
    if (code.length === 6) {
      setStep('success')
    }
  }

  const handleDisable = () => {
    setStep('qr')
    setCode('')
  }

  if (step === 'success') {
    return (
      <QRCodeComponent
        username="demo@example.com"
        appName="DemoApp"
        showSuccessState={true}
        successMessage="Two-Factor Authentication Enabled!"
        onDisableVerification={handleDisable}
        styles={{ theme: 'light' }}
      />
    )
  }

  return (
    <QRCodeComponent
      username="demo@example.com"
      appName="DemoApp"
      title="Setup Two-Factor Authentication"
      showVerifyButton={true}
      showConfirmationInput={step === 'verify'}
      confirmationCode={code}
      onConfirmationCodeChange={setCode}
      onVerify={handleVerify}
      verifyButtonProps={{
        onClick: () => {
          if (step === 'qr') {
            setStep('verify')
          } else {
            handleVerify()
          }
        },
        text: step === 'qr' ? 'Continue to Verification' : 'Verify Code',
        disabled: step === 'verify' && code.length < 6,
      }}
      styles={{ theme: 'light' }}
    />
  )
}

export const InteractiveSetup: Story = {
  name: 'Interactive/Complete Setup Flow',
  render: () => <InteractiveSetupComponent />,
}

// --------------------------------------------------------------------------
// ERROR STATE STORY
// --------------------------------------------------------------------------

export const ErrorState: Story = {
  name: 'States/Error',
  render: () => {
    // Force an error by providing invalid props
    return (
      <QRCodeComponent
        username=""
        appName=""
        title="Error State Demo"
        styles={{ theme: 'light' }}
      />
    )
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  args: {
    username: 'test@example.com',
    appName: 'TestApp',
    title: 'Test QR Code',
    showVerifyButton: true,
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check QR code is visible
    const qrCode = canvas.getByTestId('mfa-qrcode')
    await expect(qrCode).toBeVisible()

    // Check title is visible
    const title = canvas.getByText('Test QR Code')
    await expect(title).toBeVisible()

    // Check info text is visible
    const infoText = canvas.getByText('TestApp: test@example.com')
    await expect(infoText).toBeVisible()

    // Check verify button is visible
    const verifyButton = canvas.getByText('Verify Code')
    await expect(verifyButton).toBeVisible()
  },
}

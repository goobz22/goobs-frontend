/**
 * @fileoverview Storybook stories for the ConfirmationCodeInput component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import ConfirmationCodeInput from './index'

const meta: Meta<typeof ConfirmationCodeInput> = {
  title: 'Components/ConfirmationCodeInput',
  component: ConfirmationCodeInput,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    codeLength: {
      control: { type: 'number', min: 4, max: 8 },
      description: 'Number of input fields for the code',
    },
    isValid: {
      control: { type: 'boolean' },
      description: 'Whether the entered code is valid',
    },
    showActionButtons: {
      control: { type: 'boolean' },
      description: 'Show verify and send/resend buttons',
    },
    showSendResendButton: {
      control: { type: 'boolean' },
      description: 'Show send/resend button',
    },
    showSuccessState: {
      control: { type: 'boolean' },
      description: 'Show success state',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof ConfirmationCodeInput>

const commonArgs = {
  codeLength: 6,
  isValid: false,
  showActionButtons: true,
  showSendResendButton: true,
  showSuccessState: false,
  onDisableVerification: () => alert('Verification disabled'),
  onVerify: () => alert('Code verified'),
  onSendResend: () => alert('Code sent/resent'),
}

export const LightTheme: Story = {
  name: 'Light Theme',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> Clean and professional code input with
          light backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for readability in bright
          environments, intuitive validation, and accessible design.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> Developer-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          styling, and smooth interactions.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical and spiritual code input with
          sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative sessions, sacred
          color schemes, and transcendent user experience.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

export const LightSuccessState: Story = {
  name: 'Light Success State',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Success State:</strong> Clean and professional success
          confirmation with light theme styling.
          <br />
          <strong>Features:</strong> Clear success indicators and accessible
          design for bright environments.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkSuccessState: Story = {
  name: 'Dark Success State',
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Success State:</strong> Modern success confirmation with
          dark theme styling and high contrast.
          <br />
          <strong>Features:</strong> Optimized for low-light environments with
          clear success indicators.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredSuccessState: Story = {
  name: 'Sacred Success State',
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Success State:</strong> Mystical and spiritual success
          confirmation with sacred golden aesthetics.
          <br />
          <strong>Features:</strong> Ethereal animations, sacred typography, and
          transcendent success experience.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    isValid: true,
    showSuccessState: true,
    styles: {
      theme: 'sacred',
    },
  },
}

export const CustomCodeLength: Story = {
  name: 'Custom Code Length',
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Custom Code Length:</strong> 4-digit code input with dark
          theme styling.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    codeLength: 4,
    styles: {
      theme: 'dark',
    },
  },
}

export const MinimalLayout: Story = {
  name: 'Minimal Layout',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div
          style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Minimal Layout:</strong> Clean code input without action
          buttons for simple verification flows.
        </div>
        <ConfirmationCodeInput {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    showActionButtons: false,
    showSendResendButton: false,
    styles: {
      theme: 'light',
    },
  },
}

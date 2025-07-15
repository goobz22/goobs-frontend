/**
 * @fileoverview Storybook stories for the RoutingNumber component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import RoutingNumber from './index'

const meta: Meta<typeof RoutingNumber> = {
  title: 'Components/Field/Number/RoutingNumber',
  component: RoutingNumber,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label for the field',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text to display below the field',
    },
    isDefaultValue: {
      control: { type: 'boolean' },
      description: 'Whether the field has a default value',
    },
    useChecksum: {
      control: { type: 'boolean' },
      description: 'Enable checksum validation',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the field is disabled',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof RoutingNumber>

const commonArgs = {
  label: 'Routing Number',
  placeholder: '021000021',
  isDefaultValue: false,
  useChecksum: true,
  disabled: false,
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
          <strong>Light Theme:</strong> Clean and professional routing number
          input with light backgrounds and checksum validation.
          <br />
          <strong>Features:</strong> Optimized for banking forms in bright
          environments, routing validation, and accessible design.
        </div>
        <RoutingNumber {...args} />
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
          <strong>Dark Theme:</strong> Banking-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          routing validation, and smooth interactions.
        </div>
        <RoutingNumber {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual routing number
          input with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative banking
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <RoutingNumber {...args} />
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

export const BankingForm: Story = {
  name: 'Banking Form',
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
          <strong>Banking Form:</strong> Routing number input optimized for
          banking forms with checksum validation and helper text.
        </div>
        <RoutingNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Bank Routing Number',
    placeholder: '021000021',
    helperText: 'Enter your 9-digit bank routing number',
    useChecksum: true,
    styles: {
      theme: 'light',
    },
  },
}

export const WithoutValidation: Story = {
  name: 'Without Validation',
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
          <strong>Without Validation:</strong> Dark theme with checksum
          validation disabled for simple routing number input.
        </div>
        <RoutingNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Simple Routing Number',
    placeholder: '123456789',
    useChecksum: false,
    helperText: 'Enter 9-digit routing number (validation disabled)',
    styles: {
      theme: 'dark',
    },
  },
}

export const PrefilledRouting: Story = {
  name: 'Prefilled Routing',
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
          <strong>Prefilled Routing:</strong> Light theme with pre-populated
          routing number for existing customers.
        </div>
        <RoutingNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '021000021',
    isDefaultValue: true,
    helperText: 'Routing number from your bank profile',
    styles: {
      theme: 'light',
    },
  },
}

export const DisabledState: Story = {
  name: 'Disabled State',
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
          <strong>Disabled State:</strong> Field in disabled state with
          pre-configured routing number that cannot be modified.
        </div>
        <RoutingNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '021000021',
    helperText: 'Routing number is saved securely',
    styles: {
      theme: 'dark',
      disabled: true,
    },
  },
}

export const SacredBanking: Story = {
  name: 'Sacred Banking',
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
          <strong>Sacred Banking:</strong> Sacred theme for mystical banking
          with transcendent routing validation and divine security.
        </div>
        <RoutingNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Sacred Routing Number',
    placeholder: 'Enter sacred routing digits',
    helperText: 'Your divine banking pathway',
    styles: {
      theme: 'sacred',
    },
  },
}

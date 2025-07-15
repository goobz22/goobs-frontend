/**
 * @fileoverview Storybook stories for the CreditCardNumber component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import CreditCardNumber from './index'

const meta: Meta<typeof CreditCardNumber> = {
  title: 'Components/Field/Number/CreditCardNumber',
  component: CreditCardNumber,
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
    useLuhnValidation: {
      control: { type: 'boolean' },
      description: 'Enable Luhn algorithm validation',
    },
    enableFormatting: {
      control: { type: 'boolean' },
      description: 'Enable automatic formatting with spaces',
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

type Story = StoryObj<typeof CreditCardNumber>

const commonArgs = {
  label: 'Credit Card Number',
  placeholder: '1234 5678 9012 3456',
  isDefaultValue: false,
  useLuhnValidation: true,
  enableFormatting: true,
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
          <strong>Light Theme:</strong> Clean and professional credit card
          number input with light backgrounds and Luhn validation.
          <br />
          <strong>Features:</strong> Optimized for payment forms in bright
          environments, card type detection, and accessible design.
        </div>
        <CreditCardNumber {...args} />
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
          <strong>Dark Theme:</strong> Secure payment dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          card validation, and smooth interactions.
        </div>
        <CreditCardNumber {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual credit card
          input with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative payment
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <CreditCardNumber {...args} />
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

export const PaymentCheckout: Story = {
  name: 'Payment Checkout',
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
          <strong>Payment Checkout:</strong> Credit card input optimized for
          checkout forms with full validation and formatting.
        </div>
        <CreditCardNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Card Number',
    placeholder: 'Enter your card number',
    helperText: 'We support Visa, MasterCard, American Express, and Discover',
    useLuhnValidation: true,
    enableFormatting: true,
    styles: {
      theme: 'light',
    },
  },
}

export const WithoutFormatting: Story = {
  name: 'Without Formatting',
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
          <strong>Without Formatting:</strong> Dark theme with formatting
          disabled for raw card number input.
        </div>
        <CreditCardNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Raw Card Number',
    placeholder: '1234567890123456',
    enableFormatting: false,
    helperText: 'Enter card number without spaces',
    styles: {
      theme: 'dark',
    },
  },
}

export const PrefilledCard: Story = {
  name: 'Prefilled Card',
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
          <strong>Prefilled Card:</strong> Light theme with pre-populated card
          number for returning customers.
        </div>
        <CreditCardNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '4242424242424242',
    isDefaultValue: true,
    helperText: 'Saved card ending in 4242',
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
          pre-configured card number that cannot be modified.
        </div>
        <CreditCardNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '4242424242424242',
    helperText: 'Card number is saved securely',
    styles: {
      theme: 'dark',
      disabled: true,
    },
  },
}

export const SacredPayment: Story = {
  name: 'Sacred Payment',
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
          <strong>Sacred Payment:</strong> Sacred theme for mystical payment
          with transcendent card validation and divine security.
        </div>
        <CreditCardNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Sacred Card Number',
    placeholder: 'Enter sacred card digits',
    helperText: 'Your divine payment vessel',
    styles: {
      theme: 'sacred',
    },
  },
}

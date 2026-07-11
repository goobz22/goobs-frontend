/**
 * @fileoverview Storybook stories for the CVV component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import CVV from './index'

const meta: Meta<typeof CVV> = {
  title: 'Components/Field/Number/CVV',
  component: CVV,
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
    minLength: {
      control: { type: 'number' },
      description: 'Minimum length of the CVV',
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maximum length of the CVV',
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

type Story = StoryObj<typeof CVV>

const commonArgs = {
  label: 'CVV',
  placeholder: '123',
  isDefaultValue: false,
  disabled: false,
}

export const LightTheme: Story = {
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
          <strong>Light Theme:</strong> Clean and professional CVV input with
          light backgrounds and security validation.
          <br />
          <strong>Features:</strong> Optimized for payment forms in bright
          environments, CVV validation, and accessible design.
        </div>
        <CVV {...args} />
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
          CVV validation, and smooth interactions.
        </div>
        <CVV {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual CVV input with
          sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative payment
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <CVV {...args} />
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

export const PaymentForm: Story = {
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
          <strong>Payment Form:</strong> CVV input optimized for payment forms
          with security validation and helper text.
        </div>
        <CVV {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Security Code',
    placeholder: '123',
    helperText: 'Enter the 3-digit code on the back of your card',
    minLength: 3,
    maxLength: 4,
    styles: {
      theme: 'light',
    },
  },
}

export const AmexCVV: Story = {
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
          <strong>Amex CVV:</strong> Dark theme configured for American Express
          4-digit CVV validation.
        </div>
        <CVV {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Amex Security Code',
    placeholder: '1234',
    helperText: 'Enter the 4-digit code on the front of your Amex card',
    minLength: 4,
    maxLength: 4,
    styles: {
      theme: 'dark',
    },
  },
}

export const DisabledState: Story = {
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
          <strong>Disabled State:</strong> Field in disabled state with
          pre-configured CVV that cannot be modified.
        </div>
        <CVV {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '123',
    helperText: 'CVV is saved securely',
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

export const SacredPayment: Story = {
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
          with transcendent CVV input and divine security validation.
        </div>
        <CVV {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Sacred Security Code',
    placeholder: 'Enter sacred digits',
    helperText: 'Your divine payment security code',
    styles: {
      theme: 'sacred',
    },
  },
}

/**
 * A11y regression (WCAG 1.3.1 / 3.3.1 / 4.1.2 / 4.1.3). Pins the accessible
 * error contract FieldShell wires for this field: the (password-typed) input
 * is reachable by its `<label>`, carries `aria-invalid="true"`, and points via
 * `aria-describedby` at the `role="alert"` region that announces the message.
 * No prior CVV story exercised the error state.
 */
export const AccessibleErrorState: Story = {
  args: {
    ...commonArgs,
    label: 'Card Security Code',
    error: 'Security code is invalid',
    styles: { theme: 'light' },
  },
  render: args => (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <CVV {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Card Security Code')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    await expect(describedBy).toBeTruthy()
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveAttribute('id', describedBy ?? '')
    await expect(alert).toHaveTextContent('Security code is invalid')
  },
}

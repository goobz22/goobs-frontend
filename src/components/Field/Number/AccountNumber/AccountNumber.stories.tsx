/**
 * @fileoverview Storybook stories for the AccountNumber component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import AccountNumber from './index'

const meta: Meta<typeof AccountNumber> = {
  title: 'Components/Field/Number/AccountNumber',
  component: AccountNumber,
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
      description: 'Minimum length of the account number',
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maximum length of the account number',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof AccountNumber>

const commonArgs = {
  label: 'Account Number',
  placeholder: 'Enter your account number',
  isDefaultValue: false,
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
          <strong>Light Theme:</strong> Clean and professional account number
          input with light backgrounds and validation.
          <br />
          <strong>Features:</strong> Optimized for financial forms in bright
          environments, account validation, and accessible design.
        </div>
        <AccountNumber {...args} />
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
          <strong>Dark Theme:</strong> Banking-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          account validation, and smooth interactions.
        </div>
        <AccountNumber {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual account number
          input with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative banking
          sessions, sacred color schemes, and transcendent user experience.
        </div>
        <AccountNumber {...args} />
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
          <strong>Banking Form:</strong> Account number input optimized for
          banking forms with validation and helper text.
        </div>
        <AccountNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Bank Account Number',
    placeholder: '1234567890',
    helperText: 'Enter your 10-digit bank account number',
    minLength: 10,
    maxLength: 12,
    styles: {
      theme: 'light',
    },
  },
}

export const WithDefaultValue: Story = {
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
          <strong>With Default Value:</strong> Dark theme with pre-populated
          account number for existing customers.
        </div>
        <AccountNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '1234567890',
    isDefaultValue: true,
    helperText: 'Account number from your profile',
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
          pre-configured account number that cannot be modified.
        </div>
        <AccountNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    value: '9876543210',
    helperText: 'This account number is read-only',
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

export const SacredBanking: Story = {
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
          with transcendent account number input and divine validation.
        </div>
        <AccountNumber {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Sacred Account Number',
    placeholder: 'Enter sacred account digits',
    helperText: 'Your divine account number',
    styles: {
      theme: 'sacred',
    },
  },
}

/**
 * A11y regression (WCAG 1.3.1 / 3.3.1 / 4.1.2 / 4.1.3). Pins the accessible
 * error contract FieldShell wires for this field: the input is reachable by
 * its `<label>` (label association), carries `aria-invalid="true"`, and points
 * via `aria-describedby` at the `role="alert"` region that announces the
 * message — so a screen reader hears the validation error without moving
 * focus. No prior AccountNumber story exercised the error state.
 */
export const AccessibleErrorState: Story = {
  args: {
    ...commonArgs,
    label: 'Checking Account Number',
    error: 'Account number is invalid',
    styles: { theme: 'light' },
  },
  render: args => (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <AccountNumber {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Label association: getByLabelText throws if the input has no
    // accessible name from its <label>.
    const input = canvas.getByLabelText('Checking Account Number')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    await expect(describedBy).toBeTruthy()
    // The described-by target is the live error region announcing the message.
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveAttribute('id', describedBy ?? '')
    await expect(alert).toHaveTextContent('Account number is invalid')
  },
}

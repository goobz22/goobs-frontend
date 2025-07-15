/**
 * @fileoverview Storybook stories for the InternalIncrementNumberField component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import InternalIncrementNumberField from './index'

const meta: Meta<typeof InternalIncrementNumberField> = {
  title: 'Components/Field/Number/InternalIncrement',
  component: InternalIncrementNumberField,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label for the field',
    },
    initialValue: {
      control: { type: 'text' },
      description: 'Initial value of the field',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Helper text to display below the field',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value allowed',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value allowed',
    },
    initialDelay: {
      control: { type: 'number' },
      description: 'Initial delay before repeat increment starts',
    },
    repeatInterval: {
      control: { type: 'number' },
      description: 'Interval between repeat increments',
    },

    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof InternalIncrementNumberField>

const commonArgs = {
  label: 'Quantity',
  initialValue: '1',
  min: 0,
  max: 100,
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
          <strong>Light Theme:</strong> Clean and professional numeric input
          with light backgrounds and internal increment controls.
          <br />
          <strong>Features:</strong> Optimized for quantity selection in bright
          environments, internal increment arrows, and accessible design.
        </div>
        <InternalIncrementNumberField {...args} />
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
          increment controls, and smooth interactions.
        </div>
        <InternalIncrementNumberField {...args} />
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
          <strong>Sacred Theme:</strong> Mystical and spiritual numeric input
          with sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative number
          selection, sacred color schemes, and transcendent user experience.
        </div>
        <InternalIncrementNumberField {...args} />
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

export const WithRange: Story = {
  name: 'With Range',
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
          <strong>With Range:</strong> Numeric input with custom min/max range
          restrictions for specific use cases.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Age',
    initialValue: '25',
    min: 18,
    max: 120,
    helperText: 'Enter age between 18 and 120',
    styles: {
      theme: 'light',
    },
  },
}

export const FastIncrement: Story = {
  name: 'Fast Increment',
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
          <strong>Fast Increment:</strong> Dark theme with customized increment
          timing for rapid value changes.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Fast Counter',
    initialValue: '0',
    min: 0,
    max: 1000,
    initialDelay: 200,
    repeatInterval: 50,
    helperText: 'Fast increment/decrement timing',
    styles: {
      theme: 'dark',
    },
  },
}

export const DisabledState: Story = {
  name: 'Disabled State',
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
          <strong>Disabled State:</strong> Field in disabled state with internal
          increment controls that cannot be modified.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '50',
    helperText: 'This field is disabled',
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

export const SacredCounter: Story = {
  name: 'Sacred Counter',
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
          <strong>Sacred Counter:</strong> Sacred theme for mystical counting
          with transcendent numeric input and divine increments.
        </div>
        <InternalIncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Sacred Counter',
    initialValue: '7',
    min: 1,
    max: 77,
    helperText: 'Count with sacred precision',
    styles: {
      theme: 'sacred',
    },
  },
}

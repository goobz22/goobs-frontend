/**
 * @fileoverview Storybook stories for the ExternalIncrementNumberField component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import IncrementNumberField from './index'

const meta: Meta<typeof IncrementNumberField> = {
  title: 'Components/Field/Number/ExternalIncrement',
  component: IncrementNumberField,
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

type Story = StoryObj<typeof IncrementNumberField>

const commonArgs = {
  label: 'Quantity',
  initialValue: '1',
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
          with light backgrounds and external increment controls.
          <br />
          <strong>Features:</strong> Optimized for quantity selection in bright
          environments, external increment buttons, and accessible design.
        </div>
        <IncrementNumberField {...args} />
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
        <IncrementNumberField {...args} />
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
        <IncrementNumberField {...args} />
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

export const ProductQuantity: Story = {
  name: 'Product Quantity',
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
          <strong>Product Quantity:</strong> Optimized for e-commerce quantity
          selection with external increment buttons.
        </div>
        <IncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Product Quantity',
    initialValue: '1',
    helperText: 'Select quantity to add to cart',
    styles: {
      theme: 'light',
    },
  },
}

export const OrderAmountSacred: Story = {
  name: 'Order Amount Sacred',
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
          <strong>Order Amount Sacred:</strong> Sacred theme for mystical order
          amount selection with transcendent numeric input.
        </div>
        <IncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    label: 'Order Amount',
    initialValue: '5',
    helperText: 'Enter order amount',
    styles: {
      theme: 'sacred',
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
          <strong>Disabled State:</strong> Field in disabled state with external
          increment controls that cannot be modified.
        </div>
        <IncrementNumberField {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    initialValue: '10',
    disabled: true,
    helperText: 'This field is disabled',
    styles: {
      theme: 'dark',
    },
  },
}

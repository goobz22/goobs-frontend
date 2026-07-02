/**
 * @fileoverview Storybook stories for the ExternalIncrementNumberField component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import ExternalIncrementNumberField from './index'

const meta: Meta<typeof ExternalIncrementNumberField> = {
  title: 'Components/Field/Number/ExternalIncrement',
  component: ExternalIncrementNumberField,
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
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof ExternalIncrementNumberField>

const commonArgs = {
  label: 'Quantity',
  initialValue: '0',
}

export const Default: Story = {
  args: {
    ...commonArgs,
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const WithHelperText: Story = {
  args: {
    ...commonArgs,
    helperText: 'Use the buttons to increment or decrement the value.',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const InitialValue5: Story = {
  args: {
    ...commonArgs,
    initialValue: '5',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const CustomLabel: Story = {
  args: {
    ...commonArgs,
    label: 'Items',
    initialValue: '10',
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const DarkTheme: Story = {
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const SacredTheme: Story = {
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px', backgroundColor: '#0a0a0a' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const Required: Story = {
  args: {
    ...commonArgs,
    styles: {
      required: true,
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    ...commonArgs,
    styles: {
      disabled: true,
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const CustomWidth: Story = {
  args: {
    ...commonArgs,
    styles: {
      width: '300px',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const WithBorder: Story = {
  args: {
    ...commonArgs,
    styles: {
      borderWidth: '2px',
      borderColor: '#007bff',
      borderRadius: '12px',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

export const LargeSize: Story = {
  args: {
    ...commonArgs,
    styles: {
      height: '60px',
      fontSize: '18px',
    },
  },
  render: (args: any) => (
    <div style={{ padding: '20px' }}>
      <ExternalIncrementNumberField {...args} />
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react'
import ProgressBar from './index'

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile progress bar component that supports both determinate (with specific progress value) and indeterminate (loading) modes across light, dark, and sacred themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value from 0-100 for determinate mode',
    },
    variant: {
      control: { type: 'select' },
      options: ['determinate', 'indeterminate'],
      description: 'Variant of the progress bar',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Show progress label/percentage',
    },
    label: {
      control: { type: 'text' },
      description: 'Custom label text (overrides default percentage)',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'ARIA label for accessibility',
    },
    'aria-required': {
      control: { type: 'boolean' },
      description: 'Whether the progress bar represents a required process',
    },
    styles: {
      control: { type: 'object' },
      description: 'Comprehensive styling options',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {
  args: {
    value: 65,
    variant: 'determinate',
    showLabel: true,
    styles: { theme: 'light' },
  },
}

export const Indeterminate: Story = {
  args: {
    variant: 'indeterminate',
    showLabel: true,
    styles: { theme: 'light' },
  },
}

export const LightTheme: Story = {
  args: {
    value: 45,
    variant: 'determinate',
    showLabel: true,
    styles: { theme: 'light' },
  },
}

export const DarkTheme: Story = {
  args: {
    value: 45,
    variant: 'determinate',
    showLabel: true,
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredTheme: Story = {
  args: {
    value: 45,
    variant: 'determinate',
    showLabel: true,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredIndeterminate: Story = {
  args: {
    variant: 'indeterminate',
    showLabel: true,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const CustomLabel: Story = {
  args: {
    value: 80,
    variant: 'determinate',
    showLabel: true,
    label: 'Processing files...',
    styles: { theme: 'light' },
  },
}

export const NoLabel: Story = {
  args: {
    value: 30,
    variant: 'determinate',
    showLabel: false,
    styles: { theme: 'light' },
  },
}

export const CustomSize: Story = {
  args: {
    value: 70,
    variant: 'determinate',
    showLabel: true,
    styles: {
      theme: 'light',
      width: '400px',
      height: '8px',
    },
  },
}

export const Disabled: Story = {
  args: {
    value: 50,
    variant: 'determinate',
    showLabel: true,
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

export const ProgressStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '300px',
      }}
    >
      <div>
        <h4>Starting (0%)</h4>
        <ProgressBar value={0} showLabel styles={{ theme: 'light' }} />
      </div>
      <div>
        <h4>In Progress (35%)</h4>
        <ProgressBar value={35} showLabel styles={{ theme: 'light' }} />
      </div>
      <div>
        <h4>Nearly Complete (85%)</h4>
        <ProgressBar value={85} showLabel styles={{ theme: 'light' }} />
      </div>
      <div>
        <h4>Complete (100%)</h4>
        <ProgressBar value={100} showLabel styles={{ theme: 'light' }} />
      </div>
      <div>
        <h4>Loading (Indeterminate)</h4>
        <ProgressBar
          variant="indeterminate"
          showLabel
          styles={{ theme: 'light' }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different progress states from start to completion, including indeterminate loading.',
      },
    },
  },
}

export const ThemeComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '300px',
      }}
    >
      <div>
        <h4>Light Theme</h4>
        <ProgressBar value={60} showLabel styles={{ theme: 'light' }} />
      </div>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#1f2937',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Dark Theme</h4>
        <ProgressBar value={60} showLabel styles={{ theme: 'dark' }} />
      </div>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#0a0a0a',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ color: '#FFD700', margin: '0 0 10px 0' }}>Sacred Theme</h4>
        <ProgressBar value={60} showLabel styles={{ theme: 'sacred' }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three themes: light, dark, and sacred.',
      },
    },
  },
}

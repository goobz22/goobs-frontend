/**
 * @fileoverview Storybook stories for the Chip component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import Chip from './index'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    label: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, custom colors, and layout properties.',
    },
    onDelete: { action: 'deleted' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Chip>

// --------------------------------------------------------------------------
// Basic Stories
// --------------------------------------------------------------------------

/** A default chip using the light theme. */
export const Default: Story = {
  args: {
    label: 'Default Chip',
    styles: {
      theme: 'light',
    },
  },
}

/** A chip that can be deleted. */
export const Deletable: Story = {
  args: {
    label: 'Deletable Chip',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'light',
    },
  },
}

/** A disabled chip that cannot be interacted with. */
export const Disabled: Story = {
  name: 'State/Disabled',
  args: {
    label: 'Disabled Chip',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

// --------------------------------------------------------------------------
// Theming Stories
// --------------------------------------------------------------------------

/** The light theme provides a clean, modern appearance. */
export const LightTheme: Story = {
  name: 'Theme/Light',
  args: {
    label: 'Light Theme Chip',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'light',
    },
  },
}

/** The dark theme provides a sophisticated appearance. */
export const DarkTheme: Story = {
  name: 'Theme/Dark',
  args: {
    label: 'Dark Theme Chip',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'dark',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  name: 'Theme/Sacred',
  args: {
    label: 'Sacred Chip',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'sacred',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** A sacred theme chip that is also disabled. */
export const SacredDisabled: Story = {
  name: 'Theme/Sacred Disabled',
  args: {
    label: 'Sacred & Disabled',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'sacred',
      disabled: true,
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** The chip without its default outline. */
export const NoOutline: Story = {
  name: 'Theme/No Outline',
  args: {
    label: 'No Outline',
    styles: {
      theme: 'light',
      outline: false,
    },
  },
}

// --------------------------------------------------------------------------
// Customization Stories
// --------------------------------------------------------------------------

/** A chip with custom colors. */
export const CustomColors: Story = {
  name: 'Customization/Custom Colors',
  args: {
    label: 'Custom Colors',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      color: 'rgb(34, 197, 94)',
      hoverBackgroundColor: 'rgba(34, 197, 94, 0.15)',
      hoverBorderColor: 'rgba(34, 197, 94, 0.4)',
    },
  },
}

/** A chip with custom dimensions. */
export const CustomSize: Story = {
  name: 'Customization/Custom Size',
  args: {
    label: 'Large Chip',
    onDelete: () => alert('Chip deleted!'),
    styles: {
      theme: 'light',
      height: '36px',
      padding: '0 16px',
      fontSize: '16px',
    },
  },
}

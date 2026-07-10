/**
 * @fileoverview Storybook stories for the Checkbox component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import Checkbox from './index'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Checkbox>

// --------------------------------------------------------------------------
// Basic Stories
// --------------------------------------------------------------------------

/** A default, unchecked checkbox. */
export const Unchecked: Story = {
  args: {
    checked: false,
  },
}

/** A checked checkbox. */
export const Checked: Story = {
  args: {
    checked: true,
  },
}

/** A checkbox in an indeterminate state. */
export const Indeterminate: Story = {
  name: 'State/Indeterminate',
  args: {
    indeterminate: true,
  },
}

/** A disabled checkbox that cannot be interacted with. */
export const Disabled: Story = {
  name: 'State/Disabled',
  args: {
    checked: true,
    disabled: true,
  },
}

// --------------------------------------------------------------------------
// Theming Stories
// --------------------------------------------------------------------------

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  name: 'Theme/Sacred',
  args: {
    checked: true,
    styles: {
      theme: 'sacred',
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** A sacred theme checkbox that is also disabled. */
export const SacredDisabled: Story = {
  name: 'Theme/Sacred Disabled',
  args: {
    checked: true,
    disabled: true,
    styles: {
      theme: 'sacred',
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * The dark theme on the dark canvas: the checked box fills with the dark
 * palette's blue primary (`--goobs-dark-primary`, #60a5fa) instead of gold,
 * and the inline label renders in the light slate text color
 * (`--goobs-dark-text`) so it stays legible against #111827.
 */
export const DarkTheme: Story = {
  name: 'Theme/Dark',
  args: {
    checked: true,
    children: 'Dark theme checkbox',
    styles: {
      theme: 'dark',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** The premium checkbox without its default outline. */
export const NoOutline: Story = {
  name: 'Theme/No Outline',
  args: {
    checked: true,
    styles: {
      outline: false,
    },
  },
}

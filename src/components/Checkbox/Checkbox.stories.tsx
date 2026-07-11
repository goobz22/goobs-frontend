/**
 * @fileoverview Storybook stories for the Checkbox component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
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

// --------------------------------------------------------------------------
// Accessibility Stories
// --------------------------------------------------------------------------

/**
 * A checkbox with a visible inline label (`children`). Because the wrapper is a
 * real `<label>` associated with the native `<input>`, the label text becomes
 * the control's accessible name — a screen reader announces
 * "Accept terms and conditions, checkbox". The `play` assertion resolves the
 * checkbox purely by that accessible name, which also proves the decorative
 * checkmark SVG (now `aria-hidden`) does NOT leak into the name.
 */
export const WithLabel: Story = {
  name: 'A11y/Accessible Name',
  args: {
    children: 'Accept terms and conditions',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // getByRole with an exact name only matches if the accessible name is
    // exactly the label text — i.e. the aria-hidden icon adds nothing.
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Accept terms and conditions',
    })
    expect(checkbox).toBeInTheDocument()
  },
}

/**
 * Exercises the keyboard focus ring (WCAG 2.4.7 / 2.4.11). The native `<input>`
 * is `opacity: 0`, so its own browser outline is invisible; the CSS module
 * mirrors `:focus-visible` onto the visible box as a solid outline. The `play`
 * tabs to the control with the keyboard (which triggers `:focus-visible`) so the
 * ring renders in the Chromatic snapshot, then asserts the input is focused.
 */
export const KeyboardFocusRing: Story = {
  name: 'A11y/Keyboard Focus Ring',
  args: {
    children: 'Focusable checkbox',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Focusable checkbox',
    })
    // Keyboard navigation (not a mouse click) is what activates :focus-visible.
    await userEvent.tab()
    expect(checkbox).toHaveFocus()
  },
}

/**
 * The indeterminate ("mixed") state announced programmatically. The native input
 * carries the `indeterminate` DOM property plus `aria-checked="mixed"`, so a
 * screen reader reports the tri-state rather than a plain unchecked box —
 * conveying the state without relying on the dash glyph alone (WCAG 1.4.1).
 */
export const IndeterminateWithLabel: Story = {
  name: 'A11y/Indeterminate Announced',
  args: {
    indeterminate: true,
    children: 'Select all',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Select all' })
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  },
}

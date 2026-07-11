/**
 * @fileoverview Storybook stories for the Avatar component.
 * These stories showcase the light, dark, and sacred themes along with the
 * available sizes, custom styling, and disabled state, demonstrating usage
 * with the component's real `styles` prop API.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Avatar from './index'

// --------------------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------------------

const initials = 'MG'

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, size, colors, border, and layout',
    },
    children: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
    },
  },
  decorators: [
    Story => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Avatar>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * An avatar with light theme styling.
 */
export const LightTheme: Story = {
  args: {
    children: initials,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * An avatar with dark theme styling.
 */
export const DarkTheme: Story = {
  args: {
    children: initials,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * An avatar with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  args: {
    children: initials,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// SIZE STORIES
// --------------------------------------------------------------------------

/**
 * The available avatar sizes rendered side by side.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar styles={{ theme: 'light', size: 'small' }}>S</Avatar>
      <Avatar styles={{ theme: 'light', size: 'medium' }}>M</Avatar>
      <Avatar styles={{ theme: 'light', size: 'large' }}>L</Avatar>
      <Avatar styles={{ theme: 'light', size: 'xl' }}>XL</Avatar>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * Avatars in the disabled state across all themes.
 */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  // Mixed themes in one story: no single canvas fits all three, so each avatar
  // sits on its OWN theme-matched surface (#ffffff / #111827 / #0e0e0e) with a
  // delineating border, so every disabled state is judged against the right
  // background regardless of the outer canvas.
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 12,
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Avatar styles={{ theme: 'light', disabled: true }}>{initials}</Avatar>
      </div>
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 12,
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Avatar styles={{ theme: 'dark', disabled: true }}>{initials}</Avatar>
      </div>
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 12,
          background: '#0e0e0e',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}
      >
        <Avatar styles={{ theme: 'sacred', disabled: true }}>{initials}</Avatar>
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CUSTOM STYLING STORIES
// --------------------------------------------------------------------------

/**
 * Custom colors, border, and shape applied via the scalar style overrides.
 */
export const CustomStyling: Story = {
  name: 'Styling/Custom',
  args: {
    children: initials,
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(147, 51, 234, 1)',
      color: 'white',
      borderColor: 'rgba(126, 34, 206, 1)',
      borderWidth: '2px',
      borderRadius: '12px',
      fontWeight: 600,
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// --------------------------------------------------------------------------

/**
 * A labeled avatar. Supplying `label` exposes the disc as `role="img"` with an
 * `aria-label`, so assistive technology announces the meaningful name
 * ("Matthew Goluba") instead of spelling out the raw initials. Inspect the
 * rendered node in the a11y/DOM panel: it carries `role="img"` and
 * `aria-label="Matthew Goluba"` while the visible content remains the initials.
 */
export const Labeled: Story = {
  name: 'Accessibility/Labeled',
  args: {
    children: initials,
    label: 'Matthew Goluba',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  // Regression-gate the accessible-name path: supplying `label` must expose the
  // disc as role="img" with that aria-label (so AT announces the name, not the
  // raw initials). Without this assertion the role/aria-label wiring was only
  // covered incidentally by the axe addon and a regression could pass silently.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const disc = canvas.getByRole('img', { name: 'Matthew Goluba' })
    await expect(disc).toHaveAttribute('aria-label', 'Matthew Goluba')
    // The visible content is still the initials, but the accessible name wins.
    await expect(disc).toHaveTextContent(initials)
  },
}

/**
 * A focusable avatar. Callers can make the disc interactive by spreading
 * `tabIndex`/`role`/`onClick` through the standard props. Tab to the avatar (or
 * click it) to see the theme-aware `:focus-visible` ring — the keyboard focus
 * indicator (WCAG 2.4.7). The outline survives arbitrary border/box-shadow
 * style overrides because it is drawn as `outline`, not `box-shadow`.
 */
export const Focusable: Story = {
  name: 'Accessibility/Focusable',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Avatar
        label="Light avatar"
        styles={{ theme: 'light' }}
        tabIndex={0}
        role="button"
      >
        {initials}
      </Avatar>
      <div style={{ padding: '1rem', borderRadius: 12, background: '#0e0e0e' }}>
        <Avatar
          label="Sacred avatar"
          styles={{ theme: 'sacred' }}
          tabIndex={0}
          role="button"
        >
          {initials}
        </Avatar>
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  // Regression-gate the keyboard focus indicator (WCAG 2.4.7). The play fn moves
  // real keyboard focus (Tab) onto the light avatar so :focus-visible actually
  // paints — Chromatic captures that visible ring in the baseline. Without this,
  // :focus-visible never renders in the snapshot and deleting the
  // `.root:focus-visible` rule would change no baseline and pass silently.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const light = canvas.getByRole('button', { name: 'Light avatar' })
    const sacred = canvas.getByRole('button', { name: 'Sacred avatar' })
    // Tab from the body: focus lands on the first focusable disc (the light
    // avatar), driving its :focus-visible ring for the snapshot.
    await userEvent.tab()
    await expect(light).toHaveFocus()
    // The second disc is keyboard-reachable too (its ring is snapshot-gated by
    // the FocusableSacred story, since only one element can hold focus per snap).
    await expect(sacred).toHaveAttribute('tabindex', '0')
  },
}

/**
 * The sacred-theme focus ring in isolation. A single focusable sacred avatar is
 * tabbed to so its gold `:focus-visible` outline paints and is captured by
 * Chromatic — this specifically gates the `[data-theme='sacred']:focus-visible`
 * outline-color override (deleting either it or the base rule changes this snap).
 */
export const FocusableSacred: Story = {
  name: 'Accessibility/Focusable (sacred)',
  render: () => (
    <div style={{ padding: '1rem', borderRadius: 12, background: '#0e0e0e' }}>
      <Avatar
        label="Sacred avatar"
        styles={{ theme: 'sacred' }}
        tabIndex={0}
        role="button"
      >
        {initials}
      </Avatar>
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sacred = canvas.getByRole('button', { name: 'Sacred avatar' })
    await userEvent.tab()
    await expect(sacred).toHaveFocus()
  },
}

/**
 * The dark-theme focus ring in isolation. A single focusable dark avatar is
 * tabbed to so its `:focus-visible` outline paints and is captured by Chromatic,
 * gating the `[data-theme='dark']:focus-visible` outline-color override (which no
 * other story exercises).
 */
export const FocusableDark: Story = {
  name: 'Accessibility/Focusable (dark)',
  render: () => (
    <div style={{ padding: '1rem', borderRadius: 12, background: '#111827' }}>
      <Avatar
        label="Dark avatar"
        styles={{ theme: 'dark' }}
        tabIndex={0}
        role="button"
      >
        {initials}
      </Avatar>
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dark = canvas.getByRole('button', { name: 'Dark avatar' })
    await userEvent.tab()
    await expect(dark).toHaveFocus()
  },
}

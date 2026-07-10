/**
 * @fileoverview Storybook stories for the Avatar component.
 * These stories showcase the light, dark, and sacred themes along with the
 * available sizes, custom styling, and disabled state, demonstrating usage
 * with the component's real `styles` prop API.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
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

/**
 * @fileoverview Storybook stories for the Avatar component.
 * These stories showcase the light, dark, and sacred themes along with the
 * available sizes, custom styling, and disabled state, demonstrating usage
 * with the component's real `styles` prop API.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
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
  tags: ['autodocs'],
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
  name: 'Light Theme',
  args: {
    children: initials,
    styles: { theme: 'light' },
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/**
 * An avatar with dark theme styling.
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    children: initials,
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * An avatar with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    children: initials,
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// SIZE STORIES
// --------------------------------------------------------------------------

/**
 * The available avatar sizes rendered side by side.
 */
export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar styles={{ theme: 'light', size: 'small' }}>S</Avatar>
      <Avatar styles={{ theme: 'light', size: 'medium' }}>M</Avatar>
      <Avatar styles={{ theme: 'light', size: 'large' }}>L</Avatar>
      <Avatar styles={{ theme: 'light', size: 'xl' }}>XL</Avatar>
    </div>
  ),
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * Avatars in the disabled state across all themes.
 */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar styles={{ theme: 'light', disabled: true }}>{initials}</Avatar>
      <Avatar styles={{ theme: 'dark', disabled: true }}>{initials}</Avatar>
      <Avatar styles={{ theme: 'sacred', disabled: true }}>{initials}</Avatar>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
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
  parameters: {
    backgrounds: { default: 'light' },
  },
}

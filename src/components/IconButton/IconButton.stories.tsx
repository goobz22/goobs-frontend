/**
 * @fileoverview Storybook stories for the IconButton component.
 * These stories showcase the light, dark, and sacred themes along with the
 * size and color variants of the icon-only button, demonstrating its usage
 * with React and JSX.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import IconButton from './'
import DeleteIcon from '../Icons/Delete'
import EditIcon from '../Icons/Edit'
import AddIcon from '../Icons/Add'
import FavoriteIcon from '../Icons/Favorite'

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
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

type Story = StoryObj<typeof IconButton>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * An icon button with light theme styling.
 */
export const LightTheme: Story = {
  args: {
    children: <EditIcon styles={{ theme: 'light' }} />,
    styles: { theme: 'light' },
    // Icon-only button → an accessible name is required (WCAG 4.1.2); the icon
    // carries no text alternative, so the button would otherwise be nameless.
    'aria-label': 'Edit',
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * An icon button with dark theme styling.
 */
export const DarkTheme: Story = {
  args: {
    children: <EditIcon styles={{ theme: 'dark' }} />,
    styles: { theme: 'dark' },
    'aria-label': 'Edit',
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * An icon button with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  args: {
    children: <EditIcon styles={{ theme: 'sacred' }} />,
    styles: { theme: 'sacred' },
    'aria-label': 'Edit',
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// SIZE STORIES
// --------------------------------------------------------------------------

/**
 * The icon button rendered at every supported size.
 */
export const Sizes: Story = {
  name: 'Variants/Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton size="xsmall" styles={{ theme: 'light' }} aria-label="Delete">
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton size="small" styles={{ theme: 'light' }} aria-label="Delete">
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton size="medium" styles={{ theme: 'light' }} aria-label="Delete">
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton size="large" styles={{ theme: 'light' }} aria-label="Delete">
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// COLOR STORIES
// --------------------------------------------------------------------------

/**
 * The icon button rendered with each color scheme.
 */
export const Colors: Story = {
  name: 'Variants/Colors',
  // Every button is light-themed; the six semantic colors render as solid
  // colored circles with a white icon (the button's `color` drives the icon
  // via currentColor), and the `default` button shows a dark icon on the
  // white canvas — so the whole set belongs on the light canvas, with no
  // per-block wrappers needed.
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton
        color="primary"
        styles={{ theme: 'light' }}
        aria-label="Favorite (primary)"
      >
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton
        color="secondary"
        styles={{ theme: 'light' }}
        aria-label="Favorite (secondary)"
      >
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton
        color="success"
        styles={{ theme: 'light' }}
        aria-label="Favorite (success)"
      >
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton
        color="error"
        styles={{ theme: 'light' }}
        aria-label="Favorite (error)"
      >
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton
        color="info"
        styles={{ theme: 'light' }}
        aria-label="Favorite (info)"
      >
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton
        color="warning"
        styles={{ theme: 'light' }}
        aria-label="Favorite (warning)"
      >
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton
        color="default"
        styles={{ theme: 'light' }}
        aria-label="Favorite (default)"
      >
        <FavoriteIcon styles={{ theme: 'light' }} />
      </IconButton>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * An icon button in the disabled state across all themes.
 */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  // Mixed-theme story: each disabled button sits on the surface its palette is
  // designed for; the canvas stays sacred #0e0e0e for the sacred button.
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <IconButton
          styles={{ theme: 'light', disabled: true }}
          aria-label="Add item"
        >
          <AddIcon styles={{ theme: 'light' }} />
        </IconButton>
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <IconButton
          styles={{ theme: 'dark', disabled: true }}
          aria-label="Add item"
        >
          <AddIcon styles={{ theme: 'dark' }} />
        </IconButton>
      </div>
      <IconButton
        styles={{ theme: 'sacred', disabled: true }}
        aria-label="Add item"
      >
        <AddIcon styles={{ theme: 'sacred' }} />
      </IconButton>
    </div>
  ),
}

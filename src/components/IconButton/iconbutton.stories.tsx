/**
 * @fileoverview Storybook stories for the IconButton component.
 * These stories showcase the light, dark, and sacred themes along with the
 * size and color variants of the icon-only button, demonstrating its usage
 * with React and JSX.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
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

type Story = StoryObj<typeof IconButton>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * An icon button with light theme styling.
 */
export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    children: <EditIcon styles={{ theme: 'light' }} />,
    styles: { theme: 'light' },
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/**
 * An icon button with dark theme styling.
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    children: <EditIcon styles={{ theme: 'dark' }} />,
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * An icon button with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    children: <EditIcon styles={{ theme: 'sacred' }} />,
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
 * The icon button rendered at every supported size.
 */
export const Sizes: Story = {
  name: 'Variants/Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton size="xsmall" styles={{ theme: 'light' }}>
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton size="small" styles={{ theme: 'light' }}>
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton size="medium" styles={{ theme: 'light' }}>
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton size="large" styles={{ theme: 'light' }}>
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

// --------------------------------------------------------------------------
// COLOR STORIES
// --------------------------------------------------------------------------

/**
 * The icon button rendered with each color scheme.
 */
export const Colors: Story = {
  name: 'Variants/Colors',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton color="primary" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton color="secondary" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton color="success" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton color="error" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton color="info" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton color="warning" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton color="default" styles={{ theme: 'light' }}>
        <FavoriteIcon styles={{ theme: 'light' }} />
      </IconButton>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * An icon button in the disabled state across all themes.
 */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <IconButton styles={{ theme: 'light', disabled: true }}>
        <AddIcon styles={{ theme: 'light' }} />
      </IconButton>
      <IconButton styles={{ theme: 'dark', disabled: true }}>
        <AddIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <IconButton styles={{ theme: 'sacred', disabled: true }}>
        <AddIcon styles={{ theme: 'sacred' }} />
      </IconButton>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

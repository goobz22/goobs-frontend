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

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// --------------------------------------------------------------------------

/**
 * Accessible name (WCAG 4.1.2 / 1.1.1). An icon-only button has no visible
 * text and the goobs icon `<svg>` carries no text alternative, so a name MUST
 * be supplied programmatically. This story shows both mechanisms:
 *
 * - **`aria-label`** — the common case; a concise action phrase becomes the
 *   button's accessible name.
 * - **`aria-labelledby`** — point at a visible element that already names the
 *   action (here the "Add to cart" caption beside the button).
 *
 * Tab to either button in the a11y/Accessibility addon and confirm the name is
 * announced. Rendering an IconButton with neither logs a development-only
 * `console.warn`.
 */
export const AccessibleName: Story = {
  name: 'Accessibility/Accessible name',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      {/* aria-label supplies the name directly. */}
      <IconButton styles={{ theme: 'light' }} aria-label="Delete row">
        <DeleteIcon styles={{ theme: 'light' }} />
      </IconButton>

      {/* aria-labelledby borrows the name from the visible caption. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <IconButton styles={{ theme: 'light' }} aria-labelledby="add-cart-label">
          <AddIcon styles={{ theme: 'light' }} />
        </IconButton>
        <span id="add-cart-label">Add to cart</span>
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Keyboard focus visibility (WCAG 2.4.7 Focus Visible / 2.4.11). Tab through
 * the row: every theme — including **sacred** — renders a clearly-visible focus
 * ring (`:focus-visible` in Button.module.css). Sacred previously suppressed the
 * ring because the component forced an inline `outline: none`; that inline value
 * outranked the `:focus-visible` rule. The forced outline was removed, so the
 * keyboard ring is restored while pointer users still see no resting outline.
 */
export const KeyboardFocus: Story = {
  name: 'Accessibility/Keyboard focus',
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        background: '#0e0e0e',
        padding: '1.5rem',
        borderRadius: '8px',
      }}
    >
      <IconButton styles={{ theme: 'sacred' }} aria-label="Edit (sacred)">
        <EditIcon styles={{ theme: 'sacred' }} />
      </IconButton>
      <IconButton styles={{ theme: 'dark' }} aria-label="Edit (dark)">
        <EditIcon styles={{ theme: 'dark' }} />
      </IconButton>
      <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 8 }}>
        <IconButton styles={{ theme: 'light' }} aria-label="Edit (light)">
          <EditIcon styles={{ theme: 'light' }} />
        </IconButton>
      </div>
    </div>
  ),
}

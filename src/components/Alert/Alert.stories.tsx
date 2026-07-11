/**
 * @fileoverview Storybook stories for the Alert component.
 * These stories showcase the different severity levels, themes, and functionalities of the Alert.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn, waitFor } from 'storybook/test'
import Alert from './index'

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    severity: {
      control: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    message: { control: 'text' },
    onClose: { action: 'closed' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: '500px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Alert>

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

/** A light-themed alert for successful operations. */
export const LightSuccess: Story = {
  name: 'Light/Success',
  args: {
    severity: 'success',
    message: 'Your operation was completed successfully.',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A light-themed alert for informational messages. */
export const LightInfo: Story = {
  name: 'Light/Info',
  args: {
    severity: 'info',
    message: 'Here is some information that might be useful to you.',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A light-themed alert for warnings. */
export const LightWarning: Story = {
  name: 'Light/Warning',
  args: {
    severity: 'warning',
    message: 'Warning: This action may have unintended consequences.',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A light-themed alert for errors. */
export const LightError: Story = {
  name: 'Light/Error',
  args: {
    severity: 'error',
    message: 'An error occurred while processing your request.',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A dismissible light-themed alert. */
export const LightDismissible: Story = {
  name: 'Light/Dismissible',
  args: {
    severity: 'info',
    message: 'You can close this alert by clicking the close button.',
    onClose: fn(),
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

/** A dark-themed alert for successful operations. */
export const DarkSuccess: Story = {
  name: 'Dark/Success',
  args: {
    severity: 'success',
    message: 'Your operation was completed successfully.',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A dark-themed alert for informational messages. */
export const DarkInfo: Story = {
  name: 'Dark/Info',
  args: {
    severity: 'info',
    message: 'Here is some information that might be useful to you.',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A dark-themed alert for warnings. */
export const DarkWarning: Story = {
  name: 'Dark/Warning',
  args: {
    severity: 'warning',
    message: 'Warning: This action may have unintended consequences.',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A dark-themed alert for errors. */
export const DarkError: Story = {
  name: 'Dark/Error',
  args: {
    severity: 'error',
    message: 'An error occurred while processing your request.',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

/** A sacred-themed alert for successful operations. */
export const SacredSuccess: Story = {
  name: 'Sacred/Success',
  args: {
    severity: 'success',
    message: 'The sacred ritual has been successfully completed.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** A sacred-themed alert for informational messages. */
export const SacredInfo: Story = {
  name: 'Sacred/Info',
  args: {
    severity: 'info',
    message: 'Ancient scrolls of wisdom have been unearthed.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** A sacred-themed alert for warnings. */
export const SacredWarning: Story = {
  name: 'Sacred/Warning',
  args: {
    severity: 'warning',
    message: 'The celestial alignment is imminent. Prepare yourself.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/** A sacred-themed alert for errors. */
export const SacredError: Story = {
  name: 'Sacred/Error',
  args: {
    severity: 'error',
    message: 'A dark energy has corrupted the sacred artifacts.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  args: {
    severity: 'info',
    message: 'This is a dismissible alert.',
    onClose: fn(), // spy so we can assert onClose fires after the exit delay
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // The close button is icon-only; its accessible name must be a real word,
    // NOT the "✕" glyph, so it is resolvable by role + name (WCAG 4.1.2).
    const closeButton = canvas.getByRole('button', { name: 'Close' })

    // Check that the alert and close button are visible
    await expect(canvas.getByText(args.message)).toBeVisible()
    await expect(closeButton).toBeVisible()

    // Click the close button — onClose fires after the 200ms exit animation.
    await userEvent.click(closeButton)
    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY TEST — exercises the a11y semantics added in the 2026-07-11
// audit: the assertive live region (role="alert"), the visually-hidden severity
// prefix that carries the severity to screen readers when the icon is decorative
// (WCAG 1.4.1/1.3.1), and the named icon-only close button (WCAG 4.1.2).
// --------------------------------------------------------------------------

export const AccessibilitySemantics: Story = {
  name: 'A11y/Semantics',
  args: {
    severity: 'error',
    message: 'An error occurred while processing your request.',
    onClose: fn(),
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // 1. The alert exposes the assertive live-region role.
    const alert = canvas.getByRole('alert')
    await expect(alert).toBeInTheDocument()

    // 2. The severity is announced textually, not by icon/colour alone. The
    //    label is in the accessibility tree but visually hidden.
    const severityLabel = canvas.getByText('Error:')
    await expect(severityLabel).toBeInTheDocument()
    await expect(severityLabel).not.toBeVisible()

    // 3. The message text is present and visible.
    await expect(canvas.getByText(args.message)).toBeVisible()

    // 4. The icon-only close button has an accessible name.
    const closeButton = canvas.getByRole('button', { name: 'Close' })
    await expect(closeButton).toBeVisible()

    // 5. The button is type="button" so it never submits an enclosing form.
    await expect(closeButton).toHaveAttribute('type', 'button')

    // 6. Keyboard focus reaches the close button.
    closeButton.focus()
    await expect(closeButton).toHaveFocus()
  },
}

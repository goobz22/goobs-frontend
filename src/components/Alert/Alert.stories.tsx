/**
 * @fileoverview Storybook stories for the Alert component.
 * These stories showcase the different severity levels, themes, and functionalities of the Alert.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn } from 'storybook/test'
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
}

/** A light-themed alert for informational messages. */
export const LightInfo: Story = {
  name: 'Light/Info',
  args: {
    severity: 'info',
    message: 'Here is some information that might be useful to you.',
    styles: { theme: 'light' },
  },
}

/** A light-themed alert for warnings. */
export const LightWarning: Story = {
  name: 'Light/Warning',
  args: {
    severity: 'warning',
    message: 'Warning: This action may have unintended consequences.',
    styles: { theme: 'light' },
  },
}

/** A light-themed alert for errors. */
export const LightError: Story = {
  name: 'Light/Error',
  args: {
    severity: 'error',
    message: 'An error occurred while processing your request.',
    styles: { theme: 'light' },
  },
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
  globals: { backgrounds: { value: 'dark' } },
}

/** A sacred-themed alert for informational messages. */
export const SacredInfo: Story = {
  name: 'Sacred/Info',
  args: {
    severity: 'info',
    message: 'Ancient scrolls of wisdom have been unearthed.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A sacred-themed alert for warnings. */
export const SacredWarning: Story = {
  name: 'Sacred/Warning',
  args: {
    severity: 'warning',
    message: 'The celestial alignment is imminent. Prepare yourself.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** A sacred-themed alert for errors. */
export const SacredError: Story = {
  name: 'Sacred/Error',
  args: {
    severity: 'error',
    message: 'A dark energy has corrupted the sacred artifacts.',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  args: {
    severity: 'info',
    message: 'This is a dismissible alert.',
    onClose: () => {}, // Provide a mock function for the test
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const closeButton = canvas.getByText('✕')

    // Check that the alert and close button are visible
    await expect(canvas.getByText(args.message)).toBeVisible()
    await expect(closeButton).toBeVisible()

    // Click the close button
    await userEvent.click(closeButton)

    // In a real app, the component would unmount. Here we can't test for disappearance
    // because the `onClose` is just an action. We have tested the clickability.
  },
}

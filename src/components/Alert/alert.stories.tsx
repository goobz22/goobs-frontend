/**
 * @fileoverview Storybook stories for the Alert component.
 * These stories showcase the different severity levels, themes, and functionalities of the Alert.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
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
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
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
// PREMIUM THEME STORIES
// --------------------------------------------------------------------------

/** A premium-themed alert for successful operations. */
export const PremiumSuccess: Story = {
  name: 'Premium/Success',
  args: {
    severity: 'success',
    message: 'Your operation was completed successfully.',
    sacredtheme: false,
  },
}

/** A premium-themed alert for informational messages. */
export const PremiumInfo: Story = {
  name: 'Premium/Info',
  args: {
    ...PremiumSuccess.args,
    severity: 'info',
    message: 'Here is some information that might be useful to you.',
  },
}

/** A premium-themed alert for warnings. */
export const PremiumWarning: Story = {
  name: 'Premium/Warning',
  args: {
    ...PremiumSuccess.args,
    severity: 'warning',
    message: 'Warning: This action may have unintended consequences.',
  },
}

/** A premium-themed alert for errors. */
export const PremiumError: Story = {
  name: 'Premium/Error',
  args: {
    ...PremiumSuccess.args,
    severity: 'error',
    message: 'An error occurred while processing your request.',
  },
}

/** A dismissible premium-themed alert. */
export const PremiumDismissible: Story = {
  name: 'Premium/Dismissible',
  args: {
    ...PremiumInfo.args,
    message: 'You can close this alert by clicking the close button.',
    onClose: () => alert('Alert closed!'),
  },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

const sacredArgs = {
  sacredtheme: true,
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/** A sacred-themed alert for successful operations. */
export const SacredSuccess: Story = {
  name: 'Sacred/Success',
  args: {
    ...PremiumSuccess.args,
    message: 'The sacred ritual has been successfully completed.',
    ...sacredArgs,
  },
  parameters: sacredArgs.parameters,
}

/** A sacred-themed alert for informational messages. */
export const SacredInfo: Story = {
  name: 'Sacred/Info',
  args: {
    ...SacredSuccess.args,
    severity: 'info',
    message: 'Ancient scrolls of wisdom have been unearthed.',
  },
  parameters: sacredArgs.parameters,
}

/** A sacred-themed alert for warnings. */
export const SacredWarning: Story = {
  name: 'Sacred/Warning',
  args: {
    ...SacredSuccess.args,
    severity: 'warning',
    message: 'The celestial alignment is imminent. Prepare yourself.',
  },
  parameters: sacredArgs.parameters,
}

/** A sacred-themed alert for errors. */
export const SacredError: Story = {
  name: 'Sacred/Error',
  args: {
    ...SacredSuccess.args,
    severity: 'error',
    message: 'A dark energy has corrupted the sacred artifacts.',
  },
  parameters: sacredArgs.parameters,
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  args: {
    severity: 'info',
    message: 'This is a dismissible alert.',
    onClose: () => {}, // Provide a mock function for the test
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

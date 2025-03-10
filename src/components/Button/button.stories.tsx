// src/components/Button/button.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import CustomButton /* , { CustomButtonProps } */ from './index' // Remove { CustomButtonProps } if unused
// For an example icon usage, we can import something from Material UI icons:
import { Send } from '@mui/icons-material'

/**
 * Storybook metadata
 */
const meta: Meta<typeof CustomButton> = {
  title: 'Components/Button',
  component: CustomButton,
  // If you want Storybook controls for certain props (color pickers, etc.), configure them here:
  argTypes: {
    backgroundcolor: { control: 'color' },
    fontcolor: { control: 'color' },
    iconcolor: { control: 'color' },
    iconsize: { control: 'text' },
  },
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof CustomButton>

/**
 * 1) Default Button
 */
export const DefaultButton: Story = {
  args: {
    text: 'Click Me',
  },
  // Optional test using Storybook "play" function
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Grab the button
    const buttonEl = canvas.getByRole('button', { name: /click me/i })

    // Simulate a user click
    await userEvent.click(buttonEl)

    // Verify some condition - for now, just ensure it's not disabled
    expect(buttonEl).not.toBeDisabled()
  },
}

/**
 * 2) Disabled Button
 */
export const DisabledButton: Story = {
  args: {
    text: 'I am disabled',
    disableButton: 'true',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttonEl = canvas.getByRole('button', { name: /i am disabled/i })

    // For disabled buttons, we just verify it exists and is disabled
    // rather than trying to click it (which would fail due to pointer-events: none)
    expect(buttonEl).toBeInTheDocument()
    expect(buttonEl).toBeDisabled()

    // We can also verify the visual styling is correct
    expect(buttonEl).toHaveStyle({
      backgroundColor: '#cccccc', // Verify the disabled gray color
      cursor: 'not-allowed',
    })
  },
}

/**
 * 3) Text (Transparent) Button
 *    (backgroundcolor="none" => "text" style)
 */
export const TextButton: Story = {
  args: {
    text: 'I am text only',
    backgroundcolor: 'none', // Transparent
    fontcolor: '#1976d2', // Typical link-blue color
  },
  // Add an 'await' call or remove `async`
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttonEl = canvas.getByRole('button', { name: /i am text only/i })

    // Confirm it is not disabled by clicking
    await userEvent.click(buttonEl)
    expect(buttonEl).not.toBeDisabled()
  },
}

/**
 * 4) Button with Icon on the Left
 */
export const WithIconLeft: Story = {
  args: {
    text: 'Send',
    icon: <Send />, // MUI icon
    iconlocation: 'left', // Icon on the left
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttonEl = canvas.getByRole('button', { name: /send/i })
    await userEvent.click(buttonEl)
    // We can assert it's still present
    expect(buttonEl).toBeInTheDocument()
  },
}

/**
 * 5) Button with Icon on the Right
 */
export const WithIconRight: Story = {
  args: {
    text: 'Send',
    icon: <Send />,
    iconlocation: 'right',
  },
  // No "play" test here, but you can add one if you like
}

/**
 * 6) Button with Icon Above the Text
 */
export const WithIconAbove: Story = {
  args: {
    text: 'Send Message',
    icon: <Send />,
    iconlocation: 'above', // Icon stacked on top
    fontlocation: 'center', // Center text
    iconsize: '24px', // Slightly larger icon
    backgroundcolor: '#3f51b5', // Indigo background
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttonEl = canvas.getByRole('button', { name: /send message/i })

    // Verify the button exists
    expect(buttonEl).toBeInTheDocument()

    // For visual testing, no need to click, just verify styling
    expect(buttonEl).toHaveStyle({
      flexDirection: 'column', // Stacked layout
    })
  },
}

/**
 * 7) Custom Colors & Sizing
 */
export const CustomColorsAndSize: Story = {
  args: {
    text: 'Custom Colors',
    backgroundcolor: '#4caf50',
    fontcolor: '#ffffff',
    width: '120px',
    height: '50px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttonEl = canvas.getByRole('button', { name: /custom colors/i })

    await userEvent.click(buttonEl)
    expect(buttonEl).not.toBeDisabled()
  },
}

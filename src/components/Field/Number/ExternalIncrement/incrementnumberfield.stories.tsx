// src/components/IncrementNumberField/numberfield.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from 'storybook/test'
import IncrementNumberField from './index'

/**
 * Setup Storybook metadata
 */
const meta: Meta<typeof IncrementNumberField> = {
  title: 'Components/Field/ExternalIncrementNumber',
  component: IncrementNumberField,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof IncrementNumberField>

/**
 * 1) Basic usage
 *    - We call `await userEvent.click(...)`, so keep `async`.
 */
export const Basic: Story = {
  name: 'Basic (Default)',
  args: {
    label: 'Increment Number',
    initialValue: '0',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that the label is present
    expect(canvas.getByLabelText('Increment Number')).toBeInTheDocument()

    // Grab the textfield and buttons
    const decrementBtn = canvas.getByRole('button', { name: '-' })
    const incrementBtn = canvas.getByRole('button', { name: '+' })
    const input = canvas.getByLabelText('Increment Number')

    // Initial should be "0"
    expect(input).toHaveValue('0')

    // Click + once
    await userEvent.click(incrementBtn)
    expect(input).toHaveValue('1')

    // Click - twice; it won't go below 0
    await userEvent.click(decrementBtn)
    expect(input).toHaveValue('0')

    await userEvent.click(decrementBtn)
    // still "0"
    expect(input).toHaveValue('0')
  },
}

/**
 * 2) With Initial Value
 *    - No `await` usage => remove `async`.
 */
export const WithInitialValue: Story = {
  args: {
    label: 'With Initial Value',
    initialValue: '5',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('With Initial Value')
    // Confirm initial
    expect(input).toHaveValue('5')
  },
}

/**
 * 3) Manual Typing
 *    - We do user interactions => keep `async`.
 */
export const ManualTyping: Story = {
  args: {
    label: 'Manual Typing',
    initialValue: '10',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Manual Typing')

    // Should start at "10"
    expect(input).toHaveValue('10')

    // Click into input and type "25"
    await userEvent.click(input)
    // We'll select all and type new value. Or we can backspace:
    await userEvent.keyboard('[Backspace][Backspace]')
    await userEvent.keyboard('25')

    // Now "25"
    expect(input).toHaveValue('25')
  },
}

/**
 * 4) Custom Styles
 *    - We do user interactions => keep `async`.
 */
export const CustomStyles: Story = {
  args: {
    label: 'Custom Colors',
    initialValue: '3',
    backgroundcolor: '#e3f2fd', // light blue
    outlinecolor: '#0d47a1', // dark blue
    fontcolor: '#d32f2f', // red
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Custom Colors')

    // Verify initial value
    expect(input).toHaveValue('3')

    // Increment
    const incrementBtn = canvas.getByRole('button', { name: '+' })
    await userEvent.click(incrementBtn)
    expect(input).toHaveValue('4')
  },
}

/**
 * 5) Multiple Increments
 *    - We do user interactions => keep `async`.
 */
export const MultipleIncrements: Story = {
  args: {
    label: 'Increments',
    initialValue: '0',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Increments')
    const incrementBtn = canvas.getByRole('button', { name: '+' })

    // Press + five times
    for (let i = 0; i < 5; i++) {
      await userEvent.click(incrementBtn)
    }
    // Expect "5"
    expect(input).toHaveValue('5')
  },
}

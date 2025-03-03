// src/components/Field/Percentage/percentagefield.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import PercentageField from './index'

/**
 * Configure Storybook metadata
 */
const meta: Meta<typeof PercentageField> = {
  title: 'Components/Field/Percentage',
  component: PercentageField,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof PercentageField>

/**
 * 1) Basic usage
 */
export const Basic: Story = {
  args: {
    label: 'Enter Percentage',
    initialValue: '50',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm the label and initial value
    const input = canvas.getByLabelText('Enter Percentage')
    expect(input).toHaveValue('50%')
  },
}

/**
 * 2) With Min/Max Constraints
 */
export const WithMinMax: Story = {
  args: {
    label: 'Constrained Percentage',
    initialValue: '25',
    min: 10,
    max: 90,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Constrained Percentage')

    // Confirm initial value "25%"
    expect(input).toHaveValue('25%')

    // Try to enter a value below min
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    // Should be constrained to 10%
    expect(input).toHaveValue('10%')

    // Try to enter a value above max
    await userEvent.clear(input)
    await userEvent.type(input, '95')
    // Should be constrained to 90%
    expect(input).toHaveValue('90%')
  },
}

/**
 * 3) Without Percentage Symbol
 */
export const WithoutSymbol: Story = {
  args: {
    label: 'No Symbol',
    initialValue: '75',
    showPercentSymbol: false,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('No Symbol')
    expect(input).toHaveValue('75')
  },
}

/**
 * 4) Decimal Values
 */
export const DecimalValues: Story = {
  args: {
    label: 'Decimal Percentage',
    initialValue: '33.5',
    step: 0.5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Decimal Percentage')

    // Confirm initial value
    expect(input).toHaveValue('33.5%')

    // Type a decimal value
    await userEvent.clear(input)
    await userEvent.type(input, '42.75')
    expect(input).toHaveValue('42.75%')
  },
}

/**
 * 5) Increment/Decrement Buttons
 */
export const IncrementDecrementButtons: Story = {
  args: {
    label: 'Increment/Decrement',
    initialValue: '50',
    min: 0,
    max: 100,
    step: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Increment/Decrement')

    // Verify initial value
    expect(input).toHaveValue('50%')

    // Click increment button 3 times (step is 5)
    const incrementButton = canvas.getByLabelText('increment')
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    expect(input).toHaveValue('65%')

    // Click decrement button 4 times
    const decrementButton = canvas.getByLabelText('decrement')
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    expect(input).toHaveValue('45%')
  },
}

/**
 * 6) Continuous Increment/Decrement
 */
export const ContinuousIncrementDecrement: Story = {
  args: {
    label: 'Hold To Continue',
    initialValue: '25',
    min: 0,
    max: 100,
    step: 5,
    initialDelay: 300,
    repeatInterval: 50,
  },
  parameters: {
    docs: {
      description: {
        story: `
          This component supports continuous increment/decrement when you hold down the buttons:
          
          - Click a button once to increment/decrement by the step amount (5% in this example)
          - Hold the button down to continuously increment/decrement
          - After a short delay (300ms), continuous changes begin
          - Changes continue until you release the button or reach min/max
          
          *Try it: Hold down the up arrow to quickly reach the max value (100%).*
        `,
      },
    },
  },
}

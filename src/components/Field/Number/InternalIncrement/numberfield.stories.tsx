// src/components/NumberField/numberfield.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import InternalIncrementNumberField from './index'

/**
 * Configure Storybook metadata
 *
 * Note: We keep the title as 'Components/NumberField' for backward compatibility
 * even though the component is now called InternalIncrementNumberField
 */
const meta: Meta<typeof InternalIncrementNumberField> = {
  title: 'Components/Field/InternalIncrementNumber',
  component: InternalIncrementNumberField,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof InternalIncrementNumberField>

/**
 * 1) Basic usage (empty by default)
 *    - No user interactions => remove `async`.
 */
export const Basic: Story = {
  args: {
    label: 'Enter a Number',
    initialValue: '',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm the label
    const input = canvas.getByLabelText('Enter a Number')
    expect(input).toHaveValue('')
  },
}

/**
 * 2) With Initial Value
 *    - No user interactions => remove `async`.
 */
export const WithInitialValue: Story = {
  args: {
    label: 'Number With Initial Value',
    initialValue: '123',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm initial value
    const input = canvas.getByLabelText('Number With Initial Value')
    expect(input).toHaveValue('123')
  },
}

/**
 * 3) Min/Max Constraints
 *    - Uses `await userEvent...` => keep `async`.
 */
export const WithMinMax: Story = {
  args: {
    label: 'Number With Min=10 & Max=20',
    initialValue: '15',
    min: 10,
    max: 20,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Number With Min=10 & Max=20')

    // Confirm initial value "15"
    expect(input).toHaveValue('15')

    // Type a smaller value "5"
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    // The component should set it to "10" since min=10
    expect(input).toHaveValue('10')

    // Type a larger value "25"
    await userEvent.clear(input)
    await userEvent.type(input, '25')
    // The component should set it to "20" since max=20
    expect(input).toHaveValue('20')
  },
}

/**
 * 4) Custom Styles
 *    - Uses `await userEvent...` => keep `async`.
 */
export const CustomStyles: Story = {
  args: {
    label: 'Custom Styled NumberField',
    initialValue: '42',
    backgroundcolor: '#fff8e1', // Light yellow
    outlinecolor: '#ff5722', // Orange
    fontcolor: '#3f51b5', // Indigo
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify initial
    const input = canvas.getByLabelText('Custom Styled NumberField')
    expect(input).toHaveValue('42')

    // Type "123"
    await userEvent.clear(input)
    await userEvent.type(input, '123')
    expect(input).toHaveValue('123')
  },
}

/**
 * 5) Manual Typing Interaction
 *    - Uses `await userEvent...` => keep `async`.
 */
export const ManualTyping: Story = {
  args: {
    label: 'Manual Typing',
    initialValue: '',
    min: 0,
    max: 999,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Manual Typing')

    // Type "567"
    await userEvent.type(input, '567')
    expect(input).toHaveValue('567')

    // Now type some non-digits like "abc", which should be ignored
    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('567')
  },
}

/**
 * 6) Increment/Decrement Button Interaction
 *    - Tests the increment/decrement buttons
 */
export const IncrementDecrementButtons: Story = {
  args: {
    label: 'Increment/Decrement',
    initialValue: '5',
    min: 0,
    max: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Increment/Decrement')

    // Verify initial value
    expect(input).toHaveValue('5')

    // Click increment button 3 times
    const incrementButton = canvas.getByLabelText('increment')
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    expect(input).toHaveValue('8')

    // Click increment button beyond max
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    // Should stop at max=10
    expect(input).toHaveValue('10')

    // Click decrement button 4 times
    const decrementButton = canvas.getByLabelText('decrement')
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    expect(input).toHaveValue('6')

    // Click decrement button beyond min
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    // Should stop at min=0
    expect(input).toHaveValue('0')
  },
}

/**
 * 7) Continuous Increment/Decrement
 *    - Demonstrates holding down buttons for continuous increment/decrement
 *    - This is a visual demonstration as Storybook's test tools don't easily simulate held buttons
 */
export const ContinuousIncrementDecrement: Story = {
  args: {
    label: 'Hold Buttons to Continue',
    initialValue: '5',
    min: 0,
    max: 20,
    // Make it faster for demo purposes
    initialDelay: 300,
    repeatInterval: 50,
  },
  parameters: {
    docs: {
      description: {
        story: `
          This component supports continuous increment/decrement when you hold down the buttons:
          
          - Click a button once to increment/decrement by 1
          - Hold the button down to continuously increment/decrement
          - The first change happens immediately
          - After a short delay (300ms in this example), continuous changes begin
          - Changes continue until you release the button
          - Values always respect min/max constraints

          *Try it: Hold down the up arrow to quickly reach the max value, or hold down the down arrow to quickly reach the min value.*
        `,
      },
    },
  },
}

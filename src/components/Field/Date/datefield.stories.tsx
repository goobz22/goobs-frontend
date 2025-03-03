// src/components/DateField/datefield.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import DateField from './index'

/**
 * Storybook metadata
 */
const meta: Meta<typeof DateField> = {
  title: 'Components/Field/Date',
  component: DateField,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof DateField>

/**
 * 1) Basic usage (no initial date)
 *    - No actual `await` usage, so remove `async`.
 */
export const Basic: Story = {
  args: {
    label: 'Select Date',
    onChange: date => console.log('Selected date =>', date),
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // We confirm the label is present
    expect(canvas.getByLabelText('Select Date')).toBeInTheDocument()
  },
}

/**
 * 2) With Initial Value
 *    - No actual `await` usage, so remove `async`.
 *    - Use the generic parameter instead of `as HTMLInputElement`.
 */
export const WithInitialValue: Story = {
  args: {
    label: 'Initial Value',
    value: new Date('2025-01-01'),
    onChange: date => console.log('Selected date =>', date),
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Should show "01/01/2025" in the input
    const input = canvas.getByLabelText<HTMLInputElement>('Initial Value')
    expect(input.value).toMatch(/01\/01\/2025/)
  },
}

/**
 * 3) Select from Calendar
 *    - Uses `await userEvent.click`, so keep it `async`.
 *    - Use the generic parameter instead of `as HTMLInputElement`.
 */
export const SelectFromCalendar: Story = {
  args: {
    label: 'Click Calendar Icon',
    onChange: date => console.log('Date chosen =>', date),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open the calendar by clicking the calendar icon
    const icon = canvas.getByRole('img', { name: /calendar/i })
    await userEvent.click(icon)

    // Now pick a date from the displayed calendar:
    const dayButton = canvas.getByRole('button', { name: /^1$/ })
    await userEvent.click(dayButton)

    // Confirm the input changed to something containing "/01/"
    const input = canvas.getByLabelText<HTMLInputElement>('Click Calendar Icon')
    expect(input.value).toMatch(/\/01\//)
  },
}

/**
 * 4) Manual Typing
 *    - Uses `await userEvent.type`, so keep `async`.
 *    - Use the generic parameter instead of `as HTMLInputElement`.
 */
export const ManualTyping: Story = {
  args: {
    label: 'Type a Date (MM/DD/YYYY)',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText<HTMLInputElement>(
      'Type a Date (MM/DD/YYYY)'
    )

    // Focus input and type "02/14/2025" character by character
    await userEvent.click(input)
    await userEvent.type(input, '02/14/2025')

    // Confirm the final value is "02/14/2025"
    expect(input.value).toBe('02/14/2025')
  },
}

/**
 * 5) Arrow Keys (Month/Day/Year)
 *    - Uses `await userEvent.keyboard`, so keep `async`.
 *    - Use the generic parameter instead of `as HTMLInputElement`.
 */
export const ArrowKeyAdjustments: Story = {
  args: {
    label: 'Use Arrow Keys',
    value: new Date('2025-03-15'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText<HTMLInputElement>('Use Arrow Keys')

    // Confirm initial value "03/15/2025"
    expect(input.value).toBe('03/15/2025')

    // Click to focus inside "month" part
    await userEvent.click(input)
    input.setSelectionRange(0, 2)

    // Press ArrowUp to go from "03" => "04"
    await userEvent.keyboard('{arrowup}')
    expect(input.value).toBe('04/15/2025')

    // Move cursor to "day" part
    input.setSelectionRange(3, 5)
    await userEvent.keyboard('{arrowdown}')
    expect(input.value).toBe('04/14/2025')

    // Move cursor to "year" part
    input.setSelectionRange(6, 10)
    await userEvent.keyboard('{arrowup}')
    expect(input.value).toBe('04/14/2026')
  },
}

// src/components/TextField/textfield.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import TextField from './index' // Removed: { TextFieldProps }
import SearchIcon from '@mui/icons-material/Search'
import { Box } from '@mui/material'

/**
 * Storybook metadata
 */
const meta: Meta<typeof TextField> = {
  title: 'Components/Field/Text',
  component: TextField,
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof TextField>

/**
 * 1) Basic usage
 *    We use `await userEvent.type(...)` => keep `async`.
 */
export const Basic: Story = {
  args: {
    label: 'Basic TextField',
    placeholder: 'Type something...',
    value: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm we see the label
    expect(canvas.getByLabelText('Basic TextField')).toBeInTheDocument()

    // Type something
    const input = canvas.getByLabelText('Basic TextField', {
      selector: 'input',
    })
    await userEvent.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  },
}

/**
 * 2) Default Value
 *    No user interaction => remove `async`.
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Default Value',
    value: 'Pre-filled text',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The input should have "Pre-filled text"
    const input = canvas.getByLabelText('Default Value', { selector: 'input' })
    expect(input).toHaveValue('Pre-filled text')
  },
}

/**
 * 3) End Adornment (e.g., a search icon)
 *    Uses userEvent => keep `async`.
 */
export const WithEndAdornment: Story = {
  args: {
    label: 'Search Field',
    value: '',
    placeholder: 'Search here',
    endAdornment: <SearchIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Search Field', { selector: 'input' })

    // Type in the search field
    await userEvent.type(input, 'React')
    expect(input).toHaveValue('React')
  },
}

/**
 * 4) No Outline
 *    Uses userEvent => keep `async`.
 */
export const OutlineNone: Story = {
  args: {
    label: 'No Outline',
    outlinecolor: 'none',
    placeholder: 'Try to type...',
    value: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('No Outline', { selector: 'input' })

    // Type something
    await userEvent.type(input, 'Invisible border')
    expect(input).toHaveValue('Invisible border')
  },
}

/**
 * 5) Custom Colors
 *    Uses userEvent => keep `async`.
 */
export const CustomColors: Story = {
  args: {
    label: 'Colored TextField',
    placeholder: 'Different colors...',
    backgroundcolor: '#f1f8e9', // Light green
    outlinecolor: '#4caf50', // Green outline
    fontcolor: '#1b5e20', // Dark green label
    inputfontcolor: '#2e7d32', // Another green for input text
    value: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Colored TextField', {
      selector: 'input',
    })

    // Type some text
    await userEvent.type(input, 'Greenish')
    expect(input).toHaveValue('Greenish')
  },
}

/**
 * 6) Manual Typing
 *    Uses userEvent => keep `async`.
 */
export const ManualTyping: Story = {
  args: {
    label: 'Manual Typing',
    placeholder: 'Type digits / letters etc.',
    value: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Manual Typing', { selector: 'input' })

    await userEvent.type(input, '123abc')
    expect(input).toHaveValue('123abc')
  },
}

/**
 * 7) Error State
 *    Uses userEvent => keep `async`.
 */
export const ErrorState: Story = {
  args: {
    label: 'Error Input',
    placeholder: 'Something is invalid...',
    value: '',
    error: true,
    helperText: 'Error: invalid input',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Type
    const input = canvas.getByLabelText('Error Input', { selector: 'input' })
    await userEvent.type(input, 'Oops...')
    expect(input).toHaveValue('Oops...')

    // Confirm the helper text
    expect(canvas.getByText('Error: invalid input')).toBeInTheDocument()
  },
}

/**
 * 8) Disabled Field
 *    No user interactions => remove `async`.
 */
export const DisabledField: Story = {
  args: {
    label: 'Disabled TextField',
    value: 'Cannot edit me',
    disabled: true,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Disabled TextField', {
      selector: 'input',
    })

    // Confirm it's disabled
    expect(input).toBeDisabled()
    expect(input).toHaveValue('Cannot edit me')
  },
}

/**
 * 9) Shrunk Label Positions
 *    No user interactions => remove `async`.
 */
export const ShrunkLabelPositions: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap={2} width="300px">
      <TextField
        label="On Notch Label"
        shrunklabelposition="onNotch"
        placeholder="onNotch placeholder"
      />
      <TextField
        label="Above Notch Label"
        shrunklabelposition="aboveNotch"
        placeholder="aboveNotch placeholder"
      />
    </Box>
  ),
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // We have two separate text fields labeled "On Notch Label" and "Above Notch Label".
    expect(canvas.getByLabelText('On Notch Label')).toBeInTheDocument()
    expect(canvas.getByLabelText('Above Notch Label')).toBeInTheDocument()
  },
}

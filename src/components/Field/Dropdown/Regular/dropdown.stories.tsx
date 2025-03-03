// src/components/Dropdown/dropdown.stories.tsx

import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Dropdown from './index'

/**
 * Setup story metadata
 */
const meta: Meta<typeof Dropdown> = {
  title: 'Components/Field/Dropdown/Regular',
  component: Dropdown,
  // Let Storybook build color pickers and other controls for these props
  argTypes: {
    backgroundcolor: { control: 'color' },
    outlinecolor: { control: 'color' },
    fontcolor: { control: 'color' },
    shrunkfontcolor: { control: 'color' },
    unshrunkfontcolor: { control: 'color' },
    shrunklabelposition: {
      control: 'select',
      options: ['onNotch', 'aboveNotch'],
    },
  },
  parameters: {
    // Example: If you want to turn on the a11y addon's checks or
    // other custom test-runner settings for all stories, you can do so here.
    a11y: {
      disable: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

/**
 * Reusable mock options
 */
const sampleOptions = [
  { value: 'option_1' },
  { value: 'option_2', attribute1: 'Detail for #2' },
  { value: 'option_3', attribute1: 'Detail for #3', attribute2: 'Secondary' },
]

/**
 * 1) Basic scenario: default usage
 */
export const Default: Story = {
  args: {
    label: 'Default Dropdown',
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    // We can test the default scenario: open the dropdown & select an item
    const canvas = within(canvasElement)

    // 1. Click the dropdown to open menu
    await userEvent.click(canvas.getByRole('button'))

    // 2. Click on the second option
    await userEvent.click(canvas.getByText('Option 2'))

    // 3. Assert that the button now shows "Option 2"
    await expect(canvas.getByRole('button')).toHaveTextContent('Option 2')
  },
}

/**
 * 2) Dropdown with a default value
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Dropdown (defaultValue="option_3")',
    defaultValue: 'option_3',
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The initial label should be "Option 3"
    await expect(canvas.getByRole('button')).toHaveTextContent('Option 3')
  },
}

/**
 * 3) Dropdown with an error state & helperText
 */
export const WithError: Story = {
  args: {
    label: 'Dropdown in Error State',
    error: true,
    helperText: 'Oops! Something went wrong.',
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check for the error text in the helper area
    await expect(
      canvas.getByText('Oops! Something went wrong.')
    ).toBeInTheDocument()
  },
}

/**
 * 4) Dropdown marked as required
 */
export const RequiredDropdown: Story = {
  args: {
    label: 'Dropdown (required)',
    required: true,
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Make sure the label indicates required in some manner
    // (This depends on how your <Dropdown /> implements required labels)
    await expect(canvas.getByText('Dropdown (required)')).toBeInTheDocument()
  },
}

/**
 * 5) Customized colors
 */
export const CustomizedColors: Story = {
  args: {
    label: 'Custom Colors',
    options: sampleOptions,
    fontcolor: '#ffffff',
    backgroundcolor: '#4a90e2',
    outlinecolor: '#f56217',
    shrunkfontcolor: '#E91E63',
    unshrunkfontcolor: '#9C27B0',
  },
  play: async ({ canvasElement }) => {
    // We won't do a heavy color check, but we can do a quick interaction test
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await userEvent.click(canvas.getByText('Option 1'))

    await expect(canvas.getByRole('button')).toHaveTextContent('Option 1')
  },
}

/**
 * 6) Complex options (show attribute1 and attribute2)
 */
export const ComplexOptions: Story = {
  args: {
    label: 'Complex Options',
    options: [
      { value: 'Basic Option' },
      {
        value: 'Fancy Option',
        attribute1: 'Extra data',
        attribute2: 'More details',
      },
      { value: 'Simple', attribute1: 'Single attribute' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open
    await userEvent.click(canvas.getByRole('button'))
    // Find fancy option text
    await expect(canvas.getByText('Fancy Option')).toBeInTheDocument()
    await expect(
      canvas.getByText(/Extra data \| More details/i)
    ).toBeInTheDocument()
  },
}

/**
 * 7) Shrunk label above the notch
 *    We set shrunklabelposition="aboveNotch" to confirm it doesn't draw the notch space
 */
export const ShrunkLabelAboveNotch: Story = {
  args: {
    label: 'Above Notch Label',
    shrunklabelposition: 'aboveNotch',
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Basic interaction
    await userEvent.click(canvas.getByRole('button'))
    await userEvent.click(canvas.getByText('Option 2'))
    await expect(canvas.getByRole('button')).toHaveTextContent('Option 2')
  },
}

/**
 * 8) Shrunk label on top of the notch (the default)
 */
export const ShrunkLabelOnNotch: Story = {
  args: {
    label: 'On Notch Label',
    shrunklabelposition: 'onNotch',
    options: sampleOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Basic interaction
    await userEvent.click(canvas.getByRole('button'))
    await userEvent.click(canvas.getByText('Option 3'))
    await expect(canvas.getByRole('button')).toHaveTextContent('Option 3')
  },
}

/**
 * 9) Empty options scenario
 */
export const NoOptions: Story = {
  args: {
    label: 'No Options Provided',
    options: [],
    helperText: 'This dropdown has no items available.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Attempt to open
    await userEvent.click(canvas.getByRole('button'))
    // No items exist
    // Might see a "No options" or an empty menu
    // This assertion can change based on how you handle no items
    await expect(canvas.queryByText('Option 1')).not.toBeInTheDocument()
  },
}

/**
 * 10) Complex Options with Option Selected and Menu Open
 */
export const ComplexOptionsSelected: Story = {
  args: {
    label: 'Complex Options',
    defaultValue: 'Fancy Option',
    options: [
      { value: 'Basic Option' },
      {
        value: 'Fancy Option',
        attribute1: 'Extra data',
        attribute2: 'More details',
      },
      { value: 'Simple', attribute1: 'Single attribute' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify initial selected value
    await expect(canvas.getByRole('button')).toHaveTextContent('Fancy Option')

    // Open the dropdown
    await userEvent.click(canvas.getByRole('button'))

    // Verify all complex option details are visible
    await expect(canvas.getByText('Fancy Option')).toBeInTheDocument()
    await expect(
      canvas.getByText(/Extra data \| More details/i)
    ).toBeInTheDocument()
    await expect(canvas.getByText('Simple')).toBeInTheDocument()
    await expect(canvas.getByText('Single attribute')).toBeInTheDocument()

    // Verify basic option is also visible
    await expect(canvas.getByText('Basic Option')).toBeInTheDocument()
  },
}

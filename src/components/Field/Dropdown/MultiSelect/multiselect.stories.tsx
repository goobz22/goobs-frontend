import type { Meta, StoryObj } from '@storybook/react'
// If using the official SB testing library + jest:
// import { within, userEvent } from '@storybook/testing-library';
// import { expect } from '@storybook/jest';
//
// If you're using the same approach from your example:
import { within, userEvent, expect } from '@storybook/test'

import MultipleSelectChip from './index'

const meta: Meta<typeof MultipleSelectChip> = {
  title: 'Components/Field/Dropdown/MultiSelect',
  component: MultipleSelectChip,
  parameters: {
    a11y: { disable: false },
  },
}
export default meta

type Story = StoryObj<typeof MultipleSelectChip>

// Example data array
const NAMES = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
]

/**
 * 1) Basic usage - No preselected items.
 */
export const Basic: Story = {
  name: 'Basic (Default)',
  args: {
    label: 'Select a Name',
    options: NAMES,
    defaultSelected: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 1. Verify label is visible
    expect(canvas.getByLabelText('Select a Name')).toBeInTheDocument()

    // 2. Click the Select to open the dropdown
    await userEvent.click(canvas.getByLabelText('Select a Name'))

    // 3. Choose "Van Henry" from the list
    await userEvent.click(canvas.getByText('Van Henry'))

    // 4. Now "Van Henry" should appear as a chip
    expect(canvas.getByText('Van Henry')).toBeInTheDocument()
  },
}

/**
 * 2) PreSelected
 */
export const PreSelected: Story = {
  args: {
    label: 'PreSelected Names',
    options: NAMES,
    defaultSelected: ['April Tucker', 'Omar Alexander'],
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Both pre-selected chips should be shown
    expect(canvas.getByText('April Tucker')).toBeInTheDocument()
    expect(canvas.getByText('Omar Alexander')).toBeInTheDocument()
  },
}

/**
 * 3) Multiple Selections
 */
export const MultipleSelections: Story = {
  args: {
    label: 'Pick Multiple',
    options: NAMES,
    defaultSelected: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open the menu
    await userEvent.click(canvas.getByLabelText('Pick Multiple'))
    // Select "Van Henry"
    await userEvent.click(canvas.getByText('Van Henry'))
    expect(canvas.getByText('Van Henry')).toBeInTheDocument()

    // Menu closes after selection, so open again
    await userEvent.click(canvas.getByLabelText('Pick Multiple'))
    await userEvent.click(canvas.getByText('April Tucker'))
    expect(canvas.getByText('April Tucker')).toBeInTheDocument()
  },
}

/**
 * 4) Custom Styles - Example usage of props like backgroundcolor, outlinecolor, etc.
 */
export const CustomStyles: Story = {
  args: {
    label: 'Custom Colors',
    options: NAMES,
    defaultSelected: ['Kelly Snyder'],
    backgroundcolor: '#f3e5f5', // Light purple
    outlinecolor: '#6a1b9a', // Dark purple
    fontcolor: '#283593', // Indigo for text
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Confirm that Kelly Snyder is initially selected
    expect(canvas.getByText('Kelly Snyder')).toBeInTheDocument()

    // Let's open the menu and deselect
    await userEvent.click(canvas.getByLabelText('Custom Colors'))
    await userEvent.click(canvas.getByText('Kelly Snyder'))

    expect(canvas.queryByText('Kelly Snyder')).not.toBeInTheDocument()
  },
}

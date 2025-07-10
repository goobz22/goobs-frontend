// src/components/Dropdown/dropdown.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/test'
import { userEvent } from '@storybook/test'
import { expect } from '@storybook/test'
import Dropdown, { DropdownOption } from './index'

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
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
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
const sampleOptions: DropdownOption[] = [
  { value: 'option_1', icon: '🚀' },
  { value: 'option_2', attribute1: 'Detail for #2', icon: '✨' },
  {
    value: 'option_3',
    attribute1: 'Detail for #3',
    attribute2: 'Secondary',
    icon: '🎉',
  },
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

export const Premium: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
      }}
    >
      <Dropdown {...args} />
    </div>
  ),
  args: {
    label: 'Select an Option',
    options: sampleOptions,
    sacredtheme: false,
    helperText: 'This is a helper text.',
  },
}

export const Sacred: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: 'black',
        borderRadius: '0.5rem',
      }}
    >
      <Dropdown {...args} />
    </div>
  ),
  args: {
    ...Premium.args,
    sacredtheme: true,
  },
}

const InteractiveDropdownDemo: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [value, setValue] = React.useState('option_1')

  return (
    <div
      style={{
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.5rem',
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />{' '}
            Sacred
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />{' '}
            Disabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={error}
              onChange={e => setError(e.target.checked)}
            />{' '}
            Error
          </label>
        </div>
      </div>
      <div
        style={{
          padding: '2rem',
          borderRadius: '0.5rem',
          backgroundColor: sacred ? 'black' : '#f3f4f6',
        }}
      >
        <Dropdown
          label="Interactive Dropdown"
          options={sampleOptions}
          value={value}
          onChange={e => setValue(e.target.value)}
          sacredtheme={sacred}
          disabled={disabled}
          error={error}
          helperText={error ? 'There is an error' : 'Looking good'}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDropdownDemo />,
}

/**
 * @fileoverview Storybook stories for the refactored Button component.
 * These stories showcase the different themes, variants, and states of the Button,
 * demonstrating its usage with React and JSX.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Button from './index'

// --------------------------------------------------------------------------
// ICON COMPONENTS (as standard React components)
// --------------------------------------------------------------------------

const SendIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="currentColor"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z" />
  </svg>
)

const AddIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="currentColor"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
)

const DownloadIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="currentColor"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
  </svg>
)

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    iconLocation: {
      control: 'radio',
      options: ['left', 'right', 'above'],
    },
    contentAlign: {
      control: 'radio',
      options: ['left', 'center', 'right'],
    },
    onClick: { action: 'clicked' },
  },
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof Button>

// --------------------------------------------------------------------------
// STORIES
// --------------------------------------------------------------------------

/**
 * A primary button with default styling.
 */
export const Primary: Story = {
  args: {
    text: 'Primary Button',
    sacredtheme: false,
    disabled: false,
  },
}

/**
 * A button with the "sacred" theme for a stylized appearance.
 */
export const sacredtheme: Story = {
  args: {
    text: 'Sacred Button',
    sacredtheme: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * A button with an icon positioned to the left of the text.
 */
export const WithIconLeft: Story = {
  args: {
    ...Primary.args,
    text: 'Send',
    icon: <SendIcon />,
    iconLocation: 'left',
  },
}

/**
 * A button with an icon positioned to the right of the text.
 */
export const WithIconRight: Story = {
  args: {
    ...Primary.args,
    text: 'Download',
    icon: <DownloadIcon />,
    iconLocation: 'right',
  },
}

/**
 * A button with an icon positioned above the text.
 */
export const WithIconAbove: Story = {
  args: {
    ...Primary.args,
    text: 'Add Item',
    icon: <AddIcon />,
    iconLocation: 'above',
  },
}

/**
 * A button that only contains an icon.
 */
export const IconOnly: Story = {
  args: {
    ...Primary.args,
    text: undefined,
    icon: <SendIcon />,
  },
}

/**
 * A button in the disabled state.
 */
export const Disabled: Story = {
  args: {
    ...Primary.args,
    text: 'Disabled Button',
    disabled: true,
  },
}

/**
 * A button in the loading state.
 */
export const Loading: Story = {
  args: {
    ...Primary.args,
    text: 'Loading...',
    loading: true,
  },
}

/**
 * A story to test interaction and accessibility.
 */
export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button text="Enabled" />
      <Button text="Disabled" disabled />
      <Button text="Click Me" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const enabledButton = canvas.getByText('Enabled')
    const disabledButton = canvas.getByText('Disabled')
    const clickMeButton = canvas.getByText('Click Me')

    // Test that the enabled button is interactive
    await userEvent.hover(enabledButton)
    await userEvent.click(enabledButton)
    await expect(enabledButton).toBeEnabled()

    // Test that the disabled button is not interactive
    await expect(disabledButton).toBeDisabled()

    // Test a specific click interaction
    await userEvent.click(clickMeButton)
  },
}

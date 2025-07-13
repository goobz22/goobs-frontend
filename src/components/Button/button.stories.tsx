/**
 * @fileoverview Storybook stories for the refactored Button component.
 * These stories showcase the different themes, variants, and states of the Button,
 * demonstrating its usage with React and JSX.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Button from './index'
import { useState } from 'react'
import { ButtonGroup } from './index' // Import ButtonGroup

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
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    icon: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
    a11y: {
      disable: false,
    },
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * A primary button with light theme styling.
 */
export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    text: 'Light Button',
    styles: { theme: 'light' },
  },
}

/**
 * A primary button with dark theme styling.
 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    text: 'Dark Button',
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * A button with the "sacred" theme for a stylized appearance.
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    text: 'Sacred Button',
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// ICON STORIES
// --------------------------------------------------------------------------

/**
 * A button with an icon positioned to the left of the text.
 */
export const WithIconLeft: Story = {
  name: 'Icon/Left',
  args: {
    text: 'Send',
    icon: <SendIcon />,
    styles: { theme: 'light', iconLocation: 'left' },
  },
}

/**
 * A button with an icon positioned to the right of the text.
 */
export const WithIconRight: Story = {
  name: 'Icon/Right',
  args: {
    text: 'Download',
    icon: <DownloadIcon />,
    styles: { theme: 'light', iconLocation: 'right' },
  },
}

/**
 * A button with an icon positioned above the text.
 */
export const WithIconAbove: Story = {
  name: 'Icon/Above',
  args: {
    text: 'Add Item',
    icon: <AddIcon />,
    styles: { theme: 'light', iconLocation: 'above' },
  },
}

/**
 * A button that only contains an icon.
 */
export const IconOnly: Story = {
  name: 'Icon/Only',
  args: {
    icon: <SendIcon />,
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * A button in the disabled state.
 */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button
        text="Disabled Light"
        styles={{ theme: 'light', disabled: true }}
      />
      <Button text="Disabled Dark" styles={{ theme: 'dark', disabled: true }} />
      <Button
        text="Disabled Sacred"
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

/**
 * A button with custom outline styling.
 */
export const OutlineStates: Story = {
  name: 'State/Outline',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button text="Outline Light" styles={{ theme: 'light', outline: true }} />
      <Button text="Outline Dark" styles={{ theme: 'dark', outline: true }} />
      <Button
        text="Outline Sacred"
        styles={{ theme: 'sacred', outline: true }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM STYLING STORIES
// --------------------------------------------------------------------------

/**
 * Custom colors and styling.
 */
export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    text: 'Custom Button',
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(147, 51, 234, 1)',
      color: 'white',
      borderColor: 'rgba(147, 51, 234, 1)',
      hoverBackgroundColor: 'rgba(126, 34, 206, 1)',
    },
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

/**
 * A story to test interaction and accessibility.
 */
export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button text="Enabled" styles={{ theme: 'light' }} />
      <Button text="Disabled" styles={{ theme: 'light', disabled: true }} />
      <Button text="Click Me" styles={{ theme: 'light' }} />
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

// New stories for ButtonGroup

export const LightThemeGroup: Story = {
  name: 'Group/Light Theme',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'light' }}
        >
          <Button value="send" text="Send" icon={<SendIcon />} />
          <Button value="add" text="Add" icon={<AddIcon />} />
          <Button value="download" text="Download" icon={<DownloadIcon />} />
        </ButtonGroup>
      )
    }
    return <Component />
  },
}

export const DarkThemeGroup: Story = {
  name: 'Group/Dark Theme',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'dark' }}
        >
          <Button value="send" text="Send" icon={<SendIcon />} />
          <Button value="add" text="Add" icon={<AddIcon />} />
          <Button value="download" text="Download" icon={<DownloadIcon />} />
        </ButtonGroup>
      )
    }
    return <Component />
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredThemeGroup: Story = {
  name: 'Group/Sacred Theme',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      return (
        <ButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => newValue && setValue(newValue)}
          styles={{ theme: 'sacred' }}
        >
          <Button value="send" text="Send" icon={<SendIcon />} />
          <Button value="add" text="Add" icon={<AddIcon />} />
          <Button value="download" text="Download" icon={<DownloadIcon />} />
        </ButtonGroup>
      )
    }
    return <Component />
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const InteractiveGroupDemo: Story = {
  name: 'Group/Interactive Demo',
  render: () => {
    const Component = () => {
      const [value, setValue] = useState('send')
      const [theme, setTheme] = useState<'light' | 'dark' | 'sacred'>('light')
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            background: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          <select
            value={theme}
            onChange={e =>
              setTheme(e.target.value as 'light' | 'dark' | 'sacred')
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sacred">Sacred</option>
          </select>
          <ButtonGroup
            value={value}
            exclusive
            onChange={(_, newValue) => newValue && setValue(newValue)}
            styles={{ theme }}
          >
            <Button value="send" icon={<SendIcon />} />
            <Button value="add" icon={<AddIcon />} />
            <Button value="download" icon={<DownloadIcon />} />
          </ButtonGroup>
        </div>
      )
    }
    return <Component />
  },
}

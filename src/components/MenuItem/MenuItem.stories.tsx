/**
 * @fileoverview Storybook stories for the MenuItem component.
 * MenuItem renders a native <option> element and is designed to be used as a
 * child of the Select component. These stories showcase its themes and the
 * dense / divider / disabled / selected states, both standalone (inside a bare
 * <select> for context) and composed inside the Select component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import MenuItem from './index'
import Select from '../Select'

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof MenuItem> = {
  title: 'Components/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dense: { control: 'boolean' },
    divider: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    value: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, and font',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MenuItem>

// A controlled Select wrapper so MenuItem children render in their natural
// container context.
const SelectWithState = ({
  initialValue = '',
  theme = 'light',
  children,
}: {
  initialValue?: string
  theme?: 'light' | 'dark' | 'sacred'
  children: React.ReactNode
}) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Select
      styles={{ theme }}
      value={value}
      onChange={event => setValue(event.target.value)}
    >
      {children}
    </Select>
  )
}

// --------------------------------------------------------------------------
// BASIC THEME STORIES (rendered inside a Select for realistic context)
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" styles={{ theme: 'light' }}>
        TypeScript
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
}

export const DarkTheme: Story = {
  render: () => (
    <SelectWithState theme="dark">
      <MenuItem value="usa" styles={{ theme: 'dark' }}>
        United States
      </MenuItem>
      <MenuItem value="canada" styles={{ theme: 'dark' }}>
        Canada
      </MenuItem>
      <MenuItem value="uk" styles={{ theme: 'dark' }}>
        United Kingdom
      </MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SelectWithState theme="sacred">
      <MenuItem value="ankh" styles={{ theme: 'sacred' }}>
        Ankh
      </MenuItem>
      <MenuItem value="eye" styles={{ theme: 'sacred' }}>
        Eye of Horus
      </MenuItem>
      <MenuItem value="scarab" styles={{ theme: 'sacred' }}>
        Scarab
      </MenuItem>
    </SelectWithState>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SELECTED STATE
// --------------------------------------------------------------------------

export const Selected: Story = {
  render: () => (
    <SelectWithState theme="light" initialValue="typescript">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" selected styles={{ theme: 'light' }}>
        TypeScript (selected)
      </MenuItem>
      <MenuItem value="react" styles={{ theme: 'light' }}>
        React
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const Disabled: Story = {
  name: 'Disabled Item',
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="available" styles={{ theme: 'light' }}>
        Available
      </MenuItem>
      <MenuItem value="unavailable" disabled styles={{ theme: 'light' }}>
        Unavailable (disabled)
      </MenuItem>
      <MenuItem value="also" styles={{ theme: 'light' }}>
        Also Available
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// DENSE STATE
// --------------------------------------------------------------------------

export const Dense: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="a" dense styles={{ theme: 'light' }}>
        Dense item A
      </MenuItem>
      <MenuItem value="b" dense styles={{ theme: 'light' }}>
        Dense item B
      </MenuItem>
      <MenuItem value="c" dense styles={{ theme: 'light' }}>
        Dense item C
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// DIVIDER STATE
// --------------------------------------------------------------------------

export const Divider: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="a" styles={{ theme: 'light' }}>
        First group item
      </MenuItem>
      <MenuItem value="b" divider styles={{ theme: 'light' }}>
        Item with divider
      </MenuItem>
      <MenuItem value="c" styles={{ theme: 'light' }}>
        Second group item
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM COLORS
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem
        value="a"
        styles={{
          theme: 'light',
          backgroundColor: 'rgba(255, 240, 245, 0.95)',
          textColor: 'rgba(139, 0, 139, 1)',
        }}
      >
        Custom styled item
      </MenuItem>
      <MenuItem value="b" styles={{ theme: 'light' }}>
        Default item
      </MenuItem>
    </SelectWithState>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <SelectWithState theme="light" initialValue="b">
          <MenuItem value="a" styles={{ theme: 'light' }}>
            Standard
          </MenuItem>
          <MenuItem value="b" selected styles={{ theme: 'light' }}>
            Selected
          </MenuItem>
          <MenuItem value="c" disabled styles={{ theme: 'light' }}>
            Disabled
          </MenuItem>
          <MenuItem value="d" dense divider styles={{ theme: 'light' }}>
            Dense + Divider
          </MenuItem>
        </SelectWithState>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <SelectWithState theme="dark" initialValue="b">
          <MenuItem value="a" styles={{ theme: 'dark' }}>
            Standard
          </MenuItem>
          <MenuItem value="b" selected styles={{ theme: 'dark' }}>
            Selected
          </MenuItem>
          <MenuItem value="c" disabled styles={{ theme: 'dark' }}>
            Disabled
          </MenuItem>
          <MenuItem value="d" dense divider styles={{ theme: 'dark' }}>
            Dense + Divider
          </MenuItem>
        </SelectWithState>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <SelectWithState theme="sacred" initialValue="b">
          <MenuItem value="a" styles={{ theme: 'sacred' }}>
            Standard
          </MenuItem>
          <MenuItem value="b" selected styles={{ theme: 'sacred' }}>
            Selected
          </MenuItem>
          <MenuItem value="c" disabled styles={{ theme: 'sacred' }}>
            Disabled
          </MenuItem>
          <MenuItem value="d" dense divider styles={{ theme: 'sacred' }}>
            Dense + Divider
          </MenuItem>
        </SelectWithState>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <SelectWithState theme="light">
      <MenuItem value="javascript" styles={{ theme: 'light' }}>
        JavaScript
      </MenuItem>
      <MenuItem value="typescript" styles={{ theme: 'light' }}>
        TypeScript
      </MenuItem>
    </SelectWithState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The MenuItem children render as native <option> elements within the
    // combobox, so their text is present in the DOM.
    await expect(canvas.getByRole('combobox')).toBeVisible()
    await expect(canvas.getByText('JavaScript')).toBeInTheDocument()
    await expect(canvas.getByText('TypeScript')).toBeInTheDocument()
  },
}

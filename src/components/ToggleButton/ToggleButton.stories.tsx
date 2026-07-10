/**
 * @fileoverview Storybook stories for the ToggleButton and ToggleButtonGroup components.
 * Demonstrates different states, themes, and compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import { ToggleButton, ToggleButtonGroup } from './index'

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    value: { control: 'text' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ToggleButton>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/** A default toggle button with light theme. */
export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  args: {
    value: 'light',
    children: 'Light Theme',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A toggle button with dark theme. */
export const DarkTheme: Story = {
  args: {
    value: 'dark',
    children: 'Dark Theme',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** The sacred theme provides a mystical, golden appearance. */
export const SacredTheme: Story = {
  args: {
    value: 'sacred',
    children: 'Sacred Theme',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/** A toggle button that is selected by default. */
export const SelectedByDefault: Story = {
  name: 'State/Selected by Default',
  args: {
    value: 'selected',
    children: 'Selected Button',
    selected: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A disabled toggle button that cannot be interacted with. */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ToggleButton
        value="disabled-light"
        disabled={true}
        styles={{ theme: 'light' }}
      >
        Disabled Light
      </ToggleButton>
      <ToggleButton
        value="disabled-dark"
        disabled={true}
        styles={{ theme: 'dark' }}
      >
        Disabled Dark
      </ToggleButton>
      <ToggleButton
        value="disabled-sacred"
        disabled={true}
        styles={{ theme: 'sacred' }}
      >
        Disabled Sacred
      </ToggleButton>
      <ToggleButton
        value="disabled-selected"
        disabled={true}
        selected={true}
        styles={{ theme: 'light' }}
      >
        Disabled Selected
      </ToggleButton>
    </div>
  ),
}

// --------------------------------------------------------------------------
// SIZE STORIES
// --------------------------------------------------------------------------

/** Toggle buttons in different sizes. */
export const Sizes: Story = {
  name: 'Sizes/All Sizes',
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <ToggleButton value="small" size="small" styles={{ theme: 'light' }}>
        Small
      </ToggleButton>
      <ToggleButton value="medium" size="medium" styles={{ theme: 'light' }}>
        Medium
      </ToggleButton>
      <ToggleButton value="large" size="large" styles={{ theme: 'light' }}>
        Large
      </ToggleButton>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** Small toggle buttons. */
export const Small: Story = {
  name: 'Sizes/Small',
  args: {
    value: 'small',
    children: 'Small Button',
    size: 'small',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/** Large toggle buttons. */
export const Large: Story = {
  name: 'Sizes/Large',
  args: {
    value: 'large',
    children: 'Large Button',
    size: 'large',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TOGGLE BUTTON GROUP STORIES
// --------------------------------------------------------------------------

const ToggleGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('option1')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="option1">Option 1</ToggleButton>
      <ToggleButton value="option2">Option 2</ToggleButton>
      <ToggleButton value="option3">Option 3</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Toggle button group with exclusive selection. */
export const ToggleGroup: Story = {
  name: 'Group/Exclusive Selection',
  render: () => <ToggleGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

const NonExclusiveGroupExample = () => {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={false}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Toggle button group with non-exclusive selection. */
export const NonExclusiveGroup: Story = {
  name: 'Group/Non-Exclusive Selection',
  render: () => <NonExclusiveGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// THEMED GROUP STORIES
// --------------------------------------------------------------------------

const DarkGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('view1')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'dark' }}
    >
      <ToggleButton value="view1">List View</ToggleButton>
      <ToggleButton value="view2">Grid View</ToggleButton>
      <ToggleButton value="view3">Card View</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Dark themed toggle button group. */
export const DarkGroup: Story = {
  name: 'Group/Dark Theme',
  render: () => <DarkGroupExample />,
  globals: { backgrounds: { value: 'dark' } },
}

const SacredGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('fire')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      styles={{ theme: 'sacred' }}
    >
      <ToggleButton value="fire">🔥 Fire</ToggleButton>
      <ToggleButton value="water">💧 Water</ToggleButton>
      <ToggleButton value="earth">🌍 Earth</ToggleButton>
      <ToggleButton value="air">💨 Air</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Sacred themed toggle button group. */
export const SacredGroup: Story = {
  name: 'Group/Sacred Theme',
  render: () => <SacredGroupExample />,
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SIZE GROUP STORIES
// --------------------------------------------------------------------------

const SmallGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('xs')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      size="small"
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="xs">XS</ToggleButton>
      <ToggleButton value="s">S</ToggleButton>
      <ToggleButton value="m">M</ToggleButton>
      <ToggleButton value="l">L</ToggleButton>
      <ToggleButton value="xl">XL</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Small sized toggle button group. */
export const SmallGroup: Story = {
  name: 'Group/Small Size',
  render: () => <SmallGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

const LargeGroupExample = () => {
  const [value, setValue] = React.useState<string | null>('monthly')
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={true}
      onChange={(_, newValue) => setValue(newValue)}
      size="large"
      styles={{ theme: 'light' }}
    >
      <ToggleButton value="weekly">Weekly</ToggleButton>
      <ToggleButton value="monthly">Monthly</ToggleButton>
      <ToggleButton value="yearly">Yearly</ToggleButton>
    </ToggleButtonGroup>
  )
}

/** Large sized toggle button group. */
export const LargeGroup: Story = {
  name: 'Group/Large Size',
  render: () => <LargeGroupExample />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Single Buttons
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ToggleButton value="default" styles={{ theme: 'light' }}>
                Default
              </ToggleButton>
              <ToggleButton
                value="selected"
                selected={true}
                styles={{ theme: 'light' }}
              >
                Selected
              </ToggleButton>
              <ToggleButton
                value="disabled"
                disabled={true}
                styles={{ theme: 'light' }}
              >
                Disabled
              </ToggleButton>
            </div>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Button Group
            </p>
            <ToggleButtonGroup
              value="option2"
              exclusive={true}
              onChange={() => {}}
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="option1">Option 1</ToggleButton>
              <ToggleButton value="option2">Option 2</ToggleButton>
              <ToggleButton value="option3">Option 3</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Single Buttons
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ToggleButton value="default" styles={{ theme: 'dark' }}>
                Default
              </ToggleButton>
              <ToggleButton
                value="selected"
                selected={true}
                styles={{ theme: 'dark' }}
              >
                Selected
              </ToggleButton>
              <ToggleButton
                value="disabled"
                disabled={true}
                styles={{ theme: 'dark' }}
              >
                Disabled
              </ToggleButton>
            </div>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Button Group
            </p>
            <ToggleButtonGroup
              value="view2"
              exclusive={true}
              onChange={() => {}}
              styles={{ theme: 'dark' }}
            >
              <ToggleButton value="view1">List</ToggleButton>
              <ToggleButton value="view2">Grid</ToggleButton>
              <ToggleButton value="view3">Card</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Sacred Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#FFD700',
              }}
            >
              Single Buttons
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <ToggleButton value="default" styles={{ theme: 'sacred' }}>
                Default
              </ToggleButton>
              <ToggleButton
                value="selected"
                selected={true}
                styles={{ theme: 'sacred' }}
              >
                Selected
              </ToggleButton>
              <ToggleButton
                value="disabled"
                disabled={true}
                styles={{ theme: 'sacred' }}
              >
                Disabled
              </ToggleButton>
            </div>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#FFD700',
              }}
            >
              Button Group
            </p>
            <ToggleButtonGroup
              value="fire"
              exclusive={true}
              onChange={() => {}}
              styles={{ theme: 'sacred' }}
            >
              <ToggleButton value="fire">🔥 Fire</ToggleButton>
              <ToggleButton value="water">💧 Water</ToggleButton>
              <ToggleButton value="earth">🌍 Earth</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Size Variations */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Size Variations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Small Size
            </p>
            <ToggleButtonGroup
              value="s"
              exclusive={true}
              onChange={() => {}}
              size="small"
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="xs">XS</ToggleButton>
              <ToggleButton value="s">S</ToggleButton>
              <ToggleButton value="m">M</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Medium Size
            </p>
            <ToggleButtonGroup
              value="medium"
              exclusive={true}
              onChange={() => {}}
              size="medium"
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="small">Small</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="large">Large</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Large Size
            </p>
            <ToggleButtonGroup
              value="monthly"
              exclusive={true}
              onChange={() => {}}
              size="large"
              styles={{ theme: 'light' }}
            >
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
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
  args: {
    value: 'test',
    children: 'Test Button',
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByText('Test Button')

    // Check it's initially not selected
    await expect(button).toHaveAttribute('aria-pressed', 'false')

    // Click to select (note: this won't change state in isolated story)
    await userEvent.click(button)

    // Verify button is clickable and not disabled
    await expect(button).not.toBeDisabled()
  },
}

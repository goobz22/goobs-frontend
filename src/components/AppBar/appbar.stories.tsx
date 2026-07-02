/**
 * @fileoverview Storybook stories for the AppBar component.
 * Demonstrates light, dark, and sacred themes plus position, elevation,
 * and real-world navigation-bar compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import AppBar from './index'

const meta: Meta<typeof AppBar> = {
  title: 'Components/AppBar',
  component: AppBar,
  argTypes: {
    children: {
      control: false,
      description:
        'Content displayed in the app bar (typically navigation, search, actions)',
    },
    position: {
      control: 'select',
      options: ['static', 'fixed', 'absolute', 'sticky', 'relative'],
      description: 'Position of the app bar',
    },
    elevated: {
      control: 'boolean',
      description: 'Whether the app bar should have elevation (box shadow)',
    },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, custom colors, and layout properties',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AppBar>

// --------------------------------------------------------------------------
// SHARED CONTENT
// --------------------------------------------------------------------------
// A simple toolbar layout (brand on the left, nav items on the right) used to
// give the AppBar realistic content across the theme/variant stories.

const NavContent = ({
  color = '#1F2937',
}: {
  color?: string
}): React.JSX.Element => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '0 1rem',
    }}
  >
    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color }}>
      ThothOS
    </span>
    <nav style={{ display: 'flex', gap: '1.5rem', color }}>
      <span style={{ cursor: 'pointer' }}>Dashboard</span>
      <span style={{ cursor: 'pointer' }}>Reports</span>
      <span style={{ cursor: 'pointer' }}>Settings</span>
    </nav>
  </div>
)

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  args: {
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  args: {
    styles: { theme: 'dark' },
    children: <NavContent color="#F9FAFB" />,
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  args: {
    styles: { theme: 'sacred' },
    children: <NavContent color="#FFD700" />,
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// STATE / VARIANT STORIES
// --------------------------------------------------------------------------

export const Elevated: Story = {
  name: 'State/Elevated',
  args: {
    elevated: true,
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Flat: Story = {
  name: 'State/Flat (No Elevation)',
  args: {
    elevated: false,
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const Disabled: Story = {
  name: 'State/Disabled',
  args: {
    styles: { theme: 'light', disabled: true },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const StickyPosition: Story = {
  name: 'Position/Sticky',
  args: {
    position: 'sticky',
    styles: { theme: 'light' },
    children: <NavContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// CUSTOM STYLING
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    styles: {
      theme: 'light',
      backgroundColor: '#1976d2',
      borderRadius: '0 0 12px 12px',
      toolbarMinHeight: '72px',
    },
    children: <NavContent color="#FFFFFF" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

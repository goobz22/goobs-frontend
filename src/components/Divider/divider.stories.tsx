/**
 * @fileoverview Storybook stories for the Divider component.
 * Demonstrates themes, with/without content, disabled state, orientation, and custom styling.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Divider from './index'

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, orientation, colors, and layout',
    },
    children: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Divider>

// ---------------------------------------------------------------------------
// BASIC THEME STORIES
// ---------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    styles: { theme: 'light' },
  },
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// ---------------------------------------------------------------------------
// CONTENT VARIANTS
// ---------------------------------------------------------------------------

export const WithText: Story = {
  name: 'Content/With Text',
  args: {
    children: 'OR',
    styles: { theme: 'light' },
  },
}

export const WithoutText: Story = {
  name: 'Content/Without Text',
  args: {
    styles: { theme: 'light' },
  },
}

// ---------------------------------------------------------------------------
// STATE STORIES
// ---------------------------------------------------------------------------

export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '480px',
      }}
    >
      <div>
        <span>Section A</span>
        <Divider styles={{ theme: 'light', disabled: true }} />
        <span>Section B</span>
      </div>
      <div style={{ background: '#0f172a', padding: '0.5rem' }}>
        <span style={{ color: '#cbd5e1' }}>Section A</span>
        <Divider styles={{ theme: 'dark', disabled: true }} />
        <span style={{ color: '#cbd5e1' }}>Section B</span>
      </div>
      <div style={{ background: '#0a0a0a', padding: '0.5rem' }}>
        <span style={{ color: '#FFD700' }}>Section A</span>
        <Divider styles={{ theme: 'sacred', disabled: true }} />
        <span style={{ color: '#FFD700' }}>Section B</span>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// ORIENTATION
// ---------------------------------------------------------------------------

export const VerticalOrientation: Story = {
  name: 'Orientation/Vertical',
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        height: '120px',
        padding: '0.5rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      }}
    >
      <span>Left content</span>
      <Divider
        styles={{ theme: 'light', orientation: 'vertical', height: '80px' }}
      />
      <span>Right content</span>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// CUSTOM STYLING
// ---------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    children: 'Custom',
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      color: '#6b21a8',
      height: '2px',
      margin: '24px 0',
    },
  },
}

export const SpacingExamples: Story = {
  name: 'Styling/Spacing Examples',
  render: () => (
    <div style={{ width: '480px' }}>
      <div>
        <p style={{ margin: 0 }}>Above content</p>
        <Divider
          styles={{ theme: 'light', marginTop: '24px', marginBottom: '24px' }}
        />
        <p style={{ margin: 0 }}>Below content</p>
      </div>
      <div style={{ marginTop: '24px' }}>
        <p style={{ margin: 0 }}>Left</p>
        <Divider
          styles={{
            theme: 'light',
            orientation: 'vertical',
            height: '60px',
            marginLeft: '16px',
            marginRight: '16px',
          }}
        />
        <p style={{ margin: 0 }}>Right</p>
      </div>
    </div>
  ),
}

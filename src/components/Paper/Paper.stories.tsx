/**
 * @fileoverview Storybook stories for the Paper component.
 * Demonstrates the default and sacred themes, elevation levels, and custom
 * surface styling. Paper is a generic elevated surface that wraps arbitrary
 * children.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import Paper from './index'

const meta: Meta<typeof Paper> = {
  title: 'Components/Paper',
  component: Paper,
  argTypes: {
    children: {
      control: false,
      description: 'The content rendered inside the paper surface',
    },
    elevation: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Elevation level driving the box-shadow depth',
    },
    styles: {
      control: 'object',
      description:
        'Styling options including theme, dimensions, padding, colors, and shadows',
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Paper>

// --------------------------------------------------------------------------
// SHARED CONTENT
// --------------------------------------------------------------------------

const SampleContent = ({
  color = '#1F2937',
}: {
  color?: string
}): React.JSX.Element => (
  <div style={{ color }}>
    <h3 style={{ margin: '0 0 8px 0' }}>Surface Title</h3>
    <p style={{ margin: 0, lineHeight: 1.5 }}>
      Paper is an elevated surface used to group related content with a subtle
      shadow and rounded corners.
    </p>
  </div>
)

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------
// Paper has three real surfaces, each a [data-theme] block in Paper.module.css:
// the base light surface (white, subtle drop shadow), the dark surface (slate
// --goobs-dark-surface with light text), and the sacred surface (translucent
// black, gold border + glow). Any theme value other than 'sacred'/'dark' falls
// through to the light base.

export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  args: {
    styles: { theme: 'light', width: '320px', padding: '24px' },
    children: <SampleContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  args: {
    // No backgroundColor override — Paper's real [data-theme='dark'] block
    // supplies the slate surface (--goobs-dark-surface), so this story proves
    // dark content no longer lands on the white default surface.
    styles: {
      theme: 'dark',
      width: '320px',
      padding: '24px',
    },
    children: <SampleContent color="#F9FAFB" />,
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  args: {
    styles: { theme: 'sacred', width: '320px', padding: '24px' },
    children: <SampleContent color="#FFD700" />,
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// ELEVATION STORIES
// --------------------------------------------------------------------------

export const Elevation: Story = {
  name: 'Elevation/Single',
  args: {
    elevation: 4,
    styles: { theme: 'light', width: '320px', padding: '24px' },
    children: <SampleContent color="#1F2937" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

/** A range of elevation levels for comparison. */
export const ElevationVariants: Story = {
  name: 'Elevation/Variants',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        padding: '1rem',
      }}
    >
      {[0, 1, 4, 8, 16].map(level => (
        <Paper
          key={level}
          elevation={level}
          styles={{ theme: 'light', width: '140px', padding: '16px' }}
        >
          <div style={{ color: '#1F2937', textAlign: 'center' }}>
            Elevation {level}
          </div>
        </Paper>
      ))}
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// CUSTOM STYLING
// --------------------------------------------------------------------------

export const CustomStyling: Story = {
  name: 'Styling/Custom Surface',
  args: {
    styles: {
      theme: 'light',
      width: '320px',
      padding: '32px',
      borderRadius: '16px',
      backgroundColor: '#eef2ff',
      borderColor: '#6366f1',
      borderWidth: '2px',
    },
    children: <SampleContent color="#312e81" />,
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * @fileoverview Storybook stories for the FieldGrid layout primitive.
 * Demonstrates the responsive auto-fit column behavior that absorbs the
 * hand-rolled repeat(auto-fit, minmax(min(100%, …), 1fr)) field clusters.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import FieldGrid from './index'
import TextField, { type TextFieldProps } from '../Field/Text'

// State-wrapper mirroring the TextField stories' idiom so the fields are live.
const StatefulTextField = ({
  initialValue = '',
  ...props
}: {
  initialValue?: string
} & Omit<TextFieldProps, 'value' | 'onChange'>) => {
  const [value, setValue] = useState(initialValue)
  return <TextField {...props} value={value} onChange={setValue} />
}

const meta: Meta<typeof FieldGrid> = {
  title: 'Components/FieldGrid',
  component: FieldGrid,
  argTypes: {
    minColWidth: { control: 'text' },
    gap: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '760px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FieldGrid>

/** Default 250px min column width — wraps to fit the container. */
export const Default: Story = {
  name: 'Default (250px columns)',
  render: args => (
    <FieldGrid {...args} aria-label="Personal Information">
      <StatefulTextField
        label="Full Name"
        placeholder="Enter full name..."
        styles={{ theme: 'sacred' }}
      />
      <StatefulTextField
        label="Email"
        placeholder="name@example.com"
        styles={{ theme: 'sacred' }}
      />
      <StatefulTextField
        label="Phone"
        placeholder="(555) 123-4567"
        styles={{ theme: 'sacred' }}
      />
      <StatefulTextField
        label="Company"
        placeholder="Acme Inc."
        styles={{ theme: 'sacred' }}
      />
    </FieldGrid>
  ),
}

/** Narrower min column width packs more fields per row. */
export const TightColumns: Story = {
  name: 'Tight Columns (160px)',
  args: { minColWidth: '160px', gap: '8px' },
  render: args => (
    <FieldGrid {...args} aria-label="Address">
      <StatefulTextField label="City" styles={{ theme: 'light' }} />
      <StatefulTextField label="State" styles={{ theme: 'light' }} />
      <StatefulTextField label="ZIP" styles={{ theme: 'light' }} />
      <StatefulTextField label="Country" styles={{ theme: 'light' }} />
    </FieldGrid>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** Wider min column width — fewer, roomier columns. */
export const WideColumns: Story = {
  name: 'Wide Columns (360px)',
  args: { minColWidth: '360px', gap: '24px' },
  render: args => (
    <FieldGrid {...args} aria-label="Notes">
      <StatefulTextField
        label="Subject"
        placeholder="Short summary"
        styles={{ theme: 'light' }}
      />
      <StatefulTextField
        label="Reference"
        placeholder="REF-0001"
        styles={{ theme: 'light' }}
      />
    </FieldGrid>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST — the grid exposes role=group and the field-grid anchor
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  render: args => (
    <FieldGrid {...args} aria-label="Test Group">
      <StatefulTextField label="One" styles={{ theme: 'light' }} />
      <StatefulTextField label="Two" styles={{ theme: 'light' }} />
    </FieldGrid>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Test Group' })
    await expect(group).toBeVisible()
    await expect(group).toHaveAttribute('data-field-grid', 'true')
  },
}

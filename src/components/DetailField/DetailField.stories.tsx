/**
 * @fileoverview Storybook stories for the DetailField / DetailGrid primitives.
 * Demonstrates the definition-list label/value display that absorbs the
 * hand-rolled labelStyle/valueStyle pairs across ThothOS read-only surfaces.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import DetailField, { DetailGrid } from './index'

const meta: Meta<typeof DetailField> = {
  title: 'Components/DetailField',
  component: DetailField,
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    mono: { control: 'boolean' },
    valueColor: { control: 'text' },
    hideWhenEmpty: { control: 'boolean' },
  },
  parameters: {
    layout: 'padded',
  },
  globals: { backgrounds: { value: 'dark' } },
  decorators: [
    Story => (
      <div
        style={{
          width: '720px',
          maxWidth: '100%',
          padding: '24px',
          backgroundColor: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DetailField>

/** A single DetailField wrapped in a <dl> so the dt/dd couplet is valid. */
export const SingleField: Story = {
  render: args => (
    <dl style={{ margin: 0 }}>
      <DetailField {...args} />
    </dl>
  ),
  args: {
    label: 'Customer',
    value: 'Acme Wholesale Co.',
  },
}

/** DetailGrid driven by a `fields` descriptor array. */
export const GridFromFields: Story = {
  name: 'Grid/From Fields Array',
  render: () => (
    <DetailGrid
      ariaLabel="Billed To"
      fields={[
        { label: 'Customer', value: 'Jane Buyer' },
        { label: 'Company', value: 'Acme Wholesale Co.' },
        { label: 'Address', value: '500 Market St' },
        { label: 'Location', value: 'San Francisco, CA 94105' },
        { label: 'Invoice #', value: 'INV-0042', mono: true },
        { label: 'Balance Due', value: '$1,240.00', valueColor: '#EF4444' },
      ]}
    />
  ),
}

/** DetailGrid composed from DetailField children. */
export const GridFromChildren: Story = {
  name: 'Grid/From Children',
  render: () => (
    <DetailGrid ariaLabel="Sold By">
      <DetailField label="Provider" value="ThothOS Client Inc." />
      <DetailField label="Company" value="Technologies Unlimited" />
      <DetailField label="Tax ID" value="98-7654321" mono />
      <DetailField label="Status" value="Paid" valueColor="#10B981" />
    </DetailGrid>
  ),
}

/** hideWhenEmpty drops empty rows entirely (absorbs the `{x && (...)}` guard). */
export const HideWhenEmpty: Story = {
  name: 'Grid/Hide When Empty',
  render: () => (
    <DetailGrid
      ariaLabel="Optional Fields"
      fields={[
        { label: 'Customer', value: 'Jane Buyer' },
        { label: 'Address', value: '', hideWhenEmpty: true },
        { label: 'Notes', value: undefined, hideWhenEmpty: true },
        { label: 'Reference', value: 'REF-001' },
      ]}
    />
  ),
}

// --------------------------------------------------------------------------
// INTERACTION TEST — labels are <dt>, values are <dd>, empty rows dropped
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  render: () => (
    <DetailGrid
      ariaLabel="Test Details"
      fields={[
        { label: 'Visible Label', value: 'Visible Value' },
        { label: 'Hidden Row', value: '', hideWhenEmpty: true },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The visible field renders its term and description.
    await expect(canvas.getByText('Visible Label')).toBeVisible()
    await expect(canvas.getByText('Visible Value')).toBeVisible()
    // The empty row was dropped entirely.
    await expect(canvas.queryByText('Hidden Row')).toBeNull()
    // The group is a definition list reachable by its accessible name.
    const grid = canvasElement.querySelector('[data-detail-grid="true"]')
    await expect(grid?.tagName.toLowerCase()).toBe('dl')
  },
}

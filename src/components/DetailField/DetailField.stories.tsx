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

/**
 * Theme adaptation (WCAG 1.4.3). Sacred (gold-on-near-black) is the default;
 * `theme="light"` / `theme="dark"` retarget the label + value colors so the
 * couplet stays legible on a light or neutral-dark surface instead of rendering
 * the hardcoded white value text invisibly on a pale background. Each block is
 * shown on its own matching surface.
 */
export const Themes: Story = {
  name: 'Theme/Sacred · Light · Dark',
  parameters: { backgrounds: { disable: true } },
  render: () => {
    const commonFields = [
      { label: 'Customer', value: 'Jane Buyer' },
      { label: 'Invoice #', value: 'INV-0042', mono: true },
      { label: 'Balance Due', value: '$1,240.00' },
    ]
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ background: '#0e0e0e', padding: '16px', borderRadius: 8 }}>
          <DetailGrid ariaLabel="Sacred theme" fields={commonFields} />
        </div>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: 8 }}>
          <DetailGrid
            ariaLabel="Light theme"
            theme="light"
            fields={commonFields}
          />
        </div>
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: 8 }}>
          <DetailGrid
            ariaLabel="Dark theme"
            theme="dark"
            fields={commonFields}
          />
        </div>
        {/* Dark theme on the RAISED surface token (--goobs-dark-surface-raised,
            #273746). The old semi-transparent gold-60% label washed out to
            ~4.14:1 here (WCAG 1.4.3 fail); the opaque --goobs-dark-warn-text
            label must stay legible on this lighter dark backdrop too. */}
        <div style={{ background: '#273746', padding: '16px', borderRadius: 8 }}>
          <DetailGrid
            ariaLabel="Dark theme on raised surface"
            theme="dark"
            fields={commonFields}
          />
        </div>
      </div>
    )
  },
}

/**
 * Regression pin for the dark-theme label contrast fix (WCAG 1.4.3). The dark
 * `<dt>` label must resolve to the OPAQUE amber token (`--goobs-dark-warn-text`,
 * #fbbf24 → `rgb(251, 191, 36)`), NOT the semi-transparent `--goobs-amber-a60`
 * (`rgba(255, 215, 0, 0.6)`) whose composited contrast fell to ~4.14:1 on the
 * raised-surface token #273746. Rendered on that exact raised surface so the
 * Chromatic baseline captures the label staying legible; the play function
 * asserts the computed color is fully opaque so a regression to the translucent
 * token fails the test.
 */
export const DarkLabelContrast: Story = {
  name: 'Theme/Dark Label Contrast (Raised Surface)',
  parameters: { backgrounds: { disable: true } },
  render: () => (
    <div style={{ background: '#273746', padding: '16px', borderRadius: 8 }}>
      <DetailGrid
        ariaLabel="Dark Billing on Raised Surface"
        theme="dark"
        fields={[
          { label: 'Customer', value: 'Jane Buyer' },
          { label: 'Balance Due', value: '$1,240.00' },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('[data-detail-label="true"]')
    await expect(label).not.toBeNull()
    // Opaque amber (#fbbf24) — NOT the semi-transparent rgba(255,215,0,0.6)
    // whose composited contrast fails 4.5:1 on the raised dark surface.
    const color = getComputedStyle(label as Element).color
    await expect(color).toBe('rgb(251, 191, 36)')
    // The value stays legible on the raised dark surface.
    const canvas = within(canvasElement)
    await expect(canvas.getByText('$1,240.00')).toBeVisible()
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST — theme is emitted on the <dl> and threaded to each field
// --------------------------------------------------------------------------
export const ThemeInteractionTest: Story = {
  name: 'Theme/Interaction Test',
  parameters: { backgrounds: { disable: true } },
  render: () => (
    <div style={{ background: '#ffffff', padding: '16px' }}>
      <DetailGrid
        ariaLabel="Light Billing"
        theme="light"
        fields={[
          { label: 'Customer', value: 'Jane Buyer' },
          { label: 'Balance Due', value: '$1,240.00' },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // The <dl> carries the theme so nested children can cascade off it.
    const grid = canvasElement.querySelector('[data-detail-grid="true"]')
    await expect(grid?.getAttribute('data-theme')).toBe('light')
    // Every fields-array couplet inherits the grid theme (not left sacred).
    const couplets = canvasElement.querySelectorAll('[data-detail-field="true"]')
    await expect(couplets.length).toBe(2)
    couplets.forEach(couplet =>
      expect(couplet.getAttribute('data-theme')).toBe('light')
    )
    // Values are still present + visible on the light surface.
    const canvas = within(canvasElement)
    await expect(canvas.getByText('$1,240.00')).toBeVisible()
  },
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

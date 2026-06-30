/**
 * @fileoverview Storybook stories for the SearchableHistory component.
 * SearchableHistory is a searchable navigation dropdown: a combobox input that
 * filters a list of NavigationItems (grouped by category in an "Overview" tab)
 * and tracks recently selected items in a "History" tab persisted to
 * localStorage. Selecting an item fires `onSelect` to navigate.
 * These stories showcase the light / dark / sacred themes and the key states.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import SearchableHistory, { type NavigationItem } from './index'

// Sample navigation items. The Overview tab groups by the categories
// 'Workspace', 'Space', and 'View', so realistic data uses those.
const navigationItems: NavigationItem[] = [
  {
    id: 'ws-acme',
    label: 'Acme Corp',
    category: 'Workspace',
    description: 'Primary client workspace',
    route: '/dashboard/company/acme',
  },
  {
    id: 'ws-globex',
    label: 'Globex',
    category: 'Workspace',
    description: 'Secondary client workspace',
    route: '/dashboard/company/globex',
  },
  {
    id: 'sp-billing',
    label: 'Billing',
    category: 'Space',
    description: 'Invoices, statements, and payments',
    route: '/dashboard/company/billing',
  },
  {
    id: 'sp-inventory',
    label: 'Inventory',
    category: 'Space',
    description: 'Products, vendors, and stock',
    route: '/dashboard/company/inventory',
  },
  {
    id: 'vw-calendar',
    label: 'Calendar',
    category: 'View',
    description: 'Scheduled events and tasks',
    route: '/dashboard/company/calendar',
  },
  {
    id: 'vw-reports',
    label: 'Reports',
    category: 'View',
    description: 'Analytics and exports',
    route: '/dashboard/company/reports',
  },
]

const meta: Meta<typeof SearchableHistory> = {
  title: 'Components/SearchableHistory',
  component: SearchableHistory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    items: { control: 'object' },
    styles: { control: 'object' },
    onSelect: { action: 'selected' },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem', minHeight: '420px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const Default: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light' },
  },
}

export const DarkTheme: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredTheme: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search the sacred index...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// HELPER TEXT
// --------------------------------------------------------------------------

export const WithHelperText: Story = {
  name: 'With Helper Text',
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    helperText: 'Recently visited items appear under the History tab.',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// ERROR STATE — via styles.helperTextType: 'error'
// --------------------------------------------------------------------------

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    helperText: 'A destination is required.',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light', helperTextType: 'error' },
  },
}

// --------------------------------------------------------------------------
// REQUIRED + DISABLED
// --------------------------------------------------------------------------

export const Required: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light', required: true },
  },
}

export const Disabled: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light', disabled: true },
  },
}

// --------------------------------------------------------------------------
// EMPTY ITEMS
// --------------------------------------------------------------------------

export const NoItems: Story = {
  name: 'No Navigation Items',
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: [],
    name: 'navigation',
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// INTERACTIVE DEMO — surfaces the selected item
// --------------------------------------------------------------------------

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: function InteractiveDemoStory() {
    const [selected, setSelected] = useState<NavigationItem | null>(null)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SearchableHistory
          label="Navigate"
          placeholder="Search navigation..."
          items={navigationItems}
          name="navigation"
          onSelect={setSelected}
          styles={{ theme: 'light' }}
        />
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          {selected
            ? `Selected: ${selected.label} (${selected.route ?? 'no route'})`
            : 'Nothing selected yet — open the dropdown and pick an item.'}
        </div>
      </div>
    )
  },
}

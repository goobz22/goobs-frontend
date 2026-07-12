/**
 * @fileoverview Storybook stories for the SearchableHistory component.
 * SearchableHistory is a searchable navigation dropdown: a combobox input that
 * filters a list of NavigationItems (grouped by category in an "Overview" tab)
 * and tracks recently selected items in a "History" tab persisted to
 * localStorage. Selecting an item fires `onSelect` to navigate.
 * These stories showcase the light / dark / sacred themes and the key states.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import { userEvent, within, expect } from 'storybook/test'
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
  title: 'Components/Field/Dropdown/SearchableHistory',
  component: SearchableHistory,
  parameters: {
    layout: 'centered',
  },
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

/**
 * Light theme via `styles.theme: 'light'` on a light canvas — white combobox
 * surface, dark text, slate control border.
 */
export const Default: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search the sacred index...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// HELPER TEXT
// --------------------------------------------------------------------------

export const WithHelperText: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    helperText: 'Recently visited items appear under the History tab.',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATE — via styles.helperTextType: 'error'
// --------------------------------------------------------------------------

export const ErrorState: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    helperText: 'A destination is required.',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light', helperTextType: 'error' },
  },
  globals: { backgrounds: { value: 'light' } },
  // Regression guard for the `color-only-state` / `form-error-not-associated`
  // class (WCAG 1.4.1 / 3.3.1 / 4.1.2 / 4.1.3). The error state used to be
  // conveyed only by the reddened border/label. The combobox now exposes
  // aria-invalid, and the helper region — which holds the validation message —
  // becomes a live role="alert" so screen readers announce it.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox')
    expect(combobox).toHaveAttribute('aria-invalid', 'true')

    const alert = canvas.getByRole('alert')
    expect(alert).toHaveTextContent('A destination is required.')
    // aria-describedby links the combobox to that same message region.
    expect(combobox.getAttribute('aria-describedby')).toBe(alert.id)
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
  globals: { backgrounds: { value: 'light' } },
}

export const Disabled: Story = {
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light', disabled: true },
  },
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTIVE DEMO — surfaces the selected item
// --------------------------------------------------------------------------

export const InteractiveDemo: Story = {
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
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// A11Y INTERACTION TEST — the arrow toggle exposes aria-pressed/expanded state
// --------------------------------------------------------------------------

/**
 * Regression guard for the `toggle-missing-aria-pressed` class: the arrow button
 * beside the combobox input is a secondary disclosure trigger for the same
 * listbox. Its open/closed state used to be conveyed only by the icon rotation
 * (visual-only — invisible to screen-reader and color-blind users, WCAG 1.4.1 /
 * 4.1.2). It now carries `aria-expanded` that flips with the state, plus
 * `aria-controls` to the listbox and an accessible name ("Toggle options"). This
 * play function drives that: resting = collapsed on both the combobox input and
 * the arrow; clicking the arrow opens the listbox and flips `aria-expanded` to
 * `true` on both controls.
 */
export const ToggleButtonExposesExpandedState: Story = {
  name: 'A11y: arrow toggle exposes expanded state',
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The combobox role lives on the search input; the arrow is a separate
    // <button> located by its accessible name.
    const combobox = canvas.getByRole('combobox')
    const toggle = canvas.getByRole('button', { name: 'Toggle options' })

    // Resting state — both controls report collapsed.
    expect(combobox).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    // Clicking the arrow opens the listbox and flips aria-expanded on BOTH the
    // arrow (the newly-added programmatic state) and the combobox input.
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(combobox).toHaveAttribute('aria-expanded', 'true')
  },
}

// --------------------------------------------------------------------------
// A11Y INTERACTION TEST — Arrow-key navigation over the listbox options
// --------------------------------------------------------------------------

/**
 * Regression guard for the `missing-keyboard-arrow-nav` class (WCAG 2.1.1). The
 * `role="listbox"` options used to be pointer-only `<div onClick>`s with no
 * `role="option"` and no keyboard model — the combobox pattern requires the
 * items be reachable with the Arrow keys, because the listbox role removes them
 * from the Tab order. This play function proves the fix: focusing the combobox
 * opens the (portalled) listbox; ArrowDown moves a roving highlight through the
 * options (mirrored to `aria-activedescendant` on the input and `data-active`
 * on the option); Enter selects the highlighted option and closes the listbox.
 * The options render into a document.body portal, so they are queried there.
 */
export const ArrowKeysNavigateOptions: Story = {
  name: 'A11y: arrow keys navigate listbox options',
  args: {
    label: 'Navigate',
    placeholder: 'Search navigation...',
    items: navigationItems,
    name: 'navigation',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox')

    // Focusing the combobox opens the listbox on the Overview tab.
    await userEvent.click(combobox)
    expect(combobox).toHaveAttribute('aria-expanded', 'true')
    // Nothing is highlighted until the user arrows.
    expect(combobox).not.toHaveAttribute('aria-activedescendant')

    // The listbox + its role="option" rows are portalled into document.body.
    const body = within(document.body)
    const options = await body.findAllByRole('option')
    expect(options.length).toBeGreaterThan(1)

    // ArrowDown highlights the first option and points aria-activedescendant
    // at it — the item is now reachable without a mouse.
    await userEvent.keyboard('{ArrowDown}')
    expect(options[0]).toHaveAttribute('data-active', 'true')
    expect(combobox).toHaveAttribute('aria-activedescendant', options[0]!.id)

    // A second ArrowDown advances the roving highlight to the next option.
    await userEvent.keyboard('{ArrowDown}')
    expect(options[1]).toHaveAttribute('data-active', 'true')
    expect(options[0]).not.toHaveAttribute('data-active')
    expect(combobox).toHaveAttribute('aria-activedescendant', options[1]!.id)

    // Enter activates the highlighted option: the listbox closes (selection made).
    await userEvent.keyboard('{Enter}')
    expect(combobox).toHaveAttribute('aria-expanded', 'false')
  },
}

// src/components/Toolbar/toolbar.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, waitFor } from 'storybook/test'
import CustomToolbar, { type CustomToolbarProps } from './index'

import type { SearchbarProps } from '../Field/Search'
import type { ButtonProps } from '../Button'
import type { DropdownOption } from '../Field/Dropdown/Regular'

const sampleButtons: ButtonProps[] = [
  { text: 'Button 1', onClick: () => console.log('Button 1 clicked') },
  { text: 'Button 2', onClick: () => console.log('Button 2 clicked') },
]

const sampleSearchProps: SearchbarProps = {
  label: 'Search Something',
  placeholder: 'Type here...',
  value: '',
  onChange: value => console.log('Searching =>', value),
}

const meta: Meta<typeof CustomToolbar> = {
  title: 'Components/Toolbar',
  component: CustomToolbar,
  argTypes: {
    styles: {
      control: 'object',
      description: 'Toolbar styling configuration',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof CustomToolbar>

/**
 * 1) Light Theme
 */
export const LightTheme: Story = {
  render: args => (
    <div style={{ padding: '16px', background: '#f3f4f6' }}>
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    buttons: sampleButtons,
    searchbarProps: sampleSearchProps,
    styles: { theme: 'light' },
  },
}

/**
 * 2) Dark Theme
 */
export const DarkTheme: Story = {
  render: args => (
    <div style={{ padding: '16px', background: '#111827' }}>
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    ...LightTheme.args,
    styles: { theme: 'dark' },
  },
}

/**
 * 3) Sacred Theme
 */
export const SacredTheme: Story = {
  render: args => (
    <div style={{ padding: '16px', background: '#000000' }}>
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    ...LightTheme.args,
    styles: { theme: 'sacred' },
  },
}

const InteractiveDemoRenderer = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [showButtons, setShowButtons] = React.useState(true)
  const [showSearch, setShowSearch] = React.useState(true)

  const backgroundColor =
    theme === 'sacred' ? '#000000' : theme === 'dark' ? '#111827' : '#f3f4f6'

  return (
    <div style={{ padding: '16px', background: backgroundColor }}>
      <div
        style={{
          position: 'fixed',
          top: '96px',
          right: '16px',
          zIndex: 50,
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Controls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>
            <span
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Theme:
            </span>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sacred">Sacred</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showButtons}
              onChange={e => setShowButtons(e.target.checked)}
            />{' '}
            Show Buttons
          </label>
          <label>
            <input
              type="checkbox"
              checked={showSearch}
              onChange={e => setShowSearch(e.target.checked)}
            />{' '}
            Show Search
          </label>
        </div>
      </div>
      {(() => {
        const toolbarProps: CustomToolbarProps = { styles: { theme } }
        if (showButtons) toolbarProps.buttons = sampleButtons
        if (showSearch) toolbarProps.searchbarProps = sampleSearchProps
        return <CustomToolbar {...toolbarProps} />
      })()}
    </div>
  )
}

/**
 * 4) Interactive Demo
 */
export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoRenderer />,
}

const filterOptions: DropdownOption[] = [
  { value: 'all' },
  { value: 'active' },
  { value: 'archived' },
]

const FilterDropdownRenderer = () => {
  const [filterValue, setFilterValue] = React.useState('all')

  return (
    <div style={{ padding: '16px', background: '#f3f4f6' }}>
      <CustomToolbar
        buttons={sampleButtons}
        searchbarProps={sampleSearchProps}
        filterDropdown={{
          label: 'Status',
          options: filterOptions,
          value: filterValue,
          onChange: setFilterValue,
        }}
        styles={{ theme: 'light' }}
      />
      <p style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}>
        Selected filter: {filterValue}
      </p>
    </div>
  )
}

/**
 * 5) Filter Dropdown — exercises the `filterDropdown` branch (index.tsx
 * renders a themed Dropdown inside `.filterWrap` between the buttons and the
 * searchbar). Pinned observable state: a "Status" dropdown trigger showing
 * "all"; opening it lists all / active / archived, and picking one updates
 * the "Selected filter:" readout below the toolbar.
 */
export const FilterDropdown: Story = {
  render: () => <FilterDropdownRenderer />,
}

/**
 * 6) Sacred Style Overrides — exercises the two CSS-variable knobs on
 * `ToolbarStyles`. Pinned observable state: the sacred toolbar's 𓊗 glyph
 * (top-right) renders crimson instead of the default faint gold
 * (`glyphColor` → `--toolbar-glyph-color`), and the container shows a
 * single teal radial glow at top-left instead of the default dual gold
 * gradient (`backgroundImage` → `--toolbar-bg-image`).
 */
export const SacredStyleOverrides: Story = {
  render: args => (
    <div style={{ padding: '16px', background: '#000000' }}>
      <CustomToolbar {...args} />
    </div>
  ),
  args: {
    buttons: sampleButtons,
    searchbarProps: sampleSearchProps,
    styles: {
      theme: 'sacred',
      glyphColor: '#dc2626',
      backgroundImage:
        'radial-gradient(circle at top left, rgba(45, 212, 191, 0.15) 0%, transparent 60%)',
    },
  },
}

/**
 * 7) Accessible Name (WAI-ARIA APG Toolbar) — exercises the `ariaLabel` prop and
 * the toolbar semantics added for screen-reader users. Pinned observable state:
 * the root renders `role="toolbar"` with `aria-orientation="horizontal"` and an
 * `aria-label="Records toolbar"` (the caller-supplied name), so AT announces the
 * control group by that name (WCAG 1.3.1 / 4.1.2). Two toolbars are shown to
 * demonstrate that distinct `ariaLabel`s disambiguate multiple toolbars on a
 * page; the second uses the default `'Toolbar'` name.
 */
export const AccessibleName: Story = {
  render: () => (
    <div
      style={{
        padding: '16px',
        background: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <CustomToolbar
        ariaLabel="Records toolbar"
        buttons={sampleButtons}
        searchbarProps={sampleSearchProps}
        styles={{ theme: 'light' }}
      />
      <CustomToolbar
        buttons={sampleButtons}
        searchbarProps={sampleSearchProps}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  // Regression guard for Issue 1 (role/name). Chromatic screenshots cannot see
  // role="toolbar" / aria-orientation / aria-label, so assert them directly.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The caller-supplied ariaLabel becomes the toolbar's accessible name, and
    // the group advertises its role + horizontal orientation (WCAG 1.3.1/4.1.2).
    const named = canvas.getByRole('toolbar', { name: 'Records toolbar' })
    await expect(named).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(named).toHaveAttribute('aria-label', 'Records toolbar')

    // An unconfigured toolbar is never nameless — it falls back to 'Toolbar'.
    const defaulted = canvas.getByRole('toolbar', { name: 'Toolbar' })
    await expect(defaulted).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(defaulted).toHaveAttribute('aria-label', 'Toolbar')

    // Distinct names are what let AT disambiguate two toolbars on one page.
    await expect(named).not.toBe(defaulted)
  },
}

const KeyboardRovingRenderer = () => {
  const [filterValue, setFilterValue] = React.useState('all')
  const [search, setSearch] = React.useState('')

  return (
    <div style={{ padding: '16px', background: '#000000' }}>
      <CustomToolbar
        ariaLabel="Inventory toolbar"
        buttons={sampleButtons}
        filterDropdown={{
          label: 'Status',
          options: filterOptions,
          value: filterValue,
          onChange: setFilterValue,
        }}
        searchbarProps={{
          label: 'Search Something',
          placeholder: 'Type here...',
          value: search,
          onChange: setSearch,
        }}
        styles={{ theme: 'sacred' }}
      />
    </div>
  )
}

/**
 * 8) Keyboard Roving Tabindex + Hidden Glyph — exercises the APG Toolbar
 * keyboard interaction and the decorative-glyph fix. Pinned observable state:
 *  - The button/combobox group shares ONE Tab stop; Left/Right Arrow move focus
 *    between the action buttons and the "Status" filter combobox, Home/End jump
 *    to first/last (roving tabindex — exactly one control has `tabindex="0"`).
 *  - Focusing the searchbar and pressing Arrow/Home/End moves the text caret
 *    (the toolbar does NOT hijack those keys from a text field); opening the
 *    filter combobox likewise gives it the Arrow keys for its options.
 *  - The sacred 𓊗 glyph (top-right) is `aria-hidden="true"`, so screen readers
 *    skip the decorative hieroglyph (WCAG 1.1.1).
 */
export const KeyboardRovingTabIndex: Story = {
  render: () => <KeyboardRovingRenderer />,
}

/**
 * @fileoverview Storybook stories for the SearchableSimple Dropdown component.
 * These stories showcase the various states, themes, and styling capabilities of the SearchableSimple Dropdown field.
 * The SearchableSimple Dropdown component provides dropdown selection with search functionality but without history.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn } from 'storybook/test'
import SearchableSimple, { DropdownOption } from './index'

// Sample data for dropdowns
const sampleOptions = [
  { value: 'apple' },
  { value: 'banana' },
  { value: 'cherry' },
  { value: 'date' },
  { value: 'elderberry' },
  { value: 'fig' },
  { value: 'grape' },
  { value: 'honeydew' },
]

const countryOptions = [
  { value: 'us' },
  { value: 'ca' },
  { value: 'uk' },
  { value: 'au' },
  { value: 'de' },
  { value: 'fr' },
  { value: 'jp' },
  { value: 'in' },
  { value: 'br' },
  { value: 'mx' },
]

// Wrapper component for state management
const SearchableSimpleWithState = ({
  initialValue = '',
  options = sampleOptions,
  styles,
  ...props
}: {
  initialValue?: string
  options?: DropdownOption[]
  styles?: any
  label: string
  [key: string]: any
}) => {
  const handleChange = (option: DropdownOption | null) => {
    // Handle change if needed for demo purposes
    console.log('Selected option:', option)
  }

  return (
    <SearchableSimple
      {...props}
      options={options}
      defaultValue={initialValue}
      onChange={handleChange}
      styles={styles}
    />
  )
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof SearchableSimple> = {
  title: 'Components/Field/Dropdown/SearchableSimple',
  component: SearchableSimple,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: { control: 'text' },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    options: { control: 'object' },
    styles: { control: 'object' },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchableSimple>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <SearchableSimpleWithState
      label="Select Fruit"
      placeholder="Search and choose a fruit"
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content — pin the light canvas (the global default canvas
  // is sacred #0e0e0e, which the light label palette is not designed for).
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <SearchableSimpleWithState
      label="Select Country"
      placeholder="Search and choose a country"
      options={countryOptions}
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SearchableSimpleWithState
      label="Divine Selection"
      placeholder="Search sacred option..."
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <SearchableSimpleWithState
      label="Custom Dropdown"
      placeholder="Search option"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(249, 250, 251, 0.95)',
        borderColor: 'rgba(79, 70, 229, 0.4)',
        borderFocusedColor: 'rgba(79, 70, 229, 1)',
        textColor: 'rgba(55, 48, 163, 1)',
        // 0.8 alpha composites to #5f59b5 on the light canvas — 5.86:1.
        // (0.7 composited to 4.46:1, just under the 4.5 WCAG minimum.)
        labelColor: 'rgba(55, 48, 163, 0.8)',
      }}
    />
  ),
  // Light-styled custom palette — belongs on the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <SearchableSimpleWithState
      label="Neon Dropdown"
      placeholder="Search option"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderFocusedColor: 'rgba(16, 185, 129, 1)',
        textColor: 'rgba(16, 185, 129, 1)',
        // 0.85 alpha composites to 5.38:1 on the dark #111827 canvas
        // (0.7 composited to #108966 — 4.04:1, under the 4.5 minimum).
        labelColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// LAYOUT AND SPACING STORIES
// --------------------------------------------------------------------------

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableSimpleWithState
        label="Large Padding"
        placeholder="Search option"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <SearchableSimpleWithState
        label="Custom Dimensions"
        placeholder="Default height"
        styles={{
          theme: 'light',
          width: '100%',
        }}
      />
      <SearchableSimpleWithState
        label="Asymmetric Padding"
        placeholder="Different padding sides"
        styles={{
          theme: 'light',
          paddingLeft: '32px',
          paddingRight: '16px',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      />
    </div>
  ),
  // All fields are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableSimpleWithState
        label="Large Text"
        placeholder="Search option"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <SearchableSimpleWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <SearchableSimpleWithState
        label="Small & Light"
        placeholder="Search option"
        styles={{
          theme: 'light',
          fontSize: '14px',
          fontWeight: 300,
          padding: '12px',
        }}
      />
    </div>
  ),
  // All fields are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// OPTION VARIATIONS
// --------------------------------------------------------------------------

export const OptionVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableSimpleWithState
        label="Fruits"
        placeholder="Search a fruit"
        options={sampleOptions}
        styles={{ theme: 'light' }}
      />
      <SearchableSimpleWithState
        label="Countries"
        placeholder="Search a country"
        options={countryOptions}
        styles={{ theme: 'light' }}
      />
      <SearchableSimpleWithState
        label="Large Dataset"
        placeholder="Search option"
        options={Array.from({ length: 100 }, (_, i) => ({
          value: `option-${i}`,
        }))}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  // All fields are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  // Mixed-theme story: each themed error block sits on the surface its palette
  // is designed for (the canvas itself stays sacred for the sacred field). The
  // light danger text (#b91c1c) needs the white surface — it is 2.98:1 on the
  // sacred #0e0e0e canvas but 6.47:1 on white; the dark error palette belongs
  // on the #111827 dark surface, not the sacred near-black.
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchableSimpleWithState
          label="Select Option"
          placeholder="Search an option"
          error="Please select a valid option."
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchableSimpleWithState
          label="Country Selection"
          placeholder="Search a country"
          error="Country selection is required."
          options={countryOptions}
          styles={{
            theme: 'dark',
            borderErrorColor: 'rgba(255, 99, 71, 1)',
            labelErrorColor: 'rgba(255, 99, 71, 1)',
            footerTextErrorColor: 'rgba(255, 99, 71, 1)',
          }}
        />
      </div>
      <SearchableSimpleWithState
        label="Sacred Choice"
        placeholder="Search sacred option"
        error="The divine choice is required."
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  // Mixed-theme story: each themed block sits on the surface its palette is
  // designed for (the canvas itself stays sacred for the sacred field).
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <SearchableSimpleWithState
          label="Required Selection"
          placeholder="Search an option"
          required
          styles={{ theme: 'light' }}
        />
        <SearchableSimpleWithState
          label="Country"
          placeholder="Search a country"
          required
          error="This field is required"
          options={countryOptions}
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchableSimpleWithState
          label="Category"
          placeholder="Search a category"
          required
          styles={{ theme: 'dark' }}
        />
      </div>
      <SearchableSimpleWithState
        label="Custom Required Dropdown"
        placeholder="Search divine option"
        required
        styles={{
          theme: 'sacred',
          requiredIndicatorText: ' (required)',
          requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
        }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  // The component reads the disabled flag from `styles.disabled` (a bare
  // top-level `disabled` prop is silently ignored), so the flag lives in
  // `styles` — otherwise this story demos enabled fields. Mixed-theme story:
  // each themed block sits on the surface its palette is designed for.
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchableSimpleWithState
          label="Disabled Light"
          initialValue="apple"
          styles={{ theme: 'light', disabled: true }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchableSimpleWithState
          label="Disabled Dark"
          initialValue="us"
          options={countryOptions}
          styles={{ theme: 'dark', disabled: true }}
        />
      </div>
      <SearchableSimpleWithState
        label="Disabled Sacred"
        initialValue="banana"
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// SEARCH DEMO
// --------------------------------------------------------------------------

const onSubmitSuccess = fn()

const SearchableSimpleDemo = () => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedFruit, setSelectedFruit] = useState('')
  const [error, setError] = useState('')

  const handleCountryChange = (option: DropdownOption | null) => {
    setSelectedCountry(String(option?.value || ''))
  }

  const handleFruitChange = (option: DropdownOption | null) => {
    setSelectedFruit(String(option?.value || ''))
  }

  const handleSubmit = () => {
    if (!selectedCountry || !selectedFruit) {
      setError('Please select both country and fruit')
    } else {
      setError('')
      onSubmitSuccess(`Selected: ${selectedCountry} and ${selectedFruit}`)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '400px',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Simple Searchable Dropdown Demo</h3>
      <SearchableSimple
        label="Country"
        placeholder="Search and select country"
        options={countryOptions}
        defaultValue={selectedCountry}
        onChange={handleCountryChange}
        styles={{ theme: 'light' }}
      />
      <SearchableSimple
        label="Fruit"
        placeholder="Search and select fruit"
        options={sampleOptions}
        defaultValue={selectedFruit}
        onChange={handleFruitChange}
        styles={{ theme: 'light' }}
      />
      {error && (
        <div style={{ color: 'rgba(220, 38, 38, 1)', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // #2563eb keeps white text at 5.17:1 (#3b82f6 was 3.67:1).
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        Submit Selection
      </button>
      <div style={{ fontSize: '14px', color: '#4B5563' }}>
        <p>Simple searchable dropdown features:</p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Type to search and filter options</li>
          <li>Select from filtered results</li>
          <li>Clean, simple interface</li>
          <li>No history tracking</li>
        </ul>
      </div>
    </div>
  )
}

export const SearchDemo: Story = {
  render: () => <SearchableSimpleDemo />,
  // Light-themed demo content — pin the light canvas.
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchableSimpleWithState
            label="Basic Dropdown"
            placeholder="Search option"
            styles={{ theme: 'light' }}
          />
          <SearchableSimpleWithState
            label="With Error"
            placeholder="Search option"
            error="Invalid selection"
            styles={{ theme: 'light' }}
          />
          <SearchableSimpleWithState
            label="Required Field"
            placeholder="Search option"
            required
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section — dark-themed fields sit on their own dark
          surface (the showcase canvas is light) */}
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchableSimpleWithState
            label="Basic Dark"
            placeholder="Search option"
            styles={{ theme: 'dark' }}
          />
          <SearchableSimpleWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <SearchableSimpleWithState
            label="Large Size"
            placeholder="Search option"
            styles={{
              theme: 'dark',
              fontSize: '18px',
              padding: '20px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — gold-on-near-black is the sacred design
          language, so these fields sit on their own near-black surface */}
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchableSimpleWithState
            label="Divine Selection"
            placeholder="Search sacred choice"
            styles={{ theme: 'sacred' }}
          />
          <SearchableSimpleWithState
            label="Sacred Dropdown"
            placeholder="Search divine option"
            error="Choice forbidden"
            styles={{ theme: 'sacred' }}
          />
          <SearchableSimpleWithState
            label="Holy Selection"
            placeholder="Search divine choice"
            styles={{
              theme: 'sacred',
              borderRadius: '16px',
              padding: '18px',
            }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchableSimpleWithState
            label="Neon Style"
            placeholder="Search option"
            styles={{
              theme: 'dark',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderFocusedColor: 'rgba(147, 51, 234, 1)',
              // Purple-500 (#a855f7) reads 4.91:1 on the near-black control
              // (purple-600 was ~3.5:1); the label at full purple-600 reads
              // 5.38:1 on the white canvas (0.8 alpha composited to 3.85:1).
              textColor: 'rgba(168, 85, 247, 1)',
              labelColor: 'rgba(147, 51, 234, 1)',
              borderRadius: '20px',
              borderWidth: '2px',
            }}
          />
          <SearchableSimpleWithState
            label="Soft Rounded"
            placeholder="Search option"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <SearchableSimpleWithState
            label="Minimal"
            placeholder="Search option"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0px',
              borderWidth: '0px 0px 2px 0px',
              padding: '12px 0px',
            }}
          />
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
  render: () => (
    <SearchableSimpleWithState
      label="Test Searchable Simple"
      placeholder="Search and select..."
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Test Searchable Simple')
    // The trigger intentionally exposes role="combobox" (WAI-ARIA combobox
    // 1.2 pattern) — there is no role="button" in this story's tree.
    const dropdown = canvas.getByRole('combobox')

    // Initial state
    expect(label).toBeVisible()
    expect(dropdown).toBeVisible()
    expect(dropdown).toHaveAttribute('aria-expanded', 'false')

    // Click to open the dropdown (the listbox portals to document.body)
    await userEvent.click(dropdown)
    expect(dropdown).toHaveAttribute('aria-expanded', 'true')

    // Click again to close, leaving the story in its resting state
    await userEvent.click(dropdown)
    expect(dropdown).toHaveAttribute('aria-expanded', 'false')
  },
}

// --------------------------------------------------------------------------
// A11Y INTERACTION TEST — Arrow-key navigation over the portalled listbox
// --------------------------------------------------------------------------

/**
 * Regression guard for the `missing-keyboard-arrow-nav` class (WCAG 2.1.1 /
 * 2.4.7 / 4.1.2). While the menu is open the search input holds focus and the
 * Arrow keys rove a highlight through the `role="option"` list. Previously that
 * highlight had NO visual treatment (the `.active` class had no CSS rule) and was
 * invisible to assistive tech (no `aria-activedescendant`; options had no `id`).
 * This proves the fix: the (portalled) search input exposes `aria-controls` +
 * `aria-activedescendant`, and ArrowDown roves the highlight (mirrored to
 * `data-active` on each option). Options portal into document.body.
 */
export const KeyboardArrowNavigation: Story = {
  name: 'A11y: keyboard arrow navigation',
  render: () => (
    <SearchableSimpleWithState
      label="Keyboard Nav"
      placeholder="Search and select..."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox')

    // Open — the listbox + search input portal into document.body.
    await userEvent.click(combobox)
    expect(combobox).toHaveAttribute('aria-expanded', 'true')

    const body = within(document.body)
    const search = await body.findByRole('textbox', { name: /Search/i })
    // Focus the search input explicitly so the Arrow keys land on it.
    await userEvent.click(search)
    expect(search).toHaveAttribute('aria-controls')
    expect(search).not.toHaveAttribute('aria-activedescendant')

    const options = await body.findAllByRole('option')
    expect(options.length).toBeGreaterThan(1)

    // ArrowDown highlights the first option and points the input's
    // aria-activedescendant at its id.
    await userEvent.keyboard('{ArrowDown}')
    expect(options[0]).toHaveAttribute('data-active', 'true')
    expect(search).toHaveAttribute('aria-activedescendant', options[0]!.id)

    // A second ArrowDown advances the roving highlight.
    await userEvent.keyboard('{ArrowDown}')
    expect(options[1]).toHaveAttribute('data-active', 'true')
    expect(options[0]).not.toHaveAttribute('data-active')
    expect(search).toHaveAttribute('aria-activedescendant', options[1]!.id)

    // Enter activates the highlighted option and closes the listbox.
    await userEvent.keyboard('{Enter}')
    expect(combobox).toHaveAttribute('aria-expanded', 'false')
  },
}

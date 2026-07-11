/**
 * @fileoverview Storybook stories for the Search component.
 * These stories showcase the various states, themes, and styling capabilities of the Search field.
 * The Search component provides search input functionality with customizable styling.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import SearchBar from './index'

// Wrapper component for state management
const SearchBarWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (newValue: string) => {
    setValue(newValue)
  }
  return <SearchBar {...props} value={value} onChange={handleChange} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof SearchBar> = {
  title: 'Components/Field/Search',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
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
type Story = StoryObj<typeof SearchBar>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <SearchBarWithState
      label="Search"
      placeholder="Search for items..."
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content must sit on the light canvas — on the default
  // sacred canvas the light muted label fails contrast.
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <SearchBarWithState
      label="Search Query"
      placeholder="Enter search terms"
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SearchBarWithState
      label="Divine Search"
      placeholder="Seek ancient wisdom..."
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <SearchBarWithState
      label="Custom Search"
      placeholder="Search with custom colors"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(240, 253, 244, 0.95)',
        borderColor: 'rgba(34, 197, 94, 0.4)',
        borderFocusedColor: 'rgba(34, 197, 94, 1)',
        textColor: 'rgba(21, 128, 61, 1)',
        // Full-opacity green-700: at 0.7 alpha the composited label fails
        // contrast on every canvas (2.45:1 on sacred, ~2.9:1 on white).
        labelColor: 'rgba(21, 128, 61, 1)',
      }}
    />
  ),
  // Light-themed demo — pin the light canvas (5.02:1 label, 4.80:1 input).
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <SearchBarWithState
      label="Neon Search"
      placeholder="Futuristic search"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(236, 72, 153, 0.5)',
        borderFocusedColor: 'rgba(236, 72, 153, 1)',
        textColor: 'rgba(236, 72, 153, 1)',
        // Full-opacity pink: 0.7 alpha composites to 3.02:1 on the dark
        // canvas; full #ec4899 reads 5.03:1.
        labelColor: 'rgba(236, 72, 153, 1)',
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
      <SearchBarWithState
        label="Large Padding"
        placeholder="Extra space inside"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <SearchBarWithState
        label="Custom Dimensions"
        placeholder="Fixed height"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <SearchBarWithState
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
  // All three fields are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchBarWithState
        label="Large Text"
        placeholder="Search with bigger text"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <SearchBarWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <SearchBarWithState
        label="Small & Light"
        placeholder="Subtle search"
        styles={{
          theme: 'light',
          fontSize: '14px',
          fontWeight: 300,
          padding: '12px',
        }}
      />
    </div>
  ),
  // All three fields are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Light-themed error field — its danger token (#b91c1c) is designed
          for a white surface (6.47:1); it fails on the default sacred canvas,
          so this block stays on the light-pinned canvas. */}
      <SearchBarWithState
        label="Search Query"
        initialValue="invalid@#$%"
        error="Search contains invalid characters."
        styles={{ theme: 'light' }}
      />
      {/* Mixed-theme story: the dark and sacred error fields render on their
          own themed surfaces so their danger labels/helpers are measured
          against the surface they were designed for (dark tomato #ff6347 =
          6.02:1 on #111827; sacred #ef4444 = 5.13:1 on #0e0e0e — both fail
          on white). */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <SearchBarWithState
          label="Product Search"
          placeholder="Enter product name"
          error="No results found for your search."
          styles={{
            theme: 'dark',
            borderErrorColor: 'rgba(255, 99, 71, 1)',
            labelErrorColor: 'rgba(255, 99, 71, 1)',
            footerTextErrorColor: 'rgba(255, 99, 71, 1)',
          }}
        />
      </div>
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <SearchBarWithState
          label="Sacred Search"
          initialValue="forbidden-knowledge"
          error="This knowledge is forbidden to mortals."
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

export const RequiredFields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* `required` lives on styles — SearchbarProps has no top-level
          `required` prop, so passing it as one silently did nothing. */}
      <SearchBarWithState
        label="Required Search"
        placeholder="Enter search query"
        styles={{ theme: 'light', required: true }}
      />
      <SearchBarWithState
        label="Product Search"
        placeholder="Search for products"
        error="Search query is required"
        styles={{ theme: 'light', required: true }}
      />
      {/* Mixed-theme story: dark and sacred fields render on their own
          themed surfaces so labels are measured against the surface they
          are designed for. */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <SearchBarWithState
          label="User Search"
          placeholder="Search for users"
          styles={{ theme: 'dark', required: true }}
        />
      </div>
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <SearchBarWithState
          label="Custom Required Search"
          placeholder="Enter divine query"
          styles={{
            theme: 'sacred',
            required: true,
            requiredIndicatorText: ' (required)',
            requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
          }}
        />
      </div>
    </div>
  ),
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
          <SearchBarWithState
            label="Basic Search"
            placeholder="Search items"
            styles={{ theme: 'light' }}
          />
          <SearchBarWithState
            label="Search Query"
            initialValue="invalid"
            error="Invalid search"
            styles={{ theme: 'light' }}
          />
          <SearchBarWithState
            label="Required Search"
            placeholder="Required field"
            styles={{ theme: 'light', required: true }}
          />
        </div>
      </div>

      {/* Dark Theme Section — dark-themed fields (and their muted slate
          labels) are designed for a dark surface, so the block carries its
          own #111827 surface inside the light-pinned canvas. */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchBarWithState
            label="Basic Dark"
            placeholder="Search items"
            styles={{ theme: 'dark' }}
          />
          <SearchBarWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <SearchBarWithState
            label="Large Size"
            placeholder="Search items"
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
          language; gold text can never pass on white, so the block carries
          its own #0e0e0e surface inside the light-pinned canvas. */}
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchBarWithState
            label="Divine Search"
            placeholder="Seek wisdom"
            styles={{ theme: 'sacred' }}
          />
          <SearchBarWithState
            label="Sacred Query"
            initialValue="forbidden"
            error="Knowledge forbidden"
            styles={{ theme: 'sacred' }}
          />
          <SearchBarWithState
            label="Ancient Search"
            placeholder="Enter divine query"
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
          <SearchBarWithState
            label="Neon Style"
            placeholder="Futuristic search"
            styles={{
              theme: 'dark',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderFocusedColor: 'rgba(147, 51, 234, 1)',
              // Lighter purple inside the near-black input: #9333ea reads
              // 3.61:1 there; #a855f7 reads 4.91:1.
              textColor: 'rgba(168, 85, 247, 1)',
              // Full-opacity #9333ea for the label on the white canvas
              // (5.38:1); the 0.8-alpha composite read 3.85:1.
              labelColor: 'rgba(147, 51, 234, 1)',
              borderRadius: '20px',
              borderWidth: '2px',
            }}
          />
          <SearchBarWithState
            label="Soft Rounded"
            placeholder="Gentle search"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <SearchBarWithState
            label="Minimal"
            placeholder="Clean search"
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
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* `disabled` lives on styles — SearchbarProps has no top-level
          `disabled` prop, so passing it as one silently rendered ENABLED
          fields (which is also why axe measured their labels at full
          strength). styles.disabled natively disables the input and puts
          aria-disabled on the shell. */}
      <SearchBarWithState
        label="Disabled Light"
        initialValue="cannot-search"
        styles={{ theme: 'light', disabled: true }}
      />
      {/* Mixed-theme story: dark and sacred fields render on their own
          themed surfaces. */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <SearchBarWithState
          label="Disabled Dark"
          initialValue="locked-search"
          styles={{ theme: 'dark', disabled: true }}
        />
      </div>
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <SearchBarWithState
          label="Disabled Sacred"
          initialValue="sealed-knowledge"
          styles={{ theme: 'sacred', disabled: true }}
        />
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// SEARCH DEMO
// --------------------------------------------------------------------------

const SearchDemo = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const mockData = [
    'Apple iPhone 15',
    'Samsung Galaxy S24',
    'MacBook Pro',
    'Dell XPS 13',
    'iPad Air',
    'Microsoft Surface',
    'Google Pixel 8',
    'Sony WH-1000XM4',
    'AirPods Pro',
    'Nintendo Switch',
  ]

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = mockData.filter(item =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(filtered)
      } else {
        setResults([])
      }
      setIsSearching(false)
    }, 300)
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Search Demo</h3>
      <SearchBar
        label="Product Search"
        placeholder="Search for products..."
        value={query}
        onChange={handleSearch}
        styles={{ theme: 'light' }}
      />

      {isSearching && (
        <div
          style={{
            padding: '1rem',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280',
          }}
        >
          Searching...
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {results.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '0.75rem 1rem',
                borderBottom:
                  index < results.length - 1 ? '1px solid #E5E7EB' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onMouseEnter={e => {
                const target = e.target as HTMLDivElement
                target.style.backgroundColor = '#F3F4F6'
              }}
              onMouseLeave={e => {
                const target = e.target as HTMLDivElement
                target.style.backgroundColor = 'transparent'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {!isSearching && query && results.length === 0 && (
        <div
          style={{
            padding: '1rem',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280',
          }}
        >
          No results found for &quot;{query}&quot;
        </div>
      )}

      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        Start typing to search through products. Results will appear below.
      </p>
    </div>
  )
}

export const SearchDemoStory: Story = {
  name: 'Search Demo',
  render: () => <SearchDemo />,
  // The demo is light-themed (black h3, gray body copy, light field) —
  // pin the light canvas it was written for.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <SearchBarWithState
      label="Test Search Input"
      placeholder="Search for testing..."
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Search for testing...')
    const label = canvas.getByText('Test Search Input')

    // Initial state
    expect(label).toBeVisible()
    expect(input).toBeVisible()

    // type="search" exposes the native searchbox role, and the visible
    // <label> is the accessible name (an aria-label must NOT override it).
    const searchbox = canvas.getByRole('searchbox', {
      name: 'Test Search Input',
    })
    expect(searchbox).toBe(input)

    // Focus and type
    await userEvent.click(input)
    await userEvent.type(input, 'testing search functionality', { delay: 50 })

    // Check value
    await expect(input).toHaveValue('testing search functionality')
  },
  // Light-themed field — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBLE NAME — LABEL-LESS SEARCH (WCAG 4.1.2)
// --------------------------------------------------------------------------

/**
 * A label-less search bar still needs an accessible name — a placeholder is
 * NOT one. When `label` is omitted the input's `aria-label` falls back to
 * the explicit `ariaLabel` prop, or to the `placeholder` string when
 * `ariaLabel` is unset. Both fields below render with NO visible label yet
 * expose a `searchbox` role that carries a real accessible name, so
 * screen-reader and voice-control users can find and address them.
 */
export const AccessibleNameFallback: Story = {
  name: 'Accessible Name (No Visible Label)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* No label, no ariaLabel → the placeholder becomes the name. */}
      <SearchBarWithState
        placeholder="Search everything..."
        styles={{ theme: 'light' }}
      />
      {/* No label, explicit ariaLabel → ariaLabel is the name; the
          placeholder is free to say something different. */}
      <SearchBarWithState
        ariaLabel="Search products"
        placeholder="Type a product name..."
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Placeholder-derived accessible name.
    const byPlaceholder = canvas.getByRole('searchbox', {
      name: 'Search everything...',
    })
    expect(byPlaceholder).toBeVisible()
    // Explicit ariaLabel wins over the placeholder as the accessible name.
    const byAriaLabel = canvas.getByRole('searchbox', {
      name: 'Search products',
    })
    expect(byAriaLabel).toBeVisible()
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// A11Y: PLACEHOLDER CONTRAST (WCAG 1.4.3)
// --------------------------------------------------------------------------

/**
 * Regression guard for placeholder contrast. Without an explicit
 * `::placeholder` rule the hint renders in the UA-default gray — a translucent
 * tint of the input `color` (Firefox dims it further) — which drifts below the
 * 4.5:1 minimum, most visibly on a light surface. This matters more for Search
 * than most fields: a label-less search bar exposes the placeholder as its
 * `aria-label`, so the hint is doing accessible-name duty and MUST be legible.
 * Each theme's placeholder is now set to that theme's muted-text token, tuned
 * in global.css to hold ≥4.5:1 on its own surface (sacred rgba(255,255,255,0.5)
 * ≈ 5.30:1 on #0e0e0e; light #4b5563 ≈ 6.17:1; dark #94a3b8 ≈ 4.76:1) —
 * visibly lighter than entered text yet legible. The three fields sit on their
 * theme-matched surfaces (Chromatic baseline); the play fn reads the resolved
 * `::placeholder` style and asserts the light field uses the explicit muted
 * token (rgb(75, 85, 99) = #4b5563) at full opacity, not the UA default.
 */
export const PlaceholderContrastTest: Story = {
  name: 'Placeholder Contrast (WCAG 1.4.3)',
  render: () => (
    // Mixed-theme story: each field sits on its own theme-matched surface so
    // the placeholder contrast reads against the surface it actually ships on.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchBarWithState
          label="Light placeholder"
          placeholder="Light search hint..."
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchBarWithState
          label="Dark placeholder"
          placeholder="Dark search hint..."
          styles={{ theme: 'dark' }}
        />
      </div>
      <div
        style={{ background: '#0e0e0e', padding: '1rem', borderRadius: '8px' }}
      >
        <SearchBarWithState
          label="Sacred placeholder"
          placeholder="Sacred search hint..."
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const lightInput = canvas.getByPlaceholderText('Light search hint...')

    // The placeholder must NOT fall back to the UA default — it's set to the
    // light muted-text token #4b5563 = rgb(75, 85, 99), which holds ≥4.5:1 on
    // the light surface (WCAG 1.4.3). opacity:1 keeps that contrast intact
    // (Firefox otherwise dims placeholders and would erode the proven ratio).
    const placeholderStyle = getComputedStyle(lightInput, '::placeholder')
    expect(placeholderStyle.color).toBe('rgb(75, 85, 99)')
    expect(placeholderStyle.opacity).toBe('1')
  },
  globals: { backgrounds: { value: 'light' } },
}

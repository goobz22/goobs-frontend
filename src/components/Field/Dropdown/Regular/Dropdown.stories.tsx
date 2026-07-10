/**
 * @fileoverview Storybook stories for the Dropdown component.
 * These stories showcase the various states, themes, and styling capabilities of the Dropdown.
 * The Dropdown uses the shared form field system with labels positioned above the input field.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Dropdown, { type DropdownOption } from './index'
import type { FieldStyleOverrides } from '../../Shell'

/**
 * Reusable mock options using the unified DropdownOption interface
 */
const sampleOptions: DropdownOption[] = [
  { value: 'javascript' },
  { value: 'typescript' },
  { value: 'react' },
  { value: 'nodejs' },
  { value: 'python' },
]

const countryOptions: DropdownOption[] = [
  { value: 'usa' },
  { value: 'canada' },
  { value: 'uk' },
  { value: 'france' },
  { value: 'japan' },
]

// Wrapper component for state management
interface DropdownWithStateProps {
  initialValue?: string
  label: string
  options: DropdownOption[]
  styles?: FieldStyleOverrides
  error?: string
  disabled?: boolean
  required?: boolean
}

const DropdownWithState: React.FC<DropdownWithStateProps> = ({
  initialValue = '',
  label,
  options,
  styles,
  error,
  disabled,
  required,
}) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Dropdown
      label={label}
      options={options}
      {...(error ? { helperText: error } : {})}
      styles={{
        ...styles,
        disabled: disabled ?? false,
        required: required ?? false,
        helperTextType: error ? 'error' : 'info',
      }}
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  )
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof Dropdown> = {
  title: 'Components/Field/Dropdown/Regular',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
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
type Story = StoryObj<typeof Dropdown>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * Light theme via `styles.theme: 'light'` on a light canvas — white field
 * surface, dark text, slate control border.
 */
export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <DropdownWithState
      label="Programming Language"
      options={sampleOptions}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <DropdownWithState
      label="Country"
      options={countryOptions}
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const DarkThemeAlt: Story = {
  render: () => (
    <DropdownWithState
      label="Select Option"
      options={sampleOptions}
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Sacred theme via `styles.theme: 'sacred'` on the sacred canvas — the gold
 * accent palette (translucent-dark field surface, gold label/border/focus)
 * from the FieldShell `[data-theme='sacred']` block.
 */
export const SacredTheme: Story = {
  render: () => (
    <DropdownWithState
      label="Programming Language"
      options={sampleOptions}
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// OPTION VARIANTS
// --------------------------------------------------------------------------

export const BasicOptions: Story = {
  render: () => (
    <DropdownWithState
      label="Simple Selection"
      options={[
        { value: 'apple' },
        { value: 'banana' },
        { value: 'orange' },
        { value: 'grape' },
      ]}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const ComplexOptions: Story = {
  name: 'Complex Options with Attributes',
  render: () => (
    <DropdownWithState
      label="Technology Stack"
      options={sampleOptions}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')

    // Open dropdown and verify complex options display correctly
    await userEvent.click(select)
    await expect(canvas.getByText(/React/)).toBeInTheDocument()
    await expect(
      canvas.getByText(/\(Library \| Frontend\)/)
    ).toBeInTheDocument()
  },
}

export const WithDefaultValue: Story = {
  render: () => (
    <DropdownWithState
      label="Pre-selected Option"
      initialValue="typescript"
      options={sampleOptions}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const RequiredDropdown: Story = {
  // Mixed-theme story: each themed field sits on the surface its palette is
  // designed for; the canvas stays sacred #0e0e0e for the sacred field.
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
        <DropdownWithState
          label="Required Selection"
          options={sampleOptions}
          required
          styles={{ theme: 'light' }}
        />
        <DropdownWithState
          label="Required Country"
          options={countryOptions}
          required
          error="This field is required"
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <DropdownWithState
          label="Required Tech Stack"
          options={sampleOptions}
          required
          initialValue="react"
          styles={{ theme: 'dark' }}
        />
      </div>
      <DropdownWithState
        label="Custom Required Indicator"
        options={sampleOptions}
        required
        styles={{
          theme: 'sacred',
          requiredIndicatorText: ' (required)',
        }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that the required dropdowns are present with automatic asterisks
    await expect(canvas.getByText(/Required Selection/)).toBeInTheDocument()
    await expect(canvas.getByText(/Required Country/)).toBeInTheDocument()
    await expect(canvas.getByText(/Required Tech Stack/)).toBeInTheDocument()

    // Test the required attribute is applied
    const selects = canvas.getAllByRole('combobox')
    expect(selects[0]).toBeRequired()
    expect(selects[1]).toBeRequired()
    expect(selects[2]).toBeRequired()
    expect(selects[3]).toBeRequired()
  },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  // Mixed-theme story: each themed field sits on the surface its palette is
  // designed for; the canvas stays sacred #0e0e0e for the sacred field.
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px' }}
      >
        <DropdownWithState
          label="Required Selection"
          options={sampleOptions}
          error="Please select an option."
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <DropdownWithState
          label="Invalid Choice"
          options={countryOptions}
          error="This selection is not available."
          styles={{
            theme: 'dark',
            borderErrorColor: 'rgba(255, 99, 71, 1)',
            labelErrorColor: 'rgba(255, 99, 71, 1)',
            helperTextErrorColor: 'rgba(255, 99, 71, 1)',
          }}
        />
      </div>
      <DropdownWithState
        label="Sacred Error"
        options={sampleOptions}
        error="The ancient wisdom rejects this choice."
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM STYLING
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <DropdownWithState
      label="Custom Styled"
      options={sampleOptions}
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 240, 245, 0.95)',
        borderColor: 'rgba(255, 20, 147, 0.4)',
        borderFocusedColor: 'rgba(255, 20, 147, 1)',
        textColor: 'rgba(139, 0, 139, 1)',
        labelColor: 'rgba(139, 0, 139, 0.7)',
      }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DropdownWithState
        label="Large Size"
        options={sampleOptions}
        styles={{
          theme: 'light',
          height: '60px',
          fontSize: '18px',
          borderRadius: '12px',
          padding: '16px 48px 16px 20px',
        }}
      />
      <DropdownWithState
        label="Compact Size"
        options={countryOptions}
        styles={{
          theme: 'light',
          height: '32px',
          fontSize: '14px',
          borderRadius: '4px',
          padding: '4px 32px 4px 8px',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  // Mixed light/dark story: the two dark fields sit on their own dark surface;
  // the light field and the pinned canvas stay light.
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DropdownWithState
        label="Disabled Light"
        options={sampleOptions}
        disabled
        styles={{ theme: 'light' }}
      />
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <DropdownWithState
          label="Disabled Dark"
          options={countryOptions}
          disabled
          styles={{ theme: 'dark' }}
        />
        <DropdownWithState
          label="Disabled Alternative"
          options={sampleOptions}
          disabled
          styles={{ theme: 'dark' }}
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
          <DropdownWithState
            label="Basic Light"
            options={sampleOptions}
            styles={{ theme: 'light' }}
          />
          <DropdownWithState
            label="With Error"
            options={countryOptions}
            error="Invalid selection"
            styles={{ theme: 'light' }}
          />
          <DropdownWithState
            label="With Default"
            initialValue="react"
            options={sampleOptions}
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section — dark fields sit on their own dark surface */}
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DropdownWithState
            label="Basic Dark"
            options={sampleOptions}
            styles={{ theme: 'dark' }}
          />
          <DropdownWithState
            label="Custom Colors"
            options={countryOptions}
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <DropdownWithState
            label="Large Size"
            options={sampleOptions}
            styles={{
              theme: 'dark',
              height: '56px',
              fontSize: '18px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Alternative Dark Theme Section — dark fields on their own surface */}
      <div
        style={{ background: '#111827', padding: '1rem', borderRadius: '8px' }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>
          Alternative Dark Theme
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DropdownWithState
            label="Alternative Selection"
            options={sampleOptions}
            styles={{ theme: 'dark' }}
          />
          <DropdownWithState
            label="Error State"
            options={countryOptions}
            error="Invalid selection"
            styles={{ theme: 'dark' }}
          />
          <DropdownWithState
            label="Styled Choice"
            initialValue="typescript"
            options={sampleOptions}
            styles={{
              theme: 'dark',
              borderRadius: '16px',
              height: '48px',
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
          <DropdownWithState
            label="Purple Style"
            options={sampleOptions}
            styles={{
              theme: 'dark',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderFocusedColor: 'rgba(147, 51, 234, 1)',
              textColor: 'rgba(147, 51, 234, 1)',
              labelColor: 'rgba(147, 51, 234, 0.8)',
              borderRadius: '20px',
              borderWidth: '2px',
            }}
          />
          <DropdownWithState
            label="Soft Rounded"
            options={countryOptions}
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '12px 40px 12px 20px',
            }}
          />
          <DropdownWithState
            label="Minimal"
            options={sampleOptions}
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0px',
              borderWidth: '0px 0px 2px 0px',
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
    <DropdownWithState
      label="Test Dropdown"
      options={sampleOptions}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    const label = canvas.getByText('Test Dropdown')

    // Initial state
    expect(label).toBeVisible()
    expect(select).toBeVisible()

    // Open dropdown and select an option
    await userEvent.selectOptions(select, 'typescript')

    // Check value was set
    await expect(select).toHaveValue('typescript')
  },
}

// --------------------------------------------------------------------------
// INTERACTIVE DEMO
// --------------------------------------------------------------------------

const InteractiveDemo: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'sacred'>('light')
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState('')
  const [value, setValue] = useState('')

  return (
    <div
      style={{
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor:
          theme === 'dark' || theme === 'sacred' ? '#1f2937' : '#f9fafb',
        padding: '2rem',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor:
            theme === 'dark' || theme === 'sacred' ? '#374151' : '#ffffff',
        }}
      >
        <h3
          style={{
            fontWeight: 'bold',
            marginBottom: '1rem',
            color:
              theme === 'dark' || theme === 'sacred' ? '#f9fafb' : '#111827',
          }}
        >
          Controls
        </h3>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div>
            <label
              style={{
                color:
                  theme === 'dark' || theme === 'sacred'
                    ? '#f9fafb'
                    : '#111827',
              }}
            >
              Theme:
              <select
                value={theme}
                onChange={e =>
                  setTheme(e.target.value as 'light' | 'dark' | 'sacred')
                }
                style={{ marginLeft: '0.5rem' }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sacred">Sacred</option>
              </select>
            </label>
          </div>
          <label
            style={{
              color:
                theme === 'dark' || theme === 'sacred' ? '#f9fafb' : '#111827',
            }}
          >
            <input
              type="checkbox"
              checked={disabled}
              onChange={e => setDisabled(e.target.checked)}
            />{' '}
            Disabled
          </label>
          <label
            style={{
              color:
                theme === 'dark' || theme === 'sacred' ? '#f9fafb' : '#111827',
            }}
          >
            Error Message:
            <input
              type="text"
              value={error}
              onChange={e => setError(e.target.value)}
              placeholder="Enter error message..."
              style={{ marginLeft: '0.5rem', width: '200px' }}
            />
          </label>
        </div>
      </div>

      <Dropdown
        label="Interactive Dropdown"
        options={sampleOptions}
        value={value}
        onChange={nextValue => setValue(nextValue)}
        {...(error ? { helperText: error } : {})}
        styles={{
          theme,
          disabled,
          helperTextType: error ? 'error' : 'info',
        }}
      />
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
  parameters: {
    layout: 'centered',
  },
}

/**
 * @fileoverview Storybook stories for the SearchableHistory Dropdown component.
 * These stories showcase the various states, themes, and styling capabilities of the SearchableHistory Dropdown field.
 * The SearchableHistory Dropdown component provides dropdown selection with search functionality and history tracking.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import SearchableHistory, { DropdownOption } from './index'

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
const SearchableHistoryWithState = ({
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
  const [selectedValue, setSelectedValue] = useState<string>(initialValue)

  const handleChange = (option: DropdownOption | null) => {
    // Handle change if needed for demo purposes
    console.log('Selected option:', option)
    setSelectedValue(option?.value || '')
  }

  return (
    <SearchableHistory
      {...props}
      options={options}
      defaultValue={selectedValue}
      onChange={handleChange}
      styles={styles}
    />
  )
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof SearchableHistory> = {
  title: 'Components/Field/Dropdown/SearchableHistory',
  component: SearchableHistory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
type Story = StoryObj<typeof SearchableHistory>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <SearchableHistoryWithState
      label="Select Fruit"
      placeholder="Search and choose a fruit"
      styles={{ theme: 'light' }}
    />
  ),
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <SearchableHistoryWithState
      label="Select Country"
      placeholder="Search and choose a country"
      options={countryOptions}
      styles={{ theme: 'dark' }}
    />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: () => (
    <SearchableHistoryWithState
      label="Divine Selection"
      placeholder="Search sacred option..."
      styles={{ theme: 'sacred' }}
    />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Custom Colors',
  render: () => (
    <SearchableHistoryWithState
      label="Custom Dropdown"
      placeholder="Search option"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(249, 250, 251, 0.95)',
        borderColor: 'rgba(79, 70, 229, 0.4)',
        borderFocusedColor: 'rgba(79, 70, 229, 1)',
        textColor: 'rgba(55, 48, 163, 1)',
        labelColor: 'rgba(55, 48, 163, 0.7)',
      }}
    />
  ),
}

export const NeonStyle: Story = {
  name: 'Neon Style',
  render: () => (
    <SearchableHistoryWithState
      label="Neon Dropdown"
      placeholder="Search option"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderFocusedColor: 'rgba(16, 185, 129, 1)',
        textColor: 'rgba(16, 185, 129, 1)',
        labelColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// LAYOUT AND SPACING STORIES
// --------------------------------------------------------------------------

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableHistoryWithState
        label="Large Padding"
        placeholder="Search option"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <SearchableHistoryWithState
        label="Custom Dimensions"
        placeholder="Default height"
        styles={{
          theme: 'light',
          width: '100%',
        }}
      />
      <SearchableHistoryWithState
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
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  name: 'Custom Typography',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableHistoryWithState
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
      <SearchableHistoryWithState
        label="Custom Font"
        placeholder="Different font family"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <SearchableHistoryWithState
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
}

// --------------------------------------------------------------------------
// OPTION VARIATIONS
// --------------------------------------------------------------------------

export const OptionVariations: Story = {
  name: 'Option Variations',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableHistoryWithState
        label="Fruits"
        placeholder="Search a fruit"
        options={sampleOptions}
        styles={{ theme: 'light' }}
      />
      <SearchableHistoryWithState
        label="Countries"
        placeholder="Search a country"
        options={countryOptions}
        styles={{ theme: 'light' }}
      />
      <SearchableHistoryWithState
        label="Large Dataset"
        placeholder="Search option"
        options={Array.from({ length: 100 }, (_, i) => ({
          value: `option-${i}`,
        }))}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

export const ErrorStates: Story = {
  name: 'Error States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableHistoryWithState
        label="Select Option"
        placeholder="Search an option"
        error="Please select a valid option."
        styles={{ theme: 'light' }}
      />
      <SearchableHistoryWithState
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
      <SearchableHistoryWithState
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
  name: 'Required Fields',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableHistoryWithState
        label="Required Selection"
        placeholder="Search an option"
        required
        styles={{ theme: 'light' }}
      />
      <SearchableHistoryWithState
        label="Country"
        placeholder="Search a country"
        required
        error="This field is required"
        options={countryOptions}
        styles={{ theme: 'light' }}
      />
      <SearchableHistoryWithState
        label="Category"
        placeholder="Search a category"
        required
        styles={{ theme: 'dark' }}
      />
      <SearchableHistoryWithState
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
  name: 'Disabled States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchableHistoryWithState
        label="Disabled Light"
        initialValue="apple"
        disabled
        styles={{ theme: 'light' }}
      />
      <SearchableHistoryWithState
        label="Disabled Dark"
        initialValue="us"
        options={countryOptions}
        disabled
        styles={{ theme: 'dark' }}
      />
      <SearchableHistoryWithState
        label="Disabled Sacred"
        initialValue="banana"
        disabled
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// HISTORY DEMO
// --------------------------------------------------------------------------

const SearchableHistoryDemo = () => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedFruit, setSelectedFruit] = useState('')
  const [error, setError] = useState('')

  const handleCountryChange = (option: DropdownOption | null) => {
    setSelectedCountry(option?.value || '')
  }

  const handleFruitChange = (option: DropdownOption | null) => {
    setSelectedFruit(option?.value || '')
  }

  const handleSubmit = () => {
    if (!selectedCountry || !selectedFruit) {
      setError('Please select both country and fruit')
    } else {
      setError('')
      alert(`Selected: ${selectedCountry} and ${selectedFruit}`)
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Searchable History Dropdown Demo</h3>
      <SearchableHistory
        label="Country"
        placeholder="Search and select country"
        options={countryOptions}
        defaultValue={selectedCountry}
        onChange={handleCountryChange}
        styles={{ theme: 'light' }}
      />
      <SearchableHistory
        label="Fruit"
        placeholder="Search and select fruit"
        options={sampleOptions}
        defaultValue={selectedFruit}
        onChange={handleFruitChange}
        styles={{ theme: 'light' }}
      />
      {error && (
        <div style={{ color: 'rgba(239, 68, 68, 1)', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          backgroundColor: '#3B82F6',
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
      <div style={{ fontSize: '14px', color: '#6B7280' }}>
        <p>Searchable dropdown with history features:</p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Type to search and filter options</li>
          <li>History tab tracks last 5 selections</li>
          <li>Navigate between Options and History tabs</li>
          <li>Search filters both options and history</li>
        </ul>
      </div>
    </div>
  )
}

export const HistoryDemo: Story = {
  name: 'History Demo',
  render: () => <SearchableHistoryDemo />,
}

// Single component demo to test history functionality
const HistoryTestDemo = () => {
  const [lastSelected, setLastSelected] = useState<string>('')

  const handleChange = (option: DropdownOption | null) => {
    setLastSelected(option?.value || '')
    console.log('Selected:', option)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>
        History Test - Select multiple options
      </h3>
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '1rem' }}>
        1. Select an option from the dropdown
        <br />
        2. Select another option
        <br />
        3. Click on &quot;History&quot; tab to see both selections
        <br />
        4. The history should show all your previous selections
      </p>
      {lastSelected && (
        <p style={{ fontSize: '14px', color: '#059669', marginBottom: '1rem' }}>
          Last selected: <strong>{lastSelected}</strong>
        </p>
      )}
      <SearchableHistory
        label="Test History"
        placeholder="Search and select to test history"
        options={[
          { value: 'Apple' },
          { value: 'Banana' },
          { value: 'Cherry' },
          { value: 'Date' },
          { value: 'Elderberry' },
          { value: 'Fig' },
          { value: 'Grape' },
          { value: 'Honeydew' },
        ]}
        onChange={handleChange}
        styles={{ theme: 'light' }}
      />
    </div>
  )
}

export const HistoryFunctionalityTest: Story = {
  name: 'History Functionality Test',
  render: () => <HistoryTestDemo />,
}

// Dark theme history test
const DarkHistoryTestDemo = () => {
  const [lastSelected, setLastSelected] = useState<string>('')

  const handleChange = (option: DropdownOption | null) => {
    setLastSelected(option?.value || '')
    console.log('Selected:', option)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#E5E7EB' }}>
        Dark Theme History Test
      </h3>
      <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '1rem' }}>
        Test the history functionality in dark mode.
        <br />
        The selected tab should be clearly visible.
      </p>
      {lastSelected && (
        <p style={{ fontSize: '14px', color: '#10B981', marginBottom: '1rem' }}>
          Last selected: <strong>{lastSelected}</strong>
        </p>
      )}
      <SearchableHistory
        label="Dark Theme Test"
        placeholder="Search and select to test history"
        options={[
          { value: 'Apple' },
          { value: 'Banana' },
          { value: 'Cherry' },
          { value: 'Date' },
          { value: 'Elderberry' },
          { value: 'Fig' },
          { value: 'Grape' },
          { value: 'Honeydew' },
        ]}
        onChange={handleChange}
        styles={{ theme: 'dark' }}
      />
    </div>
  )
}

export const DarkHistoryFunctionalityTest: Story = {
  name: 'Dark Theme History Test',
  render: () => <DarkHistoryTestDemo />,
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// Comprehensive history debug test
const HistoryDebugDemo = () => {
  const [selectionHistory, setSelectionHistory] = useState<string[]>([])
  const [renderCount, setRenderCount] = useState(0)

  const handleChange = (option: DropdownOption | null) => {
    if (option) {
      setSelectionHistory(prev => [...prev, option.value])
      setRenderCount(prev => prev + 1)
      console.log('Parent component received selection:', option.value)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>History Debug Test</h3>
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#6B7280' }}>
        <p>
          <strong>Instructions:</strong>
        </p>
        <ol style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>Select &quot;Apple&quot; from the dropdown</li>
          <li>Select &quot;Banana&quot; from the dropdown</li>
          <li>Select &quot;Cherry&quot; from the dropdown</li>
          <li>Click on the &quot;History&quot; tab</li>
          <li>You should see all three selections in the history</li>
        </ol>
      </div>

      <div
        style={{
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px' }}>
          <strong>Parent Component State:</strong>
        </p>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px' }}>
          Render count: {renderCount}
        </p>
        <p style={{ margin: '0', fontSize: '12px' }}>
          Selection history:{' '}
          {selectionHistory.length > 0 ? selectionHistory.join(', ') : 'None'}
        </p>
      </div>

      <SearchableHistory
        key="history-debug" // Ensure component maintains state
        label="Debug Test"
        placeholder="Search and select to test history"
        options={[
          { value: 'Apple' },
          { value: 'Banana' },
          { value: 'Cherry' },
          { value: 'Date' },
          { value: 'Elderberry' },
        ]}
        onChange={handleChange}
        styles={{ theme: 'light' }}
      />
    </div>
  )
}

export const HistoryDebugTest: Story = {
  name: 'History Debug Test',
  render: () => <HistoryDebugDemo />,
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  name: 'Comprehensive Showcase',
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
          <SearchableHistoryWithState
            label="Basic Dropdown"
            placeholder="Search option"
            styles={{ theme: 'light' }}
          />
          <SearchableHistoryWithState
            label="With Error"
            placeholder="Search option"
            error="Invalid selection"
            styles={{ theme: 'light' }}
          />
          <SearchableHistoryWithState
            label="Required Field"
            placeholder="Search option"
            required
            styles={{ theme: 'light' }}
          />
        </div>
      </div>

      {/* Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchableHistoryWithState
            label="Basic Dark"
            placeholder="Search option"
            styles={{ theme: 'dark' }}
          />
          <SearchableHistoryWithState
            label="Custom Colors"
            placeholder="Custom styling"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <SearchableHistoryWithState
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

      {/* Sacred Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchableHistoryWithState
            label="Divine Selection"
            placeholder="Search sacred choice"
            styles={{ theme: 'sacred' }}
          />
          <SearchableHistoryWithState
            label="Sacred Dropdown"
            placeholder="Search divine option"
            error="Choice forbidden"
            styles={{ theme: 'sacred' }}
          />
          <SearchableHistoryWithState
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
          <SearchableHistoryWithState
            label="Neon Style"
            placeholder="Search option"
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
          <SearchableHistoryWithState
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
          <SearchableHistoryWithState
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
    backgrounds: { default: 'light' },
  },
}

// --------------------------------------------------------------------------
// HISTORY FUNCTIONALITY TEST
// --------------------------------------------------------------------------

export const HistoryFunctionality: Story = {
  name: 'History Functionality',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
        Test History Functionality
      </h3>
      <p style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#6B7280' }}>
        Select some options to see them appear in the History tab. The last 5
        selections are stored.
      </p>
      <SearchableHistoryWithState
        label="Test History"
        placeholder="Search and select multiple options"
        options={sampleOptions}
        styles={{ theme: 'light' }}
      />
      <div style={{ fontSize: '14px', color: '#6B7280' }}>
        <p>Instructions:</p>
        <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Click the dropdown arrow to open the menu</li>
          <li>Select different fruits from the Options tab</li>
          <li>Click the History tab to see your selections</li>
          <li>Try searching in the History tab</li>
        </ol>
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  render: () => (
    <SearchableHistoryWithState
      label="Test Searchable History"
      placeholder="Search and select..."
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Test Searchable History')
    const dropdown = canvas.getByRole('button')

    // Initial state
    expect(label).toBeVisible()
    expect(dropdown).toBeVisible()

    // Click to open dropdown
    await userEvent.click(dropdown)

    // The dropdown should be interactive
    expect(dropdown).toBeVisible()
  },
}

/**
 * @fileoverview Storybook stories for the MultiSelect component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import MultiSelectChip from './index'

const meta: Meta<typeof MultiSelectChip> = {
  title: 'Components/Field/Dropdown/MultiSelect',
  component: MultiSelectChip,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the multi-select field',
    },
    options: {
      control: 'object',
      description: 'Array of SelectOption objects',
    },
    defaultSelected: {
      control: 'object',
      description: 'Array of initially selected values',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the field',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof MultiSelectChip>

const SIMPLE_OPTIONS = [
  { value: 'Oliver Hansen' },
  { value: 'Van Henry' },
  { value: 'April Tucker' },
  { value: 'Ralph Hubbard' },
  { value: 'Omar Alexander' },
  { value: 'Carlos Abbott' },
  { value: 'Miriam Wagner' },
  { value: 'Bradley Wilkerson' },
  { value: 'Virginia Andrews' },
  { value: 'Kelly Snyder' },
]

const COMPLEX_OPTIONS = [
  { value: 'frontend', attribute1: 'React, TypeScript, Next.js' },
  { value: 'backend', attribute1: 'Node.js, Express, PostgreSQL' },
  { value: 'mobile', attribute1: 'React Native, Swift, Kotlin' },
  { value: 'devops', attribute1: 'AWS, Docker, Kubernetes' },
  { value: 'design', attribute1: 'Figma, Adobe Creative Suite' },
  { value: 'data', attribute1: 'Python, SQL, Machine Learning' },
]

const commonArgs = {
  label: 'Select Team Members',
  options: SIMPLE_OPTIONS,
  defaultSelected: ['Van Henry'],
}

export const LightTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Light Theme:</strong> Clean and professional multi-select with
        light backgrounds and subtle shadows.
        <br />
        <strong>Features:</strong> Chip-based selection, dropdown with
        checkboxes, and optimized for readability in bright environments.
      </div>
      <div style={{ maxWidth: '400px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Dark Theme:</strong> Developer-friendly dark mode with high
        contrast and reduced eye strain.
        <br />
        <strong>Features:</strong> Perfect for low-light environments, modern
        chip styling, and smooth interactions.
      </div>
      <div style={{ maxWidth: '400px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}>
        <strong>Sacred Theme:</strong> Mystical and spiritual multi-select with
        sacred color palettes and ethereal aesthetics.
        <br />
        <strong>Features:</strong> Designed for contemplative selection
        sessions, sacred color schemes, and transcendent user experience.
      </div>
      <div style={{ maxWidth: '400px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

export const ComplexOptions: Story = {
  name: 'Complex Options with Details',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Complex Options:</strong> Multi-select with detailed option
        objects showing additional information.
        <br />
        <strong>Features:</strong> Object-based options with attribute details,
        perfect for technical selections.
      </div>
      <div style={{ maxWidth: '500px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    label: 'Select Technologies',
    options: COMPLEX_OPTIONS,
    defaultSelected: ['frontend'],
    styles: {
      theme: 'light',
    },
  },
}

export const WithHelperText: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Helper Text:</strong> Multi-select with informative helper text
        to guide user selections.
        <br />
        <strong>Features:</strong> Contextual help text and error state support.
      </div>
      <div style={{ maxWidth: '400px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    helperText: 'Select multiple team members for this project',
    styles: {
      theme: 'dark',
      helperTextType: 'info',
    },
  },
}

export const RequiredField: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Required Field:</strong> Multi-select with required validation
        and proper labeling.
        <br />
        <strong>Features:</strong> Required indicator, validation support, and
        proper form integration.
      </div>
      <div style={{ maxWidth: '400px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    defaultSelected: [],
    helperText: 'Please select at least one team member',
    styles: {
      theme: 'light',
      required: true,
      helperTextType: 'error',
    },
  },
}

export const DisabledState: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Disabled State:</strong> Multi-select in disabled state with
        proper visual feedback.
        <br />
        <strong>Features:</strong> Non-interactive state, muted colors, and
        accessibility support.
      </div>
      <div style={{ maxWidth: '400px' }}>
        <MultiSelectChip {...args} />
      </div>
    </div>
  ),
  args: {
    ...commonArgs,
    defaultSelected: ['Van Henry', 'April Tucker'],
    styles: {
      theme: 'light',
      disabled: true,
    },
  },
}

const InteractiveDemo = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'sacred'>('light')
  const [selected, setSelected] = useState<string[]>(['Van Henry'])
  const [showDetails, setShowDetails] = useState(false)
  const [useComplexOptions, setUseComplexOptions] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [required, setRequired] = useState(false)

  const currentOptions = useComplexOptions ? COMPLEX_OPTIONS : SIMPLE_OPTIONS

  const getBackgroundColor = () => {
    switch (theme) {
      case 'dark':
        return '#0f172a'
      case 'sacred':
        return '#1C1917'
      default:
        return '#f8fafc'
    }
  }

  const getTextColor = () => {
    switch (theme) {
      case 'dark':
        return '#94a3b8'
      case 'sacred':
        return '#FFD700'
      default:
        return '#475569'
    }
  }

  return (
    <div
      style={{
        backgroundColor: getBackgroundColor(),
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          marginBottom: '2rem',
          fontSize: '14px',
          color: getTextColor(),
        }}
      >
        <strong>Interactive Demo:</strong> Test all features and themes of the
        MultiSelect component.
      </div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div
          style={{
            padding: '1rem',
            border: `1px solid ${getTextColor()}`,
            borderRadius: '0.5rem',
            backgroundColor:
              theme === 'dark'
                ? '#1e293b'
                : theme === 'sacred'
                  ? 'rgba(0,0,0,0.3)'
                  : 'white',
            color: getTextColor(),
          }}
        >
          <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Controls</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <label>
              Theme:{' '}
              <select
                value={theme}
                onChange={e =>
                  setTheme(e.target.value as 'light' | 'dark' | 'sacred')
                }
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
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
                checked={useComplexOptions}
                onChange={e => setUseComplexOptions(e.target.checked)}
              />{' '}
              Complex Options
            </label>
            <label>
              <input
                type="checkbox"
                checked={showDetails}
                onChange={e => setShowDetails(e.target.checked)}
              />{' '}
              Show Details
            </label>
            <label>
              <input
                type="checkbox"
                checked={disabled}
                onChange={e => setDisabled(e.target.checked)}
              />{' '}
              Disabled
            </label>
            <label>
              <input
                type="checkbox"
                checked={required}
                onChange={e => setRequired(e.target.checked)}
              />{' '}
              Required
            </label>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <MultiSelectChip
            label="Interactive MultiSelect"
            options={currentOptions}
            defaultSelected={selected}
            onChange={setSelected}
            helperText={
              required && selected.length === 0
                ? 'Please select at least one option'
                : 'Select your preferred options'
            }
            styles={{
              theme,
              disabled,
              required,
              helperTextType:
                required && selected.length === 0 ? 'error' : 'info',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export const ArrowPositionTest: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Arrow Position Test:</strong> Testing different arrow positions
        to ensure proper alignment.
      </div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '300px' }}>
          <h4>Default Position</h4>
          <MultiSelectChip
            label="Default Arrow"
            options={SIMPLE_OPTIONS}
            defaultSelected={['Van Henry']}
            styles={{ theme: 'light' }}
          />
        </div>
        <div style={{ maxWidth: '300px' }}>
          <h4>Adjusted Position</h4>
          <MultiSelectChip
            label="Adjusted Arrow"
            options={SIMPLE_OPTIONS}
            defaultSelected={['Van Henry']}
            styles={{
              theme: 'light',
              arrowRight: '8px',
              arrowPadding: '0 8px',
            }}
          />
        </div>
        <div style={{ maxWidth: '300px' }}>
          <h4>Custom Position</h4>
          <MultiSelectChip
            label="Custom Arrow"
            options={SIMPLE_OPTIONS}
            defaultSelected={['Van Henry']}
            styles={{
              theme: 'light',
              arrowTop: '50%',
              arrowRight: '12px',
              arrowBottom: 'auto',
              arrowPadding: '0',
            }}
          />
        </div>
      </div>
    </div>
  ),
  args: {},
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
}

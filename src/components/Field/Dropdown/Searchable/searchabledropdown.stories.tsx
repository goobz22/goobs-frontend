// src/components/SearchableDropdown/searchabledropdown.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import SearchableDropdown from './index'
import React from 'react'

/**
 * Reusable list of options for demonstration.
 */
const sampleOptions = [
  { value: 'apple' },
  { value: 'banana' },
  { value: 'carrot' },
  { value: 'potato' },
  { value: 'avocado' },
  { value: 'broccoli' },
]

/**
 * Storybook metadata
 */
const meta: Meta<typeof SearchableDropdown> = {
  title: 'Components/Field/Dropdown/Searchable',
  component: SearchableDropdown,
  argTypes: {
    shrunklabelposition: {
      control: 'select',
      options: ['onNotch', 'aboveNotch'],
    },
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof SearchableDropdown>

export const Premium: Story = {
  name: 'Premium Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
      }}
    >
      <SearchableDropdown {...args} />
    </div>
  ),
  args: {
    label: 'Select a Fruit/Veggie',
    options: sampleOptions,
    placeholder: 'Start typing...',
    sacredtheme: false,
  },
}

export const Sacred: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div
      style={{
        width: '400px',
        padding: '2rem',
        backgroundColor: 'black',
        borderRadius: '0.5rem',
      }}
    >
      <SearchableDropdown {...args} />
    </div>
  ),
  args: {
    ...Premium.args,
    sacredtheme: true,
  },
}

const InteractiveDemo = () => {
  const [sacred, setSacred] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [value, setValue] = React.useState<{ value: string } | null>(null)

  return (
    <div
      style={{
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.5rem',
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />{' '}
            Sacred
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
              checked={error}
              onChange={e => setError(e.target.checked)}
            />{' '}
            Error
          </label>
        </div>
        {value && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Selected:</strong> {value.value}
          </div>
        )}
      </div>
      <div
        style={{
          padding: '2rem',
          borderRadius: '0.5rem',
          backgroundColor: sacred ? 'black' : '#f3f4f6',
        }}
      >
        <SearchableDropdown
          label="Interactive Dropdown"
          options={sampleOptions}
          onChange={val => setValue(val)}
          sacredtheme={sacred}
          disabled={disabled}
          error={error}
          helperText={error ? 'There is an error' : 'Looking good'}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
}

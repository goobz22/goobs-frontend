import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import MultipleSelectChip from './index'

const meta: Meta<typeof MultipleSelectChip> = {
  title: 'Components/Field/Dropdown/MultiSelect',
  component: MultipleSelectChip,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof MultipleSelectChip>

const NAMES = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
]

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
      <MultipleSelectChip {...args} />
    </div>
  ),
  args: {
    label: 'Select Names',
    options: NAMES,
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
      <MultipleSelectChip {...args} />
    </div>
  ),
  args: {
    ...Premium.args,
    sacredtheme: true,
  },
}

const InteractiveDemo = () => {
  const [sacred, setSacred] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>(['Van Henry'])

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
        <label>
          <input
            type="checkbox"
            checked={sacred}
            onChange={e => setSacred(e.target.checked)}
          />{' '}
          Sacred Theme
        </label>
      </div>
      <div
        style={{
          padding: '2rem',
          borderRadius: '0.5rem',
          backgroundColor: sacred ? 'black' : '#f3f4f6',
        }}
      >
        <MultipleSelectChip
          label="Select Names"
          options={NAMES}
          defaultSelected={selected}
          onChange={setSelected}
          sacredtheme={sacred}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
}

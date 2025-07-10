// src/components/Searchbar/searchbar.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Searchbar from './index'

const meta: Meta<typeof Searchbar> = {
  title: 'Components/Field/Search',
  component: Searchbar,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    shrunklabelposition: {
      control: 'radio',
      options: ['onNotch', 'aboveNotch'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof Searchbar>

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-gray-50 rounded-lg">
      <Searchbar {...args} />
    </div>
  ),
  args: {
    label: 'Search',
    placeholder: 'Search for anything...',
    value: '',
    onChange: e => console.log('Search input =>', e.target.value),
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[400px] p-6 bg-black rounded-lg">
      <Searchbar {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [value, setValue] = React.useState('')
  const [sacred, setSacred] = React.useState(false)
  const [shrunkPos, setShrunkPos] = React.useState<'onNotch' | 'aboveNotch'>(
    'onNotch'
  )

  return (
    <div className="w-[500px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          <label>
            <input
              type="checkbox"
              checked={sacred}
              onChange={e => setSacred(e.target.checked)}
            />{' '}
            Sacred
          </label>
          <select
            value={shrunkPos}
            onChange={e =>
              setShrunkPos(e.target.value as 'onNotch' | 'aboveNotch')
            }
          >
            <option value="onNotch">On Notch</option>
            <option value="aboveNotch">Above Notch</option>
          </select>
        </div>
      </div>
      <div className={`p-6 rounded-lg ${sacred ? 'bg-black' : 'bg-gray-50'}`}>
        <Searchbar
          label="Interactive Search"
          placeholder="Type to see changes"
          value={value}
          onChange={e => setValue(e.target.value)}
          sacredtheme={sacred}
          shrunklabelposition={shrunkPos}
        />
      </div>
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
}

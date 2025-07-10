// src/components/TransferList/transferlist.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import TransferList, { TransferListDropdownDataMap } from './index'
import { userEvent, within } from '@storybook/test'

const meta: Meta<typeof TransferList> = {
  title: 'Components/TransferList',
  component: TransferList,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    variant: {
      control: 'radio',
      options: ['singleSelection', 'multipleSelection'],
    },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof TransferList>

const singleLeftItems = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E']
const singleRightItems = ['Item X', 'Item Y']

const dropdownDataMap: TransferListDropdownDataMap = {
  knowledgebase: {
    leftItems: ['Solar Flares', 'Galaxy Clusters', 'Nebulas'],
    rightItems: ['Black Holes'],
  },
  topics: {
    leftItems: ['Astro-Physics', 'Quantum Mechanics'],
    rightItems: ['General Relativity'],
  },
}
const dropdownOptions = [
  { value: '', label: 'Select Category' },
  { value: 'knowledgebase', label: 'Knowledgebase' },
  { value: 'topics', label: 'Topics' },
]

const itemLabelMap = {
  HIGH: 'High Priority',
  MEDIUM: 'Medium Priority',
  LOW: 'Low Priority',
}

/**
 * 1) Premium Theme
 */
export const PremiumTheme: Story = {
  name: 'Premium Theme',
  render: args => (
    <div className="w-[700px] p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 font-inter">
        Premium TransferList
      </h3>
      <TransferList {...args} />
    </div>
  ),
  args: {
    variant: 'singleSelection',
    leftItems: singleLeftItems,
    rightItems: singleRightItems,
    dropdownLabel: 'Select Category',
    dropdownOptions: dropdownOptions,
    dropdownDataMap: dropdownDataMap,
    itemLabelMap: itemLabelMap,
    onChange: (left, right, dropdownValue) => {
      console.log('Premium TransferList updated:', {
        left,
        right,
        dropdownValue,
      })
    },
    sacredtheme: false,
  },
}

/**
 * 2) Sacred Theme
 */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: args => (
    <div className="w-[700px] p-6 bg-black/90 rounded-lg border border-yellow-400/30">
      <h3 className="text-xl font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
        Sacred TransferList
      </h3>
      <TransferList {...args} />
    </div>
  ),
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  const [sacred, setSacred] = React.useState(false)

  const handleChange = (newLeft: string[], newRight: string[]) => {
    setLeft(newLeft)
    setRight(newRight)
  }

  return (
    <div className="w-[800px] space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sacred}
            onChange={e => setSacred(e.target.checked)}
          />
          Enable Sacred Theme
        </label>
      </div>
      <div
        className={`p-6 rounded-lg ${sacred ? 'bg-black/90 border border-yellow-400/30' : 'bg-gray-50'}`}
      >
        <TransferList
          leftItems={left}
          rightItems={right}
          onChange={handleChange}
          sacredtheme={sacred}
        />
      </div>
    </div>
  )
}

/**
 * 3) Interactive Demo
 */
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test moving an item
    const itemToMove = await canvas.findByText('Item A')
    await userEvent.click(itemToMove)

    const moveRightButton = await canvas.findByRole('button', {
      name: 'move selected right',
    })
    await userEvent.click(moveRightButton)
  },
}

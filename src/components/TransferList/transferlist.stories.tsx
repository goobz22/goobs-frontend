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
  render: args => {
    const Component = () => {
      const [localLeft, setLocalLeft] = React.useState(
        args.leftItems ?? singleLeftItems
      )
      const [localRight, setLocalRight] = React.useState(
        args.rightItems ?? singleRightItems
      )
      const [localDataMap, setLocalDataMap] =
        React.useState<TransferListDropdownDataMap>(
          args.dropdownDataMap ?? dropdownDataMap
        )
      const handleChange = (
        newLeft: string[],
        newRight: string[],
        dropdownValue?: string
      ) => {
        if (args.variant === 'multipleSelection' && dropdownValue) {
          setLocalDataMap(prev => ({
            ...prev,
            [dropdownValue]: { leftItems: newLeft, rightItems: newRight },
          }))
        } else {
          setLocalLeft(newLeft)
          setLocalRight(newRight)
        }
        args.onChange?.(newLeft, newRight, dropdownValue)
      }
      return (
        <div className="w-[700px] p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-inter">
            Premium TransferList
          </h3>
          {(() => {
            const tlProps: import('./index').TransferListProps = {
              onChange: handleChange,
            }
            if (args.variant !== undefined) tlProps.variant = args.variant
            if (args.dropdownLabel !== undefined)
              tlProps.dropdownLabel = args.dropdownLabel
            if (args.dropdownOptions !== undefined)
              tlProps.dropdownOptions = args.dropdownOptions
            if (args.itemLabelMap !== undefined)
              tlProps.itemLabelMap = args.itemLabelMap
            if (typeof args.sacredtheme === 'boolean')
              tlProps.sacredtheme = args.sacredtheme
            if (args.className !== undefined) tlProps.className = args.className
            if (args.style !== undefined) tlProps.style = args.style
            if (args.leftTitle !== undefined) tlProps.leftTitle = args.leftTitle
            if (args.rightTitle !== undefined)
              tlProps.rightTitle = args.rightTitle
            if (args.variant === 'singleSelection') {
              tlProps.leftItems = localLeft
              tlProps.rightItems = localRight
            } else if (args.variant === 'multipleSelection') {
              tlProps.dropdownDataMap = localDataMap
            }
            return <TransferList {...tlProps} />
          })()}
        </div>
      )
    }
    return <Component />
  },
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
  render: args => {
    const Component = () => {
      const [localLeft, setLocalLeft] = React.useState(
        args.leftItems ?? singleLeftItems
      )
      const [localRight, setLocalRight] = React.useState(
        args.rightItems ?? singleRightItems
      )
      const [localDataMap, setLocalDataMap] =
        React.useState<TransferListDropdownDataMap>(
          args.dropdownDataMap ?? dropdownDataMap
        )
      const handleChange = (
        newLeft: string[],
        newRight: string[],
        dropdownValue?: string
      ) => {
        if (args.variant === 'multipleSelection' && dropdownValue) {
          setLocalDataMap(prev => ({
            ...prev,
            [dropdownValue]: { leftItems: newLeft, rightItems: newRight },
          }))
        } else {
          setLocalLeft(newLeft)
          setLocalRight(newRight)
        }
        args.onChange?.(newLeft, newRight, dropdownValue)
      }
      return (
        <div className="w-[700px] p-6 bg-black/90 rounded-lg border border-yellow-400/30">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow">
            Sacred TransferList
          </h3>
          {(() => {
            const tlProps: import('./index').TransferListProps = {
              onChange: handleChange,
            }
            if (args.variant !== undefined) tlProps.variant = args.variant
            if (args.dropdownLabel !== undefined)
              tlProps.dropdownLabel = args.dropdownLabel
            if (args.dropdownOptions !== undefined)
              tlProps.dropdownOptions = args.dropdownOptions
            if (args.itemLabelMap !== undefined)
              tlProps.itemLabelMap = args.itemLabelMap
            if (typeof args.sacredtheme === 'boolean')
              tlProps.sacredtheme = args.sacredtheme
            if (args.className !== undefined) tlProps.className = args.className
            if (args.style !== undefined) tlProps.style = args.style
            if (args.leftTitle !== undefined) tlProps.leftTitle = args.leftTitle
            if (args.rightTitle !== undefined)
              tlProps.rightTitle = args.rightTitle
            if (args.variant === 'singleSelection') {
              tlProps.leftItems = localLeft
              tlProps.rightItems = localRight
            } else if (args.variant === 'multipleSelection') {
              tlProps.dropdownDataMap = localDataMap
            }
            return <TransferList {...tlProps} />
          })()}
        </div>
      )
    }
    return <Component />
  },
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  const [sacredtheme, setsacredtheme] = React.useState(false)

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
            checked={sacredtheme}
            onChange={e => setsacredtheme(e.target.checked)}
          />
          Enable Sacred Theme
        </label>
      </div>
      <div
        className={`p-6 rounded-lg ${sacredtheme ? 'bg-black/90 border border-yellow-400/30' : 'bg-gray-50'}`}
      >
        <TransferList
          leftItems={left}
          rightItems={right}
          onChange={handleChange}
          sacredtheme={sacredtheme}
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

// src/components/TransferList/transferlist.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import TransferList, { TransferListDropdownDataMap } from './index'
import { expect, userEvent, within } from 'storybook/test'

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
        <div
          style={{
            width: '700px',
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '16px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
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
        <div
          style={{
            width: '700px',
            padding: '24px',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '8px',
            border: '1px solid rgba(250, 204, 21, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffd700',
              marginBottom: '16px',
              fontFamily: "'Cinzel', Georgia, serif",
            }}
          >
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
    <div
      style={{
        width: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={sacredtheme}
            onChange={e => setsacredtheme(e.target.checked)}
          />
          Enable Sacred Theme
        </label>
      </div>
      <div
        style={{
          padding: '24px',
          borderRadius: '8px',
          ...(sacredtheme
            ? {
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
              }
            : { background: '#f9fafb' }),
        }}
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
  render: () => <InteractiveDemoRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Move Item A from the left list to the right list.
    const itemToMove = await canvas.findByText('Item A')
    const leftListElement = itemToMove.closest('ul')
    await userEvent.click(itemToMove)

    const moveRightButton = await canvas.findByRole('button', {
      name: 'move selected right',
    })
    await userEvent.click(moveRightButton)

    // Assert the move actually happened: Item A now lives in a DIFFERENT
    // list element than the one it started in.
    const movedItem = await canvas.findByText('Item A')
    await expect(movedItem.closest('ul')).not.toBe(leftListElement)
  },
}

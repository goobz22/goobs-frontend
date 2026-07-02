/**
 * @fileoverview Storybook stories for the TreeView component.
 * Demonstrates different states, themes, selection modes, and compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import TreeView, { TreeViewItem, useTreeViewApiRef } from './index'

const meta: Meta<typeof TreeView> = {
  title: 'Components/TreeView',
  component: TreeView,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    multiSelect: { control: 'boolean' },
    checkboxSelection: { control: 'boolean' },
    disableSelection: { control: 'boolean' },
    disabledItemsFocusable: { control: 'boolean' },
    expansionTrigger: {
      control: { type: 'select' },
      options: ['content', 'iconContainer'],
    },
    itemChildrenIndentation: { control: 'number' },
    selectedItems: { control: 'object' },
    expandedItems: { control: 'object' },
    onSelectedItemsChange: { action: 'selection changed' },
    onExpandedItemsChange: { action: 'expansion changed' },
    onItemClick: { action: 'item clicked' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', height: '500px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TreeView>

// Sample data for stories
const sampleTreeData: TreeViewItem[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      {
        id: 'work',
        label: 'Work Files',
        children: [
          { id: 'presentation', label: 'Quarterly Presentation.pptx' },
          { id: 'budget', label: 'Budget 2024.xlsx' },
          { id: 'meeting-notes', label: 'Meeting Notes.docx' },
        ],
      },
      {
        id: 'personal',
        label: 'Personal',
        children: [
          { id: 'photos', label: 'Photos' },
          { id: 'recipes', label: 'Recipes.pdf' },
        ],
      },
    ],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    children: [
      { id: 'software', label: 'Software Installers' },
      { id: 'images', label: 'Downloaded Images' },
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop',
    children: [{ id: 'shortcuts', label: 'Application Shortcuts' }],
  },
]

const hierarchicalData: TreeViewItem[] = [
  {
    id: 'company',
    label: 'Company',
    children: [
      {
        id: 'engineering',
        label: 'Engineering',
        children: [
          {
            id: 'frontend',
            label: 'Frontend Team',
            children: [
              { id: 'react-dev', label: 'React Developer' },
              { id: 'ui-designer', label: 'UI Designer' },
            ],
          },
          {
            id: 'backend',
            label: 'Backend Team',
            children: [
              { id: 'api-dev', label: 'API Developer' },
              { id: 'db-admin', label: 'Database Admin' },
            ],
          },
        ],
      },
      {
        id: 'marketing',
        label: 'Marketing',
        children: [
          { id: 'content-writer', label: 'Content Writer' },
          { id: 'social-media', label: 'Social Media Manager' },
        ],
      },
      {
        id: 'sales',
        label: 'Sales',
        children: [
          { id: 'account-exec', label: 'Account Executive' },
          { id: 'sales-rep', label: 'Sales Representative' },
        ],
      },
    ],
  },
]

const elementTreeData: TreeViewItem[] = [
  {
    id: 'elements',
    label: 'The Four Elements',
    children: [
      {
        id: 'fire',
        label: 'Fire',
        children: [
          { id: 'phoenix', label: 'Phoenix' },
          { id: 'dragon', label: 'Dragon' },
          { id: 'salamander', label: 'Salamander' },
        ],
      },
      {
        id: 'water',
        label: 'Water',
        children: [
          { id: 'undine', label: 'Undine' },
          { id: 'leviathan', label: 'Leviathan' },
          { id: 'kraken', label: 'Kraken' },
        ],
      },
      {
        id: 'earth',
        label: 'Earth',
        children: [
          { id: 'gnome', label: 'Gnome' },
          { id: 'golem', label: 'Golem' },
          { id: 'titan', label: 'Titan' },
        ],
      },
      {
        id: 'air',
        label: 'Air',
        children: [
          { id: 'sylph', label: 'Sylph' },
          { id: 'griffin', label: 'Griffin' },
          { id: 'thunderbird', label: 'Thunderbird' },
        ],
      },
    ],
  },
  {
    id: 'celestial',
    label: 'Celestial Bodies',
    children: [
      { id: 'sun', label: 'Sol' },
      { id: 'moon', label: 'Luna' },
      { id: 'stars', label: 'Stellar Realm' },
    ],
  },
]

const disabledItemsData: TreeViewItem[] = [
  {
    id: 'root',
    label: 'Root Folder',
    children: [
      { id: 'available', label: 'Available Item' },
      { id: 'disabled', label: 'Disabled Item', disabled: true },
      {
        id: 'folder',
        label: 'Mixed Folder',
        children: [
          { id: 'normal', label: 'Normal File' },
          { id: 'restricted', label: 'Restricted File', disabled: true },
        ],
      },
    ],
  },
]

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/** A default tree view with light theme. */
export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
}

/** A tree view with dark theme. */
export const DarkTheme: Story = {
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** The dark theme with element data. */
export const DarkThemeElements: Story = {
  args: {
    items: elementTreeData,
    defaultExpandedItems: ['elements'],
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SELECTION MODE STORIES
// --------------------------------------------------------------------------

const SingleSelectionExample = () => {
  const [selectedItems, setSelectedItems] = React.useState<string>('work')

  return (
    <TreeView
      items={sampleTreeData}
      selectedItems={selectedItems}
      defaultExpandedItems={['documents']}
      onSelectedItemsChange={(
        event: React.SyntheticEvent,
        itemIds: string | string[]
      ) => {
        setSelectedItems(itemIds as string)
      }}
      styles={{ theme: 'light' }}
    />
  )
}

/** Single selection mode (default). */
export const SingleSelection: Story = {
  name: 'Selection/Single Selection',
  render: () => <SingleSelectionExample />,
}

const MultiSelectionExample = () => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([
    'work',
    'personal',
  ])

  return (
    <TreeView
      items={sampleTreeData}
      selectedItems={selectedItems}
      multiSelect={true}
      defaultExpandedItems={['documents']}
      onSelectedItemsChange={(
        event: React.SyntheticEvent,
        itemIds: string | string[]
      ) => {
        setSelectedItems(itemIds as string[])
      }}
      styles={{ theme: 'light' }}
    />
  )
}

/** Multi-selection mode with Ctrl/Cmd + click. */
export const MultiSelection: Story = {
  name: 'Selection/Multi Selection',
  render: () => <MultiSelectionExample />,
}

const CheckboxSelectionExample = () => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>(['work'])

  return (
    <TreeView
      items={sampleTreeData}
      selectedItems={selectedItems}
      multiSelect={true}
      checkboxSelection={true}
      defaultExpandedItems={['documents']}
      onSelectedItemsChange={(
        event: React.SyntheticEvent,
        itemIds: string | string[]
      ) => {
        setSelectedItems(itemIds as string[])
      }}
      styles={{ theme: 'light' }}
    />
  )
}

/** Checkbox selection mode for easy multi-selection. */
export const CheckboxSelection: Story = {
  name: 'Selection/Checkbox Selection',
  render: () => <CheckboxSelectionExample />,
}

/** Disabled selection mode. */
export const DisabledSelection: Story = {
  name: 'Selection/Disabled Selection',
  args: {
    items: sampleTreeData,
    disableSelection: true,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/** Tree with some items expanded by default. */
export const ExpandedByDefault: Story = {
  name: 'State/Expanded by Default',
  args: {
    items: hierarchicalData,
    defaultExpandedItems: ['company', 'engineering', 'frontend'],
    defaultSelectedItems: ['react-dev'],
    styles: { theme: 'light' },
  },
}

/** Tree with disabled items. */
export const DisabledItems: Story = {
  name: 'State/Disabled Items',
  args: {
    items: disabledItemsData,
    defaultExpandedItems: ['root', 'folder'],
    checkboxSelection: true,
    multiSelect: true,
    styles: { theme: 'light' },
  },
}

/** Disabled items can still be focused. */
export const DisabledItemsFocusable: Story = {
  name: 'State/Disabled Items Focusable',
  args: {
    items: disabledItemsData,
    defaultExpandedItems: ['root', 'folder'],
    disabledItemsFocusable: true,
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// INTERACTION STORIES
// --------------------------------------------------------------------------

/** Expansion triggered only by icon clicks. */
export const IconOnlyExpansion: Story = {
  name: 'Interaction/Icon Only Expansion',
  args: {
    items: sampleTreeData,
    expansionTrigger: 'iconContainer',
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
}

/** Custom indentation between levels. */
export const CustomIndentation: Story = {
  name: 'Interaction/Custom Indentation',
  args: {
    items: hierarchicalData,
    itemChildrenIndentation: 40,
    defaultExpandedItems: ['company', 'engineering'],
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// API REFERENCE STORIES
// --------------------------------------------------------------------------

const ApiReferenceExample = () => {
  const apiRef = useTreeViewApiRef()
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [expandedItems, setExpandedItems] = React.useState<string[]>([
    'documents',
  ])

  const handleSelectAll = () => {
    apiRef.current?.setItemSelection({
      itemId: 'work',
      shouldBeSelected: true,
      keepExistingSelection: true,
    })
    apiRef.current?.setItemSelection({
      itemId: 'personal',
      shouldBeSelected: true,
      keepExistingSelection: true,
    })
  }

  const handleExpandAll = () => {
    sampleTreeData.forEach(item => {
      apiRef.current?.setItemExpansion({
        itemId: item.id,
        isExpanded: true,
      })
      if (item.children) {
        item.children.forEach(child => {
          apiRef.current?.setItemExpansion({
            itemId: child.id,
            isExpanded: true,
          })
        })
      }
    })
  }

  const handleCollapseAll = () => {
    setExpandedItems([])
  }

  const handleFocusItem = () => {
    apiRef.current?.focusItem('presentation')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSelectAll}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Select Work & Personal
        </button>
        <button
          onClick={handleExpandAll}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Expand All
        </button>
        <button
          onClick={handleCollapseAll}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Collapse All
        </button>
        <button
          onClick={handleFocusItem}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Focus Presentation
        </button>
      </div>
      <TreeView
        items={sampleTreeData}
        selectedItems={selectedItems}
        expandedItems={expandedItems}
        multiSelect={true}
        apiRef={apiRef}
        onSelectedItemsChange={(
          event: React.SyntheticEvent,
          itemIds: string | string[]
        ) => {
          setSelectedItems(itemIds as string[])
        }}
        onExpandedItemsChange={(
          event: React.SyntheticEvent,
          itemIds: string[]
        ) => {
          setExpandedItems(itemIds)
        }}
        styles={{ theme: 'light' }}
      />
    </div>
  )
}

/** Demonstrates imperative API usage. */
export const ApiReference: Story = {
  name: 'API/Imperative API',
  render: () => <ApiReferenceExample />,
}

// --------------------------------------------------------------------------
// THEMED STORIES
// --------------------------------------------------------------------------

const DarkThemeExample = () => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([
    'engineering',
  ])

  return (
    <TreeView
      items={hierarchicalData}
      selectedItems={selectedItems}
      multiSelect={true}
      checkboxSelection={true}
      defaultExpandedItems={['company', 'engineering']}
      onSelectedItemsChange={(
        event: React.SyntheticEvent,
        itemIds: string | string[]
      ) => {
        setSelectedItems(itemIds as string[])
      }}
      styles={{ theme: 'dark' }}
    />
  )
}

/** Dark themed tree with checkbox selection. */
export const DarkWithCheckboxes: Story = {
  name: 'Themes/Dark with Checkboxes',
  render: () => <DarkThemeExample />,
  globals: { backgrounds: { value: 'dark' } },
}

const DarkThemeElementsExample = () => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>(['fire'])
  const [expandedItems, setExpandedItems] = React.useState<string[]>([
    'elements',
    'fire',
  ])

  return (
    <TreeView
      items={elementTreeData}
      selectedItems={selectedItems}
      expandedItems={expandedItems}
      multiSelect={true}
      onSelectedItemsChange={(
        event: React.SyntheticEvent,
        itemIds: string | string[]
      ) => {
        setSelectedItems(itemIds as string[])
      }}
      onExpandedItemsChange={(
        event: React.SyntheticEvent,
        itemIds: string[]
      ) => {
        setExpandedItems(itemIds)
      }}
      styles={{ theme: 'dark' }}
    />
  )
}

/** Dark themed tree with element data. */
export const DarkInteractiveElements: Story = {
  name: 'Themes/Dark Interactive Elements',
  render: () => <DarkThemeElementsExample />,
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Sacred themed tree. This is the only story that passes
 * `styles: { theme: 'sacred' }`, so it is the Chromatic baseline for the
 * entire sacred variant — including the SacredBackground canvas, whose
 * drifting hieroglyph particles (SACRED_GLYPHS) were previously invisible
 * because the particle glyph was hardcoded to an empty string.
 */
export const SacredTheme: Story = {
  name: 'Themes/Sacred',
  args: {
    items: elementTreeData,
    defaultExpandedItems: ['elements', 'fire', 'water', 'celestial'],
    defaultSelectedItems: ['phoenix'],
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
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
        padding: '2rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div
          style={{
            height: '400px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        >
          <TreeView
            items={sampleTreeData}
            defaultExpandedItems={['documents']}
            defaultSelectedItems={['work']}
            styles={{ theme: 'light' }}
          />
        </div>
        <p
          style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#6B7280' }}
        >
          Single selection, content expansion
        </p>
      </div>

      {/* Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div
          style={{
            height: '400px',
            border: '1px solid #374151',
            borderRadius: '8px',
            backgroundColor: '#1f2937',
          }}
        >
          <TreeView
            items={hierarchicalData}
            defaultExpandedItems={['company', 'engineering']}
            defaultSelectedItems={['frontend', 'backend']}
            multiSelect={true}
            checkboxSelection={true}
            styles={{ theme: 'dark' }}
          />
        </div>
        <p
          style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#6B7280' }}
        >
          Multi-selection with checkboxes
        </p>
      </div>

      {/* Dark Theme Elements Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>
          Dark Theme Elements
        </h3>
        <div
          style={{
            height: '400px',
            border: '1px solid #374151',
            borderRadius: '8px',
            backgroundColor: '#1f2937',
          }}
        >
          <TreeView
            items={elementTreeData}
            defaultExpandedItems={['elements']}
            defaultSelectedItems={['fire']}
            multiSelect={true}
            styles={{ theme: 'dark' }}
          />
        </div>
        <p
          style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#9CA3AF' }}
        >
          Dark theme with element hierarchy
        </p>
      </div>

      {/* Interactive Features */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Interactive Features
        </h3>
        <div
          style={{
            height: '400px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        >
          <TreeView
            items={disabledItemsData}
            defaultExpandedItems={['root', 'folder']}
            expansionTrigger="iconContainer"
            itemChildrenIndentation={32}
            checkboxSelection={true}
            multiSelect={true}
            styles={{ theme: 'light' }}
          />
        </div>
        <p
          style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#6B7280' }}
        >
          Icon-only expansion, disabled items, custom indentation
        </p>
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
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check if Documents folder is expanded
    const workItem = canvas.getByText('Work Files')
    await expect(workItem).toBeVisible()

    // Click on a tree item
    await userEvent.click(workItem)

    // Check accessibility attributes
    const treeElement = canvas.getByRole('tree')
    await expect(treeElement).toBeInTheDocument()

    // Check tree items have correct roles
    const treeItems = canvas.getAllByRole('treeitem')
    await expect(treeItems.length).toBeGreaterThan(0)
  },
}

// --------------------------------------------------------------------------
// PERFORMANCE TEST
// --------------------------------------------------------------------------

const generateLargeTree = (
  depth: number,
  breadth: number,
  currentDepth = 0
): TreeViewItem[] => {
  if (currentDepth >= depth) return []

  return Array.from({ length: breadth }, (_, i) => ({
    id: `item-${currentDepth}-${i}`,
    label: `Item ${currentDepth}-${i}`,
    children: generateLargeTree(depth, breadth, currentDepth + 1),
  }))
}

/** Large tree for performance testing. */
export const LargeTree: Story = {
  name: 'Performance/Large Tree',
  render: () => (
    <TreeView
      items={generateLargeTree(4, 5)}
      defaultExpandedItems={['item-0-0', 'item-1-0']}
      multiSelect={true}
      checkboxSelection={true}
      styles={{ theme: 'light' }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A large tree with 4 levels and 5 items per level (780 total items) to test performance.',
      },
    },
  },
}

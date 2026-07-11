/**
 * @fileoverview Storybook stories for the TreeView component.
 * Demonstrates different states, themes, selection modes, and compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect, fn, waitFor } from 'storybook/test'
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Disabled selection mode. When selection is turned off entirely no node is
 * selectable, so — per the WAI-ARIA APG Tree View pattern — `aria-selected` is
 * OMITTED from every node rather than announcing a permanent, unchangeable
 * "not selected" state (WCAG 4.1.2 Name, Role, Value). Pinned observable
 * state: no `treeitem` carries an `aria-selected` attribute, yet the nodes are
 * still keyboard-focusable and expandable.
 */
export const DisabledSelection: Story = {
  name: 'Selection/Disabled Selection',
  args: {
    items: sampleTreeData,
    disableSelection: true,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('treeitem')

    // Selection is unsupported → aria-selected must be absent on every node.
    for (const item of items) {
      await expect(item).not.toHaveAttribute('aria-selected')
    }

    // The tree still enters via a roving-tabindex node and stays operable.
    await expect(items[0]).toHaveAttribute('tabindex', '0')
    items[0].focus()
    await expect(items[0]).toHaveFocus()
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  globals: { backgrounds: { value: 'light' } },
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
  play: async ({ canvasElement }) => {
    // The decorative SacredBackground particle canvas mounts client-side (in an
    // effect); once present it must be hidden from assistive tech so a screen
    // reader never surfaces the bare, information-free <canvas> (WCAG 1.1.1).
    await waitFor(() => {
      const decorativeCanvas = canvasElement.querySelector('canvas')
      expect(decorativeCanvas).not.toBeNull()
      expect(decorativeCanvas).toHaveAttribute('aria-hidden', 'true')
    })
  },
}

/**
 * Sacred theme with `styles.sacredBackgroundGlyphColor` overridden — the
 * drifting SACRED_GLYPHS hieroglyph particles on the background canvas render
 * emerald (#34d399) instead of the default gold #FFD700, while the tree items
 * keep the stock sacred gold styling.
 */
export const SacredCustomGlyphColor: Story = {
  name: 'Themes/Sacred Custom Glyph Color',
  args: {
    items: elementTreeData,
    defaultExpandedItems: ['elements', 'fire'],
    defaultSelectedItems: ['phoenix'],
    styles: {
      theme: 'sacred',
      sacredBackgroundGlyphColor: '#34d399',
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// CALLER-OVERRIDE STYLING
// --------------------------------------------------------------------------

/**
 * Exercises every per-state caller override on the styles contract. Pinned
 * observable state: the selected row ('Available Item') renders the purple
 * override (violet background/border/text, weight 700, violet glow), the
 * expanded rows ('Root Folder', 'Mixed Folder') render the teal override with
 * the underline text-shadow, disabled rows render the overridden slate text
 * on the slate-tinted background at 0.45 opacity, the expanded chevrons are
 * magenta and rotated 135deg, and each children group carries a dotted violet
 * left border with 28px padding and 12px margin. The hover overrides (amber
 * row, amber chevron, 6px slide) and the focus overrides (dashed violet
 * outline, violet halo, faint violet fill) appear on pointer hover /
 * keyboard focus respectively.
 */
export const CustomStateOverrides: Story = {
  name: 'Styling/Custom State Overrides',
  args: {
    items: disabledItemsData,
    defaultExpandedItems: ['root', 'folder'],
    defaultSelectedItems: ['available'],
    styles: {
      theme: 'light',
      itemSelectedBackgroundColor: 'rgba(147, 51, 234, 0.12)',
      itemSelectedBorderColor: 'rgba(147, 51, 234, 0.5)',
      itemSelectedColor: '#7c3aed',
      itemSelectedFontWeight: 700,
      itemSelectedTextShadow: '0 1px 2px rgba(147, 51, 234, 0.3)',
      itemSelectedBoxShadow: '0 2px 8px rgba(147, 51, 234, 0.25)',
      itemSelectedBackgroundImage:
        'linear-gradient(90deg, rgba(147, 51, 234, 0.08), transparent)',
      itemExpandedBackgroundColor: 'rgba(20, 184, 166, 0.08)',
      itemExpandedBorderColor: 'rgba(20, 184, 166, 0.35)',
      itemExpandedColor: '#0f766e',
      itemExpandedFontWeight: 600,
      itemExpandedTextShadow: '0 1px 0 rgba(20, 184, 166, 0.35)',
      itemHoverBackgroundColor: 'rgba(245, 158, 11, 0.12)',
      itemHoverBorderColor: 'rgba(245, 158, 11, 0.4)',
      itemHoverColor: '#b45309',
      itemHoverTransform: 'translateX(6px)',
      itemHoverTextShadow: '0 1px 1px rgba(245, 158, 11, 0.3)',
      itemHoverBoxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
      itemDisabledBackgroundColor: 'rgba(100, 116, 139, 0.1)',
      itemDisabledColor: '#64748b',
      itemDisabledOpacity: 0.45,
      itemDisabledBorderColor: 'rgba(100, 116, 139, 0.3)',
      itemFocusedOutline: '2px dashed #7c3aed',
      itemFocusedOutlineOffset: '3px',
      itemFocusedBoxShadow: '0 0 0 4px rgba(147, 51, 234, 0.15)',
      itemFocusedBackgroundColor: 'rgba(147, 51, 234, 0.05)',
      expandIconExpandedColor: '#d946ef',
      expandIconExpandedTransform: 'rotate(135deg)',
      expandIconHoverColor: '#f59e0b',
      expandIconHoverTransform: 'scale(1.3)',
      contentPaddingLeft: '28px',
      contentBorderLeft: '2px dotted rgba(147, 51, 234, 0.4)',
      contentMarginLeft: '12px',
    },
  },
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
        <h3 style={{ margin: '0 0 1rem 0', color: '#6B7280' }}>Dark Theme</h3>
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
        <h3 style={{ margin: '0 0 1rem 0', color: '#6B7280' }}>
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
          style={{ margin: '0.5rem 0 0 0', fontSize: '14px', color: '#6B7280' }}
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
  globals: { backgrounds: { value: 'light' } },
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
// ACCESSIBILITY TESTS
// --------------------------------------------------------------------------

/**
 * Exercises the full WAI-ARIA APG Tree View keyboard interaction and the
 * structural ARIA the pattern requires. Pinned observable state:
 *  - child nodes live inside a `role="group"` container;
 *  - each node carries `aria-level` / `aria-setsize` / `aria-posinset`;
 *  - exactly ONE node is in the Tab sequence at a time (roving `tabindex`),
 *    and it follows focus;
 *  - Down / Up move roving focus between visible nodes, End / Home jump to the
 *    last / first, and Left / Right collapse / expand the focused parent.
 */
export const KeyboardNavigation: Story = {
  name: 'Accessibility/Keyboard Navigation',
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('treeitem')

    // Child treeitems are wrapped in a role="group" container (APG Tree View).
    const groups = canvasElement.querySelectorAll('[role="group"]')
    await expect(groups.length).toBeGreaterThan(0)

    // APG parent→children OWNERSHIP: the expanded parent ('Documents') owns its
    // child group via aria-owns, and the referenced element is that group —
    // ownership is explicit, not merely implied by aria-level.
    const ownsId = items[0].getAttribute('aria-owns')
    await expect(ownsId).toBeTruthy()
    const ownedGroup = canvasElement.querySelector(`#${ownsId}`)
    await expect(ownedGroup).not.toBeNull()
    await expect(ownedGroup).toHaveAttribute('role', 'group')
    // A collapsed / leaf node carries no aria-owns (no dangling reference).
    const leaf = canvasElement.querySelector(
      '[data-testid="tree-item-desktop"]'
    )
    await expect(leaf).not.toHaveAttribute('aria-owns')

    // Structural ARIA: level + set position/size are exposed to assistive tech.
    await expect(items[0]).toHaveAttribute('aria-level', '1')
    await expect(items[0]).toHaveAttribute('aria-setsize', '3')
    await expect(items[0]).toHaveAttribute('aria-posinset', '1')

    // Roving tabindex: only the first node is initially in the Tab sequence.
    await expect(items[0]).toHaveAttribute('tabindex', '0')
    await expect(items[1]).toHaveAttribute('tabindex', '-1')

    // Tab enters the tree onto the first node.
    items[0].focus()
    await expect(items[0]).toHaveFocus()

    // Down / Up move roving focus, and the tabindex follows focus.
    await userEvent.keyboard('{ArrowDown}')
    await expect(items[1]).toHaveFocus()
    await expect(items[1]).toHaveAttribute('tabindex', '0')
    await expect(items[0]).toHaveAttribute('tabindex', '-1')

    await userEvent.keyboard('{ArrowUp}')
    await expect(items[0]).toHaveFocus()

    // End / Home jump to the last / first visible node.
    await userEvent.keyboard('{End}')
    await expect(items[items.length - 1]).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(items[0]).toHaveFocus()

    // 'Documents' (items[0]) is expanded by default → Left collapses it,
    // Right re-expands it.
    await userEvent.keyboard('{ArrowLeft}')
    await expect(items[0]).toHaveAttribute('aria-expanded', 'false')
    await userEvent.keyboard('{ArrowRight}')
    await expect(items[0]).toHaveAttribute('aria-expanded', 'true')
  },
}

/**
 * The tree accepts an `aria-label` (forwarded to the `role="tree"` element)
 * so the whole widget has an accessible name (WCAG 4.1.2). Pinned observable
 * state: the tree exposes the accessible name 'File browser'.
 */
export const WithAccessibleLabel: Story = {
  name: 'Accessibility/With Accessible Label',
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
    'aria-label': 'File browser',
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // getByRole with an accessible name proves the aria-label is wired through.
    const tree = canvas.getByRole('tree', { name: 'File browser' })
    await expect(tree).toBeInTheDocument()
  },
}

/**
 * The documented `onItemFocus` consumer callback fires for EVERY focus entry —
 * pointer click AND keyboard roving (arrow keys) — not only pointer. Pinned
 * observable state: after ArrowDown moves roving focus to the second node, the
 * spy has been called with that node's id.
 */
export const FocusCallbackOnKeyboard: Story = {
  name: 'Accessibility/Focus Callback (Keyboard)',
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
    onItemFocus: fn(),
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('treeitem')

    // Enter the tree, then rove down with the keyboard (no pointer involved).
    items[0].focus()
    await expect(items[0]).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(items[1]).toHaveFocus()

    // onItemFocus fired for the ARROW-KEY focus change (regression: it used to
    // fire only on pointer click). items[1] is 'Work Files' (id 'work').
    await expect(args.onItemFocus).toHaveBeenCalledWith(
      expect.anything(),
      'work'
    )
  },
}

/**
 * The expand/collapse chevron is DECORATIVE (no role/name, hidden from AT) —
 * expand/collapse is owned by the treeitem row (arrow keys + aria-expanded), so
 * the chevron is no longer a broken `role="button"` that AT announces yet cannot
 * operate by keyboard. It remains a pointer convenience: in the DEFAULT
 * 'content' expansion mode a click on the chevron toggles the node (previously a
 * dead no-op). Pinned observable state: the chevron container has no role and is
 * aria-hidden, the tree exposes NO button, and a chevron click expands then
 * collapses the node.
 */
export const ChevronDecorativeAndClickable: Story = {
  name: 'Accessibility/Chevron (Decorative + Clickable)',
  args: {
    items: sampleTreeData,
    // No defaultExpandedItems → nodes start collapsed.
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvasElement.querySelector(
      '[data-testid="tree-item-documents"]'
    ) as HTMLElement
    await expect(row).toHaveAttribute('aria-expanded', 'false')

    // The chevron container is the row's first child (no checkbox in this
    // story); it wraps the decorative icon, carries no role, and is hidden from
    // assistive tech.
    const chevron = row.firstElementChild as HTMLElement
    await expect(chevron.querySelector('svg')).not.toBeNull()
    await expect(chevron).not.toHaveAttribute('role')
    await expect(chevron).toHaveAttribute('aria-hidden', 'true')

    // No node exposes a nested button (the old broken chevron role="button").
    await expect(canvas.queryByRole('button')).toBeNull()

    // Default 'content' mode: a pointer click on the chevron toggles expansion.
    await userEvent.click(chevron)
    await expect(row).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(chevron)
    await expect(row).toHaveAttribute('aria-expanded', 'false')
  },
}

/**
 * The optional/recommended tail of the APG Tree View keyboard table: type-ahead
 * (focus follows typed characters) and '*' (expand all sibling nodes). Pinned
 * observable state: typing 'p' moves focus to 'Personal'; pressing '*' on a root
 * node expands all sibling roots that have children.
 */
export const TypeaheadAndExpandSiblings: Story = {
  name: 'Accessibility/Type-ahead & Expand Siblings',
  args: {
    items: sampleTreeData,
    defaultExpandedItems: ['documents'],
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('treeitem')

    // Type-ahead: focus the first node and type 'p' → focus jumps to the next
    // visible node whose label starts with 'p' ('Personal').
    items[0].focus()
    await expect(items[0]).toHaveFocus()
    await userEvent.keyboard('p')
    const personal = canvasElement.querySelector(
      '[data-testid="tree-item-personal"]'
    )
    await expect(personal).toHaveFocus()

    // '*' expands every sibling of the focused node. Focus a root node and press
    // '*' → the sibling roots that have children ('Downloads', 'Desktop') expand.
    items[0].focus()
    await userEvent.keyboard('*')
    const downloads = canvasElement.querySelector(
      '[data-testid="tree-item-downloads"]'
    )
    const desktop = canvasElement.querySelector(
      '[data-testid="tree-item-desktop"]'
    )
    await expect(downloads).toHaveAttribute('aria-expanded', 'true')
    await expect(desktop).toHaveAttribute('aria-expanded', 'true')
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
  globals: { backgrounds: { value: 'light' } },
}

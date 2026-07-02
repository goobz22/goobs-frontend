/**
 * @fileoverview TreeView component - A hierarchical data display component similar to MUI X TreeView.
 * Supports selection, expansion, checkbox selection, theming, and accessibility features.
 */
'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
  type FC,
} from 'react'
import cssStyles from './TreeView.module.css'
import ExpandMoreIcon from '../Icons/ExpandMore'
import { SACRED_GLYPHS } from '../Icons/sacredGlyphs'

// --------------------------------------------------------------------------
// TYPES AND INTERFACES
// --------------------------------------------------------------------------

export type TreeViewItemId = string

/**
 * Public styling contract for TreeView. Descended from the old
 * theme/treeview.ts `TreeViewStyles`; every remaining key is live. The
 * `theme` field selects the variant (rendered as data-theme); the remaining
 * fields are caller-supplied overrides applied via the small JS dynamicStyle
 * objects. Per-state item overrides (the itemHover, itemSelected,
 * itemExpanded, and itemDisabled groups) follow the state cascade
 * disabled > selected > expanded > hover, with the itemFocused overrides
 * layered last on top.
 */
export interface TreeViewStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string
  color?: string
  fontFamily?: string
  fontSize?: string
  lineHeight?: string | number
  padding?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  maxHeight?: string

  // Item styling
  itemBackgroundColor?: string
  itemBorderColor?: string
  itemBorderRadius?: string
  itemColor?: string
  itemFontFamily?: string
  itemFontSize?: string
  itemFontWeight?: string | number
  itemLetterSpacing?: string
  itemTextShadow?: string
  itemPadding?: string
  itemMinHeight?: string
  itemMargin?: string

  // Item hover states
  itemHoverBackgroundColor?: string
  itemHoverBorderColor?: string
  itemHoverColor?: string
  itemHoverTransform?: string
  itemHoverTextShadow?: string
  itemHoverBoxShadow?: string

  // Item selected states
  itemSelectedBackgroundColor?: string
  itemSelectedBorderColor?: string
  itemSelectedColor?: string
  itemSelectedFontWeight?: string | number
  itemSelectedTextShadow?: string
  itemSelectedBoxShadow?: string
  itemSelectedBackgroundImage?: string

  // Item expanded states
  itemExpandedBackgroundColor?: string
  itemExpandedBorderColor?: string
  itemExpandedColor?: string
  itemExpandedFontWeight?: string | number
  itemExpandedTextShadow?: string

  // Item disabled states
  itemDisabledBackgroundColor?: string
  itemDisabledColor?: string
  itemDisabledOpacity?: number
  itemDisabledBorderColor?: string

  // Item focus states
  itemFocusedOutline?: string
  itemFocusedOutlineOffset?: string
  itemFocusedBoxShadow?: string
  itemFocusedBackgroundColor?: string

  // Icon styling
  iconContainerWidth?: string
  iconContainerHeight?: string
  iconContainerMarginRight?: string
  expandIconColor?: string
  expandIconFontSize?: string
  expandIconHoverColor?: string
  expandIconHoverTransform?: string
  expandIconExpandedTransform?: string
  expandIconExpandedColor?: string

  // Checkbox styling
  checkboxWidth?: string
  checkboxHeight?: string
  checkboxMarginRight?: string
  checkboxAccentColor?: string
  checkboxBorderRadius?: string
  checkboxBorder?: string
  checkboxBackground?: string

  // Content area styling
  contentPaddingLeft?: string
  contentBorderLeft?: string
  contentMarginLeft?: string

  // Label styling
  labelFontSize?: string
  labelFontWeight?: string | number
  labelColor?: string
  labelTextShadow?: string

  // Indentation
  levelIndentBase?: number
  levelIndentIncrement?: number

  // Sacred theme styling
  /**
   * Fill + glow color of the drifting SACRED_GLYPHS hieroglyph particles on
   * the sacred theme's background canvas. Defaults to gold (#FFD700).
   */
  sacredBackgroundGlyphColor?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  outline?: boolean
}

export interface TreeViewItem {
  id: TreeViewItemId
  label: string
  children?: TreeViewItem[]
  disabled?: boolean
  [key: string]: any
}

export interface TreeViewSelectionPropagation {
  descendants?: boolean
  parents?: boolean
}

export interface TreeViewApiRef {
  focusItem: (itemId: TreeViewItemId) => void
  getItem: (itemId: TreeViewItemId) => TreeViewItem | null
  getItemDOMElement: (itemId: TreeViewItemId) => HTMLElement | null
  getItemOrderedChildrenIds: (itemId: TreeViewItemId) => TreeViewItemId[]
  getItemTree: () => TreeViewItem[]
  getParentId: (itemId: TreeViewItemId) => TreeViewItemId | null
  setItemExpansion: (params: {
    itemId: TreeViewItemId
    isExpanded?: boolean
    event?: React.SyntheticEvent
  }) => void
  setItemSelection: (params: {
    itemId: TreeViewItemId
    shouldBeSelected?: boolean
    keepExistingSelection?: boolean
    event?: React.SyntheticEvent
  }) => void
  setIsItemDisabled: (params: {
    itemId: TreeViewItemId
    shouldBeDisabled?: boolean
  }) => void
}

export interface TreeViewProps {
  /** The items to display in the tree */
  items?: TreeViewItem[]

  /** Function to extract the item ID */
  getItemId?: (item: TreeViewItem) => TreeViewItemId

  /** Function to extract the item label */
  getItemLabel?: (item: TreeViewItem) => string

  /** Function to extract the item children */
  getItemChildren?: (item: TreeViewItem) => TreeViewItem[] | undefined

  /** Function to determine if an item is disabled */
  isItemDisabled?: (item: TreeViewItem) => boolean

  /** Selected item IDs (controlled) */
  selectedItems?: TreeViewItemId[] | TreeViewItemId

  /** Default selected item IDs (uncontrolled) */
  defaultSelectedItems?: TreeViewItemId[] | TreeViewItemId

  /** Expanded item IDs (controlled) */
  expandedItems?: TreeViewItemId[]

  /** Default expanded item IDs (uncontrolled) */
  defaultExpandedItems?: TreeViewItemId[]

  /** Enable multi-selection */
  multiSelect?: boolean

  /** Enable checkbox selection */
  checkboxSelection?: boolean

  /** Disable selection entirely */
  disableSelection?: boolean

  /** Allow focusing disabled items */
  disabledItemsFocusable?: boolean

  /** Selection propagation settings */
  selectionPropagation?: TreeViewSelectionPropagation

  /** What triggers expansion: content click or icon click only */
  expansionTrigger?: 'content' | 'iconContainer'

  /** Horizontal indentation between item and children */
  itemChildrenIndentation?: string | number

  /** Callback when selected items change */
  onSelectedItemsChange?: (
    event: React.SyntheticEvent,
    itemIds: TreeViewItemId[] | TreeViewItemId
  ) => void

  /** Callback when a single item selection changes */
  onItemSelectionToggle?: (
    event: React.SyntheticEvent,
    itemId: TreeViewItemId,
    isSelected: boolean
  ) => void

  /** Callback when expanded items change */
  onExpandedItemsChange?: (
    event: React.SyntheticEvent,
    itemIds: TreeViewItemId[]
  ) => void

  /** Callback when a single item expansion changes */
  onItemExpansionToggle?: (
    event: React.SyntheticEvent | null,
    itemId: TreeViewItemId,
    isExpanded: boolean
  ) => void

  /** Callback when an item is clicked */
  onItemClick?: (event: React.MouseEvent, itemId: TreeViewItemId) => void

  /** Callback when an item is focused */
  onItemFocus?: (
    event: React.SyntheticEvent | null,
    itemId: TreeViewItemId
  ) => void

  /** API reference for imperative operations */
  apiRef?: React.MutableRefObject<TreeViewApiRef | undefined>

  /** Component styling */
  styles?: TreeViewStyles

  /** Component children (for SimpleTreeView style usage) */
  children?: ReactNode

  /** HTML id attribute */
  id?: string

  /** Additional props */
  [key: string]: any
}

export interface TreeItemProps {
  /** Item data */
  item: TreeViewItem

  /** Nesting level */
  level?: number

  /** Whether item is selected */
  isSelected?: boolean

  /** Whether item is expanded */
  isExpanded?: boolean

  /** Whether item is focused */
  isFocused?: boolean

  /** Whether item has children */
  hasChildren?: boolean

  /** Component styling */
  styles?: TreeViewStyles

  /** Click handlers */
  onClick?: (event: React.MouseEvent, itemId: TreeViewItemId) => void
  onToggleExpansion?: (
    event: React.SyntheticEvent,
    itemId: TreeViewItemId
  ) => void
  onToggleSelection?: (
    event: React.SyntheticEvent,
    itemId: TreeViewItemId
  ) => void
  onFocus?: (event: React.FocusEvent, itemId: TreeViewItemId) => void

  /** Checkbox selection enabled */
  checkboxSelection?: boolean

  /** Multi-select enabled */
  multiSelect?: boolean

  /** Expansion trigger mode */
  expansionTrigger?: 'content' | 'iconContainer'

  /** Disabled items focusable */
  disabledItemsFocusable?: boolean
}

// --------------------------------------------------------------------------
// CONTEXT
// --------------------------------------------------------------------------

interface TreeViewContextValue {
  selectedItems: Set<TreeViewItemId>
  expandedItems: Set<TreeViewItemId>
  focusedItem: TreeViewItemId | null
  disabledItems: Set<TreeViewItemId>
  itemMap: Map<TreeViewItemId, TreeViewItem>
  parentMap: Map<TreeViewItemId, TreeViewItemId>
  childrenMap: Map<TreeViewItemId, TreeViewItemId[]>
  multiSelect: boolean
  checkboxSelection: boolean
  disableSelection: boolean
  disabledItemsFocusable: boolean
  selectionPropagation: TreeViewSelectionPropagation
  expansionTrigger: 'content' | 'iconContainer'
  styles: TreeViewStyles
  getItemId: (item: TreeViewItem) => TreeViewItemId
  getItemLabel: (item: TreeViewItem) => string
  getItemChildren: (item: TreeViewItem) => TreeViewItem[] | undefined
  isItemDisabled: (item: TreeViewItem) => boolean
  onItemClick?: (event: React.MouseEvent, itemId: TreeViewItemId) => void
  onItemFocus?: (
    event: React.SyntheticEvent | null,
    itemId: TreeViewItemId
  ) => void
  onToggleExpansion: (
    event: React.SyntheticEvent,
    itemId: TreeViewItemId
  ) => void
  onToggleSelection: (
    event: React.SyntheticEvent,
    itemId: TreeViewItemId
  ) => void
  setFocusedItem: (itemId: TreeViewItemId | null) => void
  apiRef?: React.MutableRefObject<TreeViewApiRef | undefined>
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null)

/**
 * Access the internal TreeView context from a descendant (custom tree-item
 * renderers or controls composed inside a `<TreeView>`). Exposes the current
 * selection / expansion / focus / disabled sets, the item / parent / children
 * lookup maps, the behavior flags (multiSelect, checkboxSelection, …), the
 * resolved `styles` object, and the toggle / focus callbacks.
 *
 * Must be called from a component rendered INSIDE a `<TreeView>` — it throws
 * `Error('useTreeViewContext must be used within a TreeView')` when no
 * provider is above it in the React tree.
 */
const useTreeViewContext = () => {
  const context = useContext(TreeViewContext)
  if (!context) {
    throw new Error('useTreeViewContext must be used within a TreeView')
  }
  return context
}

// --------------------------------------------------------------------------
// HOOKS
// --------------------------------------------------------------------------

const useTreeViewApiRef = (): React.MutableRefObject<
  TreeViewApiRef | undefined
> => {
  return useRef<TreeViewApiRef | undefined>(undefined)
}

const useTreeViewSelection = (
  selectedItemsProp?: TreeViewItemId[] | TreeViewItemId,
  defaultSelectedItems?: TreeViewItemId[] | TreeViewItemId,
  multiSelect = false,
  onSelectedItemsChange?: (
    event: React.SyntheticEvent,
    itemIds: TreeViewItemId[] | TreeViewItemId
  ) => void,
  onItemSelectionToggle?: (
    event: React.SyntheticEvent,
    itemId: TreeViewItemId,
    isSelected: boolean
  ) => void
) => {
  const isControlled = selectedItemsProp !== undefined

  // Normalize selection to array format internally
  const normalizeSelection = useCallback(
    (
      selection: TreeViewItemId[] | TreeViewItemId | undefined
    ): TreeViewItemId[] => {
      if (selection === undefined) return []
      return Array.isArray(selection) ? selection : [selection]
    },
    []
  )

  const [internalSelectedItems, setInternalSelectedItems] = useState<
    Set<TreeViewItemId>
  >(() => new Set(normalizeSelection(defaultSelectedItems)))

  const selectedItems = useMemo(() => {
    if (isControlled) {
      return new Set(normalizeSelection(selectedItemsProp))
    }
    return internalSelectedItems
  }, [
    isControlled,
    selectedItemsProp,
    internalSelectedItems,
    normalizeSelection,
  ])

  const setSelectedItems = useCallback(
    (
      newSelection: Set<TreeViewItemId>,
      event: React.SyntheticEvent,
      changedItemId?: TreeViewItemId,
      isSelected?: boolean
    ) => {
      if (!isControlled) {
        setInternalSelectedItems(newSelection)
      }

      // Convert back to the expected format for callbacks
      const selectionArray = Array.from(newSelection)
      const callbackValue = multiSelect
        ? selectionArray
        : selectionArray[0] || ''

      onSelectedItemsChange?.(event, callbackValue)

      if (changedItemId !== undefined && isSelected !== undefined) {
        onItemSelectionToggle?.(event, changedItemId, isSelected)
      }
    },
    [isControlled, multiSelect, onSelectedItemsChange, onItemSelectionToggle]
  )

  const toggleItemSelection = useCallback(
    (event: React.SyntheticEvent, itemId: TreeViewItemId) => {
      const newSelection = new Set(selectedItems)
      const wasSelected = newSelection.has(itemId)

      if (wasSelected) {
        newSelection.delete(itemId)
      } else {
        if (!multiSelect) {
          newSelection.clear()
        }
        newSelection.add(itemId)
      }

      setSelectedItems(newSelection, event, itemId, !wasSelected)
    },
    [selectedItems, multiSelect, setSelectedItems]
  )

  return {
    selectedItems,
    setSelectedItems,
    toggleItemSelection,
  }
}

const useTreeViewExpansion = (
  expandedItemsProp?: TreeViewItemId[],
  defaultExpandedItems?: TreeViewItemId[],
  onExpandedItemsChange?: (
    event: React.SyntheticEvent,
    itemIds: TreeViewItemId[]
  ) => void,
  onItemExpansionToggle?: (
    event: React.SyntheticEvent | null,
    itemId: TreeViewItemId,
    isExpanded: boolean
  ) => void
) => {
  const isControlled = expandedItemsProp !== undefined

  const [internalExpandedItems, setInternalExpandedItems] = useState<
    Set<TreeViewItemId>
  >(() => new Set(defaultExpandedItems || []))

  const expandedItems = useMemo(() => {
    if (isControlled) {
      return new Set(expandedItemsProp || [])
    }
    return internalExpandedItems
  }, [isControlled, expandedItemsProp, internalExpandedItems])

  const setExpandedItems = useCallback(
    (
      newExpansion: Set<TreeViewItemId>,
      event: React.SyntheticEvent,
      changedItemId?: TreeViewItemId,
      isExpanded?: boolean
    ) => {
      if (!isControlled) {
        setInternalExpandedItems(newExpansion)
      }

      const expansionArray = Array.from(newExpansion)
      onExpandedItemsChange?.(event, expansionArray)

      if (changedItemId !== undefined && isExpanded !== undefined) {
        onItemExpansionToggle?.(event, changedItemId, isExpanded)
      }
    },
    [isControlled, onExpandedItemsChange, onItemExpansionToggle]
  )

  const toggleItemExpansion = useCallback(
    (event: React.SyntheticEvent, itemId: TreeViewItemId) => {
      const newExpansion = new Set(expandedItems)
      const wasExpanded = newExpansion.has(itemId)

      if (wasExpanded) {
        newExpansion.delete(itemId)
      } else {
        newExpansion.add(itemId)
      }

      setExpandedItems(newExpansion, event, itemId, !wasExpanded)
    },
    [expandedItems, setExpandedItems]
  )

  return {
    expandedItems,
    setExpandedItems,
    toggleItemExpansion,
  }
}

// --------------------------------------------------------------------------
// DYNAMIC (CALLER-OVERRIDE) STYLE HELPERS
// Visual parity for the theme variants now lives in TreeView.module.css via
// data-theme. These helpers carry ONLY the genuinely-dynamic, caller-supplied
// overrides (styles?.width, custom colors, margins) plus runtime-scalar values
// passed as CSS custom properties — exactly the recipe's kept-in-JS surface.
// --------------------------------------------------------------------------

/** Caller-supplied container overrides → inline style object (root <div>). */
const buildContainerOverrideStyle = (styles: TreeViewStyles): CSSProperties => {
  const overrides: CSSProperties = {}
  if (styles.backgroundColor) overrides.backgroundColor = styles.backgroundColor
  if (styles.borderColor) overrides.borderColor = styles.borderColor
  if (styles.borderRadius) overrides.borderRadius = styles.borderRadius
  if (styles.borderWidth) overrides.borderWidth = styles.borderWidth
  if (styles.boxShadow) overrides.boxShadow = styles.boxShadow
  if (styles.backdropFilter) overrides.backdropFilter = styles.backdropFilter
  if (styles.backgroundImage) overrides.backgroundImage = styles.backgroundImage
  if (styles.color) overrides.color = styles.color
  if (styles.fontFamily) overrides.fontFamily = styles.fontFamily
  if (styles.fontSize) overrides.fontSize = styles.fontSize
  if (styles.lineHeight !== undefined) overrides.lineHeight = styles.lineHeight
  if (styles.padding) overrides.padding = styles.padding
  if (styles.width) overrides.width = styles.width
  if (styles.minWidth) overrides.minWidth = styles.minWidth
  if (styles.maxWidth) overrides.maxWidth = styles.maxWidth
  if (styles.height) overrides.height = styles.height
  if (styles.minHeight) overrides.minHeight = styles.minHeight
  if (styles.maxHeight) overrides.maxHeight = styles.maxHeight
  if (styles.margin) overrides.margin = styles.margin
  if (styles.marginTop) overrides.marginTop = styles.marginTop
  if (styles.marginBottom) overrides.marginBottom = styles.marginBottom
  if (styles.marginLeft) overrides.marginLeft = styles.marginLeft
  if (styles.marginRight) overrides.marginRight = styles.marginRight
  if (styles.transitionDuration)
    overrides.transitionDuration = styles.transitionDuration
  if (styles.transitionEasing)
    overrides.transitionTimingFunction = styles.transitionEasing
  if (styles.disabled) {
    overrides.opacity = 0.6
    overrides.pointerEvents = 'none'
  }
  return overrides
}

/** Per-item interaction/selection state, used to pick the caller overrides. */
interface TreeItemStateFlags {
  isHovered: boolean
  isSelected: boolean
  isExpanded: boolean
  isFocused: boolean
  isDisabled: boolean
}

/**
 * Caller-supplied item overrides → inline style object (tree item <div>).
 * Base overrides apply first; the per-state overrides then win following the
 * same cascade the CSS module encodes (disabled > selected > expanded >
 * hover), with the focused overrides layered last — mirroring the pre-CSS-
 * module JS state resolution.
 */
const buildItemOverrideStyle = (
  styles: TreeViewStyles,
  totalIndent: number,
  state: TreeItemStateFlags
): CSSProperties => {
  // The level-based indent is a runtime-measured scalar → CSS custom property.
  const overrides: CSSProperties = {
    ['--tree-item-indent' as string]: `${totalIndent}px`,
  }
  if (styles.itemBackgroundColor)
    overrides.backgroundColor = styles.itemBackgroundColor
  if (styles.itemBorderColor) overrides.borderColor = styles.itemBorderColor
  if (styles.itemBorderRadius) overrides.borderRadius = styles.itemBorderRadius
  if (styles.itemColor) overrides.color = styles.itemColor
  if (styles.itemFontFamily) overrides.fontFamily = styles.itemFontFamily
  if (styles.itemFontSize) overrides.fontSize = styles.itemFontSize
  if (styles.itemFontWeight) overrides.fontWeight = styles.itemFontWeight
  if (styles.itemLetterSpacing)
    overrides.letterSpacing = styles.itemLetterSpacing
  if (styles.itemTextShadow) overrides.textShadow = styles.itemTextShadow
  if (styles.itemPadding) overrides.padding = styles.itemPadding
  if (styles.itemMinHeight) overrides.minHeight = styles.itemMinHeight
  if (styles.itemMargin) overrides.margin = styles.itemMargin

  // Per-state caller overrides — applied inline so they win over the CSS-
  // module state rules, exactly like the base overrides above. The else-if
  // chain mirrors the CSS :not() guards (hover never paints over a
  // selected/expanded/disabled row).
  if (state.isDisabled) {
    if (styles.itemDisabledBackgroundColor)
      overrides.backgroundColor = styles.itemDisabledBackgroundColor
    if (styles.itemDisabledColor) overrides.color = styles.itemDisabledColor
    if (styles.itemDisabledOpacity !== undefined)
      overrides.opacity = styles.itemDisabledOpacity
    if (styles.itemDisabledBorderColor)
      overrides.borderColor = styles.itemDisabledBorderColor
  } else if (state.isSelected) {
    if (styles.itemSelectedBackgroundColor)
      overrides.backgroundColor = styles.itemSelectedBackgroundColor
    if (styles.itemSelectedBorderColor)
      overrides.borderColor = styles.itemSelectedBorderColor
    if (styles.itemSelectedColor) overrides.color = styles.itemSelectedColor
    if (styles.itemSelectedFontWeight)
      overrides.fontWeight = styles.itemSelectedFontWeight
    if (styles.itemSelectedTextShadow)
      overrides.textShadow = styles.itemSelectedTextShadow
    if (styles.itemSelectedBoxShadow)
      overrides.boxShadow = styles.itemSelectedBoxShadow
    if (styles.itemSelectedBackgroundImage)
      overrides.backgroundImage = styles.itemSelectedBackgroundImage
  } else if (state.isExpanded) {
    if (styles.itemExpandedBackgroundColor)
      overrides.backgroundColor = styles.itemExpandedBackgroundColor
    if (styles.itemExpandedBorderColor)
      overrides.borderColor = styles.itemExpandedBorderColor
    if (styles.itemExpandedColor) overrides.color = styles.itemExpandedColor
    if (styles.itemExpandedFontWeight)
      overrides.fontWeight = styles.itemExpandedFontWeight
    if (styles.itemExpandedTextShadow)
      overrides.textShadow = styles.itemExpandedTextShadow
  } else if (state.isHovered) {
    if (styles.itemHoverBackgroundColor)
      overrides.backgroundColor = styles.itemHoverBackgroundColor
    if (styles.itemHoverBorderColor)
      overrides.borderColor = styles.itemHoverBorderColor
    if (styles.itemHoverColor) overrides.color = styles.itemHoverColor
    if (styles.itemHoverTransform)
      overrides.transform = styles.itemHoverTransform
    if (styles.itemHoverTextShadow)
      overrides.textShadow = styles.itemHoverTextShadow
    if (styles.itemHoverBoxShadow)
      overrides.boxShadow = styles.itemHoverBoxShadow
  }

  // Focus overrides layer on top of whatever state won above (the old JS
  // applied focus unconditionally after the state cascade).
  if (state.isFocused) {
    if (styles.itemFocusedOutline) overrides.outline = styles.itemFocusedOutline
    if (styles.itemFocusedOutlineOffset)
      overrides.outlineOffset = styles.itemFocusedOutlineOffset
    if (styles.itemFocusedBoxShadow)
      overrides.boxShadow = styles.itemFocusedBoxShadow
    if (styles.itemFocusedBackgroundColor)
      overrides.backgroundColor = styles.itemFocusedBackgroundColor
  }

  return overrides
}

/**
 * Caller-supplied children-group overrides → inline style object (the
 * recursive children wrapper). The top-level `itemChildrenIndentation` prop
 * rides along as the --tree-children-indent custom property;
 * `styles.contentPaddingLeft` wins over it when both are supplied (inline
 * padding-left beats the CSS var the class rule reads).
 */
const buildChildrenGroupOverrideStyle = (
  styles: TreeViewStyles,
  itemChildrenIndentation: string | number
): CSSProperties => {
  const overrides: CSSProperties = {
    // Caller-supplied indentation is a dynamic scalar → CSS var.
    // Match React's number→px coercion for the bare-number case.
    ['--tree-children-indent' as string]:
      typeof itemChildrenIndentation === 'number'
        ? `${itemChildrenIndentation}px`
        : itemChildrenIndentation,
  }
  if (styles.contentPaddingLeft)
    overrides.paddingLeft = styles.contentPaddingLeft
  if (styles.contentBorderLeft) overrides.borderLeft = styles.contentBorderLeft
  if (styles.contentMarginLeft) overrides.marginLeft = styles.contentMarginLeft
  return overrides
}

/** Caller-supplied icon-container overrides → inline style object. */
const buildIconContainerOverrideStyle = (
  styles: TreeViewStyles
): CSSProperties => {
  const overrides: CSSProperties = {}
  if (styles.iconContainerWidth) overrides.width = styles.iconContainerWidth
  if (styles.iconContainerHeight) overrides.height = styles.iconContainerHeight
  if (styles.iconContainerMarginRight)
    overrides.marginRight = styles.iconContainerMarginRight
  return overrides
}

/** Caller-supplied checkbox overrides → inline style object. */
const buildCheckboxOverrideStyle = (styles: TreeViewStyles): CSSProperties => {
  const overrides: CSSProperties = {}
  if (styles.checkboxWidth) overrides.width = styles.checkboxWidth
  if (styles.checkboxHeight) overrides.height = styles.checkboxHeight
  if (styles.checkboxMarginRight)
    overrides.marginRight = styles.checkboxMarginRight
  if (styles.checkboxAccentColor)
    overrides.accentColor = styles.checkboxAccentColor
  if (styles.checkboxBorderRadius)
    overrides.borderRadius = styles.checkboxBorderRadius
  if (styles.checkboxBorder) overrides.border = styles.checkboxBorder
  if (styles.checkboxBackground)
    overrides.backgroundColor = styles.checkboxBackground
  return overrides
}

/** Caller-supplied label overrides → inline style object. */
const buildLabelOverrideStyle = (styles: TreeViewStyles): CSSProperties => {
  const overrides: CSSProperties = {}
  if (styles.labelFontSize) overrides.fontSize = styles.labelFontSize
  if (styles.labelFontWeight) overrides.fontWeight = styles.labelFontWeight
  if (styles.labelColor) overrides.color = styles.labelColor
  if (styles.labelTextShadow) overrides.textShadow = styles.labelTextShadow
  return overrides
}

/**
 * Expand/collapse icon style — STAYS IN JS.
 * The icon is the <ExpandMore> component, which applies the `style` prop
 * inline on its inner <svg>; inline styles win over any CSS-module class, so
 * the rotation / color / filter for the expanded vs collapsed states must be
 * computed here and passed through `style`. Values transcribed exactly from
 * treeViewThemes[*].{expandIcon,expandIconExpanded,itemDisabled}.
 */
const buildExpandIconStyle = (
  theme: 'light' | 'dark' | 'sacred',
  isExpanded: boolean,
  isDisabled: boolean,
  isHovered: boolean,
  styles: TreeViewStyles
): CSSProperties => {
  // Base expandIcon per theme
  const base: CSSProperties =
    theme === 'sacred'
      ? {
          color: 'rgba(255, 215, 0, 0.7)',
          fontSize: '16px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
          opacity: 1,
        }
      : theme === 'dark'
        ? {
            color: 'rgb(156, 163, 175)',
            fontSize: '16px',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 1,
          }
        : {
            color: 'rgb(107, 114, 128)',
            fontSize: '16px',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 1,
          }

  let resolved: CSSProperties = { ...base }

  if (isDisabled) {
    // theme.itemDisabled.color + opacity 0.5
    resolved.color =
      theme === 'sacred'
        ? 'rgba(255, 215, 0, 0.3)'
        : theme === 'dark'
          ? 'rgb(107, 114, 128)'
          : 'rgb(156, 163, 175)'
    resolved.opacity = 0.5
  } else if (isExpanded) {
    if (theme === 'sacred') {
      resolved = {
        ...resolved,
        transform: 'rotate(90deg) scale(1.1) translateX(2px)',
        color: 'rgba(255, 215, 0, 1)',
        filter:
          'drop-shadow(0 2px 6px rgba(255, 215, 0, 0.7)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
      }
    } else if (theme === 'dark') {
      resolved.transform = 'rotate(90deg)'
      resolved.color = 'rgb(52, 211, 153)'
    } else {
      resolved.transform = 'rotate(90deg)'
      resolved.color = 'rgb(16, 185, 129)'
    }
  } else if (isHovered) {
    // theme.expandIconHover — only the color/filter flourish is re-applied in
    // JS because <ExpandMore> writes these inline on its <svg> (so a CSS :hover
    // rule can never win). The hover transform is left to CSS. Values are the
    // exact treeViewThemes[*].expandIconHover color/filter.
    if (theme === 'sacred') {
      resolved.color = 'rgba(255, 215, 0, 1)'
      resolved.filter =
        'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))'
    } else if (theme === 'dark') {
      resolved.color = 'rgb(96, 165, 250)'
    } else {
      resolved.color = 'rgb(59, 130, 246)'
    }
  }

  // Caller overrides — generic first, then per-state (state-specific wins).
  // The disabled dimming is never overridden, matching the item cascade.
  if (styles.expandIconColor) resolved.color = styles.expandIconColor
  if (styles.expandIconFontSize) resolved.fontSize = styles.expandIconFontSize
  if (!isDisabled) {
    if (isExpanded) {
      if (styles.expandIconExpandedColor)
        resolved.color = styles.expandIconExpandedColor
      if (styles.expandIconExpandedTransform)
        resolved.transform = styles.expandIconExpandedTransform
    } else if (isHovered) {
      if (styles.expandIconHoverColor)
        resolved.color = styles.expandIconHoverColor
      // Row-level hover transform; set inline it wins over the CSS-module
      // .iconContainer:hover svg scale flourish.
      if (styles.expandIconHoverTransform)
        resolved.transform = styles.expandIconHoverTransform
    }
  }

  return resolved
}

// --------------------------------------------------------------------------
// SACRED DECORATIONS
// --------------------------------------------------------------------------

const SacredBackground: FC<{
  width: number
  height: number
  /** Particle fill + glow color (styles.sacredBackgroundGlyphColor). */
  glyphColor?: string
}> = ({ width, height, glyphColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      glyph: string
      size: number
      opacity: number
      maxOpacity: number
    }> = []

    for (let i = 0; i < 8; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        glyph:
          SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)] ??
          SACRED_GLYPHS[0],
        size: 10 + Math.random() * 6,
        opacity: Math.random() * 0.15 + 0.05,
        maxOpacity: Math.random() * 0.2 + 0.1,
      })
    }

    let animationId: number
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.opacity =
          particle.maxOpacity *
          (0.5 + 0.5 * Math.sin(time * 0.001 + particle.x * 0.01))

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = glyphColor ?? '#FFD700'
        ctx.font = `${particle.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = glyphColor ?? 'rgba(255, 215, 0, 0.3)'
        ctx.shadowBlur = 2
        ctx.fillText(particle.glyph, particle.x, particle.y)
        ctx.restore()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate(0)

    return () => cancelAnimationFrame(animationId)
  }, [width, height, glyphColor])

  return <canvas ref={canvasRef} className={cssStyles.sacredBackground} />
}

// --------------------------------------------------------------------------
// TREE ITEM COMPONENT
// --------------------------------------------------------------------------

const TreeItem: FC<TreeItemProps> = ({
  item,
  level = 0,
  isSelected = false,
  isExpanded = false,
  isFocused = false,
  hasChildren = false,
  styles = {},
  onClick,
  onToggleExpansion,
  onToggleSelection,
  onFocus,
  checkboxSelection = false,
  expansionTrigger = 'content',
  disabledItemsFocusable = false,
}) => {
  const context = useTreeViewContext()
  const itemRef = useRef<HTMLDivElement>(null)

  // Whole-row hover state. The expand-icon's hover color/filter must be
  // computed in JS (ExpandMore writes its style inline on the <svg>, so a CSS
  // :hover rule cannot win) — this restores the old TreeItem isHovered → chevron
  // flourish triggered across the entire row.
  const [isHovered, setIsHovered] = useState(false)

  const itemId = context.getItemId(item)
  const label = context.getItemLabel(item)
  const isDisabled = context.isItemDisabled(item)
  const theme = styles.theme || 'light'

  // Level-based indentation is a runtime-derived scalar → CSS custom property.
  // Mirrors getTreeItemStyles(): baseIndent + level * incrementIndent.
  const baseIndent = styles.levelIndentBase || 16
  const incrementIndent = styles.levelIndentIncrement || 12
  const totalIndent = baseIndent + level * incrementIndent

  // Caller-supplied (genuinely dynamic) style overrides per slot. Variant +
  // state styling now lives in TreeView.module.css; these carry only the
  // styles?.itemX overrides plus the --tree-item-indent custom property.
  const itemOverrideStyle = useMemo(
    () =>
      buildItemOverrideStyle(styles, totalIndent, {
        isHovered,
        isSelected,
        isExpanded,
        isFocused,
        isDisabled,
      }),
    [
      styles,
      totalIndent,
      isHovered,
      isSelected,
      isExpanded,
      isFocused,
      isDisabled,
    ]
  )
  const iconContainerOverrideStyle = useMemo(
    () => buildIconContainerOverrideStyle(styles),
    [styles]
  )
  const checkboxOverrideStyle = useMemo(
    () => buildCheckboxOverrideStyle(styles),
    [styles]
  )
  const labelOverrideStyle = useMemo(
    () => buildLabelOverrideStyle(styles),
    [styles]
  )
  // Expand-icon style stays in JS (inline on <ExpandMore>'s svg).
  const expandIconStyle = useMemo(
    () =>
      buildExpandIconStyle(theme, isExpanded, isDisabled, isHovered, styles),
    [theme, isExpanded, isDisabled, isHovered, styles]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (isDisabled && !disabledItemsFocusable) return

      event.preventDefault()
      event.stopPropagation()

      // Focus the item
      context.setFocusedItem(itemId)
      onFocus?.(event as any, itemId)
      context.onItemFocus?.(event, itemId)

      // Handle selection
      if (!context.disableSelection && !isDisabled) {
        onToggleSelection?.(event, itemId)
        context.onToggleSelection(event, itemId)
      }

      // Handle expansion only when content triggers expansion
      if (hasChildren && expansionTrigger === 'content' && !isDisabled) {
        onToggleExpansion?.(event, itemId)
        context.onToggleExpansion(event, itemId)
      }

      // Call onClick callback
      onClick?.(event, itemId)
      context.onItemClick?.(event, itemId)
    },
    [
      isDisabled,
      disabledItemsFocusable,
      context,
      itemId,
      onFocus,
      onToggleSelection,
      onToggleExpansion,
      onClick,
      hasChildren,
      expansionTrigger,
    ]
  )

  const handleIconClick = useCallback(
    (event: React.MouseEvent) => {
      if (isDisabled) return

      event.preventDefault()
      event.stopPropagation()

      if (hasChildren && expansionTrigger === 'iconContainer') {
        onToggleExpansion?.(event, itemId)
        context.onToggleExpansion(event, itemId)
      }
    },
    [
      isDisabled,
      hasChildren,
      onToggleExpansion,
      context,
      itemId,
      expansionTrigger,
    ]
  )

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return

      event.stopPropagation()

      onToggleSelection?.(event, itemId)
      context.onToggleSelection(event, itemId)
    },
    [isDisabled, onToggleSelection, context, itemId]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isDisabled && !disabledItemsFocusable) return

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleClick(event as any)
          break
        case 'ArrowRight':
          if (hasChildren && !isExpanded) {
            event.preventDefault()
            onToggleExpansion?.(event, itemId)
            context.onToggleExpansion(event, itemId)
          }
          break
        case 'ArrowLeft':
          if (hasChildren && isExpanded) {
            event.preventDefault()
            onToggleExpansion?.(event, itemId)
            context.onToggleExpansion(event, itemId)
          }
          break
      }
    },
    [
      isDisabled,
      disabledItemsFocusable,
      handleClick,
      hasChildren,
      isExpanded,
      onToggleExpansion,
      context,
      itemId,
    ]
  )

  return (
    <div
      ref={itemRef}
      className={cssStyles.item}
      data-theme={theme}
      data-selected={isSelected ? 'true' : undefined}
      data-expanded={isExpanded ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-disabled={isDisabled ? 'true' : undefined}
      style={itemOverrideStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={isDisabled && !disabledItemsFocusable ? -1 : 0}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-disabled={isDisabled}
      aria-level={level + 1}
      data-testid={`tree-item-${itemId}`}
    >
      {/* Checkbox */}
      {checkboxSelection && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          disabled={isDisabled}
          className={cssStyles.checkbox}
          data-theme={theme}
          style={checkboxOverrideStyle}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Expand/Collapse Icon */}
      {hasChildren && (
        <div
          className={cssStyles.iconContainer}
          data-theme={theme}
          style={iconContainerOverrideStyle}
          onClick={handleIconClick}
          role="button"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ExpandMoreIcon
            styles={{ theme: styles.theme || 'sacred' }}
            style={expandIconStyle}
          />
        </div>
      )}

      {/* Label */}
      <div
        className={cssStyles.label}
        data-theme={theme}
        style={labelOverrideStyle}
      >
        {label}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN TREE VIEW COMPONENT
// --------------------------------------------------------------------------

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      items = [],
      getItemId = (item: TreeViewItem) => item.id,
      getItemLabel = (item: TreeViewItem) => item.label,
      getItemChildren = (item: TreeViewItem) => item.children,
      isItemDisabled = (item: TreeViewItem) => item.disabled || false,
      selectedItems: selectedItemsProp,
      defaultSelectedItems,
      expandedItems: expandedItemsProp,
      defaultExpandedItems,
      multiSelect = false,
      checkboxSelection = false,
      disableSelection = false,
      disabledItemsFocusable = false,
      selectionPropagation = { descendants: false, parents: false },
      expansionTrigger = 'content',
      itemChildrenIndentation = 24,
      onSelectedItemsChange,
      onItemSelectionToggle,
      onExpandedItemsChange,
      onItemExpansionToggle,
      onItemClick,
      onItemFocus,
      apiRef,
      styles = {},
      children,
      id,
      ...other
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerSize, setContainerSize] = useState({
      width: 280,
      height: 400,
    })
    const [focusedItem, setFocusedItem] = useState<TreeViewItemId | null>(null)
    const [disabledItems] = useState<Set<TreeViewItemId>>(new Set())
    const [isMounted, setIsMounted] = useState(false)

    // Set mounted state to ensure consistent rendering
    useEffect(() => {
      setIsMounted(true)
    }, [])

    // Selection and expansion state
    const { selectedItems, setSelectedItems, toggleItemSelection } =
      useTreeViewSelection(
        selectedItemsProp,
        defaultSelectedItems,
        multiSelect,
        onSelectedItemsChange,
        onItemSelectionToggle
      )

    const { expandedItems, setExpandedItems, toggleItemExpansion } =
      useTreeViewExpansion(
        expandedItemsProp,
        defaultExpandedItems,
        onExpandedItemsChange,
        onItemExpansionToggle
      )

    // Build item maps for efficient lookups
    const { itemMap, parentMap, childrenMap } = useMemo(() => {
      const itemMap = new Map<TreeViewItemId, TreeViewItem>()
      const parentMap = new Map<TreeViewItemId, TreeViewItemId>()
      const childrenMap = new Map<TreeViewItemId, TreeViewItemId[]>()

      const buildMaps = (items: TreeViewItem[], parentId?: TreeViewItemId) => {
        items.forEach(item => {
          const itemId = getItemId(item)
          itemMap.set(itemId, item)

          if (parentId) {
            parentMap.set(itemId, parentId)
          }

          const children = getItemChildren(item)
          if (children && children.length > 0) {
            const childIds = children.map(getItemId)
            childrenMap.set(itemId, childIds)
            buildMaps(children, itemId)
          }
        })
      }

      buildMaps(items)
      return { itemMap, parentMap, childrenMap }
    }, [items, getItemId, getItemChildren])

    // Container size tracking for sacred background
    useEffect(() => {
      const container = containerRef.current
      if (!container || styles.theme !== 'sacred') return

      const updateSize = () => {
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        })
      }

      const resizeObserver = new ResizeObserver(updateSize)
      resizeObserver.observe(container)
      updateSize()

      return () => resizeObserver.disconnect()
    }, [styles.theme])

    // Imperative API
    useImperativeHandle(
      apiRef,
      () => ({
        focusItem: (itemId: TreeViewItemId) => {
          setFocusedItem(itemId)
          const element = containerRef.current?.querySelector(
            `[data-testid="tree-item-${itemId}"]`
          ) as HTMLElement
          element?.focus()
        },
        getItem: (itemId: TreeViewItemId) => itemMap.get(itemId) || null,
        getItemDOMElement: (itemId: TreeViewItemId) =>
          (containerRef.current?.querySelector(
            `[data-testid="tree-item-${itemId}"]`
          ) as HTMLElement) || null,
        getItemOrderedChildrenIds: (itemId: TreeViewItemId) =>
          childrenMap.get(itemId) || [],
        getItemTree: () => items,
        getParentId: (itemId: TreeViewItemId) => parentMap.get(itemId) || null,
        setItemExpansion: ({
          itemId,
          isExpanded,
          event,
        }: {
          itemId: TreeViewItemId
          isExpanded?: boolean
          event?: React.SyntheticEvent
        }) => {
          const newExpansion = new Set(expandedItems)
          if (isExpanded === undefined) {
            // Toggle
            if (newExpansion.has(itemId)) {
              newExpansion.delete(itemId)
            } else {
              newExpansion.add(itemId)
            }
          } else if (isExpanded) {
            newExpansion.add(itemId)
          } else {
            newExpansion.delete(itemId)
          }
          const syntheticEvent = event || (new Event('programmatic') as any)
          setExpandedItems(
            newExpansion,
            syntheticEvent,
            itemId,
            newExpansion.has(itemId)
          )
        },
        setItemSelection: ({
          itemId,
          shouldBeSelected,
          keepExistingSelection,
          event,
        }: {
          itemId: TreeViewItemId
          shouldBeSelected?: boolean
          keepExistingSelection?: boolean
          event?: React.SyntheticEvent
        }) => {
          const newSelection = keepExistingSelection
            ? new Set(selectedItems)
            : new Set<TreeViewItemId>()

          if (shouldBeSelected === undefined) {
            // Toggle
            if (selectedItems.has(itemId)) {
              newSelection.delete(itemId)
            } else {
              newSelection.add(itemId)
            }
          } else if (shouldBeSelected) {
            newSelection.add(itemId)
          } else {
            newSelection.delete(itemId)
          }

          const syntheticEvent = event || (new Event('programmatic') as any)
          setSelectedItems(
            newSelection,
            syntheticEvent,
            itemId,
            newSelection.has(itemId)
          )
        },
        setIsItemDisabled: ({
          itemId,
          shouldBeDisabled,
        }: {
          itemId: TreeViewItemId
          shouldBeDisabled?: boolean
        }) => {
          if (shouldBeDisabled) {
            disabledItems.add(itemId)
          } else {
            disabledItems.delete(itemId)
          }
        },
      }),
      [
        itemMap,
        childrenMap,
        parentMap,
        items,
        expandedItems,
        selectedItems,
        setExpandedItems,
        setSelectedItems,
        disabledItems,
      ]
    )

    // Render tree recursively
    const renderTree = useCallback(
      (items: TreeViewItem[], level = 0): ReactNode => {
        return items.map(item => {
          const itemId = getItemId(item)
          const children = getItemChildren(item)
          const hasChildren = children && children.length > 0
          const isItemSelected = selectedItems.has(itemId)
          const isItemExpanded = expandedItems.has(itemId)
          const isItemFocused = focusedItem === itemId

          return (
            <React.Fragment key={itemId}>
              <TreeItem
                item={item}
                level={level}
                isSelected={isItemSelected}
                isExpanded={isItemExpanded}
                isFocused={isItemFocused}
                hasChildren={hasChildren}
                styles={styles}
                checkboxSelection={checkboxSelection}
                multiSelect={multiSelect}
                expansionTrigger={expansionTrigger}
                disabledItemsFocusable={disabledItemsFocusable}
                onToggleSelection={toggleItemSelection}
                onToggleExpansion={toggleItemExpansion}
                onFocus={(event, itemId) => {
                  setFocusedItem(itemId)
                  onItemFocus?.(event, itemId)
                }}
                onClick={onItemClick}
              />
              {hasChildren && isItemExpanded && (
                <div
                  className={cssStyles.childrenGroup}
                  data-theme={styles.theme || 'light'}
                  style={buildChildrenGroupOverrideStyle(
                    styles,
                    itemChildrenIndentation
                  )}
                >
                  {renderTree(children, level + 1)}
                </div>
              )}
            </React.Fragment>
          )
        })
      },
      [
        getItemId,
        getItemChildren,
        selectedItems,
        expandedItems,
        focusedItem,
        styles,
        checkboxSelection,
        multiSelect,
        expansionTrigger,
        disabledItemsFocusable,
        toggleItemSelection,
        toggleItemExpansion,
        onItemFocus,
        onItemClick,
        itemChildrenIndentation,
      ]
    )

    const contextValue: TreeViewContextValue = useMemo(
      () => ({
        selectedItems,
        expandedItems,
        focusedItem,
        disabledItems,
        itemMap,
        parentMap,
        childrenMap,
        multiSelect,
        checkboxSelection,
        disableSelection,
        disabledItemsFocusable,
        selectionPropagation,
        expansionTrigger,
        styles,
        getItemId,
        getItemLabel,
        getItemChildren,
        isItemDisabled,
        onItemClick,
        onItemFocus,
        onToggleExpansion: toggleItemExpansion,
        onToggleSelection: toggleItemSelection,
        setFocusedItem,
        apiRef,
      }),
      [
        selectedItems,
        expandedItems,
        focusedItem,
        disabledItems,
        itemMap,
        parentMap,
        childrenMap,
        multiSelect,
        checkboxSelection,
        disableSelection,
        disabledItemsFocusable,
        selectionPropagation,
        expansionTrigger,
        styles,
        getItemId,
        getItemLabel,
        getItemChildren,
        isItemDisabled,
        onItemClick,
        onItemFocus,
        toggleItemExpansion,
        toggleItemSelection,
        setFocusedItem,
        apiRef,
      ]
    )

    return (
      <TreeViewContext.Provider value={contextValue}>
        <div
          ref={ref || containerRef}
          className={cssStyles.root}
          data-theme={styles.theme || 'light'}
          style={buildContainerOverrideStyle(styles)}
          role="tree"
          aria-multiselectable={multiSelect}
          tabIndex={0}
          id={id}
          {...other}
        >
          {/* Sacred background - only render after mount to prevent hydration issues */}
          {styles.theme === 'sacred' && isMounted && (
            <SacredBackground
              width={containerSize.width}
              height={containerSize.height}
              glyphColor={styles.sacredBackgroundGlyphColor}
            />
          )}

          {/* Tree content */}
          <div className={cssStyles.content}>
            {children || renderTree(items)}
          </div>
        </div>
      </TreeViewContext.Provider>
    )
  }
)

TreeView.displayName = 'TreeView'

// --------------------------------------------------------------------------
// EXPORTS
// --------------------------------------------------------------------------

export default TreeView
export { TreeView, TreeItem, useTreeViewContext, useTreeViewApiRef }

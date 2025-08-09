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
} from 'react'
import type { ReactNode, FC } from 'react'
import { getTreeViewStyles, SACRED_GLYPHS } from '../../theme'
import type { TreeViewStyles } from '../../theme'
import ExpandMoreIcon from '../Icons/ExpandMore'

// --------------------------------------------------------------------------
// TYPES AND INTERFACES
// --------------------------------------------------------------------------

export type TreeViewItemId = string

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
// SACRED DECORATIONS
// --------------------------------------------------------------------------

const SacredBackground: FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
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
          SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)] ?? '',
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
        ctx.fillStyle = '#FFD700'
        ctx.font = `${particle.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(255, 215, 0, 0.3)'
        ctx.shadowBlur = 2
        ctx.fillText(particle.glyph, particle.x, particle.y)
        ctx.restore()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate(0)

    return () => cancelAnimationFrame(animationId)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
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
  const [isHovered, setIsHovered] = useState(false)
  const [backgroundGlyph, setBackgroundGlyph] = useState(SACRED_GLYPHS[0])
  const [isHydrated, setIsHydrated] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  const itemId = context.getItemId(item)
  const label = context.getItemLabel(item)
  const isDisabled = context.isItemDisabled(item)
  const isSacredTheme = styles.theme === 'sacred'

  // Set random background glyph only on client side after hydration
  useEffect(() => {
    if (!isHydrated && isSacredTheme) {
      setBackgroundGlyph(SACRED_GLYPHS[Math.floor(Math.random() * 5)])
      setIsHydrated(true)
    }
  }, [isHydrated, isSacredTheme])

  // Get computed styles
  const itemStyles = useMemo(() => {
    return getTreeItemStyles(
      styles,
      isHovered,
      isSelected,
      isExpanded,
      isFocused,
      isDisabled,
      level
    )
  }, [styles, isHovered, isSelected, isExpanded, isFocused, isDisabled, level])

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

  // Sacred theme decorations
  const sacredDecorations = isSacredTheme && (
    <>
      {/* Background glyph */}
      {styles.theme === 'sacred' && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: 'rgba(255, 215, 0, 0.2)',
            fontSize: '12px',
            animation: 'sacredFloat 3s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {backgroundGlyph}
        </div>
      )}

      {/* Hover glyphs */}
      {(isHovered || isSelected) && (
        <>
          <div
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.4)',
              fontSize: '14px',
              animation: isSelected
                ? 'sacredGlyphRotate 20s linear infinite'
                : undefined,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[3]}
          </div>
          <div
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 215, 0, 0.4)',
              fontSize: '14px',
              animation: isSelected
                ? 'sacredGlyphRotate 20s linear infinite'
                : undefined,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[7]}
          </div>
        </>
      )}
    </>
  )

  return (
    <div
      ref={itemRef}
      style={itemStyles.item}
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
      {sacredDecorations}

      {/* Checkbox */}
      {checkboxSelection && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          disabled={isDisabled}
          style={itemStyles.checkbox}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {/* Expand/Collapse Icon */}
      {hasChildren && (
        <div
          style={itemStyles.iconContainer}
          onClick={handleIconClick}
          role="button"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ExpandMoreIcon
            styles={{ theme: styles.theme || 'sacred' }}
            style={itemStyles.expandIcon}
          />
        </div>
      )}

      {/* Label */}
      <div style={itemStyles.label}>{label}</div>
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
                  style={{
                    paddingLeft: itemChildrenIndentation,
                    borderLeft:
                      styles.theme === 'sacred'
                        ? '2px solid rgba(255, 215, 0, 0.3)'
                        : '1px solid rgba(229, 231, 235, 0.5)',
                    marginLeft: '12px',
                    position: 'relative',
                    overflow: 'visible',
                  }}
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
          style={getTreeViewStyles(styles)}
          role="tree"
          aria-multiselectable={multiSelect}
          tabIndex={0}
          id={id}
          {...other}
        >
          {/* Sacred background */}
          {styles.theme === 'sacred' && (
            <SacredBackground
              width={containerSize.width}
              height={containerSize.height}
            />
          )}

          {/* Tree content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
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

// Helper function to get tree item styles (referenced in theme file)
import { getTreeItemStyles } from '../../theme/treeview'

export default TreeView
export {
  TreeView,
  TreeItem,
  useTreeViewContext,
  useTreeViewApiRef,
  getTreeItemStyles,
}

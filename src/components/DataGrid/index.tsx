/**
 * =============================================================================
 * DATAGRID - MAIN ORCHESTRATOR COMPONENT
 * =============================================================================
 *
 * This is the primary entry point for the DataGrid component system.
 * It orchestrates all child components and manages the central state.
 *
 * COMPONENT HIERARCHY:
 * --------------------
 * DataGrid (this file)
 *   │
 *   ├── ColumnVisibilityProvider     <- Context for column visibility state
 *   │
 *   └── DataGridContent              <- Main content component
 *         │
 *         ├── MobileCardView         <- Responsive card layout (< 768px)
 *         │
 *         └── Desktop View:
 *               ├── MetricSection    <- KPI cards (optional)
 *               ├── FilterSection    <- Search + filters
 *               ├── DataGridToolbar  <- Buttons + ManageRow actions
 *               ├── Table            <- Column headers + data rows
 *               ├── CustomFooter     <- Pagination + export
 *               ├── ManageColumnsSimple <- Column visibility modal
 *               └── Snackbar         <- Validation error messages
 *
 * STATE MANAGEMENT:
 * -----------------
 * This component manages several categories of state:
 *
 * 1. DATA STATE:
 *    - rows: Internal row data (synced from props)
 *    - filteredRows: Rows after search/filter applied
 *    - selectedRows: Array of selected row IDs
 *
 * 2. COLUMN STATE:
 *    - columnOrder: Order of columns (for drag-drop reordering)
 *    - columnWidths: Custom widths (from resize operations)
 *    - hiddenColumns: Set of hidden column field names
 *    - draggedColumn: Currently dragged column (for reorder)
 *
 * 3. EDITING STATE:
 *    - editingCell: { rowId, field } or null
 *    - editingValue: Current value in edit input
 *    - isCreatingRow: Whether creation row is visible
 *    - creationRowData: Values in creation form
 *
 * 4. PAGINATION STATE:
 *    - page: Current page index (0-based)
 *    - pageSize: Rows per page
 *
 * 5. UI STATE:
 *    - showManageColumns: Modal visibility
 *    - snackbarOpen/Message: Validation error display
 *
 * KEY DATA FLOWS:
 * ---------------
 * 1. Parent passes rows -> DataGrid syncs to internal state
 * 2. User types in search -> FilterSection filters rows -> filteredRows updated
 * 3. User clicks row -> selectedRows updated -> onSelectionChange callback
 * 4. User edits cell -> editingCell/editingValue updated -> onCellSave callback
 * 5. User creates row -> creationRowData built -> onRowCreation callback
 *
 * RESPONSIVE BEHAVIOR:
 * --------------------
 * - Desktop (>= 768px): Full table with columns, pagination, toolbar
 * - Mobile (< 768px): Card-based layout via MobileCardView
 * - CSS media queries control which view is visible
 *
 * PDF EXPORT:
 * -----------
 * - Default export captures the rendered table as image using html2canvas
 * - Custom export can be provided via onExportPdf prop
 * - exportContainerRef stores reference for the capture
 *
 * =============================================================================
 */

'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import DataGridToolbar from './Toolbar/index'
import Table from './Table'
import CustomFooter from './Footer'
import FilterSection from './FilterSection'
import MetricSection from './MetricSection'
import ManageColumnsSimple from './ManageColumnsSimple'
import MobileCardView from './MobileCardView'
import Snackbar from '../Snackbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { useAutoRowHeight } from './utils/useAutoRowHeight'
import { areRowsEqual } from './utils/rowComparison'
import type { DatagridProps, RowData, ColumnDef } from './types'
import { ColumnVisibilityProvider } from './context/ColumnVisibilityContext'
import cssStyles from './DataGrid.module.css'

/**
 * Module-level ref to the DataGrid container element.
 * Used by defaultExportToPdf to capture the rendered table.
 * Set by DataGridContent via useEffect when component mounts.
 */
let exportContainerRef: HTMLDivElement | null = null

/**
 * DEFAULT PDF EXPORT HANDLER
 * --------------------------
 * Creates a PDF from the rendered DataGrid using html2canvas and jsPDF.
 *
 * HOW IT WORKS:
 * 1. Gets the container element via exportContainerRef
 * 2. Temporarily expands all scrollable elements to show full content
 * 3. Captures the element as a canvas using html2canvas
 * 4. Creates a PDF with dimensions matching the captured content
 * 5. Restores original styles and triggers download
 *
 * NOTE: The columns and rows parameters are included in the signature for
 * API consistency with custom export handlers, but this default implementation
 * captures the rendered DOM directly to preserve exact visual styling.
 *
 * @param columns - Column definitions (unused in default - for API consistency)
 * @param rows - Row data (unused in default - for API consistency)
 */
const defaultExportToPdf = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columns: ColumnDef[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rows: RowData[]
): Promise<void> => {
  // Get the container element
  const container = exportContainerRef
  if (!container) {
    console.error('DataGrid container not found for PDF export')
    return
  }

  // Dynamically import html2canvas and jsPDF to avoid bundling if not used
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  // Store original styles to restore after capture
  const originalStyles: Map<
    HTMLElement,
    { overflow: string; width: string; maxWidth: string; position: string }
  > = new Map()

  try {
    // Find all scrollable elements and expand them to show full content
    const scrollableElements = container.querySelectorAll<HTMLElement>('*')
    scrollableElements.forEach(el => {
      const style = window.getComputedStyle(el)
      if (
        style.overflow === 'auto' ||
        style.overflow === 'scroll' ||
        style.overflowX === 'auto' ||
        style.overflowX === 'scroll' ||
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll'
      ) {
        originalStyles.set(el, {
          overflow: el.style.overflow,
          width: el.style.width,
          maxWidth: el.style.maxWidth,
          position: el.style.position,
        })
        el.style.overflow = 'visible'
        el.style.width = 'auto'
        el.style.maxWidth = 'none'
      }
    })

    // Also expand the container itself
    originalStyles.set(container, {
      overflow: container.style.overflow,
      width: container.style.width,
      maxWidth: container.style.maxWidth,
      position: container.style.position,
    })
    container.style.overflow = 'visible'
    container.style.width = 'auto'
    container.style.maxWidth = 'none'

    // Get the full scroll dimensions
    const fullWidth = Math.max(container.scrollWidth, container.offsetWidth)
    const fullHeight = Math.max(container.scrollHeight, container.offsetHeight)

    // Capture the actual DataGrid as canvas, preserving its exact appearance
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      // Use null to capture the actual background
      backgroundColor: null,
      // Capture the full dimensions
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
    })

    // Calculate PDF dimensions
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait'

    // Create PDF with dimensions matching the captured image
    const pdf = new jsPDF({
      orientation: orientation as 'portrait' | 'landscape',
      unit: 'px',
      format: [imgWidth + 40, imgHeight + 40],
    })

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight)

    // Download the PDF
    pdf.save('datagrid-export.pdf')
  } catch (error) {
    console.error('Error exporting DataGrid to PDF:', error)
    throw error
  } finally {
    // Restore original styles
    originalStyles.forEach((styles, el) => {
      el.style.overflow = styles.overflow
      el.style.width = styles.width
      el.style.maxWidth = styles.maxWidth
      el.style.position = styles.position
    })
  }
}

/**
 * DATAGRID CONTENT COMPONENT
 * --------------------------
 * The main content component that renders the entire DataGrid UI.
 * Wrapped by DataGrid which provides the ColumnVisibilityProvider context.
 *
 * This component is responsible for:
 * - Managing all internal state (selection, editing, pagination, etc.)
 * - Coordinating between child components
 * - Handling user interactions and triggering callbacks
 * - Responsive rendering (mobile vs desktop views)
 */
function DataGridContent({
  columns,
  rows: providedRows,
  buttons,
  error = null,
  permissions,
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  onSelectionChange,
  onColumnResize,
  onCellSave,
  onRowCreation,
  showIdColumns = false,
  filters,
  metrics,
  metricsCollapsible = true,
  metricsDefaultExpanded = false,
  filtersCollapsible = true,
  filtersDefaultExpanded = false,
  onExportPdf,
  styles,
  dataGrid,
}: DatagridProps) {
  // ═══════════════════════════════════════════════════════════════════════════
  // REFS AND THEME
  // ═══════════════════════════════════════════════════════════════════════════

  /** Reference to the main container div, used for PDF export capture */
  const containerRef = useRef<HTMLDivElement>(null)

  /** Current theme - defaults to 'sacred' to prevent flash of unstyled content */
  const theme = styles?.theme || 'sacred'

  /**
   * Sync the module-level exportContainerRef when component mounts.
   * This allows defaultExportToPdf to access the container element.
   */
  useEffect(() => {
    exportContainerRef = containerRef.current
    return () => {
      exportContainerRef = null
    }
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // COLUMN STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  // Columns go through a processing pipeline:
  // 1. filteredColumns - Remove id/_id if showIdColumns=false
  // 2. orderedColumns - Apply user's drag-drop ordering
  // 3. columnsWithWidths - Apply custom resize widths
  // 4. visibleColumns - Remove hidden columns
  // ═══════════════════════════════════════════════════════════════════════════

  /** Field name of column currently being dragged for reordering */
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)

  /** Array of field names representing current column order */
  const [columnOrder, setColumnOrder] = useState<string[]>([])

  /** Set of field names that are currently hidden */
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())

  /** Whether the "Manage Columns" modal is visible */
  const [showManageColumns, setShowManageColumns] = useState(false)

  /**
   * STEP 1: Filter out id/_id columns unless explicitly shown.
   * Most UIs don't need to show database IDs to users.
   */
  const filteredColumns = useMemo(() => {
    if (showIdColumns) return columns
    return columns.filter(col => col.field !== 'id' && col.field !== '_id')
  }, [columns, showIdColumns])

  /**
   * Initialize column order on first render.
   * Uses derived state pattern - safe to call setState during render
   * when it doesn't cause infinite loops (empty -> populated).
   */
  if (filteredColumns.length > 0 && columnOrder.length === 0) {
    setColumnOrder(filteredColumns.map(col => col.field))
  }

  /**
   * STEP 2: Reorder columns based on user's drag-drop ordering.
   * Also handles adding new columns that weren't in the saved order.
   */
  const orderedColumns = useMemo(() => {
    if (columnOrder.length === 0) return filteredColumns

    // Map order to actual column definitions
    const ordered = columnOrder
      .map(fieldName => filteredColumns.find(col => col.field === fieldName))
      .filter(Boolean) as typeof filteredColumns

    // Append any new columns not yet in the order (e.g., dynamically added)
    const existingFields = new Set(columnOrder)
    const newColumns = filteredColumns.filter(
      col => !existingFields.has(col.field)
    )

    return [...ordered, ...newColumns]
  }, [filteredColumns, columnOrder])

  /** Map of field name -> custom width (pixels) from resize operations */
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  /**
   * STEP 3: Merge custom widths into column definitions.
   * Preserves both width and computedWidth for rendering.
   */
  const columnsWithWidths = useMemo(() => {
    return orderedColumns.map(col => {
      const mappedWidth = columnWidths[col.field] ?? col.width
      const mappedComputedWidth =
        columnWidths[col.field] ?? col.computedWidth ?? col.width

      return {
        ...col,
        ...(mappedWidth !== undefined ? { width: mappedWidth } : {}),
        ...(mappedComputedWidth !== undefined
          ? { computedWidth: mappedComputedWidth }
          : {}),
      }
    })
  }, [orderedColumns, columnWidths])

  /**
   * STEP 4: Filter out hidden columns.
   * This is the final column list passed to Table component.
   */
  const visibleColumns = useMemo(() => {
    return columnsWithWidths.filter(col => !hiddenColumns.has(col.field))
  }, [columnsWithWidths, hiddenColumns])

  /**
   * Handle column resize from drag operations.
   * Updates internal state and notifies parent via callback.
   */
  const handleColumnResize = useCallback(
    (columnField: string, newWidth: number) => {
      setColumnWidths(prev => ({
        ...prev,
        [columnField]: newWidth,
      }))

      // Notify parent for persistence if callback provided
      if (onColumnResize) {
        onColumnResize(columnField, newWidth)
      }
    },
    [onColumnResize]
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // ROW DATA STATE
  // ═══════════════════════════════════════════════════════════════════════════
  // Two row arrays are maintained:
  // - rows: The complete dataset (synced from props)
  // - filteredRows: After search/filter applied (what's actually displayed)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Ref to track previous props for comparison (prevents unnecessary syncs) */
  const prevProvidedRowsRef = useRef<RowData[] | undefined>(undefined)

  /** Complete row data (internal copy of props) */
  const [rows, setRows] = useState<RowData[]>(() => providedRows || [])

  /**
   * Filtered/searched rows - this is what gets displayed.
   * Updated by FilterSection when user types in search or changes filters.
   */
  const [filteredRows, setFilteredRows] = useState<RowData[]>(
    () => providedRows || []
  )

  /**
   * Cache original metrics on mount to prevent them from changing
   * when data is filtered (metrics show overall stats, not filtered stats).
   */
  const [originalMetrics] = useState(() => metrics)

  /** Array of currently selected row IDs */
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGINATION STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Current page index (0-based) */
  const [page, setPage] = useState(0)

  // ═══════════════════════════════════════════════════════════════════════════
  // INLINE EDITING STATE
  // ═══════════════════════════════════════════════════════════════════════════
  // When user clicks a cell in a selected row, these track the edit session.
  // ═══════════════════════════════════════════════════════════════════════════

  /** Currently editing cell { rowId, field } or null if not editing */
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    field: string
  } | null>(null)

  /** Current value in the editing input field */
  const [editingValue, setEditingValue] = useState<string>('')

  // ═══════════════════════════════════════════════════════════════════════════
  // ROW CREATION STATE
  // ═══════════════════════════════════════════════════════════════════════════
  // When onRowCreation prop is provided, user can add new rows inline.
  // ═══════════════════════════════════════════════════════════════════════════

  /** Whether the creation row form is currently visible */
  const [isCreatingRow, setIsCreatingRow] = useState(false)

  /** Current field values in the creation form */
  const [creationRowData, setCreationRowData] = useState<
    Record<string, unknown>
  >({})

  /** Validation errors for creation fields (field -> error message) */
  const [, setCreationRowErrors] = useState<Record<string, string>>({})

  // ═══════════════════════════════════════════════════════════════════════════
  // UI FEEDBACK STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Whether validation error snackbar is visible */
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  /** Message to display in snackbar */
  const [snackbarMessage, setSnackbarMessage] = useState('')

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO PAGE SIZE CALCULATION
  // ═══════════════════════════════════════════════════════════════════════════
  // Automatically calculates optimal rows per page based on container height.
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculate optimal page size based on available container height.
   * Accounts for header, footer, filters, and metrics sections.
   */
  const autoPageSize = useAutoRowHeight(containerRef, {
    headerHeight:
      // Includes: searchbar (50) + filters if present (50) + metrics if present (120) + toolbar/headers (150)
      50 + (filters?.length ? 50 : 0) + (metrics?.length ? 120 : 0) + 150,
    footerHeight: 56,
    rowHeight: 53,
    minRows: 5,
  })

  /** Number of rows to display per page */
  const [pageSize, setPageSize] = useState<number>(5)

  /**
   * Track whether user has manually selected a page size.
   * If true, auto page size updates are ignored.
   * Starts as true to preserve the default of 5.
   */
  const [manualPageSizeSet, setManualPageSizeSet] = useState<boolean>(true)

  /** Previous auto page size for change detection */
  const [prevAutoPageSize, setPrevAutoPageSize] = useState<number>(autoPageSize)

  /**
   * Apply auto page size when container resizes (derived state pattern).
   * Only applies if user hasn't manually selected a page size.
   */
  if (autoPageSize !== prevAutoPageSize) {
    setPrevAutoPageSize(autoPageSize)
    if (autoPageSize > 0 && !manualPageSizeSet) {
      setPageSize(autoPageSize)
    }
  }

  /**
   * Handle page size selection from footer dropdown.
   * Marks as manually set to prevent auto-size from overriding.
   */
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setManualPageSizeSet(true)
    setPage(0) // Reset to first page when changing page size
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA SYNCHRONIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sync internal rows state when props change.
   * Uses useLayoutEffect to sync before paint, preventing visual flicker.
   * Uses deep comparison via areRowsEqual to avoid unnecessary updates.
   */
  React.useLayoutEffect(() => {
    if (!areRowsEqual(prevProvidedRowsRef.current, providedRows)) {
      setRows(providedRows || [])
      setFilteredRows(providedRows || [])
      prevProvidedRowsRef.current = providedRows
    }
  }, [providedRows])

  /** Initialize grid with column and row data (handles initial setup) */
  useInitializeGrid({ columns: visibleColumns, providedRows, setRows })

  // ═══════════════════════════════════════════════════════════════════════════
  // SELECTION HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Update selection state and notify parent via callback.
   * @param newSelectedIds - Array of row IDs to select
   */
  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedRows(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  /**
   * Handle row click - toggles selection for the clicked row.
   * Uses utility function from useSelectRows.
   */
  const handleRowClick = (row: RowData) =>
    selectRow(row, selectedRows, handleSelectionChange)

  /**
   * Handle header checkbox click - selects or deselects all rows.
   * Toggles between all selected and none selected.
   */
  const handleHeaderCheckboxChange: React.ChangeEventHandler<
    HTMLInputElement
  > = () => selectAllRows(rows, selectedRows, handleSelectionChange)

  // ═══════════════════════════════════════════════════════════════════════════
  // INLINE EDITING HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  // Editing flow:
  // 1. User selects a row (row becomes highlighted)
  // 2. User clicks a cell in that row -> handleCellClick
  // 3. Cell renders EditableCell component with input
  // 4. User types -> handleEditingValueChange
  // 5. User saves (Enter/blur) -> handleCellSave
  // 6. User cancels (Escape) -> handleCellCancel
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle cell click to start editing.
   * Only allows editing if the row is already selected (prevents accidental edits).
   * Converts the current cell value to a string for the input field.
   */
  const handleCellClick = useCallback(
    (rowId: string, field: string, currentValue: unknown) => {
      // Only allow editing if the row is already selected
      if (selectedRows.includes(rowId)) {
        setEditingCell({ rowId, field })

        // Find the column to check if it's a multiselect field
        const column = columns.find(col => col.field === field)
        const isMultiselect = column?.creationField?.type === 'multiselect'

        // Convert value to editable string format based on type
        if (currentValue == null) {
          setEditingValue(isMultiselect ? '[]' : '')
        } else if (isMultiselect && Array.isArray(currentValue)) {
          // Multiselect values stored as JSON array string during editing
          setEditingValue(JSON.stringify(currentValue))
        } else if (typeof currentValue === 'object') {
          try {
            setEditingValue(JSON.stringify(currentValue))
          } catch {
            setEditingValue(isMultiselect ? '[]' : '[object]')
          }
        } else if (
          typeof currentValue === 'string' ||
          typeof currentValue === 'number' ||
          typeof currentValue === 'boolean'
        ) {
          setEditingValue(String(currentValue))
        } else {
          setEditingValue(isMultiselect ? '[]' : '')
        }
      }
    },
    [selectedRows, columns]
  )

  /**
   * Handle saving an edited cell value.
   * 1. Processes the value (e.g., parses multiselect JSON)
   * 2. Calls parent callback for persistence
   * 3. Updates local state for immediate UI feedback
   * 4. Clears editing state
   */
  const handleCellSave = useCallback(
    (rowId: string, field: string, value: string) => {
      // Find the column to check if it's a multiselect field
      const column = columns.find(col => col.field === field)
      const isMultiselect = column?.creationField?.type === 'multiselect'

      let processedValue = value

      // For multiselect fields, parse the JSON string back to array
      if (isMultiselect) {
        try {
          processedValue = JSON.parse(value) as any
        } catch {
          processedValue = [] as any
        }
      }

      // Notify parent for persistence
      if (onCellSave) {
        onCellSave(rowId, field, processedValue)
      }

      // Update local state for immediate UI feedback (optimistic update)
      setRows(prevRows =>
        prevRows.map(row => {
          const currentRowId = String(row._id ?? row.id)
          if (currentRowId === rowId) {
            return { ...row, [field]: processedValue }
          }
          return row
        })
      )

      // Also update filteredRows to ensure immediate visual feedback
      setFilteredRows(prevRows =>
        prevRows.map(row => {
          const currentRowId = String(row._id ?? row.id)
          if (currentRowId === rowId) {
            return { ...row, [field]: processedValue }
          }
          return row
        })
      )

      // Clear editing state
      setEditingCell(null)
      setEditingValue('')
    },
    [onCellSave, columns]
  )

  /**
   * Cancel cell editing without saving.
   * Triggered by Escape key or clicking outside.
   */
  const handleCellCancel = useCallback(() => {
    setEditingCell(null)
    setEditingValue('')
  }, [])

  /**
   * Update editing value as user types.
   * Called on every keystroke in the edit input.
   */
  const handleEditingValueChange = useCallback((value: string) => {
    setEditingValue(value)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // ROW CREATION HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  // Row creation flow:
  // 1. User clicks "Add" button in toolbar -> handleStartRowCreation
  // 2. CreationRow appears with form fields
  // 3. User fills fields -> handleCreationFieldChange
  // 4. User saves -> handleCreateRowSave (validates, calls parent callback)
  // 5. User cancels -> handleCreateRowCancel
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Start row creation mode.
   * Initializes form with default values from column definitions.
   */
  const handleStartRowCreation = useCallback(() => {
    if (!onRowCreation) return

    // Initialize creation row data with default values from column configs
    const initialData: Record<string, unknown> = {}
    visibleColumns.forEach(col => {
      if (col.creationField?.defaultValue !== undefined) {
        initialData[col.field] = col.creationField.defaultValue
      } else {
        initialData[col.field] = ''
      }
    })

    setCreationRowData(initialData)
    setCreationRowErrors({})
    setIsCreatingRow(true)
  }, [onRowCreation, visibleColumns])

  /**
   * Handle field value change in creation form.
   * Clears any previous validation error for the field.
   */
  const handleCreationFieldChange = useCallback(
    (field: string, value: unknown) => {
      setCreationRowData(prev => ({
        ...prev,
        [field]: value,
      }))

      // Clear error for this field when value changes
      setCreationRowErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    },
    []
  )

  /**
   * Generate user-friendly validation error message.
   * Converts field names to display-friendly header names.
   * Formats message for 1, 2, or multiple fields.
   *
   * @example
   * // Single field: "Please fill out the Email field."
   * // Two fields: "Please fill out the Name and Email fields."
   * // Multiple: "Please fill out the Name, Email, and Phone fields."
   */
  const generateValidationMessage = useCallback(
    (errors: Record<string, string>) => {
      const fieldNames = Object.keys(errors)

      // Convert field names to header names for better UX
      const headerNames = fieldNames.map(fieldName => {
        const column = visibleColumns.find(col => col.field === fieldName)
        return column?.headerName || fieldName
      })

      if (headerNames.length === 1) {
        return `Please fill out the ${headerNames[0]} field.`
      } else if (headerNames.length === 2) {
        return `Please fill out the ${headerNames[0]} and ${headerNames[1]} fields.`
      } else {
        const lastField = headerNames.pop()
        return `Please fill out the ${headerNames.join(', ')}, and ${lastField} fields.`
      }
    },
    [visibleColumns]
  )

  /**
   * Save the new row being created.
   * 1. Validates all required fields
   * 2. Runs custom validation functions
   * 3. Shows validation errors via snackbar if any
   * 4. Calls parent callback to persist the new row
   * 5. Resets creation state on success
   */
  const handleCreateRowSave = useCallback(() => {
    if (!onRowCreation) return

    // Validate required fields and run custom validators
    const errors: Record<string, string> = {}
    let hasErrors = false

    visibleColumns.forEach(col => {
      // Check required fields
      if (col.creationField?.required) {
        const value = creationRowData[col.field]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[col.field] = `${col.headerName} is required`
          hasErrors = true
        }
      }

      // Run custom validation if provided
      if (col.creationField?.validation) {
        const validationError = col.creationField.validation(
          creationRowData[col.field]
        )
        if (validationError) {
          errors[col.field] = validationError
          hasErrors = true
        }
      }
    })

    // Show validation errors and abort if any
    if (hasErrors) {
      setCreationRowErrors(errors)
      const message = generateValidationMessage(errors)
      setSnackbarMessage(message)
      setSnackbarOpen(true)
      return
    }

    // Call parent callback (supports both sync and async)
    Promise.resolve(onRowCreation(creationRowData))
      .then(() => {
        // Reset creation state on success
        setIsCreatingRow(false)
        setCreationRowData({})
        setCreationRowErrors({})
      })
      .catch((error: unknown) => {
        console.error('Error creating row:', error)
      })
  }, [
    onRowCreation,
    creationRowData,
    visibleColumns,
    generateValidationMessage,
  ])

  /**
   * Cancel row creation and reset state.
   */
  const handleCreateRowCancel = useCallback(() => {
    setIsCreatingRow(false)
    setCreationRowData({})
    setCreationRowErrors({})
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH AND FILTER HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle search results from FilterSection.
   * Updates filteredRows with the search results and resets to first page.
   *
   * @param args - Tuple of [searchTerm, filteredRows, visibleColumns]
   */
  const handleSearchFilter = useCallback(
    (...args: [string, RowData[], string[]]) => {
      const nextFilteredRows = args[1]
      setFilteredRows(nextFilteredRows)
      // Note: column visibility is managed separately; search only filters rows
      setPage(0)
    },
    []
  )

  /**
   * Hook for ManageRow component integration.
   * Provides handlers for manage/close actions on selected rows.
   */
  const { handleManageRowClose, handleManage } = useManageRow({
    ...(onManage !== undefined ? { onManage } : {}),
    selectedRows,
    handleSelectionChange,
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // COLUMN ACTION HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sort rows by a column.
   * Handles string, number, and object values with appropriate comparisons.
   * Updates both rows and filteredRows to maintain sort across searches.
   *
   * @param field - Column field to sort by
   * @param direction - 'asc' for ascending, 'desc' for descending
   */
  const handleColumnSort = useCallback(
    (field: string, direction: 'asc' | 'desc') => {
      const sortFn = (a: RowData, b: RowData) => {
        const aValue = a[field]
        const bValue = b[field]

        // String comparison (locale-aware)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        // Numeric comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Fallback: convert to string for comparison
        const aStr =
          aValue != null
            ? typeof aValue === 'string' ||
              typeof aValue === 'number' ||
              typeof aValue === 'boolean'
              ? String(aValue)
              : JSON.stringify(aValue)
            : ''
        const bStr =
          bValue != null
            ? typeof bValue === 'string' ||
              typeof bValue === 'number' ||
              typeof bValue === 'boolean'
              ? String(bValue)
              : JSON.stringify(bValue)
            : ''
        return direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      }

      // Sort both datasets to maintain consistency
      setRows(prevRows => [...prevRows].sort(sortFn))
      setFilteredRows(prevRows => [...prevRows].sort(sortFn))
    },
    []
  )

  /**
   * Hide a column from view.
   * Column can be shown again via ManageColumnsSimple modal.
   */
  const handleColumnHide = useCallback((field: string) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev)
      newSet.add(field)
      return newSet
    })
  }, [])

  /**
   * Show a previously hidden column.
   */
  const handleColumnShow = useCallback((field: string) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev)
      newSet.delete(field)
      return newSet
    })
  }, [])

  /** Toggle the Manage Columns modal visibility. */
  const handleToggleManageColumns = useCallback(() => {
    setShowManageColumns(prev => !prev)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // COLUMN DRAG AND DROP HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  // Allows users to reorder columns by dragging column headers.
  // ═══════════════════════════════════════════════════════════════════════════

  /** Start dragging a column header. */
  const handleColumnDragStart = useCallback((field: string) => {
    setDraggedColumn(field)
  }, [])

  /** Allow drop by preventing default behavior. */
  const handleColumnDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  /**
   * Handle column drop to reorder.
   * Moves the dragged column to the target position.
   */
  const handleColumnDrop = useCallback(
    (targetField: string) => {
      if (!draggedColumn || draggedColumn === targetField) {
        setDraggedColumn(null)
        return
      }

      setColumnOrder(prevOrder => {
        const newOrder = [...prevOrder]
        const draggedIndex = newOrder.indexOf(draggedColumn)
        const targetIndex = newOrder.indexOf(targetField)

        if (draggedIndex !== -1 && targetIndex !== -1) {
          // Remove from old position and insert at new position
          newOrder.splice(draggedIndex, 1)
          newOrder.splice(targetIndex, 0, draggedColumn)
        }

        return newOrder
      })
      setDraggedColumn(null)
    },
    [draggedColumn]
  )

  /** Clean up drag state when drag ends (even without drop). */
  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumn(null)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGINATION CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Start index of visible rows (0-based) */
  const startIndex = page * pageSize
  /** End index of visible rows (exclusive) */
  const endIndex = startIndex + pageSize
  /** Rows to display on current page (slice of filteredRows) */
  const visibleRows = filteredRows.slice(startIndex, endIndex)

  // ═══════════════════════════════════════════════════════════════════════════
  // SELECTION STATE CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** True if all filtered rows are selected (for header checkbox checked state) */
  const allRowsSelected =
    filteredRows.length > 0 && selectedRows.length === filteredRows.length

  /** True if some but not all rows selected (for header checkbox indeterminate state) */
  const someRowsSelected =
    selectedRows.length > 0 && selectedRows.length < filteredRows.length

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  // Error state - show error message instead of grid
  if (error) {
    return (
      <div
        className={cssStyles.datagrid}
        data-theme={theme}
        // Top-level test marker: `data-grid-status="error"` so tests
        // can wait for the error state and grab the message via
        // `[data-datagrid="<id>"][data-grid-status="error"] .error`.
        data-datagrid={dataGrid}
        data-grid-status="error"
      >
        <div className={cssStyles.error} role="alert">
          <div style={{ color: 'inherit' }}>Error: {error.message}</div>
        </div>
      </div>
    )
  }

  // Compute high-level grid status for the root data-grid-status
  // attribute. Tests can wait for `data-grid-status="ready"` instead
  // of polling for individual rows, which makes flake go down.
  // - `loading` reserved for a future loading prop
  // - `empty` when the grid mounted but has no rows after filtering
  // - `ready` when at least one row is present
  const gridStatus: 'empty' | 'ready' =
    filteredRows.length === 0 ? 'empty' : 'ready'

  return (
    <div
      className={cssStyles.datagrid}
      data-theme={theme}
      data-datagrid={dataGrid}
      data-grid-status={gridStatus}
      role="grid"
      aria-rowcount={filteredRows.length}
      ref={containerRef}
    >
      {/* ─────────────────────────────────────────────────────────────────────
          MOBILE VIEW
          Card-based layout for screens < 768px.
          CSS media queries control visibility (display: none on desktop).
          ───────────────────────────────────────────────────────────────────── */}
      <div className={cssStyles.mobileView}>
        <MobileCardView
          columns={visibleColumns}
          rows={filteredRows}
          selectedRows={selectedRows}
          onRowClick={handleRowClick}
          {...(onCellSave !== undefined ? { onCellSave } : {})}
          {...(onRowCreation !== undefined ? { onRowCreation } : {})}
          permissions={permissions}
          {...(onManage !== undefined ? { onManage } : {})}
          {...(onDelete !== undefined ? { onDelete } : {})}
          {...(onDuplicate !== undefined ? { onDuplicate } : {})}
          {...(onShow !== undefined ? { onShow } : {})}
          {...(onSelectionChange !== undefined ? { onSelectionChange } : {})}
          {...(buttons !== undefined ? { buttons } : {})}
          {...(styles !== undefined ? { styles } : {})}
          editingCell={editingCell}
          editingValue={editingValue}
          onCellClick={handleCellClick}
          onCellCancel={handleCellCancel}
          onEditingValueChange={handleEditingValueChange}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          DESKTOP VIEW
          Full table layout for screens >= 768px.
          CSS media queries control visibility (display: none on mobile).
          ───────────────────────────────────────────────────────────────────── */}
      <div className={`${cssStyles.contentWrapper} ${cssStyles.desktopView}`}>
        {/* ─────────────────────────────────────────────────────────────────
            METRICS SECTION
            KPI cards displayed above the table. Uses originalMetrics
            (captured on mount) so metrics don't change when data is filtered.
            ───────────────────────────────────────────────────────────────── */}
        {originalMetrics && originalMetrics.length > 0 && (
          <MetricSection
            metrics={originalMetrics}
            collapsible={metricsCollapsible}
            defaultExpanded={metricsDefaultExpanded}
            {...(styles !== undefined ? { styles } : {})}
          />
        )}

        {/* ─────────────────────────────────────────────────────────────────
            FILTER SECTION
            Always rendered to show the search bar. Additional dropdown/date
            filters are optional based on the filters prop.
            ───────────────────────────────────────────────────────────────── */}
        <FilterSection
          {...(filters !== undefined ? { filters } : {})}
          columns={visibleColumns}
          rows={rows}
          onSearchFilter={handleSearchFilter}
          {...(styles !== undefined ? { styles } : {})}
          collapsible={filtersCollapsible}
          defaultExpanded={filtersDefaultExpanded}
        />

        {/* ─────────────────────────────────────────────────────────────────
            TOOLBAR
            Contains custom buttons (left) and ManageRow actions (right).
            Sticky positioned so it remains visible when scrolling.
            ───────────────────────────────────────────────────────────────── */}
        <div className={cssStyles.stickyToolbar}>
          <DataGridToolbar
            buttons={buttons ?? []}
            permissions={permissions}
            manageRowProps={{
              selectedRows,
              rows,
              ...(onRowCreation && !isCreatingRow
                ? { onAdd: handleStartRowCreation }
                : {}),
              ...(onDuplicate
                ? { onDuplicate: () => onDuplicate(selectedRows) }
                : {}),
              ...(onDelete
                ? {
                    onDelete: () => {
                      onDelete(selectedRows)
                      handleSelectionChange([])
                    },
                  }
                : {}),
              ...(onManage ? { onManage: handleManage } : {}),
              ...(onShow ? { onShow: () => onShow(selectedRows) } : {}),
              handleClose: handleManageRowClose,
              permissions,
            }}
            styles={{
              theme: styles?.theme || 'sacred',
            }}
          />
          <div className={cssStyles.divider} />
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            TABLE
            Main data table with column headers, data rows, and optional
            creation row for adding new entries.
            ───────────────────────────────────────────────────────────────── */}
        <Table
          columns={visibleColumns}
          rows={visibleRows}
          selectedRowIds={selectedRows}
          onRowClick={handleRowClick}
          allRowsSelected={allRowsSelected}
          someRowsSelected={someRowsSelected}
          onHeaderCheckboxChange={handleHeaderCheckboxChange}
          onColumnResize={handleColumnResize}
          {...(styles !== undefined ? { styles } : {})}
          editingCell={editingCell}
          editingValue={editingValue}
          onCellClick={handleCellClick}
          onCellSave={handleCellSave}
          onCellCancel={handleCellCancel}
          permissions={permissions}
          onEditingValueChange={handleEditingValueChange}
          isCreatingRow={isCreatingRow}
          creationRowData={creationRowData}
          onCreationFieldChange={handleCreationFieldChange}
          onCreateRowSave={handleCreateRowSave}
          onCreateRowCancel={handleCreateRowCancel}
          onColumnSort={handleColumnSort}
          onManageColumns={handleToggleManageColumns}
          draggedColumn={draggedColumn}
          onColumnDragStart={handleColumnDragStart}
          onColumnDragOver={handleColumnDragOver}
          onColumnDrop={handleColumnDrop}
          onColumnDragEnd={handleColumnDragEnd}
        />

        {/* ─────────────────────────────────────────────────────────────────
            FOOTER
            Pagination controls (page navigation, page size selector)
            and export button (PDF).
            ───────────────────────────────────────────────────────────────── */}
        <CustomFooter
          page={page}
          pageSize={pageSize}
          rowCount={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          columns={visibleColumns}
          rows={filteredRows}
          onExportPdf={onExportPdf || defaultExportToPdf}
          {...(styles !== undefined ? { styles } : {})}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          MANAGE COLUMNS MODAL
          Allows users to show/hide columns. Opens when user clicks
          the "Manage Columns" option in a column header menu.
          ───────────────────────────────────────────────────────────────────── */}
      {showManageColumns && (
        <ManageColumnsSimple
          open={showManageColumns}
          columns={columnsWithWidths}
          hiddenColumns={hiddenColumns}
          onColumnShow={handleColumnShow}
          onColumnHide={handleColumnHide}
          onClose={() => setShowManageColumns(false)}
          {...(styles !== undefined ? { styles } : {})}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          VALIDATION ERROR SNACKBAR
          Displays validation errors from row creation.
          Auto-dismisses after 6 seconds.
          ───────────────────────────────────────────────────────────────────── */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity="error"
        autoHideDuration={6000}
        styles={{
          theme: styles?.theme || 'sacred',
        }}
      />
    </div>
  )
}

// =============================================================================
// DATAGRID WRAPPER COMPONENT
// =============================================================================

/**
 * DATAGRID MAIN EXPORT
 * --------------------
 * Wraps DataGridContent with ColumnVisibilityProvider context.
 * This is the component that consumers import and use.
 *
 * The context provider enables column visibility state to be shared
 * across nested components without prop drilling.
 *
 * @example
 * import DataGrid from '@/components/DataGrid'
 *
 * <DataGrid
 *   columns={columns}
 *   rows={data}
 *   permissions={{ access: 'write' }}
 *   onCellSave={handleSave}
 * />
 */
function DataGrid(props: DatagridProps) {
  return (
    <ColumnVisibilityProvider>
      <DataGridContent {...props} />
    </ColumnVisibilityProvider>
  )
}

export default DataGrid

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
import useIsMobile from './utils/useIsMobile'
import { areRowsEqual } from './utils/rowComparison'
import type { DatagridProps, RowData, ColumnDef } from './types'
import { getDataGridStyles } from '../../theme'
import { ColumnVisibilityProvider } from './context/ColumnVisibilityContext'

// Store ref to container for PDF export - will be set by DataGridContent
let exportContainerRef: HTMLDivElement | null = null

// Default PDF export handler using html2canvas and jsPDF
// Captures the actual DataGrid element to preserve exact styling
// Note: columns and rows params are part of the signature for API consistency
// but we capture the rendered element directly for exact visual fidelity
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
  allowRowCreation = false,
  creationRowPosition = 'top',
  showIdColumns = false,
  filters,
  metrics,
  metricsCollapsible = true,
  metricsDefaultExpanded = false,
  filtersCollapsible = true,
  filtersDefaultExpanded = false,
  onExportPdf,
  styles,
}: DatagridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile(768)

  // Update the module-level ref for PDF export whenever containerRef changes
  useEffect(() => {
    exportContainerRef = containerRef.current
    return () => {
      exportContainerRef = null
    }
  }, [])

  const computedStyles = getDataGridStyles(styles)

  // Column state management
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
  const [showManageColumns, setShowManageColumns] = useState(false)

  const filteredColumns = useMemo(() => {
    if (showIdColumns) return columns
    return columns.filter(col => col.field !== 'id' && col.field !== '_id')
  }, [columns, showIdColumns])

  // Initialize column order when columns change
  useEffect(() => {
    if (filteredColumns.length > 0 && columnOrder.length === 0) {
      setColumnOrder(filteredColumns.map(col => col.field))
    }
  }, [filteredColumns, columnOrder.length])

  // Reorder columns based on columnOrder state
  const orderedColumns = useMemo(() => {
    if (columnOrder.length === 0) return filteredColumns

    const ordered = columnOrder
      .map(fieldName => filteredColumns.find(col => col.field === fieldName))
      .filter(Boolean) as typeof filteredColumns

    // Add any new columns that aren't in the order yet
    const existingFields = new Set(columnOrder)
    const newColumns = filteredColumns.filter(
      col => !existingFields.has(col.field)
    )

    return [...ordered, ...newColumns]
  }, [filteredColumns, columnOrder])

  // State for managing column widths
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  // Merge column widths with the ordered columns
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

  // Filter columns based on hidden columns
  const visibleColumns = useMemo(() => {
    return columnsWithWidths.filter(col => !hiddenColumns.has(col.field))
  }, [columnsWithWidths, hiddenColumns])

  // Handle column resize
  const handleColumnResize = useCallback(
    (columnField: string, newWidth: number) => {
      setColumnWidths(prev => ({
        ...prev,
        [columnField]: newWidth,
      }))

      // Call the parent callback if provided
      if (onColumnResize) {
        onColumnResize(columnField, newWidth)
      }
    },
    [onColumnResize]
  )

  // Use ref to track previous providedRows to prevent unnecessary re-renders
  const prevProvidedRowsRef = useRef<RowData[] | undefined>(undefined)
  const [rows, setRows] = useState<RowData[]>(() => providedRows || [])
  // Search-driven filtered rows (managed by FilterSection)
  const [filteredRows, setFilteredRows] = useState<RowData[]>(
    () => providedRows || []
  )
  // Store original metrics to prevent them from changing when data is filtered
  const [originalMetrics] = useState(() => metrics)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    field: string
  } | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  // Row creation state
  const [isCreatingRow, setIsCreatingRow] = useState(false)
  const [creationRowData, setCreationRowData] = useState<
    Record<string, unknown>
  >({})
  const [, setCreationRowErrors] = useState<Record<string, string>>({})

  // Snackbar state for validation errors
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const autoPageSize = useAutoRowHeight(containerRef, {
    headerHeight:
      // Always include searchbar area within FilterSection (+50), plus filters and metrics
      50 + (filters?.length ? 50 : 0) + (metrics?.length ? 120 : 0) + 150,
    footerHeight: 56,
    rowHeight: 53,
    minRows: 5,
  })

  const [pageSize, setPageSize] = useState<number>(5) // Default to 5 rows per page
  const [manualPageSizeSet, setManualPageSizeSet] = useState<boolean>(true) // Track if user manually set page size - start as true to preserve default

  // Only use auto page size if no manual page size has been set
  useEffect(() => {
    if (autoPageSize > 0 && !manualPageSizeSet) {
      setPageSize(autoPageSize)
    }
  }, [autoPageSize, manualPageSizeSet])

  // Handle page size changes from the footer dropdown
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setManualPageSizeSet(true) // Mark that user has manually set page size
    setPage(0) // Reset to first page when changing page size
  }, [])

  // Smart update that only triggers when providedRows content actually changes
  useEffect(() => {
    if (!areRowsEqual(prevProvidedRowsRef.current, providedRows)) {
      setRows(providedRows || [])
      setFilteredRows(providedRows || [])
      prevProvidedRowsRef.current = providedRows
    }
  }, [providedRows])

  useInitializeGrid({ columns: visibleColumns, providedRows, setRows })

  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedRows(newSelectedIds)
    onSelectionChange?.(newSelectedIds)
  }

  const handleRowClick = (row: RowData) =>
    selectRow(row, selectedRows, handleSelectionChange)
  const handleHeaderCheckboxChange: React.ChangeEventHandler<
    HTMLInputElement
  > = () => selectAllRows(rows, selectedRows, handleSelectionChange)

  // Inline editing handlers
  const handleCellClick = useCallback(
    (rowId: string, field: string, currentValue: unknown) => {
      // Only allow editing if the row is already selected
      if (selectedRows.includes(rowId)) {
        setEditingCell({ rowId, field })

        // Find the column to check if it's a multiselect field
        const column = columns.find(col => col.field === field)
        const isMultiselect = column?.creationField?.type === 'multiselect'

        // Handle different value types safely
        if (currentValue == null) {
          setEditingValue(isMultiselect ? '[]' : '')
        } else if (isMultiselect && Array.isArray(currentValue)) {
          // For multiselect, convert array to JSON string
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

      // Call the external onCellSave callback if it exists
      if (onCellSave) {
        onCellSave(rowId, field, processedValue)
      }

      // Update the local row data for immediate UI feedback
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

      setEditingCell(null)
      setEditingValue('')
    },
    [onCellSave, columns]
  )

  const handleCellCancel = useCallback(() => {
    setEditingCell(null)
    setEditingValue('')
  }, [])

  const handleEditingValueChange = useCallback((value: string) => {
    setEditingValue(value)
  }, [])

  // Row creation handlers
  const handleStartRowCreation = useCallback(() => {
    if (!allowRowCreation) return

    // Initialize creation row data with default values
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
  }, [allowRowCreation, visibleColumns])

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

  // Generate user-friendly validation error message
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

  const handleCreateRowSave = useCallback(() => {
    if (!onRowCreation) return

    // Validate required fields
    const errors: Record<string, string> = {}
    let hasErrors = false

    visibleColumns.forEach(col => {
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

    if (hasErrors) {
      setCreationRowErrors(errors)
      // Show snackbar with validation error message
      const message = generateValidationMessage(errors)
      setSnackbarMessage(message)
      setSnackbarOpen(true)
      return
    }

    // Handle async operation without returning promise
    Promise.resolve(onRowCreation(creationRowData))
      .then(() => {
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

  const handleCreateRowCancel = useCallback(() => {
    setIsCreatingRow(false)
    setCreationRowData({})
    setCreationRowErrors({})
  }, [])

  // Handle search results from FilterSection
  const handleSearchFilter = useCallback(
    (...args: [string, RowData[], string[]]) => {
      const nextFilteredRows = args[1]
      setFilteredRows(nextFilteredRows)
      // Note: we keep column visibility unchanged; search only filters rows.
      setPage(0)
    },
    []
  )
  const { handleManageRowClose, handleManage } = useManageRow({
    ...(onManage !== undefined ? { onManage } : {}),
    selectedRows,
    handleSelectionChange,
  })

  // Column action handlers (defined after filteredRows is available)
  const handleColumnSort = useCallback(
    (field: string, direction: 'asc' | 'desc') => {
      console.log('[DataGrid] handleColumnSort called', { field, direction })
      console.log('[DataGrid] Current rows count:', rows.length)
      console.log('[DataGrid] Current filteredRows count:', filteredRows.length)
      console.log(
        '[DataGrid] First few rows before sort:',
        rows.slice(0, 3).map(r => ({ id: r.id || r._id, [field]: r[field] }))
      )

      const sortFn = (a: RowData, b: RowData) => {
        const aValue = a[field]
        const bValue = b[field]

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Fallback to string comparison
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

      // Sort both rows and filteredRows
      console.log('[DataGrid] About to call setRows and setFilteredRows')
      setRows(prevRows => {
        const sorted = [...prevRows].sort(sortFn)
        console.log(
          '[DataGrid] setRows - sorted rows:',
          sorted
            .slice(0, 3)
            .map(r => ({ id: r.id || r._id, [field]: r[field] }))
        )
        return sorted
      })
      setFilteredRows(prevRows => {
        const sorted = [...prevRows].sort(sortFn)
        console.log(
          '[DataGrid] setFilteredRows - sorted rows:',
          sorted
            .slice(0, 3)
            .map(r => ({ id: r.id || r._id, [field]: r[field] }))
        )
        return sorted
      })
      console.log('[DataGrid] Sort complete')
    },
    [rows.length, filteredRows.length]
  )

  const handleColumnHide = useCallback((field: string) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev)
      newSet.add(field)
      return newSet
    })
  }, [])

  const handleColumnShow = useCallback((field: string) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev)
      newSet.delete(field)
      return newSet
    })
  }, [])

  const handleToggleManageColumns = useCallback(() => {
    setShowManageColumns(prev => !prev)
  }, [])

  // Column drag and drop handlers
  const handleColumnDragStart = useCallback((field: string) => {
    setDraggedColumn(field)
  }, [])

  const handleColumnDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

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
          newOrder.splice(draggedIndex, 1)
          newOrder.splice(targetIndex, 0, draggedColumn)
        }

        return newOrder
      })
      setDraggedColumn(null)
    },
    [draggedColumn]
  )

  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumn(null)
  }, [])

  // Calculate pagination
  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize
  const visibleRows = filteredRows.slice(startIndex, endIndex)

  // Calculate selection states
  const allRowsSelected =
    filteredRows.length > 0 && selectedRows.length === filteredRows.length
  const someRowsSelected =
    selectedRows.length > 0 && selectedRows.length < filteredRows.length

  if (error) {
    return (
      <div style={computedStyles.container}>
        <div style={computedStyles.error}>
          <div style={{ color: 'inherit' }}>Error: {error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={computedStyles.container} ref={containerRef}>
      {isMobile ? (
        <MobileCardView
          columns={visibleColumns}
          rows={filteredRows}
          selectedRows={selectedRows}
          onRowClick={handleRowClick}
          {...(onCellSave !== undefined ? { onCellSave } : {})}
          {...(onRowCreation !== undefined ? { onRowCreation } : {})}
          allowRowCreation={allowRowCreation}
          permissions={permissions}
          creationRowPosition={creationRowPosition}
          {...(onManage !== undefined ? { onManage } : {})}
          {...(onDelete !== undefined ? { onDelete } : {})}
          {...(onDuplicate !== undefined ? { onDuplicate } : {})}
          {...(onShow !== undefined ? { onShow } : {})}
          {...(onSelectionChange !== undefined ? { onSelectionChange } : {})}
          {...(styles !== undefined ? { styles } : {})}
          editingCell={editingCell}
          editingValue={editingValue}
          onCellClick={handleCellClick}
          onCellCancel={handleCellCancel}
          onEditingValueChange={handleEditingValueChange}
        />
      ) : (
        <div style={computedStyles.contentWrapper}>
          {/* Metrics Section */}
          {originalMetrics && originalMetrics.length > 0 && (
            <MetricSection
              metrics={originalMetrics}
              collapsible={metricsCollapsible}
              defaultExpanded={metricsDefaultExpanded}
              {...(styles !== undefined ? { styles } : {})}
            />
          )}

          {/* Filters Section */}
          {/* Always render FilterSection so the searchbar is always visible */}
          <FilterSection
            {...(filters !== undefined ? { filters } : {})}
            columns={visibleColumns}
            rows={rows}
            onSearchFilter={handleSearchFilter}
            {...(styles !== undefined ? { styles } : {})}
            collapsible={filtersCollapsible}
            defaultExpanded={filtersDefaultExpanded}
          />

          {/* Toolbar - positioned inside DataGrid (search removed; search lives in FilterSection) */}
          <DataGridToolbar
            buttons={
              allowRowCreation && !isCreatingRow
                ? [
                    ...(buttons ?? []),
                    {
                      text: 'Add Row',
                      onClick: handleStartRowCreation,
                      styles: {
                        theme: styles?.theme || 'light',
                      },
                    },
                  ]
                : (buttons ?? [])
            }
            permissions={permissions}
            {...(selectedRows.length > 0
              ? {
                  manageRowProps: {
                    selectedRows,
                    rows,
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
                  },
                }
              : {})}
            styles={{
              theme: styles?.theme || 'light',
            }}
          />

          <div style={computedStyles.sectionDivider} />

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
            creationRowPosition={creationRowPosition}
            onColumnSort={handleColumnSort}
            onManageColumns={handleToggleManageColumns}
            draggedColumn={draggedColumn}
            onColumnDragStart={handleColumnDragStart}
            onColumnDragOver={handleColumnDragOver}
            onColumnDrop={handleColumnDrop}
            onColumnDragEnd={handleColumnDragEnd}
          />

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
      )}

      {/* Manage Columns Modal */}
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

      {/* Validation Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity="error"
        autoHideDuration={6000}
        styles={{
          theme: styles?.theme || 'light',
        }}
      />
    </div>
  )
}

function DataGrid(props: DatagridProps) {
  return (
    <ColumnVisibilityProvider>
      <DataGridContent {...props} />
    </ColumnVisibilityProvider>
  )
}

export default DataGrid

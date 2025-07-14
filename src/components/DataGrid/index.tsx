'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import CustomToolbar from '../Toolbar'
import Table from './Table'
import CustomFooter from './Footer'
import FilterSection from './FilterSection'
import MetricSection from './MetricSection'
import ManageColumnsSimple from './ManageColumnsSimple'
import { useSearchbar } from './utils/useToolbarSearchbar'
import { useManageRow } from './utils/useManageRow'
import { useInitializeGrid } from './utils/useInitializeGrid'
import { selectAllRows, selectRow } from './utils/useSelectRows'
import { useAutoRowHeight } from './utils/useAutoRowHeight'
import { DatagridProps, RowData } from './types'
import { getDataGridStyles, SACRED_GLYPHS } from '../../theme'

function arePropsEqual(
  prevProps: Readonly<DatagridProps>,
  nextProps: Readonly<DatagridProps>
) {
  const keysToCompare: (keyof DatagridProps)[] = [
    'columns',
    'rows',
    'buttons',
    'dropdowns',
    'searchbarProps',
    'error',
    'showIdColumns',
    'filters',
    'metrics',
    'styles',
  ]
  for (const key of keysToCompare) {
    if (JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])) {
      return false
    }
  }
  return true
}

function DataGrid({
  columns,
  rows: providedRows,
  buttons,
  dropdowns,
  searchbarProps,
  error = null,
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  onSelectionChange,
  onColumnResize,
  showIdColumns = false,
  filters,
  metrics,
  styles,
}: DatagridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isSacredTheme = styles?.theme === 'sacred'
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

  // State for search filtering
  const [searchFilteredRows, setSearchFilteredRows] = useState<RowData[]>([])
  const [visibleColumnFields, setVisibleColumnFields] = useState<string[]>([])
  const [hasActiveSearch, setHasActiveSearch] = useState(false)

  // Merge column widths with the ordered columns
  const columnsWithWidths = useMemo(() => {
    return orderedColumns.map(col => ({
      ...col,
      width: columnWidths[col.field] || col.width,
      computedWidth: columnWidths[col.field] || col.computedWidth || col.width,
    }))
  }, [orderedColumns, columnWidths])

  // Filter columns based on search visibility and hidden columns
  const visibleColumns = useMemo(() => {
    let filteredCols = columnsWithWidths.filter(
      col => !hiddenColumns.has(col.field)
    )

    if (hasActiveSearch) {
      filteredCols = filteredCols.filter(col =>
        visibleColumnFields.includes(col.field)
      )
    }

    return filteredCols
  }, [columnsWithWidths, visibleColumnFields, hasActiveSearch, hiddenColumns])

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

  // Handle search filter changes
  const handleSearchFilter = useCallback(
    (searchTerm: string, filteredRows: RowData[], visibleColumns: string[]) => {
      setSearchFilteredRows(filteredRows)
      setVisibleColumnFields(visibleColumns)
      setHasActiveSearch(searchTerm.trim().length > 0)
    },
    []
  )

  const [rows, setRows] = useState<RowData[]>(providedRows || [])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    field: string
  } | null>(null)
  const [editingValue, setEditingValue] = useState<string>('')

  const autoPageSize = useAutoRowHeight(containerRef, {
    headerHeight:
      (filters?.length ? 50 : 0) + (metrics?.length ? 120 : 0) + 150,
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
        // Handle different value types safely
        if (currentValue == null) {
          setEditingValue('')
        } else if (typeof currentValue === 'object') {
          try {
            setEditingValue(JSON.stringify(currentValue))
          } catch {
            setEditingValue('[object]')
          }
        } else if (
          typeof currentValue === 'string' ||
          typeof currentValue === 'number' ||
          typeof currentValue === 'boolean'
        ) {
          setEditingValue(String(currentValue))
        } else {
          setEditingValue('')
        }
      }
    },
    [selectedRows]
  )

  const handleCellSave = useCallback(
    (rowId: string, field: string, value: string) => {
      // Update the row data
      setRows(prevRows =>
        prevRows.map(row => {
          const currentRowId = String(row._id ?? row.id)
          if (currentRowId === rowId) {
            return { ...row, [field]: value }
          }
          return row
        })
      )
      setEditingCell(null)
      setEditingValue('')
    },
    []
  )

  const handleCellCancel = useCallback(() => {
    setEditingCell(null)
    setEditingValue('')
  }, [])

  const handleEditingValueChange = useCallback((value: string) => {
    setEditingValue(value)
  }, [])

  const { filteredRows, updatedSearchbarProps } = useSearchbar({
    columns: visibleColumns,
    rows: hasActiveSearch ? searchFilteredRows : rows,
    searchbarProps,
  })
  const { handleManageRowClose, handleManage } = useManageRow({
    onManage,
    selectedRows,
    handleSelectionChange,
  })

  // Column action handlers (defined after filteredRows is available)
  const handleColumnSort = useCallback(
    (field: string, direction: 'asc' | 'desc') => {
      setRows(prevRows => {
        const sorted = [...prevRows].sort((a, b) => {
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
        })
        return sorted
      })
    },
    []
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
          // Remove dragged column from its current position
          newOrder.splice(draggedIndex, 1)
          // Insert it at the target position
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

  const startIndex = page * pageSize
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)

  useEffect(() => {
    const totalPages = Math.ceil(filteredRows.length / pageSize)
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1)
    }
  }, [filteredRows.length, pageSize, page])

  const allRowsSelected =
    rows.length > 0 &&
    rows.every(r => selectedRows.includes(String(r._id ?? r.id)))
  const someRowsSelected =
    rows.length > 0 &&
    selectedRows.length > 0 &&
    selectedRows.length < rows.length

  return (
    <div>
      {/* Metrics Section - positioned above the DataGrid */}
      {metrics && Array.isArray(metrics) && metrics.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <MetricSection metrics={metrics} styles={styles} />
        </div>
      )}

      {/* Filter Section - positioned below metrics but outside DataGrid */}
      <div style={{ marginBottom: '1rem' }}>
        <FilterSection
          filters={filters || []}
          columns={columnsWithWidths}
          rows={rows}
          onSearchFilter={handleSearchFilter}
          styles={styles}
        />
      </div>

      {/* Main DataGrid Container */}
      <div ref={containerRef} style={computedStyles.container}>
        {isSacredTheme && (
          <>
            <div
              style={{
                ...computedStyles.glyph,
                top: '0.75rem',
                left: '0.75rem',
              }}
            >
              {SACRED_GLYPHS[23]}
            </div>
            <div
              style={{
                ...computedStyles.glyph,
                top: '0.75rem',
                right: '0.75rem',
                animationDirection: 'reverse',
              }}
            >
              {SACRED_GLYPHS[22]}
            </div>
          </>
        )}
        {error && <div style={computedStyles.error}>{error.message}</div>}

        <div style={computedStyles.contentWrapper}>
          {/* Toolbar - positioned inside DataGrid */}
          <CustomToolbar
            buttons={buttons}
            dropdowns={dropdowns?.[0] ? [dropdowns[0]] : undefined}
            searchbarProps={updatedSearchbarProps}
            rightCenterProps={
              selectedRows.length > 0
                ? {
                    selectedRows,
                    rows,
                    onDuplicate: onDuplicate
                      ? () => onDuplicate(selectedRows)
                      : undefined,
                    onDelete: onDelete
                      ? () => {
                          onDelete(selectedRows)
                          handleSelectionChange([])
                        }
                      : undefined,
                    onManage: onManage ? handleManage : undefined,
                    onShow: onShow ? () => onShow(selectedRows) : undefined,
                    handleClose: handleManageRowClose,
                  }
                : undefined
            }
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
            styles={styles}
            editingCell={editingCell}
            editingValue={editingValue}
            onCellClick={handleCellClick}
            onCellSave={handleCellSave}
            onCellCancel={handleCellCancel}
            onEditingValueChange={handleEditingValueChange}
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
            styles={styles}
          />
        </div>

        {isSacredTheme && (
          <div style={computedStyles.footerContainer}>
            {['𓊖', '𓊗', '𓊖'].map((glyph, index) => (
              <p
                key={index}
                style={{
                  ...computedStyles.footerGlyph,
                  animationDelay: `${2 + index * 0.3}s`,
                }}
              >
                {glyph}
              </p>
            ))}
          </div>
        )}

        {/* Manage Columns Modal */}
        <ManageColumnsSimple
          open={showManageColumns}
          onClose={handleToggleManageColumns}
          columns={filteredColumns}
          hiddenColumns={hiddenColumns}
          onColumnShow={handleColumnShow}
          onColumnHide={handleColumnHide}
          styles={styles}
        />
      </div>
    </div>
  )
}

export default React.memo(DataGrid, arePropsEqual)

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'
import CreationRow from './CreationRow'
import CompositeFieldEditModal from '../CompositeFieldEditModal'
import { useColumnResize } from '../utils/useColumnResize'
import { getDataGridStyles } from '../../../theme'
import { getDataGridTheme } from '../../../theme/datagrid'
import type { TableProps, ColumnDef, CompositeFieldConfig } from '../types'

export function getRowId(row: {
  id?: string | number
  _id?: string | number
}): string {
  return String(row.id ?? row._id ?? '')
}

interface ScrollbarConfig {
  height: string
  width: string
  track: {
    backgroundColor: string
    borderRadius: string
  }
  thumb: {
    backgroundColor: string
    borderRadius: string
    border?: string
  }
  thumbHover: {
    backgroundColor: string
  }
}

// Create themed scrollbar styles
const createScrollbarStyles = (
  theme: string,
  scrollbarConfig: ScrollbarConfig
) => {
  const scrollbarClass = `datagrid-scrollbar-${theme}`

  const css = `
    .${scrollbarClass}::-webkit-scrollbar {
      height: ${scrollbarConfig.height};
      width: ${scrollbarConfig.width};
    }
    
    .${scrollbarClass}::-webkit-scrollbar-track {
      background-color: ${scrollbarConfig.track.backgroundColor};
      border-radius: ${scrollbarConfig.track.borderRadius};
    }
    
    .${scrollbarClass}::-webkit-scrollbar-thumb {
      background-color: ${scrollbarConfig.thumb.backgroundColor};
      border-radius: ${scrollbarConfig.thumb.borderRadius};
      ${scrollbarConfig.thumb.border ? `border: ${scrollbarConfig.thumb.border};` : ''}
    }
    
    .${scrollbarClass}::-webkit-scrollbar-thumb:hover {
      background-color: ${scrollbarConfig.thumbHover.backgroundColor};
    }
    
    /* Firefox scrollbar styles */
    .${scrollbarClass} {
      scrollbar-width: thin;
      scrollbar-color: ${scrollbarConfig.thumb.backgroundColor} ${scrollbarConfig.track.backgroundColor};
    }
  `

  return { css, className: scrollbarClass }
}

function Table({
  columns,
  rows,
  onRowClick,
  selectedRowIds = [],
  allRowsSelected = false,
  someRowsSelected = false,
  onHeaderCheckboxChange,
  onColumnResize,
  styles,
  editingCell,
  editingValue,
  onCellClick,
  onCellSave,
  onCellCancel,
  onEditingValueChange,
  isCreatingRow = false,
  creationRowData = {},
  onCreationFieldChange,
  onCreateRowSave,
  onCreateRowCancel,
  creationRowPosition = 'top',
  onColumnSort,
  onManageColumns,
  draggedColumn,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
  permissions,
}: TableProps) {
  const computedStyles = getDataGridStyles(styles)
  const theme = styles?.theme || 'light'

  // Get theme configuration directly
  const themeConfig = getDataGridTheme(styles)

  // Use column resize hook
  const { updatedColumns, isResizing, resizingColumn, getResizeHandleProps } =
    useColumnResize({
      columns,
      ...(onColumnResize ? { onColumnResize } : {}),
    })

  // Create scrollbar styles
  const scrollbarStyles = createScrollbarStyles(theme, themeConfig.scrollbar)

  // Composite editing state
  const [compositeEditingData, setCompositeEditingData] = useState<{
    rowData: any
    column: ColumnDef
  } | null>(null)

  // Composite editing handlers
  const handleCompositeFieldSave = useCallback(
    (fieldUpdates: Record<string, any>) => {
      if (compositeEditingData && onCellSave) {
        // Capture the rowId before clearing the state
        const rowId = getRowId(compositeEditingData.rowData)

        // Defer the state updates to avoid setState during render
        setTimeout(() => {
          // Call onCellSave for each field that was updated
          Object.entries(fieldUpdates).forEach(([field, value]) => {
            onCellSave(rowId, field, value)
          })
        }, 0)
      }
      setCompositeEditingData(null)
    },
    [compositeEditingData, onCellSave]
  )

  const handleCompositeEditClose = useCallback(() => {
    setCompositeEditingData(null)
  }, [])

  // Enhanced cell click handler that detects composite fields
  const handleCellClick = useCallback(
    (rowId: string, field: string, currentValue: unknown) => {
      // Find the column to check if it has composite fields
      const column = columns.find(col => col.field === field)

      if (column && Array.isArray(column.type)) {
        // Handle composite field editing - find the row data
        const rowData = rows.find(row => getRowId(row) === rowId)
        if (rowData) {
          setCompositeEditingData({
            rowData,
            column,
          })
        }
      } else {
        // Handle regular inline editing
        onCellClick?.(rowId, field, currentValue)
      }
    },
    [columns, rows, onCellClick]
  )

  // Inject scrollbar styles into document head
  useEffect(() => {
    const styleId = `datagrid-scrollbar-${theme}`
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = scrollbarStyles.css

    return () => {
      // Clean up on unmount
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [theme, scrollbarStyles.css])

  // Apply styles for horizontal scrolling
  const tableContainerStyle = {
    ...computedStyles.table.tableContainer,
    // The container itself should not scroll; wrapper will handle it
    overflowX: 'hidden' as const,
    width: '100%',
  }

  const tableWrapperStyle = {
    ...computedStyles.table.tableWrapper,
    // Own the horizontal scroll here
    overflowX: 'auto' as const,
    width: '100%',
    // Ensure there is breathing room on the right edge when scrolled fully
    paddingRight: '16px',
  }

  const tableStyle = {
    ...computedStyles.table.table,
    // Allow table to grow wider than container and provide breathing room
    width: 'max-content',
    minWidth: '100%',
  }

  return (
    <div style={tableContainerStyle}>
      <div style={tableWrapperStyle} className={scrollbarStyles.className}>
        <table style={tableStyle}>
          <thead>
            <ColumnHeaderRow
              allRowsSelected={allRowsSelected}
              someRowsSelected={someRowsSelected}
              handleHeaderCheckboxChange={onHeaderCheckboxChange}
              columns={updatedColumns}
              getResizeHandleProps={getResizeHandleProps}
              isResizing={isResizing}
              resizingColumn={resizingColumn}
              {...(styles ? { styles } : {})}
              {...(onColumnSort ? { onColumnSort } : {})}
              {...(onManageColumns ? { onManageColumns } : {})}
              {...(draggedColumn != null ? { draggedColumn } : {})}
              {...(onColumnDragStart ? { onColumnDragStart } : {})}
              {...(onColumnDragOver ? { onColumnDragOver } : {})}
              {...(onColumnDrop ? { onColumnDrop } : {})}
              {...(onColumnDragEnd ? { onColumnDragEnd } : {})}
            />
          </thead>
          <tbody>
            {isCreatingRow &&
              creationRowPosition === 'top' &&
              (!permissions || permissions.access === 'write') && (
                <CreationRow
                  columns={updatedColumns}
                  creationRowData={creationRowData}
                  {...(onCreationFieldChange ? { onCreationFieldChange } : {})}
                  {...(onCreateRowSave ? { onCreateRowSave } : {})}
                  {...(onCreateRowCancel ? { onCreateRowCancel } : {})}
                  {...(styles ? { styles } : {})}
                  {...(permissions ? { permissions } : {})}
                />
              )}
            <Rows
              rows={rows}
              columns={updatedColumns}
              selectedRowIds={selectedRowIds}
              {...(onRowClick ? { onRowClick } : {})}
              {...(styles ? { styles } : {})}
              {...(editingCell ? { editingCell } : {})}
              {...(editingValue != null ? { editingValue } : {})}
              {...(onCellClick ? { onCellClick: handleCellClick } : {})}
              {...(onCellSave ? { onCellSave } : {})}
              {...(onCellCancel ? { onCellCancel } : {})}
              {...(onEditingValueChange ? { onEditingValueChange } : {})}
              {...(permissions ? { permissions } : {})}
            />
            {isCreatingRow &&
              creationRowPosition === 'bottom' &&
              (!permissions || permissions.access === 'write') && (
                <CreationRow
                  columns={updatedColumns}
                  creationRowData={creationRowData}
                  {...(onCreationFieldChange ? { onCreationFieldChange } : {})}
                  {...(onCreateRowSave ? { onCreateRowSave } : {})}
                  {...(onCreateRowCancel ? { onCreateRowCancel } : {})}
                  {...(styles ? { styles } : {})}
                  {...(permissions ? { permissions } : {})}
                />
              )}
          </tbody>
        </table>
      </div>

      {/* Composite Field Edit Modal */}
      {compositeEditingData && (
        <CompositeFieldEditModal
          open={true}
          onClose={handleCompositeEditClose}
          rowData={compositeEditingData.rowData}
          compositeFields={
            compositeEditingData.column.type as CompositeFieldConfig[]
          }
          onSave={handleCompositeFieldSave}
          {...(styles && { styles })}
        />
      )}
    </div>
  )
}

export default Table

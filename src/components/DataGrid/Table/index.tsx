'use client'

import React, { useState, useCallback } from 'react'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'
import CreationRow from './CreationRow'
import CompositeFieldEditModal from '../CompositeFieldEditModal'
import { useColumnResize } from '../utils/useColumnResize'
import cssStyles from '../DataGrid.module.css'
import type { TableProps, ColumnDef, CompositeFieldConfig } from '../types'

export function getRowId(row: {
  id?: string | number
  _id?: string | number
}): string {
  return String(row.id ?? row._id ?? '')
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
  const theme = styles?.theme || 'light'

  // Use column resize hook
  const { updatedColumns, isResizing, resizingColumn, getResizeHandleProps } =
    useColumnResize({
      columns,
      ...(onColumnResize ? { onColumnResize } : {}),
    })

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

  return (
    <div className={cssStyles.tableContainer} data-theme={theme}>
      <div className={cssStyles.tableWrapper}>
        <table className={cssStyles.table}>
          <thead className={cssStyles.thead}>
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

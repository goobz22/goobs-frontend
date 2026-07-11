/**
 * =============================================================================
 * TABLE COMPONENT
 * =============================================================================
 *
 * The Table component renders the main data table structure within the DataGrid.
 * It's responsible for:
 *
 * 1. STRUCTURE:
 *    - <table> with <thead> and <tbody>
 *    - ColumnHeaderRow for column headers with sort/resize/drag
 *    - Rows for data display with inline editing
 *    - CreationRow for adding new entries (optional)
 *
 * 2. COLUMN RESIZING:
 *    - Uses useColumnResize hook for drag-to-resize columns
 *    - Tracks resize state and provides resize handle props
 *
 * 3. COMPOSITE FIELD EDITING:
 *    - Detects when a column has CompositeFieldConfig[] type
 *    - Opens modal dialog for multi-field editing
 *    - Manages composite editing state locally
 *
 * COMPONENT HIERARCHY:
 * --------------------
 * Table (this file)
 *   ├── ColumnHeaderRow        <- Column headers with interactive features
 *   │     └── ColumnHeader[]   <- Individual header cells
 *   ├── CreationRow (optional) <- Form row for creating new entries
 *   │     └── EditableCell[]   <- Input fields for each column
 *   ├── Rows                   <- Container for data rows
 *   │     └── Row[]            <- Individual data rows
 *   │           └── Cell[]     <- Data cells with optional editing
 *   └── CompositeFieldEditModal <- Modal for multi-field editing
 *
 * PROPS FLOW:
 * -----------
 * Props come from DataGrid parent and include:
 * - Column definitions and row data
 * - Selection state (selectedRowIds, allRowsSelected, etc.)
 * - Editing state (editingCell, editingValue, etc.)
 * - Event handlers (onRowClick, onCellSave, etc.)
 * - Styling and permissions
 *
 * =============================================================================
 */

'use client'

import React, { useState, useCallback } from 'react'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'
import CreationRow from './CreationRow'
import CompositeFieldEditModal from '../CompositeFieldEditModal'
import { useColumnResize } from '../utils/useColumnResize'
import cssStyles from '../DataGrid.module.css'
import type { TableProps, ColumnDef, CompositeFieldConfig } from '../types'

/**
 * Extract row identifier from a row object.
 * Prefers _id (MongoDB convention) over id.
 *
 * @param row - Row object with id or _id property
 * @returns String identifier for the row
 *
 * @example
 * getRowId({ _id: '507f1f77bcf86cd799439011' }) // '507f1f77bcf86cd799439011'
 * getRowId({ id: 123 }) // '123'
 * getRowId({}) // ''
 */
export function getRowId(row: {
  id?: string | number
  _id?: string | number
}): string {
  return String(row.id ?? row._id ?? '')
}

/**
 * TABLE COMPONENT
 * ---------------
 * Renders the HTML table structure with headers, data rows, and optional
 * creation row for adding new entries.
 */
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
  onCompositeFieldSave,
  onCellCancel,
  onEditingValueChange,
  isCreatingRow = false,
  creationRowData = {},
  onCreationFieldChange,
  onCreateRowSave,
  onCreateRowCancel,
  creationRowPosition = 'top',
  onColumnSort,
  sortField,
  sortDirection,
  onManageColumns,
  draggedColumn,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
  permissions,
}: TableProps) {
  /** Current theme for styling */
  const theme = styles?.theme || 'light'

  // ═══════════════════════════════════════════════════════════════════════════
  // COLUMN RESIZE HOOK
  // ═══════════════════════════════════════════════════════════════════════════
  // Provides column resize functionality via drag handles.
  // Returns updated columns with computed widths and resize event handlers.

  const { updatedColumns, isResizing, resizingColumn, getResizeHandleProps } =
    useColumnResize({
      columns,
      ...(onColumnResize ? { onColumnResize } : {}),
    })

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPOSITE EDITING STATE
  // ═══════════════════════════════════════════════════════════════════════════
  // When a column's type is CompositeFieldConfig[], clicking that cell opens
  // a modal for editing multiple fields at once. This state tracks the modal.

  /**
   * State for composite field editing modal.
   * - rowData: The row being edited
   * - column: The column definition with CompositeFieldConfig[]
   */
  const [compositeEditingData, setCompositeEditingData] = useState<{
    rowData: any
    column: ColumnDef
  } | null>(null)

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPOSITE EDITING HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle save from composite field edit modal.
   * Prefers the batched `onCompositeFieldSave` callback (the documented
   * "all field updates at once" contract) when the parent wired one;
   * otherwise falls back to calling onCellSave once per updated field.
   * Uses setTimeout to defer state updates and avoid render conflicts.
   *
   * @param fieldUpdates - Object with field:value pairs for all changed fields
   */
  const handleCompositeFieldSave = useCallback(
    (fieldUpdates: Record<string, any>) => {
      if (compositeEditingData) {
        // Capture the rowId before clearing the state
        const rowId = getRowId(compositeEditingData.rowData)

        if (onCompositeFieldSave) {
          // Defer the state updates to avoid setState during render
          setTimeout(() => {
            onCompositeFieldSave(rowId, fieldUpdates)
          }, 0)
        } else if (onCellSave) {
          setTimeout(() => {
            // Call onCellSave for each field that was updated
            Object.entries(fieldUpdates).forEach(([field, value]) => {
              onCellSave(rowId, field, value)
            })
          }, 0)
        }
      }
      setCompositeEditingData(null)
    },
    [compositeEditingData, onCellSave, onCompositeFieldSave]
  )

  /** Close composite edit modal without saving. */
  const handleCompositeEditClose = useCallback(() => {
    setCompositeEditingData(null)
  }, [])

  /**
   * Enhanced cell click handler that detects composite fields.
   * - If column type is CompositeFieldConfig[], opens modal for multi-field edit
   * - Otherwise, delegates to standard inline editing via onCellClick
   *
   * @param rowId - ID of the clicked row
   * @param field - Field name of the clicked cell
   * @param currentValue - Current value in the cell
   */
  const handleCellClick = useCallback(
    (rowId: string, field: string, currentValue: unknown) => {
      // Find the column to check if it has composite fields
      const column = columns.find(col => col.field === field)

      if (column && Array.isArray(column.type)) {
        // Composite field: open modal for multi-field editing
        const rowData = rows.find(row => getRowId(row) === rowId)
        if (rowData) {
          setCompositeEditingData({
            rowData,
            column,
          })
        }
      } else {
        // Regular field: use inline editing
        onCellClick?.(rowId, field, currentValue)
      }
    },
    [columns, rows, onCellClick]
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={cssStyles.tableContainer} data-theme={theme}>
      <div className={cssStyles.tableWrapper}>
        <table className={cssStyles.table}>
          {/* ─────────────────────────────────────────────────────────────────
              TABLE HEADER
              Renders column headers with sort, resize, and drag-drop support.
              ───────────────────────────────────────────────────────────────── */}
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
              {...(sortField != null ? { sortField } : {})}
              {...(sortDirection ? { sortDirection } : {})}
              {...(onManageColumns ? { onManageColumns } : {})}
              {...(draggedColumn != null ? { draggedColumn } : {})}
              {...(onColumnDragStart ? { onColumnDragStart } : {})}
              {...(onColumnDragOver ? { onColumnDragOver } : {})}
              {...(onColumnDrop ? { onColumnDrop } : {})}
              {...(onColumnDragEnd ? { onColumnDragEnd } : {})}
            />
          </thead>
          <tbody>
            {/* ─────────────────────────────────────────────────────────────────
                CREATION ROW (TOP POSITION)
                Inline form for creating new rows. Only shown when:
                - isCreatingRow is true
                - creationRowPosition is 'top'
                - User has write permissions
                ───────────────────────────────────────────────────────────────── */}
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

            {/* ─────────────────────────────────────────────────────────────────
                DATA ROWS
                Renders all visible rows with selection, editing support.
                Uses handleCellClick which routes to inline or composite editing.
                ───────────────────────────────────────────────────────────────── */}
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

            {/* ─────────────────────────────────────────────────────────────────
                CREATION ROW (BOTTOM POSITION)
                Alternative position for creation row below existing data.
                ───────────────────────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────────────────────────────
          COMPOSITE FIELD EDIT MODAL
          Modal dialog for editing multiple fields at once.
          Opens when user clicks a cell with CompositeFieldConfig[] type.
          ───────────────────────────────────────────────────────────────────── */}
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

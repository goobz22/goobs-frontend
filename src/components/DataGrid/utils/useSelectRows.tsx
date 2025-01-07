'use client'

import type { RowData } from '../types'
import { getRowId } from '../Table' // Adjust this import if getRowId is in a different file

/**
 * Select or deselect **all** rows.
 * If everything is already selected, this will clear the selection.
 * Otherwise, it will select all.
 */
export function selectAllRows(
  rows: RowData[],
  selectedRows: string[],
  onSelectionChange?: (newSelectedIds: string[]) => void
) {
  if (!onSelectionChange) return

  const allSelected =
    rows.length > 0 && rows.every(r => selectedRows.includes(getRowId(r)))

  // If everything is already selected, unselect all; otherwise, select all
  if (allSelected) {
    onSelectionChange([])
  } else {
    onSelectionChange(rows.map(r => getRowId(r)))
  }
}

/**
 * Toggle a single row in or out of the selection.
 */
export function selectRow(
  row: RowData,
  selectedRows: string[],
  onSelectionChange?: (newSelectedIds: string[]) => void
) {
  if (!onSelectionChange) return
  const rowId = row._id ?? row.id
  if (!rowId) return

  // If row is selected, remove it; otherwise, add it
  const newSelected = selectedRows.includes(rowId)
    ? selectedRows.filter(id => id !== rowId)
    : [...selectedRows, rowId]

  onSelectionChange(newSelected)
}

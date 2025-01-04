'use client'

import { RowData } from '../types'

interface UseRowClickProps {
  selectedColumns: string[]
  clearColumnSelection: () => void
  selectedRows: string[]
  handleSelectionChange: (newSelectedIds: string[]) => void
  toggleColumnSelection: (field: string) => void
}

/**
 * A custom hook for handling row clicks and column-header clicks in the DataGrid.
 */
export function useRowClick({
  selectedColumns,
  clearColumnSelection,
  selectedRows,
  handleSelectionChange,
  toggleColumnSelection,
}: UseRowClickProps) {
  /**
   * When a row is clicked:
   * - If any column is highlighted, clear column selection.
   * - Then toggle the clicked row in/out of selection.
   */
  const handleRowClick = (row: RowData) => {
    if (selectedColumns.length > 0) {
      clearColumnSelection()
    }

    const rowId = row._id || row.id
    if (rowId) {
      const newSel = selectedRows.includes(rowId)
        ? selectedRows.filter(id => id !== rowId)
        : [...selectedRows, rowId]
      handleSelectionChange(newSel)
    }
  }

  /**
   * When a column header is clicked:
   * - If any row is selected, clear row selection.
   * - Then toggle the clicked column.
   */
  const handleColumnHeaderClick = (field: string) => {
    if (selectedRows.length > 0) {
      handleSelectionChange([])
    }
    toggleColumnSelection(field)
  }

  return { handleRowClick, handleColumnHeaderClick }
}

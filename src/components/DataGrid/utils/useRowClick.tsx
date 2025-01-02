'use client'

import React from 'react'
import type { RowData } from '../Table'

interface UseRowClickParams {
  selectedColumns: string[]
  clearColumnSelection: () => void
  selectedRows: string[]
  handleSelectionChange: (newSelectedIds: string[]) => void
}

export default function useRowClick({
  selectedColumns,
  clearColumnSelection,
  selectedRows,
  handleSelectionChange,
}: UseRowClickParams) {
  /**
   * When user clicks a row:
   * 1. If a column is selected, clear it.
   * 2. Then toggle the clicked row in the selectedRows array.
   */
  const handleRowClick = React.useCallback(
    (row: RowData) => {
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
    },
    [selectedColumns, clearColumnSelection, selectedRows, handleSelectionChange]
  )

  return { handleRowClick }
}

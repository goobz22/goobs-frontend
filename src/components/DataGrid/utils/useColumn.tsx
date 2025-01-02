'use client'
import React from 'react'

/**
 * This hook manages the selection of columns (by their "field" string).
 * When a column is selected, any cell in that column can be highlighted.
 */
export function useColumnSelection() {
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([])

  /**
   * Toggle whether a given column "field" is currently selected.
   * If it was selected, remove it. Otherwise, add it.
   */
  const toggleColumnSelection = React.useCallback((field: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(field)) {
        return prev.filter(col => col !== field)
      } else {
        return [...prev, field]
      }
    })
  }, [])

  /**
   * Clears all column selections at once.
   */
  const clearColumnSelection = React.useCallback(() => {
    setSelectedColumns([])
  }, [])

  return {
    selectedColumns,
    toggleColumnSelection,
    clearColumnSelection,
  }
}

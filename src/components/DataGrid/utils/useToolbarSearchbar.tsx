'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import type { ColumnDef, RowData } from '../types'
import type { SearchbarProps } from '../../Searchbar'

// If you'd like to pass more config (e.g., for toggling columns), you can expand this interface
interface UseSearchbarProps {
  columns: ColumnDef[]
  rows: RowData[]
  // Optional: This can merge the parent's SearchbarProps, so we pass it through in updatedSearchbarProps.
  searchbarProps?: Omit<SearchbarProps, 'onChange' | 'value'>
  // A function to update column visibility (Jotai in your case). If omitted, no column toggling occurs.
  updateVisibility?: (action: {
    type: 'save'
    newState: Record<string, boolean>
  }) => void
}

/**
 * A custom hook that manages:
 * - The local searchValue state
 * - Generating tags from that searchValue
 * - Filtering rows based on search terms
 * - Determining which columns should be visible based on search matches
 * - Optionally updating column visibility (if `updateVisibility` is provided)
 */
export const useSearchbar = ({
  columns,
  rows,
  searchbarProps,
  updateVisibility,
}: UseSearchbarProps) => {
  // Local state for the search input
  const [searchValue, setSearchValue] = useState('')

  // Derived "tags" array from the current searchValue
  const [tags, setTags] = useState<string[]>([])

  // Whenever searchValue changes, split it into tags (space-delimited)
  useEffect(() => {
    setTags(searchValue.trim() ? searchValue.toLowerCase().split(' ') : [])
  }, [searchValue])

  // Handler for the text input's onChange
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      setSearchValue(newValue)
    },
    []
  )

  // Filter the rows based on the current tags
  const filteredRows = useMemo(() => {
    if (!searchValue.trim()) {
      return rows
    }

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    return rows.filter(row => {
      // A row matches if ANY of the searchTerms match ANY column
      return searchTerms.some(term => {
        return columns.some(column => {
          // Check column header text
          const headerMatch = column.headerName?.toLowerCase().includes(term)
          // Check column field name
          const fieldMatch = column.field.toLowerCase().includes(term)
          // Check the cell's value
          const cellValue = row[column.field]
          const cellMatch =
            cellValue != null && String(cellValue).toLowerCase().includes(term)

          return headerMatch || fieldMatch || cellMatch
        })
      })
    })
  }, [rows, searchValue, columns])

  // Determine which columns should remain visible based on the current search
  const visibleColumns = useMemo(() => {
    if (!searchValue.trim()) {
      // If no search is active, show all columns
      return new Set(columns.map(col => col.field))
    }

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    return new Set(
      columns
        .filter(col => {
          // A column is "visible" if ANY search term matches:
          //  (a) the column header
          //  (b) the column field name
          //  (c) at least one row's cell in that column
          return searchTerms.some(term => {
            const headerMatch = col.headerName?.toLowerCase().includes(term)
            const fieldMatch = col.field.toLowerCase().includes(term)
            const hasMatchingData = filteredRows.some(row => {
              const cellValue = row[col.field]
              return (
                cellValue != null &&
                String(cellValue).toLowerCase().includes(term)
              )
            })

            return headerMatch || fieldMatch || hasMatchingData
          })
        })
        .map(col => col.field)
    )
  }, [columns, searchValue, filteredRows])

  // If the user typed something (tags exist), optionally update global column visibility
  useEffect(() => {
    if (!updateVisibility) return // Only run if we have an update function
    if (tags.length === 0) return // If no tags, do nothing here

    const newVisibility: Record<string, boolean> = {}
    columns.forEach(column => {
      newVisibility[column.field] = visibleColumns.has(column.field)
    })
    console.log('Updating column visibility from search:', newVisibility)
    updateVisibility({
      type: 'save',
      newState: newVisibility,
    })
  }, [tags, columns, visibleColumns, updateVisibility])

  // Combine parent's searchbarProps with our local search logic
  const updatedSearchbarProps: SearchbarProps = {
    ...searchbarProps,
    value: searchValue,
    onChange: handleSearchChange,
  }

  return {
    // The actual search input value and its onChange
    searchValue,
    setSearchValue,
    handleSearchChange,
    // The filtered set of rows
    filteredRows,
    // The set (or list) of columns that pass the search filter
    visibleColumns,
    // The split tags
    tags,
    // The searchbar props to pass into <Searchbar /> if needed
    updatedSearchbarProps,
  }
}

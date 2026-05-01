'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import type { ColumnDef, RowData } from '../types'
import type { SearchbarProps } from '../../Field/Search'

interface UseSearchbarProps {
  columns: ColumnDef[]
  rows: RowData[]
  /** Optional: merges the parent's SearchbarProps, so we pass them through. */
  searchbarProps?: Omit<SearchbarProps, 'onChange' | 'value'>
  /** If provided, we update column visibility (e.g. via Jotai). */
  updateVisibility?: (action: {
    type: 'save'
    newState: Record<string, boolean>
  }) => void
}

/**
 * Safely convert a cell value to a lowercase string without using the default
 * `[object Object]` format for objects.
 */
function toLowerCaseString(value: unknown): string {
  // 1. Null or undefined => empty string
  if (value == null) {
    return ''
  }

  // 2. Objects/arrays => JSON-stringify safely
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).toLowerCase()
    } catch {
      // If there's a circular reference or another error, return empty
      return ''
    }
  }

  // 3. Strings => just lowercase
  if (typeof value === 'string') {
    return value.toLowerCase()
  }

  // 4. Numbers and booleans => safe to convert
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).toLowerCase()
  }

  // 5. Anything else (symbols, functions, etc.) => empty string
  return ''
}

/**
 * A custom hook that manages:
 * - Local searchValue state
 * - Splitting that searchValue into "tags"
 * - Filtering rows based on search terms
 * - Determining which columns should be visible
 * - Optionally updating column visibility
 */
export const useSearchbar = ({
  columns,
  rows,
  searchbarProps,
  updateVisibility,
}: UseSearchbarProps) => {
  // Local state for the search input
  const [searchValue, setSearchValue] = useState('')

  // Derived "tags" array from the current searchValue using useMemo (not useState + useEffect)
  const tags = useMemo(
    () => (searchValue.trim() ? searchValue.toLowerCase().split(' ') : []),
    [searchValue]
  )

  // Handler for the text input's onChange — value-only signature
  // matches the new Searchbar contract.
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  // Filter the rows based on the current tags
  const filteredRows = useMemo(() => {
    if (!searchValue.trim()) return rows

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    return rows.filter(row =>
      // A row matches if ANY of the searchTerms match ANY column
      searchTerms.some(term =>
        columns.some(column => {
          // Check column header text
          const headerMatch = column.headerName?.toLowerCase().includes(term)
          // Check column field name
          const fieldMatch = column.field.toLowerCase().includes(term)
          // Check the cell's value (safely)
          const cellText = toLowerCaseString(row[column.field])
          const cellMatch = cellText.includes(term)

          return headerMatch || fieldMatch || cellMatch
        })
      )
    )
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
        .filter(col =>
          // A column is "visible" if ANY search term matches:
          // (a) the column header
          // (b) the column field name
          // (c) at least one row's cell in that column
          searchTerms.some(term => {
            const headerMatch = col.headerName?.toLowerCase().includes(term)
            const fieldMatch = col.field.toLowerCase().includes(term)
            const hasMatchingData = filteredRows.some(row => {
              const cellText = toLowerCaseString(row[col.field])
              return cellText.includes(term)
            })
            return headerMatch || fieldMatch || hasMatchingData
          })
        )
        .map(col => col.field)
    )
  }, [columns, searchValue, filteredRows])

  // If the user typed something (tags exist), optionally update global column visibility
  useEffect(() => {
    if (!updateVisibility) return
    if (tags.length === 0) return // If no tags, do nothing here

    const newVisibility: Record<string, boolean> = {}
    columns.forEach(column => {
      newVisibility[column.field] = visibleColumns.has(column.field)
    })
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
    label: 'Search DataGrid',
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

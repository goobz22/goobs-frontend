import React, { useCallback, useMemo, useState, useEffect } from 'react'
import type { ColumnDef, RowData } from '../Table'

interface UseSearchbarProps {
  columns: ColumnDef[]
  rows: RowData[]
  searchValue: string
  setSearchValue: (value: string) => void
}

export const useSearchbar = ({
  columns,
  rows,
  searchValue,
  setSearchValue,
}: UseSearchbarProps) => {
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    console.log('Search value changed:', searchValue)
    setTags(searchValue.trim() ? searchValue.toLowerCase().split(' ') : [])
  }, [searchValue])

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      console.log('Search input changed:', {
        oldValue: searchValue,
        newValue,
      })
      setSearchValue(newValue)
    },
    [searchValue, setSearchValue]
  )

  const filteredRows = useMemo(() => {
    if (!searchValue.trim()) {
      return rows
    }

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    return rows.filter(row => {
      return searchTerms.some(term => {
        return columns.some(column => {
          // Check column header name
          const headerMatch = column.headerName?.toLowerCase().includes(term)

          // Check column field name
          const fieldMatch = column.field.toLowerCase().includes(term)

          // Check cell value
          const cellValue = row[column.field]
          const valueMatch =
            cellValue != null && String(cellValue).toLowerCase().includes(term)

          console.log('Searching:', {
            field: column.field,
            header: column.headerName,
            value: cellValue,
            searchTerm: term,
            headerMatch,
            fieldMatch,
            valueMatch,
          })

          return headerMatch || fieldMatch || valueMatch
        })
      })
    })
  }, [rows, searchValue, columns])

  const visibleColumns = useMemo(() => {
    if (!searchValue.trim()) {
      return new Set(columns.map(col => col.field))
    }

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    return new Set(
      columns
        .filter(col => {
          return searchTerms.some(term => {
            // Check column header name
            const headerMatch = col.headerName?.toLowerCase().includes(term)

            // Check column field name
            const fieldMatch = col.field.toLowerCase().includes(term)

            // Check if any row has matching data in this column
            const hasMatchingData = filteredRows.some(row => {
              const cellValue = row[col.field]
              return (
                cellValue != null &&
                String(cellValue).toLowerCase().includes(term)
              )
            })

            console.log('Column visibility check:', {
              field: col.field,
              header: col.headerName,
              searchTerm: term,
              headerMatch,
              fieldMatch,
              hasMatchingData,
            })

            return headerMatch || fieldMatch || hasMatchingData
          })
        })
        .map(col => col.field)
    )
  }, [columns, searchValue, filteredRows])

  return {
    searchValue,
    handleSearchChange,
    filteredRows,
    visibleColumns,
    tags,
  }
}

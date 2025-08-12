'use client'

import React, { useState, useEffect } from 'react'
import SearchableSimple from '../../Field/Dropdown/SearchableSimple'
import DateField from '../../Field/Date/DateField'
import DateRange from '../../Field/Date/DateRange'
import Searchbar from '../../Field/Search'
import type { DataGridFilter, ColumnDef, RowData } from '../types'
import type { DataGridStyles } from '../../../theme'
import { SACRED_GLYPHS } from '../../../theme'

export interface FilterSectionProps {
  filters?: DataGridFilter[] | undefined
  columns?: ColumnDef[]
  rows?: RowData[]
  onSearchFilter?: (
    searchTerm: string,
    filteredRows: RowData[],
    visibleColumns: string[]
  ) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

function useWindowSize(): [number, number] {
  const [size, setSize] = useState<[number, number]>([0, 0])
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters = [],
  columns = [],
  rows = [],
  onSearchFilter,
  styles,
}) => {
  const [width] = useWindowSize()
  const [searchTerm, setSearchTerm] = useState('')
  const isMobile = width < 600
  const isTablet = width < 900
  const isSacredTheme = styles?.theme === 'sacred'

  // Helper function to safely convert values to lowercase strings for searching
  const toLowerCaseString = (value: unknown): string => {
    if (value === null || value === undefined) return ''

    // Handle objects by converting to JSON string or using toString if available
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).toLowerCase()
      } catch {
        return ''
      }
    }

    // Handle primitives safely
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value).toLowerCase()
    }

    return ''
  }

  // Filter rows based on search term
  const getFilteredRows = (searchValue: string): RowData[] => {
    if (!searchValue.trim() || !rows.length) return rows

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    // Separate terms into column header matches and content matches
    const columnHeaderTerms: string[] = []
    const contentTerms: string[] = []

    searchTerms.forEach(term => {
      const isColumnHeader = columns.some(column => {
        const headerMatch = column.headerName?.toLowerCase().includes(term)
        const fieldMatch = column.field.toLowerCase().includes(term)
        return headerMatch || fieldMatch
      })

      if (isColumnHeader) {
        columnHeaderTerms.push(term)
      } else {
        contentTerms.push(term)
      }
    })

    // If only column headers are being searched (no content terms), show all rows
    if (columnHeaderTerms.length > 0 && contentTerms.length === 0) {
      return rows
    }

    // If there are content terms, filter rows by those terms
    if (contentTerms.length > 0) {
      return rows.filter(row =>
        contentTerms.some(term =>
          columns.some(column => {
            const cellValue = toLowerCaseString(row[column.field])
            return cellValue.includes(term)
          })
        )
      )
    }

    // Fallback: show all rows
    return rows
  }

  // Get visible columns based on search term
  const getVisibleColumns = (searchValue: string): string[] => {
    if (!searchValue.trim() || !columns.length) {
      return columns.map(col => col.field)
    }

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    return columns
      .filter(col =>
        searchTerms.some(term => {
          // Check column header and field name
          const headerMatch = col.headerName?.toLowerCase().includes(term)
          const fieldMatch = col.field.toLowerCase().includes(term)

          // Check if any rows have matching data in this column
          const hasMatchingData = rows.some(row => {
            const cellValue = toLowerCaseString(row[col.field])
            return cellValue.includes(term)
          })

          return headerMatch || fieldMatch || hasMatchingData
        })
      )
      .map(col => col.field)
  }

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)

    if (onSearchFilter) {
      const filteredRows = getFilteredRows(newSearchTerm)
      const visibleColumns = getVisibleColumns(newSearchTerm)
      onSearchFilter(newSearchTerm, filteredRows, visibleColumns)
    }
  }

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet =
        typeof document !== 'undefined' && document.styleSheets?.length
          ? document.styleSheets[0]
          : undefined
      const keyframes = `
        @keyframes sacredGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
        }
        @keyframes glyphRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sacredFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-3px) scale(1.05); opacity: 0.8; }
        }
      `
      if (styleSheet) {
        try {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
        } catch {
          // Keyframes might already exist
        }
      }
    }
  }, [isSacredTheme])

  // Always render the search UI. If no columns are provided, the search will be a no-op.

  // Determine grid columns based on screen size and number of filters + searchbar
  const getGridColumns = () => {
    const totalItems = (filters?.length ?? 0) + 1 // +1 for searchbar
    const hasDateRange = filters?.some(f => f.type === 'daterange') ?? false

    if (isMobile) return { gridTemplateColumns: '1fr' }
    if (isTablet) {
      // More conservative for tablet to prevent overflow
      return totalItems <= 2
        ? { gridTemplateColumns: '1fr' }
        : { gridTemplateColumns: 'repeat(2, 1fr)' }
    }

    // Desktop - be conservative to prevent overflow
    if (totalItems === 1) {
      return { gridTemplateColumns: '1fr' }
    } else if (totalItems === 2) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' }
    } else if (totalItems === 3) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' }
    } else if (totalItems === 4) {
      // If there's a date range, use 2 columns, otherwise 3
      return hasDateRange
        ? { gridTemplateColumns: 'repeat(2, 1fr)' }
        : { gridTemplateColumns: 'repeat(3, 1fr)' }
    } else {
      // For 5+ items, max 3 columns to prevent overflow
      return hasDateRange
        ? { gridTemplateColumns: 'repeat(2, 1fr)' }
        : { gridTemplateColumns: 'repeat(3, 1fr)' }
    }
  }

  // Helper function to render the appropriate filter component
  const renderFilterComponent = (filter: DataGridFilter) => {
    // Check if this is a date range filter
    if (filter.type === 'daterange') {
      return (
        <div
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        >
          <DateRange
            startLabel="From Date"
            endLabel="To Date"
            value={filter.value as { start: Date | null; end: Date | null }}
            onChange={
              filter.onChange as (value: {
                start: Date | null
                end: Date | null
              }) => void
            }
            styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
          />
        </div>
      )
    }

    // Check if this is a date filter
    if (filter.type === 'date') {
      return (
        <div
          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
        >
          <DateField
            label={filter.label}
            value={
              (filter.value as string) ? new Date(filter.value as string) : null
            }
            onChange={filter.onChange as (date: Date | null) => void}
            {...(filter.placeholder !== undefined
              ? { placeholder: filter.placeholder }
              : {})}
            styles={{
              theme: isSacredTheme ? 'sacred' : 'light',
            }}
            disableFutureDateValidation={true}
          />
        </div>
      )
    }

    // Default to SearchableSimple for regular filters
    return (
      <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <SearchableSimple
          label={filter.label}
          options={filter.options || []}
          defaultValue={filter.value === 'all' ? '' : (filter.value as string)}
          onChange={
            filter.onChange as (value: { value: string } | null) => void
          }
          {...(filter.placeholder !== undefined
            ? { placeholder: filter.placeholder }
            : {})}
          styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
        />
      </div>
    )
  }

  const filterSectionStyle = {
    width: '100%',
    maxWidth: '100%',
    position: 'relative' as const,
    padding: '1rem',
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
    ...(isSacredTheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backgroundImage:
        'linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, transparent 50%, transparent 100%)',
    }),
  }

  const gridStyle = {
    display: 'grid',
    gap: '8px',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    ...getGridColumns(),
  }

  return (
    <div style={filterSectionStyle}>
      {/* Sacred decorative glyphs */}
      {isSacredTheme && (
        <>
          <div
            style={{
              position: 'absolute',
              fontSize: '12px',
              color: 'rgba(255, 215, 0, 0.3)',
              animation: 'sacredFloat 2s ease-in-out infinite',
              zIndex: 10,
              top: '8px',
              left: '8px',
            }}
          >
            {SACRED_GLYPHS[15]} {/* Filter/sieve symbol */}
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '12px',
              color: 'rgba(255, 215, 0, 0.3)',
              animation: 'sacredFloat 2s ease-in-out infinite',
              zIndex: 10,
              bottom: '8px',
              right: '8px',
              animationDirection: 'reverse',
            }}
          >
            {SACRED_GLYPHS[16]} {/* Filter/refine symbol */}
          </div>
        </>
      )}

      <div style={gridStyle}>
        {/* Searchbar - always first */}
        <div
          style={{
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box' as const,
            overflow: 'hidden',
          }}
        >
          <Searchbar
            label="Search"
            placeholder="Search data..."
            value={searchTerm}
            onChange={handleSearchChange}
            styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
          />
        </div>

        {/* Other filters */}
        {filters?.map((filter, index) => (
          <div
            key={`${filter.label}-${index}`}
            style={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box' as const,
              overflow: 'hidden',
              ...(filter.type === 'daterange' && !isMobile
                ? { gridColumn: 'span 2' }
                : {}),
            }}
          >
            {renderFilterComponent(filter)}
          </div>
        ))}
      </div>

      {/* Bottom sacred decoration */}
      {isSacredTheme && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '2px',
            opacity: 0.5,
          }}
        >
          {[SACRED_GLYPHS[4], SACRED_GLYPHS[5], SACRED_GLYPHS[4]].map(
            (glyph, i) => (
              <div
                key={i}
                style={{
                  color: 'rgba(255, 215, 0, 0.4)',
                  fontSize: '8px',
                  animation: `sacredFloat ${2 + i * 0.3}s ease-in-out infinite`,
                }}
              >
                {glyph}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default FilterSection

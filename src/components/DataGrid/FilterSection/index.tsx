/**
 * =============================================================================
 * FILTER SECTION COMPONENT
 * =============================================================================
 *
 * Provides search and filtering capabilities for the DataGrid.
 * Always renders a search bar, with optional additional filters.
 *
 * LAYOUT:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────────┐ │
 * │ │   Search     │ │  Dropdown    │ │       Date Range                 │ │
 * │ │   (always)   │ │  Filter      │ │   (spans 2 columns)              │ │
 * │ └──────────────┘ └──────────────┘ └──────────────────────────────────┘ │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * SEARCH FUNCTIONALITY:
 * - Searches across ALL columns in the data
 * - Smart detection: if search term matches column header, shows all rows
 * - Content search: filters rows where any cell contains the search term
 * - Case-insensitive matching
 * - Handles objects by JSON stringifying them
 *
 * FILTER TYPES:
 * 1. Dropdown: Searchable select with predefined options
 * 2. Date: Single date picker
 * 3. DateRange: Start and end date pickers (spans 2 columns)
 *
 * RESPONSIVE LAYOUT:
 * - Mobile (< 600px): Single column
 * - Tablet (< 900px): 1-2 columns
 * - Desktop: Up to 3 columns depending on filter count
 *
 * COLLAPSIBLE MODE:
 * - When collapsible=true, wraps content in an Accordion
 * - Useful when filters take up too much vertical space
 *
 * =============================================================================
 */

'use client'

import React, { useState, useEffect } from 'react'
import SearchableSimple, {
  type DropdownOption,
} from '../../Field/Dropdown/SearchableSimple'
import DateField from '../../Field/Date/DateField'
import DateRange from '../../Field/Date/DateRange'
import Searchbar from '../../Field/Search'
import Accordion from '../../Accordion'
import type { DataGridFilter, ColumnDef, RowData } from '../types'
import { type DataGridStyles } from '../../../theme'

/**
 * Props for the FilterSection component.
 */
export interface FilterSectionProps {
  /** Optional array of filter configurations (dropdowns, dates, etc.) */
  filters?: DataGridFilter[] | undefined
  /** Column definitions for search functionality */
  columns?: ColumnDef[]
  /** Row data for search functionality */
  rows?: RowData[]
  /**
   * Callback when search/filter changes.
   * @param searchTerm - Current search input value
   * @param filteredRows - Rows after applying search filter
   * @param visibleColumns - Column fields that match the search
   */
  onSearchFilter?: (
    searchTerm: string,
    filteredRows: RowData[],
    visibleColumns: string[]
  ) => void
  /** Theme and style configuration */
  styles?: DataGridStyles
  /** Wrap filter section in collapsible accordion */
  collapsible?: boolean
  /** If collapsible, start expanded. Default: false */
  defaultExpanded?: boolean
}

/**
 * Hook to track window dimensions for responsive layout.
 * Returns [width, height, isReady] where isReady indicates client-side hydration complete.
 */
function useWindowSize(): [number, number, boolean] {
  const [size, setSize] = useState<[number, number]>([
    typeof window !== 'undefined' ? window.innerWidth : 1024,
    typeof window !== 'undefined' ? window.innerHeight : 768,
  ])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
      setIsReady(true)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return [size[0], size[1], isReady]
}

/**
 * FILTER SECTION COMPONENT
 * ------------------------
 * Renders search bar and optional filter controls above the DataGrid table.
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  filters = [],
  columns = [],
  rows = [],
  onSearchFilter,
  styles,
  collapsible = false,
  defaultExpanded = false,
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE AND RESPONSIVE DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  const [width, , isReady] = useWindowSize()
  const [searchTerm, setSearchTerm] = useState('')

  /** Mobile breakpoint (< 600px) */
  const isMobile = width < 600
  /** Tablet breakpoint (< 900px) */
  const isTablet = width < 900
  /** Check if using sacred theme for styling */
  const isSacredTheme = styles?.theme === 'sacred'

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Safely convert any value to lowercase string for search matching.
   * Handles null, undefined, objects, and primitives.
   */
  const toLowerCaseString = (value: unknown): string => {
    if (value === null || value === undefined) return ''

    // Objects: JSON stringify for searchability
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).toLowerCase()
      } catch {
        return ''
      }
    }

    // Primitives: convert to string
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value).toLowerCase()
    }

    return ''
  }

  /**
   * FILTER ROWS BY SEARCH TERM
   * --------------------------
   * Implements smart search that distinguishes between:
   * 1. Column header searches (e.g., typing "email" to find email column)
   * 2. Content searches (e.g., typing "john" to find rows with "john")
   *
   * ALGORITHM:
   * 1. Split search into individual terms (space-separated)
   * 2. Categorize each term as column header match or content search
   * 3. If only header terms: show all rows (user is locating a column)
   * 4. If content terms: filter rows where any cell matches any term
   *
   * @param searchValue - User's search input
   * @returns Filtered array of rows
   */
  const getFilteredRows = (searchValue: string): RowData[] => {
    if (!searchValue.trim() || !rows.length) return rows

    const searchTerms = searchValue.toLowerCase().trim().split(' ')

    // Categorize terms: do they match column headers or are they content searches?
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

    // If only searching for column headers, show all rows
    // (user is trying to locate a column, not filter data)
    if (columnHeaderTerms.length > 0 && contentTerms.length === 0) {
      return rows
    }

    // Filter rows by content terms
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

  /**
   * GET VISIBLE COLUMNS BASED ON SEARCH
   * ------------------------------------
   * Determines which columns should be visible based on search term.
   * A column is visible if:
   * - Its header name matches the search
   * - Its field name matches the search
   * - Any row has matching data in that column
   *
   * NOTE: This function is called but column visibility is typically
   * managed by the parent DataGrid. The return value is passed to the
   * onSearchFilter callback for potential use.
   *
   * @param searchValue - User's search input
   * @returns Array of field names that should be visible
   */
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

  /**
   * Handle search input changes.
   * Filters rows and notifies parent via onSearchFilter callback.
   */
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RESPONSIVE GRID LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculate grid column layout based on screen size and filter count.
   * - Mobile: Single column
   * - Tablet: 1-2 columns
   * - Desktop: 1-3 columns based on item count
   * - Date ranges span 2 columns and affect layout calculations
   */
  const getGridColumns = () => {
    const totalItems = (filters?.length ?? 0) + 1 // +1 for searchbar
    const hasDateRange = filters?.some(f => f.type === 'daterange') ?? false

    if (isMobile) return { gridTemplateColumns: '1fr' }
    if (isTablet) {
      return totalItems <= 2
        ? { gridTemplateColumns: '1fr' }
        : { gridTemplateColumns: 'repeat(2, 1fr)' }
    }

    // Desktop layouts
    if (totalItems === 1) {
      return { gridTemplateColumns: '1fr' }
    } else if (totalItems === 2) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' }
    } else if (totalItems === 3) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' }
    } else if (totalItems === 4) {
      // Date ranges need more space
      return hasDateRange
        ? { gridTemplateColumns: 'repeat(2, 1fr)' }
        : { gridTemplateColumns: 'repeat(3, 1fr)' }
    } else {
      // 5+ items: max 3 columns
      return hasDateRange
        ? { gridTemplateColumns: 'repeat(2, 1fr)' }
        : { gridTemplateColumns: 'repeat(3, 1fr)' }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTER COMPONENT RENDERER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Render the appropriate input component based on filter type.
   * - 'daterange': DateRange component with start/end pickers
   * - 'date': Single DateField picker
   * - default: SearchableSimple dropdown
   */
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
          onChange={filter.onChange as (value: DropdownOption | null) => void}
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
    padding: '0.5rem',
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
    opacity: isReady ? 1 : 0,
    transition: 'opacity 0.15s ease-in',
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

  const filterContent = (
    <div style={filterSectionStyle}>
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
    </div>
  )

  if (collapsible) {
    return (
      <div
        style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem' }}
      >
        <Accordion
          summary="Search & Filters"
          details={filterContent}
          defaultExpanded={defaultExpanded}
          styles={{
            theme: styles?.theme || 'light',
          }}
        />
      </div>
    )
  }

  return filterContent
}

export default FilterSection

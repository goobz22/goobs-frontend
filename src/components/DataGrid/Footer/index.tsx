'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ColumnDef, RowData } from '../types'
import Dropdown from '../../Field/Dropdown/Regular'
import type { DataGridStyles } from '../../../theme'
import type { FieldStyleOverrides } from '../../Field/Shell/types'

// Settings cog icon
const SettingsIcon: React.FC<{ color?: string }> = ({
  color = 'currentColor',
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

// Download icon for CSV export
const DownloadIcon: React.FC<{ color?: string }> = ({
  color = 'currentColor',
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// PDF icon for PDF export
const PdfIcon: React.FC<{ color?: string }> = ({ color = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

// Inline SVG icons for pagination - cleaner and more controllable
const ChevronFirstIcon: React.FC<{ color?: string }> = ({
  color = 'currentColor',
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
)

const ChevronLastIcon: React.FC<{ color?: string }> = ({
  color = 'currentColor',
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 17 11 12 6 7" />
    <polyline points="13 17 18 12 13 7" />
  </svg>
)

const ChevronLeftIcon: React.FC<{ color?: string }> = ({
  color = 'currentColor',
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRightIcon: React.FC<{ color?: string }> = ({
  color = 'currentColor',
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export interface CustomFooterProps {
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  columns: ColumnDef[]
  /** Row data for export functionality */
  rows?: RowData[]
  /** Callback for PDF export - receives columns and rows */
  onExportPdf: (columns: ColumnDef[], rows: RowData[]) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

// Translate DataGrid theme to a FieldStyleOverrides for the inner
// Dropdown. Color/border tokens previously expressed as
// FormFieldStyles fields move to CSS-variable overrides — the new
// FieldShell consumes `--field-bg`, `--field-border-default`, etc.
// directly through the CSS module.
const createDropdownStyles = (
  dataGridStyles?: DataGridStyles
): FieldStyleOverrides => {
  const theme = dataGridStyles?.theme || 'light'

  switch (theme) {
    case 'dark':
      return {
        theme: 'dark',
        '--field-bg': '#1E293B',
        '--field-border-default': '#334155',
        '--field-border-focus': '#475569',
        '--field-text': '#E2E8F0',
        '--field-label-default': '#E2E8F0',
        '--field-label-focus': '#F1F5F9',
        '--field-adornment-default': '#9CA3AF',
        '--field-adornment-focus': '#E2E8F0',
        borderRadius: '6px',
        height: '32px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      }
    case 'sacred':
      return {
        theme: 'sacred',
        '--field-bg': 'rgba(0, 0, 0, 0.9)',
        '--field-border-default': 'rgba(255, 215, 0, 0.5)',
        '--field-border-focus': 'rgba(255, 215, 0, 0.8)',
        '--field-text': '#FBBF24',
        '--field-label-default': '#FBBF24',
        '--field-label-focus': '#FFD700',
        '--field-adornment-default': 'rgba(255, 215, 0, 0.6)',
        '--field-adornment-focus': '#FFD700',
        borderRadius: '6px',
        height: '32px',
        fontSize: '14px',
        fontFamily: 'Cinzel, serif',
      }
    default: // light theme
      return {
        theme: 'light',
        '--field-bg': '#FFFFFF',
        '--field-border-default': '#E2E8F0',
        '--field-border-focus': '#94A3B8',
        '--field-text': '#374151',
        '--field-label-default': '#374151',
        '--field-label-focus': '#1F2937',
        '--field-adornment-default': '#6B7280',
        '--field-adornment-focus': '#374151',
        borderRadius: '6px',
        height: '32px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      }
  }
}

const PageSizeSelector: React.FC<{
  pageSize: number
  onPageSizeChange: (newPageSize: number) => void
  styles?: DataGridStyles
}> = ({ pageSize, onPageSizeChange, styles }) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const dropdownStyles = createDropdownStyles(styles)

  const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ]

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: isSacredTheme ? 'rgba(255, 215, 0, 0.9)' : 'rgba(55, 65, 81, 1)',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
  }

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10)
    if (!isNaN(newPageSize)) {
      onPageSizeChange(newPageSize)
    }
  }

  const selectedValue = String(pageSize)

  return (
    <div style={containerStyle}>
      <span style={{ whiteSpace: 'nowrap' }}>
        {isSacredTheme ? 'Show:' : 'Show:'}
      </span>
      <div style={{ minWidth: '60px' }}>
        <Dropdown
          label=""
          value={selectedValue}
          onChange={handlePageSizeChange}
          options={pageSizeOptions}
          styles={dropdownStyles}
        />
      </div>
    </div>
  )
}

const TablePagination: React.FC<{
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  styles?: DataGridStyles
}> = ({ page, pageSize, rowCount, onPageChange, onPageSizeChange, styles }) => {
  const totalPages = Math.ceil(rowCount / pageSize)
  const from = rowCount === 0 ? 0 : page * pageSize + 1
  const to = Math.min(rowCount, (page + 1) * pageSize)
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  const handleFirstPage = () => onPageChange(0)
  const handlePreviousPage = () => onPageChange(page - 1)
  const handleNextPage = () => onPageChange(page + 1)
  const handleLastPage = () => onPageChange(totalPages - 1)

  // Enhanced theming for pagination buttons
  const getButtonStyle = (disabled: boolean) => {
    const baseStyle = {
      padding: '8px',
      borderRadius: '6px',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      fontSize: '16px',
    }

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: isSacredTheme
          ? 'rgba(255, 215, 0, 0.3)'
          : isDarkTheme
            ? 'rgba(156, 163, 175, 0.3)'
            : 'rgba(107, 114, 128, 0.3)',
        opacity: 0.5,
      }
    }

    if (isSacredTheme) {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        color: '#FFD700',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          borderColor: 'rgba(255, 215, 0, 0.6)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(255, 215, 0, 0.2)',
        },
      }
    } else if (isDarkTheme) {
      return {
        ...baseStyle,
        backgroundColor: '#334155',
        color: '#E2E8F0',
        border: '1px solid #475569',
        '&:hover': {
          backgroundColor: '#475569',
          borderColor: '#64748B',
          transform: 'translateY(-1px)',
        },
      }
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#F8FAFC',
        color: '#374151',
        border: '1px solid #E2E8F0',
        '&:hover': {
          backgroundColor: '#F1F5F9',
          borderColor: '#CBD5E1',
          transform: 'translateY(-1px)',
        },
      }
    }
  }

  const paginationContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
    flexWrap: 'nowrap' as const,
  }

  const paginationTextStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: isSacredTheme
      ? 'rgba(255, 215, 0, 0.9)'
      : isDarkTheme
        ? '#E2E8F0'
        : '#374151',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : '"Inter", sans-serif',
    minWidth: '80px',
    textAlign: 'center' as const,
    padding: '0 8px',
  }

  // Enhanced button component with hover effects
  const PaginationButton: React.FC<{
    onClick: () => void
    disabled: boolean
    children: React.ReactNode
    'aria-label': string
  }> = ({ onClick, disabled, children, 'aria-label': ariaLabel }) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const buttonStyle = getButtonStyle(disabled)

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        style={{
          ...buttonStyle,
          ...(isHovered &&
            !disabled && {
              transform: 'translateY(-1px)',
              boxShadow: isSacredTheme
                ? '0 4px 8px rgba(255, 215, 0, 0.2)'
                : isDarkTheme
                  ? '0 4px 8px rgba(0, 0, 0, 0.3)'
                  : '0 4px 8px rgba(0, 0, 0, 0.1)',
            }),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </button>
    )
  }

  // Get icon color based on theme and disabled state
  const getIconColor = (disabled: boolean) => {
    if (disabled) {
      return isSacredTheme
        ? 'rgba(255, 215, 0, 0.3)'
        : isDarkTheme
          ? 'rgba(156, 163, 175, 0.3)'
          : 'rgba(107, 114, 128, 0.3)'
    }
    return isSacredTheme ? '#FFD700' : isDarkTheme ? '#E2E8F0' : '#374151'
  }

  return (
    <div style={paginationContainerStyle}>
      <PageSizeSelector
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        {...(styles && { styles })}
      />

      <PaginationButton
        onClick={handleFirstPage}
        disabled={page === 0}
        aria-label="Go to first page"
      >
        <ChevronFirstIcon color={getIconColor(page === 0)} />
      </PaginationButton>

      <PaginationButton
        onClick={handlePreviousPage}
        disabled={page === 0}
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon color={getIconColor(page === 0)} />
      </PaginationButton>

      <div style={paginationTextStyle}>
        {from}-{to} of {rowCount}
      </div>

      <PaginationButton
        onClick={handleNextPage}
        disabled={page >= totalPages - 1}
        aria-label="Go to next page"
      >
        <ChevronRightIcon color={getIconColor(page >= totalPages - 1)} />
      </PaginationButton>

      <PaginationButton
        onClick={handleLastPage}
        disabled={page >= totalPages - 1}
        aria-label="Go to last page"
      >
        <ChevronLastIcon color={getIconColor(page >= totalPages - 1)} />
      </PaginationButton>
    </div>
  )
}

// CSV Export utility function
// Helper to format a value for CSV export
const formatValueForCSV = (value: unknown): string => {
  if (value === null || value === undefined) return ''

  // Handle Date objects
  if (value instanceof Date) {
    return value.toISOString()
  }

  // Handle ISO date strings - format them nicely
  if (typeof value === 'string') {
    // Check if it's an ISO date string
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    if (isoDateRegex.test(value)) {
      try {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return date.toLocaleString()
        }
      } catch {
        // If parsing fails, return original string
      }
    }
    return value
  }

  // Handle arrays - join with semicolons
  if (Array.isArray(value)) {
    return value.map(v => formatValueForCSV(v)).join('; ')
  }

  // Handle objects
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

const exportToCSV = (
  columns: ColumnDef[],
  rows: RowData[],
  filename: string = 'export'
) => {
  if (rows.length === 0) {
    // No data to export
    return
  }

  // Collect all unique fields from the data rows (excluding internal fields)
  const excludedFields = new Set(['_id', 'id', '__v'])
  const allFields = new Set<string>()

  rows.forEach(row => {
    Object.keys(row).forEach(key => {
      if (!excludedFields.has(key)) {
        allFields.add(key)
      }
    })
  })

  // Create headers: use column headerName if field matches, otherwise use field name
  const fieldToHeader: Record<string, string> = {}
  columns.forEach(col => {
    fieldToHeader[col.field] = col.headerName || col.field
  })

  const fields = Array.from(allFields)
  const headers = fields.map(field => fieldToHeader[field] || field)

  // Build CSV content
  const csvRows: string[] = []

  // Add header row
  csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','))

  // Add data rows
  rows.forEach(row => {
    const values = fields.map(field => {
      const value = row[field]
      const formatted = formatValueForCSV(value)
      return `"${formatted.replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  })

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export Menu Component with Settings Cog and Dropdown using React Portal
const ExportMenu: React.FC<{
  columns: ColumnDef[]
  rows: RowData[]
  onExportPdf: (columns: ColumnDef[], rows: RowData[]) => void
  styles?: DataGridStyles
}> = ({ columns, rows, onExportPdf, styles }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  // Update menu position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // Position dropdown above the button
      setMenuPosition({
        top: rect.top - 4, // 4px margin above button
        left: rect.left,
      })
    }
  }, [isOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getIconColor = () => {
    return isSacredTheme ? '#FFD700' : isDarkTheme ? '#E2E8F0' : '#374151'
  }

  const cogButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: isOpen
      ? isSacredTheme
        ? 'rgba(255, 215, 0, 0.25)'
        : isDarkTheme
          ? '#475569'
          : '#E2E8F0'
      : isSacredTheme
        ? 'rgba(255, 215, 0, 0.15)'
        : isDarkTheme
          ? '#334155'
          : '#F1F5F9',
    border: isSacredTheme
      ? '1px solid rgba(255, 215, 0, 0.4)'
      : isDarkTheme
        ? '1px solid #475569'
        : '1px solid #E2E8F0',
  }

  const dropdownStyle: React.CSSProperties = {
    position: 'fixed',
    top: menuPosition.top,
    left: menuPosition.left,
    transform: 'translateY(-100%)',
    minWidth: '160px',
    backgroundColor: isSacredTheme
      ? 'rgba(0, 0, 0, 0.95)'
      : isDarkTheme
        ? '#1E293B'
        : '#FFFFFF',
    border: isSacredTheme
      ? '1px solid rgba(255, 215, 0, 0.5)'
      : isDarkTheme
        ? '1px solid #475569'
        : '1px solid #E2E8F0',
    borderRadius: '6px',
    boxShadow: isSacredTheme
      ? '0 -4px 12px rgba(255, 215, 0, 0.2)'
      : '0 -4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
    overflow: 'hidden',
  }

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#E2E8F0' : '#374151',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : '"Inter", sans-serif',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'background-color 0.15s ease',
  }

  const handleExportCSV = () => {
    exportToCSV(columns, rows, 'datagrid-export')
    setIsOpen(false)
  }

  const handleExportPdf = () => {
    onExportPdf(columns, rows)
    setIsOpen(false)
  }

  // Render dropdown menu via portal
  const renderDropdown = () => {
    if (!isOpen || typeof document === 'undefined') return null

    return createPortal(
      <div ref={menuRef} style={dropdownStyle}>
        <button
          onClick={handleExportCSV}
          style={menuItemStyle}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = isSacredTheme
              ? 'rgba(255, 215, 0, 0.15)'
              : isDarkTheme
                ? '#334155'
                : '#F3F4F6'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <DownloadIcon color={getIconColor()} />
          Export CSV
        </button>
        <button
          onClick={handleExportPdf}
          style={menuItemStyle}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = isSacredTheme
              ? 'rgba(255, 215, 0, 0.15)'
              : isDarkTheme
                ? '#334155'
                : '#F3F4F6'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <PdfIcon color={getIconColor()} />
          Export PDF
        </button>
      </div>,
      document.body
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={cogButtonStyle}
        aria-label="Export options"
        title="Export options"
        onMouseEnter={e => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = isSacredTheme
              ? 'rgba(255, 215, 0, 0.25)'
              : isDarkTheme
                ? '#475569'
                : '#E2E8F0'
          }
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = isSacredTheme
              ? 'rgba(255, 215, 0, 0.15)'
              : isDarkTheme
                ? '#334155'
                : '#F1F5F9'
          }
        }}
      >
        <SettingsIcon color={getIconColor()} />
      </button>

      {renderDropdown()}
    </div>
  )
}

function CustomFooter({
  page,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
  columns,
  rows = [],
  onExportPdf,
  styles,
}: CustomFooterProps) {
  const isSacredTheme = styles?.theme === 'sacred'

  const containerStyle = {
    width: '100%',
    minWidth: '100%',
    height: '56px',
    position: 'sticky' as const,
    left: 0,
    boxSizing: 'border-box' as const,
    ...(isSacredTheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderTop: '2px solid rgba(255, 215, 0, 0.3)',
      backdropFilter: 'blur(8px)',
    }),
  }

  const innerContainerStyle = {
    display: 'flex',
    flexWrap: 'nowrap' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '0 1rem',
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
  }

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  }

  const centerSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    flex: '1',
    maxWidth: '300px',
  }

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginLeft: 'auto',
    overflow: 'visible',
    paddingRight: '1rem',
    flexShrink: 0,
  }

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        {/* Left Section: Export Menu with Settings Cog */}
        <div style={leftSectionStyle}>
          <ExportMenu
            columns={columns}
            rows={rows}
            onExportPdf={onExportPdf}
            {...(styles && { styles })}
          />
        </div>

        {/* Center Section: Empty */}
        <div style={centerSectionStyle}></div>

        {/* Right Section: Pagination with Page Size Selector */}
        <div style={rightSectionStyle}>
          <TablePagination
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            {...(styles && { styles })}
          />
        </div>
      </div>
    </div>
  )
}

export default CustomFooter

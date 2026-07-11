'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ColumnDef, RowData, DataGridStyles } from '../types'
import Dropdown from '../../Field/Dropdown/Regular'
import type { FieldStyleOverrides } from '../../Field/Shell/types'
import cssStyles from '../DataGrid.module.css'

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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
        '--field-bg': 'var(--goobs-dark-surface)',
        '--field-border-default': 'var(--goobs-dark-border)',
        '--field-border-focus': 'var(--goobs-dark-border-strong)',
        '--field-text': 'var(--goobs-light-border)',
        '--field-label-default': 'var(--goobs-light-border)',
        '--field-label-focus': '#F1F5F9',
        '--field-adornment-default': '#9CA3AF',
        '--field-adornment-focus': 'var(--goobs-light-border)',
        borderRadius: '6px',
        height: '32px',
        // Shrink the dropdown trigger from its 40px default to match
        // the 32px pagination chevron buttons in the footer row.
        '--field-button-min-height': '32px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      }
    case 'sacred':
      return {
        theme: 'sacred',
        '--field-bg': 'var(--goobs-black-a90)',
        '--field-border-default': 'var(--goobs-gold-a50)',
        '--field-border-focus': 'var(--goobs-gold-a80)',
        '--field-text': 'var(--goobs-dark-warn-text)',
        '--field-label-default': 'var(--goobs-dark-warn-text)',
        '--field-label-focus': 'var(--goobs-gold)',
        '--field-adornment-default': 'var(--goobs-gold-a60)',
        '--field-adornment-focus': 'var(--goobs-gold)',
        borderRadius: '6px',
        height: '32px',
        // Shrink the dropdown trigger from its 40px default to match
        // the 32px pagination chevron buttons in the footer row.
        '--field-button-min-height': '32px',
        fontSize: '14px',
        fontFamily: 'Cinzel, serif',
      }
    default: // light theme
      return {
        theme: 'light',
        '--field-bg': 'var(--goobs-light-surface)',
        '--field-border-default': 'var(--goobs-light-border)',
        '--field-border-focus': 'var(--goobs-dark-text-muted)',
        '--field-text': 'var(--goobs-light-text-secondary)',
        '--field-label-default': 'var(--goobs-light-text-secondary)',
        '--field-label-focus': 'var(--goobs-light-text)',
        '--field-adornment-default': '#6B7280',
        '--field-adornment-focus': 'var(--goobs-light-text-secondary)',
        borderRadius: '6px',
        height: '32px',
        // Shrink the dropdown trigger from its 40px default to match
        // the 32px pagination chevron buttons in the footer row.
        '--field-button-min-height': '32px',
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
  // Container color/font now come from the .pageSizeSelector CSS class (keyed
  // off the footer's data-theme). The dropdown styles object still feeds the
  // goobs Dropdown's own CSS-variable overrides — legitimately kept in JS.
  const dropdownStyles = createDropdownStyles(styles)

  const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ]

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10)
    if (!isNaN(newPageSize)) {
      onPageSizeChange(newPageSize)
    }
  }

  const selectedValue = String(pageSize)

  return (
    <div className={cssStyles.pageSizeSelector}>
      <span className={cssStyles.pageSizeSelectorLabel}>Show:</span>
      <div className={cssStyles.pageSizeSelectorDropdown}>
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

  const handleFirstPage = () => onPageChange(0)
  const handlePreviousPage = () => onPageChange(page - 1)
  const handleNextPage = () => onPageChange(page + 1)
  const handleLastPage = () => onPageChange(totalPages - 1)

  // Button background/border/color (per theme + disabled) and the hover
  // lift now live entirely in CSS (.paginationBtn + :hover:not(:disabled)
  // + :disabled). The hover useState and getButtonStyle/getIconColor
  // ternaries are gone. Icons inherit the button's color via currentColor.
  //
  // Plain render helper (not a component) — stateless now, so invoked directly.
  // This sidesteps the react-hooks/static-components rule that a capitalized
  // inline component trips.
  const renderPaginationButton = ({
    onClick,
    disabled,
    icon,
    ariaLabel,
    dataPagination,
  }: {
    onClick: () => void
    disabled: boolean
    icon: React.ReactNode
    ariaLabel: string
    /**
     * Pagination action identifier emitted as `data-pagination` so
     * Playwright tests can target the four nav buttons stably without
     * matching aria-label or icon SVG. Each value is unique within
     * the footer so `[data-pagination="next"]` is unambiguous.
     */
    dataPagination: 'first' | 'prev' | 'next' | 'last'
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-pagination={dataPagination}
      data-action={dataPagination}
      className={cssStyles.paginationBtn}
    >
      {icon}
    </button>
  )

  return (
    <div className={cssStyles.paginationBar}>
      <PageSizeSelector
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        {...(styles && { styles })}
      />

      {renderPaginationButton({
        onClick: handleFirstPage,
        disabled: page === 0,
        ariaLabel: 'Go to first page',
        dataPagination: 'first',
        icon: <ChevronFirstIcon color="currentColor" />,
      })}

      {renderPaginationButton({
        onClick: handlePreviousPage,
        disabled: page === 0,
        ariaLabel: 'Go to previous page',
        dataPagination: 'prev',
        icon: <ChevronLeftIcon color="currentColor" />,
      })}

      <div
        className={cssStyles.paginationText}
        data-pagination-status={`${from}-${to}-of-${rowCount}`}
        // Status-message region (WCAG 4.1.3): when search/filter/paging changes
        // the visible range or total, assistive tech is notified of the new
        // count instead of it changing silently.
        role="status"
        aria-live="polite"
      >
        {from}-{to} of {rowCount}
      </div>

      {renderPaginationButton({
        onClick: handleNextPage,
        disabled: page >= totalPages - 1,
        ariaLabel: 'Go to next page',
        dataPagination: 'next',
        icon: <ChevronRightIcon color="currentColor" />,
      })}

      {renderPaginationButton({
        onClick: handleLastPage,
        disabled: page >= totalPages - 1,
        ariaLabel: 'Go to last page',
        dataPagination: 'last',
        icon: <ChevronLastIcon color="currentColor" />,
      })}
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
  // The portaled menu lives outside .footerBar, so it carries its own
  // data-theme to pull the matching CSS custom-property set.
  const theme = styles?.theme || 'sacred'

  // Anchor the portalled menu to the button — recomputed on open and on
  // scroll/resize so it stays anchored instead of detaching when the page
  // scrolls.
  const computeMenuPosition = React.useCallback(() => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    // Position dropdown above the button (4px margin).
    setMenuPosition({ top: rect.top - 4, left: rect.left })
  }, [])

  useEffect(() => {
    if (isOpen) computeMenuPosition()
  }, [isOpen, computeMenuPosition])

  // Menu-button keyboard model (WCAG 2.1.1): on open, move focus INTO the menu
  // (its first item). Without this the menu is portalled to the end of
  // <body>, so a keyboard user tabbing forward from the trigger would never
  // reach the items — they'd fall at the end of the page tab order.
  useEffect(() => {
    if (!isOpen) return
    const first = menuRef.current?.querySelector<HTMLButtonElement>(
      '[role="menuitem"]'
    )
    first?.focus()
  }, [isOpen])

  // Close on click-outside; reposition (don't dismiss) on scroll/resize.
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
    const handleReposition = (event: Event) => {
      if (
        event.type === 'scroll' &&
        menuRef.current &&
        menuRef.current.contains(event.target as Node)
      ) {
        return
      }
      computeMenuPosition()
    }
    // Escape closes the menu and returns focus to the trigger (WCAG 2.1.2).
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      window.addEventListener('scroll', handleReposition, true)
      window.addEventListener('resize', handleReposition)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [isOpen, computeMenuPosition])

  // APG Menu keyboard interaction among the portalled menuitems (WCAG 2.1.1):
  // Up/Down roving (wrapping), Home/End, first-letter typeahead, and Tab to
  // close the menu + return focus to the trigger (a menu is not part of the
  // page tab sequence). Escape is handled by the document listener above.
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current
    if (!menu) return
    const items = Array.from(
      menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    )
    if (items.length === 0) return
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement
    )

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        items[currentIndex < 0 ? 0 : (currentIndex + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        items[
          currentIndex < 0
            ? items.length - 1
            : (currentIndex - 1 + items.length) % items.length
        ]?.focus()
        break
      case 'Home':
        e.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        items[items.length - 1]?.focus()
        break
      case 'Tab':
        e.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
        break
      default:
        // First-letter typeahead: jump to the next item whose label starts
        // with the typed character (wrapping to the top).
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const char = e.key.toLowerCase()
          const ordered = [
            ...items.slice(currentIndex + 1),
            ...items.slice(0, currentIndex + 1),
          ]
          const match = ordered.find(item =>
            (item.textContent || '').trim().toLowerCase().startsWith(char)
          )
          if (match) {
            e.preventDefault()
            match.focus()
          }
        }
        break
    }
  }

  const handleExportCSV = () => {
    exportToCSV(columns, rows, 'datagrid-export')
    setIsOpen(false)
  }

  const handleExportPdf = () => {
    onExportPdf(columns, rows)
    setIsOpen(false)
  }

  // Render dropdown menu via portal. Cog/menu colors, fonts, hover states all
  // come from CSS (.exportCogBtn, .exportMenu, .exportMenuItem) — the only
  // genuinely-dynamic JS left is the getBoundingClientRect position, passed as
  // top/left inline. Icons inherit color via currentColor.
  const renderDropdown = () => {
    if (!isOpen || typeof document === 'undefined') return null

    return createPortal(
      <div
        ref={menuRef}
        className={cssStyles.exportMenu}
        data-theme={theme}
        role="menu"
        aria-label="Export options"
        onKeyDown={handleMenuKeyDown}
        style={{ top: menuPosition.top, left: menuPosition.left }}
      >
        <button
          type="button"
          role="menuitem"
          onClick={handleExportCSV}
          className={cssStyles.exportMenuItem}
        >
          <DownloadIcon color="currentColor" />
          Export CSV
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={handleExportPdf}
          className={cssStyles.exportMenuItem}
        >
          <PdfIcon color="currentColor" />
          Export PDF
        </button>
      </div>,
      document.body
    )
  }

  return (
    <div className={cssStyles.exportMenuWrapper}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cssStyles.exportCogBtn}
        data-action={isOpen ? 'close' : 'open'}
        data-open={isOpen ? 'true' : 'false'}
        aria-label="Export options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title="Export options"
      >
        <SettingsIcon color="currentColor" />
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
  // Container chrome (sacred bg/border/blur) + section layout are CSS now,
  // keyed off data-theme. The sacred-only chrome is the base in CSS; light/dark
  // strip it via [data-theme] overrides — matching the old isSacredTheme spread.
  const theme = styles?.theme || 'sacred'

  return (
    <div className={cssStyles.footerBar} data-theme={theme}>
      <div className={cssStyles.footerInner}>
        {/* Left Section: Export Menu with Settings Cog */}
        <div className={cssStyles.footerLeft}>
          <ExportMenu
            columns={columns}
            rows={rows}
            onExportPdf={onExportPdf}
            {...(styles && { styles })}
          />
        </div>

        {/* Center Section: Empty */}
        <div className={cssStyles.footerCenter}></div>

        {/* Right Section: Pagination with Page Size Selector */}
        <div className={cssStyles.footerRight}>
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

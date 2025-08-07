'use client'

import React from 'react'
import { ColumnDef } from '../types'
import Dropdown from '../../Field/Dropdown/Regular'
import FirstPageIcon from '../../Icons/FirstPage'
import LastPageIcon from '../../Icons/LastPage'
import KeyboardArrowLeftIcon from '../../Icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '../../Icons/KeyboardArrowRight'
import type { DataGridStyles } from '../../../theme'
import type { FormFieldStyles } from '../../../theme'

export interface CustomFooterProps {
  page: number
  pageSize: number
  rowCount: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
  columns: ColumnDef[]
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

// Create themed FormFieldStyles for dropdown based on DataGrid theme
const createDropdownStyles = (
  dataGridStyles?: DataGridStyles
): FormFieldStyles => {
  const theme = dataGridStyles?.theme || 'light'

  switch (theme) {
    case 'dark':
      return {
        theme: 'dark',
        backgroundColor: '#1E293B',
        borderColor: '#334155',
        borderFocusedColor: '#475569',
        textColor: '#E2E8F0',
        labelColor: '#E2E8F0',
        labelFocusedColor: '#F1F5F9',
        adornmentColor: '#9CA3AF',
        adornmentFocusedColor: '#E2E8F0',
        borderRadius: '6px',
        height: '32px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      }
    case 'sacred':
      return {
        theme: 'sacred',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderFocusedColor: 'rgba(255, 215, 0, 0.8)',
        textColor: '#FBBF24',
        labelColor: '#FBBF24',
        labelFocusedColor: '#FFD700',
        adornmentColor: 'rgba(255, 215, 0, 0.6)',
        adornmentFocusedColor: '#FFD700',
        borderRadius: '6px',
        height: '32px',
        fontSize: '14px',
        fontFamily: 'Cinzel, serif',
      }
    default: // light theme
      return {
        theme: 'light',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderFocusedColor: '#94A3B8',
        textColor: '#374151',
        labelColor: '#374151',
        labelFocusedColor: '#1F2937',
        adornmentColor: '#6B7280',
        adornmentFocusedColor: '#374151',
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

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10)
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
      <div style={{ minWidth: '70px', marginTop: '-15px' }}>
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
    gap: '8px',
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

  return (
    <div style={paginationContainerStyle}>
      <PageSizeSelector
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        styles={styles}
      />

      <PaginationButton
        onClick={handleFirstPage}
        disabled={page === 0}
        aria-label="Go to first page"
      >
        <LastPageIcon styles={{ theme: styles?.theme || 'sacred' }} />
      </PaginationButton>

      <PaginationButton
        onClick={handlePreviousPage}
        disabled={page === 0}
        aria-label="Go to previous page"
      >
        <KeyboardArrowLeftIcon styles={{ theme: styles?.theme || 'sacred' }} />
      </PaginationButton>

      <div style={paginationTextStyle}>
        {from}-{to} of {rowCount}
      </div>

      <PaginationButton
        onClick={handleNextPage}
        disabled={page >= totalPages - 1}
        aria-label="Go to next page"
      >
        <KeyboardArrowRightIcon styles={{ theme: styles?.theme || 'sacred' }} />
      </PaginationButton>

      <PaginationButton
        onClick={handleLastPage}
        disabled={page >= totalPages - 1}
        aria-label="Go to last page"
      >
        <FirstPageIcon styles={{ theme: styles?.theme || 'sacred' }} />
      </PaginationButton>
    </div>
  )
}

function CustomFooter({
  page,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
  columns: _columns,
  styles,
}: CustomFooterProps) {
  const isSacredTheme = styles?.theme === 'sacred'

  const containerStyle = {
    width: '100%',
    minWidth: '100%',
    height: '56px',
    position: 'sticky' as const,
    left: 0,
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
    overflow: 'hidden',
    paddingRight: '16px',
  }

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        {/* Left Section: Empty */}
        <div style={leftSectionStyle}></div>

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
            styles={styles}
          />
        </div>
      </div>
    </div>
  )
}

export default CustomFooter

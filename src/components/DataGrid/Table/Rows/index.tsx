'use client'

import React from 'react'
import { ColumnDef } from '../../types'
import StyledTooltip from '../../../Tooltip'
import type { RowData } from '../../types'
import type { DataGridStyles } from '../../../../theme'
import { getRowId } from '../index'
import Checkbox from '../../../Checkbox'

/**
 * Safely convert a value to a string without triggering the default
 * '[object Object]' for objects. If the type is:
 *  - string/number/boolean => return it (lowercased if desired).
 *  - object => JSON.stringify it (or fallback to '').
 *  - null/undefined => ''.
 *  - otherwise => ''.
 */
function safeString(value: unknown): string {
  if (value == null) return ''

  switch (typeof value) {
    case 'string':
      // Return the string as-is or .toLowerCase() if you want consistency:
      return value
    case 'number':
    case 'boolean':
      return String(value)
    case 'object':
      try {
        return JSON.stringify(value)
      } catch {
        return ''
      }
    default:
      // e.g., symbol, function => ''
      return ''
  }
}

/**
 * Format a value as USD currency with premium UI/UX styling
 * Returns both the formatted string and a React element for display
 */
function formatCurrency(
  value: unknown,
  sacredtheme: boolean = false
): {
  formatted: string
  element: React.ReactNode
} {
  // Convert to number, handling various input types
  let numValue: number

  if (typeof value === 'number') {
    numValue = value
  } else if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''))
    numValue = isNaN(parsed) ? 0 : parsed
  } else {
    numValue = 0
  }

  // Format as currency
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)

  // Determine value ranges and styling context
  const isZero = numValue === 0
  const isNegative = numValue < 0
  const isLarge = Math.abs(numValue) >= 10000
  const isMedium = Math.abs(numValue) >= 1000 && Math.abs(numValue) < 10000

  // Premium color palette with better psychology
  const getColorScheme = () => {
    if (sacredtheme) {
      // Sacred theme colors
      if (isZero) {
        return {
          text: '#9CA3AF',
          background:
            'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(55, 65, 81, 0.8) 100%)',
          border: 'rgba(156, 163, 175, 0.5)',
          shadow: '0 2px 6px rgba(255, 215, 0, 0.1)',
          pulse: false,
        }
      }

      if (isNegative) {
        return {
          text: '#EF4444',
          background:
            'linear-gradient(135deg, rgba(127, 29, 29, 0.8) 0%, rgba(185, 28, 28, 0.8) 100%)',
          border: 'rgba(239, 68, 68, 0.6)',
          shadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          pulse: isLarge,
        }
      }

      // Positive values for sacred theme
      if (isLarge) {
        return {
          text: '#FFD700',
          background:
            'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.25) 100%)',
          border: '#FFD700',
          shadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
          pulse: true,
        }
      } else if (isMedium) {
        return {
          text: '#F59E0B',
          background:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.2) 100%)',
          border: 'rgba(245, 158, 11, 0.6)',
          shadow: '0 3px 8px rgba(245, 158, 11, 0.2)',
          pulse: false,
        }
      } else {
        return {
          text: '#D97706',
          background:
            'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.15) 100%)',
          border: 'rgba(217, 119, 6, 0.5)',
          shadow: '0 2px 6px rgba(217, 119, 6, 0.15)',
          pulse: false,
        }
      }
    }

    // Original color scheme for non-sacred theme
    if (isZero) {
      return {
        text: '#6B7280',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        border: '#E5E7EB',
        shadow: 'none',
        pulse: false,
      }
    }

    if (isNegative) {
      return {
        text: '#DC2626',
        background:
          'linear-gradient(135deg, #FEF2F2 0%, #FECACA 30%, #FCA5A5 100%)',
        border: '#F87171',
        shadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
        pulse: isLarge,
      }
    }

    // Positive values with contextual styling
    if (isLarge) {
      return {
        text: '#059669',
        background:
          'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 30%, #A7F3D0 100%)',
        border: '#34D399',
        shadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
        pulse: true,
      }
    } else if (isMedium) {
      return {
        text: '#0D9488',
        background:
          'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #99F6E4 100%)',
        border: '#5EEAD4',
        shadow: '0 3px 8px rgba(13, 148, 136, 0.15)',
        pulse: false,
      }
    } else {
      return {
        text: '#0F766E',
        background: 'linear-gradient(135deg, #F0FDFA 0%, #E6FFFA 100%)',
        border: '#7DD3FC',
        shadow: '0 2px 6px rgba(15, 118, 110, 0.1)',
        pulse: false,
      }
    }
  }

  const colorScheme = getColorScheme()
  const formatId = `currency-${Math.random().toString(36).substr(2, 9)}`

  // Premium styled element with sophisticated design
  const element = (
    <span
      id={formatId}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          '"Inter Tight", "JetBrains Mono", "SF Pro Display", system-ui, sans-serif',
        fontWeight: isZero ? 400 : isLarge ? 700 : 600,
        fontSize: isLarge ? '0.95rem' : '0.875rem',
        lineHeight: 1.3,
        letterSpacing: isLarge ? '0.01em' : '0.02em',
        color: colorScheme.text,
        background: colorScheme.background,
        border: `1.5px solid ${colorScheme.border}`,
        borderRadius: '8px',
        padding: isLarge ? '6px 12px' : '5px 10px',
        minWidth: isLarge ? '100px' : '90px',
        textAlign: 'right' as const,
        boxShadow: colorScheme.shadow,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        userSelect: 'none',
        // Add subtle text shadow for depth
        textShadow: isZero ? 'none' : '0 1px 2px rgba(255, 255, 255, 0.8)',
        // Add animation for large values
        animation: colorScheme.pulse
          ? `pulse-${formatId} 2s ease-in-out infinite`
          : 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
        e.currentTarget.style.boxShadow = isZero
          ? '0 2px 8px rgba(0, 0, 0, 0.1)'
          : colorScheme.shadow
              .replace('0.15)', '0.25)')
              .replace('0.2)', '0.35)')
              .replace('0.1)', '0.2)')
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = colorScheme.shadow
      }}
    >
      {/* Add pulse animation styles dynamically */}
      {colorScheme.pulse && (
        <style>
          {`
            @keyframes pulse-${formatId} {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.85; }
            }
          `}
        </style>
      )}

      {/* Value indicator icon for large amounts */}
      {isLarge && !isNegative && (
        <span
          style={{
            marginRight: '4px',
            fontSize: '0.75em',
            opacity: 0.7,
            color: sacredtheme ? '#FFD700' : '#10B981',
          }}
        >
          ▲
        </span>
      )}

      {/* Currency symbol with enhanced styling */}
      <span
        style={{
          opacity: 0.85,
          marginRight: '2px',
          fontSize: isLarge ? '0.85em' : '0.8em',
          fontWeight: 500,
        }}
      >
        $
      </span>

      {/* Amount with sophisticated number formatting */}
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
          letterSpacing: '0.015em',
        }}
      >
        {formatted.replace('$', '')}
      </span>

      {/* Subtle shimmer effect for high values */}
      {isLarge && !isNegative && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            animation: `shimmer-${formatId} 3s ease-in-out infinite`,
          }}
        >
          <style>
            {`
              @keyframes shimmer-${formatId} {
                0% { left: -100%; }
                50%, 100% { left: 100%; }
              }
            `}
          </style>
        </span>
      )}
    </span>
  )

  return { formatted, element }
}

/**
 * Format a value as a masked credit card number with premium security styling
 * Returns both the formatted string and a React element for display
 */
function formatCreditCard(
  value: unknown,
  sacredtheme: boolean = false
): {
  formatted: string
  element: React.ReactNode
} {
  // Convert to string and extract digits only
  let digits = ''

  if (typeof value === 'string') {
    digits = value.replace(/\D/g, '')
  } else if (typeof value === 'number') {
    digits = String(value).replace(/\D/g, '')
  } else {
    digits = ''
  }

  // Handle empty or invalid input
  if (!digits || digits.length < 4) {
    const formatted = '•••• •••• •••• ••••'
    const element = (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.3,
          letterSpacing: '0.1em',
          color: sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#9CA3AF',
          backgroundColor: sacredtheme
            ? 'rgba(255, 215, 0, 0.05)'
            : 'rgba(156, 163, 175, 0.1)',
          border: sacredtheme
            ? '1px solid rgba(255, 215, 0, 0.3)'
            : '1px solid rgba(156, 163, 175, 0.3)',
          borderRadius: '6px',
          padding: '5px 10px',
          minWidth: '140px',
          textAlign: 'center' as const,
          userSelect: 'none',
        }}
      >
        {formatted}
      </span>
    )
    return { formatted, element }
  }

  // Get last 4 digits and create masked version
  const lastFour = digits.slice(-4)
  const maskedDigits = '•'.repeat(Math.max(0, digits.length - 4)) + lastFour

  // Format with spacing (groups of 4)
  const formatted = maskedDigits.replace(/(.{4})/g, '$1 ').trim()

  // Clean, security-focused styling without card type detection
  const cardInfo = sacredtheme
    ? {
        color: '#FFD700',
        bgGradient:
          'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 30%, rgba(255, 215, 0, 0.15) 100%)',
        borderColor: 'rgba(255, 215, 0, 0.6)',
      }
    : {
        color: '#1F2937',
        bgGradient:
          'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 30%, #CBD5E1 100%)',
        borderColor: '#475569',
      }

  const formatId = `card-${Math.random().toString(36).substr(2, 9)}`

  // Premium styled element with security-focused design
  const element = (
    <span
      id={formatId}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.3,
        letterSpacing: '0.08em',
        color: cardInfo.color,
        background: cardInfo.bgGradient,
        border: `1.5px solid ${cardInfo.borderColor}`,
        borderRadius: '8px',
        padding: '6px 12px',
        minWidth: '140px',
        textAlign: 'center' as const,
        boxShadow: sacredtheme
          ? `0 2px 8px rgba(255, 215, 0, 0.2)`
          : `0 2px 8px rgba(0, 0, 0, 0.1)`,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = sacredtheme
          ? '0 4px 12px rgba(255, 215, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = sacredtheme
          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Card number with special styling for masked vs visible digits */}
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        {formatted.split('').map((char, index) => (
          <span
            key={index}
            style={{
              opacity: char === '•' ? 0.6 : 1,
              fontSize: char === '•' ? '1.2em' : '1em',
              fontWeight: char === '•' ? 300 : 600,
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Security shield icon */}
      <span
        style={{
          fontSize: '0.75rem',
          opacity: 0.5,
          marginLeft: '8px',
          color: sacredtheme ? '#FFD700' : '#6B7280',
        }}
      >
        🔒
      </span>

      {/* Subtle security pattern overlay */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '100%',
          background:
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </span>
  )

  return { formatted, element }
}

/**
 * Format a value as a styled expiration date with status indication
 * Returns both the formatted string and a React element for display
 */
function formatExpirationDate(
  value: unknown,
  sacredtheme: boolean = false
): {
  formatted: string
  element: React.ReactNode
} {
  const parseExpirationDate = (input: string) => {
    if (!input || typeof input !== 'string') {
      return null
    }

    const cleaned = input.replace(/[^0-9]/g, '')
    let month, year

    if (cleaned.length >= 3) {
      month = parseInt(cleaned.slice(0, 2), 10)
      year = parseInt(cleaned.slice(2), 10)

      if (year < 100) {
        year += 2000
      }

      if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12) {
        return new Date(year, month - 1)
      }
    }
    return null
  }

  const date = parseExpirationDate(safeString(value))
  const formatted = date
    ? `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
        date.getFullYear()
      ).slice(2)}`
    : 'Invalid Date'

  const getStatus = () => {
    if (!date) return 'invalid'
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const expiry = new Date(date)
    expiry.setMonth(expiry.getMonth() + 1, 0) // End of the expiration month
    expiry.setHours(23, 59, 59, 999)

    if (expiry < now) return 'expired'
    const sixMonthsFromNow = new Date(now)
    sixMonthsFromNow.setMonth(now.getMonth() + 6)
    if (expiry < sixMonthsFromNow) return 'expiring_soon'
    return 'valid'
  }

  const status = getStatus()

  const getStatusStyling = () => {
    const base = {
      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      borderRadius: '12px',
      padding: '5px 10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      borderWidth: '1.5px',
      borderStyle: 'solid',
    }

    const themes = {
      sacredtheme: {
        valid: {
          color: '#A3E635',
          bg: 'rgba(163, 230, 53, 0.1)',
          borderColor: 'rgba(163, 230, 53, 0.4)',
        },
        expiring_soon: {
          color: '#FBBF24',
          bg: 'rgba(251, 191, 36, 0.1)',
          borderColor: 'rgba(251, 191, 36, 0.5)',
        },
        expired: {
          color: '#F87171',
          bg: 'rgba(248, 113, 113, 0.1)',
          borderColor: 'rgba(248, 113, 113, 0.5)',
        },
        invalid: {
          color: '#9CA3AF',
          bg: 'rgba(156, 163, 175, 0.1)',
          borderColor: 'rgba(156, 163, 175, 0.3)',
        },
      },
      standard: {
        valid: {
          color: '#166534',
          bg: '#DCFCE7',
          borderColor: '#4ADE80',
        },
        expiring_soon: {
          color: '#92400E',
          bg: '#FEF3C7',
          borderColor: '#FBBF24',
        },
        expired: {
          color: '#991B1B',
          bg: '#FEE2E2',
          borderColor: '#F87171',
        },
        invalid: {
          color: '#4B5563',
          bg: '#F3F4F6',
          borderColor: '#D1D5DB',
        },
      },
    }

    const currentTheme = sacredtheme ? themes.sacredtheme : themes.standard
    const style = currentTheme[status]

    return {
      ...base,
      color: style.color,
      backgroundColor: style.bg,
      borderColor: style.borderColor,
    }
  }

  const statusIcons = {
    valid: '✓',
    expiring_soon: '⏳',
    expired: '✕',
    invalid: '?',
  }

  const element = (
    <span style={getStatusStyling()}>
      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
        {statusIcons[status]}
      </span>
      <span>{formatted}</span>
    </span>
  )

  return { formatted, element }
}

/**
 * Format a value as a masked account number with banking security styling
 * Returns both the formatted string and a React element for display
 */
function formatAccountNumber(
  value: unknown,
  sacredtheme: boolean = false
): {
  formatted: string
  element: React.ReactNode
} {
  let digits = ''
  if (typeof value === 'string' || typeof value === 'number') {
    digits = String(value).replace(/\D/g, '')
  }

  if (!digits || digits.length < 4) {
    const formatted = '••••'
    const element = (
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          color: sacredtheme ? 'rgba(255, 215, 0, 0.6)' : '#6B7280',
          letterSpacing: '0.1em',
        }}
      >
        {formatted}
      </span>
    )
    return { formatted, element }
  }

  const lastFour = digits.slice(-4)
  const masked = '•'.repeat(digits.length - 4) + lastFour
  const formatted = masked

  const themeStyle = sacredtheme
    ? {
        color: '#FFD700',
        fontFamily: '"Caudex", serif',
        textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
      }
    : {
        color: '#1F2937',
        fontFamily: '"Inter", sans-serif',
      }

  const element = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '0.75rem',
          opacity: 0.6,
          color: sacredtheme ? '#FFD700' : '#4B5563',
        }}
      >
        #
      </span>
      <span
        style={{
          ...themeStyle,
          fontWeight: 600,
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
        }}
      >
        {formatted}
      </span>
    </div>
  )

  return { formatted, element }
}

/**
 * Format a value as a styled routing number for banking
 * Returns both the formatted string and a React element for display
 */
function formatRoutingNumber(
  value: unknown,
  sacredtheme: boolean = false
): {
  formatted: string
  element: React.ReactNode
} {
  let digits = ''
  if (typeof value === 'string' || typeof value === 'number') {
    digits = String(value).replace(/\D/g, '')
  }

  if (digits.length !== 9) {
    const formatted = 'Invalid ABA'
    const element = (
      <span
        style={{
          fontFamily: '"Inter", sans-serif',
          color: '#EF4444',
          fontSize: '0.8rem',
          fontStyle: 'italic',
        }}
      >
        {formatted}
      </span>
    )
    return { formatted, element }
  }

  const formatted = digits

  const themeStyle = sacredtheme
    ? {
        color: '#38BDF8',
        fontFamily: '"Orbitron", sans-serif',
        textShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
      }
    : {
        color: '#0284C7',
        fontFamily: '"Inter", sans-serif',
      }

  const element = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '0.8rem',
          opacity: 0.7,
          color: sacredtheme ? '#38BDF8' : '#3B82F6',
        }}
      >
        ⑆
      </span>
      <span
        style={{
          ...themeStyle,
          fontWeight: 500,
          fontSize: '0.9rem',
          letterSpacing: '0.075em',
          transition: 'letter-spacing 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.letterSpacing = '0.1em')}
        onMouseLeave={e => (e.currentTarget.style.letterSpacing = '0.075em')}
      >
        {formatted}
      </span>
    </div>
  )

  return { formatted, element }
}

interface RowsProps {
  rows: RowData[]
  finalDesktopColumns: ColumnDef[]
  overflowDesktopColumns: ColumnDef[]
  selectedOverflowField: string

  // Mobile logic
  isMobile: boolean
  mobileSelectedColumn: string

  // All columns for mobile currency formatting
  allColumns: ColumnDef[]

  // Current selected row IDs
  selectedRowIds: string[]

  // Row click
  onRowClick?: (row: RowData) => void

  // Toggling row checkbox
  onRowCheckboxChange: (rowId: string) => void

  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

const Rows: React.FC<RowsProps> = ({
  rows,
  finalDesktopColumns,
  overflowDesktopColumns,
  selectedOverflowField,
  isMobile,
  mobileSelectedColumn,
  allColumns,
  selectedRowIds,
  onRowClick,
  onRowCheckboxChange,
  styles,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'
  if (!rows || rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={100} className="text-center p-12 text-gray-500 italic">
            No data to display.
          </td>
        </tr>
      </tbody>
    )
  }
  return (
    <tbody>
      {rows.map(row => {
        const rowId = getRowId(row)
        const isSelected = selectedRowIds.includes(rowId)

        const rowStyle = {
          transition: 'background-color 0.2s ease',
          cursor: 'pointer',
          ...(isSelected && isSacredTheme
            ? {
                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                },
              }
            : {}),
          ...(isSelected && !isSacredTheme
            ? {
                backgroundColor: 'rgba(219, 234, 254, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(191, 219, 254, 1)',
                },
              }
            : {}),
        }

        return (
          <tr key={rowId} onClick={() => onRowClick?.(row)} style={rowStyle}>
            <td className="w-12 p-0 align-middle">
              <Checkbox
                checked={isSelected}
                onChange={_checked => {
                  onRowCheckboxChange(rowId)
                }}
                onClick={e => e.stopPropagation()}
                styles={{
                  theme: isSacredTheme ? 'sacred' : 'light',
                }}
              />
            </td>

            {/* Normal desktop columns */}
            {!isMobile &&
              finalDesktopColumns.map(col => {
                let cellContent: React.ReactNode

                if (col.field === '__overflow__') {
                  const overflowCol = overflowDesktopColumns.find(
                    c => c.field === selectedOverflowField
                  )
                  if (overflowCol) {
                    const value = row[overflowCol.field]
                    if (overflowCol.type === 'currency') {
                      cellContent = formatCurrency(value, isSacredTheme).element
                    } else if (overflowCol.type === 'credit_card') {
                      cellContent = formatCreditCard(
                        value,
                        isSacredTheme
                      ).element
                    } else if (overflowCol.type === 'expiration_date') {
                      cellContent = formatExpirationDate(
                        value,
                        isSacredTheme
                      ).element
                    } else if (overflowCol.type === 'account_number') {
                      cellContent = formatAccountNumber(
                        value,
                        isSacredTheme
                      ).element
                    } else if (overflowCol.type === 'routing_number') {
                      cellContent = formatRoutingNumber(
                        value,
                        isSacredTheme
                      ).element
                    } else {
                      cellContent = safeString(value)
                    }
                  } else {
                    cellContent = '---'
                  }
                } else {
                  const value = row[col.field]
                  if (col.type === 'currency') {
                    cellContent = formatCurrency(value, isSacredTheme).element
                  } else if (col.type === 'credit_card') {
                    cellContent = formatCreditCard(value, isSacredTheme).element
                  } else if (col.type === 'expiration_date') {
                    cellContent = formatExpirationDate(
                      value,
                      isSacredTheme
                    ).element
                  } else if (col.type === 'account_number') {
                    cellContent = formatAccountNumber(
                      value,
                      isSacredTheme
                    ).element
                  } else if (col.type === 'routing_number') {
                    cellContent = formatRoutingNumber(
                      value,
                      isSacredTheme
                    ).element
                  } else {
                    cellContent = safeString(value)
                  }
                }

                return (
                  <td key={col.field} className="p-2 align-middle">
                    <StyledTooltip
                      title={safeString(row[col.field])}
                      sacredtheme={isSacredTheme}
                    >
                      <div className="truncate">{cellContent}</div>
                    </StyledTooltip>
                  </td>
                )
              })}

            {/* Mobile: single column */}
            {isMobile && (
              <td className="p-2 align-middle">
                {(() => {
                  const mobileCol = allColumns.find(
                    c => c.field === mobileSelectedColumn
                  )
                  if (mobileCol) {
                    const value = row[mobileCol.field]
                    if (mobileCol.type === 'currency') {
                      return formatCurrency(value, isSacredTheme).element
                    } else if (mobileCol.type === 'credit_card') {
                      return formatCreditCard(value, isSacredTheme).element
                    } else if (mobileCol.type === 'expiration_date') {
                      return formatExpirationDate(value, isSacredTheme).element
                    } else if (mobileCol.type === 'account_number') {
                      return formatAccountNumber(value, isSacredTheme).element
                    } else if (mobileCol.type === 'routing_number') {
                      return formatRoutingNumber(value, isSacredTheme).element
                    }
                    return safeString(value)
                  }
                  return '---'
                })()}
              </td>
            )}
          </tr>
        )
      })}
    </tbody>
  )
}

export default Rows

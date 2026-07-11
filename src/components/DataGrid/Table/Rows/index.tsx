/**
 * =============================================================================
 * ROWS COMPONENT
 * =============================================================================
 *
 * Renders the data rows within the DataGrid table body.
 * This is one of the most complex components as it handles:
 *
 * 1. ROW RENDERING:
 *    - Iterates through rows and renders <tr> elements
 *    - Applies selection styling when row is selected
 *    - Applies alternating row colors for readability
 *
 * 2. CELL FORMATTING:
 *    - Automatic formatting for special column types
 *    - Currency formatting with color-coded amounts
 *    - Credit card masking (shows last 4 digits)
 *    - Expiration date with validity status
 *    - Account/routing number masking
 *    - Network types (IP, MAC, VLAN, CIDR, subnet)
 *    - Array values displayed as chips
 *
 * 3. INLINE EDITING:
 *    - Detects when a cell is being edited
 *    - Renders EditableCell component for editing
 *    - Handles click-to-edit on selected rows
 *
 * 4. CUSTOM RENDERING:
 *    - Supports column.renderCell for custom cell content
 *    - Passes row, value, field, and indices to render function
 *
 * FORMATTING FUNCTIONS:
 * ---------------------
 * - formatCurrency: USD amounts with color coding by value
 * - formatCreditCard: Masked card numbers (•••• •••• •••• 1234)
 * - formatExpirationDate: MM/YY with valid/expiring/expired status
 * - formatAccountNumber: Masked account numbers
 * - formatRoutingNumber: ABA routing numbers with validation
 *
 * THEMING:
 * --------
 * All formatters support both 'sacred' (dark/gold) and 'light' themes.
 * Theme affects colors, backgrounds, and visual effects.
 *
 * =============================================================================
 */

'use client'

import React from 'react'
import { ColumnDef, type RowData, type DataGridStyles } from '../../types'
import EditableCell from '../EditableCell'
import Chip from '../../../Chip'
import { getRowId } from '../index'
import { useGridKeyboardNav } from '../../utils/useGridKeyboardNav'
import cssStyles from '../../DataGrid.module.css'

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Safely convert any value to a string for display.
 * Prevents '[object Object]' by properly handling objects.
 *
 * @param value - Any value to convert
 * @returns String representation safe for display
 *
 * @example
 * safeString('hello')     // 'hello'
 * safeString(123)         // '123'
 * safeString(null)        // ''
 * safeString({a: 1})      // '{"a":1}'
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

// =============================================================================
// CELL FORMATTING FUNCTIONS
// =============================================================================
// Each formatter returns { formatted: string, element: ReactNode }
// - formatted: Plain text version for copy/paste or accessibility
// - element: Styled React component for visual display
// =============================================================================

/**
 * FORMAT CURRENCY
 * ---------------
 * Formats numeric values as USD currency with premium visual styling.
 *
 * FEATURES:
 * - Color-coded by value range (large amounts get emphasized styling)
 * - Negative values shown in red with warning styling
 * - Zero values shown in muted gray
 * - Hover effects for interactivity
 * - Optional pulse animation for large values
 * - Shimmer effect on high-value amounts
 *
 * VALUE RANGES:
 * - Large: >= $10,000 (most prominent styling)
 * - Medium: $1,000 - $9,999 (moderate emphasis)
 * - Small: < $1,000 (subtle styling)
 * - Zero: Muted/disabled appearance
 * - Negative: Red warning colors
 *
 * @param value - Numeric value or string to format
 * @param sacredtheme - If true, uses dark/gold theme colors
 * @returns An object with the formatted string and the rendered element.
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
          shadow: '0 2px 6px var(--goobs-gold-a10)',
          pulse: false,
        }
      }

      if (isNegative) {
        return {
          text: 'var(--goobs-danger)',
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
          text: 'var(--goobs-gold)',
          background:
            'linear-gradient(135deg, var(--goobs-gold-a15) 0%, var(--goobs-gold-a25) 100%)',
          border: 'var(--goobs-gold)',
          shadow: '0 4px 12px var(--goobs-gold-a40)',
          pulse: true,
        }
      } else if (isMedium) {
        return {
          text: 'var(--goobs-warn)',
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
        border: 'var(--goobs-dark-danger-text)',
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

  // Premium styled element with sophisticated design
  const element = (
    <span
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
          ? `pulse-datagrid-currency 2s ease-in-out infinite`
          : 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
        e.currentTarget.style.boxShadow = isZero
          ? '0 2px 8px var(--goobs-black-a10)'
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
            @keyframes pulse-datagrid-currency {
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
            color: sacredtheme ? 'var(--goobs-gold)' : '#10B981',
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
              'linear-gradient(90deg, transparent, var(--goobs-white-a30), transparent)',
            animation: `shimmer-datagrid-currency 3s ease-in-out infinite`,
          }}
        >
          <style>
            {`
              @keyframes shimmer-datagrid-currency {
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
 * FORMAT CREDIT CARD
 * ------------------
 * Formats credit card numbers with security masking (PCI compliance).
 * Shows only last 4 digits, masks the rest with bullet characters.
 *
 * FEATURES:
 * - Masks all but last 4 digits for security
 * - Groups digits in 4s (•••• •••• •••• 1234)
 * - Security lock icon indicator
 * - Premium styling with subtle gradients
 * - Hover effects for interactivity
 *
 * SECURITY NOTE:
 * This is display-only masking. The actual stored value should be
 * tokenized or encrypted according to PCI DSS requirements.
 *
 * @param value - Card number (string or number)
 * @param sacredtheme - If true, uses dark/gold theme colors
 * @returns An object with the formatted string and the rendered element.
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
          color: sacredtheme ? 'var(--goobs-gold-a50)' : '#9CA3AF',
          backgroundColor: sacredtheme
            ? 'var(--goobs-gold-a05)'
            : 'rgba(156, 163, 175, 0.1)',
          border: sacredtheme
            ? '1px solid var(--goobs-gold-a30)'
            : '1px solid var(--goobs-gray-light-a30)',
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
        color: 'var(--goobs-gold)',
        bgGradient:
          'linear-gradient(135deg, var(--goobs-gold-a10) 0%, var(--goobs-gold-a05) 30%, var(--goobs-gold-a15) 100%)',
        borderColor: 'var(--goobs-gold-a60)',
      }
    : {
        color: 'var(--goobs-light-text)',
        bgGradient:
          'linear-gradient(135deg, var(--goobs-light-surface-raised) 0%, var(--goobs-light-border) 30%, var(--goobs-light-border-strong) 100%)',
        borderColor: 'var(--goobs-dark-border-strong)',
      }

  // Premium styled element with security-focused design
  const element = (
    <span
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
          ? `0 2px 8px var(--goobs-gold-a20)`
          : `0 2px 8px var(--goobs-black-a10)`,
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
          ? '0 4px 12px var(--goobs-gold-a30)'
          : '0 4px 12px var(--goobs-black-a15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = sacredtheme
          ? '0 2px 8px var(--goobs-gold-a20)'
          : '0 2px 8px var(--goobs-black-a10)'
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
          color: sacredtheme ? 'var(--goobs-gold)' : '#6B7280',
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
            'linear-gradient(45deg, transparent 30%, var(--goobs-white-a10) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </span>
  )

  return { formatted, element }
}

/**
 * FORMAT EXPIRATION DATE
 * ----------------------
 * Formats expiration dates (MM/YY) with validity status indication.
 *
 * STATUS INDICATORS:
 * - Valid (✓): Green - expires more than 6 months from now
 * - Expiring Soon (⏳): Yellow/Orange - expires within 6 months
 * - Expired (✕): Red - already expired
 * - Invalid (?): Gray - could not parse date
 *
 * INPUT FORMATS SUPPORTED:
 * - "1224" -> 12/24 (December 2024)
 * - "12/24" -> 12/24
 * - "122024" -> 12/24
 *
 * @param value - Date string in various formats
 * @param sacredtheme - If true, uses dark/gold theme colors
 * @returns An object with the formatted string and the rendered element.
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
          color: 'var(--goobs-dark-warn-text)',
          bg: 'rgba(251, 191, 36, 0.1)',
          borderColor: 'rgba(251, 191, 36, 0.5)',
        },
        expired: {
          color: 'var(--goobs-dark-danger-text)',
          bg: 'rgba(248, 113, 113, 0.1)',
          borderColor: 'rgba(248, 113, 113, 0.5)',
        },
        invalid: {
          color: '#9CA3AF',
          bg: 'rgba(156, 163, 175, 0.1)',
          borderColor: 'var(--goobs-gray-light-a30)',
        },
      },
      standard: {
        valid: {
          color: '#166534',
          bg: '#DCFCE7',
          borderColor: 'var(--goobs-dark-success-text)',
        },
        expiring_soon: {
          color: '#92400E',
          bg: '#FEF3C7',
          borderColor: 'var(--goobs-dark-warn-text)',
        },
        expired: {
          color: '#991B1B',
          bg: '#FEE2E2',
          borderColor: 'var(--goobs-dark-danger-text)',
        },
        invalid: {
          color: 'var(--goobs-light-text-muted)',
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
 * FORMAT ACCOUNT NUMBER
 * ---------------------
 * Formats bank account numbers with security masking.
 * Shows only last 4 digits for identification while protecting the full number.
 *
 * FEATURES:
 * - Masks all but last 4 digits (••••1234)
 * - Prefixed with # symbol
 * - Monospace font for alignment
 * - Theme-aware styling
 *
 * @param value - Account number (string or number)
 * @param sacredtheme - If true, uses dark/gold theme colors
 * @returns An object with the formatted string and the rendered element.
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
          color: sacredtheme ? 'var(--goobs-gold-a60)' : '#6B7280',
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
        color: 'var(--goobs-gold)',
        fontFamily: '"Caudex", serif',
        textShadow: '0 0 8px var(--goobs-gold-a50)',
      }
    : {
        color: 'var(--goobs-light-text)',
        fontFamily: '"Inter", sans-serif',
      }

  const element = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '0.75rem',
          opacity: 0.6,
          color: sacredtheme ? 'var(--goobs-gold)' : 'var(--goobs-light-text-muted)',
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
 * FORMAT ROUTING NUMBER
 * ---------------------
 * Formats ABA routing numbers for banking applications.
 * Validates that the routing number is exactly 9 digits.
 *
 * FEATURES:
 * - Validates 9-digit ABA format
 * - Shows "Invalid ABA" for incorrect length
 * - Bank symbol (⑆) prefix
 * - Interactive hover effect (expands letter spacing)
 * - Monospace font for readability
 *
 * NOTE: This does not perform checksum validation.
 * For full ABA validation, implement the checksum algorithm separately.
 *
 * @param value - Routing number (string or number)
 * @param sacredtheme - If true, uses dark/gold theme colors
 * @returns An object with the formatted string and the rendered element.
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
          color: 'var(--goobs-danger)',
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
          color: sacredtheme ? '#38BDF8' : 'var(--goobs-info)',
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

// =============================================================================
// ROWS COMPONENT
// =============================================================================

/**
 * Props for the Rows component.
 * These are passed from the Table parent component.
 */
interface RowsProps {
  /** Array of row data objects to display */
  rows: RowData[]
  /** Column definitions determining display and editing behavior */
  columns: ColumnDef[]
  /** Array of currently selected row IDs */
  selectedRowIds: string[]
  /** Handler for row click (toggles selection) */
  onRowClick?: (row: RowData) => void
  /** Theme and style configuration */
  styles?: DataGridStyles

  // ─────────────────────────────────────────────────────────────────────────────
  // INLINE EDITING PROPS
  // ─────────────────────────────────────────────────────────────────────────────

  /** Currently editing cell { rowId, field } or null */
  editingCell?: { rowId: string; field: string } | null
  /** Current value in the editing input */
  editingValue?: string
  /** Called when user clicks a cell to start editing */
  onCellClick?: (rowId: string, field: string, currentValue: unknown) => void
  /** Called when user saves an edited cell */
  onCellSave?: (rowId: string, field: string, value: string) => void
  /** Called when user cancels editing */
  onCellCancel?: () => void
  /** Called as user types in edit input */
  onEditingValueChange?: (value: string) => void

  /**
   * Access control forwarded from the grid. Cell-editing affordances
   * (pointer cursor, `data-cell-state="editable"`, click-to-edit — both
   * inline editors and the composite-field modal) only activate with
   * 'write' access. Mirrors MobileCardView's Card, which already gates
   * field editing on `permissions.access === 'write'`.
   */
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
}

/**
 * ROWS COMPONENT
 * --------------
 * Renders all data rows in the table body.
 *
 * RENDERING LOGIC:
 * 1. For each row, determine if selected and apply styles
 * 2. For each cell, determine content based on:
 *    a. Is it being edited? -> Render EditableCell
 *    b. Does column have renderCell? -> Use custom renderer
 *    c. Is value an array? -> Render as Chips
 *    d. Does column have special type? -> Use formatter
 *    e. Default -> Display as safe string
 */
const Rows: React.FC<RowsProps> = ({
  rows,
  columns,
  selectedRowIds,
  onRowClick,
  styles,
  editingCell,
  editingValue,
  onCellClick,
  onCellSave,
  onCellCancel,
  onEditingValueChange,
  permissions,
}) => {
  /** Check if using sacred (dark/gold) theme */
  const isSacredTheme = styles?.theme === 'sacred'
  const theme = styles?.theme || 'light'

  // Write access gates whether Enter/F2 opens an editor (mirrors the mouse
  // path's `canEdit`). Missing permissions mean write, same as the grid.
  const hasWriteAccess = !permissions || permissions.access === 'write'

  // APG Grid keyboard model (WCAG 2.1.1): roving tabindex + 2-D arrow nav over
  // the data cells. `columns.length` data columns — the leading checkbox cell
  // is not part of the roving set. Called before the empty-state return so the
  // hook order is stable across renders.
  const { active, registerCell, moveTo, syncActive, focusActive } =
    useGridKeyboardNav(rows?.length ?? 0, columns.length)

  // When an inline editor closes (Escape / save) the input unmounts; return
  // focus to the owning cell so keyboard users aren't dropped onto <body>.
  const prevEditingRef = React.useRef(editingCell)
  React.useEffect(() => {
    if (prevEditingRef.current && !editingCell) focusActive()
    prevEditingRef.current = editingCell
  }, [editingCell, focusActive])

  /**
   * Central keydown handler for a focused data cell. No-ops when the event
   * bubbled up from an interactive child (an inline editor input handles its
   * own keys); only acts when the cell itself is the focus target.
   */
  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLTableCellElement>,
    rowIndex: number,
    colIndex: number,
    row: RowData,
    col: ColumnDef
  ) => {
    if (e.target !== e.currentTarget) return

    const rowId = getRowId(row)
    const isEditableCol = col.editable !== false && hasWriteAccess

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        moveTo(rowIndex, colIndex + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveTo(rowIndex, colIndex - 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        moveTo(rowIndex + 1, colIndex)
        break
      case 'ArrowUp':
        e.preventDefault()
        moveTo(rowIndex - 1, colIndex)
        break
      case 'Home':
        e.preventDefault()
        moveTo(e.ctrlKey ? 0 : rowIndex, 0)
        break
      case 'End':
        e.preventDefault()
        if (e.ctrlKey) moveTo(rows.length - 1, columns.length - 1)
        else moveTo(rowIndex, columns.length - 1)
        break
      case 'PageDown':
        e.preventDefault()
        moveTo(rowIndex + 10, colIndex)
        break
      case 'PageUp':
        e.preventDefault()
        moveTo(rowIndex - 10, colIndex)
        break
      case ' ':
      case 'Spacebar':
        // Space toggles row selection (mirrors clicking the row).
        e.preventDefault()
        onRowClick?.(row)
        break
      case 'Enter':
      case 'F2':
        // Mirror the mouse flow: an unselected row selects first; a selected
        // row's editable cell enters edit mode (composite columns open their
        // modal via the same onCellClick route).
        e.preventDefault()
        if (!selectedRowIds.includes(rowId)) onRowClick?.(row)
        else if (isEditableCol) onCellClick?.(rowId, col.field, row[col.field])
        break
      default:
        break
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPTY STATE
  // ─────────────────────────────────────────────────────────────────────────────
  if (!rows || rows.length === 0) {
    return (
      <tr className={cssStyles.row} data-theme={theme} role="row">
        <td className={`${cssStyles.cell} ${cssStyles.cellCheckbox}`}></td>
        <td
          colSpan={100}
          className={`${cssStyles.cell} ${cssStyles.cellEmpty}`}
          role="gridcell"
        >
          {/* Status-message region (WCAG 4.1.3): when a search/filter empties
              the grid, assistive tech is notified of the change rather than it
              passing silently. */}
          <span role="status">No data to display.</span>
        </td>
      </tr>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER ROWS
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {rows.map((row, rowIndex) => {
        const rowId = getRowId(row)
        const isSelected = selectedRowIds.includes(rowId)
        const isAlternateRow = rowIndex % 2 === 1

        // Check if any cell in this row is editing with multiselect
        // (multiselect needs extra row height for the chip picker)
        const hasEditingMultiselect = columns.some(col => {
          const value = row[col.field]
          const isEditing =
            editingCell?.rowId === rowId && editingCell?.field === col.field
          return (
            isEditing &&
            (Array.isArray(value) ||
              col.creationField?.type === 'multiselect') &&
            col.creationField?.options
          )
        })

        const rowClassName = [
          cssStyles.row,
          isSelected && cssStyles.rowSelected,
          isAlternateRow && !isSelected && cssStyles.rowAlternate,
        ]
          .filter(Boolean)
          .join(' ')

        // Row-level editing state for the data-row-state attribute.
        // True when ANY cell in this row is currently in inline-edit mode.
        // Cheaper than the hasEditingMultiselect scan above — just a key check.
        const isRowEditing = editingCell?.rowId === rowId

        return (
          <tr
            key={rowId}
            onClick={() => onRowClick?.(row)}
            className={rowClassName}
            data-theme={theme}
            // Test-friendly row attributes:
            //   - data-row-id: stable identifier so Playwright can target
            //     `[data-row-id="${id}"]` instead of fragile cell-text
            //     matching. Tests that read `row._id` from the test seed
            //     get a deterministic locator for that row.
            //   - data-row-index: sequential index in the visible rows,
            //     useful when the test only knows position.
            //   - data-row-state: one of 'idle' | 'editing' | 'selected'
            //     so tests can wait for state transitions without
            //     inspecting className tokens.
            //   - aria-selected: real ARIA so screenreaders + accessibility
            //     tools see the same state the test does.
            //   - role="row": explicit semantics (most browsers infer this
            //     from <tr> but the explicit attribute survives any
            //     refactor that swaps in a non-table row primitive).
            data-row-id={rowId}
            data-row-index={rows.indexOf(row)}
            data-row-state={
              isRowEditing
                ? 'editing'
                : selectedRowIds.includes(rowId)
                  ? 'selected'
                  : 'idle'
            }
            aria-selected={selectedRowIds.includes(rowId) || undefined}
            role="row"
            style={
              hasEditingMultiselect
                ? { height: 'auto', minHeight: '120px' }
                : undefined
            }
          >
            {/* Empty column to align with header checkbox */}
            <td
              className={`${cssStyles.cell} ${cssStyles.cellCheckbox}`}
              data-cell="checkbox"
              role="gridcell"
            ></td>

            {/* ─────────────────────────────────────────────────────────────
                CELL RENDERING
                For each column, determine how to render the cell content.
                Priority order:
                1. __overflow__ special case (legacy)
                2. Currently editing -> EditableCell
                3. Custom renderCell function
                4. Array value -> Chips
                5. Special type (currency, credit_card, etc.) -> Formatter
                6. Default -> safeString()
                ───────────────────────────────────────────────────────────── */}
            {columns.map((col, colIndex) => {
              const value = row[col.field]
              const isEditing =
                editingCell?.rowId === rowId && editingCell?.field === col.field
              const isActiveCell =
                active.row === rowIndex && active.col === colIndex
              let cellContent: React.ReactNode

              if (col.field === '__overflow__') {
                // Legacy overflow column handling
                cellContent = '---'
              } else if (isEditing) {
                // EDITING STATE: Render EditableCell component
                cellContent = (
                  <EditableCell
                    column={col}
                    value={value}
                    editingValue={editingValue || ''}
                    onEditingValueChange={onEditingValueChange || (() => {})}
                    onSave={() =>
                      onCellSave?.(rowId, col.field, editingValue || '')
                    }
                    onCancel={() => onCellCancel?.()}
                    styles={styles}
                  />
                )
              } else {
                // ─────────────────────────────────────────────────────────────
                // DISPLAY STATE: Format value based on column configuration
                // ─────────────────────────────────────────────────────────────

                // Priority 1: Custom render function
                if (col.renderCell) {
                  cellContent = col.renderCell({
                    row,
                    value,
                    field: col.field,
                    rowIndex: rows.indexOf(row),
                    columnIndex: columns.indexOf(col),
                  })
                }
                // Priority 2: Array values -> Display as Chips
                else if (Array.isArray(value)) {
                  // Arrays are rendered as a collection of Chip components
                  const arrayItems = value as any[]

                  // Check if it's an array of objects with label/name properties
                  const isObjectArray =
                    arrayItems.length > 0 && typeof arrayItems[0] === 'object'

                  cellContent = (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        padding: '4px 0',
                        alignItems: 'center',
                      }}
                    >
                      {arrayItems.map((item, index) => {
                        let label = ''

                        if (isObjectArray && item) {
                          // Try to get a display value from the object
                          label =
                            item.positionName ||
                            item.name ||
                            item.label ||
                            item.title ||
                            item._id ||
                            ''
                        } else {
                          // It's a primitive value
                          label = String(item)
                        }

                        return (
                          <Chip
                            key={index}
                            label={label}
                            styles={{
                              theme: isSacredTheme ? 'sacred' : 'light',
                              fontSize: '12px',
                              backgroundColor: isSacredTheme
                                ? 'var(--goobs-gold-a10)'
                                : '#f0f0f0',
                              color: isSacredTheme ? 'var(--goobs-gold)' : '#333',
                              borderColor: isSacredTheme
                                ? 'var(--goobs-gold)'
                                : '#d0d0d0',
                            }}
                          />
                        )
                      })}
                      {arrayItems.length === 0 && (
                        <span style={{ color: '#999', fontSize: '14px' }}>
                          No items
                        </span>
                      )}
                    </div>
                  )
                }
                // ─────────────────────────────────────────────────────────────
                // Priority 3: Column type-specific formatters
                // Each type has a dedicated formatting function
                // ─────────────────────────────────────────────────────────────
                else if (col.type === 'currency') {
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
                } else if (col.type === 'ipAddress') {
                  cellContent = (
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        color: isSacredTheme ? 'var(--goobs-gold)' : 'var(--goobs-light-text)',
                      }}
                    >
                      {safeString(value)}
                    </span>
                  )
                } else if (col.type === 'macAddress') {
                  cellContent = (
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        color: isSacredTheme ? 'var(--goobs-gold)' : 'var(--goobs-light-text)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {safeString(value)}
                    </span>
                  )
                } else if (col.type === 'vlan') {
                  cellContent = (
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        color: isSacredTheme ? '#10B981' : '#059669',
                        fontWeight: 'bold',
                      }}
                    >
                      {value ? `VLAN ${safeString(value)}` : ''}
                    </span>
                  )
                } else if (col.type === 'cidr') {
                  cellContent = (
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        color: isSacredTheme ? 'var(--goobs-info)' : 'var(--goobs-light-primary)',
                        fontWeight: 'bold',
                      }}
                    >
                      {value ? `/${safeString(value)}` : ''}
                    </span>
                  )
                } else if (col.type === 'subnet' || col.type === 'supernet') {
                  // For complex subnet/supernet objects, show formatted string
                  try {
                    const subnetValue = value as {
                      address?: string
                      mask?: number
                    } | null
                    if (
                      subnetValue &&
                      subnetValue.address &&
                      subnetValue.mask !== undefined
                    ) {
                      cellContent = (
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            color: isSacredTheme ? 'var(--goobs-gold)' : 'var(--goobs-light-text)',
                          }}
                        >
                          {`${subnetValue.address}/${subnetValue.mask}`}
                        </span>
                      )
                    } else {
                      cellContent = safeString(value)
                    }
                  } catch {
                    cellContent = safeString(value)
                  }
                } else {
                  cellContent = safeString(value)
                }
              }

              // Check if this cell is editing with multiselect
              const isEditingMultiselect =
                isEditing &&
                (Array.isArray(value) ||
                  col.creationField?.type === 'multiselect') &&
                col.creationField?.options

              // Editing requires 'write' access — 'read' grids never show
              // the editable affordance nor route clicks into onCellClick
              // (which would otherwise open inline editors / the
              // composite-field modal). Same gate MobileCardView applies.
              const canEdit =
                !isEditing &&
                selectedRowIds.includes(rowId) &&
                col.editable !== false &&
                (!permissions || permissions.access === 'write')

              return (
                <td
                  key={col.field}
                  className={cssStyles.cell}
                  // Test-friendly cell attributes:
                  //   - data-field-name: the column's `field` key, lets
                  //     tests address a specific cell as
                  //     `[data-row-id="X"] [data-field-name="email"]`
                  //     without counting columns. Survives column
                  //     reordering and renames.
                  //   - data-cell-state: 'idle' | 'editing' | 'editable'
                  //     — tests can wait for `data-cell-state="editing"`
                  //     to know an inline editor mounted, vs. polling
                  //     for an input element.
                  //   - role="gridcell": standard ARIA semantics for a
                  //     screen reader / accessibility tool.
                  data-field-name={col.field}
                  data-cell-state={
                    isEditing ? 'editing' : canEdit ? 'editable' : 'idle'
                  }
                  role="gridcell"
                  // APG Grid roving tabindex (WCAG 2.1.1): exactly one data
                  // cell is in the tab order; arrow keys move focus between the
                  // rest. onFocus keeps the roving index in step with pointer /
                  // Tab focus; onKeyDown drives navigation + Enter/F2/Space.
                  tabIndex={isActiveCell ? 0 : -1}
                  ref={registerCell(rowIndex, colIndex)}
                  onFocus={() => syncActive(rowIndex, colIndex)}
                  onKeyDown={e =>
                    handleCellKeyDown(e, rowIndex, colIndex, row, col)
                  }
                  style={
                    isEditingMultiselect
                      ? {
                          height: 'auto',
                          minHeight: '120px',
                          padding: '12px',
                          verticalAlign: 'top',
                          overflow: 'visible',
                          position: 'relative',
                          zIndex: 1000,
                          cursor: canEdit ? 'pointer' : 'default',
                        }
                      : { cursor: canEdit ? 'pointer' : 'default' }
                  }
                  onClick={e => {
                    // If we're editing, prevent any click handling
                    if (isEditing) {
                      e.stopPropagation()
                      return
                    }
                    // Only handle cell click if not editing, row is selected, and column is editable
                    if (canEdit) {
                      e.stopPropagation()

                      // Handle cell editing
                      onCellClick?.(rowId, col.field, value)
                    }
                  }}
                >
                  <div className={cssStyles.cellContent}>{cellContent}</div>
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}

export default Rows

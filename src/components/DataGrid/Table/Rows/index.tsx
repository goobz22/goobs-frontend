'use client'

import React from 'react'
import { TableBody, TableRow, TableCell, Checkbox } from '@mui/material'
import StyledTooltip from '../../../Tooltip'
import type { RowData, ColumnDef } from '../../types'
import { getRowId } from '../index'

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
  sacredTheme: boolean = false
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
    if (sacredTheme) {
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
            color: sacredTheme ? '#FFD700' : '#10B981',
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
  sacredTheme: boolean = false
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
          color: sacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#9CA3AF',
          backgroundColor: sacredTheme
            ? 'rgba(255, 215, 0, 0.05)'
            : 'rgba(156, 163, 175, 0.1)',
          border: sacredTheme
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
  const cardInfo = sacredTheme
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
        boxShadow: sacredTheme
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
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 4px 12px rgba(255, 215, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = sacredTheme
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
          color: sacredTheme ? '#FFD700' : '#6B7280',
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
  sacredTheme: boolean = false
): {
  formatted: string
  element: React.ReactNode
} {
  // Convert to string and parse expiration date
  let dateStr = ''

  if (typeof value === 'string') {
    dateStr = value.trim()
  } else if (typeof value === 'number') {
    dateStr = String(value)
  } else {
    dateStr = ''
  }

  // Handle empty or invalid input
  if (!dateStr) {
    const formatted = '--/----'
    const element = (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.3,
          letterSpacing: '0.05em',
          color: sacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#9CA3AF',
          backgroundColor: sacredTheme
            ? 'rgba(255, 215, 0, 0.05)'
            : 'rgba(156, 163, 175, 0.1)',
          border: sacredTheme
            ? '1px solid rgba(255, 215, 0, 0.3)'
            : '1px solid rgba(156, 163, 175, 0.3)',
          borderRadius: '6px',
          padding: '5px 10px',
          minWidth: '80px',
          textAlign: 'center' as const,
          userSelect: 'none',
        }}
      >
        {formatted}
      </span>
    )
    return { formatted, element }
  }

  // Parse different date formats (MM/YYYY, MM/YY, etc.)
  const parseExpirationDate = (input: string) => {
    // Remove any non-digit/slash characters
    const cleaned = input.replace(/[^\d/]/g, '')

    // Handle MM/YYYY or MM/YY format
    const parts = cleaned.split('/')
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10)
      let year = parseInt(parts[1], 10)

      // Convert 2-digit year to 4-digit year
      if (year < 100) {
        year += year < 50 ? 2000 : 1900
      }

      if (month >= 1 && month <= 12 && year >= 2000 && year <= 2099) {
        return { month, year, isValid: true }
      }
    }

    return { month: 0, year: 0, isValid: false }
  }

  const parsedDate = parseExpirationDate(dateStr)

  if (!parsedDate.isValid) {
    const formatted = 'Invalid'
    const element = (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
          fontWeight: 400,
          fontSize: '0.875rem',
          color: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '6px',
          padding: '5px 10px',
          minWidth: '80px',
          textAlign: 'center' as const,
          userSelect: 'none',
        }}
      >
        {formatted}
      </span>
    )
    return { formatted, element }
  }

  // Format the date consistently
  const formatted = `${parsedDate.month.toString().padStart(2, '0')}/${parsedDate.year}`

  // Check expiration status
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed
  const currentYear = now.getFullYear()

  const isExpired =
    parsedDate.year < currentYear ||
    (parsedDate.year === currentYear && parsedDate.month < currentMonth)

  const isExpiringSoon =
    (!isExpired &&
      parsedDate.year === currentYear &&
      parsedDate.month <= currentMonth + 3) ||
    (parsedDate.year === currentYear + 1 &&
      currentMonth >= 10 &&
      parsedDate.month <= currentMonth - 9)

  // Get styling based on expiration status
  const getStatusStyling = () => {
    if (sacredTheme) {
      if (isExpired) {
        return {
          color: '#EF4444',
          bgGradient:
            'linear-gradient(135deg, rgba(127, 29, 29, 0.8) 0%, rgba(185, 28, 28, 0.5) 50%, rgba(127, 29, 29, 0.8) 100%)',
          borderColor: '#DC2626',
          icon: '⚠️',
          status: 'EXPIRED',
        }
      } else if (isExpiringSoon) {
        return {
          color: '#F59E0B',
          bgGradient:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 50%, rgba(245, 158, 11, 0.2) 100%)',
          borderColor: '#D97706',
          icon: '⏰',
          status: 'EXPIRING',
        }
      } else {
        return {
          color: '#FFD700',
          bgGradient:
            'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 50%, rgba(255, 215, 0, 0.15) 100%)',
          borderColor: 'rgba(255, 215, 0, 0.6)',
          icon: '✓',
          status: 'VALID',
        }
      }
    }

    // Original theme styling
    if (isExpired) {
      return {
        color: '#DC2626',
        bgGradient:
          'linear-gradient(135deg, #FEF2F2 0%, #FECACA 50%, #FCA5A5 100%)',
        borderColor: '#EF4444',
        icon: '⚠️',
        status: 'EXPIRED',
      }
    } else if (isExpiringSoon) {
      return {
        color: '#D97706',
        bgGradient:
          'linear-gradient(135deg, #FFFBEB 0%, #FED7AA 50%, #FDBA74 100%)',
        borderColor: '#F59E0B',
        icon: '⏰',
        status: 'EXPIRING',
      }
    } else {
      return {
        color: '#059669',
        bgGradient:
          'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
        borderColor: '#10B981',
        icon: '✓',
        status: 'VALID',
      }
    }
  }

  const statusInfo = getStatusStyling()
  const formatId = `expiry-${Math.random().toString(36).substr(2, 9)}`

  // Premium styled element with expiration status
  const element = (
    <span
      id={formatId}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.3,
        letterSpacing: '0.05em',
        color: statusInfo.color,
        background: statusInfo.bgGradient,
        border: `1.5px solid ${statusInfo.borderColor}`,
        borderRadius: '8px',
        padding: '6px 12px',
        minWidth: '100px',
        textAlign: 'center' as const,
        boxShadow: sacredTheme
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
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 4px 12px rgba(255, 215, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Status icon */}
      <span
        style={{
          fontSize: '0.75rem',
          opacity: 0.8,
          marginRight: '6px',
        }}
      >
        {statusInfo.icon}
      </span>

      {/* Formatted date */}
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
          fontWeight: 600,
          flex: 1,
        }}
      >
        {formatted}
      </span>

      {/* Status text for expired/expiring cards */}
      {(isExpired || isExpiringSoon) && (
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            opacity: 0.7,
            marginLeft: '4px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}
        >
          {statusInfo.status}
        </span>
      )}

      {/* Subtle pattern overlay */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '15px',
          height: '100%',
          background:
            'linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 60%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />
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
  sacredTheme: boolean = false
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
    const formatted = '•••••••••••••'
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
          color: sacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#9CA3AF',
          backgroundColor: sacredTheme
            ? 'rgba(255, 215, 0, 0.05)'
            : 'rgba(156, 163, 175, 0.1)',
          border: sacredTheme
            ? '1px solid rgba(255, 215, 0, 0.3)'
            : '1px solid rgba(156, 163, 175, 0.3)',
          borderRadius: '6px',
          padding: '5px 10px',
          minWidth: '120px',
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

  // Format with spacing for readability
  const formatted = maskedDigits.replace(/(.{4})/g, '$1 ').trim()

  const formatId = `account-${Math.random().toString(36).substr(2, 9)}`

  // Banking-themed styled element with security focus
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
        color: sacredTheme ? '#FFD700' : '#1E40AF',
        background: sacredTheme
          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 30%, rgba(255, 215, 0, 0.15) 100%)'
          : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 30%, #BFDBFE 100%)',
        border: sacredTheme
          ? '1.5px solid rgba(255, 215, 0, 0.6)'
          : '1.5px solid #3B82F6',
        borderRadius: '8px',
        padding: '6px 12px',
        minWidth: '130px',
        textAlign: 'center' as const,
        boxShadow: sacredTheme
          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
          : '0 2px 8px rgba(59, 130, 246, 0.1)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 4px 12px rgba(255, 215, 0, 0.3)'
          : '0 4px 12px rgba(59, 130, 246, 0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
          : '0 2px 8px rgba(59, 130, 246, 0.1)'
      }}
    >
      {/* Bank icon */}
      <span
        style={{
          fontSize: '0.75rem',
          opacity: 0.7,
          marginRight: '6px',
          color: sacredTheme ? '#FFD700' : '#1D4ED8',
        }}
      >
        🏦
      </span>

      {/* Account number with special styling for masked vs visible digits */}
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
          display: 'flex',
          alignItems: 'center',
          gap: '1px',
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

      {/* Subtle security pattern overlay */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '100%',
          background:
            'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </span>
  )

  return { formatted, element }
}

/**
 * Format a value as a styled routing number for banking
 * Returns both the formatted string and a React element for display
 */
function formatRoutingNumber(
  value: unknown,
  sacredTheme: boolean = false
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
  if (!digits) {
    const formatted = '--- --- ---'
    const element = (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.3,
          letterSpacing: '0.05em',
          color: sacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#9CA3AF',
          backgroundColor: sacredTheme
            ? 'rgba(255, 215, 0, 0.05)'
            : 'rgba(156, 163, 175, 0.1)',
          border: sacredTheme
            ? '1px solid rgba(255, 215, 0, 0.3)'
            : '1px solid rgba(156, 163, 175, 0.3)',
          borderRadius: '6px',
          padding: '5px 10px',
          minWidth: '100px',
          textAlign: 'center' as const,
          userSelect: 'none',
        }}
      >
        {formatted}
      </span>
    )
    return { formatted, element }
  }

  // Validate routing number (should be 9 digits)
  const isValidLength = digits.length === 9

  // Format routing number with dashes (XXX-XXX-XXX)
  let formatted = digits
  if (digits.length >= 6) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  } else if (digits.length >= 3) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  const formatId = `routing-${Math.random().toString(36).substr(2, 9)}`

  // Styling based on validation
  const colorScheme = sacredTheme
    ? isValidLength
      ? {
          color: '#FFD700',
          bgGradient:
            'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 30%, rgba(255, 215, 0, 0.15) 100%)',
          borderColor: 'rgba(255, 215, 0, 0.6)',
          icon: '✓',
        }
      : {
          color: '#EF4444',
          bgGradient:
            'linear-gradient(135deg, rgba(127, 29, 29, 0.8) 0%, rgba(185, 28, 28, 0.5) 30%, rgba(127, 29, 29, 0.8) 100%)',
          borderColor: '#DC2626',
          icon: '⚠️',
        }
    : isValidLength
      ? {
          color: '#059669',
          bgGradient:
            'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 30%, #A7F3D0 100%)',
          borderColor: '#10B981',
          icon: '✓',
        }
      : {
          color: '#DC2626',
          bgGradient:
            'linear-gradient(135deg, #FEF2F2 0%, #FECACA 30%, #FCA5A5 100%)',
          borderColor: '#EF4444',
          icon: '⚠️',
        }

  // Professional routing number styled element
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
        letterSpacing: '0.05em',
        color: colorScheme.color,
        background: colorScheme.bgGradient,
        border: `1.5px solid ${colorScheme.borderColor}`,
        borderRadius: '8px',
        padding: '6px 12px',
        minWidth: '110px',
        textAlign: 'center' as const,
        boxShadow: sacredTheme
          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 4px 12px rgba(255, 215, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = sacredTheme
          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Validation icon */}
      <span
        style={{
          fontSize: '0.75rem',
          opacity: 0.8,
          marginRight: '6px',
        }}
      >
        {colorScheme.icon}
      </span>

      {/* Formatted routing number */}
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
          fontWeight: 600,
        }}
      >
        {formatted}
      </span>

      {/* Subtle pattern overlay */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '15px',
          height: '100%',
          background:
            'linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 60%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />
    </span>
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

  /** Enable Egyptian/Sacred theming */
  sacredTheme?: boolean
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
  sacredTheme = false,
}) => {
  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          {/* Extra cell for checkbox column */}
          <TableCell />
          <TableCell colSpan={finalDesktopColumns.length || 1}>
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  // -------------------------------------
  // Mobile: single-column approach
  // -------------------------------------
  if (isMobile) {
    return (
      <TableBody>
        {rows.map(row => {
          const rowId = getRowId(row)
          const isSelected = selectedRowIds.includes(rowId)

          // Find the selected column definition for mobile
          const mobileCol = allColumns.find(
            col => col.field === mobileSelectedColumn
          )

          // Safety check: if no column is selected or column doesn't exist, use the first available column
          const effectiveColumnField =
            mobileCol?.field ||
            (allColumns.length > 0 ? allColumns[0].field : '')
          const effectiveColumn =
            mobileCol || (allColumns.length > 0 ? allColumns[0] : null)

          // Handle currency formatting for mobile
          let cellDisplayValue: React.ReactNode
          let cellValueStr: string

          if (effectiveColumn?.formatCurrency) {
            const { formatted, element } = formatCurrency(
              row[effectiveColumnField],
              sacredTheme
            )
            cellDisplayValue = element
            cellValueStr = formatted
          } else if (effectiveColumn?.formatCreditCard) {
            const { formatted, element } = formatCreditCard(
              row[effectiveColumnField],
              sacredTheme
            )
            cellDisplayValue = element
            cellValueStr = formatted
          } else if (effectiveColumn?.formatExpirationDate) {
            const { formatted, element } = formatExpirationDate(
              row[effectiveColumnField],
              sacredTheme
            )
            cellDisplayValue = element
            cellValueStr = formatted
          } else if (effectiveColumn?.formatAccountNumber) {
            const { formatted, element } = formatAccountNumber(
              row[effectiveColumnField],
              sacredTheme
            )
            cellDisplayValue = element
            cellValueStr = formatted
          } else if (effectiveColumn?.formatRoutingNumber) {
            const { formatted, element } = formatRoutingNumber(
              row[effectiveColumnField],
              sacredTheme
            )
            cellDisplayValue = element
            cellValueStr = formatted
          } else {
            const rawValue = safeString(row[effectiveColumnField])
            cellDisplayValue = rawValue || 'No data'
            cellValueStr = rawValue || 'No data'
          }

          return (
            <TableRow
              key={rowId}
              hover
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                backgroundColor: isSelected
                  ? sacredTheme
                    ? 'rgba(255, 215, 0, 0.15)'
                    : 'rgba(0, 0, 255, 0.08)'
                  : 'unset',
                ...(sacredTheme && {
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  },
                }),
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected}
                  onChange={e => {
                    e.stopPropagation()
                    onRowCheckboxChange(rowId)
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  // Match header cell styling for consistency
                  width: '100%',
                  minWidth: 200,
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingLeft: 0,
                  paddingRight: 8,
                  boxSizing: 'border-box',
                }}
              >
                <StyledTooltip
                  title={cellValueStr}
                  tooltipcolor={sacredTheme ? '#FFD700' : '#444'}
                  tooltipplacement="top"
                  offsetX={0}
                  offsetY={5}
                  arrow
                  sacredTheme={sacredTheme}
                >
                  <span>{cellDisplayValue}</span>
                </StyledTooltip>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  }

  // -------------------------------------
  // Desktop/tablet: multi-column approach
  // -------------------------------------
  return (
    <TableBody>
      {rows.map((row, rowIndex) => {
        const rowId = getRowId(row)
        const isSelected = selectedRowIds.includes(rowId)

        return (
          <TableRow
            key={rowId}
            hover
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              backgroundColor: isSelected
                ? sacredTheme
                  ? 'rgba(255, 215, 0, 0.15)'
                  : 'rgba(0, 0, 255, 0.08)'
                : 'unset',
              ...(sacredTheme && {
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                },
              }),
            }}
          >
            {/* Checkbox cell */}
            <TableCell padding="checkbox">
              <Checkbox
                checked={isSelected}
                onChange={e => {
                  e.stopPropagation()
                  onRowCheckboxChange(rowId)
                }}
              />
            </TableCell>

            {finalDesktopColumns.map((col, columnIndex) => {
              // Overflow logic
              if (col.field === '__overflow__') {
                const actualCol = overflowDesktopColumns.find(
                  c => c.field === selectedOverflowField
                )
                const fieldToRender = actualCol?.field
                const cellValue =
                  fieldToRender != null ? row[fieldToRender] : undefined

                // Handle currency formatting for overflow columns
                let cellDisplayValue: React.ReactNode
                let cellValueStr: string

                if (actualCol?.formatCurrency) {
                  const { formatted, element } = formatCurrency(
                    cellValue,
                    sacredTheme
                  )
                  cellDisplayValue = element
                  cellValueStr = formatted
                } else if (actualCol?.formatCreditCard) {
                  const { formatted, element } = formatCreditCard(
                    cellValue,
                    sacredTheme
                  )
                  cellDisplayValue = element
                  cellValueStr = formatted
                } else if (actualCol?.formatExpirationDate) {
                  const { formatted, element } = formatExpirationDate(
                    cellValue,
                    sacredTheme
                  )
                  cellDisplayValue = element
                  cellValueStr = formatted
                } else if (actualCol?.formatAccountNumber) {
                  const { formatted, element } = formatAccountNumber(
                    cellValue,
                    sacredTheme
                  )
                  cellDisplayValue = element
                  cellValueStr = formatted
                } else if (actualCol?.formatRoutingNumber) {
                  const { formatted, element } = formatRoutingNumber(
                    cellValue,
                    sacredTheme
                  )
                  cellDisplayValue = element
                  cellValueStr = formatted
                } else {
                  cellDisplayValue = safeString(cellValue)
                  cellValueStr = safeString(cellValue)
                }

                return (
                  <TableCell
                    key={`overflow-${rowId}-${columnIndex}`}
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingLeft: 5,
                    }}
                  >
                    <StyledTooltip
                      title={cellValueStr}
                      tooltipcolor={sacredTheme ? '#FFD700' : '#444'}
                      tooltipplacement="top"
                      offsetX={0}
                      offsetY={5}
                      arrow
                      sacredTheme={sacredTheme}
                    >
                      <span>{cellDisplayValue}</span>
                    </StyledTooltip>
                  </TableCell>
                )
              }

              // Normal column
              let cellContent: React.ReactNode
              if (typeof col.renderCell === 'function') {
                const cellParams = {
                  row,
                  value: row[col.field],
                  field: col.field,
                  rowIndex,
                  columnIndex,
                }
                cellContent = col.renderCell(cellParams)
              } else if (col.formatCurrency) {
                // Handle currency formatting
                const { element } = formatCurrency(row[col.field], sacredTheme)
                cellContent = element
              } else if (col.formatCreditCard) {
                // Handle credit card formatting
                const { element } = formatCreditCard(
                  row[col.field],
                  sacredTheme
                )
                cellContent = element
              } else if (col.formatExpirationDate) {
                // Handle expiration date formatting
                const { element } = formatExpirationDate(
                  row[col.field],
                  sacredTheme
                )
                cellContent = element
              } else if (col.formatAccountNumber) {
                // Handle account number formatting
                const { element } = formatAccountNumber(
                  row[col.field],
                  sacredTheme
                )
                cellContent = element
              } else if (col.formatRoutingNumber) {
                // Handle routing number formatting
                const { element } = formatRoutingNumber(
                  row[col.field],
                  sacredTheme
                )
                cellContent = element
              } else {
                // Because row[col.field] is unknown, cast to ReactNode or fallback to a string
                const val = row[col.field] as React.ReactNode | undefined
                // If it's not a valid ReactNode (e.g. object?), fallback to string:
                cellContent =
                  val && (typeof val === 'string' || React.isValidElement(val))
                    ? val
                    : safeString(val)
              }

              // Tooltip text needs a string, so convert cellContent safely
              // For special formatting columns, use the formatted string; otherwise use safeString
              const cellContentStr = col.formatCurrency
                ? formatCurrency(row[col.field], sacredTheme).formatted
                : col.formatCreditCard
                  ? formatCreditCard(row[col.field], sacredTheme).formatted
                  : col.formatExpirationDate
                    ? formatExpirationDate(row[col.field], sacredTheme)
                        .formatted
                    : col.formatAccountNumber
                      ? formatAccountNumber(row[col.field], sacredTheme)
                          .formatted
                      : col.formatRoutingNumber
                        ? formatRoutingNumber(row[col.field], sacredTheme)
                            .formatted
                        : safeString(cellContent)

              // Respect manual widths if present
              const widthStyles: Record<string, string | number> = {}
              if (col.width) {
                widthStyles.width = col.width
                widthStyles.minWidth = col.width
                widthStyles.maxWidth = col.width
              } else if (col.field === 'id' || col.field === '_id') {
                widthStyles.width = '60px'
                widthStyles.minWidth = '60px'
                widthStyles.maxWidth = '60px'
              } else {
                widthStyles.maxWidth = 200
              }

              // Adjust cell styles for custom rendered cells and special formatting
              const isCustomRendered = typeof col.renderCell === 'function'
              const isCurrencyColumn = col.formatCurrency
              const isCreditCardColumn = col.formatCreditCard
              const isExpirationDateColumn = col.formatExpirationDate
              const isAccountNumberColumn = col.formatAccountNumber
              const isRoutingNumberColumn = col.formatRoutingNumber
              const isSpecialColumn =
                isCurrencyColumn ||
                isCreditCardColumn ||
                isExpirationDateColumn ||
                isAccountNumberColumn ||
                isRoutingNumberColumn

              const cellStyles = {
                whiteSpace:
                  isCustomRendered || isSpecialColumn ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                paddingLeft: 1,
                paddingRight: 1,
                ...(isCustomRendered ? { padding: '8px 4px' } : {}),
                ...(isSpecialColumn
                  ? {
                      padding: '8px 4px',
                      verticalAlign: 'middle',
                    }
                  : {}),
                ...widthStyles,
              }

              return (
                <TableCell
                  key={`${col.field}-${rowId}-${columnIndex}`}
                  sx={cellStyles}
                >
                  {React.isValidElement(cellContent) ? (
                    cellContent // Directly render React elements without wrapping in tooltip
                  ) : (
                    <StyledTooltip
                      title={cellContentStr}
                      tooltipcolor={sacredTheme ? '#FFD700' : '#444'}
                      tooltipplacement="top"
                      offsetX={0}
                      offsetY={5}
                      arrow
                      sacredTheme={sacredTheme}
                    >
                      <span>{cellContent}</span>
                    </StyledTooltip>
                  )}
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export default Rows

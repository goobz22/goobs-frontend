'use client'

import React, { useState } from 'react'
import { alpha } from '../../../../utils'

const SACRED_GOLD = '#FFD700'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangeProps {
  startLabel?: string
  endLabel?: string
  value?: DateRange
  onChange?: (dateRange: DateRange) => void
  disableFutureDateValidation?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  style?: React.CSSProperties
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: string
    helperTextType?: string
    height?: string
    fontSize?: string
    borderRadius?: string
    marginBottom?: string
    marginTop?: string
    width?: string
    minHeight?: string
    padding?: string
    gap?: string
  }
  helperText?: string
}

const DateRange: React.FC<DateRangeProps> = ({
  startLabel = 'Start Date',
  endLabel = 'End Date',
  value,
  onChange,
  disabled: disabledProp,
  required: requiredProp,
  error,
  style,
  styles,
  helperText,
}) => {
  const [isStartFocused, setIsStartFocused] = useState(false)
  const [isEndFocused, setIsEndFocused] = useState(false)

  const disabled = disabledProp || styles?.disabled || false
  const required = requiredProp || styles?.required || false
  const displayHelperText = error || helperText

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      const newRange = {
        start: date,
        end: value?.end || null,
      }
      // If start date is after end date, clear end date
      if (newRange.end && date > newRange.end) {
        newRange.end = null
      }
      onChange?.(newRange)
    } else {
      onChange?.({ start: null, end: value?.end || null })
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      onChange?.({
        start: value?.start || null,
        end: date,
      })
    } else {
      onChange?.({ start: value?.start || null, end: null })
    }
  }

  const inputStyle = (isFocused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: styles?.padding || '12px 16px',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
    border: `1px solid ${alpha(SACRED_GOLD, isFocused ? 0.6 : 0.3)}`,
    borderRadius: '8px',
    color: disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Crimson Text", serif',
    fontSize: '16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isFocused ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    outline: 'none',
    boxSizing: 'border-box' as const,
    colorScheme: 'dark',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: SACRED_GOLD,
    fontSize: '14px',
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
  }

  return (
    <div
      style={{
        position: 'relative',
        width: styles?.width || '100%',
        marginBottom: styles?.marginBottom || '16px',
        marginTop: styles?.marginTop,
        minHeight: styles?.minHeight,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: styles?.gap || '16px',
          alignItems: 'flex-start',
        }}
      >
        {/* Start Date */}
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            {startLabel}
            {required && (
              <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
            )}
          </label>
          <input
            type="date"
            value={formatDateForInput(value?.start || null)}
            onChange={handleStartDateChange}
            disabled={disabled}
            onFocus={() => setIsStartFocused(true)}
            onBlur={() => setIsStartFocused(false)}
            style={inputStyle(isStartFocused)}
          />
        </div>

        {/* End Date */}
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            {endLabel}
            {required && (
              <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
            )}
          </label>
          <input
            type="date"
            value={formatDateForInput(value?.end || null)}
            onChange={handleEndDateChange}
            disabled={disabled}
            min={value?.start ? formatDateForInput(value.start) : undefined}
            onFocus={() => setIsEndFocused(true)}
            onBlur={() => setIsEndFocused(false)}
            style={inputStyle(isEndFocused)}
          />
        </div>
      </div>

      {/* Helper Text / Error */}
      {displayHelperText && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: error ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)',
            fontFamily: '"Crimson Text", serif',
          }}
        >
          {displayHelperText}
        </div>
      )}
    </div>
  )
}

export default DateRange

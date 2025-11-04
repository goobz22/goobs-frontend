'use client'

import React, { useState } from 'react'
import { alpha } from '../../../../utils'

const SACRED_GOLD = '#FFD700'

export interface DateFieldProps {
  label?: string
  value?: Date | null
  onChange: (date: Date | null) => void
  variant?: string
  disableFutureDateValidation?: boolean
  placeholder?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: string
    [key: string]: any
  }
  helperText?: string
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  styles,
  helperText,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      onChange(date)
    } else {
      onChange(null)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
      {/* Label */}
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: SACRED_GOLD,
          fontSize: '14px',
          fontFamily: '"Cinzel", serif',
          letterSpacing: '0.05em',
        }}
      >
        {label}
        {required && (
          <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
        )}
      </label>

      {/* Date Input */}
      <input
        type="date"
        value={formatDateForInput(value || null)}
        onChange={handleDateChange}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: disabled
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(0, 0, 0, 0.6)',
          border: `1px solid ${alpha(SACRED_GOLD, isFocused ? 0.6 : 0.3)}`,
          borderRadius: '8px',
          color: disabled
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.9)',
          fontFamily: '"Crimson Text", serif',
          fontSize: '16px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isFocused ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
          outline: 'none',
          boxSizing: 'border-box',
          colorScheme: 'dark',
        }}
      />

      {/* Helper Text */}
      {helperText && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: '"Crimson Text", serif',
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  )
}

export default DateField

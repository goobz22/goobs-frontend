'use client'

import React, { useState, useRef, useEffect } from 'react'
import { alpha } from '../../../../utils'

const SACRED_GOLD = '#FFD700'

export interface TimeFieldProps {
  onChange?: (time: Date | null) => void
  value?: Date | null
  label?: string
  helperText?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: string
  }
}

const formatTimeForInput = (date: Date | null): string => {
  if (!date) return ''
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const parseTimeInput = (timeString: string): Date | null => {
  if (!timeString) return null
  const [hours, minutes] = timeString.split(':').map(Number)
  if (isNaN(hours!) || isNaN(minutes!)) return null
  const date = new Date()
  date.setHours(hours!, minutes!, 0, 0)
  return date
}

const TimeField: React.FC<TimeFieldProps> = ({
  onChange,
  value,
  label = 'Time',
  helperText,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseTimeInput(e.target.value)
    onChange?.(newTime)
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== formatTimeForInput(value || null)) {
        const newTime = parseTimeInput(target.value)
        onChange?.(newTime)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
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
    colorScheme: 'dark' as const,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: SACRED_GOLD,
    fontSize: '14px',
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
  }

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
      <div style={{ flex: 1 }}>
        <label style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
          )}
        </label>
        <input
          ref={inputRef}
          type="time"
          value={formatTimeForInput(value || null)}
          onChange={handleChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
        />
      </div>

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

export default TimeField

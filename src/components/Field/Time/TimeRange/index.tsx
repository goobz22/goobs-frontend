'use client'

import React, { useState, useRef, useEffect } from 'react'
import { alpha } from '../../../../utils'

const SACRED_GOLD = '#FFD700'

export interface TimeRange {
  start: Date | null
  end: Date | null
}

export interface TimeRangeProps {
  onChange?: (timeRange: TimeRange) => void
  value?: TimeRange
  startLabel?: string
  endLabel?: string
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

const TimeRangeComponent: React.FC<TimeRangeProps> = ({
  onChange,
  value,
  startLabel = 'Start Time',
  endLabel = 'End Time',
  helperText,
  styles,
}) => {
  const [isStartFocused, setIsStartFocused] = useState(false)
  const [isEndFocused, setIsEndFocused] = useState(false)
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = parseTimeInput(e.target.value)
    const newRange = { start: newStart, end: value?.end || null }
    onChange?.(newRange)
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseTimeInput(e.target.value)
    const newRange = { start: value?.start || null, end: newEnd }
    onChange?.(newRange)
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const startEl = startInputRef.current
    const endEl = endInputRef.current

    const handleNativeStartInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== formatTimeForInput(value?.start || null)) {
        const newStart = parseTimeInput(target.value)
        const newRange = { start: newStart, end: value?.end || null }
        onChange?.(newRange)
      }
    }

    const handleNativeEndInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== formatTimeForInput(value?.end || null)) {
        const newEnd = parseTimeInput(target.value)
        const newRange = { start: value?.start || null, end: newEnd }
        onChange?.(newRange)
      }
    }

    if (startEl) startEl.addEventListener('input', handleNativeStartInput)
    if (endEl) endEl.addEventListener('input', handleNativeEndInput)
    return () => {
      if (startEl) startEl.removeEventListener('input', handleNativeStartInput)
      if (endEl) endEl.removeEventListener('input', handleNativeEndInput)
    }
  }, [onChange, value])

  const inputStyle = (isFocused: boolean): React.CSSProperties => ({
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
    <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Start Time */}
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            {startLabel}
            {required && (
              <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
            )}
          </label>
          <input
            ref={startInputRef}
            type="time"
            value={formatTimeForInput(value?.start || null)}
            onChange={handleStartChange}
            disabled={disabled}
            onFocus={() => setIsStartFocused(true)}
            onBlur={() => setIsStartFocused(false)}
            style={inputStyle(isStartFocused)}
          />
        </div>

        {/* End Time */}
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            {endLabel}
            {required && (
              <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>*</span>
            )}
          </label>
          <input
            ref={endInputRef}
            type="time"
            value={formatTimeForInput(value?.end || null)}
            onChange={handleEndChange}
            disabled={disabled}
            onFocus={() => setIsEndFocused(true)}
            onBlur={() => setIsEndFocused(false)}
            style={inputStyle(isEndFocused)}
          />
        </div>
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

export default TimeRangeComponent

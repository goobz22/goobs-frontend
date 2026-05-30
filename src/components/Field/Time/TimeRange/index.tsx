'use client'

import React, { useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'

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
  /** Error message rendered below the inputs; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** HTML-style field name. Alias for dataFieldName so the test contract can target the field by either; data-field-name is emitted from dataFieldName ?? name. */
  name?: string
  styles?: FieldStyleOverrides
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
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
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

  // Listen for native 'input' events from browser-automation tools that
  // bypass React's synthetic-event system. Two listeners — one per
  // input — keep both ends of the range in sync with agent-driven
  // input.
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

  // Inline input styles preserved from the legacy sacred-gold theme
  // until the inputs migrate to a CSS module. FieldShell still owns
  // label/helper rendering.
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    color: disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)',
    fontFamily: '"Crimson Text", serif',
    fontSize: '16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box' as const,
    colorScheme: 'dark' as const,
  }

  // Two FieldShells side-by-side share the start/end labels. Only the
  // start shell carries `error` + `helperText` so the helper region
  // renders once below the pair.
  return (
    <div data-field={dataField} data-field-name={dataFieldName ?? name}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <FieldShell
            label={startLabel}
            helperText={helperText}
            error={error}
            disabled={disabled}
            required={required}
            styles={styles}
          >
            {({ inputId, inputAriaProps }) => (
              <input
                ref={startInputRef}
                id={inputId}
                type="time"
                value={formatTimeForInput(value?.start || null)}
                onChange={handleStartChange}
                disabled={disabled}
                required={required}
                style={inputStyle}
                {...inputAriaProps}
              />
            )}
          </FieldShell>
        </div>

        <div style={{ flex: 1 }}>
          <FieldShell
            label={endLabel}
            disabled={disabled}
            required={required}
            styles={styles}
          >
            {({ inputId, inputAriaProps }) => (
              <input
                ref={endInputRef}
                id={inputId}
                type="time"
                value={formatTimeForInput(value?.end || null)}
                onChange={handleEndChange}
                disabled={disabled}
                required={required}
                style={inputStyle}
                {...inputAriaProps}
              />
            )}
          </FieldShell>
        </div>
      </div>
    </div>
  )
}

TimeRangeComponent.displayName = 'TimeRange'

export default TimeRangeComponent

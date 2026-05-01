'use client'

import React, { useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'

export interface TimeFieldProps {
  onChange?: (time: Date | null) => void
  value?: Date | null
  label?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
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

const TimeField: React.FC<TimeFieldProps> = ({
  onChange,
  value,
  label = 'Time',
  helperText,
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseTimeInput(e.target.value)
    onChange?.(newTime)
  }

  // Listen for native 'input' events from browser-automation tools
  // (e.g. agent-browser's form_input) that bypass React's synthetic
  // event system.
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

  // Inline styles preserved for the input itself — the previous
  // implementation drew the sacred-gold border + dark color scheme
  // entirely from JS, and we want to keep the visual parity until
  // someone moves the input chrome to a CSS module.
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

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <input
          ref={inputRef}
          id={inputId}
          data-field-name={dataFieldName}
          type="time"
          value={formatTimeForInput(value || null)}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          style={inputStyle}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

TimeField.displayName = 'TimeField'

export default TimeField

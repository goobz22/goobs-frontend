'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './DateField.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'

export interface DateFieldProps {
  label?: string
  value?: Date | null
  onChange: (date: Date | null) => void
  variant?: string
  disableFutureDateValidation?: boolean
  placeholder?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides & {
    // DateField-local layout overrides forwarded as inline styles on the
    // input itself, since FieldShell only forwards layout props onto the
    // outer wrapper.
    height?: string
    fontSize?: string
    borderRadius?: string
    padding?: string
  }
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Listen for native 'input' events from browser-automation tools that
  // bypass React's synthetic-event system. Without this, agent-driven
  // input doesn't sync into the controlled value.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const dateString = target.value
      if (dateString !== formatDateForInput(value || null)) {
        if (dateString) {
          const date = new Date(dateString + 'T00:00:00')
          onChange(date)
        } else {
          onChange(null)
        }
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  // DateField-local input style overrides. FieldShell handles layout
  // overrides on the outer wrapper; per-input overrides (height,
  // fontSize, padding, borderRadius) still need direct inline styles
  // because the input is a sibling of the shell label/helper, not the
  // wrapper itself.
  const inputStyleOverrides: React.CSSProperties = {}
  if (styles?.height) inputStyleOverrides.minHeight = styles.height
  if (styles?.fontSize) inputStyleOverrides.fontSize = styles.fontSize
  if (styles?.padding) inputStyleOverrides.padding = styles.padding
  if (styles?.borderRadius) {
    inputStyleOverrides.borderRadius = styles.borderRadius
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
          type="date"
          className={cssStyles.input}
          value={formatDateForInput(value || null)}
          onChange={handleDateChange}
          disabled={disabled}
          required={required}
          style={
            Object.keys(inputStyleOverrides).length > 0
              ? inputStyleOverrides
              : undefined
          }
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

DateField.displayName = 'DateField'

export default DateField

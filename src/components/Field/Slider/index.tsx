'use client'

import React, { useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../Shell'

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  styles?: FieldStyleOverrides
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Listen for native 'input' events to support browser automation
  // tools that bypass React's synthetic event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const numValue = Number(target.value)
      if (numValue !== value) {
        onChange(numValue)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value))
    },
    [onChange]
  )

  const inputStyle: React.CSSProperties = {
    width: '100%',
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
          type="range"
          id={inputId}
          name={name}
          data-field-name={dataFieldName}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-orientation="horizontal"
          style={inputStyle}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

export default Slider

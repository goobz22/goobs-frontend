'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'

export interface ExternalIncrementNumberFieldProps {
  initialValue?: string
  /**
   * Fires whenever the value changes (typed input or +/- button).
   *
   * Bug fix: previously was `() => void` with no payload — callers
   * couldn't actually read the new value, which made the component
   * write-only. Now passes the resulting numeric value so the caller
   * can wire it up to its own state.
   */
  onChange?: (value: number) => void
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  placeholder?: string
  id?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  styles?: FieldStyleOverrides
}

const ExternalIncrementNumberField: React.FC<
  ExternalIncrementNumberFieldProps
> = ({
  initialValue = '0',
  onChange,
  label,
  helperText,
  error,
  dataField,
  dataFieldName,
  placeholder,
  id,
  name,
  styles,
}) => {
  const [internalValue, setInternalValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const numValue = target.value.replace(/[^0-9]/g, '')
      const newValue = numValue === '' ? '0' : numValue
      if (newValue !== internalValue) {
        setInternalValue(newValue)
        const parsed = parseInt(newValue, 10)
        onChange?.(isNaN(parsed) ? 0 : parsed)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, internalValue])

  const handleIncrement = useCallback(() => {
    if (disabled) return
    setInternalValue((prev: string) => {
      const num = parseInt(prev, 10)
      const nextNum = isNaN(num) ? 0 : num + 1
      onChange?.(nextNum)
      return nextNum.toString()
    })
  }, [onChange, disabled])

  const handleDecrement = useCallback(() => {
    if (disabled) return
    setInternalValue((prev: string) => {
      const num = parseInt(prev, 10)
      const nextNum = Math.max(0, isNaN(num) ? 0 : num - 1)
      onChange?.(nextNum)
      return nextNum.toString()
    })
  }, [onChange, disabled])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = event.target.value.replace(/[^0-9]/g, '')
      const newValue = numValue === '' ? '0' : numValue
      setInternalValue(newValue)
      const parsed = parseInt(newValue, 10)
      onChange?.(isNaN(parsed) ? 0 : parsed)
    },
    [onChange]
  )

  // Inline-style chrome. The container is flex-row so the +/- buttons
  // sit on either side of the input wrapper.
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '4px 12px',
    border: '1px solid var(--field-border-default, hsl(0,0%,20%))',
    borderRadius: '6px',
    backgroundColor: 'var(--field-bg, transparent)',
    color: 'var(--field-text, inherit)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontSize: '14px',
    fontWeight: 500,
    minWidth: '32px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const inputStyle: React.CSSProperties = {
    width: '64px',
    height: '40px',
    textAlign: 'center',
    border: '1px solid var(--field-border-default, hsl(0,0%,20%))',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: 'var(--field-bg, transparent)',
    color: 'var(--field-text, inherit)',
    opacity: disabled ? 0.5 : 1,
    fontSize: '16px',
    padding: '8px',
    boxSizing: 'border-box',
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
        <div style={containerStyle}>
          <button
            type="button"
            aria-label="Decrease value"
            onClick={handleDecrement}
            disabled={disabled}
            style={buttonStyle}
          >
            −
          </button>
          <input
            ref={inputRef}
            type="text"
            id={id ?? inputId}
            name={name}
            value={internalValue}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            data-field-name={dataFieldName}
            style={inputStyle}
            {...inputAriaProps}
          />
          <button
            type="button"
            aria-label="Increase value"
            onClick={handleIncrement}
            disabled={disabled}
            style={buttonStyle}
          >
            +
          </button>
        </div>
      )}
    </FieldShell>
  )
}

ExternalIncrementNumberField.displayName = 'ExternalIncrementNumberField'

export default ExternalIncrementNumberField

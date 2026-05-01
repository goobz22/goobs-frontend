'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface InternalIncrementNumberFieldProps {
  initialValue?: string
  /**
   * Fires whenever the value changes (typed input, +/- click, or
   * mousedown auto-repeat). Always passes the resulting numeric value
   * — the legacy polymorphic `(event | number) => void` shape was
   * unworkable for callers that needed to read the value.
   */
  onChange?: (value: number) => void
  label?: React.ReactNode
  min?: number
  max?: number
  initialDelay?: number
  repeatInterval?: number
  value?: string
  placeholder?: string
  id?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides
}

const InternalIncrementNumberField: React.FC<
  InternalIncrementNumberFieldProps
> = ({
  initialValue = '0',
  onChange,
  label,
  min = 0,
  max,
  initialDelay = 500,
  repeatInterval = 100,
  value,
  placeholder,
  id,
  name,
  onFocus,
  onBlur,
  helperText,
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  const [internalValue, setInternalValue] = useState(value || initialValue)
  // Refs for the press-and-hold auto-repeat timers — initial debounce
  // (initialTimerRef) waits ~500ms before kicking off the repeat
  // interval (timerRef). Both cleared on mouseup.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const newValue = target.value.replace(/[^0-9]/g, '')
      if (newValue !== internalValue) {
        let finalValue = newValue
        const numValue = parseInt(newValue, 10)
        if (min !== undefined && numValue < min) finalValue = String(min)
        else if (max !== undefined && numValue > max) finalValue = String(max)
        setInternalValue(finalValue)
        const parsed = parseInt(finalValue, 10)
        onChange?.(isNaN(parsed) ? 0 : parsed)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, internalValue, min, max])

  // Sync internal value when controlled `value` prop changes (derived state pattern)
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== undefined) {
      setInternalValue(value)
    }
  }

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const handleIncrement = useCallback(() => {
    if (disabled) return
    setInternalValue(prev => {
      const num = parseInt(prev)
      const newValue =
        max !== undefined
          ? Math.min(max, (isNaN(num) ? 0 : num) + 1)
          : (isNaN(num) ? 0 : num) + 1
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, max, disabled])

  const handleDecrement = useCallback(() => {
    if (disabled) return
    setInternalValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.max(min, (isNaN(num) ? 0 : num) - 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, min, disabled])

  const handleMouseDown = (handler: () => void) => {
    if (disabled) return
    handler()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handler, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers, { once: true })
  }

  useEffect(() => clearTimers, [clearTimers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value.replace(/[^0-9]/g, '')
      const numValue = parseInt(newValue, 10)
      let finalValue = newValue
      if (min !== undefined && numValue < min) finalValue = String(min)
      else if (max !== undefined && numValue > max) finalValue = String(max)
      setInternalValue(finalValue)
      const parsed = parseInt(finalValue, 10)
      onChange?.(isNaN(parsed) ? 0 : parsed)
    },
    [onChange, min, max]
  )

  // Inline-style chrome. Same shape as the other Number fields — input
  // wrapper border + adornment box, with the +/- buttons stacked
  // vertically inside the end adornment.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    width: '100%',
    border: '1px solid var(--field-border-default, hsl(0,0%,20%))',
    borderRadius: '8px',
    backgroundColor: 'var(--field-bg, transparent)',
    color: 'var(--field-text, inherit)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    padding: '8px 16px',
    paddingLeft: '16px',
    paddingRight: '48px',
    fontSize: '16px',
    color: 'inherit',
    boxSizing: 'border-box',
  }

  const adornmentStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '12px',
    color: 'var(--field-text, inherit)',
    pointerEvents: 'auto',
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '32px',
    justifyContent: 'center',
  }

  const buttonStyle: React.CSSProperties = {
    padding: 0,
    width: '16px',
    height: '16px',
    minWidth: '16px',
    minHeight: '16px',
    borderRadius: '2px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'inherit',
    opacity: disabled ? 0.5 : 1,
  }

  const iconStyle: React.CSSProperties = { fontSize: '18px' }

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
        <div style={inputWrapperStyle}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            id={id ?? inputId}
            name={name}
            value={internalValue}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            data-field-name={dataFieldName}
            style={inputStyle}
            {...inputAriaProps}
          />
          <div style={adornmentStyle}>
            <div style={buttonContainerStyle}>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleIncrement)}
                aria-label="Increase value"
                disabled={disabled}
                style={buttonStyle}
              >
                <ArrowDropUpIcon style={iconStyle} />
              </button>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleDecrement)}
                aria-label="Decrease value"
                disabled={disabled}
                style={{ ...buttonStyle, marginTop: '2px' }}
              >
                <ArrowDropDownIcon style={iconStyle} />
              </button>
            </div>
          </div>
        </div>
      )}
    </FieldShell>
  )
}

InternalIncrementNumberField.displayName = 'InternalIncrementNumberField'

export default InternalIncrementNumberField

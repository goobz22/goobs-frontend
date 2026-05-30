'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './InternalIncrement.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'
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
  onChange: onChangeProp,
  label,
  min = 0,
  max,
  initialDelay = 500,
  repeatInterval = 100,
  value: valueProp,
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
  // Tier-1 form binding. The component's display path works in strings; the
  // canonical value is numeric (onChange emits a number), so the engine
  // stores/returns a number. The prop's numeric form feeds the gate so
  // `value === undefined` decides bind-vs-passthrough; the numeric onChange
  // passes straight through. When NOT bound, the original string `valueProp`
  // drives the display verbatim (no string→number→string round-trip),
  // preserving byte-for-byte back-compat for explicit-value callsites.
  const {
    value: boundNumericValue,
    onChange,
    onBlur: boundOnBlur,
  } = useFieldBinding<number>({
    name,
    value:
      valueProp !== undefined && valueProp !== ''
        ? Number(valueProp)
        : undefined,
    onChange: onChangeProp,
  })
  const value =
    valueProp !== undefined
      ? valueProp
      : boundNumericValue !== undefined && boundNumericValue !== null
        ? String(boundNumericValue)
        : undefined

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

  // Inner input chrome (wrapper border + adornment box with stacked +/-
  // buttons) lives in InternalIncrement.module.css. Disabled state is
  // driven by the native :disabled pseudo-class.
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
      name={name}
      filled={Boolean(internalValue && internalValue.length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div className={cssStyles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            id={id ?? inputId}
            name={name}
            value={internalValue}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={event => {
              // Mark the field touched in the form engine (when bound), then
              // run the caller's own blur handler with the native event.
              boundOnBlur?.()
              onBlur?.(event)
            }}
            disabled={disabled}
            placeholder={placeholder}
            data-field-name={dataFieldName}
            className={cssStyles.input}
            {...inputAriaProps}
          />
          <div className={cssStyles.adornment}>
            <div className={cssStyles.buttonContainer}>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleIncrement)}
                aria-label="Increase value"
                disabled={disabled}
                className={cssStyles.button}
              >
                <ArrowDropUpIcon style={iconStyle} />
              </button>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleDecrement)}
                aria-label="Decrease value"
                disabled={disabled}
                className={`${cssStyles.button} ${cssStyles.buttonDecrement}`}
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

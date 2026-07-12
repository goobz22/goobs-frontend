'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './InternalIncrement.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface InternalIncrementNumberFieldProps {
  /** Seed for the uncontrolled display (default '0'). Ignored once `value` is set. */
  initialValue?: string
  /**
   * Fires whenever the value changes (typed input, +/- click, or
   * mousedown auto-repeat). Always passes the resulting numeric value
   * — the legacy polymorphic `(event | number) => void` shape was
   * unworkable for callers that needed to read the value.
   */
  onChange?: (value: number) => void
  label?: React.ReactNode
  /** Lower clamp for typed and stepped values (default 0). */
  min?: number
  /** Upper clamp for typed and stepped values (unclamped when omitted). */
  max?: number
  /** Milliseconds a +/- button is held before auto-repeat kicks in (default 500). */
  initialDelay?: number
  /** Milliseconds between auto-repeat steps while a +/- button stays held (default 100). */
  repeatInterval?: number
  /** Controlled value as a string; drives the display verbatim when set. */
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

/**
 * Integer stepper built on FieldShell: a numeric text input with stacked +/-
 * buttons inside the frame that auto-repeat while held (`initialDelay`, then
 * `repeatInterval`). `onChange` emits the plain numeric value — not a DOM
 * event. Auto-binds by `name` inside a goobs `<Form>` (the engine stores the
 * number); otherwise the string `value` prop controls the display.
 */
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

  // Keyboard operability for the spinbutton (WCAG 2.1.1 / APG spinbutton):
  // Up/Down arrows step the value, Home jumps to the floor, End to the
  // ceiling (when a `max` is set). Without this the value could only be
  // changed with the mouse via the +/- buttons.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          handleIncrement()
          break
        case 'ArrowDown':
          event.preventDefault()
          handleDecrement()
          break
        case 'Home':
          if (min !== undefined) {
            event.preventDefault()
            setInternalValue(String(min))
            onChange?.(min)
          }
          break
        case 'End':
          if (max !== undefined) {
            event.preventDefault()
            setInternalValue(String(max))
            onChange?.(max)
          }
          break
        default:
          break
      }
    },
    [disabled, handleIncrement, handleDecrement, min, max, onChange]
  )

  // Numeric snapshot for the spinbutton ARIA value semantics. Omitted (so
  // React drops the attribute) while the field is empty/non-numeric.
  const numericValue = Number.parseInt(internalValue, 10)
  const hasNumericValue = !Number.isNaN(numericValue)

  // Inner input chrome (wrapper border + adornment box with stacked +/-
  // buttons) lives in InternalIncrement.module.css. Disabled state is
  // driven by the native :disabled pseudo-class.
  const iconStyle: React.CSSProperties = { fontSize: '18px' }

  return (
    <FieldShell
      id={id}
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
            role="spinbutton"
            aria-valuenow={hasNumericValue ? numericValue : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            id={inputId}
            name={name}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
                onClick={event => {
                  // A keyboard-activated click reports detail 0; a pointer
                  // click reports >= 1. onMouseDown already handles the
                  // pointer path (immediate step + press-and-hold auto-
                  // repeat), so only step here for the keyboard path — this
                  // is what makes the button operable with Enter/Space
                  // without double-stepping the mouse. (WCAG 2.1.1)
                  if (event.detail === 0) handleIncrement()
                }}
                aria-label="Increase value"
                data-action="increment"
                disabled={disabled}
                className={cssStyles.button}
              >
                <ArrowDropUpIcon aria-hidden="true" style={iconStyle} />
              </button>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleDecrement)}
                onClick={event => {
                  if (event.detail === 0) handleDecrement()
                }}
                aria-label="Decrease value"
                data-action="decrement"
                disabled={disabled}
                className={`${cssStyles.button} ${cssStyles.buttonDecrement}`}
              >
                <ArrowDropDownIcon aria-hidden="true" style={iconStyle} />
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

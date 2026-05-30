'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface PercentageFieldProps {
  initialValue?: string | number
  value?: string
  /**
   * Canonical numeric onChange. Always called with the parsed numeric
   * value — increment/decrement, typed input, and native input
   * callbacks all funnel through this single shape.
   */
  onChange?: (value: number) => void
  label?: string
  min?: number
  max?: number
  step?: number
  initialDelay?: number
  repeatInterval?: number
  showPercentSymbol?: boolean
  placeholder?: string
  id?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  /** Per-instance style overrides. */
  styles?: FieldStyleOverrides
}

const PercentageField: React.FC<PercentageFieldProps> = ({
  initialValue = '0',
  value: valueProp,
  onChange: onChangeProp,
  label,
  min = 0,
  max = 100,
  step = 1,
  initialDelay = 500,
  repeatInterval = 100,
  showPercentSymbol = true,
  placeholder,
  id,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. The canonical value is numeric (onChange emits a
  // number); the engine therefore stores/returns a number, while the display
  // path below works in strings. We pass the prop's numeric form into the gate
  // (so `value === undefined` correctly decides bind-vs-passthrough) and the
  // numeric onChange straight through. When NOT bound, the original string
  // `valueProp` drives the display verbatim — no string→number→string
  // round-trip — preserving byte-for-byte back-compat for explicit-value
  // callsites.
  const {
    value: boundNumericValue,
    onChange,
    onBlur,
  } = useFieldBinding<number>({
    name,
    value:
      valueProp !== undefined && valueProp !== '' ? Number(valueProp) : undefined,
    onChange: onChangeProp,
  })
  // The display value: when the caller controls the field, use the original
  // string verbatim; when the engine controls it, stringify the engine's
  // number. Both collapse to the same `string | undefined` the rest of the
  // component already expects.
  const value =
    valueProp !== undefined
      ? valueProp
      : boundNumericValue !== undefined && boundNumericValue !== null
        ? String(boundNumericValue)
        : undefined

  const initialValueString =
    typeof initialValue === 'number' ? initialValue.toString() : initialValue
  const [internalValue, setInternalValue] = useState(
    value || initialValueString
  )
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const currentValue = value || internalValue
  const displayValue =
    showPercentSymbol && currentValue ? `${currentValue}%` : currentValue

  // Calculate width based on character count using CSS ch units —
  // avoids DOM measurement / useLayoutEffect for the auto-sized
  // numeric input.
  const contentLength = Math.max(
    displayValue?.toString().length || 0,
    placeholder?.length || 0,
    3
  )
  const inputPaddingLeft = parseFloat(styles?.paddingLeft || '16') || 16
  const inputPaddingRight = parseFloat(styles?.paddingRight || '60') || 60
  const calculatedWidth = `calc(${contentLength}ch + ${inputPaddingLeft + inputPaddingRight + 8}px)`

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // formatValue takes a raw input string, strips non-numerics, clamps
  // to [min, max], and returns a display string. Used for both typed
  // input and native-input event handling.
  const formatValue = useCallback(
    (val: string): string => {
      const numericValue = val.replace(/[^0-9.]/g, '')
      if (numericValue === '' || numericValue === '.') return ''
      let parsedValue = parseFloat(numericValue)
      if (isNaN(parsedValue)) return '0'
      if (min !== undefined && parsedValue < min) parsedValue = min
      else if (max !== undefined && parsedValue > max) parsedValue = max
      return parsedValue % 1 === 0
        ? parsedValue.toString()
        : parsedValue.toFixed(2).replace(/\.00$/, '')
    },
    [min, max]
  )

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const rawValue = target.value
      const numericInput = rawValue.replace(/%/g, '')
      const currentDisplay =
        showPercentSymbol && (value || internalValue)
          ? `${value || internalValue}%`
          : value || internalValue
      if (rawValue !== currentDisplay) {
        const formattedValue = formatValue(numericInput)
        setInternalValue(formattedValue)
        const numericResult = parseFloat(formattedValue)
        onChange?.(isNaN(numericResult) ? 0 : numericResult)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value, internalValue, showPercentSymbol, formatValue])

  const handleIncrement = useCallback(() => {
    const currentValue = value || internalValue
    const num = parseFloat(currentValue || '0')
    const newValue =
      max !== undefined
        ? Math.min(max, (isNaN(num) ? 0 : num) + step)
        : (isNaN(num) ? 0 : num) + step
    const newValueStr = formatValue(newValue.toString())
    setInternalValue(newValueStr)
    onChange?.(newValue)
  }, [value, internalValue, onChange, max, step, formatValue])

  const handleDecrement = useCallback(() => {
    const currentValue = value || internalValue
    const num = parseFloat(currentValue || '0')
    const newValue = Math.max(min, (isNaN(num) ? 0 : num) - step)
    const newValueStr = formatValue(newValue.toString())
    setInternalValue(newValueStr)
    onChange?.(newValue)
  }, [value, internalValue, onChange, min, step, formatValue])

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
      const rawValue = event.target.value
      const numericInput = rawValue.replace(/%/g, '')
      const formattedValue = formatValue(numericInput)
      setInternalValue(formattedValue)
      const numericResult = parseFloat(formattedValue)
      onChange?.(isNaN(numericResult) ? 0 : numericResult)
    },
    [onChange, formatValue]
  )

  // Inner-wrapper styling local to Percentage: the increment/decrement
  // buttons are absolutely positioned over the inline-block input so
  // the field auto-sizes to its content rather than stretching.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: styles?.height || '40px',
    width: 'auto',
    border: '1px solid var(--field-border-default, rgba(255,215,0,0.3))',
    borderRadius: styles?.borderRadius || '8px',
    backgroundColor: 'var(--field-bg, rgba(0, 0, 0, 0.6))',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  }

  const inputStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    padding: styles?.padding || '8px 60px 8px 16px',
    paddingLeft: styles?.paddingLeft || '16px',
    paddingRight: styles?.paddingRight || '60px',
    paddingTop: styles?.paddingTop || '8px',
    paddingBottom: styles?.paddingBottom || '8px',
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight,
    lineHeight: styles?.lineHeight,
    fontFamily: styles?.fontFamily,
    color: 'inherit',
    boxSizing: 'border-box',
    width: calculatedWidth,
    minWidth: '60px',
    ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
  }

  const adornmentContainerStyle: React.CSSProperties = {
    position: 'absolute',
    right: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 215, 0, 0.9)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }

  const iconStyle: React.CSSProperties = { fontSize: '18px' }

  // Percentage uses width: 'auto' on the FieldShell wrapper so the
  // outer block hugs the (small) numeric input rather than stretching
  // to its container.
  const shellStylesWithAutoWidth: FieldStyleOverrides = {
    ...styles,
    width: styles?.width || 'auto',
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
      name={name}
      filled={Boolean(currentValue && currentValue.toString().length > 0)}
      styles={shellStylesWithAutoWidth}
    >
      {({ inputId, inputAriaProps }) => (
        <div style={inputWrapperStyle}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            id={id ?? inputId}
            name={name}
            data-field-name={dataFieldName}
            value={displayValue}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            style={inputStyle}
            {...inputAriaProps}
          />

          <div style={adornmentContainerStyle}>
            <div style={buttonContainerStyle}>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleIncrement)}
                aria-label="increment"
                disabled={disabled}
                style={buttonStyle}
              >
                <ArrowDropUpIcon
                  styles={{ theme: styles?.theme || 'sacred' }}
                  style={iconStyle}
                />
              </button>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleDecrement)}
                aria-label="decrement"
                disabled={disabled}
                style={{ ...buttonStyle, marginTop: '2px' }}
              >
                <ArrowDropDownIcon
                  styles={{ theme: styles?.theme || 'sacred' }}
                  style={iconStyle}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </FieldShell>
  )
}

export default PercentageField

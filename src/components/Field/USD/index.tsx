'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'
import { useOptionalFormContext } from '../../Form/context'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface USDFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'style' | 'type' | 'inputMode'
> {
  initialValue?: string
  /**
   * Canonical value-shape onChange. Receives the formatted dollar
   * amount as a string (so consumers can preserve trailing decimals).
   */
  onChange?: (value: string) => void
  label?: string
  min?: number
  max?: number
  precision?: number
  enableIncrement?: boolean
  incrementStep?: number
  initialDelay?: number
  repeatInterval?: number
  value?: string
  placeholder?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
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

const formatCurrency = (value: string): string => {
  const numericValue: string = value.replace(/[^0-9.]/g, '')
  if (!numericValue) return ''
  if (numericValue === '.') return '.'
  const parts: string[] = numericValue.split('.')
  if (parts.length > 2) {
    const firstPart = parts[0] || ''
    const remainingParts = parts.slice(1).join('')
    return `${firstPart}.${remainingParts}`
  }
  if (numericValue.includes('.')) return numericValue
  const number = parseFloat(numericValue)
  if (isNaN(number)) return ''
  return number.toString()
}

const USDField: React.FC<USDFieldProps> = ({
  initialValue = '',
  onChange: onChangeProp,
  label = 'Amount',
  min,
  max,
  precision = 2,
  enableIncrement = false,
  incrementStep = 1,
  initialDelay = 500,
  repeatInterval = 100,
  value: valueProp,
  placeholder,
  id,
  onFocus,
  onBlur,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
  ...rest
}) => {
  // Tier-1 form binding. Inside a <Form> with a `name` and no explicit value,
  // the engine drives value/onChange; touched is marked via bindingOnBlur
  // (chained into handleBlur below). Outside a form / with an explicit value
  // this is a byte-for-byte pass-through. The destructured value/onChange
  // SHADOW the incoming props so downstream code uses the bound versions.
  const {
    value,
    onChange,
    onBlur: bindingOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valueProp,
    onChange: onChangeProp,
    onBlur: undefined,
  })

  // Is this instance actually bound to the form engine? Mirrors the hook's
  // gate. Used to drive `internalValue` from the engine value while leaving the
  // legacy uncontrolled-after-mount behavior untouched when NOT bound.
  const formCtx = useOptionalFormContext()
  const isBound = Boolean(formCtx && name && valueProp === undefined)

  const [internalValue, setInternalValue] = useState(value || initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // When bound, the engine is the source of truth: mirror its value into the
  // local display state whenever it changes externally (e.g. form reset /
  // sibling-field-driven update). Derived-state pattern, same shape as
  // PhoneNumber. No-op (and untouched legacy behavior) when not bound.
  const [prevBoundValue, setPrevBoundValue] = useState(value)
  if (isBound && value !== prevBoundValue) {
    setPrevBoundValue(value)
    setInternalValue(value || '')
  }

  // Chain the engine touched-mark (no-op outside a <Form>) before the caller's
  // FocusEvent onBlur, preserving its original signature.
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      bindingOnBlur?.()
      onBlur?.(e)
    },
    [bindingOnBlur, onBlur]
  )

  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const sacredTheme = styles?.theme === 'sacred'

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== internalValue) {
        const formattedValue = formatCurrency(target.value)
        setInternalValue(formattedValue)
        onChange?.(formattedValue)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, internalValue])

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const handleIncrement = useCallback(() => {
    if (disabled) return
    setInternalValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue =
        max !== undefined
          ? Math.min(max, num + incrementStep)
          : num + incrementStep
      const formattedValue = newValue.toFixed(precision)
      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, max, incrementStep, precision, disabled])

  const handleDecrement = useCallback(() => {
    if (disabled) return
    setInternalValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue = Math.max(min || 0, num - incrementStep)
      const formattedValue = newValue.toFixed(precision)
      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, min, incrementStep, precision, disabled])

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
      if (disabled) return
      const newValue = event.target.value
      const formattedValue = formatCurrency(newValue)
      const numericValue = parseFloat(formattedValue)
      if (!isNaN(numericValue)) {
        if (min !== undefined && numericValue < min) {
          setInternalValue(min.toFixed(precision))
          onChange?.(min.toFixed(precision))
          return
        }
        if (max !== undefined && numericValue > max) {
          setInternalValue(max.toFixed(precision))
          onChange?.(max.toFixed(precision))
          return
        }
      }
      setInternalValue(formattedValue)
      onChange?.(formattedValue)
    },
    [onChange, precision, min, max, disabled]
  )

  // Inner wrapper styling kept local — USD has dollar-sign start
  // adornment + optional increment buttons, so the visual frame is
  // component-specific. FieldShell handles outer label / helper region.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: styles?.height || '40px',
    width: '100%',
    border: '1px solid var(--field-border-default, rgba(255,215,0,0.3))',
    borderRadius: styles?.borderRadius || '8px',
    backgroundColor: 'var(--field-bg, rgba(0, 0, 0, 0.6))',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  }

  const adornmentStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 215, 0, 0.9)',
    pointerEvents: 'none',
  }

  const startAdornmentStyle: React.CSSProperties = {
    ...adornmentStyle,
    left: '16px',
  }

  const endAdornmentStyle: React.CSSProperties = {
    ...adornmentStyle,
    right: '16px',
    pointerEvents: 'auto',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    padding: styles?.padding || '8px 16px',
    paddingLeft: styles?.paddingLeft || '40px',
    paddingRight: styles?.paddingRight || (enableIncrement ? '48px' : '16px'),
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight,
    lineHeight: styles?.lineHeight,
    fontFamily: styles?.fontFamily,
    color: 'inherit',
    boxSizing: 'border-box',
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '32px',
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
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 215, 0, 0.9)',
    transition: 'all 0.3s ease',
  }

  const iconStyle: React.CSSProperties = { fontSize: '18px' }

  const dollarSignFontStyle: React.CSSProperties = {
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight || 500,
    fontFamily: styles?.fontFamily,
    color: 'rgba(255, 215, 0, 0.9)',
    ...(sacredTheme && {
      textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
      filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))',
    }),
  }

  const sacredGlyphStyle: React.CSSProperties = {
    position: 'absolute',
    left: '-16px',
    color: 'rgba(255,215,0,0.4)',
    fontSize: '12px',
  }

  const resolvedLabel = sacredTheme ? 'Sacred Treasury' : label
  const resolvedPlaceholder = sacredTheme ? 'Divine wealth...' : placeholder

  return (
    <FieldShell
      label={resolvedLabel}
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
        <div style={inputWrapperStyle}>
          <div style={startAdornmentStyle}>
            {sacredTheme && <span style={sacredGlyphStyle}>𓊹</span>}
            <span style={dollarSignFontStyle}>$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            id={id ?? inputId}
            name={name}
            data-field-name={dataFieldName}
            value={internalValue}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={resolvedPlaceholder}
            style={inputStyle}
            {...inputAriaProps}
            {...rest}
          />
          {enableIncrement && (
            <div style={endAdornmentStyle}>
              <div style={buttonContainerStyle}>
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown(handleIncrement)}
                  aria-label="increment"
                  disabled={disabled}
                  style={buttonStyle}
                >
                  <ArrowDropUpIcon
                    style={iconStyle}
                    styles={{
                      theme: sacredTheme ? 'sacred' : styles?.theme || 'light',
                    }}
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
                    style={iconStyle}
                    styles={{
                      theme: sacredTheme ? 'sacred' : styles?.theme || 'light',
                    }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </FieldShell>
  )
}

export default USDField

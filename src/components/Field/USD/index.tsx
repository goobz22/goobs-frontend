'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './USD.module.css'
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

  // Inner chrome lives in USD.module.css. The dollar-sign start adornment +
  // optional stacked +/- buttons are component-specific; FieldShell handles
  // the outer label / helper region. Caller-supplied layout overrides
  // (height/radius/padding/font) are forwarded as CSS custom properties, the
  // sacred-theme dollar glow is a [data-theme='sacred'] selector, and the
  // padding-right that reserves room for the buttons is switched by the
  // [data-increment] attribute.
  const wrapperCssVars: Record<string, string> = {}
  if (styles?.height) wrapperCssVars['--usd-height'] = styles.height
  if (styles?.borderRadius) wrapperCssVars['--usd-radius'] = styles.borderRadius
  if (styles?.padding) wrapperCssVars['--usd-padding'] = styles.padding
  if (styles?.paddingLeft) {
    wrapperCssVars['--usd-padding-left'] = styles.paddingLeft
  }
  if (styles?.paddingRight) {
    wrapperCssVars['--usd-padding-right'] = styles.paddingRight
  }
  if (styles?.fontSize) wrapperCssVars['--usd-font-size'] = styles.fontSize
  if (styles?.fontWeight !== undefined) {
    wrapperCssVars['--usd-font-weight'] = String(styles.fontWeight)
  }
  if (styles?.lineHeight) wrapperCssVars['--usd-line-height'] = styles.lineHeight
  if (styles?.fontFamily) wrapperCssVars['--usd-font-family'] = styles.fontFamily

  const iconStyle: React.CSSProperties = { fontSize: '18px' }

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
        <div
          className={cssStyles.inputWrapper}
          data-theme={sacredTheme ? 'sacred' : undefined}
          data-increment={enableIncrement || undefined}
          style={wrapperCssVars as React.CSSProperties}
        >
          <div className={`${cssStyles.adornment} ${cssStyles.startAdornment}`}>
            {sacredTheme && <span className={cssStyles.sacredGlyph}>𓊹</span>}
            <span className={cssStyles.dollarSign}>$</span>
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
            className={cssStyles.input}
            {...inputAriaProps}
            {...rest}
          />
          {enableIncrement && (
            <div className={`${cssStyles.adornment} ${cssStyles.endAdornment}`}>
              <div className={cssStyles.buttonContainer}>
                <button
                  type="button"
                  onMouseDown={() => handleMouseDown(handleIncrement)}
                  aria-label="increment"
                  disabled={disabled}
                  className={cssStyles.button}
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
                  className={`${cssStyles.button} ${cssStyles.buttonDecrement}`}
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

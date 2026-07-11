'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './USD.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'
import { useOptionalFormContext } from '../../Form/context'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'
import { formatCurrency } from './formatCurrency'

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

// formatCurrency (the input-side keystroke normalizer) now lives in the shared
// ./formatCurrency util so this editable field and the read-only <MoneyText>
// display agree on how a dollar value is parsed. Imported above.

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
  onKeyDown: onKeyDownProp,
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

  // Polite live-region text for stepper/arrow-key changes. Focus stays on the
  // pressed button (or in the input for arrow keys), so the new amount would
  // otherwise never be spoken. Set ONLY from the step handler below — typing
  // keystrokes are not announced here (the input speaks those itself). WCAG 4.1.3.
  const [stepAnnouncement, setStepAnnouncement] = useState('')

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

  // Single stepping core shared by the buttons (pointer + keyboard) and the
  // input's Arrow Up/Down keys. Reads the live value off the input ref so the
  // press-and-hold repeat and rapid key-repeat always operate on the latest
  // amount, then updates the display value, the polite live-region text (so the
  // change is announced — focus never moves to the value), and onChange in one
  // synchronous pass (no setState-in-effect). WCAG 2.1.1 / 4.1.3.
  const stepValue = useCallback(
    (direction: 'up' | 'down') => {
      if (disabled) return
      const current = parseFloat(inputRef.current?.value ?? internalValue) || 0
      const next =
        direction === 'up'
          ? max !== undefined
            ? Math.min(max, current + incrementStep)
            : current + incrementStep
          : Math.max(min ?? 0, current - incrementStep)
      const formattedValue = next.toFixed(precision)
      setInternalValue(formattedValue)
      setStepAnnouncement(`$${formattedValue}`)
      onChange?.(formattedValue)
    },
    [onChange, min, max, incrementStep, precision, disabled, internalValue]
  )

  const handleIncrement = useCallback(() => stepValue('up'), [stepValue])
  const handleDecrement = useCallback(() => stepValue('down'), [stepValue])

  const handleMouseDown = (handler: () => void) => {
    if (disabled) return
    handler()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handler, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers, { once: true })
  }

  // Keyboard activation for the stepper buttons. `onMouseDown` alone left them
  // pointer-operable ONLY — Enter/Space on a focused <button> fire `click`, not
  // `mousedown`, so keyboard users could focus the button but never step. A
  // single step per key press; the browser's native key-repeat covers
  // hold-to-repeat. `preventDefault` suppresses the synthesized click. WCAG 2.1.1.
  const handleButtonKeyDown =
    (handler: () => void) =>
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handler()
      }
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

  // Arrow Up / Down adjust the value when the stepper is enabled — the native
  // number-input affordance, so keyboard users can change the amount without
  // reaching for the buttons. Chained after any consumer `onKeyDown`; a
  // consumer that calls preventDefault opts out. WCAG 2.1.1.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDownProp?.(event)
      if (event.defaultPrevented || !enableIncrement || disabled) return
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleIncrement()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleDecrement()
      }
    },
    [onKeyDownProp, enableIncrement, disabled, handleIncrement, handleDecrement]
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
  if (styles?.lineHeight)
    wrapperCssVars['--usd-line-height'] = styles.lineHeight
  if (styles?.fontFamily)
    wrapperCssVars['--usd-font-family'] = styles.fontFamily

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
            {sacredTheme && (
              <span aria-hidden="true" className={cssStyles.sacredGlyph}>
                𓊹
              </span>
            )}
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
            onKeyDown={handleKeyDown}
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
                  onKeyDown={handleButtonKeyDown(handleIncrement)}
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
                  onKeyDown={handleButtonKeyDown(handleDecrement)}
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
          {/* Polite live region: speaks the new amount after a stepper button
              or arrow-key change (focus doesn't move to the value, so it's
              otherwise silent for screen-reader users). Typing is not
              announced here. WCAG 4.1.3. */}
          <span
            role="status"
            aria-live="polite"
            className={cssStyles.srOnly}
            data-usd-status=""
          >
            {stepAnnouncement}
          </span>
        </div>
      )}
    </FieldShell>
  )
}

export default USDField

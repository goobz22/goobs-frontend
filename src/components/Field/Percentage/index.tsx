'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './Percentage.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface PercentageFieldProps {
  /** Seed for the uncontrolled display (default '0'). Ignored once `value` is set. */
  initialValue?: string | number
  /** Controlled value as a string; drives the display verbatim when set. */
  value?: string
  /**
   * Canonical numeric onChange. Always called with the parsed numeric
   * value — increment/decrement, typed input, and native input
   * callbacks all funnel through this single shape.
   */
  onChange?: (value: number) => void
  label?: string
  /** Lower clamp for typed and stepped values (default 0). */
  min?: number
  /** Upper clamp for typed and stepped values (default 100). */
  max?: number
  /** Amount added/removed per +/- press (default 1). */
  step?: number
  /** Milliseconds a +/- button is held before auto-repeat kicks in (default 500). */
  initialDelay?: number
  /** Milliseconds between auto-repeat steps while a +/- button stays held (default 100). */
  repeatInterval?: number
  /** Appends '%' to the displayed value (default true); `onChange` still emits the bare number. */
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

/**
 * Percentage entry built on FieldShell: an auto-width numeric input that
 * appends a % symbol, with stacked +/- buttons that auto-repeat while held.
 * Typed input is stripped to digits and a single decimal point (max 2
 * decimal places) and clamped to [min, max]; `onChange` emits the parsed
 * number — not a DOM event. Auto-binds by `name` inside a
 * goobs `<Form>` (the engine stores the number); otherwise the string `value`
 * prop controls the display.
 */
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
      valueProp !== undefined && valueProp !== ''
        ? Number(valueProp)
        : undefined,
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

  // While the user is mid-entry of a decimal ('75.', or '0.0' on the way to
  // '0.05'), the controlled round-trip (onChange(75) → parent echoes value
  // '75') would erase the in-progress characters. Prefer the internal typed
  // string whenever it is a numerically-equal elaboration of the controlled
  // value; handleBlur normalizes it once focus leaves.
  const inProgressTyping =
    value !== undefined &&
    value !== '' &&
    internalValue !== value &&
    parseFloat(internalValue) === parseFloat(value)
  const currentValue = inProgressTyping ? internalValue : value || internalValue
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
  // to [min, max], and returns a canonical display string (integers bare,
  // decimals capped at 2 places with no trailing-zero padding). Used for
  // stepped (+/-) values and blur-time normalization.
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
        : parsedValue.toFixed(2).replace(/\.?0+$/, '')
    },
    [min, max]
  )

  // sanitizeTypedValue handles KEYSTROKE input. Unlike formatValue it must
  // never parse-and-reprint an in-progress entry: reformatting '75.' to '75'
  // made decimal entry impossible — the next '5' produced '755', which
  // clamped to max and corrupted a typed 75.5 into 100. It strips
  // non-numerics (including the display '%') and leading zeros, keeps a
  // single '.', caps at 2 decimal places, and only round-trips through
  // formatValue when the number actually leaves [min, max] (clamping).
  const sanitizeTypedValue = useCallback(
    (raw: string): string => {
      let sanitized = raw.replace(/[^0-9.]/g, '')
      const firstDot = sanitized.indexOf('.')
      if (firstDot !== -1) {
        sanitized =
          sanitized.slice(0, firstDot + 1) +
          sanitized.slice(firstDot + 1).replace(/\./g, '')
        sanitized = sanitized.slice(0, firstDot + 3)
      }
      sanitized = sanitized.replace(/^0+(?=\d)/, '')
      if (sanitized === '' || sanitized === '.') return ''
      const parsed = parseFloat(sanitized)
      if (isNaN(parsed)) return ''
      if (
        (min !== undefined && parsed < min) ||
        (max !== undefined && parsed > max)
      ) {
        return formatValue(sanitized)
      }
      return sanitized
    },
    [min, max, formatValue]
  )

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const rawValue = target.value
      const currentDisplay =
        showPercentSymbol && (value || internalValue)
          ? `${value || internalValue}%`
          : value || internalValue
      if (rawValue !== currentDisplay) {
        const formattedValue = sanitizeTypedValue(rawValue)
        setInternalValue(formattedValue)
        const numericResult = parseFloat(formattedValue)
        onChange?.(isNaN(numericResult) ? 0 : numericResult)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value, internalValue, showPercentSymbol, sanitizeTypedValue])

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
      const formattedValue = sanitizeTypedValue(event.target.value)
      setInternalValue(formattedValue)
      const numericResult = parseFloat(formattedValue)
      onChange?.(isNaN(numericResult) ? 0 : numericResult)
    },
    [onChange, sanitizeTypedValue]
  )

  // Normalize any in-progress entry ('75.' → '75') once focus leaves, then
  // run the binding's blur (touched-marking) behavior.
  const handleBlur = useCallback(() => {
    setInternalValue(prev => {
      const normalized = formatValue(prev)
      return normalized === prev ? prev : normalized
    })
    onBlur?.()
  }, [formatValue, onBlur])

  // Inner chrome lives in Percentage.module.css: the increment/decrement
  // buttons are absolutely positioned over the auto-sized input so the
  // field hugs its content. The runtime ch-based width and any
  // caller-supplied layout overrides (height/radius/padding/font) are
  // forwarded as CSS custom properties; the CSS holds the static defaults
  // and the :disabled pseudo-class drives the disabled chrome.
  const wrapperCssVars: Record<string, string> = {}
  if (styles?.height) wrapperCssVars['--percentage-height'] = styles.height
  if (styles?.borderRadius) {
    wrapperCssVars['--percentage-radius'] = styles.borderRadius
  }

  const inputCssVars: Record<string, string> = {
    '--percentage-input-width': calculatedWidth,
  }
  if (styles?.padding) inputCssVars['--percentage-padding'] = styles.padding
  if (styles?.paddingLeft) {
    inputCssVars['--percentage-padding-left'] = styles.paddingLeft
  }
  if (styles?.paddingRight) {
    inputCssVars['--percentage-padding-right'] = styles.paddingRight
  }
  if (styles?.paddingTop) {
    inputCssVars['--percentage-padding-top'] = styles.paddingTop
  }
  if (styles?.paddingBottom) {
    inputCssVars['--percentage-padding-bottom'] = styles.paddingBottom
  }
  if (styles?.fontSize) inputCssVars['--percentage-font-size'] = styles.fontSize
  if (styles?.fontWeight !== undefined) {
    inputCssVars['--percentage-font-weight'] = String(styles.fontWeight)
  }
  if (styles?.lineHeight) {
    inputCssVars['--percentage-line-height'] = styles.lineHeight
  }
  if (styles?.fontFamily) {
    inputCssVars['--percentage-font-family'] = styles.fontFamily
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
        <div
          className={cssStyles.inputWrapper}
          style={wrapperCssVars as React.CSSProperties}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            id={id ?? inputId}
            name={name}
            data-field-name={dataFieldName}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={cssStyles.input}
            style={inputCssVars as React.CSSProperties}
            {...inputAriaProps}
          />

          <div className={cssStyles.adornmentContainer}>
            <div className={cssStyles.buttonContainer}>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleIncrement)}
                aria-label="increment"
                disabled={disabled}
                className={cssStyles.button}
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
                className={`${cssStyles.button} ${cssStyles.buttonDecrement}`}
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

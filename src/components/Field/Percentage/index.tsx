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
  /**
   * Optional stable id applied to the field WRAPPER element. The value-bearing
   * `<input>` always keeps an internally-generated id so its `<label htmlFor>`
   * association (owned by FieldShell) stays intact — passing a custom `id`
   * never diverges the input's id from the label's `htmlFor`, so it cannot
   * silently break the programmatic name/label link (WCAG 1.3.1 / 4.1.2).
   */
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
  // True once a press-and-hold on a +/- button has begun auto-repeating, so the
  // trailing `click` fired on release doesn't add a phantom extra step.
  const didAutoRepeatRef = useRef(false)

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

  // Spinbutton value semantics (WAI-ARIA spinbutton pattern): expose the
  // current numeric value + [min, max] range to assistive technology via
  // aria-valuenow/min/max, and the human-readable "75%" form via
  // aria-valuetext. Omitted while the field is empty so AT reads "blank"
  // rather than a stale 0.
  const numericForAria =
    currentValue !== undefined && currentValue !== ''
      ? parseFloat(currentValue.toString())
      : NaN
  const hasNumericAria = !Number.isNaN(numericForAria)
  // aria-valuenow MUST stay within [aria-valuemin, aria-valuemax] per the
  // WAI-ARIA spinbutton contract. The DISPLAY value is intentionally left
  // unclamped — an out-of-range seed/prop ('150' against max=100, or '-25'
  // against min=0) is shown verbatim so an error state reads truthfully, and
  // aria-valuetext still carries that true "150%" form — but the number we
  // expose as aria-valuenow is clamped into range so AT never announces a
  // value that violates the declared min/max.
  const clampedNumericForAria = hasNumericAria
    ? Math.min(max, Math.max(min, numericForAria))
    : NaN
  // True when the truthful display value diverged from the clamped
  // aria-valuenow — i.e. an out-of-range seed/prop that got clamped for AT.
  // In that state aria-valuetext MUST carry the REAL value (even when the %
  // symbol is hidden) so a screen-reader user is told the true "150" rather
  // than only the clamped "100" that aria-valuenow reports (truthfulness).
  const numericIsClamped =
    hasNumericAria && clampedNumericForAria !== numericForAria

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

  // Jump straight to a range bound (Home → min, End → max). Clamped by
  // formatValue (the bound is already in range, so this just canonicalizes the
  // string form) and emitted through the same numeric onChange as the steppers.
  const handleSetToBound = useCallback(
    (target: number) => {
      const newValueStr = formatValue(target.toString())
      setInternalValue(newValueStr)
      onChange?.(target)
    },
    [formatValue, onChange]
  )

  // Spinbutton keyboard stepping on the input itself (WAI-ARIA spinbutton
  // pattern): ArrowUp/ArrowDown adjust by `step`; Home/End jump to min/max.
  // These are the standard spinbutton keys. Left/Right are deliberately left
  // to native caret movement so multi-digit text editing still works, and
  // PageUp/PageDown (large-step, optional in the APG table) are intentionally
  // omitted since no large-step size is defined for this field.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleIncrement()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleDecrement()
      } else if (event.key === 'Home') {
        event.preventDefault()
        handleSetToBound(min)
      } else if (event.key === 'End') {
        event.preventDefault()
        handleSetToBound(max)
      }
    },
    [disabled, handleIncrement, handleDecrement, handleSetToBound, min, max]
  )

  // Pointer press-and-hold: begin auto-repeat after the initial delay. The
  // single initial step comes from `handleActivate` (onClick), which ALSO
  // fires for keyboard Enter/Space on the native <button> — so pointer and
  // keyboard share one activation path and the +/- buttons are fully
  // keyboard-operable (WCAG 2.1.1).
  const handlePressStart = (handler: () => void) => {
    if (disabled) return
    didAutoRepeatRef.current = false
    initialTimerRef.current = setTimeout(() => {
      handler()
      didAutoRepeatRef.current = true
      timerRef.current = setInterval(handler, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers, { once: true })
  }

  // Canonical activation for BOTH a mouse click and keyboard Enter/Space (a
  // native <button> fires `click` for both). The auto-repeat double-count guard
  // must apply ONLY to the trailing POINTER-release click after a press-and-
  // hold — never to a keyboard activation. A keyboard-synthesized click on a
  // <button> reports `detail === 0`; a real pointer click reports a positive
  // click count. So: suppress-and-reset only when a pointer click lands while
  // the guard is set; a keyboard activation always steps AND clears any stale
  // guard left behind when a hold was released OFF the button (no trailing
  // click fired there, so the ref would otherwise poison the next keypress).
  const handleActivate = (
    handler: () => void,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (disabled) return
    const isPointerClick = event.detail > 0
    if (isPointerClick && didAutoRepeatRef.current) {
      didAutoRepeatRef.current = false
      return
    }
    didAutoRepeatRef.current = false
    handler()
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

  // Give each stepper an accessible name that references the field's label, so
  // multiple Percentage/stepper fields on one page expose distinguishable
  // controls to assistive technology instead of ambiguous, identical
  // "increment"/"decrement" buttons (WCAG 2.4.6 Headings and Labels / 4.1.2
  // Name, Role, Value). Falls back to the bare verb when the field has no
  // label. The data-action attributes ("increment"/"decrement") that the
  // Playwright selector contract keys on are unchanged.
  const incrementAriaLabel = label ? `Increase ${label}` : 'increment'
  const decrementAriaLabel = label ? `Decrease ${label}` : 'decrement'

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
          id={id}
          style={wrapperCssVars as React.CSSProperties}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={hasNumericAria ? clampedNumericForAria : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={
              hasNumericAria && (showPercentSymbol || numericIsClamped)
                ? displayValue
                : undefined
            }
            id={inputId}
            name={name}
            data-field-name={dataFieldName}
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
                onMouseDown={() => handlePressStart(handleIncrement)}
                onClick={event => handleActivate(handleIncrement, event)}
                aria-label={incrementAriaLabel}
                data-action="increment"
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
                onMouseDown={() => handlePressStart(handleDecrement)}
                onClick={event => handleActivate(handleDecrement, event)}
                aria-label={decrementAriaLabel}
                data-action="decrement"
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

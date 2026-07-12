'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './CIDR.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface CIDRFieldProps {
  initialValue?: string
  /**
   * Emits the new CIDR as a number. Was previously polymorphic
   * `(event | number) => void` — collapsed to `(value: number) => void`
   * during the FieldShell migration.
   */
  onChange?: (value: number) => void
  initialDelay?: number
  repeatInterval?: number
  minCidr?: number
  maxCidr?: number
  showSubnetInfo?: boolean
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  required?: boolean
  disabled?: boolean
  styles?: FieldStyleOverrides
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  /**
   * Form-engine binding key. Inside a `<Form>` with `name` set, the numeric
   * CIDR is written into the engine on change and the field is marked touched
   * on blur; the shell auto-derives error/required for this name. Outside a
   * form this is inert and the field behaves byte-for-byte as before.
   */
  name?: string
  autoComplete?: string
}

const calculateCIDRInfo = (cidr: number) => {
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)
  const networks = Math.pow(2, 32 - cidr)

  return {
    mask,
    networks: networks.toLocaleString('en-US'),
    totalHosts: totalHosts.toLocaleString('en-US'),
    usableHosts: usableHosts.toLocaleString('en-US'),
  }
}

// Button + input chrome lives in CIDR.module.css. Disabled state is
// driven by the native :disabled pseudo-class.

const CIDRField: React.FC<CIDRFieldProps> = ({
  initialValue = '24',
  onChange: onChangeProp,
  label = 'CIDR',
  initialDelay = 500,
  repeatInterval = 100,
  minCidr = 8,
  maxCidr = 32,
  showSubnetInfo = true,
  helperText,
  error,
  dataField,
  dataFieldName,
  required,
  disabled,
  styles,
  onFocus,
  onBlur,
  onKeyDown,
  onClick,
  placeholder,
  id,
  name,
  autoComplete,
}) => {
  // Tier-1 form binding: inside a <Form> with `name`, the numeric CIDR is
  // written into the engine on change (the original onChange still fires) and
  // the field is marked touched via boundOnBlur. No controlled `value` prop
  // exists — this field renders from internal state — so the hook's
  // value-from-store is unused; only onChange/onBlur are taken over when bound.
  const { onChange, onBlur: boundOnBlur } = useFieldBinding<number>({
    name,
    onChange: onChangeProp,
  })
  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue, 10)
    if (isNaN(initialNum)) return '24'
    return Math.min(Math.max(initialNum, minCidr), maxCidr).toString()
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cidrInfo = calculateCIDRInfo(parseInt(currentValue, 10) || 24)

  // Note: clearTimers can reference itself in useCallback because the function
  // is stable (empty deps) and uses closures over refs, not direct self-reference
  const clearTimers = useCallback(function clearTimersHandler() {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    initialTimerRef.current = null
    timerRef.current = null
    // Remove listeners added during press-and-hold using the named function
    document.removeEventListener('mouseup', clearTimersHandler)
    document.removeEventListener('mouseleave', clearTimersHandler)
  }, [])

  const handleIncrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev, 10)
      const newValue = Math.min(maxCidr, isNaN(num) ? minCidr : num + 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, maxCidr, minCidr])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev, 10)
      const newValue = Math.max(minCidr, isNaN(num) ? minCidr : num - 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, minCidr])

  const handleIncrementMouseDown = useCallback(() => {
    handleIncrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleIncrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleIncrement, initialDelay, repeatInterval, clearTimers])

  const handleDecrementMouseDown = useCallback(() => {
    handleDecrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleDecrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleDecrement, initialDelay, repeatInterval, clearTimers])

  // Keyboard activation for the stepper buttons (WCAG 2.1.1). The +/- steppers
  // previously only had `onMouseDown` (to drive the press-and-hold repeat), so
  // a keyboard Enter/Space — which dispatches a `click`, never a mousedown —
  // left the focusable buttons completely inert. A keyboard-synthesised click
  // has `detail === 0`; a real pointer click has `detail >= 1` and its step has
  // already fired on mousedown, so this guard adds one keyboard step without
  // double-firing for the mouse.
  const handleIncrementClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) handleIncrement()
    },
    [handleIncrement]
  )
  const handleDecrementClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) handleDecrement()
    },
    [handleDecrement]
  )

  // Spinbutton keyboard completeness (WCAG 2.1.1). This field is functionally a
  // spinbutton (a numeric value plus +/- steppers), so a keyboard user who
  // focuses the input expects Up/Down arrows to step the value — otherwise the
  // only keyboard path to a step is Tab-ing away to the separate +/- buttons.
  // ArrowUp/ArrowDown reuse the existing clamped increment/decrement handlers.
  // The caller's onKeyDown still runs first and can preventDefault to opt out.
  // The input carries role="spinbutton" + aria-valuemin/max/now/valuetext (see
  // the JSX below) so assistive tech announces the current CIDR and its bounds
  // as a spinner; the stable `data-field-name` machine-test selector on the same
  // element is unchanged, so `[data-field-name="…"]` locators keep resolving it.
  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleIncrement()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleDecrement()
      }
    },
    [onKeyDown, handleIncrement, handleDecrement]
  )

  React.useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleTextFieldChange = useCallback(
    (value: string) => {
      const newValue = value.replace(/[^0-9/]/g, '').replace('/', '')
      if (newValue === '') {
        setCurrentValue(minCidr.toString())
        onChange?.(minCidr)
        return
      }
      const numValue = parseInt(newValue, 10)
      let finalNum: number
      if (isNaN(numValue) || numValue < minCidr) {
        finalNum = minCidr
        setCurrentValue(minCidr.toString())
      } else if (numValue > maxCidr) {
        finalNum = maxCidr
        setCurrentValue(maxCidr.toString())
      } else {
        finalNum = numValue
        setCurrentValue(newValue)
      }
      onChange?.(finalNum)
    },
    [onChange, minCidr, maxCidr]
  )

  // Listen for native 'input' events from browser-automation tools
  // that bypass React's synthetic-event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== `/${currentValue}`) {
        handleTextFieldChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [currentValue, handleTextFieldChange])

  // Filled whenever a (always-present) numeric CIDR value is set.
  const hasValue =
    currentValue !== '' && !Number.isNaN(parseInt(currentValue, 10))

  // Numeric CIDR backing the spinbutton `aria-valuenow` (the displayed value is
  // the formatted `/N` string, exposed via `aria-valuetext`).
  const cidrValueNow = parseInt(currentValue, 10)

  return (
    <div data-field={dataField}>
      <FieldShell
        label={label}
        helperText={helperText}
        error={error}
        disabled={disabled}
        required={required}
        dataFieldName={dataFieldName}
        name={name}
        filled={hasValue}
        styles={styles}
      >
        {({ inputId, inputAriaProps }) => (
          <div className={cssStyles.inputContainer}>
            <input
              ref={inputRef}
              id={id ?? inputId}
              data-field-name={dataFieldName ?? name}
              autoComplete={autoComplete}
              value={`/${currentValue}`}
              disabled={disabled}
              required={required}
              onChange={e => handleTextFieldChange(e.target.value)}
              onFocus={onFocus}
              onBlur={event => {
                onBlur?.(event)
                boundOnBlur?.()
              }}
              onKeyDown={handleInputKeyDown}
              onClick={onClick}
              placeholder={placeholder}
              type="text"
              inputMode="numeric"
              // Spinbutton value semantics (WCAG 4.1.2). This is functionally a
              // spinner (numeric CIDR + press-and-hold steppers + arrow-key
              // stepping), so it exposes role="spinbutton" and its value/bounds.
              // aria-valuetext carries the formatted `/N` string the user sees;
              // aria-valuenow carries the raw number. The element stays a text
              // input (typeable, inputMode numeric) and keeps its data-field-name.
              role="spinbutton"
              aria-valuemin={minCidr}
              aria-valuemax={maxCidr}
              aria-valuenow={
                Number.isNaN(cidrValueNow) ? undefined : cidrValueNow
              }
              aria-valuetext={`/${currentValue}`}
              className={cssStyles.input}
              {...inputAriaProps}
            />
            <div className={cssStyles.buttonContainer}>
              <button
                type="button"
                aria-label="Increase CIDR"
                data-action="increment"
                onMouseDown={handleIncrementMouseDown}
                onClick={handleIncrementClick}
                disabled={disabled}
                className={cssStyles.button}
              >
                <ArrowDropUpIcon aria-hidden style={{ fontSize: '1.25rem' }} />
              </button>
              <button
                type="button"
                aria-label="Decrease CIDR"
                data-action="decrement"
                onMouseDown={handleDecrementMouseDown}
                onClick={handleDecrementClick}
                disabled={disabled}
                className={cssStyles.button}
              >
                <ArrowDropDownIcon
                  aria-hidden
                  style={{ fontSize: '1.25rem' }}
                />
              </button>
            </div>
          </div>
        )}
      </FieldShell>

      {showSubnetInfo && (
        // The readout sits outside FieldShell, so mirror the shell's theme
        // resolution (styles.theme, sacred default) for the module's
        // [data-theme] color overrides — otherwise it renders page-default
        // black on dark/sacred surfaces.
        <div
          className={cssStyles.subnetInfo}
          data-theme={styles?.theme ?? 'sacred'}
          // The readout recomputes as the CIDR changes but sits outside the
          // input's focus, so screen-reader users would never hear the new
          // mask/host counts. A polite live region announces them without
          // interrupting typing (WCAG 4.1.3 Status Messages).
          role="status"
          aria-live="polite"
        >
          <div>Subnet Mask: {cidrInfo.mask}</div>
          <div>
            Total Hosts: {cidrInfo.totalHosts} ({cidrInfo.usableHosts} usable)
          </div>
          <div>Networks: {cidrInfo.networks}</div>
        </div>
      )}
    </div>
  )
}

CIDRField.displayName = 'CIDRField'

export default CIDRField

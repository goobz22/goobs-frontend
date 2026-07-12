'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './PhoneNumber.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'

const formatPhoneNumber = (inputValue: string): string => {
  const digits = inputValue.replace(/\D/g, '').replace(/^1/, '')
  const limitedDigits = digits.slice(0, 10)
  let formattedNumber = '+1 '
  if (limitedDigits.length > 0) {
    formattedNumber += limitedDigits.slice(0, 3)
    if (limitedDigits.length > 3) {
      formattedNumber += '-' + limitedDigits.slice(3, 6)
      if (limitedDigits.length > 6) {
        formattedNumber += '-' + limitedDigits.slice(6)
      }
    }
  }
  return formattedNumber
}

const parseExistingPhoneNumber = (value: string): string => {
  if (!value) return ''
  if (value.includes('+1')) {
    const digits = value.replace(/\D/g, '').replace(/^1/, '')
    return digits ? formatPhoneNumber(digits).replace('+1 ', '') : ''
  }
  return formatPhoneNumber(value).replace('+1 ', '')
}

export interface PhoneNumberFieldProps {
  /** Controlled phone value; re-parsed into the masked NNN-NNN-NNNN display whenever it changes. */
  value?: string | number
  /** Emits the full formatted string including the prefix, e.g. '+1 555-555-5555' ('+1 ' alone when emptied) — the plain value, not a DOM event. */
  onChange?: (value: string) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Field label (default 'Phone Number'). */
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /**
   * Marks the field required — renders the required indicator next to the label
   * and sets `aria-required` (plus the native `required` attribute) on the
   * input. Top-level ergonomic alias for `styles.required`; DEFAULTS from
   * `styles?.required` when omitted, so every existing `styles={{ required: true }}`
   * callsite renders identically. When both are set the top-level prop wins
   * (same precedence FieldShell uses). Conveys required-ness programmatically
   * (WCAG 1.3.1 / 3.3.2 / 4.1.2), not by the visual asterisk alone.
   */
  required?: boolean
  /**
   * Disables the field — dims the chrome, sets the native `disabled` attribute
   * on the input (removing it from the tab order) and `aria-disabled` on the
   * FieldShell wrapper. Top-level ergonomic alias for `styles.disabled`;
   * DEFAULTS from `styles?.disabled` when omitted. When both are set the
   * top-level prop wins.
   */
  disabled?: boolean
  /**
   * Accessible name for the input when no visible `label` is rendered (e.g. a
   * caller passing `label={null}` for a bare input in a toolbar or table cell).
   * A placeholder is NOT an accessible name. Forwarded as `aria-label` on the
   * input. Prefer a visible `label` when the UI allows; setting this alongside
   * a visible label overrides it, per the ARIA name-computation order.
   */
  ariaLabel?: string
  /**
   * IDs of the element(s) that name the input, when its accessible name lives in
   * a separate visible element rather than the `label` prop. Forwarded as
   * `aria-labelledby` on the input (takes precedence over `ariaLabel`).
   */
  ariaLabelledby?: string
  /** Placeholder text (default '555-555-5555'). */
  placeholder?: string
  id?: string
  /**
   * Native input autocomplete token. Defaults to `'tel'` so the browser and
   * assistive tech can identify the input's purpose (WCAG 1.3.5 Identify
   * Input Purpose) and offer the user's stored phone number for autofill.
   * Pass `'off'` (or any other token) to override.
   */
  autoComplete?: string
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  styles?: FieldStyleOverrides
}

/**
 * US phone input built on FieldShell with a fixed "+1" prefix glued to the
 * left of the input. Typing is limited to 10 digits, displayed as
 * NNN-NNN-NNNN; `onChange` emits the full formatted string with the prefix
 * (e.g. '+1 555-555-5555') — not a DOM event. Auto-binds by `name` inside a
 * goobs `<Form>` when no explicit `value` is passed.
 */
const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value: valueProp,
  onChange: onChangeProp,
  onFocus,
  onBlur,
  label = 'Phone Number',
  helperText,
  error,
  required: requiredProp,
  disabled: disabledProp,
  ariaLabel,
  ariaLabelledby,
  placeholder = '555-555-5555',
  id,
  autoComplete,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. The engine stores the formatted phone string, so bind
  // with T = string. We stringify the incoming prop for the hook only when it
  // is actually present — passing `undefined` through preserves the
  // binding gate (`value === undefined`) so a controlled caller stays in the
  // pass-through path. The engine stores a string; we coerce on read below.
  const {
    value: boundValue,
    onChange,
    onBlur: bindingOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valueProp === undefined ? undefined : String(valueProp),
    onChange: onChangeProp,
    onBlur: undefined,
  })
  // Restore the original default-empty-string behavior for the display value.
  const value: string | number = boundValue ?? ''

  // Chain the engine touched-mark (no-op outside a <Form>) before the caller's
  // FocusEvent onBlur, preserving its original signature.
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      bindingOnBlur?.()
      onBlur?.(e)
    },
    [bindingOnBlur, onBlur]
  )

  const [phoneNumber, setPhoneNumber] = useState(() =>
    parseExistingPhoneNumber(String(value || ''))
  )
  const inputRef = useRef<HTMLInputElement>(null)

  // Top-level `disabled`/`required` props win, then fall back to the
  // `styles`-nested equivalents so existing `styles={{ disabled/required: true }}`
  // callsites render identically (same precedence FieldShell applies). Before
  // these top-level aliases existed, a caller passing `disabled`/`required`
  // (the ergonomic norm every sibling Field exposes) had them silently dropped
  // — the field stayed enabled / non-required and never conveyed the state
  // programmatically. `?? false` keeps the native input attributes plain booleans.
  const disabled = disabledProp ?? styles?.disabled ?? false
  const required = requiredProp ?? styles?.required ?? false

  // Listen for native 'input' events to support browser automation
  // tools that bypass React's synthetic event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== phoneNumber) {
        const strippedInput = target.value.replace(/\D/g, '').slice(0, 10)
        const fullFormattedValue = strippedInput
          ? formatPhoneNumber(strippedInput)
          : '+1 '
        let formattedDigits = ''
        if (strippedInput.length > 0) {
          formattedDigits = strippedInput.slice(0, 3)
          if (strippedInput.length > 3) {
            formattedDigits += '-' + strippedInput.slice(3, 6)
            if (strippedInput.length > 6) {
              formattedDigits += '-' + strippedInput.slice(6, 10)
            }
          }
        }
        setPhoneNumber(formattedDigits)
        onChange?.(fullFormattedValue)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, phoneNumber])

  // Track previous value prop for derived state pattern — when the
  // controlled `value` prop changes externally, re-derive the
  // internally formatted display string.
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setPhoneNumber(parseExistingPhoneNumber(String(value || '')))
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const strippedInput = input.replace(/\D/g, '').slice(0, 10)

      // Format just the digits part for display with stable formatting
      let formattedDigits = ''
      if (strippedInput.length > 0) {
        formattedDigits = strippedInput.slice(0, 3)
        if (strippedInput.length > 3) {
          formattedDigits += '-' + strippedInput.slice(3, 6)
          if (strippedInput.length > 6) {
            formattedDigits += '-' + strippedInput.slice(6, 10)
          }
        }
      }
      setPhoneNumber(formattedDigits)

      // Return the full formatted number with +1 prefix
      const fullFormattedValue = strippedInput
        ? formatPhoneNumber(strippedInput)
        : '+1 '
      if (onChange) {
        onChange(fullFormattedValue)
      }
    },
    [onChange]
  )

  // Inner frame lives in PhoneNumber.module.css — Phone has a `+1` prefix
  // glued to the left of the input. The sacred-gold theme is the hardcoded
  // default; caller-supplied layout overrides (height/borderWidth/radius/
  // font) are forwarded as CSS custom properties, and the disabled chrome
  // is driven by the .disabled modifier on the wrapper + native :disabled
  // on the input.
  const wrapperCssVars: Record<string, string> = {}
  if (styles?.height) wrapperCssVars['--phone-height'] = styles.height
  if (styles?.borderWidth) {
    wrapperCssVars['--phone-border-width'] = styles.borderWidth
  }
  if (styles?.borderRadius) {
    wrapperCssVars['--phone-radius'] = styles.borderRadius
  }
  if (styles?.fontSize) wrapperCssVars['--phone-font-size'] = styles.fontSize
  if (styles?.fontWeight !== undefined) {
    wrapperCssVars['--phone-font-weight'] = String(styles.fontWeight)
  }
  if (styles?.lineHeight) {
    wrapperCssVars['--phone-line-height'] = styles.lineHeight
  }
  if (styles?.fontFamily) {
    wrapperCssVars['--phone-font-family'] = styles.fontFamily
  }

  const wrapperClassNames = [
    cssStyles.inputWrapper,
    disabled && cssStyles.disabled,
  ]
    .filter(Boolean)
    .join(' ')

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
      filled={Boolean(value && String(value).length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div
          className={wrapperClassNames}
          style={wrapperCssVars as React.CSSProperties}
        >
          <div className={cssStyles.prefix}>+1</div>
          <input
            ref={inputRef}
            type="tel"
            id={inputId}
            name={name}
            data-field-name={dataFieldName ?? name}
            value={phoneNumber}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete={autoComplete ?? 'tel'}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            className={cssStyles.input}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

PhoneNumberField.displayName = 'PhoneNumberField'

export default PhoneNumberField

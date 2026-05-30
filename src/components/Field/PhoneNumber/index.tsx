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
  value?: string | number
  onChange?: (value: string) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  placeholder?: string
  id?: string
  autoComplete?: string
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  styles?: FieldStyleOverrides
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value: valueProp,
  onChange: onChangeProp,
  onFocus,
  onBlur,
  label = 'Phone Number',
  helperText,
  error,
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

  const disabled = styles?.disabled || false
  const required = styles?.required || false

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

  const wrapperClassNames = [cssStyles.inputWrapper, disabled && cssStyles.disabled]
    .filter(Boolean)
    .join(' ')

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
            id={id ?? inputId}
            name={name}
            data-field-name={dataFieldName ?? name}
            value={phoneNumber}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete={autoComplete}
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

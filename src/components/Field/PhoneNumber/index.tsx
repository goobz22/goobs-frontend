'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { alpha } from '../../../utils'
import FieldShell, { type FieldStyleOverrides } from '../Shell'

const SACRED_GOLD = '#FFD700'

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
  value = '',
  onChange,
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

  // Inner wrapper kept local — Phone has a `+1` prefix glued to the
  // left of the input, so the visual frame is component-specific.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: styles?.height || '40px',
    width: '100%',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
    border: `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, 0.3)}`,
    borderRadius: styles?.borderRadius || '8px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  }

  const prefixStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    color: disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)',
    fontSize: styles?.fontSize || '16px',
    fontFamily: '"Crimson Text", serif',
    fontWeight: styles?.fontWeight,
    userSelect: 'none',
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    paddingLeft: '8px',
    paddingRight: '16px',
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight,
    lineHeight: styles?.lineHeight,
    fontFamily: styles?.fontFamily || '"Crimson Text", serif',
    color: disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box',
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
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div style={inputWrapperStyle}>
          <div style={prefixStyle}>+1</div>
          <input
            ref={inputRef}
            type="tel"
            id={id ?? inputId}
            name={name}
            data-field-name={dataFieldName}
            value={phoneNumber}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete={autoComplete}
            style={inputStyle}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

PhoneNumberField.displayName = 'PhoneNumberField'

export default PhoneNumberField

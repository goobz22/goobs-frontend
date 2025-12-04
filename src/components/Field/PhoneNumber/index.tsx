'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { alpha } from '../../../utils'

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
  placeholder?: string
  id?: string
  autoComplete?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: string
    width?: string
    minWidth?: string
    maxWidth?: string
    height?: string
    minHeight?: string
    maxHeight?: string
    marginTop?: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    padding?: string
    fontSize?: string
    fontWeight?: string | number
    lineHeight?: string
    borderWidth?: string
    borderRadius?: string
    helperTextType?: 'error' | 'info'
    requiredIndicatorText?: string
    backgroundColor?: string
    borderColor?: string
    color?: string
    fontFamily?: string
  }
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value = '',
  onChange,
  onFocus,
  onBlur,
  label = 'Phone Number',
  helperText,
  placeholder = '555-555-5555',
  id,
  autoComplete,
  styles,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(() =>
    parseExistingPhoneNumber(String(value || ''))
  )
  const [isFocused, setIsFocused] = useState(false)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  useEffect(() => {
    setPhoneNumber(parseExistingPhoneNumber(String(value || '')))
  }, [value])

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

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: styles?.width || '100%',
    minWidth: styles?.minWidth,
    maxWidth: styles?.maxWidth,
    height: styles?.height || 'auto',
    minHeight: styles?.minHeight,
    maxHeight: styles?.maxHeight,
    marginTop: styles?.marginTop || '0',
    marginBottom: styles?.marginBottom || '16px',
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: SACRED_GOLD,
    fontSize: '14px',
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
  }

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: styles?.height || '40px',
    width: '100%',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
    border: `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, isFocused ? 0.6 : 0.3)}`,
    borderRadius: styles?.borderRadius || '8px',
    transition: 'all 0.3s ease',
    boxShadow: isFocused ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
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

  const helperTextStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '12px',
    color:
      styles?.helperTextType === 'error'
        ? '#ff6b6b'
        : 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Crimson Text", serif',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {typeof label === 'string' ? (
            <>
              {label}
              {required && (
                <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>
                  {styles?.requiredIndicatorText || '*'}
                </span>
              )}
            </>
          ) : (
            label
          )}
        </label>
      )}

      <div style={inputWrapperStyle}>
        <div style={prefixStyle}>+1</div>
        <input
          type="tel"
          id={id}
          value={phoneNumber}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={inputStyle}
        />
      </div>

      {helperText && <div style={helperTextStyle}>{helperText}</div>}
    </div>
  )
}

PhoneNumberField.displayName = 'PhoneNumberField'

export default PhoneNumberField

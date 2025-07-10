'use client'
import React, { useCallback, useState, useMemo, useEffect } from 'react'

const formatPhoneNumber = (inputValue: string): string => {
  let digits = inputValue.replace(/\D/g, '').replace(/^1/, '')
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
  if (!value) return '+1 '
  if (value.includes('+1')) {
    const digits = value.replace(/\D/g, '').replace(/^1/, '')
    return formatPhoneNumber(digits)
  }
  return formatPhoneNumber(value)
}

import { TextFieldProps } from '../Text'

export interface PhoneNumberFieldProps extends Omit<TextFieldProps, 'value'> {
  value?: string | number
  sacredtheme?: boolean
  helperText?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}

const getStyles = (
  sacredtheme: boolean,
  isLabelFloating: boolean,
  isFocused: boolean,
  error: boolean,
  disabled: boolean
) => ({
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    width: '100%',
  } as React.CSSProperties,
  inputContainer: {
    position: 'relative' as const,
    width: '100%',
    marginTop: '1rem',
  } as React.CSSProperties,
  input: {
    width: '100%',
    height: '3.5rem',
    padding: '0 1rem',
    paddingRight: '3rem',
    border: `2px solid`,
    borderRadius: '0.25rem',
    outline: 'none',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.8)' : 'white',
    color: sacredtheme ? '#FFD700' : 'black',
    borderColor: error
      ? '#EF4444'
      : isFocused
        ? sacredtheme
          ? '#FFD700'
          : '#3B82F6'
        : sacredtheme
          ? 'rgba(255,215,0,0.5)'
          : '#D1D5DB',
    boxShadow:
      isFocused && !error
        ? sacredtheme
          ? '0 0 20px rgba(255,215,0,0.6)'
          : '0 0 10px rgba(59,130,246,0.5)'
        : 'none',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
  } as React.CSSProperties,
  label: {
    position: 'absolute' as const,
    left: '1rem',
    transition: 'all 0.2s',
    pointerEvents: 'none' as const,
    color: error
      ? '#EF4444'
      : isFocused
        ? sacredtheme
          ? '#FFD700'
          : '#3B82F6'
        : sacredtheme
          ? 'rgba(255,215,0,0.8)'
          : '#6B7281',
    backgroundColor: isLabelFloating
      ? sacredtheme
        ? 'black'
        : 'white'
      : 'transparent',
    padding: isLabelFloating ? '0 0.25rem' : '0',
    top: isLabelFloating ? '0' : '50%',
    transform: isLabelFloating ? 'translateY(-50%)' : 'translateY(-50%)',
    fontSize: isLabelFloating ? '0.75rem' : '1rem',
  } as React.CSSProperties,
  endAdornment: {
    position: 'absolute' as const,
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,215,0,0.4)',
    fontSize: '0.875rem',
    animation: 'sacred-glow 2s infinite alternate',
  } as React.CSSProperties,
})

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = React.memo(props => {
  const {
    name,
    label = 'Phone Number',
    placeholder,
    onChange,
    onFocus,
    onBlur,
    value = '',
    error = false,
    disabled = false,
    id,
    backgroundcolor,
    outlinecolor,
    fontcolor,
    sacredtheme = false,
    ...restProps
  } = props

  const [phoneNumber, setPhoneNumber] = useState(() =>
    parseExistingPhoneNumber(String(value || ''))
  )
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setPhoneNumber(parseExistingPhoneNumber(String(value || '')))
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      if (input === '+1 ' || input === '+1' || input === '+') {
        setPhoneNumber('+1 ')
        if (onChange) {
          const mockEvent = { ...e, target: { ...e.target, value: '+1 ' } }
          onChange(mockEvent)
        }
        return
      }
      let strippedInput = input
        .replace(/^\+1\s?/, '')
        .replace(/\D/g, '')
        .slice(0, 10)
      const formattedValue = formatPhoneNumber(strippedInput)
      setPhoneNumber(formattedValue)
      if (onChange) {
        const mockEvent = {
          ...e,
          target: { ...e.target, value: formattedValue },
        }
        onChange(mockEvent)
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

  const isLabelFloating = isFocused || phoneNumber !== '+1 '
  const styles = getStyles(
    sacredtheme,
    isLabelFloating,
    isFocused,
    error,
    disabled
  )

  const endAdornment = useMemo(
    () => (sacredtheme ? <span style={styles.endAdornment}>𓋴</span> : null),
    [sacredtheme, styles.endAdornment]
  )

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          type="tel"
          id={id}
          name={name}
          value={phoneNumber}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={
            isLabelFloating
              ? sacredtheme
                ? 'Divine number...'
                : placeholder
              : ''
          }
          style={{
            ...styles.input,
            backgroundColor: backgroundcolor,
            borderColor: outlinecolor,
            color: fontcolor,
          }}
          {...restProps}
        />
        {label && (
          <label htmlFor={id} style={styles.label}>
            {sacredtheme ? 'Sacred Connection' : label}
          </label>
        )}
        {endAdornment && (
          <div
            style={{
              position: 'absolute' as const,
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {endAdornment}
          </div>
        )}
      </div>
    </div>
  )
})

PhoneNumberField.displayName = 'PhoneNumberField'
export default PhoneNumberField

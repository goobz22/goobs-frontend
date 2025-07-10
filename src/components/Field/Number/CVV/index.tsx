'use client'
import React, { useCallback, useState, useEffect } from 'react'

export interface CVVProps {
  onChange?: (value: string, isValid: boolean) => void
  minLength?: number
  maxLength?: number
  errorMessage?: string
  sacredtheme?: boolean
  isDefaultValue?: boolean
  value?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  error?: boolean
  style?: React.CSSProperties
}

const getStyles = (
  sacredtheme: boolean,
  isFocused: boolean,
  isLabelFloating: boolean,
  showError: boolean
) => {
  const premiumStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginTop: '1rem',
    } as React.CSSProperties,
    inputContainer: { position: 'relative' } as React.CSSProperties,
    adornment: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    adornmentText: { fontSize: '1rem', color: '#4B5563' },
    input: {
      width: '100%',
      height: '3.5rem',
      paddingLeft: '3rem',
      paddingRight: '1rem',
      border: `2px solid ${showError ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB'}`,
      borderRadius: '0.25rem',
      outline: 'none',
      transition: 'all 0.3s',
      backgroundColor: 'white',
      color: 'black',
    } as React.CSSProperties,
    label: {
      position: 'absolute' as const,
      left: '3rem',
      transition: 'all 0.2s',
      pointerEvents: 'none' as const,
      color: showError ? '#EF4444' : isFocused ? '#3B82F6' : '#6B7281',
      ...(isLabelFloating
        ? {
            top: '0',
            fontSize: '0.75rem',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            padding: '0 0.25rem',
            marginLeft: '-0.5rem',
          }
        : { top: '50%', fontSize: '1rem', transform: 'translateY(-50%)' }),
    } as React.CSSProperties,
    helperText: {
      marginTop: '0.25rem',
      fontSize: '0.75rem',
      padding: '0 0.75rem',
      color: showError ? '#EF4444' : '#6B7281',
    } as React.CSSProperties,
  }

  const sacredStyles = {
    ...premiumStyles,
    adornmentText: {
      ...premiumStyles.adornmentText,
      color: '#FFD700',
      fontWeight: 600,
      textShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
    },
    input: {
      ...premiumStyles.input,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#FFD700',
      borderColor: isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.5)',
      boxShadow: isFocused ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none',
      textShadow: '0 0 2px rgba(255, 215, 0, 0.5)',
    },
    label: {
      ...premiumStyles.label,
      color: showError
        ? 'rgba(255,215,0,0.8)'
        : isFocused
          ? '#FFD700'
          : 'rgba(255, 215, 0, 0.8)',
      ...(isLabelFloating && { backgroundColor: 'rgba(0,0,0,0.8)' }),
    },
    helperText: {
      ...premiumStyles.helperText,
      color: showError ? 'rgba(255,215,0,0.8)' : 'rgba(255, 215, 0, 0.6)',
    },
  }

  return sacredtheme ? sacredStyles : premiumStyles
}

const CVV: React.FC<CVVProps> = ({
  onChange,
  value = '',
  minLength = 3,
  maxLength = 4,
  errorMessage = 'Invalid CVV format',
  sacredtheme = false,
  isDefaultValue = false,
  label = 'CVV',
  placeholder = '123',
  disabled = false,
  name,
  id,
  onFocus,
  onBlur,
  helperText,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value || '')
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  const validateCVV = useCallback(
    (cvv: string): boolean => {
      const trimmedValue = cvv.trim()
      if (trimmedValue === '') return true
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)
      const isValidLength =
        trimmedValue.length >= minLength && trimmedValue.length <= maxLength
      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/\D/g, ''),
    []
  )
  const maskCVV = useCallback(
    (cvv: string): string => (!cvv ? cvv : '*'.repeat(cvv.length)),
    []
  )

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskCVV(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCVV]
  )

  useEffect(() => {
    setInternalValue(value || '')
    setIsValid(validateCVV(value || ''))
  }, [value, validateCVV])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      const truncatedValue = formattedValue.slice(0, maxLength)
      setInternalValue(truncatedValue)
      setHasBeenEdited(true)
      const valid = validateCVV(truncatedValue)
      setIsValid(valid)
      onChange?.(truncatedValue, valid)
    },
    [onChange, validateCVV, formatInput, maxLength]
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

  const isLabelFloating = isFocused || Boolean(internalValue)
  const showError = !isValid && internalValue !== ''
  const styles = getStyles(sacredtheme, isFocused, isLabelFloating, showError)

  const CVVAdornment = () => (
    <div style={styles.adornment}>
      <span style={styles.adornmentText}>🔒</span>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <CVVAdornment />
        <input
          type="password"
          id={id}
          name={name}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isLabelFloating ? placeholder : ''}
          maxLength={maxLength}
          autoComplete="cc-csc"
          style={styles.input}
          {...props}
        />
        {label && (
          <label htmlFor={id} style={styles.label}>
            {label}
          </label>
        )}
      </div>
      {(showError || helperText) && (
        <div style={styles.helperText}>
          {showError ? errorMessage : helperText}
        </div>
      )}
    </div>
  )
}

CVV.displayName = 'CVV'
export default CVV

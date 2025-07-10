'use client'
import React, { useCallback, useState, useEffect } from 'react'

export interface AccountNumberProps {
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
    inputContainer: {
      position: 'relative',
    } as React.CSSProperties,
    adornment: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    adornmentText: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#4B5563',
    } as React.CSSProperties,
    input: {
      width: '100%',
      height: '3.5rem',
      paddingLeft: '2.5rem',
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
      left: '2.5rem',
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
        : {
            top: '50%',
            fontSize: '1rem',
            transform: 'translateY(-50%)',
          }),
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
    adornment: { ...premiumStyles.adornment, left: '1rem' },
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
      '::placeholder': {
        color: 'rgba(255, 215, 0, 0.7)',
        fontStyle: 'italic',
      },
    },
    label: {
      ...premiumStyles.label,
      left: '3rem',
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

const AccountNumber: React.FC<AccountNumberProps> = ({
  onChange,
  value = '',
  minLength = 8,
  maxLength = 17,
  errorMessage = 'Invalid account number format',
  sacredtheme = false,
  isDefaultValue = false,
  label = 'Account Number',
  placeholder,
  disabled = false,
  name,
  id,
  onFocus,
  onBlur,
  helperText,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  const validateAccountNumber = useCallback(
    (accountNumber: string): boolean => {
      const trimmedValue = accountNumber.trim()
      if (trimmedValue === '') return true
      const normalizedValue = trimmedValue.replace(/-/g, '')
      const hasOnlyDigits = /^\d+$/.test(normalizedValue)
      const isValidLength =
        normalizedValue.length >= minLength &&
        normalizedValue.length <= maxLength
      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/[^\d-]/g, ''),
    []
  )

  const maskAccountNumber = useCallback((accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber
    const lastFour = accountNumber.slice(-4)
    return '*'.repeat(Math.max(0, accountNumber.length - 4)) + lastFour
  }, [])

  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue)
      return maskAccountNumber(internalValue)
    return internalValue
  }, [
    isDefaultValue,
    isFocused,
    hasBeenEdited,
    internalValue,
    maskAccountNumber,
  ])

  useEffect(() => {
    setInternalValue(value)
    setIsValid(validateAccountNumber(value))
  }, [value, validateAccountNumber])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const valid = validateAccountNumber(formattedValue)
      setIsValid(valid)
      onChange?.(formattedValue, valid)
    },
    [onChange, validateAccountNumber, formatInput]
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

  const finalPlaceholder = sacredtheme ? '1234567890' : placeholder

  const AccountAdornment = () => (
    <div style={styles.adornment}>
      <span style={styles.adornmentText}>#</span>
    </div>
  )

  const customInputStyles = {
    ...styles.input,
    backgroundColor: !sacredtheme ? backgroundcolor : undefined,
    borderColor: !sacredtheme
      ? showError
        ? '#ef4444'
        : isFocused
          ? outlinecolor || '#3B82F6'
          : outlinecolor || '#D1D5DB'
      : isFocused
        ? '#FFD700'
        : 'rgba(255, 215, 0, 0.5)',
    color: !sacredtheme ? fontcolor : undefined,
  }

  const customLabelStyles = {
    ...styles.label,
    color: !sacredtheme && !showError ? fontcolor : undefined,
  }

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <AccountAdornment />
        <input
          type="text"
          id={id}
          name={name}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isLabelFloating ? finalPlaceholder : ''}
          maxLength={maxLength + 5}
          style={customInputStyles}
          {...props}
        />
        {label && (
          <label htmlFor={id} style={customLabelStyles}>
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

AccountNumber.displayName = 'AccountNumber'

export default AccountNumber

'use client'
import React, { useCallback, useState, useEffect } from 'react'

export interface RoutingNumberProps {
  onChange?: (value: string, isValid: boolean) => void
  errorMessage?: string
  useChecksum?: boolean
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
    adornmentText: {
      fontSize: '1rem',
      color: '#4B5563',
    } as React.CSSProperties,
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

const RoutingNumber: React.FC<RoutingNumberProps> = ({
  onChange,
  value = '',
  errorMessage = 'Invalid routing number format',
  useChecksum = true,
  sacredtheme = false,
  isDefaultValue = false,
  label = 'Routing Number',
  placeholder,
  disabled = false,
  name,
  id,
  onFocus,
  onBlur,
  helperText,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  const validateRoutingChecksum = useCallback(
    (routingNumber: string): boolean => {
      if (routingNumber.length !== 9) return false
      const digits = routingNumber.split('').map(Number)
      const sum =
        3 * (digits[0] + digits[3] + digits[6]) +
        7 * (digits[1] + digits[4] + digits[7]) +
        (digits[2] + digits[5] + digits[8])
      return sum % 10 === 0
    },
    []
  )

  const validateRoutingNumber = useCallback(
    (routingNumber: string): boolean => {
      const trimmedValue = routingNumber.trim()
      if (trimmedValue === '') return true
      if (trimmedValue.length !== 9) return false
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)
      return (
        hasOnlyDigits && (!useChecksum || validateRoutingChecksum(trimmedValue))
      )
    },
    [useChecksum, validateRoutingChecksum]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/\D/g, ''),
    []
  )
  const maskRoutingNumber = useCallback((routingNumber: string): string => {
    if (!routingNumber || routingNumber.length !== 9) return routingNumber
    return `${routingNumber.slice(0, 4)}****${routingNumber.slice(-1)}`
  }, [])

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskRoutingNumber(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskRoutingNumber]
  )

  useEffect(() => {
    setInternalValue(value)
    setIsValid(validateRoutingNumber(value))
  }, [value, validateRoutingNumber])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 9)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const valid = validateRoutingNumber(formattedValue)
      setIsValid(valid)
      onChange?.(formattedValue, valid)
    },
    [onChange, validateRoutingNumber, formatInput]
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
  const finalPlaceholder = sacredtheme ? '021000021' : placeholder

  const RoutingAdornment = () => (
    <div style={styles.adornment}>
      {sacredtheme && (
        <span
          style={{
            position: 'absolute',
            left: '-1rem',
            color: 'rgba(255,215,0,0.4)',
            fontSize: '0.75rem',
            animation: 'sacred-float 4s ease-in-out infinite',
          }}
        >
          𓂋
        </span>
      )}
      <span style={styles.adornmentText}>⚡</span>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <RoutingAdornment />
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
          maxLength={9}
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

RoutingNumber.displayName = 'RoutingNumber'
export default RoutingNumber

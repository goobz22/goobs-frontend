'use client'
import React, { useCallback, useState, useEffect } from 'react'

export type CardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'dinersclub'
  | 'jcb'
  | 'unknown'
interface CardPattern {
  type: CardType
  pattern: RegExp
  length: number[]
  format: RegExp
}

const cardPatterns: CardPattern[] = [
  {
    type: 'amex',
    pattern: /^3[47]/,
    length: [15],
    format: /(\d{4})(\d{6})(\d{5})/,
  },
  {
    type: 'visa',
    pattern: /^4/,
    length: [16, 18, 19],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
  {
    type: 'mastercard',
    pattern: /^5[1-5]|^222[1-9]|^22[3-9]|^2[3-6]|^27[0-1]|^2720/,
    length: [16],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
  {
    type: 'discover',
    pattern: /^6(?:011|5)/,
    length: [16],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
  {
    type: 'dinersclub',
    pattern: /^3(?:0[0-5]|[68])/,
    length: [14],
    format: /(\d{4})(\d{6})(\d{4})/,
  },
  {
    type: 'jcb',
    pattern: /^35/,
    length: [16],
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
  },
]

export interface CreditCardNumberProps {
  onChange?: (value: string, isValid: boolean, cardType: CardType) => void
  errorMessage?: string
  useLuhnValidation?: boolean
  sacredtheme?: boolean
  isDefaultValue?: boolean
  enableFormatting?: boolean
  value?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  error?: boolean
  style?: React.CSSProperties
}

const getStyles = (
  sacredtheme: boolean,
  isFocused: boolean,
  isLabelFloating: boolean,
  showError: boolean
): {
  container: React.CSSProperties
  inputContainer: React.CSSProperties
  adornment: React.CSSProperties
  adornmentText: React.CSSProperties
  input: React.CSSProperties
  label: React.CSSProperties
  helperText: React.CSSProperties
} => {
  const premiumStyles = {
    container: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      width: '100%',
      marginTop: '1rem',
    },
    inputContainer: { position: 'relative' as const },
    adornment: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex' as const,
      alignItems: 'center' as const,
    },
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
    },
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
    },
    helperText: {
      marginTop: '0.25rem',
      fontSize: '0.75rem',
      padding: '0 0.75rem',
      color: showError ? '#EF4444' : '#6B7281',
    },
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

const CreditCardNumber: React.FC<CreditCardNumberProps> = ({
  onChange,
  value = '',
  errorMessage = 'Invalid credit card number',
  useLuhnValidation = true,
  sacredtheme = false,
  isDefaultValue = false,
  enableFormatting = true,
  label = 'Card Number',
  placeholder = '1234 5678 9012 3456',
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

  const detectCardType = useCallback((cardNumber: string): CardType => {
    const cleanNumber = cardNumber.replace(/\D/g, '')
    for (const pattern of cardPatterns)
      if (pattern.pattern.test(cleanNumber)) return pattern.type
    return 'unknown'
  }, [])

  const validateLuhn = useCallback((cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\D/g, '')
    if (cleanNumber.length < 13) return false
    let sum = 0
    let isEven = false
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i])
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }, [])

  const validateCreditCard = useCallback(
    (cardNumber: string): boolean => {
      const cleanNumber = cardNumber.replace(/\D/g, '')
      if (cleanNumber === '') return true
      if (!/^\d+$/.test(cleanNumber)) return false
      const detectedType = detectCardType(cleanNumber)
      const pattern = cardPatterns.find(p => p.type === detectedType)
      if (pattern) {
        if (!pattern.length.includes(cleanNumber.length)) return false
      } else if (cleanNumber.length < 13 || cleanNumber.length > 19)
        return false
      return !useLuhnValidation || validateLuhn(cleanNumber)
    },
    [detectCardType, useLuhnValidation, validateLuhn]
  )

  const formatInput = useCallback(
    (input: string): string => {
      const cleanNumber = input.replace(/\D/g, '')
      if (!enableFormatting) return cleanNumber
      const detectedType = detectCardType(cleanNumber)
      const pattern = cardPatterns.find(p => p.type === detectedType)
      if (pattern && cleanNumber.length >= 4) {
        const match = cleanNumber.match(pattern.format)
        if (match) return match.slice(1).join(' ').trim()
      }
      return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    [detectCardType, enableFormatting]
  )

  const maskCreditCard = useCallback(
    (cardNumber: string): string => {
      const cleanNumber = cardNumber.replace(/\D/g, '')
      if (!cleanNumber || cleanNumber.length < 8) return cardNumber
      const firstFour = cleanNumber.slice(0, 4)
      const lastFour = cleanNumber.slice(-4)
      const maskedPortion = '*'.repeat(Math.max(0, cleanNumber.length - 8))
      const maskedNumber = firstFour + maskedPortion + lastFour
      return enableFormatting ? formatInput(maskedNumber) : maskedNumber
    },
    [enableFormatting, formatInput]
  )

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskCreditCard(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCreditCard]
  )

  useEffect(() => {
    const safeValue = value || ''
    const formattedValue = formatInput(safeValue)
    setInternalValue(formattedValue)
    setIsValid(validateCreditCard(safeValue))
  }, [value, validateCreditCard, formatInput])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 23)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const detectedType = detectCardType(formattedValue)
      const valid = validateCreditCard(formattedValue)
      setIsValid(valid)
      onChange?.(formattedValue.replace(/\D/g, ''), valid, detectedType)
    },
    [onChange, validateCreditCard, formatInput, detectCardType]
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

  const getCardIcon = useCallback(
    () => (sacredtheme ? '𓊪' : '💳'),
    [sacredtheme]
  )

  const isLabelFloating = isFocused || Boolean(internalValue)
  const showError = !isValid && internalValue !== ''
  const styles = getStyles(sacredtheme, isFocused, isLabelFloating, showError)

  const CardAdornment = () => (
    <div style={styles.adornment}>
      <span style={styles.adornmentText}>{getCardIcon()}</span>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <CardAdornment />
        <input
          type="text"
          inputMode="numeric"
          id={id}
          name={name}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isLabelFloating ? placeholder : ''}
          maxLength={23}
          autoComplete="cc-number"
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

CreditCardNumber.displayName = 'CreditCardNumber'
export default CreditCardNumber

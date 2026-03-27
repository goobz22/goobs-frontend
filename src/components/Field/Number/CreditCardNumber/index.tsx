'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'

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
  useLuhnValidation?: boolean
  isDefaultValue?: boolean
  enableFormatting?: boolean
  value?: string
  label?: string
  placeholder?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  disabled?: boolean
  styles?: FormFieldStyles
}

const getStyles = (styles?: FormFieldStyles, isFocused?: boolean) => {
  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(styles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: styles?.height || '40px',
      width: '100%',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      transition,
    },
    input: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
      padding: styles?.padding || '8px 16px',
      paddingLeft: styles?.paddingLeft || '48px', // Space for card icon
      paddingRight: styles?.paddingRight || '16px',
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    adornment: getSharedAdornmentStyles(adornmentColor),
    startAdornment: { left: '16px' },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

const CreditCardNumber: React.FC<CreditCardNumberProps> = ({
  onChange,
  value = '',
  useLuhnValidation = true,
  isDefaultValue = false,
  enableFormatting = true,
  label = 'Card Number',
  placeholder = '1234 5678 9012 3456',
  id,
  onFocus,
  onBlur,
  helperText,
  disabled,
  styles,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value || '')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
      let digit = parseInt(cleanNumber.charAt(i), 10)
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

  // Track previous value prop for derived state pattern
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    const safeValue = value || ''
    const formattedValue = formatInput(safeValue)
    setInternalValue(formattedValue)
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const formattedValue = formatInput(target.value).slice(0, 23)
      if (formattedValue !== internalValue) {
        setInternalValue(formattedValue)
        setHasBeenEdited(true)
        const detectedType = detectCardType(formattedValue)
        const valid = validateCreditCard(formattedValue)
        onChange?.(formattedValue.replace(/\D/g, ''), valid, detectedType)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, internalValue, formatInput, detectCardType, validateCreditCard])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 23)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const detectedType = detectCardType(formattedValue)
      const valid = validateCreditCard(formattedValue)
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

  const getCardIcon = useCallback(() => '💳', [])

  const computedStyles = getStyles(
    { ...styles, ...(disabled !== undefined ? { disabled } : {}) },
    isFocused
  )

  return (
    <div style={computedStyles.container}>
      {label && (
        <label style={computedStyles.label}>
          {label}
          {styles?.required && (
            <span style={getRequiredIndicatorStyle(styles)}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={computedStyles.inputWrapper}>
        <div
          style={{
            ...computedStyles.adornment,
            ...computedStyles.startAdornment,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            marginTop: '-3px',
          }}
        >
          <span>{getCardIcon()}</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          id={id}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
          placeholder={placeholder}
          maxLength={23}
          autoComplete="cc-number"
          style={computedStyles.input}
          {...props}
        />
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

CreditCardNumber.displayName = 'CreditCardNumber'
export default CreditCardNumber

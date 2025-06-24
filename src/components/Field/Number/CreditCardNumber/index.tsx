'use client'
import React, { useCallback, useState, useEffect } from 'react'
import { Box, alpha, keyframes } from '@mui/material'
import TextField, { TextFieldProps } from '../../../Field/Text'

// Sacred animations from USD component
const goldShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.1); }
  100% { transform: translateY(0px) scale(1); }
`

// Card types and their patterns
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

/**
 * Props interface for the CreditCardNumber component
 * Extends TextFieldProps and adds credit card specific behavior
 */
export interface CreditCardNumberProps
  extends Omit<TextFieldProps, 'onChange'> {
  /**
   * Callback when the card number changes and passes validation
   */
  onChange?: (value: string, isValid: boolean, cardType: CardType) => void
  /**
   * Custom error message for invalid card numbers
   */
  errorMessage?: string
  /**
   * Whether to use Luhn algorithm validation
   */
  useLuhnValidation?: boolean
  /**
   * Enable sacred Egyptian theme
   */
  sacredtheme?: boolean
  /**
   * Whether this is a default/existing value that should be partially masked
   */
  isDefaultValue?: boolean
  /**
   * Whether to format the input with spaces
   */
  enableFormatting?: boolean
}

/**
 * CreditCardNumber component for credit card number input with validation
 */
const CreditCardNumber: React.FC<CreditCardNumberProps> = ({
  onChange,
  value = '',
  errorMessage = 'Invalid credit card number',
  useLuhnValidation = true,
  sacredtheme = false,
  isDefaultValue = false,
  enableFormatting = true,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value as string)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const [cardType, setCardType] = useState<CardType>('unknown')

  // Detect card type from number
  const detectCardType = useCallback((cardNumber: string): CardType => {
    const cleanNumber = cardNumber.replace(/\D/g, '')

    for (const pattern of cardPatterns) {
      if (pattern.pattern.test(cleanNumber)) {
        return pattern.type
      }
    }

    return 'unknown'
  }, [])

  // Luhn algorithm validation
  const validateLuhn = useCallback((cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\D/g, '')
    if (cleanNumber.length < 13) return false

    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }, [])

  /**
   * Validates a credit card number string
   */
  const validateCreditCard = useCallback(
    (cardNumber: string): boolean => {
      // Trim any spaces
      const cleanNumber = cardNumber.replace(/\D/g, '')

      // Check if empty and consider valid if empty (for optional fields)
      if (cleanNumber === '') return true

      // Check if contains only digits
      if (!/^\d+$/.test(cleanNumber)) return false

      // Check length based on card type
      const detectedType = detectCardType(cleanNumber)
      const pattern = cardPatterns.find(p => p.type === detectedType)

      if (pattern) {
        const isValidLength = pattern.length.includes(cleanNumber.length)
        if (!isValidLength) return false
      } else {
        // For unknown types, check general length range
        if (cleanNumber.length < 13 || cleanNumber.length > 19) return false
      }

      // Luhn validation if enabled
      if (useLuhnValidation) {
        return validateLuhn(cleanNumber)
      }

      return true
    },
    [detectCardType, useLuhnValidation, validateLuhn]
  )

  // Format the input: only allow digits and spaces
  const formatInput = useCallback(
    (input: string): string => {
      // Remove all non-digits
      const cleanNumber = input.replace(/\D/g, '')

      if (!enableFormatting) return cleanNumber

      // Detect card type and format accordingly
      const detectedType = detectCardType(cleanNumber)
      const pattern = cardPatterns.find(p => p.type === detectedType)

      if (pattern && cleanNumber.length >= 4) {
        const match = cleanNumber.match(pattern.format)
        if (match) {
          return match.slice(1).join(' ').trim()
        }
      }

      // Default formatting for unknown types (groups of 4)
      return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    [detectCardType, enableFormatting]
  )

  // Mask credit card number for security - show first 4 and last 4 digits
  const maskCreditCard = useCallback(
    (cardNumber: string): string => {
      const cleanNumber = cardNumber.replace(/\D/g, '')
      if (!cleanNumber || cleanNumber.length < 8) return cardNumber

      const firstFour = cleanNumber.slice(0, 4)
      const lastFour = cleanNumber.slice(-4)
      const middleLength = cleanNumber.length - 8
      const maskedPortion = '*'.repeat(middleLength)

      const maskedNumber = firstFour + maskedPortion + lastFour

      // Apply formatting to masked number if enabled
      if (enableFormatting) {
        return formatInput(maskedNumber)
      }

      return maskedNumber
    },
    [enableFormatting, formatInput]
  )

  // Get display value based on focus state and default value status
  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue) {
      return maskCreditCard(internalValue)
    }
    return internalValue
  }, [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCreditCard])

  useEffect(() => {
    // Update internal value when prop value changes
    const formattedValue = formatInput(value as string)
    setInternalValue(formattedValue)

    // Detect card type and validate
    const detectedType = detectCardType(value as string)
    setCardType(detectedType)
    setIsValid(validateCreditCard(value as string))
  }, [value, validateCreditCard, detectCardType, formatInput])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)

      // Limit to 23 characters (19 digits + 4 spaces max)
      const truncatedValue = formattedValue.slice(0, 23)

      setInternalValue(truncatedValue)
      setHasBeenEdited(true)

      const detectedType = detectCardType(truncatedValue)
      setCardType(detectedType)

      const valid = validateCreditCard(truncatedValue)
      setIsValid(valid)

      if (onChange) {
        onChange(truncatedValue.replace(/\D/g, ''), valid, detectedType)
      }
    },
    [onChange, validateCreditCard, formatInput, detectCardType]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    },
    [props]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    },
    [props]
  )

  // Get card icon based on type
  const getCardIcon = useCallback(() => {
    if (sacredtheme) {
      return '𓊪' // Egyptian hieroglyph for "card/tablet"
    }

    switch (cardType) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      case 'discover':
        return '💳'
      case 'dinersclub':
        return '💳'
      case 'jcb':
        return '💳'
      default:
        return '💳'
    }
  }, [cardType, sacredtheme])

  const CardAdornment = () => (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            left: '-15px',
            color: alpha('#FFD700', 0.4),
            fontSize: '12px',
            animation: `${floatGlyph} 3s ease-in-out infinite`,
          }}
        >
          𓅓
        </Box>
      )}
      <Box
        sx={{
          color: sacredtheme ? '#FFD700' : 'inherit',
          fontWeight: sacredtheme ? 600 : 400,
          fontSize: sacredtheme ? '14px' : '12px',
          ...(sacredtheme && {
            background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
            backgroundSize: '200% 100%',
            animation: `${goldShimmer} 3s linear infinite`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
          }),
        }}
      >
        {getCardIcon()}
      </Box>
    </Box>
  )

  return (
    <TextField
      {...props}
      value={getDisplayValue()}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={!isValid && internalValue !== ''}
      helperText={
        !isValid && internalValue !== '' ? errorMessage : props.helperText
      }
      label={props.label || 'Card Number'}
      placeholder={props.placeholder || '1234 5678 9012 3456'}
      sacredtheme={sacredtheme}
      startAdornment={<CardAdornment />}
      inputProps={{
        ...props.inputProps,
        maxLength: 23, // 19 digits + 4 spaces
        autoComplete: 'cc-number',
        inputMode: 'numeric',
      }}
      slotProps={{
        input: {
          sx: {
            '& .MuiInputBase-input': {
              marginLeft: sacredtheme ? '-10px' : '-15px',
              marginTop: '2px',
            },
            '&::placeholder': {
              marginLeft: sacredtheme ? '-10px' : '-15px',
              marginTop: '2px',
            },
          },
        },
      }}
    />
  )
}

CreditCardNumber.displayName = 'CreditCardNumber'

export default CreditCardNumber

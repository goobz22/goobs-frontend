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

/**
 * Props interface for the AccountNumber component
 * Extends TextFieldProps and adds account number specific behavior
 */
export interface AccountNumberProps extends Omit<TextFieldProps, 'onChange'> {
  /**
   * Callback when the account number changes and passes validation
   */
  onChange?: (value: string, isValid: boolean) => void
  /**
   * Minimum length for account number
   */
  minLength?: number
  /**
   * Maximum length for account number
   */
  maxLength?: number
  /**
   * Custom error message for invalid account numbers
   */
  errorMessage?: string
  /**
   * Enable sacred Egyptian theme
   */
  sacredtheme?: boolean
  /**
   * Whether this is a default/existing value that should be partially masked
   */
  isDefaultValue?: boolean
}

/**
 * AccountNumber component for bank account number input with validation
 */
const AccountNumber: React.FC<AccountNumberProps> = ({
  onChange,
  value = '',
  minLength = 8,
  maxLength = 17,
  errorMessage = 'Invalid account number format',
  sacredtheme = false,
  isDefaultValue = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value as string)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  /**
   * Validates an account number string
   */
  const validateAccountNumber = useCallback(
    (accountNumber: string): boolean => {
      // Trim any spaces
      const trimmedValue = accountNumber.trim()

      // Check if empty and consider valid if empty (for optional fields)
      if (trimmedValue === '') return true

      // Check if contains only digits (allow hyphens but normalize for validation)
      const normalizedValue = trimmedValue.replace(/-/g, '')
      const hasOnlyDigits = /^\d+$/.test(normalizedValue)

      // Check if meets length requirements
      const isValidLength =
        normalizedValue.length >= minLength &&
        normalizedValue.length <= maxLength

      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  // Format the input: only allow digits and hyphens
  const formatInput = useCallback((input: string): string => {
    // Filter out anything that's not a digit or hyphen
    return input.replace(/[^\d-]/g, '')
  }, [])

  // Mask account number for security - show only last 4 digits
  const maskAccountNumber = useCallback((accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber
    const lastFour = accountNumber.slice(-4)
    const maskedPortion = '*'.repeat(Math.max(0, accountNumber.length - 4))
    return maskedPortion + lastFour
  }, [])

  // Get display value based on focus state and default value status
  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue) {
      return maskAccountNumber(internalValue)
    }
    return internalValue
  }, [
    isDefaultValue,
    isFocused,
    hasBeenEdited,
    internalValue,
    maskAccountNumber,
  ])

  useEffect(() => {
    // Update internal value when prop value changes
    setInternalValue(value as string)
    // Validate the new value
    setIsValid(validateAccountNumber(value as string))
  }, [value, validateAccountNumber])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)

      setInternalValue(formattedValue)
      setHasBeenEdited(true)

      const valid = validateAccountNumber(formattedValue)
      setIsValid(valid)

      if (onChange) {
        onChange(formattedValue, valid)
      }
    },
    [onChange, validateAccountNumber, formatInput]
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

  const AccountAdornment = () => (
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
          𓊖
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
        #
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
      label={props.label || 'Account Number'}
      placeholder={sacredtheme ? '1234567890' : props.placeholder}
      sacredtheme={sacredtheme}
      startAdornment={<AccountAdornment />}
      inputProps={{
        ...props.inputProps,
        maxLength: maxLength + 5, // Allow extra chars for potential hyphens
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

AccountNumber.displayName = 'AccountNumber'

export default AccountNumber

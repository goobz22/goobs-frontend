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
 * Props interface for the CVV component
 * Extends TextFieldProps and adds CVV specific behavior
 */
export interface CVVProps extends Omit<TextFieldProps, 'onChange'> {
  /**
   * Callback when the CVV changes and passes validation
   */
  onChange?: (value: string, isValid: boolean) => void
  /**
   * Minimum length for CVV (default: 3)
   */
  minLength?: number
  /**
   * Maximum length for CVV (default: 4)
   */
  maxLength?: number
  /**
   * Custom error message for invalid CVV
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
 * CVV component for credit card verification value input with validation
 */
const CVV: React.FC<CVVProps> = ({
  onChange,
  value = '',
  minLength = 3,
  maxLength = 4,
  errorMessage = 'Invalid CVV format',
  sacredtheme = false,
  isDefaultValue = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value as string)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  /**
   * Validates a CVV string
   */
  const validateCVV = useCallback(
    (cvv: string): boolean => {
      // Trim any spaces
      const trimmedValue = cvv.trim()

      // Check if empty and consider valid if empty (for optional fields)
      if (trimmedValue === '') return true

      // Check if contains only digits
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)

      // Check if meets length requirements
      const isValidLength =
        trimmedValue.length >= minLength && trimmedValue.length <= maxLength

      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  // Format the input: only allow digits
  const formatInput = useCallback((input: string): string => {
    // Filter out anything that's not a digit
    return input.replace(/\D/g, '')
  }, [])

  // Mask CVV for security - show as asterisks
  const maskCVV = useCallback((cvv: string): string => {
    if (!cvv) return cvv
    return '*'.repeat(cvv.length)
  }, [])

  // Get display value based on focus state and default value status
  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue) {
      return maskCVV(internalValue)
    }
    return internalValue
  }, [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCVV])

  useEffect(() => {
    // Update internal value when prop value changes
    setInternalValue(value as string)
    // Validate the new value
    setIsValid(validateCVV(value as string))
  }, [value, validateCVV])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)

      // Limit to maxLength digits
      const truncatedValue = formattedValue.slice(0, maxLength)

      setInternalValue(truncatedValue)
      setHasBeenEdited(true)

      const valid = validateCVV(truncatedValue)
      setIsValid(valid)

      if (onChange) {
        onChange(truncatedValue, valid)
      }
    },
    [onChange, validateCVV, formatInput, maxLength]
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

  const CVVAdornment = () => (
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
          𓋹
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
        🔒
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
      label={props.label || 'CVV'}
      placeholder={props.placeholder || '123'}
      sacredtheme={sacredtheme}
      startAdornment={<CVVAdornment />}
      inputProps={{
        ...props.inputProps,
        maxLength: maxLength,
        type: 'password',
        autoComplete: 'cc-csc',
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

CVV.displayName = 'CVV'

export default CVV

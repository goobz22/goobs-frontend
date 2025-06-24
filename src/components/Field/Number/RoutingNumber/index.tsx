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
 * Props interface for the RoutingNumber component
 * Extends TextFieldProps and adds routing number specific behavior
 */
export interface RoutingNumberProps extends Omit<TextFieldProps, 'onChange'> {
  /**
   * Callback when the routing number changes and passes validation
   */
  onChange?: (value: string, isValid: boolean) => void
  /**
   * Custom error message for invalid routing numbers
   */
  errorMessage?: string
  /**
   * Whether to use ABA checksum validation (US routing numbers)
   */
  useChecksum?: boolean
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
 * RoutingNumber component for bank routing number input with validation
 * US Routing numbers are 9 digits and follow a specific checksum algorithm
 */
const RoutingNumber: React.FC<RoutingNumberProps> = ({
  onChange,
  value = '',
  errorMessage = 'Invalid routing number format',
  useChecksum = true,
  sacredtheme = false,
  isDefaultValue = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value as string)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  // ABA routing number checksum validation
  const validateRoutingChecksum = useCallback(
    (routingNumber: string): boolean => {
      // Must be exactly 9 digits for checksum validation
      if (routingNumber.length !== 9) return false

      // ABA routing number checksum validation:
      // 3(d1 + d4 + d7) + 7(d2 + d5 + d8) + (d3 + d6 + d9) mod 10 = 0
      const digits = routingNumber.split('').map(Number)

      const sum =
        3 * (digits[0] + digits[3] + digits[6]) +
        7 * (digits[1] + digits[4] + digits[7]) +
        (digits[2] + digits[5] + digits[8])

      return sum % 10 === 0
    },
    []
  )

  /**
   * Validates a routing number string
   */
  const validateRoutingNumber = useCallback(
    (routingNumber: string): boolean => {
      // Trim any spaces
      const trimmedValue = routingNumber.trim()

      // Check if empty and consider valid if empty (for optional fields)
      if (trimmedValue === '') return true

      // Must be exactly 9 digits
      if (trimmedValue.length !== 9) return false

      // Check if contains only digits
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)

      // If basic validation passes and checksum is enabled, validate checksum
      if (hasOnlyDigits && useChecksum) {
        return validateRoutingChecksum(trimmedValue)
      }

      return hasOnlyDigits
    },
    [useChecksum, validateRoutingChecksum]
  )

  // Format the input: only allow digits
  const formatInput = useCallback((input: string): string => {
    // Filter out anything that's not a digit
    return input.replace(/\D/g, '')
  }, [])

  // Mask routing number for security - show first 4 and last 1 digits
  const maskRoutingNumber = useCallback((routingNumber: string): string => {
    if (!routingNumber || routingNumber.length !== 9) return routingNumber
    const firstFour = routingNumber.slice(0, 4)
    const lastOne = routingNumber.slice(-1)
    const maskedPortion = '*'.repeat(4)
    return firstFour + maskedPortion + lastOne
  }, [])

  // Get display value based on focus state and default value status
  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue) {
      return maskRoutingNumber(internalValue)
    }
    return internalValue
  }, [
    isDefaultValue,
    isFocused,
    hasBeenEdited,
    internalValue,
    maskRoutingNumber,
  ])

  useEffect(() => {
    // Update internal value when prop value changes
    setInternalValue(value as string)
    // Validate the new value
    setIsValid(validateRoutingNumber(value as string))
  }, [value, validateRoutingNumber])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)

      // Limit to 9 digits max
      const truncatedValue = formattedValue.slice(0, 9)

      setInternalValue(truncatedValue)
      setHasBeenEdited(true)

      const valid = validateRoutingNumber(truncatedValue)
      setIsValid(valid)

      if (onChange) {
        onChange(truncatedValue, valid)
      }
    },
    [onChange, validateRoutingNumber, formatInput]
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

  const RoutingAdornment = () => (
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
          𓂋
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
        ⚡
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
      label={props.label || 'Routing Number'}
      placeholder={sacredtheme ? '021000021' : props.placeholder}
      sacredtheme={sacredtheme}
      startAdornment={<RoutingAdornment />}
      inputProps={{
        ...props.inputProps,
        maxLength: 9,
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

RoutingNumber.displayName = 'RoutingNumber'

export default RoutingNumber

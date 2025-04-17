'use client'
import React, { useCallback, useState, useEffect } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'

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
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value as string)
  const [isValid, setIsValid] = useState<boolean>(true)

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

      const valid = validateRoutingNumber(truncatedValue)
      setIsValid(valid)

      if (onChange) {
        onChange(truncatedValue, valid)
      }
    },
    [onChange, validateRoutingNumber, formatInput]
  )

  return (
    <TextField
      {...props}
      value={internalValue}
      onChange={handleChange}
      error={!isValid && internalValue !== ''}
      helperText={
        !isValid && internalValue !== '' ? errorMessage : props.helperText
      }
      inputProps={{
        ...props.inputProps,
        maxLength: 9,
      }}
    />
  )
}

RoutingNumber.displayName = 'RoutingNumber'

export default RoutingNumber

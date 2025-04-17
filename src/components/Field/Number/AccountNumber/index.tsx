'use client'
import React, { useCallback, useState, useEffect } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'

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
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value as string)
  const [isValid, setIsValid] = useState<boolean>(true)

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

      const valid = validateAccountNumber(formattedValue)
      setIsValid(valid)

      if (onChange) {
        onChange(formattedValue, valid)
      }
    },
    [onChange, validateAccountNumber, formatInput]
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
        maxLength: maxLength + 5, // Allow extra chars for potential hyphens
      }}
    />
  )
}

AccountNumber.displayName = 'AccountNumber'

export default AccountNumber

'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'

export interface MACAddressFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => getMacValue(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
}

/**
 * Validates if a string is a valid MAC address segment (2 hex digits)
 */
const isValidSegment = (segment: string): boolean => {
  if (segment === '') return true
  const validHexRegex = /^[0-9a-fA-F]{1,2}$/
  return validHexRegex.test(segment)
}

/**
 * Validates if a string is a valid complete MAC address
 */
const isValidMACAddress = (mac: string): boolean => {
  const segments = mac.split(':')
  if (segments.length !== 6) return false
  return segments.every(segment => isValidSegment(segment) && segment !== '')
}

/**
 * A specialized text field for MAC address management
 * - Validates MAC addresses in proper format
 * - Automatically adds colons after every 2 hex digits
 * - Only allows valid MAC address format (XX:XX:XX:XX:XX:XX)
 * - Converts all inputs to uppercase
 * - Requires complete MAC addresses
 */
const MACAddressField: React.FC<MACAddressFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'MAC Address',
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidMACAddress(initialValue)
  )
  const lastInputTypeWasDelete = useRef(false)

  // Validate initial value on mount
  useEffect(() => {
    if (initialValue) {
      const validMAC = isValidMACAddress(initialValue)
      setIsValid(validMAC)
    }
  }, [initialValue])

  const formatMACAddress = useCallback(
    (input: string, wasDelete: boolean): string => {
      // Replace any character that's not a hex digit or colon
      let formatted = input.replace(/[^0-9a-fA-F:]/g, '').toUpperCase()

      // Remove consecutive colons
      formatted = formatted.replace(/:{2,}/g, ':')

      // Remove colons at the beginning
      formatted = formatted.replace(/^:/, '')

      // Don't allow more than 5 colons
      const colons = formatted.match(/:/g)
      if (colons && colons.length > 5) {
        formatted = formatted.substring(0, formatted.lastIndexOf(':'))
      }

      // Make sure each segment is valid (max 2 hex chars)
      const segments = formatted.split(':')

      // Truncate any segments that are more than 2 characters
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].length > 2) {
          segments[i] = segments[i].substring(0, 2)
        }
      }

      formatted = segments.join(':')

      // Auto-insert colons after 2 hex digits
      if (!wasDelete) {
        // Split by colons to get segments
        const segments = formatted.split(':')

        // Only process the last segment if it doesn't have a trailing colon
        // and we have less than 6 segments total
        if (segments.length < 6) {
          const lastSegment = segments[segments.length - 1]

          // If the last segment has 2 hex digits and doesn't end with a colon, add a colon
          if (lastSegment.length === 2 && segments.length < 6) {
            formatted = formatted + ':'
          }
        }
      }

      return formatted
    },
    []
  )

  const validateMACAddress = useCallback((mac: string): boolean => {
    if (mac === '') return true

    // Only valid if it's a complete MAC address
    return isValidMACAddress(mac)
  }, [])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      // Check if characters were deleted
      lastInputTypeWasDelete.current = rawValue.length < value.length

      const formattedValue = formatMACAddress(
        rawValue,
        lastInputTypeWasDelete.current
      )
      const valid = validateMACAddress(formattedValue)

      setValue(formattedValue)
      setIsValid(valid)

      // Create a properly typed clone of the event to prevent issues with synthetic events
      const clonedEvent = {
        ...event,
        target: {
          ...event.target,
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(clonedEvent)
    },
    [onChange, formatMACAddress, validateMACAddress, value]
  )

  // Handle paste events to format them properly
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')

      // Format the pasted text without auto-inserting colons
      const formattedValue = formatMACAddress(pastedText, false)

      setValue(formattedValue)
      setIsValid(validateMACAddress(formattedValue))

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)
    },
    [formatMACAddress, onChange, validateMACAddress]
  )

  // Determine error message based on validation state
  const getErrorMessage = useCallback(() => {
    if (!isValid) {
      return 'Please enter a valid MAC address (XX:XX:XX:XX:XX:XX)'
    }
    return undefined
  }, [isValid])

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      label={label}
      error={!isValid}
      helperText={getErrorMessage()}
      placeholder="00:1A:2B:3C:4D:5E"
      {...rest}
    />
  )
}

export default MACAddressField

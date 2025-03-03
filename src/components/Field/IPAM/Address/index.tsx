'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'

export interface IPAddressFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => getIpValue(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  /** Whether to allow incomplete IP addresses (default: true) */
  allowIncomplete?: boolean
  /** Auto insert dot after 3 digits in a segment (default: true) */
  autoInsertDots?: boolean
  /** Default network (e.g., '192.168.0.0') to validate IPs against */
  defaultNetwork?: string
  /** Subnet mask for validation (e.g., '255.255.255.0') */
  subnetMask?: string
}

/**
 * Validates if a string is a valid IP address segment (0-255)
 */
const isValidSegment = (segment: string): boolean => {
  if (segment === '') return true
  const num = parseInt(segment, 10)
  return !isNaN(num) && num >= 0 && num <= 255 && segment === num.toString()
}

/**
 * Validates if a string is a valid complete IP address
 */
const isValidIPAddress = (ip: string): boolean => {
  const segments = ip.split('.')
  if (segments.length !== 4) return false
  return segments.every(segment => isValidSegment(segment) && segment !== '')
}

/**
 * Checks if an IP is within a subnet range
 */
const isIPInNetwork = (ip: string, network: string, mask: string): boolean => {
  if (
    !isValidIPAddress(ip) ||
    !isValidIPAddress(network) ||
    !isValidIPAddress(mask)
  ) {
    return true // Skip validation if any input is invalid
  }

  const ipParts = ip.split('.').map(part => parseInt(part, 10))
  const networkParts = network.split('.').map(part => parseInt(part, 10))
  const maskParts = mask.split('.').map(part => parseInt(part, 10))

  // Check if IP is in network range by comparing masked values
  for (let i = 0; i < 4; i++) {
    const ipNetworkPart = ipParts[i] & maskParts[i]
    const networkPart = networkParts[i] & maskParts[i]
    if (ipNetworkPart !== networkPart) {
      return false
    }
  }

  return true
}

/**
 * A specialized text field for IPAM address management
 * - Validates IP addresses in a specific network range
 * - Automatically adds dots after every 3 digits
 * - Only allows valid IP address format (xxx.xxx.xxx.xxx)
 */
const IPAddressField: React.FC<IPAddressFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'IP Address',
  allowIncomplete = true,
  autoInsertDots = true,
  defaultNetwork,
  subnetMask,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidIPAddress(initialValue)
  )
  const [isInNetwork, setIsInNetwork] = useState<boolean>(true)
  const lastInputTypeWasDelete = useRef(false)

  // Validate initial value on mount
  useEffect(() => {
    if (initialValue) {
      const validIP = isValidIPAddress(initialValue)
      setIsValid(validIP)

      // Check if IP is in network range
      if (validIP && defaultNetwork && subnetMask) {
        setIsInNetwork(isIPInNetwork(initialValue, defaultNetwork, subnetMask))
      }
    }
  }, [initialValue, defaultNetwork, subnetMask])

  const formatIPAddress = useCallback(
    (input: string, wasDelete: boolean): string => {
      // Replace any character that's not a digit or dot
      let formatted = input.replace(/[^\d.]/g, '')

      // Remove consecutive dots
      formatted = formatted.replace(/\.{2,}/g, '.')

      // Remove dots at the beginning
      formatted = formatted.replace(/^\./, '')

      // Don't allow more than 3 dots
      const dots = formatted.match(/\./g)
      if (dots && dots.length > 3) {
        formatted = formatted.substring(0, formatted.lastIndexOf('.'))
      }

      // Make sure each segment is valid (0-255)
      const segments = formatted.split('.')

      // Format each non-empty segment to ensure it's within 0-255
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (segment !== '') {
          const num = parseInt(segment, 10)
          if (num > 255) {
            segments[i] = '255'
          }
        }
      }

      formatted = segments.join('.')

      // Auto-insert dots after 3 digits
      if (autoInsertDots && !wasDelete) {
        // Split by dots to get segments
        const segments = formatted.split('.')

        // Only process the last segment if it doesn't have a trailing dot
        // and we have less than 4 segments total
        if (segments.length < 4) {
          const lastSegment = segments[segments.length - 1]

          // If the last segment has 3 digits and doesn't end with a dot, add a dot
          if (lastSegment.length === 3 && segments.length < 4) {
            formatted = formatted + '.'
          }
        }
      }

      return formatted
    },
    [autoInsertDots]
  )

  const validateIPAddress = useCallback(
    (ip: string): boolean => {
      if (ip === '') return true

      // First check if it's a valid IP format
      let valid = false
      if (allowIncomplete) {
        // For incomplete IPs, check each segment is valid
        const segments = ip.split('.')
        valid = segments.every(segment => isValidSegment(segment))
      } else {
        // For complete IPs, check full validation
        valid = isValidIPAddress(ip)
      }

      // Then check if it's in the network range
      if (valid && defaultNetwork && subnetMask && isValidIPAddress(ip)) {
        const networkValid = isIPInNetwork(ip, defaultNetwork, subnetMask)
        setIsInNetwork(networkValid)
        return valid && networkValid
      }

      setIsInNetwork(true) // Reset network validation if not applicable
      return valid
    },
    [allowIncomplete, defaultNetwork, subnetMask]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      // Check if characters were deleted
      lastInputTypeWasDelete.current = rawValue.length < value.length

      const formattedValue = formatIPAddress(
        rawValue,
        lastInputTypeWasDelete.current
      )
      const valid = validateIPAddress(formattedValue)

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
    [onChange, formatIPAddress, validateIPAddress, value]
  )

  // Handle paste events to format them properly
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')

      // Format the pasted text without auto-inserting dots
      const formattedValue = formatIPAddress(pastedText, false)

      setValue(formattedValue)
      setIsValid(validateIPAddress(formattedValue))

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)
    },
    [formatIPAddress, onChange, validateIPAddress]
  )

  // Determine error message based on validation state
  const getErrorMessage = useCallback(() => {
    if (isValid && !isInNetwork) {
      return `IP address must be within the network ${defaultNetwork}/${subnetMask}`
    }
    if (!isValid) {
      return 'Please enter a valid IP address'
    }
    return undefined
  }, [isValid, isInNetwork, defaultNetwork, subnetMask])

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      label={label}
      inputMode="numeric"
      error={!isValid || !isInNetwork}
      helperText={getErrorMessage()}
      placeholder={
        autoInsertDots
          ? 'Just type numbers (e.g. 192168001001)'
          : 'xxx.xxx.xxx.xxx'
      }
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9.]*',
      }}
      {...rest}
    />
  )
}

export default IPAddressField

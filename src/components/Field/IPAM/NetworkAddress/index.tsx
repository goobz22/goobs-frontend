'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'

export interface NetworkAddressFieldProps
  extends Omit<TextFieldProps, 'onChange'> {
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
  /** CIDR prefix length (e.g., 24 for /24) */
  cidrPrefix?: number
  /** Check that the entered address is a valid network address */
  validateAsNetworkAddress?: boolean
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
 * Converts CIDR prefix to subnet mask (e.g., 24 -> 255.255.255.0)
 */
const cidrToMask = (cidr: number): string => {
  // Convert CIDR to binary string with 1's and 0's
  const binary = '1'.repeat(cidr) + '0'.repeat(32 - cidr)

  // Split into 4 octets and convert each to decimal
  const octets = [
    parseInt(binary.substring(0, 8), 2),
    parseInt(binary.substring(8, 16), 2),
    parseInt(binary.substring(16, 24), 2),
    parseInt(binary.substring(24, 32), 2),
  ]

  return octets.join('.')
}

/**
 * Converts subnet mask to CIDR notation (e.g., 255.255.255.0 -> 24)
 */
const maskToCidr = (mask: string): number => {
  const parts = mask.split('.').map(part => parseInt(part, 10))
  let cidr = 0
  for (const part of parts) {
    // Count bits in each octet
    cidr += (part >>> 0).toString(2).replace(/0/g, '').length
  }
  return cidr
}

/**
 * Calculates the valid subnet range based on network and mask
 */
const calculateNetworkRange = (
  network: string,
  mask: string
): { start: string; end: string } => {
  const networkParts = network.split('.').map(part => parseInt(part, 10))
  const maskParts = mask.split('.').map(part => parseInt(part, 10))

  // Network address (first address in range)
  const startParts = networkParts.map((part, i) => part & maskParts[i])

  // Broadcast address (last address in range)
  const endParts = startParts.map((part, i) => part | (~maskParts[i] & 255))

  return {
    start: startParts.join('.'),
    end: endParts.join('.'),
  }
}

/**
 * Checks if an IP address is a valid network address for a given CIDR prefix
 * Network address is the first address in a subnet where all host bits are 0
 */
const isValidNetworkAddress = (ip: string, cidrPrefix: number): boolean => {
  if (!isValidIPAddress(ip) || !cidrPrefix) return false

  // Convert IP to binary bits
  const ipParts = ip.split('.').map(part => parseInt(part, 10))

  // Convert the IP to a 32-bit number
  const ipNum =
    (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]

  // Get the host part of the IP (the bits after the prefix)
  // Create a mask for the host bits: (2^(32-prefix) - 1)
  const hostMask = (1 << (32 - cidrPrefix)) - 1

  // Check if all host bits are zero
  return (ipNum & hostMask) === 0
}

/**
 * Calculates a network address from any IP and a CIDR prefix
 */
const calculateNetworkAddress = (ip: string, cidrPrefix: number): string => {
  if (!isValidIPAddress(ip) || !cidrPrefix) return ip

  // Convert IP to array of integers
  const ipParts = ip.split('.').map(part => parseInt(part, 10))

  // Convert CIDR to subnet mask
  const mask = cidrToMask(cidrPrefix)
  const maskParts = mask.split('.').map(part => parseInt(part, 10))

  // Apply mask to IP to get network address
  const networkParts = ipParts.map((part, i) => part & maskParts[i])

  return networkParts.join('.')
}

/**
 * A specialized text field for network addresses
 * - Validates that the address is a valid network address (first address in a subnet)
 * - Provides visual feedback when the address is not a network address
 * - Optionally can automatically correct the address to the proper network address
 */
const NetworkAddressField: React.FC<NetworkAddressFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'Network Address',
  allowIncomplete = true,
  autoInsertDots = true,
  defaultNetwork,
  subnetMask,
  cidrPrefix,
  validateAsNetworkAddress = true,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidIPAddress(initialValue)
  )
  const [isInNetwork, setIsInNetwork] = useState<boolean>(true)
  const [isNetworkAddress, setIsNetworkAddress] = useState<boolean>(true)
  const lastInputTypeWasDelete = useRef(false)
  const [networkRange, setNetworkRange] = useState<{
    start: string
    end: string
    cidr: number
  } | null>(null)
  const [effectiveCidr, setEffectiveCidr] = useState<number | null>(null)

  // Determine the effective CIDR from props or calculate from subnet mask
  useEffect(() => {
    if (cidrPrefix) {
      setEffectiveCidr(cidrPrefix)
    } else if (subnetMask && isValidIPAddress(subnetMask)) {
      setEffectiveCidr(maskToCidr(subnetMask))
    } else {
      setEffectiveCidr(null)
    }
  }, [cidrPrefix, subnetMask])

  // Calculate network range on mount or when network/mask changes
  useEffect(() => {
    if (
      defaultNetwork &&
      subnetMask &&
      isValidIPAddress(defaultNetwork) &&
      isValidIPAddress(subnetMask)
    ) {
      const range = calculateNetworkRange(defaultNetwork, subnetMask)
      const cidr = maskToCidr(subnetMask)
      setNetworkRange({ ...range, cidr })
    } else {
      setNetworkRange(null)
    }
  }, [defaultNetwork, subnetMask])

  // Effect to validate if address is a valid network address
  useEffect(() => {
    if (
      !validateAsNetworkAddress ||
      !effectiveCidr ||
      !isValidIPAddress(value)
    ) {
      setIsNetworkAddress(true) // Skip validation
      return
    }

    const networkValid = isValidNetworkAddress(value, effectiveCidr)
    setIsNetworkAddress(networkValid)
  }, [value, effectiveCidr, validateAsNetworkAddress])

  // Validate initial value on mount
  useEffect(() => {
    if (initialValue) {
      const validIP = isValidIPAddress(initialValue)
      setIsValid(validIP)

      // Check if IP is in network range
      if (validIP && defaultNetwork && subnetMask) {
        setIsInNetwork(isIPInNetwork(initialValue, defaultNetwork, subnetMask))
      }

      // Check if it's a valid network address
      if (validIP && effectiveCidr) {
        setIsNetworkAddress(isValidNetworkAddress(initialValue, effectiveCidr))
      }
    }
  }, [initialValue, defaultNetwork, subnetMask, effectiveCidr])

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
      } else {
        setIsInNetwork(true) // Reset network validation if not applicable
      }

      // Check if it's a valid network address (if we have CIDR info)
      if (
        valid &&
        validateAsNetworkAddress &&
        effectiveCidr &&
        isValidIPAddress(ip)
      ) {
        const isNetwork = isValidNetworkAddress(ip, effectiveCidr)
        setIsNetworkAddress(isNetwork)
      } else {
        setIsNetworkAddress(true) // Reset network address validation
      }

      return valid
    },
    [
      allowIncomplete,
      defaultNetwork,
      subnetMask,
      effectiveCidr,
      validateAsNetworkAddress,
    ]
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

  // Function to auto-correct the address to a valid network address
  const autoCorrectToNetworkAddress = useCallback(() => {
    if (!isValidIPAddress(value) || !effectiveCidr) return

    const networkAddress = calculateNetworkAddress(value, effectiveCidr)
    setValue(networkAddress)
    setIsNetworkAddress(true)

    // Create a synthetic change event
    const syntheticEvent = {
      target: {
        value: networkAddress,
      },
    } as React.ChangeEvent<HTMLInputElement>

    onChange?.(syntheticEvent)
  }, [value, effectiveCidr, onChange])

  // Determine error message based on validation state
  const getErrorMessage = useCallback(() => {
    if (!isValid) {
      return 'Please enter a valid IP address'
    }
    if (isValid && !isInNetwork && networkRange) {
      return `IP must be within the range ${networkRange.start} - ${networkRange.end}`
    }
    if (isValid && isInNetwork && !isNetworkAddress && effectiveCidr) {
      const correctNetworkAddress = calculateNetworkAddress(
        value,
        effectiveCidr
      )
      return `This is not a valid network address. The network address should be ${correctNetworkAddress}.`
    }
    return undefined
  }, [
    isValid,
    isInNetwork,
    networkRange,
    isNetworkAddress,
    value,
    effectiveCidr,
  ])

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      label={label}
      inputMode="numeric"
      error={!isValid || !isInNetwork || !isNetworkAddress}
      helperText={getErrorMessage()}
      placeholder={
        autoInsertDots
          ? 'Network address (e.g. 192.168.1.0)'
          : 'xxx.xxx.xxx.xxx'
      }
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9.]*',
      }}
      endAdornment={
        !isNetworkAddress && effectiveCidr ? (
          <button
            onClick={autoCorrectToNetworkAddress}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#1976d2',
              fontSize: '0.75rem',
              padding: '0 8px',
              textDecoration: 'underline',
            }}
          >
            Fix
          </button>
        ) : undefined
      }
      {...rest}
    />
  )
}

export default NetworkAddressField

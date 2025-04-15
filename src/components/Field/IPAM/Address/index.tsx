'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'
import { Box, Typography } from '@mui/material'

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
  /** Subnet address for gateway validation */
  subnetAddress?: string
  /** Subnet CIDR for gateway validation */
  subnetCIDR?: number
  /** Whether this field is being used as a gateway input */
  isGateway?: boolean
  /** Whether this field is part of an IP range (start-end) input */
  isRange?: boolean
  /** If this is the start IP field of a range */
  isStartIP?: boolean
  /** If this is the end IP field of a range */
  isEndIP?: boolean
  /** End IP value for validation when this is a start IP */
  endIPValue?: string
  /** Start IP value for validation when this is an end IP */
  startIPValue?: string
  /** Render as a range input (with start and end fields side by side) */
  renderAsRange?: boolean
  /** End IP initial value when rendered as range */
  endIP?: string
  /** Callback for end IP changes when rendered as range */
  onEndIPChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Callback for end IP blur events when rendered as range */
  onEndIPBlur?: () => void
  /** Error state for end IP when rendered as range */
  errorEnd?: boolean
  /** Helper text for end IP when rendered as range */
  helperTextEnd?: string
  /** Whether to show available IP range info */
  showAvailableRange?: boolean
  /** Optional gateway IP to exclude from available range */
  gatewayIP?: string
  /** Custom message for available range */
  availableRangeMessage?: string
}

/**
 * Validates if a string is a valid IP address segment (0-255)
 */
const isValidSegment = (segment: string): boolean => {
  if (segment === '') return true
  const num = parseInt(segment, 10)
  // Segment must be 0-255 and not have more than 3 digits
  return (
    !isNaN(num) &&
    num >= 0 &&
    num <= 255 &&
    segment === num.toString() &&
    segment.length <= 3
  )
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
 * Converts IP address to a numeric value for comparison
 */
const ipToNumber = (ip: string): number => {
  if (!isValidIPAddress(ip)) return -1
  const parts = ip.split('.').map(Number)
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

/**
 * Checks if start IP is less than or equal to end IP
 */
const isValidIPRange = (startIP: string, endIP: string): boolean => {
  if (!isValidIPAddress(startIP) || !isValidIPAddress(endIP)) return true // Skip validation if either IP is invalid
  return ipToNumber(startIP) <= ipToNumber(endIP)
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
 * Checks if an IP is within a subnet range using CIDR notation
 */
const isIPInSubnetCIDR = (
  ip: string,
  subnetAddr: string,
  cidr: number
): boolean => {
  if (!isValidIPAddress(ip) || !isValidIPAddress(subnetAddr) || !cidr) {
    return false // Return false if validation should fail
  }

  // Convert CIDR to subnet mask
  const mask = cidrToMask(cidr)

  // Get the subnet range
  const range = calculateNetworkRange(subnetAddr, mask)

  // Check if IP is numerically within the range
  const ipNum = ipToNumber(ip)
  const startNum = ipToNumber(range.start)
  const endNum = ipToNumber(range.end)

  // The IP is in the subnet range if it's between start and end
  return ipNum >= startNum && ipNum <= endNum
}

/**
 * Checks if an IP is within the usable range (excluding network and broadcast)
 */
const isIPInUsableRange = (
  ip: string,
  subnetAddr: string,
  cidr: number
): boolean => {
  if (!isValidIPAddress(ip) || !isValidIPAddress(subnetAddr) || !cidr) {
    return true // Skip validation if any input is invalid
  }

  // Calculate the usable range
  const usableRange = calculateUsableIPRange(subnetAddr, cidr)
  if (!usableRange) return true // Skip if we can't calculate the range

  // Check if IP is within the usable range
  const ipNum = ipToNumber(ip)
  const startNum = ipToNumber(usableRange.start)
  const endNum = ipToNumber(usableRange.end)

  return ipNum >= startNum && ipNum <= endNum
}

/**
 * Converts CIDR notation to subnet mask (e.g., /24 -> 255.255.255.0)
 */
const cidrToMask = (cidr: number): string => {
  // Ensure CIDR is between 0 and 32
  const safeCidr = Math.max(0, Math.min(32, cidr))

  // Calculate the bitmask as a 32-bit number
  const bitmask = safeCidr === 0 ? 0 : ~0 << (32 - safeCidr)

  // Convert to dotted-decimal format
  return [
    (bitmask >>> 24) & 255,
    (bitmask >>> 16) & 255,
    (bitmask >>> 8) & 255,
    bitmask & 255,
  ].join('.')
}

/**
 * Checks if a gateway IP is within the subnet range and is a usable host address
 * (not the network address or broadcast address)
 */
const isGatewayInSubnet = (
  gateway: string,
  subnetAddress: string,
  subnetCIDR: number
): boolean => {
  if (
    !isValidIPAddress(gateway) ||
    !isValidIPAddress(subnetAddress) ||
    !subnetCIDR
  ) {
    console.log('Gateway validation: Skipping - invalid inputs', {
      gateway,
      subnetAddress,
      subnetCIDR,
    })
    return true // Skip validation if any input is invalid
  }

  console.log('Gateway validation: Checking if gateway is in subnet', {
    gateway,
    subnetAddress,
    subnetCIDR,
  })

  // Convert subnet CIDR to subnet mask for IP range calculations
  const subnetMask = cidrToMask(subnetCIDR)
  console.log('Gateway validation: Converted subnet mask', {
    subnetCIDR,
    subnetMask,
  })

  // Calculate subnet network address and broadcast address
  const range = calculateNetworkRange(subnetAddress, subnetMask)
  console.log('Gateway validation: Subnet range', range)

  // Compare IP addresses numerically by converting to numbers
  const gatewayNum = ipToNumber(gateway)
  const startNum = ipToNumber(range.start)
  const endNum = ipToNumber(range.end)

  // First check: Is gateway within subnet range at all?
  const inRange = gatewayNum >= startNum && gatewayNum <= endNum
  console.log('Gateway validation: IP in range check', {
    gateway,
    gatewayNum,
    startNum,
    endNum,
    inRange,
  })

  if (!inRange) {
    console.log('Gateway validation FAILED: Gateway outside subnet range')
    return false
  }

  // Second check: Is gateway not the network or broadcast address?
  const isNetworkAddress = gateway === range.start
  const isBroadcastAddress = gateway === range.end

  console.log('Gateway validation: Is gateway usable host address?', {
    isNetworkAddress,
    isBroadcastAddress,
    gateway,
    networkAddress: range.start,
    broadcastAddress: range.end,
  })

  if (isNetworkAddress || isBroadcastAddress) {
    console.log(
      'Gateway validation FAILED: Gateway is network or broadcast address'
    )
    return false
  }

  console.log('Gateway validation PASSED: Gateway is valid within subnet')
  return true
}

/**
 * Converts subnet mask to CIDR notation (e.g., 255.255.255.0 -> /24)
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
 * Calculates the usable IP range in a subnet
 * Excludes network address, broadcast address, and gateway if provided
 */
const calculateUsableIPRange = (
  subnetAddress: string,
  subnetCIDR: number,
  gatewayIP?: string
): { start: string; end: string } | null => {
  if (!isValidIPAddress(subnetAddress) || !subnetCIDR) {
    return null
  }

  // Convert subnet CIDR to subnet mask
  const subnetMask = cidrToMask(subnetCIDR)

  // Calculate subnet range (network and broadcast addresses)
  const range = calculateNetworkRange(subnetAddress, subnetMask)

  // Convert to numeric values
  const networkNum = ipToNumber(range.start)
  const broadcastNum = ipToNumber(range.end)

  // Usable range starts from network+1 and ends at broadcast-1
  let usableStart = networkNum + 1
  let usableEnd = broadcastNum - 1

  // If gateway is provided and valid, make sure it's excluded from the range
  // For simplicity, we don't modify the range bounds but just note that gateway is excluded
  if (gatewayIP && isValidIPAddress(gatewayIP)) {
    const gatewayNum = ipToNumber(gatewayIP)
    // Check if gateway is within the usable range
    if (gatewayNum >= usableStart && gatewayNum <= usableEnd) {
      // Gateway is within the usable range, consider it excluded
      console.log(
        `Gateway IP ${gatewayIP} is in the usable range and will be excluded`
      )
    }
  }

  // Convert back to IP strings
  const firstUsable = numToIP(usableStart)
  const lastUsable = numToIP(usableEnd)

  return {
    start: firstUsable,
    end: lastUsable,
  }
}

/**
 * Converts a numeric IP representation back to string format
 */
const numToIP = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.')
}

/**
 * A specialized text field for IPAM address management
 * - Validates IP addresses in a specific network range
 * - Automatically adds dots after every 3 digits
 * - Only allows valid IP address format (xxx.xxx.xxx.xxx)
 * - For gateway inputs, validates that the IP is within the specified subnet
 * - Can be rendered as a range input with start and end IPs side by side
 */
const IPAddressField: React.FC<IPAddressFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'IP Address',
  allowIncomplete = true,
  autoInsertDots = true,
  defaultNetwork,
  subnetMask,
  subnetAddress,
  subnetCIDR,
  isGateway = false,
  isRange = false,
  isStartIP = false,
  isEndIP = false,
  startIPValue,
  endIPValue,
  renderAsRange = false,
  endIP = '',
  onEndIPChange,
  onEndIPBlur,
  errorEnd = false,
  helperTextEnd,
  showAvailableRange = false,
  gatewayIP,
  availableRangeMessage,
  ...rest
}) => {
  // Always declare all hooks at the top level
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidIPAddress(initialValue)
  )
  const [isInNetwork, setIsInNetwork] = useState<boolean>(true)
  const [isInSubnet, setIsInSubnet] = useState<boolean>(true)
  const [isValidRange, setIsValidRange] = useState<boolean>(true)
  const lastInputTypeWasDelete = useRef(false)
  const [networkRange, setNetworkRange] = useState<{
    start: string
    end: string
    cidr: number
  } | null>(null)

  // Store references to prevent infinite loops
  const valueRef = useRef(value)
  const subnetAddressRef = useRef(subnetAddress)
  const subnetCIDRRef = useRef(subnetCIDR)
  const startIPValueRef = useRef(startIPValue)
  const endIPValueRef = useRef(endIPValue)

  // Calculate if range is valid for the renderAsRange view
  const isRangeValid =
    !isValidIPAddress(initialValue) ||
    !isValidIPAddress(endIP) ||
    isValidIPRange(initialValue, endIP)

  // Custom error text for range validation in the renderAsRange view
  const startHelperText = !isRangeValid
    ? 'Start IP must be less than or equal to End IP'
    : rest.helperText

  // Update refs when props change
  useEffect(() => {
    valueRef.current = value
    subnetAddressRef.current = subnetAddress
    subnetCIDRRef.current = subnetCIDR
    startIPValueRef.current = startIPValue
    endIPValueRef.current = endIPValue
  }, [value, subnetAddress, subnetCIDR, startIPValue, endIPValue])

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

  // Validate initial value once on mount only
  useEffect(() => {
    const validateInitialValue = () => {
      if (initialValue) {
        const validIP = isValidIPAddress(initialValue)
        setIsValid(validIP)

        // Check if IP is in network range
        if (validIP && defaultNetwork && subnetMask) {
          const inNetwork = isIPInNetwork(
            initialValue,
            defaultNetwork,
            subnetMask
          )
          setIsInNetwork(inNetwork)
        }

        // Check if IP is in subnet range when subnet info is provided
        if (validIP && subnetAddress && subnetCIDR !== undefined) {
          const inSubnet = isIPInSubnetCIDR(
            initialValue,
            subnetAddress,
            subnetCIDR
          )
          setIsInNetwork(inSubnet) // Use the subnet validation for network validation
        }

        // Check if gateway is in subnet range
        if (isGateway && validIP && subnetAddress && subnetCIDR !== undefined) {
          const inSubnet = isGatewayInSubnet(
            initialValue,
            subnetAddress,
            subnetCIDR
          )
          setIsInSubnet(inSubnet)
        }

        // For range validation
        if (isRange) {
          if (
            isStartIP &&
            endIPValue &&
            validIP &&
            isValidIPAddress(endIPValue)
          ) {
            setIsValidRange(isValidIPRange(initialValue, endIPValue))
          } else if (
            isEndIP &&
            startIPValue &&
            validIP &&
            isValidIPAddress(startIPValue)
          ) {
            setIsValidRange(isValidIPRange(startIPValue, initialValue))
          }
        }
      }
    }

    validateInitialValue()
    // Only run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle gateway subnet validation separately to prevent cyclic dependencies
  useEffect(() => {
    // Only validate complete, valid IPs that have changed
    if (
      isGateway &&
      isValidIPAddress(value) &&
      subnetAddress &&
      subnetCIDR !== undefined &&
      (value !== valueRef.current ||
        subnetAddress !== subnetAddressRef.current ||
        subnetCIDR !== subnetCIDRRef.current)
    ) {
      const subnetValid = isGatewayInSubnet(value, subnetAddress, subnetCIDR)
      // Avoid setting state if the result hasn't changed
      if (subnetValid !== isInSubnet) {
        setIsInSubnet(subnetValid)
      }
    }
  }, [isGateway, value, subnetAddress, subnetCIDR, isInSubnet])

  // Handle IP range validation
  useEffect(() => {
    if (isRange && isValidIPAddress(value)) {
      // For start IP field
      if (isStartIP && endIPValue && isValidIPAddress(endIPValue)) {
        // 1. Check numeric order - start <= end
        const rangeOrderValid = isValidIPRange(value, endIPValue)

        // 2. Check both IPs are in subnet (if provided)
        let bothInSubnet = true
        if (subnetAddress && subnetCIDR !== undefined) {
          const startInSubnet = isIPInSubnetCIDR(
            value,
            subnetAddress,
            subnetCIDR
          )
          const endInSubnet = isIPInSubnetCIDR(
            endIPValue,
            subnetAddress,
            subnetCIDR
          )

          // Also check usable range
          const startInUsable = isIPInUsableRange(
            value,
            subnetAddress,
            subnetCIDR
          )
          const endInUsable = isIPInUsableRange(
            endIPValue,
            subnetAddress,
            subnetCIDR
          )

          bothInSubnet =
            startInSubnet && endInSubnet && startInUsable && endInUsable
        }

        // Both conditions must be true
        const rangeValid = rangeOrderValid && bothInSubnet

        if (rangeValid !== isValidRange) {
          setIsValidRange(rangeValid)
        }
      }
      // For end IP field
      else if (isEndIP && startIPValue && isValidIPAddress(startIPValue)) {
        // 1. Check numeric order - start <= end
        const rangeOrderValid = isValidIPRange(startIPValue, value)

        // 2. Check both IPs are in subnet (if provided)
        let bothInSubnet = true
        if (subnetAddress && subnetCIDR !== undefined) {
          const startInSubnet = isIPInSubnetCIDR(
            startIPValue,
            subnetAddress,
            subnetCIDR
          )
          const endInSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)

          // Also check usable range
          const startInUsable = isIPInUsableRange(
            startIPValue,
            subnetAddress,
            subnetCIDR
          )
          const endInUsable = isIPInUsableRange(
            value,
            subnetAddress,
            subnetCIDR
          )

          bothInSubnet =
            startInSubnet && endInSubnet && startInUsable && endInUsable
        }

        // Both conditions must be true
        const rangeValid = rangeOrderValid && bothInSubnet

        if (rangeValid !== isValidRange) {
          setIsValidRange(rangeValid)
        }
      }
    }
  }, [
    isRange,
    isStartIP,
    isEndIP,
    value,
    startIPValue,
    endIPValue,
    isValidRange,
    subnetAddress,
    subnetCIDR,
  ])

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

      // Format each non-empty segment to ensure it's within 0-255 and not more than 3 digits
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (segment !== '') {
          // Limit to 3 digits maximum per segment
          if (segment.length > 3) {
            segments[i] = segment.substring(0, 3)
          }

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

      // Split by dots to check each segment individually
      const segments = ip.split('.')

      if (allowIncomplete) {
        // For incomplete IPs, check each segment is valid
        valid = segments.every(segment => isValidSegment(segment))

        // If all segments are present, make sure it's a complete IP
        if (segments.length === 4 && segments[3] !== '') {
          valid = isValidIPAddress(ip)
        }
      } else {
        // For complete IPs, check full validation
        valid = isValidIPAddress(ip)
      }

      // Don't do subnet validation if the IP is incomplete
      if (!isValidIPAddress(ip)) {
        setIsInNetwork(true)
        return valid
      }

      // Always check subnet constraints for complete IPs
      if (subnetAddress && subnetCIDR !== undefined) {
        // Check if IP is in the subnet range
        const inSubnet = isIPInSubnetCIDR(ip, subnetAddress, subnetCIDR)

        // Check if IP is in the usable range (excludes network and broadcast addresses)
        const inUsableRange = isIPInUsableRange(ip, subnetAddress, subnetCIDR)

        // We require the IP to be within both the subnet range and usable range
        const isValidIPInSubnet = inSubnet && (isGateway || inUsableRange)

        // Update the validation state
        setIsInNetwork(isValidIPInSubnet)

        // If the IP is not valid within the subnet context, return false
        if (!isValidIPInSubnet) {
          return false
        }
      } else if (defaultNetwork && subnetMask) {
        // Legacy check for default network and subnet mask
        const networkValid = isIPInNetwork(ip, defaultNetwork, subnetMask)
        setIsInNetwork(networkValid)
        if (!networkValid) {
          return false
        }
      }

      // Range validation is handled separately in useEffect
      return valid
    },
    [
      allowIncomplete,
      defaultNetwork,
      subnetMask,
      subnetAddress,
      subnetCIDR,
      isGateway,
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

      // Check immediately if this is a complete IP address that needs validation
      const isCompleteIP = isValidIPAddress(formattedValue)

      // Validate the basic IP format
      const valid = validateIPAddress(formattedValue)
      setValue(formattedValue)
      setIsValid(valid)

      // Immediate validation for complete IPs when subnet info is available
      if (isCompleteIP && subnetAddress && subnetCIDR) {
        // Check if IP is in subnet range
        const inSubnet = isIPInSubnetCIDR(
          formattedValue,
          subnetAddress,
          subnetCIDR
        )

        // Check if IP is in usable range (for non-gateway IPs)
        const inUsable = isGateway
          ? true
          : isIPInUsableRange(formattedValue, subnetAddress, subnetCIDR)

        // Set subnet validation state
        setIsInNetwork(inSubnet && inUsable)

        // For gateway, also set specific gateway validation
        if (isGateway) {
          const mask = cidrToMask(subnetCIDR)
          const range = calculateNetworkRange(subnetAddress, mask)
          // Gateway can't be network or broadcast address
          const isNetworkAddress = formattedValue === range.start
          const isBroadcastAddress = formattedValue === range.end
          setIsInSubnet(inSubnet && !isNetworkAddress && !isBroadcastAddress)
        }

        // For ranges, check order too
        if (isRange) {
          let rangeOrderValid = true
          if (isStartIP && endIPValue && isValidIPAddress(endIPValue)) {
            rangeOrderValid = isValidIPRange(formattedValue, endIPValue)
          } else if (
            isEndIP &&
            startIPValue &&
            isValidIPAddress(startIPValue)
          ) {
            rangeOrderValid = isValidIPRange(startIPValue, formattedValue)
          }

          setIsValidRange(rangeOrderValid && inSubnet && inUsable)
        }
      }

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
    [
      onChange,
      formatIPAddress,
      validateIPAddress,
      value,
      isGateway,
      isRange,
      isStartIP,
      isEndIP,
      subnetAddress,
      subnetCIDR,
      endIPValue,
      startIPValue,
    ]
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
    // Check if the IP is complete and valid in format
    const isCompleteIP = isValidIPAddress(value)

    if (!isValid) {
      return 'Please enter a valid IP address'
    }

    // IP not in subnet range - only show for complete IPs
    if (isCompleteIP && subnetAddress && subnetCIDR !== undefined) {
      // Check in subnet
      const inSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)
      if (!inSubnet) {
        // Not in subnet at all
        const range = calculateNetworkRange(
          subnetAddress,
          cidrToMask(subnetCIDR)
        )
        return `IP must be within the subnet range ${range.start} - ${range.end} (${subnetAddress}/${subnetCIDR})`
      }

      // Check in usable range - for non-gateway IPs
      if (!isGateway) {
        const inUsableRange = isIPInUsableRange(
          value,
          subnetAddress,
          subnetCIDR
        )
        if (!inUsableRange) {
          // In subnet but not in usable range
          const usableRange = calculateUsableIPRange(subnetAddress, subnetCIDR)
          if (usableRange) {
            return `IP must be within the usable range ${usableRange.start} - ${usableRange.end}`
          }
        }
      }
    } else if (isCompleteIP && !isInNetwork && networkRange) {
      // Legacy network range error
      return `IP must be within the range ${networkRange.start} - ${networkRange.end} (${defaultNetwork}/${networkRange.cidr})`
    }

    // Range validation errors - show immediately when typing if possible
    if (isRange && isCompleteIP) {
      if (isStartIP && endIPValue && isValidIPAddress(endIPValue)) {
        // Check if start IP is outside subnet range
        if (subnetAddress && subnetCIDR) {
          const inSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)
          if (!inSubnet) {
            const range = calculateNetworkRange(
              subnetAddress,
              cidrToMask(subnetCIDR)
            )
            return `Start IP must be within the subnet range ${range.start} - ${range.end}`
          }

          const inUsable = isIPInUsableRange(value, subnetAddress, subnetCIDR)
          if (!inUsable) {
            const usableRange = calculateUsableIPRange(
              subnetAddress,
              subnetCIDR
            )
            if (usableRange) {
              return `Start IP must be within the usable range ${usableRange.start} - ${usableRange.end}`
            }
          }
        }

        // Check order even if in range
        if (!isValidIPRange(value, endIPValue)) {
          return 'Start IP must be less than or equal to End IP'
        }
      }

      if (isEndIP && startIPValue && isValidIPAddress(startIPValue)) {
        // Check if end IP is outside subnet range
        if (subnetAddress && subnetCIDR) {
          const inSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)
          if (!inSubnet) {
            const range = calculateNetworkRange(
              subnetAddress,
              cidrToMask(subnetCIDR)
            )
            return `End IP must be within the subnet range ${range.start} - ${range.end}`
          }

          const inUsable = isIPInUsableRange(value, subnetAddress, subnetCIDR)
          if (!inUsable) {
            const usableRange = calculateUsableIPRange(
              subnetAddress,
              subnetCIDR
            )
            if (usableRange) {
              return `End IP must be within the usable range ${usableRange.start} - ${usableRange.end}`
            }
          }
        }

        // Check order even if in range
        if (!isValidIPRange(startIPValue, value)) {
          return 'End IP must be greater than or equal to Start IP'
        }
      }
    }

    // Gateway validation errors - only show for complete IPs
    if (isGateway && isCompleteIP && subnetAddress && subnetCIDR) {
      // Check if IP is within subnet range
      const inSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)
      if (!inSubnet) {
        const range = calculateNetworkRange(
          subnetAddress,
          cidrToMask(subnetCIDR)
        )
        return `Gateway must be within the subnet range ${range.start} - ${range.end}`
      }

      // Check if it's the network or broadcast address
      const range = calculateNetworkRange(subnetAddress, cidrToMask(subnetCIDR))
      if (value === range.start) {
        return `Gateway cannot be the network address (${range.start})`
      } else if (value === range.end) {
        return `Gateway cannot be the broadcast address (${range.end})`
      }
    }

    return undefined
  }, [
    isValid,
    isInNetwork,
    networkRange,
    defaultNetwork,
    subnetAddress,
    subnetCIDR,
    isGateway,
    isRange,
    isStartIP,
    isEndIP,
    value,
    startIPValue,
    endIPValue,
  ])

  // If rendering as a range, handle side-by-side display of start and end IP fields
  if (renderAsRange) {
    // Get the usable IP range if we have subnet info and showAvailableRange is true
    let usableRangeInfo = null
    if (showAvailableRange && subnetAddress && subnetCIDR !== undefined) {
      const usableRange = calculateUsableIPRange(
        subnetAddress,
        subnetCIDR,
        gatewayIP
      )
      if (usableRange) {
        // Format the usable range information
        const rangeText =
          availableRangeMessage ||
          `Available IPs: ${usableRange.start} to ${usableRange.end} (excluding gateway)`
        usableRangeInfo = (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: 'block',
              mt: -0.5,
              mb: 1,
              fontStyle: 'italic',
            }}
          >
            {rangeText}
          </Typography>
        )
      }
    }

    return (
      <Box sx={{ width: '100%', ...rest.style }}>
        {usableRangeInfo}
        <Box
          sx={{ display: 'flex', width: '100%', gap: 2, alignItems: 'center' }}
        >
          <Box sx={{ flex: 1 }}>
            <IPAddressField
              label=""
              initialValue={initialValue}
              onChange={onChange}
              onBlur={rest.onBlur}
              error={rest.error || !isRangeValid}
              helperText={startHelperText}
              required={rest.required}
              style={{ width: '100%' }}
              disabled={rest.disabled}
              subnetAddress={subnetAddress}
              subnetCIDR={subnetCIDR}
              placeholder={rest.placeholder || 'e.g., 192.168.1.100'}
              isRange={true}
              isStartIP={true}
              endIPValue={endIP}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 2,
            }}
          >
            <Typography variant="body1" sx={{ marginTop: '15px' }}>
              -
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <IPAddressField
              label=""
              initialValue={endIP}
              onChange={onEndIPChange}
              onBlur={onEndIPBlur}
              error={errorEnd || !isRangeValid}
              helperText={helperTextEnd}
              required={rest.required}
              style={{ width: '100%' }}
              disabled={rest.disabled}
              subnetAddress={subnetAddress}
              subnetCIDR={subnetCIDR}
              placeholder={rest.placeholder || 'e.g., 192.168.1.200'}
              isRange={true}
              isEndIP={true}
              startIPValue={initialValue}
            />
          </Box>
        </Box>
      </Box>
    )
  }

  // Normal single IP address field implementation
  // Get the usable IP range if we have subnet info and showAvailableRange is true
  let usableRangeInfo = null
  if (showAvailableRange && subnetAddress && subnetCIDR !== undefined) {
    const usableRange = calculateUsableIPRange(
      subnetAddress,
      subnetCIDR,
      gatewayIP
    )
    if (usableRange) {
      // Format the usable range information
      const rangeText =
        availableRangeMessage ||
        `Available IPs: ${usableRange.start} to ${usableRange.end} (excluding gateway)`
      usableRangeInfo = (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            display: 'block',
            mt: -0.5,
            mb: 1,
            fontStyle: 'italic',
          }}
        >
          {rangeText}
        </Typography>
      )
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      {usableRangeInfo}
      <TextField
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        label={isRange ? (isStartIP ? 'Start' : 'End') : label}
        inputMode="numeric"
        error={Boolean(
          // Basic IP format validation
          (!isValid && value !== '') ||
            // Validation when a complete IP is entered
            (isValidIPAddress(value) &&
              // Check if IP is outside subnet range
              ((subnetAddress &&
                subnetCIDR &&
                !isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)) ||
                // Check if non-gateway IP is outside usable range (exclude network/broadcast)
                (!isGateway &&
                  subnetAddress &&
                  subnetCIDR &&
                  !isIPInUsableRange(value, subnetAddress, subnetCIDR)) ||
                // Gateway-specific validation (can't be network/broadcast)
                (isGateway &&
                  subnetAddress &&
                  subnetCIDR &&
                  (() => {
                    const mask = cidrToMask(subnetCIDR)
                    const range = calculateNetworkRange(subnetAddress, mask)
                    return value === range.start || value === range.end
                  })()) ||
                // Range order validation
                (isRange &&
                  ((isStartIP &&
                    endIPValue &&
                    isValidIPAddress(endIPValue) &&
                    !isValidIPRange(value, endIPValue)) ||
                    (isEndIP &&
                      startIPValue &&
                      isValidIPAddress(startIPValue) &&
                      !isValidIPRange(startIPValue, value))))))
        )}
        helperText={getErrorMessage()}
        placeholder={
          rest.placeholder ||
          (autoInsertDots
            ? 'Just type numbers (e.g. 192168001001)'
            : 'xxx.xxx.xxx.xxx')
        }
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9.]*',
          maxLength: 15, // max length of an IP address (xxx.xxx.xxx.xxx)
        }}
        {...rest}
      />
    </Box>
  )
}

export default IPAddressField

'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TextField, { TextFieldProps } from '../../../Field/Text'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { styled } from '@mui/material/styles'
import NetworkAddressField from '../NetworkAddress'

export interface InternalIncrementNumberFieldProps
  extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => parseInt(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  min?: number
  max?: number
  /** Initial delay before continuous increment/decrement starts (ms) */
  initialDelay?: number
  /** Interval between continuous increment/decrement actions (ms) */
  repeatInterval?: number
  /**
   * Variant for mask type: 'subnet' (default, /16-/32) or 'supernet' (/8-/23)
   */
  maskType?: 'subnet' | 'supernet'
  style?: React.CSSProperties
  disabled?: boolean
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  width: '16px',
  height: '16px',
  minWidth: '16px',
  minHeight: '16px',
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}))

const ArrowIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '16px',
  width: '16px',
  lineHeight: 1,
})

const SubnetInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}))

interface SubnetData {
  mask: string
  hosts: string
  usableHosts: string
}

const calculateSubnetInfo = (cidr: number): SubnetData => {
  // Calculate subnet mask
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')

  // Calculate total hosts and usable hosts
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)

  return {
    mask,
    hosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

/**
 * A controlled numeric field that allows digits with increment/decrement buttons
 * in the right slot and optionally enforces min/max constraints.
 * Holding down the buttons will continuously increment/decrement the value.
 */
const InternalIncrementNumberField: React.FC<
  InternalIncrementNumberFieldProps
> = ({
  initialValue = '16',
  onChange,
  label = 'Subnet Mask',
  initialDelay = 500,
  repeatInterval = 100,
  min,
  max,
  maskType = 'subnet', // default to subnet for backward compatibility
  style, // allow style prop to be forwarded
  disabled,
  ...rest
}) => {
  // Determine min/max based on maskType if not explicitly set
  const effectiveMin =
    typeof min === 'number' ? min : maskType === 'supernet' ? 8 : 16
  const effectiveMax =
    typeof max === 'number' ? max : maskType === 'supernet' ? 23 : 32

  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue)
    if (isNaN(initialNum)) return effectiveMin.toString()
    return Math.min(Math.max(initialNum, effectiveMin), effectiveMax).toString()
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const subnetInfo = calculateSubnetInfo(parseInt(currentValue) || effectiveMin)

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) {
      clearTimeout(initialTimerRef.current)
      initialTimerRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleIncrement = useCallback(() => {
    // Schedule state update after render cycle
    setTimeout(() => {
      setCurrentValue(prev => {
        const num = parseInt(prev)
        if (isNaN(num)) {
          return effectiveMin.toString()
        }
        const newValue = Math.min(effectiveMax, num + 1)
        const newValueStr = newValue.toString()
        if (onChange) {
          onChange(newValue)
        }
        return newValueStr
      })
    }, 0)
  }, [onChange, effectiveMax, effectiveMin])

  const handleDecrement = useCallback(() => {
    // Schedule state update after render cycle
    setTimeout(() => {
      setCurrentValue(prev => {
        const num = parseInt(prev)
        if (isNaN(num)) {
          return effectiveMin.toString()
        }
        const newValue = Math.max(effectiveMin, num - 1)
        const newValueStr = newValue.toString()
        if (onChange) {
          onChange(newValue)
        }
        return newValueStr
      })
    }, 0)
  }, [onChange, effectiveMin])

  const handleIncrementMouseDown = useCallback(() => {
    handleIncrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleIncrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleIncrement, initialDelay, repeatInterval, clearTimers])

  const handleDecrementMouseDown = useCallback(() => {
    handleDecrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleDecrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleDecrement, initialDelay, repeatInterval, clearTimers])

  // Clean up event listeners when component unmounts
  React.useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value.replace(/[^0-9]/g, '')

      // Schedule state update after render cycle
      setTimeout(() => {
        if (newValue === '') {
          setCurrentValue(effectiveMin.toString())
          onChange?.(event)
          return
        }

        const numValue = parseInt(newValue, 10)

        if (isNaN(numValue) || numValue < effectiveMin) {
          setCurrentValue(effectiveMin.toString())
        } else if (numValue > effectiveMax) {
          setCurrentValue(effectiveMax.toString())
        } else {
          setCurrentValue(newValue)
        }

        onChange?.(event)
      }, 0)
    },
    [onChange, effectiveMin, effectiveMax]
  )

  return (
    <Box style={style}>
      <TextField
        value={subnetInfo.mask}
        onChange={handleChange}
        label={label}
        type="text"
        inputMode="numeric"
        variant="outlined"
        style={style}
        disabled={disabled}
        endAdornment={
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              marginRight: '-4px',
              height: '32px',
              justifyContent: 'center',
            }}
          >
            <StyledIconButton
              size="small"
              onMouseDown={handleIncrementMouseDown}
              edge="end"
              aria-label="increment"
              sx={{ marginBottom: '-2px' }}
              disabled={disabled}
            >
              <ArrowIcon>
                <ArrowDropUpIcon fontSize="small" sx={{ fontSize: '18px' }} />
              </ArrowIcon>
            </StyledIconButton>
            <StyledIconButton
              size="small"
              onMouseDown={handleDecrementMouseDown}
              edge="end"
              aria-label="decrement"
              disabled={disabled}
            >
              <ArrowIcon>
                <ArrowDropDownIcon fontSize="small" sx={{ fontSize: '18px' }} />
              </ArrowIcon>
            </StyledIconButton>
          </Box>
        }
        {...rest}
      />
    </Box>
  )
}

// New interface for subnet field value
export interface SubnetFieldValue {
  address: string
  mask: number
}

export interface SubnetFieldProps {
  value: SubnetFieldValue
  onChange: (value: SubnetFieldValue) => void
  label?: string
  required?: boolean
  min?: number
  max?: number
  maskType?: 'subnet' | 'supernet'
  style?: React.CSSProperties
  // Add validation properties for checking if subnet is within supernet
  supernetAddress?: string
  supernetMask?: string
  // Add disabled prop
  disabled?: boolean
}

// Helper function to convert CIDR to subnet mask
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

// Helper function to convert subnet mask to CIDR notation
const maskToCidr = (mask: string): number => {
  if (!mask) return 0
  const parts = mask.split('.').map(part => parseInt(part, 10))
  let cidr = 0
  for (const part of parts) {
    // Count bits in each octet
    cidr += (part >>> 0).toString(2).replace(/0/g, '').length
  }
  return cidr
}

// Helper function to calculate valid network range
const calculateNetworkRange = (
  network: string,
  mask: string | number
): { start: string; end: string } => {
  if (!network) return { start: '', end: '' }

  // Convert mask to string if it's a number (CIDR notation)
  let maskStr: string
  if (typeof mask === 'number' || !isNaN(Number(mask))) {
    maskStr = cidrToMask(Number(mask))
  } else {
    maskStr = mask
  }

  const networkParts = network.split('.').map(part => parseInt(part, 10))
  const maskParts = maskStr.split('.').map(part => parseInt(part, 10))

  // Network address (first address in range)
  const startParts = networkParts.map((part, i) => part & maskParts[i])

  // Broadcast address (last address in range)
  const endParts = startParts.map((part, i) => part | (~maskParts[i] & 255))

  return {
    start: startParts.join('.'),
    end: endParts.join('.'),
  }
}

const SubnetField: React.FC<SubnetFieldProps> = ({
  value,
  onChange,
  label = 'Subnet',
  required = false,
  min,
  max,
  maskType = 'subnet',
  style,
  supernetAddress,
  supernetMask,
  disabled = false,
}) => {
  const [address, setAddress] = useState<string>(value.address || '')
  const [mask, setMask] = useState<number>(
    value.mask || (maskType === 'supernet' ? 8 : 16)
  )
  const [networkRange, setNetworkRange] = useState<{
    start: string
    end: string
    cidr: number
  } | null>(null)
  const [isValidSubnet, setIsValidSubnet] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  // Move helper functions outside of any callbacks or effects to prevent dependency issues
  // Convert CIDR to subnet mask
  const cidrToMask = useCallback((cidr: number): string => {
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
  }, [])

  // Check if an IP is within a subnet range
  const isIPInNetwork = useCallback(
    (ip: string, network: string, mask: string): boolean => {
      // Skip validation if any input is incomplete or invalid
      if (!ip || !network || !mask) return true

      const ipParts = ip.split('.').map(part => parseInt(part, 10))
      const networkParts = network.split('.').map(part => parseInt(part, 10))
      const maskParts = mask.split('.').map(part => parseInt(part, 10))

      // Validate all parts can be parsed as numbers
      if (
        ipParts.some(isNaN) ||
        networkParts.some(isNaN) ||
        maskParts.some(isNaN)
      ) {
        return true
      }

      // Check if IP is in network range by comparing masked values
      for (let i = 0; i < 4; i++) {
        const ipNetworkPart = ipParts[i] & maskParts[i]
        const networkPart = networkParts[i] & maskParts[i]
        if (ipNetworkPart !== networkPart) {
          return false
        }
      }

      return true
    },
    []
  )

  // Update component when value prop changes
  React.useEffect(() => {
    setAddress(value.address || '')
    setMask(value.mask || (maskType === 'supernet' ? 8 : 16))
  }, [value.address, value.mask, maskType])

  // Calculate network range when supernet info changes - without triggering validation
  React.useEffect(() => {
    if (supernetAddress && supernetMask) {
      try {
        // Handle supernetMask as either a CIDR value or a dot-decimal notation
        const cidr =
          typeof supernetMask === 'string' && supernetMask.includes('.')
            ? maskToCidr(supernetMask)
            : Number(supernetMask)

        const range = calculateNetworkRange(supernetAddress, cidr)
        setNetworkRange({ start: range.start, end: range.end, cidr })
      } catch (err) {
        console.error('Error calculating network range:', err)
        setNetworkRange(null)
      }
    } else {
      setNetworkRange(null)
    }
  }, [supernetAddress, supernetMask])

  // Separate effect for validation that runs when address or network range changes
  React.useEffect(() => {
    // Skip validation if no address or supernet info
    if (!address || !supernetAddress || !supernetMask || !networkRange) {
      setIsValidSubnet(true)
      setErrorMessage(undefined)
      return
    }

    // Skip validation for incomplete addresses
    const segments = address.split('.')
    if (segments.length !== 4 || segments.some(s => s === '')) {
      setIsValidSubnet(true)
      setErrorMessage(undefined)
      return
    }

    // Convert supernet mask to dotted decimal if it's a number
    const subnetMaskStr =
      typeof supernetMask === 'number' || !isNaN(Number(supernetMask))
        ? cidrToMask(Number(supernetMask))
        : supernetMask

    // Check if subnet is in network range
    const isInRange = isIPInNetwork(address, supernetAddress, subnetMaskStr)

    // Update validation state based on result
    setIsValidSubnet(isInRange)
    setErrorMessage(
      isInRange
        ? undefined
        : `Subnet must be within range ${networkRange.start} - ${networkRange.end}`
    )
  }, [
    address,
    supernetAddress,
    supernetMask,
    networkRange,
    cidrToMask,
    isIPInNetwork,
  ])

  // Handle address change and pass up to parent - without validation logic
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAddress = e.target.value
      setAddress(newAddress)
      onChange({ address: newAddress, mask })
    },
    [onChange, mask]
  )

  // Handle mask change
  const handleMaskChange = useCallback(
    (eventOrNumber: React.ChangeEvent<HTMLInputElement> | number) => {
      // Schedule the state update for after rendering is complete
      setTimeout(() => {
        let newMask: number
        if (typeof eventOrNumber === 'number') {
          newMask = eventOrNumber
        } else {
          newMask = parseInt(eventOrNumber.target.value, 10)
        }
        setMask(newMask)
        onChange({ address, mask: newMask })
      }, 0)
    },
    [onChange, address]
  )

  // Info panel data
  const subnetInfo = calculateSubnetInfo(mask)

  // Calculate supernet hosts (if supernet information is available)
  const calculateSupernetHosts = (
    cidr: number
  ): { hosts: string; usableHosts: string } => {
    if (!cidr) return { hosts: '0', usableHosts: '0' }

    // Calculate total hosts and usable hosts for the supernet
    const totalHosts = Math.pow(2, 32 - cidr)
    const usableHosts = Math.max(totalHosts - 2, 0)

    return {
      hosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
    }
  }

  return (
    <Box style={style}>
      {/* Address field above mask field - using NetworkAddressField instead of IPAddressField */}
      <NetworkAddressField
        label={label + ' Address'}
        initialValue={address}
        onChange={handleAddressChange}
        error={!isValidSubnet}
        helperText={errorMessage}
        placeholder="e.g. 192.168.1.0"
        required={required}
        disabled={disabled}
        validateAsNetworkAddress={true}
        cidrPrefix={mask}
        defaultNetwork={supernetAddress}
        subnetMask={supernetMask}
      />
      <InternalIncrementNumberField
        initialValue={mask.toString()}
        onChange={handleMaskChange}
        label={label + ' Mask'}
        min={min}
        max={max}
        maskType={maskType}
        required={required}
        style={{ width: '100%' }}
        disabled={disabled}
      />
      <SubnetInfo>
        <Typography variant="body2" component="div">
          Subnet CIDR: /{mask}
        </Typography>
        <Typography variant="body2" component="div">
          Total Hosts: {subnetInfo.hosts} ({subnetInfo.usableHosts} usable)
        </Typography>
        {/* Show supernet information and available range if supernet is selected */}
        {networkRange && (
          <>
            <Typography
              variant="body2"
              component="div"
              sx={{ marginTop: '8px' }}
            >
              Supernet CIDR: /{networkRange.cidr}
            </Typography>
            <Typography variant="body2" component="div">
              Total Hosts: {calculateSupernetHosts(networkRange.cidr).hosts} (
              {calculateSupernetHosts(networkRange.cidr).usableHosts} usable)
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                marginTop: '4px',
                fontStyle: 'italic',
                color: !isValidSubnet
                  ? theme => theme.palette.error.main
                  : theme => theme.palette.info.main,
              }}
            >
              Available Range: {networkRange.start} - {networkRange.end}
            </Typography>
          </>
        )}
      </SubnetInfo>
    </Box>
  )
}

export default SubnetField

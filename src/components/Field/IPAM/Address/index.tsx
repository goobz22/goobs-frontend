'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'
import Typography from '../../../../components/Typography'

export interface IPAddressFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  allowIncomplete?: boolean
  autoInsertDots?: boolean
  defaultNetwork?: string
  subnetMask?: string
  subnetAddress?: string
  subnetCIDR?: number
  isGateway?: boolean
  isRange?: boolean
  isStartIP?: boolean
  isEndIP?: boolean
  endIPValue?: string
  startIPValue?: string
  renderAsRange?: boolean
  onEndIPChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onEndIPBlur?: () => void
  errorEnd?: boolean
  helperTextEnd?: string
  showAvailableRange?: boolean
  gatewayIP?: string
  availableRangeMessage?: string
  helperText?: string
}

const getStyles = (sacredtheme?: boolean) => ({
  infoText: {
    display: 'block',
    marginTop: '-0.5rem',
    marginBottom: '0.25rem',
    fontStyle: 'italic',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
  } as React.CSSProperties,
  rangeContainer: {
    width: '100%',
  } as React.CSSProperties,
  rangeInner: {
    display: 'flex',
    width: '100%',
    gap: '0.5rem',
    alignItems: 'center',
  } as React.CSSProperties,
  rangeDivider: {
    marginTop: '1rem',
  } as React.CSSProperties,
  rangeSide: {
    flex: 1,
  } as React.CSSProperties,
})

const isValidSegment = (segment: string): boolean => {
  if (segment === '') return true
  const num = parseInt(segment, 10)
  return (
    !isNaN(num) &&
    num >= 0 &&
    num <= 255 &&
    segment === num.toString() &&
    segment.length <= 3
  )
}

const isValidIPAddress = (ip: string): boolean => {
  const segments = ip.split('.')
  if (segments.length !== 4) return false
  return segments.every(segment => isValidSegment(segment) && segment !== '')
}

const ipToNumber = (ip: string): number => {
  if (!isValidIPAddress(ip)) return -1
  const parts = ip.split('.').map(Number)
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
}

const isValidIPRange = (startIP: string, endIP: string): boolean => {
  if (!isValidIPAddress(startIP) || !isValidIPAddress(endIP)) return true
  return ipToNumber(startIP) <= ipToNumber(endIP)
}

const isIPInNetwork = (ip: string, network: string, mask: string): boolean => {
  if (
    !isValidIPAddress(ip) ||
    !isValidIPAddress(network) ||
    !isValidIPAddress(mask)
  )
    return true
  const ipParts = ip.split('.').map(part => parseInt(part, 10))
  const networkParts = network.split('.').map(part => parseInt(part, 10))
  const maskParts = mask.split('.').map(part => parseInt(part, 10))
  for (let i = 0; i < 4; i++) {
    if ((ipParts[i] & maskParts[i]) !== (networkParts[i] & maskParts[i]))
      return false
  }
  return true
}

const isIPInSubnetCIDR = (
  ip: string,
  subnetAddr: string,
  cidr: number
): boolean => {
  if (!isValidIPAddress(ip) || !isValidIPAddress(subnetAddr) || !cidr)
    return false
  const mask = cidrToMask(cidr)
  const range = calculateNetworkRange(subnetAddr, mask)
  const ipNum = ipToNumber(ip)
  const startNum = ipToNumber(range.start)
  const endNum = ipToNumber(range.end)
  return ipNum >= startNum && ipNum <= endNum
}

const isIPInUsableRange = (
  ip: string,
  subnetAddr: string,
  cidr: number
): boolean => {
  if (!isValidIPAddress(ip) || !isValidIPAddress(subnetAddr) || !cidr)
    return true
  const usableRange = calculateUsableIPRange(subnetAddr, cidr)
  if (!usableRange) return true
  const ipNum = ipToNumber(ip)
  const startNum = ipToNumber(usableRange.start)
  const endNum = ipToNumber(usableRange.end)
  return ipNum >= startNum && ipNum <= endNum
}

const cidrToMask = (cidr: number): string => {
  const safeCidr = Math.max(0, Math.min(32, cidr))
  const bitmask = safeCidr === 0 ? 0 : ~0 << (32 - safeCidr)
  return [
    (bitmask >>> 24) & 255,
    (bitmask >>> 16) & 255,
    (bitmask >>> 8) & 255,
    bitmask & 255,
  ].join('.')
}

const isGatewayInSubnet = (
  gateway: string,
  subnetAddress: string,
  subnetCIDR: number
): boolean => {
  if (
    !isValidIPAddress(gateway) ||
    !isValidIPAddress(subnetAddress) ||
    !subnetCIDR
  )
    return true
  const subnetMask = cidrToMask(subnetCIDR)
  const range = calculateNetworkRange(subnetAddress, subnetMask)
  const gatewayNum = ipToNumber(gateway)
  const startNum = ipToNumber(range.start)
  const endNum = ipToNumber(range.end)
  const inRange = gatewayNum >= startNum && gatewayNum <= endNum
  if (!inRange) return false
  const isNetworkAddress = gateway === range.start
  const isBroadcastAddress = gateway === range.end
  return !(isNetworkAddress || isBroadcastAddress)
}

const calculateNetworkRange = (
  network: string,
  mask: string
): { start: string; end: string } => {
  const networkParts = network.split('.').map(part => parseInt(part, 10))
  const maskParts = mask.split('.').map(part => parseInt(part, 10))
  const startParts = networkParts.map((part, i) => part & maskParts[i])
  const endParts = startParts.map((part, i) => part | (~maskParts[i] & 255))
  return { start: startParts.join('.'), end: endParts.join('.') }
}

const calculateUsableIPRange = (
  subnetAddress: string,
  subnetCIDR: number,
  gatewayIP?: string
): { start: string; end: string } | null => {
  if (!isValidIPAddress(subnetAddress) || !subnetCIDR) return null
  const subnetMask = cidrToMask(subnetCIDR)
  const range = calculateNetworkRange(subnetAddress, subnetMask)
  const networkNum = ipToNumber(range.start)
  const broadcastNum = ipToNumber(range.end)
  let usableStart = networkNum + 1
  let usableEnd = broadcastNum - 1
  if (gatewayIP && isValidIPAddress(gatewayIP)) {
    const gatewayNum = ipToNumber(gatewayIP)
    if (gatewayNum >= usableStart && gatewayNum <= usableEnd) {
      console.log(
        `Gateway IP ${gatewayIP} is in the usable range and will be excluded`
      )
    }
  }
  return { start: numToIP(usableStart), end: numToIP(usableEnd) }
}

const numToIP = (num: number): string =>
  [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(
    '.'
  )

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
  onEndIPChange,
  onEndIPBlur,
  errorEnd = false,
  availableRangeMessage,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidIPAddress(initialValue)
  )
  const [isInNetwork, setIsInNetwork] = useState<boolean>(true)
  const [isInSubnet, setIsInSubnet] = useState<boolean>(true)
  const [isValidRange, setIsValidRange] = useState<boolean>(true)
  const lastInputTypeWasDelete = useRef(false)
  const styles = getStyles(rest.sacredtheme)

  const valueRef = useRef(value)
  const subnetAddressRef = useRef(subnetAddress)
  const subnetCIDRRef = useRef(subnetCIDR)
  const startIPValueRef = useRef(startIPValue)
  const endIPValueRef = useRef(endIPValue)

  useEffect(() => {
    valueRef.current = value
    subnetAddressRef.current = subnetAddress
    subnetCIDRRef.current = subnetCIDR
    startIPValueRef.current = startIPValue
    endIPValueRef.current = endIPValue
  }, [value, subnetAddress, subnetCIDR, startIPValue, endIPValue])

  useEffect(() => {
    if (
      defaultNetwork &&
      subnetMask &&
      isValidIPAddress(defaultNetwork) &&
      isValidIPAddress(subnetMask)
    ) {
      // Network range calculation completed
    }
  }, [defaultNetwork, subnetMask])

  useEffect(() => {
    const validateInitialValue = () => {
      if (initialValue) {
        const validIP = isValidIPAddress(initialValue)
        setIsValid(validIP)
        if (validIP && defaultNetwork && subnetMask) {
          setIsInNetwork(
            isIPInNetwork(initialValue, defaultNetwork, subnetMask)
          )
        }
        if (validIP && subnetAddress && subnetCIDR !== undefined) {
          setIsInNetwork(
            isIPInSubnetCIDR(initialValue, subnetAddress, subnetCIDR)
          )
        }
        if (isGateway && validIP && subnetAddress && subnetCIDR !== undefined) {
          setIsInSubnet(
            isGatewayInSubnet(initialValue, subnetAddress, subnetCIDR)
          )
        }
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
  }, [
    initialValue,
    defaultNetwork,
    subnetMask,
    subnetAddress,
    subnetCIDR,
    isGateway,
    isRange,
    isStartIP,
    isEndIP,
    startIPValue,
    endIPValue,
  ])

  useEffect(() => {
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
      if (subnetValid !== isInSubnet) setIsInSubnet(subnetValid)
    }
  }, [isGateway, value, subnetAddress, subnetCIDR, isInSubnet])

  useEffect(() => {
    if (isRange && isValidIPAddress(value)) {
      let bothInSubnet = true
      if (subnetAddress && subnetCIDR !== undefined) {
        if (isStartIP && endIPValue && isValidIPAddress(endIPValue)) {
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
        } else if (isEndIP && startIPValue && isValidIPAddress(startIPValue)) {
          const startInSubnet = isIPInSubnetCIDR(
            startIPValue,
            subnetAddress,
            subnetCIDR
          )
          const endInSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)
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
      }
      const rangeOrderValid =
        isStartIP && endIPValue && isValidIPAddress(endIPValue)
          ? isValidIPRange(value, endIPValue)
          : isEndIP && startIPValue && isValidIPAddress(startIPValue)
            ? isValidIPRange(startIPValue, value)
            : true
      const rangeValid = rangeOrderValid && bothInSubnet
      if (rangeValid !== isValidRange) setIsValidRange(rangeValid)
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
      let formatted = input
        .replace(/[^\d.]/g, '')
        .replace(/\.{2,}/g, '.')
        .replace(/^\./, '')
      const dots = formatted.match(/\./g)
      if (dots && dots.length > 3)
        formatted = formatted.substring(0, formatted.lastIndexOf('.'))
      const segments = formatted.split('.')
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (segment !== '') {
          if (segment.length > 3) segments[i] = segment.substring(0, 3)
          const num = parseInt(segment, 10)
          if (num > 255) segments[i] = '255'
        }
      }
      formatted = segments.join('.')
      if (autoInsertDots && !wasDelete) {
        const segments = formatted.split('.')
        if (segments.length < 4) {
          if (segments[segments.length - 1].length === 3) formatted += '.'
        }
      }
      return formatted
    },
    [autoInsertDots]
  )

  const validateIPAddress = useCallback(
    (ip: string): boolean => {
      if (ip === '') return true
      let valid = allowIncomplete
        ? ip.split('.').every(isValidSegment)
        : isValidIPAddress(ip)
      if (isValidIPAddress(ip)) {
        if (subnetAddress && subnetCIDR !== undefined) {
          const inSubnet = isIPInSubnetCIDR(ip, subnetAddress, subnetCIDR)
          const inUsableRange = isIPInUsableRange(ip, subnetAddress, subnetCIDR)
          setIsInNetwork(inSubnet && (isGateway || inUsableRange))
        }
      } else {
        setIsInNetwork(true)
      }
      return valid
    },
    [allowIncomplete, subnetAddress, subnetCIDR, isGateway]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatIPAddress(
        e.target.value,
        lastInputTypeWasDelete.current
      )
      const valid = validateIPAddress(formatted)
      setIsValid(valid)
      setValue(formatted)
      onChange?.(e)
    },
    [onChange, formatIPAddress, validateIPAddress]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      lastInputTypeWasDelete.current =
        e.key === 'Backspace' || e.key === 'Delete'
    },
    []
  )

  if (renderAsRange) {
    return (
      <div style={styles.rangeContainer}>
        {availableRangeMessage && (
          <Typography style={styles.infoText}>
            {availableRangeMessage}
          </Typography>
        )}
        <div style={styles.rangeInner}>
          <div style={styles.rangeSide}>
            <TextField
              {...rest}
              label={startIPValue ? label : ''}
              value={startIPValue}
              onChange={onChange}
              onBlur={onEndIPBlur}
              error={!isValidRange}
            />
          </div>
          <Typography style={styles.rangeDivider}>-</Typography>
          <div style={styles.rangeSide}>
            <TextField
              {...rest}
              label={endIPValue ? label : ''}
              value={endIPValue}
              onChange={onEndIPChange}
              onBlur={onEndIPBlur}
              error={errorEnd || !isValidRange}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...rest.style, width: '100%' }}>
      <TextField
        label={label}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        error={!isValid || !isInNetwork || !isInSubnet}
        {...rest}
      />
    </div>
  )
}

export default IPAddressField

'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'

export interface NetworkAddressFieldProps
  extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  allowIncomplete?: boolean
  autoInsertDots?: boolean
  defaultNetwork?: string
  subnetMask?: string
  cidrPrefix?: number
  validateAsNetworkAddress?: boolean
  helperText?: string
}

const isValidSegment = (segment: string): boolean => {
  if (segment === '') return true
  const num = parseInt(segment, 10)
  return !isNaN(num) && num >= 0 && num <= 255 && segment === num.toString()
}

const isValidIPAddress = (ip: string): boolean => {
  const segments = ip.split('.')
  if (segments.length !== 4) return false
  return segments.every(segment => isValidSegment(segment) && segment !== '')
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

const cidrToMask = (cidr: number): string => {
  const binary = '1'.repeat(cidr) + '0'.repeat(32 - cidr)
  const octets = [
    parseInt(binary.substring(0, 8), 2),
    parseInt(binary.substring(8, 16), 2),
    parseInt(binary.substring(16, 24), 2),
    parseInt(binary.substring(24, 32), 2),
  ]
  return octets.join('.')
}

const maskToCidr = (mask: string): number => {
  const parts = mask.split('.').map(part => parseInt(part, 10))
  let cidr = 0
  for (const part of parts) {
    cidr += (part >>> 0).toString(2).replace(/0/g, '').length
  }
  return cidr
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

const isValidNetworkAddress = (ip: string, cidrPrefix: number): boolean => {
  if (!isValidIPAddress(ip) || !cidrPrefix) return false
  const ipParts = ip.split('.').map(part => parseInt(part, 10))
  const ipNum =
    (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]
  const hostMask = (1 << (32 - cidrPrefix)) - 1
  return (ipNum & hostMask) === 0
}

const calculateNetworkAddress = (ip: string, cidrPrefix: number): string => {
  if (!isValidIPAddress(ip) || !cidrPrefix) return ip
  const ipParts = ip.split('.').map(part => parseInt(part, 10))
  const mask = cidrToMask(cidrPrefix)
  const maskParts = mask.split('.').map(part => parseInt(part, 10))
  const networkParts = ipParts.map((part, i) => part & maskParts[i])
  return networkParts.join('.')
}

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

  useEffect(() => {
    if (cidrPrefix) setEffectiveCidr(cidrPrefix)
    else if (subnetMask && isValidIPAddress(subnetMask))
      setEffectiveCidr(maskToCidr(subnetMask))
    else setEffectiveCidr(null)
  }, [cidrPrefix, subnetMask])

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

  useEffect(() => {
    if (
      !validateAsNetworkAddress ||
      !effectiveCidr ||
      !isValidIPAddress(value)
    ) {
      setIsNetworkAddress(true)
      return
    }
    setIsNetworkAddress(isValidNetworkAddress(value, effectiveCidr))
  }, [value, effectiveCidr, validateAsNetworkAddress])

  useEffect(() => {
    if (initialValue) {
      const validIP = isValidIPAddress(initialValue)
      setIsValid(validIP)
      if (validIP && defaultNetwork && subnetMask)
        setIsInNetwork(isIPInNetwork(initialValue, defaultNetwork, subnetMask))
      if (validIP && effectiveCidr)
        setIsNetworkAddress(isValidNetworkAddress(initialValue, effectiveCidr))
    }
  }, [initialValue, defaultNetwork, subnetMask, effectiveCidr])

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
        if (segments[i] !== '') {
          if (parseInt(segments[i], 10) > 255) segments[i] = '255'
        }
      }
      formatted = segments.join('.')
      if (autoInsertDots && !wasDelete) {
        const segments = formatted.split('.')
        if (segments.length < 4 && segments[segments.length - 1].length === 3)
          formatted += '.'
      }
      return formatted
    },
    [autoInsertDots]
  )

  const validateIPAddress = useCallback(
    (ip: string): boolean => {
      if (ip === '') return true
      const valid = allowIncomplete
        ? ip.split('.').every(isValidSegment)
        : isValidIPAddress(ip)
      if (valid && defaultNetwork && subnetMask && isValidIPAddress(ip))
        setIsInNetwork(isIPInNetwork(ip, defaultNetwork, subnetMask))
      else setIsInNetwork(true)
      if (
        valid &&
        validateAsNetworkAddress &&
        effectiveCidr &&
        isValidIPAddress(ip)
      )
        setIsNetworkAddress(isValidNetworkAddress(ip, effectiveCidr))
      else setIsNetworkAddress(true)
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
      lastInputTypeWasDelete.current = rawValue.length < value.length
      const formattedValue = formatIPAddress(
        rawValue,
        lastInputTypeWasDelete.current
      )
      const valid = validateIPAddress(formattedValue)
      setValue(formattedValue)
      setIsValid(valid)
      const clonedEvent = {
        ...event,
        target: { ...event.target, value: formattedValue },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(clonedEvent)
    },
    [onChange, formatIPAddress, validateIPAddress, value]
  )

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')
      const formattedValue = formatIPAddress(pastedText, false)
      setValue(formattedValue)
      setIsValid(validateIPAddress(formattedValue))
      const syntheticEvent = {
        target: { value: formattedValue },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
    },
    [formatIPAddress, onChange, validateIPAddress]
  )

  const autoCorrectToNetworkAddress = useCallback(() => {
    if (!isValidIPAddress(value) || !effectiveCidr) return
    const networkAddress = calculateNetworkAddress(value, effectiveCidr)
    setValue(networkAddress)
    setIsNetworkAddress(true)
    const syntheticEvent = {
      target: { value: networkAddress },
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }, [value, effectiveCidr, onChange])

  const getErrorMessage = useCallback(() => {
    if (!isValid) return 'Please enter a valid IP address'
    if (isValid && !isInNetwork && networkRange)
      return `IP must be within the range ${networkRange.start} - ${networkRange.end}`
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

'use client'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type SharedFormFieldProps,
} from '../../../../theme'
import Typography from '../../../../components/Typography'

export interface IPAddressFieldProps extends Omit<
  SharedFormFieldProps,
  'onChange'
> {
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
  showAvailableRange?: boolean
  gatewayIP?: string
  availableRangeMessage?: string
  placeholder?: string
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
  const [a, b, c, d] = ip.split('.').map(n => Number(n)) as [
    number,
    number,
    number,
    number,
  ]
  return (a << 24) | (b << 16) | (c << 8) | d
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
    const ipPart = ipParts[i]
    const networkPart = networkParts[i]
    const maskPart = maskParts[i]
    if (
      ipPart === undefined ||
      networkPart === undefined ||
      maskPart === undefined
    ) {
      // If any part is unexpectedly undefined, treat as non-blocking
      // since earlier guards ensure valid IPs; return true to avoid false negatives
      return true
    }
    if ((ipPart & maskPart) !== (networkPart & maskPart)) return false
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
  const networkParts = network.split('.').map(part => parseInt(part, 10)) as [
    number,
    number,
    number,
    number,
  ]
  const maskParts = mask.split('.').map(part => parseInt(part, 10)) as [
    number,
    number,
    number,
    number,
  ]
  const startParts: [number, number, number, number] = [
    networkParts[0] & maskParts[0],
    networkParts[1] & maskParts[1],
    networkParts[2] & maskParts[2],
    networkParts[3] & maskParts[3],
  ]
  const endParts: [number, number, number, number] = [
    startParts[0] | (~maskParts[0] & 255),
    startParts[1] | (~maskParts[1] & 255),
    startParts[2] | (~maskParts[2] & 255),
    startParts[3] | (~maskParts[3] & 255),
  ]
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
  const usableStart = networkNum + 1
  const usableEnd = broadcastNum - 1
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
  placeholder = '192.168.0.1',
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
  const inputRef = useRef<HTMLInputElement>(null)
  const styles = getStyles(rest.styles?.theme === 'sacred')

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

  // Compute isInSubnet using useMemo (derived state pattern)
  const computedIsInSubnet = useMemo(() => {
    if (
      isGateway &&
      isValidIPAddress(value) &&
      subnetAddress &&
      subnetCIDR !== undefined
    ) {
      return isGatewayInSubnet(value, subnetAddress, subnetCIDR)
    }
    return true
  }, [isGateway, value, subnetAddress, subnetCIDR])

  // Sync isInSubnet state with computed value using derived state pattern
  if (computedIsInSubnet !== isInSubnet) {
    setIsInSubnet(computedIsInSubnet)
  }

  // Compute isValidRange using useMemo (derived state pattern)
  const computedIsValidRange = useMemo(() => {
    if (!isRange || !isValidIPAddress(value)) {
      return true
    }
    let bothInSubnet = true
    if (subnetAddress && subnetCIDR !== undefined) {
      if (isStartIP && endIPValue && isValidIPAddress(endIPValue)) {
        const startInSubnet = isIPInSubnetCIDR(value, subnetAddress, subnetCIDR)
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
        const endInUsable = isIPInUsableRange(value, subnetAddress, subnetCIDR)
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
    return rangeOrderValid && bothInSubnet
  }, [
    isRange,
    isStartIP,
    isEndIP,
    value,
    startIPValue,
    endIPValue,
    subnetAddress,
    subnetCIDR,
  ])

  // Sync isValidRange state with computed value using derived state pattern
  if (computedIsValidRange !== isValidRange) {
    setIsValidRange(computedIsValidRange)
  }

  const formatIPAddress = useCallback(
    (input: string, wasDelete: boolean): string => {
      let formatted = input
        .replace(/[^\d.]/g, '')
        .replace(/\.{2,}/g, '.')
        .replace(/^\./, '')
      const dots = formatted.match(/\./g)
      if (dots && dots.length > 3)
        formatted = formatted.substring(0, formatted.lastIndexOf('.'))
      let segments = formatted.split('.')
      let i = 0
      while (i < segments.length) {
        const segStr: string = segments[i] ?? ''
        if (segStr !== '' && segStr.length > 3) {
          const first = segStr.substring(0, 3)
          const rest = segStr.substring(3)
          segments[i] = first
          segments.splice(i + 1, 0, rest)
        } else {
          i++
        }
      }
      for (let j = 0; j < segments.length; j++) {
        const segStr: string = segments[j] ?? ''
        if (segStr !== '') {
          const num = parseInt(segStr, 10)
          if (num > 255) segments[j] = '255'
        }
      }
      if (segments.length > 4) {
        segments = segments.slice(0, 4)
      }
      formatted = segments.join('.')
      if (autoInsertDots && !wasDelete) {
        const segmentsLocal = formatted.split('.')
        if (segmentsLocal.length < 4) {
          const last: string = segmentsLocal[segmentsLocal.length - 1] ?? ''
          if (last.length === 3) formatted += '.'
        }
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        const allowed = /^[0-9.]$/
        const controlKeys = [
          'Backspace',
          'Delete',
          'ArrowLeft',
          'ArrowRight',
          'Tab',
          'Enter',
        ]
        if (!controlKeys.includes(e.key) && !allowed.test(e.key)) {
          e.preventDefault()
        }
      }
      lastInputTypeWasDelete.current =
        e.key === 'Backspace' || e.key === 'Delete'
    },
    []
  )

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== value) {
        const formatted = formatIPAddress(target.value, lastInputTypeWasDelete.current)
        const valid = validateIPAddress(formatted)
        setIsValid(valid)
        setValue(formatted)

        if (onChange) {
          const syntheticEvent = {
            target: { value: formatted },
            currentTarget: { value: formatted },
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value, formatIPAddress, validateIPAddress])

  if (renderAsRange) {
    const handleStartIPChange = (value: string) => {
      if (onChange) {
        // Create a synthetic event to match the expected signature
        const syntheticEvent = {
          target: { value },
          currentTarget: { value },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    const handleEndIPChange = (value: string) => {
      if (onEndIPChange) {
        // Create a synthetic event to match the expected signature
        const syntheticEvent = {
          target: { value },
          currentTarget: { value },
        } as React.ChangeEvent<HTMLInputElement>
        onEndIPChange(syntheticEvent)
      }
    }

    const {
      themeConfig: rangeThemeConfig,
      borderColor: rangeBorderColor,
      labelColor: rangeLabelColor,
      footerTextColor: rangeFooterTextColor,
      transition: rangeTransition,
    } = getSharedFormFieldStyles(rest.styles, !!(!isValidRange || errorEnd))

    const rangeComponentStyles: Record<string, React.CSSProperties> = {
      container: getSharedContainerStyles(rest.styles),
      inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: rest.styles?.height || '40px',
        width: '100%',
        border: `${rest.styles?.borderWidth || '1px'} solid ${rangeBorderColor}`,
        borderRadius: rest.styles?.borderRadius || '8px',
        backgroundColor: rangeThemeConfig.background,
        color: rangeThemeConfig.text,
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        transition: rangeTransition,
      },
      input: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        padding: rest.styles?.padding || '8px 16px',
        fontSize: rest.styles?.fontSize || '16px',
        fontWeight: rest.styles?.fontWeight,
        lineHeight: rest.styles?.lineHeight,
        fontFamily: rangeThemeConfig.fontFamily,
        color: 'inherit',
        boxSizing: 'border-box',
      },
      label: getSharedLabelStyles(rangeLabelColor, rangeThemeConfig),
      footerText: getSharedFooterTextStyles(
        rangeFooterTextColor,
        rangeThemeConfig,
        rest.styles
      ),
    }

    const createRangeInput = (
      inputLabel: string,
      inputValue: string | undefined,
      inputOnChange: (value: string) => void,
      inputError: string | undefined
    ) => (
      <div style={styles.rangeSide}>
        {inputLabel && (
          <label style={rangeComponentStyles.label}>
            {inputLabel}
            {rest.required && (
              <span style={getRequiredIndicatorStyle(rest.styles)}>
                {rest.styles?.requiredIndicatorText || ' *'}
              </span>
            )}
          </label>
        )}

        <div style={rangeComponentStyles.inputWrapper}>
          <input
            {...rest}
            {...getRequiredProps(rest.required)}
            value={inputValue || ''}
            disabled={rest.disabled}
            onChange={e => inputOnChange(e.target.value)}
            onBlur={onEndIPBlur}
            placeholder={
              placeholder ||
              (inputLabel.includes('Start') ? '192.168.0.1' : '192.168.0.255')
            }
            style={rangeComponentStyles.input}
          />
        </div>

        {inputError && (
          <div style={rangeComponentStyles.footerText}>{inputError}</div>
        )}
      </div>
    )

    return (
      <div style={styles.rangeContainer}>
        {availableRangeMessage && (
          <Typography>{availableRangeMessage}</Typography>
        )}
        <div style={styles.rangeInner}>
          {createRangeInput(
            startIPValue ? label : '',
            startIPValue,
            handleStartIPChange,
            !isValidRange ? 'Invalid IP range' : undefined
          )}
          <Typography>-</Typography>
          {createRangeInput(
            endIPValue ? label : '',
            endIPValue,
            handleEndIPChange,
            errorEnd || !isValidRange ? 'Invalid IP range' : undefined
          )}
        </div>
      </div>
    )
  }

  const handleTextFieldChange = (newValue: string) => {
    const formatted = formatIPAddress(newValue, lastInputTypeWasDelete.current)
    const valid = validateIPAddress(formatted)
    setIsValid(valid)
    setValue(formatted)

    if (onChange) {
      // Create a synthetic event to match the expected signature
      const syntheticEvent = {
        target: { value: formatted },
        currentTarget: { value: formatted },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(
      rest.styles,
      !!(!isValid || !isInNetwork || !isInSubnet)
    )

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(rest.styles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: rest.styles?.height || '40px',
      width: '100%',
      border: `${rest.styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: rest.styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      transition,
    },
    input: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
      padding: rest.styles?.padding || '8px 16px',
      fontSize: rest.styles?.fontSize || '16px',
      fontWeight: rest.styles?.fontWeight,
      lineHeight: rest.styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    footerText: getSharedFooterTextStyles(
      footerTextColor,
      themeConfig,
      rest.styles
    ),
  }

  const error =
    !isValid || !isInNetwork || !isInSubnet ? 'Invalid IP address' : undefined

  return (
    <div style={{ ...componentStyles.container, width: '100%' }}>
      {label && (
        <label style={componentStyles.label}>
          {label}
          {rest.required && (
            <span style={getRequiredIndicatorStyle(rest.styles)}>
              {rest.styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={componentStyles.inputWrapper}>
        <input
          ref={inputRef}
          {...rest}
          {...getRequiredProps(rest.required)}
          value={value}
          disabled={rest.disabled}
          onChange={e => handleTextFieldChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={componentStyles.input}
        />
      </div>

      {error && <div style={componentStyles.footerText}>{error}</div>}
    </div>
  )
}

export default IPAddressField

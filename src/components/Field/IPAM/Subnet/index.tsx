'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type SharedFormFieldProps,
  type FormFieldStyles,
} from '../../../../theme'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface InternalIncrementNumberFieldProps
  extends Omit<SharedFormFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  min?: number
  max?: number
  initialDelay?: number
  repeatInterval?: number
  maskType?: 'subnet' | 'supernet'
  style?: React.CSSProperties
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  name?: string
  autoComplete?: string
}

const calculateSubnetInfo = (cidr: number) => {
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)
  return {
    mask,
    hosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

const getStyles = (styles?: SharedFormFieldProps, adornmentColor?: string) => {
  const isSacred = styles?.styles?.theme === 'sacred'
  const isDark = styles?.styles?.theme === 'dark'

  return {
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      marginRight: '-0.25rem',
    } as React.CSSProperties,
    button: {
      padding: 0,
      width: '1rem',
      height: '1rem',
      minWidth: '1rem',
      minHeight: '1rem',
      borderRadius: '0.125rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: styles?.disabled ? 'not-allowed' : 'pointer',
      color:
        adornmentColor ||
        (isSacred ? '#FFD700' : isDark ? '#E5E7EB' : '#4B5563'),
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: styles?.disabled ? 0.5 : 1,
      '&:hover': {
        backgroundColor: isSacred
          ? 'rgba(255, 215, 0, 0.1)'
          : isDark
            ? 'rgba(229, 231, 235, 0.1)'
            : 'rgba(229, 231, 235, 0.5)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    } as React.CSSProperties,
    infoContainer: {
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      color: isSacred ? '#FFD700' : isDark ? '#D1D5DB' : '#4B5563',
    } as React.CSSProperties,
    infoText: {
      marginTop: '0.25rem',
      fontStyle: 'italic',
      color: isSacred ? '#FFD700' : isDark ? '#60A5FA' : '#3B82F6',
    } as React.CSSProperties,
    errorText: {
      color: isSacred ? '#FF6B6B' : isDark ? '#F87171' : '#EF4444',
    } as React.CSSProperties,
  }
}

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
  maskType = 'subnet',
  style,
  styles: fieldStyles,
  ...rest
}) => {
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

  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(fieldStyles, false)

  const pickerStyles = getStyles(rest, adornmentColor)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(fieldStyles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: fieldStyles?.height || '40px',
      width: '100%',
      border: `${fieldStyles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: fieldStyles?.borderRadius || '8px',
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
      padding: fieldStyles?.padding || '8px 16px',
      paddingRight: '60px', // Space for increment/decrement buttons
      fontSize: fieldStyles?.fontSize || '16px',
      fontWeight: fieldStyles?.fontWeight,
      lineHeight: fieldStyles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    endAdornment: getSharedAdornmentStyles(adornmentColor),
    footerText: getSharedFooterTextStyles(
      footerTextColor,
      themeConfig,
      fieldStyles
    ),
  }

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    initialTimerRef.current = null
    timerRef.current = null
  }, [])

  const handleIncrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.min(
        effectiveMax,
        isNaN(num) ? effectiveMin : num + 1
      )
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, effectiveMax, effectiveMin])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.max(
        effectiveMin,
        isNaN(num) ? effectiveMin : num - 1
      )
      onChange?.(newValue)
      return newValue.toString()
    })
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

  React.useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleTextFieldChange = useCallback(
    (value: string) => {
      const newValue = value.replace(/[^0-9]/g, '')
      if (newValue === '') {
        setCurrentValue(effectiveMin.toString())
        if (onChange) {
          const syntheticEvent = {
            target: { value: effectiveMin.toString() },
            currentTarget: { value: effectiveMin.toString() },
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
        return
      }
      const numValue = parseInt(newValue, 10)
      let finalValue = newValue
      if (isNaN(numValue) || numValue < effectiveMin) {
        finalValue = effectiveMin.toString()
        setCurrentValue(effectiveMin.toString())
      } else if (numValue > effectiveMax) {
        finalValue = effectiveMax.toString()
        setCurrentValue(effectiveMax.toString())
      } else {
        setCurrentValue(newValue)
      }
      if (onChange) {
        const syntheticEvent = {
          target: { value: finalValue },
          currentTarget: { value: finalValue },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    },
    [onChange, effectiveMin, effectiveMax]
  )

  const EndAdornment = () => (
    <div style={pickerStyles.buttonContainer}>
      <button
        type="button"
        onMouseDown={handleIncrementMouseDown}
        disabled={rest.disabled}
        style={pickerStyles.button}
      >
        <ArrowDropUpIcon style={{ fontSize: '1.25rem' }} />
      </button>
      <button
        type="button"
        onMouseDown={handleDecrementMouseDown}
        disabled={rest.disabled}
        style={pickerStyles.button}
      >
        <ArrowDropDownIcon style={{ fontSize: '1.25rem' }} />
      </button>
    </div>
  )

  return (
    <div style={style}>
      <div style={componentStyles.container}>
        {label && (
          <label style={componentStyles.label}>
            {label}
            {rest.required && (
              <span style={getRequiredIndicatorStyle(fieldStyles)}>
                {fieldStyles?.requiredIndicatorText || ' *'}
              </span>
            )}
          </label>
        )}

        <div style={componentStyles.inputWrapper}>
          <input
            {...rest}
            {...getRequiredProps(rest.required)}
            value={subnetInfo.mask}
            disabled={rest.disabled}
            onChange={e => handleTextFieldChange(e.target.value)}
            type="text"
            inputMode="numeric"
            style={componentStyles.input}
          />

          <div
            style={{
              ...componentStyles.endAdornment,
              right: '16px',
            }}
          >
            <EndAdornment />
          </div>
        </div>
      </div>
    </div>
  )
}

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
  supernetAddress?: string
  supernetMask?: string
  disabled?: boolean
  styles?: FormFieldStyles
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
  if (!mask) return 0
  const parts = mask.split('.').map(part => parseInt(part, 10))
  let cidr = 0
  for (const part of parts) {
    cidr += (part >>> 0).toString(2).replace(/0/g, '').length
  }
  return cidr
}

const calculateNetworkRange = (
  network: string,
  mask: string | number
): { start: string; end: string } => {
  if (!network) return { start: '', end: '' }
  let maskStr: string
  if (typeof mask === 'number' || !isNaN(Number(mask))) {
    maskStr = cidrToMask(Number(mask))
  } else {
    maskStr = mask
  }
  const networkSegs = network.split('.')
  const maskSegs = maskStr.split('.')
  if (networkSegs.length !== 4 || maskSegs.length !== 4) {
    return { start: '', end: '' }
  }
  const networkParts = networkSegs.map(p => parseInt(p, 10)) as [
    number,
    number,
    number,
    number,
  ]
  const maskParts = maskSegs.map(p => parseInt(p, 10)) as [
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
  const subnetStyles = getStyles()

  const cidrToMaskFn = useCallback((cidr: number): string => {
    const binary = '1'.repeat(cidr) + '0'.repeat(32 - cidr)
    const octets = [
      parseInt(binary.substring(0, 8), 2),
      parseInt(binary.substring(8, 16), 2),
      parseInt(binary.substring(16, 24), 2),
      parseInt(binary.substring(24, 32), 2),
    ]
    return octets.join('.')
  }, [])

  const isIPInNetwork = useCallback(
    (ip: string, network: string, mask: string): boolean => {
      if (!ip || !network || !mask) return true
      const ipSegments = ip.split('.')
      const networkSegments = network.split('.')
      const maskSegments = mask.split('.')
      if (
        ipSegments.length !== 4 ||
        networkSegments.length !== 4 ||
        maskSegments.length !== 4
      ) {
        return true
      }
      const ipParts = ipSegments.map(part => parseInt(part, 10)) as [
        number,
        number,
        number,
        number,
      ]
      const networkParts = networkSegments.map(part => parseInt(part, 10)) as [
        number,
        number,
        number,
        number,
      ]
      const maskParts = maskSegments.map(part => parseInt(part, 10)) as [
        number,
        number,
        number,
        number,
      ]
      if (
        ipParts.some(isNaN) ||
        networkParts.some(isNaN) ||
        maskParts.some(isNaN)
      ) {
        return true
      }
      const [ip0, ip1, ip2, ip3] = ipParts
      const [n0, n1, n2, n3] = networkParts
      const [m0, m1, m2, m3] = maskParts
      if ((ip0 & m0) !== (n0 & m0)) return false
      if ((ip1 & m1) !== (n1 & m1)) return false
      if ((ip2 & m2) !== (n2 & m2)) return false
      if ((ip3 & m3) !== (n3 & m3)) return false
      return true
    },
    []
  )

  React.useEffect(() => {
    setAddress(value.address || '')
    setMask(value.mask || (maskType === 'supernet' ? 8 : 16))
  }, [value.address, value.mask, maskType])

  React.useEffect(() => {
    if (supernetAddress && supernetMask) {
      try {
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

  React.useEffect(() => {
    if (!address || !supernetAddress || !supernetMask || !networkRange) {
      setIsValidSubnet(true)
      return
    }
    const segments = address.split('.')
    if (segments.length !== 4 || segments.some(s => s === '')) {
      setIsValidSubnet(true)
      return
    }
    const subnetMaskStr =
      typeof supernetMask === 'number' || !isNaN(Number(supernetMask))
        ? cidrToMaskFn(Number(supernetMask))
        : supernetMask
    const isInRange = isIPInNetwork(address, supernetAddress, subnetMaskStr)
    setIsValidSubnet(isInRange)
  }, [
    address,
    supernetAddress,
    supernetMask,
    networkRange,
    cidrToMaskFn,
    isIPInNetwork,
  ])

  const handleMaskChange = useCallback(
    (eventOrNumber: React.ChangeEvent<HTMLInputElement> | number) => {
      let newMask: number
      if (typeof eventOrNumber === 'number') {
        newMask = eventOrNumber
      } else {
        newMask = parseInt(eventOrNumber.target.value, 10)
      }
      setMask(newMask)
      onChange({ address, mask: newMask })
    },
    [onChange, address]
  )

  const subnetInfo = calculateSubnetInfo(mask)
  const calculateSupernetHosts = (
    cidr: number
  ): { hosts: string; usableHosts: string } => {
    if (!cidr) return { hosts: '0', usableHosts: '0' }
    const totalHosts = Math.pow(2, 32 - cidr)
    const usableHosts = Math.max(totalHosts - 2, 0)
    return {
      hosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
    }
  }

  return (
    <div style={style}>
      <InternalIncrementNumberField
        initialValue={mask.toString()}
        onChange={handleMaskChange}
        label={label}
        min={min as number}
        max={max as number}
        maskType={maskType}
        required={required}
        style={{ width: '100%' }}
        disabled={disabled}
      />
      <div style={subnetStyles.infoContainer}>
        <div>Subnet CIDR: /{mask}</div>
        <div>
          Total Hosts: {subnetInfo.hosts} ({subnetInfo.usableHosts} usable)
        </div>
        {networkRange && (
          <>
            <div style={{ marginTop: '0.5rem' }}>
              Supernet CIDR: /{networkRange.cidr}
            </div>
            <div>
              Total Hosts: {calculateSupernetHosts(networkRange.cidr).hosts} (
              {calculateSupernetHosts(networkRange.cidr).usableHosts} usable)
            </div>
            <div
              style={{
                ...subnetStyles.infoText,
                ...(!isValidSubnet && subnetStyles.errorText),
              }}
            >
              Available Range: {networkRange.start} - {networkRange.end}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SubnetField

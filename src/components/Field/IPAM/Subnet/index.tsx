'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface InternalIncrementNumberFieldProps {
  initialValue?: string
  /**
   * Emits the new mask CIDR as a number. Was previously polymorphic
   * `(event | number) => void` — collapsed to `(value: number) => void`
   * during the FieldShell migration.
   */
  onChange?: (value: number) => void
  label?: string
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  initialDelay?: number
  repeatInterval?: number
  maskType?: 'subnet' | 'supernet'
  style?: React.CSSProperties
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides
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

// Inline button + input styles preserved from the legacy theme so the
// chrome doesn't regress while the IPAM family migrates.
const buttonContainerStyle: React.CSSProperties = {
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
}

const buttonStyle = (isDisabled: boolean): React.CSSProperties => ({
  padding: 0,
  width: '1rem',
  height: '1rem',
  minWidth: '1rem',
  minHeight: '1rem',
  borderRadius: '0.125rem',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  color: 'currentColor',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: isDisabled ? 0.5 : 1,
})

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  background: 'transparent',
  outline: 'none',
  border: '1px solid rgba(0,0,0,0.2)',
  borderRadius: '8px',
  padding: '8px 60px 8px 16px',
  fontSize: '16px',
  boxSizing: 'border-box',
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
  helperText,
  error,
  dataField,
  dataFieldName,
  required,
  disabled,
  styles,
  onFocus,
  onBlur,
  onKeyDown,
  onClick,
  placeholder,
  id,
  name,
  autoComplete,
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
  const inputRef = useRef<HTMLInputElement>(null)

  const subnetInfo = calculateSubnetInfo(parseInt(currentValue) || effectiveMin)

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
        onChange?.(effectiveMin)
        return
      }
      const numValue = parseInt(newValue, 10)
      let finalNum: number
      if (isNaN(numValue) || numValue < effectiveMin) {
        finalNum = effectiveMin
        setCurrentValue(effectiveMin.toString())
      } else if (numValue > effectiveMax) {
        finalNum = effectiveMax
        setCurrentValue(effectiveMax.toString())
      } else {
        finalNum = numValue
        setCurrentValue(newValue)
      }
      onChange?.(finalNum)
    },
    [onChange, effectiveMin, effectiveMax]
  )

  // Listen for native 'input' events from browser-automation tools
  // that bypass React's synthetic-event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== subnetInfo.mask) {
        handleTextFieldChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [subnetInfo.mask, handleTextFieldChange])

  return (
    <div style={style} data-field={dataField}>
      <FieldShell
        label={label}
        helperText={helperText}
        error={error}
        disabled={disabled}
        required={required}
        dataFieldName={dataFieldName}
        styles={styles}
      >
        {({ inputId, inputAriaProps }) => (
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              ref={inputRef}
              id={id ?? inputId}
              name={name}
              data-field-name={dataFieldName}
              autoComplete={autoComplete}
              value={subnetInfo.mask}
              disabled={disabled}
              required={required}
              onChange={e => handleTextFieldChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onClick={onClick}
              placeholder={placeholder}
              type="text"
              inputMode="numeric"
              style={inputStyle}
              {...inputAriaProps}
            />
            <div style={buttonContainerStyle}>
              <button
                type="button"
                aria-label="Increase subnet mask"
                onMouseDown={handleIncrementMouseDown}
                disabled={disabled}
                style={buttonStyle(!!disabled)}
              >
                <ArrowDropUpIcon style={{ fontSize: '1.25rem' }} />
              </button>
              <button
                type="button"
                aria-label="Decrease subnet mask"
                onMouseDown={handleDecrementMouseDown}
                disabled={disabled}
                style={buttonStyle(!!disabled)}
              >
                <ArrowDropDownIcon style={{ fontSize: '1.25rem' }} />
              </button>
            </div>
          </div>
        )}
      </FieldShell>
    </div>
  )
}

export interface SubnetFieldValue {
  address: string
  mask: number
}

export interface SubnetFieldProps {
  /**
   * Object payload — `{ address, mask }` is the value of a SubnetField.
   * Kept structural rather than primitive because address + mask are
   * jointly meaningful (a /24 with no address is meaningless, etc.).
   */
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
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides
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
  helperText,
  error: errorProp,
  dataField,
  dataFieldName,
  styles,
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
    (newMask: number) => {
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

  // Local out-of-range error wins unless caller passed an explicit
  // `error` prop. The inner increment field surfaces this.
  const localError = !isValidSubnet
    ? 'Subnet is outside the supernet range'
    : undefined
  const shellError = errorProp ?? localError

  return (
    <div style={style} data-field={dataField} data-field-name={dataFieldName}>
      <InternalIncrementNumberField
        initialValue={mask.toString()}
        onChange={handleMaskChange}
        label={label}
        min={min as number}
        max={max as number}
        maskType={maskType}
        required={required}
        disabled={disabled}
        style={{ width: '100%' }}
        {...(helperText !== undefined ? { helperText } : {})}
        {...(shellError !== undefined ? { error: shellError } : {})}
        {...(styles !== undefined ? { styles } : {})}
      />
      <div
        style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
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
                marginTop: '0.25rem',
                fontStyle: 'italic',
                color: !isValidSubnet ? '#EF4444' : undefined,
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

SubnetField.displayName = 'SubnetField'

export default SubnetField

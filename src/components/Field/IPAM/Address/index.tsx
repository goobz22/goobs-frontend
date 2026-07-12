'use client'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import cssStyles from './Address.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'
import Typography from '../../../../components/Typography'

export interface IPAddressFieldProps {
  /** Seed for the internal value (default ''). The field is not value-controlled; edits flow out via `onChange`. */
  initialValue?: string
  /**
   * Emits the formatted/validated IP string. Was previously a synthetic
   * ChangeEvent — collapsed to the value alone during the FieldShell
   * migration. Callers that want the input element should grab it from
   * a ref / their own onBlur instead.
   */
  onChange?: (value: string) => void
  /** Field label (default 'IP Address'). */
  label?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Form-engine binding key. Inside a `<Form>` with `name` set, the formatted
   * IP string is written into the engine on change and the field is marked
   * touched on blur; the shell auto-derives error/required for this name.
   * Binds the primary IP value (the range start/end inputs stay parent-driven).
   * Outside a form this is inert and behaviour is byte-for-byte unchanged.
   */
  name?: string
  required?: boolean
  disabled?: boolean
  styles?: FieldStyleOverrides
  /** Treats partially-typed addresses as valid-so-far (default true); when false, only a complete 4-octet address validates. */
  allowIncomplete?: boolean
  /** Auto-appends a '.' once an octet reaches 3 digits (default true; suppressed while deleting). */
  autoInsertDots?: boolean
  /** Network address paired with `subnetMask` for membership validation of the initial value. */
  defaultNetwork?: string
  /** Dotted-decimal mask paired with `defaultNetwork`. */
  subnetMask?: string
  /** Subnet address paired with `subnetCIDR`: the value must sit inside this subnet (and its usable range, unless `isGateway`). */
  subnetAddress?: string
  /** CIDR prefix length paired with `subnetAddress`. */
  subnetCIDR?: number
  /** Validates the value as a gateway: inside the subnet but not its network or broadcast address. */
  isGateway?: boolean
  /** Marks this input as one end of an IP range; pair with `isStartIP`/`isEndIP` and the opposite end's value. */
  isRange?: boolean
  /** This input is the range start; validated as <= `endIPValue`. */
  isStartIP?: boolean
  /** This input is the range end; validated as >= `startIPValue`. */
  isEndIP?: boolean
  /** The opposite (end) IP used for range-order validation, and the end input's value in `renderAsRange` mode. */
  endIPValue?: string
  /** The opposite (start) IP used for range-order validation, and the start input's value in `renderAsRange` mode. */
  startIPValue?: string
  /** Renders paired start/end inputs in one row instead of a single input. */
  renderAsRange?: boolean
  /**
   * Same value-only shape as `onChange`; emits the formatted end-IP
   * string when `renderAsRange` is true.
   */
  onEndIPChange?: (value: string) => void
  onEndIPBlur?: () => void
  errorEnd?: boolean
  showAvailableRange?: boolean
  gatewayIP?: string
  availableRangeMessage?: string
  placeholder?: string
}

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
  subnetCIDR: number
): { start: string; end: string } | null => {
  if (!isValidIPAddress(subnetAddress) || !subnetCIDR) return null
  const subnetMask = cidrToMask(subnetCIDR)
  const range = calculateNetworkRange(subnetAddress, subnetMask)
  const networkNum = ipToNumber(range.start)
  const broadcastNum = ipToNumber(range.end)
  const usableStart = networkNum + 1
  const usableEnd = broadcastNum - 1
  return { start: numToIP(usableStart), end: numToIP(usableEnd) }
}

const numToIP = (num: number): string =>
  [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(
    '.'
  )

// Input chrome (height, padding, border) lives in Address.module.css.

const IPAddressField: React.FC<IPAddressFieldProps> = ({
  initialValue = '',
  onChange: onChangeProp,
  label = 'IP Address',
  helperText,
  error: errorProp,
  dataField,
  dataFieldName,
  name,
  required,
  disabled,
  styles,
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
}) => {
  // Tier-1 form binding: inside a <Form> with `name`, the formatted primary IP
  // string is written into the engine on change (original onChange still fires)
  // and the field is marked touched via boundOnBlur. No controlled `value` prop
  // exists — this field renders from internal state — so the hook's
  // value-from-store is unused; only onChange/onBlur are taken over when bound.
  const { onChange, onBlur: boundOnBlur } = useFieldBinding<string>({
    name,
    onChange: onChangeProp,
  })
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidIPAddress(initialValue)
  )
  const [isInNetwork, setIsInNetwork] = useState<boolean>(true)
  const [isInSubnet, setIsInSubnet] = useState<boolean>(true)
  const [isValidRange, setIsValidRange] = useState<boolean>(true)
  const lastInputTypeWasDelete = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
        // Keys that must pass through so the field stays keyboard-navigable
        // (WCAG 2.1.1 Keyboard). Beyond the edit/erase keys, this includes the
        // caret-navigation keys Home / End / ArrowUp / ArrowDown — a text input
        // is expected to honour them (and Shift+Home/End range-selection), so
        // preventDefault-ing them trapped keyboard users who couldn't jump to
        // the start/end of the address to fix an octet. Only genuinely invalid
        // character keys are still blocked; the formatter sanitises the rest.
        const controlKeys = [
          'Backspace',
          'Delete',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Home',
          'End',
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

  // Listen for native 'input' events from browser-automation tools
  // that bypass React's synthetic-event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== value) {
        const formatted = formatIPAddress(
          target.value,
          lastInputTypeWasDelete.current
        )
        const valid = validateIPAddress(formatted)
        setIsValid(valid)
        setValue(formatted)
        onChange?.(formatted)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value, formatIPAddress, validateIPAddress])

  // Combined error: invalid format / outside subnet / outside network /
  // bad gateway / range-order. The explicit `error` prop wins so callers
  // can surface server-side validation regardless of local state.
  const localError =
    !isValid || !isInNetwork || !isInSubnet
      ? 'Please enter a valid IP address'
      : undefined
  const shellError = errorProp ?? localError

  if (renderAsRange) {
    const handleStartIPChange = (val: string) => {
      onChange?.(val)
    }

    const handleEndIPChange = (val: string) => {
      onEndIPChange?.(val)
    }

    const rangeError = !isValidRange ? 'Invalid IP range' : undefined

    // In range mode the FieldShell label is only rendered once the paired
    // input holds a value (`startIPValue ? label : ''`), so an empty range
    // input would otherwise have NO programmatic name at all (WCAG 1.3.1 /
    // 4.1.2 / 3.3.2). Give each input a stable aria-label — derived from the
    // field label so the visible label text is contained in the accessible
    // name (WCAG 2.5.3 Label in Name) — that also distinguishes start from end
    // for screen-reader users, who would otherwise hear two identical fields.
    const baseRangeLabel = label || 'IP address'
    const startAriaLabel = `${baseRangeLabel} range start`
    const endAriaLabel = `${baseRangeLabel} range end`

    return (
      <div className={cssStyles.rangeRoot} data-field={dataField}>
        {availableRangeMessage && (
          <Typography>{availableRangeMessage}</Typography>
        )}
        <div className={cssStyles.rangeFields}>
          <div className={cssStyles.rangeField}>
            <FieldShell
              label={startIPValue ? label : ''}
              error={rangeError}
              disabled={disabled}
              required={required}
              name={name}
              filled={Boolean(startIPValue && startIPValue.length > 0)}
              styles={styles}
            >
              {({ inputId, inputAriaProps }) => (
                <input
                  id={inputId}
                  data-field-name={dataFieldName ?? name}
                  type="text"
                  value={startIPValue || ''}
                  disabled={disabled}
                  required={required}
                  aria-label={startAriaLabel}
                  onChange={e => handleStartIPChange(e.target.value)}
                  onBlur={() => {
                    onEndIPBlur?.()
                    boundOnBlur?.()
                  }}
                  placeholder={placeholder || '192.168.0.1'}
                  className={cssStyles.input}
                  {...inputAriaProps}
                />
              )}
            </FieldShell>
          </div>
          <Typography>-</Typography>
          <div className={cssStyles.rangeField}>
            <FieldShell
              label={endIPValue ? label : ''}
              error={errorEnd || !isValidRange ? 'Invalid IP range' : undefined}
              disabled={disabled}
              required={required}
              styles={styles}
            >
              {({ inputId, inputAriaProps }) => (
                <input
                  id={inputId}
                  type="text"
                  value={endIPValue || ''}
                  disabled={disabled}
                  required={required}
                  aria-label={endAriaLabel}
                  onChange={e => handleEndIPChange(e.target.value)}
                  onBlur={onEndIPBlur}
                  placeholder={placeholder || '192.168.0.255'}
                  className={cssStyles.input}
                  {...inputAriaProps}
                />
              )}
            </FieldShell>
          </div>
        </div>
      </div>
    )
  }

  const handleTextFieldChange = (newValue: string) => {
    const formatted = formatIPAddress(newValue, lastInputTypeWasDelete.current)
    const valid = validateIPAddress(formatted)
    setIsValid(valid)
    setValue(formatted)
    onChange?.(formatted)
  }

  // Filled when the IP string holds at least one character.
  const hasValue = Boolean(value && value.length > 0)

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={shellError}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      name={name}
      filled={hasValue}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <input
          ref={inputRef}
          id={inputId}
          data-field-name={dataFieldName ?? name}
          type="text"
          value={value}
          disabled={disabled}
          required={required}
          onChange={e => handleTextFieldChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => boundOnBlur?.()}
          placeholder={placeholder}
          className={cssStyles.input}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

IPAddressField.displayName = 'IPAddressField'

export default IPAddressField

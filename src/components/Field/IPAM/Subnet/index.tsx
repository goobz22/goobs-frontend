'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './Subnet.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

/**
 * Props for the internal mask-stepper field that SubnetField composes.
 * Renamed from `InternalIncrementNumberFieldProps`, which collided with the
 * barrel-exported interface of `Field/Number/InternalIncrement` (a different
 * shape). Internal to this module — SubnetField callers use SubnetFieldProps.
 */
export interface SubnetMaskIncrementFieldProps {
  /** Seed CIDR for the internal mask state (default '16'), clamped to min/max. */
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
  /**
   * Programmatic accessible name applied when no visible label renders.
   * Forwarded to FieldShell, which sets it as the input's `aria-label` ONLY
   * when `label` is absent (WCAG 2.5.3 Label in Name); ignored when a visible
   * label is set.
   */
  ariaLabel?: string
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
    hosts: totalHosts.toLocaleString('en-US'),
    usableHosts: usableHosts.toLocaleString('en-US'),
  }
}

// Button + input chrome lives in Subnet.module.css. Disabled state is
// driven by the native :disabled pseudo-class.

const InternalIncrementNumberField: React.FC<
  SubnetMaskIncrementFieldProps
> = ({
  initialValue = '16',
  onChange: onChangeProp,
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
  ariaLabel,
  id,
  name,
  autoComplete,
}) => {
  // Tier-1 form binding: inside a <Form> with `name` (and no controlled value —
  // this field is initialValue/internal-state based), the numeric mask is
  // written into the form engine on change. Outside a form, onChange passes
  // through unchanged (back-compat path). No `value` prop exists, so the hook's
  // value-from-store is unused here; the field renders from internal state.
  const { onChange } = useFieldBinding<number>({
    name,
    onChange: onChangeProp,
  })
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

  // Keyboard activation for the stepper buttons (WCAG 2.1.1). The +/- steppers
  // previously only had `onMouseDown` (to drive the press-and-hold repeat), so
  // a keyboard Enter/Space — which dispatches a `click`, never a mousedown —
  // left the focusable buttons completely inert. A keyboard-synthesised click
  // has `detail === 0`; a real pointer click has `detail >= 1` and its step has
  // already fired on mousedown, so this guard adds one keyboard step without
  // double-firing for the mouse.
  const handleIncrementClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) handleIncrement()
    },
    [handleIncrement]
  )
  const handleDecrementClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) handleDecrement()
    },
    [handleDecrement]
  )

  // Spinbutton keyboard completeness (WCAG 2.1.1). The mask field is
  // functionally a spinbutton (a CIDR value plus +/- steppers), so a keyboard
  // user who focuses the input expects Up/Down arrows to step the mask —
  // otherwise the only keyboard path to a step is Tab-ing away to the separate
  // +/- buttons. ArrowUp/ArrowDown reuse the existing clamped increment/
  // decrement handlers. The caller's onKeyDown still runs first and can
  // preventDefault to opt out. The element stays role="textbox" so the
  // machine-test `getByRole('textbox', { name })` selector contract is kept.
  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleIncrement()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleDecrement()
      }
    },
    [onKeyDown, handleIncrement, handleDecrement]
  )

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

  // Filled whenever a (always-present) numeric mask value is set.
  const hasValue =
    currentValue !== '' && !Number.isNaN(parseInt(currentValue, 10))

  return (
    <div style={style} data-field={dataField}>
      <FieldShell
        id={id}
        ariaLabel={ariaLabel}
        label={label}
        helperText={helperText}
        error={error}
        disabled={disabled}
        required={required}
        dataFieldName={dataFieldName}
        name={name}
        filled={hasValue}
        styles={styles}
      >
        {({ inputId, inputAriaProps }) => (
          <div className={cssStyles.inputContainer}>
            <input
              ref={inputRef}
              id={inputId}
              name={name}
              data-field-name={dataFieldName ?? name}
              autoComplete={autoComplete}
              value={subnetInfo.mask}
              disabled={disabled}
              required={required}
              onChange={e => handleTextFieldChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={handleInputKeyDown}
              onClick={onClick}
              placeholder={placeholder}
              type="text"
              inputMode="numeric"
              className={cssStyles.input}
              {...inputAriaProps}
            />
            <div className={cssStyles.buttonContainer}>
              <button
                type="button"
                aria-label="Increase subnet mask"
                data-action="increment"
                onMouseDown={handleIncrementMouseDown}
                onClick={handleIncrementClick}
                disabled={disabled}
                className={cssStyles.button}
              >
                <ArrowDropUpIcon aria-hidden style={{ fontSize: '1.25rem' }} />
              </button>
              <button
                type="button"
                aria-label="Decrease subnet mask"
                data-action="decrement"
                onMouseDown={handleDecrementMouseDown}
                onClick={handleDecrementClick}
                disabled={disabled}
                className={cssStyles.button}
              >
                <ArrowDropDownIcon
                  aria-hidden
                  style={{ fontSize: '1.25rem' }}
                />
              </button>
            </div>
          </div>
        )}
      </FieldShell>
    </div>
  )
}

/** The structural value of a SubnetField: an IPv4 address plus a CIDR mask length. */
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
  /**
   * Emits the updated `{ address, mask }` object — the plain value, not a
   * DOM event — on every mask change.
   */
  onChange: (value: SubnetFieldValue) => void
  /** Field label on the mask stepper (default 'Subnet'). */
  label?: string
  required?: boolean
  /** Mask (CIDR) lower clamp. Defaults 16 for maskType 'subnet', 8 for 'supernet'. */
  min?: number
  /** Mask (CIDR) upper clamp. Defaults 32 for maskType 'subnet', 23 for 'supernet'. */
  max?: number
  /** Selects the default mask bracket: 'subnet' (/16–/32, default) or 'supernet' (/8–/23). */
  maskType?: 'subnet' | 'supernet'
  /** Inline style on the outer wrapper div. */
  style?: React.CSSProperties
  /** Parent supernet address. With `supernetMask`, the subnet is validated to sit inside its range and the available range is displayed. */
  supernetAddress?: string
  /** Parent supernet mask — a CIDR number-string or dotted-decimal — paired with `supernetAddress`. */
  supernetMask?: string
  disabled?: boolean
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Form-engine binding key. Inside a `<Form>` with `name` set and no explicit
   * `value`, the `{ address, mask }` object is read from / written to the form
   * engine. Outside a form (every existing callsite passes an explicit
   * `value`) this is inert and behaviour is byte-for-byte unchanged.
   */
  name?: string
  /**
   * Programmatic accessible name applied when no visible label renders.
   * Forwarded through the internal mask stepper to FieldShell, which sets it
   * as the input's `aria-label` ONLY when `label` is absent (WCAG 2.5.3 Label
   * in Name); ignored when a visible label is set.
   */
  ariaLabel?: string
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

/**
 * Subnet editor: a dotted-decimal mask display with press-and-hold +/- CIDR
 * stepper buttons (built on FieldShell) plus a live CIDR/host-count summary,
 * and an out-of-range error when the subnet falls outside the optional
 * supernet. `onChange` emits the plain `{ address, mask }` object — not a DOM
 * event. Auto-binds that object by `name` inside a goobs `<Form>` when no
 * explicit `value` is passed; otherwise controlled via `value`.
 */
const SubnetField: React.FC<SubnetFieldProps> = ({
  value: valueProp,
  onChange: onChangeProp,
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
  name,
  ariaLabel,
  styles,
}) => {
  // Tier-1 form binding: inside a <Form> with `name` and no explicit `value`,
  // the { address, mask } object is read from / written to the form engine.
  // Outside a form (every existing callsite passes an explicit object value),
  // this returns value/onChange unchanged (back-compat path).
  const { value: boundValue, onChange } = useFieldBinding<SubnetFieldValue>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })
  const value: SubnetFieldValue = boundValue ??
    valueProp ?? { address: '', mask: maskType === 'supernet' ? 8 : 16 }

  const [address, setAddress] = useState<string>(value.address || '')
  const [mask, setMask] = useState<number>(
    value.mask || (maskType === 'supernet' ? 8 : 16)
  )
  // `networkRange` and `isValidSubnet` used to be state written from effects.
  // Both are PURE functions of the props + the two pieces of real state above,
  // so they are derived with useMemo below instead: an effect that only ever
  // recomputes a value from its own render inputs paints one stale frame first
  // and then re-renders (react-hooks/set-state-in-effect).

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

  // Re-seed the local draft from an incoming `value` (or a `maskType` switch,
  // which changes the mask default) WITHOUT an effect — React's documented
  // "adjusting state when a prop changes" pattern. The seed key carries every
  // dependency the old effect listed, so the re-seed fires on exactly the same
  // transitions, but during render instead of after paint.
  const seed = [value.address ?? '', value.mask ?? '', maskType].join(' ')
  const [lastSeed, setLastSeed] = useState<string>(seed)
  if (lastSeed !== seed) {
    setLastSeed(seed)
    setAddress(value.address || '')
    setMask(value.mask || (maskType === 'supernet' ? 8 : 16))
  }

  // Pure derivation of the supernet range (was an effect writing state).
  const networkRange = React.useMemo<{
    start: string
    end: string
    cidr: number
  } | null>(() => {
    if (!supernetAddress || !supernetMask) return null
    try {
      const cidr =
        typeof supernetMask === 'string' && supernetMask.includes('.')
          ? maskToCidr(supernetMask)
          : Number(supernetMask)
      const range = calculateNetworkRange(supernetAddress, cidr)
      return { start: range.start, end: range.end, cidr }
    } catch (err) {
      console.error('Error calculating network range:', err)
      return null
    }
  }, [supernetAddress, supernetMask])

  // Pure derivation of the in-supernet check (was an effect writing state).
  // Same short-circuits, same order, same result as the effect it replaces.
  const isValidSubnet = React.useMemo<boolean>(() => {
    if (!address || !supernetAddress || !supernetMask || !networkRange) {
      return true
    }
    const segments = address.split('.')
    if (segments.length !== 4 || segments.some(s => s === '')) {
      return true
    }
    const subnetMaskStr =
      typeof supernetMask === 'number' || !isNaN(Number(supernetMask))
        ? cidrToMaskFn(Number(supernetMask))
        : supernetMask
    return isIPInNetwork(address, supernetAddress, subnetMaskStr)
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
      // onChange is the (possibly form-bound) writer; it is always defined at
      // runtime (bound writer, or the required onChange prop) — the optional
      // call only satisfies the hook's optional return type.
      onChange?.({ address, mask: newMask })
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
      hosts: totalHosts.toLocaleString('en-US'),
      usableHosts: usableHosts.toLocaleString('en-US'),
    }
  }

  // Local out-of-range error wins unless caller passed an explicit
  // `error` prop. The inner increment field surfaces this.
  const localError = !isValidSubnet
    ? 'Subnet is outside the supernet range'
    : undefined
  const shellError = errorProp ?? localError

  // Filled when the subnet object carries a meaningful address.
  const hasValue = Boolean(value.address && value.address.length > 0)

  return (
    <div
      style={style}
      data-field={dataField}
      data-field-name={dataFieldName ?? name}
      data-filled={hasValue || undefined}
    >
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
        {...(ariaLabel !== undefined ? { ariaLabel } : {})}
      />
      {/* The readout sits outside FieldShell, so mirror the shell's theme
          resolution (styles.theme, sacred default) for the module's
          [data-theme] color overrides — otherwise it renders page-default
          black on dark/sacred surfaces. */}
      <div
        className={cssStyles.subnetInfo}
        data-theme={styles?.theme ?? 'sacred'}
        // The readout recomputes as the mask changes but sits outside the
        // input's focus, so screen-reader users would never hear the new
        // CIDR/host counts / available range. A polite live region announces
        // them without interrupting typing (WCAG 4.1.3 Status Messages).
        role="status"
        aria-live="polite"
      >
        <div>Subnet CIDR: /{mask}</div>
        <div>
          Total Hosts: {subnetInfo.hosts} ({subnetInfo.usableHosts} usable)
        </div>
        {networkRange && (
          <>
            <div className={cssStyles.supernetCidr}>
              Supernet CIDR: /{networkRange.cidr}
            </div>
            <div>
              Total Hosts: {calculateSupernetHosts(networkRange.cidr).hosts} (
              {calculateSupernetHosts(networkRange.cidr).usableHosts} usable)
            </div>
            <div
              className={
                isValidSubnet
                  ? cssStyles.availableRange
                  : `${cssStyles.availableRange} ${cssStyles.outOfRange}`
              }
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

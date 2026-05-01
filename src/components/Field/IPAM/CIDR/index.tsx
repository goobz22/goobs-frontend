'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface CIDRFieldProps {
  initialValue?: string
  /**
   * Emits the new CIDR as a number. Was previously polymorphic
   * `(event | number) => void` — collapsed to `(value: number) => void`
   * during the FieldShell migration.
   */
  onChange?: (value: number) => void
  initialDelay?: number
  repeatInterval?: number
  minCidr?: number
  maxCidr?: number
  showSubnetInfo?: boolean
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  required?: boolean
  disabled?: boolean
  styles?: FieldStyleOverrides
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  autoComplete?: string
}

const calculateCIDRInfo = (cidr: number) => {
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
  const networks = Math.pow(2, 32 - cidr)

  return {
    mask,
    networks: networks.toLocaleString(),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

// Inline button + input styles preserved from the legacy theme so the
// chrome (height, increment buttons, padding) doesn't regress while
// the IPAM family migrates.
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

const CIDRField: React.FC<CIDRFieldProps> = ({
  initialValue = '24',
  onChange,
  label = 'CIDR',
  initialDelay = 500,
  repeatInterval = 100,
  minCidr = 8,
  maxCidr = 32,
  showSubnetInfo = true,
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
  autoComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue, 10)
    if (isNaN(initialNum)) return '24'
    return Math.min(Math.max(initialNum, minCidr), maxCidr).toString()
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cidrInfo = calculateCIDRInfo(parseInt(currentValue, 10) || 24)

  // Note: clearTimers can reference itself in useCallback because the function
  // is stable (empty deps) and uses closures over refs, not direct self-reference
  const clearTimers = useCallback(function clearTimersHandler() {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    initialTimerRef.current = null
    timerRef.current = null
    // Remove listeners added during press-and-hold using the named function
    document.removeEventListener('mouseup', clearTimersHandler)
    document.removeEventListener('mouseleave', clearTimersHandler)
  }, [])

  const handleIncrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev, 10)
      const newValue = Math.min(maxCidr, isNaN(num) ? minCidr : num + 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, maxCidr, minCidr])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev, 10)
      const newValue = Math.max(minCidr, isNaN(num) ? minCidr : num - 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, minCidr])

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
      const newValue = value.replace(/[^0-9/]/g, '').replace('/', '')
      if (newValue === '') {
        setCurrentValue(minCidr.toString())
        onChange?.(minCidr)
        return
      }
      const numValue = parseInt(newValue, 10)
      let finalNum: number
      if (isNaN(numValue) || numValue < minCidr) {
        finalNum = minCidr
        setCurrentValue(minCidr.toString())
      } else if (numValue > maxCidr) {
        finalNum = maxCidr
        setCurrentValue(maxCidr.toString())
      } else {
        finalNum = numValue
        setCurrentValue(newValue)
      }
      onChange?.(finalNum)
    },
    [onChange, minCidr, maxCidr]
  )

  // Listen for native 'input' events from browser-automation tools
  // that bypass React's synthetic-event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== `/${currentValue}`) {
        handleTextFieldChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [currentValue, handleTextFieldChange])

  return (
    <div data-field={dataField}>
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
              data-field-name={dataFieldName}
              autoComplete={autoComplete}
              value={`/${currentValue}`}
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
                aria-label="Increase CIDR"
                onMouseDown={handleIncrementMouseDown}
                disabled={disabled}
                style={buttonStyle(!!disabled)}
              >
                <ArrowDropUpIcon style={{ fontSize: '1.25rem' }} />
              </button>
              <button
                type="button"
                aria-label="Decrease CIDR"
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

      {showSubnetInfo && (
        <div
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div>Subnet Mask: {cidrInfo.mask}</div>
          <div>
            Total Hosts: {cidrInfo.totalHosts} ({cidrInfo.usableHosts} usable)
          </div>
          <div>Networks: {cidrInfo.networks}</div>
        </div>
      )}
    </div>
  )
}

CIDRField.displayName = 'CIDRField'

export default CIDRField

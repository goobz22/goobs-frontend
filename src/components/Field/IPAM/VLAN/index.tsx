'use client'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

// VLAN ID constraints
const MIN_VLAN_ID = 1
const MAX_VLAN_ID = 4094

export interface VLANFieldProps {
  initialValue?: string
  /**
   * Emits the new VLAN ID as a number. Was previously polymorphic
   * `(event | number) => void` — collapsed to `(value: number) => void`
   * during the FieldShell migration.
   */
  onChange?: (value: number) => void
  label?: string
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
  /** Array of reserved VLAN IDs that can't be used */
  reservedVLANs?: number[]
  initialDelay?: number
  repeatInterval?: number
  placeholder?: string
  id?: string
  name?: string
  autoComplete?: string
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

/**
 * A specialized field for VLAN ID entry
 * - Validates VLAN ID ranges (1-4094)
 * - Provides increment/decrement buttons
 * - Supports reserved VLAN ID validation
 * - Prevents entry of non-numeric characters
 */
const VLANField: React.FC<VLANFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'VLAN ID',
  helperText,
  error: errorProp,
  dataField,
  dataFieldName,
  required,
  disabled,
  styles,
  reservedVLANs = [],
  initialDelay = 500,
  repeatInterval = 100,
  placeholder = `${MIN_VLAN_ID}-${MAX_VLAN_ID}`,
  id,
  name,
  autoComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pure validation — returns the canonical error message for a given
  // input string (or undefined if the input is empty / valid). Kept as
  // a memoized callback so it doesn't churn on every keystroke.
  const getValidationError = useCallback(
    (vlanStr: string): string | undefined => {
      if (!vlanStr) return undefined

      const vlanId = parseInt(vlanStr, 10)
      if (isNaN(vlanId)) return 'VLAN ID must be a number'
      if (vlanId < MIN_VLAN_ID) return `VLAN ID must be at least ${MIN_VLAN_ID}`
      if (vlanId > MAX_VLAN_ID) return `VLAN ID cannot exceed ${MAX_VLAN_ID}`
      if (reservedVLANs.includes(vlanId)) {
        return `VLAN ID ${vlanId} is reserved and cannot be used`
      }

      return undefined
    },
    [reservedVLANs]
  )

  // Derived state — the validation error for the current input. Errors
  // from the caller (`errorProp`) override local validation so server-
  // side errors (duplicate VLAN, etc.) can surface.
  const localError = useMemo(
    () => getValidationError(currentValue),
    [currentValue, getValidationError]
  )
  const shellError = errorProp ?? localError

  // Sync incoming initialValue → state (parent-controlled value flow).
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue)
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue)
    if (initialValue) {
      setCurrentValue(initialValue)
    }
  }

  // Skip-reserved helper: when incrementing/decrementing past a reserved
  // VLAN, walk forward (wrapping at MAX → MIN) until we find an unused
  // ID. Matches the legacy behaviour from the pre-migration component.
  const skipReserved = useCallback(
    (start: number): number => {
      if (!reservedVLANs.includes(start)) return start
      let next = start
      const maxIterations = MAX_VLAN_ID - MIN_VLAN_ID
      let iterations = 0
      while (reservedVLANs.includes(next) && iterations < maxIterations) {
        next = next >= MAX_VLAN_ID ? MIN_VLAN_ID : next + 1
        iterations++
      }
      return next
    },
    [reservedVLANs]
  )

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    initialTimerRef.current = null
    timerRef.current = null
  }, [])

  const handleIncrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev, 10)
      const next = Math.min(MAX_VLAN_ID, isNaN(num) ? MIN_VLAN_ID : num + 1)
      const final = skipReserved(next)
      onChange?.(final)
      return final.toString()
    })
  }, [onChange, skipReserved])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev, 10)
      const next = Math.max(MIN_VLAN_ID, isNaN(num) ? MIN_VLAN_ID : num - 1)
      const final = skipReserved(next)
      onChange?.(final)
      return final.toString()
    })
  }, [onChange, skipReserved])

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

  useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleTextFieldChange = useCallback(
    (val: string) => {
      const stripped = val.replace(/[^0-9]/g, '')
      setCurrentValue(stripped)
      // Only emit when we have a complete-and-valid value so consumers
      // don't see in-progress numbers like `1` (briefly < MIN) when the
      // user is mid-typing `15`.
      const parsed = parseInt(stripped, 10)
      if (!isNaN(parsed) && getValidationError(stripped) === undefined) {
        onChange?.(parsed)
      }
    },
    [onChange, getValidationError]
  )

  // Listen for native 'input' events from browser-automation tools that
  // bypass React's synthetic-event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== currentValue) {
        handleTextFieldChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [currentValue, handleTextFieldChange])

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={shellError}
      disabled={disabled}
      required={required}
      dataField={dataField}
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
            value={currentValue}
            disabled={disabled}
            required={required}
            onChange={e => handleTextFieldChange(e.target.value)}
            placeholder={placeholder}
            type="text"
            inputMode="numeric"
            style={inputStyle}
            {...inputAriaProps}
          />
          <div style={buttonContainerStyle}>
            <button
              type="button"
              aria-label="Increase VLAN ID"
              onMouseDown={handleIncrementMouseDown}
              disabled={disabled}
              style={buttonStyle(!!disabled)}
            >
              <ArrowDropUpIcon style={{ fontSize: '1.25rem' }} />
            </button>
            <button
              type="button"
              aria-label="Decrease VLAN ID"
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
  )
}

VLANField.displayName = 'VLANField'

export default VLANField

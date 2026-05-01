'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'

export interface CVVProps {
  /** Fires on every edit with the digits-only CVV string. */
  onChange?: (value: string) => void
  /** Optional side-channel for validity changes. */
  onValidityChange?: (isValid: boolean) => void
  minLength?: number
  maxLength?: number
  isDefaultValue?: boolean
  value?: string
  label?: React.ReactNode
  placeholder?: string
  id?: string
  /** Forwarded to the input as `name` for native form submission. */
  name?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  disabled?: boolean
  styles?: FieldStyleOverrides
}

const CVV: React.FC<CVVProps> = ({
  onChange,
  onValidityChange,
  value = '',
  minLength = 3,
  maxLength = 4,
  isDefaultValue = false,
  label = 'CVV',
  placeholder = '123',
  id,
  name,
  onFocus,
  onBlur,
  helperText,
  error,
  dataField,
  dataFieldName,
  disabled: disabledProp,
  styles,
}) => {
  const [internalValue, setInternalValue] = useState<string>(value || '')
  // Tracks focus for the masked default-value display flip only.
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = disabledProp ?? styles?.disabled ?? false
  const required = styles?.required || false

  const validateCVV = useCallback(
    (cvv: string): boolean => {
      const trimmedValue = cvv.trim()
      if (trimmedValue === '') return true
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)
      const isValidLength =
        trimmedValue.length >= minLength && trimmedValue.length <= maxLength
      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/\D/g, ''),
    []
  )
  const maskCVV = useCallback(
    (cvv: string): string => (!cvv ? cvv : '*'.repeat(cvv.length)),
    []
  )

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskCVV(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCVV]
  )

  // Track previous value prop for derived state pattern
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setInternalValue(value || '')
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const formattedValue = formatInput(target.value)
      const truncatedValue = formattedValue.slice(0, maxLength)
      if (truncatedValue !== internalValue) {
        setInternalValue(truncatedValue)
        setHasBeenEdited(true)
        const valid = validateCVV(truncatedValue)
        onChange?.(truncatedValue)
        onValidityChange?.(valid)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [
    onChange,
    onValidityChange,
    internalValue,
    validateCVV,
    formatInput,
    maxLength,
  ])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      const truncatedValue = formattedValue.slice(0, maxLength)
      setInternalValue(truncatedValue)
      setHasBeenEdited(true)
      const valid = validateCVV(truncatedValue)
      onChange?.(truncatedValue)
      onValidityChange?.(valid)
    },
    [onChange, onValidityChange, validateCVV, formatInput, maxLength]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  // Inline-style chrome — see AccountNumber for the same pattern.
  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    width: '100%',
    border: '1px solid var(--field-border-default, hsl(0,0%,20%))',
    borderRadius: '8px',
    backgroundColor: 'var(--field-bg, transparent)',
    color: 'var(--field-text, inherit)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    padding: '8px 16px',
    paddingLeft: '48px',
    paddingRight: '16px',
    fontSize: '16px',
    color: 'inherit',
    boxSizing: 'border-box',
  }

  const adornmentStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '16px',
    color: 'var(--field-text, inherit)',
    pointerEvents: 'none',
    fontSize: '16px',
  }

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div style={inputWrapperStyle}>
          <div style={adornmentStyle}>
            <span>🔒</span>
          </div>
          <input
            ref={inputRef}
            type="password"
            id={id ?? inputId}
            name={name}
            value={getDisplayValue()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            autoComplete="cc-csc"
            data-field-name={dataFieldName}
            style={inputStyle}
            {...inputAriaProps}
          />
        </div>
      )}
    </FieldShell>
  )
}

CVV.displayName = 'CVV'
export default CVV

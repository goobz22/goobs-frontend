'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface MACAddressFieldProps {
  initialValue?: string
  /**
   * Emits the formatted MAC string. Was previously a synthetic
   * ChangeEvent — collapsed to the value alone during the FieldShell
   * migration.
   */
  onChange?: (value: string) => void
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
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  /**
   * Form-engine binding key. Inside a `<Form>` with `name` set, the formatted
   * MAC string is written into the engine on change and the field is marked
   * touched on blur; the shell auto-derives error/required for this name.
   * Outside a form this is inert and behaviour is byte-for-byte unchanged.
   */
  name?: string
  autoComplete?: string
}

/**
 * Validates if a string is a valid MAC address segment (2 hex digits)
 */
const isValidSegment = (segment: string): boolean => {
  if (segment === '') return true
  const validHexRegex = /^[0-9a-fA-F]{1,2}$/
  return validHexRegex.test(segment)
}

/**
 * Validates if a string is a valid complete MAC address
 */
const isValidMACAddress = (mac: string): boolean => {
  const segments = mac.split(':')
  if (segments.length !== 6) return false
  return segments.every(segment => isValidSegment(segment) && segment !== '')
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  background: 'transparent',
  outline: 'none',
  border: '1px solid rgba(0,0,0,0.2)',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '16px',
  boxSizing: 'border-box',
}

/**
 * A specialized text field for MAC address management
 * - Validates MAC addresses in proper format
 * - Automatically adds colons after every 2 hex digits
 * - Only allows valid MAC address format (XX:XX:XX:XX:XX:XX)
 * - Converts all inputs to uppercase
 * - Requires complete MAC addresses
 */
const MACAddressField: React.FC<MACAddressFieldProps> = ({
  initialValue = '',
  onChange: onChangeProp,
  label = 'MAC Address',
  helperText,
  error: errorProp,
  dataField,
  dataFieldName,
  required,
  disabled,
  styles,
  onFocus,
  onBlur,
  onKeyDown,
  onClick,
  onPaste: onPasteProp,
  placeholder,
  id,
  name,
  autoComplete,
}) => {
  // Tier-1 form binding: inside a <Form> with `name`, the formatted MAC string
  // is written into the engine on change (original onChange still fires) and
  // the field is marked touched via boundOnBlur. No controlled `value` prop
  // exists — this field renders from internal state — so the hook's
  // value-from-store is unused; only onChange/onBlur are taken over when bound.
  const { onChange, onBlur: boundOnBlur } = useFieldBinding<string>({
    name,
    onChange: onChangeProp,
  })
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidMACAddress(initialValue)
  )
  const lastInputTypeWasDelete = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Track previous initialValue for derived state pattern
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue)
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue)
    if (initialValue) {
      const validMAC = isValidMACAddress(initialValue)
      setIsValid(validMAC)
    }
  }

  const formatMACAddress = useCallback(
    (input: string, wasDelete: boolean): string => {
      // Replace any character that's not a hex digit or colon
      let formatted = input.replace(/[^0-9a-fA-F:]/g, '').toUpperCase()

      // Remove consecutive colons
      formatted = formatted.replace(/:{2,}/g, ':')

      // Remove colons at the beginning
      formatted = formatted.replace(/^:/, '')

      // Don't allow more than 5 colons
      const colons = formatted.match(/:/g)
      if (colons && colons.length > 5) {
        formatted = formatted.substring(0, formatted.lastIndexOf(':'))
      }

      // Make sure each segment is valid (max 2 hex chars)
      const segments = formatted.split(':')

      // Truncate any segments that are more than 2 characters
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i] ?? ''
        if (seg.length > 2) {
          segments[i] = seg.substring(0, 2)
        }
      }

      formatted = segments.join(':')

      // Auto-insert colons after 2 hex digits
      if (!wasDelete) {
        // Split by colons to get segments
        const segments = formatted.split(':')

        // Only process the last segment if it doesn't have a trailing colon
        // and we have less than 6 segments total
        if (segments.length < 6) {
          const lastSegment = segments[segments.length - 1] ?? ''

          // If the last segment has 2 hex digits and doesn't end with a colon, add a colon
          if (lastSegment.length === 2 && segments.length < 6) {
            formatted = formatted + ':'
          }
        }
      }

      return formatted
    },
    []
  )

  const validateMACAddress = useCallback((mac: string): boolean => {
    if (mac === '') return true

    // Only valid if it's a complete MAC address
    return isValidMACAddress(mac)
  }, [])

  const handleTextFieldChange = useCallback(
    (newValue: string) => {
      // Check if characters were deleted
      lastInputTypeWasDelete.current = newValue.length < value.length

      const formattedValue = formatMACAddress(
        newValue,
        lastInputTypeWasDelete.current
      )
      const valid = validateMACAddress(formattedValue)

      setValue(formattedValue)
      setIsValid(valid)
      onChange?.(formattedValue)
    },
    [onChange, formatMACAddress, validateMACAddress, value]
  )

  // Handle paste events to format them properly
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')

      // Format the pasted text without auto-inserting colons
      const formattedValue = formatMACAddress(pastedText, false)

      setValue(formattedValue)
      setIsValid(validateMACAddress(formattedValue))
      onChange?.(formattedValue)

      onPasteProp?.(event)
    },
    [formatMACAddress, onChange, validateMACAddress, onPasteProp]
  )

  // Listen for native 'input' events from browser-automation tools
  // that bypass React's synthetic-event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== value) {
        handleTextFieldChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [value, handleTextFieldChange])

  // Local format error wins unless caller passed an explicit `error`
  // prop (e.g. duplicate-MAC server-side validation).
  const localError = !isValid
    ? 'Please enter a valid MAC address (XX:XX:XX:XX:XX:XX)'
    : undefined
  const shellError = errorProp ?? localError

  // Filled when the MAC string holds at least one character.
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
          id={id ?? inputId}
          data-field-name={dataFieldName ?? name}
          autoComplete={autoComplete}
          value={value}
          disabled={disabled}
          required={required}
          onChange={e => handleTextFieldChange(e.target.value)}
          onFocus={onFocus}
          onBlur={event => {
            onBlur?.(event)
            boundOnBlur?.()
          }}
          onKeyDown={onKeyDown}
          onClick={onClick}
          onPaste={handlePaste}
          placeholder={placeholder ?? '00:1A:2B:3C:4D:5E'}
          style={inputStyle}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

MACAddressField.displayName = 'MACAddressField'

export default MACAddressField

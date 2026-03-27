'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'

export interface MACAddressFieldProps {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => getMacValue(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: React.ReactNode
  helperText?: string
  disabled?: boolean
  styles?: FormFieldStyles
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
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
  onChange,
  label = 'MAC Address',
  helperText,
  disabled,
  styles,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState<boolean>(
    initialValue === '' || isValidMACAddress(initialValue)
  )
  const [isFocused, setIsFocused] = useState(false)
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

      if (onChange) {
        // Create a synthetic event to match the expected signature
        const syntheticEvent = {
          target: { value: formattedValue },
          currentTarget: { value: formattedValue },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
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

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)
    },
    [formatMACAddress, onChange, validateMACAddress]
  )

  // Listen for native 'input' events to support browser automation tools
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

  const error = !isValid
    ? 'Please enter a valid MAC address (XX:XX:XX:XX:XX:XX)'
    : helperText

  // Merge disabled prop with styles
  const mergedStyles: FormFieldStyles = {
    ...styles,
    ...(disabled !== undefined ? { disabled } : {}),
  }

  // Promote error state into the shared style system for proper colors
  const computedStyles: FormFieldStyles = error
    ? { ...mergedStyles, helperTextType: 'error' as const }
    : mergedStyles

  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(computedStyles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(computedStyles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: mergedStyles?.height || '40px',
      width: '100%',
      border: `${mergedStyles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: mergedStyles?.borderRadius || '8px',
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
      padding: mergedStyles?.padding || '8px 16px',
      fontSize: mergedStyles?.fontSize || '16px',
      fontWeight: mergedStyles?.fontWeight,
      lineHeight: mergedStyles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    footerText: getSharedFooterTextStyles(
      footerTextColor,
      themeConfig,
      computedStyles
    ),
  }

  return (
    <div style={componentStyles.container}>
      {label && (
        <label htmlFor={rest.id} style={componentStyles.label}>
          {label}
          {computedStyles?.required && (
            <span style={getRequiredIndicatorStyle(computedStyles)}>
              {computedStyles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={componentStyles.inputWrapper}>
        <input
          ref={inputRef}
          {...rest}
          {...getRequiredProps(computedStyles?.required)}
          value={value}
          disabled={computedStyles?.disabled}
          onChange={e => handleTextFieldChange(e.target.value)}
          onFocus={e => {
            setIsFocused(true)
            rest.onFocus?.(e)
          }}
          onBlur={e => {
            setIsFocused(false)
            rest.onBlur?.(e)
          }}
          onPaste={handlePaste}
          placeholder={rest.placeholder ?? '00:1A:2B:3C:4D:5E'}
          aria-invalid={!isValid}
          style={componentStyles.input}
        />
      </div>

      {error && <div style={componentStyles.footerText}>{error}</div>}
    </div>
  )
}

export default MACAddressField

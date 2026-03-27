'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'

export interface CVVProps {
  onChange?: (value: string, isValid: boolean) => void
  minLength?: number
  maxLength?: number
  isDefaultValue?: boolean
  value?: string
  label?: string
  placeholder?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  disabled?: boolean
  styles?: FormFieldStyles
}

const getStyles = (styles?: FormFieldStyles, isFocused?: boolean) => {
  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(styles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: styles?.height || '40px',
      width: '100%',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
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
      padding: styles?.padding || '8px 16px',
      paddingLeft: styles?.paddingLeft || '48px', // Space for lock icon
      paddingRight: styles?.paddingRight || '16px',
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    adornment: getSharedAdornmentStyles(adornmentColor),
    startAdornment: { left: '16px' },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

const CVV: React.FC<CVVProps> = ({
  onChange,
  value = '',
  minLength = 3,
  maxLength = 4,
  isDefaultValue = false,
  label = 'CVV',
  placeholder = '123',
  id,
  onFocus,
  onBlur,
  helperText,
  disabled,
  styles,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value || '')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
        onChange?.(truncatedValue, valid)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, internalValue, validateCVV, formatInput, maxLength])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      const truncatedValue = formattedValue.slice(0, maxLength)
      setInternalValue(truncatedValue)
      setHasBeenEdited(true)
      const valid = validateCVV(truncatedValue)
      onChange?.(truncatedValue, valid)
    },
    [onChange, validateCVV, formatInput, maxLength]
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

  const computedStyles = getStyles(
    { ...styles, ...(disabled !== undefined ? { disabled } : {}) },
    isFocused
  )

  return (
    <div style={computedStyles.container}>
      {label && (
        <label style={computedStyles.label}>
          {label}
          {styles?.required && (
            <span style={getRequiredIndicatorStyle(styles)}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={computedStyles.inputWrapper}>
        <div
          style={{
            ...computedStyles.adornment,
            ...computedStyles.startAdornment,
          }}
        >
          <span>🔒</span>
        </div>
        <input
          ref={inputRef}
          type="password"
          id={id}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="cc-csc"
          style={computedStyles.input}
          {...props}
        />
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

CVV.displayName = 'CVV'
export default CVV

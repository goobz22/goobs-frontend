'use client'
import React, { useCallback, useState, useEffect } from 'react'
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

export interface RoutingNumberProps {
  onChange?: (value: string, isValid: boolean) => void
  useChecksum?: boolean
  isDefaultValue?: boolean
  value?: string
  label?: string
  placeholder?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
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
      paddingLeft: styles?.paddingLeft || '48px', // Space for routing icon
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
    sacredGlyph: {
      position: 'absolute' as const,
      left: '-16px',
      color: 'rgba(255,215,0,0.4)',
      fontSize: '12px',
    },
  }

  return componentStyles
}

const RoutingNumber: React.FC<RoutingNumberProps> = ({
  onChange,
  value = '',
  useChecksum = true,
  isDefaultValue = false,
  label = 'Routing Number',
  placeholder,
  id,
  onFocus,
  onBlur,
  helperText,
  styles,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)

  const validateRoutingChecksum = useCallback(
    (routingNumber: string): boolean => {
      if (routingNumber.length !== 9) return false
      const digits = routingNumber.split('').map(Number)
      const sum =
        3 * (digits[0] + digits[3] + digits[6]) +
        7 * (digits[1] + digits[4] + digits[7]) +
        (digits[2] + digits[5] + digits[8])
      return sum % 10 === 0
    },
    []
  )

  const validateRoutingNumber = useCallback(
    (routingNumber: string): boolean => {
      const trimmedValue = routingNumber.trim()
      if (trimmedValue === '') return true
      if (trimmedValue.length !== 9) return false
      const hasOnlyDigits = /^\d+$/.test(trimmedValue)
      return (
        hasOnlyDigits && (!useChecksum || validateRoutingChecksum(trimmedValue))
      )
    },
    [useChecksum, validateRoutingChecksum]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/\D/g, ''),
    []
  )
  const maskRoutingNumber = useCallback((routingNumber: string): string => {
    if (!routingNumber || routingNumber.length !== 9) return routingNumber
    return `${routingNumber.slice(0, 4)}****${routingNumber.slice(-1)}`
  }, [])

  const getDisplayValue = useCallback(
    () =>
      isDefaultValue && !isFocused && !hasBeenEdited && internalValue
        ? maskRoutingNumber(internalValue)
        : internalValue,
    [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskRoutingNumber]
  )

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 9)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const valid = validateRoutingNumber(formattedValue)
      onChange?.(formattedValue, valid)
    },
    [onChange, validateRoutingNumber, formatInput]
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

  const computedStyles = getStyles(styles, isFocused)
  const sacredTheme = styles?.theme === 'sacred'
  const finalPlaceholder = sacredTheme ? '021000021' : placeholder

  const RoutingAdornment = () => (
    <div
      style={{
        ...computedStyles.adornment,
        ...computedStyles.startAdornment,
      }}
    >
      {sacredTheme && <span style={computedStyles.sacredGlyph}>𓂋</span>}
      <span>⚡</span>
    </div>
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
        <RoutingAdornment />
        <input
          type="text"
          id={id}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
          placeholder={finalPlaceholder}
          maxLength={9}
          style={computedStyles.input}
          {...props}
        />
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

RoutingNumber.displayName = 'RoutingNumber'
export default RoutingNumber

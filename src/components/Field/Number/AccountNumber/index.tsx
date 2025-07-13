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

export interface AccountNumberProps {
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
      paddingLeft: styles?.paddingLeft || '40px', // Space for # adornment
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

const AccountNumber: React.FC<AccountNumberProps> = ({
  onChange,
  value = '',
  minLength = 8,
  maxLength = 17,
  isDefaultValue = false,
  label = 'Account Number',
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

  const validateAccountNumber = useCallback(
    (accountNumber: string): boolean => {
      const trimmedValue = accountNumber.trim()
      if (trimmedValue === '') return true
      const normalizedValue = trimmedValue.replace(/-/g, '')
      const hasOnlyDigits = /^\d+$/.test(normalizedValue)
      const isValidLength =
        normalizedValue.length >= minLength &&
        normalizedValue.length <= maxLength
      return hasOnlyDigits && isValidLength
    },
    [minLength, maxLength]
  )

  const formatInput = useCallback(
    (input: string): string => input.replace(/[^\d-]/g, ''),
    []
  )

  const maskAccountNumber = useCallback((accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber
    const lastFour = accountNumber.slice(-4)
    return '*'.repeat(Math.max(0, accountNumber.length - 4)) + lastFour
  }, [])

  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue)
      return maskAccountNumber(internalValue)
    return internalValue
  }, [
    isDefaultValue,
    isFocused,
    hasBeenEdited,
    internalValue,
    maskAccountNumber,
  ])

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      const valid = validateAccountNumber(formattedValue)
      onChange?.(formattedValue, valid)
    },
    [onChange, validateAccountNumber, formatInput]
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

  const finalPlaceholder = sacredTheme ? '1234567890' : placeholder

  const AccountAdornment = () => (
    <div
      style={{
        ...computedStyles.adornment,
        ...computedStyles.startAdornment,
      }}
    >
      <span>#</span>
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
        <AccountAdornment />
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
          maxLength={maxLength + 5}
          style={computedStyles.input}
          {...props}
        />
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

AccountNumber.displayName = 'AccountNumber'

export default AccountNumber

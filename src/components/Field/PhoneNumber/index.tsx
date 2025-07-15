'use client'
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../theme'

const formatPhoneNumber = (inputValue: string): string => {
  let digits = inputValue.replace(/\D/g, '').replace(/^1/, '')
  const limitedDigits = digits.slice(0, 10)
  let formattedNumber = '+1 '
  if (limitedDigits.length > 0) {
    formattedNumber += limitedDigits.slice(0, 3)
    if (limitedDigits.length > 3) {
      formattedNumber += '-' + limitedDigits.slice(3, 6)
      if (limitedDigits.length > 6) {
        formattedNumber += '-' + limitedDigits.slice(6)
      }
    }
  }
  return formattedNumber
}

const parseExistingPhoneNumber = (value: string): string => {
  if (!value) return ''
  if (value.includes('+1')) {
    const digits = value.replace(/\D/g, '').replace(/^1/, '')
    return digits ? formatPhoneNumber(digits).replace('+1 ', '') : ''
  }
  return formatPhoneNumber(value).replace('+1 ', '')
}

export interface PhoneNumberFieldProps {
  value?: string | number
  onChange?: (value: string) => void
  label?: React.ReactNode
  helperText?: string
  styles?: FormFieldStyles
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  autoComplete?: string
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = React.memo(props => {
  const {
    label = 'Phone Number',
    placeholder,
    onChange,
    onFocus,
    onBlur,
    value = '',
    helperText,
    id,
    styles,
    ...restProps
  } = props

  const [phoneNumber, setPhoneNumber] = useState(() =>
    parseExistingPhoneNumber(String(value || ''))
  )
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setPhoneNumber(parseExistingPhoneNumber(String(value || '')))
  }, [value])

  const sacredtheme = styles?.theme === 'sacred'

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
      paddingRight: sacredtheme ? '48px' : '16px', // Space for sacred icon
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    endAdornment: getSharedAdornmentStyles(adornmentColor),
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      let strippedInput = input.replace(/\D/g, '').slice(0, 10)

      // Format just the digits part for display with stable formatting
      let formattedDigits = ''
      if (strippedInput.length > 0) {
        formattedDigits = strippedInput.slice(0, 3)
        if (strippedInput.length > 3) {
          formattedDigits += '-' + strippedInput.slice(3, 6)
          if (strippedInput.length > 6) {
            formattedDigits += '-' + strippedInput.slice(6, 10)
          }
        }
      }
      setPhoneNumber(formattedDigits)

      // Return the full formatted number with +1 prefix
      const fullFormattedValue = strippedInput
        ? formatPhoneNumber(strippedInput)
        : '+1 '
      if (onChange) {
        onChange(fullFormattedValue)
      }
    },
    [onChange]
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

  const endAdornment = useMemo(
    () =>
      sacredtheme ? <span style={componentStyles.endAdornment}>𓋴</span> : null,
    [sacredtheme, componentStyles.endAdornment]
  )

  return (
    <div style={componentStyles.container}>
      {label && (
        <label style={componentStyles.label}>
          {sacredtheme ? 'Sacred Connection' : label}
          {styles?.required && (
            <span style={getRequiredIndicatorStyle(styles)}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={componentStyles.inputWrapper}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '16px',
            color: 'inherit',
            fontSize: styles?.fontSize || '16px',
            fontFamily: componentStyles.input.fontFamily,
            fontWeight: styles?.fontWeight,
            userSelect: 'none',
          }}
        >
          +1
        </div>
        <input
          {...restProps}
          {...getRequiredProps(styles?.required)}
          type="tel"
          id={id}
          value={phoneNumber}
          disabled={styles?.disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || '555-555-5555'}
          style={{
            ...componentStyles.input,
            paddingLeft: '8px',
            flex: 1,
          }}
        />

        {endAdornment && (
          <div
            style={{
              ...componentStyles.endAdornment,
              right: '16px',
            }}
          >
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
})

PhoneNumberField.displayName = 'PhoneNumberField'
export default PhoneNumberField

'use client'
import React, { useState, useCallback } from 'react'
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
import ShowHideEyeIcon from '../../Icons/ShowHideEye'

export interface PasswordFieldProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  id?: string
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
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
      padding: styles?.padding || '8px 48px 8px 16px', // Right padding for eye icon
      paddingLeft: styles?.paddingLeft || '16px',
      paddingRight: styles?.paddingRight || '48px',
      paddingTop: styles?.paddingTop || '8px',
      paddingBottom: styles?.paddingBottom || '8px',
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    endAdornment: {
      ...getSharedAdornmentStyles(adornmentColor),
      right: '12px',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: 0,
    },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = 'Password',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  helperText,
  id,
  styles,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const computedStyles = getStyles(styles, isFocused)

  const togglePasswordVisibility = useCallback(
    () => setPasswordVisible(prev => !prev),
    []
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
        <input
          type={passwordVisible ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          placeholder={placeholder}
          style={{
            ...computedStyles.input,
            ...(styles?.disabled && { opacity: 0.5, cursor: 'not-allowed' }),
          }}
          {...getRequiredProps(styles?.required)}
          {...rest}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          style={computedStyles.endAdornment}
          disabled={styles?.disabled}
        >
          <ShowHideEyeIcon
            visible={passwordVisible}
            sacredtheme={styles?.theme === 'sacred'}
          />
        </button>
      </div>

      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default PasswordField

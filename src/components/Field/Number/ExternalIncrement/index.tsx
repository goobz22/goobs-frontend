'use client'
import React, { useState, useCallback } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export interface ExternalIncrementNumberFieldProps extends Omit<
  TextFieldProps,
  'onChange' | 'disabled' | 'required'
> {
  initialValue?: string
  onChange?: () => void
  label?: string
  helperText?: string
  styles?: FormFieldStyles
}

const getStyles = (
  styles?: FormFieldStyles,
  isFocused?: boolean,
  helperText?: string
) => {
  const { themeConfig, borderColor, labelColor, footerTextColor, transition } =
    getSharedFormFieldStyles(styles, isFocused)

  const disabled = styles?.disabled

  const componentStyles: Record<string, React.CSSProperties> = {
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '8px',
      ...getSharedContainerStyles(styles),
    },
    button: {
      padding: '4px 12px',
      border: `1px solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '6px',
      transition,
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: themeConfig.fontFamily,
      fontSize: styles?.fontSize || '14px',
      fontWeight: 500,
      minWidth: '32px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: helperText ? '20px' : '0px',
    } as React.CSSProperties,
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,
    input: {
      width: '64px',
      height: '40px',
      textAlign: 'center',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      outline: 'none',
      transition,
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      opacity: disabled ? 0.5 : 1,
      fontFamily: themeConfig.fontFamily,
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      padding: '8px',
      boxSizing: 'border-box',
    } as React.CSSProperties,
    label: getSharedLabelStyles(labelColor, themeConfig),
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

const ExternalIncrementNumberField: React.FC<
  ExternalIncrementNumberFieldProps
> = ({ initialValue = '0', onChange, label, helperText, styles, ...rest }) => {
  const [internalValue, setInternalValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  const handleIncrement = useCallback(() => {
    if (styles?.disabled) return
    setInternalValue((prev: string) => {
      const num = parseInt(prev, 10)
      const newValue = (isNaN(num) ? 0 : num + 1).toString()
      onChange?.()
      return newValue
    })
  }, [onChange, styles?.disabled])

  const handleDecrement = useCallback(() => {
    if (styles?.disabled) return
    setInternalValue((prev: string) => {
      const num = parseInt(prev, 10)
      const newValue = Math.max(0, isNaN(num) ? 0 : num - 1).toString()
      onChange?.()
      return newValue
    })
  }, [onChange, styles?.disabled])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = event.target.value.replace(/[^0-9]/g, '')
      const newValue = numValue === '' ? '0' : numValue
      setInternalValue(newValue)
      onChange?.()
    },
    [onChange]
  )

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  const computedStyles = getStyles(styles, isFocused, helperText)

  return (
    <div style={computedStyles.container}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={styles?.disabled}
        style={computedStyles.button}
      >
        -
      </button>
      <div style={computedStyles.inputWrapper}>
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
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
          style={computedStyles.input}
          {...rest}
        />
        {helperText && (
          <div style={computedStyles.footerText}>{helperText}</div>
        )}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={styles?.disabled}
        style={computedStyles.button}
      >
        +
      </button>
    </div>
  )
}

export default ExternalIncrementNumberField

'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../theme'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface USDFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'style' | 'type' | 'inputMode'
> {
  initialValue?: string
  onChange?: (value: string) => void
  label?: string
  min?: number
  max?: number
  precision?: number
  enableIncrement?: boolean
  incrementStep?: number
  initialDelay?: number
  repeatInterval?: number
  value?: string
  placeholder?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  helperText?: string
  styles?: FormFieldStyles
}

const formatCurrency = (value: string): string => {
  const numericValue: string = value.replace(/[^0-9.]/g, '')
  if (!numericValue) return ''
  if (numericValue === '.') return '.'
  const parts: string[] = numericValue.split('.')
  if (parts.length > 2) {
    const firstPart = parts[0] || ''
    const remainingParts = parts.slice(1).join('')
    return `${firstPart}.${remainingParts}`
  }
  if (numericValue.includes('.')) return numericValue
  const number = parseFloat(numericValue)
  if (isNaN(number)) return ''
  return number.toString()
}

const getStyles = (
  styles?: FormFieldStyles,
  isFocused?: boolean,
  enableIncrement?: boolean
) => {
  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: {
      position: 'relative',
      width: styles?.width || '100%',
      minWidth: styles?.minWidth,
      maxWidth: styles?.maxWidth,
      height: styles?.height || 'auto',
      minHeight: styles?.minHeight,
      maxHeight: styles?.maxHeight,
      marginTop: styles?.marginTop || '0',
      marginLeft: styles?.marginLeft,
      marginRight: styles?.marginRight,
      textTransform: 'none',
      // Apply marginBottom last to ensure it's not overridden
      marginBottom: styles?.marginBottom || '0',
    },
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
      paddingLeft: styles?.paddingLeft || '40px', // Space for dollar sign
      paddingRight: styles?.paddingRight || (enableIncrement ? '48px' : '16px'),
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
    endAdornment: { right: '16px' },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      height: '32px',
    },
    button: {
      padding: 0,
      width: '16px',
      height: '16px',
      minWidth: '16px',
      minHeight: '16px',
      borderRadius: '2px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: adornmentColor,
      transition,
    } as React.CSSProperties,
    icon: { fontSize: '18px' },
    sacredGlyph: {
      position: 'absolute' as const,
      left: '-16px',
      color: 'rgba(255,215,0,0.4)',
      fontSize: '12px',
    },
  }

  return componentStyles
}

const USDField: React.FC<USDFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'Amount',
  min,
  max,
  precision = 2,
  enableIncrement = false,
  incrementStep = 1,
  initialDelay = 500,
  repeatInterval = 100,
  value,
  placeholder,
  id,
  onFocus,
  onBlur,
  helperText,
  styles,
  // Explicitly destructure to prevent spreading to input
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(value || initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const handleIncrement = useCallback(() => {
    if (styles?.disabled) return
    setInternalValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue =
        max !== undefined
          ? Math.min(max, num + incrementStep)
          : num + incrementStep
      const formattedValue = newValue.toFixed(precision)
      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, max, incrementStep, precision, styles?.disabled])

  const handleDecrement = useCallback(() => {
    if (styles?.disabled) return
    setInternalValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue = Math.max(min || 0, num - incrementStep)
      const formattedValue = newValue.toFixed(precision)
      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, min, incrementStep, precision, styles?.disabled])

  const handleMouseDown = (handler: () => void) => {
    if (styles?.disabled) return
    handler()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handler, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers, { once: true })
  }

  useEffect(() => clearTimers, [clearTimers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (styles?.disabled) return
      const newValue = event.target.value
      const formattedValue = formatCurrency(newValue)
      const numericValue = parseFloat(formattedValue)
      if (!isNaN(numericValue)) {
        if (min !== undefined && numericValue < min) {
          setInternalValue(min.toFixed(precision))
          onChange?.(min.toFixed(precision))
          return
        }
        if (max !== undefined && numericValue > max) {
          setInternalValue(max.toFixed(precision))
          onChange?.(max.toFixed(precision))
          return
        }
      }
      setInternalValue(formattedValue)
      onChange?.(formattedValue)
    },
    [onChange, precision, min, max, styles?.disabled]
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

  const computedStyles = getStyles(styles, isFocused, enableIncrement)
  const sacredTheme = styles?.theme === 'sacred'

  // Get dollar sign styling
  const { themeConfig, adornmentColor } = getSharedFormFieldStyles(
    styles,
    isFocused
  )
  const dollarSignColor = sacredTheme
    ? isFocused
      ? '#FFD700'
      : 'rgba(255, 215, 0, 0.9)'
    : adornmentColor

  return (
    <div style={computedStyles.container}>
      {label && (
        <label style={computedStyles.label}>
          {sacredTheme ? 'Sacred Treasury' : label}
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
          {sacredTheme && <span style={computedStyles.sacredGlyph}>𓊹</span>}
          <span
            style={{
              color: dollarSignColor,
              fontSize: styles?.fontSize || '16px',
              fontWeight: styles?.fontWeight || 500,
              fontFamily: themeConfig.fontFamily,
              ...(sacredTheme && {
                textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
                filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))',
              }),
            }}
          >
            $
          </span>
        </div>
        <input
          type="text"
          inputMode="decimal"
          id={id}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
          placeholder={sacredTheme ? 'Divine wealth...' : placeholder}
          style={computedStyles.input}
          {...rest}
        />
        {enableIncrement && (
          <div
            style={{
              ...computedStyles.adornment,
              ...computedStyles.endAdornment,
            }}
          >
            <div style={computedStyles.buttonContainer}>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleIncrement)}
                aria-label="increment"
                disabled={styles?.disabled}
                style={computedStyles.button}
              >
                <ArrowDropUpIcon
                  style={computedStyles.icon}
                  styles={{
                    theme: sacredTheme ? 'sacred' : styles?.theme || 'light',
                  }}
                />
              </button>
              <button
                type="button"
                onMouseDown={() => handleMouseDown(handleDecrement)}
                aria-label="decrement"
                disabled={styles?.disabled}
                style={{ ...computedStyles.button, marginTop: '2px' }}
              >
                <ArrowDropDownIcon
                  style={computedStyles.icon}
                  styles={{
                    theme: sacredTheme ? 'sacred' : styles?.theme || 'light',
                  }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default USDField

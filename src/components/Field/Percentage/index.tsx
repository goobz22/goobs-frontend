'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
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
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface PercentageFieldProps {
  initialValue?: string | number
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  min?: number
  max?: number
  step?: number
  initialDelay?: number
  repeatInterval?: number
  showPercentSymbol?: boolean
  placeholder?: string
  id?: string
  helperText?: string
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
      width: 'auto',
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
      height: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
      padding: styles?.padding || '8px 60px 8px 16px', // Right padding for increment/decrement buttons
      paddingLeft: styles?.paddingLeft || '16px',
      paddingRight: styles?.paddingRight || '60px',
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
    adornmentContainer: {
      ...getSharedAdornmentStyles(adornmentColor),
      right: '8px',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '32px',
      justifyContent: 'center',
    },
    button: {
      padding: 0,
      width: '16px',
      height: '16px',
      minWidth: '16px',
      minHeight: '16px',
      borderRadius: '2px',
      transition,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: adornmentColor,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    icon: { fontSize: '18px' },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  return componentStyles
}

const PercentageField: React.FC<PercentageFieldProps> = ({
  initialValue = '0',
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  initialDelay = 500,
  repeatInterval = 100,
  showPercentSymbol = true,
  placeholder,
  id,
  helperText,
  styles,
  ...rest
}) => {
  const initialValueString =
    typeof initialValue === 'number' ? initialValue.toString() : initialValue
  const [internalValue, setInternalValue] = useState(
    value || initialValueString
  )
  const [isFocused, setIsFocused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const valueSpanRef = useRef<HTMLSpanElement>(null)
  const placeholderSpanRef = useRef<HTMLSpanElement>(null)
  const [inputContentWidth, setInputContentWidth] = useState(0)

  const computedStyles = getStyles(styles, isFocused)

  const currentValue = value || internalValue
  const displayValue =
    showPercentSymbol && currentValue ? `${currentValue}%` : currentValue

  const measureStyle: React.CSSProperties = {
    position: 'absolute',
    visibility: 'hidden',
    whiteSpace: 'pre',
    fontSize: computedStyles.input.fontSize,
    fontWeight: computedStyles.input.fontWeight,
    lineHeight: computedStyles.input.lineHeight,
    fontFamily: computedStyles.input.fontFamily,
  }

  useEffect(() => {
    let valueWidth = 0
    let placeholderWidth = 0
    if (valueSpanRef.current) {
      valueWidth = valueSpanRef.current.offsetWidth
    }
    if (placeholderSpanRef.current && placeholder) {
      placeholderWidth = placeholderSpanRef.current.offsetWidth
    }
    setInputContentWidth(Math.max(valueWidth, placeholderWidth))
  }, [displayValue, placeholder])

  const padLeft =
    parseFloat(String(computedStyles.input.paddingLeft || '0')) || 0
  const padRight =
    parseFloat(String(computedStyles.input.paddingRight || '0')) || 0
  const calculatedWidth = `${inputContentWidth + padLeft + padRight + 1}px`

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const formatValue = useCallback(
    (val: string): string => {
      const numericValue = val.replace(/[^0-9.]/g, '')
      if (numericValue === '' || numericValue === '.') return ''
      let parsedValue = parseFloat(numericValue)
      if (isNaN(parsedValue)) return '0'
      if (min !== undefined && parsedValue < min) parsedValue = min
      else if (max !== undefined && parsedValue > max) parsedValue = max
      return parsedValue % 1 === 0
        ? parsedValue.toString()
        : parsedValue.toFixed(2).replace(/\.00$/, '')
    },
    [min, max]
  )

  const handleIncrement = useCallback(() => {
    const currentValue = value || internalValue
    const num = parseFloat(currentValue || '0')
    const newValue =
      max !== undefined
        ? Math.min(max, (isNaN(num) ? 0 : num) + step)
        : (isNaN(num) ? 0 : num) + step
    const newValueStr = formatValue(newValue.toString())
    setInternalValue(newValueStr)
    onChange?.(newValue)
  }, [value, internalValue, onChange, max, step, formatValue])

  const handleDecrement = useCallback(() => {
    const currentValue = value || internalValue
    const num = parseFloat(currentValue || '0')
    const newValue = Math.max(min, (isNaN(num) ? 0 : num) - step)
    const newValueStr = formatValue(newValue.toString())
    setInternalValue(newValueStr)
    onChange?.(newValue)
  }, [value, internalValue, onChange, min, step, formatValue])

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
      const rawValue = event.target.value
      const numericInput = rawValue.replace(/%/g, '')
      const formattedValue = formatValue(numericInput)
      setInternalValue(formattedValue)
      const clonedEvent = {
        ...event,
        target: { ...event.target, value: formattedValue },
      }
      onChange?.(clonedEvent)
    },
    [onChange, formatValue]
  )

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  const EndAdornment = () => (
    <div style={computedStyles.adornmentContainer}>
      <div style={computedStyles.buttonContainer}>
        <button
          type="button"
          onMouseDown={() => handleMouseDown(handleIncrement)}
          aria-label="increment"
          disabled={styles?.disabled}
          style={computedStyles.button}
        >
          <ArrowDropUpIcon
            styles={{ theme: styles?.theme || 'sacred' }}
            style={computedStyles.icon}
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
            styles={{ theme: styles?.theme || 'sacred' }}
            style={computedStyles.icon}
          />
        </button>
      </div>
    </div>
  )

  return (
    <div
      style={{
        ...computedStyles.container,
        display: 'inline-block',
        width: styles?.width || 'auto',
      }}
    >
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

      <div style={{ ...computedStyles.inputWrapper, width: 'auto' }}>
        <input
          type="text"
          inputMode="numeric"
          id={id}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          placeholder={placeholder}
          style={{
            ...computedStyles.input,
            width: calculatedWidth,
            minWidth: '60px',
            ...(styles?.disabled && { opacity: 0.5, cursor: 'not-allowed' }),
          }}
          {...getRequiredProps(styles?.required)}
          {...rest}
        />

        <span ref={valueSpanRef} style={measureStyle}>
          {displayValue}
        </span>
        <span ref={placeholderSpanRef} style={measureStyle}>
          {placeholder}
        </span>

        <EndAdornment />
      </div>

      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default PercentageField

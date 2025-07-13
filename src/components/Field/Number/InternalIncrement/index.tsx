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
} from '../../../../theme'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface InternalIncrementNumberFieldProps {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  min?: number
  max?: number
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
      paddingLeft: styles?.paddingLeft || '16px',
      paddingRight: styles?.paddingRight || '48px', // Space for increment buttons
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    adornment: getSharedAdornmentStyles(adornmentColor),
    endAdornment: { right: '12px' },
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '32px',
      justifyContent: 'center',
    } as React.CSSProperties,
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
  }

  return componentStyles
}

const InternalIncrementNumberField: React.FC<
  InternalIncrementNumberFieldProps
> = ({
  initialValue = '0',
  onChange,
  label,
  min = 0,
  max,
  initialDelay = 500,
  repeatInterval = 100,
  value,
  placeholder,
  id,
  onFocus,
  onBlur,
  helperText,
  styles,
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
      const num = parseInt(prev)
      const newValue =
        max !== undefined
          ? Math.min(max, (isNaN(num) ? 0 : num) + 1)
          : (isNaN(num) ? 0 : num) + 1
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, max, styles?.disabled])

  const handleDecrement = useCallback(() => {
    if (styles?.disabled) return
    setInternalValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.max(min, (isNaN(num) ? 0 : num) - 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, min, styles?.disabled])

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
      const newValue = event.target.value.replace(/[^0-9]/g, '')
      const numValue = parseInt(newValue, 10)
      let finalValue = newValue
      if (min !== undefined && numValue < min) finalValue = String(min)
      else if (max !== undefined && numValue > max) finalValue = String(max)
      setInternalValue(finalValue)
      const syntheticEvent = {
        ...event,
        target: { ...event.target, value: finalValue },
      }
      onChange?.(syntheticEvent)
    },
    [onChange, min, max]
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

  const IncrementAdornment = () => (
    <div style={computedStyles.buttonContainer}>
      <button
        type="button"
        onMouseDown={() => handleMouseDown(handleIncrement)}
        aria-label="increment"
        disabled={styles?.disabled}
        style={computedStyles.button}
      >
        <ArrowDropUpIcon style={computedStyles.icon} />
      </button>
      <button
        type="button"
        onMouseDown={() => handleMouseDown(handleDecrement)}
        aria-label="decrement"
        disabled={styles?.disabled}
        style={{ ...computedStyles.button, marginTop: '2px' }}
      >
        <ArrowDropDownIcon style={computedStyles.icon} />
      </button>
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
        <input
          type="text"
          inputMode="numeric"
          id={id}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={styles?.disabled}
          {...getRequiredProps(styles?.required)}
          placeholder={placeholder}
          style={computedStyles.input}
          {...rest}
        />
        <div
          style={{
            ...computedStyles.adornment,
            ...computedStyles.endAdornment,
          }}
        >
          <IncrementAdornment />
        </div>
      </div>
      {helperText && <div style={computedStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default InternalIncrementNumberField

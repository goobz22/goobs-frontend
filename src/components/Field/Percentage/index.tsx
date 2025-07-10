'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface PercentageFieldProps {
  initialValue?: string | number
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  min?: number
  max?: number
  step?: number
  initialDelay?: number
  repeatInterval?: number
  showPercentSymbol?: boolean
  sacredtheme?: boolean
  placeholder?: string
  disabled?: boolean
  error?: boolean
  name?: string
  id?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}

interface StylesType {
  container: React.CSSProperties
  input: React.CSSProperties
  label: React.CSSProperties
  adornmentContainer: React.CSSProperties
  buttonContainer: React.CSSProperties
  button: React.CSSProperties
  icon: React.CSSProperties
  glyph?: React.CSSProperties
}

const getStyles = (
  sacredtheme: boolean,
  isFocused: boolean,
  isLabelFloating: boolean,
  disabled: boolean,
  error?: boolean
): StylesType => {
  const premiumStyles = {
    container: {
      position: 'relative',
      width: '100%',
      marginTop: '1rem',
    } as React.CSSProperties,
    input: {
      width: '100%',
      height: '3.5rem',
      paddingLeft: '1rem',
      paddingRight: '3.5rem',
      border: `2px solid ${error ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB'}`,
      borderRadius: '0.25rem',
      outline: 'none',
      transition: 'all 0.3s',
      backgroundColor: 'white',
      color: 'black',
      opacity: disabled ? 0.5 : 1,
    } as React.CSSProperties,
    label: {
      position: 'absolute' as const,
      left: '1rem',
      transition: 'all 0.2s',
      pointerEvents: 'none' as const,
      color: error ? '#EF4444' : isFocused ? '#3B82F6' : '#6B7281',
      ...(isLabelFloating
        ? {
            top: '0',
            fontSize: '0.75rem',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            padding: '0 0.25rem',
          }
        : { top: '50%', fontSize: '1rem', transform: 'translateY(-50%)' }),
    } as React.CSSProperties,
    adornmentContainer: {
      position: 'absolute' as const,
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
    } as React.CSSProperties,
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '2rem',
      justifyContent: 'center',
    } as React.CSSProperties,
    button: {
      padding: 0,
      width: '1rem',
      height: '1rem',
      minWidth: '1rem',
      minHeight: '1rem',
      borderRadius: '0.125rem',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4B5563',
      '&:hover': { backgroundColor: '#E5E7EB' },
    } as React.CSSProperties,
    icon: { fontSize: '1.125rem' } as React.CSSProperties,
  }

  const sacredStyles = {
    ...premiumStyles,
    input: {
      ...premiumStyles.input,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#FFD700',
      borderColor: error
        ? '#FFD700'
        : isFocused
          ? '#FFD700'
          : 'rgba(255, 215, 0, 0.5)',
      boxShadow: isFocused ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none',
    } as React.CSSProperties,
    label: {
      ...premiumStyles.label,
      color: error
        ? '#FFD700'
        : isFocused
          ? '#FFD700'
          : 'rgba(255, 215, 0, 0.8)',
      ...(isLabelFloating && { backgroundColor: 'rgba(0,0,0,0.8)' }),
    } as React.CSSProperties,
    adornmentContainer: {
      ...premiumStyles.adornmentContainer,
      right: '1rem',
    } as React.CSSProperties,
    glyph: {
      position: 'absolute' as const,
      right: '2.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 215, 0, 0.3)',
      fontSize: '0.75rem',
      animation: 'glyph-rotate 10s linear infinite',
    } as React.CSSProperties,
    buttonContainer: {
      ...premiumStyles.buttonContainer,
      backgroundColor: 'transparent',
    } as React.CSSProperties,
    button: {
      ...premiumStyles.button,
      color: '#FFD700',
      '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
    } as React.CSSProperties,
  }

  return sacredtheme ? sacredStyles : premiumStyles
}

const PercentageField: React.FC<PercentageFieldProps> = ({
  initialValue = '0',
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  initialDelay = 500,
  repeatInterval = 100,
  showPercentSymbol = true,
  sacredtheme = false,
  placeholder,
  disabled = false,
  error = false,
  name,
  id,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  ...rest
}) => {
  const initialValueString =
    typeof initialValue === 'number' ? initialValue.toString() : initialValue
  const [value, setValue] = useState(initialValueString)
  const [isFocused, setIsFocused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    setValue(prev => {
      const num = parseFloat(prev || '0')
      const newValue =
        max !== undefined
          ? Math.min(max, (isNaN(num) ? 0 : num) + step)
          : (isNaN(num) ? 0 : num) + step
      const newValueStr = formatValue(newValue.toString())
      onChange?.(newValue)
      return newValueStr
    })
  }, [onChange, max, step, formatValue])

  const handleDecrement = useCallback(() => {
    setValue(prev => {
      const num = parseFloat(prev || '0')
      const newValue = Math.max(min, (isNaN(num) ? 0 : num) - step)
      const newValueStr = formatValue(newValue.toString())
      onChange?.(newValue)
      return newValueStr
    })
  }, [onChange, min, step, formatValue])

  const handleMouseDown = (handler: () => void) => {
    if (disabled) return
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
      setValue(formattedValue)
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

  const displayValue = showPercentSymbol && value ? `${value}%` : value
  const isLabelFloating = isFocused || Boolean(value)
  const styles = getStyles(
    sacredtheme,
    isFocused,
    isLabelFloating,
    disabled,
    error
  )

  const EndAdornment = () => (
    <div style={styles.adornmentContainer}>
      {sacredtheme && <span style={styles.glyph}>𓏏</span>}
      <div style={styles.buttonContainer}>
        <button
          type="button"
          onMouseDown={() => handleMouseDown(handleIncrement)}
          aria-label="increment"
          disabled={disabled}
          style={styles.button}
        >
          <ArrowDropUpIcon style={styles.icon} />
        </button>
        <button
          type="button"
          onMouseDown={() => handleMouseDown(handleDecrement)}
          aria-label="decrement"
          disabled={disabled}
          style={{ ...styles.button, marginTop: '0.125rem' }}
        >
          <ArrowDropDownIcon style={styles.icon} />
        </button>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          inputMode="numeric"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={
            isLabelFloating
              ? sacredtheme
                ? 'Divine percentage...'
                : placeholder
              : ''
          }
          style={{
            ...styles.input,
            backgroundColor: backgroundcolor,
            borderColor: outlinecolor,
            color: fontcolor,
          }}
          {...rest}
        />
        {label && (
          <label htmlFor={id} style={styles.label}>
            {sacredtheme ? 'Sacred Portion' : label}
          </label>
        )}
        <EndAdornment />
      </div>
    </div>
  )
}

export default PercentageField

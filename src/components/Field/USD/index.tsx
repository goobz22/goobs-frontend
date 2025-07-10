'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { black } from '../../../styles/palette'
import ArrowDropUpIcon from '../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../Icons/ArrowDropDown'

export interface USDFieldProps {
  initialValue?: string
  onChange?: (value: string) => void
  label?: string
  min?: number
  max?: number
  precision?: number
  readOnly?: boolean
  enableIncrement?: boolean
  incrementStep?: number
  initialDelay?: number
  repeatInterval?: number
  sacredtheme?: boolean
  value?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  style?: React.CSSProperties
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
  sacredtheme: boolean,
  isFocused: boolean,
  isLabelFloating: boolean,
  disabled: boolean,
  error?: boolean,
  enableIncrement?: boolean
) => {
  const premiumStyles = {
    container: {
      position: 'relative' as const,
      width: '100%',
      marginTop: '1rem',
    },
    inputContainer: { position: 'relative' as const },
    input: {
      width: '100%',
      height: '3.5rem',
      paddingLeft: '2.5rem',
      paddingRight: enableIncrement ? '2.5rem' : '1rem',
      border: `2px solid ${error ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB'}`,
      borderRadius: '0.25rem',
      outline: 'none',
      transition: 'all 0.3s',
      backgroundColor: 'white',
      color: 'black',
      opacity: disabled ? 0.5 : 1,
    },
    label: {
      position: 'absolute' as const,
      left: '2.5rem',
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
    },
    startAdornment: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
    },
    dollarSign: { fontSize: '1rem', fontWeight: 400, color: black.main },
    endAdornment: {
      position: 'absolute' as const,
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      height: '2rem',
    },
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
    icon: { fontSize: '1.125rem' },
    glyph: {
      position: 'absolute' as const,
      left: '-1rem',
      color: 'rgba(255,215,0,0.4)',
      fontSize: '0.75rem',
      animation: 'sacred-float 4s ease-in-out infinite',
      display: 'none' as const,
    },
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
      textShadow: '0 0 2px rgba(255, 215, 0, 0.5)',
    },
    label: {
      ...premiumStyles.label,
      left: '3rem',
      color: error
        ? '#FFD700'
        : isFocused
          ? '#FFD700'
          : 'rgba(255, 215, 0, 0.8)',
      ...(isLabelFloating && { backgroundColor: 'rgba(0,0,0,0.8)' }),
    },
    glyph: {
      position: 'absolute' as const,
      left: '-1rem',
      color: 'rgba(255,215,0,0.4)',
      fontSize: '0.75rem',
      animation: 'sacred-float 4s ease-in-out infinite',
    },
    dollarSign: {
      ...premiumStyles.dollarSign,
      color: '#FFD700',
      fontWeight: 600,
      textShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
    },
    button: {
      ...premiumStyles.button,
      color: '#FFD700',
      '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
    } as React.CSSProperties,
  }

  return sacredtheme ? sacredStyles : premiumStyles
}

const USDField: React.FC<USDFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'Amount',
  min,
  max,
  precision = 2,
  readOnly = false,
  enableIncrement = false,
  incrementStep = 1,
  initialDelay = 500,
  repeatInterval = 100,
  sacredtheme = false,
  value,
  placeholder,
  disabled = false,
  name,
  id,
  onFocus,
  onBlur,
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
    if (readOnly || disabled) return
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
  }, [onChange, max, incrementStep, precision, readOnly, disabled])

  const handleDecrement = useCallback(() => {
    if (readOnly || disabled) return
    setInternalValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue = Math.max(min || 0, num - incrementStep)
      const formattedValue = newValue.toFixed(precision)
      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, min, incrementStep, precision, readOnly, disabled])

  const handleMouseDown = (handler: () => void) => {
    if (readOnly || disabled) return
    handler()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handler, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers, { once: true })
  }

  useEffect(() => clearTimers, [clearTimers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly || disabled) return
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
    [onChange, precision, min, max, readOnly, disabled]
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

  const isLabelFloating = isFocused || Boolean(internalValue)
  const styles = getStyles(
    sacredtheme,
    isFocused,
    isLabelFloating,
    disabled,
    rest.error,
    enableIncrement
  )

  const DollarAdornment = () => (
    <div style={styles.startAdornment}>
      {sacredtheme && <span style={styles.glyph}>𓊹</span>}
      <span style={styles.dollarSign}>$</span>
    </div>
  )

  const IncrementAdornment = () =>
    enableIncrement ? (
      <div style={styles.endAdornment}>
        <div style={styles.buttonContainer}>
          <button
            type="button"
            onMouseDown={() => handleMouseDown(handleIncrement)}
            aria-label="increment"
            disabled={readOnly || disabled}
            style={styles.button}
          >
            <ArrowDropUpIcon style={styles.icon} />
          </button>
          <button
            type="button"
            onMouseDown={() => handleMouseDown(handleDecrement)}
            aria-label="decrement"
            disabled={readOnly || disabled}
            style={{ ...styles.button, marginTop: '0.125rem' }}
          >
            <ArrowDropDownIcon style={styles.icon} />
          </button>
        </div>
      </div>
    ) : null

  return (
    <div style={{ ...styles.container, ...rest.style }}>
      <div style={styles.inputContainer}>
        <DollarAdornment />
        <input
          type="text"
          inputMode="decimal"
          id={id}
          name={name}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={
            isLabelFloating
              ? sacredtheme
                ? 'Divine wealth...'
                : placeholder
              : ''
          }
          style={styles.input}
          {...rest}
        />
        {label && (
          <label htmlFor={id} style={styles.label}>
            {sacredtheme ? 'Sacred Treasury' : label}
          </label>
        )}
        <IncrementAdornment />
      </div>
    </div>
  )
}

export default USDField

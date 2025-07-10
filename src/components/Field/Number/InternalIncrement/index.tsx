'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
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
  sacredtheme?: boolean
  value?: string
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  error?: boolean
  helperText?: string
  style?: React.CSSProperties
}

const getStyles = (
  sacredtheme: boolean,
  isFocused: boolean,
  isLabelFloating: boolean
) => {
  const premiumStyles = {
    container: { position: 'relative', width: '100%' } as React.CSSProperties,
    input: {
      width: '100%',
      height: '3.5rem',
      paddingLeft: '1rem',
      paddingRight: '3rem',
      border: `2px solid ${isFocused ? '#3B82F6' : '#D1D5DB'}`,
      borderRadius: '0.25rem',
      outline: 'none',
      transition: 'all 0.3s',
      backgroundColor: 'white',
      color: 'black',
    },
    label: {
      position: 'absolute' as const,
      left: '1rem',
      transition: 'all 0.2s',
      pointerEvents: 'none' as const,
      color: isFocused ? '#3B82F6' : '#6B7281',
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
      flexDirection: 'column',
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
    icon: { fontSize: '1.125rem' },
  }

  const sacredStyles = {
    ...premiumStyles,
    input: {
      ...premiumStyles.input,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#FFD700',
      borderColor: isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.5)',
      boxShadow: isFocused ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none',
    },
    label: {
      ...premiumStyles.label,
      color: isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.8)',
      ...(isLabelFloating && { backgroundColor: 'rgba(0,0,0,0.8)' }),
    },
    buttonContainer: {
      ...premiumStyles.buttonContainer,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderRadius: '0.25rem',
      padding: '0.125rem',
    },
    button: {
      ...premiumStyles.button,
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
      },
    } as React.CSSProperties,
    icon: {
      ...premiumStyles.icon,
      filter: 'drop-shadow(0 0 3px rgba(255,215,0,0.6))',
    },
  }

  return sacredtheme ? sacredStyles : premiumStyles
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
  sacredtheme = false,
  value,
  placeholder,
  disabled = false,
  name,
  id,
  onFocus,
  onBlur,
  outlinecolor,
  fontcolor,
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
    setInternalValue(prev => {
      const num = parseInt(prev)
      const newValue =
        max !== undefined
          ? Math.min(max, (isNaN(num) ? 0 : num) + 1)
          : (isNaN(num) ? 0 : num) + 1
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, max])

  const handleDecrement = useCallback(() => {
    setInternalValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.max(min, (isNaN(num) ? 0 : num) - 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, min])

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

  const isLabelFloating = isFocused || Boolean(internalValue)
  const styles = getStyles(sacredtheme, isFocused, isLabelFloating)

  const IncrementAdornment = () => (
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
  )

  return (
    <div style={{ ...styles.container, ...rest.style }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          inputMode="numeric"
          id={id}
          name={name}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isLabelFloating ? placeholder : ''}
          style={{
            ...styles.input,
            backgroundColor: undefined,
            borderColor: outlinecolor,
            color: fontcolor,
          }}
          {...rest}
        />
        {label && (
          <label htmlFor={id} style={styles.label}>
            {label}
          </label>
        )}
        <div style={styles.adornmentContainer}>
          <IncrementAdornment />
        </div>
      </div>
    </div>
  )
}

export default InternalIncrementNumberField

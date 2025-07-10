'use client'
import React, { useState, useCallback } from 'react'

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export interface IncrementNumberFieldProps
  extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: () => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
  sacredtheme?: boolean
}

const getStyles = (
  sacredtheme: boolean,
  isFocused: boolean,
  isLabelFloating: boolean,
  disabled: boolean,
  backgroundcolor?: string,
  outlinecolor?: string,
  fontcolor?: string
) => ({
  container: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  button: {
    padding: '0.25rem 0.75rem',
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#D1D5DB'}`,
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.5)' : '#F3F4F6',
    color: sacredtheme ? '#FFD700' : '#1F2937',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    '&:hover': {
      backgroundColor: !disabled
        ? sacredtheme
          ? 'rgba(255, 215, 0, 0.2)'
          : '#E5E7EB'
        : undefined,
    },
  } as React.CSSProperties,
  inputContainer: { position: 'relative' } as React.CSSProperties,
  input: {
    width: '4rem',
    height: '2.5rem',
    textAlign: 'center',
    border: `2px solid ${sacredtheme ? (isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.5)') : isFocused ? '#3B82F6' : '#D1D5DB'}`,
    borderRadius: '0.375rem',
    outline: 'none',
    transition: 'all 0.3s',
    backgroundColor: sacredtheme
      ? 'rgba(0,0,0,0.8)'
      : backgroundcolor || 'white',
    color: sacredtheme ? '#FFD700' : fontcolor || 'black',
    opacity: disabled ? 0.5 : 1,
  } as React.CSSProperties,
  label: {
    position: 'absolute',
    left: '0.75rem',
    transition: 'all 0.2s',
    pointerEvents: 'none',
    color: sacredtheme
      ? 'rgba(255, 215, 0, 0.8)'
      : isFocused
        ? '#3B82F6'
        : '#6B7281',
    backgroundColor: sacredtheme ? 'black' : backgroundcolor || 'white',
    ...(isLabelFloating
      ? {
          top: '0',
          fontSize: '0.75rem',
          transform: 'translateY(-50%)',
          padding: '0 0.25rem',
        }
      : { top: '50%', fontSize: '1rem', transform: 'translateY(-50%)' }),
  } as React.CSSProperties,
})

const IncrementNumberField: React.FC<IncrementNumberFieldProps> = ({
  initialValue = '0',
  onChange,
  label,
  disabled = false,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  sacredtheme = false,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  const handleIncrement = useCallback(() => {
    setInternalValue(prev => {
      const num = parseInt(prev, 10)
      const newValue = (isNaN(num) ? 0 : num + 1).toString()
      onChange?.()
      return newValue
    })
  }, [onChange])

  const handleDecrement = useCallback(() => {
    setInternalValue(prev => {
      const num = parseInt(prev, 10)
      const newValue = Math.max(0, isNaN(num) ? 0 : num - 1).toString()
      onChange?.()
      return newValue
    })
  }, [onChange])

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

  const isLabelFloating = isFocused || Boolean(internalValue)
  const styles = getStyles(
    sacredtheme,
    isFocused,
    isLabelFloating,
    disabled,
    backgroundcolor,
    outlinecolor,
    fontcolor
  )

  return (
    <div style={styles.container}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled}
        style={styles.button}
      >
        -
      </button>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          style={{
            ...styles.input,
            borderColor: isFocused
              ? sacredtheme
                ? '#FFD700'
                : '#3B82F6'
              : outlinecolor,
          }}
          {...rest}
        />
        {label && (
          <label
            htmlFor={rest.id}
            style={{
              ...styles.label,
              backgroundColor: sacredtheme
                ? 'black'
                : backgroundcolor || 'white',
              color: isLabelFloating
                ? sacredtheme
                  ? '#FFD700'
                  : '#3B82F6'
                : fontcolor,
            }}
          >
            {label}
          </label>
        )}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled}
        style={styles.button}
      >
        +
      </button>
    </div>
  )
}

export default IncrementNumberField

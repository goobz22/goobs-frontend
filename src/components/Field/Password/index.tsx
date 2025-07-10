'use client'
import React, { useState, useCallback } from 'react'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'

export interface PasswordFieldProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: boolean
  name?: string
  id?: string
  sacredtheme?: boolean
}

const getStyles = (
  sacredtheme?: boolean,
  isFocused?: boolean,
  error?: boolean,
  isLabelFloating?: boolean
) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '1rem',
    position: 'relative',
  } as React.CSSProperties,
  inputContainer: {
    position: 'relative',
  } as React.CSSProperties,
  sacredGlyph: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 215, 0, 0.3)',
    fontSize: '0.875rem',
    animation: 'float-glyph-rotate 5s infinite alternate',
    zIndex: 10,
    pointerEvents: 'none',
  } as React.CSSProperties,
  input: {
    width: '100%',
    height: '3.5rem',
    padding: '0 1rem',
    paddingLeft: sacredtheme ? '2rem' : '1rem',
    paddingRight: '3rem',
    borderWidth: '2px',
    borderRadius: '0.375rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#FFD700',
          borderColor: isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.5)',
          backgroundImage:
            'linear-gradient(rgba(255,215,0,0.05), rgba(255,215,0,0.05)), radial-gradient(circle at top right, rgba(255,215,0,0.08) 0%, transparent 50%)',
          boxShadow: isFocused ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none',
        }
      : {
          backgroundColor: 'white',
          color: 'black',
          borderColor: isFocused ? '#3B82F6' : '#D1D5DB',
          boxShadow: isFocused ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
        }),
    ...(error && { borderColor: '#EF4444' }),
  } as React.CSSProperties,
  label: {
    position: 'absolute',
    left: '1rem',
    transition: 'all 0.2s ease',
    pointerEvents: 'none',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : '#6B7280',
    ...(isLabelFloating
      ? {
          top: 0,
          fontSize: '0.75rem',
          transform: 'translateY(-50%)',
          backgroundColor: sacredtheme ? 'black' : 'white',
          padding: '0 0.25rem',
        }
      : {
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
        }),
    ...(isFocused && { color: sacredtheme ? '#FFD700' : '#3B82F6' }),
    ...(error && !sacredtheme && { color: '#EF4444' }),
  } as React.CSSProperties,
  endAdornment: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  endAdornmentGlyph: {
    position: 'absolute',
    right: '1.75rem',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '0.75rem',
    animation: 'float-glyph-rotate 4s infinite alternate',
  } as React.CSSProperties,
})

const EndAdornment: React.FC<{
  passwordVisible?: boolean
  togglePasswordVisibility?: () => void
  sacredtheme?: boolean
}> = ({ passwordVisible, togglePasswordVisibility, sacredtheme }) => {
  const styles = getStyles(sacredtheme)
  return (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      style={styles.endAdornment}
    >
      {sacredtheme && (
        <span style={styles.endAdornmentGlyph}>
          {passwordVisible ? '𓁦' : '𓁟'}
        </span>
      )}
      <ShowHideEyeIcon visible={passwordVisible} sacredtheme={sacredtheme} />
    </button>
  )
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = 'Password',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error = false,
  name,
  id,
  sacredtheme = false,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(Boolean(value))
  const styles = getStyles(
    sacredtheme,
    isFocused,
    error,
    isFocused || hasValue || Boolean(value)
  )

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
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value))
      onChange?.(e)
    },
    [onChange]
  )

  const labelText = sacredtheme ? 'Sacred Key' : label
  const placeholderText = sacredtheme ? 'Enter divine secret...' : placeholder
  const isLabelFloating = isFocused || hasValue || Boolean(value)

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        {sacredtheme && <span style={styles.sacredGlyph}>𓊨</span>}
        <input
          type={passwordVisible ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={isLabelFloating ? placeholderText : ''}
          style={{
            ...styles.input,
            ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
          }}
          {...rest}
        />
        <label htmlFor={id} style={styles.label}>
          {labelText}
        </label>
        <EndAdornment
          passwordVisible={passwordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
          sacredtheme={sacredtheme}
        />
      </div>
    </div>
  )
}

export default PasswordField

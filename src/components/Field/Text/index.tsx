'use client'

import React, { useState, useRef, useCallback } from 'react'
import { alpha } from '../../../utils'

const SACRED_GOLD = '#FFD700'

export interface TextFieldProps {
  value: string
  onChange: (value: string) => void
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  label?: React.ReactNode
  helperText?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  placeholder?: string | undefined
  type?: string
  multiline?: boolean
  minRows?: number
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: string
    width?: string
    minWidth?: string
    maxWidth?: string
    height?: string
    minHeight?: string
    maxHeight?: string
    marginTop?: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    padding?: string
    paddingLeft?: string
    paddingRight?: string
    paddingTop?: string
    paddingBottom?: string
    fontSize?: string
    fontWeight?: string | number
    fontFamily?: string
    lineHeight?: string
    borderWidth?: string
    borderRadius?: string
    startAdornmentOffset?: string
    endAdornmentOffset?: string
    helperTextType?: 'error' | 'info'
    requiredIndicatorText?: string
    backgroundColor?: string
    borderColor?: string
    color?: string
    textColor?: string
    background?: string
    border?: string
  }
}

const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  label,
  helperText,
  startAdornment,
  endAdornment,
  placeholder,
  type = 'text',
  multiline = false,
  minRows = 3,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  const handleContainerClick = () => {
    if (multiline) {
      textareaRef.current?.focus()
    } else {
      inputRef.current?.focus()
    }
  }

  const hasStartAdornment = !!startAdornment
  const hasEndAdornment = !!endAdornment

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: styles?.width || '100%',
    minWidth: styles?.minWidth,
    maxWidth: styles?.maxWidth,
    height: styles?.height || 'auto',
    minHeight: styles?.minHeight,
    maxHeight: styles?.maxHeight,
    marginTop: styles?.marginTop || '0',
    marginBottom: styles?.marginBottom || '16px',
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: SACRED_GOLD,
    fontSize: '14px',
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
  }

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
    width: '100%',
    minHeight: multiline ? undefined : styles?.height || '40px',
    backgroundColor:
      styles?.background ||
      styles?.backgroundColor ||
      (disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)'),
    border:
      styles?.border ||
      `${styles?.borderWidth || '1px'} solid ${styles?.borderColor || alpha(SACRED_GOLD, isFocused ? 0.6 : 0.3)}`,
    borderRadius: styles?.borderRadius || '8px',
    transition: 'all 0.3s ease',
    boxShadow: isFocused ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    boxSizing: 'border-box',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: multiline ? undefined : '100%',
    minHeight: multiline ? `${minRows * 1.5}em` : undefined,
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    padding: styles?.padding || '8px 16px',
    paddingLeft:
      styles?.paddingLeft ||
      (hasStartAdornment ? styles?.startAdornmentOffset || '48px' : '16px'),
    paddingRight:
      styles?.paddingRight ||
      (hasEndAdornment ? styles?.endAdornmentOffset || '48px' : '16px'),
    paddingTop: styles?.paddingTop || '8px',
    paddingBottom: styles?.paddingBottom || '8px',
    fontSize: styles?.fontSize || '16px',
    fontWeight: styles?.fontWeight,
    lineHeight: styles?.lineHeight,
    fontFamily: styles?.fontFamily || '"Crimson Text", serif',
    color:
      styles?.textColor ||
      styles?.color ||
      (disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)'),
    boxSizing: 'border-box',
    resize: multiline ? 'vertical' : undefined,
  }

  const adornmentStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    color: SACRED_GOLD,
    pointerEvents: 'none',
  }

  const helperTextStyle: React.CSSProperties = {
    marginTop: '4px',
    fontSize: '12px',
    color:
      styles?.helperTextType === 'error'
        ? '#ff6b6b'
        : 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Crimson Text", serif',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {typeof label === 'string' ? (
            <>
              {label}
              {required && (
                <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>
                  {styles?.requiredIndicatorText || '*'}
                </span>
              )}
            </>
          ) : (
            label
          )}
        </label>
      )}

      <div style={inputWrapperStyle} onClick={handleContainerClick}>
        {startAdornment && (
          <div
            style={{
              ...adornmentStyle,
              left: '16px',
            }}
          >
            {startAdornment}
          </div>
        )}

        {multiline ? (
          <textarea
            ref={textareaRef}
            value={value || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            style={inputStyle}
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={value || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            style={inputStyle}
          />
        )}

        {endAdornment && (
          <div
            style={{
              ...adornmentStyle,
              right: '16px',
            }}
          >
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && <div style={helperTextStyle}>{helperText}</div>}
    </div>
  )
}

TextField.displayName = 'TextField'

export default TextField

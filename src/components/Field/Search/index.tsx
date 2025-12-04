'use client'

import React, { useState } from 'react'
import { alpha } from '../../../utils'

const SACRED_GOLD = '#FFD700'

export interface SearchbarProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  helperText?: string
  className?: string
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
    lineHeight?: string
    borderWidth?: string
    borderRadius?: string
    helperTextType?: 'error' | 'info'
    requiredIndicatorText?: string
    backgroundColor?: string
    borderColor?: string
    color?: string
    textColor?: string
    adornmentColor?: string
    fontFamily?: string
  }
}

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  placeholder = 'Search...',
  value,
  onChange,
  helperText,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

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
    alignItems: 'center',
    height: styles?.height || '40px',
    width: '100%',
    backgroundColor: disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
    border: `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, isFocused ? 0.6 : 0.3)}`,
    borderRadius: styles?.borderRadius || '8px',
    transition: 'all 0.3s ease',
    boxShadow: isFocused ? `0 0 15px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    boxSizing: 'border-box',
  }

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    display: 'flex',
    alignItems: 'center',
    color: styles?.adornmentColor || SACRED_GOLD,
    pointerEvents: 'none',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
    paddingLeft: styles?.paddingLeft || '48px',
    paddingRight: styles?.paddingRight || '16px',
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
          {label}
          {required && (
            <span style={{ color: SACRED_GOLD, marginLeft: '4px' }}>
              {styles?.requiredIndicatorText || '*'}
            </span>
          )}
        </label>
      )}

      <div style={inputWrapperStyle}>
        <div style={searchIconStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            fill={styles?.adornmentColor || SACRED_GOLD}
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          style={inputStyle}
        />
      </div>

      {helperText && <div style={helperTextStyle}>{helperText}</div>}
    </div>
  )
}

Searchbar.displayName = 'Searchbar'

export default Searchbar

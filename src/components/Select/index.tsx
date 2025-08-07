'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  FormFieldStyles,
  getSharedFormFieldStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'

export interface SelectStyles extends FormFieldStyles {
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  children?: React.ReactNode
  styles?: SelectStyles
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  fullWidth?: boolean
  error?: boolean
  displayEmpty?: boolean
}

const Select: React.FC<SelectProps> = ({
  children,
  styles,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  error = false,
  disabled = false,
  displayEmpty = false,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [glyph] = useState(
    SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
  )

  // Inject CSS keyframes for sacred animations
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  // Compute styles based on theme and state
  const computedStyles = useMemo(() => {
    const fieldStyles = getSharedFormFieldStyles(styles, isHovered)
    return {
      ...fieldStyles,
      isSacredTheme: styles?.theme === 'sacred',
    }
  }, [styles, isHovered])

  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'
  const { themeConfig, borderColor, transition } = computedStyles

  const selectStyle: React.CSSProperties = {
    font: 'inherit',
    fontFamily: themeConfig.fontFamily,
    color: error ? '#d32f2f' : themeConfig.text,
    width: fullWidth ? '100%' : 'auto',
    border:
      variant === 'outlined'
        ? `1px solid ${error ? '#d32f2f' : borderColor}`
        : 'none',
    borderRadius: variant === 'outlined' ? styles?.borderRadius || '4px' : '0',
    borderBottom:
      variant === 'standard'
        ? `1px solid ${error ? '#d32f2f' : borderColor}`
        : undefined,
    backgroundColor:
      variant === 'filled'
        ? isSacredTheme
          ? 'rgba(255, 215, 0, 0.06)'
          : isDarkTheme
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.06)'
        : themeConfig.background,
    padding:
      size === 'small' ? '8.5px 32px 8.5px 14px' : '16.5px 32px 16.5px 14px',
    paddingRight: '32px', // Space for dropdown arrow
    fontSize: size === 'small' ? '0.875rem' : styles?.fontSize || '1rem',
    lineHeight: '1.4375em',
    minHeight: '1.4375em',
    boxSizing: 'border-box',
    position: 'relative',
    cursor: disabled ? 'default' : 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    transition,
    ...(disabled && {
      cursor: 'default',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.38)'
        : isDarkTheme
          ? 'rgba(255, 255, 255, 0.38)'
          : 'rgba(0, 0, 0, 0.38)',
      opacity: 0.7,
    }),
    ...style,
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <select
        style={selectStyle}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {displayEmpty && (
          <option value="" disabled hidden>
            Select an option
          </option>
        )}
        {children}
      </select>
      {/* Custom dropdown arrow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '14px',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: disabled
            ? isSacredTheme
              ? 'rgba(255, 215, 0, 0.26)'
              : isDarkTheme
                ? 'rgba(255, 255, 255, 0.26)'
                : 'rgba(0, 0, 0, 0.26)'
            : isSacredTheme
              ? 'rgba(255, 215, 0, 0.54)'
              : isDarkTheme
                ? 'rgba(255, 255, 255, 0.54)'
                : 'rgba(0, 0, 0, 0.54)',
          fontSize: '0.75rem',
        }}
      >
        ▼
      </div>
      {isSacredTheme && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            color: 'rgba(255, 215, 0, 0.4)',
            fontSize: '12px',
            zIndex: 10,
            opacity: isHovered ? 1 : 0,
            transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            animation: isHovered
              ? 'sacredGlyphRotate 20s linear infinite'
              : 'none',
          }}
        >
          {glyph}
        </div>
      )}
    </div>
  )
}

export default Select

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  getFormFieldTheme,
  injectSacredKeyframes,
  type FormFieldStyles,
} from '../../theme'

export interface SelectStyles extends FormFieldStyles {
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
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

  // Inject CSS keyframes for sacred animations
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  // Compute styles based on theme and state. Inlined the slim part of
  // the deleted `getSharedFormFieldStyles` helper this component
  // actually used (themeConfig + transition + hover-driven border color).
  const computedStyles = useMemo(() => {
    const themeConfig = getFormFieldTheme(styles)
    const helperTextType = styles?.helperTextType || 'info'
    const isError = helperTextType === 'error'
    const borderColor = isError
      ? themeConfig.border.error
      : isHovered
        ? themeConfig.border.focused
        : themeConfig.border.default
    return {
      themeConfig,
      borderColor,
      transition: 'all 0.2s ease',
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
    // Set all border properties consistently
    borderTopWidth: variant === 'outlined' ? '1px' : '0',
    borderRightWidth: variant === 'outlined' ? '1px' : '0',
    borderBottomWidth:
      variant === 'outlined' || variant === 'standard' ? '1px' : '0',
    borderLeftWidth: variant === 'outlined' ? '1px' : '0',
    borderTopStyle: variant === 'outlined' ? 'solid' : 'none',
    borderRightStyle: variant === 'outlined' ? 'solid' : 'none',
    borderBottomStyle:
      variant === 'outlined' || variant === 'standard' ? 'solid' : 'none',
    borderLeftStyle: variant === 'outlined' ? 'solid' : 'none',
    borderTopColor:
      variant === 'outlined'
        ? error
          ? '#d32f2f'
          : borderColor
        : 'transparent',
    borderRightColor:
      variant === 'outlined'
        ? error
          ? '#d32f2f'
          : borderColor
        : 'transparent',
    borderBottomColor:
      variant === 'outlined' || variant === 'standard'
        ? error
          ? '#d32f2f'
          : borderColor
        : 'transparent',
    borderLeftColor:
      variant === 'outlined'
        ? error
          ? '#d32f2f'
          : borderColor
        : 'transparent',
    borderRadius: variant === 'outlined' ? styles?.borderRadius || '4px' : '0',
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
    </div>
  )
}

export default Select

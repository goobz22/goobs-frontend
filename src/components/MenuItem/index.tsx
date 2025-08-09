'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  getSharedFormFieldStyles,
  injectSacredKeyframes,
  SACRED_GLYPHS,
} from '../../theme'
import type { FormFieldStyles } from '../../theme'

export interface MenuItemStyles extends FormFieldStyles {
  dense?: boolean
  divider?: boolean
  selected?: boolean
}

export interface MenuItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children?: React.ReactNode
  styles?: MenuItemStyles
  dense?: boolean
  divider?: boolean
  disabled?: boolean
  selected?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  styles,
  dense = false,
  divider = false,
  disabled = false,
  selected = false,
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

  const optionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    textDecoration: 'none',
    minHeight: dense ? '32px' : '48px',
    paddingTop: dense ? '6px' : '8px',
    paddingBottom: dense ? '6px' : '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    backgroundColor: computedStyles.themeConfig.background,
    color: computedStyles.themeConfig.text,
    fontFamily: computedStyles.themeConfig.fontFamily,
    transition: computedStyles.transition,
    cursor: disabled ? 'default' : 'pointer',
    ...(selected && {
      backgroundColor: isSacredTheme
        ? 'rgba(255, 215, 0, 0.15)'
        : isDarkTheme
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(25, 118, 210, 0.08)',
      color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#60a5fa' : '#1976d2',
    }),
    ...(disabled && {
      opacity: 0.5,
      pointerEvents: 'none',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.4)'
        : isDarkTheme
          ? 'rgba(255, 255, 255, 0.3)'
          : 'rgba(0, 0, 0, 0.38)',
    }),
    ...(divider && {
      borderBottom: `1px solid ${
        isSacredTheme
          ? 'rgba(255, 215, 0, 0.2)'
          : isDarkTheme
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.12)'
      }`,
    }),
    ...(isHovered &&
      !disabled && {
        backgroundColor: isSacredTheme
          ? 'rgba(255, 215, 0, 0.1)'
          : isDarkTheme
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.04)',
      }),
    ...style,
  }

  return (
    <option
      style={optionStyle}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      {isSacredTheme && (
        <div
          style={{
            position: 'absolute',
            right: '16px',
            color: 'rgba(255, 215, 0, 0.4)',
            fontSize: '12px',
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
    </option>
  )
}

export default MenuItem

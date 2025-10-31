'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  SACRED_GLYPHS,
  injectSacredKeyframes,
  type FormFieldStyles,
} from '../../theme'

export interface InputLabelStyles extends FormFieldStyles {
  focused?: boolean
  required?: boolean
  shrink?: boolean
}

export interface InputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode
  styles?: InputLabelStyles
  disabled?: boolean
  error?: boolean
  focused?: boolean
  required?: boolean
  shrink?: boolean
}

const InputLabel: React.FC<InputLabelProps> = ({
  children,
  styles,
  disabled = false,
  error = false,
  focused = false,
  required = false,
  shrink = false,
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  // hydration-safe glyph
  const [glyph, setGlyph] = useState(SACRED_GLYPHS[0])

  // Inject CSS keyframes for sacred animations
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      injectSacredKeyframes()
    }
  }, [styles?.theme])

  // Randomize only after hydration
  useEffect(() => {
    if (styles?.theme === 'sacred') {
      setGlyph(SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)])
    }
  }, [styles?.theme])

  // Compute styles based on theme and state
  const computedStyles = useMemo(() => {
    const { themeConfig, labelColor } = getSharedFormFieldStyles(
      styles,
      focused || isHovered
    )
    const labelStyles = getSharedLabelStyles(labelColor, themeConfig)

    return {
      ...labelStyles,
      isSacredTheme: styles?.theme === 'sacred',
    }
  }, [styles, focused, isHovered])

  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  const labelStyle: React.CSSProperties = {
    ...computedStyles,
    color: error
      ? '#d32f2f'
      : focused
        ? isSacredTheme
          ? '#FFD700'
          : isDarkTheme
            ? '#60a5fa'
            : '#1976d2'
        : computedStyles.color,
    fontSize: shrink ? '0.75rem' : styles?.fontSize || '1rem',
    lineHeight: '1.4375em',
    padding: 0,
    position: 'relative',
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    transition:
      'color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    ...(disabled && {
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
    <label
      style={labelStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      {required && (
        <span style={{ color: '#d32f2f', marginLeft: '3px' }}>*</span>
      )}
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
    </label>
  )
}

export default InputLabel

'use client'

import React, { useState, useEffect } from 'react'
import {
  FormFieldStyles,
  SACRED_GLYPHS,
  injectSacredKeyframes,
} from '../../theme'

export interface FormControlStyles extends FormFieldStyles {
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
}

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  styles?: FormControlStyles
  fullWidth?: boolean
  disabled?: boolean
  error?: boolean
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  margin?: 'none' | 'dense' | 'normal'
}

const FormControl: React.FC<FormControlProps> = ({
  children,
  styles,
  fullWidth = false,
  disabled = false,
  error: _error = false,
  variant: _variant = 'standard',
  size: _size = 'medium',
  margin = 'none',
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

  const isSacredTheme = styles?.theme === 'sacred'

  // Sacred glyph styling
  const glyphStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '12px',
    zIndex: 10,
    opacity: isHovered ? 1 : 0,
    transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    animation: isHovered ? 'sacredGlyphRotate 20s linear infinite' : 'none',
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0,
    verticalAlign: 'top',
    ...(fullWidth && { width: '100%' }),
    ...(margin === 'dense' && { marginTop: 4, marginBottom: 4 }),
    ...(margin === 'normal' && { marginTop: 16, marginBottom: 8 }),
    ...(disabled && { opacity: 0.6, pointerEvents: 'none' }),
    ...style,
  }

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      {isSacredTheme && <div style={glyphStyle}>{glyph}</div>}
    </div>
  )
}

export default FormControl

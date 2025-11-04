'use client'

import React, { forwardRef } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  styles?: {
    theme?: string
    width?: string
    height?: string
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    [key: string]: any
  }
  elevation?: number
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  ({ children, styles, elevation = 1, className, ...restProps }, ref) => {
    const isSacredTheme = styles?.theme === 'sacred'

    const getElevationShadow = (level: number) => {
      if (isSacredTheme) {
        return `0 ${level * 2}px ${level * 8}px ${alpha(SACRED_GOLD, 0.2)}`
      }
      return `0 ${level}px ${level * 4}px rgba(0, 0, 0, 0.1)`
    }

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: styles?.width || '100%',
      height: styles?.height || 'auto',
      padding: styles?.padding || '16px',
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor:
        styles?.backgroundColor ||
        (isSacredTheme ? 'rgba(0, 0, 0, 0.85)' : '#ffffff'),
      border: isSacredTheme
        ? `1px solid ${alpha(SACRED_GOLD, 0.3)}`
        : '1px solid rgba(0, 0, 0, 0.12)',
      boxShadow: getElevationShadow(elevation),
      color: isSacredTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
      fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
      transition: 'all 0.3s ease',
    }

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Paper.displayName = 'Paper'

export default Paper

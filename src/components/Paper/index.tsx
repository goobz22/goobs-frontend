'use client'

import React, { forwardRef } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  styles?: {
    theme?: string
    width?: string
    maxWidth?: string
    minWidth?: string
    height?: string
    maxHeight?: string
    minHeight?: string
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    backgroundImage?: string
    border?: string
    borderColor?: string
    borderWidth?: string
    boxShadow?: string
    backdropFilter?: string
    opacity?: number | string
    margin?: string
    marginBottom?: string
    marginTop?: string
    marginLeft?: string
    marginRight?: string
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

    // Construct border value
    const borderValue = styles?.border
      ? styles.border
      : styles?.borderColor
        ? `${styles?.borderWidth || '1px'} solid ${styles.borderColor}`
        : isSacredTheme
          ? `${styles?.borderWidth || '1px'} solid ${alpha(SACRED_GOLD, 0.3)}`
          : `${styles?.borderWidth || '1px'} solid rgba(0, 0, 0, 0.12)`

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: styles?.width || '100%',
      maxWidth: styles?.maxWidth,
      minWidth: styles?.minWidth,
      height: styles?.height || 'auto',
      maxHeight: styles?.maxHeight,
      minHeight: styles?.minHeight,
      padding: styles?.padding || '16px',
      margin: styles?.margin,
      marginBottom: styles?.margin ? undefined : styles?.marginBottom,
      marginTop: styles?.margin ? undefined : styles?.marginTop,
      marginLeft: styles?.margin ? undefined : styles?.marginLeft,
      marginRight: styles?.margin ? undefined : styles?.marginRight,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor:
        styles?.backgroundColor ||
        (isSacredTheme ? 'rgba(0, 0, 0, 0.85)' : '#ffffff'),
      backgroundImage: styles?.backgroundImage,
      border: borderValue,
      boxShadow: styles?.boxShadow || getElevationShadow(elevation),
      backdropFilter: styles?.backdropFilter,
      opacity: styles?.opacity,
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

'use client'

import React, { forwardRef } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface DividerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
  children?: React.ReactNode
  styles?: {
    orientation?: 'horizontal' | 'vertical'
    margin?: string
    marginTop?: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    height?: string
    width?: string
    color?: string
    theme?: string
    disabled?: boolean
    backgroundColor?: string
  }
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ children, styles, ...restProps }, ref) => {
    const orientation = styles?.orientation || 'horizontal'
    const disabled = styles?.disabled || false

    // Determine background - use backgroundColor if provided, otherwise gradient
    const getBackground = () => {
      if (styles?.backgroundColor) return styles.backgroundColor
      const gradientColor = alpha(SACRED_GOLD, disabled ? 0.15 : 0.3)
      return orientation === 'horizontal'
        ? `linear-gradient(90deg, transparent, ${gradientColor}, transparent)`
        : `linear-gradient(180deg, transparent, ${gradientColor}, transparent)`
    }

    const containerStyle: React.CSSProperties =
      orientation === 'horizontal'
        ? {
            width: styles?.width || '100%',
            height: styles?.height || '2px',
            background: getBackground(),
            margin: styles?.margin || '24px 0',
            marginTop: styles?.marginTop,
            marginBottom: styles?.marginBottom,
            marginLeft: styles?.marginLeft,
            marginRight: styles?.marginRight,
            position: 'relative',
            opacity: disabled ? 0.5 : 1,
          }
        : {
            width: styles?.width || '2px',
            height: styles?.height || '100%',
            background: getBackground(),
            margin: styles?.margin || '0 24px',
            marginLeft: styles?.marginLeft,
            marginRight: styles?.marginRight,
            position: 'relative',
            opacity: disabled ? 0.5 : 1,
          }

    const contentStyle: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0, 0, 0, 0.6)',
      padding: '0 16px',
      color: styles?.color || SACRED_GOLD,
      fontSize: '14px',
      fontFamily: '"Cinzel", serif',
      whiteSpace: 'nowrap',
    }

    return (
      <div ref={ref} style={containerStyle} {...restProps}>
        {children && <div style={contentStyle}>{children}</div>}
      </div>
    )
  }
)

Divider.displayName = 'Divider'

export default Divider

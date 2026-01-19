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

    // Build margin styles without mixing shorthand and longhand
    const getHorizontalMargins = () => {
      // If any individual margin is specified, use individual properties only
      if (styles?.marginTop !== undefined || styles?.marginBottom !== undefined ||
          styles?.marginLeft !== undefined || styles?.marginRight !== undefined) {
        return {
          marginTop: styles?.marginTop ?? '24px',
          marginBottom: styles?.marginBottom ?? '24px',
          marginLeft: styles?.marginLeft ?? '0',
          marginRight: styles?.marginRight ?? '0',
        }
      }
      // Otherwise use the shorthand
      return { margin: styles?.margin || '24px 0' }
    }

    const getVerticalMargins = () => {
      // If any individual margin is specified, use individual properties only
      if (styles?.marginLeft !== undefined || styles?.marginRight !== undefined) {
        return {
          marginTop: styles?.marginTop ?? '0',
          marginBottom: styles?.marginBottom ?? '0',
          marginLeft: styles?.marginLeft ?? '24px',
          marginRight: styles?.marginRight ?? '24px',
        }
      }
      // Otherwise use the shorthand
      return { margin: styles?.margin || '0 24px' }
    }

    const containerStyle: React.CSSProperties =
      orientation === 'horizontal'
        ? {
            width: styles?.width || '100%',
            height: styles?.height || '2px',
            background: getBackground(),
            ...getHorizontalMargins(),
            position: 'relative',
            opacity: disabled ? 0.5 : 1,
          }
        : {
            width: styles?.width || '2px',
            height: styles?.height || '100%',
            background: getBackground(),
            ...getVerticalMargins(),
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

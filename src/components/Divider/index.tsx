'use client'

import React, { forwardRef } from 'react'
import { alpha } from '../../utils'

const SACRED_GOLD = '#FFD700'

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: React.ReactNode
  styles?: {
    orientation?: 'horizontal' | 'vertical'
    margin?: string
    marginTop?: string
    marginBottom?: string
    height?: string
    width?: string
    color?: string
    [key: string]: any
  }
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ children, styles, ...restProps }, ref) => {
    const orientation = styles?.orientation || 'horizontal'

    const containerStyle: React.CSSProperties = orientation === 'horizontal'
      ? {
          width: styles?.width || '100%',
          height: styles?.height || '2px',
          background: `linear-gradient(90deg, transparent, ${alpha(SACRED_GOLD, 0.3)}, transparent)`,
          margin: styles?.margin || '24px 0',
          marginTop: styles?.marginTop,
          marginBottom: styles?.marginBottom,
          position: 'relative',
        }
      : {
          width: styles?.width || '2px',
          height: styles?.height || '100%',
          background: `linear-gradient(180deg, transparent, ${alpha(SACRED_GOLD, 0.3)}, transparent)`,
          margin: styles?.margin || '0 24px',
          position: 'relative',
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

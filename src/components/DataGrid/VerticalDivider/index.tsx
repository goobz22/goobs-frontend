'use client'
import React from 'react'
import type { DataGridStyles } from '../../../theme'

interface VerticalDividerProps {
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

export const VerticalDivider: React.FC<VerticalDividerProps> = ({ styles }) => {
  const isSacredTheme = styles?.theme === 'sacred'

  const dividerStyle = {
    borderLeft: isSacredTheme
      ? '2px solid rgba(255, 215, 0, 0.4)'
      : '2px solid rgba(0, 0, 0, 1)',
    height: '20px',
    ...(isSacredTheme && {
      boxShadow:
        '0 4px 6px -1px rgba(255, 215, 0, 0.6), 0 2px 4px -1px rgba(255, 215, 0, 0.4)',
    }),
  }

  return <div style={dividerStyle} />
}

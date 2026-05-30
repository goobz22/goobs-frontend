'use client'
import React from 'react'
import type { DataGridStyles } from '../types'
import cssStyles from '../DataGrid.module.css'

interface VerticalDividerProps {
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

export const VerticalDivider: React.FC<VerticalDividerProps> = ({ styles }) => {
  // The base class renders the black/shadowless divider; only an explicit
  // `sacred` theme gets the gold border + glow. Passing the raw theme value
  // (which may be undefined) preserves the original `theme === 'sacred'`
  // branch exactly — undefined/light/dark all fall through to the base.
  return <div className={cssStyles.verticalDivider} data-theme={styles?.theme} />
}

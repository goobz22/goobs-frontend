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
  /**
   * When this Paper is the surface for an inline form, set
   * `dataForm="<verb>-<entity>"` (e.g. `"create-contract"`,
   * `"manage-category"`) to mark the form root for tests:
   *   `await expect(page.locator('[data-form="create-contract"]')).toBeVisible()`
   * Generic `data-*` attributes already pass through via
   * `...restProps`; this is the named, documented hook.
   */
  dataForm?: string
  /**
   * Singular entity noun (e.g. `"contract"`, `"category"`). Emitted as
   * `data-subject="<value>"` so tests can disambiguate when multiple
   * Papers (e.g. nested forms) live on the same page.
   */
  dataSubject?: string
  /**
   * Generic kind label (e.g. `"card"`, `"panel"`, `"summary"`)
   * emitted as `data-paper="<value>"`. Use when the surface needs a
   * stable selector but isn't a form.
   */
  dataPaper?: string
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  (
    {
      children,
      styles,
      elevation = 1,
      className,
      dataForm,
      dataSubject,
      dataPaper,
      ...restProps
    },
    ref
  ) => {
    const isSacredTheme = styles?.theme === 'sacred'

    // Sacred theme glow effect based on elevation
    const getSacredGlow = (level: number) => {
      const baseGlow = `0 0 ${20 + level * 10}px ${alpha(SACRED_GOLD, 0.3)}, 0 0 ${40 + level * 20}px ${alpha(SACRED_GOLD, 0.1)}`
      return baseGlow
    }

    const getElevationShadow = (level: number) => {
      if (isSacredTheme) {
        return getSacredGlow(level)
      }
      return `0 ${level}px ${level * 4}px rgba(0, 0, 0, 0.1)`
    }

    // Construct border value - sacred theme gets 2px gold border
    const borderValue = styles?.border
      ? styles.border
      : styles?.borderColor
        ? `${styles?.borderWidth || '1px'} solid ${styles.borderColor}`
        : isSacredTheme
          ? `2px solid ${alpha(SACRED_GOLD, 0.3)}`
          : `${styles?.borderWidth || '1px'} solid rgba(0, 0, 0, 0.12)`

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      boxSizing: 'border-box',
      width: styles?.width || '100%',
      maxWidth: styles?.maxWidth || '100%',
      minWidth: styles?.minWidth,
      height: styles?.height || 'auto',
      maxHeight: styles?.maxHeight,
      minHeight: styles?.minHeight,
      padding: styles?.padding || (isSacredTheme ? '24px' : '16px'),
      margin: styles?.margin,
      marginBottom: styles?.margin ? undefined : styles?.marginBottom,
      marginTop: styles?.margin ? undefined : styles?.marginTop,
      marginLeft: styles?.margin ? undefined : styles?.marginLeft,
      marginRight: styles?.margin ? undefined : styles?.marginRight,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor:
        styles?.backgroundColor ||
        (isSacredTheme ? 'rgba(0, 0, 0, 0.7)' : '#ffffff'),
      backgroundImage: styles?.backgroundImage,
      border: borderValue,
      boxShadow: styles?.boxShadow || getElevationShadow(elevation),
      backdropFilter:
        styles?.backdropFilter || (isSacredTheme ? 'blur(20px)' : undefined),
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
        data-form={dataForm}
        data-subject={dataSubject}
        data-paper={dataPaper}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Paper.displayName = 'Paper'

export default Paper

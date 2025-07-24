// --------------------------------------------------------------------------
// CONTAINER THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ContainerTheme {
  container: {
    maxWidth: string
    width: string
    margin: string
    padding: string
    boxSizing: string
    backgroundColor?: string
    border?: string
    borderRadius?: string
    boxShadow?: string
    backdropFilter?: string
  }
}

export interface ContainerStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Layout and sizing
  maxWidth?: string
  width?: string
  margin?: string
  padding?: string
  boxSizing?: 'border-box' | 'content-box'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string

  // Layout and spacing
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string

  // Dimensions
  height?: string
  minHeight?: string
  maxHeight?: string

  // Display and positioning
  display?: string
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'

  // States
  disabled?: boolean
}

export const containerThemes: Record<
  'light' | 'dark' | 'sacred',
  ContainerTheme
> = {
  light: {
    container: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '0 16px',
      boxSizing: 'border-box',
    },
  },
  dark: {
    container: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '0 16px',
      boxSizing: 'border-box',
    },
  },
  sacred: {
    container: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '0 24px',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(10, 10, 10, 0.05)',
      border: '1px solid rgba(255, 215, 0, 0.1)',
      borderRadius: '16px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(8px)',
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getContainerTheme = (styles?: ContainerStyles): ContainerTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = containerThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      maxWidth: styles.maxWidth || baseTheme.container.maxWidth,
      width: styles.width || baseTheme.container.width,
      margin: styles.margin || baseTheme.container.margin,
      padding: styles.padding || baseTheme.container.padding,
      boxSizing: styles.boxSizing || baseTheme.container.boxSizing,
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
    },
  }
}

// Main style generator function
export const getContainerStyles = (
  styles?: ContainerStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getContainerTheme(styles)

  const containerStyle: React.CSSProperties = {
    maxWidth: themeConfig.container.maxWidth,
    width: themeConfig.container.width,
    margin: themeConfig.container.margin,
    padding: themeConfig.container.padding,
    boxSizing: themeConfig.container.boxSizing as any,
    backgroundColor: themeConfig.container.backgroundColor,
    border: themeConfig.container.border,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    // Layout styling
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    paddingTop: styles?.paddingTop,
    paddingBottom: styles?.paddingBottom,
    paddingLeft: styles?.paddingLeft,
    paddingRight: styles?.paddingRight,
    height: styles?.height,
    minHeight: styles?.minHeight,
    maxHeight: styles?.maxHeight,
    display: styles?.display,
    position: styles?.position,
    overflow: styles?.overflow,
    // State-based styling
    ...(isDisabled && {
      opacity: 0.6,
      pointerEvents: 'none' as const,
    }),
  }

  return {
    container: containerStyle,
  }
}

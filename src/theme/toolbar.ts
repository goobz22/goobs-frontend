// --------------------------------------------------------------------------
// TOOLBAR THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface ToolbarTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    padding: string
    backgroundImage?: string
    animation?: string
  }
  glyph: {
    color: string
    fontSize: string
    animation?: string
  }
  transition: string
}

export interface ToolbarStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string
  padding?: string
  containerAnimation?: string

  // Glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphAnimation?: string

  // Layout and spacing
  gap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}

export const toolbarThemes: Record<'light' | 'dark' | 'sacred', ToolbarTheme> =
  {
    light: {
      container: {
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
        backdropFilter: 'none',
        padding: '1rem',
      },
      glyph: {
        color: 'rgba(107, 114, 128, 0.3)',
        fontSize: '0.875rem',
      },
      transition: TRANSITIONS.medium,
    },
    dark: {
      container: {
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
        backdropFilter: 'none',
        padding: '1rem',
      },
      glyph: {
        color: 'rgba(156, 163, 175, 0.3)',
        fontSize: '0.875rem',
      },
      transition: TRANSITIONS.medium,
    },
    sacred: {
      container: {
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
        backdropFilter: 'none',
        padding: '1rem',
        backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
      `,
      },
      glyph: {
        color: 'rgba(255, 215, 0, 0.2)',
        fontSize: '0.875rem',
        animation: 'glyphRotate 10s linear infinite',
      },
      transition: TRANSITIONS.slow,
    },
  }

// Helper function to get computed theme with custom style overrides
export const getToolbarTheme = (styles?: ToolbarStyles): ToolbarTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = toolbarThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      padding: styles.padding || baseTheme.container.padding,
      backgroundImage:
        styles.backgroundImage || baseTheme.container.backgroundImage,
      animation: styles.containerAnimation || baseTheme.container.animation,
    },
    glyph: {
      color: styles.glyphColor || baseTheme.glyph.color,
      fontSize: styles.glyphFontSize || baseTheme.glyph.fontSize,
      animation: styles.glyphAnimation || baseTheme.glyph.animation,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getToolbarStyles = (
  styles?: ToolbarStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getToolbarTheme(styles)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: styles?.width || '100%',
    gap: styles?.gap || '1rem',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    background: themeConfig.container.background,
    border: themeConfig.container.border,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    padding: themeConfig.container.padding,
    backgroundImage: themeConfig.container.backgroundImage,
    animation: themeConfig.container.animation,
    position: 'relative',
    transition: themeConfig.transition,
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'auto',
  }

  const glyphStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.25rem',
    right: '0.5rem',
    color: themeConfig.glyph.color,
    fontSize: themeConfig.glyph.fontSize,
    animation: themeConfig.glyph.animation,
  }

  const desktopLeftStyle: React.CSSProperties = {
    display: 'none',
  }

  const desktopRightStyle: React.CSSProperties = {
    display: 'none',
  }

  const tabletContainerStyle: React.CSSProperties = {
    display: 'none',
  }

  const mobileContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  }

  const mobileRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }

  return {
    container: containerStyle,
    glyph: glyphStyle,
    desktopLeft: desktopLeftStyle,
    desktopRight: desktopRightStyle,
    tabletContainer: tabletContainerStyle,
    mobileContainer: mobileContainerStyle,
    mobileRow: mobileRowStyle,
  }
}

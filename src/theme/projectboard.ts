// --------------------------------------------------------------------------
// PROJECT BOARD THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ProjectBoardTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
    animation?: string
  }
  glyph: {
    color: string
    fontSize: string
    zIndex: number
    animation?: string
  }
  toolbarContainer: {
    background: string
    padding: string
    margin: string
    borderRadius: string
  }
  transition: string
}

export interface ProjectBoardStyles {
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
  containerAnimation?: string

  // Glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphZIndex?: number
  glyphAnimation?: string

  // Toolbar container styling
  toolbarBackground?: string
  toolbarPadding?: string
  toolbarMargin?: string
  toolbarBorderRadius?: string

  // Layout and spacing
  padding?: string
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

export const projectBoardThemes: Record<
  'light' | 'dark' | 'sacred',
  ProjectBoardTheme
> = {
  light: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '12px',
      boxShadow: SHADOWS.light.medium,
      backdropFilter: 'blur(8px)',
    },
    glyph: {
      color: 'rgba(107, 114, 128, 0.3)',
      fontSize: '1.5rem',
      zIndex: 10,
    },
    toolbarContainer: {
      background: 'transparent',
      padding: '0.25rem 1rem',
      margin: '0.25rem 0',
      borderRadius: '8px',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
    },
    glyph: {
      color: 'rgba(156, 163, 175, 0.3)',
      fontSize: '1.5rem',
      zIndex: 10,
    },
    toolbarContainer: {
      background: 'transparent',
      padding: '0.25rem 1rem',
      margin: '0.25rem 0',
      borderRadius: '8px',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0.5rem',
      boxShadow: SHADOWS.sacred.large,
      backdropFilter: 'blur(8px)',
      backgroundImage: `
        radial-gradient(circle at top left, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at bottom right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
      `,
      animation: 'projectBoardGlowPulse 3s infinite alternate',
    },
    glyph: {
      color: 'rgba(255, 215, 0, 0.3)',
      fontSize: '1.5rem',
      zIndex: 10,
      animation: 'projectBoardFloat 10s infinite alternate',
    },
    toolbarContainer: {
      background: 'rgba(255, 215, 0, 0.05)',
      padding: '0.25rem 1rem',
      margin: '0.25rem 0',
      borderRadius: '8px',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getProjectBoardTheme = (
  styles?: ProjectBoardStyles
): ProjectBoardTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = projectBoardThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: (() => {
      const container: ProjectBoardTheme['container'] = {
        background: styles.backgroundColor || baseTheme.container.background,
        border: styles.borderColor
          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
          : baseTheme.container.border,
        borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
        boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
        backdropFilter:
          styles.backdropFilter || baseTheme.container.backdropFilter,
      }

      const computedBackgroundImage =
        styles.backgroundImage ?? baseTheme.container.backgroundImage
      if (computedBackgroundImage !== undefined) {
        container.backgroundImage = computedBackgroundImage
      }

      const computedAnimation =
        styles.containerAnimation ?? baseTheme.container.animation
      if (computedAnimation !== undefined) {
        container.animation = computedAnimation
      }

      return container
    })(),
    glyph: (() => {
      const glyph: ProjectBoardTheme['glyph'] = {
        color: styles.glyphColor || baseTheme.glyph.color,
        fontSize: styles.glyphFontSize || baseTheme.glyph.fontSize,
        zIndex: styles.glyphZIndex || baseTheme.glyph.zIndex,
      }

      const computedGlyphAnimation =
        styles.glyphAnimation ?? baseTheme.glyph.animation
      if (computedGlyphAnimation !== undefined) {
        glyph.animation = computedGlyphAnimation
      }

      return glyph
    })(),
    toolbarContainer: {
      background:
        styles.toolbarBackground || baseTheme.toolbarContainer.background,
      padding: styles.toolbarPadding || baseTheme.toolbarContainer.padding,
      margin: styles.toolbarMargin || baseTheme.toolbarContainer.margin,
      borderRadius:
        styles.toolbarBorderRadius || baseTheme.toolbarContainer.borderRadius,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getProjectBoardStyles = (
  styles?: ProjectBoardStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getProjectBoardTheme(styles)

  const containerStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: styles?.width || '100%',
    height: styles?.height || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    position: 'relative',
    background: themeConfig.container.background,
    border: themeConfig.container.border,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    backgroundImage: themeConfig.container.backgroundImage,
    animation: themeConfig.container.animation,
    overflow: 'hidden',
    transition: themeConfig.transition,
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'auto',
  }

  const glyphStyle: React.CSSProperties = {
    position: 'absolute',
    color: themeConfig.glyph.color,
    zIndex: themeConfig.glyph.zIndex,
    animation: themeConfig.glyph.animation,
  }

  const toolbarContainerStyle: React.CSSProperties = {
    background: themeConfig.toolbarContainer.background,
    padding: themeConfig.toolbarContainer.padding,
    margin: themeConfig.toolbarContainer.margin,
    borderRadius: themeConfig.toolbarContainer.borderRadius,
  }

  // Sacred theme specific glyph positions
  const glyphPositions = {
    topLeft: {
      ...glyphStyle,
      top: '0.75rem',
      left: '0.75rem',
      fontSize: '1.5rem',
    },
    topRight: {
      ...glyphStyle,
      top: '0.75rem',
      right: '0.75rem',
      fontSize: '1.5rem',
      animationDirection: 'reverse' as const,
    },
    bottomLeft: {
      ...glyphStyle,
      bottom: '0.75rem',
      left: '0.75rem',
      fontSize: '1.125rem',
      animationDelay: '1s',
    },
    bottomRight: {
      ...glyphStyle,
      bottom: '0.75rem',
      right: '0.75rem',
      fontSize: '1.125rem',
      animationDirection: 'reverse' as const,
      animationDelay: '1s',
    },
  }

  return {
    container: containerStyle,
    glyph: glyphStyle,
    toolbarContainer: toolbarContainerStyle,
    glyphPositions,
  }
}

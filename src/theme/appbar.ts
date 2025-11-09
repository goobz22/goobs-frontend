// --------------------------------------------------------------------------
// APPBAR THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface AppBarTheme {
  container: {
    backgroundColor: string
    backgroundImage?: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter?: string
    animation?: string
  }
  toolbar: {
    padding: string
    minHeight: string
    gap?: string
  }
  glyph: {
    color: string
    fontSize: string
    animation?: string
  }
  shimmer?: {
    background: string
    animation: string
  }
  transition: string
}

export interface AppBarStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  backgroundImage?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  containerAnimation?: string

  // Toolbar styling
  toolbarPadding?: string
  toolbarMinHeight?: string
  toolbarGap?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Position and dimensions
  position?: 'static' | 'fixed' | 'absolute' | 'sticky' | 'relative'
  top?: string
  left?: string
  right?: string
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  zIndex?: number

  // Glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphAnimation?: string

  // Shimmer effect (sacred theme)
  shimmerBackground?: string
  shimmerAnimation?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  elevated?: boolean
}

export const appBarThemes: Record<'light' | 'dark' | 'sacred', AppBarTheme> = {
  light: {
    container: {
      backgroundColor: '#ffffff',
      border: '1px solid rgba(229, 231, 235, 0.8)',
      borderRadius: '0',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(10px)',
    },
    toolbar: {
      padding: '0 16px',
      minHeight: '48px',
      gap: '8px',
    },
    glyph: {
      color: 'rgba(107, 114, 128, 0.3)',
      fontSize: '16px',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      borderRadius: '0',
      boxShadow: SHADOWS.dark.medium,
      backdropFilter: 'blur(10px)',
    },
    toolbar: {
      padding: '0 16px',
      minHeight: '48px',
      gap: '8px',
    },
    glyph: {
      color: 'rgba(156, 163, 175, 0.3)',
      fontSize: '16px',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backgroundImage:
        'linear-gradient(135deg, #FFD700 0%, #F4A460 50%, #DAA520 100%)',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '0',
      boxShadow: SHADOWS.sacred.medium,
      backdropFilter: 'blur(10px)',
      animation: 'sacredGlow 4s ease-in-out infinite',
    },
    toolbar: {
      padding: '0 12px',
      minHeight: '48px',
      gap: '8px',
    },
    glyph: {
      color: 'rgba(255, 215, 0, 0.4)',
      fontSize: '16px',
      animation: 'sacredFloat 3s ease-in-out infinite',
    },
    shimmer: {
      background:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
      animation: 'sacredShimmer 3s linear infinite',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getAppBarTheme = (styles?: AppBarStyles): AppBarTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = appBarThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: (() => {
      const container: AppBarTheme['container'] = {
        backgroundColor:
          styles.backgroundColor || baseTheme.container.backgroundColor,
        border: styles.borderColor
          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
          : baseTheme.container.border,
        borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
        boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      }

      const resolvedBackgroundImage =
        styles.backgroundImage ?? baseTheme.container.backgroundImage
      if (resolvedBackgroundImage !== undefined) {
        container.backgroundImage = resolvedBackgroundImage
      }

      const resolvedBackdropFilter =
        styles.backdropFilter ?? baseTheme.container.backdropFilter
      if (resolvedBackdropFilter !== undefined) {
        container.backdropFilter = resolvedBackdropFilter
      }

      const resolvedAnimation =
        styles.containerAnimation ?? baseTheme.container.animation
      if (resolvedAnimation !== undefined) {
        container.animation = resolvedAnimation
      }

      return container
    })(),
    toolbar: (() => {
      const toolbar: AppBarTheme['toolbar'] = {
        padding: styles.toolbarPadding || baseTheme.toolbar.padding,
        minHeight: styles.toolbarMinHeight || baseTheme.toolbar.minHeight,
      }

      const resolvedGap = styles.toolbarGap ?? baseTheme.toolbar.gap
      if (resolvedGap !== undefined) {
        toolbar.gap = resolvedGap
      }

      return toolbar
    })(),
    glyph: (() => {
      const glyph: AppBarTheme['glyph'] = {
        color: styles.glyphColor || baseTheme.glyph.color,
        fontSize: styles.glyphFontSize || baseTheme.glyph.fontSize,
      }

      const resolvedGlyphAnimation =
        styles.glyphAnimation ?? baseTheme.glyph.animation
      if (resolvedGlyphAnimation !== undefined) {
        glyph.animation = resolvedGlyphAnimation
      }

      return glyph
    })(),
    ...(baseTheme.shimmer
      ? {
          shimmer: {
            background:
              styles.shimmerBackground || baseTheme.shimmer.background,
            animation: styles.shimmerAnimation || baseTheme.shimmer.animation,
          },
        }
      : {}),
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getAppBarStyles = (
  styles?: AppBarStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getAppBarTheme(styles)

  const containerStyle: React.CSSProperties = {
    position: styles?.position || 'static',
    top: styles?.top || (styles?.position === 'fixed' ? '0' : undefined),
    left: styles?.left || (styles?.position === 'fixed' ? '0' : undefined),
    right: styles?.right || (styles?.position === 'fixed' ? '0' : undefined),
    width: styles?.width || '100%',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight || themeConfig.toolbar.minHeight,
    zIndex: styles?.zIndex || 1100,
    // Custom styles override theme defaults
    margin: styles?.margin !== undefined ? styles.margin : undefined,
    marginTop: styles?.marginTop !== undefined ? styles.marginTop : undefined,
    marginBottom:
      styles?.marginBottom !== undefined ? styles.marginBottom : undefined,
    marginLeft:
      styles?.marginLeft !== undefined ? styles.marginLeft : undefined,
    marginRight:
      styles?.marginRight !== undefined ? styles.marginRight : undefined,
    // Theme styles with custom overrides
    backgroundColor:
      styles?.backgroundColor || themeConfig.container.backgroundColor,
    backgroundImage:
      styles?.backgroundImage || themeConfig.container.backgroundImage,
    border: styles?.borderColor
      ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
      : themeConfig.container.border,
    borderRadius: styles?.borderRadius || themeConfig.container.borderRadius,
    boxShadow:
      styles?.boxShadow ||
      (styles?.elevated ? themeConfig.container.boxShadow : 'none'),
    backdropFilter:
      styles?.backdropFilter || themeConfig.container.backdropFilter,
    animation: styles?.containerAnimation || themeConfig.container.animation,
    transition: themeConfig.transition,
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: themeConfig.toolbar.minHeight,
    padding: themeConfig.toolbar.padding,
    gap: themeConfig.toolbar.gap,
    position: 'relative',
    zIndex: 2,
  }

  const shimmerStyle: React.CSSProperties | undefined = themeConfig.shimmer
    ? {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '1px',
        background: themeConfig.shimmer.background,
        backgroundSize: '200% 100%',
        animation: themeConfig.shimmer.animation,
        zIndex: 1,
      }
    : undefined

  const glyphStyle: React.CSSProperties = {
    position: 'absolute',
    color: themeConfig.glyph.color,
    fontSize: themeConfig.glyph.fontSize,
    animation: themeConfig.glyph.animation,
    pointerEvents: 'none',
    zIndex: 1,
  }

  return {
    container: containerStyle,
    toolbar: toolbarStyle,
    shimmer: shimmerStyle,
    glyph: glyphStyle,
  }
}

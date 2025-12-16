/**
 * @fileoverview Icon component theme system with light, dark, and sacred themes.
 */
import React from 'react'
import { TRANSITIONS } from './shared'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS
// --------------------------------------------------------------------------

export const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

// --------------------------------------------------------------------------
// THEME INTERFACES
// --------------------------------------------------------------------------

export interface IconTheme {
  /** Base icon container styling */
  container: React.CSSProperties
  /** SVG icon styling */
  icon: React.CSSProperties
  /** Icon hover state styling */
  iconHover: React.CSSProperties
  /** Sacred glyph styling (sacred theme only) */
  glyph: React.CSSProperties
  /** Sacred glyph visible state styling */
  glyphVisible: React.CSSProperties
  /** Transition configuration */
  transition: string
}

export interface IconStyles {
  /** Theme selection: light, dark, or sacred */
  theme?: 'light' | 'dark' | 'sacred'
  /** Whether the icon is disabled */
  disabled?: boolean
  /** Custom icon size */
  size?: number
  /** Custom icon color */
  color?: string
  /** Custom hover color */
  hoverColor?: string
  /** Custom background color */
  backgroundColor?: string
  /** Custom hover background color */
  hoverBackgroundColor?: string
  /** Custom border radius */
  borderRadius?: string
  /** Custom padding */
  padding?: string
  /** Custom margin */
  margin?: string
  /** Custom filter effects */
  filter?: string
  /** Custom hover filter effects */
  hoverFilter?: string
  /** Custom transform effects */
  transform?: string
  /** Custom hover transform effects */
  hoverTransform?: string
  /** Custom transition duration */
  transitionDuration?: string
  /** Custom box shadow */
  boxShadow?: string
  /** Custom hover box shadow */
  hoverBoxShadow?: string
  /** Sacred glyph color override */
  sacredGlyphColor?: string
  /** Sacred glyph size override */
  sacredGlyphSize?: string
  /** Show sacred glyph on hover only */
  sacredGlyphOnHoverOnly?: boolean
}

// --------------------------------------------------------------------------
// THEME DEFINITIONS
// --------------------------------------------------------------------------

const lightTheme: IconTheme = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  icon: {
    transition: TRANSITIONS.medium,
    color: 'currentColor',
    cursor: 'pointer',
  },
  iconHover: {},
  glyph: {
    display: 'none',
  },
  glyphVisible: {
    display: 'none',
  },
  transition: TRANSITIONS.medium,
}

const darkTheme: IconTheme = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  icon: {
    transition: TRANSITIONS.medium,
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
    color: 'currentColor',
    cursor: 'pointer',
  },
  iconHover: {
    transform: 'scale(1.05)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
    color: 'rgba(243, 244, 246, 0.9)',
  },
  glyph: {
    display: 'none',
  },
  glyphVisible: {
    display: 'none',
  },
  transition: TRANSITIONS.medium,
}

const sacredTheme: IconTheme = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  icon: {
    transition: TRANSITIONS.premium,
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
    color: 'rgba(255, 215, 0, 0.9)',
    cursor: 'pointer',
  },
  iconHover: {
    transform: 'scale(1.1) rotate(2deg)',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 1))',
    color: '#FFD700',
  },
  glyph: {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '12px',
    zIndex: 10,
    opacity: 0,
    transition: TRANSITIONS.premium,
    top: '-8px',
    right: '-8px',
    pointerEvents: 'none',
  },
  glyphVisible: {
    opacity: 1,
  },
  transition: TRANSITIONS.premium,
}

export const iconThemes: Record<'light' | 'dark' | 'sacred', IconTheme> = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
}

// --------------------------------------------------------------------------
// THEME HELPER FUNCTIONS
// --------------------------------------------------------------------------

// Helper function to get computed theme with custom style overrides
export const getIconTheme = (styles?: IconStyles): IconTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = iconThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      ...baseTheme.container,
      ...(styles.padding && { padding: styles.padding }),
      ...(styles.margin && { margin: styles.margin }),
    },
    icon: {
      ...baseTheme.icon,
      color: styles.color || baseTheme.icon.color,
      backgroundColor: styles.backgroundColor || baseTheme.icon.backgroundColor,
      borderRadius: styles.borderRadius || baseTheme.icon.borderRadius,
      filter: styles.filter || baseTheme.icon.filter,
      transform: styles.transform || baseTheme.icon.transform,
      boxShadow: styles.boxShadow || baseTheme.icon.boxShadow,
      ...(styles.size && {
        width: styles.size,
        height: styles.size,
      }),
    },
    iconHover: {
      ...baseTheme.iconHover,
      color: styles.hoverColor || baseTheme.iconHover.color,
      backgroundColor:
        styles.hoverBackgroundColor || baseTheme.iconHover.backgroundColor,
      filter: styles.hoverFilter || baseTheme.iconHover.filter,
      transform: styles.hoverTransform || baseTheme.iconHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.iconHover.boxShadow,
    },
    glyph: {
      ...baseTheme.glyph,
      color: styles.sacredGlyphColor || baseTheme.glyph.color,
      fontSize: styles.sacredGlyphSize || baseTheme.glyph.fontSize,
    },
    glyphVisible: baseTheme.glyphVisible,
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`
      : baseTheme.transition,
  }
}

// --------------------------------------------------------------------------
// MAIN STYLE GENERATOR
// --------------------------------------------------------------------------

export const getIconStyles = (
  styles?: IconStyles,
  isHovered?: boolean,
  isDisabled?: boolean
) => {
  const themeConfig = getIconTheme(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  // Base container style
  const containerStyle: React.CSSProperties = {
    ...themeConfig.container,
    ...(isDisabled && {
      opacity: 0.5,
      pointerEvents: 'none',
      cursor: 'not-allowed',
    }),
  }

  // Icon style with state-based changes
  const iconStyle: React.CSSProperties = {
    ...themeConfig.icon,
    transition: themeConfig.transition,
    ...(isHovered && !isDisabled && themeConfig.iconHover),
  }

  // Sacred glyph style
  const glyphStyle: React.CSSProperties = {
    ...themeConfig.glyph,
    ...(isHovered && themeConfig.glyphVisible),
  }

  return {
    container: containerStyle,
    icon: iconStyle,
    glyph: glyphStyle,
    isSacredTheme,
  }
}

// --------------------------------------------------------------------------
// KEYFRAMES INJECTION UTILITY
// --------------------------------------------------------------------------

export const injectSacredKeyframes = () => {
  if (typeof document !== 'undefined' && document.styleSheets?.[0]) {
    const styleSheet = document.styleSheets[0]
    const keyframes = `
      @keyframes sacredGlyphRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
    } catch {
      // Keyframes might already exist
    }
  }
}

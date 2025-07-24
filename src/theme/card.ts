/**
 * @fileoverview Theme system for Card components
 */

// --------------------------------------------------------------------------
// CARD THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface CardTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    position: React.CSSProperties['position']
    overflow: React.CSSProperties['overflow']
    transition: string
    backgroundImage?: string
    color?: string
  }
  containerHover?: {
    transform?: string
    boxShadow?: string
    borderColor?: string
    backgroundColor?: string
  }
  containerDisabled?: {
    opacity: number
    backgroundColor: string
    color: string
    borderColor?: string
    cursor: React.CSSProperties['cursor']
  }
  content: {
    padding: string
    position?: React.CSSProperties['position']
    zIndex?: number
  }
  actions: {
    padding: string
    display: React.CSSProperties['display']
    alignItems: React.CSSProperties['alignItems']
    justifyContent: React.CSSProperties['justifyContent']
    gap: string
    borderTop: string
    position?: React.CSSProperties['position']
    zIndex?: number
  }
  glyph?: {
    position: React.CSSProperties['position']
    fontSize: string
    opacity: number
    color: string
    transition: string
    pointerEvents: React.CSSProperties['pointerEvents']
    zIndex: number
  }
  shimmer?: {
    position: React.CSSProperties['position']
    top: string
    left: string
    width: string
    height: string
    background: string
    animation: string
    zIndex: number
  }
}

export interface CardStyles {
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
  color?: string
  elevation?: number

  // Content styling
  contentPadding?: string

  // Actions styling
  actionsPadding?: string
  actionsJustify?: string

  // Layout and positioning
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  width?: string
  height?: string
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  maxHeight?: string

  // Hover states
  hoverTransform?: string
  hoverBoxShadow?: string
  hoverBorderColor?: string
  hoverBackgroundColor?: string

  // Disabled state
  disabled?: boolean
  disabledOpacity?: number
  disabledBackgroundColor?: string
  disabledColor?: string
  disabledBorderColor?: string
}

// --------------------------------------------------------------------------
// THEME DEFINITIONS
// --------------------------------------------------------------------------

const lightTheme: CardTheme = {
  container: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    borderRadius: '8px',
    boxShadow: SHADOWS.light.small,
    backdropFilter: 'blur(8px)',
    position: 'relative',
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
  },
  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.light.medium,
  },
  containerDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    color: 'rgba(148, 163, 184, 1)',
    cursor: 'not-allowed',
  },
  content: {
    padding: '16px',
  },
  actions: {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    borderTop: '1px solid rgba(226, 232, 240, 0.6)',
  },
}

const darkTheme: CardTheme = {
  container: {
    background: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '8px',
    boxShadow: SHADOWS.dark.small,
    backdropFilter: 'blur(12px)',
    position: 'relative',
    overflow: 'hidden',
    transition: TRANSITIONS.medium,
    color: 'rgba(248, 250, 252, 1)',
  },
  containerHover: {
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.dark.medium,
  },
  containerDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    color: 'rgba(100, 116, 139, 1)',
    cursor: 'not-allowed',
  },
  content: {
    padding: '16px',
  },
  actions: {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    borderTop: '1px solid rgba(71, 85, 105, 0.6)',
  },
}

const sacredTheme: CardTheme = {
  container: {
    background: `linear-gradient(135deg, 
      rgba(10, 10, 10, 0.95) 0%, 
      rgba(26, 26, 26, 0.97) 50%,
      rgba(10, 10, 10, 0.95) 100%
    )`,
    border: '2px solid rgba(255, 215, 0, 0.4)',
    borderRadius: '12px',
    boxShadow: `${SHADOWS.sacred.small}, 0 8px 32px rgba(0, 0, 0, 0.3)`,
    backdropFilter: 'blur(16px)',
    position: 'relative',
    overflow: 'hidden',
    transition: TRANSITIONS.premium,
    color: 'rgba(255, 215, 0, 1)',
  },
  containerHover: {
    transform: 'translateY(-4px) scale(1.005)',
    boxShadow: `${SHADOWS.sacred.medium}, 0 12px 48px rgba(0, 0, 0, 0.4)`,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  containerDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: 'rgba(255, 215, 0, 0.4)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
    cursor: 'not-allowed',
  },
  content: {
    padding: '20px',
    position: 'relative',
    zIndex: 2,
  },
  actions: {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    borderTop: '1px solid rgba(255, 215, 0, 0.3)',
    position: 'relative',
    zIndex: 2,
  },
  glyph: {
    position: 'absolute',
    fontSize: '12px',
    opacity: 0.05,
    color: 'rgba(255, 215, 0, 1)',
    transition: TRANSITIONS.medium,
    pointerEvents: 'none',
    zIndex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
    animation: 'sacredShimmer 2s ease-in-out',
    zIndex: 1,
  },
}

// --------------------------------------------------------------------------
// THEME MAPPING
// --------------------------------------------------------------------------

export const cardThemes = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
}

// --------------------------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------------------------

export const getCardTheme = (
  theme: 'light' | 'dark' | 'sacred' = 'light'
): CardTheme => {
  return cardThemes[theme]
}

export const getCardStyles = (
  styles?: CardStyles,
  isHovered: boolean = false,
  isDisabled: boolean = false,
  elevation: number = 1
): {
  container: React.CSSProperties
  content: React.CSSProperties
  actions: React.CSSProperties
  shimmer: React.CSSProperties
  glyph: React.CSSProperties
} => {
  const theme = styles?.theme || 'light'
  const baseTheme = getCardTheme(theme)

  // Apply elevation shadow adjustments
  let boxShadow = baseTheme.container.boxShadow
  if (elevation > 1) {
    const shadowConfig = SHADOWS[theme] || SHADOWS.light
    boxShadow =
      elevation <= 4
        ? shadowConfig.small
        : elevation <= 8
          ? shadowConfig.medium
          : shadowConfig.large
  }

  const container: React.CSSProperties = {
    ...baseTheme.container,
    boxShadow,
    ...(styles?.backgroundColor && { backgroundColor: styles.backgroundColor }),
    ...(styles?.borderColor && { borderColor: styles.borderColor }),
    ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
    ...(styles?.boxShadow && { boxShadow: styles.boxShadow }),
    ...(styles?.color && { color: styles.color }),
    ...(styles?.width && { width: styles.width }),
    ...(styles?.height && { height: styles.height }),
    ...(styles?.margin && { margin: styles.margin }),
    ...(isHovered && !isDisabled && baseTheme.containerHover),
    ...(isHovered &&
      !isDisabled &&
      styles?.hoverTransform && { transform: styles.hoverTransform }),
    ...(isHovered &&
      !isDisabled &&
      styles?.hoverBoxShadow && { boxShadow: styles.hoverBoxShadow }),
    ...(isDisabled && baseTheme.containerDisabled),
    ...(isDisabled &&
      styles?.disabledOpacity && { opacity: styles.disabledOpacity }),
  }

  const content: React.CSSProperties = {
    ...baseTheme.content,
    ...(styles?.contentPadding && { padding: styles.contentPadding }),
  }

  const actions: React.CSSProperties = {
    ...baseTheme.actions,
    ...(styles?.actionsPadding && { padding: styles.actionsPadding }),
    ...(styles?.actionsJustify && { justifyContent: styles.actionsJustify }),
  }

  return {
    container,
    content,
    actions,
    shimmer: baseTheme.shimmer || {},
    glyph: baseTheme.glyph || {},
  }
}

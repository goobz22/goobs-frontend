// --------------------------------------------------------------------------
// TOOLTIP THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'

export interface TooltipTheme {
  container: React.CSSProperties
  tooltip: React.CSSProperties
  tooltipVisible: React.CSSProperties
  content: React.CSSProperties
  arrow: React.CSSProperties
}

export interface TooltipStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Content styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  boxShadow?: string
  backdropFilter?: string
  fontFamily?: string
  fontSize?: string
  fontWeight?: string | number
  letterSpacing?: string
  color?: string
  textShadow?: string
  padding?: string
  animation?: string

  // Positioning
  zIndex?: number
  arrowSize?: number

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
  enterScale?: number
  visibleScale?: number
}

// --------------------------------------------------------------------------
// THEME DEFINITIONS
// --------------------------------------------------------------------------

const lightTheme: TooltipTheme = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity: 0,
    transform: 'scale(0.95)',
  },
  tooltipVisible: {
    opacity: 1,
    transform: 'scale(1)',
  },
  content: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(4px)',
    fontFamily: '"Inter", sans-serif',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    border: '5px solid transparent',
  },
}

const darkTheme: TooltipTheme = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity: 0,
    transform: 'scale(0.95)',
  },
  tooltipVisible: {
    opacity: 1,
    transform: 'scale(1)',
  },
  content: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    backgroundColor: 'rgba(23, 23, 23, 0.9)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
    fontFamily: '"Inter", sans-serif',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    border: '5px solid transparent',
  },
}

const sacredTheme: TooltipTheme = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: 0,
    transform: 'scale(0.9)',
  },
  tooltipVisible: {
    opacity: 1,
    transform: 'scale(1)',
  },
  content: {
    padding: '10px 16px',
    fontSize: '15px',
    borderRadius: '10px',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
    position: 'relative',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    fontFamily: '"Cinzel", serif',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    animation: 'sacredTooltipGlow 3s ease-in-out infinite alternate',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    border: '6px solid transparent',
  },
}

// --------------------------------------------------------------------------
// THEME REGISTRY
// --------------------------------------------------------------------------

export const tooltipThemes = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
}

// --------------------------------------------------------------------------
// THEME FUNCTIONS
// --------------------------------------------------------------------------

export const getTooltipTheme = (
  theme: 'light' | 'dark' | 'sacred' = 'light'
): TooltipTheme => {
  return tooltipThemes[theme]
}

export const getTooltipStyles = (styles: TooltipStyles = {}): TooltipTheme => {
  const baseTheme = getTooltipTheme(styles.theme)

  return {
    container: {
      ...baseTheme.container,
    },
    tooltip: {
      ...baseTheme.tooltip,
      zIndex: styles.zIndex || baseTheme.tooltip.zIndex,
      transition:
        styles.transitionDuration && styles.transitionEasing
          ? `opacity ${styles.transitionDuration} ${styles.transitionEasing}, transform ${styles.transitionDuration} ${styles.transitionEasing}`
          : baseTheme.tooltip.transition,
      transform: `scale(${styles.enterScale || (styles.theme === 'sacred' ? 0.9 : 0.95)})`,
    },
    tooltipVisible: {
      ...baseTheme.tooltipVisible,
      transform: `scale(${styles.visibleScale || 1})`,
    },
    content: {
      ...baseTheme.content,
      backgroundColor:
        styles.backgroundColor || baseTheme.content.backgroundColor,
      border: styles.borderColor
        ? `1px solid ${styles.borderColor}`
        : baseTheme.content.border,
      borderRadius: styles.borderRadius || baseTheme.content.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.content.boxShadow,
      backdropFilter: styles.backdropFilter || baseTheme.content.backdropFilter,
      fontFamily: styles.fontFamily || baseTheme.content.fontFamily,
      fontSize: styles.fontSize || baseTheme.content.fontSize,
      fontWeight: styles.fontWeight || baseTheme.content.fontWeight,
      letterSpacing: styles.letterSpacing || baseTheme.content.letterSpacing,
      color: styles.color || baseTheme.content.color,
      textShadow: styles.textShadow || baseTheme.content.textShadow,
      padding: styles.padding || baseTheme.content.padding,
      animation: styles.animation || baseTheme.content.animation,
    },
    arrow: {
      ...baseTheme.arrow,
      border: `${styles.arrowSize || (styles.theme === 'sacred' ? 6 : 5)}px solid transparent`,
    },
  }
}

// --------------------------------------------------------------------------
// SACRED GLYPHS
// --------------------------------------------------------------------------

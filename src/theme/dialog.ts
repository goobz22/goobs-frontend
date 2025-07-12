// --------------------------------------------------------------------------
// DIALOG THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface DialogTheme {
  backdrop: {
    position: string
    inset: string
    zIndex: number
    display: string
    alignItems: string
    justifyContent: string
    backgroundColor: string
    backdropFilter: string
  }
  dialog: {
    position: string
    backgroundColor: string
    borderRadius: string
    boxShadow: string
    border: string
    backdropFilter: string
    backgroundImage?: string
  }
  transition: string
}

export interface DialogStyles {
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

  // Backdrop styling
  backdropBackgroundColor?: string
  backdropBlur?: string

  // Layout and sizing
  maxWidth?: string
  width?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  padding?: string
  margin?: string

  // States
  fullWidth?: boolean

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // Z-index
  zIndex?: number
}

export const dialogThemes: Record<'light' | 'dark' | 'sacred', DialogTheme> = {
  light: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
    },
    dialog: {
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: SHADOWS.light.large,
      border: '1px solid rgba(226, 232, 240, 0.8)',
      backdropFilter: 'blur(8px)',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(2px)',
    },
    dialog: {
      position: 'relative',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      backdropFilter: 'blur(8px)',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(3px)',
    },
    dialog: {
      position: 'relative',
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.large,
      border: '2px solid rgba(255, 215, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
      `,
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getDialogTheme = (styles?: DialogStyles): DialogTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = dialogThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    backdrop: {
      ...baseTheme.backdrop,
      backgroundColor:
        styles.backdropBackgroundColor || baseTheme.backdrop.backgroundColor,
      backdropFilter: styles.backdropBlur
        ? `blur(${styles.backdropBlur})`
        : baseTheme.backdrop.backdropFilter,
      zIndex: styles.zIndex || baseTheme.backdrop.zIndex,
    },
    dialog: {
      ...baseTheme.dialog,
      backgroundColor:
        styles.backgroundColor || baseTheme.dialog.backgroundColor,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.dialog.border,
      borderRadius: styles.borderRadius || baseTheme.dialog.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.dialog.boxShadow,
      backdropFilter: styles.backdropFilter || baseTheme.dialog.backdropFilter,
      backgroundImage:
        styles.backgroundImage || baseTheme.dialog.backgroundImage,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getDialogStyles = (styles?: DialogStyles) => {
  const themeConfig = getDialogTheme(styles)

  const backdropStyle: React.CSSProperties = {
    position: themeConfig.backdrop.position as any,
    inset: themeConfig.backdrop.inset as any,
    zIndex: themeConfig.backdrop.zIndex,
    display: themeConfig.backdrop.display as any,
    alignItems: themeConfig.backdrop.alignItems as any,
    justifyContent: themeConfig.backdrop.justifyContent as any,
    backgroundColor: themeConfig.backdrop.backgroundColor,
    backdropFilter: themeConfig.backdrop.backdropFilter,
  }

  const dialogStyle: React.CSSProperties = {
    position: themeConfig.dialog.position as any,
    backgroundColor: themeConfig.dialog.backgroundColor,
    borderRadius: themeConfig.dialog.borderRadius,
    boxShadow: themeConfig.dialog.boxShadow,
    border: themeConfig.dialog.border,
    backdropFilter: themeConfig.dialog.backdropFilter,
    backgroundImage: themeConfig.dialog.backgroundImage,
    transition: themeConfig.transition,
    // Layout and sizing
    maxWidth: styles?.maxWidth,
    width: styles?.width || (styles?.fullWidth ? '100%' : undefined),
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
  }

  return {
    backdrop: backdropStyle,
    dialog: dialogStyle,
  }
}

// --------------------------------------------------------------------------
// DRAWER THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface DrawerTheme {
  permanent: {
    background: string
    borderRight: string
    borderLeft: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
  }
  temporary: {
    background: string
    borderRight: string
    borderLeft: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
  }
  backdrop: {
    backgroundColor: string
    backdropFilter: string
  }
  transition: string
}

export interface DrawerStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Permanent drawer styling
  permanentBackground?: string
  permanentBorderRight?: string
  permanentBorderLeft?: string
  permanentBoxShadow?: string
  permanentBackdropFilter?: string
  permanentBackgroundImage?: string

  // Temporary drawer styling
  temporaryBackground?: string
  temporaryBorderRight?: string
  temporaryBorderLeft?: string
  temporaryBoxShadow?: string
  temporaryBackdropFilter?: string
  temporaryBackgroundImage?: string

  // Backdrop styling
  backdropBackgroundColor?: string
  backdropBackdropFilter?: string

  // Layout and spacing
  width?: string
  height?: string
  top?: string | number
  padding?: string
  margin?: string
  zIndex?: number
  backdropZIndex?: number

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean

  // Dimensions
  maxWidth?: string
  minWidth?: string
  maxHeight?: string
  minHeight?: string

  // Force positioning
  forceLeft?: boolean
  forceRight?: boolean
}

export const drawerThemes: Record<'light' | 'dark' | 'sacred', DrawerTheme> = {
  light: {
    permanent: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRight: '1px solid rgba(226, 232, 240, 0.8)',
      borderLeft: 'none',
      boxShadow: SHADOWS.light.medium,
      backdropFilter: 'blur(8px)',
    },
    temporary: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRight: '1px solid rgba(226, 232, 240, 0.8)',
      borderLeft: 'none',
      boxShadow: SHADOWS.light.large,
      backdropFilter: 'blur(8px)',
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    permanent: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRight: '1px solid rgba(75, 85, 99, 0.8)',
      borderLeft: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
    },
    temporary: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderRight: '1px solid rgba(75, 85, 99, 0.8)',
      borderLeft: 'none',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(2px)',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    permanent: {
      background: 'rgba(10, 10, 10, 0.95)',
      borderRight: '2px solid rgba(255, 215, 0, 0.4)',
      borderLeft: 'none',
      boxShadow: SHADOWS.sacred.large,
      backdropFilter: 'blur(8px)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    temporary: {
      background: 'rgba(10, 10, 10, 0.95)',
      borderRight: '2px solid rgba(255, 215, 0, 0.6)',
      borderLeft: 'none',
      boxShadow: SHADOWS.sacred.large,
      backdropFilter: 'blur(8px)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
      `,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getDrawerTheme = (styles?: DrawerStyles): DrawerTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = drawerThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    permanent: {
      background: styles.permanentBackground || baseTheme.permanent.background,
      borderRight:
        styles.permanentBorderRight || baseTheme.permanent.borderRight,
      borderLeft: styles.permanentBorderLeft || baseTheme.permanent.borderLeft,
      boxShadow: styles.permanentBoxShadow || baseTheme.permanent.boxShadow,
      backdropFilter:
        styles.permanentBackdropFilter || baseTheme.permanent.backdropFilter,
      backgroundImage:
        styles.permanentBackgroundImage || baseTheme.permanent.backgroundImage,
    },
    temporary: {
      background: styles.temporaryBackground || baseTheme.temporary.background,
      borderRight:
        styles.temporaryBorderRight || baseTheme.temporary.borderRight,
      borderLeft: styles.temporaryBorderLeft || baseTheme.temporary.borderLeft,
      boxShadow: styles.temporaryBoxShadow || baseTheme.temporary.boxShadow,
      backdropFilter:
        styles.temporaryBackdropFilter || baseTheme.temporary.backdropFilter,
      backgroundImage:
        styles.temporaryBackgroundImage || baseTheme.temporary.backgroundImage,
    },
    backdrop: {
      backgroundColor:
        styles.backdropBackgroundColor || baseTheme.backdrop.backgroundColor,
      backdropFilter:
        styles.backdropBackdropFilter || baseTheme.backdrop.backdropFilter,
    },
    transition: styles.transitionDuration
      ? `transform ${styles.transitionDuration} ${styles.transitionEasing || 'ease-in-out'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getDrawerStyles = (
  styles?: DrawerStyles,
  open?: boolean,
  anchor?: 'left' | 'right' | 'top' | 'bottom',
  _variant?: 'permanent' | 'temporary'
) => {
  const themeConfig = getDrawerTheme(styles)
  const anchorSide = anchor || 'left'
  const isHorizontal = anchorSide === 'top' || anchorSide === 'bottom'

  // Determine actual anchor side (allow force overrides)
  const effectiveAnchor = styles?.forceLeft
    ? 'left'
    : styles?.forceRight
      ? 'right'
      : anchorSide

  const permanentStyle: React.CSSProperties = {
    height: isHorizontal ? styles?.height || '240px' : styles?.height || '100%',
    width: isHorizontal ? styles?.width || '100%' : styles?.width || '240px',
    position: 'fixed',
    top: isHorizontal
      ? effectiveAnchor === 'top'
        ? 0
        : 'auto'
      : styles?.top || 0,
    bottom: effectiveAnchor === 'bottom' ? 0 : 'auto',
    left: effectiveAnchor === 'left' ? 0 : 'auto',
    right: effectiveAnchor === 'right' ? 0 : 'auto',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    background: themeConfig.permanent.background,
    ...(effectiveAnchor === 'left' && {
      borderRight: themeConfig.permanent.borderRight,
    }),
    ...(effectiveAnchor === 'right' && {
      borderLeft: themeConfig.permanent.borderLeft,
    }),
    ...(effectiveAnchor === 'top' && {
      borderBottom: themeConfig.permanent.borderRight,
    }),
    ...(effectiveAnchor === 'bottom' && {
      borderTop: themeConfig.permanent.borderLeft,
    }),
    boxShadow: themeConfig.permanent.boxShadow,
    backdropFilter: themeConfig.permanent.backdropFilter,
    backgroundImage: themeConfig.permanent.backgroundImage,
    zIndex: styles?.zIndex || 30,
    opacity: styles?.disabled ? 0.5 : 1,
    pointerEvents: styles?.disabled ? 'none' : 'auto',
  }

  const temporaryBackdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: themeConfig.backdrop.backgroundColor,
    backdropFilter: themeConfig.backdrop.backdropFilter,
    zIndex: styles?.backdropZIndex || 40,
  }

  const temporaryDrawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    height: styles?.height || '100%',
    width: styles?.width || '240px',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    background: themeConfig.temporary.background,
    [effectiveAnchor === 'left' ? 'borderRight' : 'borderLeft']:
      effectiveAnchor === 'left'
        ? themeConfig.temporary.borderRight
        : themeConfig.temporary.borderLeft,
    boxShadow: themeConfig.temporary.boxShadow,
    backdropFilter: themeConfig.temporary.backdropFilter,
    backgroundImage: themeConfig.temporary.backgroundImage,
    zIndex: styles?.zIndex || 50,
    transition: themeConfig.transition,
    [effectiveAnchor]: 0,
    transform: open
      ? 'translateX(0)'
      : effectiveAnchor === 'left'
        ? 'translateX(-100%)'
        : 'translateX(100%)',
    opacity: styles?.disabled ? 0.5 : 1,
    pointerEvents: styles?.disabled ? 'none' : 'auto',
  }

  // Paper style (main content area)
  const paperStyle: React.CSSProperties = {
    position: 'fixed',
    height: isHorizontal ? styles?.height || '240px' : styles?.height || '100%',
    width: isHorizontal ? styles?.width || '100%' : styles?.width || '280px',
    top: isHorizontal
      ? effectiveAnchor === 'top'
        ? 0
        : 'auto'
      : styles?.top || 0,
    bottom: effectiveAnchor === 'bottom' ? 0 : 'auto',
    left: effectiveAnchor === 'left' ? 0 : 'auto',
    right: effectiveAnchor === 'right' ? 0 : 'auto',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    background: themeConfig.temporary.background,
    ...(effectiveAnchor === 'left' && {
      borderRight: themeConfig.temporary.borderRight,
    }),
    ...(effectiveAnchor === 'right' && {
      borderLeft: themeConfig.temporary.borderLeft,
    }),
    ...(effectiveAnchor === 'top' && {
      borderBottom: themeConfig.temporary.borderRight,
    }),
    ...(effectiveAnchor === 'bottom' && {
      borderTop: themeConfig.temporary.borderLeft,
    }),
    boxShadow: themeConfig.temporary.boxShadow,
    backdropFilter: themeConfig.temporary.backdropFilter,
    backgroundImage: themeConfig.temporary.backgroundImage,
    zIndex: styles?.zIndex || 50,
    transition: themeConfig.transition,
    transform: open
      ? isHorizontal
        ? 'translateY(0)'
        : 'translateX(0)'
      : isHorizontal
        ? effectiveAnchor === 'top'
          ? 'translateY(-100%)'
          : 'translateY(100%)'
        : effectiveAnchor === 'left'
          ? 'translateX(-100%)'
          : 'translateX(100%)',
    opacity: styles?.disabled ? 0.5 : 1,
    pointerEvents: styles?.disabled ? 'none' : 'auto',
    overflow: 'auto',
  }

  return {
    permanent: permanentStyle,
    temporaryBackdrop: temporaryBackdropStyle,
    temporaryDrawer: temporaryDrawerStyle,
    paper: paperStyle,
    backdrop: temporaryBackdropStyle,
  }
}

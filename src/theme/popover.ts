// --------------------------------------------------------------------------
// POPOVER THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface PopoverTheme {
  popover: {
    position: string
    backgroundColor: string
    borderRadius: string
    boxShadow: string
    border: string
    backdropFilter: string
    backgroundImage?: string
    marginTop: string
    zIndex: number
  }
  transition: string
}

export interface PopoverStyles {
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

  // Layout and sizing
  maxWidth?: string
  width?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  padding?: string
  margin?: string
  marginTop?: string

  // Positioning
  zIndex?: number
  position?: string
  top?: string
  left?: string
  right?: string
  bottom?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

export const popoverThemes: Record<'light' | 'dark' | 'sacred', PopoverTheme> =
  {
    light: {
      popover: {
        position: 'fixed',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: SHADOWS.light.medium,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        backdropFilter: 'blur(8px)',
        marginTop: '0.5rem',
        zIndex: 1300,
      },
      transition: TRANSITIONS.medium,
    },
    dark: {
      popover: {
        position: 'fixed',
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        borderRadius: '12px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(75, 85, 99, 0.8)',
        backdropFilter: 'blur(8px)',
        marginTop: '0.5rem',
        zIndex: 1300,
      },
      transition: TRANSITIONS.medium,
    },
    sacred: {
      popover: {
        position: 'fixed',
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        borderRadius: '8px',
        boxShadow: SHADOWS.sacred.medium,
        border: '2px solid rgba(255, 215, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        marginTop: '0.5rem',
        zIndex: 1300,
        backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
      },
      transition: TRANSITIONS.premium,
    },
  }

// Helper function to get computed theme with custom style overrides
export const getPopoverTheme = (styles?: PopoverStyles): PopoverTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = popoverThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    popover: {
      ...(() => {
        const computedBackgroundImage =
          styles.backgroundImage ?? baseTheme.popover.backgroundImage

        const overrides: Partial<PopoverTheme['popover']> = {
          backgroundColor:
            styles.backgroundColor || baseTheme.popover.backgroundColor,
          border: styles.borderColor
            ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
            : baseTheme.popover.border,
          borderRadius: styles.borderRadius || baseTheme.popover.borderRadius,
          boxShadow: styles.boxShadow || baseTheme.popover.boxShadow,
          backdropFilter:
            styles.backdropFilter || baseTheme.popover.backdropFilter,
          marginTop: styles.marginTop || baseTheme.popover.marginTop,
          zIndex: styles.zIndex || baseTheme.popover.zIndex,
          position: styles.position || baseTheme.popover.position,
        }

        if (computedBackgroundImage !== undefined) {
          overrides.backgroundImage = computedBackgroundImage
        }

        return { ...baseTheme.popover, ...overrides }
      })(),
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getPopoverStyles = (
  styles?: PopoverStyles,
  anchorRect?: DOMRect
) => {
  const themeConfig = getPopoverTheme(styles)

  const popoverStyle: React.CSSProperties = {
    position: themeConfig.popover.position as any,
    backgroundColor: themeConfig.popover.backgroundColor,
    borderRadius: themeConfig.popover.borderRadius,
    boxShadow: themeConfig.popover.boxShadow,
    border: themeConfig.popover.border,
    backdropFilter: themeConfig.popover.backdropFilter,
    backgroundImage: themeConfig.popover.backgroundImage,
    marginTop: themeConfig.popover.marginTop,
    zIndex: themeConfig.popover.zIndex,
    transition: themeConfig.transition,
    // Layout and sizing
    maxWidth: styles?.maxWidth,
    width: styles?.width,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    // Positioning based on anchor element
    ...(anchorRect && {
      top: styles?.top || anchorRect.bottom,
      left: styles?.left || anchorRect.left,
      right: styles?.right,
      bottom: styles?.bottom,
    }),
  }

  return {
    popover: popoverStyle,
  }
}

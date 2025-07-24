// --------------------------------------------------------------------------
// ZOOM THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface ZoomTheme {
  container: {
    transform: string
    transition: string
    transformOrigin: string
  }
  visible: {
    transform: string
    opacity: number
  }
  hidden: {
    transform: string
    opacity: number
  }
}

export interface ZoomStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  in?: boolean
  timeout?: number
  appear?: boolean
  enter?: boolean
  exit?: boolean

  // Transform properties
  transformOrigin?: string
  scale?: number
  scaleEnter?: number
  scaleExit?: number

  // Custom transition
  transition?: string
  transitionDuration?: string
  transitionDelay?: string
  transitionTimingFunction?: string

  // States
  disabled?: boolean
}

export const zoomThemes: Record<'light' | 'dark' | 'sacred', ZoomTheme> = {
  light: {
    container: {
      transform: 'scale(1)',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transformOrigin: 'center center',
    },
    visible: {
      transform: 'scale(1)',
      opacity: 1,
    },
    hidden: {
      transform: 'scale(0.8)',
      opacity: 0,
    },
  },
  dark: {
    container: {
      transform: 'scale(1)',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transformOrigin: 'center center',
    },
    visible: {
      transform: 'scale(1)',
      opacity: 1,
    },
    hidden: {
      transform: 'scale(0.8)',
      opacity: 0,
    },
  },
  sacred: {
    container: {
      transform: 'scale(1)',
      transition:
        'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center center',
    },
    visible: {
      transform: 'scale(1)',
      opacity: 1,
    },
    hidden: {
      transform: 'scale(0.7)',
      opacity: 0,
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getZoomTheme = (styles?: ZoomStyles): ZoomTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = zoomThemes[theme]

  if (!styles) {
    return baseTheme
  }

  const duration = styles.timeout
    ? `${styles.timeout}ms`
    : styles.transitionDuration || '0.3s'

  const timingFunction = styles.transitionTimingFunction || 'ease'

  const scaleEnter = styles.scaleEnter || styles.scale || 1
  const scaleExit =
    styles.scaleExit ||
    baseTheme.hidden.transform.match(/scale\(([\d.]+)\)/)?.[1] ||
    '0.8'

  return {
    container: {
      transform: baseTheme.container.transform,
      transition:
        styles.transition ||
        `transform ${duration} ${timingFunction}, opacity ${duration} ${timingFunction}`,
      transformOrigin:
        styles.transformOrigin || baseTheme.container.transformOrigin,
    },
    visible: {
      transform: `scale(${scaleEnter})`,
      opacity: baseTheme.visible.opacity,
    },
    hidden: {
      transform: `scale(${scaleExit})`,
      opacity: baseTheme.hidden.opacity,
    },
  }
}

// Main style generator function
export const getZoomStyles = (styles?: ZoomStyles, isDisabled?: boolean) => {
  const themeConfig = getZoomTheme(styles)
  const isVisible = styles?.in !== false

  const containerStyle: React.CSSProperties = {
    transform: isVisible
      ? themeConfig.visible.transform
      : themeConfig.hidden.transform,
    opacity: isVisible
      ? themeConfig.visible.opacity
      : themeConfig.hidden.opacity,
    transition: themeConfig.container.transition,
    transformOrigin: themeConfig.container.transformOrigin,
    transitionDelay: styles?.transitionDelay,
    // State-based styling
    ...(isDisabled && {
      transition: 'none',
      transform: 'scale(1)',
      opacity: 0.6,
    }),
  }

  return {
    container: containerStyle,
  }
}

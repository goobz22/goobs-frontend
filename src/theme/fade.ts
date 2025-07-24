// --------------------------------------------------------------------------
// FADE THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
//

export interface FadeTheme {
  container: {
    opacity: number
    transition: string
  }
  visible: {
    opacity: number
  }
  hidden: {
    opacity: number
  }
}

export interface FadeStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  in?: boolean
  timeout?: number
  appear?: boolean
  enter?: boolean
  exit?: boolean

  // Custom transition
  transition?: string
  transitionDuration?: string
  transitionDelay?: string
  transitionTimingFunction?: string

  // States
  disabled?: boolean
}

export const fadeThemes: Record<'light' | 'dark' | 'sacred', FadeTheme> = {
  light: {
    container: {
      opacity: 1,
      transition: 'opacity 0.3s ease',
    },
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  dark: {
    container: {
      opacity: 1,
      transition: 'opacity 0.3s ease',
    },
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  sacred: {
    container: {
      opacity: 1,
      transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
}

// Helper function to get computed theme with custom style overrides
export const getFadeTheme = (styles?: FadeStyles): FadeTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = fadeThemes[theme]

  if (!styles) {
    return baseTheme
  }

  const duration = styles.timeout
    ? `${styles.timeout}ms`
    : styles.transitionDuration || baseTheme.container.transition.split(' ')[1]

  const timingFunction =
    styles.transitionTimingFunction ||
    baseTheme.container.transition.split(' ').slice(2).join(' ')

  return {
    container: {
      opacity: baseTheme.container.opacity,
      transition: styles.transition || `opacity ${duration} ${timingFunction}`,
    },
    visible: {
      opacity: baseTheme.visible.opacity,
    },
    hidden: {
      opacity: baseTheme.hidden.opacity,
    },
  }
}

// Main style generator function
export const getFadeStyles = (styles?: FadeStyles, isDisabled?: boolean) => {
  const themeConfig = getFadeTheme(styles)
  const isVisible = styles?.in !== false

  const containerStyle: React.CSSProperties = {
    opacity: isVisible
      ? themeConfig.visible.opacity
      : themeConfig.hidden.opacity,
    transition: themeConfig.container.transition,
    transitionDelay: styles?.transitionDelay,
    // State-based styling
    ...(isDisabled && {
      transition: 'none',
      opacity: 0.6,
    }),
  }

  return {
    container: containerStyle,
  }
}

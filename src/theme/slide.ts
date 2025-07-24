// --------------------------------------------------------------------------
// SLIDE THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS } from './shared'

export interface SlideTheme {
  container: {
    transform: string
    transition: string
  }
  visible: {
    transform: string
  }
  hidden: {
    transform: string
  }
}

export interface SlideStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  in?: boolean
  timeout?: number
  appear?: boolean
  enter?: boolean
  exit?: boolean

  // Slide direction
  direction?: 'up' | 'down' | 'left' | 'right'

  // Custom transition
  transition?: string
  transitionDuration?: string
  transitionDelay?: string
  transitionTimingFunction?: string

  // States
  disabled?: boolean
}

export const slideThemes: Record<'light' | 'dark' | 'sacred', SlideTheme> = {
  light: {
    container: {
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease',
    },
    visible: {
      transform: 'translateY(0)',
    },
    hidden: {
      transform: 'translateY(-100%)',
    },
  },
  dark: {
    container: {
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease',
    },
    visible: {
      transform: 'translateY(0)',
    },
    hidden: {
      transform: 'translateY(-100%)',
    },
  },
  sacred: {
    container: {
      transform: 'translateY(0)',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    visible: {
      transform: 'translateY(0)',
    },
    hidden: {
      transform: 'translateY(-100%)',
    },
  },
}

// Helper function to get slide transform based on direction
const getSlideTransform = (
  direction: SlideStyles['direction'] = 'up',
  isHidden: boolean
): string => {
  if (!isHidden) {
    return 'translate(0, 0)'
  }

  switch (direction) {
    case 'up':
      return 'translateY(-100%)'
    case 'down':
      return 'translateY(100%)'
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    default:
      return 'translateY(-100%)'
  }
}

// Helper function to get computed theme with custom style overrides
export const getSlideTheme = (styles?: SlideStyles): SlideTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = slideThemes[theme]

  if (!styles) {
    return baseTheme
  }

  const duration = styles.timeout
    ? `${styles.timeout}ms`
    : styles.transitionDuration || baseTheme.container.transition.split(' ')[1]

  const timingFunction =
    styles.transitionTimingFunction ||
    baseTheme.container.transition.split(' ').slice(2).join(' ')

  const direction = styles.direction || 'up'

  return {
    container: {
      transform: baseTheme.container.transform,
      transition:
        styles.transition || `transform ${duration} ${timingFunction}`,
    },
    visible: {
      transform: getSlideTransform(direction, false),
    },
    hidden: {
      transform: getSlideTransform(direction, true),
    },
  }
}

// Main style generator function
export const getSlideStyles = (styles?: SlideStyles, isDisabled?: boolean) => {
  const themeConfig = getSlideTheme(styles)
  const isVisible = styles?.in !== false

  const containerStyle: React.CSSProperties = {
    transform: isVisible
      ? themeConfig.visible.transform
      : themeConfig.hidden.transform,
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

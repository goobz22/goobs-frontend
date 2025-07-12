// --------------------------------------------------------------------------
// PROGRESS BAR THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ProgressBarTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    backgroundImage?: string
  }
  bar: {
    background: string
    borderRadius: string
    boxShadow: string
    backgroundImage?: string
    filter?: string
  }
  indeterminateBar: {
    background: string
    borderRadius: string
    boxShadow: string
    backgroundImage?: string
    filter?: string
    animation: string
  }
  label: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    textShadow?: string
  }
  transition: string
}

export interface ProgressBarStyles {
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

  // Bar styling
  barBackground?: string
  barBorderRadius?: string
  barBoxShadow?: string
  barBackgroundImage?: string
  barFilter?: string

  // Indeterminate bar styling
  indeterminateBarBackground?: string
  indeterminateBarBorderRadius?: string
  indeterminateBarBoxShadow?: string
  indeterminateBarBackgroundImage?: string
  indeterminateBarFilter?: string
  indeterminateBarAnimation?: string

  // Label styling
  labelColor?: string
  labelFontSize?: string
  labelFontFamily?: string
  labelFontWeight?: string | number
  labelTextShadow?: string

  // Layout and spacing
  width?: string
  height?: string
  padding?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

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
}

export const progressBarThemes: Record<
  'light' | 'dark' | 'sacred',
  ProgressBarTheme
> = {
  light: {
    container: {
      background: 'rgba(229, 231, 235, 0.8)',
      border: '1px solid rgba(209, 213, 219, 0.6)',
      borderRadius: '9999px',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(4px)',
    },
    bar: {
      background:
        'linear-gradient(to right, rgb(37, 99, 235), rgb(59, 130, 246), rgb(37, 99, 235))',
      borderRadius: '9999px',
      boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
      filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.2))',
    },
    indeterminateBar: {
      background:
        'linear-gradient(90deg, transparent, rgb(59, 130, 246), transparent)',
      borderRadius: '9999px',
      boxShadow: '0 1px 3px rgba(59, 130, 246, 0.4)',
      filter: 'drop-shadow(0 1px 2px rgba(59, 130, 246, 0.3))',
      animation: 'progressIndeterminate 1.5s ease-in-out infinite',
    },
    label: {
      color: 'rgb(55, 65, 81)',
      fontSize: '14px',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(55, 65, 81, 0.8)',
      border: '1px solid rgba(75, 85, 99, 0.6)',
      borderRadius: '9999px',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(4px)',
    },
    bar: {
      background:
        'linear-gradient(to right, rgb(96, 165, 250), rgb(147, 197, 253), rgb(96, 165, 250))',
      borderRadius: '9999px',
      boxShadow: '0 1px 3px rgba(96, 165, 250, 0.4)',
      filter: 'drop-shadow(0 1px 2px rgba(96, 165, 250, 0.3))',
    },
    indeterminateBar: {
      background:
        'linear-gradient(90deg, transparent, rgb(147, 197, 253), transparent)',
      borderRadius: '9999px',
      boxShadow: '0 1px 3px rgba(147, 197, 253, 0.5)',
      filter: 'drop-shadow(0 1px 2px rgba(147, 197, 253, 0.4))',
      animation: 'progressIndeterminate 1.5s ease-in-out infinite',
    },
    label: {
      color: 'rgb(209, 213, 219)',
      fontSize: '14px',
      fontFamily: '"Inter", sans-serif',
      fontWeight: '500',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(26, 26, 26, 0.9)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '9999px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(4px)',
      backgroundImage: `
        radial-gradient(circle at left, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at right, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    bar: {
      background:
        'linear-gradient(to right, #FBBF24, #F59E0B, #FFD700, #F59E0B, #FBBF24)',
      borderRadius: '9999px',
      boxShadow:
        '0 0 8px rgba(255, 215, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
    },
    indeterminateBar: {
      background:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), #FFD700, rgba(255, 215, 0, 0.3), transparent)',
      borderRadius: '9999px',
      boxShadow:
        '0 0 12px rgba(255, 215, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 1))',
      animation: 'sacredProgressIndeterminate 2s ease-in-out infinite',
    },
    label: {
      color: '#FFD700',
      fontSize: '14px',
      fontFamily: '"Cinzel", serif',
      fontWeight: '600',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
    },
    transition: TRANSITIONS.slow,
  },
}

// Helper function to get computed theme with custom style overrides
export const getProgressBarTheme = (
  styles?: ProgressBarStyles
): ProgressBarTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = progressBarThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      backgroundImage:
        styles.backgroundImage || baseTheme.container.backgroundImage,
    },
    bar: {
      background: styles.barBackground || baseTheme.bar.background,
      borderRadius: styles.barBorderRadius || baseTheme.bar.borderRadius,
      boxShadow: styles.barBoxShadow || baseTheme.bar.boxShadow,
      backgroundImage:
        styles.barBackgroundImage || baseTheme.bar.backgroundImage,
      filter: styles.barFilter || baseTheme.bar.filter,
    },
    indeterminateBar: {
      background:
        styles.indeterminateBarBackground ||
        baseTheme.indeterminateBar.background,
      borderRadius:
        styles.indeterminateBarBorderRadius ||
        baseTheme.indeterminateBar.borderRadius,
      boxShadow:
        styles.indeterminateBarBoxShadow ||
        baseTheme.indeterminateBar.boxShadow,
      backgroundImage:
        styles.indeterminateBarBackgroundImage ||
        baseTheme.indeterminateBar.backgroundImage,
      filter:
        styles.indeterminateBarFilter || baseTheme.indeterminateBar.filter,
      animation:
        styles.indeterminateBarAnimation ||
        baseTheme.indeterminateBar.animation,
    },
    label: {
      color: styles.labelColor || baseTheme.label.color,
      fontSize: styles.labelFontSize || baseTheme.label.fontSize,
      fontFamily: styles.labelFontFamily || baseTheme.label.fontFamily,
      fontWeight: styles.labelFontWeight || baseTheme.label.fontWeight,
      textShadow: styles.labelTextShadow || baseTheme.label.textShadow,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getProgressBarStyles = (
  styles?: ProgressBarStyles,
  value?: number,
  variant?: 'determinate' | 'indeterminate'
) => {
  const themeConfig = getProgressBarTheme(styles)
  const progressValue = Math.min(Math.max(value || 0, 0), 100)
  const isIndeterminate = variant === 'indeterminate'

  const containerStyle: React.CSSProperties = {
    width: styles?.width || '100%',
    height: styles?.height || '10px',
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    padding: styles?.padding,
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    background: themeConfig.container.background,
    border: themeConfig.container.border,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    backgroundImage: themeConfig.container.backgroundImage,
    position: 'relative',
    overflow: 'hidden',
    opacity: styles?.disabled ? 0.5 : 1,
    pointerEvents: styles?.disabled ? 'none' : 'auto',
  }

  const barStyle: React.CSSProperties = isIndeterminate
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '50%',
        background: themeConfig.indeterminateBar.background,
        borderRadius: themeConfig.indeterminateBar.borderRadius,
        boxShadow: themeConfig.indeterminateBar.boxShadow,
        backgroundImage: themeConfig.indeterminateBar.backgroundImage,
        filter: themeConfig.indeterminateBar.filter,
        animation: themeConfig.indeterminateBar.animation,
      }
    : {
        height: '100%',
        width: `${progressValue}%`,
        background: themeConfig.bar.background,
        borderRadius: themeConfig.bar.borderRadius,
        boxShadow: themeConfig.bar.boxShadow,
        backgroundImage: themeConfig.bar.backgroundImage,
        filter: themeConfig.bar.filter,
        transition: themeConfig.transition,
      }

  const labelStyle: React.CSSProperties = {
    color: themeConfig.label.color,
    fontSize: themeConfig.label.fontSize,
    fontFamily: themeConfig.label.fontFamily,
    fontWeight: themeConfig.label.fontWeight,
    textShadow: themeConfig.label.textShadow,
    marginTop: '4px',
    textAlign: 'center',
  }

  return {
    container: containerStyle,
    bar: barStyle,
    label: labelStyle,
  }
}

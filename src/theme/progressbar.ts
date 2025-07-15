// --------------------------------------------------------------------------
// PROGRESS BAR THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { SHADOWS } from './shared'

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
    position?: string
    overflow?: string
  }
  indeterminateBar: {
    background: string
    borderRadius: string
    boxShadow: string
    backgroundImage?: string
    filter?: string
    animation: string
    position?: string
  }
  label: {
    color: string
    fontSize: string
    fontFamily: string
    fontWeight: string | number
    textShadow?: string
  }
  transition: string
  stripes?: {
    backgroundImage: string
    backgroundSize: string
    animation: string
  }
  pulse?: {
    animation: string
    boxShadow: string
  }
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
  striped?: boolean
  animated?: boolean
  pulse?: boolean

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
      borderRadius: '12px',
      boxShadow:
        'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(8px)',
    },
    bar: {
      background:
        'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 50%, #2563EB 100%)',
      borderRadius: '12px',
      boxShadow:
        '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
      position: 'relative',
      overflow: 'hidden',
    },
    indeterminateBar: {
      background:
        'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 25%, #3B82F6 50%, rgba(59, 130, 246, 0.3) 75%, transparent 100%)',
      borderRadius: '12px',
      boxShadow:
        '0 4px 12px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4))',
      animation: 'progressIndeterminate 2s ease-in-out infinite',
      position: 'absolute',
    },
    label: {
      color: 'rgb(55, 65, 81)',
      fontSize: '14px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: '600',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    stripes: {
      backgroundImage:
        'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
      backgroundSize: '20px 20px',
      animation: 'progressStripes 1s linear infinite',
    },
    pulse: {
      animation: 'progressPulse 2s ease-in-out infinite',
      boxShadow: '0 0 0 rgba(59, 130, 246, 0.7)',
    },
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.9)',
      border: '1px solid rgba(75, 85, 99, 0.6)',
      borderRadius: '12px',
      boxShadow:
        'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
    },
    bar: {
      background:
        'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #1D4ED8 100%)',
      borderRadius: '12px',
      boxShadow:
        '0 4px 12px rgba(96, 165, 250, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3))',
      position: 'relative',
      overflow: 'hidden',
    },
    indeterminateBar: {
      background:
        'linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.3) 25%, #60A5FA 50%, rgba(96, 165, 250, 0.3) 75%, transparent 100%)',
      borderRadius: '12px',
      boxShadow:
        '0 4px 12px rgba(96, 165, 250, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.4))',
      animation: 'progressIndeterminate 2s ease-in-out infinite',
      position: 'absolute',
    },
    label: {
      color: 'rgb(209, 213, 219)',
      fontSize: '14px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: '600',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    stripes: {
      backgroundImage:
        'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent)',
      backgroundSize: '20px 20px',
      animation: 'progressStripes 1s linear infinite',
    },
    pulse: {
      animation: 'progressPulse 2s ease-in-out infinite',
      boxShadow: '0 0 0 rgba(96, 165, 250, 0.7)',
    },
  },
  sacred: {
    container: {
      background: 'rgba(12, 12, 12, 0.95)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      boxShadow:
        SHADOWS.sacred.small + ', inset 0 1px 0 rgba(255, 215, 0, 0.1)',
      backdropFilter: 'blur(12px)',
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
      `,
    },
    bar: {
      background:
        'linear-gradient(135deg, #FBBF24 0%, #F59E0B 25%, #FFD700 50%, #F59E0B 75%, #FBBF24 100%)',
      borderRadius: '12px',
      boxShadow:
        '0 0 16px rgba(255, 215, 0, 0.8), 0 4px 12px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))',
      position: 'relative',
      overflow: 'hidden',
    },
    indeterminateBar: {
      background:
        'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.2) 20%, rgba(255, 215, 0, 0.6) 40%, #FFD700 50%, rgba(255, 215, 0, 0.6) 60%, rgba(255, 215, 0, 0.2) 80%, transparent 100%)',
      borderRadius: '12px',
      boxShadow:
        '0 0 20px rgba(255, 215, 0, 0.9), 0 4px 12px rgba(255, 215, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 1))',
      animation: 'sacredProgressIndeterminate 2.5s ease-in-out infinite',
      position: 'absolute',
    },
    label: {
      color: '#FFD700',
      fontSize: '14px',
      fontFamily: '"Cinzel", Georgia, serif',
      fontWeight: '700',
      textShadow:
        '0 0 8px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5)',
    },
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    stripes: {
      backgroundImage:
        'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)',
      backgroundSize: '16px 16px',
      animation: 'progressStripes 0.8s linear infinite',
    },
    pulse: {
      animation: 'sacredProgressPulse 2s ease-in-out infinite',
      boxShadow: '0 0 0 rgba(255, 215, 0, 0.8)',
    },
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
      position: baseTheme.bar.position,
      overflow: baseTheme.bar.overflow,
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
      position: baseTheme.indeterminateBar.position,
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
    stripes: baseTheme.stripes,
    pulse: baseTheme.pulse,
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
    height: styles?.height || '16px',
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
        width: '60%',
        background: themeConfig.indeterminateBar.background,
        borderRadius: themeConfig.indeterminateBar.borderRadius,
        boxShadow: themeConfig.indeterminateBar.boxShadow,
        backgroundImage: themeConfig.indeterminateBar.backgroundImage,
        filter: themeConfig.indeterminateBar.filter,
        animation: themeConfig.indeterminateBar.animation,
        ...(styles?.striped &&
          themeConfig.stripes && {
            backgroundImage: `${themeConfig.stripes.backgroundImage}, ${themeConfig.indeterminateBar.background}`,
            backgroundSize: themeConfig.stripes.backgroundSize,
            animation: `${themeConfig.indeterminateBar.animation}, ${themeConfig.stripes.animation}`,
          }),
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
        position: 'relative',
        overflow: 'hidden',
        ...(styles?.striped &&
          themeConfig.stripes && {
            backgroundImage: `${themeConfig.stripes.backgroundImage}, ${themeConfig.bar.background}`,
            backgroundSize: themeConfig.stripes.backgroundSize,
            ...(styles?.animated && {
              animation: themeConfig.stripes.animation,
            }),
          }),
        ...(styles?.pulse &&
          themeConfig.pulse && {
            animation: `${themeConfig.pulse.animation}${styles?.striped && styles?.animated && themeConfig.stripes ? `, ${themeConfig.stripes.animation}` : ''}`,
          }),
      }

  const labelStyle: React.CSSProperties = {
    color: themeConfig.label.color,
    fontSize: themeConfig.label.fontSize,
    fontFamily: themeConfig.label.fontFamily,
    fontWeight: themeConfig.label.fontWeight,
    textShadow: themeConfig.label.textShadow,
    marginTop: '8px',
    textAlign: 'center',
  }

  return {
    container: containerStyle,
    bar: barStyle,
    label: labelStyle,
  }
}

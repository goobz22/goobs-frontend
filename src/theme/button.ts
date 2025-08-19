// --------------------------------------------------------------------------
// BUTTON THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ButtonTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    fontFamily: string
    fontSize: string
    fontWeight: string | number
    letterSpacing: string
    color: string
    textShadow?: string
    textTransform?: string
    padding: string
    minHeight: string
    gap: string
    backgroundImage?: string
  }
  containerHover: {
    transform: string
    boxShadow: string
    backgroundColor: string
    borderColor?: string
    color: string
    textShadow?: string
  }
  containerActive: {
    transform: string
    boxShadow: string
  }
  containerDisabled: {
    opacity: number
    backgroundColor: string
    color: string
    borderColor?: string
    textShadow?: string
  }
  transition: string
}

export interface ButtonStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Layout and positioning
  contentAlign?: 'left' | 'center' | 'right'
  iconLocation?: 'left' | 'right' | 'above'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string
  fontFamily?: string
  fontSize?: string
  fontWeight?: string | number
  letterSpacing?: string
  color?: string
  textShadow?: string
  textTransform?: string
  padding?: string
  minHeight?: string
  gap?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string
  hoverColor?: string
  hoverTextShadow?: string

  // Active states
  activeTransform?: string
  activeBoxShadow?: string

  // Disabled states
  disabledOpacity?: number
  disabledBackgroundColor?: string
  disabledColor?: string
  disabledBorderColor?: string
  disabledTextShadow?: string

  // Layout and spacing
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
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
}

export const buttonThemes: Record<'light' | 'dark' | 'sacred', ButtonTheme> = {
  light: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '10px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(8px)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'rgb(55, 65, 81)',
      padding: '12px 24px',
      minHeight: '44px',
      gap: '8px',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow:
        '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
      backgroundColor: 'rgba(239, 246, 255, 0.95)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      color: 'rgb(29, 78, 216)',
    },
    containerActive: {
      transform: 'translateY(0px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
    },
    containerDisabled: {
      opacity: 0.6,
      backgroundColor: 'rgba(249, 250, 251, 0.8)',
      color: 'rgb(156, 163, 175)',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      borderRadius: '10px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'rgb(243, 244, 246)',
      padding: '12px 24px',
      minHeight: '44px',
      gap: '8px',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
      backgroundColor: 'rgba(30, 58, 138, 0.3)',
      borderColor: 'rgba(96, 165, 250, 0.4)',
      color: 'rgb(96, 165, 250)',
    },
    containerActive: {
      transform: 'translateY(0px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    },
    containerDisabled: {
      opacity: 0.6,
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      color: 'rgb(75, 85, 99)',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(10, 10, 10, 0.9)',
      border: '2px solid rgba(255, 215, 0, 0.4)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(8px)',
      fontFamily: '"Cinzel", serif',
      fontSize: '15px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      color: 'rgba(255, 215, 0, 0.9)',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      textTransform: 'uppercase',
      padding: '16px 32px',
      minHeight: '52px',
      gap: '12px',
    },
    containerHover: {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.sacred.medium,
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: 'rgba(255, 215, 0, 0.8)',
      color: '#FFD700',
      textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
    },
    containerActive: {
      transform: 'translateY(-1px)',
      boxShadow:
        '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15)',
    },
    containerDisabled: {
      opacity: 0.4,
      backgroundColor: 'rgba(10, 10, 10, 0.6)',
      color: 'rgba(255, 215, 0, 0.3)',
      borderColor: 'rgba(255, 215, 0, 0.2)',
      textShadow: 'none',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getButtonTheme = (styles?: ButtonStyles): ButtonTheme => {
  const theme = styles?.theme || 'sacred'
  const baseTheme = buttonThemes[theme]

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
      fontFamily: styles.fontFamily || baseTheme.container.fontFamily,
      fontSize: styles.fontSize || baseTheme.container.fontSize,
      fontWeight: styles.fontWeight || baseTheme.container.fontWeight,
      letterSpacing: styles.letterSpacing || baseTheme.container.letterSpacing,
      color: styles.color || baseTheme.container.color,
      padding: styles.padding || baseTheme.container.padding,
      minHeight: styles.minHeight || baseTheme.container.minHeight,
      gap: styles.gap || baseTheme.container.gap,
      ...(styles.textShadow !== undefined ||
      baseTheme.container.textShadow !== undefined
        ? { textShadow: styles.textShadow ?? baseTheme.container.textShadow }
        : {}),
      ...(styles.textTransform !== undefined ||
      baseTheme.container.textTransform !== undefined
        ? {
            textTransform:
              styles.textTransform ?? baseTheme.container.textTransform,
          }
        : {}),
      ...(styles.backgroundImage !== undefined ||
      baseTheme.container.backgroundImage !== undefined
        ? {
            backgroundImage:
              styles.backgroundImage ?? baseTheme.container.backgroundImage,
          }
        : {}),
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      backgroundColor:
        styles.hoverBackgroundColor || baseTheme.containerHover.backgroundColor,
      color: styles.hoverColor || baseTheme.containerHover.color,
      ...(styles.hoverBorderColor !== undefined ||
      baseTheme.containerHover.borderColor !== undefined
        ? {
            borderColor:
              styles.hoverBorderColor ?? baseTheme.containerHover.borderColor,
          }
        : {}),
      ...(styles.hoverTextShadow !== undefined ||
      baseTheme.containerHover.textShadow !== undefined
        ? {
            textShadow:
              styles.hoverTextShadow ?? baseTheme.containerHover.textShadow,
          }
        : {}),
    },
    containerActive: {
      transform: styles.activeTransform || baseTheme.containerActive.transform,
      boxShadow: styles.activeBoxShadow || baseTheme.containerActive.boxShadow,
    },
    containerDisabled: {
      opacity: styles.disabledOpacity ?? baseTheme.containerDisabled.opacity,
      backgroundColor:
        styles.disabledBackgroundColor ||
        baseTheme.containerDisabled.backgroundColor,
      color: styles.disabledColor || baseTheme.containerDisabled.color,
      ...(styles.disabledBorderColor !== undefined ||
      baseTheme.containerDisabled.borderColor !== undefined
        ? {
            borderColor:
              styles.disabledBorderColor ??
              baseTheme.containerDisabled.borderColor,
          }
        : {}),
      ...(styles.disabledTextShadow !== undefined ||
      baseTheme.containerDisabled.textShadow !== undefined
        ? {
            textShadow:
              styles.disabledTextShadow ??
              baseTheme.containerDisabled.textShadow,
          }
        : {}),
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getButtonStyles = (
  styles?: ButtonStyles,
  isHovered?: boolean,
  isActive?: boolean,
  isDisabled?: boolean
) => {
  const themeConfig = getButtonTheme(styles)

  const contentAlign = styles?.contentAlign || 'center'
  const iconLocation = styles?.iconLocation || 'left'

  const justifyContent =
    contentAlign === 'left'
      ? 'flex-start'
      : contentAlign === 'right'
        ? 'flex-end'
        : 'center'

  const flexDirection: React.CSSProperties['flexDirection'] =
    iconLocation === 'above' ? 'column' : 'row'

  // Parse the border shorthand to avoid conflicts with individual borderColor
  const parseBorder = (border: string) => {
    // Expecting format like "1px solid #color" or "2px solid rgba(255,215,0,0.4)"
    const parts = border.split(' ')
    return {
      borderWidth: parts[0] || '1px',
      borderStyle: parts[1] || 'solid',
      borderColor: parts.slice(2).join(' ') || 'transparent',
    }
  }
  const borderParts = parseBorder(themeConfig.container.border)

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: themeConfig.transition,
    borderRadius: themeConfig.container.borderRadius,
    borderWidth: borderParts.borderWidth,
    borderStyle: borderParts.borderStyle,
    borderColor: borderParts.borderColor,
    backgroundColor: themeConfig.container.background,
    backdropFilter: themeConfig.container.backdropFilter,
    boxShadow: themeConfig.container.boxShadow,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontFamily: themeConfig.container.fontFamily,
    fontSize: themeConfig.container.fontSize,
    fontWeight: themeConfig.container.fontWeight,
    letterSpacing: themeConfig.container.letterSpacing,
    color: themeConfig.container.color,
    textShadow: themeConfig.container.textShadow,
    textTransform: themeConfig.container.textTransform as any,
    textAlign: 'center' as const,
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    padding: themeConfig.container.padding,
    minHeight: themeConfig.container.minHeight,
    gap: themeConfig.container.gap,
    backgroundImage: themeConfig.container.backgroundImage,
    justifyContent,
    flexDirection,
    // Layout styling
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    width: styles?.width,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    // State-based styling
    ...(isDisabled && {
      opacity: themeConfig.containerDisabled.opacity,
      backgroundColor: themeConfig.containerDisabled.backgroundColor,
      color: themeConfig.containerDisabled.color,
      borderColor: themeConfig.containerDisabled.borderColor,
      textShadow: themeConfig.containerDisabled.textShadow,
      transform: 'none',
      boxShadow: 'none',
    }),
    ...(isHovered &&
      !isDisabled && {
        transform: themeConfig.containerHover.transform,
        boxShadow: themeConfig.containerHover.boxShadow,
        backgroundColor: themeConfig.containerHover.backgroundColor,
        borderColor: themeConfig.containerHover.borderColor,
        color: themeConfig.containerHover.color,
        textShadow: themeConfig.containerHover.textShadow,
      }),
    ...(isActive &&
      !isDisabled && {
        transform: themeConfig.containerActive.transform,
        boxShadow: themeConfig.containerActive.boxShadow,
      }),
    // Apply outline override
    ...(styles?.outline === false && {
      borderWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      boxShadow: 'none',
    }),
  }

  return {
    container: containerStyle,
  }
}

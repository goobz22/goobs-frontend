// --------------------------------------------------------------------------
// CHIP THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ChipTheme {
  container: {
    background: string
    border: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    fontFamily: string
    fontSize: string
    fontWeight: string | number
    color: string
    textShadow?: string
    padding: string
    height: string
    backgroundImage?: string
  }
  containerHover: {
    transform: string
    boxShadow: string
    backgroundColor: string
    borderColor?: string
    color: string
    backgroundImage?: string
  }
  containerDisabled: {
    opacity: number
    backgroundColor: string
    color: string
    borderColor?: string
    textShadow?: string
  }
  closeButton: {
    marginLeft: string
    marginRight: string
    padding: string
    borderRadius: string
    border: string
    background: string
    color: string
    transition: string
  }
  closeButtonHover: {
    backgroundColor: string
    color: string
    transform: string
    boxShadow?: string
  }
  closeButtonDisabled: {
    color: string
    cursor: string
  }
  glyph: {
    position: string
    fontSize: string
    color: string
    transition: string
    pointerEvents: string
    zIndex: number
  }
  glyphLeft: {
    left: string
    top: string
    transform: string
  }
  glyphRight: {
    right: string
    top: string
    transform: string
  }
  glyphVisible: {
    opacity: number
  }
  shimmer: {
    position: string
    top: string
    left: string
    width: string
    height: string
    background: string
    animation: string
  }
  transition: string
}

export interface ChipStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Visual options
  outline?: boolean

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
  color?: string
  textShadow?: string
  padding?: string
  height?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string
  hoverColor?: string
  hoverBackgroundImage?: string

  // Disabled states
  disabledOpacity?: number
  disabledBackgroundColor?: string
  disabledColor?: string
  disabledBorderColor?: string
  disabledTextShadow?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  maxHeight?: string
}

export const chipThemes: Record<'light' | 'dark' | 'sacred', ChipTheme> = {
  light: {
    container: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '16px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(4px)',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgb(59, 130, 246)',
      padding: '0 12px',
      height: '28px',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      color: 'rgb(59, 130, 246)',
    },
    containerDisabled: {
      opacity: 0.6,
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      color: 'rgb(156, 163, 175)',
      borderColor: 'rgba(156, 163, 175, 0.2)',
    },
    closeButton: {
      marginLeft: '6px',
      marginRight: '-4px',
      padding: '2px',
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      color: 'rgba(59, 130, 246, 0.7)',
      transition: TRANSITIONS.fast,
    },
    closeButtonHover: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: 'rgb(59, 130, 246)',
      transform: 'scale(1.1)',
    },
    closeButtonDisabled: {
      color: 'rgba(156, 163, 175, 0.5)',
      cursor: 'not-allowed',
    },
    glyph: {
      position: 'absolute',
      fontSize: '10px',
      color: 'rgba(59, 130, 246, 0.2)',
      transition: TRANSITIONS.medium,
      pointerEvents: 'none',
      zIndex: 0,
    },
    glyphLeft: {
      left: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    glyphRight: {
      right: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    glyphVisible: {
      opacity: 0.4,
    },
    shimmer: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
      animation: 'sacredShimmer 3s ease-in-out infinite',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(4px)',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgb(96, 165, 250)',
      padding: '0 12px',
      height: '28px',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      color: 'rgb(147, 197, 253)',
    },
    containerDisabled: {
      opacity: 0.6,
      backgroundColor: 'rgba(75, 85, 99, 0.1)',
      color: 'rgb(75, 85, 99)',
      borderColor: 'rgba(75, 85, 99, 0.2)',
    },
    closeButton: {
      marginLeft: '6px',
      marginRight: '-4px',
      padding: '2px',
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      color: 'rgba(96, 165, 250, 0.7)',
      transition: TRANSITIONS.fast,
    },
    closeButtonHover: {
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      color: 'rgb(147, 197, 253)',
      transform: 'scale(1.1)',
    },
    closeButtonDisabled: {
      color: 'rgba(75, 85, 99, 0.5)',
      cursor: 'not-allowed',
    },
    glyph: {
      position: 'absolute',
      fontSize: '10px',
      color: 'rgba(96, 165, 250, 0.2)',
      transition: TRANSITIONS.medium,
      pointerEvents: 'none',
      zIndex: 0,
    },
    glyphLeft: {
      left: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    glyphRight: {
      right: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    glyphVisible: {
      opacity: 0.4,
    },
    shimmer: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.2), transparent)',
      animation: 'sacredShimmer 3s ease-in-out infinite',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(10, 10, 10, 0.9)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(8px)',
      fontFamily: 'Cinzel, serif',
      fontSize: '14px',
      fontWeight: '500',
      color: '#FFD700',
      padding: '0 16px',
      height: '32px',
      backgroundImage:
        'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
    },
    containerHover: {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: SHADOWS.sacred.medium,
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      color: '#FFD700',
      backgroundImage:
        'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    },
    containerDisabled: {
      opacity: 0.4,
      backgroundColor: 'rgba(10, 10, 10, 0.6)',
      color: 'rgba(255, 215, 0, 0.3)',
      borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    closeButton: {
      marginLeft: '8px',
      marginRight: '-4px',
      padding: '3px',
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      color: 'rgba(255, 215, 0, 0.7)',
      transition: TRANSITIONS.premium,
    },
    closeButtonHover: {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      transform: 'scale(1.15) rotate(90deg)',
      boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)',
    },
    closeButtonDisabled: {
      color: 'rgba(255, 215, 0, 0.2)',
      cursor: 'not-allowed',
    },
    glyph: {
      position: 'absolute',
      fontSize: '10px',
      color: 'rgba(255, 215, 0, 0.2)',
      transition: TRANSITIONS.premium,
      pointerEvents: 'none',
      zIndex: 0,
    },
    glyphLeft: {
      left: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    glyphRight: {
      right: '2px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    glyphVisible: {
      opacity: 0.4,
    },
    shimmer: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
      animation: 'sacredShimmer 3s ease-in-out infinite',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getChipTheme = (styles?: ChipStyles): ChipTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = chipThemes[theme]

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
      color: styles.color || baseTheme.container.color,
      textShadow: styles.textShadow || baseTheme.container.textShadow,
      padding: styles.padding || baseTheme.container.padding,
      height: styles.height || baseTheme.container.height,
      backgroundImage:
        styles.backgroundImage || baseTheme.container.backgroundImage,
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      backgroundColor:
        styles.hoverBackgroundColor || baseTheme.containerHover.backgroundColor,
      borderColor:
        styles.hoverBorderColor || baseTheme.containerHover.borderColor,
      color: styles.hoverColor || baseTheme.containerHover.color,
      backgroundImage:
        styles.hoverBackgroundImage || baseTheme.containerHover.backgroundImage,
    },
    containerDisabled: {
      opacity: styles.disabledOpacity ?? baseTheme.containerDisabled.opacity,
      backgroundColor:
        styles.disabledBackgroundColor ||
        baseTheme.containerDisabled.backgroundColor,
      color: styles.disabledColor || baseTheme.containerDisabled.color,
      borderColor:
        styles.disabledBorderColor || baseTheme.containerDisabled.borderColor,
      textShadow:
        styles.disabledTextShadow || baseTheme.containerDisabled.textShadow,
    },
    closeButton: baseTheme.closeButton,
    closeButtonHover: baseTheme.closeButtonHover,
    closeButtonDisabled: baseTheme.closeButtonDisabled,
    glyph: baseTheme.glyph,
    glyphLeft: baseTheme.glyphLeft,
    glyphRight: baseTheme.glyphRight,
    glyphVisible: baseTheme.glyphVisible,
    shimmer: baseTheme.shimmer,
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getChipStyles = (
  styles?: ChipStyles,
  isHovered?: boolean,
  isDisabled?: boolean
) => {
  const themeConfig = getChipTheme(styles)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: themeConfig.transition,
    borderRadius: themeConfig.container.borderRadius,
    border: themeConfig.container.border,
    backgroundColor: themeConfig.container.background,
    backdropFilter: themeConfig.container.backdropFilter,
    boxShadow: themeConfig.container.boxShadow,
    cursor: 'default',
    fontFamily: themeConfig.container.fontFamily,
    fontSize: themeConfig.container.fontSize,
    fontWeight: themeConfig.container.fontWeight,
    color: themeConfig.container.color,
    textShadow: themeConfig.container.textShadow,
    padding: themeConfig.container.padding,
    height: themeConfig.container.height,
    backgroundImage: themeConfig.container.backgroundImage,
    // Layout styling
    width: styles?.width,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
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
        backgroundImage: themeConfig.containerHover.backgroundImage,
      }),
    // Apply outline override
    ...(styles?.outline === false && {
      border: 'none',
      boxShadow: 'none',
    }),
  }

  const closeButtonStyle: React.CSSProperties = {
    ...themeConfig.closeButton,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    zIndex: 1,
  }

  const closeButtonHoverStyle: React.CSSProperties = {
    ...themeConfig.closeButtonHover,
  }

  const closeButtonDisabledStyle: React.CSSProperties = {
    ...themeConfig.closeButtonDisabled,
  }

  return {
    container: containerStyle,
    closeButton: closeButtonStyle,
    closeButtonHover: closeButtonHoverStyle,
    closeButtonDisabled: closeButtonDisabledStyle,
    glyph: themeConfig.glyph as React.CSSProperties,
    glyphLeft: themeConfig.glyphLeft as React.CSSProperties,
    glyphRight: themeConfig.glyphRight as React.CSSProperties,
    glyphVisible: themeConfig.glyphVisible as React.CSSProperties,
    shimmer: themeConfig.shimmer as React.CSSProperties,
  }
}

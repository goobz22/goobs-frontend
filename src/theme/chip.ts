// --------------------------------------------------------------------------
// CHIP THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface ChipTheme {
  container: {
    backgroundColor: string
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
  icon: {
    width: string
    height: string
    marginRight: string
    display: string
    alignItems: string
    justifyContent: string
    flexShrink: number
    color: string
  }
  iconHover: {
    transform?: string
    color?: string
  }
  iconDisabled: {
    opacity: number
    color: string
  }
  closeButton: {
    marginLeft: string
    marginRight: string
    padding: string
    borderRadius: string
    border: string
    backgroundColor: string
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
    backgroundImage: string
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

  // Icon styling
  iconWidth?: string
  iconHeight?: string
  iconMarginRight?: string
  iconColor?: string
  iconHoverColor?: string
  iconHoverTransform?: string
  iconDisabledOpacity?: number
  iconDisabledColor?: string

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

  // Text wrapping
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word'
  wordWrap?: 'normal' | 'break-word'
}

export const chipThemes: Record<'light' | 'dark' | 'sacred', ChipTheme> = {
  light: {
    container: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '16px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(4px)',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgb(59, 130, 246)',
      padding: '4px 12px',
      height: 'auto',
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
    icon: {
      width: '16px',
      height: '16px',
      marginRight: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'inherit',
    },
    iconHover: {
      transform: 'scale(1.05)',
      color: 'rgb(59, 130, 246)',
    },
    iconDisabled: {
      opacity: 0.5,
      color: 'rgb(156, 163, 175)',
    },
    closeButton: {
      marginLeft: '6px',
      marginRight: '-4px',
      padding: '2px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'transparent',
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
      backgroundImage:
        'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(4px)',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgb(96, 165, 250)',
      padding: '4px 12px',
      height: 'auto',
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
    icon: {
      width: '16px',
      height: '16px',
      marginRight: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'inherit',
    },
    iconHover: {
      transform: 'scale(1.05)',
      color: 'rgb(147, 197, 253)',
    },
    iconDisabled: {
      opacity: 0.5,
      color: 'rgb(75, 85, 99)',
    },
    closeButton: {
      marginLeft: '6px',
      marginRight: '-4px',
      padding: '2px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'transparent',
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
      backgroundImage:
        'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.2), transparent)',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
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
    icon: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'inherit',
    },
    iconHover: {
      transform: 'scale(1.1) rotate(5deg)',
      color: '#FFD700',
    },
    iconDisabled: {
      opacity: 0.3,
      color: 'rgba(255, 215, 0, 0.3)',
    },
    closeButton: {
      marginLeft: '8px',
      marginRight: '-4px',
      padding: '3px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'transparent',
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
      backgroundImage:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
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

  // Resolve optional values up-front to avoid assigning `undefined` to optional props
  const resolvedIconHoverTransform =
    styles?.iconHoverTransform ?? baseTheme.iconHover.transform
  const resolvedIconHoverColor =
    styles?.iconHoverColor ?? baseTheme.iconHover.color

  const resolvedContainerTextShadow =
    styles.textShadow ?? baseTheme.container.textShadow
  const resolvedContainerBackgroundImage =
    styles.backgroundImage ?? baseTheme.container.backgroundImage

  const resolvedHoverBorderColor =
    styles.hoverBorderColor ?? baseTheme.containerHover.borderColor
  const resolvedHoverBackgroundImage =
    styles.hoverBackgroundImage ?? baseTheme.containerHover.backgroundImage

  const resolvedDisabledBorderColor =
    styles.disabledBorderColor ?? baseTheme.containerDisabled.borderColor
  const resolvedDisabledTextShadow =
    styles.disabledTextShadow ?? baseTheme.containerDisabled.textShadow

  return {
    container: {
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
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
      ...(resolvedContainerTextShadow
        ? { textShadow: resolvedContainerTextShadow }
        : {}),
      padding: styles.padding || baseTheme.container.padding,
      height: styles.height || baseTheme.container.height,
      ...(resolvedContainerBackgroundImage
        ? { backgroundImage: resolvedContainerBackgroundImage }
        : {}),
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      backgroundColor:
        styles.hoverBackgroundColor || baseTheme.containerHover.backgroundColor,
      color: styles.hoverColor || baseTheme.containerHover.color,
      ...(resolvedHoverBorderColor
        ? { borderColor: resolvedHoverBorderColor }
        : {}),
      ...(resolvedHoverBackgroundImage
        ? { backgroundImage: resolvedHoverBackgroundImage }
        : {}),
    },
    containerDisabled: {
      opacity: styles.disabledOpacity ?? baseTheme.containerDisabled.opacity,
      backgroundColor:
        styles.disabledBackgroundColor ||
        baseTheme.containerDisabled.backgroundColor,
      color: styles.disabledColor || baseTheme.containerDisabled.color,
      ...(resolvedDisabledBorderColor
        ? { borderColor: resolvedDisabledBorderColor }
        : {}),
      ...(resolvedDisabledTextShadow
        ? { textShadow: resolvedDisabledTextShadow }
        : {}),
    },
    icon: {
      ...baseTheme.icon,
      width: styles?.iconWidth || baseTheme.icon.width,
      height: styles?.iconHeight || baseTheme.icon.height,
      marginRight: styles?.iconMarginRight || baseTheme.icon.marginRight,
      color: styles?.iconColor || baseTheme.icon.color,
    },
    iconHover: {
      ...baseTheme.iconHover,
      ...(resolvedIconHoverTransform !== undefined
        ? { transform: resolvedIconHoverTransform }
        : {}),
      ...(resolvedIconHoverColor !== undefined
        ? { color: resolvedIconHoverColor }
        : {}),
    },
    iconDisabled: {
      ...baseTheme.iconDisabled,
      opacity: styles?.iconDisabledOpacity ?? baseTheme.iconDisabled.opacity,
      color: styles?.iconDisabledColor || baseTheme.iconDisabled.color,
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

  const parseBorder = (border: string) => {
    if (!border) {
      return {
        width: undefined as string | undefined,
        style: undefined as string | undefined,
        color: undefined as string | undefined,
      }
    }
    const parts = border.trim().split(' ')
    const width = parts[0]
    const style = parts[1]
    const color = parts.slice(2).join(' ')
    return { width, style, color }
  }

  const {
    width: baseBorderWidth,
    style: baseBorderStyle,
    color: baseBorderColor,
  } = parseBorder(themeConfig.container.border)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: styles?.whiteSpace === 'normal' ? 'visible' : 'hidden',
    transition: themeConfig.transition,
    borderRadius: themeConfig.container.borderRadius,
    borderWidth:
      baseBorderStyle === 'none'
        ? 0
        : (baseBorderWidth as unknown as number | string),
    borderStyle: baseBorderStyle as any,
    borderColor: baseBorderColor,
    backgroundColor: themeConfig.container.backgroundColor,
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
    // Text wrapping styling
    whiteSpace: styles?.whiteSpace,
    wordBreak: styles?.wordBreak,
    wordWrap: styles?.wordWrap,
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
      borderWidth: 0,
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

  const iconStyle: React.CSSProperties = {
    ...themeConfig.icon,
    ...(isHovered && !isDisabled && themeConfig.iconHover),
    ...(isDisabled && themeConfig.iconDisabled),
  }

  return {
    container: containerStyle,
    icon: iconStyle,
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

// --------------------------------------------------------------------------
// ALERT THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface AlertTheme {
  container: {
    background: string
    borderWidth: string
    borderStyle: string
    borderColor: string
    borderRadius: string
    boxShadow: string
    backdropFilter: string
    fontFamily: string
    fontSize: string
    lineHeight: string | number
    padding: string
    backgroundImage?: string
  }
  containerHover: {
    transform: string
    boxShadow: string
    borderColor?: string
  }
  severity: {
    error: {
      backgroundColor: string
      borderColor: string
      color: string
      textShadow?: string
    }
    warning: {
      backgroundColor: string
      borderColor: string
      color: string
      textShadow?: string
    }
    info: {
      backgroundColor: string
      borderColor: string
      color: string
      textShadow?: string
    }
    success: {
      backgroundColor: string
      borderColor: string
      color: string
      textShadow?: string
    }
  }
  icon: {
    width: string
    height: string
    filter?: string
  }
  iconHover: {
    transform: string
    filter?: string
  }
  message: {
    fontWeight: string | number
    letterSpacing?: string
  }
  closeButton: {
    width: string
    height: string
    borderRadius: string
    border: string
    background: string
    color: string
    fontSize: string
    fontFamily?: string
    textShadow?: string
  }
  closeButtonHover: {
    background: string
    borderColor?: string
    transform: string
    boxShadow?: string
  }
  transition: string
}

export interface AlertStyles {
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
  fontFamily?: string
  fontSize?: string
  lineHeight?: string | number
  padding?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string

  // Severity styling overrides
  errorBackgroundColor?: string
  errorBorderColor?: string
  errorColor?: string
  errorTextShadow?: string
  warningBackgroundColor?: string
  warningBorderColor?: string
  warningColor?: string
  warningTextShadow?: string
  infoBackgroundColor?: string
  infoBorderColor?: string
  infoColor?: string
  infoTextShadow?: string
  successBackgroundColor?: string
  successBorderColor?: string
  successColor?: string
  successTextShadow?: string

  // Icon styling
  iconWidth?: string
  iconHeight?: string
  iconFilter?: string
  iconHoverTransform?: string
  iconHoverFilter?: string

  // Message styling
  messageColor?: string
  messageFontWeight?: string | number
  messageLetterSpacing?: string

  // Close button styling
  closeButtonWidth?: string
  closeButtonHeight?: string
  closeButtonBorderRadius?: string
  closeButtonBorder?: string
  closeButtonBackground?: string
  closeButtonColor?: string
  closeButtonFontSize?: string
  closeButtonFontFamily?: string
  closeButtonTextShadow?: string
  closeButtonHoverBackground?: string
  closeButtonHoverBorderColor?: string
  closeButtonHoverTransform?: string
  closeButtonHoverBoxShadow?: string

  // Layout and spacing
  gap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}

export const alertThemes: Record<'light' | 'dark' | 'sacred', AlertTheme> = {
  light: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(229, 231, 235, 0.8)',
      borderRadius: '12px',
      boxShadow: SHADOWS.light.small,
      backdropFilter: 'blur(8px)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '15px',
      lineHeight: 1.5,
      padding: '20px',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow:
        '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
    },
    severity: {
      error: {
        backgroundColor: 'rgba(254, 242, 242, 0.9)',
        borderColor: 'rgba(248, 113, 113, 0.4)',
        color: 'rgb(153, 27, 27)',
      },
      warning: {
        backgroundColor: 'rgba(255, 251, 235, 0.9)',
        borderColor: 'rgba(251, 191, 36, 0.4)',
        color: 'rgb(146, 64, 14)',
      },
      info: {
        backgroundColor: 'rgba(239, 246, 255, 0.9)',
        borderColor: 'rgba(96, 165, 250, 0.4)',
        color: 'rgb(30, 64, 175)',
      },
      success: {
        backgroundColor: 'rgba(240, 253, 244, 0.9)',
        borderColor: 'rgba(74, 222, 128, 0.4)',
        color: 'rgb(21, 128, 61)',
      },
    },
    icon: {
      width: '20px',
      height: '20px',
    },
    iconHover: {
      transform: 'scale(1.1)',
    },
    message: {
      fontWeight: 500,
    },
    closeButton: {
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      border: 'none',
      background: 'rgba(0, 0, 0, 0.1)',
      color: 'currentColor',
      fontSize: '16px',
    },
    closeButtonHover: {
      background: 'rgba(0, 0, 0, 0.2)',
      transform: 'scale(1.1)',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      background: 'rgba(31, 41, 55, 0.95)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgba(75, 85, 99, 0.8)',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '15px',
      lineHeight: 1.5,
      padding: '20px',
    },
    containerHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
    },
    severity: {
      error: {
        backgroundColor: 'rgba(127, 29, 29, 0.3)',
        borderColor: 'rgba(248, 113, 113, 0.4)',
        color: 'rgb(252, 165, 165)',
      },
      warning: {
        backgroundColor: 'rgba(120, 53, 15, 0.3)',
        borderColor: 'rgba(251, 191, 36, 0.4)',
        color: 'rgb(254, 215, 170)',
      },
      info: {
        backgroundColor: 'rgba(30, 64, 175, 0.3)',
        borderColor: 'rgba(96, 165, 250, 0.4)',
        color: 'rgb(191, 219, 254)',
      },
      success: {
        backgroundColor: 'rgba(20, 83, 45, 0.3)',
        borderColor: 'rgba(74, 222, 128, 0.4)',
        color: 'rgb(187, 247, 208)',
      },
    },
    icon: {
      width: '20px',
      height: '20px',
    },
    iconHover: {
      transform: 'scale(1.1)',
    },
    message: {
      fontWeight: 500,
    },
    closeButton: {
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'currentColor',
      fontSize: '16px',
    },
    closeButtonHover: {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.1)',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      background: 'rgba(10, 10, 10, 0.9)',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgba(255, 215, 0, 0.4)',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.small,
      backdropFilter: 'blur(8px)',
      fontFamily: '"Cinzel", serif',
      fontSize: '16px',
      lineHeight: 1.6,
      padding: '24px',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
      `,
    },
    containerHover: {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.sacred.medium,
      borderColor: 'rgba(255, 215, 0, 0.6)',
    },
    severity: {
      error: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.4)',
        color: 'rgba(255, 120, 120, 0.9)',
        textShadow: '0 0 10px rgba(255, 120, 120, 0.5)',
      },
      warning: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.4)',
        color: 'rgba(255, 215, 0, 0.9)',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      },
      info: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.4)',
        color: 'rgba(120, 200, 255, 0.9)',
        textShadow: '0 0 10px rgba(120, 200, 255, 0.5)',
      },
      success: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        borderColor: 'rgba(255, 215, 0, 0.4)',
        color: 'rgba(120, 255, 150, 0.9)',
        textShadow: '0 0 10px rgba(120, 255, 150, 0.5)',
      },
    },
    icon: {
      width: '24px',
      height: '24px',
      filter: 'drop-shadow(0 0 6px currentColor)',
    },
    iconHover: {
      transform: 'scale(1.2) rotate(5deg)',
      filter: 'drop-shadow(0 0 12px currentColor)',
    },
    message: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    closeButton: {
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      background: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      fontSize: '18px',
      fontFamily: '"Cinzel", serif',
      textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
    },
    closeButtonHover: {
      background: 'rgba(255, 215, 0, 0.2)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      transform: 'scale(1.1)',
      boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getAlertTheme = (styles?: AlertStyles): AlertTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = alertThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      background: styles.backgroundColor || baseTheme.container.background,
      borderWidth: styles.borderWidth || '1px',
      borderStyle: 'solid',
      borderColor: styles.borderColor ? styles.borderColor : 'transparent',
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      backdropFilter:
        styles.backdropFilter || baseTheme.container.backdropFilter,
      fontFamily: styles.fontFamily || baseTheme.container.fontFamily,
      fontSize: styles.fontSize || baseTheme.container.fontSize,
      lineHeight: styles.lineHeight || baseTheme.container.lineHeight,
      padding: styles.padding || baseTheme.container.padding,
      ...((styles.backgroundImage ?? baseTheme.container.backgroundImage)
        ? {
            backgroundImage: (styles.backgroundImage ??
              baseTheme.container.backgroundImage) as string,
          }
        : {}),
    },
    containerHover: {
      transform: styles.hoverTransform || baseTheme.containerHover.transform,
      boxShadow: styles.hoverBoxShadow || baseTheme.containerHover.boxShadow,
      ...((styles.hoverBorderColor ?? baseTheme.containerHover.borderColor)
        ? {
            borderColor: (styles.hoverBorderColor ??
              baseTheme.containerHover.borderColor) as string,
          }
        : {}),
    },
    severity: {
      error: {
        backgroundColor:
          styles.errorBackgroundColor ||
          baseTheme.severity.error.backgroundColor,
        borderColor:
          styles.errorBorderColor || baseTheme.severity.error.borderColor,
        color: styles.errorColor || baseTheme.severity.error.color,
        ...((styles.errorTextShadow ?? baseTheme.severity.error.textShadow)
          ? {
              textShadow: (styles.errorTextShadow ??
                baseTheme.severity.error.textShadow) as string,
            }
          : {}),
      },
      warning: {
        backgroundColor:
          styles.warningBackgroundColor ||
          baseTheme.severity.warning.backgroundColor,
        borderColor:
          styles.warningBorderColor || baseTheme.severity.warning.borderColor,
        color: styles.warningColor || baseTheme.severity.warning.color,
        ...((styles.warningTextShadow ?? baseTheme.severity.warning.textShadow)
          ? {
              textShadow: (styles.warningTextShadow ??
                baseTheme.severity.warning.textShadow) as string,
            }
          : {}),
      },
      info: {
        backgroundColor:
          styles.infoBackgroundColor || baseTheme.severity.info.backgroundColor,
        borderColor:
          styles.infoBorderColor || baseTheme.severity.info.borderColor,
        color: styles.infoColor || baseTheme.severity.info.color,
        ...((styles.infoTextShadow ?? baseTheme.severity.info.textShadow)
          ? {
              textShadow: (styles.infoTextShadow ??
                baseTheme.severity.info.textShadow) as string,
            }
          : {}),
      },
      success: {
        backgroundColor:
          styles.successBackgroundColor ||
          baseTheme.severity.success.backgroundColor,
        borderColor:
          styles.successBorderColor || baseTheme.severity.success.borderColor,
        color: styles.successColor || baseTheme.severity.success.color,
        ...((styles.successTextShadow ?? baseTheme.severity.success.textShadow)
          ? {
              textShadow: (styles.successTextShadow ??
                baseTheme.severity.success.textShadow) as string,
            }
          : {}),
      },
    },
    icon: {
      width: styles.iconWidth || baseTheme.icon.width,
      height: styles.iconHeight || baseTheme.icon.height,
      ...((styles.iconFilter ?? baseTheme.icon.filter)
        ? { filter: (styles.iconFilter ?? baseTheme.icon.filter) as string }
        : {}),
    },
    iconHover: {
      transform: styles.iconHoverTransform || baseTheme.iconHover.transform,
      ...((styles.iconHoverFilter ?? baseTheme.iconHover.filter)
        ? {
            filter: (styles.iconHoverFilter ??
              baseTheme.iconHover.filter) as string,
          }
        : {}),
    },
    message: {
      fontWeight: styles.messageFontWeight || baseTheme.message.fontWeight,
      ...((styles.messageLetterSpacing ?? baseTheme.message.letterSpacing)
        ? {
            letterSpacing: (styles.messageLetterSpacing ??
              baseTheme.message.letterSpacing) as string,
          }
        : {}),
    },
    closeButton: {
      width: styles.closeButtonWidth || baseTheme.closeButton.width,
      height: styles.closeButtonHeight || baseTheme.closeButton.height,
      borderRadius:
        styles.closeButtonBorderRadius || baseTheme.closeButton.borderRadius,
      border: styles.closeButtonBorder || baseTheme.closeButton.border,
      background:
        styles.closeButtonBackground || baseTheme.closeButton.background,
      color: styles.closeButtonColor || baseTheme.closeButton.color,
      fontSize: styles.closeButtonFontSize || baseTheme.closeButton.fontSize,
      ...((styles.closeButtonFontFamily ?? baseTheme.closeButton.fontFamily)
        ? {
            fontFamily: (styles.closeButtonFontFamily ??
              baseTheme.closeButton.fontFamily) as string,
          }
        : {}),
      ...((styles.closeButtonTextShadow ?? baseTheme.closeButton.textShadow)
        ? {
            textShadow: (styles.closeButtonTextShadow ??
              baseTheme.closeButton.textShadow) as string,
          }
        : {}),
    },
    closeButtonHover: {
      background:
        styles.closeButtonHoverBackground ||
        baseTheme.closeButtonHover.background,
      ...((styles.closeButtonHoverBorderColor ??
      baseTheme.closeButtonHover.borderColor)
        ? {
            borderColor: (styles.closeButtonHoverBorderColor ??
              baseTheme.closeButtonHover.borderColor) as string,
          }
        : {}),
      transform:
        styles.closeButtonHoverTransform ||
        baseTheme.closeButtonHover.transform,
      ...((styles.closeButtonHoverBoxShadow ??
      baseTheme.closeButtonHover.boxShadow)
        ? {
            boxShadow: (styles.closeButtonHoverBoxShadow ??
              baseTheme.closeButtonHover.boxShadow) as string,
          }
        : {}),
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getAlertStyles = (
  styles?: AlertStyles,
  severity?: 'error' | 'warning' | 'info' | 'success',
  isHovered?: boolean,
  isClosing?: boolean
) => {
  const themeConfig = getAlertTheme(styles)
  const severityConfig = severity
    ? themeConfig.severity[severity]
    : themeConfig.severity.info

  // Use border properties directly from theme config
  const borderWidth = themeConfig.container.borderWidth
  const borderStyle = themeConfig.container.borderStyle
  const borderColor = themeConfig.container.borderColor

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: styles?.gap || '16px',
    position: 'relative',
    overflow: 'hidden',
    transition: themeConfig.transition,
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
    minHeight: styles?.minHeight,
    // Apply base container styles
    background: themeConfig.container.background,
    borderWidth: borderWidth,
    borderStyle: borderStyle,
    borderColor: borderColor,
    borderRadius: themeConfig.container.borderRadius,
    boxShadow: themeConfig.container.boxShadow,
    backdropFilter: themeConfig.container.backdropFilter,
    fontFamily: themeConfig.container.fontFamily,
    fontSize: themeConfig.container.fontSize,
    lineHeight: themeConfig.container.lineHeight,
    padding: themeConfig.container.padding,
    backgroundImage: themeConfig.container.backgroundImage,
    // Apply severity-specific styles
    backgroundColor: severityConfig.backgroundColor,
    color: severityConfig.color,
    textShadow: severityConfig.textShadow,
    // Override borderColor with severity-specific color
    ...(severityConfig.borderColor && {
      borderColor: severityConfig.borderColor,
    }),
    // Apply hover styles
    ...(isHovered && {
      transform: themeConfig.containerHover.transform,
      boxShadow: themeConfig.containerHover.boxShadow,
      ...(themeConfig.containerHover.borderColor && {
        borderColor: themeConfig.containerHover.borderColor,
      }),
    }),
    // Apply closing animation
    ...(isClosing && {
      opacity: 0,
      transform: styles?.theme === 'sacred' ? 'scale(0.95)' : 'scale(0.98)',
    }),
    // Apply outline override
    ...(styles?.outline === false && {
      borderWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      boxShadow: 'none',
    }),
  }

  const iconStyle: React.CSSProperties = {
    width: themeConfig.icon.width,
    height: themeConfig.icon.height,
    flexShrink: 0,
    transition: themeConfig.transition,
    filter: themeConfig.icon.filter,
    ...(isHovered && {
      transform: themeConfig.iconHover.transform,
      filter: themeConfig.iconHover.filter,
    }),
  }

  const messageStyle: React.CSSProperties = {
    flex: 1,
    fontWeight: themeConfig.message.fontWeight,
    letterSpacing: themeConfig.message.letterSpacing,
    color: styles?.messageColor || 'inherit',
  }

  const closeButtonStyle: React.CSSProperties = {
    width: themeConfig.closeButton.width,
    height: themeConfig.closeButton.height,
    borderRadius: themeConfig.closeButton.borderRadius,
    border: themeConfig.closeButton.border,
    background: themeConfig.closeButton.background,
    color: themeConfig.closeButton.color,
    fontSize: themeConfig.closeButton.fontSize,
    fontFamily: themeConfig.closeButton.fontFamily,
    textShadow: themeConfig.closeButton.textShadow,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: themeConfig.transition,
    flexShrink: 0,
    ...(isHovered && {
      background: themeConfig.closeButtonHover.background,
      borderColor: themeConfig.closeButtonHover.borderColor,
      transform: themeConfig.closeButtonHover.transform,
      boxShadow: themeConfig.closeButtonHover.boxShadow,
    }),
  }

  return {
    container: containerStyle,
    icon: iconStyle,
    message: messageStyle,
    closeButton: closeButtonStyle,
  }
}

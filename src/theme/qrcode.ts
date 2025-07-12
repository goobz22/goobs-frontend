// --------------------------------------------------------------------------
// QRCODE THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

export interface QRCodeTheme {
  container: React.CSSProperties
  title: React.CSSProperties
  qrCodeContainer: React.CSSProperties
  infoText: React.CSSProperties
  successContainer: React.CSSProperties
  successIcon: React.CSSProperties
  successMessage: React.CSSProperties
  buttonContainer: React.CSSProperties
  confirmationContainer: React.CSSProperties
  errorContainer: React.CSSProperties
  errorText: React.CSSProperties
  glyph: React.CSSProperties
  decorativeGlyphs: React.CSSProperties
  decorativeGlyph: React.CSSProperties
  transition: string
}

export interface QRCodeStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  padding?: string

  // Text styling
  titleColor?: string
  titleFontSize?: string
  titleFontWeight?: string | number
  infoTextColor?: string

  // QR Code container styling
  qrBackgroundColor?: string
  qrBorderColor?: string
  qrBoxShadow?: string

  // Success state styling
  successIconColor?: string
  successMessageColor?: string

  // Error styling
  errorTextColor?: string

  // Layout and sizing
  size?: number
  maxWidth?: string
  width?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  showGlyphs?: boolean
}

export const qrCodeThemes: Record<'light' | 'dark' | 'sacred', QRCodeTheme> = {
  light: {
    container: {
      padding: '1.5rem',
      display: 'inline-block',
      maxWidth: '100%',
      boxSizing: 'border-box',
      borderRadius: '16px',
      boxShadow: SHADOWS.light.medium,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      marginBottom: '1rem',
      textAlign: 'center',
      fontFamily: 'Merriweather, serif',
      fontSize: '1.25rem',
      color: 'rgb(17, 24, 39)',
      fontWeight: '600',
    },
    qrCodeContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      boxShadow: SHADOWS.light.small,
    },
    infoText: {
      marginTop: '1rem',
      textAlign: 'center',
      fontFamily: 'Merriweather, serif',
      color: 'rgb(55, 65, 81)',
    },
    successContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      width: '100%',
    },
    successIcon: {
      width: '60px',
      height: '60px',
      color: '#22C55E',
    },
    successMessage: {
      textAlign: 'center',
      fontFamily: 'Merriweather, serif',
      fontSize: '1.25rem',
      color: 'rgb(17, 24, 39)',
      fontWeight: '600',
    },
    buttonContainer: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
    },
    confirmationContainer: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
    },
    errorContainer: {
      padding: '1rem',
    },
    errorText: {
      fontFamily: 'Merriweather, serif',
      color: '#DC2626',
    },
    glyph: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      fontSize: '1.25rem',
      color: 'transparent',
      animation: 'none',
      display: 'none',
    },
    decorativeGlyphs: {
      display: 'none',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1.5rem',
    },
    decorativeGlyph: {
      color: 'transparent',
      fontSize: '0.875rem',
      animation: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  dark: {
    container: {
      padding: '1.5rem',
      display: 'inline-block',
      maxWidth: '100%',
      boxSizing: 'border-box',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      border: '1px solid rgba(75, 85, 99, 0.8)',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      marginBottom: '1rem',
      textAlign: 'center',
      fontFamily: 'Merriweather, serif',
      fontSize: '1.25rem',
      color: 'rgb(243, 244, 246)',
      fontWeight: '600',
    },
    qrCodeContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid rgba(75, 85, 99, 0.5)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    },
    infoText: {
      marginTop: '1rem',
      textAlign: 'center',
      fontFamily: 'Merriweather, serif',
      color: 'rgb(209, 213, 219)',
    },
    successContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      width: '100%',
    },
    successIcon: {
      width: '60px',
      height: '60px',
      color: '#22C55E',
    },
    successMessage: {
      textAlign: 'center',
      fontFamily: 'Merriweather, serif',
      fontSize: '1.25rem',
      color: 'rgb(243, 244, 246)',
      fontWeight: '600',
    },
    buttonContainer: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
    },
    confirmationContainer: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
    },
    errorContainer: {
      padding: '1rem',
    },
    errorText: {
      fontFamily: 'Merriweather, serif',
      color: '#F87171',
    },
    glyph: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      fontSize: '1.25rem',
      color: 'transparent',
      animation: 'none',
      display: 'none',
    },
    decorativeGlyphs: {
      display: 'none',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1.5rem',
    },
    decorativeGlyph: {
      color: 'transparent',
      fontSize: '0.875rem',
      animation: 'none',
    },
    transition: TRANSITIONS.medium,
  },
  sacred: {
    container: {
      padding: '1.5rem',
      display: 'inline-block',
      maxWidth: '100%',
      boxSizing: 'border-box',
      borderRadius: '12px',
      boxShadow: SHADOWS.sacred.large,
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      border: '2px solid rgba(255, 215, 0, 0.4)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'sacred-glow-pulse 2s infinite alternate',
    },
    title: {
      marginBottom: '1rem',
      textAlign: 'center',
      fontFamily: 'Cinzel, serif',
      fontSize: '1.25rem',
      color: '#FFD700',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    },
    qrCodeContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px solid rgba(255, 215, 0, 0.6)',
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
    },
    infoText: {
      marginTop: '1rem',
      textAlign: 'center',
      fontFamily: 'Cinzel, serif',
      color: 'rgba(255, 215, 0, 0.9)',
      fontStyle: 'italic',
      letterSpacing: '0.05em',
    },
    successContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      width: '100%',
      position: 'relative',
    },
    successIcon: {
      width: '60px',
      height: '60px',
      color: '#FFD700',
      filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
      animation: 'sacred-float 3s infinite ease-in-out',
    },
    successMessage: {
      textAlign: 'center',
      fontFamily: 'Cinzel, serif',
      fontSize: '1.25rem',
      color: '#FFD700',
      fontWeight: '600',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    },
    buttonContainer: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
    },
    confirmationContainer: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
    },
    errorContainer: {
      padding: '1rem',
    },
    errorText: {
      fontFamily: 'Cinzel, serif',
      color: '#FFD700',
    },
    glyph: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      fontSize: '1.25rem',
      color: 'rgba(255, 215, 0, 0.3)',
      animation: 'glyph-rotate 10s linear infinite',
    },
    decorativeGlyphs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1.5rem',
    },
    decorativeGlyph: {
      color: 'rgba(255, 215, 0, 0.4)',
      fontSize: '0.875rem',
      animation: 'float-glyph 3s infinite ease-in-out',
    },
    transition: TRANSITIONS.premium,
  },
}

// Helper function to get computed theme with custom style overrides
export const getQRCodeTheme = (styles?: QRCodeStyles): QRCodeTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = qrCodeThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    ...baseTheme,
    container: {
      ...baseTheme.container,
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      padding: styles.padding || baseTheme.container.padding,
      maxWidth: styles.maxWidth || baseTheme.container.maxWidth,
    },
    title: {
      ...baseTheme.title,
      color: styles.titleColor || baseTheme.title.color,
      fontSize: styles.titleFontSize || baseTheme.title.fontSize,
      fontWeight: styles.titleFontWeight || baseTheme.title.fontWeight,
    },
    qrCodeContainer: {
      ...baseTheme.qrCodeContainer,
      backgroundColor:
        styles.qrBackgroundColor || baseTheme.qrCodeContainer.backgroundColor,
      border: styles.qrBorderColor
        ? `1px solid ${styles.qrBorderColor}`
        : baseTheme.qrCodeContainer.border,
      boxShadow: styles.qrBoxShadow || baseTheme.qrCodeContainer.boxShadow,
    },
    infoText: {
      ...baseTheme.infoText,
      color: styles.infoTextColor || baseTheme.infoText.color,
    },
    successIcon: {
      ...baseTheme.successIcon,
      color: styles.successIconColor || baseTheme.successIcon.color,
    },
    successMessage: {
      ...baseTheme.successMessage,
      color: styles.successMessageColor || baseTheme.successMessage.color,
    },
    errorText: {
      ...baseTheme.errorText,
      color: styles.errorTextColor || baseTheme.errorText.color,
    },
    glyph: {
      ...baseTheme.glyph,
      display: styles.showGlyphs ? 'block' : baseTheme.glyph.display,
    },
    decorativeGlyphs: {
      ...baseTheme.decorativeGlyphs,
      display: styles.showGlyphs ? 'flex' : baseTheme.decorativeGlyphs.display,
    },
    transition: styles.transitionDuration
      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
      : baseTheme.transition,
  }
}

// Main style generator function
export const getQRCodeStyles = (
  styles?: QRCodeStyles,
  responsiveSize?: number
) => {
  const themeConfig = getQRCodeTheme(styles)
  const size = responsiveSize || styles?.size || 256

  const containerStyle: React.CSSProperties = {
    ...themeConfig.container,
    width: styles?.width,
    minWidth: styles?.minWidth,
    height: styles?.height,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
    transition: themeConfig.transition,
  }

  const qrCodeContainerStyle: React.CSSProperties = {
    ...themeConfig.qrCodeContainer,
    width: size,
    height: size,
  }

  return {
    container: containerStyle,
    title: themeConfig.title,
    qrCodeContainer: qrCodeContainerStyle,
    infoText: themeConfig.infoText,
    successContainer: themeConfig.successContainer,
    successIcon: themeConfig.successIcon,
    successMessage: themeConfig.successMessage,
    buttonContainer: themeConfig.buttonContainer,
    confirmationContainer: themeConfig.confirmationContainer,
    errorContainer: themeConfig.errorContainer,
    errorText: themeConfig.errorText,
    glyph: themeConfig.glyph,
    decorativeGlyphs: themeConfig.decorativeGlyphs,
    decorativeGlyph: themeConfig.decorativeGlyph,
  }
}

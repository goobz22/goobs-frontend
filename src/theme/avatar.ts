// --------------------------------------------------------------------------
// AVATAR THEME SYSTEM
// --------------------------------------------------------------------------
import React from 'react'
import { SHADOWS } from './shared'

export interface AvatarTheme {
  container: {
    width: string
    height: string
    borderRadius: string
    display: string
    alignItems: string
    justifyContent: string
    backgroundColor: string
    color: string
    fontSize: string
    fontWeight: string | number
    boxShadow?: string
    border?: string
    overflow: string
  }
}

export interface AvatarStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Size options
  size?: 'small' | 'medium' | 'large' | 'xl'
  width?: string
  height?: string

  // Appearance
  backgroundColor?: string
  color?: string
  borderRadius?: string
  fontSize?: string
  fontWeight?: string | number

  // Border and shadow
  border?: string
  borderColor?: string
  borderWidth?: string
  boxShadow?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // States
  disabled?: boolean
}

export const avatarThemes: Record<'light' | 'dark' | 'sacred', AvatarTheme> = {
  light: {
    container: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      color: '#374151',
      fontSize: '1rem',
      fontWeight: 500,
      overflow: 'hidden',
    },
  },
  dark: {
    container: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#374151',
      color: '#f9fafb',
      fontSize: '1rem',
      fontWeight: 500,
      overflow: 'hidden',
    },
  },
  sacred: {
    container: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      fontSize: '1.1rem',
      fontWeight: 600,
      border: '2px solid rgba(255, 215, 0, 0.3)',
      boxShadow: SHADOWS.sacred.small,
      overflow: 'hidden',
    },
  },
}

const sizeMap = {
  small: { width: '32px', height: '32px', fontSize: '0.875rem' },
  medium: { width: '40px', height: '40px', fontSize: '1rem' },
  large: { width: '56px', height: '56px', fontSize: '1.25rem' },
  xl: { width: '72px', height: '72px', fontSize: '1.5rem' },
}

// Helper function to get computed theme with custom style overrides
export const getAvatarTheme = (styles?: AvatarStyles): AvatarTheme => {
  const theme = styles?.theme || 'light'
  const baseTheme = avatarThemes[theme]
  const size = styles?.size ? sizeMap[styles.size] : {}

  if (!styles) {
    return baseTheme
  }

  return {
    container: {
      width: styles.width || (size as any).width || baseTheme.container.width,
      height:
        styles.height || (size as any).height || baseTheme.container.height,
      borderRadius: styles.borderRadius || baseTheme.container.borderRadius,
      display: baseTheme.container.display,
      alignItems: baseTheme.container.alignItems,
      justifyContent: baseTheme.container.justifyContent,
      backgroundColor:
        styles.backgroundColor || baseTheme.container.backgroundColor,
      color: styles.color || baseTheme.container.color,
      fontSize:
        styles.fontSize ||
        (size as any).fontSize ||
        baseTheme.container.fontSize,
      fontWeight: styles.fontWeight || baseTheme.container.fontWeight,
      border: styles.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : baseTheme.container.border,
      boxShadow: styles.boxShadow || baseTheme.container.boxShadow,
      overflow: baseTheme.container.overflow,
    },
  }
}

// Main style generator function
export const getAvatarStyles = (
  styles?: AvatarStyles,
  isDisabled?: boolean
) => {
  const themeConfig = getAvatarTheme(styles)

  const containerStyle: React.CSSProperties = {
    width: themeConfig.container.width,
    height: themeConfig.container.height,
    borderRadius: themeConfig.container.borderRadius,
    display: themeConfig.container.display as any,
    alignItems: themeConfig.container.alignItems as any,
    justifyContent: themeConfig.container.justifyContent as any,
    backgroundColor: themeConfig.container.backgroundColor,
    color: themeConfig.container.color,
    fontSize: themeConfig.container.fontSize,
    fontWeight: themeConfig.container.fontWeight,
    border: themeConfig.container.border,
    boxShadow: themeConfig.container.boxShadow,
    overflow: themeConfig.container.overflow as any,
    // Layout styling
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    // State-based styling
    ...(isDisabled && {
      opacity: 0.6,
      pointerEvents: 'none' as const,
    }),
  }

  return {
    container: containerStyle,
  }
}

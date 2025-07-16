import { CSSProperties } from 'react'
import { SHADOWS } from './shared'

export interface BadgeTheme {
  container: CSSProperties
  badge: CSSProperties
}

export interface BadgeStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Basic styling
  backgroundColor?: string
  color?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  offset?: number

  // Advanced styling
  borderRadius?: string
  width?: string
  height?: string
  fontSize?: string
  fontWeight?: string
  boxShadow?: string
  backdropFilter?: string
  border?: string
  textShadow?: string
}

const getPositionStyles = (
  position: BadgeStyles['position'],
  offset: number
): CSSProperties => {
  switch (position) {
    case 'top-left':
      return { top: `-${offset}px`, left: `-${offset}px` }
    case 'bottom-right':
      return { bottom: `-${offset}px`, right: `-${offset}px` }
    case 'bottom-left':
      return { bottom: `-${offset}px`, left: `-${offset}px` }
    case 'top-right':
    default:
      return { top: `-${offset}px`, right: `-${offset}px` }
  }
}

export const badgeThemes: Record<'light' | 'dark' | 'sacred', BadgeTheme> = {
  light: {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    badge: {
      position: 'absolute',
      backgroundColor: '#f44336',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: SHADOWS.light.small,
    },
  },
  dark: {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    badge: {
      position: 'absolute',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
    },
  },
  sacred: {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    badge: {
      position: 'absolute',
      backgroundColor: 'rgba(220, 38, 38, 0.9)',
      color: '#FFD700',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow:
        '0px 2px 8px rgba(255, 215, 0, 0.3), 0px 0px 12px rgba(255, 215, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      textShadow: '0px 0px 4px rgba(255, 215, 0, 0.5)',
    },
  },
}

export const getBadgeTheme = (styles?: BadgeStyles): BadgeTheme => {
  const theme = styles?.theme || 'light'
  return badgeThemes[theme]
}

export const getBadgeStyles = (
  styles: BadgeStyles = {}
): {
  container: CSSProperties
  badge: CSSProperties
} => {
  const {
    backgroundColor,
    color,
    position = 'top-right',
    offset = 8,
    borderRadius,
    width,
    height,
    fontSize,
    fontWeight,
    boxShadow,
    backdropFilter,
    border,
    textShadow,
  } = styles

  const theme = getBadgeTheme(styles)
  const positionStyles = getPositionStyles(position, offset)

  return {
    container: {
      ...theme.container,
    },
    badge: {
      ...theme.badge,
      ...positionStyles,
      ...(backgroundColor && { backgroundColor }),
      ...(color && { color }),
      ...(borderRadius && { borderRadius }),
      ...(width && { width }),
      ...(height && { height }),
      ...(fontSize && { fontSize }),
      ...(fontWeight && { fontWeight }),
      ...(boxShadow && { boxShadow }),
      ...(backdropFilter && { backdropFilter }),
      ...(border && { border }),
      ...(textShadow && { textShadow }),
    },
  }
}

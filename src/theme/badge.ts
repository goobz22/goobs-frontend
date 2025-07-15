import { CSSProperties } from 'react'

export interface BadgeStyles {
  backgroundColor?: string
  color?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  offset?: number
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

export const getBadgeStyles = (
  styles: BadgeStyles = {}
): {
  container: CSSProperties
  badge: CSSProperties
} => {
  const {
    backgroundColor = '#f44336',
    color = 'white',
    position = 'top-right',
    offset = 8,
  } = styles

  const positionStyles = getPositionStyles(position, offset)

  return {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    badge: {
      position: 'absolute',
      ...positionStyles,
      backgroundColor,
      color,
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    },
  }
}

// --------------------------------------------------------------------------
// BREADCRUMB THEME SYSTEM
// --------------------------------------------------------------------------

import React from 'react'
import { SHADOWS, TRANSITIONS } from './shared'

// --------------------------------------------------------------------------
// TYPE DEFINITIONS
// --------------------------------------------------------------------------

/**
 * Breadcrumb theme type definition
 */
export interface BreadcrumbTheme {
  container: React.CSSProperties
  list: React.CSSProperties
  listItem: React.CSSProperties
  item: React.CSSProperties
  itemHover: React.CSSProperties
  activeItem: React.CSSProperties
  separator: React.CSSProperties
  ellipsis: React.CSSProperties

  // Sacred theme specific styles
  sacred?: {
    shimmer: React.CSSProperties
    glyph: React.CSSProperties
  }

  transition: string
}

/**
 * Breadcrumb styles configuration interface
 */
export interface BreadcrumbStyles {
  /** Theme variant */
  theme?: 'light' | 'dark' | 'sacred'
  /** Custom container styles */
  container?: React.CSSProperties
  /** Custom item styles */
  item?: React.CSSProperties
  /** Custom separator styles */
  separator?: React.CSSProperties
  /** Custom active item styles */
  activeItem?: React.CSSProperties
  /** Custom hover styles */
  itemHover?: React.CSSProperties
}

// --------------------------------------------------------------------------
// THEME DEFINITIONS
// --------------------------------------------------------------------------

const lightTheme: BreadcrumbTheme = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    position: 'relative',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  item: {
    color: 'rgba(0, 0, 0, 0.6)',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '400',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: TRANSITIONS.medium,
    cursor: 'pointer',
    position: 'relative',
  },
  itemHover: {
    color: 'rgba(25, 118, 210, 1)',
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  },
  activeItem: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: '500',
    cursor: 'default',
  },
  separator: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontSize: '14px',
    margin: '0 8px',
    userSelect: 'none',
  },
  ellipsis: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontSize: '14px',
    padding: '4px 8px',
    userSelect: 'none',
  },
  transition: TRANSITIONS.medium,
}

const darkTheme: BreadcrumbTheme = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    position: 'relative',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  item: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '400',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: TRANSITIONS.medium,
    cursor: 'pointer',
    position: 'relative',
  },
  itemHover: {
    color: 'rgba(96, 165, 250, 1)',
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  activeItem: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    cursor: 'default',
  },
  separator: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    margin: '0 8px',
    userSelect: 'none',
  },
  ellipsis: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    padding: '4px 8px',
    userSelect: 'none',
  },
  transition: TRANSITIONS.medium,
}

const sacredTheme: BreadcrumbTheme = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    position: 'relative',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    boxShadow: SHADOWS.sacred.small,
    backdropFilter: 'blur(8px)',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
    `,
    overflow: 'hidden',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  item: {
    color: 'rgba(255, 215, 0, 0.8)',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: '"Cinzel", serif',
    fontWeight: '400',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: TRANSITIONS.premium,
    cursor: 'pointer',
    position: 'relative',
    letterSpacing: '0.025em',
    textShadow: '0 0 2px rgba(255, 215, 0, 0.3)',
  },
  itemHover: {
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateY(-1px)',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
  },
  activeItem: {
    color: '#FFD700',
    fontWeight: '600',
    cursor: 'default',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  separator: {
    color: 'rgba(255, 215, 0, 0.6)',
    fontSize: '16px',
    margin: '0 12px',
    userSelect: 'none',
    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))',
  },
  ellipsis: {
    color: 'rgba(255, 215, 0, 0.5)',
    fontSize: '14px',
    padding: '6px 12px',
    userSelect: 'none',
    fontFamily: '"Cinzel", serif',
  },
  sacred: {
    shimmer: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    glyph: {
      position: 'absolute',
      fontSize: '12px',
      color: 'rgba(255, 215, 0, 0.3)',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
    },
  },
  transition: TRANSITIONS.premium,
}

// --------------------------------------------------------------------------
// THEME MAPPING
// --------------------------------------------------------------------------

export const breadcrumbThemes = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
}

// --------------------------------------------------------------------------
// THEME GETTER FUNCTION
// --------------------------------------------------------------------------

export const getBreadcrumbTheme = (
  theme: 'light' | 'dark' | 'sacred' = 'light'
): BreadcrumbTheme => {
  return breadcrumbThemes[theme]
}

// --------------------------------------------------------------------------
// STYLES COMPUTATION FUNCTION
// --------------------------------------------------------------------------

export const getBreadcrumbStyles = (
  styles?: BreadcrumbStyles
): BreadcrumbTheme => {
  const theme = getBreadcrumbTheme(styles?.theme || 'light')

  return {
    ...theme,
    container: {
      ...theme.container,
      ...styles?.container,
    },
    item: {
      ...theme.item,
      ...styles?.item,
    },
    separator: {
      ...theme.separator,
      ...styles?.separator,
    },
    activeItem: {
      ...theme.activeItem,
      ...styles?.activeItem,
    },
    itemHover: {
      ...theme.itemHover,
      ...styles?.itemHover,
    },
  }
}

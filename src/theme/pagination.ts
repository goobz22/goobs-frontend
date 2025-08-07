/**
 * @fileoverview Pagination component theming system
 */

import React from 'react'
import { TRANSITIONS } from './shared'

// --------------------------------------------------------------------------
// BASE THEME TYPES
// --------------------------------------------------------------------------

export type PaginationTheme = 'light' | 'dark' | 'sacred'

export interface PaginationStyles {
  /** Theme variant to apply */
  theme?: PaginationTheme
  /** Disable the pagination */
  disabled?: boolean
  /** Custom container background color */
  backgroundColor?: string
  /** Custom text color */
  color?: string
  /** Custom border color */
  borderColor?: string
  /** Custom border radius */
  borderRadius?: string
  /** Custom padding */
  padding?: string
  /** Custom margin */
  margin?: string
  /** Custom font size */
  fontSize?: string
  /** Custom font family */
  fontFamily?: string
  /** Button size variant */
  size?: 'small' | 'medium' | 'large'
  /** Custom hover effects */
  hoverColor?: string
  /** Custom active/focus colors */
  activeColor?: string
  /** Show/hide page numbers (for numbered pagination style) */
  showPageNumbers?: boolean
  /** Maximum number of page numbers to show */
  maxPageNumbers?: number
}

// --------------------------------------------------------------------------
// COMPUTED STYLES INTERFACE
// --------------------------------------------------------------------------

export interface ComputedPaginationStyles {
  container: React.CSSProperties
  buttonContainer: React.CSSProperties
  button: React.CSSProperties
  buttonDisabled: React.CSSProperties
  buttonHover: React.CSSProperties
  buttonActive: React.CSSProperties
  pageInfo: React.CSSProperties
  pageNumber: React.CSSProperties
  pageNumberActive: React.CSSProperties
  ellipsis: React.CSSProperties
}

// --------------------------------------------------------------------------
// THEME DEFINITIONS
// --------------------------------------------------------------------------

const lightTheme = {
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    color: '#374151',
  },
  button: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    color: '#374151',
    hoverBackgroundColor: '#f1f5f9',
    hoverBorderColor: '#cbd5e1',
    activeBackgroundColor: '#e2e8f0',
    activeBorderColor: '#94a3b8',
  },
  pageInfo: {
    color: '#6b7280',
  },
  pageNumber: {
    backgroundColor: 'transparent',
    borderColor: '#e2e8f0',
    color: '#374151',
    hoverBackgroundColor: '#f1f5f9',
    activeBackgroundColor: '#3b82f6',
    activeColor: '#ffffff',
  },
}

const darkTheme = {
  container: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#e5e7eb',
  },
  button: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#e5e7eb',
    hoverBackgroundColor: '#4b5563',
    hoverBorderColor: '#6b7280',
    activeBackgroundColor: '#6b7280',
    activeBorderColor: '#9ca3af',
  },
  pageInfo: {
    color: '#9ca3af',
  },
  pageNumber: {
    backgroundColor: 'transparent',
    borderColor: '#4b5563',
    color: '#e5e7eb',
    hoverBackgroundColor: '#4b5563',
    activeBackgroundColor: '#3b82f6',
    activeColor: '#ffffff',
  },
}

const sacredTheme = {
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
    color: '#FFD700',
  },
  button: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
    color: '#FFD700',
    hoverBackgroundColor: 'rgba(255, 215, 0, 0.2)',
    hoverBorderColor: 'rgba(255, 215, 0, 0.6)',
    activeBackgroundColor: 'rgba(255, 215, 0, 0.3)',
    activeBorderColor: 'rgba(255, 215, 0, 0.8)',
  },
  pageInfo: {
    color: 'rgba(255, 215, 0, 0.8)',
  },
  pageNumber: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 215, 0, 0.3)',
    color: '#FFD700',
    hoverBackgroundColor: 'rgba(255, 215, 0, 0.15)',
    activeBackgroundColor: 'rgba(255, 215, 0, 0.25)',
    activeColor: '#FFD700',
  },
}

export const paginationThemes = {
  light: lightTheme,
  dark: darkTheme,
  sacred: sacredTheme,
}

// --------------------------------------------------------------------------
// THEME GETTER
// --------------------------------------------------------------------------

export const getPaginationTheme = (theme: PaginationTheme = 'light') => {
  return paginationThemes[theme] || paginationThemes.light
}

// --------------------------------------------------------------------------
// SIZE VARIANTS
// --------------------------------------------------------------------------

const sizeVariants = {
  small: {
    fontSize: '12px',
    padding: '4px 8px',
    buttonSize: '24px',
    iconSize: '14px',
  },
  medium: {
    fontSize: '14px',
    padding: '8px 12px',
    buttonSize: '32px',
    iconSize: '16px',
  },
  large: {
    fontSize: '16px',
    padding: '12px 16px',
    buttonSize: '40px',
    iconSize: '20px',
  },
}

// --------------------------------------------------------------------------
// STYLES GENERATOR
// --------------------------------------------------------------------------

export const getPaginationStyles = (
  styles: PaginationStyles = {},
  _isHovered: boolean = false,
  _isActive: boolean = false,
  isDisabled: boolean = false
): ComputedPaginationStyles => {
  const theme = getPaginationTheme(styles.theme)
  const size = sizeVariants[styles.size || 'medium']
  const isSacredTheme = styles.theme === 'sacred'

  // Base container styles
  const container: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: styles.padding || '12px',
    margin: styles.margin || '0',
    backgroundColor: styles.backgroundColor || theme.container.backgroundColor,
    border: `1px solid ${styles.borderColor || theme.container.borderColor}`,
    borderRadius: styles.borderRadius || '8px',
    color: styles.color || theme.container.color,
    fontFamily: isSacredTheme
      ? '"Cinzel", serif'
      : styles.fontFamily || '"Inter", sans-serif',
    fontSize: styles.fontSize || size.fontSize,
    position: 'relative',
    transition: TRANSITIONS.medium,
    ...(isDisabled && {
      opacity: 0.5,
      pointerEvents: 'none',
    }),
    ...(isSacredTheme && {
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 20px rgba(255, 215, 0, 0.1)',
    }),
  }

  // Button container styles
  const buttonContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }

  // Base button styles
  const button: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size.buttonSize,
    height: size.buttonSize,
    padding: '0',
    backgroundColor: theme.button.backgroundColor,
    border: `1px solid ${theme.button.borderColor}`,
    borderRadius: '6px',
    color: theme.button.color,
    cursor: 'pointer',
    transition: TRANSITIONS.medium,
    fontSize: size.iconSize,
    fontFamily: 'inherit',
    ...(isSacredTheme && {
      backdropFilter: 'blur(4px)',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.3)',
    }),
  }

  // Disabled button styles
  const buttonDisabled: React.CSSProperties = {
    ...button,
    opacity: 0.3,
    cursor: 'not-allowed',
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  }

  // Hover button styles
  const buttonHover: React.CSSProperties = {
    ...button,
    backgroundColor: theme.button.hoverBackgroundColor,
    borderColor: theme.button.hoverBorderColor,
    transform: 'translateY(-1px)',
    ...(isSacredTheme && {
      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
    }),
  }

  // Active button styles
  const buttonActive: React.CSSProperties = {
    ...button,
    backgroundColor: theme.button.activeBackgroundColor,
    borderColor: theme.button.activeBorderColor,
    transform: 'translateY(0)',
  }

  // Page info styles (showing "X-Y of Z")
  const pageInfo: React.CSSProperties = {
    color: theme.pageInfo.color,
    fontSize: size.fontSize,
    fontWeight: '500',
    minWidth: '80px',
    textAlign: 'center',
    padding: '0 8px',
    whiteSpace: 'nowrap',
    ...(isSacredTheme && {
      textShadow: '0 0 4px rgba(255, 215, 0, 0.3)',
    }),
  }

  // Page number styles (for numbered pagination)
  const pageNumber: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: size.buttonSize,
    height: size.buttonSize,
    padding: '0 4px',
    backgroundColor: theme.pageNumber.backgroundColor,
    border: `1px solid ${theme.pageNumber.borderColor}`,
    borderRadius: '6px',
    color: theme.pageNumber.color,
    cursor: 'pointer',
    transition: TRANSITIONS.medium,
    fontSize: size.fontSize,
    fontFamily: 'inherit',
    fontWeight: '500',
    textDecoration: 'none',
    ...(isSacredTheme && {
      backdropFilter: 'blur(4px)',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.3)',
    }),
  }

  // Active page number styles
  const pageNumberActive: React.CSSProperties = {
    ...pageNumber,
    backgroundColor: theme.pageNumber.activeBackgroundColor,
    borderColor: theme.pageNumber.activeBackgroundColor,
    color: theme.pageNumber.activeColor,
    fontWeight: '600',
    cursor: 'default',
    ...(isSacredTheme && {
      boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
    }),
  }

  // Ellipsis styles
  const ellipsis: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: size.buttonSize,
    height: size.buttonSize,
    color: theme.pageInfo.color,
    fontSize: size.fontSize,
    fontWeight: '500',
    userSelect: 'none',
  }

  return {
    container,
    buttonContainer,
    button,
    buttonDisabled,
    buttonHover,
    buttonActive,
    pageInfo,
    pageNumber,
    pageNumberActive,
    ellipsis,
  }
}

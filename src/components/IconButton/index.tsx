/**
 * @fileoverview This file defines the IconButton component, a button specifically designed for icon-only usage.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, { forwardRef } from 'react'
import CustomButton, { ButtonProps } from '../Button'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface IconButtonProps extends Omit<ButtonProps, 'text'> {
  /** Size of the icon button */
  size?: 'small' | 'medium' | 'large'
  /** Color scheme for the button */
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | 'default'
  /** The icon element to display */
  children: React.ReactNode
}

// --------------------------------------------------------------------------
// MAIN ICONBUTTON COMPONENT
// --------------------------------------------------------------------------

/**
 * A button component specifically designed for icon-only usage.
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { size = 'medium', color = 'default', children, styles, ...restProps },
    ref
  ) => {
    // Map size to button dimensions
    const sizeMap = {
      small: { width: '32px', height: '32px', padding: '4px' },
      medium: { width: '40px', height: '40px', padding: '8px' },
      large: { width: '48px', height: '48px', padding: '12px' },
    }

    // Map color to theme colors
    const colorMap = {
      primary: { backgroundColor: '#1976d2', color: 'white' },
      secondary: { backgroundColor: '#9c27b0', color: 'white' },
      success: { backgroundColor: '#2e7d32', color: 'white' },
      error: { backgroundColor: '#d32f2f', color: 'white' },
      info: { backgroundColor: '#0288d1', color: 'white' },
      warning: { backgroundColor: '#ed6c02', color: 'white' },
      default: { backgroundColor: 'transparent', color: 'inherit' },
    }

    const buttonStyles = {
      ...sizeMap[size],
      ...colorMap[color],
      borderRadius: '50%',
      border: color === 'default' ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'auto',
      ...styles,
    }

    return (
      <CustomButton
        ref={ref}
        icon={children}
        styles={buttonStyles}
        {...restProps}
      />
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton

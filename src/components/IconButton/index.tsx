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
  /**
   * Size of the icon button. `'xsmall'` (20px) is used for inline micro
   * actions like the per-row delete button on a draggable PDF field —
   * smaller than `'small'` (32px) which is the default control-row size.
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large'
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
      xsmall: { width: '20px', height: '20px', padding: '2px' },
      small: { width: '32px', height: '32px', padding: '4px' },
      medium: { width: '40px', height: '40px', padding: '8px' },
      large: { width: '48px', height: '48px', padding: '12px' },
    }

    // Map color to theme colors (only apply if not sacred theme).
    //
    // The `default` color is the one the QA dark-theme story exercises
    // (color defaults to 'default'). It must NOT hardcode light-mode
    // assumptions: previously the non-sacred branch set
    // `color: 'inherit'` for `default`, which — passed as an inline
    // style to <Button> — overrode Button.module.css's
    // `.button[data-theme='dark']` color token. The icon then inherited
    // the page's near-black text on a dark-navy backdrop (the reported
    // "pencil renders near-black, no visible surface/ring" defect). The
    // dark icon CSS resolves to `currentColor`, so the icon color is
    // entirely driven by the button's color. We therefore set an
    // explicit, theme-appropriate `default` color (and surface/border
    // below) so the control is visible on both light and dark backdrops.
    const isDarkTheme = styles?.theme === 'dark'

    const colorMap =
      styles?.theme === 'sacred'
        ? {
            primary: { backgroundColor: 'transparent', color: '#FFD700' },
            secondary: { backgroundColor: 'transparent', color: '#FFD700' },
            success: { backgroundColor: 'transparent', color: '#10B981' },
            error: { backgroundColor: 'transparent', color: '#EF4444' },
            info: { backgroundColor: 'transparent', color: '#3B82F6' },
            warning: { backgroundColor: 'transparent', color: '#F59E0B' },
            default: { backgroundColor: 'transparent', color: '#FFD700' },
          }
        : {
            primary: { backgroundColor: '#1976d2', color: 'white' },
            secondary: { backgroundColor: '#9c27b0', color: 'white' },
            success: { backgroundColor: '#2e7d32', color: 'white' },
            error: { backgroundColor: '#d32f2f', color: 'white' },
            info: { backgroundColor: '#0288d1', color: 'white' },
            warning: { backgroundColor: '#ed6c02', color: 'white' },
            // Dark theme: explicit light icon color so the glyph reads on
            // the dark navy surface; light theme keeps `inherit` so it
            // picks up the surrounding text color as before.
            default: {
              backgroundColor: 'transparent',
              color: isDarkTheme ? 'var(--goobs-dark-text)' : 'inherit',
            },
          }

    // Don't apply border if sacred theme is being used.
    const shouldApplyBorder = color === 'default' && styles?.theme !== 'sacred'

    // The ring color must be visible on the active backdrop. The old
    // hardcoded `rgba(0, 0, 0, 0.12)` is invisible on the dark-navy
    // surface, leaving the dark-theme button with no perceptible
    // border. Map to the theme border token instead.
    const defaultBorderColor = isDarkTheme
      ? 'var(--goobs-dark-border)'
      : 'rgba(0, 0, 0, 0.12)'

    const buttonStyles = {
      ...sizeMap[size],
      ...colorMap[color],
      borderRadius: '50%',
      border: shouldApplyBorder ? `1px solid ${defaultBorderColor}` : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'auto',
      ...styles,
      // Force remove all borders and backgrounds if sacred theme
      ...(styles?.theme === 'sacred' && {
        outline: false, // This is the key property that removes borders in getButtonStyles
        border: 'none',
        borderWidth: '0',
        borderStyle: 'none',
        borderColor: 'transparent',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
        },
      }),
    }

    return (
      <CustomButton
        ref={ref}
        icon={children}
        styles={buttonStyles}
        {...restProps}
        data-component="IconButton"
      />
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton

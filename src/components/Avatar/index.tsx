/**
 * @fileoverview This file defines the Avatar component, a circular container for displaying icons, images, or text.
 * It supports light, dark, and sacred themes with extensive customization options for size and styling.
 */
'use client'

import React, { forwardRef, type CSSProperties } from 'react'
import cssStyles from './Avatar.module.css'

// --------------------------------------------------------------------------
// STYLES TYPE
// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The content to be displayed within the avatar (icon, text, or image). */
  children: React.ReactNode
  /** Comprehensive styling options including theme, size, colors, and layout properties. */
  styles?: AvatarStyles
}

// --------------------------------------------------------------------------
// MAIN AVATAR COMPONENT
// --------------------------------------------------------------------------

/**
 * A circular avatar component with theming support for displaying icons, images, or text.
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, styles, ...restProps }, ref) => {
    const theme = styles?.theme || 'light'
    const isDisabled = styles?.disabled || false

    // Caller-supplied scalar overrides layer on top of the CSS defaults.
    // Border resolution mirrors the old getAvatarTheme: only `borderColor`
    // (with optional `borderWidth`) produces a border override here — a bare
    // `styles.border` was never read by the original theme logic.
    const resolvedBorder = styles?.borderColor
      ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
      : undefined

    const dynamicStyle: CSSProperties = {
      ...(styles?.width !== undefined && { width: styles.width }),
      ...(styles?.height !== undefined && { height: styles.height }),
      ...(styles?.borderRadius !== undefined && {
        borderRadius: styles.borderRadius,
      }),
      ...(styles?.backgroundColor !== undefined && {
        backgroundColor: styles.backgroundColor,
      }),
      ...(styles?.color !== undefined && { color: styles.color }),
      ...(styles?.fontSize !== undefined && { fontSize: styles.fontSize }),
      ...(styles?.fontWeight !== undefined && {
        fontWeight: styles.fontWeight,
      }),
      ...(resolvedBorder !== undefined && { border: resolvedBorder }),
      ...(styles?.boxShadow !== undefined && { boxShadow: styles.boxShadow }),
      ...(styles?.margin !== undefined && { margin: styles.margin }),
      ...(styles?.marginTop !== undefined && { marginTop: styles.marginTop }),
      ...(styles?.marginBottom !== undefined && {
        marginBottom: styles.marginBottom,
      }),
      ...(styles?.marginLeft !== undefined && {
        marginLeft: styles.marginLeft,
      }),
      ...(styles?.marginRight !== undefined && {
        marginRight: styles.marginRight,
      }),
    }

    return (
      <div
        ref={ref}
        className={cssStyles.root}
        data-component="Avatar"
        data-theme={theme}
        {...(styles?.size !== undefined && { 'data-size': styles.size })}
        {...(isDisabled && { 'data-disabled': 'true' })}
        style={dynamicStyle}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar

/**
 * @fileoverview This file defines the Avatar component, a circular container for displaying icons, images, or text.
 * It supports light, dark, and sacred themes with extensive customization options for size and styling.
 */
'use client'

import React, { useMemo, forwardRef } from 'react'
import { getAvatarStyles } from '../../theme'
import type { AvatarStyles } from '../../theme'

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
    const isDisabled = styles?.disabled || false

    const computedStyles = useMemo(
      () => getAvatarStyles(styles, isDisabled),
      [styles, isDisabled]
    )

    return (
      <div ref={ref} style={computedStyles.container} {...restProps}>
        {children}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar

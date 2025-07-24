/**
 * @fileoverview This file defines the Fade component, a transition wrapper for opacity-based animations.
 * It supports light, dark, and sacred themes with customizable timing and transition properties.
 */
'use client'

import React, { useMemo, forwardRef } from 'react'
import { FadeStyles, getFadeStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface FadeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The content to be wrapped with fade transition. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, animation timing, and transition properties. */
  styles?: FadeStyles
}

// --------------------------------------------------------------------------
// MAIN FADE COMPONENT
// --------------------------------------------------------------------------

/**
 * A fade transition component with theming support for smooth opacity animations.
 */
const Fade = forwardRef<HTMLDivElement, FadeProps>(
  ({ children, styles, ...restProps }, ref) => {
    const isDisabled = styles?.disabled || false

    const computedStyles = useMemo(
      () => getFadeStyles(styles, isDisabled),
      [styles, isDisabled]
    )

    return (
      <div ref={ref} style={computedStyles.container} {...restProps}>
        {children}
      </div>
    )
  }
)

Fade.displayName = 'Fade'

export default Fade

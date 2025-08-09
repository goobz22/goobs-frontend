/**
 * @fileoverview This file defines the Zoom component, a transition wrapper for scale-based animations.
 * It supports light, dark, and sacred themes with customizable timing and transform properties.
 */
'use client'

import React, { useMemo, forwardRef } from 'react'
import { getZoomStyles } from '../../theme'
import type { ZoomStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ZoomProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The content to be wrapped with zoom transition. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, animation timing, and transform properties. */
  styles?: ZoomStyles
}

// --------------------------------------------------------------------------
// MAIN ZOOM COMPONENT
// --------------------------------------------------------------------------

/**
 * A zoom transition component with theming support for smooth scale animations.
 */
const Zoom = forwardRef<HTMLDivElement, ZoomProps>(
  ({ children, styles, ...restProps }, ref) => {
    const isDisabled = styles?.disabled || false

    const computedStyles = useMemo(
      () => getZoomStyles(styles, isDisabled),
      [styles, isDisabled]
    )

    return (
      <div ref={ref} style={computedStyles.container} {...restProps}>
        {children}
      </div>
    )
  }
)

Zoom.displayName = 'Zoom'

export default Zoom

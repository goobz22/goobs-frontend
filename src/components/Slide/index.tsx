/**
 * @fileoverview This file defines the Slide component, a transition wrapper for transform-based animations.
 * It supports light, dark, and sacred themes with customizable timing, direction, and transition properties.
 */
'use client'

import React, { useMemo, forwardRef } from 'react'
import { getSlideStyles, type SlideStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface SlideProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The content to be wrapped with slide transition. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, animation timing, direction, and transition properties. */
  styles?: SlideStyles
}

// --------------------------------------------------------------------------
// MAIN SLIDE COMPONENT
// --------------------------------------------------------------------------

/**
 * A slide transition component with theming support for smooth transform animations.
 * Supports sliding from different directions: up, down, left, right.
 */
const Slide = forwardRef<HTMLDivElement, SlideProps>(
  ({ children, styles, ...restProps }, ref) => {
    const isDisabled = styles?.disabled || false

    const computedStyles = useMemo(
      () => getSlideStyles(styles, isDisabled),
      [styles, isDisabled]
    )

    return (
      <div ref={ref} style={computedStyles.container} {...restProps}>
        {children}
      </div>
    )
  }
)

Slide.displayName = 'Slide'

export default Slide

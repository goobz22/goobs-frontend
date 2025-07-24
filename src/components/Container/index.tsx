/**
 * @fileoverview This file defines the Container component, a layout container element.
 * It supports light, dark, and sacred themes with extensive customization options for layout and spacing.
 */
'use client'

import React, { useMemo, forwardRef } from 'react'
import { ContainerStyles, getContainerStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface ContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The content to be wrapped by the container. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ContainerStyles
}

// --------------------------------------------------------------------------
// MAIN CONTAINER COMPONENT
// --------------------------------------------------------------------------

/**
 * A layout container component with theming support.
 */
const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, styles, ...restProps }, ref) => {
    const isDisabled = styles?.disabled || false

    const computedStyles = useMemo(
      () => getContainerStyles(styles, isDisabled),
      [styles, isDisabled]
    )

    return (
      <div ref={ref} style={computedStyles.container} {...restProps}>
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export default Container

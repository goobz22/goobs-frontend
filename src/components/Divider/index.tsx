/**
 * @fileoverview This file defines the Divider component, a line element for separating content.
 * It supports light, dark, and sacred themes with optional text content and customizable styling.
 */
'use client'

import React, { useMemo, forwardRef } from 'react'
import { DividerStyles, getDividerStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Optional content to display in the center of the divider. */
  children?: React.ReactNode
  /** Comprehensive styling options including theme, orientation, colors, and layout properties. */
  styles?: DividerStyles
}

// --------------------------------------------------------------------------
// MAIN DIVIDER COMPONENT
// --------------------------------------------------------------------------

/**
 * A divider component with theming support for separating content with optional text.
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ children, styles, ...restProps }, ref) => {
    const isDisabled = styles?.disabled || false

    const computedStyles = useMemo(
      () => getDividerStyles(styles, isDisabled),
      [styles, isDisabled]
    )

    return (
      <div ref={ref} style={computedStyles.container} {...restProps}>
        {children ? (
          <>
            <div style={computedStyles.line} />
            <div style={computedStyles.content}>{children}</div>
            <div style={computedStyles.line} />
          </>
        ) : (
          <div style={computedStyles.line} />
        )}
      </div>
    )
  }
)

Divider.displayName = 'Divider'

export default Divider

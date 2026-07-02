/**
 * @fileoverview This file defines the Slide component, a transition wrapper for transform-based animations.
 * It supports light, dark, and sacred themes with customizable timing, direction, and transition properties.
 */
'use client'

import React, { forwardRef, type CSSProperties } from 'react'
import cssStyles from './Slide.module.css'

// --------------------------------------------------------------------------
// STYLES TYPE — relocated from the old src/theme/slide.ts (removed in the
// css-modules-theme-removal teardown). Slide is fully CSS-module driven; only
// this caller-facing override type survives. Shape preserved verbatim.
// --------------------------------------------------------------------------

export interface SlideStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  in?: boolean
  timeout?: number

  // Slide direction
  direction?: 'up' | 'down' | 'left' | 'right'

  // Custom transition
  transition?: string
  transitionDuration?: string
  transitionDelay?: string
  transitionTimingFunction?: string

  // States
  disabled?: boolean
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface SlideProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
  /** The content to be wrapped with slide transition. */
  children: React.ReactNode
  /** Comprehensive styling options including theme, animation timing, direction, and transition properties. */
  styles?: SlideStyles
}

// --------------------------------------------------------------------------
// CLASSNAME COMPOSITION — local filter+join helper (no clsx dependency)
// --------------------------------------------------------------------------

function mergeClassNames(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ')
}

// --------------------------------------------------------------------------
// MAIN SLIDE COMPONENT
// --------------------------------------------------------------------------

/**
 * A slide transition component with theming support for smooth transform animations.
 * Supports sliding from different directions: up, down, left, right.
 *
 * Theme (light/dark/sacred) only changes the default transition timing and is
 * expressed as `data-theme`. Direction is expressed as `data-direction` and the
 * hidden→visible toggle is the `.in` class — all transform/timing lives in
 * Slide.module.css. Caller-supplied timing overrides (timeout / transitionDuration
 * / transitionTimingFunction / transition / transitionDelay) remain in JS and are
 * forwarded as CSS custom properties (or inline transition for the full-shorthand
 * `transition` override), preserving exact parity with the old getSlideStyles.
 */
const Slide = forwardRef<HTMLDivElement, SlideProps>(
  ({ children, styles, className: callerClassName, ...restProps }, ref) => {
    const theme = styles?.theme || 'light'
    const isDisabled = styles?.disabled || false
    const isVisible = styles?.in !== false
    const direction = styles?.direction || 'up'

    // Caller-supplied timing overrides stay in JS (dynamic user props). When the
    // caller passes a full `transition` shorthand it replaces the computed value
    // verbatim; otherwise timeout / transitionDuration / transitionTimingFunction
    // feed the --slide-duration / --slide-timing custom properties that the CSS
    // transition shorthand reads. Disabled forces `transition: none` via the
    // [data-disabled] CSS rule, so no inline timing is emitted in that case.
    const dynamicStyle: CSSProperties = {}
    if (!isDisabled) {
      if (styles?.transition !== undefined) {
        dynamicStyle.transition = styles.transition
      } else {
        if (styles?.timeout !== undefined) {
          ;(dynamicStyle as Record<string, string>)['--slide-duration'] =
            `${styles.timeout}ms`
        } else if (styles?.transitionDuration !== undefined) {
          ;(dynamicStyle as Record<string, string>)['--slide-duration'] =
            styles.transitionDuration
        }
        if (styles?.transitionTimingFunction !== undefined) {
          ;(dynamicStyle as Record<string, string>)['--slide-timing'] =
            styles.transitionTimingFunction
        }
      }
      if (styles?.transitionDelay !== undefined) {
        dynamicStyle.transitionDelay = styles.transitionDelay
      }
    }

    const className = mergeClassNames(
      cssStyles.root,
      isVisible && cssStyles.in,
      callerClassName
    )

    return (
      <div
        ref={ref}
        {...restProps}
        className={className}
        data-component="Slide"
        data-theme={theme}
        data-direction={direction}
        {...(isDisabled && { 'data-disabled': 'true' })}
        style={dynamicStyle}
      >
        {children}
      </div>
    )
  }
)

Slide.displayName = 'Slide'

export default Slide

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
  /** Theme variant: 'light' (default), 'dark', or 'sacred' — changes only the default transition timing. */
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  /** Visibility toggle: false slides out, anything else (including unset) shows the content. */
  in?: boolean
  /** Slide duration in milliseconds; wins over transitionDuration. */
  timeout?: number

  // Slide direction
  /** Direction the content slides in from (default 'up'). */
  direction?: 'up' | 'down' | 'left' | 'right'

  // Custom transition
  /** Full CSS transition shorthand; replaces the computed transition verbatim. */
  transition?: string
  /** Slide duration as a CSS time (e.g. '0.3s'); superseded by timeout. */
  transitionDuration?: string
  /** Transition delay. */
  transitionDelay?: string
  /** Transition timing function. */
  transitionTimingFunction?: string

  // States
  /** Freezes the transition (`transition: none` via data-disabled). */
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
 * forwarded as CSS custom properties (--slide-duration / --slide-timing /
 * --slide-transition / --slide-delay) — never as an inline `transition` property —
 * so the stylesheet keeps ownership of the delayed-inert visibility transition
 * (the exit animation is never cut short), preserving parity with the old getSlideStyles.
 */
const Slide = forwardRef<HTMLDivElement, SlideProps>(
  ({ children, styles, className: callerClassName, ...restProps }, ref) => {
    const theme = styles?.theme || 'light'
    const isDisabled = styles?.disabled || false
    const isVisible = styles?.in !== false
    const direction = styles?.direction || 'up'

    // Caller-supplied timing overrides stay in JS (dynamic user props) but are
    // forwarded as CSS CUSTOM PROPERTIES — never as inline `transition` /
    // `transition-delay` properties. This is deliberate and load-bearing for a11y:
    // the module CSS composes only the TRANSFORM half of the transition from these
    // vars while ALWAYS owning the VISIBILITY half (the delayed-inert exit that keeps
    // slid-out content perceivable until the animation finishes, then removes it from
    // the a11y tree + tab order). Emitting an inline `transition` shorthand instead
    // would replace the whole property and strip that visibility delay, cutting the
    // exit animation short; routing through --slide-transition / --slide-delay keeps
    // the stylesheet in control of the visibility transition. A full `transition`
    // shorthand → --slide-transition (replaces the transform half verbatim); otherwise
    // timeout / transitionDuration / transitionTimingFunction feed --slide-duration /
    // --slide-timing and transitionDelay feeds --slide-delay. Disabled forces
    // `transition: none` via [data-disabled], so no timing vars are emitted in that case.
    const dynamicStyle: CSSProperties = {}
    if (!isDisabled) {
      if (styles?.transition !== undefined) {
        ;(dynamicStyle as Record<string, string>)['--slide-transition'] =
          styles.transition
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
        ;(dynamicStyle as Record<string, string>)['--slide-delay'] =
          styles.transitionDelay
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

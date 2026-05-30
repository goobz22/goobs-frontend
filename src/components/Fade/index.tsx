/**
 * @fileoverview This file defines the Fade component, a transition wrapper for opacity-based animations.
 * It supports light, dark, and sacred themes with customizable timing and transition properties.
 */
'use client'

import React, { forwardRef, type CSSProperties } from 'react'
import cssStyles from './Fade.module.css'

// --------------------------------------------------------------------------
// STYLES INTERFACE
// --------------------------------------------------------------------------

export interface FadeStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  in?: boolean
  timeout?: number
  appear?: boolean
  enter?: boolean
  exit?: boolean

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

export interface FadeProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
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
 *
 * Theme/state are driven by CSS (data-theme + data-state + data-disabled on the
 * root); only caller-supplied timing overrides remain in JS, passed through as
 * CSS custom properties consumed by Fade.module.css.
 */
const Fade = forwardRef<HTMLDivElement, FadeProps>(
  ({ children, styles, ...restProps }, ref) => {
    // Old getFadeTheme used 'light' as the no-theme default, NOT 'sacred'.
    // Preserve that so callers omitting an explicit theme keep light's
    // 0.3s ease transition instead of silently getting sacred's 0.5s
    // cubic-bezier transition.
    const theme = styles?.theme || 'light'
    const isDisabled = styles?.disabled || false
    const isVisible = styles?.in !== false

    // Caller-supplied timing overrides are genuinely dynamic user props, so
    // they flow into CSS as custom properties (the selectors live in CSS).
    // Mirrors the old getFadeTheme override precedence: an explicit `timeout`
    // (ms) takes priority over `transitionDuration` for the duration token.
    const duration =
      styles?.timeout !== undefined
        ? `${styles.timeout}ms`
        : styles?.transitionDuration
    const customProperties: Record<string, string> = {}
    if (styles?.transition !== undefined) {
      customProperties['--fade-transition'] = styles.transition
    }
    if (duration !== undefined) {
      customProperties['--fade-duration'] = duration
    }
    if (styles?.transitionTimingFunction !== undefined) {
      customProperties['--fade-timing-function'] =
        styles.transitionTimingFunction
    }
    if (styles?.transitionDelay !== undefined) {
      customProperties['--fade-delay'] = styles.transitionDelay
    }

    const dynamicStyle: CSSProperties | undefined =
      Object.keys(customProperties).length > 0
        ? (customProperties as CSSProperties)
        : undefined

    return (
      <div
        ref={ref}
        className={cssStyles.container}
        data-component="Fade"
        data-theme={theme}
        data-state={isVisible ? 'visible' : 'hidden'}
        data-disabled={isDisabled ? 'true' : undefined}
        style={dynamicStyle}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Fade.displayName = 'Fade'

export default Fade

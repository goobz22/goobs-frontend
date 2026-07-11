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
  /** Theme variant: 'light' (default), 'dark', or 'sacred' — changes only the default transition timing. */
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  /** Visibility toggle: false fades out, anything else (including unset) shows the content. */
  in?: boolean
  /** Fade duration in milliseconds; wins over transitionDuration. */
  timeout?: number

  // Custom transition
  /** Full CSS transition shorthand; replaces the computed transition verbatim. */
  transition?: string
  /** Fade duration as a CSS time (e.g. '0.3s'); superseded by timeout. */
  transitionDuration?: string
  /** Transition delay. */
  transitionDelay?: string
  /** Transition timing function. */
  transitionTimingFunction?: string

  // States
  /** Renders the disabled treatment (data-disabled) — purely visual. */
  disabled?: boolean
}

// --------------------------------------------------------------------------
// TIMING HELPERS
// --------------------------------------------------------------------------

/**
 * Best-effort extraction of a CSS `transition` shorthand's longest running time
 * — duration + delay, summed per comma-separated segment — in milliseconds.
 *
 * Fade defers its `visibility: hidden` swap (which drops faded-out content from
 * the accessibility tree and tab order) until the fade-OUT visually completes,
 * keyed off the `--fade-duration` token in Fade.module.css. When a caller
 * supplies the full `transition` shorthand override, the real fade duration
 * lives INSIDE that string and is otherwise invisible to the CSS, so
 * `--fade-duration` would keep its theme default and the visibility swap could
 * fire early — chopping the fade and, worse, dropping content from the a11y
 * tree before it is actually gone. Parsing the longest segment time here and
 * feeding it back into `--fade-duration` keeps the deferral in lockstep with
 * the real animation for arbitrary, even multi-segment, transitions.
 *
 * Errs LONG on purpose (sums duration + delay, takes the max across segments):
 * deferring the a11y-tree drop slightly past the fade is harmless, dropping it
 * early is the actual defect. Returns `undefined` when no `<time>` token is
 * present, so the caller falls back to the `timeout` / `transitionDuration`
 * value (or, failing that, the CSS token default).
 */
function transitionRuntimeMs(transition: string): number | undefined {
  let max: number | undefined
  for (const segment of transition.split(',')) {
    // Unsigned <time> tokens only (a negative delay would shorten the sum and
    // risk an early drop — ignoring it keeps us on the safe, longer side).
    const times = segment.match(/\d*\.?\d+(?:ms|s)\b/gi)
    if (!times || times.length === 0) continue
    // Per the shorthand grammar the first <time> is the duration and the second
    // (if any) the delay; sum them so the deferral spans duration + delay.
    const totalMs = times.slice(0, 2).reduce((sum, token) => {
      const value = parseFloat(token)
      return sum + (/ms$/i.test(token) ? value : value * 1000)
    }, 0)
    if (max === undefined || totalMs > max) max = totalMs
  }
  return max
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
    // --fade-duration governs BOTH the default opacity fade and the deferred
    // visibility swap that keeps faded-out content out of the a11y tree/tab
    // order. When a full `transition` override is supplied it replaces the
    // opacity fade AND embeds the real fade duration, so prefer the duration
    // parsed out of it (keeps the visibility deferral matched to the actual
    // animation); otherwise fall back to timeout / transitionDuration.
    const transitionRuntime =
      styles?.transition !== undefined
        ? transitionRuntimeMs(styles.transition)
        : undefined
    if (transitionRuntime !== undefined) {
      customProperties['--fade-duration'] = `${transitionRuntime}ms`
    } else if (duration !== undefined) {
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

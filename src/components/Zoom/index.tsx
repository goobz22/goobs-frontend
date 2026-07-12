/**
 * @fileoverview This file defines the Zoom component, a transition wrapper for scale-based animations.
 * It supports light, dark, and sacred themes with customizable timing and transform properties.
 */
'use client'

import React, { forwardRef } from 'react'
import cssStyles from './Zoom.module.css'

// --------------------------------------------------------------------------
// TIMING HELPERS
// --------------------------------------------------------------------------

/**
 * Best-effort extraction of a CSS `transition` shorthand's longest running time
 * — duration + delay, summed per comma-separated segment — in milliseconds.
 *
 * Zoom defers its `visibility: hidden` swap (which drops zoomed-out content from
 * the accessibility tree and tab order) until the zoom-OUT visually completes,
 * keyed off the `--zoom-duration` token in Zoom.module.css. When a caller
 * supplies the full `transition` shorthand override, the real zoom duration
 * lives INSIDE that string and is otherwise invisible to the CSS, so
 * `--zoom-duration` would keep its theme default and the visibility swap could
 * fire early — chopping the animation and, worse, dropping content from the
 * a11y tree before it is actually gone. Parsing the longest segment time here
 * and feeding it back into `--zoom-duration` keeps the deferral in lockstep
 * with the real animation for arbitrary, even multi-segment, transitions.
 *
 * Errs LONG on purpose (sums duration + delay, takes the max across segments):
 * deferring the a11y-tree drop slightly past the zoom is harmless, dropping it
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

/**
 * Comprehensive styling options for the Zoom transition. Mirrors the legacy
 * theme-module shape so callers do not need to change their call sites.
 */
export interface ZoomStyles {
  // Theme selection
  /** Theme variant: 'light' (default), 'dark', or 'sacred' — changes only the default transition/hidden-scale values. */
  theme?: 'light' | 'dark' | 'sacred'

  // Animation properties
  /** Visibility toggle: false zooms out, anything else (including unset) shows the content. */
  in?: boolean
  /** Zoom duration in milliseconds; wins over transitionDuration. */
  timeout?: number

  // Transform properties
  /** CSS transform-origin for the scale animation. */
  transformOrigin?: string
  /** Visible-state scale (default 1); superseded by scaleEnter. */
  scale?: number
  /** Visible-state scale; wins over `scale`. */
  scaleEnter?: number
  /** Hidden-state scale (otherwise the per-theme CSS default applies). */
  scaleExit?: number

  // Custom transition
  /** Full CSS transition shorthand; replaces the computed transition verbatim. */
  transition?: string
  /** Zoom duration as a CSS time (default '0.3s' once any styles are passed); superseded by timeout. */
  transitionDuration?: string
  /** Transition delay. */
  transitionDelay?: string
  /** Transition timing function (default 'ease' once any styles are passed). */
  transitionTimingFunction?: string

  // States
  /** Renders the disabled treatment (data-disabled) — purely visual. */
  disabled?: boolean
}

export interface ZoomProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'style'
> {
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
 *
 * Theme/state are expressed as data-attributes consumed by Zoom.module.css;
 * caller-supplied dynamic values (custom scale, transform-origin, transition,
 * delay, or a timeout/timing override) are forwarded as CSS custom properties
 * so the selectors stay in CSS while the scalar values come from props.
 */
const Zoom = forwardRef<HTMLDivElement, ZoomProps>(
  ({ children, styles, ...restProps }, ref) => {
    const theme = styles?.theme ?? 'light'
    const isDisabled = styles?.disabled ?? false
    const isVisible = styles?.in !== false

    // CSS custom properties for caller-supplied dynamic values. Each is only
    // emitted when the caller actually provides an override, so the per-theme
    // defaults in the CSS module apply otherwise (visual parity with the old
    // getZoomTheme resolution).
    const dynamicStyle: React.CSSProperties & Record<string, string> = {}

    // scaleEnter = scaleEnter || scale || 1 (theme visible scale is always 1).
    const scaleEnter = styles?.scaleEnter ?? styles?.scale
    if (scaleEnter !== undefined) {
      dynamicStyle['--zoom-scale-enter'] = String(scaleEnter)
    }

    // scaleExit override; otherwise the CSS per-theme hidden scale applies.
    if (styles?.scaleExit !== undefined) {
      dynamicStyle['--zoom-scale-exit'] = String(styles.scaleExit)
    }

    if (styles?.transformOrigin !== undefined) {
      dynamicStyle['--zoom-transform-origin'] = styles.transformOrigin
    }

    if (styles?.transitionDelay !== undefined) {
      dynamicStyle['--zoom-transition-delay'] = styles.transitionDelay
    }

    // Transition resolution mirrors the legacy getZoomTheme: when ANY styles
    // object is supplied, the duration/timing defaults (0.3s ease) replace the
    // raw per-theme transition unless the caller passed an explicit transition
    // or duration/timing/timeout override. When styles is absent entirely, the
    // CSS per-theme default transition is left untouched.
    if (styles) {
      if (styles.transition !== undefined) {
        dynamicStyle['--zoom-transition'] = styles.transition
        // --zoom-duration governs the DEFERRED visibility swap that keeps
        // zoomed-out content out of the a11y tree / tab order. A full
        // `transition` override embeds the real running time, so prefer the
        // duration parsed out of it (keeps the deferral matched to the actual
        // animation); otherwise fall back to timeout / transitionDuration, else
        // leave the CSS per-theme default.
        const runtime = transitionRuntimeMs(styles.transition)
        if (runtime !== undefined) {
          dynamicStyle['--zoom-duration'] = `${runtime}ms`
        } else if (styles.timeout !== undefined) {
          dynamicStyle['--zoom-duration'] = `${styles.timeout}ms`
        } else if (styles.transitionDuration !== undefined) {
          dynamicStyle['--zoom-duration'] = styles.transitionDuration
        }
      } else {
        const duration =
          styles.timeout !== undefined
            ? `${styles.timeout}ms`
            : (styles.transitionDuration ?? '0.3s')
        const timingFunction = styles.transitionTimingFunction ?? 'ease'
        // Bake the delay token INLINE into each segment (mirrors the CSS default
        // and the sibling Fade pattern) so the caller delay rides WITH the
        // transform/opacity segments instead of as a separate, position-fragile
        // `transition-delay` longhand that would clobber a full override's own
        // embedded per-segment delays.
        dynamicStyle['--zoom-transition'] =
          `transform ${duration} ${timingFunction} var(--zoom-transition-delay), opacity ${duration} ${timingFunction} var(--zoom-transition-delay)`
        // Keep the deferred visibility swap in lockstep with the transform/
        // opacity duration so the a11y-tree drop lands exactly at the end of
        // the zoom-OUT.
        dynamicStyle['--zoom-duration'] = duration
      }
    }

    return (
      <div
        ref={ref}
        className={cssStyles.zoomRoot}
        data-component="Zoom"
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

Zoom.displayName = 'Zoom'

export default Zoom

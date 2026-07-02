/**
 * @fileoverview This file defines the Zoom component, a transition wrapper for scale-based animations.
 * It supports light, dark, and sacred themes with customizable timing and transform properties.
 */
'use client'

import React, { forwardRef } from 'react'
import cssStyles from './Zoom.module.css'

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
      } else {
        const duration =
          styles.timeout !== undefined
            ? `${styles.timeout}ms`
            : (styles.transitionDuration ?? '0.3s')
        const timingFunction = styles.transitionTimingFunction ?? 'ease'
        dynamicStyle['--zoom-transition'] =
          `transform ${duration} ${timingFunction}, opacity ${duration} ${timingFunction}`
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

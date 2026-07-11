'use client'

import React from 'react'
import cssStyles from './Badge.module.css'

/**
 * Styling surface for the badge chip. `theme` and `position` map to data
 * attributes; every scalar override rides in as the matching `--badge-*` CSS
 * custom property, set only when provided so the theme default applies
 * otherwise.
 */
export interface BadgeStyles {
  /** `data-theme` variant on the chip: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  /** Chip fill color; overrides `--badge-background-color` (theme default otherwise). */
  backgroundColor?: string
  /** Chip text color; overrides `--badge-color` (theme default otherwise). */
  color?: string
  /** Corner of the wrapped children the chip anchors to. Default 'top-right'. */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Inset in pixels from the anchored corner (`--badge-offset`). Default 8. */
  offset?: number

  /** Chip corner radius; overrides `--badge-border-radius` (theme default otherwise). */
  borderRadius?: string
  /** Chip width; overrides `--badge-width` (theme default otherwise). */
  width?: string
  /** Chip height; overrides `--badge-height` (theme default otherwise). */
  height?: string
  /** Chip font size; overrides `--badge-font-size` (theme default otherwise). */
  fontSize?: string
  /** Chip font weight; overrides `--badge-font-weight` (theme default otherwise). */
  fontWeight?: string
  /** Chip box shadow; overrides `--badge-box-shadow` (theme default otherwise). */
  boxShadow?: string
  /** Chip backdrop filter; overrides `--badge-backdrop-filter` (theme default otherwise). */
  backdropFilter?: string
  /** Chip border shorthand; overrides `--badge-border` (theme default otherwise). */
  border?: string
  /** Chip text shadow; overrides `--badge-text-shadow` (theme default otherwise). */
  textShadow?: string
}

export interface BadgeProps {
  /** Content rendered inside the badge chip (a count, dot, or short label). */
  content: React.ReactNode
  /** The anchor element(s) the badge overlays; the chip positions at one corner of this wrapper. */
  children: React.ReactNode
  /**
   * Accessible name announced by screen readers. A bare count like `5` is
   * meaningless out of context — pass e.g. `"5 unread notifications"` so the
   * badge is understandable, and INCLUDE the changing value so a live update
   * (see `ariaLive`) announces the new count. When omitted, the badge's text
   * `content` is its accessible name (fine for `content="5"`, insufficient for
   * a decorative dot / icon `content` that has no text of its own). Applied
   * only when the badge is not decorative (`role` other than `none`/`presentation`).
   */
  ariaLabel?: string
  /**
   * ARIA role for the badge chip. Defaults to `'status'`, so the badge is
   * exposed as a status indicator and — because a live region only ever
   * announces CHANGES, never its initial value — a count that updates after
   * render is read out while a static badge stays silent on load. Pass an
   * explicit role to override, e.g. `'none'` (or `'presentation'`) for a
   * purely decorative badge that should not be announced at all.
   */
  role?: string
  /**
   * Live-region politeness for badges whose value updates dynamically (a
   * notification or cart count going `5` → `6`). Only applied when the badge
   * resolves to `role="status"`; `'off'` suppresses the implicit polite
   * announcement of a status region. Defaults to the status region's implicit
   * `'polite'`.
   */
  ariaLive?: 'off' | 'polite' | 'assertive'
  /** Theme, corner position/offset, and `--badge-*` scalar overrides. See BadgeStyles. */
  styles?: BadgeStyles
}

/**
 * Small count or status indicator overlaid at a configurable corner of its
 * wrapped children, with light/dark/sacred theming and CSS-variable style
 * overrides. Accessible by default: the chip is a `role="status"` live region
 * (announces count changes, silent on initial render) and takes an `ariaLabel`
 * to give a bare number meaning — both overridable for decorative badges.
 */
const Badge: React.FC<BadgeProps> = ({
  content,
  children,
  ariaLabel,
  role,
  ariaLive,
  styles,
}) => {
  const theme = styles?.theme || 'light'
  const position = styles?.position || 'top-right'
  const offset = styles?.offset ?? 8

  // A badge is a status/count indicator, so it defaults to a `role="status"`
  // live region (accessible-by-default; matches the read-only Chip pill).
  // `none`/`presentation` opt out entirely for decorative badges.
  const resolvedRole = role ?? 'status'
  const isStatus = resolvedRole === 'status'
  const isDecorative =
    resolvedRole === 'none' || resolvedRole === 'presentation'

  // Caller-supplied overrides are passed as CSS custom properties; each var is
  // set ONLY when the caller provided it, so the CSS fallback (the theme value)
  // applies otherwise — mirroring the old `...(value && { value })` spread.
  const dynamicStyle: React.CSSProperties & Record<string, string> = {
    '--badge-offset': `${offset}px`,
  }
  if (styles?.backgroundColor)
    dynamicStyle['--badge-background-color'] = styles.backgroundColor
  if (styles?.color) dynamicStyle['--badge-color'] = styles.color
  if (styles?.borderRadius)
    dynamicStyle['--badge-border-radius'] = styles.borderRadius
  if (styles?.width) dynamicStyle['--badge-width'] = styles.width
  if (styles?.height) dynamicStyle['--badge-height'] = styles.height
  if (styles?.fontSize) dynamicStyle['--badge-font-size'] = styles.fontSize
  if (styles?.fontWeight)
    dynamicStyle['--badge-font-weight'] = styles.fontWeight
  if (styles?.boxShadow) dynamicStyle['--badge-box-shadow'] = styles.boxShadow
  if (styles?.backdropFilter)
    dynamicStyle['--badge-backdrop-filter'] = styles.backdropFilter
  if (styles?.border) dynamicStyle['--badge-border'] = styles.border
  if (styles?.textShadow)
    dynamicStyle['--badge-text-shadow'] = styles.textShadow

  return (
    <div className={cssStyles.container} data-component="Badge">
      {children}
      <span
        className={cssStyles.badge}
        data-theme={theme}
        data-position={position}
        role={resolvedRole}
        {...(!isDecorative &&
          ariaLabel !== undefined && { 'aria-label': ariaLabel })}
        {...(isStatus &&
          ariaLive !== undefined && { 'aria-live': ariaLive })}
        {...(isStatus && { 'aria-atomic': 'true' })}
        style={dynamicStyle}
      >
        {content}
      </span>
    </div>
  )
}

export default Badge

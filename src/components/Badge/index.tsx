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
  /** Theme, corner position/offset, and `--badge-*` scalar overrides. See BadgeStyles. */
  styles?: BadgeStyles
}

/**
 * Small count or status indicator overlaid at a configurable corner of its
 * wrapped children, with light/dark/sacred theming and CSS-variable style
 * overrides.
 */
const Badge: React.FC<BadgeProps> = ({ content, children, styles }) => {
  const theme = styles?.theme || 'light'
  const position = styles?.position || 'top-right'
  const offset = styles?.offset ?? 8

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
        style={dynamicStyle}
      >
        {content}
      </span>
    </div>
  )
}

export default Badge

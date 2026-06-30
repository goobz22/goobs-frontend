'use client'

import React from 'react'
import cssStyles from './Badge.module.css'

export interface BadgeStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Basic styling
  backgroundColor?: string
  color?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  offset?: number

  // Advanced styling
  borderRadius?: string
  width?: string
  height?: string
  fontSize?: string
  fontWeight?: string
  boxShadow?: string
  backdropFilter?: string
  border?: string
  textShadow?: string
}

export interface BadgeProps {
  content: React.ReactNode
  children: React.ReactNode
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

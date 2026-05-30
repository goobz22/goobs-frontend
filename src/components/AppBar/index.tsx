/**
 * @fileoverview Defines the AppBar component, a top navigation bar with theming support.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, { useCallback, type CSSProperties, type FC, type ReactNode } from 'react'
import cssStyles from './AppBar.module.css'

// --------------------------------------------------------------------------
// STYLES INTERFACE
// --------------------------------------------------------------------------
// Inlined (no theme import) so the AppBar component owns its public styling
// contract directly, matching the Button/Chip/Card convention. Field set
// kept in lockstep with theme/appbar.ts AppBarStyles.

export interface AppBarStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  backgroundImage?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  containerAnimation?: string

  // Toolbar styling
  toolbarPadding?: string
  toolbarMinHeight?: string
  toolbarGap?: string

  // Layout and spacing
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Position and dimensions
  position?: 'static' | 'fixed' | 'absolute' | 'sticky' | 'relative'
  top?: string
  left?: string
  right?: string
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
  zIndex?: number

  // Glyph styling
  glyphColor?: string
  glyphFontSize?: string
  glyphAnimation?: string

  // Shimmer effect (sacred theme)
  shimmerBackground?: string
  shimmerAnimation?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  elevated?: boolean
}

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface AppBarProps {
  /** Content displayed in the app bar (typically navigation, search, actions) */
  children?: ReactNode
  /** Position of the app bar */
  position?: 'static' | 'fixed' | 'absolute' | 'sticky' | 'relative'
  /** Whether the app bar should have elevation (box shadow) */
  elevated?: boolean
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: AppBarStyles
  /** Additional CSS class name */
  className?: string
  /** Callback fired when the app bar is clicked */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

// --------------------------------------------------------------------------
// CLASSNAME COMPOSITION (no clsx dependency in this repo — see Card)
// --------------------------------------------------------------------------

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

// --------------------------------------------------------------------------
// MAIN APPBAR COMPONENT
// --------------------------------------------------------------------------

/**
 * A top navigation bar component with comprehensive theming support.
 */
const AppBar: FC<AppBarProps> = props => {
  const { children, position = 'static', elevated = true, styles, className, onClick, ...rest } = props

  // The legacy theme system defaulted to 'light' when no theme was provided.
  const theme = styles?.theme || 'light'
  const isDisabled = !!styles?.disabled
  const isSacredTheme = theme === 'sacred'

  const resolvedPosition = styles?.position || position

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDisabled && onClick) {
        onClick(event)
      }
    },
    [isDisabled, onClick]
  )

  // Caller-supplied / runtime values are passed as CSS custom properties; the
  // selectors live in AppBar.module.css. Theme + state defaults are resolved
  // in CSS. We only set a var when the caller actually provided a value
  // (or, for fixed positioning, when the auto-pin to 0 should apply) — exactly
  // mirroring the old getAppBarStyles `styles?.x || fallback` chain.
  const dynamicStyle: CSSProperties = {}
  const setVar = (name: string, value: string | number | undefined): void => {
    if (value !== undefined) {
      ;(dynamicStyle as Record<string, string>)[name] = String(value)
    }
  }

  // Position + fixed-position auto-pin (top/left/right default to '0' when fixed).
  setVar('--appbar-position', resolvedPosition)
  setVar('--appbar-top', styles?.top ?? (resolvedPosition === 'fixed' ? '0' : undefined))
  setVar('--appbar-left', styles?.left ?? (resolvedPosition === 'fixed' ? '0' : undefined))
  setVar('--appbar-right', styles?.right ?? (resolvedPosition === 'fixed' ? '0' : undefined))

  // Dimensions
  setVar('--appbar-width', styles?.width)
  setVar('--appbar-max-width', styles?.maxWidth)
  setVar('--appbar-min-width', styles?.minWidth)
  setVar('--appbar-height', styles?.height)
  setVar('--appbar-max-height', styles?.maxHeight)
  setVar('--appbar-min-height', styles?.minHeight)
  setVar('--appbar-z-index', styles?.zIndex)

  // Margins
  setVar('--appbar-margin', styles?.margin)
  setVar('--appbar-margin-top', styles?.marginTop)
  setVar('--appbar-margin-bottom', styles?.marginBottom)
  setVar('--appbar-margin-left', styles?.marginLeft)
  setVar('--appbar-margin-right', styles?.marginRight)

  // Container surface overrides (theme defaults live in CSS).
  setVar('--appbar-bg', styles?.backgroundColor)
  setVar('--appbar-bg-image', styles?.backgroundImage)
  if (styles?.borderColor) {
    setVar('--appbar-border', `${styles.borderWidth || '1px'} solid ${styles.borderColor}`)
  }
  setVar('--appbar-radius', styles?.borderRadius)
  const hasExplicitShadow = styles?.boxShadow !== undefined
  setVar('--appbar-shadow', styles?.boxShadow)
  setVar('--appbar-backdrop', styles?.backdropFilter)
  setVar('--appbar-container-animation', styles?.containerAnimation)

  // Toolbar overrides
  setVar('--appbar-toolbar-padding', styles?.toolbarPadding)
  setVar('--appbar-toolbar-min-height', styles?.toolbarMinHeight)
  setVar('--appbar-toolbar-gap', styles?.toolbarGap)

  // Transition override (old: `all <duration> <easing>`).
  if (styles?.transitionDuration) {
    setVar(
      '--appbar-transition',
      `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
    )
  }

  return (
    <div
      className={mergeClassNames(cssStyles.container, className)}
      data-theme={theme}
      data-elevated={elevated ? 'true' : 'false'}
      data-has-shadow={hasExplicitShadow ? 'true' : undefined}
      data-disabled={isDisabled ? 'true' : undefined}
      style={dynamicStyle}
      onClick={handleClick}
      role="banner"
      data-testid="app-bar"
      {...rest}
    >
      {isSacredTheme && <div className={cssStyles.shimmer} aria-hidden="true" />}

      <div className={cssStyles.toolbar}>{children}</div>
    </div>
  )
}

AppBar.displayName = 'AppBar'
export default AppBar

/**
 * @fileoverview Defines the AppBar component, a top navigation bar with theming support.
 * It supports light, dark, and sacred themes with extensive customization options.
 */
'use client'

import React, {
  useCallback,
  type CSSProperties,
  type FC,
  type ReactNode,
} from 'react'
import cssStyles from './AppBar.module.css'

// --------------------------------------------------------------------------
// STYLES INTERFACE
// --------------------------------------------------------------------------
// The AppBar component owns its public styling contract directly, matching
// the Button/Chip/Card convention. Every key here is read in this file and
// wired to a CSS custom property consumed by AppBar.module.css.

export interface AppBarStyles {
  // Theme selection
  /** Theme variant: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  /** Bar background color. */
  backgroundColor?: string
  /** Bar background-image. */
  backgroundImage?: string
  /** Bar border color; composes a `<borderWidth> solid <borderColor>` border (no border without it). */
  borderColor?: string
  /** Bar border radius. */
  borderRadius?: string
  /** Border width used with borderColor (default 1px); ignored without borderColor. */
  borderWidth?: string
  /** Bar box shadow (overrides the elevated/theme default). */
  boxShadow?: string
  /** Bar backdrop-filter (e.g. a blur). */
  backdropFilter?: string
  /** CSS animation shorthand applied to the bar container. */
  containerAnimation?: string

  // Toolbar styling
  /** Inner toolbar padding. */
  toolbarPadding?: string
  /** Inner toolbar min-height. */
  toolbarMinHeight?: string
  /** Flex gap between toolbar children. */
  toolbarGap?: string

  // Layout and spacing
  /** Bar margin shorthand. */
  margin?: string
  /** Bar top margin. */
  marginTop?: string
  /** Bar bottom margin. */
  marginBottom?: string
  /** Bar left margin. */
  marginLeft?: string
  /** Bar right margin. */
  marginRight?: string

  // Position and dimensions
  /** CSS position; takes precedence over the `position` prop. 'fixed' auto-pins top/left/right to 0 unless overridden. */
  position?: 'static' | 'fixed' | 'absolute' | 'sticky' | 'relative'
  /** CSS `top` offset (defaults to 0 when position is 'fixed'). */
  top?: string
  /** CSS `left` offset (defaults to 0 when position is 'fixed'). */
  left?: string
  /** CSS `right` offset (defaults to 0 when position is 'fixed'). */
  right?: string
  /** Bar width. */
  width?: string
  /** Bar max-width. */
  maxWidth?: string
  /** Bar min-width. */
  minWidth?: string
  /** Bar height. */
  height?: string
  /** Bar max-height. */
  maxHeight?: string
  /** Bar min-height. */
  minHeight?: string
  /** Bar z-index. */
  zIndex?: number

  // Transitions
  /** Replaces the whole bar transition with `all <duration> <easing>`. */
  transitionDuration?: string
  /** Easing used with transitionDuration (default cubic-bezier(0.4, 0, 0.2, 1)); ignored without it. */
  transitionEasing?: string

  // States
  /** Disables the bar: suppresses onClick and sets data-disabled for the CSS module. */
  disabled?: boolean
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
  /**
   * Root `data-testid` (default `'app-bar'`). Override it to disambiguate when
   * a page renders more than one app bar so their test ids don't collide.
   * Matches the additive `data-testid` prop convention (see Markdown).
   */
  'data-testid'?: string
  /**
   * Accessible name for the `banner` landmark, exposed as `aria-label` on the
   * root `<header>`. Set this to disambiguate when a page renders more than one
   * banner/app-bar landmark (assistive tech otherwise lists them identically).
   */
  ariaLabel?: string
  /**
   * Callback fired when the app bar is clicked.
   *
   * ⚠️ Accessibility (WCAG 2.1.1 Keyboard): this fires on the `banner` landmark
   * itself, which is intentionally NOT keyboard-focusable, so a handler wired
   * here is **pointer-only** — it cannot be reached or activated by keyboard or
   * assistive-tech users. Making a `role="banner"` region focusable/activatable
   * would be a semantic anti-pattern, so the landmark is deliberately left
   * non-interactive. Therefore: put any action that MUST be operable by everyone
   * on a real interactive child (a `<button>`/`<a>` inside `children`), and use
   * `onClick` only for a redundant pointer convenience that duplicates such a
   * child control — never as the sole way to trigger a behavior.
   */
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
  const {
    children,
    position = 'static',
    elevated = true,
    styles,
    className,
    ariaLabel,
    onClick,
    'data-testid': dataTestId = 'app-bar',
    ...rest
  } = props

  // The legacy theme system defaulted to 'light' when no theme was provided.
  const theme = styles?.theme || 'light'
  const isDisabled = !!styles?.disabled
  const isSacredTheme = theme === 'sacred'

  const resolvedPosition = styles?.position || position

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!isDisabled && onClick) {
        // The root landmark renders as a native <header> (HTMLElement); the
        // public onClick keeps its historical HTMLDivElement event type to stay
        // additive-only. The concrete element is API-compatible for callers.
        onClick(event as React.MouseEvent<HTMLDivElement>)
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
  setVar(
    '--appbar-top',
    styles?.top ?? (resolvedPosition === 'fixed' ? '0' : undefined)
  )
  setVar(
    '--appbar-left',
    styles?.left ?? (resolvedPosition === 'fixed' ? '0' : undefined)
  )
  setVar(
    '--appbar-right',
    styles?.right ?? (resolvedPosition === 'fixed' ? '0' : undefined)
  )

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
    setVar(
      '--appbar-border',
      `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
    )
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

  // Renders as a native <header> — an app bar IS the page's banner landmark, so
  // the semantically correct element gives that landmark to assistive tech AND
  // to crawlers/SSR HTML natively (matching Breadcrumb/Pagination's native
  // <nav>). role="banner" is kept explicitly: it preserves the machine-test
  // selector contract AND guarantees the banner role even when a <header> is
  // nested inside sectioning content (where its implicit role degrades).
  return (
    <header
      className={mergeClassNames(cssStyles.container, className)}
      data-component="AppBar"
      data-theme={theme}
      data-elevated={elevated ? 'true' : 'false'}
      data-has-shadow={hasExplicitShadow ? 'true' : undefined}
      data-disabled={isDisabled ? 'true' : undefined}
      data-state={isDisabled ? 'disabled' : 'enabled'}
      style={dynamicStyle}
      onClick={handleClick}
      role="banner"
      aria-label={ariaLabel}
      data-testid={dataTestId}
      {...rest}
    >
      {isSacredTheme && (
        <div className={cssStyles.shimmer} aria-hidden="true" />
      )}

      <div className={cssStyles.toolbar}>{children}</div>
    </header>
  )
}

AppBar.displayName = 'AppBar'
export default AppBar

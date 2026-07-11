/**
 * @fileoverview Drawer component - A side navigation panel that slides in from the edge.
 * Supports light, dark, and sacred themes with TreeView integration.
 */
'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type FC,
  type CSSProperties,
} from 'react'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Drawer.module.css'

// --------------------------------------------------------------------------
// TYPES AND INTERFACES
// --------------------------------------------------------------------------

export interface DrawerStyles {
  // Theme selection
  /** Theme variant: 'light' (default), 'dark', or 'sacred' (sacred adds the animated glyph canvas). */
  theme?: 'light' | 'dark' | 'sacred'

  // Permanent drawer styling
  /** Panel background when variant is 'permanent'. */
  permanentBackground?: string
  /** Panel box shadow when variant is 'permanent'. */
  permanentBoxShadow?: string
  /** Panel backdrop-filter when variant is 'permanent'. */
  permanentBackdropFilter?: string
  /** Panel background-image when variant is 'permanent'. */
  permanentBackgroundImage?: string

  // Temporary drawer styling
  /** Panel background for non-permanent variants. */
  temporaryBackground?: string
  /** Panel box shadow for non-permanent variants. */
  temporaryBoxShadow?: string
  /** Panel backdrop-filter for non-permanent variants. */
  temporaryBackdropFilter?: string
  /** Panel background-image for non-permanent variants. */
  temporaryBackgroundImage?: string

  // Backdrop styling
  /** Backdrop background color (temporary variant only). */
  backdropBackgroundColor?: string
  /** Backdrop backdrop-filter (temporary variant only). */
  backdropBackdropFilter?: string

  // Layout and spacing
  /** Panel width (applies to both vertical and horizontal anchors). */
  width?: string
  /** Panel height (applies to both vertical and horizontal anchors). */
  height?: string
  /** Panel CSS `top` offset; numbers are treated as px. */
  top?: string | number
  /** Panel padding. */
  padding?: string
  /** Panel margin. */
  margin?: string
  /** Panel z-index. */
  zIndex?: number
  /** Backdrop z-index. */
  backdropZIndex?: number

  // Transitions
  /** Replaces the slide transition with `transform <duration> <easing>`. */
  transitionDuration?: string
  /** Easing used with transitionDuration (default ease-in-out); ignored without it. */
  transitionEasing?: string

  // States
  /** Dims the panel to 50% opacity and disables pointer events. */
  disabled?: boolean
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  outline?: boolean

  // Dimensions
  /** Panel max-width. */
  maxWidth?: string
  /** Panel min-width. */
  minWidth?: string
  /** Panel max-height. */
  maxHeight?: string
  /** Panel min-height. */
  minHeight?: string

  // Force positioning
  /** Forces the drawer to the left edge, overriding the `anchor` prop. */
  forceLeft?: boolean
  /** Forces the drawer to the right edge, overriding the `anchor` prop (forceLeft wins if both set). */
  forceRight?: boolean
}

export interface DrawerProps {
  /** Whether the drawer is open */
  open?: boolean

  /** Callback fired when the drawer requests to be closed */
  onClose?: () => void

  /** Which side the drawer opens from */
  anchor?: 'left' | 'right' | 'top' | 'bottom'

  /** The variant of the drawer */
  variant?: 'permanent' | 'persistent' | 'temporary'

  /** Drawer content */
  children?: ReactNode

  /** Component styling */
  styles?: DrawerStyles

  /**
   * `aria-labelledby` for the drawer surface — the id of a heading inside
   * `children` (the preferred accessible-name source for the `role="dialog"`
   * panel). Screen readers announce this on open (WCAG 4.1.2).
   */
  ariaLabelledBy?: string

  /**
   * `aria-describedby` for the drawer surface — the id of descriptive text
   * inside `children`, announced after the name.
   */
  ariaDescribedBy?: string

  /**
   * `aria-label` fallback accessible name for the drawer surface, used when
   * there is no heading id to reference via `ariaLabelledBy`.
   */
  ariaLabel?: string

  /** Additional props */
  [key: string]: any
}

/**
 * A CSSProperties object that also permits arbitrary CSS custom properties
 * (`--drawer-*`) so caller overrides and runtime values flow through `style`
 * into the CSS module without `as any`.
 */
type DrawerCSSVars = CSSProperties & Record<`--${string}`, string | number>

// --------------------------------------------------------------------------
// SACRED BACKGROUND COMPONENT
// --------------------------------------------------------------------------

interface SacredBackgroundProps {
  width: number
  height: number
}

const SacredBackground: FC<SacredBackgroundProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Respect the user's reduced-motion preference (WCAG 2.3.3 Animation from
    // Interactions): skip the perpetual glyph animation entirely and leave the
    // canvas cleared/static rather than running requestAnimationFrame forever.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height)
      return
    }

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      glyph: string
      size: number
      opacity: number
      maxOpacity: number
    }> = []

    for (let i = 0; i < 12; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        glyph: '',
        size: 10 + Math.random() * 6,
        opacity: Math.random() * 0.15 + 0.05,
        maxOpacity: Math.random() * 0.2 + 0.1,
      })
    }

    let animationId: number
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.opacity =
          particle.maxOpacity *
          (0.5 + 0.5 * Math.sin(time * 0.001 + particle.x * 0.01))

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = '#FFD700'
        ctx.font = `${particle.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(255, 215, 0, 0.3)'
        ctx.shadowBlur = 2
        ctx.fillText(particle.glyph, particle.x, particle.y)
        ctx.restore()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate(0)

    return () => cancelAnimationFrame(animationId)
  }, [width, height])

  // Purely decorative particle layer — no information conveyed, so hide it from
  // assistive tech (WCAG 1.1.1 Non-text Content: decorative content is exempt
  // when programmatically hidden).
  return (
    <canvas
      ref={canvasRef}
      className={cssStyles.sacredCanvas}
      aria-hidden="true"
    />
  )
}

// --------------------------------------------------------------------------
// MAIN DRAWER COMPONENT
// --------------------------------------------------------------------------

const Drawer: FC<DrawerProps> = ({
  open = false,
  onClose,
  anchor = 'left',
  variant = 'temporary',
  children,
  styles = {},
  ariaLabelledBy,
  ariaDescribedBy,
  ariaLabel,
  ...other
}) => {
  // Use lazy initialization for hydration consistency
  const [isMounted] = useState(() => typeof window !== 'undefined')
  const [isVisible, setIsVisible] = useState(open)
  const [containerSize, setContainerSize] = useState({
    width: 320,
    height: 600,
  })
  const drawerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const theme = styles.theme || 'light'
  const isSacredTheme = theme === 'sacred'

  // Did the caller already supply an accessible name via the `...other`
  // passthrough (raw `aria-label` / `aria-labelledby`)? Used to avoid a false
  // "nameless dialog" dev warning when a name arrives through that channel.
  const callerProvidedName =
    other['aria-label'] != null || other['aria-labelledby'] != null

  // Track previous open state for derived state pattern
  const [prevOpen, setPrevOpen] = useState(open)

  // Handle visibility transitions using derived state pattern
  // When open changes from false to true, immediately show
  if (open && !prevOpen) {
    setPrevOpen(true)
    setIsVisible(true)
  } else if (!open && prevOpen) {
    setPrevOpen(false)
    // Don't immediately hide - let the effect below handle delayed hiding
  }

  // Handle delayed hiding for exit animation
  useEffect(() => {
    if (!open && isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open, isVisible])

  // Diagnostic bus — emit the drawer open/closed lifecycle as a
  // `component.state` transition so outcome tests can assert the drawer
  // slid in/out without scraping the DOM. Edge-triggered off `open` so it
  // fires once per transition, not on every render. Permanent drawers are
  // always open and never transition, so they emit no beacon. No-op when no
  // bus is present.
  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (variant === 'permanent') return
    if (open && !wasOpenRef.current) {
      wasOpenRef.current = true
      emitDiag({ type: 'component.state', component: 'Drawer', state: 'open' })
    } else if (!open && wasOpenRef.current) {
      wasOpenRef.current = false
      emitDiag({
        type: 'component.state',
        component: 'Drawer',
        state: 'closed',
      })
    }
  }, [open, variant])

  // Track container size for sacred background — runtime measurement, stays in JS
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer || !isSacredTheme) return

    const updateSize = () => {
      setContainerSize({
        width: drawer.offsetWidth,
        height: drawer.offsetHeight,
      })
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(drawer)
    updateSize()

    return () => resizeObserver.disconnect()
  }, [isSacredTheme])

  // Handle backdrop clicks
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && onClose) {
        onClose()
      }
    },
    [onClose]
  )

  // Handle escape key (WCAG 2.1.1 Keyboard). Closes any DISMISSIBLE drawer —
  // the modal `temporary` variant AND the non-modal `persistent` variant (both
  // expose `onClose`). `permanent` is an always-open inline panel with nothing
  // to dismiss, so it is excluded.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        open &&
        onClose &&
        variant !== 'permanent'
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, variant])

  // WCAG modal focus management (WAI-ARIA APG Dialog pattern) — TEMPORARY
  // variant only, the modal case (`aria-modal`). On open, move focus into the
  // drawer and remember the trigger; while open, Tab is trapped so focus cycles
  // within the panel (2.4.3 Focus Order); on close, restore focus to the
  // trigger. Escape is handled by the effect above (which also covers the
  // non-modal persistent variant). Persistent is non-modal and permanent is an
  // inline landmark, so neither traps focus. Mirrors the sibling Dialog
  // component's focus-trap so both overlays behave identically.
  useEffect(() => {
    if (variant !== 'temporary' || !open) return undefined
    const drawer = drawerRef.current
    if (!drawer) return undefined

    const previouslyFocused = document.activeElement as HTMLElement | null

    const getFocusable = (): HTMLElement[] =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetParent !== null)

    // Move focus into the drawer (first focusable, else the panel container,
    // which carries tabIndex={-1} to receive programmatic focus).
    const firstFocusable = getFocusable()[0]
    if (firstFocusable) firstFocusable.focus()
    else drawer.focus()

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        event.preventDefault()
        drawer.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      // Cycle only at the boundaries. Deliberately NO "active outside drawer →
      // recapture" branch: goobs overlays (SearchableSimple, Popover,
      // MultiSelect, Tooltip, …) portal their menus to document.body, so a
      // dropdown opened inside the drawer legitimately holds focus OUTSIDE
      // drawerRef — recapturing there would yank focus out of the open menu and
      // orphan it. Native Tab handles focus while a portalled descendant is
      // active.
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      // Restore focus to the element that opened the drawer.
      previouslyFocused?.focus?.()
    }
  }, [open, variant])

  // Accessible name (WCAG 4.1.2 Name, Role, Value) — every variant renders
  // `role="dialog"`, which MUST expose an accessible name. The name comes from
  // consumer content via `ariaLabelledBy` (a heading id inside `children`,
  // preferred) or the `ariaLabel` fallback; the component can't invent it. Warn
  // in development when an active drawer has neither so a nameless dialog
  // surfaces at author time instead of silently shipping to screen-reader
  // users. Dev-only — compiles out to a no-op in production bundles.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    const isActive = variant === 'permanent' || open
    if (!isActive) return
    if (!ariaLabelledBy && !ariaLabel && !callerProvidedName) {
      console.warn(
        'goobs Drawer: rendered as role="dialog" without an accessible name. ' +
          'Pass `ariaLabelledBy` (the id of a heading inside the drawer) or, as ' +
          'a fallback, `ariaLabel`, so screen readers announce it (WCAG 4.1.2).'
      )
    }
  }, [open, variant, ariaLabelledBy, ariaLabel, callerProvidedName])

  // Persistent behaves like temporary for layout; permanent is always open.
  // Use a safe initial state for SSR - always closed initially to ensure
  // hydration consistency. Permanent drawers are always open.
  const safeOpen = variant === 'permanent' ? true : isMounted ? open : false

  // Resolve effective anchor honoring force overrides (old getDrawerStyles).
  const effectiveAnchor = styles.forceLeft
    ? 'left'
    : styles.forceRight
      ? 'right'
      : anchor

  // Dynamic, caller-supplied + runtime values flow through as CSS custom
  // properties so the selectors live in CSS while scalars stay in JS.
  const paperVars: DrawerCSSVars = {}
  if (styles.width !== undefined) {
    paperVars['--drawer-width'] = styles.width
    paperVars['--drawer-width-horizontal'] = styles.width
  }
  if (styles.height !== undefined) {
    paperVars['--drawer-height'] = styles.height
    paperVars['--drawer-height-horizontal'] = styles.height
  }
  if (styles.top !== undefined) {
    paperVars['--drawer-top'] =
      typeof styles.top === 'number' ? `${styles.top}px` : styles.top
  }
  if (styles.zIndex !== undefined) {
    paperVars['--drawer-z-index'] = styles.zIndex
  }
  if (styles.disabled) {
    paperVars['--drawer-opacity'] = 0.5
    paperVars['--drawer-pointer-events'] = 'none'
  }

  // Caller theme-color overrides (mirror getDrawerTheme custom fields).
  const customBackground =
    variant === 'permanent'
      ? styles.permanentBackground
      : styles.temporaryBackground
  if (customBackground) {
    paperVars['--drawer-background'] = customBackground
  }
  const customBoxShadow =
    variant === 'permanent'
      ? styles.permanentBoxShadow
      : styles.temporaryBoxShadow
  if (customBoxShadow) {
    paperVars['--drawer-box-shadow'] = customBoxShadow
  }
  const customBackdropFilter =
    variant === 'permanent'
      ? styles.permanentBackdropFilter
      : styles.temporaryBackdropFilter
  if (customBackdropFilter) {
    paperVars['--drawer-backdrop-filter'] = customBackdropFilter
  }
  const customBackgroundImage =
    variant === 'permanent'
      ? styles.permanentBackgroundImage
      : styles.temporaryBackgroundImage
  if (customBackgroundImage !== undefined) {
    paperVars['--drawer-background-image'] = customBackgroundImage
  }
  // Transition parity with old getDrawerTheme: when a caller supplies a custom
  // transitionDuration, the old code built `transform ${duration} ${easing ||
  // 'ease-in-out'}` (property 'transform', easing default 'ease-in-out') rather
  // than the theme's default `all <duration> cubic-bezier(...)`. Feed the whole
  // string into --drawer-transition so the CSS reproduces that branch exactly,
  // including the transitionEasing override (otherwise transitionEasing would be
  // a silently-ignored prop). With no custom duration, --drawer-transition is
  // unset and the CSS var() fallback yields the theme default.
  if (styles.transitionDuration) {
    paperVars['--drawer-transition-duration'] = styles.transitionDuration
    paperVars['--drawer-transition'] =
      `transform ${styles.transitionDuration} ${styles.transitionEasing || 'ease-in-out'}`
  }

  // Box-model overrides have no token in CSS — keep them as plain inline
  // properties (these were caller-only in the old generator).
  if (styles.maxWidth !== undefined) paperVars.maxWidth = styles.maxWidth
  if (styles.minWidth !== undefined) paperVars.minWidth = styles.minWidth
  if (styles.maxHeight !== undefined) paperVars.maxHeight = styles.maxHeight
  if (styles.minHeight !== undefined) paperVars.minHeight = styles.minHeight
  if (styles.padding !== undefined) paperVars.padding = styles.padding
  if (styles.margin !== undefined) paperVars.margin = styles.margin

  // Backdrop dynamic vars
  const backdropVars: DrawerCSSVars = {}
  if (styles.backdropZIndex !== undefined) {
    backdropVars['--drawer-backdrop-z-index'] = styles.backdropZIndex
  }
  if (styles.backdropBackgroundColor) {
    backdropVars['--drawer-backdrop-background'] =
      styles.backdropBackgroundColor
  }
  if (styles.backdropBackdropFilter) {
    backdropVars['--drawer-backdrop-filter'] = styles.backdropBackdropFilter
  }

  // Don't render if not visible and temporary
  if (!isVisible && variant === 'temporary') {
    return null
  }

  const drawerContent = (
    <div
      ref={drawerRef}
      className={cssStyles.paper}
      data-component="Drawer"
      data-theme={theme}
      data-variant={variant}
      data-anchor={effectiveAnchor}
      data-open={safeOpen ? 'true' : 'false'}
      data-state={safeOpen ? 'open' : 'closed'}
      style={paperVars}
      role="dialog"
      aria-modal={variant === 'temporary' ? open : undefined}
      tabIndex={-1}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-label={!ariaLabelledBy ? ariaLabel : undefined}
      {...other}
    >
      {/* Sacred background */}
      {isSacredTheme && (
        <SacredBackground
          width={containerSize.width}
          height={containerSize.height}
        />
      )}

      {/* Content container */}
      <div className={cssStyles.content} data-theme={theme}>
        {children}
      </div>
    </div>
  )

  if (variant === 'permanent') {
    return drawerContent
  }

  return (
    <>
      {/* Backdrop */}
      {variant === 'temporary' && (
        <div
          ref={backdropRef}
          className={cssStyles.backdrop}
          data-theme={theme}
          style={backdropVars}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {drawerContent}
    </>
  )
}

Drawer.displayName = 'Drawer'
export default Drawer

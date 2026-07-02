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
  theme?: 'light' | 'dark' | 'sacred'

  // Permanent drawer styling
  permanentBackground?: string
  permanentBoxShadow?: string
  permanentBackdropFilter?: string
  permanentBackgroundImage?: string

  // Temporary drawer styling
  temporaryBackground?: string
  temporaryBoxShadow?: string
  temporaryBackdropFilter?: string
  temporaryBackgroundImage?: string

  // Backdrop styling
  backdropBackgroundColor?: string
  backdropBackdropFilter?: string

  // Layout and spacing
  width?: string
  height?: string
  top?: string | number
  padding?: string
  margin?: string
  zIndex?: number
  backdropZIndex?: number

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean

  // Dimensions
  maxWidth?: string
  minWidth?: string
  maxHeight?: string
  minHeight?: string

  // Force positioning
  forceLeft?: boolean
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

  return <canvas ref={canvasRef} className={cssStyles.sacredCanvas} />
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        open &&
        onClose &&
        variant === 'temporary'
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, variant])

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

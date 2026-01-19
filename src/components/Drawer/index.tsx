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
} from 'react'
import { getDrawerStyles, type DrawerStyles } from '../../theme'

// --------------------------------------------------------------------------
// TYPES AND INTERFACES
// --------------------------------------------------------------------------

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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        pointerEvents: 'none',
        zIndex: 0,
      }}
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

  const isSacredTheme = styles.theme === 'sacred'

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

  // Track container size for sacred background
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

  // Inject scrollbar styles
  useEffect(() => {
    const theme = styles.theme || 'sacred'
    const scrollbarId = 'drawer-scrollbar-styles'

    // Remove existing styles
    const existingStyles = document.getElementById(scrollbarId)
    if (existingStyles) {
      existingStyles.remove()
    }

    // Get scrollbar colors based on theme
    const scrollbarColors = {
      light: {
        track: '#f1f5f9',
        thumb: '#cbd5e1',
        thumbHover: '#94a3b8',
      },
      dark: {
        track: '#1e293b',
        thumb: '#475569',
        thumbHover: '#64748b',
      },
      sacred: {
        track: 'rgba(0, 0, 0, 0.3)',
        thumb: 'rgba(255, 215, 0, 0.4)',
        thumbHover: 'rgba(255, 215, 0, 0.6)',
      },
    }
    const colors = scrollbarColors[theme]

    // Create and inject CSS
    const styleElement = document.createElement('style')
    styleElement.id = scrollbarId
    styleElement.textContent = `
      .drawer-content {
        scrollbar-width: thin;
        scrollbar-color: ${colors.thumb} ${colors.track};
      }
      .drawer-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .drawer-content::-webkit-scrollbar-track {
        background: ${colors.track};
        border-radius: 4px;
      }
      .drawer-content::-webkit-scrollbar-thumb {
        background: ${colors.thumb};
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }
      .drawer-content::-webkit-scrollbar-thumb:hover {
        background: ${colors.thumbHover};
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      const styleEl = document.getElementById(scrollbarId)
      if (styleEl) {
        styleEl.remove()
      }
    }
  }, [styles.theme])

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

  // Get computed styles - map 'persistent' to 'temporary' for getDrawerStyles function
  const styleVariant = variant === 'persistent' ? 'temporary' : variant
  // Use a safe initial state for SSR - always closed initially to ensure hydration consistency
  // Permanent drawers are always open, so we don't need to handle open state for them
  const safeOpen = variant === 'permanent' ? true : isMounted ? open : false
  const computedStyles = getDrawerStyles(styles, safeOpen, anchor, styleVariant)

  // Don't render if not visible and temporary
  if (!isVisible && variant === 'temporary') {
    return null
  }

  const drawerContent = (
    <div
      ref={drawerRef}
      style={computedStyles.paper}
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
      <div
        className="drawer-content"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
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
          style={computedStyles.backdrop}
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

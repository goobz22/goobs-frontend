/**
 * @fileoverview Defines the StyledTooltip component, a customizable tooltip for displaying extra information.
 */
'use client'
import React, { useState, useRef, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Tooltip.module.css'

/**
 * Comprehensive styling options for the tooltip. Theme selects the base
 * palette ('light' default); the rest are caller overrides applied as CSS
 * custom properties, falling back to the theme value when omitted.
 */
export interface TooltipStyles {
  // Theme selection
  /** Theme variant: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Content styling
  /** Bubble background (also recolors the arrow to match). */
  backgroundColor?: string
  /** Bubble border color (rendered as a 1px solid border). */
  borderColor?: string
  /** Bubble border radius. */
  borderRadius?: string
  /** Bubble box shadow. */
  boxShadow?: string
  /** Bubble backdrop-filter. */
  backdropFilter?: string
  /** Bubble font family. */
  fontFamily?: string
  /** Bubble font size. */
  fontSize?: string
  /** Bubble font weight. */
  fontWeight?: string | number
  /** Bubble letter spacing. */
  letterSpacing?: string
  /** Bubble text color. */
  color?: string
  /** Bubble text shadow. */
  textShadow?: string
  /** Bubble padding. */
  padding?: string
  /** CSS animation shorthand on the bubble. */
  animation?: string

  // Positioning
  /** Bubble z-index — floored at 10000 so tooltips clear modals. */
  zIndex?: number
  /** Arrow border width in px (default 5; 6 on sacred). Also feeds the anchor offset math. */
  arrowSize?: number

  // Transitions
  /** With transitionEasing, replaces the opacity/transform show transition; ignored alone. */
  transitionDuration?: string
  /** With transitionDuration, replaces the opacity/transform show transition; ignored alone. */
  transitionEasing?: string
  /** Bubble scale while hidden/entering. */
  enterScale?: number
  /** Bubble scale when visible. */
  visibleScale?: number
}

export interface TooltipProps {
  children: React.ReactNode
  title: string
  tooltipplacement?: 'left' | 'right' | 'top' | 'bottom'
  offsetX?: number
  offsetY?: number
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: TooltipStyles
  arrow?: boolean
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
  enterDelay?: number
  leaveDelay?: number
  /** Render tooltip in a portal (useful for modals) */
  usePortal?: boolean
  /** Portal container (defaults to document.body) */
  portalContainer?: Element
  /** Custom arrow positioning - percentage from left/top edge (0-100) */
  arrowPosition?: number
}

/** Default arrow border width per theme (px). Matches the old theme arrow border. */
const getDefaultArrowSize = (theme: 'light' | 'dark' | 'sacred'): number =>
  theme === 'sacred' ? 6 : 5

const StyledTooltip: React.FC<TooltipProps> = ({
  children,
  title,
  tooltipplacement = 'top',
  offsetX = 0,
  offsetY = 0,
  styles,
  arrow = true,
  open: controlledOpen,
  onOpen,
  onClose,
  enterDelay = 100,
  leaveDelay = 0,
  usePortal = false,
  portalContainer,
  arrowPosition,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Stable id linking the trigger's child to the tooltip description via
  // aria-describedby (WCAG 1.3.1 / 4.1.2). Rendered on a persistent, visually
  // hidden `role="tooltip"` element so the description is available to screen
  // readers the instant the trigger is focused — independent of the animated,
  // conditionally-mounted visual bubble and its enter delay.
  const tooltipId = useId()

  const theme = styles?.theme || 'light'
  const isControlled = controlledOpen !== undefined
  const showTooltip = isControlled ? controlledOpen : isVisible

  // Arrow border width drives the JS positioning offset (arrowOffset below).
  const arrowSize = styles?.arrowSize ?? getDefaultArrowSize(theme)

  const handleMouseEnter = () => {
    if (isControlled) {
      onOpen?.()
      return
    }

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
    }

    enterTimeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      onOpen?.()
    }, enterDelay)
  }

  const handleMouseLeave = () => {
    if (isControlled) {
      onClose?.()
      return
    }

    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current)
    }

    leaveTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, leaveDelay)
  }

  // WCAG 1.4.13 (Content on Hover or Focus — Dismissable): Escape hides the
  // tooltip without moving pointer or keyboard focus, so a keyboard user can
  // clear a tooltip that obscures other content while keeping their place.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !showTooltip) return

    if (isControlled) {
      onClose?.()
      return
    }

    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    setIsVisible(false)
    onClose?.()
  }

  useEffect(() => {
    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let x = 0
      let y = 0
      const arrowOffset = arrowSize + 3

      switch (tooltipplacement) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.top - tooltipRect.height - arrowOffset
          break
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.bottom + arrowOffset
          break
        case 'left':
          x = triggerRect.left - tooltipRect.width - arrowOffset
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
        case 'right':
          x = triggerRect.right + arrowOffset
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
      }

      x += offsetX
      y += offsetY

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (x < 0) x = arrowOffset
      if (x + tooltipRect.width > viewportWidth)
        x = viewportWidth - tooltipRect.width - arrowOffset
      if (y < 0) y = arrowOffset
      if (y + tooltipRect.height > viewportHeight)
        y = viewportHeight - tooltipRect.height - arrowOffset

      setPosition({ x, y })
    }

    if (showTooltip) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [showTooltip, tooltipplacement, offsetX, offsetY, arrowSize])

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    }
  }, [])

  // Diagnostic bus — emit an open/closed state transition whenever the
  // tooltip's resolved visibility flips. Keying on `showTooltip` captures both
  // the controlled (`open` prop) and uncontrolled (hover) paths through a
  // single chokepoint. Additive: observes the existing visibility state without
  // changing any show/hide behavior. No-op when no host bus is present.
  useEffect(() => {
    emitDiag({
      type: 'component.state',
      component: 'Tooltip',
      state: showTooltip ? 'open' : 'closed',
    })
  }, [showTooltip])

  // Runtime + caller-supplied values flow into the CSS module as custom
  // properties; each override is set ONLY when the caller provided it, so the
  // CSS fallback (the theme value) applies otherwise — mirroring the old
  // `styles.x || baseTheme.x` resolution. Anchor x/y come from the measured
  // getBoundingClientRect math above and must stay in JS.
  const tooltipVars: React.CSSProperties & Record<string, string> = {
    '--tooltip-x': `${position.x}px`,
    '--tooltip-y': `${position.y}px`,
    // Ensure tooltip appears above modals (old code: max(10000, theme zIndex)).
    '--tooltip-z': String(Math.max(10000, styles?.zIndex || 9999)),
  }
  if (styles?.transitionDuration && styles?.transitionEasing) {
    tooltipVars['--tooltip-transition'] =
      `opacity ${styles.transitionDuration} ${styles.transitionEasing}, transform ${styles.transitionDuration} ${styles.transitionEasing}`
  }
  if (styles?.enterScale !== undefined)
    tooltipVars['--tooltip-enter-scale'] = String(styles.enterScale)
  if (styles?.visibleScale !== undefined)
    tooltipVars['--tooltip-visible-scale'] = String(styles.visibleScale)

  // Content-level overrides.
  if (styles?.backgroundColor) {
    tooltipVars['--tooltip-bg'] = styles.backgroundColor
    // A custom bubble background also colors the arrow, matching the old
    // getArrowStyle() which derived the arrow color from the content bg.
    tooltipVars['--tooltip-arrow-color'] = styles.backgroundColor
  }
  if (styles?.borderColor)
    tooltipVars['--tooltip-border'] = `1px solid ${styles.borderColor}`
  if (styles?.borderRadius)
    tooltipVars['--tooltip-border-radius'] = styles.borderRadius
  if (styles?.boxShadow) tooltipVars['--tooltip-box-shadow'] = styles.boxShadow
  if (styles?.backdropFilter)
    tooltipVars['--tooltip-backdrop-filter'] = styles.backdropFilter
  if (styles?.fontFamily)
    tooltipVars['--tooltip-font-family'] = styles.fontFamily
  if (styles?.fontSize) tooltipVars['--tooltip-font-size'] = styles.fontSize
  if (styles?.fontWeight !== undefined)
    tooltipVars['--tooltip-font-weight'] = String(styles.fontWeight)
  if (styles?.letterSpacing)
    tooltipVars['--tooltip-letter-spacing'] = styles.letterSpacing
  if (styles?.color) tooltipVars['--tooltip-color'] = styles.color
  if (styles?.textShadow)
    tooltipVars['--tooltip-text-shadow'] = styles.textShadow
  if (styles?.padding) tooltipVars['--tooltip-padding'] = styles.padding
  if (styles?.animation) tooltipVars['--tooltip-animation'] = styles.animation

  // Arrow sizing + custom along-edge position.
  if (styles?.arrowSize !== undefined)
    tooltipVars['--tooltip-arrow-size'] = `${styles.arrowSize}px`
  if (arrowPosition !== undefined)
    tooltipVars['--tooltip-arrow-pos'] = `${arrowPosition}%`

  const tooltipClassName = showTooltip
    ? `${cssStyles.tooltip} ${cssStyles.visible}`
    : cssStyles.tooltip

  // The animated visual bubble is a decorative duplicate of the persistent
  // `role="tooltip"` description below (which is what screen readers announce),
  // so it is hidden from assistive tech to avoid a double announcement. Its
  // data-* selectors are preserved for the machine-test contract.
  const tooltipElement = title && showTooltip && (
    <div
      ref={tooltipRef}
      className={tooltipClassName}
      data-component="Tooltip"
      data-theme={theme}
      data-placement={tooltipplacement}
      data-state="open"
      aria-hidden="true"
      style={tooltipVars}
    >
      <div className={cssStyles.content}>
        {title}
        {arrow && <div className={cssStyles.arrow} />}
      </div>
    </div>
  )

  // Inject aria-describedby onto the trigger's child so the interactive element
  // (button/link/etc.) is programmatically described by the tooltip text
  // (WCAG 1.3.1 / 4.1.2). Any caller-supplied aria-describedby is preserved.
  // When children is not a single element the association is skipped gracefully
  // — a focusable element child is required for full screen-reader support.
  const describedChildren =
    title && React.isValidElement<{ 'aria-describedby'?: string }>(children)
      ? React.cloneElement(children, {
          'aria-describedby':
            [children.props['aria-describedby'], tooltipId]
              .filter(Boolean)
              .join(' ') || undefined,
        })
      : children

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // Keyboard/AT parity with hover (WCAG 2.1.1): focus/blur bubble up from
        // the interactive child, so tabbing to it opens the tooltip just like a
        // pointer hover, and blurring closes it.
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onKeyDown={handleKeyDown}
        className={cssStyles.container}
      >
        {describedChildren}
        {/* Persistent, visually hidden description — the single element screen
            readers announce via aria-describedby. Present whenever a title is
            set (even while the visual bubble is closed), so the description is
            available immediately on focus regardless of the enter delay. */}
        {title && (
          <span id={tooltipId} role="tooltip" className={cssStyles.srDescription}>
            {title}
          </span>
        )}
      </div>

      {usePortal && typeof window !== 'undefined'
        ? createPortal(tooltipElement, portalContainer || document.body)
        : tooltipElement}
    </>
  )
}

export default StyledTooltip

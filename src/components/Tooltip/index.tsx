/**
 * @fileoverview Defines the StyledTooltip component, a customizable tooltip for displaying extra information.
 */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getTooltipStyles, type TooltipStyles } from '../../theme'

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

  const isControlled = controlledOpen !== undefined
  const showTooltip = isControlled ? controlledOpen : isVisible
  const themeStyles = getTooltipStyles(styles)

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

  useEffect(() => {
    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let x = 0
      let y = 0
      // Parse arrow size from border string (e.g., "5px solid transparent" -> 5)
      const borderValue: string =
        typeof (themeStyles.arrow.border as unknown) === 'string'
          ? (themeStyles.arrow.border as string)
          : '5px solid transparent'
      const parts = borderValue.split('px')
      const arrowSizeToken = parts[0] ?? '5'
      const parsedArrowSize = parseInt(arrowSizeToken, 10)
      const arrowSize = Number.isFinite(parsedArrowSize) ? parsedArrowSize : 5
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
  }, [
    showTooltip,
    tooltipplacement,
    offsetX,
    offsetY,
    themeStyles.arrow.border,
  ])

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    }
  }, [])

  const getArrowStyle = (): React.CSSProperties => {
    const backgroundColor = themeStyles.content.backgroundColor
    const borderString = themeStyles.content.border as string
    const borderColor =
      borderString &&
      typeof borderString === 'string' &&
      borderString.includes('rgba(255, 215, 0')
        ? '#FFD700'
        : backgroundColor

    // Extract border size from theme arrow styles
    const borderSizeMatch = (themeStyles.arrow.border as string)?.match(
      /(\d+)px/
    )
    const borderSize = borderSizeMatch ? `${borderSizeMatch[1]}px` : '5px'

    // Base arrow styles without the shorthand border property
    const baseArrowStyle: React.CSSProperties = {
      position: themeStyles.arrow.position,
      width: themeStyles.arrow.width,
      height: themeStyles.arrow.height,
      // Use individual border properties instead of shorthand
      borderWidth: borderSize,
      borderStyle: 'solid',
      borderColor: 'transparent',
    }

    // Use custom arrow position if provided, otherwise center (50%)
    const arrowPos = arrowPosition !== undefined ? `${arrowPosition}%` : '50%'

    switch (tooltipplacement) {
      case 'top':
        return {
          ...baseArrowStyle,
          top: '100%',
          left: arrowPos,
          transform: 'translateX(-50%)',
          borderTopColor: borderColor,
        }
      case 'bottom':
        return {
          ...baseArrowStyle,
          bottom: '100%',
          left: arrowPos,
          transform: 'translateX(-50%)',
          borderBottomColor: borderColor,
        }
      case 'left':
        return {
          ...baseArrowStyle,
          left: '100%',
          top: arrowPos,
          transform: 'translateY(-50%)',
          borderLeftColor: borderColor,
        }
      case 'right':
        return {
          ...baseArrowStyle,
          right: '100%',
          top: arrowPos,
          transform: 'translateY(-50%)',
          borderRightColor: borderColor,
        }
      default:
        return {}
    }
  }

  const tooltipElement = title && showTooltip && (
    <div
      ref={tooltipRef}
      style={{
        ...themeStyles.tooltip,
        ...themeStyles.tooltipVisible,
        left: `${position.x}px`,
        top: `${position.y}px`,
        // Ensure tooltip appears above modals
        zIndex: Math.max(10000, (themeStyles.tooltip.zIndex as number) || 9999),
      }}
    >
      <div style={themeStyles.content}>
        {title}
        {arrow && <div style={getArrowStyle()} />}
      </div>
    </div>
  )

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={themeStyles.container}
      >
        {children}
      </div>

      {usePortal && typeof window !== 'undefined'
        ? createPortal(tooltipElement, portalContainer || document.body)
        : tooltipElement}
    </>
  )
}

export default StyledTooltip

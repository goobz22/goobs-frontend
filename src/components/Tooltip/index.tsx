/**
 * @fileoverview Defines the StyledTooltip component, a customizable tooltip for displaying extra information.
 */
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { TooltipStyles, getTooltipStyles } from '../../theme'

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
      const borderString = themeStyles.arrow.border as string
      const arrowSize = parseInt(borderString.split('px')[0]) || 5
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

    switch (tooltipplacement) {
      case 'top':
        return {
          ...themeStyles.arrow,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: borderColor,
        }
      case 'bottom':
        return {
          ...themeStyles.arrow,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: borderColor,
        }
      case 'left':
        return {
          ...themeStyles.arrow,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: borderColor,
        }
      case 'right':
        return {
          ...themeStyles.arrow,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: borderColor,
        }
      default:
        return {}
    }
  }

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

      {title && (
        <div
          ref={tooltipRef}
          style={{
            ...themeStyles.tooltip,
            ...(showTooltip && themeStyles.tooltipVisible),
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div style={themeStyles.content}>
            {title}
            {arrow && <div style={getArrowStyle()} />}
          </div>
        </div>
      )}
    </>
  )
}

export default StyledTooltip

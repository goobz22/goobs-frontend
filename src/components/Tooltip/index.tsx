'use client'
import React, { useState, useRef, useEffect } from 'react'

export interface CustomTooltipProps {
  children: React.ReactNode
  title: string
  tooltipplacement?: 'left' | 'right' | 'top' | 'bottom'
  offsetX?: number
  offsetY?: number
  sacredtheme?: boolean
  arrow?: boolean
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
  enterDelay?: number
  leaveDelay?: number
  className?: string
  style?: React.CSSProperties
}

// Premium theme styles
const premiumStyles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  } as React.CSSProperties,

  tooltip: {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity: 0,
    transform: 'scale(0.95)',
  } as React.CSSProperties,

  tooltipVisible: {
    opacity: 1,
    transform: 'scale(1)',
  } as React.CSSProperties,

  content: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    backgroundColor: 'rgba(23, 23, 23, 0.9)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
    fontFamily: '"Inter", sans-serif',
  } as React.CSSProperties,

  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    border: '5px solid transparent',
  } as React.CSSProperties,
}

// Sacred theme styles
const sacredStyles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  } as React.CSSProperties,

  tooltip: {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: 0,
    transform: 'scale(0.9)',
  } as React.CSSProperties,

  tooltipVisible: {
    opacity: 1,
    transform: 'scale(1)',
  } as React.CSSProperties,

  content: {
    padding: '10px 16px',
    fontSize: '15px',
    borderRadius: '10px',
    boxShadow:
      '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
    position: 'relative',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    fontFamily: '"Cinzel", serif',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    animation: 'sacredTooltipGlow 3s ease-in-out infinite alternate',
  } as React.CSSProperties,

  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    border: '6px solid transparent',
  } as React.CSSProperties,
}

const StyledTooltip: React.FC<CustomTooltipProps> = ({
  children,
  title,
  tooltipplacement = 'top',
  offsetX = 0,
  offsetY = 0,
  sacredtheme = false,
  arrow = true,
  open: controlledOpen,
  onOpen,
  onClose,
  enterDelay = 100,
  leaveDelay = 0,
  className,
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isControlled = controlledOpen !== undefined
  const showTooltip = isControlled ? controlledOpen : isVisible
  const styles = sacredtheme ? sacredStyles : premiumStyles

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
      const arrowOffset = sacredtheme ? 10 : 8

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
  }, [showTooltip, tooltipplacement, offsetX, offsetY, sacredtheme])

  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredTooltipGlow {
          from {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
          }
          to {
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), 0 0 50px rgba(255, 215, 0, 0.2);
          }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    }
  }, [])

  const getArrowStyle = (): React.CSSProperties => {
    const color = sacredtheme ? '#FFD700' : 'rgba(23, 23, 23, 0.9)'
    switch (tooltipplacement) {
      case 'top':
        return {
          ...styles.arrow,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: color,
        }
      case 'bottom':
        return {
          ...styles.arrow,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: color,
        }
      case 'left':
        return {
          ...styles.arrow,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: color,
        }
      case 'right':
        return {
          ...styles.arrow,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: color,
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
        style={{ ...styles.container, ...style }}
        className={className}
      >
        {children}
      </div>

      {title && (
        <div
          ref={tooltipRef}
          style={{
            ...styles.tooltip,
            ...(showTooltip && styles.tooltipVisible),
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div style={styles.content}>
            {title}
            {arrow && <div style={getArrowStyle()} />}
          </div>
        </div>
      )}
    </>
  )
}

export default StyledTooltip

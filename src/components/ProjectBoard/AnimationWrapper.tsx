'use client'

import React, { useEffect, useState } from 'react'
import type { AnimationOrigin, ProjectBoardStyles } from './types'
import { getProjectBoardTheme } from '../../theme/projectboard'

interface AnimationWrapperProps {
  children: React.ReactNode
  origin: AnimationOrigin | null
  isVisible: boolean
  styles?: ProjectBoardStyles
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  origin,
  isVisible,
  styles,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const theme = getProjectBoardTheme(styles)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      // Mark animation as complete after duration
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 400) // Match this with CSS animation duration
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  // Calculate the transform origin and initial scale/position
  const getTransformStyles = (): React.CSSProperties => {
    if (!origin || !isAnimating) {
      return {
        transform: 'scale(1) translate(0, 0)',
        opacity: 1,
      }
    }

    // Get viewport dimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate the center of the origin element
    const originCenterX = origin.x + origin.width / 2
    const originCenterY = origin.y + origin.height / 2

    // Calculate how much we need to translate to center the origin
    const translateX = originCenterX - viewportWidth / 2
    const translateY = originCenterY - viewportHeight / 2

    // Calculate initial scale based on origin size relative to viewport
    const scaleX = origin.width / viewportWidth
    const scaleY = origin.height / viewportHeight
    const initialScale = Math.max(scaleX, scaleY, 0.1) // Minimum scale of 0.1

    return {
      transform: `scale(${initialScale}) translate(${translateX / initialScale}px, ${translateY / initialScale}px)`,
      opacity: 0.8,
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    overflow: 'hidden',
    background: theme.container.background,
    ...getTransformStyles(),
    transition: isAnimating
      ? `transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)`
      : 'none',
  }

  const contentWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    opacity: isAnimating ? 0 : 1,
    transition: isAnimating
      ? 'opacity 200ms ease-in 200ms'
      : 'opacity 200ms ease-out',
  }

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>{children}</div>
    </div>
  )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { AnimationOrigin, ProjectBoardStyles } from './types'
import cssStyles from './ProjectBoard.module.css'

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
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Old getProjectBoardTheme defaulted to 'light' (overlay background was the
  // light container background); preserve that exact default.
  const theme = styles?.theme ?? 'light'

  // Track previous isVisible to detect when it becomes true
  const [prevIsVisible, setPrevIsVisible] = useState(isVisible)
  if (isVisible !== prevIsVisible) {
    setPrevIsVisible(isVisible)
    if (isVisible) {
      // When becoming visible, start animating
      setIsAnimating(true)
    }
  }

  // Use effect only for the timer cleanup to stop animation
  useEffect(() => {
    if (isAnimating) {
      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false)
      }, 400)
      return () => {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current)
        }
      }
    }
  }, [isAnimating])

  if (!isVisible) {
    return null
  }

  // Calculate the transform origin and initial scale/position. These depend on
  // runtime viewport + origin-rect measurements, so they legitimately stay in
  // JS and are passed to CSS via custom properties.
  const getTransformValues = (): { transform: string; opacity: string } => {
    if (!origin || !isAnimating) {
      return {
        transform: 'scale(1) translate(0, 0)',
        opacity: '1',
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
      opacity: '0.8',
    }
  }

  const { transform, opacity } = getTransformValues()

  const overlayStyle: React.CSSProperties = {
    ['--pb-aw-transform']: transform,
    ['--pb-aw-opacity']: opacity,
    ['--pb-aw-transition']: isAnimating
      ? 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none',
  } as React.CSSProperties

  const contentStyle: React.CSSProperties = {
    ['--pb-aw-content-opacity']: isAnimating ? '0' : '1',
    ['--pb-aw-content-transition']: isAnimating
      ? 'opacity 200ms ease-in 200ms'
      : 'opacity 200ms ease-out',
  } as React.CSSProperties

  return (
    <div className={cssStyles.animationOverlay} data-theme={theme} style={overlayStyle}>
      <div className={cssStyles.animationContent} style={contentStyle}>
        {children}
      </div>
    </div>
  )
}

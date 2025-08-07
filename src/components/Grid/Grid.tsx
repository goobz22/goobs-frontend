'use client'

import React, { useState, useEffect } from 'react'

export interface ResponsiveSize {
  xs?: number | 'auto'
  sm?: number | 'auto'
  md?: number | 'auto'
  lg?: number | 'auto'
  xl?: number | 'auto'
}

export interface GridProps {
  container?: boolean
  size?: number | 'auto' | ResponsiveSize
  spacing?: number
  children: React.ReactNode
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  styles?: {
    theme?: 'sacred' | 'default'
    [key: string]: any
  }
}

const Grid: React.FC<GridProps> = ({
  container = false,
  size,
  spacing = 0,
  children,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  direction = 'row',
  styles = {},
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<keyof ResponsiveSize>('xl')
  const { ...customStyles } = styles

  // Breakpoint detection
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < 600) {
        setCurrentBreakpoint('xs')
      } else if (width < 900) {
        setCurrentBreakpoint('sm')
      } else if (width < 1200) {
        setCurrentBreakpoint('md')
      } else if (width < 1536) {
        setCurrentBreakpoint('lg')
      } else {
        setCurrentBreakpoint('xl')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  // Get current size based on breakpoint
  const getCurrentSize = (): number | 'auto' => {
    if (typeof size === 'object' && size !== null) {
      const responsiveSize = size as ResponsiveSize
      return (
        responsiveSize[currentBreakpoint] ||
        responsiveSize.lg ||
        responsiveSize.md ||
        responsiveSize.sm ||
        responsiveSize.xs ||
        12
      )
    }
    return size || 12
  }

  const currentSize = getCurrentSize()

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    flexWrap: 'wrap',
    justifyContent,
    alignItems,
    gap: `${spacing * 8}px`,
    width: '100%',
    ...customStyles,
  }

  const itemStyles: React.CSSProperties = {
    flex:
      currentSize === 'auto'
        ? '1 1 auto'
        : `0 0 ${(Number(currentSize) / 12) * 100}%`,
    maxWidth:
      currentSize === 'auto' ? '100%' : `${(Number(currentSize) / 12) * 100}%`,
    ...customStyles,
  }

  if (container) {
    return <div style={containerStyles}>{children}</div>
  }

  return <div style={itemStyles}>{children}</div>
}

export default Grid

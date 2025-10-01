'use client'

import React, { useEffect, useState, useMemo, memo } from 'react'
import MetricCard from '../MetricCard'
import { MetricCardData } from '../types'
import type { DataGridStyles } from '../../../theme'
import Accordion from '../../Accordion'

interface MetricSectionProps {
  metrics: MetricCardData[]
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
  /** Force the metrics to be collapsible regardless of screen size */
  collapsible?: boolean
  /** Default expanded state when collapsible is true */
  defaultExpanded?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    width: '100%',
    marginBottom: '0',
    padding: '1rem',
    boxSizing: 'border-box',
    overflow: 'visible',
  } as React.CSSProperties,

  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'flex-start',
    width: '100%',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
    overflow: 'visible',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    marginBottom: '0',
    padding: '1rem',
    boxSizing: 'border-box',
    overflow: 'visible',
  } as React.CSSProperties,

  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'flex-start',
    width: '100%',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
    overflow: 'visible',
  } as React.CSSProperties,
}

// Hook to detect screen size for responsive behavior
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  )

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const newSize =
        width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
      setScreenSize(prevSize => (prevSize !== newSize ? newSize : prevSize))
    }

    // Check on mount
    checkScreenSize()

    // Debounce resize events to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout
    const debouncedCheckScreenSize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkScreenSize, 150)
    }

    // Add event listener
    window.addEventListener('resize', debouncedCheckScreenSize)

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedCheckScreenSize)
    }
  }, [])

  return screenSize
}

const MetricSection: React.FC<MetricSectionProps> = memo(
  ({ metrics, styles, collapsible = false, defaultExpanded = false }) => {
    const isSacredTheme = styles?.theme === 'sacred'
    const componentStyles = isSacredTheme ? sacredStyles : premiumStyles
    const screenSize = useScreenSize()

    // Since we can't use media queries in inline styles, we'll use a responsive approach
    // that works with flexbox and natural wrapping behavior
    const getResponsiveCardStyle = useMemo((): React.CSSProperties => {
      return {
        flex: '0 0 auto',
        boxSizing: 'border-box',
      }
    }, [])

    // Render metrics content - memoized to prevent unnecessary re-renders
    const metricsContent = useMemo(
      () => (
        <div style={componentStyles.flexContainer}>
          {metrics.map((metric, index) => {
            // Build props object with only defined properties
            const cardProps: any = {
              title: metric.title,
              value: metric.value,
            }
            if (metric.subtitle !== undefined)
              cardProps.subtitle = metric.subtitle
            if (metric.icon !== undefined) cardProps.icon = metric.icon
            if (metric.trend !== undefined) cardProps.trend = metric.trend
            if (metric.glyph !== undefined) cardProps.glyph = metric.glyph
            if (styles !== undefined) cardProps.styles = styles

            return (
              <div
                key={`${metric.title}-${index}`}
                style={getResponsiveCardStyle}
              >
                <MetricCard {...cardProps} />
              </div>
            )
          })}
        </div>
      ),
      [metrics, componentStyles.flexContainer, getResponsiveCardStyle, styles]
    )

    // If collapsible prop is true, always use accordion; otherwise use original tablet logic
    if (collapsible || screenSize === 'tablet') {
      return (
        <div style={componentStyles.container}>
          <Accordion
            summary="Metrics"
            details={metricsContent}
            defaultExpanded={collapsible ? defaultExpanded : false}
            styles={{
              theme: styles?.theme || 'sacred',
            }}
          />
        </div>
      )
    }

    // Desktop and mobile - show expanded (when not collapsible)
    return <div style={componentStyles.container}>{metricsContent}</div>
  }
)

MetricSection.displayName = 'MetricSection'

export default MetricSection

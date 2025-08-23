'use client'

import React, { useEffect, useState } from 'react'
import MetricCard from '../MetricCard'
import { MetricCardData } from '../types'
import type { DataGridStyles } from '../../../theme'
import Accordion from '../../Accordion'

interface MetricSectionProps {
  metrics: MetricCardData[]
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    marginBottom: '0',
    padding: '1rem',
    boxSizing: 'border-box',
    overflow: 'hidden',
  } as React.CSSProperties,

  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    marginBottom: '0',
    padding: '1rem',
    boxSizing: 'border-box',
    overflow: 'hidden',
  } as React.CSSProperties,

  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
  } as React.CSSProperties,
}

// Hook to detect screen size for responsive behavior
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  )

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile')
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    // Check on mount
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

const MetricSection: React.FC<MetricSectionProps> = ({ metrics, styles }) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const componentStyles = isSacredTheme ? sacredStyles : premiumStyles
  const screenSize = useScreenSize()

  // Since we can't use media queries in inline styles, we'll use a responsive approach
  // that works with flexbox and natural wrapping behavior
  const getResponsiveCardStyle = (): React.CSSProperties => {
    return {
      flex: '1 1 0',
      minWidth: '250px',
      maxWidth: '350px',
      boxSizing: 'border-box',
    }
  }

  // Render metrics content
  const metricsContent = (
    <div style={componentStyles.flexContainer}>
      {metrics.map((metric, index) => (
        <div key={`${metric.title}-${index}`} style={getResponsiveCardStyle()}>
          <MetricCard
            title={metric.title}
            value={metric.value}
            {...(metric.subtitle !== undefined
              ? { subtitle: metric.subtitle }
              : {})}
            {...(metric.icon !== undefined ? { icon: metric.icon } : {})}
            {...(metric.trend !== undefined ? { trend: metric.trend } : {})}
            {...(metric.glyph !== undefined ? { glyph: metric.glyph } : {})}
            {...(styles !== undefined ? { styles } : {})}
          />
        </div>
      ))}
    </div>
  )

  // On tablet, wrap in accordion; on desktop, show expanded
  if (screenSize === 'tablet') {
    return (
      <div style={componentStyles.container}>
        <Accordion
          summary="Metrics"
          details={metricsContent}
          defaultExpanded={false}
          styles={{
            theme: styles?.theme || 'sacred',
          }}
        />
      </div>
    )
  }

  // Desktop and mobile - show expanded
  return <div style={componentStyles.container}>{metricsContent}</div>
}

export default MetricSection

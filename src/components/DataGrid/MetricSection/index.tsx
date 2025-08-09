'use client'

import React from 'react'
import MetricCard from '../MetricCard'
import { MetricCardData } from '../types'
import type { DataGridStyles } from '../../../theme'

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

const MetricSection: React.FC<MetricSectionProps> = ({ metrics, styles }) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const componentStyles = isSacredTheme ? sacredStyles : premiumStyles

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

  return (
    <div style={componentStyles.container}>
      <div style={componentStyles.flexContainer}>
        {metrics.map((metric, index) => (
          <div
            key={`${metric.title}-${index}`}
            style={getResponsiveCardStyle()}
          >
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
    </div>
  )
}

export default MetricSection

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
    marginBottom: '8px',
    padding: '4px',
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gap: '8px',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    marginBottom: '8px',
    padding: '4px',
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gap: '8px',
  } as React.CSSProperties,
}

const MetricSection: React.FC<MetricSectionProps> = ({ metrics, styles }) => {
  const isSacredTheme = styles?.theme === 'sacred'

  const getGridColumns = () => {
    switch (metrics.length) {
      case 1:
        return { gridTemplateColumns: '1fr' }
      case 2:
        return {
          gridTemplateColumns: '1fr',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        }
      case 3:
        return {
          gridTemplateColumns: '1fr',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
        }
      default:
        return {
          gridTemplateColumns: '1fr',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          },
        }
    }
  }

  const componentStyles = isSacredTheme ? sacredStyles : premiumStyles

  const gridStyle = {
    ...componentStyles.grid,
    ...getGridColumns(),
  }

  return (
    <div style={componentStyles.container}>
      <div style={gridStyle}>
        {metrics.map((metric, index) => (
          <div key={`${metric.title}-${index}`}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              trend={metric.trend}
              glyph={metric.glyph}
              styles={styles}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MetricSection

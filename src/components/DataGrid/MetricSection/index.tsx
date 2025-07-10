'use client'

import React from 'react'
import MetricCard from '../MetricCard'
import { MetricCardData } from '../types'

interface MetricSectionProps {
  metrics: MetricCardData[]
  sacredtheme?: boolean
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

const MetricSection: React.FC<MetricSectionProps> = ({
  metrics,
  sacredtheme = false,
}) => {
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

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const gridStyle = {
    ...styles.grid,
    ...getGridColumns(),
  }

  return (
    <div style={styles.container}>
      <div style={gridStyle}>
        {metrics.map((metric, index) => (
          <div key={`${metric.title}-${index}`}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              trend={metric.trend}
              color={metric.color}
              glyph={metric.glyph}
              sacredtheme={sacredtheme}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MetricSection

'use client'

import React from 'react'
import { Box, Grid, useMediaQuery } from '@mui/material'
import MetricCard from '../MetricCard'
import { MetricCardData } from '../types'

interface MetricSectionProps {
  metrics: MetricCardData[]
  sacredtheme?: boolean
}

const MetricSection: React.FC<MetricSectionProps> = ({
  metrics,
  sacredtheme = false,
}) => {
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')

  // Determine grid sizing based on screen size and number of metrics
  const getGridSize = () => {
    if (isMobile) {
      return 12 // Full width on mobile
    }

    if (isTablet) {
      return metrics.length === 1 ? 12 : 6 // 1 or 2 per row on tablet
    }

    // Desktop: distribute evenly up to 4 per row
    if (metrics.length === 1) return 12
    if (metrics.length === 2) return 6
    if (metrics.length === 3) return 4
    return 3 // 4 per row for 4+ metrics
  }

  const gridSize = getGridSize()

  return (
    <Box
      sx={{
        width: '100%',
        mb: 2,
        p: 1,
      }}
    >
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid
            key={`${metric.title}-${index}`}
            size={{ xs: isMobile ? 12 : gridSize }}
          >
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
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MetricSection

'use client'

import React from 'react'
import { Box, Grid, useMediaQuery, keyframes, alpha } from '@mui/material'
import SearchableDropdown from '../../Field/Dropdown/Searchable'
import { DataGridFilter } from '../types'

// Sacred theming animations
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
`

const sacredFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

// Sacred hieroglyphs for decoration
const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

export interface FilterSectionProps {
  filters: DataGridFilter[]
  sacredtheme?: boolean
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  sacredtheme = false,
}) => {
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:900px)')

  if (!filters || filters.length === 0) {
    return null
  }

  // Determine grid size based on screen size and number of filters
  const getGridSize = () => {
    if (isMobile) {
      return 12 // Full width on mobile
    }
    if (isTablet) {
      return filters.length === 1 ? 6 : 12 / Math.min(filters.length, 2) // Max 2 per row on tablet
    }
    // Desktop - up to 4 filters per row, but scale based on count
    if (filters.length === 1) return 3
    if (filters.length === 2) return 6
    if (filters.length === 3) return 4
    return 3 // 4 filters per row max
  }

  const gridSize = getGridSize()

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        p: sacredtheme ? 1 : 0.5,
        ...(sacredtheme && {
          backgroundColor: alpha('#000000', 0.6),
          borderRadius: '8px',
          border: `1px solid ${alpha('#FFD700', 0.3)}`,
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at top left, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
          `,
          animation: `${sacredGlow} 3s ease-in-out infinite`,
          '&::before': {
            content: '"𓊹"',
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '14px',
            color: alpha('#FFD700', 0.4),
            animation: `${rotateGlyph} 15s linear infinite`,
            zIndex: 1,
          },
        }),
      }}
    >
      {/* Sacred decorative glyphs */}
      {sacredtheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              color: alpha('#FFD700', 0.3),
              fontSize: '12px',
              animation: `${sacredFloat} 4s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[15]} {/* Filter/sieve symbol */}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              color: alpha('#FFD700', 0.3),
              fontSize: '12px',
              animation: `${sacredFloat} 3s ease-in-out infinite reverse`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[16]} {/* Filter/refine symbol */}
          </Box>
        </>
      )}

      <Grid container spacing={1}>
        {filters.map((filter, index) => (
          <Grid
            key={`${filter.label}-${index}`}
            size={{ xs: isMobile ? 12 : gridSize }}
          >
            <SearchableDropdown
              label={filter.label}
              options={filter.options}
              defaultValue={filter.value === 'all' ? '' : filter.value}
              onChange={filter.onChange}
              placeholder={filter.placeholder}
              width={filter.width || '100%'}
              variant="simple"
              sacredtheme={sacredtheme}
              sacredTitle={sacredtheme ? 'Divine Filtering' : ''}
              sacredSubtitle={sacredtheme ? 'Channel cosmic data streams' : ''}
              style={{
                marginBottom: '8px',
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Bottom sacred decoration */}
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
            opacity: 0.5,
          }}
        >
          {['𓊖', '𓊗', '𓊖'].map((glyph, i) => (
            <Box
              key={i}
              sx={{
                color: alpha('#FFD700', 0.4),
                fontSize: 8,
                animation: `${sacredFloat} ${2 + i * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default FilterSection

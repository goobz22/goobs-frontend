'use client'

import React, { useState, useEffect } from 'react'
import SearchableDropdown from '../../Field/Dropdown/Searchable'
import DateField from '../../Field/Date/DateField'
import DateRange from '../../Field/Date/DateRange'
import { DataGridFilter } from '../types'
import type { DataGridStyles } from '../../../theme'
import { SACRED_GLYPHS } from '../../../theme'

export interface FilterSectionProps {
  filters: DataGridFilter[]
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, styles }) => {
  const [width] = useWindowSize()
  const isMobile = width < 600
  const isTablet = width < 900
  const isSacredTheme = styles?.theme === 'sacred'

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
        }
        @keyframes glyphRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sacredFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-3px) scale(1.05); opacity: 0.8; }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [isSacredTheme])

  if (!filters || filters.length === 0) {
    return null
  }

  // Determine grid columns based on screen size and number of filters
  const getGridColumns = () => {
    if (isMobile) return { gridTemplateColumns: '1fr' }
    if (isTablet)
      return filters.length === 1
        ? { gridTemplateColumns: 'repeat(2, 1fr)' }
        : { gridTemplateColumns: '1fr' }
    // Desktop
    if (filters.length === 1) return { gridTemplateColumns: 'repeat(4, 1fr)' }
    if (filters.length === 2) return { gridTemplateColumns: 'repeat(2, 1fr)' }
    if (filters.length === 3) return { gridTemplateColumns: 'repeat(3, 1fr)' }
    return { gridTemplateColumns: 'repeat(4, 1fr)' }
  }

  // Helper function to render the appropriate filter component
  const renderFilterComponent = (filter: DataGridFilter) => {
    // Check if this is a date range filter
    if (filter.type === 'daterange') {
      return (
        <DateRange
          startLabel="From Date"
          endLabel="To Date"
          value={filter.value as { start: Date | null; end: Date | null }}
          onChange={
            filter.onChange as (value: {
              start: Date | null
              end: Date | null
            }) => void
          }
          styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
        />
      )
    }

    // Check if this is a date filter
    if (filter.type === 'date') {
      return (
        <DateField
          label={filter.label}
          value={
            (filter.value as string) ? new Date(filter.value as string) : null
          }
          onChange={filter.onChange as (date: Date | null) => void}
          placeholder={filter.placeholder}
          styles={{
            theme: isSacredTheme ? 'sacred' : 'light',
          }}
          disableFutureDateValidation={true}
        />
      )
    }

    // Default to SearchableDropdown for regular filters
    return (
      <div style={{ width: filter.width || '100%' }}>
        <SearchableDropdown
          label={filter.label}
          options={filter.options || []}
          defaultValue={filter.value === 'all' ? '' : (filter.value as string)}
          onChange={
            filter.onChange as (value: { value: string } | null) => void
          }
          placeholder={filter.placeholder}
          styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
        />
      </div>
    )
  }

  const filterSectionStyle = {
    width: '100%',
    position: 'relative' as const,
    padding: isSacredTheme ? '4px' : '2px',
    ...(isSacredTheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      backgroundImage:
        'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, transparent 100%)',
      animation: 'sacredGlow 3s ease-in-out infinite',
    }),
  }

  const gridStyle = {
    display: 'grid',
    gap: '4px',
    ...getGridColumns(),
  }

  return (
    <div style={filterSectionStyle}>
      {/* Sacred decorative glyphs */}
      {isSacredTheme && (
        <>
          <div
            style={{
              position: 'absolute',
              fontSize: '12px',
              color: 'rgba(255, 215, 0, 0.3)',
              animation: 'sacredFloat 2s ease-in-out infinite',
              zIndex: 10,
              top: '8px',
              left: '8px',
            }}
          >
            {SACRED_GLYPHS[15]} {/* Filter/sieve symbol */}
          </div>
          <div
            style={{
              position: 'absolute',
              fontSize: '12px',
              color: 'rgba(255, 215, 0, 0.3)',
              animation: 'sacredFloat 2s ease-in-out infinite',
              zIndex: 10,
              bottom: '8px',
              right: '8px',
              animationDirection: 'reverse',
            }}
          >
            {SACRED_GLYPHS[16]} {/* Filter/refine symbol */}
          </div>
        </>
      )}

      <div style={gridStyle}>
        {filters.map((filter, index) => (
          <div
            key={`${filter.label}-${index}`}
            style={{
              ...(filter.type === 'daterange' && !isMobile
                ? { gridColumn: 'span 2' }
                : {}),
            }}
          >
            {renderFilterComponent(filter)}
          </div>
        ))}
      </div>

      {/* Bottom sacred decoration */}
      {isSacredTheme && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '2px',
            opacity: 0.5,
          }}
        >
          {[SACRED_GLYPHS[4], SACRED_GLYPHS[5], SACRED_GLYPHS[4]].map(
            (glyph, i) => (
              <div
                key={i}
                style={{
                  color: 'rgba(255, 215, 0, 0.4)',
                  fontSize: '8px',
                  animation: `sacredFloat ${2 + i * 0.3}s ease-in-out infinite`,
                }}
              >
                {glyph}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default FilterSection

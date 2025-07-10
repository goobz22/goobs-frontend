'use client'

import React, { useState, useEffect } from 'react'
import SearchableDropdown from '../../Field/Dropdown/Searchable'
import DateField from '../../Field/Date/DateField'
import DateRange from '../../Field/Date/DateRange'
import { DataGridFilter } from '../types'

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

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    width: '100%',
    position: 'relative',
    padding: '2px',
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gap: '4px',
  } as React.CSSProperties,

  filterItem: {
    marginBottom: '8px',
    width: '100%',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    position: 'relative',
    padding: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    backgroundImage:
      'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, transparent 100%)',
    animation: 'sacredGlow 3s ease-in-out infinite',
    '&::before': {
      content: '"𓊹"',
      position: 'absolute',
      top: '8px',
      right: '12px',
      fontSize: '14px',
      color: 'rgba(255, 215, 0, 0.4)',
      animation: 'glyphRotate 20s linear infinite',
      zIndex: 10,
    },
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gap: '4px',
  } as React.CSSProperties,

  filterItem: {
    marginBottom: '8px',
    width: '100%',
  } as React.CSSProperties,

  decorativeGlyph: {
    position: 'absolute',
    fontSize: '12px',
    color: 'rgba(255, 215, 0, 0.3)',
    animation: 'sacredFloat 2s ease-in-out infinite',
    zIndex: 10,
  } as React.CSSProperties,

  topLeftGlyph: {
    top: '8px',
    left: '8px',
  } as React.CSSProperties,

  bottomRightGlyph: {
    bottom: '8px',
    right: '8px',
    animationDirection: 'reverse',
  } as React.CSSProperties,

  bottomDecoration: {
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '2px',
    opacity: 0.5,
  } as React.CSSProperties,

  bottomGlyph: {
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '8px',
  } as React.CSSProperties,
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

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  sacredtheme = false,
}) => {
  const [width] = useWindowSize()
  const isMobile = width < 600
  const isTablet = width < 900

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
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
  }, [sacredtheme])

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
    const styles = sacredtheme ? sacredStyles : premiumStyles

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
          sacredtheme={sacredtheme}
          style={{
            ...styles.filterItem,
            width: filter.width || '100%',
          }}
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
          sacredtheme={sacredtheme}
          disableFutureDateValidation={true}
          style={{
            ...styles.filterItem,
            width: filter.width || '100%',
          }}
        />
      )
    }

    // Default to SearchableDropdown for regular filters
    return (
      <SearchableDropdown
        label={filter.label}
        options={filter.options || []}
        defaultValue={filter.value === 'all' ? '' : (filter.value as string)}
        onChange={filter.onChange as (value: { value: string } | null) => void}
        placeholder={filter.placeholder}
        width={filter.width || '100%'}
        sacredtheme={sacredtheme}
        style={styles.filterItem}
      />
    )
  }

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const gridStyle = {
    ...styles.grid,
    ...getGridColumns(),
  }

  return (
    <div style={styles.container}>
      {/* Sacred decorative glyphs */}
      {sacredtheme && (
        <>
          <div
            style={{
              ...sacredStyles.decorativeGlyph,
              ...sacredStyles.topLeftGlyph,
            }}
          >
            {SACRED_GLYPHS[15]} {/* Filter/sieve symbol */}
          </div>
          <div
            style={{
              ...sacredStyles.decorativeGlyph,
              ...sacredStyles.bottomRightGlyph,
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
      {sacredtheme && (
        <div style={sacredStyles.bottomDecoration}>
          {['𓊖', '𓊗', '𓊖'].map((glyph, i) => (
            <div
              key={i}
              style={{
                ...sacredStyles.bottomGlyph,
                animation: `sacredFloat ${2 + i * 0.3}s ease-in-out infinite`,
              }}
            >
              {glyph}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterSection

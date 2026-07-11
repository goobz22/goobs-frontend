'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Accordion from '../Accordion'
import SearchableSimple, {
  type DropdownOption,
} from '../Field/Dropdown/SearchableSimple'
import Chip from '../Chip'
import Typography from '../Typography'
import DateRange from '../Field/Date/DateRange'
import * as Icons from '../Icons'
import type { FieldStyleOverrides } from '../Field/Shell/types'

const { FilterListIcon, CloseIcon } = Icons

/**
 * Client-side event filters applied by BigCalendar. All set criteria AND
 * together; an unset or empty criterion is ignored.
 */
export interface CalendarFilterOptions {
  /** Case-insensitive substring match against event title, description, and resource. */
  searchText?: string
  /** Keep events whose `type` is in this list. */
  eventTypes?: string[]
  /** Bounds on the event START date; each bound is optional. */
  dateRange?: {
    /** Inclusive lower bound on the event start date. */
    start?: Date | null
    /** Upper bound on the event start date, inclusive through the end of that day. */
    end?: Date | null
  }
  /** Keep events whose `resource` is in this list. */
  resources?: string[]
  /** Keep events whose `metadata.tags` contains at least one of these tags. */
  tags?: string[]
  /** Keep events whose `metadata.status` is in this list. */
  status?: string[]
  /** Per-`metadata`-key equality filters (an array value means "one of"); empty/null values are skipped. */
  customFilters?: Record<string, any>
}

interface CalendarFiltersProps {
  filters: CalendarFilterOptions
  onFiltersChange: (filters: CalendarFilterOptions) => void
  availableResources?: { id: string; title: string }[]
  cities?: string[]
  propertyTypes?: string[]
  bedroomOptions?: Array<string | number>
  priceRanges?: string[]
  // Remove external custom components; inline standardized dropdowns instead
  expanded?: boolean
  styles?: FieldStyleOverrides
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFiltersChange,
  availableResources = [],
  cities = [],
  propertyTypes = [],
  bedroomOptions = [],
  priceRanges = [],
  expanded = true,
  styles,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const theme = styles?.theme ?? 'sacred'

  // search removed

  const handleDateRangeChange = useCallback(
    (range: { start: Date | null; end: Date | null }) => {
      onFiltersChange({
        ...filters,
        dateRange: {
          start: range.start ?? null,
          end: range.end ?? null,
        },
      })
    },
    [filters, onFiltersChange]
  )

  // tag toggle replaced by dropdown

  const clearAllFilters = useCallback(() => {
    onFiltersChange({})
  }, [onFiltersChange])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.searchText) count++
    // Removed event types filter
    if (filters.dateRange?.start || filters.dateRange?.end) count++
    if (filters.resources?.length) count++
    if (filters.tags?.length) count++
    if (filters.customFilters && Object.keys(filters.customFilters).length)
      count++
    return count
  }, [filters])

  const accordionSummary = useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
        }}
      >
        <FilterListIcon
          styles={{ theme: styles?.theme ?? 'sacred' }}
          aria-hidden="true"
        />
        <Typography
          styles={{
            theme,
            fontSize: '1rem',
            fontWeight: 600,
            ...(theme === 'sacred'
              ? {
                  variant: 'cinzelh5',
                  color: '#FFD700',
                  textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
                }
              : {}),
          }}
        >
          Filters
        </Typography>
        {activeFilterCount > 0 && (
          <Chip
            label={`${activeFilterCount} active`}
            styles={{
              theme: styles?.theme || 'sacred',
              color: styles?.theme === 'sacred' ? '#FFD700' : '#3b82f6',
            }}
          />
        )}
        <div style={{ flexGrow: 1 }} />
        {activeFilterCount > 0 && (
          <button
            type="button"
            aria-label="Clear all filters"
            onClick={e => {
              e.stopPropagation()
              clearAllFilters()
            }}
            style={{
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              border: 'none',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                styles?.theme === 'sacred'
                  ? 'rgba(255, 215, 0, 0.1)'
                  : 'rgba(0, 0, 0, 0.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <CloseIcon
              styles={{ theme: styles?.theme ?? 'sacred', size: 16 }}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    ),
    [activeFilterCount, styles, theme, clearAllFilters]
  )

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  }

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  // removed chip container

  return (
    <Accordion
      summary={accordionSummary}
      expanded={isExpanded}
      onChange={(_, expanded) => {
        setIsExpanded(expanded)
      }}
      styles={{
        theme,
        marginBottom: '16px',
        ...(theme === 'sacred'
          ? {
              summaryColor: '#FFD700',
              summaryTextShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
            }
          : {}),
      }}
      details={
        <div style={containerStyle}>
          {/* Removed global search */}

          {/* Date Range */}
          <DateRange
            value={{
              start: filters.dateRange?.start || null,
              end: filters.dateRange?.end || null,
            }}
            onChange={handleDateRangeChange}
            startLabel="Start Date"
            endLabel="End Date"
            disableFutureDateValidation
            {...(styles ? { styles } : {})}
          />

          {/* Two-row grid of dropdowns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {(cities.length > 0 || availableResources.length > 0) && (
              <div style={sectionStyle}>
                <SearchableSimple
                  label="City"
                  options={
                    cities.length > 0
                      ? cities.map<DropdownOption>(c => ({ value: c }))
                      : availableResources.map<DropdownOption>(r => ({
                          value: r.title,
                          _id: r.id,
                        }))
                  }
                  {...(() => {
                    const defCity = filters.customFilters?.city as
                      | string
                      | undefined
                    if (defCity) return { defaultValue: defCity }
                    const resId = (filters.resources || [])[0]
                    const found = availableResources.find(r => r.id === resId)
                    return found?.title ? { defaultValue: found.title } : {}
                  })()}
                  onChange={opt => {
                    if (cities.length > 0) {
                      onFiltersChange({
                        ...filters,
                        customFilters: {
                          ...filters.customFilters,
                          city: opt?.value || '',
                        },
                      })
                    } else {
                      onFiltersChange({
                        ...filters,
                        resources: opt?.value
                          ? [String(opt._id || opt.value)]
                          : [],
                      })
                    }
                  }}
                  styles={{ theme: styles?.theme ?? 'sacred' }}
                />
              </div>
            )}
            {/* Status removed */}
            {propertyTypes.length > 0 && (
              <div style={sectionStyle}>
                <SearchableSimple
                  label="Property Type"
                  options={propertyTypes.map<DropdownOption>(t => ({
                    value: t,
                  }))}
                  {...(() => {
                    const def = filters.customFilters?.propertyType as
                      | string
                      | undefined
                    return def ? { defaultValue: def } : {}
                  })()}
                  onChange={opt =>
                    onFiltersChange({
                      ...filters,
                      customFilters: {
                        ...filters.customFilters,
                        propertyType: opt?.value || '',
                      },
                    })
                  }
                  styles={{ theme: styles?.theme ?? 'sacred' }}
                />
              </div>
            )}
            {bedroomOptions.length > 0 && (
              <div style={sectionStyle}>
                <SearchableSimple
                  label="Bedrooms"
                  options={bedroomOptions.map<DropdownOption>(b => ({
                    value: String(b),
                  }))}
                  {...(() => {
                    const def = filters.customFilters?.bedrooms as
                      | string
                      | undefined
                    return def ? { defaultValue: def } : {}
                  })()}
                  onChange={opt =>
                    onFiltersChange({
                      ...filters,
                      customFilters: {
                        ...filters.customFilters,
                        bedrooms: opt?.value || '',
                      },
                    })
                  }
                  styles={{ theme: styles?.theme ?? 'sacred' }}
                />
              </div>
            )}
            {priceRanges.length > 0 && (
              <div style={sectionStyle}>
                <SearchableSimple
                  label="Price Range"
                  options={priceRanges.map<DropdownOption>(p => ({ value: p }))}
                  {...(() => {
                    const def = filters.customFilters?.priceRange as
                      | string
                      | undefined
                    return def ? { defaultValue: def } : {}
                  })()}
                  onChange={opt =>
                    onFiltersChange({
                      ...filters,
                      customFilters: {
                        ...filters.customFilters,
                        priceRange: opt?.value || '',
                      },
                    })
                  }
                  styles={{ theme: styles?.theme ?? 'sacred' }}
                />
              </div>
            )}
            {/* Fourth slot reserved for future standardized dropdown */}
            <div />
          </div>

          {/* Tags handled above */}

          {/* Status handled above */}

          {/* External custom components removed in favor of standardized inline dropdowns */}
        </div>
      }
    />
  )
}

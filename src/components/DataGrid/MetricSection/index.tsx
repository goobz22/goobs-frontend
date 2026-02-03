/**
 * =============================================================================
 * METRIC SECTION COMPONENT
 * =============================================================================
 *
 * Container component for displaying KPI cards above the DataGrid table.
 * Renders an array of MetricCard components in a responsive flex layout.
 *
 * FEATURES:
 * - Responsive layout that wraps on smaller screens
 * - Optional collapsible mode (accordion)
 * - Automatic collapsible on tablet screen sizes
 * - Theme support (sacred/light)
 * - Memoized for performance
 *
 * LAYOUT:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
 * │ │   Metric    │ │   Metric    │ │   Metric    │ │   Metric    │       │
 * │ │   Card 1    │ │   Card 2    │ │   Card 3    │ │   Card 4    │       │
 * │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * RESPONSIVE BEHAVIOR:
 * - Desktop: All cards in a row (flexbox wrap)
 * - Tablet: Collapses into accordion by default
 * - Mobile: Stacked layout
 *
 * COLLAPSIBLE MODE:
 * - When collapsible=true: Always wraps in Accordion
 * - When screen is tablet size: Automatically uses Accordion
 * - Accordion summary shows "Metrics"
 *
 * USAGE:
 * ```tsx
 * <MetricSection
 *   metrics={[
 *     { title: 'Revenue', value: '$125K', trend: { value: 12, isPositive: true } },
 *     { title: 'Users', value: '1,234', subtitle: 'Active' }
 *   ]}
 *   collapsible={true}
 *   defaultExpanded={false}
 *   styles={{ theme: 'sacred' }}
 * />
 * ```
 *
 * =============================================================================
 */

'use client'

import React, { useEffect, useState, useMemo, memo } from 'react'
import MetricCard from '../MetricCard'
import { MetricCardData } from '../types'
import type { DataGridStyles } from '../../../theme'
import Accordion from '../../Accordion'

/**
 * Props for the MetricSection component.
 */
interface MetricSectionProps {
  /** Array of metric data to display as cards */
  metrics: MetricCardData[]
  /** Theme and style configuration */
  styles?: DataGridStyles
  /** Force collapsible mode regardless of screen size */
  collapsible?: boolean
  /** If collapsible, whether to start expanded. Default: false */
  defaultExpanded?: boolean
}

// =============================================================================
// THEME STYLES
// =============================================================================
// Styles are organized by theme for easy maintenance.
// Currently both themes use the same layout styles.

/**
 * Styles for light/premium theme.
 */
const premiumStyles = {
  /** Outer container with padding */
  container: {
    width: '100%',
    marginBottom: '0',
    padding: '0.5rem',
    boxSizing: 'border-box',
    overflow: 'visible',
  } as React.CSSProperties,

  /** Flex container for metric cards - wraps on smaller screens */
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

/**
 * Styles for sacred (dark/gold) theme.
 * Currently same as premium, but separated for future customization.
 */
const sacredStyles = {
  container: {
    width: '100%',
    marginBottom: '0',
    padding: '0.5rem',
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

// =============================================================================
// SCREEN SIZE HOOK
// =============================================================================

/**
 * Hook to detect screen size for responsive behavior.
 * Returns 'mobile' | 'tablet' | 'desktop' based on window width.
 *
 * Breakpoints:
 * - mobile: < 640px
 * - tablet: 640px - 1023px
 * - desktop: >= 1024px
 */
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
    let timeoutId: ReturnType<typeof setTimeout>
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

// =============================================================================
// METRIC SECTION COMPONENT
// =============================================================================

/**
 * METRIC SECTION COMPONENT
 * ------------------------
 * Renders a collection of MetricCard components in a responsive layout.
 * Memoized to prevent unnecessary re-renders when parent DataGrid data changes.
 */
const MetricSection: React.FC<MetricSectionProps> = memo(
  ({ metrics, styles, collapsible = false, defaultExpanded = false }) => {
    /** Check if using sacred theme */
    const isSacredTheme = styles?.theme === 'sacred'

    /** Select appropriate styles based on theme */
    const componentStyles = isSacredTheme ? sacredStyles : premiumStyles

    /** Current screen size for responsive layout decisions */
    const screenSize = useScreenSize()

    /**
     * Style for individual card wrappers.
     * Cards use auto width and natural flex wrapping.
     */
    const getResponsiveCardStyle = useMemo((): React.CSSProperties => {
      return {
        flex: '0 0 auto',
        boxSizing: 'border-box',
      }
    }, [])

    /**
     * Memoized metrics content to prevent re-renders.
     * Maps metric data to MetricCard components.
     */
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

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER LOGIC
    // ═══════════════════════════════════════════════════════════════════════════
    // Decides whether to render collapsed (accordion) or expanded (full display)
    // based on collapsible prop and screen size.

    /**
     * COLLAPSIBLE MODE:
     * - When collapsible=true: Always show as accordion
     * - When screen is tablet: Auto-collapse to save vertical space
     */
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

    /**
     * EXPANDED MODE:
     * Desktop and mobile - show all metrics cards directly
     * (mobile will stack due to flexbox wrap)
     */
    return <div style={componentStyles.container}>{metricsContent}</div>
  }
)

/** Display name for React DevTools */
MetricSection.displayName = 'MetricSection'

export default MetricSection

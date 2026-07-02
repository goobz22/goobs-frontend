'use client'

import React, { memo } from 'react'
import styles from './Card.module.css'

export interface MetricCardProps {
  /** Card title/label - displayed below the value */
  title: string
  /** Main value to display prominently */
  value: string | number
  /** When set, replaces `title` as the displayed label and in the aria-label. */
  subtitle?: string
  /** Optional icon displayed above the value */
  icon?: React.ReactNode
  /**
   * Optional trend indicator showing change direction.
   * - value: Percentage change (e.g., 12.5 for 12.5%)
   * - isPositive: true shows green up arrow, false shows red down arrow
   */
  trend?: {
    value: number
    isPositive: boolean
  }
  /**
   * Stable identifier surfaced as `data-metric-field` on the card. Tests +
   * the harvest target the card via this attribute rather than its visible
   * title, so renaming the title doesn't break selectors.
   */
  dataField?: string
  /**
   * Style configuration. `theme: 'sacred'` switches to the dark/gold
   * palette via a CSS-module class; other knobs (color, width, padding,
   * radius) are applied as CSS custom-property overrides via inline-style
   * so they don't grow the bundle's class surface for every variant.
   */
  styles?: {
    theme?: string
    color?: string
    width?: string
    height?: string
    padding?: string
    borderRadius?: string
  }
}

/**
 * Compact card for a single KPI / metric value: an optional icon above a
 * prominent value, a label below it, and an optional trend row (green up /
 * red down arrow with percentage). Used standalone in workspaces and as the
 * cell renderer inside `<MetricsAccordion metrics={…}>`. `styles.theme`
 * renders `'sacred'` and `'dark'` verbatim; anything else (including
 * undefined) resolves to the light palette, and the scalar knobs
 * (color/width/height/padding/borderRadius) ride in as CSS custom-property
 * overrides so the CSS-module defaults stay authoritative. The wrapper is a
 * `role="group"` labelled `"<label>: <value>"` and exposes
 * `data-metric-card`, `data-metric-field`, `data-metric-label`,
 * `data-metric-value`, and `data-metric-trend` test selectors.
 */
const MetricCard = memo(function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  dataField,
  styles: propStyles,
}: MetricCardProps) {
  // Sacred is the CSS base default. 'dark' and 'light' each have their own
  // [data-theme] override block in Card.module.css, so emit the requested
  // theme verbatim instead of collapsing 'dark' → 'light' (which previously
  // rendered a white card on a dark backdrop — components-metric--dark-theme).
  // Anything unrecognised (undefined / arbitrary string) defaults to light.
  const theme =
    propStyles?.theme === 'sacred'
      ? 'sacred'
      : propStyles?.theme === 'dark'
        ? 'dark'
        : 'light'
  const label = subtitle || title

  // CSS custom-property overrides — only emit the ones the caller actually
  // provided so the default CSS values stay authoritative. Runtime / caller-
  // supplied values legitimately stay in JS and ride in as CSS vars.
  const dynamicStyle: React.CSSProperties & Record<string, string> = {}
  if (propStyles?.color) {
    dynamicStyle['--mc-accent'] = propStyles.color
    dynamicStyle['--mc-border'] = propStyles.color
  }
  if (propStyles?.width) {
    dynamicStyle['--mc-min-width'] = propStyles.width
  }
  if (propStyles?.height) {
    dynamicStyle['--mc-height'] = propStyles.height
  }
  if (propStyles?.padding) {
    dynamicStyle['--mc-padding'] = propStyles.padding
  }
  if (propStyles?.borderRadius) {
    dynamicStyle['--mc-radius'] = propStyles.borderRadius
  }

  return (
    <div
      className={styles.card}
      data-theme={theme}
      style={dynamicStyle}
      role="group"
      aria-label={`${label}: ${value}`}
      data-component="MetricCard"
      data-metric-card="true"
      {...(dataField !== undefined && {
        'data-subject': dataField,
        'data-metric-field': dataField,
      })}
      data-metric-label={label}
    >
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <span className={styles.value} data-metric-value={String(value)}>
        {value}
      </span>
      <span className={styles.label}>{label}</span>
      {trend && (
        <div
          className={[
            styles.trend,
            trend.isPositive ? styles.positive : styles.negative,
          ].join(' ')}
          data-metric-trend={trend.isPositive ? 'positive' : 'negative'}
          aria-label={`${trend.isPositive ? 'Up' : 'Down'} ${Math.abs(trend.value)} percent`}
        >
          <span aria-hidden="true">{trend.isPositive ? '↗' : '↘'}</span>
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
})

MetricCard.displayName = 'MetricCard'

export default MetricCard

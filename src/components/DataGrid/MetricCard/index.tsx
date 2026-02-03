/**
 * =============================================================================
 * METRIC CARD COMPONENT
 * =============================================================================
 *
 * A compact visual card component for displaying KPI values.
 * Used in the MetricSection above the DataGrid table.
 *
 * FEATURES:
 * - Compact, centered layout
 * - Optional icon for visual context
 * - Optional trend indicator (up/down arrow with percentage)
 * - Theme support (sacred/light)
 *
 * LAYOUT:
 * ┌───────────────┐
 * │     [Icon]    │
 * │      48       │ <- Value
 * │  Active Users │ <- Title/Label
 * │    ↗ 12%      │ <- Trend (optional)
 * └───────────────┘
 *
 * USAGE EXAMPLE:
 * ```tsx
 * <MetricCard
 *   title="Total Revenue"
 *   value="$125,000"
 *   icon={<DollarIcon />}
 *   trend={{ value: 12.5, isPositive: true }}
 *   styles={{ theme: 'sacred', color: '#D4AF37' }}
 * />
 * ```
 *
 * =============================================================================
 */

'use client'

import React, { memo } from 'react'
import { alpha } from '../../../utils'

/** Gold color constant used in sacred theme */
const SACRED_GOLD = '#D4AF37'

/**
 * Props for the MetricCard component.
 */
export interface MetricCardProps {
  /** Card title/label - displayed below the value */
  title: string
  /** Main value to display prominently */
  value: string | number
  /** Optional subtitle below the value (legacy support, now same as title) */
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
  /** Style configuration including theme and accent color */
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
 * METRIC CARD COMPONENT
 * ---------------------
 * Renders a compact KPI card with value, optional icon, label, and trend.
 * Memoized to prevent unnecessary re-renders when parent data changes.
 */
const MetricCard = memo(function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  styles,
}: MetricCardProps) {
  /** Check if using sacred (dark/gold) theme */
  const isSacredTheme = styles?.theme === 'sacred'

  /** Accent color - uses provided color or defaults based on theme */
  const accentColor = styles?.color || (isSacredTheme ? SACRED_GOLD : '#1976d2')

  // Use subtitle as label if provided (legacy support)
  const label = subtitle || title

  /** Main card container style */
  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: styles?.padding || '12px 16px',
    backgroundColor: isSacredTheme
      ? 'rgba(0, 0, 0, 0.4)'
      : 'rgba(255, 255, 255, 0.9)',
    border: `1px solid ${alpha(accentColor, 0.25)}`,
    borderRadius: styles?.borderRadius || '8px',
    minWidth: styles?.width || '80px',
    flex: '1 1 auto',
    transition: 'border-color 0.2s ease',
  }

  /** Icon style */
  const iconStyle: React.CSSProperties = {
    fontSize: '1rem',
    marginBottom: '4px',
    color: accentColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  /** Value style */
  const valueStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontFamily: isSacredTheme ? '"Cinzel", serif' : '"Inter", sans-serif',
    fontWeight: 'bold',
    color: accentColor,
    lineHeight: 1,
  }

  /** Label style */
  const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    color: isSacredTheme ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
    fontFamily: '"Inter", sans-serif',
    marginTop: '4px',
    textAlign: 'center',
  }

  /** Trend style */
  const trendStyle: React.CSSProperties = {
    color: trend?.isPositive ? '#10B981' : '#EF4444',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '0.7rem',
    marginTop: '4px',
  }

  return (
    <div style={cardStyle}>
      {icon && <div style={iconStyle}>{icon}</div>}
      <span style={valueStyle}>{value}</span>
      <span style={labelStyle}>{label}</span>
      {trend && (
        <div style={trendStyle}>
          <span>{trend.isPositive ? '↗' : '↘'}</span>
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
})

MetricCard.displayName = 'MetricCard'

export default MetricCard

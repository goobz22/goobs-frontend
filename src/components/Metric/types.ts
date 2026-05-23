import type React from 'react'

/**
 * Shape of one metric the `<MetricsAccordion metrics=...>` array-mode
 * accepts. DataGrid + workspace dashboards build arrays of these for the
 * KPI strip above their grids / lists.
 *
 * The legacy `glyph` field was dropped on 2026-05-22 — sacred-theme styling
 * is owned entirely by `styles.theme` now, and callers that want a glyph
 * (e.g. `"⚙"`, an emoji, an SVG) pass it via `icon` like everyone else.
 * Removing the duplicate field eliminates "which one wins?" ambiguity in
 * tests + harvest.
 */
export interface MetricCardData {
  /** Main title of the metric */
  title: string
  /** The metric value (can be formatted string or number) */
  value: string | number
  /** Optional subtitle/context below the value */
  subtitle?: string
  /** Optional icon React element displayed in the card. Accepts a string
   *  glyph (`"☰"`, `"⚙"`, `"📋"`), an emoji, or any ReactNode. */
  icon?: React.ReactNode
  /** Optional trend indicator showing change direction and percentage */
  trend?: {
    /** Percentage change value */
    value: number
    /** True for upward trend (green), false for downward (red) */
    isPositive: boolean
  }
}

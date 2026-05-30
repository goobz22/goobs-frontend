'use client'

/**
 * =============================================================================
 * METRICS ACCORDION
 * =============================================================================
 *
 * Canonical collapsible shell for KPI / metric cards. Replaces THREE older
 * implementations that did the same job in slightly different ways:
 *   - ThothOS-side `src/components/metrics-accordion/` (per-workspace shell —
 *     `useState(false)` + button + collapsible div, no stable test selectors)
 *   - goobs `DataGrid/MetricSection` (data-driven cards in a flex container,
 *     auto-collapsing on tablet screens)
 *   - 9 in-workspace `MetricCard` duplicates wrapped in ad-hoc accordions
 *
 * One implementation now covers all of them. Located at
 * `components/Metric/Accordion/` (not DataGrid-scoped) because the audience
 * is broader than DataGrid — workspaces, dashboards, dialogs, etc.
 *
 * Styles live in `Accordion.module.css` so Storybook + dev-tools can tweak
 * theming via CSS variables without React re-renders.
 *
 * TWO USAGE SHAPES
 *
 * 1) Children mode — for workspaces that group cards themselves (rows,
 *    labels, custom layouts inside the accordion):
 *
 * ```tsx
 * <MetricsAccordion title="Metrics Summary">
 *   <div style={{ display: 'flex', gap: 12 }}>
 *     <MetricCard title="Active" value={12} icon="✓" dataField="active" />
 *     <MetricCard title="Pending" value={3} icon="⏳" dataField="pending" />
 *   </div>
 * </MetricsAccordion>
 * ```
 *
 * 2) `metrics` array mode — for DataGrid (and other data-driven callers).
 *    The component renders the cards itself in a responsive flex row:
 *
 * ```tsx
 * <MetricsAccordion
 *   metrics={[
 *     { title: 'Revenue', value: '$125K', trend: { value: 12, isPositive: true } },
 *     { title: 'Users', value: '1,234', subtitle: 'Active' },
 *   ]}
 *   collapsible
 *   responsiveCollapseOnTablet
 * />
 * ```
 *
 * RESPONSIVE BEHAVIOUR (only applies in `metrics`-array mode)
 *
 *   - `collapsible: false` + `responsiveCollapseOnTablet: false` — always
 *     render cards expanded (no accordion shell, no toggle).
 *   - `collapsible: true` — always render inside the accordion.
 *   - `responsiveCollapseOnTablet: true` — render in accordion when the
 *     viewport is ≤ 1023px wide, expanded otherwise. Preserves the prior
 *     `MetricSection` behavior.
 *
 * In children mode the accordion is ALWAYS rendered (no auto-expand path),
 * because the caller's children may be arbitrarily complex.
 *
 * TEST CONTRACT
 *   - `[data-metrics-accordion="true"]` — outer wrapper
 *   - `[data-state="open" | "closed"]` — current state on the wrapper AND the toggle
 *   - `[data-testid="metrics-accordion-toggle"]` — toggle button
 *   - `[data-testid="metrics-accordion-panel"]` — content panel (only mounted when open)
 *   - `aria-expanded` + `aria-controls` (standard a11y)
 *   - In `metrics`-array mode: `[data-metric-card]` on each card (from MetricCard's own selectors)
 *
 * Default state: COLLAPSED. Tests should open via the toggle before
 * asserting on metric text inside the panel.
 *
 * =============================================================================
 */

import React, { useEffect, useId, useMemo, useState } from 'react'
import { emitDiag } from '../../../utils/diag'
import MetricCard from '../Card'
import type { MetricCardData } from '../types'
import styles from './Accordion.module.css'

/**
 * Grouped-metrics shape — each entry renders as a labelled row inside the
 * accordion panel. Use when a route has multiple thematic groups of cards
 * (e.g. automations: Templates / By Target / Step Types). Caller passes the
 * structure; the accordion renders the group label + the cards row for each.
 */
export interface MetricsGroup {
  /** Section label shown above this group's cards (uppercase, small, dim). */
  label: string
  /** Cards rendered inside this group. */
  cards: MetricCardData[]
}

export interface MetricsAccordionProps {
  /** Cards (or any composition) shown inside the panel when expanded. Use
   *  this when the caller wants full control over the inner layout. Mutually
   *  exclusive with `metrics`. */
  children?: React.ReactNode
  /**
   * Data-driven mode. Accepts either:
   *   - flat: `MetricCardData[]` — one responsive row of cards. DataGrid's shape.
   *   - grouped: `MetricsGroup[]` — multiple labelled rows. Workspace dashboards
   *     with thematic sections (Templates / Status / By Target / etc) use this.
   * Mutually exclusive with `children`.
   */
  metrics?: MetricCardData[] | MetricsGroup[]
  /** Toggle label. Default `"Metrics Summary"` matches the historical text
   *  ThothOS workspaces used, so existing `getByText(/Metrics Summary/i)`
   *  test selectors stay stable across the migration. DataGrid passes
   *  `"Metrics"` to match its prior `MetricSection` label. */
  title?: string
  /** Default-collapsed mirrors ThothOS's prior per-workspace UX. Set to
   *  true if a route's metrics are load-bearing and should render visible
   *  on first paint. Honored in both children-mode AND `metrics`-array
   *  mode (when an accordion is rendered). */
  initiallyOpen?: boolean
  /** Force the accordion to render even in `metrics`-array mode. Without
   *  this, `metrics` mode renders the cards directly on desktop. */
  collapsible?: boolean
  /** When in `metrics`-array mode AND not already forced collapsible,
   *  auto-render in the accordion when viewport width is ≤ 1023px (tablet
   *  / mobile). Preserves the prior `MetricSection` behavior. */
  responsiveCollapseOnTablet?: boolean
  /**
   * Stable identifier surfaced as `data-metrics-accordion-field` so a
   * page with several accordions (rare but possible — e.g. workspace
   * metrics + per-tab metrics) can be disambiguated by tests.
   */
  dataField?: string
  /** Style configuration. `theme: 'sacred'` switches to the dark/gold
   *  palette via a CSS-module class; `color` overrides the accent. */
  styles?: {
    theme?: string
    color?: string
  }
}

/**
 * Detect viewport size for the responsiveCollapseOnTablet behavior.
 * Returns 'mobile' (< 640) | 'tablet' (640-1023) | 'desktop' (≥ 1024).
 */
function useScreenSize() {
  const [size, setSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      const next: 'mobile' | 'tablet' | 'desktop' =
        w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
      setSize(prev => (prev !== next ? next : prev))
    }
    check()
    let timeoutId: ReturnType<typeof setTimeout>
    const debounced = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(check, 150)
    }
    window.addEventListener('resize', debounced)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debounced)
    }
  }, [])
  return size
}

export const MetricsAccordion: React.FC<MetricsAccordionProps> = ({
  children,
  metrics,
  title = 'Metrics Summary',
  initiallyOpen = false,
  // Default-on: workspaces want the collapsed shell. Callers that prefer
  // expanded bare cards (DataGrid's tablet-only auto-collapse + desktop-
  // expanded behavior) opt out with `collapsible={false}` + set
  // `responsiveCollapseOnTablet={true}` instead. Changed 2026-05-22 after
  // workspace metrics were rendering visible-by-default and overwhelming
  // the first-paint visual weight on routes like /workspace/learning.
  collapsible = true,
  responsiveCollapseOnTablet = false,
  dataField,
  styles: propStyles,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyOpen)
  const reactId = useId()
  const panelId = `metrics-accordion-panel-${reactId}`
  const state = isExpanded ? 'open' : 'closed'

  // Additive diagnostics: on a collapse/expand transition, surface the new
  // open/closed state to the host diagnostics bus (no-op when none present).
  // Preserves the existing toggle behaviour exactly — only adds the emit.
  const handleToggle = () => {
    setIsExpanded(prev => {
      const next = !prev
      emitDiag({
        type: 'component.state',
        component: 'MetricsAccordion',
        ...(dataField !== undefined && { subject: dataField }),
        state: next ? 'open' : 'closed',
      })
      return next
    })
  }
  // Sacred is the CSS base default; every other value (undefined / 'light' /
  // 'dark') resolves to the [data-theme='light'] override block — exactly the
  // prior two-branch isSacredTheme behaviour.
  const theme = propStyles?.theme === 'sacred' ? 'sacred' : 'light'
  const screenSize = useScreenSize()

  // Accent override via CSS custom property — only emit when the caller
  // provided one so the theme default stays authoritative.
  const dynamicStyle: React.CSSProperties & Record<string, string> = {}
  if (propStyles?.color) {
    dynamicStyle['--ma-accent'] = propStyles.color
  }

  const renderedMetrics = useMemo(() => {
    if (!metrics || metrics.length === 0) return null

    // Discriminator: an entry that has `cards` is a `MetricsGroup`. Treat
    // the whole array as grouped if the first entry is a group; flat
    // otherwise. Mixing the two shapes in one array is not supported (the
    // call site's TS union prevents it).
    const first = metrics[0]
    const isGrouped =
      first !== undefined && typeof first === 'object' && 'cards' in first

    const renderCard = (m: MetricCardData, i: number) => {
      const cardProps: Record<string, unknown> = {
        title: m.title,
        value: m.value,
      }
      if (m.subtitle !== undefined) cardProps.subtitle = m.subtitle
      if (m.icon !== undefined) cardProps.icon = m.icon
      if (m.trend !== undefined) cardProps.trend = m.trend
      if (propStyles !== undefined) cardProps.styles = propStyles
      cardProps.dataField = m.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      return (
        <div key={`${m.title}-${i}`} className={styles.metricsCell}>
          {}
          <MetricCard {...(cardProps as any)} />
        </div>
      )
    }

    if (isGrouped) {
      const groups = metrics as MetricsGroup[]
      return (
        <div>
          {groups.map((g, gi) => (
            <div
              key={`${g.label}-${gi}`}
              className={styles.metricsGroup}
              data-metrics-group={g.label
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')}
            >
              <div className={styles.groupLabel}>{g.label}</div>
              <div className={styles.metricsRow}>
                {g.cards.map((c, i) => renderCard(c, i))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={styles.metricsRow}>
        {(metrics as MetricCardData[]).map((m, i) => renderCard(m, i))}
      </div>
    )
  }, [metrics, propStyles])

  // Decide whether to render the accordion shell or the bare cards.
  const useAccordion =
    children !== undefined && children !== null
      ? true
      : collapsible || (responsiveCollapseOnTablet && screenSize !== 'desktop')

  if (!useAccordion) {
    return renderedMetrics
  }

  const content = children ?? renderedMetrics

  return (
    <div
      className={styles.root}
      data-theme={theme}
      style={dynamicStyle}
      data-component="MetricsAccordion"
      data-metrics-accordion="true"
      data-state={state}
      {...(dataField !== undefined && {
        'data-subject': dataField,
        'data-metrics-accordion-field': dataField,
      })}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        data-testid="metrics-accordion-toggle"
        data-state={state}
        className={styles.toggle}
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          className={[styles.chevron, isExpanded ? styles.open : '']
            .filter(Boolean)
            .join(' ')}
        >
          ▼
        </span>
      </button>
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-label={title}
          data-testid="metrics-accordion-panel"
          className={styles.panel}
        >
          {content}
        </div>
      )}
    </div>
  )
}

MetricsAccordion.displayName = 'MetricsAccordion'

export default MetricsAccordion

'use client'

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
  /**
   * When set, wraps the toggle button in a real `<h1>`–`<h6>` so the
   * collapsible section is exposed as a document heading (WCAG 1.3.1 /
   * SEO / the WAI-ARIA accordion pattern, which wraps each header button in
   * a heading). Omit to render the bare disclosure button — a
   * context-agnostic primitive cannot know the correct document-outline
   * level, so a hardcoded default would itself be a 1.3.1 defect and would
   * silently change every consumer's DOM. The button keeps all its
   * disclosure semantics (`aria-expanded`/`aria-controls`) and test
   * selectors regardless.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Base `data-testid` for this accordion's toggle/panel pair (default
   * `'metrics-accordion'`): the toggle gets `${base}-toggle`, the panel
   * `${base}-panel`. Override it to disambiguate multiple metric accordions on
   * one page so their test ids don't collide. Matches the additive
   * `data-testid` prop convention (see Markdown).
   */
  'data-testid'?: string
  /** Style configuration. `theme: 'sacred'` switches to the dark/gold
   *  palette, `'dark'` to the dark-slate shell (any other value renders the
   *  light shell) via CSS-module blocks; `color` overrides the accent. */
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

/**
 * Canonical collapsible shell for KPI / metric cards, replacing the older
 * per-workspace accordions and DataGrid's `MetricSection`. Two mutually
 * exclusive content modes: `children` (caller-composed layout — always
 * rendered inside the accordion shell) and `metrics` (data-driven — a flat
 * `MetricCardData[]` row or labelled `MetricsGroup[]` rows of `MetricCard`s).
 * In `metrics` mode the accordion shell renders when `collapsible` (default
 * `true`) or, with `responsiveCollapseOnTablet`, when the viewport is
 * narrower than 1024px — otherwise the cards render bare and expanded.
 * Default state is collapsed (`initiallyOpen: false`) and the panel is only
 * mounted while open, so tests must click the toggle before asserting on
 * panel content. Test selectors: `data-metrics-accordion` + `data-state` on
 * the wrapper and toggle, plus `data-testid="metrics-accordion-toggle"` /
 * `"metrics-accordion-panel"`.
 */
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
  headingLevel,
  'data-testid': dataTestId = 'metrics-accordion',
  styles: propStyles,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyOpen)
  const reactId = useId()
  const panelId = `metrics-accordion-panel-${reactId}`
  const state = isExpanded ? 'open' : 'closed'
  // Sibling toggle/panel ids derive from the overridable base testid so two
  // accordions on one page don't collide on the same fixed selector.
  const toggleTestId = `${dataTestId}-toggle`
  const panelTestId = `${dataTestId}-panel`

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
  // Sacred is the CSS base default; 'dark' emits verbatim so the shell gets
  // the dark-slate block (matching MetricCard, whose missing dark block once
  // caused the same fall-through-to-light bug); every other value (undefined /
  // 'light' / unrecognised) resolves to the [data-theme='light'] override.
  const theme =
    propStyles?.theme === 'sacred'
      ? 'sacred'
      : propStyles?.theme === 'dark'
        ? 'dark'
        : 'light'
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
      // A KPI strip is a set of related items — render each card as an <li>
      // inside a <ul> row so screen readers announce "list, N items" (1.3.1).
      return (
        <li key={`${m.title}-${i}`} className={styles.metricsCell}>
          {}
          <MetricCard {...(cardProps as any)} />
        </li>
      )
    }

    if (isGrouped) {
      const groups = metrics as MetricsGroup[]
      return (
        <div>
          {groups.map((g, gi) => {
            // Associate each group's list with its visible label so the
            // relationship is programmatic, not just visual (WCAG 1.3.1).
            const groupLabelId = `${reactId}-metrics-group-${gi}`
            return (
              <div
                key={`${g.label}-${gi}`}
                className={styles.metricsGroup}
                data-metrics-group={g.label
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')}
              >
                <div className={styles.groupLabel} id={groupLabelId}>
                  {g.label}
                </div>
                <ul className={styles.metricsRow} aria-labelledby={groupLabelId}>
                  {g.cards.map((c, i) => renderCard(c, i))}
                </ul>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <ul className={styles.metricsRow}>
        {(metrics as MetricCardData[]).map((m, i) => renderCard(m, i))}
      </ul>
    )
  }, [metrics, propStyles, reactId])

  // Decide whether to render the accordion shell or the bare cards.
  const useAccordion =
    children !== undefined && children !== null
      ? true
      : collapsible || (responsiveCollapseOnTablet && screenSize !== 'desktop')

  if (!useAccordion) {
    return renderedMetrics
  }

  const content = children ?? renderedMetrics

  const toggleButton = (
    <button
      type="button"
      onClick={handleToggle}
      aria-expanded={isExpanded}
      aria-controls={panelId}
      data-testid={toggleTestId}
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
  )

  // Optional real heading wrapper — the WAI-ARIA accordion pattern wraps each
  // header button in a heading. Omitted by default so existing consumers' DOM
  // is unchanged; the button keeps all its disclosure semantics + selectors.
  const toggle = headingLevel
    ? React.createElement(
        `h${headingLevel}`,
        { className: styles.heading },
        toggleButton
      )
    : toggleButton

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
      {toggle}
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-label={title}
          data-testid={panelTestId}
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

'use client'

/**
 * =============================================================================
 * FILTER SECTION
 * =============================================================================
 *
 * Unified filter / search row used by both DataGrid and standalone workspace
 * pages. Replaces:
 *   - goobs `DataGrid/FilterSection` (search + dropdown/date filters,
 *     DataGrid-specific column-search logic now lives in DataGrid itself)
 *   - The ad-hoc filter rows hand-rolled across ~10 ThothOS workspaces
 *     (search input + chip clusters + sometimes a Create button)
 *
 * The shape is fully prop-driven — every section is optional and renders
 * only when its prop is provided. Layout follows a stable visual ordering:
 *
 *   1. Search + action buttons row (search left, buttons right)
 *   2. Dropdowns + date ranges + (single-row) controls
 *   3. Chip clusters (one labelled row per dimension)
 *   4. Boolean toggles
 *
 * ACCORDION SHELL
 *
 * Mirrors `MetricsAccordion`'s collapsible shell, but defaults to
 * `initiallyOpen={true}` because filters are primary UI (users immediately
 * need the search/filter affordances), whereas the metric strip is
 * read-only KPI data that's safe to collapse.
 *
 * TEST CONTRACT
 *   - `[data-filter-section="true"]` on the wrapper
 *   - `[data-state="open" | "closed"]` when collapsible
 *   - `[data-testid="filter-section-toggle"]` on the toggle (collapsible only)
 *   - `[data-testid="filter-section-panel"]` on the open panel (collapsible only)
 *   - SearchBar emits `data-field` per `dataField` prop or "search"
 *   - Each dropdown emits `data-field` from its `label`
 *   - Each chip cluster emits `data-chip-field` from its `label`
 *   - Each button emits `data-action` from the button's `action` prop (when provided)
 *
 * USAGE
 * ```tsx
 * <FilterSection
 *   searchValue={query}
 *   onSearchChange={setQuery}
 *   searchPlaceholder="Search courses..."
 *   dropdowns={[
 *     { label: 'Category', value: cat, options: catOpts, onChange: setCat },
 *     { label: 'Level',    value: lvl, options: lvlOpts, onChange: setLvl, variant: 'simple' },
 *   ]}
 *   chipClusters={[
 *     { label: 'Status', selectedValues: [status],
 *       options: STATUS_OPTS, onChange: ([v]) => setStatus(v),
 *       exclusive: true },
 *   ]}
 *   buttons={[
 *     { text: '+ Create Course', onClick: openCreate, permission: canWrite },
 *   ]}
 * />
 * ```
 *
 * =============================================================================
 */

import React, { useId, useState } from 'react'
import { emitDiag } from '../../../utils/diag'
import Searchbar from '../../Field/Search'
import Dropdown from '../../Field/Dropdown/Regular'
import SearchableSimple, {
  type DropdownOption,
} from '../../Field/Dropdown/SearchableSimple'
import DateRange from '../../Field/Date/DateRange'
import Switch from '../../Switch'
import Chip from '../../Chip'
import CustomButton from '../../Button'
import styles from './Section.module.css'

// ─── Sub-prop shapes ────────────────────────────────────────────────────────

export interface FilterDropdownDef {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  /**
   * Render variant. Defaults to `'auto'` which picks based on options.length —
   * `searchable` when ≥ 8 options, `simple` otherwise. Callers with strong
   * UX opinions pass `'simple'` or `'searchable'` explicitly to override.
   *   - `'simple'`     → goobs `<Dropdown>` (compact, no type-ahead)
   *   - `'searchable'` → goobs `<SearchableSimple>` (type-to-filter, better
   *                      for long option lists like customers / categories)
   */
  variant?: 'simple' | 'searchable' | 'auto'
  placeholder?: string
  width?: string
  /** Stable test selector; defaults to kebab-case of `label`. */
  dataField?: string
}

export interface FilterChipOption {
  label: string
  value: string
  /**
   * Optional accent color for this chip when active. Forwarded as
   * `styles.backgroundColor: alpha(color, 0.2)` / `styles.color: color`
   * — used by callsites with semantic per-option theming (e.g.
   * learning's level chips: beginner=green / intermediate=orange /
   * advanced=red). Inactive chips fall back to the theme default.
   */
  color?: string
}

export interface FilterChipClusterDef {
  /** Dimension label (e.g. "Status", "Type", "Category"). Rendered as the
   *  row label above the chip row. Also surfaced as `data-chip-field` on
   *  each chip in the cluster. */
  label?: string
  options: FilterChipOption[]
  selectedValues: string[]
  onChange: (selected: string[]) => void
  /** When true (default), only one value at a time — clicking a chip
   *  REPLACES the selection. When false, multi-select — clicking toggles
   *  membership in `selectedValues`. */
  exclusive?: boolean
  /** Stable test selector; defaults to kebab-case of `label`. */
  dataField?: string
}

export interface FilterDateRangeDef {
  startLabel?: string
  endLabel?: string
  value?: { start: Date | null; end: Date | null }
  onChange: (range: { start: Date | null; end: Date | null }) => void
  /** Stable test selector; defaults to kebab-case of `startLabel` (or "range"). */
  dataField?: string
}

export interface FilterToggleDef {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  dataField?: string
}

export interface FilterButtonDef {
  text: string
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
  /**
   * Permission gate. When explicitly `false`, the button is omitted from
   * the row (matches the common ThothOS `{canWrite && <button>}` pattern).
   * Undefined / `true` → button renders. To render disabled, use the
   * `disabled` prop.
   */
  permission?: boolean
  /** goobs-frontend convention — emitted as `data-action` on the button. */
  action?: string
  /** goobs-frontend convention — emitted as `data-subject` on the button. */
  subject?: string
}

// ─── Component ──────────────────────────────────────────────────────────────

export interface FilterSectionProps {
  // Search box ----------------------------------------------------
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  searchDataField?: string
  /** Slot rendered INSIDE the filter surface, directly below the search row
   *  (above the dropdown / chip filters). Use for a section sub-nav (a chip
   *  `<Tabs>`) that should live inside the filter card rather than float above
   *  it. Optional. */
  belowSearch?: React.ReactNode

  // Filter controls -----------------------------------------------
  dropdowns?: FilterDropdownDef[]
  chipClusters?: FilterChipClusterDef[]
  dateRanges?: FilterDateRangeDef[]
  toggles?: FilterToggleDef[]

  // Action buttons (right-aligned in the search row) --------------
  buttons?: FilterButtonDef[]

  // Collapsible accordion shell -----------------------------------
  /**
   * Wrap the filter row in an accordion shell. Defaults to false (the row
   * renders bare). When true, the row sits inside a toggleable panel with
   * `initiallyOpen` controlling the starting state.
   */
  collapsible?: boolean
  /** When `collapsible`, defaults to TRUE — filters are primary UI and
   *  shouldn't be hidden on first paint. (Contrast: `MetricsAccordion`
   *  defaults to false because the metric strip is read-only KPI data.) */
  initiallyOpen?: boolean
  /** Accordion title when `collapsible`. Default `"Filters"`. */
  title?: string
  /**
   * When `collapsible`, wrap the toggle header in a real heading element of
   * this level (1–6) so the collapsible "Filters" section appears in the
   * document outline and screen-reader heading navigation (WCAG 1.3.1 / SEO).
   * The WAI-ARIA APG Accordion pattern places the disclosure trigger inside a
   * heading. This is opt-in (not defaulted) because a single filter disclosure
   * shouldn't force a heading into a consumer's outline unless they choose its
   * level to fit their page hierarchy. Undefined → no heading wrapper (DOM
   * unchanged). Ignored when not `collapsible`.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6

  // Misc ----------------------------------------------------------
  /**
   * Accessible name for the search landmark. In non-collapsible mode a
   * FilterSection that includes a search box exposes that *search box* as a
   * named `role="search"` landmark (WAI-ARIA landmark best practice /
   * WCAG 1.3.1) — this lets screen-reader users jump straight to the search via
   * landmark navigation. The landmark is scoped to the search box specifically
   * so the right-aligned action button(s) (e.g. a "+ Create" CTA), which are
   * not part of a search facility, are NOT enclosed in it. The landmark is
   * given an accessible name (this prop → falls back to `title`, default
   * `"Filters"`); pass a UNIQUE label to disambiguate when several filter
   * sections share one page, so their landmarks don't all announce as the same
   * name. Collapsible mode already exposes its panel as a named `role="region"`
   * landmark, so this prop applies to non-collapsible mode only. No search box
   * → no landmark (nothing to name).
   */
  landmarkLabel?: string
  styles?: { theme?: 'sacred' | 'light' | 'dark' }
  /**
   * Give the (non-collapsible) row a self-contained surface — padding, a
   * subtle border, tinted background, and rounded corners — so it reads as
   * one grouped card instead of a bare edge-to-edge row (matching the visual
   * weight of MetricsAccordion beside it). Defaults to false (the unchanged
   * bare row) so DataGrid and every existing callsite are byte-identical.
   * Ignored in collapsible mode, which already renders the accordion panel
   * surface.
   */
  surface?: boolean
  /** Escape hatch — extra className merged onto the section root. */
  className?: string
  /** Escape hatch — inline style merged onto the section root (e.g. a margin
   *  the host layout needs; the component itself ships `margin-bottom: 0`). */
  style?: React.CSSProperties
  /** Stable test selector for the whole section. Surfaced as
   *  `data-filter-section-field` on the wrapper. */
  dataField?: string
  /**
   * Base `data-testid` for this section's toggle/panel pair (default
   * `'filter-section'`): the toggle gets `${base}-toggle`, the panel
   * `${base}-panel` (collapsible mode only). Override it to disambiguate
   * multiple filter sections on one page so their test ids don't collide.
   * Matches the additive `data-testid` prop convention (see Markdown).
   */
  'data-testid'?: string
  /**
   * Forwarded ref to the section root `<div>` (React 19 ref-as-prop), threaded
   * to whichever root renders (the search-facility container in the default
   * non-collapsible mode, or the accordion wrapper in collapsible mode). The
   * section is a composite search/filter facility — search box, dropdowns,
   * chips, and an optional disclosure toggle — so the root is the meaningful
   * consumer handle (scroll it into view, measure it, or query its controls).
   */
  ref?: React.Ref<HTMLDivElement>
}

function kebab(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Join class names, dropping falsy entries (house helper — no clsx). */
const cx = (...names: Array<string | false | undefined>): string =>
  names.filter(Boolean).join(' ')

const AUTO_SEARCHABLE_THRESHOLD = 8

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchDataField,
  belowSearch,
  dropdowns,
  chipClusters,
  dateRanges,
  toggles,
  buttons,
  collapsible = false,
  initiallyOpen = true,
  title = 'Filters',
  headingLevel,
  surface = false,
  className,
  style,
  landmarkLabel,
  styles: propStyles,
  dataField,
  'data-testid': dataTestId = 'filter-section',
  ref,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyOpen)
  const reactId = useId()
  const panelId = `filter-section-panel-${reactId}`
  const state = isExpanded ? 'open' : 'closed'
  // Sibling toggle/panel ids derive from the overridable base testid so two
  // filter sections on one page don't collide on the same fixed selector.
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
        component: 'FilterSection',
        ...(dataField !== undefined && { subject: dataField }),
        state: next ? 'open' : 'closed',
      })
      return next
    })
  }
  // Theme attribute resolves 'sacred' and 'dark' only when explicitly
  // requested; every other value (undefined / 'light') falls through to the
  // light override block in the CSS module — preserving the original
  // behaviour where an unset theme rendered light. (Mirrors Accordion's
  // pattern: sacred base class, [data-theme='light'|'dark'] overrides.)
  //
  // The resolved theme is forwarded to EVERY themed child (search bar,
  // dropdowns, date ranges, switches, buttons, chips). Children default to
  // 'sacred' when given no styles (goobs-wide convention), so a light
  // FilterSection that forwarded nothing used to render sacred-gold field
  // labels and gold chips on its light surface — a WCAG contrast failure
  // (gold-a80 on the light panel ≈ 1.66:1). The same class of bug hit the
  // DataGrid dark theme: an un-forwarded 'dark' collapsed to the light block,
  // painting the light-theme toggle color (#070a0e) on the dark surface.
  const theme: 'sacred' | 'light' | 'dark' =
    propStyles?.theme === 'sacred'
      ? 'sacred'
      : propStyles?.theme === 'dark'
        ? 'dark'
        : 'light'

  // Only render the search/buttons row if any of those props were provided.
  const hasSearch = onSearchChange !== undefined
  const visibleButtons = (buttons ?? []).filter(
    b => b.permission === undefined || b.permission === true
  )
  const hasSearchRow = hasSearch || visibleButtons.length > 0

  // Same for the controls row (dropdowns + dateRanges + toggles together).
  const hasControlsRow =
    (dropdowns && dropdowns.length > 0) ||
    (dateRanges && dateRanges.length > 0) ||
    (toggles && toggles.length > 0)

  const hasChipClusters = chipClusters && chipClusters.length > 0

  const renderDropdown = (d: FilterDropdownDef, i: number) => {
    const variantResolved: 'simple' | 'searchable' =
      d.variant === 'simple'
        ? 'simple'
        : d.variant === 'searchable'
          ? 'searchable'
          : d.options.length >= AUTO_SEARCHABLE_THRESHOLD
            ? 'searchable'
            : 'simple'
    const computedField = d.dataField ?? kebab(d.label)
    const commonProps = {
      label: d.label,
      value: d.value,
      options: d.options,
      ...(d.placeholder !== undefined && { placeholder: d.placeholder }),
      dataField: computedField,
      styles: { theme },
    }
    // Caller-supplied width is a runtime value → passed as a CSS custom
    // property that overrides the cell's default responsive flex.
    const cellStyle =
      d.width !== undefined
        ? ({ ['--fs-control-flex']: `0 0 ${d.width}` } as React.CSSProperties)
        : undefined
    if (variantResolved === 'searchable') {
      return (
        <div
          key={`dropdown-${i}-${computedField}`}
          className={styles.controlCell}
          {...(cellStyle !== undefined && { style: cellStyle })}
        >
          <SearchableSimple
            {...commonProps}
            onChange={opt => d.onChange((opt?._id as string) ?? '')}
          />
        </div>
      )
    }
    return (
      <div
        key={`dropdown-${i}-${computedField}`}
        className={styles.controlCell}
        {...(cellStyle !== undefined && { style: cellStyle })}
      >
        <Dropdown {...commonProps} onChange={d.onChange} />
      </div>
    )
  }

  const renderChip = (
    cluster: FilterChipClusterDef,
    opt: FilterChipOption,
    isActive: boolean
  ) => {
    // Per-option color theming. When `opt.color` is set, the active
    // state uses a translucent fill + the color text. Inactive chips
    // stay on the default Chip palette so the cluster doesn't visually
    // explode when nothing is selected. alpha-blend approximated via
    // color-mix in CSS through the inline style.
    const chipStyles = opt.color
      ? isActive
        ? {
            backgroundColor: `color-mix(in srgb, ${opt.color} 20%, transparent)`,
            borderColor: `color-mix(in srgb, ${opt.color} 55%, transparent)`,
            color: opt.color,
          }
        : undefined
      : undefined
    return (
      <Chip
        key={opt.value}
        label={opt.label}
        active={isActive}
        dataField={
          cluster.dataField ?? (cluster.label ? kebab(cluster.label) : 'filter')
        }
        dataValue={opt.value}
        styles={{ theme, ...chipStyles }}
        onClick={() => {
          if (cluster.exclusive !== false) {
            // Default: exclusive (radio-like). Toggling the active one off
            // would leave the cluster with nothing selected, which is fine
            // when the cluster's option list includes an "All" entry.
            cluster.onChange(isActive ? [] : [opt.value])
          } else {
            // Multi-select.
            const next = isActive
              ? cluster.selectedValues.filter(v => v !== opt.value)
              : [...cluster.selectedValues, opt.value]
            cluster.onChange(next)
          }
        }}
      />
    )
  }

  const filterContent = (
    <div className={styles.row}>
      {hasSearchRow && (
        <div className={styles.searchRow}>
          {hasSearch && (
            <div
              className={styles.searchCell}
              // A search box + its filter controls form a "search facility". In
              // non-collapsible mode expose the SEARCH BOX as a named
              // `role="search"` landmark (WAI-ARIA landmarks / WCAG 1.3.1) so
              // screen-reader users can jump straight to it via landmark
              // navigation. The landmark is scoped to the search box itself —
              // NOT the whole row — so the right-aligned action button(s) (e.g.
              // a "+ Create Course" CTA) rendered in the same `.searchRow`, which
              // are not part of a search facility, are excluded from it. Named
              // via `landmarkLabel` (→ `title`, default "Filters") to
              // disambiguate multiple filter rows on a page. Collapsible mode
              // already exposes its panel as a named `role="region"`, so the
              // search landmark applies to non-collapsible mode only.
              {...(!collapsible && {
                role: 'search',
                'aria-label': landmarkLabel ?? title,
              })}
            >
              <Searchbar
                value={searchValue ?? ''}
                onChange={onSearchChange!}
                placeholder={searchPlaceholder}
                dataField={searchDataField ?? 'search'}
                styles={{ theme }}
              />
            </div>
          )}
          {visibleButtons.length > 0 && (
            <div className={styles.buttonsCell}>
              {visibleButtons.map((b, i) => (
                <CustomButton
                  key={`btn-${i}-${b.text}`}
                  text={b.text}
                  onClick={b.onClick}
                  {...(b.icon !== undefined && { icon: b.icon })}
                  {...(b.disabled !== undefined && { disabled: b.disabled })}
                  {...(b.action !== undefined && { action: b.action })}
                  {...(b.subject !== undefined && { subject: b.subject })}
                  styles={{ theme }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {belowSearch != null && (
        <div className={styles.belowSearch} data-filter-below-search="true">
          {belowSearch}
        </div>
      )}

      {hasControlsRow && (
        <div className={styles.controlsRow}>
          {dropdowns?.map((d, i) => renderDropdown(d, i))}
          {dateRanges?.map((dr, i) => {
            const startLabel = dr.startLabel ?? 'Start Date'
            const endLabel = dr.endLabel ?? 'End Date'
            const computedField =
              dr.dataField ?? kebab(dr.startLabel ?? 'range')
            return (
              <div
                key={`daterange-${i}-${computedField}`}
                className={styles.controlCell}
              >
                <DateRange
                  startLabel={startLabel}
                  endLabel={endLabel}
                  {...(dr.value !== undefined && { value: dr.value })}
                  onChange={range => dr.onChange(range)}
                  dataField={computedField}
                  styles={{ theme }}
                />
              </div>
            )
          })}
          {toggles && toggles.length > 0 && (
            <div className={styles.togglesRow}>
              {toggles.map((t, i) => (
                <Switch
                  key={`toggle-${i}-${t.label}`}
                  checked={t.value}
                  onChange={e => t.onChange(e.target.checked)}
                  rightLabel={t.label}
                  data-field={t.dataField ?? kebab(t.label)}
                  styles={{ theme }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {hasChipClusters && (
        <div className={styles.chipClusters}>
          {chipClusters!.map((cluster, ci) => {
            // Programmatic group labelling (WCAG 1.3.1 / 4.1.2). A labelled
            // cluster is a NAMED group of related filter chips — each Chip
            // renders as a toggle button (role="button" + aria-pressed), so
            // the row is exposed as role="group" tied to its visible dimension
            // label via aria-labelledby. Screen-reader users then hear e.g.
            // "Status, group" and traverse the chips as one set instead of a
            // string of context-free buttons. (role="radiogroup" is NOT used:
            // that requires role="radio" children, which the shared Chip does
            // not emit — see Deferred.) An UNLABELLED cluster stays a plain
            // container: an unnamed group only adds AT verbosity.
            const clusterLabelId = cluster.label
              ? `filter-cluster-label-${reactId}-${ci}`
              : undefined
            return (
              <div
                key={`cluster-${ci}-${cluster.label ?? 'unlabelled'}`}
                className={styles.chipCluster}
                data-chip-cluster={
                  cluster.dataField ??
                  (cluster.label ? kebab(cluster.label) : undefined)
                }
              >
                {cluster.label && (
                  <span
                    id={clusterLabelId}
                    className={styles.chipClusterLabel}
                  >
                    {cluster.label}:
                  </span>
                )}
                <div
                  className={styles.chipRow}
                  {...(clusterLabelId !== undefined && {
                    role: 'group',
                    'aria-labelledby': clusterLabelId,
                  })}
                >
                  {cluster.options.map(opt =>
                    renderChip(
                      cluster,
                      opt,
                      cluster.selectedValues.includes(opt.value)
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  if (!collapsible) {
    return (
      <div
        ref={ref}
        className={cx(styles.root, className)}
        data-theme={theme}
        data-component="FilterSection"
        data-filter-section="true"
        // The `role="search"` landmark lives on the SEARCH BOX itself (see the
        // searchCell in `filterContent`), NOT on this root — so the
        // right-aligned action button(s) rendered in the same search row are
        // excluded from the search facility (a "+ Create" CTA is not part of a
        // search facility). This root stays a plain grouping container carrying
        // the component's test/theme attributes.
        {...(surface && { 'data-surface': 'true' })}
        {...(dataField !== undefined && {
          'data-subject': dataField,
          'data-filter-section-field': dataField,
        })}
        {...(style !== undefined && { style })}
      >
        {filterContent}
      </div>
    )
  }

  // Disclosure trigger. When `headingLevel` is set it is wrapped in a real
  // heading (WCAG 1.3.1 / SEO), matching the APG Accordion pattern where the
  // trigger lives inside a heading; otherwise it renders bare (DOM unchanged).
  const toggleButton = (
    <button
      type="button"
      onClick={handleToggle}
      aria-expanded={isExpanded}
      // The panel is mount-on-open ({isExpanded && …} below), so reference it
      // via aria-controls ONLY while it is actually in the DOM — emitting a
      // fixed IDREF while collapsed points at a non-existent node (a dangling
      // aria-controls, a deviation from the WAI-ARIA APG Disclosure pattern).
      // aria-expanded still conveys the collapsed state on its own.
      {...(isExpanded && { 'aria-controls': panelId })}
      data-action="toggle"
      data-testid={toggleTestId}
      data-state={state}
      className={styles.toggle}
    >
      <span>{title}</span>
      <span
        aria-hidden="true"
        className={`${styles.chevron} ${isExpanded ? styles.open : ''}`}
      >
        ▼
      </span>
    </button>
  )
  const HeadingTag = headingLevel
    ? (`h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
    : undefined

  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      data-theme={theme}
      data-component="FilterSection"
      data-filter-section="true"
      data-state={state}
      {...(dataField !== undefined && {
        'data-subject': dataField,
        'data-filter-section-field': dataField,
      })}
      {...(style !== undefined && { style })}
    >
      {HeadingTag ? (
        <HeadingTag className={styles.heading}>{toggleButton}</HeadingTag>
      ) : (
        toggleButton
      )}
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-label={title}
          data-testid={panelTestId}
          className={styles.panel}
        >
          {filterContent}
        </div>
      )}
    </div>
  )
}

FilterSection.displayName = 'FilterSection'

export default FilterSection

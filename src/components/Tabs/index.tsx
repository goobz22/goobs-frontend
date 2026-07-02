'use client'

import React, { useRef } from 'react'
import { alpha } from '../../utils'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Tabs.module.css'

const SACRED_GOLD = '#FFD700'

/**
 * Capability profile for a single tab. Consumed by tooling that needs
 * to reason about what each tab supports (e.g. the auto-CRUD test
 * scaffolder gates create/update/delete phase tests on these flags
 * instead of inferring from JSX patterns).
 *
 * All fields optional — tabs that don't declare capabilities are
 * treated as "unknown" by tooling and fall back to heuristic detection.
 */
export interface TabsItemCapabilities {
  /** Tab supports creating entities (Create button visible). */
  create?: boolean
  /** Tab supports updating entities (Edit button visible). */
  update?: boolean
  /** Tab supports deleting entities (Delete button visible). */
  delete?: boolean
}

export interface TabsItem {
  /**
   * Title / label may be a ReactNode (allows status dots or other
   * inline glyphs alongside the text — see account-information tabs).
   * When a non-string is supplied the auto-CRUD scaffolder can no
   * longer fall back to kebabing it for a `data-tab-id`; pass the
   * stable `id` field explicitly in that case.
   */
  title?: string | React.ReactNode
  label?: string | React.ReactNode
  route?: string
  trigger?: 'route' | 'onClick'
  onClick?: () => void
  /**
   * Stable identifier surfaced as `data-tab-id` on the rendered button
   * AND on the corresponding panel (when a `<TabPanel>` is used).
   * Tests target tabs by this id rather than by visible label so
   * label-text changes don't break the test contract:
   *   `page.locator('[data-tab-id="categories"]').click()`
   *   `expect(page.locator('[data-tab-active="true"][data-tab-id="categories"]')).toBeVisible()`
   *
   * Falls back to a kebab-cased `label`/`title` when omitted.
   */
  id?: string
  /**
   * Singular entity noun for THIS tab — `"category"` not `"contract"`
   * for the Categories tab on a contracts route. Read by the auto-CRUD
   * scaffolder to build per-tab fixtures
   * (`Audit Test ${capitalize(subject)}`) so tests in nested
   * describe.serial blocks bind to the right entity.
   */
  subject?: string
  /** Per-tab CRUD capability flags — see `TabsItemCapabilities`. */
  capabilities?: TabsItemCapabilities
  /**
   * Actual labels rendered in this tab's metric strip, if the tab has
   * its own metrics. The scaffolder's `verifyStatus` template reads
   * this to build a permissive regex (e.g.
   * `/(Contracts|With Docs|Employees|Customers|Categories)/i`)
   * instead of hardcoding `"Total"`.
   */
  metricLabels?: string[]
  /** Optional count badge rendered after the label (matches the
   *  pattern most workspaces hand-rolled before adopting the shared
   *  shell). Hidden when undefined or null. */
  count?: number | null
  /**
   * Optional leading glyph / icon node rendered before the label. Use
   * for hand-rolled tab strips migrating to goobs that previously
   * embedded an icon character in their label text (e.g. `"☰ Inbox"`).
   * Pass either a string glyph (rendered with `aria-hidden`) or a
   * ReactNode for full control.
   */
  icon?: React.ReactNode
}

export interface TabsProps {
  items: TabsItem[]
  activeTab?: number
  onChange?: (index: number) => void
  alignment?: 'left' | 'center' | 'right' | 'justify'
  /**
   * `aria-label` on the tablist. Defaults to `"Workspace sections"`.
   * Override when several `<Tabs>` render on the same page.
   */
  ariaLabel?: string
  styles?: {
    theme?: string
    padding?: string
    gap?: string
    borderBottom?: string
    height?: string
    tabLeftBorder?: string | boolean
    tabRightBorder?: string | boolean
    backgroundColor?: string
  }
}

function kebabFallback(input: string | undefined): string {
  if (!input) return ''
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Accessible WAI-ARIA tablist that renders a set of tab items with full
 * keyboard navigation, optional count badges and leading icons, and route- or
 * click-based activation. Emits `nav.change` diagnostics and stable
 * `data-tab-id`/`data-tab-subject` selectors; pairs with the exported `Tab` and
 * `TabPanel`.
 */
const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab = 0,
  onChange,
  alignment = 'center',
  ariaLabel = 'Workspace sections',
  styles,
}) => {
  // Sacred is the hardcoded CSS default (the component historically rendered
  // sacred-gold inline regardless of theme); light/dark are [data-theme]
  // overrides in Tabs.module.css.
  const theme = styles?.theme || 'sacred'
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleTabClick = (index: number, tab: TabsItem) => {
    // Diagnostic bus — emit a nav.change whenever the active tab changes.
    // Resolve the stable tab identifier the same way the render does
    // (explicit id → kebab-cased label/title → index) so the emitted `to`
    // matches the `data-tab-id` selector tests target. Additive: fired
    // alongside the existing onChange/route/onClick handling without altering
    // it. No-op when no host bus is present.
    const navLabel = tab.label ?? tab.title ?? ''
    const navLabelString = typeof navLabel === 'string' ? navLabel : undefined
    const navTabId = tab.id ?? kebabFallback(navLabelString) ?? String(index)
    emitDiag({
      type: 'nav.change',
      component: 'Tabs',
      to: String(navTabId || index),
    })

    if (onChange) {
      onChange(index)
    }

    if (tab.trigger === 'route' && tab.route) {
      // Use location.assign() instead of direct href assignment to avoid lint error
      window.location.assign(tab.route)
    } else if (tab.trigger === 'onClick' && tab.onClick) {
      tab.onClick()
    }
  }

  // Keyboard nav — Left/Right move focus, Home/End jump to bounds,
  // Enter/Space activate. Mirrors the WAI-ARIA tablist pattern.
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (items.length === 0) return
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight')
      nextIndex = (currentIndex + 1) % items.length
    else if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + items.length) % items.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = items.length - 1
    if (nextIndex == null) return
    event.preventDefault()
    const targetTab = items[nextIndex]
    if (!targetTab) return
    handleTabClick(nextIndex, targetTab)
    // Move keyboard focus to the newly-active tab.
    requestAnimationFrame(() => {
      tabRefs.current[nextIndex]?.focus()
    })
  }

  // Handle tabLeftBorder - convert boolean to string
  const tabLeftBorderValue =
    styles?.tabLeftBorder === true
      ? `1px solid ${alpha(SACRED_GOLD, 0.3)}`
      : styles?.tabLeftBorder === false
        ? undefined
        : styles?.tabLeftBorder

  // Handle tabRightBorder - convert boolean to string
  const tabRightBorderValue =
    styles?.tabRightBorder === true
      ? `1px solid ${alpha(SACRED_GOLD, 0.3)}`
      : styles?.tabRightBorder === false
        ? undefined
        : styles?.tabRightBorder

  const justifyContent =
    alignment === 'left'
      ? 'flex-start'
      : alignment === 'right'
        ? 'flex-end'
        : alignment === 'justify'
          ? 'space-between'
          : 'center'

  // Caller-supplied overrides flow into the CSS module via custom properties;
  // undefined values are omitted so the module's sacred/light/dark defaults
  // win (exactOptionalPropertyTypes-safe).
  const containerStyle: React.CSSProperties = {
    ['--tabs-justify' as string]: justifyContent,
    ...(styles?.gap !== undefined && { ['--tabs-gap' as string]: styles.gap }),
    ...(styles?.padding !== undefined && {
      ['--tabs-padding' as string]: styles.padding,
    }),
    ...(styles?.height !== undefined && {
      ['--tabs-height' as string]: styles.height,
    }),
    ...(styles?.borderBottom !== undefined && {
      ['--tabs-border-bottom' as string]: styles.borderBottom,
    }),
    ...(tabLeftBorderValue !== undefined && {
      ['--tabs-border-left' as string]: tabLeftBorderValue,
    }),
    ...(tabRightBorderValue !== undefined && {
      ['--tabs-border-right' as string]: tabRightBorderValue,
    }),
    ...(styles?.backgroundColor !== undefined && {
      ['--tabs-background-color' as string]: styles.backgroundColor,
    }),
  }

  return (
    <div
      className={cssStyles.root}
      data-component="Tabs"
      data-theme={theme}
      data-state={String(activeTab)}
      style={containerStyle}
      role="tablist"
      aria-label={ariaLabel}
      data-tabs-root="true"
    >
      {items.map((tab, index) => {
        const isActive = activeTab === index
        const label: React.ReactNode = tab.label ?? tab.title ?? ''
        // Only the string form can be kebabed for a fallback tab-id;
        // when the label is a ReactNode the caller must pass `id`.
        const labelString = typeof label === 'string' ? label : undefined
        const tabId = tab.id ?? kebabFallback(labelString) ?? String(index)
        // Single source of truth for the tab↔panel ARIA pairing: the same
        // helper `<TabPanel>` uses for its `id`, so
        // `tab.aria-controls === panel.id` holds by construction.
        const panelId = tabPanelId(tabId)
        return (
          <Tab
            key={index}
            label={label}
            isActive={isActive}
            theme={theme}
            tabId={tabId}
            panelId={panelId}
            count={tab.count}
            // Forward the entity noun as data-tab-subject so the
            // auto-CRUD test scaffolder can locate a tab by entity
            // even when the tab label changes (e.g. "Categories" →
            // "All Categories"): page.locator('[data-tab-subject="category"]').
            // exactOptionalPropertyTypes requires omitting undefined
            // values rather than passing `undefined` explicitly.
            {...(tab.subject !== undefined && { subject: tab.subject })}
            {...(tab.icon !== undefined &&
              tab.icon !== null && { icon: tab.icon })}
            buttonRef={el => {
              tabRefs.current[index] = el
            }}
            onClick={() => handleTabClick(index, tab)}
            onKeyDown={event => handleTabKeyDown(event, index)}
          />
        )
      })}
    </div>
  )
}

/**
 * Compute the panel id that matches a given tab id. This is the SINGLE
 * source of truth for the tab↔panel ARIA pairing: `<Tabs>` uses it for
 * each tab's `aria-controls` and `<TabPanel>` uses it for its `id`, so
 * the two link by construction. Call it directly when hand-rolling a
 * panel element instead of using `<TabPanel>`.
 *
 * Ids are derived purely from the tab id (`tabpanel-${tabId}`), matching
 * the unscoped `tab-${tabId}` button ids. When several `<Tabs>` render
 * on the same page, give their items distinct `id`s (the same contract
 * the tab button ids already require — see `TabsProps.ariaLabel`).
 */
export function tabPanelId(tabId: string): string {
  return `tabpanel-${tabId}`
}

export interface TabProps {
  /**
   * Tab content. String when the caller passed plain text; ReactNode
   * when they need inline status glyphs / icons alongside the text.
   * The rendered `<button>` includes the node directly. Tests should
   * locate tabs by `data-tab-id` / `data-tab-subject` rather than
   * label text, since rich-node labels can't be matched with a
   * simple text selector.
   */
  label: string | React.ReactNode
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  /**
   * Visual theme — surfaced as `data-theme` on the rendered `<button>` so
   * the CSS module's light/dark overrides apply. Defaults to `'sacred'`
   * (the historical hardcoded sacred-gold look). Forwarded by `<Tabs>`
   * from `styles.theme`.
   */
  theme?: string
  /** Stable identifier surfaced as `data-tab-id`. Forwarded by the
   *  parent `<Tabs>` from `TabsItem.id` (or its kebab-cased label). */
  tabId?: string
  /** `id` of the corresponding `<TabPanel>` for `aria-controls`. The
   *  parent `<Tabs>` computes this via `tabPanelId(tabId)` and hands it
   *  down so screenreader navigation lands on the right region. */
  panelId?: string
  /** Singular entity noun for THIS tab — emitted as `data-tab-subject`
   *  so tests can locate a tab by the entity it manages even when its
   *  visible label changes. Forwarded from `TabsItem.subject`. */
  subject?: string
  /** Optional count badge rendered after the label. */
  count?: number | null | undefined
  /** Optional leading glyph / icon — see TabsItem.icon. */
  icon?: React.ReactNode
  /** Forwarded ref to the underlying `<button>` so the parent can
   *  programmatically focus a tab on keyboard nav. */
  buttonRef?: (el: HTMLButtonElement | null) => void
  /** Forwarded keyboard handler — parent owns the arrow-key/home/end
   *  routing across the tablist. */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
}

export const Tab: React.FC<TabProps> = ({
  label,
  isActive,
  onClick,
  disabled = false,
  theme = 'sacred',
  tabId,
  panelId,
  subject,
  count,
  icon,
  buttonRef,
  onKeyDown,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      onClick()
    }
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      role="tab"
      id={tabId ? `tab-${tabId}` : undefined}
      data-tab-id={tabId}
      data-tab-subject={subject}
      data-tab-active={isActive ? 'true' : 'false'}
      data-theme={theme}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={onKeyDown}
      className={cssStyles.tab}
      disabled={disabled}
    >
      {icon != null ? (
        <span
          aria-hidden={typeof icon === 'string' ? 'true' : undefined}
          data-tab-icon="true"
          className={cssStyles.icon}
        >
          {icon}
        </span>
      ) : null}
      {label}
      {count != null ? (
        <span
          aria-hidden="true"
          data-tab-count={count}
          className={cssStyles.count}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

/**
 * Optional companion to `<Tabs>` — wraps tab content with the right
 * ARIA wiring (`role="tabpanel"`, `id` linked to the active tab's
 * `aria-controls`, and `data-tab-id` so tests can wait for the
 * correct panel to mount).
 *
 * Use it directly under `<Tabs>` and conditionally render whichever
 * panel matches the active tab. Tests can wait for the panel to
 * become visible:
 *   `await expect(page.locator('[role="tabpanel"][data-tab-id="categories"]')).toBeVisible()`
 */
export interface TabPanelProps {
  /** Must match the corresponding `<TabsItem>.id` so ARIA wiring lines up. */
  tabId: string
  /** True when this is the currently-active tab; the panel mounts but
   *  the parent component should still gate its rendering. The flag is
   *  used to drive `data-tab-active` and `tabIndex`. */
  isActive?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  isActive = true,
  children,
  style,
}) => (
  <div
    role="tabpanel"
    id={tabPanelId(tabId)}
    aria-labelledby={`tab-${tabId}`}
    data-tab-id={tabId}
    data-tab-active={isActive ? 'true' : 'false'}
    tabIndex={isActive ? 0 : -1}
    style={style}
  >
    {children}
  </div>
)
TabPanel.displayName = 'TabPanel'

Tabs.displayName = 'Tabs'
Tab.displayName = 'Tab'

export default Tabs

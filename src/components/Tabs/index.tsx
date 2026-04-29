'use client'

import React, { useId, useRef, useState } from 'react'
import { alpha } from '../../utils'

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
  title?: string
  label?: string
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

const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab = 0,
  onChange,
  alignment = 'center',
  ariaLabel = 'Workspace sections',
  styles,
}) => {
  const [hoveredTab, setHoveredTab] = useState<number | null>(null)
  // Stable id base for `aria-controls` linkage to corresponding
  // `<TabPanel>`. Each tab button references `tabpanel-${reactId}-${id}`;
  // a sibling panel matching that id pairs the two.
  const reactId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleTabClick = (index: number, tab: TabsItem) => {
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

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent:
      alignment === 'left'
        ? 'flex-start'
        : alignment === 'right'
          ? 'flex-end'
          : alignment === 'justify'
            ? 'space-between'
            : 'center',
    alignItems: 'center',
    gap: styles?.gap || '8px',
    padding: styles?.padding,
    height: styles?.height,
    marginBottom: '16px',
    borderBottom:
      styles?.borderBottom || `1px solid ${alpha(SACRED_GOLD, 0.2)}`,
    borderLeft: tabLeftBorderValue,
    borderRight: tabRightBorderValue,
    backgroundColor: styles?.backgroundColor,
    flexWrap: 'wrap',
  }

  return (
    <div
      style={containerStyle}
      role="tablist"
      aria-label={ariaLabel}
      data-tabs-root="true"
    >
      {items.map((tab, index) => {
        const isActive = activeTab === index
        const isHovered = hoveredTab === index
        const label = tab.label || tab.title || ''
        const tabId = tab.id ?? kebabFallback(label) ?? String(index)
        const panelId = `tabpanel-${reactId}-${tabId}`
        return (
          <Tab
            key={index}
            label={label}
            isActive={isActive}
            isHovered={isHovered}
            tabId={tabId}
            panelId={panelId}
            count={tab.count}
            buttonRef={el => {
              tabRefs.current[index] = el
            }}
            onClick={() => handleTabClick(index, tab)}
            onKeyDown={event => handleTabKeyDown(event, index)}
            onMouseEnter={() => setHoveredTab(index)}
            onMouseLeave={() => setHoveredTab(null)}
          />
        )
      })}
    </div>
  )
}

/**
 * Compute the panel id that matches a given tab id from the same
 * `<Tabs>` instance. Use when rendering a sibling `<TabPanel>` so the
 * `aria-labelledby` / `id` pair lines up. The `reactId` argument is
 * the same `useId()` value Tabs allocated — pass it down via a wrapper
 * if you need direct control, otherwise prefer `<TabPanel>` (below)
 * which co-locates the wiring.
 */
export function tabPanelId(reactId: string, tabId: string): string {
  return `tabpanel-${reactId}-${tabId}`
}

export interface TabProps {
  label: string
  isActive: boolean
  isHovered?: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  disabled?: boolean
  /** Stable identifier surfaced as `data-tab-id`. Forwarded by the
   *  parent `<Tabs>` from `TabsItem.id` (or its kebab-cased label). */
  tabId?: string
  /** `id` of the corresponding `<TabPanel>` for `aria-controls`. The
   *  parent `<Tabs>` computes this via `tabPanelId(reactId, tabId)` and
   *  hands it down so screenreader navigation lands on the right
   *  region. */
  panelId?: string
  /** Optional count badge rendered after the label. */
  count?: number | null | undefined
  /** Forwarded ref to the underlying `<button>` so the parent can
   *  programmatically focus a tab on keyboard nav. */
  buttonRef?: (el: HTMLButtonElement | null) => void
  /** Forwarded keyboard handler — parent owns the arrow-key/home/end
   *  routing across the tablist. */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  styles?: {
    theme?: string
    padding?: string
    fontSize?: string
    fontWeight?: string | number
  }
}

export const Tab: React.FC<TabProps> = ({
  label,
  isActive,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  tabId,
  panelId,
  count,
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

  const getBackgroundColor = () => {
    if (disabled) return 'transparent'
    if (isActive)
      return `linear-gradient(135deg, ${alpha(SACRED_GOLD, 0.2)}, ${alpha(SACRED_GOLD, 0.1)})`
    if (isHovered)
      return `linear-gradient(135deg, ${alpha(SACRED_GOLD, 0.1)}, ${alpha(SACRED_GOLD, 0.05)})`
    return 'transparent'
  }

  const getBorderBottomColor = () => {
    if (disabled) return 'transparent'
    if (isActive) return SACRED_GOLD
    if (isHovered) return alpha(SACRED_GOLD, 0.5)
    return 'transparent'
  }

  const getColor = () => {
    if (disabled) return 'rgba(255, 255, 255, 0.4)'
    if (isActive) return SACRED_GOLD
    if (isHovered) return 'rgba(255, 215, 0, 0.9)'
    return 'rgba(255, 255, 255, 0.7)'
  }

  const tabStyle: React.CSSProperties = {
    position: 'relative',
    padding: '12px 24px',
    background: getBackgroundColor(),
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: `2px solid ${getBorderBottomColor()}`,
    borderLeft: 'none',
    color: getColor(),
    fontFamily: '"Cinzel", serif',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    letterSpacing: '0.05em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textShadow: isActive ? `0 0 10px ${alpha(SACRED_GOLD, 0.5)}` : 'none',
    boxShadow: isActive ? `0 0 20px ${alpha(SACRED_GOLD, 0.3)}` : 'none',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      role="tab"
      id={tabId ? `tab-${tabId}` : undefined}
      data-tab-id={tabId}
      data-tab-active={isActive ? 'true' : 'false'}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={onKeyDown}
      style={tabStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
    >
      {label}
      {count != null ? (
        <span
          aria-hidden="true"
          data-tab-count={count}
          style={{
            marginLeft: '8px',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: isActive
              ? alpha(SACRED_GOLD, 0.25)
              : alpha(SACRED_GOLD, 0.12),
            fontSize: '0.75em',
            fontWeight: 600,
          }}
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
    id={`tabpanel-${tabId}`}
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

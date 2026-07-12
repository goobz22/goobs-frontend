'use client'

import React, { useEffect, useRef, useState } from 'react'
import { emitDiag } from '../../utils/diag'
import cssStyles from './Tabs.module.css'

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
  /**
   * Destination for a `trigger: 'route'` tab. A route tab is a page
   * navigation, so it renders as a real crawlable `<a href={route}>` (keeping
   * `role="tab"` and every `data-*` selector) — links are crawlable for SEO
   * and get native affordances (open-in-new-tab, copy-link, status-bar URL).
   * Route tabs also use MANUAL activation: an arrow key moves focus only,
   * navigation happens on Enter/Space/click (avoids an arrow-key context
   * change — WCAG 3.2.2). Plain left-clicks navigate via `location.assign`;
   * modifier/middle clicks fall through to the browser's native link handling.
   */
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
   * Visual treatment of the tab strip. `'underline'` (default) is the
   * classic bottom-border tab row; `'chips'` renders each tab as a rounded
   * pill (bordered, tonal fill when active) and drops the strip's bottom
   * border. Purely cosmetic — `role="tab"`/`role="tablist"` semantics, the
   * count badge, keyboard roving nav, and every `data-*` selector are
   * identical in both appearances, so existing tests and AT are unaffected.
   */
  appearance?: 'underline' | 'chips'
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
 *
 * Activation follows the WAI-ARIA APG: onClick (panel-switching) tabs activate
 * AUTOMATICALLY on arrow-key focus, while `route` tabs — which perform a full
 * page navigation — render as real `<a href>` links and use MANUAL activation
 * (arrow moves focus only; Enter/Space/click navigates), so an arrow key never
 * triggers a page load / context change (WCAG 3.2.2).
 */
const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab = 0,
  onChange,
  alignment = 'center',
  appearance = 'underline',
  ariaLabel = 'Workspace sections',
  styles,
}) => {
  // Sacred is the hardcoded CSS default (the component historically rendered
  // sacred-gold inline regardless of theme); light/dark are [data-theme]
  // overrides in Tabs.module.css.
  const theme = styles?.theme || 'sacred'
  // Roving-focus refs. A route tab renders as an <a> (see below), so the ref
  // element may be an anchor, not a button — widen to HTMLElement; only
  // `.focus()` (defined on HTMLElement) is ever called on it.
  const tabRefs = useRef<Array<HTMLElement | null>>([])

  // Roving-tabindex focus pointer for the WAI-ARIA tablist. It normally tracks
  // the selected `activeTab`, but MANUAL-activation route tabs let focus LEAD
  // selection: an ArrowLeft/Right moves focus (and the roving `tabindex`)
  // WITHOUT activating, so the focused tab differs from the selected one until
  // the user presses Enter/Space/clicks. Synced to `activeTab` with React's
  // render-phase "previous prop" pattern (no effect → no set-state-in-effect).
  const [focusIndex, setFocusIndex] = useState(activeTab)
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab)
  if (activeTab !== prevActiveTab) {
    setPrevActiveTab(activeTab)
    setFocusIndex(activeTab)
  }

  // Activate a tab: emit the nav diagnostic, notify the host, then run the
  // tab's own effect (navigate for a `route` tab, invoke `onClick` otherwise).
  // Invoked by a pointer click and by explicit keyboard activation
  // (Enter/Space); NOT by arrow-key focus movement onto a route tab (that is a
  // context change — see `handleTabKeyDown`).
  const activateTab = (index: number, tab: TabsItem) => {
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
  //
  // Activation model (WAI-ARIA APG): AUTOMATIC for panel-switching tabs
  // (activate on focus), but MANUAL for `route` tabs whose activation performs
  // a full page navigation. Per the APG guidance to prefer manual activation
  // when "activating a tab … causes a … change of context," an arrow key onto
  // a route tab only MOVES focus (no navigation — WCAG 3.2.2); the route tab is
  // selected only by an explicit Enter/Space/click.
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    currentIndex: number
  ) => {
    if (items.length === 0) return
    const currentTab = items[currentIndex]

    // Space on a route tab: an <a> does not fire a click on Space natively
    // (only Enter does), so activate explicitly to keep the APG key contract.
    // Non-route <button> tabs keep native Space/Enter activation untouched.
    if (event.key === ' ' && currentTab?.trigger === 'route') {
      event.preventDefault()
      activateTab(currentIndex, currentTab)
      return
    }

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
    // Move the roving focus (and tabindex) to the target tab.
    setFocusIndex(nextIndex)
    requestAnimationFrame(() => {
      tabRefs.current[nextIndex]?.focus()
    })
    // Automatic activation for panel-switching tabs only. A route tab is NOT
    // activated by arrow-key focus movement (context change — WCAG 3.2.2).
    if (targetTab.trigger !== 'route') {
      activateTab(nextIndex, targetTab)
    }
  }

  // Handle tabLeftBorder - convert boolean to string
  const tabLeftBorderValue =
    styles?.tabLeftBorder === true
      ? '1px solid var(--goobs-gold-a30)'
      : styles?.tabLeftBorder === false
        ? undefined
        : styles?.tabLeftBorder

  // Handle tabRightBorder - convert boolean to string
  const tabRightBorderValue =
    styles?.tabRightBorder === true
      ? '1px solid var(--goobs-gold-a30)'
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
      data-tabs-appearance={appearance}
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
            // Roving tabindex follows FOCUS, not selection, so keyboard focus
            // can rest on a route tab that isn't the selected one (manual
            // activation) while exactly one tab stays in the Tab sequence.
            isFocusTarget={focusIndex === index}
            theme={theme}
            tabId={tabId}
            panelId={panelId}
            count={tab.count}
            // A `route` tab is a page navigation, so render it as a real
            // crawlable <a href> (SEO) with native link affordances — Tab keeps
            // role="tab" + every data-* selector. onClick/route-less tabs stay
            // <button>. Omit href when absent (exactOptionalPropertyTypes).
            {...(tab.trigger === 'route' && tab.route
              ? { href: tab.route }
              : {})}
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
            onClick={() => activateTab(index, tab)}
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
   * When set, this tab is a page-navigation link: it renders as
   * `<a href={href} role="tab">` instead of `<button role="tab">` so it is
   * crawlable (SEO) and gets native link affordances (open-in-new-tab,
   * copy-link). Forwarded by `<Tabs>` from a `route` tab's `route`. A plain
   * left-click still activates via the `onClick` handler (the parent's
   * `location.assign` navigation); modifier/middle clicks fall through to the
   * browser's native link handling. Ignored when `disabled` (a disabled tab
   * falls back to `<button disabled>`; a disabled anchor is not focusable).
   */
  href?: string
  /**
   * Roving-tabindex target: `true` ⇒ this tab is the single tab in the Tab
   * sequence (`tabIndex=0`), the rest are `-1`. `<Tabs>` sets it to follow
   * keyboard FOCUS (which, for manual-activation route tabs, can differ from
   * the selected tab). Defaults to `isActive` when omitted, preserving the
   * standalone `<Tab>` behaviour where focus and selection coincide.
   */
  isFocusTarget?: boolean
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
  /**
   * Public consumer ref to the tab's underlying `<button>` element (React 19
   * ref-as-prop). Merged with the internal `buttonRef` the parent `<Tabs>`
   * uses for roving keyboard focus, so both receive the node. The `<button>`
   * IS the interactive leaf this component renders.
   */
  ref?: React.Ref<HTMLButtonElement>
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
  href,
  isFocusTarget,
  buttonRef,
  ref,
  onKeyDown,
}) => {
  // A route tab renders as an <a href>; a disabled tab (never a route tab in
  // practice — <Tabs> never disables route tabs) falls back to <button> so the
  // native `disabled` state + `:disabled` styling still apply.
  const asAnchor = href != null && !disabled

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (asAnchor) {
      // Anchor (route) tab: preserve the browser's native open-in-new-tab /
      // copy-link affordances by letting modifier / middle clicks resolve the
      // href natively; intercept only plain left clicks to keep the existing
      // `location.assign` navigation path (unchanged behaviour for normal
      // clicks, and Enter — which fires a plain synthetic click — navigates).
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }
      e.preventDefault()
      onClick()
      return
    }
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      onClick()
    }
  }

  // Own reference to the rendered leaf (a <button>, or an <a> for route tabs)
  // so the aria-controls reconciliation effect below can mutate the live node
  // without disturbing the parent's roving-focus ref or the public consumer
  // ref. Widened to HTMLElement to cover the anchor case; only DOM methods
  // common to both (setAttribute/removeAttribute/focus) are used.
  const internalButtonRef = useRef<HTMLElement | null>(null)

  // Merge the internal `buttonRef` (parent-owned roving focus) with the public
  // consumer `ref` so a single DOM `ref` slot feeds both (plus our own node
  // ref). The public `buttonRef`/`ref` props predate the anchor variant and are
  // typed `HTMLButtonElement`; a route tab hands them an `HTMLAnchorElement` at
  // runtime (both are `HTMLElement`, and callers only use the ref to focus) —
  // cast at this boundary rather than retyping the public API.
  const setButtonRef = (el: HTMLElement | null) => {
    internalButtonRef.current = el
    buttonRef?.(el as HTMLButtonElement | null)
    if (typeof ref === 'function') ref(el as HTMLButtonElement | null)
    else if (ref)
      (ref as React.RefObject<HTMLButtonElement | null>).current =
        el as HTMLButtonElement | null
  }

  // Roving tabindex follows FOCUS when the parent supplies `isFocusTarget`
  // (manual-activation route tabs let focus lead selection); standalone <Tab>
  // usage omits it and falls back to `isActive` (focus == selection).
  const inTabSequence = isFocusTarget ?? isActive

  // Element-agnostic keydown adapter. The public `onKeyDown` prop is typed for
  // an <button> currentTarget (unchanged for API compatibility); route tabs
  // render an <a>, whose handler wants an anchor currentTarget. The handler
  // only reads `event.key`, so bridge the two currentTarget types with a single
  // narrowing cast here rather than retyping the public prop. Used for BOTH
  // leaves so they stay consistent.
  const handleKeyDown = onKeyDown
    ? (event: React.KeyboardEvent<HTMLElement>) =>
        onKeyDown(event as React.KeyboardEvent<HTMLButtonElement>)
    : undefined

  // aria-controls reconciliation. A `route`/`onClick` tab — the majority usage —
  // is rendered WITHOUT a matching `<TabPanel>`, so the `aria-controls={panelId}`
  // emitted for SSR would DANGLE: an idref to an element that never mounts
  // (automated a11y scanners flag "aria-controls must reference an existing
  // element"). `<Tabs>` cannot know at render time whether the consumer also
  // rendered the paired `<TabPanel>` (it is an external sibling, optionally
  // conditional on the active tab). Mirror `<Card>`'s aria-labelledby handling:
  // keep the attribute in the server markup (identical SSR/hydration output — no
  // mismatch) and reconcile it AFTER mount as a plain DOM mutation — assert it
  // only while the referenced panel is actually in the document, drop it
  // otherwise. `isActive` is a dependency so a consumer that mounts/unmounts
  // only the active panel re-reconciles on activation. A `role="tab"` with no
  // aria-controls is valid ARIA (APG recommends the link but does not require
  // it), so removal is safe.
  useEffect(() => {
    const node = internalButtonRef.current
    if (node === null) return
    if (panelId && document.getElementById(panelId) !== null) {
      node.setAttribute('aria-controls', panelId)
    } else {
      node.removeAttribute('aria-controls')
    }
  }, [panelId, isActive])

  // Content is identical across the <a>/<button> leaf — build it once.
  const content = (
    <>
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
        // Count badge. Deliberately NOT aria-hidden: the number is meaningful
        // information shown only visually, so it must reach assistive tech too
        // (WCAG 1.3.1) — leaving it in the accessible name makes the tab
        // announce e.g. "Inbox 5", matching what sighted users see. The
        // `data-tab-count` attribute is preserved for the test contract.
        <span data-tab-count={count} className={cssStyles.count}>
          {count}
        </span>
      ) : null}
    </>
  )

  // Attributes shared by both leaves. `role="tab"`, every `data-*` selector,
  // `aria-selected`/`aria-controls`, and the roving `tabIndex` are IDENTICAL on
  // the anchor and the button so the a11y + machine-test contract is unchanged
  // regardless of which element renders.
  if (asAnchor) {
    // Route tab → real crawlable link. Keeps role="tab" (tablist semantics +
    // ThothOS test contract) while gaining native link affordances and SSR
    // crawlability. `href` is guaranteed defined here (asAnchor gate).
    return (
      <a
        href={href}
        ref={setButtonRef}
        role="tab"
        id={tabId ? `tab-${tabId}` : undefined}
        data-tab-id={tabId}
        data-tab-subject={subject}
        data-tab-active={isActive ? 'true' : 'false'}
        data-theme={theme}
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={inTabSequence ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cssStyles.tab}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      ref={setButtonRef}
      role="tab"
      id={tabId ? `tab-${tabId}` : undefined}
      data-tab-id={tabId}
      data-tab-subject={subject}
      data-tab-active={isActive ? 'true' : 'false'}
      data-theme={theme}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={inTabSequence ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cssStyles.tab}
      disabled={disabled}
    >
      {content}
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

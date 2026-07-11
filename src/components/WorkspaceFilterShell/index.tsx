'use client'

/**
 * =============================================================================
 * WORKSPACE FILTER SHELL
 * =============================================================================
 *
 * A slot-based layout that gives every list/browse workspace ONE consistent,
 * correctly-spaced scaffold:
 *
 *     ┌─────────────────────────────────────────┐
 *     │  metrics   (e.g. <MetricsAccordion/>)     │
 *     │  nav       (e.g. <Tabs appearance=chips/>)│  ← tight gap to the filter
 *     │  ┌───────────────────────────────────┐    │
 *     │  │ filter (e.g. <FilterSection surface/>) │  ← integrated with content
 *     │  │ content (the cards / list / grid)      │
 *     │  └───────────────────────────────────┘    │
 *     └─────────────────────────────────────────┘
 *
 * It is a pure LAYOUT primitive — it does NOT wrap, alias, or re-implement the
 * goobs components you pass into it. You still construct `<MetricsAccordion>`,
 * `<Tabs>`, and `<FilterSection>` yourself (with their full APIs) and hand them
 * in as slots; the shell owns only the vertical rhythm and containment so the
 * region reads as one system across workspaces instead of being hand-rolled
 * (and inconsistently spaced) per page.
 *
 * Spacing: metrics → nav uses the normal inter-zone gap; nav → filter is
 * deliberately HALF that (the section tabs bind visually to the filter+content
 * block they act on); filter → content is tight so the filter reads as the head
 * of the card area.
 *
 * =============================================================================
 */

import React from 'react'
import cssStyles from './WorkspaceFilterShell.module.css'

/** Join class names, dropping falsy entries (house helper — no clsx). */
const cx = (...names: Array<string | false | undefined>): string =>
  names.filter(Boolean).join(' ')

export interface WorkspaceFilterShellPagination {
  /** 1-indexed current page. */
  page: number
  /** Items per page. */
  pageSize: number
  /** Total number of items across ALL pages (pre-slice). */
  totalItems: number
  /** Called with the 1-indexed page to move to. */
  onPageChange: (page: number) => void
}

/** Build the page-number sequence with leading/trailing ellipses for long
 *  ranges (1 … 4 5 6 … 20). Mirrors the pattern the workspaces hand-rolled
 *  before this became a shell built-in. */
function pageSequence(
  currentPage: number,
  totalPages: number
): Array<number | 'ellipsis'> {
  const maxVisible = 5
  if (totalPages <= maxVisible)
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages: Array<number | 'ellipsis'> = [1]
  if (currentPage > 3) pages.push('ellipsis')
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) if (!pages.includes(i)) pages.push(i)
  if (currentPage < totalPages - 2) pages.push('ellipsis')
  if (!pages.includes(totalPages)) pages.push(totalPages)
  return pages
}

const ShellPagination: React.FC<{ pagination: WorkspaceFilterShellPagination }> = ({
  pagination,
}) => {
  const { page, pageSize, totalItems, onPageChange } = pagination
  const totalPages = Math.ceil(totalItems / Math.max(1, pageSize))
  if (totalPages <= 1) return null
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)
  const btn = (
    key: React.Key,
    label: React.ReactNode,
    opts: {
      disabled?: boolean
      active?: boolean
      onClick?: () => void
      action?: string
      /** Descriptive accessible name for a control whose visible text is
       *  abbreviated or non-descriptive: the numbered buttons (`"Page 5"` for a
       *  bare digit — WCAG 2.4.6 / 4.1.2) and the Prev / Next controls
       *  (`"Previous page"` / `"Next page"`, matching the WAI-ARIA APG
       *  Pagination example). Always kept a superstring of the visible text so
       *  it also satisfies 2.5.3 Label in Name (`"5"` ⊂ `"Page 5"`,
       *  `"Prev"` ⊂ `"Previous page"`, `"Next"` ⊂ `"Next page"`). */
      ariaLabel?: string
    } = {}
  ) => {
    // Boundary controls (Prev on page 1, Next on the last page) are marked with
    // aria-disabled rather than the native `disabled` attribute so they STAY
    // focusable. A natively-disabled control that is focused at the instant it
    // becomes disabled — e.g. tabbing to Prev on page 2 and activating it to
    // REACH page 1, which disables Prev — is blurred by the browser, dropping
    // keyboard focus to <body> so the user's next Tab restarts from the top of
    // the page. aria-disabled keeps the element in the tab order (focus is
    // preserved across the boundary activation) while the guarded onClick makes
    // it an inert no-op (WCAG 2.4.3 Focus Order / 4.1.2). The attribute is
    // OMITTED entirely when the control is enabled — never emitted as
    // aria-disabled="false".
    const isDisabled = opts.disabled === true
    return (
      <button
        key={key}
        type="button"
        className={cx(cssStyles.pageBtn, opts.active && cssStyles.pageBtnActive)}
        onClick={isDisabled ? undefined : opts.onClick}
        aria-current={opts.active ? 'page' : undefined}
        {...(isDisabled && { 'aria-disabled': true })}
        {...(opts.ariaLabel && { 'aria-label': opts.ariaLabel })}
        {...(opts.action && { 'data-action': opts.action })}
      >
        {label}
      </button>
    )
  }
  return (
    // Native <nav> landmark (not div[role=navigation]) so the pagination is a
    // real, SSR-crawlable landmark — matches the library's Breadcrumb pattern.
    <nav
      className={cssStyles.pagination}
      data-shell-zone="pagination"
      aria-label="Pagination"
    >
      {btn('prev', 'Prev', {
        disabled: page <= 1,
        onClick: () => onPageChange(page - 1),
        action: 'prev',
        ariaLabel: 'Previous page',
      })}
      {pageSequence(page, totalPages).map((p, i) =>
        p === 'ellipsis' ? (
          // Decorative gap marker — the numbered buttons already convey the
          // skipped range, so hide the glyph from assistive tech (WCAG 1.3.1).
          <span
            key={`e-${i}`}
            className={cssStyles.pageEllipsis}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          btn(p, p, {
            active: p === page,
            onClick: () => onPageChange(p),
            ariaLabel: `Page ${p}`,
          })
        )
      )}
      {btn('next', 'Next', {
        disabled: page >= totalPages,
        onClick: () => onPageChange(page + 1),
        action: 'next',
        ariaLabel: 'Next page',
      })}
      {/* The visible range doubles as a polite live region so screen-reader
          users hear the new range when a page control is activated (focus
          stays on Prev/Next, so nothing else announces the change) — WCAG
          4.1.3 Status Messages. */}
      <span
        className={cssStyles.pageInfo}
        aria-live="polite"
        aria-atomic="true"
      >
        {startItem}-{endItem} of {totalItems}
      </span>
    </nav>
  )
}

export interface WorkspaceFilterShellProps {
  /** Metrics summary slot — typically a `<MetricsAccordion/>`. Omit to hide. */
  metrics?: React.ReactNode
  /** Section-navigation slot — typically a `<Tabs appearance="chips"/>`. Sits
   *  directly above the sub-nav/filter with a deliberately tight gap. Omit to hide. */
  nav?: React.ReactNode
  /** Secondary / sub-navigation slot — a second `<Tabs appearance="chips"/>`
   *  row rendered directly beneath `nav` (e.g. Monitoring / Polling within a
   *  section). Optional, so it changes and disappears per active tab. */
  subNav?: React.ReactNode
  /** Filter slot — typically a `<FilterSection surface/>`. Rendered as the head
   *  of the content region so it integrates with the cards below. Omit to hide. */
  filter?: React.ReactNode
  /** Card / list / grid content area. */
  children?: React.ReactNode
  /** Built-in pagination, rendered BELOW the content (the cards). Give it the
   *  1-indexed page + page size + total item count and it renders the
   *  Prev / numbered / Next control, hidden automatically when there is only one
   *  page. You still slice your own data
   *  (`items.slice((page - 1) * pageSize, page * pageSize)`) — the shell owns
   *  the control, you own the data. */
  pagination?: WorkspaceFilterShellPagination
  /** Visual theme — surfaced as `data-theme` for CSS overrides. Default
   *  `'sacred'`. (The shell has no themed chrome of its own today; the attribute
   *  is forwarded so future themed containment can hook in without an API change.) */
  styles?: { theme?: 'sacred' | 'light' | 'dark' }
  /** Escape hatch — extra className merged onto the shell root. */
  className?: string
  /** Escape hatch — inline style merged onto the shell root. */
  style?: React.CSSProperties
  /** Stable test selector — surfaced as `data-workspace-shell-field`. */
  dataField?: string
}

export const WorkspaceFilterShell: React.FC<WorkspaceFilterShellProps> = ({
  metrics,
  nav,
  subNav,
  filter,
  children,
  pagination,
  styles: propStyles,
  className,
  style,
  dataField,
}) => {
  const theme = propStyles?.theme ?? 'sacred'
  return (
    <div
      className={cx(cssStyles.shell, className)}
      data-component="WorkspaceFilterShell"
      data-theme={theme}
      {...(dataField !== undefined && {
        'data-workspace-shell-field': dataField,
      })}
      {...(style !== undefined && { style })}
    >
      {metrics != null && (
        <div className={cssStyles.metrics} data-shell-zone="metrics">
          {metrics}
        </div>
      )}
      {nav != null && (
        <div className={cssStyles.nav} data-shell-zone="nav">
          {nav}
        </div>
      )}
      {subNav != null && (
        <div className={cssStyles.subNav} data-shell-zone="sub-nav">
          {subNav}
        </div>
      )}
      <div className={cssStyles.body} data-shell-zone="body">
        {filter != null && (
          <div className={cssStyles.filter} data-shell-zone="filter">
            {filter}
          </div>
        )}
        <div className={cssStyles.content} data-shell-zone="content">
          {children}
        </div>
        {pagination != null && <ShellPagination pagination={pagination} />}
      </div>
    </div>
  )
}

WorkspaceFilterShell.displayName = 'WorkspaceFilterShell'

export default WorkspaceFilterShell

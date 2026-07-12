/**
 * @fileoverview Storybook stories for WorkspaceFilterShell.
 *
 * WorkspaceFilterShell is a slot-based layout: it arranges a metrics slot, a
 * nav (chip Tabs) slot, a filter (FilterSection) slot, and the card content
 * into one consistently-spaced stack. These stories compose the REAL goobs
 * primitives into the shell so the Chromatic baseline pins the end-to-end look
 * (the shell owns only spacing — the primitives style themselves).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, within } from 'storybook/test'
import WorkspaceFilterShell from './index'
import MetricsAccordion from '../Metric/Accordion'
import Tabs, { type TabsItem } from '../Tabs'
import FilterSection from '../Filter/Section'

const meta: Meta<typeof WorkspaceFilterShell> = {
  title: 'Components/WorkspaceFilterShell',
  component: WorkspaceFilterShell,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof WorkspaceFilterShell>

const SECTION_TABS: TabsItem[] = [
  { id: 'statements', label: 'Statements', count: 12 },
  { id: 'ledger', label: 'Ledger', count: 3 },
  { id: 'billing', label: 'Billing', count: 0 },
  { id: 'drafts', label: 'Drafts' },
]

const CardsPlaceholder = ({ color }: { color: string }): React.JSX.Element => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
      gap: '16px',
    }}
  >
    {[1, 2, 3].map(n => (
      <div
        key={n}
        style={{
          minHeight: '120px',
          borderRadius: '12px',
          border: `1px solid ${color}`,
          background: 'rgba(255,255,255,0.02)',
          padding: '16px',
          color,
          fontFamily: "'Cinzel', Georgia, serif",
        }}
      >
        Card {n}
      </div>
    ))}
  </div>
)

/**
 * Minimal pagination-only harness (no metrics / nav / filter slots) so the
 * focus-ring and reduced-motion a11y stories exercise the built-in pagination
 * control in isolation. Owns the `page` state so Prev/Next actually move.
 */
const PaginationOnly = ({
  theme,
  initialPage,
  pageSize,
  totalItems,
  background,
  paginationLabel,
}: {
  theme: 'sacred' | 'light' | 'dark'
  initialPage: number
  pageSize: number
  totalItems: number
  background: string
  /** Optional override for the pagination `<nav>` landmark's accessible name.
   *  Omit to exercise the default `'Pagination'`. */
  paginationLabel?: string
}): React.JSX.Element => {
  const [page, setPage] = React.useState(initialPage)
  return (
    <div style={{ padding: '24px', background, minHeight: '100vh' }}>
      <WorkspaceFilterShell
        styles={{ theme }}
        paginationLabel={paginationLabel}
        pagination={{ page, pageSize, totalItems, onPageChange: setPage }}
      >
        <CardsPlaceholder color={theme === 'light' ? '#1e40af' : '#d4af37'} />
      </WorkspaceFilterShell>
    </div>
  )
}

const ShellDemo = ({
  theme,
}: {
  theme: 'sacred' | 'light'
}): React.JSX.Element => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string[]>(['service'])
  const [status, setStatus] = React.useState<string[]>(['all'])
  const [page, setPage] = React.useState(1)
  const accent = theme === 'sacred' ? '#d4af37' : '#1e40af'
  // Per-option chip accents. The sacred palette is tuned for the dark gold
  // surface; the light palette uses darker Material shades because an ACTIVE
  // chip renders its color as TEXT over a 20%-tint of the same color — light
  // Material 300/400 hues (fine on the dark surface) drop below 4.5:1 on the
  // light filter card, so light gets the 800/900 equivalents (all proven ≥ 4.5).
  const chipColors =
    theme === 'sacred'
      ? {
          service: '#64B5F6',
          lodging: '#FFB74D',
          products: '#81C784',
          paid: '#4CAF50',
          unpaid: '#9E9E9E',
          overdue: '#F44336',
        }
      : {
          service: '#0D47A1',
          lodging: '#7C2D12',
          products: '#14532D',
          paid: '#1B5E20',
          unpaid: '#374151',
          overdue: '#991B1B',
        }

  return (
    <div
      style={{
        padding: '24px',
        background: theme === 'sacred' ? '#000000' : '#f3f4f6',
        minHeight: '100vh',
      }}
    >
      <WorkspaceFilterShell
        styles={{ theme }}
        pagination={{ page, pageSize: 3, totalItems: 8, onPageChange: setPage }}
        metrics={
          <MetricsAccordion
            styles={{ theme }}
            metrics={[
              {
                label: 'Statements',
                cards: [
                  { title: 'Services', value: 8, icon: '🔧' },
                  { title: 'Total Revenue', value: '$12,400', icon: '💰' },
                  { title: 'Outstanding', value: '$3,100', icon: '⏳' },
                ],
              },
            ]}
          />
        }
        nav={
          <Tabs
            appearance="chips"
            alignment="left"
            ariaLabel="Demo sections"
            activeTab={activeTab}
            onChange={setActiveTab}
            items={SECTION_TABS}
            styles={{ theme }}
          />
        }
        subNav={
          <Tabs
            appearance="chips"
            alignment="left"
            ariaLabel="Demo sub-sections"
            activeTab={0}
            items={[
              { id: 'all', label: 'All', count: 5 },
              { id: 'open', label: 'Open', count: 2 },
            ]}
            styles={{ theme }}
          />
        }
        filter={
          <FilterSection
            surface
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search invoices, customers..."
            chipClusters={[
              {
                label: 'Category',
                selectedValues: category,
                onChange: setCategory,
                exclusive: true,
                options: [
                  {
                    label: 'Services',
                    value: 'service',
                    color: chipColors.service,
                  },
                  {
                    label: 'Lodging',
                    value: 'lodging',
                    color: chipColors.lodging,
                  },
                  {
                    label: 'Products',
                    value: 'products',
                    color: chipColors.products,
                  },
                ],
              },
              {
                label: 'Status',
                selectedValues: status,
                onChange: setStatus,
                exclusive: true,
                options: [
                  { label: 'All Status', value: 'all', color: accent },
                  { label: 'Paid', value: 'paid', color: chipColors.paid },
                  {
                    label: 'Unpaid',
                    value: 'unpaid',
                    color: chipColors.unpaid,
                  },
                  {
                    label: 'Overdue',
                    value: 'overdue',
                    color: chipColors.overdue,
                  },
                ],
              },
            ]}
            styles={{ theme }}
          />
        }
      >
        <CardsPlaceholder color={accent} />
      </WorkspaceFilterShell>
    </div>
  )
}

/**
 * 1) Sacred — the reference look (matches the Invoicing & Ledger workspace):
 * boxed metrics, chip section tabs bound tightly to a surfaced filter card,
 * and the cards integrated directly below.
 */
export const Sacred: Story = {
  render: () => <ShellDemo theme="sacred" />,
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The shell renders its zones in order and its primitives are intact:
    // metrics + a chip tablist + a filter section + card content.
    const shell = canvasElement.querySelector(
      '[data-component="WorkspaceFilterShell"]'
    )
    await expect(shell).not.toBeNull()
    await expect(
      shell?.querySelector('[data-shell-zone="nav"] [role="tablist"]')
    ).not.toBeNull()
    await expect(
      shell?.querySelector('[data-tabs-appearance="chips"]')
    ).not.toBeNull()
    await expect(
      shell?.querySelector('[data-shell-zone="sub-nav"] [role="tablist"]')
    ).not.toBeNull()
    await expect(
      shell?.querySelector('[data-shell-zone="filter"] [data-filter-section]')
    ).not.toBeNull()
    // Section nav keeps role="tab" inside the shell (a11y / test contract):
    // 4 primary + 2 sub-nav tabs.
    await expect(canvas.getAllByRole('tab').length).toBe(6)
    // Built-in pagination renders below the content (8 items / 3 per page).
    await expect(
      shell?.querySelector('[data-shell-zone="pagination"]')
    ).not.toBeNull()
  },
}

/** 2) Light theme variant. */
export const Light: Story = {
  render: () => <ShellDemo theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * 3) Pagination accessibility — a many-page range (200 items / 10 per page) so
 * the built-in control renders Prev / numbered / ellipsis / Next. Pins the
 * pagination a11y contract:
 *   • it is a real `<nav aria-label="Pagination">` landmark, not a
 *     `div[role="navigation"]` (WCAG 1.3.1 / 4.1.2);
 *   • the page controls are a real `<ul role="list">` of `<li>` items (mirrors
 *     the library's Breadcrumb `<ol>/<li>`) so assistive tech conveys the set
 *     relationship + item count, not a flat run of buttons (WCAG 1.3.1);
 *   • each numbered control carries a descriptive `"Page N"` accessible name —
 *     the bare digit alone is not descriptive (WCAG 2.4.6), and `"Page N"`
 *     keeps the visible `"N"` as a substring so it still satisfies 2.5.3;
 *   • the current page is programmatically marked with `aria-current="page"`;
 *   • the decorative gap ellipsis is hidden from assistive tech (WCAG 1.3.1);
 *   • the item-range readout is a polite live region so a screen-reader hears
 *     the new range after paging while focus stays on Prev/Next (WCAG 4.1.3).
 */
export const PaginationA11y: Story = {
  render: () => {
    const Demo = (): React.JSX.Element => {
      const [page, setPage] = React.useState(3)
      return (
        <div
          style={{ padding: '24px', background: '#000000', minHeight: '100vh' }}
        >
          <WorkspaceFilterShell
            styles={{ theme: 'sacred' }}
            pagination={{
              page,
              pageSize: 10,
              totalItems: 200,
              onPageChange: setPage,
            }}
          >
            <CardsPlaceholder color="#d4af37" />
          </WorkspaceFilterShell>
        </div>
      )
    }
    return <Demo />
  },
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The pagination is a REAL <nav> landmark (native element, not role=).
    const paginationNav = canvas.getByRole('navigation', { name: 'Pagination' })
    await expect(paginationNav.tagName).toBe('NAV')

    // The page controls form a real list (role="list" <ul> of <li> items),
    // mirroring the library's Breadcrumb <ol>/<li> so AT conveys the set + item
    // count (WCAG 1.3.1). FAILS against the former flat markup where the buttons
    // were direct <nav> children with no list wrapper.
    const pageList = paginationNav.querySelector('ul')
    await expect(pageList).not.toBeNull()
    await expect(pageList).toHaveAttribute('role', 'list')
    // Prev, a numbered control, and Next are each wrapped in a list item of it.
    const page4Item = canvas.getByRole('button', { name: 'Page 4' })
    await expect(page4Item.closest('li')).not.toBeNull()
    await expect(page4Item.closest('ul')).toBe(pageList)
    await expect(
      canvas.getByRole('button', { name: 'Previous page' }).closest('li')
    ).not.toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Next page' }).closest('li')
    ).not.toBeNull()
    // The decorative gap ellipsis is a list item removed from AT (aria-hidden on
    // the <li>) so it is neither announced as an empty item nor counted in the
    // set size.
    const hiddenItem = pageList?.querySelector('li[aria-hidden="true"]')
    await expect(hiddenItem?.textContent).toContain('…')

    // Numbered controls expose a descriptive "Page N" accessible name.
    await expect(
      canvas.getByRole('button', { name: 'Page 4' })
    ).not.toBeNull()

    // The active page (3) is programmatically current.
    await expect(
      canvas.getByRole('button', { name: 'Page 3' })
    ).toHaveAttribute('aria-current', 'page')

    // The long-range ellipsis is decorative → hidden from assistive tech.
    const ellipsis = paginationNav.querySelector('[aria-hidden="true"]')
    await expect(ellipsis?.textContent).toContain('…')

    // The item-range readout is a polite, atomic live region.
    const info = paginationNav.querySelector('[aria-live="polite"]')
    await expect(info).not.toBeNull()
    await expect(info).toHaveAttribute('aria-atomic', 'true')
    await expect(info?.textContent).toBe('21-30 of 200')

    // Paging moves aria-current AND updates the live region's announced range.
    await userEvent.click(canvas.getByRole('button', { name: 'Page 4' }))
    await expect(
      canvas.getByRole('button', { name: 'Page 4' })
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      paginationNav.querySelector('[aria-live="polite"]')?.textContent
    ).toBe('31-40 of 200')

    // Prev/Next expose descriptive APG accessible names — each a superstring of
    // its visible "Prev"/"Next" text so it still satisfies 2.5.3 Label in Name.
    await expect(
      canvas.getByRole('button', { name: 'Previous page' })
    ).not.toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Next page' })
    ).not.toBeNull()

    // Keyboard focus lands a visible :focus-visible ring on a numbered control
    // (drives the SACRED focus-ring token; the Chromatic snapshot captures the
    // ring). After the Page 4 click above, Tab advances to the adjacent Page 5.
    await userEvent.tab()
    await expect(
      canvas.getByRole('button', { name: 'Page 5' })
    ).toHaveFocus()
  },
}

/**
 * 4) Boundary focus is PRESERVED (regression for the adversarial-review
 * focus-loss finding). Prev/Next are marked `aria-disabled` — NOT the native
 * `disabled` attribute — at the page-1 / last-page boundaries so the control
 * stays keyboard-focusable: activating Prev to REACH page 1 (which disables it)
 * must NOT blur focus to `<body>` and dump the user's keyboard position at the
 * top of the page (WCAG 2.4.3 Focus Order). Starts on page 2 of 3 so Prev is
 * live, then activates it and asserts focus survives on the now-boundary
 * control. With the pre-fix native `disabled`, the browser would blur here and
 * `toHaveFocus()` would fail.
 */
export const PaginationBoundaryFocus: Story = {
  render: () => (
    <PaginationOnly
      theme="sacred"
      initialPage={2}
      pageSize={10}
      totalItems={30}
      background="#000000"
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Pagination' })
    const prev = canvas.getByRole('button', { name: 'Previous page' })

    // On page 2 Prev is live: focusable and NOT aria-disabled.
    await expect(prev).not.toHaveAttribute('aria-disabled')

    // Activating Prev reaches page 1 (the lower boundary) → Prev goes
    // aria-disabled and the live region announces the new range...
    await userEvent.click(prev)
    await expect(prev).toHaveAttribute('aria-disabled', 'true')
    await expect(nav.querySelector('[aria-live="polite"]')?.textContent).toBe(
      '1-10 of 30'
    )

    // ...but keyboard focus STAYS on the control — the whole point of the fix.
    await expect(prev).toHaveFocus()

    // The boundary control is an inert no-op: clicking again does not page below
    // 1 (the guarded onClick), and focus is still retained.
    await userEvent.click(prev)
    await expect(nav.querySelector('[aria-live="polite"]')?.textContent).toBe(
      '1-10 of 30'
    )
    await expect(prev).toHaveFocus()
  },
}

/**
 * 5) Focus ring on the LIGHT pagination surface — pins the light-theme
 * focus-ring token override (`--goobs-light-focus-ring`). Keyboard focus (Tab)
 * lands on the first page control so the Chromatic baseline captures the light
 * ring, which the sacred-only PaginationA11y story left visually unpinned.
 */
export const PaginationFocusLight: Story = {
  render: () => (
    <PaginationOnly
      theme="light"
      initialPage={3}
      pageSize={10}
      totalItems={100}
      background="#f3f4f6"
    />
  ),
  globals: { theme: 'light', backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Keyboard-origin focus (Tab) drives :focus-visible; the first focusable
    // control in the nav is Prev.
    await userEvent.tab()
    await expect(
      canvas.getByRole('button', { name: 'Previous page' })
    ).toHaveFocus()
  },
}

/**
 * 6) Focus ring on the DARK pagination surface — pins the dark-theme focus-ring
 * token override (`--goobs-dark-focus-ring`), the other half of the
 * per-theme focus-ring coverage the sacred-only story could not exercise.
 */
export const PaginationFocusDark: Story = {
  render: () => (
    <PaginationOnly
      theme="dark"
      initialPage={3}
      pageSize={10}
      totalItems={100}
      background="#111827"
    />
  ),
  globals: { theme: 'dark', backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(
      canvas.getByRole('button', { name: 'Previous page' })
    ).toHaveFocus()
  },
}

/**
 * 7) Reduced motion — the page-button colour transition is dropped under
 * `@media (prefers-reduced-motion: reduce)` (WCAG 2.3.3 Animation from
 * Interactions), matching the sibling Breadcrumb / Button / Chip guards. Toggle
 * your OS "reduce motion" setting (or Storybook's motion emulation) to observe
 * the buttons snap between states with no colour fade. The play step asserts the
 * guard actually SHIPPED for `.pageBtn` in the loaded stylesheet (it cannot
 * regress silently to a documentary-only story).
 */
export const PaginationReducedMotion: Story = {
  render: () => (
    <PaginationOnly
      theme="sacred"
      initialPage={3}
      pageSize={10}
      totalItems={100}
      background="#000000"
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The pagination renders...
    await expect(
      canvas.getByRole('navigation', { name: 'Pagination' })
    ).not.toBeNull()

    // ...and a prefers-reduced-motion guard that neutralises the .pageBtn
    // transition is present in the loaded CSS. Resolve the hashed CSS-module
    // class of a real page button, then scan every same-origin stylesheet for a
    // reduced-motion @media block that targets THAT class and touches
    // `transition` — so the assertion pins OUR guard, not a sibling's.
    const pageButton = canvas.getByRole('button', { name: 'Previous page' })
    const pageBtnClass = Array.from(pageButton.classList).find(name =>
      name.includes('pageBtn')
    )
    await expect(pageBtnClass).toBeTruthy()

    const guardTargetsPageBtn = Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(
          rule =>
            rule instanceof CSSMediaRule &&
            rule.cssText.includes('prefers-reduced-motion') &&
            rule.cssText.includes(pageBtnClass as string) &&
            rule.cssText.includes('transition')
        )
      } catch {
        // Cross-origin stylesheet — not ours; skip.
        return false
      }
    })
    await expect(guardTargetsPageBtn).toBe(true)
  },
}

/**
 * 8) Custom pagination landmark label — the `paginationLabel` prop overrides the
 * default `aria-label="Pagination"` on the built-in pagination `<nav>` landmark.
 * When more than one paginated `<nav>` shares a page (e.g. two
 * WorkspaceFilterShells), EVERY navigation landmark of the same type must carry a
 * UNIQUE accessible name (ARIA landmark uniqueness / WCAG technique ARIA11) or
 * assistive-tech landmark navigation cannot tell them apart. This renders two
 * paginated shells on one page with distinct labels and asserts each `<nav>`
 * resolves by its OWN unique name — and that the shared default `"Pagination"`
 * name is no longer present. FAILS against the pre-fix hardcoded `aria-label`.
 */
export const PaginationCustomLabel: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <PaginationOnly
        theme="sacred"
        initialPage={1}
        pageSize={10}
        totalItems={100}
        background="#000000"
        paginationLabel="Invoices pagination"
      />
      <PaginationOnly
        theme="sacred"
        initialPage={1}
        pageSize={10}
        totalItems={100}
        background="#000000"
        paginationLabel="Customers pagination"
      />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Each paginated shell's <nav> landmark resolves by its OWN unique accessible
    // name (the overridden aria-label), so landmark navigation can distinguish the
    // two — the whole point of the paginationLabel prop.
    const invoicesNav = canvas.getByRole('navigation', {
      name: 'Invoices pagination',
    })
    await expect(invoicesNav.tagName).toBe('NAV')
    const customersNav = canvas.getByRole('navigation', {
      name: 'Customers pagination',
    })
    await expect(customersNav.tagName).toBe('NAV')
    await expect(invoicesNav).not.toBe(customersNav)

    // Neither <nav> keeps the shared default "Pagination" name — the override took
    // effect for both (pre-fix, both were hardcoded "Pagination", a duplicate
    // landmark name).
    await expect(
      canvas.queryByRole('navigation', { name: 'Pagination' })
    ).toBeNull()
  },
}

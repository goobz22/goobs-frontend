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
  },
}

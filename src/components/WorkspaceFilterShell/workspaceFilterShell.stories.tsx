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
import { expect, within } from 'storybook/test'
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
  const accent = theme === 'sacred' ? '#d4af37' : '#2563eb'

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
                  { label: 'Services', value: 'service', color: '#64B5F6' },
                  { label: 'Lodging', value: 'lodging', color: '#FFB74D' },
                  { label: 'Products', value: 'products', color: '#81C784' },
                ],
              },
              {
                label: 'Status',
                selectedValues: status,
                onChange: setStatus,
                exclusive: true,
                options: [
                  { label: 'All Status', value: 'all', color: accent },
                  { label: 'Paid', value: 'paid', color: '#4CAF50' },
                  { label: 'Unpaid', value: 'unpaid', color: '#9E9E9E' },
                  { label: 'Overdue', value: 'overdue', color: '#F44336' },
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

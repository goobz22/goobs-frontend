/**
 * @fileoverview Storybook stories for the Metric primitives.
 *
 * The `components/Metric/` directory is a namespace rather than a single
 * component: it exports `MetricCard` (the compact single-KPI card, the
 * canonical "metric") and `MetricsAccordion` (the collapsible shell that
 * renders an array — or groups — of those cards). These stories use
 * `MetricCard` as the primary component and add `MetricsAccordion` variants
 * to show the array / grouped / children usage shapes.
 *
 * Themes follow the real prop API: `styles.theme === 'sacred'` selects the
 * dark/gold base palette, `'dark'` selects the dark-slate palette, and every
 * other value (undefined / 'light') resolves to the `[data-theme='light']`
 * override block. Each theme has its own override block in Card.module.css.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import MetricCard from './Card'
import MetricsAccordion from './Accordion'
import type { MetricCardData } from './types'

// --------------------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------------------

const sampleMetrics: MetricCardData[] = [
  {
    title: 'Total Revenue',
    value: '$125,000',
    trend: { value: 12.5, isPositive: true },
    icon: '💰',
  },
  {
    title: 'Active Users',
    value: 1234,
    subtitle: 'Active',
    trend: { value: 4.2, isPositive: true },
    icon: '👥',
  },
  {
    title: 'Churn',
    value: '2.1%',
    trend: { value: 0.8, isPositive: false },
    icon: '📉',
  },
]

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof MetricCard> = {
  title: 'Components/Metric',
  component: MetricCard,
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    subtitle: { control: 'text' },
    icon: { control: 'text' },
    dataField: { control: 'text' },
    trend: { control: 'object' },
    styles: {
      control: 'object',
      description:
        'Style configuration — theme (sacred selects the dark/gold palette; everything else resolves to light) plus color/width/height/padding/borderRadius CSS-var overrides.',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MetricCard>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * A metric card with light theme styling.
 */
export const LightTheme: Story = {
  args: {
    title: 'Active Users',
    value: 1234,
    icon: '👥',
    trend: { value: 12.5, isPositive: true },
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A metric card with the dark-slate theme on a dark canvas. `theme: 'dark'`
 * resolves to the `[data-theme='dark']` block — a dark surface card so it
 * reads correctly against the dark background.
 */
export const DarkTheme: Story = {
  args: {
    title: 'Active Users',
    value: 1234,
    icon: '👥',
    trend: { value: 12.5, isPositive: true },
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * A metric card with the "sacred" dark/gold theme.
 */
export const SacredTheme: Story = {
  args: {
    title: 'Active Users',
    value: 1234,
    icon: '⚙',
    trend: { value: 12.5, isPositive: true },
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CARD VARIANT STORIES
// --------------------------------------------------------------------------

/**
 * A bare metric card with no icon or trend — just a value and label.
 */
export const ValueOnly: Story = {
  name: 'Card/Value Only',
  args: {
    title: 'Open Tickets',
    value: 42,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Trend variants — positive (green up arrow) and negative (red down arrow).
 */
export const TrendStates: Story = {
  name: 'Card/Trend States',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <MetricCard
        title="Revenue"
        value="$125K"
        icon="💰"
        trend={{ value: 12.5, isPositive: true }}
        dataField="revenue"
        styles={{ theme: 'light' }}
      />
      <MetricCard
        title="Refunds"
        value="$3.2K"
        icon="↩"
        trend={{ value: 5.4, isPositive: false }}
        dataField="refunds"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Custom accent color + width via the CSS-var override knobs on `styles`.
 */
export const CustomStyling: Story = {
  name: 'Card/Custom Styling',
  args: {
    title: 'Conversion',
    value: '8.4%',
    icon: '🎯',
    trend: { value: 2.1, isPositive: true },
    styles: {
      theme: 'light',
      color: 'rgba(147, 51, 234, 1)',
      width: '220px',
      borderRadius: '16px',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCORDION STORIES
// --------------------------------------------------------------------------

/**
 * `MetricsAccordion` in data-driven array mode (light theme). Default state
 * is collapsed — open the toggle to reveal the responsive card row.
 */
export const AccordionArrayLight: Story = {
  name: 'Accordion/Array (Light)',
  render: () => (
    <div style={{ width: '640px' }}>
      <MetricsAccordion
        title="Metrics Summary"
        metrics={sampleMetrics}
        initiallyOpen
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * `MetricsAccordion` in sacred theme, grouped (labelled-row) mode.
 */
export const AccordionGroupedSacred: Story = {
  name: 'Accordion/Grouped (Sacred)',
  render: () => (
    <div style={{ width: '640px' }}>
      <MetricsAccordion
        title="Automation Metrics"
        initiallyOpen
        styles={{ theme: 'sacred' }}
        metrics={[
          {
            label: 'Templates',
            cards: [
              { title: 'Active', value: 12, icon: '✓' },
              { title: 'Draft', value: 3, icon: '✎' },
            ],
          },
          {
            label: 'By Target',
            cards: [
              { title: 'Email', value: 8, icon: '✉' },
              { title: 'SMS', value: 4, icon: '☎' },
            ],
          },
        ]}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * `MetricsAccordion` in children mode — the caller supplies the inner layout
 * (here a custom flex row of cards).
 */
export const AccordionChildren: Story = {
  name: 'Accordion/Children Mode',
  render: () => (
    <div style={{ width: '640px' }}>
      <MetricsAccordion
        title="Workspace Summary"
        initiallyOpen
        styles={{ theme: 'light' }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <MetricCard
            title="Active"
            value={12}
            icon="✓"
            dataField="active"
            styles={{ theme: 'light' }}
          />
          <MetricCard
            title="Pending"
            value={3}
            icon="⏳"
            dataField="pending"
            styles={{ theme: 'light' }}
          />
        </div>
      </MetricsAccordion>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

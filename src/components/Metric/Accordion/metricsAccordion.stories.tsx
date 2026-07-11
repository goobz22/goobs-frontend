/**
 * @fileoverview Storybook stories for the MetricsAccordion component.
 *
 * `MetricsAccordion` is the canonical collapsible shell for KPI / metric cards.
 * It has TWO usage shapes:
 *   1. `metrics` array mode — pass a flat `MetricCardData[]` (one responsive row)
 *      or a grouped `MetricsGroup[]` (multiple labelled rows); the component
 *      renders the `MetricCard`s itself.
 *   2. children mode — pass arbitrary children and control the inner layout.
 *
 * Themes follow the real prop API: `styles.theme === 'sacred'` selects the
 * dark/gold palette on the accordion wrapper, `'dark'` the dark-slate shell,
 * and every other value resolves to the light shell. The inner `MetricCard`s
 * honor the same `styles` object, so a `theme: 'dark'` gives dark-slate cards
 * inside the dark shell.
 *
 * Canvas pins use the SB10 API — `globals: { backgrounds: { value } }` — the
 * old `parameters.backgrounds.default` form is dead and silently leaves the
 * sacred #0e0e0e canvas under light-themed stories.
 *
 * Default state is COLLAPSED — the `initiallyOpen` prop renders the panel
 * expanded on first paint (used by the expanded-state stories here).
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import MetricsAccordion, { type MetricsGroup } from './index'
import type { MetricCardData } from '../types'

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
    title: 'Open Tickets',
    value: 42,
    trend: { value: 8.0, isPositive: false },
    icon: '🎫',
  },
  {
    title: 'Churn',
    value: '2.1%',
    trend: { value: 0.8, isPositive: false },
    icon: '📉',
  },
]

const groupedMetrics: MetricsGroup[] = [
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
      { title: 'Email', value: 8, icon: '✉', trend: { value: 3.5, isPositive: true } },
      { title: 'SMS', value: 4, icon: '☎' },
    ],
  },
  {
    label: 'Step Types',
    cards: [
      { title: 'Delay', value: 6, icon: '⏳' },
      { title: 'Branch', value: 2, icon: '⑂' },
    ],
  },
]

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------

const meta: Meta<typeof MetricsAccordion> = {
  title: 'Components/MetricsAccordion',
  component: MetricsAccordion,
  argTypes: {
    title: {
      control: 'text',
      description: 'Toggle label (default "Metrics Summary")',
    },
    initiallyOpen: {
      control: 'boolean',
      description: 'Render the panel expanded on first paint (default collapsed)',
    },
    collapsible: {
      control: 'boolean',
      description:
        'Force the accordion shell to render even in metrics-array mode (default true)',
    },
    responsiveCollapseOnTablet: {
      control: 'boolean',
      description:
        'In metrics-array mode, auto-render inside the accordion at ≤ 1023px width',
    },
    dataField: {
      control: 'text',
      description: 'Stable identifier surfaced as data-metrics-accordion-field',
    },
    metrics: {
      control: false,
      description:
        'Data-driven mode: a flat MetricCardData[] or a grouped MetricsGroup[]',
    },
    children: {
      control: false,
      description: 'Children mode: caller-supplied inner layout',
    },
    styles: {
      control: 'object',
      description:
        'Style configuration — theme (sacred selects the dark/gold palette, dark the dark-slate shell; everything else resolves to the light shell) plus an optional accent color.',
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '680px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MetricsAccordion>

// --------------------------------------------------------------------------
// DEFAULT
// --------------------------------------------------------------------------

/**
 * The default accordion: data-driven array mode, light shell, expanded so the
 * responsive card row is visible.
 */
export const Default: Story = {
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

/**
 * Light theme — the default shell. `styles.theme` resolves any non-sacred
 * value to the light `[data-theme='light']` block.
 */
export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Dark theme — the accordion shell renders its own `[data-theme='dark']`
 * dark-slate block, and the `styles` object passes through to the inner
 * `MetricCard`s, which do the same for dark-slate cards. Shot on the dark
 * canvas so the shell and cards read correctly.
 */
export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: true,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Sacred theme — the dark/gold palette on both the accordion shell and its
 * cards.
 */
export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  args: {
    title: 'Automation Metrics',
    metrics: sampleMetrics,
    initiallyOpen: true,
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * Collapsed state — the default. Only the toggle button is shown; the panel is
 * not mounted until opened.
 */
export const Collapsed: Story = {
  name: 'States/Collapsed',
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: false,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Expanded state — `initiallyOpen` renders the panel open on first paint.
 */
export const Expanded: Story = {
  name: 'States/Expanded',
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Grouped mode — a `MetricsGroup[]` renders multiple labelled rows of cards
 * (e.g. automations: Templates / By Target / Step Types).
 */
export const GroupedMode: Story = {
  name: 'States/Grouped Mode',
  args: {
    title: 'Automation Metrics',
    metrics: groupedMetrics,
    initiallyOpen: true,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Children mode — the caller supplies the inner layout instead of a `metrics`
 * array. The accordion is always rendered in this mode.
 */
export const ChildrenMode: Story = {
  name: 'States/Children Mode',
  render: () => (
    <MetricsAccordion
      title="Workspace Summary"
      initiallyOpen
      styles={{ theme: 'light' }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>12</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Active Projects</div>
        </div>
        <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>3</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Pending Reviews</div>
        </div>
        <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>98%</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Uptime</div>
        </div>
      </div>
    </MetricsAccordion>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Accent-color override — `styles.color` sets the `--ma-accent` CSS custom
 * property on the accordion shell.
 */
export const CustomAccent: Story = {
  name: 'States/Custom Accent',
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: true,
    dataField: 'workspace-metrics',
    styles: { theme: 'light', color: 'rgba(147, 51, 234, 1)' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A11y — `headingLevel` wraps the toggle in a real `<h3>` so the collapsible
 * section is exposed as a document heading (WCAG 1.3.1 / SEO / the WAI-ARIA
 * accordion pattern). The button keeps its disclosure semantics
 * (`aria-expanded`/`aria-controls`) and test selectors inside the heading.
 * Omitting the prop (every other story) renders the bare button unchanged, so
 * a context-agnostic default can't silently rewrite consumers' outlines.
 */
export const A11yHeadingLevel: Story = {
  name: 'A11y/Heading Level',
  args: {
    title: 'Metrics Summary',
    metrics: sampleMetrics,
    initiallyOpen: true,
    headingLevel: 3,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A11y — semantic list markup. In `metrics` mode the KPI strip renders as a
 * `<ul>` of `<li>` cards so screen readers announce "list, N items" (WCAG
 * 1.3.1); in grouped mode each `<ul>` is `aria-labelledby` its visible group
 * label, tying the list to its heading text programmatically. Combined here
 * with `headingLevel` for the full accordion-pattern semantics.
 */
export const A11yGroupedSemantics: Story = {
  name: 'A11y/Grouped List Semantics',
  args: {
    title: 'Automation Metrics',
    metrics: groupedMetrics,
    initiallyOpen: true,
    headingLevel: 3,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

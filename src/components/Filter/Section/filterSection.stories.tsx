/**
 * @fileoverview Storybook stories for the FilterSection component.
 *
 * FilterSection is a fully prop-driven filter / search row (search box, action
 * buttons, dropdowns, date ranges, boolean toggles and labelled chip clusters).
 * Every section is optional and renders only when its prop is provided, and the
 * whole row can optionally be wrapped in a collapsible accordion shell.
 *
 * NOTE ON THEMES: FilterSection's `styles.theme` prop only accepts
 * `'light' | 'sacred'` (see `FilterSectionProps` in ./index.tsx). Any non-sacred
 * value resolves to the light surface, so the "dark" showcase below renders the
 * (only available) light surface on a dark Storybook backdrop rather than
 * inventing an unsupported `theme: 'dark'` value.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import FilterSection, {
  type FilterDropdownDef,
  type FilterChipClusterDef,
  type FilterDateRangeDef,
  type FilterToggleDef,
  type FilterButtonDef,
} from './index'
import type { DropdownOption } from '../../Field/Dropdown/SearchableSimple'

const meta: Meta<typeof FilterSection> = {
  title: 'Components/FilterSection',
  component: FilterSection,
  argTypes: {
    searchPlaceholder: { control: 'text' },
    title: { control: 'text' },
    collapsible: { control: 'boolean' },
    initiallyOpen: { control: 'boolean' },
    styles: {
      control: 'object',
      description: "Styling options — only `theme: 'light' | 'sacred'`",
    },
    onSearchChange: { control: false },
    dropdowns: { control: false },
    chipClusters: { control: false },
    dateRanges: { control: false },
    toggles: { control: false },
    buttons: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: '760px', maxWidth: '100%', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FilterSection>

// --------------------------------------------------------------------------
// SAMPLE FILTER DATA
// --------------------------------------------------------------------------

// DropdownOption exposes `value` (the display label) + optional `_id` (the
// stable key resolved by the searchable variant's onChange payload). State
// defaults below track each option's `_id`.
const CATEGORY_OPTIONS: DropdownOption[] = [
  { _id: 'all', value: 'All Categories' },
  { _id: 'onboarding', value: 'Onboarding' },
  { _id: 'compliance', value: 'Compliance' },
  { _id: 'safety', value: 'Safety' },
  { _id: 'leadership', value: 'Leadership' },
]

const LEVEL_OPTIONS: DropdownOption[] = [
  { _id: 'all', value: 'All Levels' },
  { _id: 'beginner', value: 'Beginner' },
  { _id: 'intermediate', value: 'Intermediate' },
  { _id: 'advanced', value: 'Advanced' },
]

// A long list so `variant: 'searchable'` shows the type-to-filter menu.
const INSTRUCTOR_OPTIONS: DropdownOption[] = [
  { _id: 'all', value: 'All Instructors' },
  { _id: 'i1', value: 'Amelia Stone' },
  { _id: 'i2', value: 'Benjamin Cole' },
  { _id: 'i3', value: 'Carmen Diaz' },
  { _id: 'i4', value: 'Derek Nguyen' },
  { _id: 'i5', value: 'Elena Petrov' },
  { _id: 'i6', value: 'Frank Okafor' },
  { _id: 'i7', value: 'Grace Lin' },
  { _id: 'i8', value: 'Hassan Ali' },
]

const STATUS_CHIPS: FilterChipClusterDef['options'] = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
]

const LEVEL_CHIPS: FilterChipClusterDef['options'] = [
  { label: 'Beginner', value: 'beginner', color: '#16a34a' },
  { label: 'Intermediate', value: 'intermediate', color: '#f59e0b' },
  { label: 'Advanced', value: 'advanced', color: '#dc2626' },
]

const TAG_CHIPS: FilterChipClusterDef['options'] = [
  { label: 'Featured', value: 'featured' },
  { label: 'New', value: 'new' },
  { label: 'Certification', value: 'certification' },
  { label: 'Required', value: 'required' },
]

// --------------------------------------------------------------------------
// STATEFUL WRAPPER
// --------------------------------------------------------------------------
// FilterSection's inputs are controlled, so the demos wire the props to local
// state. Every prop passed here exists on FilterSectionProps.

interface DemoConfig {
  theme?: 'light' | 'sacred'
  withSearch?: boolean
  withButtons?: boolean
  withDropdowns?: boolean
  withSearchableDropdown?: boolean
  withDateRange?: boolean
  withToggles?: boolean
  withChips?: boolean
  collapsible?: boolean
  initiallyOpen?: boolean
  title?: string
  surface?: boolean
  withBelowSearch?: boolean
}

const FilterSectionDemo = ({
  theme = 'light',
  withSearch = true,
  withButtons = true,
  withDropdowns = true,
  withSearchableDropdown = false,
  withDateRange = false,
  withToggles = false,
  withChips = true,
  collapsible = false,
  initiallyOpen = true,
  title,
  surface = false,
  withBelowSearch = false,
}: DemoConfig): React.JSX.Element => {
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState('all')
  const [level, setLevel] = React.useState('all')
  const [instructor, setInstructor] = React.useState('all')
  const [status, setStatus] = React.useState<string[]>(['published'])
  const [levelChips, setLevelChips] = React.useState<string[]>([])
  const [tags, setTags] = React.useState<string[]>(['featured'])
  const [range, setRange] = React.useState<{
    start: Date | null
    end: Date | null
  }>({ start: null, end: null })
  const [onlyMine, setOnlyMine] = React.useState(false)
  const [showArchived, setShowArchived] = React.useState(false)

  const dropdowns: FilterDropdownDef[] = []
  if (withDropdowns) {
    dropdowns.push(
      {
        label: 'Category',
        value: category,
        options: CATEGORY_OPTIONS,
        onChange: setCategory,
        variant: 'simple',
      },
      {
        label: 'Level',
        value: level,
        options: LEVEL_OPTIONS,
        onChange: setLevel,
        variant: 'simple',
      }
    )
  }
  if (withSearchableDropdown) {
    dropdowns.push({
      label: 'Instructor',
      value: instructor,
      options: INSTRUCTOR_OPTIONS,
      onChange: setInstructor,
      variant: 'searchable',
      placeholder: 'Search instructors...',
    })
  }

  const dateRanges: FilterDateRangeDef[] = withDateRange
    ? [
        {
          startLabel: 'Published After',
          endLabel: 'Published Before',
          value: range,
          onChange: setRange,
        },
      ]
    : []

  const toggles: FilterToggleDef[] = withToggles
    ? [
        { label: 'Only my courses', value: onlyMine, onChange: setOnlyMine },
        {
          label: 'Show archived',
          value: showArchived,
          onChange: setShowArchived,
        },
      ]
    : []

  const chipClusters: FilterChipClusterDef[] = []
  if (withChips) {
    chipClusters.push(
      {
        label: 'Status',
        options: STATUS_CHIPS,
        selectedValues: status,
        onChange: setStatus,
        exclusive: true,
      },
      {
        label: 'Level',
        options: LEVEL_CHIPS,
        selectedValues: levelChips,
        onChange: setLevelChips,
        exclusive: false,
      },
      {
        label: 'Tags',
        options: TAG_CHIPS,
        selectedValues: tags,
        onChange: setTags,
        exclusive: false,
      }
    )
  }

  const buttons: FilterButtonDef[] = withButtons
    ? [
        {
          text: '+ Create Course',
          onClick: () => console.log('create clicked'),
          action: 'create',
          subject: 'course',
        },
      ]
    : []

  return (
    <FilterSection
      {...(withSearch && {
        searchValue: search,
        onSearchChange: setSearch,
        searchPlaceholder: 'Search courses...',
      })}
      {...(dropdowns.length > 0 && { dropdowns })}
      {...(dateRanges.length > 0 && { dateRanges })}
      {...(toggles.length > 0 && { toggles })}
      {...(chipClusters.length > 0 && { chipClusters })}
      {...(buttons.length > 0 && { buttons })}
      collapsible={collapsible}
      initiallyOpen={initiallyOpen}
      {...(title !== undefined && { title })}
      {...(surface && { surface: true })}
      {...(withBelowSearch && {
        belowSearch: (
          <div
            data-testid="demo-below-search"
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
          >
            <button type="button">All</button>
            <button type="button">Active</button>
            <button type="button">Archived</button>
          </div>
        ),
      })}
      styles={{ theme }}
    />
  )
}

// --------------------------------------------------------------------------
// DEFAULT
// --------------------------------------------------------------------------

/** A representative filter row: search box, a create button, two dropdowns and
 *  three chip clusters (exclusive status + multi-select level/tags). */
export const Default: Story = {
  name: 'Default',
  render: () => <FilterSectionDemo />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

/** Light theme (the default surface). */
export const LightTheme: Story = {
  name: 'Themes/Light',
  render: () => <FilterSectionDemo theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * "Dark" showcase. FilterSection has no `theme: 'dark'` value — its theme prop
 * accepts only `'light' | 'sacred'` — so this renders the light surface on a
 * dark Storybook backdrop rather than passing an unsupported theme value.
 * The light theme is designed for light surfaces (dark text / blue chips), so
 * on the dark canvas the demo sits inside a solid white card — the way a
 * light-themed filter row actually appears inside a dark app shell. Rendering
 * the transparent light row directly on #111827 would put dark text on a dark
 * canvas (a real WCAG failure, not a component bug).
 */
export const DarkBackdrop: Story = {
  name: 'Themes/Dark Backdrop',
  render: () => (
    <div
      style={{
        background: '#ffffff',
        padding: '1.25rem',
        borderRadius: '12px',
      }}
    >
      <FilterSectionDemo theme="light" />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

/** Sacred theme (gold accented surface — designed for the near-black canvas). */
export const SacredTheme: Story = {
  name: 'Themes/Sacred',
  render: () => <FilterSectionDemo theme="sacred" />,
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/** Search box only — no filter controls, buttons or chips provided, so only the
 *  search row renders. */
export const SearchOnly: Story = {
  name: 'States/Search Only',
  render: () => (
    <FilterSectionDemo
      withButtons={false}
      withDropdowns={false}
      withChips={false}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** The full kitchen-sink row: search + create button, simple + searchable
 *  dropdowns, a date range, boolean toggles and all three chip clusters. */
export const AllControls: Story = {
  name: 'States/All Controls',
  render: () => (
    <FilterSectionDemo
      withSearchableDropdown
      withDateRange
      withToggles
      title="Course Filters"
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** Wrapped in the collapsible accordion shell, expanded on first paint (the
 *  component default for filters). Click the "Course Filters" header to toggle. */
export const CollapsibleOpen: Story = {
  name: 'States/Collapsible (Open)',
  render: () => (
    <FilterSectionDemo
      collapsible
      initiallyOpen
      withDateRange
      title="Course Filters"
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

/** Collapsible shell that starts collapsed — only the toggle header renders
 *  until it is opened. */
export const CollapsibleClosed: Story = {
  name: 'States/Collapsible (Closed)',
  render: () => (
    <FilterSectionDemo
      collapsible
      initiallyOpen={false}
      withDateRange
      title="Course Filters"
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Surface variant — the `surface` prop gives the (non-collapsible) row a
 * self-contained padded/bordered/tinted card so it groups visually like a
 * MetricsAccordion sitting beside it, with a capped search width so a lone
 * search box doesn't stretch full-bleed. DataGrid and every existing callsite
 * omit `surface`, so their bare edge-to-edge layout is unchanged. Shown on the
 * sacred surface / dark backdrop, mirroring the invoicing workspace usage.
 */
export const SurfaceVariant: Story = {
  name: 'States/Surface',
  render: () => (
    <FilterSectionDemo theme="sacred" surface withButtons={false} />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * belowSearch slot — a sub-nav row rendered INSIDE the filter surface, directly
 * below the search bar (above the chip filters). Lets a workspace's section
 * sub-nav live inside the filter card instead of floating above it.
 */
export const BelowSearchSlot: Story = {
  name: 'States/Below-Search Slot',
  render: () => (
    <FilterSectionDemo
      theme="sacred"
      surface
      withBelowSearch
      withButtons={false}
    />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

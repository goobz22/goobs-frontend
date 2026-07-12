/**
 * @fileoverview Storybook stories for the BigCalendar component.
 * BigCalendar renders a month / week / day calendar with a toolbar, selectable
 * cells, and tooltip'd events. Events are passed as a `CalendarEvent[]` and the
 * displayed period is anchored by `currentDate`. These stories use a fixed
 * `currentDate` (June 2026) with a small realistic events array so the calendar
 * is deterministic across the light / dark / sacred themes and the three views.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { userEvent, within, expect, fn, waitFor } from 'storybook/test'
import BigCalendar, { type CalendarEvent } from './index'

// Fixed anchor so the rendered period is stable in snapshots.
const anchor = new Date(2026, 5, 15) // 2026-06-15 (month is 0-indexed)

const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 5, day, hour, minute)

const sampleEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Team Standup',
    startDate: at(15, 9, 0),
    endDate: at(15, 9, 30),
    // Tailwind blue-700: 6.70 white-on-bg contrast (event text is hardcoded white).
    color: '#1d4ed8',
    resource: 'Engineering',
    description: 'Daily sync',
    type: 'meeting',
  },
  {
    id: 'e2',
    title: 'Client Onboarding',
    startDate: at(15, 11, 0),
    endDate: at(15, 12, 30),
    // Tailwind green-700: 5.02 white-on-bg contrast.
    color: '#15803d',
    resource: 'Acme Corp',
    description: 'Kickoff walkthrough',
    type: 'meeting',
  },
  {
    id: 'e3',
    title: 'Invoice Run',
    startDate: at(16, 14, 0),
    endDate: at(16, 15, 0),
    // Tailwind amber-700: 5.02 white-on-bg contrast.
    color: '#b45309',
    resource: 'Billing',
    type: 'task',
  },
  {
    id: 'e4',
    title: 'Quarterly Review',
    startDate: at(18, 13, 0),
    endDate: at(18, 16, 0),
    // Tailwind violet-700: 7.10 white-on-bg contrast.
    color: '#6d28d9',
    resource: 'Leadership',
    description: 'Q2 metrics',
    type: 'meeting',
  },
  {
    id: 'e5',
    title: 'Company Holiday',
    startDate: at(22, 0, 0),
    endDate: at(22, 23, 59),
    // Tailwind red-700: 6.47 white-on-bg contrast.
    color: '#b91c1c',
    allDay: true,
    type: 'holiday',
  },
]

const meta: Meta<typeof BigCalendar> = {
  title: 'Components/BigCalendar',
  component: BigCalendar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    events: { control: 'object' },
    view: { control: { type: 'select' }, options: ['month', 'week', 'day'] },
    showToolbar: { control: 'boolean' },
    showFilters: { control: 'boolean' },
    styles: { control: 'object' },
    onEventClick: { action: 'eventClicked' },
    onCellClick: { action: 'cellClicked' },
    onViewChange: { action: 'viewChanged' },
    onDateChange: { action: 'dateChanged' },
  },
  decorators: [
    Story => (
      <div style={{ height: '720px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// --------------------------------------------------------------------------
// BASIC THEME STORIES — month view
// --------------------------------------------------------------------------

export const Default: Story = {
  name: 'Month View (Light)',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Month View (Dark)',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Month View (Sacred)',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'sacred' },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// VIEW VARIATIONS
// --------------------------------------------------------------------------

export const WeekView: Story = {
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'week',
    startHour: 7,
    endHour: 19,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const DayView: Story = {
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'day',
    startHour: 7,
    endHour: 19,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TOOLBAR / FILTERS TOGGLES
// --------------------------------------------------------------------------

export const NoToolbar: Story = {
  name: 'Without Toolbar',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    showToolbar: false,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const WithFilters: Story = {
  name: 'With Filters Panel',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    showFilters: true,
    availableResources: [
      { id: 'eng', title: 'Engineering' },
      { id: 'billing', title: 'Billing' },
    ],
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// EMPTY STATE
// --------------------------------------------------------------------------

export const NoEvents: Story = {
  args: {
    events: [],
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY (WCAG 2.2) — each play function is a regression test that
// fails if the a11y wiring regresses.
// --------------------------------------------------------------------------

/**
 * The month view is a WAI-ARIA grid: `role="grid"` (multi-selectable, labelled
 * with the month), seven `columnheader`s named by full weekday, and each day a
 * `gridcell` whose accessible name is the full date + event count. The selected
 * day owns the single roving tab stop (`tabindex="0"`). A polite live region
 * echoes the current period for screen readers (WCAG 1.3.1, 4.1.2, 4.1.3).
 */
export const A11yGridSemantics: Story = {
  name: 'A11y/Grid Semantics',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const grid = canvas.getByRole('grid')
    expect(grid).toHaveAttribute('aria-multiselectable', 'true')
    expect(grid).toHaveAttribute(
      'aria-label',
      expect.stringContaining('June 2026')
    )

    const headers = canvas.getAllByRole('columnheader')
    expect(headers).toHaveLength(7)
    expect(headers[0]).toHaveAttribute('aria-label', 'Sunday')
    expect(headers[6]).toHaveAttribute('aria-label', 'Saturday')

    // June 15 is the selected day → carries the roving tab stop + event count.
    const selectedCell = canvas.getByRole('gridcell', {
      name: /Monday, June 15, 2026, 2 events/,
    })
    expect(selectedCell).toHaveAttribute('tabindex', '0')

    // Live region announces the period.
    expect(canvas.getByText('Month view, June 2026')).toBeInTheDocument()
  },
}

/**
 * Full keyboard grid navigation (WCAG 2.1.1): arrow keys move the roving focus
 * by day / week; the moved-to cell becomes the tab stop and receives focus.
 */
export const A11yKeyboardNavigation: Story = {
  name: 'A11y/Keyboard Navigation',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const start = canvas.getByRole('gridcell', { name: /June 15, 2026/ })
    start.focus()
    expect(start).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /June 16, 2026/ })
      ).toHaveFocus()
    )

    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /June 23, 2026/ })
      ).toHaveFocus()
    )
  },
}

/**
 * Enter/Space activate a focused day cell exactly like a click, toggling the
 * selection state which is conveyed programmatically via `aria-selected`
 * (not color alone — WCAG 1.4.1).
 */
export const A11ySelectionAnnounced: Story = {
  name: 'A11y/Selection Announced',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const cell = canvas.getByRole('gridcell', { name: /June 23, 2026/ })
    expect(cell).toHaveAttribute('aria-selected', 'false')

    cell.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(cell).toHaveAttribute('aria-selected', 'true'))
  },
}

/**
 * Clickable events render as real `<button>`s (keyboard-operable) whose full
 * accessible name — title, resource, description, and start–end time — rides on
 * `aria-label`, because the hover Tooltip is not exposed to assistive tech
 * (WCAG 2.1.1, 4.1.2).
 */
export const A11yEventButtons: Story = {
  name: 'A11y/Event Accessible Names',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    onEventClick: fn(),
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const eventButton = canvas.getByRole('button', {
      name: /Team Standup - Engineering, Daily sync/,
    })
    expect(eventButton).toHaveAttribute(
      'aria-label',
      expect.stringContaining('9:00 AM to')
    )

    await userEvent.click(eventButton)
    expect(args.onEventClick).toHaveBeenCalledTimes(1)
  },
}

/**
 * Week/day hour cells are keyboard-operable `gridcell`s inside a `role="grid"`
 * (a cell — not a `role="button"` — so it can legally contain a clickable event
 * `<button>` without invalid nested-interactive markup): full date + hour
 * accessible name, `aria-selected` for the toggle selection, and Enter to
 * activate (WCAG 2.1.1, 4.1.2, 1.4.1).
 */
export const A11yHourCellKeyboard: Story = {
  name: 'A11y/Hour Cell Keyboard',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'day',
    startHour: 7,
    endHour: 19,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const hourCell = canvas.getByRole('gridcell', {
      name: /Monday, June 15, 2026, 9 AM/,
    })
    expect(hourCell).toHaveAttribute('aria-selected', 'false')

    hourCell.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(hourCell).toHaveAttribute('aria-selected', 'true')
    )
  },
}

/**
 * Week-view hour cells are a 2-D ARIA `grid` (row = day, cell = hour) sharing
 * ONE roving tab stop. Left/Right move the focused cell by day, Up/Down by hour,
 * and Home/End jump to the first / last hour of the day (WCAG 2.1.1;
 * `handleTimeCellKeyDown` day-nav branch). The grid role (not toolbar) is what
 * lets an hour `gridcell` legally contain a clickable event `<button>`.
 */
export const A11yWeekDayNavigation: Story = {
  name: 'A11y/Week Day Navigation',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'week',
    startHour: 7,
    endHour: 19,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The hour cells live inside a labelled grid (2-D composite keyboard model).
    expect(canvas.getByRole('grid')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('week of June 14, 2026')
    )

    const start = canvas.getByRole('gridcell', {
      name: /Monday, June 15, 2026, 9 AM/,
    })
    start.focus()
    expect(start).toHaveFocus()

    // Right → next day, same hour.
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /Tuesday, June 16, 2026, 9 AM/ })
      ).toHaveFocus()
    )

    // Left → back to the original day.
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(start).toHaveFocus())

    // Down → next hour, same day.
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /Monday, June 15, 2026, 10 AM/ })
      ).toHaveFocus()
    )

    // Home → first hour of the day (7 AM).
    await userEvent.keyboard('{Home}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /Monday, June 15, 2026, 7 AM/ })
      ).toHaveFocus()
    )

    // End → last hour of the day (6 PM, since endHour 19 is exclusive).
    await userEvent.keyboard('{End}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /Monday, June 15, 2026, 6 PM/ })
      ).toHaveFocus()
    )
  },
}

/**
 * Month PageUp/PageDown change the displayed month and carry focus to the
 * equivalent day of the new month (WCAG 2.1.1; `handleMonthCellKeyDown`
 * Page branch + the roving-focus follow across a period change).
 */
export const A11yMonthPageNavigation: Story = {
  name: 'A11y/Month Page Navigation',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const start = canvas.getByRole('gridcell', { name: /June 15, 2026/ })
    start.focus()
    expect(start).toHaveFocus()

    // PageDown → next month; focus follows to July 15.
    await userEvent.keyboard('{PageDown}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /July 15, 2026/ })
      ).toHaveFocus()
    )
    // The grid label + live region now announce the new period.
    expect(canvas.getByRole('grid')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('July 2026')
    )

    // PageUp → previous month; focus follows back to June 15.
    await userEvent.keyboard('{PageUp}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /June 15, 2026/ })
      ).toHaveFocus()
    )
  },
}

/**
 * Month Home/End jump the roving focus to the first (Sunday) / last (Saturday)
 * cell of the current week (WCAG 2.1.1; `handleMonthCellKeyDown` Home/End).
 */
export const A11yMonthHomeEnd: Story = {
  name: 'A11y/Month Home End',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const start = canvas.getByRole('gridcell', { name: /June 16, 2026/ })
    start.focus()
    expect(start).toHaveFocus()

    // Home → Sunday of that week (June 14).
    await userEvent.keyboard('{Home}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /June 14, 2026/ })
      ).toHaveFocus()
    )

    // End → Saturday of that week (June 20).
    await userEvent.keyboard('{End}')
    await waitFor(() =>
      expect(
        canvas.getByRole('gridcell', { name: /June 20, 2026/ })
      ).toHaveFocus()
    )
  },
}

/**
 * "Today" and the current hour are conveyed programmatically (not by color
 * alone — WCAG 1.4.1): today's month gridcell carries `aria-current="date"` and
 * the current hour cell carries `aria-current="time"`. Uses the real current
 * date so exactly one of each is present.
 */
export const A11yCurrentState: Story = {
  name: 'A11y/Current Date + Hour',
  args: {
    events: [],
    currentDate: new Date(),
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  // Uses the real current date (so "today" is present) — disable the visual
  // snapshot so it doesn't diff every day; the play assertion is the test.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvasElement }) => {
    // Today's cell in the month grid.
    const today = canvasElement.querySelector(
      '[role="gridcell"][aria-current="date"]'
    )
    expect(today).not.toBeNull()
  },
}

/**
 * Day view surfaces the current hour with `aria-current="time"` (WCAG 1.4.1).
 * Full 0–24 range guarantees the current hour cell is rendered.
 */
export const A11yCurrentHour: Story = {
  name: 'A11y/Current Hour',
  args: {
    events: [],
    currentDate: new Date(),
    view: 'day',
    startHour: 0,
    endHour: 24,
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  // Real current date → disable the daily-changing visual snapshot.
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvasElement }) => {
    const currentHour = canvasElement.querySelector(
      '[role="gridcell"][aria-current="time"]'
    )
    expect(currentHour).not.toBeNull()
  },
}

/**
 * The prev/next nav buttons carry unit-aware accessible names that track the
 * active view — "Previous month" / "Next month" become "Previous week" /
 * "Next week" after the view toggle (WCAG 2.4.6).
 */
export const A11yNavButtonLabels: Story = {
  name: 'A11y/Nav Button Labels',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(
      canvas.getByRole('button', { name: 'Previous month' })
    ).toBeInTheDocument()
    expect(
      canvas.getByRole('button', { name: 'Next month' })
    ).toBeInTheDocument()
    expect(
      canvas.getByRole('button', { name: 'Go to today' })
    ).toBeInTheDocument()

    // Switch to week view via the toggle; the nav labels re-unit.
    await userEvent.click(canvas.getByRole('button', { name: 'Week' }))
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Previous week' })
      ).toBeInTheDocument()
    )
    expect(
      canvas.getByRole('button', { name: 'Next week' })
    ).toBeInTheDocument()
  },
}

/**
 * The month/week/day view toggle is wrapped in a `role="group"` with the
 * accessible name "Calendar view" so the related toggles are announced as a
 * named set (WCAG 1.3.1).
 */
export const A11yViewSwitcherGroup: Story = {
  name: 'A11y/View Switcher Group',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const group = canvas.getByRole('group', { name: 'Calendar view' })
    expect(within(group).getByRole('button', { name: 'Month' })).toBeInTheDocument()
    expect(within(group).getByRole('button', { name: 'Week' })).toBeInTheDocument()
    expect(within(group).getByRole('button', { name: 'Day' })).toBeInTheDocument()
  },
}

/**
 * The whole component is a `region` landmark whose accessible name is the
 * current period, and the period is rendered as a real heading element (SEO
 * structure + screen-reader heading navigation) — WCAG 1.3.1 / 2.4.6.
 */
export const A11yRegionAndHeading: Story = {
  name: 'A11y/Region + Heading',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Region landmark, named by the period heading.
    expect(
      canvas.getByRole('region', { name: /June 2026/ })
    ).toBeInTheDocument()

    // A real level-2 heading carries the period (default headingLevel).
    expect(
      canvas.getByRole('heading', { level: 2, name: /June 2026/ })
    ).toBeInTheDocument()
  },
}

/**
 * The filter panel's "Clear all filters" control is a real, labelled `<button>`
 * (keyboard-operable, named) and resets the filters to empty (WCAG 2.1.1,
 * 4.1.2, 1.1.1). It lives in the expanded panel, NOT the Accordion summary, so
 * it is never nested inside the disclosure `<button>` (invalid nested-interactive
 * markup). Seeded with one active filter so the control renders.
 */
export const A11yClearFilters: Story = {
  name: 'A11y/Clear Filters Button',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    showFilters: true,
    filters: { resources: ['eng'] },
    availableResources: [{ id: 'eng', title: 'Engineering' }],
    onFiltersChange: fn(),
    styles: { theme: 'light' },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    const clearButton = canvas.getByRole('button', {
      name: 'Clear all filters',
    })
    expect(clearButton).toBeInTheDocument()

    // Regression guard for the nested-interactive bug: the clear control must NOT
    // be a descendant of the Accordion disclosure toggle <button>
    // (data-action="toggle"). A <button> inside a <button> is invalid HTML and
    // keyboard-inoperable in some browsers.
    expect(clearButton.closest('[data-action="toggle"]')).toBeNull()

    await userEvent.click(clearButton)
    await waitFor(() =>
      expect(args.onFiltersChange).toHaveBeenCalledWith({})
    )
  },
}

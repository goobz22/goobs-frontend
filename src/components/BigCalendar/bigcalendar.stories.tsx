/**
 * @fileoverview Storybook stories for the BigCalendar component.
 * BigCalendar renders a month / week / day calendar with a toolbar, selectable
 * cells, and tooltip'd events. Events are passed as a `CalendarEvent[]` and the
 * displayed period is anchored by `currentDate`. These stories use a fixed
 * `currentDate` (June 2026) with a small realistic events array so the calendar
 * is deterministic across the light / dark / sacred themes and the three views.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
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
    color: '#2196f3',
    resource: 'Engineering',
    description: 'Daily sync',
    type: 'meeting',
  },
  {
    id: 'e2',
    title: 'Client Onboarding',
    startDate: at(15, 11, 0),
    endDate: at(15, 12, 30),
    color: '#22c55e',
    resource: 'Acme Corp',
    description: 'Kickoff walkthrough',
    type: 'meeting',
  },
  {
    id: 'e3',
    title: 'Invoice Run',
    startDate: at(16, 14, 0),
    endDate: at(16, 15, 0),
    color: '#f59e0b',
    resource: 'Billing',
    type: 'task',
  },
  {
    id: 'e4',
    title: 'Quarterly Review',
    startDate: at(18, 13, 0),
    endDate: at(18, 16, 0),
    color: '#8b5cf6',
    resource: 'Leadership',
    description: 'Q2 metrics',
    type: 'meeting',
  },
  {
    id: 'e5',
    title: 'Company Holiday',
    startDate: at(22, 0, 0),
    endDate: at(22, 23, 59),
    color: '#ef4444',
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
  tags: ['autodocs'],
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
}

export const DarkTheme: Story = {
  name: 'Month View (Dark)',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'dark' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const SacredTheme: Story = {
  name: 'Month View (Sacred)',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'sacred' },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// VIEW VARIATIONS
// --------------------------------------------------------------------------

export const WeekView: Story = {
  name: 'Week View',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'week',
    startHour: 7,
    endHour: 19,
    styles: { theme: 'light' },
  },
}

export const DayView: Story = {
  name: 'Day View',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'day',
    startHour: 7,
    endHour: 19,
    styles: { theme: 'light' },
  },
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
}

export const WithFilters: Story = {
  name: 'With Filters Panel',
  args: {
    events: sampleEvents,
    currentDate: anchor,
    view: 'month',
    showFilters: true,
    availableEventTypes: ['meeting', 'task', 'holiday'],
    availableResources: [
      { id: 'eng', title: 'Engineering' },
      { id: 'billing', title: 'Billing' },
    ],
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// EMPTY STATE
// --------------------------------------------------------------------------

export const NoEvents: Story = {
  name: 'No Events',
  args: {
    events: [],
    currentDate: anchor,
    view: 'month',
    styles: { theme: 'light' },
  },
}

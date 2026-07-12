'use client'

import React, { useMemo, useState, useRef, useEffect, useId } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parse,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addWeeks,
  subWeeks,
  addDays,
  differenceInCalendarDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
  setHours,
  setMinutes,
  getHours,
} from 'date-fns'
import Paper, { type PaperProps } from '../Paper'
import Typography from '../Typography'
import StyledTooltip, { type TooltipProps } from '../Tooltip'
import ToggleButton, {
  ToggleButtonGroup,
  type ToggleButtonProps,
} from '../ToggleButton'
import { CalendarFilters, CalendarFilterOptions } from './CalendarFilters'
import { emitDiag } from '../../utils/diag'
import cssStyles from './BigCalendar.module.css'

import * as Icons from '../Icons'
const {
  CalendarMonthIcon,
  DateRangeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} = Icons

export type CalendarView = 'month' | 'week' | 'day'

export type { CalendarFilterOptions } from './CalendarFilters'

/**
 * Caller-supplied style overrides for BigCalendar. Theme variant + visual
 * tokens now live in BigCalendar.module.css (data-theme on the root); this
 * type preserves the public `styles` prop surface so callers keep their
 * existing overrides. `theme` selects the data-theme variant; the remaining
 * fields are passed through to child components (Paper / Typography) or used
 * as layout overrides on the root.
 */
export interface BigCalendarStyles {
  /** `data-theme` variant on the root and every themed child (Paper, toggles, icons). Default 'light'. */
  theme?: 'light' | 'dark' | 'sacred'

  // Container / typography passthrough
  /** Root container background, applied inline (theme surface default otherwise). */
  backgroundColor?: string
  /** Root container corner radius, applied inline. */
  borderRadius?: string
  /** Root font family, applied inline; also forwarded to the calendar's internal Typography text. */
  fontFamily?: string
  /** Base text size forwarded to the calendar's internal Typography; the per-element sizes the calendar sets win. */
  fontSize?: string
  /** Base text weight forwarded to the calendar's internal Typography; the per-element weights the calendar sets win. */
  fontWeight?: string | number
  /** Base line-height forwarded to the calendar's internal Typography (event chips set their own). */
  lineHeight?: string
  /** Base text color forwarded to the calendar's internal Typography (event chips force white; headers/dates set their own weights). */
  color?: string

  // Layout overrides applied to the root container
  /** Root margin shorthand, applied inline. */
  margin?: string
  /** Root top margin, applied inline. */
  marginTop?: string
  /** Root bottom margin, applied inline. */
  marginBottom?: string
  /** Root left margin, applied inline. */
  marginLeft?: string
  /** Root right margin, applied inline. */
  marginRight?: string
  /** Root max-width, applied inline. */
  maxWidth?: string
  /** Root min-width, applied inline. */
  minWidth?: string
  /** Root max-height, applied inline. */
  maxHeight?: string
  /** Root min-height, applied inline. */
  minHeight?: string
  /** @deprecated Not read by the root container — it only flows into the internal Typography text width; scheduled for removal. */
  width?: string
  /** @deprecated No-op — not read by the component; scheduled for removal. */
  height?: string

  // Toolbar overrides (passed to the toolbar Paper)
  /** Toolbar Paper padding. Default: 20px sacred, 16px light/dark. */
  toolbarPadding?: string
  /** Toolbar Paper height and min-height. Default: 72px sacred, 64px light/dark. */
  toolbarHeight?: string
  /** @deprecated No-op — not read by the component; scheduled for removal. */
  toolbarBackground?: string

  // Calendar surface overrides (passed to the calendar Paper)
  /** Calendar-surface Paper corner radius. Default: 12px sacred, 8px light/dark. */
  calendarBorderRadius?: string

  // Sacred surface override
  /** Replaces the sacred theme's default gold-gradient background image on the calendar Paper (sacred theme only). */
  sacredBackgroundImage?: string

  /** @deprecated No-op — not read by the component; scheduled for removal. */
  transitionDuration?: string
  /** @deprecated No-op — not read by the component; scheduled for removal. */
  transitionEasing?: string
}

/** A single event rendered on the calendar. */
export type CalendarEvent = {
  /** Unique id; used as the React key for the event chip. */
  id: string
  /** Label shown on the chip and in its tooltip; matched by the search filter. */
  title: string
  /** Event start; anchors day placement, the date-range filter, and all-day placement. */
  startDate: Date
  /** Event end; with `startDate` it decides which day and hour cells the event occupies. */
  endDate: Date
  /** Chip background color. Default: '#1d4ed8' (event text is white; this passes 4.5:1), or translucent gold on the sacred theme. */
  color?: string
  /** In week/day views, shows the event in every visible hour cell of its start day. */
  allDay?: boolean
  /** Resource label appended to the chip label and tooltip; matched by the search and resource filters. */
  resource?: string
  /** Longer text shown in the tooltip; matched by the search filter. */
  description?: string
  /** Category key matched by the `eventTypes` filter. */
  type?: string
  /** Free-form bag read by the tags/status/custom filters (`metadata.tags`, `metadata.status`, plus custom keys). */
  metadata?: Record<string, any>
}

export interface BigCalendarProps {
  /** Events to render; filtered client-side by the active filters. Default []. */
  events?: CalendarEvent[]
  /**
   * Initial focused date (default: today). Seeds internal state — the
   * calendar navigates itself and reports through `onDateChange`; later prop
   * changes do not re-sync it.
   */
  currentDate?: Date
  /**
   * Initial view (default 'month'). Seeds internal state — the toolbar
   * toggles switch views and report through `onViewChange`.
   */
  view?: CalendarView
  /** Called with the clicked event; when omitted, event chips render non-clickable. */
  onEventClick?: (event: CalendarEvent) => void
  /**
   * Called when a day cell (month view) or hour cell (week/day views, with
   * the hour) is clicked. The click also toggles the built-in selection
   * highlight summarized in the toolbar title.
   */
  onCellClick?: (date: Date, hour?: number) => void
  /** Notified when the toolbar view toggle changes the view. */
  onViewChange?: (view: CalendarView) => void
  /** Notified when previous/today/next navigation changes the focused date. */
  onDateChange?: (date: Date) => void
  /** Replaces the default tooltip-wrapped chip rendering for every event. */
  eventRenderer?: (event: CalendarEvent) => React.ReactNode
  /** Shows the navigation toolbar (prev/today/next, selection title, view toggles). Default true. */
  showToolbar?: boolean
  /** Month-view cell minimum height in px. Default 80. */
  minCellHeight?: number
  /** Week/day-view hour row height in px. Default 60. */
  hourHeight?: number
  /** First visible hour of the week/day grid (0–23). Default 0. */
  startHour?: number
  /** Hour the week/day grid ends at (exclusive). Default 24. */
  endHour?: number
  /**
   * Heading level (1–6) for the visually-hidden period heading that names the
   * calendar's `region` landmark (e.g. "Calendar, June 2026"). Rendered as a
   * real `<h1>`–`<h6>` so it participates in the page heading outline (SEO) and
   * screen-reader heading navigation. Set to match the surrounding page's
   * heading hierarchy. Default 2.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Theme plus container/typography/toolbar/surface overrides. See BigCalendarStyles. */
  styles?: BigCalendarStyles
  /** Shows the CalendarFilters panel between the toolbar and the grid. Default false. */
  showFilters?: boolean
  /**
   * Initial filter set (default {}). Seeds internal state — panel edits
   * apply immediately and report through `onFiltersChange`.
   */
  filters?: CalendarFilterOptions
  /** Notified with the full filter set whenever the filter panel changes it. */
  onFiltersChange?: (filters: CalendarFilterOptions) => void
  /** Options offered by the filter panel's resource dropdown. Default []. */
  availableResources?: { id: string; title: string }[]
  // Inline standardized dropdown datasets
  /** City options for the filter panel's standardized dropdown. Default []. */
  cities?: string[]
  /** Property-type options for the filter panel's standardized dropdown. Default []. */
  propertyTypes?: string[]
  /** Bedroom-count options for the filter panel's standardized dropdown. Default []. */
  bedroomOptions?: Array<string | number>
  /** Price-range options for the filter panel's standardized dropdown. Default []. */
  priceRanges?: string[]
  /**
   * Forwarded ref to the root `<div role="region">` container (React 19
   * ref-as-prop), MERGED with the internal `gridRef` the calendar uses to scope
   * roving focus. The calendar renders MANY `<button>`s (event chips + the
   * prev/today/next toolbar + view toggles), so there is no single "the button"
   * — the region root is the meaningful consumer handle (scroll it into view,
   * measure it, or query its controls). Individual controls stay reachable via
   * their `data-action`/aria-labels.
   */
  ref?: React.Ref<HTMLDivElement>
}

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// Full weekday names (same order) used as the column-header accessible names so
// screen readers announce "Sunday" rather than the abbreviated "Sun".
const dayHeadersFull = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function mergeClassNames(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ')
}

/**
 * Full calendar with month/week/day views, a navigation toolbar
 * (previous/today/next plus view toggles), an optional filter panel, and
 * built-in day/hour-span selection whose summary renders as the toolbar
 * title. Events render as tooltip-wrapped chips (replaceable via
 * `eventRenderer`) and are filtered client-side by the active
 * CalendarFilterOptions. `view`, `currentDate`, and `filters` only SEED
 * internal state — the calendar navigates itself and reports changes through
 * the `on*Change` callbacks. Themed light (default) / dark / sacred via
 * `styles.theme`.
 */
export default function BigCalendar({
  events = [],
  currentDate = new Date(),
  view: propView = 'month',
  onEventClick,
  onCellClick,
  onViewChange,
  onDateChange,
  eventRenderer,
  showToolbar = true,
  minCellHeight = 80,
  hourHeight = 60,
  startHour = 0,
  endHour = 24,
  headingLevel = 2,
  styles,
  showFilters = false,
  filters = {},
  onFiltersChange,
  availableResources = [],

  // Inline standardized dropdown datasets
  cities = [],
  propertyTypes = [],
  bedroomOptions = [],
  priceRanges = [],
  ref,
}: BigCalendarProps) {
  const [view, setView] = useState<CalendarView>(propView)
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [selectedSpans, setSelectedSpans] = useState<
    Array<{ date: string; startHour: number; endHour: number }>
  >([])
  const [internalFilters, setInternalFilters] =
    useState<CalendarFilterOptions>(filters)

  // --- Roving-tabindex focus management (WCAG 2.1.1 keyboard operability) ---
  // The month view is an ARIA grid and the week/day hour cells are a keyboard
  // group; in every case exactly ONE cell is in the tab order (tabIndex 0) and
  // the arrow keys move focus between cells. `focusedCellKey` records the
  // last-focused cell (month keys are `yyyy-MM-dd`; week/day hour keys are
  // `yyyy-MM-dd#<hour>`). `gridRef` scopes the querySelector used to move focus,
  // and `focusPendingRef` gates the focus effect so a mouse click never has its
  // focus stolen back — only a keyboard-driven move sets the flag.
  const [focusedCellKey, setFocusedCellKey] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const focusPendingRef = useRef(false)

  // Merge the internal `gridRef` (scopes roving focus + the querySelector below)
  // with the public consumer `ref` so a single DOM `ref` slot feeds both — the
  // consumer holds the region root, the calendar keeps its focus-scoping node.
  const setRootRef = (el: HTMLDivElement | null): void => {
    gridRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = el
  }

  // Stable id linking the visually-hidden period heading to the root `region`
  // landmark via aria-labelledby (so the landmark is named by the period).
  const headingId = useId()

  useEffect(() => {
    if (!focusPendingRef.current) return
    focusPendingRef.current = false
    if (focusedCellKey == null) return
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-focus-key="${focusedCellKey}"]`)
      ?.focus()
  }, [focusedCellKey])

  // Move keyboard focus to another cell: flag the move, update the roving
  // index, and let the effect focus the (already-rendered) target node. Works
  // across a view/period change too, since the target cell exists after the
  // re-render the setState triggers.
  const requestCellFocus = (key: string) => {
    focusPendingRef.current = true
    setFocusedCellKey(key)
  }

  // Old getBigCalendarStyles defaulted to 'light' when no theme was supplied;
  // data-theme is always emitted explicitly so the base-class sacred defaults
  // only apply when theme === 'sacred'. Parity preserved.
  const theme: 'light' | 'dark' | 'sacred' = styles?.theme || 'light'

  // Handle filter changes
  const handleFiltersChange = (newFilters: CalendarFilterOptions) => {
    setInternalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events]

    // Search text filter
    if (internalFilters.searchText) {
      const searchLower = internalFilters.searchText.toLowerCase()
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.resource?.toLowerCase().includes(searchLower)
      )
    }

    // Event type filter
    if (internalFilters.eventTypes && internalFilters.eventTypes.length > 0) {
      filtered = filtered.filter(
        event => event.type && internalFilters.eventTypes!.includes(event.type)
      )
    }

    // Date range filter
    if (internalFilters.dateRange) {
      const { start, end } = internalFilters.dateRange
      if (start) {
        filtered = filtered.filter(event => event.startDate >= start)
      }
      if (end) {
        filtered = filtered.filter(event => event.startDate <= endOfDay(end))
      }
    }

    // Resource filter
    if (internalFilters.resources && internalFilters.resources.length > 0) {
      filtered = filtered.filter(
        event =>
          event.resource && internalFilters.resources!.includes(event.resource)
      )
    }

    // Tags filter (if events have tags in metadata)
    if (internalFilters.tags && internalFilters.tags.length > 0) {
      filtered = filtered.filter(event => {
        const eventTags = event.metadata?.tags as string[] | undefined
        if (!eventTags) return false
        return internalFilters.tags!.some(tag => eventTags.includes(tag))
      })
    }

    // Status filter (if events have status in metadata)
    if (internalFilters.status && internalFilters.status.length > 0) {
      filtered = filtered.filter(event => {
        const eventStatus = event.metadata?.status as string | undefined
        return eventStatus && internalFilters.status!.includes(eventStatus)
      })
    }

    // Custom filters
    if (internalFilters.customFilters) {
      Object.entries(internalFilters.customFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          filtered = filtered.filter(event => {
            const metadataValue = event.metadata?.[key]
            if (Array.isArray(value)) {
              return value.includes(metadataValue)
            }
            return metadataValue === value
          })
        }
      })
    }

    return filtered
  }, [events, internalFilters])

  // Theme-resolved values that flow through to child components (Paper) which
  // paint their own surfaces. Transcribed from theme/bigcalendar.ts so the
  // toolbar/calendar Paper surfaces keep the exact spacing + radius per theme.
  const isSacredTheme = theme === 'sacred'
  const toolbarPaddingByTheme = isSacredTheme
    ? '20px'
    : '16px' /* light + dark */
  const toolbarHeightByTheme = isSacredTheme ? '72px' : '64px'
  const calendarRadiusByTheme = isSacredTheme ? '12px' : '8px'
  // Sacred calendar surface background image (theme/bigcalendar.ts sacred.backgroundImage)
  const sacredCalendarBackgroundImage = `
        linear-gradient(135deg, var(--goobs-gold-a05) 0%, transparent 50%, var(--goobs-gold-a05) 100%),
        radial-gradient(circle at top right, var(--goobs-gold-a02) 0%, transparent 50%)
      `

  // Theme passthrough for child components — typed against each child's own
  // prop type, no theme-module import.
  const childThemeStyle = { theme }

  // Per-theme default event color (theme/bigcalendar.ts event.defaultColor).
  // Event text is hardcoded white (renderEvent Typography color:'white') painted on
  // --bc-event-bg = this color. #2196f3 gave only 3.12 white-on-bg contrast; #1d4ed8
  // (goobs light-primary-strong) gives 6.70, clearing the 4.5 text threshold.
  const defaultEventColor = isSacredTheme ? 'var(--goobs-gold-a80)' : 'var(--goobs-light-primary-strong)'

  // Caller-supplied layout/style overrides stay in JS (recipe step 3). These
  // mirror the old containerStyle override fields; theme defaults live in CSS.
  const dynamicRootStyle: React.CSSProperties = {
    ...(styles?.backgroundColor
      ? { backgroundColor: styles.backgroundColor }
      : {}),
    ...(styles?.borderRadius ? { borderRadius: styles.borderRadius } : {}),
    ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
    margin: styles?.margin,
    marginTop: styles?.marginTop,
    marginBottom: styles?.marginBottom,
    marginLeft: styles?.marginLeft,
    marginRight: styles?.marginRight,
    maxWidth: styles?.maxWidth,
    minWidth: styles?.minWidth,
    maxHeight: styles?.maxHeight,
    minHeight: styles?.minHeight,
  }

  const paperToolbarStyles: PaperProps['styles'] = {
    theme,
    padding: styles?.toolbarPadding || toolbarPaddingByTheme,
    // Preserve spacing between toolbar and calendar (toolbarStyle always used 16px)
    marginBottom: '16px',
    height: styles?.toolbarHeight || toolbarHeightByTheme,
    minHeight: styles?.toolbarHeight || toolbarHeightByTheme,
  }

  const paperCalendarStyles: PaperProps['styles'] = {
    theme,
    borderRadius: styles?.calendarBorderRadius || calendarRadiusByTheme,
    ...(isSacredTheme
      ? {
          backgroundImage:
            styles?.sacredBackgroundImage || sacredCalendarBackgroundImage,
        }
      : {}),
  }

  const buttonStylesProp: { styles: NonNullable<ToggleButtonProps['styles']> } =
    {
      styles: childThemeStyle,
    }
  const tooltipStylesSpread: { styles: NonNullable<TooltipProps['styles']> } = {
    styles: childThemeStyle,
  }

  // No runtime size dependency; removed unused resize handler

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: CalendarView | null
  ) => {
    if (newView !== null) {
      setView(newView)
      emitDiag({
        type: 'component.state',
        component: 'BigCalendar',
        state: newView,
      })
      onViewChange?.(newView)
    }
  }

  const toggleDateSelection = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd')
    setSelectedDates(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleHourSpan = (date: Date, hour: number) => {
    const key = format(date, 'yyyy-MM-dd')
    setSelectedSpans(prev => {
      const existingIndex = prev.findIndex(
        s => s.date === key && s.startHour <= hour && s.endHour >= hour
      )
      if (existingIndex >= 0) {
        const clone = [...prev]
        clone.splice(existingIndex, 1)
        return clone
      }
      // Start a new one-hour span; merging is handled below
      const newSpan = { date: key, startHour: hour, endHour: hour }
      const merged = [...prev, newSpan]
        .sort(
          (a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour
        )
        .reduce<Array<{ date: string; startHour: number; endHour: number }>>(
          (acc, span) => {
            const last = acc[acc.length - 1]
            if (
              last &&
              last.date === span.date &&
              span.startHour <= last.endHour + 1
            ) {
              last.endHour = Math.max(last.endHour, span.endHour)
            } else {
              acc.push({ ...span })
            }
            return acc
          },
          []
        )
      return merged
    })
  }

  const handlePrevious = () => {
    const newDate =
      view === 'month'
        ? subMonths(selectedDate, 1)
        : view === 'week'
          ? subWeeks(selectedDate, 1)
          : addDays(selectedDate, -1)
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const handleNext = () => {
    const newDate =
      view === 'month'
        ? addMonths(selectedDate, 1)
        : view === 'week'
          ? addWeeks(selectedDate, 1)
          : addDays(selectedDate, 1)
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const handleToday = () => {
    const now = new Date()
    setSelectedDate(now)
    onDateChange?.(now)
  }

  const getViewDates = () => {
    if (view === 'month') {
      const monthStart = startOfMonth(selectedDate)
      const monthEnd = endOfMonth(selectedDate)
      const calendarStart = startOfWeek(monthStart)
      const calendarEnd = endOfWeek(monthEnd)
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    } else if (view === 'week') {
      const weekStart = startOfWeek(selectedDate)
      const weekEnd = endOfWeek(selectedDate)
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else {
      return [selectedDate]
    }
  }

  const viewDates = getViewDates()
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  )

  // --- Focus-key model ---------------------------------------------------
  // Flat, in-DOM-order list of month cell keys used for arrow navigation.
  const monthFocusKeys =
    view === 'month' ? viewDates.map(d => format(d, 'yyyy-MM-dd')) : []

  // Week/day hour-cell focus key: date + hour, delimited so it never collides
  // with the date's own dashes.
  const timeFocusKey = (day: Date, hour: number) =>
    `${format(day, 'yyyy-MM-dd')}#${hour}`

  // Is a stored focus key still valid for the currently rendered view? (Guards
  // against a stale key left over from a different view/period.)
  const isKeyInView = (key: string | null): key is string => {
    if (!key) return false
    if (view === 'month') return monthFocusKeys.includes(key)
    const [datePart, hourPart] = key.split('#')
    if (hourPart === undefined) return false
    return (
      hours.includes(Number(hourPart)) &&
      viewDates.some(d => format(d, 'yyyy-MM-dd') === datePart)
    )
  }

  // The cell that owns tabIndex 0 when nothing has been focused yet: the
  // selected day if visible, else today if visible, else the first cell.
  const defaultFocusKey = (): string => {
    if (view === 'month') {
      const selKey = format(selectedDate, 'yyyy-MM-dd')
      if (monthFocusKeys.includes(selKey)) return selKey
      const todayKey = format(new Date(), 'yyyy-MM-dd')
      if (monthFocusKeys.includes(todayKey)) return todayKey
      return monthFocusKeys[0] ?? selKey
    }
    const firstHour = hours[0] ?? startHour
    const selIdx = viewDates.findIndex(d => isSameDay(d, selectedDate))
    const todayIdx = viewDates.findIndex(d => isSameDay(d, new Date()))
    const idx = selIdx >= 0 ? selIdx : todayIdx >= 0 ? todayIdx : 0
    return timeFocusKey(viewDates[idx] ?? selectedDate, firstHour)
  }

  const effectiveFocusKey = isKeyInView(focusedCellKey)
    ? focusedCellKey
    : defaultFocusKey()

  // --- Cell activation (shared by pointer click AND keyboard Enter/Space) --
  const activateDayCell = (day: Date) => {
    toggleDateSelection(day)
    onCellClick?.(day)
  }

  const activateHourCell = (day: Date, hour: number) => {
    toggleHourSpan(day, hour)
    onCellClick?.(setHours(day, hour), hour)
  }

  // Month grid keyboard model (WAI-ARIA Grid / APG date-picker):
  // arrows move by day/week, Home/End jump to the week edge, PageUp/PageDown
  // change the month (Shift+PageUp/PageDown change the YEAR — per the APG
  // date-picker grid pattern) keeping focus on the equivalent day, Enter/Space
  // select.
  const handleMonthCellKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    // Only the cell itself drives grid navigation — let keys bubbling from a
    // focused event <button> inside the cell act on the button, not the grid.
    if (event.target !== event.currentTarget) return
    const len = monthFocusKeys.length
    let target = -1
    switch (event.key) {
      case 'ArrowRight':
        target = Math.min(index + 1, len - 1)
        break
      case 'ArrowLeft':
        target = Math.max(index - 1, 0)
        break
      case 'ArrowDown':
        target = Math.min(index + 7, len - 1)
        break
      case 'ArrowUp':
        target = Math.max(index - 7, 0)
        break
      case 'Home':
        target = index - (index % 7)
        break
      case 'End':
        target = Math.min(index - (index % 7) + 6, len - 1)
        break
      case 'PageUp': {
        // Shift+PageUp = previous year; PageUp = previous month.
        event.preventDefault()
        const nd = event.shiftKey
          ? subYears(viewDates[index]!, 1)
          : subMonths(viewDates[index]!, 1)
        setSelectedDate(nd)
        onDateChange?.(nd)
        requestCellFocus(format(nd, 'yyyy-MM-dd'))
        return
      }
      case 'PageDown': {
        // Shift+PageDown = next year; PageDown = next month.
        event.preventDefault()
        const nd = event.shiftKey
          ? addYears(viewDates[index]!, 1)
          : addMonths(viewDates[index]!, 1)
        setSelectedDate(nd)
        onDateChange?.(nd)
        requestCellFocus(format(nd, 'yyyy-MM-dd'))
        return
      }
      case 'Enter':
      case ' ':
        event.preventDefault()
        activateDayCell(viewDates[index]!)
        return
      default:
        return
    }
    if (target >= 0 && target !== index) {
      event.preventDefault()
      requestCellFocus(monthFocusKeys[target]!)
    }
  }

  // Week/day hour-cell keyboard model: Left/Right change day (week only),
  // Up/Down change hour, Home/End jump to first/last hour, Enter/Space select.
  const handleTimeCellKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    dayIndex: number,
    hourIndex: number
  ) => {
    // Only the hour cell itself drives navigation — not a focused event
    // <button> nested inside it (whose own keys should reach the button).
    if (event.target !== event.currentTarget) return
    const dayCount = viewDates.length
    const hourCount = hours.length
    let nd = dayIndex
    let nh = hourIndex
    switch (event.key) {
      case 'ArrowRight':
        nd = Math.min(dayIndex + 1, dayCount - 1)
        break
      case 'ArrowLeft':
        nd = Math.max(dayIndex - 1, 0)
        break
      case 'ArrowDown':
        nh = Math.min(hourIndex + 1, hourCount - 1)
        break
      case 'ArrowUp':
        nh = Math.max(hourIndex - 1, 0)
        break
      case 'Home':
        nh = 0
        break
      case 'End':
        nh = hourCount - 1
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        activateHourCell(viewDates[dayIndex]!, hours[hourIndex]!)
        return
      default:
        return
    }
    if (nd !== dayIndex || nh !== hourIndex) {
      event.preventDefault()
      requestCellFocus(timeFocusKey(viewDates[nd]!, hours[nh]!))
    }
  }

  // Full, screen-reader-friendly name for an event (the hover Tooltip is not
  // exposed to assistive tech, so the interactive/labelled element carries the
  // whole story: title, resource, description, and the start–end time range).
  const eventAccessibleName = (event: CalendarEvent): string =>
    `${event.title}${event.resource ? ` - ${event.resource}` : ''}${
      event.description ? `, ${event.description}` : ''
    }, ${format(event.startDate, 'MMM d, h:mm a')} to ${format(
      event.endDate,
      'MMM d, h:mm a'
    )}`

  const getEventsForDate = (date: Date, hour?: number) => {
    return filteredEvents.filter(event => {
      if (hour !== undefined) {
        // For hour view, check if event spans this hour
        const hourStart = setMinutes(setHours(date, hour), 0)
        const hourEnd = setMinutes(setHours(date, hour), 59)
        return (
          (event.startDate <= hourEnd && event.endDate >= hourStart) ||
          (event.allDay && isSameDay(date, event.startDate))
        )
      } else {
        // For day view, check if event is on this day
        return isWithinInterval(date, {
          start: startOfDay(event.startDate),
          end: endOfDay(event.endDate),
        })
      }
    })
  }

  const renderEvent = (event: CalendarEvent, isCompact = false) => {
    if (eventRenderer) {
      return eventRenderer(event)
    }

    const eventColor = event.color || defaultEventColor
    const label = isCompact
      ? event.title
      : `${event.title}${event.resource ? ` - ${event.resource}` : ''}`
    const accessibleName = eventAccessibleName(event)

    const visibleLabel = (
      <Typography
        styles={{
          ...styles,
          fontSize: isCompact ? '0.7rem' : '0.75rem',
          color: 'white',
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    )

    const chipClassName = mergeClassNames(
      cssStyles.event,
      onEventClick ? cssStyles.eventClickable : cssStyles.eventStatic,
      isCompact ? cssStyles.eventCompact : undefined
    )

    // Clickable events are real <button>s (native keyboard + role); the visible
    // text stays as the child while the full detail rides on aria-label. Static
    // events are non-interactive, so the visible chip is hidden from AT and a
    // visually-hidden node supplies the same full detail exactly once.
    const chip = onEventClick ? (
      <button
        type="button"
        onClick={() => onEventClick(event)}
        className={chipClassName}
        data-action="select-event"
        style={{ ['--bc-event-bg' as string]: eventColor }}
        aria-label={accessibleName}
      >
        <span aria-hidden="true">{visibleLabel}</span>
      </button>
    ) : (
      <div
        className={chipClassName}
        style={{ ['--bc-event-bg' as string]: eventColor }}
      >
        <span aria-hidden="true">{visibleLabel}</span>
        <span className={cssStyles.srOnly}>{accessibleName}</span>
      </div>
    )

    return (
      <StyledTooltip
        key={event.id}
        title={`${event.title}${event.description ? ` — ${event.description}` : ''}${event.resource ? ` | Resource: ${event.resource}` : ''} (${format(event.startDate, 'MMM d, h:mm a')} - ${format(event.endDate, 'MMM d, h:mm a')})`}
        {...tooltipStylesSpread}
      >
        {chip}
      </StyledTooltip>
    )
  }

  const renderMonthView = () => {
    // Chunk the 6-week block into rows of 7 for valid grid > row > gridcell
    // structure. The row wrapper uses `display: contents` (cssStyles.gridRow)
    // so the CSS grid layout of .monthGrid is unaffected.
    const weeks: Date[][] = []
    for (let i = 0; i < viewDates.length; i += 7) {
      weeks.push(viewDates.slice(i, i + 7))
    }

    return (
      <div
        className={cssStyles.calendarGrid}
        role="grid"
        aria-multiselectable="true"
        aria-label={`Calendar, ${format(selectedDate, 'MMMM yyyy')}`}
      >
        {/* Day headers */}
        <div className={cssStyles.headerContainer} role="row">
          {dayHeaders.map((day, i) => (
            <div
              key={day}
              className={cssStyles.headerCell}
              role="columnheader"
              aria-label={dayHeadersFull[i]}
            >
              <Typography
                styles={{ ...styles, fontSize: '0.75rem', fontWeight: 700 }}
              >
                {day}
              </Typography>
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className={cssStyles.monthGrid} role="rowgroup">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={cssStyles.gridRow} role="row">
              {week.map((day, dayIndex) => {
                const flatIndex = weekIndex * 7 + dayIndex
                const dayEvents = getEventsForDate(day)
                const isToday = isSameDay(day, new Date())
                const isCurrentMonth = isSameMonth(day, selectedDate)
                const cellKey = format(day, 'yyyy-MM-dd')
                const isSelected = selectedDates.has(cellKey)
                const eventSummary = dayEvents.length
                  ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`
                  : ''

                return (
                  <div
                    key={cellKey}
                    role="gridcell"
                    tabIndex={effectiveFocusKey === cellKey ? 0 : -1}
                    data-focus-key={cellKey}
                    aria-selected={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${format(day, 'EEEE, MMMM d, yyyy')}${eventSummary}`}
                    className={mergeClassNames(
                      cssStyles.cell,
                      !isCurrentMonth ? cssStyles.cellOtherMonth : undefined,
                      isToday ? cssStyles.cellToday : undefined,
                      isSelected ? cssStyles.cellSelected : undefined
                    )}
                    style={{
                      ['--bc-min-cell-height' as string]: `${minCellHeight}px`,
                    }}
                    onClick={() => {
                      setFocusedCellKey(cellKey)
                      activateDayCell(day)
                    }}
                    onKeyDown={e => handleMonthCellKeyDown(e, flatIndex)}
                  >
                    <div className={cssStyles.cellDateNumber} aria-hidden="true">
                      <Typography
                        styles={{
                          ...styles,
                          fontSize: '0.8rem',
                          fontWeight: isToday ? 700 : 400,
                          ...(isToday && isSacredTheme
                            ? { color: 'var(--goobs-amber-a100)' }
                            : {}),
                        }}
                      >
                        {format(day, 'd')}
                      </Typography>
                    </div>
                    <div className={cssStyles.cellEventContainer}>
                      {dayEvents
                        .slice(0, 3)
                        .map(event => renderEvent(event, true))}
                      {dayEvents.length > 3 && (
                        // The overflow indicator is a real <button>: the events
                        // past the first three are otherwise unreachable by
                        // keyboard / AT. Activating it opens the day view for
                        // this date, where every event on the day is rendered
                        // (WCAG 2.1.1 Keyboard, 4.1.2). stopPropagation keeps the
                        // cell's own day-selection click from also firing.
                        <button
                          type="button"
                          className={cssStyles.moreEventsButton}
                          data-action="view-more"
                          aria-label={`View all ${dayEvents.length} events on ${format(
                            day,
                            'EEEE, MMMM d, yyyy'
                          )}`}
                          onClick={e => {
                            e.stopPropagation()
                            setView('day')
                            setSelectedDate(day)
                            emitDiag({
                              type: 'component.state',
                              component: 'BigCalendar',
                              state: 'day',
                            })
                            onViewChange?.('day')
                            onDateChange?.(day)
                          }}
                        >
                          <Typography
                            styles={{
                              ...styles,
                              fontSize: '0.65rem',
                              marginTop: '2px',
                            }}
                          >
                            +{dayEvents.length - 3} more
                          </Typography>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const cellWidth = `${100 / 7}%`
    // Time column width is theme-driven (60px light/dark, 80px sacred); the
    // header grid template references it via --bc-time-col-width.
    const timeColWidth = isSacredTheme ? '80px' : '60px'

    return (
      <div
        className={cssStyles.calendarGrid}
        role="group"
        aria-label={`Calendar, week of ${format(startOfWeek(selectedDate), 'MMMM d, yyyy')}`}
      >
        {/* Day headers */}
        <div
          className={mergeClassNames(
            cssStyles.headerContainer,
            cssStyles.headerContainerTimed
          )}
          style={{
            ['--bc-grid-template-columns' as string]: `${timeColWidth} repeat(7, 1fr)`,
          }}
        >
          {/* Blank header cell to align with time column */}
          <div className={cssStyles.headerCell} aria-hidden="true" />
          {viewDates.map(day => (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className={cssStyles.headerCell}
            >
              <Typography
                styles={{ ...styles, fontSize: '0.75rem', fontWeight: 700 }}
              >
                {format(day, 'EEE')}
              </Typography>
              <Typography
                styles={{ ...styles, fontSize: '1rem', fontWeight: 500 }}
              >
                {format(day, 'd')}
              </Typography>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className={cssStyles.weekGrid}>
          {/* The hour labels duplicate each cell's own accessible name, so they
              are decorative for assistive tech. */}
          <div className={cssStyles.timeColumn} aria-hidden="true">
            {hours.map(hour => (
              <div
                key={hour}
                className={cssStyles.timeCell}
                style={{ ['--bc-hour-height' as string]: `${hourHeight}px` }}
              >
                <Typography styles={{ ...styles, fontSize: '0.7rem' }}>
                  {format(setHours(new Date(), hour), 'ha')}
                </Typography>
              </div>
            ))}
          </div>

          {/* The hour cells are a 2-D ARIA grid (row = day column, cell = hour)
              with a single roving tab stop navigated by arrow keys (Left/Right
              by day, Up/Down by hour). `role="grid"` (not toolbar) is required
              so an hour cell — a `role="gridcell"` — can legitimately CONTAIN
              the clickable event `<button>` without the invalid nested-
              interactive `<button role="button">` a toolbar item would force;
              a grid is also inherently 2-D so it needs no aria-orientation
              (WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value). */}
          <div
            className={cssStyles.weekDaysContainer}
            role="grid"
            aria-label={`Hour cells, week of ${format(startOfWeek(selectedDate), 'MMMM d, yyyy')}`}
          >
            {viewDates.map((day, dayIndex) => {
              const dayKey = format(day, 'yyyy-MM-dd')
              const isSelected =
                selectedDates.has(dayKey) ||
                selectedSpans.some(s => s.date === dayKey)
              return (
                <div
                  key={dayKey}
                  role="row"
                  aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                  className={mergeClassNames(
                    cssStyles.weekDayColumn,
                    isSelected ? cssStyles.weekDayColumnSelected : undefined
                  )}
                  style={{ ['--bc-week-col-width' as string]: cellWidth }}
                >
                  {hours.map((hour, hourIndex) => {
                    const hourEvents = getEventsForDate(day, hour)
                    const isCurrentHour =
                      isSameDay(day, new Date()) &&
                      getHours(new Date()) === hour

                    const spanSelected = selectedSpans.some(
                      s =>
                        s.date === dayKey &&
                        hour >= s.startHour &&
                        hour <= s.endHour
                    )
                    const cellFocusKey = timeFocusKey(day, hour)
                    return (
                      <div
                        key={`${dayKey}-${hour}`}
                        role="gridcell"
                        tabIndex={
                          effectiveFocusKey === cellFocusKey ? 0 : -1
                        }
                        data-focus-key={cellFocusKey}
                        aria-selected={spanSelected}
                        aria-current={isCurrentHour ? 'time' : undefined}
                        aria-label={`${format(setHours(day, hour), 'EEEE, MMMM d, yyyy, h a')}${
                          hourEvents.length
                            ? `, ${hourEvents.length} event${hourEvents.length > 1 ? 's' : ''}`
                            : ''
                        }`}
                        className={mergeClassNames(
                          cssStyles.hourCell,
                          isCurrentHour ? cssStyles.hourCellCurrent : undefined,
                          spanSelected ? cssStyles.hourCellSelected : undefined
                        )}
                        style={{
                          ['--bc-hour-height' as string]: `${hourHeight}px`,
                        }}
                        onClick={() => {
                          setFocusedCellKey(cellFocusKey)
                          activateHourCell(day, hour)
                        }}
                        onKeyDown={e =>
                          handleTimeCellKeyDown(e, dayIndex, hourIndex)
                        }
                      >
                        {hourEvents.map(event => renderEvent(event, true))}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const selectedKey = format(selectedDate, 'yyyy-MM-dd')
    const isSelected =
      selectedDates.has(selectedKey) ||
      selectedSpans.some(s => s.date === selectedKey)
    // Time column width is theme-driven (60px light/dark, 80px sacred).
    const timeColWidth = isSacredTheme ? '80px' : '60px'
    return (
      <div
        className={cssStyles.calendarGrid}
        role="group"
        aria-label={`Calendar, ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`}
      >
        {/* Day header aligned with time column */}
        <div
          className={mergeClassNames(
            cssStyles.headerContainer,
            cssStyles.headerContainerTimed
          )}
          style={{
            ['--bc-grid-template-columns' as string]: `${timeColWidth} 1fr`,
          }}
        >
          {/* Blank header cell to align with time column */}
          <div className={cssStyles.headerCell} aria-hidden="true" />
          <div className={cssStyles.headerCell}>
            <Typography
              styles={{ ...styles, fontSize: '0.95rem', fontWeight: 700 }}
            >
              {format(selectedDate, 'EEEE').toUpperCase()}
            </Typography>
            <Typography
              styles={{ ...styles, fontSize: '1.25rem', fontWeight: 600 }}
            >
              {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
          </div>
        </div>

        {/* Time grid */}
        <div className={cssStyles.dayGrid}>
          {/* The hour labels duplicate each cell's own accessible name, so they
              are decorative for assistive tech. */}
          <div className={cssStyles.timeColumn} aria-hidden="true">
            {hours.map(hour => (
              <div
                key={hour}
                className={cssStyles.timeCell}
                style={{ ['--bc-hour-height' as string]: `${hourHeight}px` }}
              >
                <Typography styles={{ ...styles, fontSize: '0.7rem' }}>
                  {format(setHours(new Date(), hour), 'ha')}
                </Typography>
              </div>
            ))}
          </div>

          {/* Single-column ARIA grid: each hour is a `role="row"` holding one
              `role="gridcell"`, sharing one roving tab stop (Up/Down move by
              hour). `role="grid"` (not toolbar) lets an hour gridcell legitimately
              CONTAIN the clickable event `<button>` without the invalid nested-
              interactive nesting a toolbar item would force; a grid is inherently
              multi-dimensional so it needs no aria-orientation (WCAG 2.1.1,
              4.1.2). */}
          <div
            className={mergeClassNames(
              cssStyles.dayContentColumn,
              isSelected ? cssStyles.dayContentColumnSelected : undefined
            )}
            role="grid"
            aria-label={`Hour cells, ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`}
          >
            {hours.map((hour, hourIndex) => {
              const hourEvents = getEventsForDate(selectedDate, hour)
              const isCurrentHour =
                isSameDay(selectedDate, new Date()) &&
                getHours(new Date()) === hour

              const dayKeyLocal = format(selectedDate, 'yyyy-MM-dd')
              const spanSelected = selectedSpans.some(
                s =>
                  s.date === dayKeyLocal &&
                  hour >= s.startHour &&
                  hour <= s.endHour
              )
              const cellFocusKey = timeFocusKey(selectedDate, hour)
              return (
                // The row wrapper gives the single-column grid valid
                // grid > row > gridcell structure; `display: contents`
                // (cssStyles.gridRow) keeps the hour cell a direct flex child of
                // the day column so the layout is unchanged.
                <div key={hour} role="row" className={cssStyles.gridRow}>
                  <div
                    role="gridcell"
                    tabIndex={effectiveFocusKey === cellFocusKey ? 0 : -1}
                    data-focus-key={cellFocusKey}
                    aria-selected={spanSelected}
                    aria-current={isCurrentHour ? 'time' : undefined}
                    aria-label={`${format(setHours(selectedDate, hour), 'EEEE, MMMM d, yyyy, h a')}${
                      hourEvents.length
                        ? `, ${hourEvents.length} event${hourEvents.length > 1 ? 's' : ''}`
                        : ''
                    }`}
                    className={mergeClassNames(
                      cssStyles.hourCell,
                      isCurrentHour ? cssStyles.hourCellCurrent : undefined,
                      spanSelected ? cssStyles.hourCellSelected : undefined
                    )}
                    style={{ ['--bc-hour-height' as string]: `${hourHeight}px` }}
                    onClick={() => {
                      setFocusedCellKey(cellFocusKey)
                      activateHourCell(selectedDate, hour)
                    }}
                    onKeyDown={e => handleTimeCellKeyDown(e, 0, hourIndex)}
                  >
                    {hourEvents.map(event => renderEvent(event))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const getSelectionTitle = () => {
    const selectionDateKeys =
      selectedSpans.length > 0
        ? Array.from(new Set(selectedSpans.map(s => s.date)))
        : Array.from(selectedDates)
    if (selectionDateKeys.length === 0) return ''
    const dates = selectionDateKeys
      .map(key => parse(key as string, 'yyyy-MM-dd', new Date()))
      .sort((a, b) => a.getTime() - b.getTime())
    if (dates.length === 0) return ''
    if (dates.length === 1) {
      const single = dates[0]!
      const spans = selectedSpans
        .filter(s => s.date === format(single, 'yyyy-MM-dd'))
        .sort((a, b) => a.startHour - b.startHour)
      if (spans.length > 0) {
        const parts = spans
          .map(
            s =>
              `${s.startHour}:00–${(s.endHour + 1) % 24 === 0 ? '24' : s.endHour + 1}:00`
          )
          .join(', ')
        return `${format(single, 'MMMM d, yyyy')} (${parts})`
      }
      return format(single, 'MMMM d, yyyy')
    }
    const isContiguous = dates.every(
      (d, i) => i === 0 || differenceInCalendarDays(d, dates[i - 1]!) === 1
    )
    if (isContiguous) {
      const first = dates[0]!
      const last = dates[dates.length - 1]!
      if (first.getFullYear() === last.getFullYear()) {
        if (first.getMonth() === last.getMonth()) {
          // Same month and year: Aug 10–14, 2025
          return `${format(first, 'MMM d')}–${format(last, 'd, yyyy')}`
        }
        // Same year different months: Aug 30 – Sep 2, 2025
        return `${format(first, 'MMM d')} – ${format(last, 'MMM d, yyyy')}`
      }
      // Different years
      return `${format(first, 'MMM d, yyyy')} – ${format(last, 'MMM d, yyyy')}`
    }
    // Non-contiguous: comma-separated list; include spans for each day if present
    return dates
      .map(d => {
        const dayKey = format(d, 'yyyy-MM-dd')
        const spans = selectedSpans
          .filter(s => s.date === dayKey)
          .sort((a, b) => a.startHour - b.startHour)
        if (spans.length === 0) return format(d, 'MMM d, yyyy')
        const parts = spans
          .map(
            s =>
              `${s.startHour}:00–${(s.endHour + 1) % 24 === 0 ? '24' : s.endHour + 1}:00`
          )
          .join(', ')
        return `${format(d, 'MMM d, yyyy')} (${parts})`
      })
      .join(', ')
  }

  const selectionTitle = getSelectionTitle()
  // Period announced to assistive tech on navigation / view change. The visible
  // toolbar shows only the SELECTION, so without this a screen-reader user has
  // no spoken cue for which month/week/day is on screen after prev/next/today.
  const periodText =
    view === 'month'
      ? format(selectedDate, 'MMMM yyyy')
      : view === 'week'
        ? `week of ${format(startOfWeek(selectedDate), 'MMMM d, yyyy')}`
        : format(selectedDate, 'EEEE, MMMM d, yyyy')
  const viewLabelText =
    view === 'month' ? 'Month' : view === 'week' ? 'Week' : 'Day'
  const liveMessage = `${viewLabelText} view, ${periodText}${
    selectionTitle ? `. Selected: ${selectionTitle}` : ''
  }`

  // Real heading element for the current period. Typography renders only a
  // <span>, so the heading tag is emitted directly (an intrinsic element chosen
  // by `headingLevel`); it is visually hidden but present in the SSR'd HTML for
  // SEO heading structure and screen-reader heading navigation, and names the
  // root `region` landmark via aria-labelledby.
  const PeriodHeading = `h${headingLevel}` as
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'

  return (
    <div
      ref={setRootRef}
      className={cssStyles.root}
      data-component="BigCalendar"
      data-theme={theme}
      data-state={view}
      style={dynamicRootStyle}
      role="region"
      aria-labelledby={headingId}
    >
      {/* Visually-hidden heading naming the current period; provides a real
          heading element for SEO + screen-reader heading navigation and is the
          accessible name of the surrounding region landmark. */}
      <PeriodHeading id={headingId} className={cssStyles.srOnly}>
        {`Calendar, ${periodText}`}
      </PeriodHeading>

      {/* Polite live region: announces the current period + selection whenever
          navigation, the view toggle, or a cell selection changes it
          (WCAG 4.1.3 Status Messages). */}
      <div className={cssStyles.srOnly} aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      {showToolbar && (
        <Paper styles={paperToolbarStyles}>
          <div className={cssStyles.toolbarContent}>
            <div className={cssStyles.toolbarSection}>
              <button
                type="button"
                onClick={handlePrevious}
                className={cssStyles.navButton}
                data-action="prev"
                aria-label={`Previous ${view}`}
              >
                <ChevronLeftIcon styles={{ theme }} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className={mergeClassNames(
                  cssStyles.navButton,
                  cssStyles.navButtonToday
                )}
                data-action="today"
                aria-label="Go to today"
              >
                <CalendarIcon styles={{ theme }} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={cssStyles.navButton}
                data-action="next"
                aria-label={`Next ${view}`}
              >
                <ChevronRightIcon styles={{ theme }} aria-hidden="true" />
              </button>

              <Typography
                styles={{
                  ...styles,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  marginLeft: '16px',
                }}
              >
                {selectionTitle}
              </Typography>
            </div>

            {/* Group wrapper gives the view toggles a collective accessible
                name (WCAG 1.3.1); `display: contents` (viewSwitcherGroup) keeps
                it out of the flex layout so the toolbar is visually unchanged
                while the group role stays in the accessibility tree. */}
            <div
              className={cssStyles.viewSwitcherGroup}
              role="group"
              aria-label="Calendar view"
            >
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, newValue) => {
                  if (
                    newValue === 'day' ||
                    newValue === 'week' ||
                    newValue === 'month' ||
                    newValue === null
                  ) {
                    handleViewChange(e, newValue as any)
                  }
                }}
                {...buttonStylesProp}
              >
                <ToggleButton value="day" {...buttonStylesProp}>
                  <span className={cssStyles.viewLabel}>Day</span>
                </ToggleButton>
                <ToggleButton value="week" {...buttonStylesProp}>
                  <DateRangeIcon aria-hidden="true" />
                  <span className={cssStyles.viewLabel}>Week</span>
                </ToggleButton>
                <ToggleButton value="month" {...buttonStylesProp}>
                  <CalendarMonthIcon aria-hidden="true" />
                  <span className={cssStyles.viewLabel}>Month</span>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </Paper>
      )}

      {showFilters && (
        <CalendarFilters
          filters={internalFilters}
          onFiltersChange={handleFiltersChange}
          availableResources={availableResources}
          // Status removed from filters
          expanded={true}
          cities={cities}
          propertyTypes={propertyTypes}
          bedroomOptions={bedroomOptions}
          priceRanges={priceRanges}
          // Forward the calendar's theme so the filter panel matches it.
          // Without this it defaulted to 'sacred', rendering gold Cinzel
          // headings + gold field labels on a light calendar — a theme
          // mismatch that also failed contrast (gold on the light-composited
          // grey surface, ~1.8:1).
          styles={{ theme }}
        />
      )}

      <Paper styles={paperCalendarStyles}>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </Paper>
    </div>
  )
}

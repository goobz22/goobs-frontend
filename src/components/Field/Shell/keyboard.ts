/**
 * Shared keyboard-handling hooks for popover-style Field components
 * (the four Dropdown variants + the Date/Time picker fields once they
 * gain calendar popovers).
 *
 * Centralizing these means every Dropdown + DateField + TimeField
 * implements Escape and Arrow-key navigation identically — the
 * WAI-ARIA tablist-equivalent pattern for combobox+listbox.
 */

import { useEffect, useRef, type RefObject } from 'react'

/**
 * Closes a popover when Escape is pressed while the document has
 * focus inside it. Safer than blanket window-level Escape because it
 * only fires when the popover is open AND focus is somewhere within
 * its anchor / panel.
 *
 * @param isOpen - whether the popover is currently open
 * @param onClose - called when Escape is detected
 * @param scopeRef - optional ref to constrain to. When provided,
 *   Escape only closes if focus is inside this element. When omitted,
 *   any document-wide Escape closes (matches the legacy Popover
 *   component's behavior).
 */
export function useEscape(
  isOpen: boolean,
  onClose: () => void,
  scopeRef?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (scopeRef && scopeRef.current) {
        const active = document.activeElement
        if (active && !scopeRef.current.contains(active)) return
      }
      onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose, scopeRef])
}

export interface ArrowKeyNavOptions {
  /** Number of options in the listbox. */
  count: number
  /** Currently active option index, or -1 when nothing is highlighted. */
  activeIndex: number
  /** Setter for the active index. */
  onActiveIndexChange: (next: number) => void
  /**
   * Called when Enter or Space activates the current option. Receives
   * the active index. Components decide what "activate" means
   * (selecting a value, expanding a sub-menu, etc.).
   */
  onActivate?: (index: number) => void
  /**
   * Optional roving tabindex orientation. `'vertical'` (default)
   * binds Up/Down, `'horizontal'` binds Left/Right, `'both'` binds all.
   */
  orientation?: 'vertical' | 'horizontal' | 'both'
}

/**
 * Roving-tabindex keyboard navigation for listboxes / menus / option
 * lists. Returns an `onKeyDown` handler the consumer attaches to the
 * trigger button (so the popover doesn't have to be focused for
 * navigation to work — this is the WAI-ARIA combobox 1.2 pattern).
 *
 * Bindings:
 *   - ArrowDown / ArrowRight → next option, wraps to first
 *   - ArrowUp / ArrowLeft → prev option, wraps to last
 *   - Home → first option
 *   - End → last option
 *   - Enter / Space → onActivate(activeIndex)
 */
export function useArrowKeyNav(opts: ArrowKeyNavOptions) {
  const {
    count,
    activeIndex,
    onActiveIndexChange,
    onActivate,
    orientation = 'vertical',
  } = opts

  // The returned handler is recreated each render — that's fine,
  // Playwright/React don't care about identity for inline `onKeyDown`
  // attributes. The closure captures the destructured values above
  // directly so each invocation sees the latest props.

  return (event: React.KeyboardEvent<HTMLElement>) => {
    if (count <= 0) return
    const isVertical = orientation === 'vertical' || orientation === 'both'
    const isHorizontal = orientation === 'horizontal' || orientation === 'both'
    let next: number | null = null
    if (
      (isVertical && event.key === 'ArrowDown') ||
      (isHorizontal && event.key === 'ArrowRight')
    ) {
      next = activeIndex < 0 ? 0 : (activeIndex + 1) % count
    } else if (
      (isVertical && event.key === 'ArrowUp') ||
      (isHorizontal && event.key === 'ArrowLeft')
    ) {
      next = activeIndex < 0 ? count - 1 : (activeIndex - 1 + count) % count
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = count - 1
    } else if (
      (event.key === 'Enter' || event.key === ' ') &&
      activeIndex >= 0 &&
      activeIndex < count
    ) {
      event.preventDefault()
      onActivate?.(activeIndex)
      return
    }
    if (next === null) return
    event.preventDefault()
    onActiveIndexChange(next)
  }
}

export interface TypeaheadOptions {
  /**
   * Ordered option labels to match against, index-aligned with the listbox
   * options so the returned match index maps straight onto `activeIndex`.
   */
  labels: string[]
  /**
   * Currently active option index (-1 when nothing is highlighted). Used as the
   * search start point so pressing the same key again cycles to the NEXT
   * matching option instead of sticking on the first one.
   */
  activeIndex: number
  /** Called with the matched option index when a printable-char match lands. */
  onMatch: (index: number) => void
  /**
   * Idle window (ms) after which the accumulated buffer resets. Rapid typing
   * inside the window accumulates a prefix ("ne" → "nodejs"); a pause starts a
   * fresh single-character search. Defaults to the APG-conventional 500ms.
   */
  timeoutMs?: number
}

/**
 * Pure matcher for printable-character type-ahead. Returns the index of the
 * first label that starts with `query` (case-insensitive), searching
 * cyclically from `startIndex`, or -1 when nothing matches.
 *
 * Two modes, mirroring the WAI-ARIA APG listbox type-ahead behaviour:
 *   - **cycle** — the query is a single character, or the same character
 *     repeated ("p" / "pp"): search from the item AFTER `startIndex` (wrapping),
 *     so repeating the key steps through every option starting with that char.
 *   - **accumulate** — the query has ≥2 distinct characters ("ty"): match
 *     INCLUDING the current item, so extending the buffer keeps the highlight on
 *     an already-matched option rather than jumping off it.
 */
export function findTypeaheadMatch(
  labels: string[],
  query: string,
  startIndex: number
): number {
  const count = labels.length
  if (count === 0 || query === '') return -1
  const lower = query.toLowerCase()
  const allSame = [...lower].every(char => char === lower[0])
  const needle = allSame ? lower[0]! : lower
  const from = allSame ? startIndex + 1 : startIndex < 0 ? 0 : startIndex
  for (let offset = 0; offset < count; offset++) {
    const index = (((from + offset) % count) + count) % count
    if (labels[index]!.toLowerCase().startsWith(needle)) return index
  }
  return -1
}

/**
 * Printable-character type-ahead for select-only comboboxes / listboxes — the
 * APG-recommended affordance where typing a character moves the highlight to
 * the next option starting with it (and rapid typing matches a longer prefix).
 * Returns an `onKeyDown` handler the consumer attaches to the same element as
 * `useArrowKeyNav`.
 *
 * Additive companion to `useArrowKeyNav`: attach BOTH and call the arrow-nav
 * handler FIRST. This helper early-returns on `event.defaultPrevented`, so any
 * Arrow/Home/End/Enter/Space that arrow-nav already consumed (it always
 * `preventDefault`s the keys it acts on) is never mistaken for a typed
 * character — only keys arrow-nav ignored reach the buffer. Non-printable keys
 * (control keys report multi-character `event.key` names like `'ArrowDown'`),
 * modifier combos (Ctrl/Meta/Alt), and a leading space are all ignored.
 *
 * The two search variants (SearchableSimple / SearchableHistory) intentionally
 * do NOT use this — their text-filter input already provides type-to-filter, a
 * richer affordance. This is for the filter-less Regular + MultiSelect surfaces.
 */
export function useTypeahead(opts: TypeaheadOptions) {
  const { labels, activeIndex, onMatch, timeoutMs = 500 } = opts
  const bufferRef = useRef('')
  const lastKeyTimeRef = useRef(0)

  // Recreated each render (like useArrowKeyNav) so the closure sees the latest
  // labels/activeIndex; the buffer + timer persist across renders via refs.
  return (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    // Printable characters are exactly length 1; control keys (ArrowDown, Tab,
    // Shift, Enter, …) report multi-character names.
    if (event.key.length !== 1) return

    const now = Date.now()
    const expired = now - lastKeyTimeRef.current > timeoutMs
    let buffer = expired ? '' : bufferRef.current
    // A space must not BEGIN a search — it matches nothing meaningful and would
    // steal the Space activate key; it may still extend an in-flight buffer.
    if (event.key === ' ' && buffer === '') return
    buffer += event.key
    bufferRef.current = buffer
    lastKeyTimeRef.current = now

    const match = findTypeaheadMatch(labels, buffer, activeIndex)
    if (match >= 0) {
      event.preventDefault()
      onMatch(match)
    }
  }
}

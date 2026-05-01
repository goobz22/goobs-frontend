/**
 * Shared keyboard-handling hooks for popover-style Field components
 * (the four Dropdown variants + the Date/Time picker fields once they
 * gain calendar popovers).
 *
 * Centralizing these means every Dropdown + DateField + TimeField
 * implements Escape and Arrow-key navigation identically — the
 * WAI-ARIA tablist-equivalent pattern for combobox+listbox.
 */

import { useEffect, type RefObject } from 'react'

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

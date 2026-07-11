'use client'

/**
 * =============================================================================
 * useGridKeyboardNav — APG Grid keyboard interaction model (WCAG 2.1.1)
 * =============================================================================
 *
 * Implements the roving-tabindex + 2-D arrow navigation the WAI-ARIA
 * [Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) requires for
 * the DataGrid's data cells. Before this, cell selection and cell-edit were
 * pointer/tap only — keyboard-only users could not reach or operate any cell.
 *
 * Contract (consumed by `Rows`):
 *   - `active` is the currently-focused cell `{ row, col }` in the visible
 *     page. Exactly one data cell carries `tabIndex={0}` (the active one); the
 *     rest are `tabIndex={-1}`, so the grid body is a SINGLE tab stop and the
 *     user then arrows between cells.
 *   - `registerCell(row, col)` returns a ref callback so the hook can move DOM
 *     focus when navigation changes the active cell.
 *   - `moveTo(row, col)` clamps to the grid bounds, updates `active`, and
 *     focuses the new cell (used by the Arrow / Home / End / PageUp / PageDown
 *     handlers).
 *   - `syncActive(row, col)` updates `active` WITHOUT stealing focus — called
 *     from each cell's `onFocus` so a mouse click / Tab keeps the roving index
 *     in step with real focus.
 *   - `focusActive()` re-focuses the active cell — used to restore focus to the
 *     cell after an inline editor closes (Escape / save), so keyboard users
 *     don't get dropped to `<body>`.
 *
 * The hook only owns focus/roving; WHAT Enter / F2 / Space do (select vs edit)
 * stays in `Rows`, which owns the selection + edit callbacks.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

/** Zero-based coordinates of the active data cell within the visible page. */
export interface GridCellPosition {
  row: number
  col: number
}

/**
 * @param rowCount - number of data rows currently rendered (visible page)
 * @param colCount - number of data columns (excludes the leading checkbox cell)
 */
export function useGridKeyboardNav(rowCount: number, colCount: number) {
  const [active, setActive] = useState<GridCellPosition>({ row: 0, col: 0 })

  /** Live map of rendered cell elements keyed by "row:col" for focus moves. */
  const cellRefs = useRef<Map<string, HTMLTableCellElement>>(new Map())
  /** Set true right before a state change that should pull DOM focus. */
  const pendingFocus = useRef(false)

  const cellKey = (row: number, col: number) => `${row}:${col}`

  const registerCell = useCallback(
    (row: number, col: number) => (el: HTMLTableCellElement | null) => {
      const key = cellKey(row, col)
      if (el) cellRefs.current.set(key, el)
      else cellRefs.current.delete(key)
    },
    []
  )

  // Clamp for rendering + focus (derived, not stored — avoids a setState-in-
  // effect cascade). When the data shrinks (filtering, deletion, page change)
  // this keeps the single tab stop on a cell that actually exists; the raw
  // state self-heals to a valid coordinate on the next move. Memoised so the
  // focus effect's dependency is stable across unrelated re-renders.
  const clamped = useMemo<GridCellPosition>(() => {
    const row = Math.min(active.row, Math.max(0, rowCount - 1))
    const col = Math.min(active.col, Math.max(0, colCount - 1))
    return row === active.row && col === active.col ? active : { row, col }
  }, [active, rowCount, colCount])

  // Move DOM focus to the active cell, but only when a keyboard action asked
  // for it (pendingFocus) — never on mount or on a passive sync, so the grid
  // never steals focus just by rendering.
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    cellRefs.current.get(cellKey(clamped.row, clamped.col))?.focus()
  }, [clamped])

  const moveTo = useCallback(
    (row: number, col: number) => {
      pendingFocus.current = true
      setActive({
        row: Math.max(0, Math.min(row, rowCount - 1)),
        col: Math.max(0, Math.min(col, colCount - 1)),
      })
    },
    [rowCount, colCount]
  )

  const syncActive = useCallback((row: number, col: number) => {
    setActive(prev => (prev.row === row && prev.col === col ? prev : { row, col }))
  }, [])

  const focusActive = useCallback(() => {
    pendingFocus.current = true
    // New object reference guarantees the focus effect re-runs even when the
    // coordinates are unchanged (e.g. re-focus the same cell after edit exit).
    setActive(prev => ({ ...prev }))
  }, [])

  return { active: clamped, registerCell, moveTo, syncActive, focusActive }
}

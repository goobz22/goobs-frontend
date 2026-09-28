'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import type { ColumnDef } from '../types'
import {
  DEFAULT_MAX_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  clampColumnWidth,
  getColumnWidth,
  resolveColumnResizeBounds,
} from './columnResizeBounds'

interface UseColumnResizeProps {
  columns: ColumnDef[]
  onColumnResize?: (columnField: string, newWidth: number) => void
}

/**
 * Overlay the user's resized widths on the LIVE columns.
 *
 * The grid used to copy `columns` into state and replace that copy only when
 * field / width / headerName changed. `renderCell` is a new function whenever
 * the caller closes over a newer list, so that copy kept the first render's
 * function for the life of the grid (W-769). Widths live in state. Everything
 * else, including `renderCell`, comes from the prop on every render.
 */
export function applyResizedWidths<T extends ColumnDef>(
  columns: readonly T[],
  resizedWidths: Readonly<Record<string, number>>
): T[] {
  return columns.map(col => {
    const width = resizedWidths[col.field]
    if (width == null) return col
    return { ...col, width, computedWidth: width }
  })
}

export function useColumnResize({
  columns,
  onColumnResize,
}: UseColumnResizeProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const [resizedWidths, setResizedWidths] = useState<Record<string, number>>({})
  const [tempWidth, setTempWidth] = useState<number | null>(null)
  const updatedColumns = applyResizedWidths(columns, resizedWidths)
  const resizingElementRef = useRef<HTMLElement | null>(null)
  /**
   * Bounds of the column being dragged, resolved once at mousedown so the
   * mousemove handler can clamp without depending on (and re-subscribing to)
   * the columns array on every frame.
   */
  const resizeBoundsRef = useRef<{ min: number; max: number }>({
    min: MIN_COLUMN_WIDTH,
    max: DEFAULT_MAX_COLUMN_WIDTH,
  })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnField: string) => {
      e.preventDefault()
      e.stopPropagation()

      const column = updatedColumns.find(col => col.field === columnField)
      if (!column) return

      // Find the column header element for direct DOM manipulation
      const headerElement = (e.target as HTMLElement).closest('th')
      resizingElementRef.current = headerElement

      setIsResizing(true)
      setResizingColumn(columnField)
      setStartX(e.clientX)
      setStartWidth(getColumnWidth(column))
      resizeBoundsRef.current = resolveColumnResizeBounds(column)
    },
    [updatedColumns]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizingColumn) return

      const deltaX = e.clientX - startX
      // Clamp to the bounds resolved at mousedown — the same range the resize
      // separator publishes as aria-valuemin/aria-valuemax. Inlining a floor
      // here (it used to be a bare `Math.max(50, …)`) is what lets the
      // announced range drift away from the enforced one. The bounds are read
      // from a ref rather than from `updatedColumns` so this callback's
      // identity stays stable for the whole drag — depending on the columns
      // would re-register the document listeners on every mousemove.
      const bounds = resizeBoundsRef.current
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, bounds.min),
        bounds.max
      )

      setTempWidth(newWidth)

      // Update DOM directly for immediate visual feedback
      if (resizingElementRef.current) {
        resizingElementRef.current.style.width = `${newWidth}px`
        resizingElementRef.current.style.minWidth = `${newWidth}px`
        resizingElementRef.current.style.maxWidth = `${newWidth}px`
      }

      // Also update the state for consistency (but this might be batched)
      setResizedWidths(prev =>
        prev[resizingColumn] === newWidth
          ? prev
          : { ...prev, [resizingColumn]: newWidth }
      )
    },
    [isResizing, resizingColumn, startX, startWidth]
  )

  const handleMouseUp = useCallback(() => {
    if (!isResizing || !resizingColumn) return

    const finalWidth = tempWidth || startWidth

    // Call the callback with the final width
    if (onColumnResize) {
      onColumnResize(resizingColumn, finalWidth)
    }

    // Reset resize state
    setIsResizing(false)
    setResizingColumn(null)
    setStartX(0)
    setStartWidth(0)
    setTempWidth(null)
    resizingElementRef.current = null
  }, [isResizing, resizingColumn, tempWidth, startWidth, onColumnResize])

  // Set up global mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const getResizeHandleProps = useCallback(
    (columnField: string) => ({
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, columnField),
      style: {
        position: 'absolute' as const,
        right: '-4px',
        top: '0',
        width: '8px',
        height: '100%',
        cursor: 'col-resize',
        backgroundColor: 'transparent',
        zIndex: 10,
        borderRight: '2px solid transparent',
        transition: isResizing ? 'none' : 'all 0.2s ease', // Disable transition during resize
      },
    }),
    [handleMouseDown, isResizing]
  )

  /**
   * Keyboard-operable resize (WCAG 2.1.1). The drag handle was pointer-only;
   * this adjusts a column's width by `delta` px — clamped through the SAME
   * `clampColumnWidth` bounds the mouse path uses and the separator publishes
   * as `aria-valuemin`/`aria-valuemax` — and notifies the parent via
   * `onColumnResize`, so the resize `role="separator"` handle can be driven
   * with Arrow/Home/End/Enter. The new width flows to the header through
   * `computedWidth` (rendered as the `--dg-col-width` CSS variable), matching
   * the mouse path.
   */
  const resizeColumnBy = useCallback(
    (columnField: string, delta: number) => {
      const column = updatedColumns.find(col => col.field === columnField)
      if (!column) return
      const newWidth = clampColumnWidth(column, getColumnWidth(column) + delta)
      setResizedWidths(prev =>
        prev[columnField] === newWidth
          ? prev
          : { ...prev, [columnField]: newWidth }
      )
      onColumnResize?.(columnField, newWidth)
    },
    [updatedColumns, onColumnResize]
  )

  return {
    updatedColumns,
    isResizing,
    resizingColumn,
    getResizeHandleProps,
    resizeColumnBy,
  }
}

'use client'
import * as React from 'react'

export interface ColumnResizingState {
  /** Current widths of each column, keyed by column field. */
  widths: Record<string, number>
  /** The column field currently being resized (if any). */
  activeField: string | null
  /** The starting x-position when the user begins dragging. */
  startX: number | null
  /** Original width of the column at drag start. */
  startWidth: number | null
}

export interface UseResizableColumnResult {
  /** The resizing state (widths, activeField, etc.). */
  state: ColumnResizingState
  /**
   * Call this in your column header’s “resizer handle” onMouseDown
   * e.g.: onMouseDown={e => handleMouseDown(column.field, e)}.
   */
  handleMouseDown: (field: string, e: React.MouseEvent) => void
  /** Hook-internally used handlers. */
  handleMouseMove: (e: MouseEvent) => void
  handleMouseUp: () => void
}

/**
 * A hook to manage drag-to-resize for columns:
 *  - track each column's width in state
 *  - on mousedown in a handle, store the column + initial positions
 *  - on mousemove, update the width
 *  - on mouseup, finish
 */
export function useResizableColumn(
  initialWidths: Record<string, number> = {}
): UseResizableColumnResult {
  const [state, setState] = React.useState<ColumnResizingState>({
    widths: initialWidths,
    activeField: null,
    startX: null,
    startWidth: null,
  })

  /** Begin resizing a column. */
  const handleMouseDown = React.useCallback(
    (field: string, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Look up the current width, or default to 150
      const currentWidth = state.widths[field] ?? 150

      setState(prev => ({
        ...prev,
        activeField: field,
        startX: e.clientX,
        startWidth: currentWidth,
      }))
    },
    [state.widths]
  )

  /** While dragging, compute new width. */
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const { activeField, startX, startWidth } = state
      if (!activeField || startX === null || startWidth === null) return

      const deltaX = e.clientX - startX
      const newWidth = Math.max(50, startWidth + deltaX)

      setState(prev => ({
        ...prev,
        widths: {
          ...prev.widths,
          [activeField]: newWidth,
        },
      }))
    },
    [state]
  )

  /** End drag. */
  const handleMouseUp = React.useCallback(() => {
    if (!state.activeField) return
    setState(prev => ({
      ...prev,
      activeField: null,
      startX: null,
      startWidth: null,
    }))
  }, [state.activeField])

  /** Attach/detach global mouse events while dragging. */
  React.useEffect(() => {
    if (state.activeField !== null) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [state.activeField, handleMouseMove, handleMouseUp])

  return {
    state,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

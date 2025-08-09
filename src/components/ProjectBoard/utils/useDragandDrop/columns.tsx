// src/components/ProjectBoard/utils/useDragandDrop/columns.tsx

'use client'

import React, { useCallback } from 'react'
import type { ColumnData } from '../../types'

/** Column drag information */
interface ColumnDragInfo {
  columnId: string
  columnIndex: number
}

/**
 * GitHub-like column drag and drop hook.
 * Simplifies column reordering - columns are directly draggable without pre-selection.
 */
export function useColumnDragAndDrop(
  columnState: ColumnData[],
  setColumnState: React.Dispatch<React.SetStateAction<ColumnData[]>>
) {
  const [draggedColumn, setDraggedColumn] =
    React.useState<ColumnDragInfo | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOverColumnIndex, setDragOverColumnIndex] = React.useState<
    number | null
  >(null)

  /** Utility to reorder columns in the array. */
  const reorderColumns = useCallback(
    <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
      const result = [...list]
      const [removed] = result.splice(startIndex, 1)
      if (removed === undefined) {
        return result
      }
      result.splice(endIndex, 0, removed)
      return result
    },
    []
  )

  const handleColumnDragStart = useCallback(
    (e: React.DragEvent, columnIndex: number) => {
      const column = columnState[columnIndex]
      if (!column) return

      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', column._id)

      setDraggedColumn({ columnId: column._id, columnIndex })
      setIsDragging(true)

      // Add some visual feedback to the drag image
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
      dragImage.style.opacity = '0.7'
      dragImage.style.transform = 'rotate(2deg)'
      e.dataTransfer.setDragImage(dragImage, 0, 0)
    },
    [columnState]
  )

  const handleColumnDragOver = useCallback(
    (e: React.DragEvent, columnIndex: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'

      if (draggedColumn && draggedColumn.columnIndex !== columnIndex) {
        setDragOverColumnIndex(columnIndex)
      }
    },
    [draggedColumn]
  )

  const handleColumnDragEnter = useCallback(
    (e: React.DragEvent, columnIndex: number) => {
      e.preventDefault()

      if (draggedColumn && draggedColumn.columnIndex !== columnIndex) {
        setDragOverColumnIndex(columnIndex)
      }
    },
    [draggedColumn]
  )

  const handleColumnDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()

    // Only clear drag over if we're actually leaving the drop zone.
    // React.DragEvent does not expose relatedTarget, so compute using elementFromPoint.
    const currentTarget = e.currentTarget as HTMLElement
    const nextElement = document.elementFromPoint(e.clientX, e.clientY)
    if (!nextElement || !currentTarget.contains(nextElement)) {
      setDragOverColumnIndex(null)
    }
  }, [])

  const handleColumnDrop = useCallback(
    (e: React.DragEvent, dropColumnIndex: number) => {
      e.preventDefault()

      if (!draggedColumn) {
        setIsDragging(false)
        setDragOverColumnIndex(null)
        return
      }

      const sourceIndex = draggedColumn.columnIndex

      // Don't do anything if dropping in the same position
      if (sourceIndex === dropColumnIndex) {
        setDraggedColumn(null)
        setIsDragging(false)
        setDragOverColumnIndex(null)
        return
      }

      // Reorder columns
      const newColumns = reorderColumns(
        columnState,
        sourceIndex,
        dropColumnIndex
      )
      setColumnState(newColumns)

      // Reset drag state
      setDraggedColumn(null)
      setIsDragging(false)
      setDragOverColumnIndex(null)
    },
    [draggedColumn, columnState, reorderColumns, setColumnState]
  )

  const resetColumnDragState = useCallback(() => {
    setDraggedColumn(null)
    setIsDragging(false)
    setDragOverColumnIndex(null)
  }, [])

  return {
    draggedColumn,
    isDragging,
    dragOverColumnIndex,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnter,
    handleColumnDragLeave,
    handleColumnDrop,
    resetColumnDragState,
  }
}

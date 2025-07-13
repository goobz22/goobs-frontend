// src/components/ProjectBoard/utils/useDragandDrop/tasks.tsx

'use client'

import React from 'react'
import type { ColumnData } from '../../types'

/** Input shape for a full cross-column move. */
interface HandleTaskDropArgs {
  dropColumnIndex: number
  dropTaskIndex: number
  allColumns: ColumnData[]
  setAllColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>
}

/** Item describing which task is being dragged. */
interface DragInfo {
  columnIndex: number
  taskIndex: number
}

/**
 * A custom hook to manage drag-and-drop for tasks (cards).
 * This version splices tasks out of one column and into another,
 * updating the global array (allColumns).
 */
export function useTaskDragAndDrop() {
  const [dragItem, setDragItem] = React.useState<DragInfo | null>(null)

  function handleTaskDragStart(item: DragInfo) {
    setDragItem(item)
  }

  function handleTaskDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleTaskDrop(
    e: React.DragEvent,
    {
      dropColumnIndex,
      dropTaskIndex,
      allColumns,
      setAllColumns,
    }: HandleTaskDropArgs
  ) {
    e.preventDefault()
    if (!dragItem) return

    const { columnIndex: sourceColIdx, taskIndex: sourceTaskIdx } = dragItem
    if (sourceColIdx < 0 || sourceColIdx >= allColumns.length) return

    const sourceColumn = allColumns[sourceColIdx]
    if (sourceTaskIdx < 0 || sourceTaskIdx >= sourceColumn.tasks.length) return

    // The task being moved
    const [movedTask] = sourceColumn.tasks.splice(sourceTaskIdx, 1)

    // Insert into the target column
    if (dropColumnIndex < 0 || dropColumnIndex >= allColumns.length) {
      // If invalid drop, just put it back
      sourceColumn.tasks.splice(sourceTaskIdx, 0, movedTask)
      setDragItem(null)
      return
    }
    const destColumn = allColumns[dropColumnIndex]

    // Clamp the dropTaskIndex
    if (dropTaskIndex < 0) dropTaskIndex = 0
    if (dropTaskIndex > destColumn.tasks.length) {
      dropTaskIndex = destColumn.tasks.length
    }

    destColumn.tasks.splice(dropTaskIndex, 0, movedTask)

    // Update the global store
    const newCols = [...allColumns]
    newCols[sourceColIdx] = { ...sourceColumn }
    newCols[dropColumnIndex] = { ...destColumn }
    setAllColumns(newCols)

    setDragItem(null)
  }

  return {
    dragItem,
    setDragItem,
    handleTaskDragStart,
    handleTaskDragOver,
    handleTaskDrop,
  }
}

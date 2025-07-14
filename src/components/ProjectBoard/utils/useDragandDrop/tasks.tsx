// src/components/ProjectBoard/utils/useDragandDrop/tasks.tsx

'use client'

import React, { useCallback } from 'react'
import type { ColumnData } from '../../types'

/** Item describing which task is being dragged. */
interface DragInfo {
  taskId: string
  columnIndex: number
  taskIndex: number
}

/**
 * GitHub-like drag and drop hook for tasks.
 * Simplifies the drag model - tasks are directly draggable without pre-selection.
 */
export function useTaskDragAndDrop() {
  const [dragItem, setDragItem] = React.useState<DragInfo | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOverInfo, setDragOverInfo] = React.useState<{
    columnIndex: number
    taskIndex: number
  } | null>(null)

  const handleTaskDragStart = useCallback(
    (
      e: React.DragEvent,
      taskId: string,
      columnIndex: number,
      taskIndex: number
    ) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', taskId)

      setDragItem({ taskId, columnIndex, taskIndex })
      setIsDragging(true)

      // Add ghost image styling
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
      dragImage.style.opacity = '0.5'
      dragImage.style.transform = 'rotate(5deg)'
      e.dataTransfer.setDragImage(dragImage, 0, 0)
    },
    []
  )

  const handleTaskDragOver = useCallback(
    (e: React.DragEvent, columnIndex: number, taskIndex: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'

      setDragOverInfo({ columnIndex, taskIndex })
    },
    []
  )

  const handleTaskDragEnter = useCallback(
    (e: React.DragEvent, columnIndex: number, taskIndex: number) => {
      e.preventDefault()
      setDragOverInfo({ columnIndex, taskIndex })
    },
    []
  )

  const handleTaskDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Only clear drag over info if we're actually leaving the drop zone
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverInfo(null)
    }
  }, [])

  const handleTaskDrop = useCallback(
    (
      e: React.DragEvent,
      dropColumnIndex: number,
      dropTaskIndex: number,
      allColumns: ColumnData[],
      setAllColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>
    ) => {
      e.preventDefault()

      if (!dragItem) return

      const { columnIndex: sourceColIdx, taskIndex: sourceTaskIdx } = dragItem

      // Don't do anything if dropping in the same position
      if (sourceColIdx === dropColumnIndex && sourceTaskIdx === dropTaskIndex) {
        setDragItem(null)
        setIsDragging(false)
        setDragOverInfo(null)
        return
      }

      if (sourceColIdx < 0 || sourceColIdx >= allColumns.length) return
      if (dropColumnIndex < 0 || dropColumnIndex >= allColumns.length) return

      // Create a deep copy of all columns to avoid mutation
      const newColumns = allColumns.map(col => ({
        ...col,
        tasks: [...col.tasks],
      }))

      const sourceColumn = newColumns[sourceColIdx]
      const destColumn = newColumns[dropColumnIndex]
      const sourceTask = sourceColumn.tasks[sourceTaskIdx]

      if (!sourceTask) return

      // Remove task from source column
      sourceColumn.tasks.splice(sourceTaskIdx, 1)

      // Add task to destination column at the specified position
      const insertIndex = Math.min(dropTaskIndex, destColumn.tasks.length)
      destColumn.tasks.splice(insertIndex, 0, sourceTask)

      // Update state with the new columns array
      setAllColumns(newColumns)

      // Clear drag state
      setDragItem(null)
      setIsDragging(false)
      setDragOverInfo(null)
    },
    [dragItem]
  )

  const handleColumnDragOver = useCallback(
    (e: React.DragEvent, columnIndex: number, allColumns: ColumnData[]) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'

      // If dragging over empty space in column, set drop position to end
      setDragOverInfo({
        columnIndex,
        taskIndex: allColumns[columnIndex]?.tasks.length || 0,
      })
    },
    []
  )

  const handleColumnDrop = useCallback(
    (
      e: React.DragEvent,
      columnIndex: number,
      allColumns: ColumnData[],
      setAllColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>
    ) => {
      e.preventDefault()

      if (!dragItem) return

      // Drop the task at the end of the target column
      const taskIndex = allColumns[columnIndex]?.tasks.length || 0
      handleTaskDrop(e, columnIndex, taskIndex, allColumns, setAllColumns)
    },
    [dragItem, handleTaskDrop]
  )

  const resetDragState = useCallback(() => {
    setDragItem(null)
    setIsDragging(false)
    setDragOverInfo(null)
  }, [])

  return {
    dragItem,
    isDragging,
    dragOverInfo,
    handleTaskDragStart,
    handleTaskDragOver,
    handleTaskDragEnter,
    handleTaskDragLeave,
    handleTaskDrop,
    handleColumnDragOver,
    handleColumnDrop,
    resetDragState,
  }
}

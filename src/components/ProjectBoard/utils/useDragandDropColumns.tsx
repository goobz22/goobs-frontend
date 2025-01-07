// src\components\ProjectBoard\utils\useDragandDropColumns.tsx
'use client'

import React from 'react'
import type {
  ColumnData,
  Task,
  BoardType,
  CompanyInfo,
  OnUpdateTaskArgs,
} from '../index'

/**
 * This custom hook manages column-level (and optional task-level) drag and drop.
 * We also accept a "boardType" (e.g. "severityLevel", "status", "subStatus", "topic")
 * so we know which field on the task to update when the user drops it in a new column.
 */
export function useDragAndDropColumns(
  columnState: ColumnData[],
  setColumnState: React.Dispatch<React.SetStateAction<ColumnData[]>>,
  company: CompanyInfo | undefined,
  onUpdateTask?: (args: OnUpdateTaskArgs) => void,
  boardType?: BoardType // e.g. "severityLevel", "status", "subStatus", "topic"
) {
  // We'll store info about what's being dragged
  const [dragItem, setDragItem] = React.useState<{
    type: 'column' | 'task'
    columnIndex: number
    taskIndex?: number
  } | null>(null)

  // A helper to reorder a list (for columns or tasks).
  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  // --------------------------------------------------------------------------
  // COLUMN DRAG EVENTS
  // --------------------------------------------------------------------------
  const handleColumnDragStart = (e: React.DragEvent, columnIndex: number) => {
    setDragItem({ type: 'column', columnIndex })
  }

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleColumnDrop = (e: React.DragEvent, dropColumnIndex: number) => {
    e.preventDefault()
    if (!dragItem || dragItem.type !== 'column') {
      setDragItem(null)
      return
    }

    const newCols = reorder(columnState, dragItem.columnIndex, dropColumnIndex)
    setColumnState(newCols)
    setDragItem(null)
  }

  // --------------------------------------------------------------------------
  // TASK DRAG EVENTS
  // --------------------------------------------------------------------------
  const handleTaskDragStart = (
    e: React.DragEvent,
    columnIndex: number,
    taskIndex: number,
    selectedTask: { colIndex: number; taskIndex: number } | null
  ) => {
    // Only allow dragging if the user selected this exact task
    if (
      selectedTask &&
      selectedTask.colIndex === columnIndex &&
      selectedTask.taskIndex === taskIndex
    ) {
      setDragItem({ type: 'task', columnIndex, taskIndex })
    } else {
      e.preventDefault()
    }
  }

  const handleTaskDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  /**
   * When a task is dropped into a new column, we update the relevant property (severityId, statusId, substatusId, or topicIds).
   */
  const handleTaskDrop = (
    e: React.DragEvent,
    dropColumnIndex: number,
    dropTaskIndex: number
  ) => {
    e.preventDefault()
    if (!dragItem || dragItem.type !== 'task') return

    const { columnIndex: sourceColIdx, taskIndex: sourceTaskIdx } = dragItem
    const newCols = [...columnState]

    // Remove from old column
    const sourceCol = newCols[sourceColIdx]
    if (
      !sourceCol ||
      sourceTaskIdx == null ||
      sourceTaskIdx < 0 ||
      sourceTaskIdx >= sourceCol.tasks.length
    ) {
      setDragItem(null)
      return
    }

    const [movedTask] = sourceCol.tasks.splice(sourceTaskIdx, 1)

    // Insert into new column
    const destCol = newCols[dropColumnIndex]
    if (!destCol) {
      setDragItem(null)
      return
    }

    // If dropTaskIndex is out of range, clamp it
    if (dropTaskIndex < 0) dropTaskIndex = 0
    if (dropTaskIndex > destCol.tasks.length) {
      dropTaskIndex = destCol.tasks.length
    }

    destCol.tasks.splice(dropTaskIndex, 0, movedTask)

    // If user dropped into a different column => update the relevant ID
    if (sourceColIdx !== dropColumnIndex) {
      // e.g. if boardType="severityLevel", movedTask.severityId = destCol._id
      // etc.
      updateTaskField(movedTask, destCol._id)

      // Also call onUpdateTask if provided
      onUpdateTask?.({
        companyId: company?._id || 'missing-company-id',
        _id: movedTask._id,
        input: {
          // We'll pass whichever property we changed
          // e.g. { severityId: destCol._id }
          ...buildUpdateInput(boardType, destCol._id),
        },
      })
    }

    setColumnState(newCols)
    setDragItem(null)
  }

  // --------------------------------------------------------------------------
  // HELPER to set the relevant field on the task
  // --------------------------------------------------------------------------
  const updateTaskField = (task: Task, newColId: string) => {
    switch (boardType) {
      case 'severityLevel':
        task.severityId = newColId
        break
      case 'status':
        task.statusId = newColId
        break
      case 'subStatus':
        task.substatusId = newColId
        break
      case 'topic':
        // if it's a single topic board, you might do something like:
        task.topicIds = [newColId]
        break
    }
  }

  // --------------------------------------------------------------------------
  // HELPER to build the "input" object for onUpdateTask
  // --------------------------------------------------------------------------
  const buildUpdateInput = (bType: BoardType | undefined, newColId: string) => {
    switch (bType) {
      case 'severityLevel':
        return { severityId: newColId }
      case 'status':
        return { statusId: newColId }
      case 'subStatus':
        return { substatusId: newColId }
      case 'topic':
        return { topicIds: [newColId] }
      default:
        return {}
    }
  }

  return {
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    handleTaskDragStart,
    handleTaskDragOver,
    handleTaskDrop,
  }
}

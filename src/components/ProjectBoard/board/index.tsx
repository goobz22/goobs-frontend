'use client'

import React, { useState, useCallback } from 'react'
import { useProjectBoard } from '../context/ProjectBoardContext'
import { useColumnDragAndDrop } from '../utils/useDragandDrop/columns'
import { useTaskDragAndDrop } from '../utils/useDragandDrop/tasks'
import type { ColumnData, ProjectBoardStyles } from '../types'
import cssStyles from '../ProjectBoard.module.css'

// Built-in TaskCard component
interface TaskCardProps {
  title: string
  description: string
  checked: boolean
  onCheck: () => void
  onEdit: (title: string, description: string) => void
  onDelete: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragEnter?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  checked,
  onCheck,
  onEdit,
  draggable = false,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)

  const handleSave = () => {
    onEdit(editTitle, editDescription)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setIsEditing(false)
  }

  // The board's data-theme on the .board ancestor cascades the CSS vars used
  // by .taskCard and friends, so the card itself needs no theme branching.
  const taskCardClassName = draggable
    ? `${cssStyles.taskCard} ${cssStyles.taskCardDraggable}`
    : cssStyles.taskCard

  return (
    <div
      className={taskCardClassName}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        className={cssStyles.taskCheckbox}
        // The checkbox selects this task (to then "Manage" it). Icon/position
        // alone gave it no accessible name — screen readers announced a bare
        // "checkbox". Name it by the task it selects (WCAG 4.1.2 / 1.3.1).
        aria-label={`Select task: ${title}`}
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className={cssStyles.taskInput}
            placeholder="Task title"
            // Placeholder is not an accessible label (it vanishes on input and
            // is not reliably exposed) — give the field a real name (WCAG 1.3.1).
            aria-label="Task title"
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className={cssStyles.taskTextarea}
            placeholder="Task description"
            aria-label="Task description"
          />
          <div className={cssStyles.taskActions}>
            <button
              type="button"
              className={`${cssStyles.taskButton} ${cssStyles.taskSaveButton}`}
              data-action="save"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className={`${cssStyles.taskButton} ${cssStyles.taskCancelButton}`}
              data-action="cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className={cssStyles.taskTitle}>{title}</h4>
          <p className={cssStyles.taskDescription}>{description}</p>
        </>
      )}
    </div>
  )
}

export interface BoardProps {
  columns: ColumnData[]
  selectedTaskId: string | null
  onTaskSelect: (taskId: string) => void
  columnDragAndDrop: ReturnType<typeof useColumnDragAndDrop>
  taskDragAndDrop: ReturnType<typeof useTaskDragAndDrop>
  styles?: ProjectBoardStyles
}

export default function Board({
  columns,
  selectedTaskId,
  onTaskSelect,
  columnDragAndDrop,
  taskDragAndDrop,
  styles,
}: BoardProps) {
  const { columns: allColumns, setColumns: setAllColumns } = useProjectBoard()

  // data-theme on the .board root cascades the theme CSS variables to every
  // column / task card, so no per-column JS style computation is needed.
  const theme = styles?.theme ?? 'light'

  const handleTaskSelect = useCallback(
    (taskId: string) => {
      onTaskSelect(taskId)
    },
    [onTaskSelect]
  )

  const handleColumnDragStart = useCallback(
    (e: React.DragEvent, columnIndex: number) => {
      const target = e.currentTarget as HTMLElement
      target.style.cursor = 'grabbing'
      columnDragAndDrop.handleColumnDragStart(e, columnIndex)
    },
    [columnDragAndDrop]
  )

  const handleColumnDragEnd = useCallback(
    (e: React.DragEvent) => {
      const target = e.currentTarget as HTMLElement
      target.style.cursor = 'grab'
      columnDragAndDrop.resetColumnDragState()
    },
    [columnDragAndDrop]
  )

  const renderTask = useCallback(
    (task: any, taskIndex: number, columnIndex: number) => {
      const isSelected = selectedTaskId === task._id
      const isDragging = taskDragAndDrop.dragItem?.taskId === task._id

      return (
        <div
          key={task._id}
          role="listitem"
          className={cssStyles.taskWrapper}
          style={
            isDragging
              ? ({ ['--pb-task-opacity']: '0.5' } as React.CSSProperties)
              : undefined
          }
        >
          <TaskCard
            title={task.title}
            description={task.description}
            checked={isSelected}
            onCheck={() => handleTaskSelect(task._id)}
            onEdit={(title: string, description: string) => {
              // Update the task in the columns
              const newColumns = [...allColumns]
              const updatedTask = { ...task, title, description }
              const currentColumn = newColumns[columnIndex]!
              newColumns[columnIndex] = {
                _id: currentColumn._id,
                title: currentColumn.title,
                description: currentColumn.description,
                tasks: currentColumn.tasks.map(t =>
                  t._id === task._id ? updatedTask : t
                ),
              }
              setAllColumns(newColumns)
            }}
            onDelete={() => {
              // Remove the task from the columns
              const newColumns = [...allColumns]
              const currentColumn = newColumns[columnIndex]!
              newColumns[columnIndex] = {
                _id: currentColumn._id,
                title: currentColumn.title,
                description: currentColumn.description,
                tasks: currentColumn.tasks.filter(t => t._id !== task._id),
              }
              setAllColumns(newColumns)
            }}
            draggable={true}
            onDragStart={(e: React.DragEvent) => {
              e.stopPropagation() // Prevent column drag from triggering
              taskDragAndDrop.handleTaskDragStart(
                e,
                task._id,
                columnIndex,
                taskIndex
              )
            }}
            onDragOver={(e: React.DragEvent) => {
              e.stopPropagation()
              taskDragAndDrop.handleTaskDragOver(e, columnIndex, taskIndex)
            }}
            onDragEnter={(e: React.DragEvent) => {
              e.stopPropagation()
              taskDragAndDrop.handleTaskDragEnter(e, columnIndex, taskIndex)
            }}
            onDragLeave={(e: React.DragEvent) => {
              e.stopPropagation()
              taskDragAndDrop.handleTaskDragLeave(e)
            }}
            onDrop={(e: React.DragEvent) => {
              e.stopPropagation()
              taskDragAndDrop.handleTaskDrop(
                e,
                columnIndex,
                taskIndex,
                allColumns,
                setAllColumns
              )
            }}
          />
        </div>
      )
    },
    [
      selectedTaskId,
      taskDragAndDrop,
      handleTaskSelect,
      allColumns,
      setAllColumns,
    ]
  )

  const renderColumn = useCallback(
    (column: ColumnData, columnIndex: number) => {
      const isDragOver = columnDragAndDrop.dragOverColumnIndex === columnIndex
      const columnClassName = isDragOver
        ? `${cssStyles.column} ${cssStyles.columnDragOver}`
        : cssStyles.column

      return (
        <div key={column._id} className={columnClassName}>
          {/* Column Header - Only this area is draggable for column reordering */}
          <div
            className={cssStyles.columnHeader}
            draggable={true}
            onDragStart={e => {
              e.stopPropagation()
              handleColumnDragStart(e, columnIndex)
            }}
            onDragOver={e => {
              e.stopPropagation()
              columnDragAndDrop.handleColumnDragOver(e, columnIndex)
            }}
            onDragEnter={e => {
              e.stopPropagation()
              columnDragAndDrop.handleColumnDragEnter(e, columnIndex)
            }}
            onDragLeave={e => {
              e.stopPropagation()
              columnDragAndDrop.handleColumnDragLeave(e)
            }}
            onDrop={e => {
              e.stopPropagation()
              columnDragAndDrop.handleColumnDrop(e, columnIndex)
            }}
            onDragEnd={handleColumnDragEnd}
          >
            <h3 className={cssStyles.columnTitle}>{column.title}</h3>
            <p className={cssStyles.columnDescription}>{column.description}</p>
          </div>

          {/* Tasks Container - Only handles task drops, not column drags */}
          <div
            className={cssStyles.tasksContainer}
            onDragOver={e => {
              // Only handle if it's a task being dragged, not a column
              if (taskDragAndDrop.dragItem) {
                e.stopPropagation()
                taskDragAndDrop.handleColumnDragOver(e, columnIndex, allColumns)
              }
            }}
            onDrop={e => {
              // Only handle if it's a task being dragged, not a column
              if (taskDragAndDrop.dragItem) {
                e.stopPropagation()
                taskDragAndDrop.handleColumnDrop(
                  e,
                  columnIndex,
                  allColumns,
                  setAllColumns
                )
              }
            }}
          >
            {column.tasks.length === 0 ? (
              <div className={cssStyles.noTasks}>No tasks yet</div>
            ) : (
              <div
                className={cssStyles.tasksList}
                role="list"
                aria-label={`${column.title} tasks`}
              >
                {column.tasks.map((task, taskIndex) =>
                  renderTask(task, taskIndex, columnIndex)
                )}

                {/* Drag placeholder */}
                {taskDragAndDrop.dragOverInfo?.columnIndex === columnIndex &&
                  taskDragAndDrop.dragOverInfo?.taskIndex ===
                    column.tasks.length && (
                    <div className={cssStyles.taskDragPlaceholder}>
                      Drop task here
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )
    },
    [
      columnDragAndDrop,
      handleColumnDragStart,
      handleColumnDragEnd,
      taskDragAndDrop,
      allColumns,
      setAllColumns,
      renderTask,
    ]
  )

  return (
    <div className={cssStyles.board} data-theme={theme}>
      {columns.map((column, index) => renderColumn(column, index))}
    </div>
  )
}

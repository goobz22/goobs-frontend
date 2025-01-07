// src\components\ProjectBoard\Column\index.tsx
'use client'

import React from 'react'
import { Box, Stack } from '@mui/material'
import TaskCard from '../../Card/variants/task'
import Typography from '../../../components/Typography'
import { black, white } from '../../../styles/palette'

// Import the Task type from your updated ProjectBoard index
import type { Task } from '../../ProjectBoard'

/** Helper to get a unique string ID from a task. */
function getTaskId(task: Task): string {
  // We assume _id is always defined; if not, fallback:
  return task._id || 'unknown-task-id'
}

export type ColumnProps = {
  index: number
  title: string
  description: string
  tasks?: Task[]

  /** Column-level drag-and-drop handlers. */
  onColumnDragStart: (e: React.DragEvent, columnIndex: number) => void
  onColumnDragOver: (e: React.DragEvent, columnIndex: number) => void
  onColumnDrop: (e: React.DragEvent, columnIndex: number) => void

  /** Task-level drag-and-drop handlers. */
  onTaskDragStart: (
    e: React.DragEvent,
    columnIndex: number,
    taskIndex: number
  ) => void
  onTaskDragOver: (
    e: React.DragEvent,
    columnIndex: number,
    taskIndex: number
  ) => void
  onTaskDragDrop: (
    e: React.DragEvent,
    columnIndex: number,
    taskIndex: number
  ) => void

  /**
   * Single-selected task (by column & index).
   * If the user has chosen to "Manage" or "Show" a single task, we highlight it.
   */
  selectedTask: { colIndex: number; taskIndex: number } | null

  /** Called when the user toggles a task’s selection. */
  onSelectTask: (colIndex: number, taskIndex: number) => void
}

function Column({
  index,
  title,
  description,
  tasks,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onTaskDragStart,
  onTaskDragOver,
  onTaskDragDrop,
  selectedTask,
  onSelectTask,
}: ColumnProps) {
  return (
    <Box
      /* The entire column is draggable for column reorder */
      draggable
      onDragStart={e => onColumnDragStart(e, index)}
      onDragOver={e => onColumnDragOver(e, index)}
      onDrop={e => onColumnDrop(e, index)}
      sx={{
        boxSizing: 'border-box',
        width: '420px',
        height: '70vh',
        backgroundColor: black.main,
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Column Head */}
      <Box
        sx={{
          borderBottom: `1px solid ${white.main}`,
          p: 2,
        }}
      >
        <Stack direction="column" spacing={0.5}>
          <Typography fontvariant="merrih4" fontcolor={white.main}>
            {title}
          </Typography>
          <Typography fontvariant="merrih6" fontcolor={white.main}>
            {description}
          </Typography>
        </Stack>
      </Box>

      {/* Column Body: list of tasks */}
      <Box sx={{ p: 2, flex: 1 }}>
        {!tasks || tasks.length === 0 ? (
          <Typography fontcolor={white.main}>No tasks yet</Typography>
        ) : (
          <Stack spacing={1}>
            {tasks.map((task, taskIndex) => {
              const isSelected =
                selectedTask?.colIndex === index &&
                selectedTask?.taskIndex === taskIndex

              return (
                <TaskCard
                  key={getTaskId(task)}
                  /* If the checkbox is selected => we allow dragging that specific task */
                  draggable={isSelected}
                  onDragStart={e => onTaskDragStart(e, index, taskIndex)}
                  onDragOver={e => onTaskDragOver(e, index, taskIndex)}
                  onDrop={e => onTaskDragDrop(e, index, taskIndex)}
                  checked={isSelected}
                  onCheck={() => onSelectTask(index, taskIndex)}
                  title={task.title}
                  description={task.description}
                />
              )
            })}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default Column

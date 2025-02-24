'use client'

import React, { useState, useCallback } from 'react'
import { Box, Stack, Checkbox } from '@mui/material'
import { useAtom } from 'jotai'
import { columnsAtom } from '../../jotai/atom'

import Typography from '../../../Typography'
import Card from '../../../Card'
import Dropdown from '../../../Dropdown'
import { black, white } from '../../../../styles/palette'

import type { BoardProps } from '../index'
import type { ColumnData } from '../../types'
import { useTaskDragAndDrop } from '../../../ProjectBoard/utils/useDragandDrop/tasks'

export default function DesktopBoard({
  columns,
  overflowColumns,
  selectedOverflowColumnId,
  onChangeSelectedOverflowColumn,
  selectedTask,
  onSelectTask,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
}: BoardProps) {
  // We read/write the entire array of columns from the global store for tasks
  const [allColumns, setAllColumns] = useAtom(columnsAtom)

  // Column-level checkbox approach
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(
    null
  )

  // Task-level DnD logic
  const { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
    useTaskDragAndDrop()

  // ─────────────────────────────────────────────────────────────────────────────
  // Checkbox & DnD constraints
  // ─────────────────────────────────────────────────────────────────────────────
  function isColumnCheckboxDisabled() {
    return selectedTask !== null
  }
  function isTaskCheckboxDisabled() {
    return selectedColumnIndex !== null
  }

  function handleColumnCheck(colIndex: number) {
    if (selectedColumnIndex === colIndex) {
      setSelectedColumnIndex(null)
    } else {
      // If user checks a column, uncheck any tasks
      onSelectTask(-1, -1)
      setSelectedColumnIndex(colIndex)
    }
  }
  function isColumnDraggable(colIndex: number): boolean {
    return selectedColumnIndex === colIndex
  }

  // Local column drag handlers
  function handleLocalColumnDragStart(e: React.DragEvent, colIndex: number) {
    if (!isColumnDraggable(colIndex)) {
      e.preventDefault()
      return
    }
    onColumnDragStart(e, colIndex)
  }
  function handleLocalColumnDragOver(e: React.DragEvent, colIndex: number) {
    e.preventDefault()
    onColumnDragOver(e, colIndex)
  }
  function handleLocalColumnDrop(e: React.DragEvent, colIndex: number) {
    e.preventDefault()
    onColumnDrop(e, colIndex)
  }

  // Local task drag handlers
  function isTaskDraggable(colIndex: number, taskIndex: number) {
    if (selectedColumnIndex !== null) return false
    return (
      selectedTask?.colIndex === colIndex &&
      selectedTask?.taskIndex === taskIndex
    )
  }
  function handleLocalTaskDragStart(
    e: React.DragEvent,
    columnIndex: number,
    taskIndex: number
  ) {
    if (isTaskDraggable(columnIndex, taskIndex)) {
      handleTaskDragStart(e, { columnIndex, taskIndex })
    } else {
      e.preventDefault()
    }
  }
  function handleLocalTaskDrop(
    e: React.DragEvent,
    dropColumnIndex: number,
    dropTaskIndex: number
  ) {
    e.preventDefault()
    handleTaskDrop(e, {
      dropColumnIndex,
      dropTaskIndex,
      allColumns,
      setAllColumns,
    })
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Overflow logic: We still show fitted columns + (if any) 1 overflow column
  // ─────────────────────────────────────────────────────────────────────────────
  const hasOverflow = Boolean(overflowColumns?.length)
  let activeOverflowColumn: ColumnData | undefined
  if (hasOverflow && selectedOverflowColumnId && overflowColumns) {
    activeOverflowColumn =
      overflowColumns.find(c => c._id === selectedOverflowColumnId) ||
      overflowColumns[0]
  }

  const handleOverflowDropdownChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!overflowColumns || !onChangeSelectedOverflowColumn) return
      const colTitle = e.target.value
      const found = overflowColumns.find(c => c.title === colTitle)
      if (found) {
        onChangeSelectedOverflowColumn(found._id)
      }
    },
    [overflowColumns, onChangeSelectedOverflowColumn]
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Stack direction="row" spacing={3}>
      {/* 1) Show all "fitted" columns that are not in overflow */}
      {columns.map((col, colIndex) => {
        const colChecked = selectedColumnIndex === colIndex

        return (
          <Box
            key={col._id}
            draggable={isColumnDraggable(colIndex)}
            onDragStart={e => handleLocalColumnDragStart(e, colIndex)}
            onDragOver={e => handleLocalColumnDragOver(e, colIndex)}
            onDrop={e => handleLocalColumnDrop(e, colIndex)}
            sx={{
              boxSizing: 'border-box',
              width: '300px',
              height: '70vh',
              backgroundColor: black.main,
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              overflowX: 'hidden',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                borderBottom: `1px solid ${white.main}`,
                p: 2,
                position: 'relative',
              }}
            >
              <Checkbox
                checked={colChecked}
                disabled={isColumnCheckboxDisabled()}
                onChange={() => handleColumnCheck(colIndex)}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  color: white.main,
                  '&.Mui-checked': {
                    color: white.main,
                  },
                }}
              />

              <Stack direction="column" spacing={0.5}>
                <Typography fontvariant="merrih4" fontcolor={white.main}>
                  {col.title}
                </Typography>
                <Typography fontvariant="merrih6" fontcolor={white.main}>
                  {col.description}
                </Typography>
              </Stack>
            </Box>

            {/* Column Body: tasks */}
            <Box sx={{ p: 2, flex: 1 }}>
              {!col.tasks?.length ? (
                <Typography fontcolor={white.main}>No tasks yet</Typography>
              ) : (
                <Stack spacing={1}>
                  {col.tasks.map((task, taskIndex) => {
                    const isSelected =
                      selectedTask?.colIndex === colIndex &&
                      selectedTask?.taskIndex === taskIndex

                    return (
                      <Card
                        key={task._id}
                        variant="task"
                        sx={{
                          mx: '5px',
                          width: { xs: '250px', sm: '250px' },
                        }}
                        taskProps={{
                          title: task.title,
                          description: task.description,
                          checked: isSelected,
                          disabled: isTaskCheckboxDisabled(),
                          onCheck: () => {
                            if (selectedColumnIndex !== null) return
                            onSelectTask(colIndex, taskIndex)
                          },
                          draggable: isTaskDraggable(colIndex, taskIndex),
                          onDragStart: e =>
                            handleLocalTaskDragStart(e, colIndex, taskIndex),
                          onDragOver: handleTaskDragOver,
                          onDrop: e =>
                            handleLocalTaskDrop(e, colIndex, taskIndex),
                        }}
                      />
                    )
                  })}
                </Stack>
              )}
            </Box>
          </Box>
        )
      })}

      {/* 2) If there's overflow, show exactly ONE overflow column with dropdown */}
      {hasOverflow && activeOverflowColumn && (
        <Box
          key="overflow-desktop-column"
          draggable={false}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            // Drop a task onto the overflow column background
            e.preventDefault()
            onColumnDrop(e, columns.length)
          }}
          sx={{
            boxSizing: 'border-box',
            width: '300px',
            height: '70vh',
            backgroundColor: black.main,
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Overflow Column Header */}
          <Box
            sx={{
              borderBottom: `1px solid ${white.main}`,
              p: 2,
              position: 'relative',
            }}
          >
            <Dropdown
              label="More Columns"
              options={
                overflowColumns?.map(col => ({ value: col.title })) ?? []
              }
              value={activeOverflowColumn?.title}
              onChange={handleOverflowDropdownChange}
              fontcolor="#000"
              shrunkfontcolor={white.main}
              backgroundcolor={white.main}
              shrunklabelposition="aboveNotch"
            />

            {/* 
              REMOVE the overflow column's title here, keep only the description
            */}
            <Stack direction="column" spacing={0.5} mt={1}>
              {/* We omit activeOverflowColumn.title */}
              <Typography fontvariant="merrih6" fontcolor={white.main}>
                {activeOverflowColumn.description}
              </Typography>
            </Stack>
          </Box>

          {/* Overflow Column Tasks */}
          <Box sx={{ p: 2, flex: 1 }}>
            {!activeOverflowColumn.tasks?.length ? (
              <Typography fontcolor={white.main}>No tasks yet</Typography>
            ) : (
              <Stack spacing={1}>
                {activeOverflowColumn.tasks.map((task, taskIndex) => {
                  const overflowColIndex = columns.length
                  const isSelected =
                    selectedTask?.colIndex === overflowColIndex &&
                    selectedTask?.taskIndex === taskIndex

                  return (
                    <Card
                      key={task._id}
                      variant="task"
                      sx={{
                        mx: '5px',
                        width: { xs: '250px', sm: '250px' },
                      }}
                      taskProps={{
                        title: task.title,
                        description: task.description,
                        checked: isSelected,
                        disabled: false,
                        onCheck: () =>
                          onSelectTask(overflowColIndex, taskIndex),
                        draggable: isTaskDraggable(overflowColIndex, taskIndex),
                        onDragStart: e =>
                          handleLocalTaskDragStart(
                            e,
                            overflowColIndex,
                            taskIndex
                          ),
                        onDragOver: handleTaskDragOver,
                        onDrop: e =>
                          handleLocalTaskDrop(e, overflowColIndex, taskIndex),
                      }}
                    />
                  )
                })}
              </Stack>
            )}
          </Box>
        </Box>
      )}
    </Stack>
  )
}

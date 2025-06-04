'use client'

import React, { useState, useCallback } from 'react'
import { Box, Stack, Checkbox } from '@mui/material'
import { useAtom } from 'jotai'
import { columnsAtom } from '../../jotai/atom'

import Typography from '../../../Typography'
import Card from '../../../Card'
import Dropdown from '../../../Field/Dropdown/Regular'
import { black, white } from '../../../../styles/palette'

import type { BoardProps } from '../index'
import type { ColumnData } from '../../types'
import { useTaskDragAndDrop } from '../../../ProjectBoard/utils/useDragandDrop/tasks'

/** Mobile: if overflow exists, show ONLY the overflow column. Otherwise,
 *  show a single selected "main" column from the 'columns' array. */
export default function MobileBoard({
  columns,
  overflowColumns,
  selectedOverflowColumnId,
  onChangeSelectedOverflowColumn,
  selectedTask,
  onSelectTask,
  onColumnDrop,
}: BoardProps) {
  const [allColumns, setAllColumns] = useAtom(columnsAtom)

  // Task DnD
  const { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
    useTaskDragAndDrop()

  // Local state for "main" column selection
  const [mobileColumnIndex, setMobileColumnIndex] = useState<number>(0)

  // Column-level checkbox approach
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(
    null
  )

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
      onSelectTask(-1, -1)
      setSelectedColumnIndex(colIndex)
    }
  }
  function isColumnDraggable(colIndex: number) {
    return selectedColumnIndex === colIndex
  }

  // Local column drag start (rarely used on mobile)
  function handleLocalColumnDragStart(e: React.DragEvent, colIndex: number) {
    if (!isColumnDraggable(colIndex)) {
      e.preventDefault()
      return
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Task-level DnD
  // ─────────────────────────────────────────────────────────────────────────────
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
  // Overflow logic: On mobile, if there's overflow, we show ONLY that overflow column
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

  // If there's overflow => only show the overflow column
  if (hasOverflow && activeOverflowColumn) {
    const overflowColIndex = columns.length // or some distinct index

    return (
      <Box
        key="overflow-mobile-column"
        draggable={false}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          onColumnDrop(e, overflowColIndex)
        }}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '300px', sm: '300px' },
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
            options={overflowColumns?.map(col => ({ value: col.title })) ?? []}
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
                const isSelected =
                  selectedTask?.colIndex === overflowColIndex &&
                  selectedTask?.taskIndex === taskIndex

                return (
                  <Card
                    key={task._id}
                    variant="task"
                    title={task.title}
                    description={task.description}
                    checked={isSelected}
                    disabled={false}
                    onCheck={() => onSelectTask(overflowColIndex, taskIndex)}
                    draggable={isTaskDraggable(overflowColIndex, taskIndex)}
                    onDragStart={e =>
                      handleLocalTaskDragStart(e, overflowColIndex, taskIndex)
                    }
                    onDragOver={handleTaskDragOver}
                    onDrop={e =>
                      handleLocalTaskDrop(e, overflowColIndex, taskIndex)
                    }
                  />
                )
              })}
            </Stack>
          )}
        </Box>
      </Box>
    )
  }

  // Otherwise, no overflow => show the usual single-column approach
  if (!columns.length) {
    return <Typography fontcolor={black.main}>No columns available.</Typography>
  }

  const currentColumn = columns[mobileColumnIndex]

  function handleColumnDropdownChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    const foundIndex = columns.findIndex(c => c.title === title)
    if (foundIndex >= 0) {
      onSelectTask(-1, -1)
      setSelectedColumnIndex(null)
      setMobileColumnIndex(foundIndex)
    }
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        key={currentColumn._id}
        draggable={isColumnDraggable(mobileColumnIndex)}
        onDragStart={e => handleLocalColumnDragStart(e, mobileColumnIndex)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          onColumnDrop(e, mobileColumnIndex)
        }}
        sx={{
          boxSizing: 'border-box',
          width: { xs: '300px', sm: '300px' },
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
        {/* Column Head + Mobile Column Dropdown */}
        <Box
          sx={{
            borderBottom: `1px solid ${white.main}`,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative',
          }}
        >
          {/* Column checkbox */}
          <Checkbox
            checked={selectedColumnIndex === mobileColumnIndex}
            disabled={isColumnCheckboxDisabled()}
            onChange={() => handleColumnCheck(mobileColumnIndex)}
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

          <Dropdown
            label="Select Column"
            options={columns.map(col => ({ value: col.title }))}
            value={currentColumn.title}
            onChange={handleColumnDropdownChange}
            fontcolor="#000"
            shrunkfontcolor={white.main}
            backgroundcolor={white.main}
            shrunklabelposition="aboveNotch"
          />

          <Typography fontvariant="merrih6" fontcolor={white.main}>
            {currentColumn.description}
          </Typography>
        </Box>

        {/* Column Body (tasks) */}
        <Box sx={{ p: 2, flex: 1 }}>
          {!currentColumn.tasks?.length ? (
            <Typography fontcolor={white.main}>No tasks yet</Typography>
          ) : (
            <Stack spacing={1}>
              {currentColumn.tasks.map((task, taskIndex) => {
                const isSelected =
                  selectedTask?.colIndex === mobileColumnIndex &&
                  selectedTask?.taskIndex === taskIndex

                return (
                  <Card
                    key={task._id}
                    variant="task"
                    title={task.title}
                    description={task.description}
                    checked={isSelected}
                    disabled={isTaskCheckboxDisabled()}
                    onCheck={() => {
                      if (selectedColumnIndex !== null) return
                      onSelectTask(mobileColumnIndex, taskIndex)
                    }}
                    draggable={isTaskDraggable(mobileColumnIndex, taskIndex)}
                    onDragStart={e =>
                      handleLocalTaskDragStart(e, mobileColumnIndex, taskIndex)
                    }
                    onDragOver={handleTaskDragOver}
                    onDrop={e =>
                      handleLocalTaskDrop(e, mobileColumnIndex, taskIndex)
                    }
                  />
                )
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  )
}

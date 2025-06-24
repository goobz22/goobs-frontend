'use client'

import React, { useState, useCallback } from 'react'
import { Box, Stack, Checkbox, alpha, keyframes } from '@mui/material'
import { useAtom } from 'jotai'
import { columnsAtom } from '../../jotai/atom'

import Typography from '../../../Typography'
import Card from '../../../Card'
import Dropdown from '../../../Field/Dropdown/Regular'
import { black, white } from '../../../../styles/palette'

import type { BoardProps } from '../index'
import type { ColumnData } from '../../types'
import { useTaskDragAndDrop } from '../../../ProjectBoard/utils/useDragandDrop/tasks'

// Sacred animations
const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.4); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`

const egyptianStyles = {
  goldColor: '#FFD700',
  cardBackground: alpha('#000000', 0.9),
}

const SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']

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
  sacredtheme = false,
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
          backgroundColor: sacredtheme
            ? egyptianStyles.cardBackground
            : black.main,
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
          ...(sacredtheme && {
            border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
            animation: `${glowPulse} 3s ease-in-out infinite`,
            backdropFilter: 'blur(10px)',
          }),
        }}
      >
        {/* Sacred corner glyph */}
        {sacredtheme && (
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '14px',
              animation: `${floatGlyph} 4s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[0]}
          </Box>
        )}

        {/* Overflow Column Header */}
        <Box
          sx={{
            borderBottom: sacredtheme
              ? `2px solid ${alpha(egyptianStyles.goldColor, 0.3)}`
              : `1px solid ${white.main}`,
            p: 2,
            position: 'relative',
            ...(sacredtheme && {
              backgroundColor: alpha(egyptianStyles.goldColor, 0.1),
            }),
          }}
        >
          <Dropdown
            label="More Columns"
            options={overflowColumns?.map(col => ({ value: col.title })) ?? []}
            value={activeOverflowColumn?.title}
            onChange={handleOverflowDropdownChange}
            fontcolor={sacredtheme ? egyptianStyles.goldColor : '#000'}
            shrunkfontcolor={
              sacredtheme ? egyptianStyles.goldColor : white.main
            }
            backgroundcolor={
              sacredtheme ? alpha(egyptianStyles.goldColor, 0.1) : white.main
            }
            shrunklabelposition="aboveNotch"
            outlinecolor={sacredtheme ? egyptianStyles.goldColor : white.main}
            sacredtheme={sacredtheme}
          />

          {/* 
            REMOVE the overflow column's title here, keep only the description
          */}
          <Stack direction="column" spacing={0.5} mt={1}>
            {/* We omit activeOverflowColumn.title */}
            <Typography
              fontvariant="merrih6"
              fontcolor={
                sacredtheme ? alpha(egyptianStyles.goldColor, 0.8) : white.main
              }
              sx={
                sacredtheme
                  ? {
                      fontFamily: '"Crimson Text", serif',
                    }
                  : {}
              }
            >
              {activeOverflowColumn.description}
            </Typography>
          </Stack>
        </Box>

        {/* Overflow Column Tasks */}
        <Box sx={{ p: 2, flex: 1 }}>
          {!activeOverflowColumn.tasks?.length ? (
            <Typography
              fontcolor={
                sacredtheme ? alpha(egyptianStyles.goldColor, 0.6) : white.main
              }
              sx={
                sacredtheme
                  ? {
                      fontFamily: '"Crimson Text", serif',
                      fontStyle: 'italic',
                    }
                  : {}
              }
            >
              No tasks yet
            </Typography>
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
                    sacredtheme={sacredtheme}
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
    return (
      <Typography
        fontcolor={sacredtheme ? egyptianStyles.goldColor : black.main}
        sx={
          sacredtheme
            ? {
                fontFamily: '"Crimson Text", serif',
              }
            : {}
        }
      >
        No columns available.
      </Typography>
    )
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
          backgroundColor: sacredtheme
            ? egyptianStyles.cardBackground
            : black.main,
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
          ...(sacredtheme && {
            border: `2px solid ${alpha(egyptianStyles.goldColor, 0.5)}`,
            animation: `${glowPulse} 3s ease-in-out infinite`,
            backdropFilter: 'blur(10px)',
          }),
        }}
      >
        {/* Sacred corner glyph */}
        {sacredtheme && (
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              color: alpha(egyptianStyles.goldColor, 0.3),
              fontSize: '14px',
              animation: `${floatGlyph} 4s ease-in-out infinite`,
              zIndex: 1,
            }}
          >
            {SACRED_GLYPHS[mobileColumnIndex % SACRED_GLYPHS.length]}
          </Box>
        )}

        {/* Column Head + Mobile Column Dropdown */}
        <Box
          sx={{
            borderBottom: sacredtheme
              ? `2px solid ${alpha(egyptianStyles.goldColor, 0.3)}`
              : `1px solid ${white.main}`,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative',
            ...(sacredtheme && {
              backgroundColor: alpha(egyptianStyles.goldColor, 0.1),
            }),
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
              color: sacredtheme ? egyptianStyles.goldColor : white.main,
              '&.Mui-checked': {
                color: sacredtheme ? egyptianStyles.goldColor : white.main,
              },
              ...(sacredtheme && {
                '&.Mui-disabled': {
                  color: alpha(egyptianStyles.goldColor, 0.3),
                },
              }),
            }}
          />

          <Dropdown
            label="Select Column"
            options={columns.map(col => ({ value: col.title }))}
            value={currentColumn.title}
            onChange={handleColumnDropdownChange}
            fontcolor={sacredtheme ? egyptianStyles.goldColor : '#000'}
            shrunkfontcolor={
              sacredtheme ? egyptianStyles.goldColor : white.main
            }
            backgroundcolor={
              sacredtheme ? alpha(egyptianStyles.goldColor, 0.1) : white.main
            }
            shrunklabelposition="aboveNotch"
            outlinecolor={sacredtheme ? egyptianStyles.goldColor : white.main}
            sacredtheme={sacredtheme}
          />

          <Typography
            fontvariant="merrih6"
            fontcolor={
              sacredtheme ? alpha(egyptianStyles.goldColor, 0.8) : white.main
            }
            sx={
              sacredtheme
                ? {
                    fontFamily: '"Crimson Text", serif',
                  }
                : {}
            }
          >
            {currentColumn.description}
          </Typography>
        </Box>

        {/* Column Body (tasks) */}
        <Box sx={{ p: 2, flex: 1 }}>
          {!currentColumn.tasks?.length ? (
            <Typography
              fontcolor={
                sacredtheme ? alpha(egyptianStyles.goldColor, 0.6) : white.main
              }
              sx={
                sacredtheme
                  ? {
                      fontFamily: '"Crimson Text", serif',
                      fontStyle: 'italic',
                    }
                  : {}
              }
            >
              No tasks yet
            </Typography>
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
                    sacredtheme={sacredtheme}
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

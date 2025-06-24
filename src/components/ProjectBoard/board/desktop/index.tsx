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
  sacredtheme = false,
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
            {/* Sacred corner glyphs */}
            {sacredtheme && (
              <>
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
                  {SACRED_GLYPHS[colIndex % SACRED_GLYPHS.length]}
                </Box>
              </>
            )}

            {/* Column Header */}
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
              <Checkbox
                checked={colChecked}
                disabled={isColumnCheckboxDisabled()}
                onChange={() => handleColumnCheck(colIndex)}
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

              <Stack direction="column" spacing={0.5}>
                <Typography
                  fontvariant="merrih4"
                  fontcolor={
                    sacredtheme ? egyptianStyles.goldColor : white.main
                  }
                  sx={
                    sacredtheme
                      ? {
                          fontFamily: '"Cinzel", serif',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                        }
                      : {}
                  }
                >
                  {col.title}
                </Typography>
                <Typography
                  fontvariant="merrih6"
                  fontcolor={
                    sacredtheme
                      ? alpha(egyptianStyles.goldColor, 0.8)
                      : white.main
                  }
                  sx={
                    sacredtheme
                      ? {
                          fontFamily: '"Crimson Text", serif',
                        }
                      : {}
                  }
                >
                  {col.description}
                </Typography>
              </Stack>
            </Box>

            {/* Column Body: tasks */}
            <Box sx={{ p: 2, flex: 1 }}>
              {!col.tasks?.length ? (
                <Typography
                  fontcolor={
                    sacredtheme
                      ? alpha(egyptianStyles.goldColor, 0.6)
                      : white.main
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
                  {col.tasks.map((task, taskIndex) => {
                    const isSelected =
                      selectedTask?.colIndex === colIndex &&
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
                          onSelectTask(colIndex, taskIndex)
                        }}
                        draggable={isTaskDraggable(colIndex, taskIndex)}
                        onDragStart={e =>
                          handleLocalTaskDragStart(e, colIndex, taskIndex)
                        }
                        onDragOver={handleTaskDragOver}
                        onDrop={e =>
                          handleLocalTaskDrop(e, colIndex, taskIndex)
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
              animationDelay: '0.5s',
              backdropFilter: 'blur(10px)',
            }),
          }}
        >
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
              options={
                overflowColumns?.map(col => ({ value: col.title })) ?? []
              }
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
                  sacredtheme
                    ? alpha(egyptianStyles.goldColor, 0.8)
                    : white.main
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
                  sacredtheme
                    ? alpha(egyptianStyles.goldColor, 0.6)
                    : white.main
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
                  const overflowColIndex = columns.length
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
      )}
    </Stack>
  )
}

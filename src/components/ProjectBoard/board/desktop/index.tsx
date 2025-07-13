'use client'

import React, { useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { columnsAtom } from '../../jotai/atom'

import Typography from '../../../Typography'
import Card from '../../../Card'
import Dropdown from '../../../Field/Dropdown/Regular'
import Checkbox from '../../../Checkbox'
import type { BoardProps } from '../index'
import type { ColumnData } from '../../types'
import { useTaskDragAndDrop } from '../../../ProjectBoard/utils/useDragandDrop/tasks'

const SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']

const getStyles = (sacredtheme?: boolean) => ({
  boardContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.75rem',
  } as React.CSSProperties,
  column: {
    boxSizing: 'border-box',
    width: '300px',
    height: '70vh',
    borderRadius: '0.375rem',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          animation: 'board-glow-pulse 2s infinite alternate',
          backdropFilter: 'blur(16px)',
        }
      : { backgroundColor: 'black' }),
  } as React.CSSProperties,
  columnHeader: {
    padding: '0.5rem',
    position: 'relative',
    ...(sacredtheme
      ? {
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
        }
      : { borderBottom: '1px solid white' }),
  } as React.CSSProperties,
  columnTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  } as React.CSSProperties,
  columnTitle: {
    ...(sacredtheme && {
      fontFamily: 'Cinzel, serif',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
    }),
  } as React.CSSProperties,
  columnDescription: {
    ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
  } as React.CSSProperties,
  tasksContainer: {
    padding: '0.5rem',
    flex: 1,
  } as React.CSSProperties,
  noTasks: {
    ...(sacredtheme && {
      fontStyle: 'italic',
      fontFamily: 'Crimson Text, serif',
    }),
  } as React.CSSProperties,
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  } as React.CSSProperties,
  checkbox: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '0.5rem',
    left: '0.5rem',
    fontSize: '0.875rem',
    color: 'rgba(255, 215, 0, 0.3)',
    animation: 'board-float-glyph 3s infinite alternate',
    zIndex: 10,
  } as React.CSSProperties,
})

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
  const [allColumns, setAllColumns] = useAtom(columnsAtom)
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(
    null
  )
  const { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
    useTaskDragAndDrop()
  const styles = getStyles(sacredtheme)

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
  function isColumnDraggable(colIndex: number): boolean {
    return selectedColumnIndex === colIndex
  }
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
      handleTaskDragStart({ columnIndex, taskIndex })
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

  const hasOverflow = Boolean(overflowColumns?.length)
  let activeOverflowColumn: ColumnData | undefined
  if (hasOverflow && selectedOverflowColumnId && overflowColumns) {
    activeOverflowColumn =
      overflowColumns.find(c => c._id === selectedOverflowColumnId) ||
      overflowColumns[0]
  }

  const handleOverflowDropdownChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!overflowColumns || !onChangeSelectedOverflowColumn) return
      const colTitle = e.target.value
      const found = overflowColumns.find(c => c.title === colTitle)
      if (found) {
        onChangeSelectedOverflowColumn(found._id)
      }
    },
    [overflowColumns, onChangeSelectedOverflowColumn]
  )

  return (
    <div style={styles.boardContainer}>
      {columns.map((col, colIndex) => {
        const colChecked = selectedColumnIndex === colIndex
        return (
          <div
            key={col._id}
            draggable={isColumnDraggable(colIndex)}
            onDragStart={(e: React.DragEvent) =>
              handleLocalColumnDragStart(e, colIndex)
            }
            onDragOver={(e: React.DragEvent) =>
              handleLocalColumnDragOver(e, colIndex)
            }
            onDrop={(e: React.DragEvent) => handleLocalColumnDrop(e, colIndex)}
            style={styles.column}
          >
            {sacredtheme && (
              <div style={styles.glyph}>
                {SACRED_GLYPHS[colIndex % SACRED_GLYPHS.length]}
              </div>
            )}
            <div style={styles.columnHeader}>
              <Checkbox
                checked={colChecked}
                disabled={isColumnCheckboxDisabled()}
                onChange={() => handleColumnCheck(colIndex)}
                styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
                style={styles.checkbox}
              />
              <div style={styles.columnTitleContainer}>
                <Typography
                  variant="merrih4"
                  styles={{
                    color: sacredtheme ? '#FFD700' : 'white',
                  }}
                >
                  {col.title}
                </Typography>
                <Typography
                  variant="merrih6"
                  styles={{
                    color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'white',
                  }}
                >
                  {col.description}
                </Typography>
              </div>
            </div>
            <div style={styles.tasksContainer}>
              {!col.tasks?.length ? (
                <Typography
                  styles={{
                    color: sacredtheme ? 'rgba(255, 215, 0, 0.6)' : 'white',
                  }}
                >
                  No tasks yet
                </Typography>
              ) : (
                <div style={styles.tasksList}>
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
                        onDragStart={(e: React.DragEvent) =>
                          handleLocalTaskDragStart(e, colIndex, taskIndex)
                        }
                        onDragOver={handleTaskDragOver}
                        onDrop={(e: React.DragEvent) =>
                          handleLocalTaskDrop(e, colIndex, taskIndex)
                        }
                        sacredtheme={sacredtheme}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {hasOverflow && activeOverflowColumn && (
        <div
          key="overflow-desktop-column"
          draggable={false}
          onDragOver={(e: React.DragEvent) => e.preventDefault()}
          onDrop={(e: React.DragEvent) => {
            e.preventDefault()
            onColumnDrop(e, columns.length)
          }}
          style={{
            ...styles.column,
            animationDelay: sacredtheme ? '0.5s' : undefined,
          }}
        >
          <div style={styles.columnHeader}>
            <Dropdown
              label="More Columns"
              options={
                overflowColumns?.map(col => ({ value: col.title })) ?? []
              }
              value={activeOverflowColumn?.title}
              onChange={handleOverflowDropdownChange}
              styles={{
                theme: sacredtheme ? 'sacred' : 'light',
                backgroundColor: sacredtheme
                  ? 'rgba(255, 215, 0, 0.1)'
                  : 'white',
                borderColor: sacredtheme ? '#FFD700' : 'white',
                textColor: sacredtheme ? '#FFD700' : '#000',
                labelColor: sacredtheme ? '#FFD700' : 'white',
              }}
            />
            <div style={styles.columnTitleContainer}>
              <Typography
                variant="merrih6"
                styles={{
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'white',
                }}
              >
                {activeOverflowColumn.description}
              </Typography>
            </div>
          </div>
          <div style={styles.tasksContainer}>
            {!activeOverflowColumn.tasks?.length ? (
              <Typography
                styles={{
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.6)' : 'white',
                }}
              >
                No tasks yet
              </Typography>
            ) : (
              <div style={styles.tasksList}>
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
                      disabled={isTaskCheckboxDisabled()}
                      onCheck={() => {
                        if (selectedColumnIndex !== null) return
                        onSelectTask(overflowColIndex, taskIndex)
                      }}
                      draggable={isTaskDraggable(overflowColIndex, taskIndex)}
                      onDragStart={(e: React.DragEvent) =>
                        handleLocalTaskDragStart(e, overflowColIndex, taskIndex)
                      }
                      onDragOver={handleTaskDragOver}
                      onDrop={(e: React.DragEvent) =>
                        handleLocalTaskDrop(e, overflowColIndex, taskIndex)
                      }
                      sacredtheme={sacredtheme}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

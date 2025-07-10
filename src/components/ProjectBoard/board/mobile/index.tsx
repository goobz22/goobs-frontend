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
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
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
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    position: 'relative',
    ...(sacredtheme
      ? {
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
        }
      : { borderBottom: '1px solid white' }),
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
  const { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
    useTaskDragAndDrop()
  const [mobileColumnIndex, setMobileColumnIndex] = useState<number>(0)
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(
    null
  )
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
  function isColumnDraggable(colIndex: number) {
    return selectedColumnIndex === colIndex
  }
  function handleLocalColumnDragStart(e: React.DragEvent, colIndex: number) {
    if (!isColumnDraggable(colIndex)) {
      e.preventDefault()
      return
    }
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

  if (hasOverflow && activeOverflowColumn) {
    const overflowColIndex = columns.length
    return (
      <div
        key="overflow-mobile-column"
        draggable={false}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          onColumnDrop(e, overflowColIndex)
        }}
        style={styles.column}
      >
        {sacredtheme && <div style={styles.glyph}>{SACRED_GLYPHS[0]}</div>}
        <div style={styles.columnHeader}>
          <Dropdown
            label="More Columns"
            options={overflowColumns?.map(col => ({ value: col.title })) ?? []}
            value={activeOverflowColumn?.title}
            onChange={handleOverflowDropdownChange}
            fontcolor={sacredtheme ? '#FFD700' : '#000'}
            shrunkfontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? 'rgba(255, 215, 0, 0.1)' : 'white'}
            shrunklabelposition="aboveNotch"
            outlinecolor={sacredtheme ? '#FFD700' : 'white'}
            sacredtheme={sacredtheme}
          />
          <div style={{ ...styles.columnDescription, marginTop: '0.25rem' }}>
            <Typography
              fontvariant="merrih6"
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'white'}
            >
              {activeOverflowColumn.description}
            </Typography>
          </div>
        </div>
        <div style={styles.tasksContainer}>
          {!activeOverflowColumn.tasks?.length ? (
            <Typography
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.6)' : 'white'}
              style={styles.noTasks}
            >
              No tasks yet
            </Typography>
          ) : (
            <div style={styles.tasksList}>
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
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!columns.length) {
    return (
      <Typography
        fontcolor={sacredtheme ? '#FFD700' : 'black'}
        style={styles.noTasks}
      >
        No columns available.
      </Typography>
    )
  }

  const currentColumn = columns[mobileColumnIndex]

  function handleColumnDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const title = e.target.value
    const foundIndex = columns.findIndex(c => c.title === title)
    if (foundIndex >= 0) {
      onSelectTask(-1, -1)
      setSelectedColumnIndex(null)
      setMobileColumnIndex(foundIndex)
    }
  }

  return (
    <div style={styles.boardContainer}>
      <div
        key={currentColumn._id}
        draggable={isColumnDraggable(mobileColumnIndex)}
        onDragStart={e => handleLocalColumnDragStart(e, mobileColumnIndex)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          onColumnDrop(e, mobileColumnIndex)
        }}
        style={styles.column}
      >
        {sacredtheme && (
          <div style={styles.glyph}>
            {SACRED_GLYPHS[mobileColumnIndex % SACRED_GLYPHS.length]}
          </div>
        )}
        <div style={styles.columnHeader}>
          <Checkbox
            checked={selectedColumnIndex === mobileColumnIndex}
            disabled={isColumnCheckboxDisabled()}
            onChange={() => handleColumnCheck(mobileColumnIndex)}
            sacredtheme={sacredtheme}
            style={styles.checkbox}
          />
          <Dropdown
            label="Select Column"
            options={columns.map(col => ({ value: col.title }))}
            value={currentColumn.title}
            onChange={handleColumnDropdownChange}
            fontcolor={sacredtheme ? '#FFD700' : '#000'}
            shrunkfontcolor={sacredtheme ? '#FFD700' : 'white'}
            backgroundcolor={sacredtheme ? 'rgba(255, 215, 0, 0.1)' : 'white'}
            shrunklabelposition="aboveNotch"
            outlinecolor={sacredtheme ? '#FFD700' : 'white'}
            sacredtheme={sacredtheme}
          />
          <Typography
            fontvariant="merrih6"
            fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'white'}
            style={styles.columnDescription}
          >
            {currentColumn.description}
          </Typography>
        </div>
        <div style={styles.tasksContainer}>
          {!currentColumn.tasks?.length ? (
            <Typography
              fontcolor={sacredtheme ? 'rgba(255, 215, 0, 0.6)' : 'white'}
              style={styles.noTasks}
            >
              No tasks yet
            </Typography>
          ) : (
            <div style={styles.tasksList}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

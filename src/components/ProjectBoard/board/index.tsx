'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useAtom } from 'jotai'
import { columnsAtom } from '../jotai/atom'
import type { ProjectBoardStyles } from '../../../theme'
import { useColumnDragAndDrop } from '../utils/useDragandDrop/columns'
import { useTaskDragAndDrop } from '../utils/useDragandDrop/tasks'
import type { ColumnData } from '../types'

const SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']

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
  styles?: ProjectBoardStyles
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
  styles,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [isHovered, setIsHovered] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  const handleSave = () => {
    onEdit(editTitle, editDescription)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setIsEditing(false)
  }

  const taskCardStyles = useMemo(
    () => ({
      container: {
        position: 'relative',
        backgroundColor: isSacredTheme
          ? 'rgba(0, 0, 0, 0.9)'
          : isDarkTheme
            ? '#374151'
            : '#ffffff',
        border: isSacredTheme
          ? '1px solid rgba(255, 215, 0, 0.3)'
          : isDarkTheme
            ? '1px solid #4b5563'
            : '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '0.5rem',
        cursor: draggable ? 'grab' : 'default',
        transition: 'all 0.2s ease',
        boxShadow: isSacredTheme
          ? isHovered
            ? '0 8px 25px rgba(255, 215, 0, 0.2)'
            : '0 2px 8px rgba(255, 215, 0, 0.1)'
          : isDarkTheme
            ? isHovered
              ? '0 8px 25px rgba(0, 0, 0, 0.4)'
              : '0 2px 8px rgba(0, 0, 0, 0.2)'
            : isHovered
              ? '0 8px 25px rgba(0, 0, 0, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        ...(isSacredTheme && {
          backgroundImage:
            'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(0, 0, 0, 0.95) 100%)',
        }),
      } as React.CSSProperties,

      checkbox: {
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        width: '1.25rem',
        height: '1.25rem',
        cursor: 'pointer',
        accentColor: isSacredTheme
          ? '#FFD700'
          : isDarkTheme
            ? '#60a5fa'
            : '#3b82f6',
      } as React.CSSProperties,

      title: {
        margin: '0 1.5rem 0.5rem 0',
        fontSize: '1rem',
        fontWeight: '600',
        color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#f9fafb' : '#1f2937',
        ...(isSacredTheme && {
          fontFamily: 'Cinzel, serif',
          letterSpacing: '0.02em',
          textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
        }),
      } as React.CSSProperties,

      description: {
        margin: '0 0 0.75rem 0',
        fontSize: '0.875rem',
        color: isSacredTheme
          ? 'rgba(255, 215, 0, 0.8)'
          : isDarkTheme
            ? '#d1d5db'
            : '#6b7280',
        lineHeight: '1.4',
        ...(isSacredTheme && {
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
        }),
      } as React.CSSProperties,

      actions: {
        display: 'flex',
        gap: '0.5rem',
        marginTop: '0.75rem',
      } as React.CSSProperties,

      button: {
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        borderRadius: '0.25rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      } as React.CSSProperties,

      editButton: {
        backgroundColor: isSacredTheme
          ? 'rgba(255, 215, 0, 0.2)'
          : isDarkTheme
            ? '#4b5563'
            : '#f3f4f6',
        color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#f9fafb' : '#374151',
      } as React.CSSProperties,

      deleteButton: {
        backgroundColor: isSacredTheme
          ? 'rgba(220, 38, 38, 0.2)'
          : isDarkTheme
            ? '#7f1d1d'
            : '#fef2f2',
        color: isSacredTheme ? '#ff6b6b' : isDarkTheme ? '#fca5a5' : '#dc2626',
      } as React.CSSProperties,

      saveButton: {
        backgroundColor: isSacredTheme
          ? 'rgba(34, 197, 94, 0.2)'
          : isDarkTheme
            ? '#065f46'
            : '#f0fdf4',
        color: isSacredTheme ? '#4ade80' : isDarkTheme ? '#6ee7b7' : '#16a34a',
      } as React.CSSProperties,

      cancelButton: {
        backgroundColor: isSacredTheme
          ? 'rgba(107, 114, 128, 0.2)'
          : isDarkTheme
            ? '#374151'
            : '#f9fafb',
        color: isSacredTheme ? '#9ca3af' : isDarkTheme ? '#d1d5db' : '#6b7280',
      } as React.CSSProperties,

      input: {
        width: '100%',
        padding: '0.5rem',
        margin: '0.25rem 0',
        borderRadius: '0.25rem',
        border: isSacredTheme
          ? '1px solid rgba(255, 215, 0, 0.3)'
          : isDarkTheme
            ? '1px solid #4b5563'
            : '1px solid #d1d5db',
        backgroundColor: isSacredTheme
          ? 'rgba(0, 0, 0, 0.5)'
          : isDarkTheme
            ? '#1f2937'
            : '#ffffff',
        color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#f9fafb' : '#1f2937',
        fontSize: '0.875rem',
        ...(isSacredTheme && {
          fontFamily: 'Crimson Text, serif',
        }),
      } as React.CSSProperties,

      textarea: {
        width: '100%',
        padding: '0.5rem',
        margin: '0.25rem 0',
        borderRadius: '0.25rem',
        border: isSacredTheme
          ? '1px solid rgba(255, 215, 0, 0.3)'
          : isDarkTheme
            ? '1px solid #4b5563'
            : '1px solid #d1d5db',
        backgroundColor: isSacredTheme
          ? 'rgba(0, 0, 0, 0.5)'
          : isDarkTheme
            ? '#1f2937'
            : '#ffffff',
        color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#f9fafb' : '#1f2937',
        fontSize: '0.875rem',
        resize: 'vertical',
        minHeight: '60px',
        ...(isSacredTheme && {
          fontFamily: 'Crimson Text, serif',
        }),
      } as React.CSSProperties,

      glyph: {
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        fontSize: '0.75rem',
        color: 'rgba(255, 215, 0, 0.3)',
        zIndex: 1,
        pointerEvents: 'none',
      } as React.CSSProperties,
    }),
    [isSacredTheme, isDarkTheme, isHovered, draggable]
  )

  const TaskCardGlyph: React.FC = () => {
    const [glyph, setGlyph] = React.useState<string | null>(null)
    React.useEffect(() => {
      const index = Math.floor(Math.random() * SACRED_GLYPHS.length)
      setGlyph(SACRED_GLYPHS[index] ?? null)
    }, [])
    if (!glyph) return null
    return <div style={taskCardStyles.glyph}>{glyph}</div>
  }

  return (
    <div
      style={taskCardStyles.container}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSacredTheme && <TaskCardGlyph />}

      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        style={taskCardStyles.checkbox}
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            style={taskCardStyles.input}
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            style={taskCardStyles.textarea}
            placeholder="Task description"
          />
          <div style={taskCardStyles.actions}>
            <button
              style={{ ...taskCardStyles.button, ...taskCardStyles.saveButton }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              style={{
                ...taskCardStyles.button,
                ...taskCardStyles.cancelButton,
              }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 style={taskCardStyles.title}>{title}</h4>
          <p style={taskCardStyles.description}>{description}</p>
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

const useResponsiveLayout = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile: windowWidth < 768,
    isTablet: windowWidth >= 768 && windowWidth < 1280,
    _isDesktop: windowWidth >= 1280,
    windowWidth,
  }
}

const getStyles = (
  theme?: string,
  isMobile: boolean = false,
  isTablet: boolean = false
) => {
  const isSacredTheme = theme === 'sacred'
  const isDarkTheme = theme === 'dark'

  return {
    boardContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '0.75rem',
      padding: '1rem',
      height: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollBehavior: 'smooth',
    } as React.CSSProperties,

    column: {
      boxSizing: 'border-box',
      width: isMobile ? '280px' : isTablet ? '300px' : '320px',
      height: isMobile ? 'auto' : '70vh',
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      transition: 'all 0.2s ease',
      flexShrink: 0, // Prevent columns from shrinking
      ...(isSacredTheme
        ? {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.1)',
          }
        : isDarkTheme
          ? {
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }
          : {
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }),
    } as React.CSSProperties,

    columnDragOver: {
      transform: 'scale(1.02)',
      ...(isSacredTheme
        ? {
            border: '2px solid rgba(255, 215, 0, 0.8)',
            boxShadow: '0 6px 25px rgba(255, 215, 0, 0.2)',
          }
        : isDarkTheme
          ? {
              border: '2px solid #60a5fa',
              boxShadow: '0 6px 20px rgba(96, 165, 250, 0.2)',
            }
          : {
              border: '2px solid #3b82f6',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
            }),
    } as React.CSSProperties,

    columnHeader: {
      padding: '1rem',
      borderBottom: `1px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : isDarkTheme ? '#374151' : '#e5e7eb'}`,
      backgroundColor: isSacredTheme
        ? 'rgba(255, 215, 0, 0.05)'
        : 'transparent',
      cursor: 'grab',
      userSelect: 'none',
    } as React.CSSProperties,

    columnTitle: {
      margin: 0,
      color: isSacredTheme ? '#FFD700' : isDarkTheme ? '#f9fafb' : '#1f2937',
      fontSize: isMobile ? '1rem' : '1.125rem',
      fontWeight: '600',
      ...(isSacredTheme && {
        fontFamily: 'Cinzel, serif',
        letterSpacing: '0.05em',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      }),
    } as React.CSSProperties,

    columnDescription: {
      margin: '0.25rem 0 0 0',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.7)'
        : isDarkTheme
          ? '#9ca3af'
          : '#6b7280',
      fontSize: '0.875rem',
      ...(isSacredTheme && {
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      }),
    } as React.CSSProperties,

    tasksContainer: {
      padding: '0.75rem',
      flex: 1,
      minHeight: isMobile ? '200px' : 'auto',
    } as React.CSSProperties,

    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    } as React.CSSProperties,

    taskDragPlaceholder: {
      height: '80px',
      borderRadius: '0.375rem',
      border: `2px dashed ${isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : isDarkTheme ? '#60a5fa' : '#3b82f6'}`,
      backgroundColor: isSacredTheme
        ? 'rgba(255, 215, 0, 0.1)'
        : isDarkTheme
          ? 'rgba(96, 165, 250, 0.1)'
          : 'rgba(59, 130, 246, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.7)'
        : isDarkTheme
          ? '#9ca3af'
          : '#6b7280',
      fontSize: '0.875rem',
      fontStyle: 'italic',
    } as React.CSSProperties,

    noTasks: {
      textAlign: 'center',
      color: isSacredTheme
        ? 'rgba(255, 215, 0, 0.5)'
        : isDarkTheme
          ? '#6b7280'
          : '#9ca3af',
      fontSize: '0.875rem',
      fontStyle: 'italic',
      padding: '2rem 1rem',
    } as React.CSSProperties,

    glyph: {
      position: 'absolute',
      top: '0.75rem',
      left: '0.75rem',
      fontSize: '1rem',
      color: 'rgba(255, 215, 0, 0.4)',
      zIndex: 10,
      pointerEvents: 'none',
    } as React.CSSProperties,

    // Generate CSS string for scrollbar styling
    scrollbarCSS: `
      .board-container::-webkit-scrollbar {
        height: 12px;
        width: 12px;
      }
      .board-container::-webkit-scrollbar-track {
        background: ${isSacredTheme ? 'rgba(0, 0, 0, 0.3)' : isDarkTheme ? '#374151' : '#f3f4f6'};
        border-radius: 6px;
      }
      .board-container::-webkit-scrollbar-thumb {
        background: ${
          isSacredTheme
            ? 'linear-gradient(45deg, rgba(255, 215, 0, 0.4), rgba(255, 215, 0, 0.7))'
            : isDarkTheme
              ? 'linear-gradient(45deg, #60a5fa, #3b82f6)'
              : 'linear-gradient(45deg, #d1d5db, #9ca3af)'
        };
        border-radius: 6px;
        border: ${isSacredTheme ? '1px solid rgba(255, 215, 0, 0.3)' : isDarkTheme ? '1px solid #1f2937' : '1px solid #e5e7eb'};
      }
      .board-container::-webkit-scrollbar-thumb:hover {
        background: ${
          isSacredTheme
            ? 'linear-gradient(45deg, rgba(255, 215, 0, 0.6), rgba(255, 215, 0, 0.9))'
            : isDarkTheme
              ? 'linear-gradient(45deg, #93c5fd, #60a5fa)'
              : 'linear-gradient(45deg, #9ca3af, #6b7280)'
        };
        ${isSacredTheme ? 'box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);' : ''}
      }
      .board-container::-webkit-scrollbar-corner {
        background: ${isSacredTheme ? 'rgba(0, 0, 0, 0.3)' : isDarkTheme ? '#374151' : '#f3f4f6'};
      }
      
      /* Column vertical scrollbars */
      .board-column::-webkit-scrollbar {
        height: 8px;
        width: 8px;
      }
      .board-column::-webkit-scrollbar-track {
        background: ${isSacredTheme ? 'rgba(0, 0, 0, 0.2)' : isDarkTheme ? '#1f2937' : '#f9fafb'};
        border-radius: 4px;
      }
      .board-column::-webkit-scrollbar-thumb {
        background: ${
          isSacredTheme
            ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.6))'
            : isDarkTheme
              ? 'linear-gradient(180deg, #4b5563, #6b7280)'
              : 'linear-gradient(180deg, #e5e7eb, #d1d5db)'
        };
        border-radius: 4px;
        border: ${isSacredTheme ? '1px solid rgba(255, 215, 0, 0.2)' : isDarkTheme ? '1px solid #374151' : '1px solid #d1d5db'};
      }
      .board-column::-webkit-scrollbar-thumb:hover {
        background: ${
          isSacredTheme
            ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.5), rgba(255, 215, 0, 0.8))'
            : isDarkTheme
              ? 'linear-gradient(180deg, #6b7280, #9ca3af)'
              : 'linear-gradient(180deg, #d1d5db, #9ca3af)'
        };
        ${isSacredTheme ? 'box-shadow: 0 0 6px rgba(255, 215, 0, 0.3);' : ''}
      }
      .board-column::-webkit-scrollbar-corner {
        background: ${isSacredTheme ? 'rgba(0, 0, 0, 0.2)' : isDarkTheme ? '#1f2937' : '#f9fafb'};
      }
    `,
  }
}

export default function Board({
  columns,
  selectedTaskId,
  onTaskSelect,
  columnDragAndDrop,
  taskDragAndDrop,
  styles,
}: BoardProps) {
  const [allColumns, setAllColumns] = useAtom(columnsAtom)
  const { isMobile, isTablet } = useResponsiveLayout()

  const boardStyles = useMemo(
    () => getStyles(styles?.theme, isMobile, isTablet),
    [styles?.theme, isMobile, isTablet]
  )

  const isSacredTheme = styles?.theme === 'sacred'

  // Add scrollbar styles to the document head
  React.useEffect(() => {
    const styleId = 'board-scrollbar-styles'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = boardStyles.scrollbarCSS

    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [boardStyles.scrollbarCSS])

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
        <div key={task._id} style={{ opacity: isDragging ? 0.5 : 1 }}>
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
            {...(styles ? { styles } : {})}
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
      styles,
    ]
  )

  const renderColumn = useCallback(
    (column: ColumnData, columnIndex: number) => {
      const isDragOver = columnDragAndDrop.dragOverColumnIndex === columnIndex
      const columnStyle = {
        ...boardStyles.column,
        ...(isDragOver ? boardStyles.columnDragOver : {}),
      }

      return (
        <div key={column._id} className="board-column" style={columnStyle}>
          {isSacredTheme && (
            <div style={boardStyles.glyph}>
              {SACRED_GLYPHS[columnIndex % SACRED_GLYPHS.length]}
            </div>
          )}

          {/* Column Header - Only this area is draggable for column reordering */}
          <div
            style={boardStyles.columnHeader}
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
            <h3 style={boardStyles.columnTitle}>{column.title}</h3>
            <p style={boardStyles.columnDescription}>{column.description}</p>
          </div>

          {/* Tasks Container - Only handles task drops, not column drags */}
          <div
            style={boardStyles.tasksContainer}
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
              <div style={boardStyles.noTasks}>No tasks yet</div>
            ) : (
              <div style={boardStyles.tasksList}>
                {column.tasks.map((task, taskIndex) =>
                  renderTask(task, taskIndex, columnIndex)
                )}

                {/* Drag placeholder */}
                {taskDragAndDrop.dragOverInfo?.columnIndex === columnIndex &&
                  taskDragAndDrop.dragOverInfo?.taskIndex ===
                    column.tasks.length && (
                    <div style={boardStyles.taskDragPlaceholder}>
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
      boardStyles,
      columnDragAndDrop,
      handleColumnDragStart,
      handleColumnDragEnd,
      isSacredTheme,
      taskDragAndDrop,
      allColumns,
      setAllColumns,
      renderTask,
    ]
  )

  return (
    <div className="board-container" style={boardStyles.boardContainer}>
      {columns.map((column, index) => renderColumn(column, index))}
    </div>
  )
}

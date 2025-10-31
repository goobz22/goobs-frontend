'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import type { ColumnDef } from '../types'

interface UseColumnResizeProps {
  columns: ColumnDef[]
  onColumnResize?: (columnField: string, newWidth: number) => void
}

export function useColumnResize({
  columns,
  onColumnResize,
}: UseColumnResizeProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const [updatedColumns, setUpdatedColumns] = useState<ColumnDef[]>(columns)
  const [tempWidth, setTempWidth] = useState<number | null>(null)
  const resizingElementRef = useRef<HTMLElement | null>(null)

  // Update columns when props change - preserve all properties including functions
  useEffect(() => {
    // Check if columns array length changed or if any field changed
    const columnsChanged =
      columns.length !== updatedColumns.length ||
      columns.some((col, idx) => {
        const prevCol = updatedColumns[idx]
        return (
          !prevCol ||
          col.field !== prevCol.field ||
          col.width !== prevCol.width ||
          col.headerName !== prevCol.headerName
        )
      })

    if (columnsChanged) {
      setUpdatedColumns(columns)
    }
  }, [columns])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnField: string) => {
      e.preventDefault()
      e.stopPropagation()

      const column = updatedColumns.find(col => col.field === columnField)
      if (!column) return

      // Find the column header element for direct DOM manipulation
      const headerElement = (e.target as HTMLElement).closest('th')
      resizingElementRef.current = headerElement

      setIsResizing(true)
      setResizingColumn(columnField)
      setStartX(e.clientX)
      setStartWidth(column.computedWidth || column.width || 200)
    },
    [updatedColumns]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizingColumn) return

      const deltaX = e.clientX - startX
      const newWidth = Math.max(50, startWidth + deltaX) // Minimum width of 50px

      setTempWidth(newWidth)

      // Update DOM directly for immediate visual feedback
      if (resizingElementRef.current) {
        resizingElementRef.current.style.width = `${newWidth}px`
        resizingElementRef.current.style.minWidth = `${newWidth}px`
        resizingElementRef.current.style.maxWidth = `${newWidth}px`
      }

      // Also update the state for consistency (but this might be batched)
      setUpdatedColumns(prev =>
        prev.map(col =>
          col.field === resizingColumn
            ? { ...col, computedWidth: newWidth, width: newWidth }
            : col
        )
      )
    },
    [isResizing, resizingColumn, startX, startWidth]
  )

  const handleMouseUp = useCallback(() => {
    if (!isResizing || !resizingColumn) return

    const finalWidth = tempWidth || startWidth

    // Call the callback with the final width
    if (onColumnResize) {
      onColumnResize(resizingColumn, finalWidth)
    }

    // Reset resize state
    setIsResizing(false)
    setResizingColumn(null)
    setStartX(0)
    setStartWidth(0)
    setTempWidth(null)
    resizingElementRef.current = null
  }, [isResizing, resizingColumn, tempWidth, startWidth, onColumnResize])

  // Set up global mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const getResizeHandleProps = useCallback(
    (columnField: string) => ({
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, columnField),
      style: {
        position: 'absolute' as const,
        right: '-4px',
        top: '0',
        width: '8px',
        height: '100%',
        cursor: 'col-resize',
        backgroundColor: 'transparent',
        zIndex: 10,
        borderRight: '2px solid transparent',
        transition: isResizing ? 'none' : 'all 0.2s ease', // Disable transition during resize
      },
    }),
    [handleMouseDown, isResizing]
  )

  return {
    updatedColumns,
    isResizing,
    resizingColumn,
    getResizeHandleProps,
  }
}

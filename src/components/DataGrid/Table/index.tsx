'use client'

import React, { useEffect } from 'react'
import ColumnHeaderRow from './ColumnHeaderRow'
import Rows from './Rows'
import { useColumnResize } from '../utils/useColumnResize'
import { getDataGridStyles } from '../../../theme'
import { getDataGridTheme } from '../../../theme/datagrid'
import type { TableProps } from '../types'

export function getRowId(row: any): string {
  return String(row.id ?? row._id ?? '')
}

// Create themed scrollbar styles
const createScrollbarStyles = (theme: string, scrollbarConfig: any) => {
  const scrollbarClass = `datagrid-scrollbar-${theme}`

  const css = `
    .${scrollbarClass}::-webkit-scrollbar {
      height: ${scrollbarConfig.height};
      width: ${scrollbarConfig.width};
    }
    
    .${scrollbarClass}::-webkit-scrollbar-track {
      background-color: ${scrollbarConfig.track.backgroundColor};
      border-radius: ${scrollbarConfig.track.borderRadius};
    }
    
    .${scrollbarClass}::-webkit-scrollbar-thumb {
      background-color: ${scrollbarConfig.thumb.backgroundColor};
      border-radius: ${scrollbarConfig.thumb.borderRadius};
      ${scrollbarConfig.thumb.border ? `border: ${scrollbarConfig.thumb.border};` : ''}
    }
    
    .${scrollbarClass}::-webkit-scrollbar-thumb:hover {
      background-color: ${scrollbarConfig.thumbHover.backgroundColor};
    }
    
    /* Firefox scrollbar styles */
    .${scrollbarClass} {
      scrollbar-width: thin;
      scrollbar-color: ${scrollbarConfig.thumb.backgroundColor} ${scrollbarConfig.track.backgroundColor};
    }
  `

  return { css, className: scrollbarClass }
}

function Table({
  columns,
  rows,
  onRowClick,
  selectedRowIds = [],
  allRowsSelected = false,
  someRowsSelected = false,
  onHeaderCheckboxChange,
  onColumnResize,
  styles,
  editingCell,
  editingValue,
  onCellClick,
  onCellSave,
  onCellCancel,
  onEditingValueChange,
  onColumnSort,
  onManageColumns,
  draggedColumn,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
}: TableProps) {
  const computedStyles = getDataGridStyles(styles)
  const theme = styles?.theme || 'light'

  // Get theme configuration directly
  const themeConfig = getDataGridTheme(styles)

  // Use column resize hook
  const { updatedColumns, isResizing, resizingColumn, getResizeHandleProps } =
    useColumnResize({
      columns,
      onColumnResize,
    })

  // Create scrollbar styles
  const scrollbarStyles = createScrollbarStyles(theme, themeConfig.scrollbar)

  // Inject scrollbar styles into document head
  useEffect(() => {
    const styleId = `datagrid-scrollbar-${theme}`
    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = scrollbarStyles.css

    return () => {
      // Clean up on unmount
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
    }
  }, [theme, scrollbarStyles.css])

  // Apply styles for horizontal scrolling
  const tableContainerStyle = {
    ...computedStyles.table.tableContainer,
    overflowX: 'auto' as const,
    width: '100%',
  }

  const tableWrapperStyle = {
    ...computedStyles.table.tableWrapper,
    overflowX: 'auto' as const,
    width: '100%',
  }

  const tableStyle = {
    ...computedStyles.table.table,
    width: 'max-content', // Allow table to grow wider than container
    minWidth: '100%',
  }

  return (
    <div style={tableContainerStyle}>
      <div style={tableWrapperStyle} className={scrollbarStyles.className}>
        <table style={tableStyle}>
          <thead>
            <ColumnHeaderRow
              allRowsSelected={allRowsSelected}
              someRowsSelected={someRowsSelected}
              handleHeaderCheckboxChange={onHeaderCheckboxChange}
              columns={updatedColumns}
              getResizeHandleProps={getResizeHandleProps}
              isResizing={isResizing}
              resizingColumn={resizingColumn}
              styles={styles}
              onColumnSort={onColumnSort}
              onManageColumns={onManageColumns}
              draggedColumn={draggedColumn}
              onColumnDragStart={onColumnDragStart}
              onColumnDragOver={onColumnDragOver}
              onColumnDrop={onColumnDrop}
              onColumnDragEnd={onColumnDragEnd}
            />
          </thead>
          <Rows
            rows={rows}
            columns={updatedColumns}
            selectedRowIds={selectedRowIds}
            onRowClick={onRowClick}
            styles={styles}
            editingCell={editingCell}
            editingValue={editingValue}
            onCellClick={onCellClick}
            onCellSave={onCellSave}
            onCellCancel={onCellCancel}
            onEditingValueChange={onEditingValueChange}
          />
        </table>
      </div>
    </div>
  )
}

export default Table

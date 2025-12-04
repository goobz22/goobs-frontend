'use client'

import React, { useState } from 'react'
import type { ColumnDef } from '../../types'
import { getDataGridStyles, type DataGridStyles } from '../../../../theme'
import Checkbox from '../../../Checkbox'
import MoreVertIcon from '../../../Icons/MoreVert'
import Popover from '../../../Popover'

interface ColumnHeaderRowProps {
  allRowsSelected: boolean
  someRowsSelected: boolean
  handleHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>
  columns: ColumnDef[]
  getResizeHandleProps: (columnField: string) => {
    onMouseDown: (e: React.MouseEvent) => void
    style: React.CSSProperties
  }
  isResizing: boolean
  resizingColumn: string | null
  styles?: DataGridStyles
  // New props for column actions
  onColumnSort?: (field: string, direction: 'asc' | 'desc') => void
  onManageColumns?: () => void
  // Column drag and drop props
  draggedColumn?: string | null
  onColumnDragStart?: (field: string) => void
  onColumnDragOver?: (e: React.DragEvent) => void
  onColumnDrop?: (targetField: string) => void
  onColumnDragEnd?: () => void
}

const getStyles = (styles?: DataGridStyles) => {
  const computedStyles = getDataGridStyles(styles)

  return {
    headerRow: {
      position: 'relative',
      zIndex: 50,
      height: '55px',
      ...computedStyles.table.tableHeader,
    } as React.CSSProperties,
    headerCell: {
      padding: '0.75rem',
      lineHeight: '45px',
      verticalAlign: 'bottom',
      fontWeight: '600',
      textAlign: 'left',
      color: computedStyles.table.tableHeaderCell.color,
      borderRight: computedStyles.table.tableHeaderCell.borderRight,
      borderBottom: computedStyles.table.tableHeaderCell.borderBottom,
    } as React.CSSProperties,
    checkboxCell: {
      padding: '0.75rem',
      width: '48px',
      minWidth: '48px',
      maxWidth: '48px',
      textAlign: 'center',
      borderRight: computedStyles.table.tableHeaderCell.borderRight,
      borderBottom: computedStyles.table.tableHeaderCell.borderBottom,
      verticalAlign: 'middle',
      fontWeight: '600',
      color: computedStyles.table.tableHeaderCell.color,
    } as React.CSSProperties,
    mobileDropdownCell: {
      width: '100%',
      minWidth: '200px',
      maxWidth: '100%',
      boxSizing: 'border-box' as const,
      overflow: 'visible',
      position: 'relative',
      zIndex: 50,
      paddingRight: '0.5rem',
      ...computedStyles.table.tableHeaderCell,
      color: computedStyles.table.tableHeaderCell.color,
    } as React.CSSProperties,
    overflowCell: {
      width: '275px',
      minWidth: '275px',
      boxSizing: 'border-box' as const,
      overflow: 'visible',
      position: 'relative',
      zIndex: 50,
      ...computedStyles.table.tableHeaderCell,
      color: computedStyles.table.tableHeaderCell.color,
    } as React.CSSProperties,
    columnHeader: (width?: number) =>
      ({
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
        padding: '0.75rem',
        width: width ? `${width}px` : undefined,
        minWidth: width ? `${width}px` : undefined,
        maxWidth: width ? `${width}px` : '200px',
        borderRight: computedStyles.table.tableHeaderCell.borderRight,
        borderBottom: computedStyles.table.tableHeaderCell.borderBottom,
        fontWeight: '600',
        textAlign: 'left',
        color: computedStyles.table.tableHeaderCell.color,
      }) as React.CSSProperties,
  }
}

const ColumnHeaderRow: React.FC<ColumnHeaderRowProps> = ({
  allRowsSelected,
  someRowsSelected,
  handleHeaderCheckboxChange,
  columns,
  getResizeHandleProps,
  isResizing,
  resizingColumn,
  styles,
  onColumnSort,
  onManageColumns,
  draggedColumn,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const componentStyles = getStyles(styles)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const headerRefs = React.useRef<Record<string, HTMLTableCellElement | null>>(
    {}
  )

  // Wrapper function to convert boolean to ChangeEvent
  const handleCheckboxChange = (checked: boolean) => {
    const fakeEvent = {
      target: { checked },
      currentTarget: { checked },
    } as React.ChangeEvent<HTMLInputElement>
    handleHeaderCheckboxChange(fakeEvent)
  }

  return (
    <tr style={componentStyles.headerRow}>
      {/* Header checkbox for select all */}
      <th style={componentStyles.checkboxCell}>
        <Checkbox
          checked={allRowsSelected}
          indeterminate={someRowsSelected}
          onChange={handleCheckboxChange}
          styles={{
            theme: isSacredTheme ? 'sacred' : 'light',
          }}
        />
      </th>

      {/* All columns with horizontal scrolling */}
      {columns.map(col => {
        const cellStyle = componentStyles.columnHeader(col.computedWidth)

        return (
          <th
            key={col.field}
            ref={el => {
              headerRefs.current[col.field] = el
            }}
            style={{
              ...cellStyle,
              position: 'relative',
              opacity: draggedColumn === col.field ? 0.5 : 1,
            }}
            draggable
            onDragStart={() => onColumnDragStart?.(col.field)}
            onDragOver={onColumnDragOver}
            onDrop={() => onColumnDrop?.(col.field)}
            onDragEnd={onColumnDragEnd}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'grab',
              }}
            >
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  userSelect: 'none',
                }}
              >
                {col.headerName || col.field}
              </span>

              {/* More options button */}
              <button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Use the header cell as anchor for better positioning
                  const headerCell = headerRefs.current[col.field]
                  setAnchorEl(headerCell || e.currentTarget)
                  setOpenDropdown(col.field)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isSacredTheme ? '#FFD700' : '#6B7280',
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
              >
                <MoreVertIcon styles={{ theme: styles?.theme || 'sacred' }} />
              </button>
            </div>

            {/* Column dropdown menu */}
            <Popover
              open={openDropdown === col.field}
              onClose={() => {
                setOpenDropdown(null)
                setAnchorEl(null)
              }}
              anchorEl={anchorEl}
              styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
            >
              <div
                style={{
                  padding: '8px',
                  minWidth: '180px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  backgroundColor: isSacredTheme
                    ? 'rgba(0, 0, 0, 0.9)'
                    : 'white',
                  borderRadius: '8px',
                  boxShadow: isSacredTheme
                    ? '0 10px 30px rgba(255, 215, 0, 0.3)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Sorting options */}
                <button
                  onClick={() => {
                    console.log('[ColumnHeaderRow] Sort A-Z clicked', {
                      field: col.field,
                      onColumnSort: !!onColumnSort,
                    })
                    onColumnSort?.(col.field, 'asc')
                    console.log(
                      '[ColumnHeaderRow] Sort complete, closing dropdown'
                    )
                    setOpenDropdown(null)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    border: `1px solid ${isSacredTheme ? '#FFD700' : '#E5E7EB'}`,
                    background: isSacredTheme
                      ? 'rgba(255, 215, 0, 0.05)'
                      : '#F9F9F9',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isSacredTheme ? '#FFD700' : '#1F2937',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isSacredTheme
                      ? 'rgba(255, 215, 0, 0.2)'
                      : 'rgba(59, 130, 246, 0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isSacredTheme
                      ? 'rgba(255, 215, 0, 0.05)'
                      : '#F9F9F9'
                  }}
                >
                  Sort A → Z
                </button>
                <button
                  onClick={() => {
                    console.log('[ColumnHeaderRow] Sort Z-A clicked', {
                      field: col.field,
                      onColumnSort: !!onColumnSort,
                    })
                    onColumnSort?.(col.field, 'desc')
                    console.log(
                      '[ColumnHeaderRow] Sort complete, closing dropdown'
                    )
                    setOpenDropdown(null)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    border: `1px solid ${isSacredTheme ? '#FFD700' : '#E5E7EB'}`,
                    background: isSacredTheme
                      ? 'rgba(255, 215, 0, 0.05)'
                      : '#F9F9F9',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isSacredTheme ? '#FFD700' : '#1F2937',
                    borderRadius: '4px',
                    marginTop: '2px',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isSacredTheme
                      ? 'rgba(255, 215, 0, 0.2)'
                      : 'rgba(59, 130, 246, 0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isSacredTheme
                      ? 'rgba(255, 215, 0, 0.05)'
                      : '#F9F9F9'
                  }}
                >
                  Sort Z → A
                </button>

                <hr
                  style={{
                    margin: '8px 0',
                    border: 'none',
                    borderTop: `1px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : '#E5E7EB'}`,
                  }}
                />

                {/* Column actions */}

                <hr
                  style={{
                    margin: '8px 0',
                    border: 'none',
                    borderTop: `1px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : '#E5E7EB'}`,
                  }}
                />

                <button
                  onClick={() => {
                    onManageColumns?.()
                    setOpenDropdown(null)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isSacredTheme ? '#FFD700' : '#1F2937',
                  }}
                >
                  Manage All Columns
                </button>
              </div>
            </Popover>

            {/* Resize handle - for all columns that are resizable */}
            {col.resizable !== false && (
              <div
                {...getResizeHandleProps(col.field)}
                style={{
                  ...getResizeHandleProps(col.field).style,
                  backgroundColor:
                    resizingColumn === col.field
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(148, 163, 184, 0.1)',
                  borderRight:
                    resizingColumn === col.field
                      ? '2px solid #3B82F6'
                      : '1px solid rgba(148, 163, 184, 0.3)',
                }}
                onMouseEnter={e => {
                  if (!isResizing) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(59, 130, 246, 0.2)'
                    e.currentTarget.style.borderRight = '2px solid #3B82F6'
                  }
                }}
                onMouseLeave={e => {
                  if (!isResizing && resizingColumn !== col.field) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(148, 163, 184, 0.1)'
                    e.currentTarget.style.borderRight =
                      '1px solid rgba(148, 163, 184, 0.3)'
                  }
                }}
                title="Drag to resize column"
              />
            )}
          </th>
        )
      })}
    </tr>
  )
}

export default ColumnHeaderRow

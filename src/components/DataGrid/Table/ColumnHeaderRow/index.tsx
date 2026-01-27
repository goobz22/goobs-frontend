'use client'

import React, { useState } from 'react'
import type { ColumnDef } from '../../types'
import type { DataGridStyles } from '../../../../theme'
import Checkbox from '../../../Checkbox'
import MoreVertIcon from '../../../Icons/MoreVert'
import Popover from '../../../Popover'
import cssStyles from '../../DataGrid.module.css'

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
  const theme = styles?.theme || 'light'
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
    <tr className={cssStyles.headerRow} data-theme={theme}>
      {/* Header checkbox for select all */}
      <th className={`${cssStyles.headerCell} ${cssStyles.headerCellCheckbox}`}>
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
        const widthStyle = col.computedWidth
          ? {
              width: `${col.computedWidth}px`,
              minWidth: `${col.computedWidth}px`,
              maxWidth: `${col.computedWidth}px`,
            }
          : {}

        return (
          <th
            key={col.field}
            ref={el => {
              headerRefs.current[col.field] = el
            }}
            className={cssStyles.headerCell}
            style={{
              ...widthStyle,
              opacity: draggedColumn === col.field ? 0.5 : 1,
            }}
            draggable
            onDragStart={() => onColumnDragStart?.(col.field)}
            onDragOver={onColumnDragOver}
            onDrop={() => onColumnDrop?.(col.field)}
            onDragEnd={onColumnDragEnd}
          >
            <div className={cssStyles.headerCellContent}>
              <span className={cssStyles.headerCellText}>
                {col.headerName || col.field}
              </span>

              {/* More options button */}
              <button
                className={cssStyles.headerMenuBtn}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Use the header cell as anchor for better positioning
                  const headerCell = headerRefs.current[col.field]
                  setAnchorEl(headerCell || e.currentTarget)
                  setOpenDropdown(col.field)
                }}
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
              <div className={cssStyles.dropdownMenu} data-theme={theme}>
                {/* Sorting options */}
                <button
                  className={cssStyles.dropdownBtn}
                  onClick={() => {
                    onColumnSort?.(col.field, 'asc')
                    setOpenDropdown(null)
                  }}
                >
                  Sort A → Z
                </button>
                <button
                  className={cssStyles.dropdownBtn}
                  onClick={() => {
                    onColumnSort?.(col.field, 'desc')
                    setOpenDropdown(null)
                  }}
                >
                  Sort Z → A
                </button>

                <hr className={cssStyles.dropdownDivider} />

                <button
                  className={cssStyles.dropdownBtn}
                  onClick={() => {
                    onManageColumns?.()
                    setOpenDropdown(null)
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
                className={`${cssStyles.resizeHandle} ${resizingColumn === col.field ? cssStyles.resizeHandleActive : ''}`}
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

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
            // Test-friendly column header attributes:
            //   - data-column-header: the column field key, lets tests
            //     target a specific column header without relying on
            //     headerName text (which may localize / change).
            //   - data-dragging: 'true' while this column is the active
            //     drag source — useful for asserting drag-drop state.
            //   - role="columnheader": ARIA semantics for screenreaders
            //     and accessibility tools.
            // (aria-sort is omitted because the header doesn't track
            // current sort direction internally — sorting is owned by
            // the parent. Consumers that want aria-sort should expose
            // sort direction via a future prop.)
            data-column-header={col.field}
            data-dragging={draggedColumn === col.field ? 'true' : undefined}
            role="columnheader"
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
                // The menu trigger needs a stable selector so tests
                // can open the sort/manage menu for a specific column:
                //   `[data-column-header="email"] [data-action="open-column-menu"]`
                data-action="open-column-menu"
                aria-label={`Column actions for ${col.headerName || col.field}`}
                aria-haspopup="menu"
                aria-expanded={openDropdown === col.field || undefined}
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
              <div
                className={cssStyles.dropdownMenu}
                data-theme={theme}
                // Marks this menu as the column-actions popover so
                // tests can wait for `[data-column-menu="true"]` to
                // appear before clicking inside it.
                data-column-menu="true"
                data-column-menu-for={col.field}
                role="menu"
                aria-label={`Column actions for ${col.headerName || col.field}`}
              >
                {/* Sorting options */}
                <button
                  className={cssStyles.dropdownBtn}
                  data-action="sort-asc"
                  role="menuitem"
                  onClick={() => {
                    onColumnSort?.(col.field, 'asc')
                    setOpenDropdown(null)
                  }}
                >
                  Sort A → Z
                </button>
                <button
                  className={cssStyles.dropdownBtn}
                  data-action="sort-desc"
                  role="menuitem"
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
                  data-action="manage-columns"
                  role="menuitem"
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

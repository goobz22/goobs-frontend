'use client'

import React, { useState } from 'react'
import type { ColumnDef, DataGridStyles } from '../../types'
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
  /**
   * Field name of the column the grid is currently sorted by, or null when
   * unsorted. Drives `aria-sort` on the matching `<th>` so screen-reader users
   * perceive sort state (WCAG 1.3.1 / 4.1.2) — the DataGrid owns the sort state
   * and threads it down here.
   */
  sortField?: string | null
  /** Current sort direction for `sortField` ('asc' | 'desc'). */
  sortDirection?: 'asc' | 'desc'
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
  sortField,
  sortDirection,
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
      <th
        scope="col"
        className={`${cssStyles.headerCell} ${cssStyles.headerCellCheckbox}`}
      >
        <Checkbox
          checked={allRowsSelected}
          indeterminate={someRowsSelected}
          onChange={handleCheckboxChange}
          // Icon-only control needs a programmatic name — there is no visible
          // label text next to the select-all checkbox (WCAG 4.1.2). Checkbox
          // spreads unknown props onto its underlying <input>.
          aria-label="Select all rows"
          styles={{
            theme: isSacredTheme ? 'sacred' : 'light',
          }}
        />
      </th>

      {/* All columns with horizontal scrolling */}
      {columns.map(col => {
        const isDragging = draggedColumn === col.field
        // Runtime-measured column width (from resize ops) is passed as a CSS
        // custom property; the .headerCell[style*='--dg-col-width'] selector in
        // the module pins width/min/max to it. Drag-source opacity moves to a
        // CSS class. Both are kept in JS only because the value is data-driven.
        const headerCellStyle = col.computedWidth
          ? ({
              ['--dg-col-width']: `${col.computedWidth}px`,
            } as React.CSSProperties)
          : undefined

        // aria-sort reflects the grid's current sort state on the sorted
        // column and is omitted on the rest (WCAG 1.3.1 / 4.1.2). The parent
        // owns sort state and threads it in via sortField/sortDirection.
        const ariaSort: 'ascending' | 'descending' | undefined =
          sortField === col.field
            ? sortDirection === 'desc'
              ? 'descending'
              : 'ascending'
            : undefined

        return (
          <th
            key={col.field}
            ref={el => {
              headerRefs.current[col.field] = el
            }}
            className={`${cssStyles.headerCell} ${isDragging ? cssStyles.headerCellDragging : ''}`}
            // Test-friendly column header attributes:
            //   - data-column-header: the column field key, lets tests
            //     target a specific column header without relying on
            //     headerName text (which may localize / change).
            //   - data-dragging: 'true' while this column is the active
            //     drag source — useful for asserting drag-drop state.
            //   - role="columnheader": ARIA semantics for screenreaders
            //     and accessibility tools.
            //   - scope="col": associates every data cell in the column with
            //     this header for assistive-tech table navigation.
            //   - aria-sort: current sort direction when this is the sorted
            //     column (set by the parent's sort state).
            data-column-header={col.field}
            data-dragging={isDragging ? 'true' : undefined}
            role="columnheader"
            scope="col"
            aria-sort={ariaSort}
            style={headerCellStyle}
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

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
  /**
   * Keyboard-operable resize (WCAG 2.1.1) — adjusts a column's width by a pixel
   * delta. Drives the `role="separator"` resize handle's Arrow-key handler so
   * columns can be resized without a pointer.
   */
  resizeColumnBy?: (columnField: string, delta: number) => void
  isResizing: boolean
  resizingColumn: string | null
  styles?: DataGridStyles
  // New props for column actions
  onColumnSort?: (field: string, direction: 'asc' | 'desc') => void
  onManageColumns?: () => void
  /**
   * Keyboard-operable column reorder (WCAG 2.1.1) — moves a column left/right
   * among the visible columns. Rendered as "Move left"/"Move right" items in
   * the column-actions menu so reordering works without drag-and-drop.
   */
  onColumnMove?: (field: string, direction: 'left' | 'right') => void
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
  resizeColumnBy,
  resizingColumn,
  styles,
  onColumnSort,
  onManageColumns,
  onColumnMove,
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

  /**
   * Menu keyboard model (WCAG 2.1.1). The Popover (role="dialog") already moves
   * focus into the menu on open, traps Tab, and restores focus to the trigger
   * on close; this adds the APG-Menu arrow-key roving among the menuitems that
   * was missing (D5). Up/Down wrap; Home/End jump to the ends.
   */
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    ).filter(el => !el.disabled)
    if (items.length === 0) return
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement
    )
    let nextIndex: number
    switch (e.key) {
      case 'ArrowDown':
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
        break
      case 'ArrowUp':
        nextIndex =
          currentIndex < 0
            ? items.length - 1
            : (currentIndex - 1 + items.length) % items.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = items.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    items[nextIndex]?.focus()
  }

  return (
    // aria-rowindex={1}: the column-header row is the first row of the grid, so
    // the data rows (which carry aria-rowindex from the page offset) start at 2.
    // Required for a consistent position announcement when aria-rowcount counts
    // every row including this header (WCAG 1.3.1).
    <tr className={cssStyles.headerRow} data-theme={theme} aria-rowindex={1}>
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
      {columns.map((col, colIndex) => {
        const isDragging = draggedColumn === col.field
        const canMoveLeft = colIndex > 0
        const canMoveRight = colIndex < columns.length - 1
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
              // Name the portalled surface (WCAG 4.1.2) — the Popover renders
              // as role="dialog" and requires an accessible name.
              ariaLabel={`Column actions for ${col.headerName || col.field}`}
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
                // APG-Menu arrow-key roving among the menuitems (WCAG 2.1.1).
                onKeyDown={handleMenuKeyDown}
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

                {/* Keyboard-operable column reorder (WCAG 2.1.1) — a
                    pointer-free alternative to header drag-and-drop. Rendered
                    only when a move is possible in that direction. */}
                {onColumnMove && (canMoveLeft || canMoveRight) && (
                  <hr className={cssStyles.dropdownDivider} />
                )}
                {onColumnMove && canMoveLeft && (
                  <button
                    className={cssStyles.dropdownBtn}
                    data-action="move-left"
                    role="menuitem"
                    onClick={() => {
                      onColumnMove(col.field, 'left')
                      setOpenDropdown(null)
                    }}
                  >
                    Move column left
                  </button>
                )}
                {onColumnMove && canMoveRight && (
                  <button
                    className={cssStyles.dropdownBtn}
                    data-action="move-right"
                    role="menuitem"
                    onClick={() => {
                      onColumnMove(col.field, 'right')
                      setOpenDropdown(null)
                    }}
                  >
                    Move column right
                  </button>
                )}

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

            {/* Resize handle - for all columns that are resizable.
                role="separator" + tabIndex + Arrow-key handler make the
                previously pointer-only resize keyboard operable (WCAG 2.1.1):
                ←/→ nudge the width by 10px (50px with Shift). */}
            {col.resizable !== false && (
              <div
                {...getResizeHandleProps(col.field)}
                className={`${cssStyles.resizeHandle} ${resizingColumn === col.field ? cssStyles.resizeHandleActive : ''}`}
                title="Drag to resize column"
                role="separator"
                aria-orientation="vertical"
                aria-label={`Resize ${col.headerName || col.field} column`}
                tabIndex={0}
                data-action="resize-handle"
                onKeyDown={e => {
                  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
                  e.preventDefault()
                  const step = e.shiftKey ? 50 : 10
                  resizeColumnBy?.(
                    col.field,
                    e.key === 'ArrowLeft' ? -step : step
                  )
                }}
              />
            )}
          </th>
        )
      })}
    </tr>
  )
}

export default ColumnHeaderRow

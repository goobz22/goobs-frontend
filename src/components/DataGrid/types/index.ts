'use client'

import React from 'react'
import type { CustomButtonProps } from '../../Button'
import type { DropdownProps } from '../../Dropdown'
import type { SearchbarProps } from '../../Searchbar'

/**
 * Represents a column definition in the table.
 */
export interface ColumnDef {
  field: string
  headerName: string
  width?: number
  flex?: number
  renderCell?: (params: CellParams) => React.ReactNode
  renderHeader?: (params: HeaderParams) => React.ReactNode
  computedWidth?: number
  headerText?: string
  index?: number
}

/**
 * Cell params passed to renderCell functions, if any.
 */
export interface CellParams<T = unknown> {
  row: RowData
  value: T
  field: string
  rowIndex: number
  columnIndex: number
}

/**
 * Header params passed to renderHeader functions, if any.
 */
export interface HeaderParams {
  column: ColumnDef
  columnIndex: number
}

/**
 * Represents a row of data in the table. Must have an `_id` or `id`.
 */
export interface RowData {
  _id?: string
  id?: string
  [key: string]: unknown
}

/**
 * Props for the Table component.
 * Pagination props have been removed.
 */
export interface TableProps {
  columns: ColumnDef[]
  rows: RowData[]
  rowHeight?: number
  headerHeight?: number
  onRowClick?: (row: RowData) => void

  /**
   * IDs of rows currently selected.
   * If using checkboxSelection, you can highlight them in the UI.
   */
  selectedRows?: string[]

  /**
   * Whether to display a checkbox column in the table.
   * The parent decides if it's enabled or not.
   */
  checkboxSelection?: boolean

  /**
   * (Optional) Used previously by Table's own selection logic,
   * but might be handled now in the parent.
   */
  onSelectionChange?: (selectedIds: string[]) => void

  /**
   * If you have custom logic for rendering cell text,
   * pass a function here. Otherwise, use renderCell in ColumnDef.
   */
  getCellText?: (params: CellParams) => string

  /**
   * If you have custom logic for rendering header text,
   * pass a function here. Otherwise, use renderHeader in ColumnDef.
   */
  getHeaderText?: (params: HeaderParams) => string

  /**
   * Columns that are currently "selected" or highlighted (for column selection).
   */
  selectedColumns?: string[]

  /**
   * Called when user clicks on a column header.
   * Could be used for toggling column selection or sorting, etc.
   */
  onColumnHeaderClick?: (field: string) => void

  /**
   * NEW PROPS for external checkbox logic:
   *
   * - `allRowsSelected`: Does the parent consider all rows selected?
   * - `someRowsSelected`: Does the parent consider some (but not all) rows selected?
   * - `onHeaderCheckboxChange`: Callback for toggling "Select All" from the parent.
   * - `onRowCheckboxChange`: Callback for toggling a single row's selection in the parent.
   */
  allRowsSelected?: boolean
  someRowsSelected?: boolean
  onHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>
  onRowCheckboxChange: (rowId: string) => void
}

/**
 * Methods exposed via ref in the Table component.
 */
export interface TableRef {
  getAllColumns: () => ColumnDef[]
  getSelectedRows: () => Map<string, RowData>
  forceUpdate: () => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  getRowIndex: (id: string) => number
  isRowSelected: (id: string) => boolean
}

/**
 * Props for the main DataGrid component.
 */
export interface DatagridProps {
  columns: ColumnDef[]
  rows: RowData[] // <— Must have ._id or .id
  buttons?: CustomButtonProps[]
  dropdowns?: Omit<DropdownProps, 'onChange'>[]
  searchbarProps?: Omit<SearchbarProps, 'onChange' | 'value'>
  onRefresh?: () => void
  loading?: boolean
  error?: Error | null
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void

  /**
   * If true, adds a checkbox column to each row.
   */
  checkboxSelection?: boolean

  /**
   * The parent can store the set of selected row IDs
   * and pass them here for the table to highlight them.
   */
  selectedRows?: string[]

  /**
   * If the parent wants to know when the table's selection changes,
   * it can get the updated array of selected IDs here.
   */
  onSelectionChange?: (selectedIds: string[]) => void
}

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
  selectedRows?: string[]
  checkboxSelection?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  getCellText?: (params: CellParams) => string
  getHeaderText?: (params: HeaderParams) => string
  selectedColumns?: string[]
  onColumnHeaderClick?: (field: string) => void
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
  checkboxSelection?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
}

'use client'

import React from 'react'
import type { CustomButtonProps } from '../../Button'
import type { DropdownProps } from '../../Dropdown'
import type { SearchbarProps } from '../../Searchbar'

export interface ColumnDef {
  field: string
  headerName: string
  computedWidth?: number
  headerText?: string
  index?: number
  width?: number

  renderCell?: (params: {
    row: RowData
    value: unknown
    field: string
    rowIndex: number
    columnIndex: number
  }) => React.ReactNode
}

export interface RowData {
  _id?: string
  id?: string
  [key: string]: unknown
}

export interface TableProps {
  columns: ColumnDef[]
  rows: RowData[]
  onRowClick?: (row: RowData) => void
  selectedRowIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  allRowsSelected?: boolean
  someRowsSelected?: boolean
  onHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>
  onRowCheckboxChange: (rowId: string) => void
}

export interface DatagridProps {
  columns: ColumnDef[]
  rows: RowData[]
  buttons?: CustomButtonProps[]
  dropdowns?: Omit<DropdownProps, 'onChange'>[]
  searchbarProps?: Omit<SearchbarProps, 'onChange' | 'value'>
  error?: Error | null
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void
  onSelectionChange?: (selectedIds: string[]) => void
}

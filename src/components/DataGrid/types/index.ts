'use client'

import React from 'react'
import type { CustomButtonProps } from '../../Button'
import type { DropdownProps } from '../../Field/Dropdown/Regular'
import type { SearchbarProps } from '../../Field/Search'
import type { DropdownOption } from '../../Field/Dropdown/Searchable'

export interface ColumnDef {
  field: string
  headerName: string
  computedWidth?: number
  headerText?: string
  index?: number
  width?: number
  // Format the column values as USD currency
  formatCurrency?: boolean
  // Format the column values as masked credit card numbers
  formatCreditCard?: boolean
  // Format the column values as styled expiration dates
  formatExpirationDate?: boolean
  // Format the column values as masked account numbers
  formatAccountNumber?: boolean
  // Format the column values as styled routing numbers
  formatRoutingNumber?: boolean

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
  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean
}

// New filter interface for embedded DataGrid filtering
export interface DataGridFilter {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: { value: string } | null) => void
  placeholder?: string
  width?: string
}

export interface MetricCardData {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  glyph?: string
}

export interface DatagridProps {
  columns: ColumnDef[]
  rows: RowData[]
  buttons?: CustomButtonProps[]
  dropdowns?: DropdownProps[]
  searchbarProps?: SearchbarProps
  error?: Error | null

  // Controls whether ID columns (id/_id) are visible
  showIdColumns?: boolean

  // Single or multi selection callbacks:
  onManage?: (selectedRows: string[]) => void
  onShow?: (selectedRows: string[]) => void

  // This is critical: must accept selectedIds as an argument
  onDuplicate?: (selectedRows: string[]) => void
  onDelete?: (selectedRows: string[]) => void

  // For capturing selection changes
  onSelectionChange?: (selectedRows: string[]) => void

  // Optional embedded filters that appear between toolbar and table
  filters?: DataGridFilter[]

  /** Enable Egyptian/Sacred theming */
  sacredtheme?: boolean

  metrics?: MetricCardData[]
}

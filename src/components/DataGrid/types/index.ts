'use client'

import React from 'react'
import type { ButtonProps } from '../../Button'
import type { DropdownProps } from '../../Field/Dropdown/Regular'
import type { SearchbarProps } from '../../Field/Search'
import type { DropdownOption } from '../../Field/Dropdown/SearchableSimple'
import type { DataGridStyles } from '../../../theme'

export interface ColumnDef {
  field: string
  headerName: string
  computedWidth?: number
  headerText?: string
  index?: number
  width?: number
  resizable?: boolean
  // Column type for formatting
  type?:
    | 'currency'
    | 'credit_card'
    | 'expiration_date'
    | 'account_number'
    | 'routing_number'
    | 'dropdown'
    | 'default'
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
  // Dropdown options for editing
  dropdownOptions?: Array<{ value: string; label?: string }>

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
  onColumnResize?: (columnField: string, newWidth: number) => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
  // Inline editing props
  editingCell?: { rowId: string; field: string } | null
  editingValue?: string
  onCellClick?: (rowId: string, field: string, currentValue: unknown) => void
  onCellSave?: (rowId: string, field: string, value: string) => void
  onCellCancel?: () => void
  onEditingValueChange?: (value: string) => void
  // Column action props
  onColumnSort?: (field: string, direction: 'asc' | 'desc') => void
  onManageColumns?: () => void
  // Column drag and drop props
  draggedColumn?: string | null
  onColumnDragStart?: (field: string) => void
  onColumnDragOver?: (e: React.DragEvent) => void
  onColumnDrop?: (targetField: string) => void
  onColumnDragEnd?: () => void
}

// New filter interface for embedded DataGrid filtering
export interface DataGridFilter {
  label: string
  value: string | { start: Date | null; end: Date | null }
  options?: DropdownOption[]
  onChange:
    | ((value: { value: string } | null) => void)
    | ((value: { start: Date | null; end: Date | null }) => void)
    | ((date: Date | null) => void)
  placeholder?: string
  width?: string
  type?: 'dropdown' | 'date' | 'daterange'
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
  glyph?: string
}

export interface DatagridProps {
  columns: ColumnDef[]
  rows: RowData[]
  buttons?: ButtonProps[]
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

  // For capturing column resize events
  onColumnResize?: (columnField: string, newWidth: number) => void

  // Optional embedded filters that appear between toolbar and table
  filters?: DataGridFilter[]

  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles

  metrics?: MetricCardData[]
}

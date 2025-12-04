'use client'

import React from 'react'
import type { ButtonProps } from '../../Button'
import type { DropdownProps } from '../../Field/Dropdown/Regular'
import type { SearchbarProps } from '../../Field/Search'
import type { DropdownOption } from '../../Field/Dropdown/SearchableSimple'
import type { DataGridStyles } from '../../../theme'

// Base field types supported by EditableCell and CompositeEdit
export type FieldType =
  // All existing EditableCell types
  | 'text'
  | 'date'
  | 'monthYear'
  | 'time'
  | 'currency'
  | 'usd'
  | 'dropdown'
  | 'searchableDropdown'
  | 'multiselect'
  | 'internalIncrement'
  | 'phoneNumber'
  | 'cvv'
  | 'creditCardNumber'
  | 'accountNumber'
  | 'routingNumber'
  | 'ipAddress'
  | 'subnet'
  | 'vlan'
  | 'cidr'
  | 'supernet'
  | 'macAddress'
  // NEW: ComplexTextEditor simple variant
  | 'simpleeditor'

// Composite field configuration for multi-field editing in modal popups
export interface CompositeFieldConfig {
  field: string // The actual data field name (e.g., 'name', 'description')
  label: string // Display label in modal
  type: FieldType

  required?: boolean
  placeholder?: string
  helperText?: string
  validation?: (value: any) => string | undefined

  // Field-specific configurations (inherited from EditableCell)
  options?: Array<{
    value: string
    _id?: string
  }>

  // For numeric fields
  min?: number
  max?: number
  step?: number

  // For simpleeditor field
  minRows?: number

  // For IPAM fields
  subnetAddress?: string
  subnetCIDR?: number
  supernetAddress?: string
  supernetMask?: string | number
  reservedVLANs?: number[]
  maskType?: 'subnet' | 'supernet'
  showSubnetInfo?: boolean
  allowIncomplete?: boolean
  autoInsertDots?: boolean
  isGateway?: boolean
  isRange?: boolean
  isStartIP?: boolean
  isEndIP?: boolean

  defaultValue?: any
}

export interface ColumnDef {
  field: string
  headerName: string
  computedWidth?: number
  headerText?: string
  index?: number
  width?: number
  resizable?: boolean
  editable?: boolean // Optional property to control if column is editable
  // Column type for formatting OR composite field configuration
  // If string: single field inline editing
  // If CompositeFieldConfig[]: multi-field modal editing
  type?:
    | 'currency'
    | 'credit_card'
    | 'expiration_date'
    | 'account_number'
    | 'routing_number'
    | 'dropdown'
    | 'date'
    | 'ipAddress'
    | 'subnet'
    | 'vlan'
    | 'cidr'
    | 'supernet'
    | 'macAddress'
    | 'default'
    | CompositeFieldConfig[] // NEW: Array triggers composite editing
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
  dropdownOptions?: Array<{
    value: string | number
    _id?: string
  }>

  renderCell?: (params: {
    row: RowData
    value: unknown
    field: string
    rowIndex: number
    columnIndex: number
  }) => React.ReactNode

  // Row creation field configuration
  creationField?: {
    type:
      | 'text'
      | 'date'
      | 'monthYear'
      | 'time'
      | 'currency'
      | 'usd'
      | 'dropdown'
      | 'searchableDropdown'
      | 'multiselect'
      | 'internalIncrement'
      | 'phoneNumber'
      | 'cvv'
      | 'creditCardNumber'
      | 'accountNumber'
      | 'routingNumber'
      | 'ipAddress'
      | 'subnet'
      | 'vlan'
      | 'cidr'
      | 'supernet'
      | 'macAddress'
      | 'simpleeditor'
    required?: boolean
    placeholder?: string
    options?: Array<{
      value: string
      _id?: string
    }>
    defaultValue?: string | string[] | Date | null
    helperText?: string
    validation?: (value: any) => string | undefined
    // For numeric fields
    min?: number
    max?: number
    step?: number
    // For IPAM fields
    subnetAddress?: string
    subnetCIDR?: number
    supernetAddress?: string
    supernetMask?: string | number
    reservedVLANs?: number[]
    maskType?: 'subnet' | 'supernet'
    showSubnetInfo?: boolean
    allowIncomplete?: boolean
    autoInsertDots?: boolean
    isGateway?: boolean
    isRange?: boolean
    isStartIP?: boolean
    isEndIP?: boolean
  }
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

  // Composite editing props
  compositeEditingRow?: string | null
  onCompositeEditStart?: (rowId: string, column: ColumnDef) => void
  onCompositeFieldSave?: (
    rowId: string,
    fieldUpdates: Record<string, any>
  ) => void
  onCompositeEditCancel?: () => void
  // Row creation props
  isCreatingRow?: boolean
  creationRowData?: Record<string, any>
  onCreationFieldChange?: (field: string, value: any) => void
  onCreateRowSave?: () => void
  onCreateRowCancel?: () => void
  creationRowPosition?: 'top' | 'bottom'
  // Column action props
  onColumnSort?: (field: string, direction: 'asc' | 'desc') => void
  onManageColumns?: () => void
  // Column drag and drop props
  draggedColumn?: string | null
  onColumnDragStart?: (field: string) => void
  onColumnDragOver?: (e: React.DragEvent) => void
  onColumnDrop?: (targetField: string) => void
  onColumnDragEnd?: () => void
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
}

// New filter interface for embedded DataGrid filtering
export interface DataGridFilter {
  label: string
  value: string | { start: Date | null; end: Date | null }
  options?: DropdownOption[]
  onChange:
    | ((value: DropdownOption | null) => void)
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

  // Permissions control - determines read/write access
  permissions: {
    access: 'no-access' | 'read' | 'write'
  }

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

  // Optional callback for inline editing saves
  onCellSave?: (
    rowId: string,
    field: string,
    value: any
  ) => void | Promise<void>

  // Optional callback for composite field editing saves
  onCompositeFieldSave?: (
    rowId: string,
    fieldUpdates: Record<string, any>
  ) => void | Promise<void>

  // Optional callback for inline row creation
  onRowCreation?: (rowData: Record<string, any>) => void | Promise<void>

  // Row creation configuration
  allowRowCreation?: boolean
  creationRowPosition?: 'top' | 'bottom'

  // Optional embedded filters that appear between toolbar and table
  filters?: DataGridFilter[]

  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles

  metrics?: MetricCardData[]
  /** Force the metrics section to be collapsible regardless of screen size */
  metricsCollapsible?: boolean
  /** Default expanded state for metrics when collapsible is true */
  metricsDefaultExpanded?: boolean
  /** Make the filter section collapsible */
  filtersCollapsible?: boolean
  /** Default expanded state for filters when collapsible is true */
  filtersDefaultExpanded?: boolean

  /** Optional callback for PDF export - receives columns and rows */
  onExportPdf?: (columns: ColumnDef[], rows: RowData[]) => void
}

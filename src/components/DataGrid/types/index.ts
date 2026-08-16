/**
 * =============================================================================
 * DATAGRID TYPE DEFINITIONS
 * =============================================================================
 *
 * This file contains all TypeScript interfaces and types used throughout the
 * DataGrid component system. The DataGrid is a comprehensive data table solution
 * with the following capabilities:
 *
 * ARCHITECTURE OVERVIEW:
 * ----------------------
 * The DataGrid follows a hierarchical component structure:
 *
 *   DataGrid (index.tsx)                    <- Main orchestrator, manages all state
 *     ├── MetricSection                     <- Optional KPI cards above the grid
 *     │     └── MetricCard[]                <- Individual metric display cards
 *     ├── FilterSection                     <- Search bar + optional dropdown/date filters
 *     ├── Toolbar                           <- Action buttons + ManageRow CRUD controls
 *     │     └── ManageRow                   <- Add/Edit/Delete/Duplicate row actions
 *     ├── Table                             <- Main table container with resize logic
 *     │     ├── ColumnHeaderRow             <- Column headers with sort/drag/resize
 *     │     ├── CreationRow (optional)      <- Inline row creation form
 *     │     └── Rows                        <- Data rows with inline editing support
 *     │           └── EditableCell          <- Cell editing based on field type
 *     ├── Footer                            <- Pagination + export controls
 *     └── MobileCardView                    <- Responsive card layout for mobile
 *
 * KEY CONCEPTS:
 * -------------
 * 1. COLUMNS (ColumnDef): Define the schema - field names, headers, types, formatting
 * 2. ROWS (RowData): The actual data, identified by 'id' or '_id' field
 * 3. PERMISSIONS: Control read/write access to the grid
 * 4. INLINE EDITING: Click selected rows to edit cells in-place
 * 5. COMPOSITE EDITING: Multi-field modal editing for complex data entry
 * 6. THEMING: Supports 'sacred' (dark/gold) and 'light' themes
 *
 * DATA FLOW:
 * ----------
 * 1. Parent passes `columns` and `rows` to DataGrid
 * 2. DataGrid maintains internal state for filtering, sorting, pagination
 * 3. User interactions trigger callbacks (onCellSave, onRowCreation, etc.)
 * 4. Parent updates data, passes new rows back to DataGrid
 *
 * =============================================================================
 */

'use client'

import React from 'react'
import type { ButtonProps } from '../../Button'
import type { DropdownProps } from '../../Field/Dropdown/Regular'
import type { SearchbarProps } from '../../Field/Search'
import type { DropdownOption } from '../../Field/Dropdown/SearchableSimple'

/**
 * =============================================================================
 * DATAGRID STYLE TYPES (relocated from the old JS theme system)
 * =============================================================================
 *
 * These interfaces used to live in `src/theme/datagrid.ts` alongside the
 * `getDataGridStyles()` / `getDataGridTheme()` JS style generators. Visual
 * styling now lives entirely in `DataGrid.module.css` (data-theme attribute +
 * CSS custom properties), so the JS generators are gone — only the prop-shape
 * contract callers rely on (`DataGridStyles`) remains. It now lives here, next
 * to the component that owns it, so no DataGrid source has to reach back into
 * `theme/`. The theme file keeps its own copies until the teardown phase
 * verifies zero remaining importers and deletes them.
 */

/**
 * Internal theme shape describing every styleable region of the grid. Retained
 * as a type for any consumer that historically imported it; the actual values
 * are now expressed as CSS custom properties in `DataGrid.module.css`.
 */
export interface DataGridTheme {
  container: {
    position: string
    display: string
    flexDirection: string
    width: string
    backgroundColor: string
    backdropFilter?: string
    border?: string
    borderRadius?: string
    animation?: string
    padding?: string
  }
  contentWrapper: {
    display: string
    flexDirection: string
    width: string
    backgroundColor: string
    borderRadius: string
    border: string
    overflow: string
    boxShadow: string
  }
  error: {
    marginBottom: string
    padding: string
    borderWidth: string
    borderRadius: string
    backgroundColor: string
    color: string
    borderColor: string
  }
  tableContainer: {
    width: string
    display: string
    flexDirection: string
    alignItems: string
    position: string
    margin: string
    padding: string
  }
  table: {
    tableContainer: {
      width: string
      overflowX: string
      minWidth?: string
      borderRadius?: string
      overflow?: string
      border?: string
      backgroundColor?: string
    }
    tableWrapper: {
      overflowX: string
      width: string
      minWidth?: string
    }
    table: {
      width: string
      minWidth: string
      tableLayout: string
      backgroundColor?: string
      border?: string
      borderCollapse?: string
    }
    tableHeader: {
      backgroundColor: string
      borderBottom: string
      color: string
      fontWeight: string
    }
    tableRow: {
      borderBottom: string
      backgroundColor?: string
    }
    tableRowAlternate: {
      backgroundColor: string
    }
    tableRowHover: {
      backgroundColor: string
    }
    tableCell: {
      padding: string
      borderRight?: string
      borderBottom?: string
      verticalAlign: string
      color: string
    }
    tableHeaderCell: {
      padding: string
      borderRight?: string
      borderBottom?: string
      verticalAlign: string
      fontWeight: string
      textAlign: string
      color: string
    }
  }
  scrollbar: {
    height: string
    width: string
    track: {
      backgroundColor: string
      borderRadius: string
    }
    thumb: {
      backgroundColor: string
      borderRadius: string
      border?: string
    }
    thumbHover: {
      backgroundColor: string
    }
  }
  sectionDivider: {
    height: string
    backgroundColor: string
    opacity: number
  }
  footerContainer: {
    display: string
    justifyContent: string
    gap: string
    marginTop: string
    opacity: number
  }
  footerGlyph: {
    color: string
    fontSize: string
    animation: string
  }
  glyph: {
    position: string
    fontSize: string
    color: string
    zIndex: number
    animation: string
  }
  transition: string
}

/**
 * Caller-supplied styling options for the DataGrid. The only field the CSS
 * module consumes directly is `theme` (mapped onto the root `data-theme`
 * attribute); the remaining fields are caller overrides applied as inline
 * dynamic styles / CSS custom properties where still wired.
 */
export interface DataGridStyles {
  // Theme selection
  /** Theme variant: 'light', 'dark', or 'sacred' (default). Propagated to every DataGrid subcomponent. */
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  backgroundColor?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  borderColor?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  borderRadius?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  borderWidth?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  backdropFilter?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  animation?: string

  // Error states
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  errorBackgroundColor?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  errorColor?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  errorBorderColor?: string

  // Layout
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  width?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  height?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  maxWidth?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  minWidth?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  maxHeight?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  minHeight?: string

  // Spacing
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  padding?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  margin?: string

  // Transitions
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  transitionDuration?: string
  /** @deprecated No-op since the CSS-module migration — scheduled for removal. */
  transitionEasing?: string
}

/**
 * FIELD TYPES
 * -----------
 * Defines all supported input field types for inline editing and row creation.
 * These types determine how the EditableCell component renders the input.
 *
 * Categories:
 * - Basic: text, date, time, currency
 * - Financial: usd, creditCardNumber, cvv, accountNumber, routingNumber
 * - Network/IPAM: ipAddress, subnet, vlan, cidr, supernet, macAddress
 * - Selection: dropdown, searchableDropdown, multiselect
 * - Special: internalIncrement (auto-incrementing), simpleeditor (rich text)
 */
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
  // Rich text editor using ComplexTextEditor in simple mode
  | 'simpleeditor'

/**
 * COMPOSITE FIELD CONFIGURATION
 * -----------------------------
 * Used for multi-field modal editing. When a column's `type` is an array of
 * CompositeFieldConfig objects, clicking that cell opens a modal where users
 * can edit multiple related fields at once.
 *
 * Example use case: A "Contact Info" cell that opens a modal with
 * fields for name, email, phone, and address.
 *
 * @example
 * const contactColumn: ColumnDef = {
 *   field: 'contact',
 *   headerName: 'Contact',
 *   type: [
 *     { field: 'name', label: 'Full Name', type: 'text', required: true },
 *     { field: 'email', label: 'Email', type: 'text' },
 *     { field: 'phone', label: 'Phone', type: 'phoneNumber' }
 *   ]
 * }
 */
export interface CompositeFieldConfig {
  /** The data field name in the row object (e.g., 'firstName', 'email') */
  field: string
  /** Human-readable label displayed in the modal form */
  label: string
  /** Input type determining the editor component used */
  type: FieldType

  /** If true, field must have a value before saving */
  required?: boolean
  /** Placeholder text shown when field is empty */
  placeholder?: string
  /** Descriptive text shown below the input */
  helperText?: string
  /** Custom validation function - return error message string or undefined if valid */
  validation?: (value: any) => string | undefined

  /**
   * Options for dropdown/select fields.
   * Each option needs at minimum a 'value' property for display.
   * The '_id' is used as the actual stored value if present.
   */
  options?: Array<{
    value: string
    _id?: string
  }>

  // ─────────────────────────────────────────────────────────────────────────────
  // NUMERIC FIELD CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────
  /** Minimum allowed value for numeric inputs */
  min?: number
  /** Maximum allowed value for numeric inputs */
  max?: number
  /** Increment step for numeric inputs */
  step?: number

  // ─────────────────────────────────────────────────────────────────────────────
  // RICH TEXT EDITOR CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────
  /** Minimum number of visible rows for simpleeditor textarea */
  minRows?: number

  // ─────────────────────────────────────────────────────────────────────────────
  // IPAM (IP ADDRESS MANAGEMENT) FIELD CONFIGURATION
  // These settings are used for network-related field types like ipAddress,
  // subnet, vlan, cidr, supernet, and macAddress.
  // ─────────────────────────────────────────────────────────────────────────────
  /** Parent subnet address for IP validation (e.g., '192.168.1.0') */
  subnetAddress?: string
  /** Parent subnet CIDR notation (e.g., 24 for /24 network) */
  subnetCIDR?: number
  /** Supernet address for hierarchical network validation */
  supernetAddress?: string
  /** Supernet mask as string or number */
  supernetMask?: string | number
  /** Array of VLAN IDs that cannot be selected */
  reservedVLANs?: number[]
  /** Whether this field represents a subnet or supernet mask */
  maskType?: 'subnet' | 'supernet'
  /** Display calculated subnet info (host count, broadcast address, etc.) */
  showSubnetInfo?: boolean
  /** Allow partial/incomplete IP addresses while typing */
  allowIncomplete?: boolean
  /** Auto-insert dots after each octet while typing */
  autoInsertDots?: boolean
  /** Mark this IP as a gateway address */
  isGateway?: boolean
  /** This field defines an IP range */
  isRange?: boolean
  /** This is the start IP of a range */
  isStartIP?: boolean
  /** This is the end IP of a range */
  isEndIP?: boolean

  /** Default value to pre-populate when creating new rows */
  defaultValue?: any
}

/**
 * COLUMN DEFINITION
 * -----------------
 * Defines the structure and behavior of each column in the DataGrid.
 * This is the primary configuration object for customizing how data is displayed.
 *
 * REQUIRED PROPERTIES:
 * - field: Maps to the key in your row data objects
 * - headerName: The text displayed in the column header
 *
 * KEY FEATURES:
 * - Formatting: Automatic formatting for currency, credit cards, dates, etc.
 * - Editing: Inline editing with various input types
 * - Custom Rendering: Use renderCell for complete control over cell display
 * - Composite Fields: Open a modal with multiple fields for complex data
 *
 * @example Basic column
 * const columns: ColumnDef[] = [
 *   { field: 'name', headerName: 'Name' },
 *   { field: 'price', headerName: 'Price', type: 'currency' }
 * ]
 *
 * @example With custom rendering
 * {
 *   field: 'status',
 *   headerName: 'Status',
 *   renderCell: ({ value }) => <StatusBadge status={value} />
 * }
 */
export interface ColumnDef<TRow extends RowData = RowData> {
  /** Unique field name matching the key in row data objects */
  field: string
  /** Display text shown in the column header */
  headerName: string
  /** Internally computed width after resize operations */
  computedWidth?: number
  /** Alternative header text (rarely used) */
  headerText?: string
  /** Column position index */
  index?: number
  /** Initial width in pixels */
  width?: number
  /**
   * Narrowest this column may be resized to, in pixels. Default:
   * `MIN_COLUMN_WIDTH` (50). Enforced by BOTH resize paths (drag and Arrow
   * keys) and published as the resize separator's `aria-valuemin`.
   */
  minWidth?: number
  /**
   * Widest this column may be resized to, in pixels. Default:
   * `DEFAULT_MAX_COLUMN_WIDTH` (1200). Enforced by BOTH resize paths and
   * published as the resize separator's `aria-valuemax`. A column that arrives
   * already wider than this keeps its width — see `resolveColumnResizeBounds`.
   */
  maxWidth?: number
  /** Whether column can be resized by dragging. Default: true */
  resizable?: boolean
  /** Whether cells in this column can be edited. Default: true */
  editable?: boolean
  /**
   * COLUMN TYPE - Controls formatting and editing behavior
   *
   * When set to a string type:
   *   - Determines how values are formatted for display
   *   - Controls which editor appears during inline editing
   *
   * When set to CompositeFieldConfig[]:
   *   - Clicking the cell opens a modal dialog
   *   - Modal contains multiple fields defined in the array
   *   - Useful for editing related data together (e.g., address fields)
   */
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
    | CompositeFieldConfig[] // Array of fields opens modal for multi-field editing

  /**
   * Options for dropdown editing.
   * Used when type is 'dropdown' or for inline dropdown editing.
   */
  dropdownOptions?: Array<{
    value: string | number
    _id?: string
  }>

  /**
   * CUSTOM CELL RENDERER
   * --------------------
   * Complete control over how the cell displays its content.
   * Return any React node to customize the appearance.
   *
   * NOTE: This only affects display. For editing, use creationField.
   *
   * @example
   * renderCell: ({ value, row }) => (
   *   <div style={{ color: row.status === 'active' ? 'green' : 'red' }}>
   *     {value}
   *   </div>
   * )
   */
  renderCell?: (params: {
    row: TRow
    value: unknown
    field: string
    rowIndex: number
    columnIndex: number
  }) => React.ReactNode

  /**
   * ROW CREATION FIELD CONFIGURATION
   * --------------------------------
   * Defines how this field appears and behaves in the row creation form.
   * When onRowCreation callback is provided to DataGrid, clicking "Add"
   * shows a creation row where each column with creationField config
   * renders the appropriate input.
   *
   * @example
   * {
   *   field: 'email',
   *   headerName: 'Email',
   *   creationField: {
   *     type: 'text',
   *     required: true,
   *     placeholder: 'user@example.com',
   *     validation: (v) => v.includes('@') ? undefined : 'Invalid email'
   *   }
   * }
   */
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

/**
 * ROW DATA STRUCTURE
 * ------------------
 * Generic interface for row data objects. Each row must have a unique identifier
 * via either `id` or `_id` (MongoDB convention). All other fields are dynamic
 * and should match your column field definitions.
 *
 * IMPORTANT: The DataGrid uses `getRowId()` helper which checks _id first, then id.
 * Always ensure your rows have one of these identifier fields.
 *
 * @example
 * const rows: RowData[] = [
 *   { _id: '507f1f77bcf86cd799439011', name: 'John', email: 'john@example.com' },
 *   { id: '2', name: 'Jane', email: 'jane@example.com' }
 * ]
 */
export interface RowData {
  /** MongoDB-style identifier (preferred) */
  _id?: string
  /** Standard identifier */
  id?: string
  /** Dynamic fields matching column definitions */
  [key: string]: unknown
}

/**
 * TABLE COMPONENT PROPS
 * ---------------------
 * Internal props for the Table component. These are passed from the main
 * DataGrid component and include all state and handlers for the table display.
 *
 * Most consumers won't use this directly - it's for internal communication
 * between DataGrid and its Table child.
 */
export interface TableProps {
  /** Column definitions array */
  columns: ColumnDef[]
  /** Row data to display (already paginated by parent) */
  rows: RowData[]
  /** Called when a row is clicked for selection */
  onRowClick?: (row: RowData) => void
  /** Array of currently selected row IDs */
  selectedRowIds?: string[]
  /** Called when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void
  /** True if all rows are selected (for header checkbox) */
  allRowsSelected?: boolean
  /** True if some but not all rows are selected (for indeterminate state) */
  someRowsSelected?: boolean
  /** Handler for header checkbox changes (select all/none) */
  onHeaderCheckboxChange: React.ChangeEventHandler<HTMLInputElement>
  /** Called when a column is resized via drag */
  onColumnResize?: (columnField: string, newWidth: number) => void
  /** Theme and style configuration */
  styles?: DataGridStyles

  // ─────────────────────────────────────────────────────────────────────────────
  // INLINE EDITING PROPS
  // Managed by DataGrid parent, passed to Table for cell editing
  // ─────────────────────────────────────────────────────────────────────────────
  /** Currently editing cell coordinates, or null if not editing */
  editingCell?: { rowId: string; field: string } | null
  /** Current value in the editing input */
  editingValue?: string
  /** Called when user clicks a cell to start editing */
  onCellClick?: (rowId: string, field: string, currentValue: unknown) => void
  /** Called when user saves an edited cell value */
  onCellSave?: (rowId: string, field: string, value: string) => void
  /** Called when user cancels cell editing */
  onCellCancel?: () => void
  /** Called as user types in the editing input */
  onEditingValueChange?: (value: string) => void

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPOSITE EDITING PROPS
  // For multi-field modal editing when column type is CompositeFieldConfig[]
  // ─────────────────────────────────────────────────────────────────────────────
  /** Row ID currently being edited in composite modal */
  compositeEditingRow?: string | null
  /** Called when user opens composite edit modal */
  onCompositeEditStart?: (rowId: string, column: ColumnDef) => void
  /** Called when user saves all fields in composite modal */
  onCompositeFieldSave?: (
    rowId: string,
    fieldUpdates: Record<string, any>
  ) => void
  /** Called when user cancels composite editing */
  onCompositeEditCancel?: () => void

  // ─────────────────────────────────────────────────────────────────────────────
  // COLUMN ACTION PROPS
  // ─────────────────────────────────────────────────────────────────────────────
  /** Called when user sorts a column */
  onColumnSort?: (field: string, direction: 'asc' | 'desc') => void
  /** Field the grid is currently sorted by (drives `aria-sort` on the header) */
  sortField?: string | null
  /** Current sort direction for `sortField` */
  sortDirection?: 'asc' | 'desc'
  /** Called when user opens column management modal */
  onManageColumns?: () => void
  /**
   * Keyboard-operable column reorder (WCAG 2.1.1). Moves a column one position
   * left/right among the visible columns; wired to the column-actions menu so
   * reordering works without drag-and-drop.
   */
  onColumnMove?: (field: string, direction: 'left' | 'right') => void

  // ─────────────────────────────────────────────────────────────────────────────
  // GRID SEMANTICS (a11y — relocated from the DataGrid root wrapper)
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * Total row count across all pages — emitted as `aria-rowcount` on the real
   * `<table role="grid">` (only the current page's rows are in the DOM).
   */
  gridRowCount?: number
  /**
   * Total column count including the leading selection column — emitted as
   * `aria-colcount` on the `<table role="grid">`.
   */
  gridColCount?: number
  /**
   * 0-based absolute index of the first rendered row within the full filtered
   * result set (i.e. `page * pageSize`). Only the current page's rows are in
   * the DOM, so each data `<tr>` derives its `aria-rowindex` from this offset
   * (header row is index 1, so a data row's index is `offset + localIndex + 2`)
   * — required whenever `aria-rowcount` is set and not all rows are present
   * (WCAG 1.3.1). Defaults to 0.
   */
  rowIndexOffset?: number

  // ─────────────────────────────────────────────────────────────────────────────
  // COLUMN DRAG AND DROP PROPS
  // For reordering columns by dragging headers
  // ─────────────────────────────────────────────────────────────────────────────
  /** Field name of column currently being dragged */
  draggedColumn?: string | null
  /** Called when drag starts on a column header */
  onColumnDragStart?: (field: string) => void
  /** Called during drag over another column */
  onColumnDragOver?: (e: React.DragEvent) => void
  /** Called when column is dropped on a new position */
  onColumnDrop?: (targetField: string) => void
  /** Called when drag operation ends */
  onColumnDragEnd?: () => void

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW CREATION PROPS
  // For inline row creation form
  // ─────────────────────────────────────────────────────────────────────────────
  /** True when creation row form is visible */
  isCreatingRow?: boolean
  /** Current values in creation form fields */
  creationRowData?: Record<string, unknown>
  /** Called when a creation field value changes */
  onCreationFieldChange?: (field: string, value: unknown) => void
  /** Called when user submits the new row */
  onCreateRowSave?: () => void
  /** Called when user cancels row creation */
  onCreateRowCancel?: () => void
  /** Where to show creation row: 'top' or 'bottom' of table */
  creationRowPosition?: 'top' | 'bottom'

  // ─────────────────────────────────────────────────────────────────────────────
  // PERMISSIONS
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * Access level controlling what operations are allowed:
   * - 'no-access': Hide the grid entirely
   * - 'read': View only, no editing
   * - 'write': Full editing capabilities
   */
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
}

/**
 * DATAGRID FILTER CONFIGURATION
 * -----------------------------
 * Defines a filter control that appears in the FilterSection above the table.
 * Supports dropdown selects, single dates, and date ranges.
 *
 * The FilterSection always includes a search bar. Additional filters are
 * rendered based on this configuration.
 *
 * @example Dropdown filter
 * {
 *   label: 'Status',
 *   value: 'all',
 *   options: [{ value: 'all' }, { value: 'active' }, { value: 'inactive' }],
 *   onChange: (option) => setStatusFilter(option?.value || 'all'),
 *   type: 'dropdown'
 * }
 *
 * @example Date range filter
 * {
 *   label: 'Date Range',
 *   value: { start: null, end: null },
 *   onChange: (range) => setDateRange(range),
 *   type: 'daterange'
 * }
 */
export interface DataGridFilter {
  /** Label displayed above the filter input */
  label: string
  /**
   * Current filter value:
   * - string for dropdown (selected value)
   * - { start, end } for daterange
   */
  value: string | { start: Date | null; end: Date | null }
  /** Options array for dropdown filters */
  options?: DropdownOption[]
  /**
   * Change handler - signature varies by filter type:
   * - dropdown: receives DropdownOption | null
   * - daterange: receives { start: Date | null, end: Date | null }
   */
  onChange:
    | ((value: DropdownOption | null) => void)
    | ((value: { start: Date | null; end: Date | null }) => void)
  /** Placeholder text when no value selected */
  placeholder?: string
  /** CSS width value (e.g., '200px', '100%') */
  width?: string
  /**
   * Filter input type. Default: 'dropdown'. The previous singular
   * `'date'` was dropped 2026-05-22 (no callsite used it; consumers
   * needing a singular date filter should pass a `'daterange'` with
   * `end === null` instead).
   */
  type?: 'dropdown' | 'daterange'
}

/**
 * METRIC CARD DATA
 * ----------------
 * Data structure for KPI/metric cards displayed in the MetricSection.
 * These cards show key statistics above the data table.
 *
 * @example
 * {
 *   title: 'Total Revenue',
 *   value: '$125,000',
 *   subtitle: 'This quarter',
 *   trend: { value: 12.5, isPositive: true }
 * }
 */
// MetricCardData was relocated to `components/Metric/types.ts` on 2026-05-22
// since the audience is broader than DataGrid. Re-exported here for callers
// that imported from DataGrid/types historically.
import type { MetricCardData } from '../../Metric/types'
export type { MetricCardData } from '../../Metric/types'

/**
 * =============================================================================
 * DATAGRID MAIN PROPS
 * =============================================================================
 *
 * Primary configuration interface for the DataGrid component.
 * This is what consumers pass to <DataGrid {...props} />
 *
 * MINIMAL EXAMPLE:
 * ```tsx
 * <DataGrid
 *   columns={[
 *     { field: 'name', headerName: 'Name' },
 *     { field: 'email', headerName: 'Email' }
 *   ]}
 *   rows={[
 *     { _id: '1', name: 'John', email: 'john@example.com' }
 *   ]}
 *   permissions={{ access: 'write' }}
 * />
 * ```
 *
 * FULL-FEATURED EXAMPLE:
 * ```tsx
 * <DataGrid
 *   columns={columns}
 *   rows={data}
 *   permissions={{ access: 'write' }}
 *   metrics={kpiCards}
 *   filters={filterConfig}
 *   buttons={[{ text: 'Export', onClick: handleExport }]}
 *   onCellSave={handleCellUpdate}
 *   onRowCreation={handleCreateRow}
 *   onDelete={handleBulkDelete}
 *   styles={{ theme: 'sacred' }}
 * />
 * ```
 */
export interface DatagridProps<TRow extends RowData = RowData> {
  // ─────────────────────────────────────────────────────────────────────────────
  // REQUIRED PROPS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Column definitions - defines the schema of your data table.
   * Generic over the row type: pass `ColumnDef<MyRow>[]` (or render the grid as
   * `<DataGrid<MyRow> …>`) and every column's `renderCell({ row })` is typed as
   * `MyRow` — no `as unknown as` downcast needed. Defaults to `RowData` so all
   * existing untyped usages compile unchanged.
   */
  columns: ColumnDef<TRow>[]

  /** Row data array - each object should have _id or id plus field values */
  rows: RowData[]

  /**
   * TEST SELECTOR — emitted as `data-datagrid="<value>"` on the root
   * element of the grid. Lets Playwright tests target a specific
   * grid on a page that has multiple (e.g. "products" + "categories"
   * tabs each with their own grid):
   *
   *   page.locator('[data-datagrid="products"] [data-row-id="…"]')
   *
   * Optional. When omitted no `data-datagrid` attribute is rendered.
   * Pair with the row/cell/action attributes the grid emits
   * automatically (see Rows, EditableCell, ManageRow, CreationRow,
   * ColumnHeaderRow, Footer, FilterSection, CompositeFieldEditModal,
   * MobileCardView/Card + AddCard) to build deterministic CRUD tests
   * without depending on icon SVGs or label text.
   */
  dataGrid?: string

  /**
   * Access control for the grid.
   * - 'no-access': Hides the entire grid
   * - 'read': View-only mode, editing disabled
   * - 'write': Full editing capabilities enabled
   */
  permissions: {
    access: 'no-access' | 'read' | 'write'
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TOOLBAR CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /** Custom buttons to display in the toolbar (left side) */
  buttons?: ButtonProps[]

  /** Custom dropdowns in toolbar (rarely used - prefer filters) */
  dropdowns?: DropdownProps[]

  /** Custom searchbar props (rarely used - FilterSection handles search) */
  searchbarProps?: SearchbarProps

  // ─────────────────────────────────────────────────────────────────────────────
  // DISPLAY OPTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /** Error to display instead of table content */
  error?: Error | null

  /** Show id/_id columns. Default: false (hidden for cleaner UI) */
  showIdColumns?: boolean

  /**
   * Theme and comprehensive styling options.
   * Supports 'sacred' (dark/gold theme) and 'light' themes.
   */
  styles?: DataGridStyles

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW ACTION CALLBACKS
  // These are triggered from ManageRow buttons in the toolbar.
  // All receive array of selected row IDs.
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Called when "Manage" action is triggered on selected rows.
   * Use for opening a detailed edit view/modal.
   */
  onManage?: (selectedRows: string[]) => void

  /**
   * Called when "Show" action is triggered.
   * Use for opening a read-only detail view.
   */
  onShow?: (selectedRows: string[]) => void

  /**
   * Called when "Duplicate" action is triggered.
   * Implementation should clone the selected rows.
   */
  onDuplicate?: (selectedRows: string[]) => void

  /**
   * Called when "Delete" action is triggered.
   * Implementation should delete the selected rows.
   */
  onDelete?: (selectedRows: string[]) => void

  /**
   * Called whenever row selection changes.
   * Useful for external state synchronization.
   */
  onSelectionChange?: (selectedRows: string[]) => void

  // ─────────────────────────────────────────────────────────────────────────────
  // INLINE EDITING CALLBACKS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Called when a cell value is saved during inline editing.
   * Implementation should persist the change to your data source.
   *
   * @param rowId - The _id or id of the row being edited
   * @param field - The column field name being edited
   * @param value - The new value (type depends on column type)
   */
  onCellSave?: (
    rowId: string,
    field: string,
    value: any
  ) => void | Promise<void>

  /**
   * Called when composite field modal is saved.
   * Receives all field updates at once.
   *
   * @param rowId - The _id or id of the row being edited
   * @param fieldUpdates - Object with field:value pairs for all changed fields
   */
  onCompositeFieldSave?: (
    rowId: string,
    fieldUpdates: Record<string, any>
  ) => void | Promise<void>

  /**
   * When provided, enables row creation.
   * - "Add" button appears in ManageRow toolbar
   * - Clicking Add shows inline creation row
   * - Called with form data when user submits
   *
   * @param rowData - Object with field:value pairs from creation form
   */
  onRowCreation?: (rowData: Record<string, unknown>) => void | Promise<void>

  /** Called when a column is resized by dragging */
  onColumnResize?: (columnField: string, newWidth: number) => void

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTER CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Filter controls displayed in FilterSection.
   * Note: A search bar is always included automatically.
   * These are additional dropdown/date filters.
   */
  filters?: DataGridFilter[]

  /** Make the filter section collapsible (shows as accordion) */
  filtersCollapsible?: boolean

  /** If collapsible, whether to start expanded. Default: false */
  filtersDefaultExpanded?: boolean

  // ─────────────────────────────────────────────────────────────────────────────
  // METRICS CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────

  /** KPI/metric cards to display above the table */
  metrics?: MetricCardData[]

  /** Make the metrics section collapsible (shows as accordion) */
  metricsCollapsible?: boolean

  /** If collapsible, whether to start expanded. Default: false */
  metricsDefaultExpanded?: boolean

  // ─────────────────────────────────────────────────────────────────────────────
  // EXPORT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Custom PDF export handler. If not provided, uses default html2canvas/jsPDF export.
   * Called from Footer export button.
   */
  onExportPdf?: (columns: ColumnDef[], rows: RowData[]) => void
}

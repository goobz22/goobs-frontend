'use client'

import { useState, useCallback, useMemo } from 'react'
import Card from './Card'
import AddCard from './AddCard'
import Searchbar from '../../Field/Search'
import DataGridToolbar from '../Toolbar'
import type { ColumnDef, RowData } from '../types'
import type { ButtonProps } from '../../Button'
import cssStyles from '../DataGrid.module.css'

// Helper to check if column type is a composite field array
// Defined outside component to avoid dependency issues in useCallback
function isCompositeFieldArray(type: unknown): type is Array<{
  field: string
  label: string
  type: string
  defaultValue?: unknown
  required?: boolean
  validation?: (value: unknown) => string | undefined
}> {
  return Array.isArray(type)
}

interface MobileCardViewProps {
  columns: ColumnDef[]
  rows: RowData[]
  selectedRows: string[]
  onRowClick: (row: RowData) => void
  onCellSave?: (rowId: string, field: string, value: string) => void
  onRowCreation?: (rowData: Record<string, unknown>) => void | Promise<void>
  onManage?: (selectedRows: string[]) => void
  onDelete?: (selectedRows: string[]) => void
  onDuplicate?: (selectedRows: string[]) => void
  onShow?: (selectedRows: string[]) => void
  onSelectionChange?: (newSelectedIds: string[]) => void
  buttons?: ButtonProps[]
  styles?: {
    theme?: 'light' | 'dark' | 'sacred'
    backgroundColor?: string
    borderColor?: string
    borderRadius?: string
  }
  editingCell: { rowId: string; field: string } | null
  editingValue: string
  onCellClick: (rowId: string, field: string, currentValue: unknown) => void
  onCellCancel: () => void
  onEditingValueChange: (value: string) => void
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
}

function MobileCardView({
  columns,
  rows,
  selectedRows,
  onRowClick,
  onCellSave,
  onRowCreation,
  onManage,
  onDelete,
  onDuplicate,
  onShow,
  onSelectionChange,
  buttons,
  styles,
  editingCell,
  editingValue,
  onCellClick,
  onCellCancel,
  onEditingValueChange,
  permissions,
}: MobileCardViewProps) {
  const [searchQuery, setSearchQueryInternal] = useState('')
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(10) // Fixed items per page for mobile
  const [creationRowData, setCreationRowData] = useState<
    Record<string, unknown>
  >({})
  const [creationRowErrors, setCreationRowErrors] = useState<
    Record<string, string>
  >({})

  // Custom search handler that resets pagination when search changes
  const setSearchQuery = useCallback((newQuery: string) => {
    setSearchQueryInternal(newQuery)
    setCurrentPage(0) // Reset to first page when search changes
  }, [])

  const theme = styles?.theme || 'sacred'

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows

    const query = searchQuery.toLowerCase()
    return rows.filter(row => {
      return columns.some(col => {
        const value = row[col.field]
        if (value == null) return false
        return String(value).toLowerCase().includes(query)
      })
    })
  }, [rows, columns, searchQuery])

  // Pagination calculations
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage)

  const paginatedRows = useMemo(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return filteredRows.slice(start, end)
  }, [filteredRows, currentPage, itemsPerPage])

  // Handle long press for selection mode
  const handleLongPress = useCallback(
    (rowId: string) => {
      if (!selectionMode) {
        setSelectionMode(true)
        setShowActions(true)
      }
      // Toggle selection
      if (selectedRows.includes(rowId)) {
        onSelectionChange?.(selectedRows.filter(id => id !== rowId))
      } else {
        onSelectionChange?.([...selectedRows, rowId])
      }
    },
    [selectionMode, selectedRows, onSelectionChange]
  )

  // Handle tap in selection mode
  const handleCardTap = useCallback(
    (row: RowData) => {
      const rowId = String(row._id ?? row.id)
      if (selectionMode) {
        if (selectedRows.includes(rowId)) {
          onSelectionChange?.(selectedRows.filter(id => id !== rowId))
        } else {
          onSelectionChange?.([...selectedRows, rowId])
        }
      } else {
        onRowClick(row)
      }
    },
    [selectionMode, selectedRows, onSelectionChange, onRowClick]
  )

  // Exit selection mode
  const handleExitSelectionMode = useCallback(() => {
    setSelectionMode(false)
    setShowActions(false)
    onSelectionChange?.([])
  }, [onSelectionChange])

  // Action handlers
  const handleManage = useCallback(() => {
    onManage?.(selectedRows)
    handleExitSelectionMode()
  }, [selectedRows, onManage, handleExitSelectionMode])

  const handleDelete = useCallback(() => {
    onDelete?.(selectedRows)
    handleExitSelectionMode()
  }, [selectedRows, onDelete, handleExitSelectionMode])

  const handleDuplicate = useCallback(() => {
    onDuplicate?.(selectedRows)
    handleExitSelectionMode()
  }, [selectedRows, onDuplicate, handleExitSelectionMode])

  const handleShow = useCallback(() => {
    onShow?.(selectedRows)
    handleExitSelectionMode()
  }, [selectedRows, onShow, handleExitSelectionMode])

  // Handle starting row creation
  const handleStartRowCreation = useCallback(() => {
    // Initialize creation row data with default values
    const initialData: Record<string, unknown> = {}
    columns.forEach(col => {
      // Handle creationField columns
      if (col.creationField?.defaultValue !== undefined) {
        initialData[col.field] = col.creationField.defaultValue
      } else if (col.creationField) {
        initialData[col.field] = ''
      }
      // Handle composite field columns (type is an array)
      else if (isCompositeFieldArray(col.type)) {
        col.type.forEach(compositeField => {
          if (compositeField.defaultValue !== undefined) {
            initialData[compositeField.field] = compositeField.defaultValue
          } else {
            initialData[compositeField.field] = ''
          }
        })
      }
    })
    setCreationRowData(initialData)
    setCreationRowErrors({})
    setIsAddingCard(true)
  }, [columns])

  // Handle field change in creation row
  const handleCreationFieldChange = useCallback(
    (field: string, value: unknown) => {
      setCreationRowData(prev => ({
        ...prev,
        [field]: value,
      }))
      // Clear error for this field when it changes
      if (creationRowErrors[field]) {
        setCreationRowErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [creationRowErrors]
  )

  // Handle saving the creation row
  const handleCreateRowSave = useCallback(async () => {
    if (!onRowCreation) return

    // Validate required fields
    const errors: Record<string, string> = {}
    let hasErrors = false

    columns.forEach(col => {
      // Validate creationField columns
      if (col.creationField?.required) {
        const value = creationRowData[col.field]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[col.field] = `${col.headerName} is required`
          hasErrors = true
        }
      }

      // Run custom validation for creationField
      if (col.creationField?.validation) {
        const validationError = col.creationField.validation(
          creationRowData[col.field]
        )
        if (validationError) {
          errors[col.field] = validationError
          hasErrors = true
        }
      }

      // Validate composite field columns
      if (isCompositeFieldArray(col.type)) {
        col.type.forEach(
          (compositeField: {
            field: string
            label: string
            required?: boolean
            validation?: (value: unknown) => string | undefined
          }) => {
            if (compositeField.required) {
              const value = creationRowData[compositeField.field]
              if (
                !value ||
                (typeof value === 'string' && value.trim() === '')
              ) {
                errors[compositeField.field] =
                  `${compositeField.label} is required`
                hasErrors = true
              }
            }

            // Run custom validation for composite field
            if (compositeField.validation) {
              const validationError = compositeField.validation(
                creationRowData[compositeField.field]
              )
              if (validationError) {
                errors[compositeField.field] = validationError
                hasErrors = true
              }
            }
          }
        )
      }
    })

    if (hasErrors) {
      setCreationRowErrors(errors)
      return
    }

    try {
      await onRowCreation(creationRowData)
      setIsAddingCard(false)
      setCreationRowData({})
      setCreationRowErrors({})
    } catch (error) {
      console.error('Error creating row:', error)
    }
  }, [columns, creationRowData, onRowCreation])

  // Handle canceling creation
  const handleCreateRowCancel = useCallback(() => {
    setIsAddingCard(false)
    setCreationRowData({})
    setCreationRowErrors({})
  }, [])

  return (
    <div className={cssStyles.mobileContainer} data-theme={theme}>
      {/* Selection Mode Header */}
      {selectionMode && (
        <div className={cssStyles.selectionHeader}>
          <span>{selectedRows.length} selected</span>
          <button onClick={handleExitSelectionMode}>Cancel</button>
        </div>
      )}

      {/* Search Bar and Toolbar - sticky together on mobile */}
      {!selectionMode && (
        <div className={cssStyles.stickyToolbar}>
          <div className={cssStyles.mobileHeader}>
            <Searchbar
              value={searchQuery}
              onChange={value => setSearchQuery(value)}
              placeholder="Search..."
              styles={{
                theme: theme,
                width: '100%',
              }}
            />
          </div>
          <div className={cssStyles.mobileToolbar}>
            <DataGridToolbar
              {...(buttons !== undefined ? { buttons } : {})}
              {...(permissions !== undefined ? { permissions } : {})}
              manageRowProps={{
                selectedRows,
                rows,
                ...(onRowCreation && !isAddingCard
                  ? { onAdd: handleStartRowCreation }
                  : {}),
                ...(onDuplicate
                  ? { onDuplicate: () => onDuplicate(selectedRows) }
                  : {}),
                ...(onDelete
                  ? {
                      onDelete: () => {
                        onDelete(selectedRows)
                        onSelectionChange?.([])
                      },
                    }
                  : {}),
                ...(onManage ? { onManage: () => onManage(selectedRows) } : {}),
                ...(onShow ? { onShow: () => onShow(selectedRows) } : {}),
                handleClose: handleExitSelectionMode,
                permissions,
              }}
              styles={{
                theme: theme,
              }}
            />
          </div>
        </div>
      )}

      {/* Cards Container. Carries the grid semantics for the mobile view
          (a11y fix D3): each Card is a role="row", so its owner must be a
          grid/rowgroup — this used to be the shared outer wrapper, which also
          wrapped the desktop <table> and chrome and was therefore an invalid
          grid. aria-rowcount is the full filtered count (only a page is in the
          DOM). */}
      <div
        className={cssStyles.cardsContainer}
        role="grid"
        aria-label="Data grid (card view)"
        aria-rowcount={filteredRows.length}
        aria-colcount={columns.length}
      >
        {/* Add Card */}
        {isAddingCard && (
          <AddCard
            columns={columns}
            creationRowData={creationRowData}
            creationRowErrors={creationRowErrors}
            onCreationFieldChange={handleCreationFieldChange}
            onSave={handleCreateRowSave}
            onCancel={handleCreateRowCancel}
            {...(styles && { styles })}
          />
        )}

        {/* Data Cards - Use paginated rows */}
        {paginatedRows.map(row => {
          const rowId = String(row._id ?? row.id)
          return (
            <Card
              key={rowId}
              row={row}
              columns={columns}
              isSelected={selectedRows.includes(rowId)}
              selectionMode={selectionMode}
              onTap={() => handleCardTap(row)}
              onLongPress={() => handleLongPress(rowId)}
              editingCell={editingCell}
              editingValue={editingValue}
              onCellClick={onCellClick}
              {...(onCellSave && { onCellSave })}
              onCellCancel={onCellCancel}
              onEditingValueChange={onEditingValueChange}
              {...(styles && { styles })}
              permissions={permissions}
            />
          )
        })}

        {/* Empty State. role="status" (WCAG 4.1.3) so a search/filter that
            empties the list is announced to assistive tech, not silent. */}
        {paginatedRows.length === 0 && !isAddingCard && (
          <div className={cssStyles.mobileEmpty} role="status">
            {searchQuery ? 'No results found' : 'No data available'}
          </div>
        )}
      </div>

      {/* Mobile Pagination */}
      {filteredRows.length > itemsPerPage && (
        <div className={cssStyles.pagination}>
          <button
            className={cssStyles.paginationBtn}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <span
            className={cssStyles.paginationInfo}
            // Status-message region (WCAG 4.1.3): announces the page/count
            // change (e.g. after filtering) instead of it passing silently.
            role="status"
            aria-live="polite"
          >
            {currentPage + 1} of {totalPages}
          </span>

          <button
            className={cssStyles.paginationBtn}
            onClick={() =>
              setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      {/* Action Bar */}
      {showActions && selectedRows.length > 0 && (
        <div className={cssStyles.actionBar}>
          {onShow && (
            <button className={cssStyles.actionBtn} onClick={handleShow}>
              Show
            </button>
          )}
          {onManage && (!permissions || permissions.access === 'write') && (
            <button className={cssStyles.actionBtn} onClick={handleManage}>
              Manage
            </button>
          )}
          {onDuplicate && (!permissions || permissions.access === 'write') && (
            <button className={cssStyles.actionBtn} onClick={handleDuplicate}>
              Duplicate
            </button>
          )}
          {onDelete && (!permissions || permissions.access === 'write') && (
            <button
              className={`${cssStyles.actionBtn} ${cssStyles.actionBtnDelete}`}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MobileCardView

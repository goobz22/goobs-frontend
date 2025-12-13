'use client'

import { useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Card from './Card'
import AddCard from './AddCard'
import Searchbar from '../../Field/Search'
import { getDataGridStyles } from '../../../theme'
import type { ColumnDef, RowData } from '../types'

interface MobileCardViewProps {
  columns: ColumnDef[]
  rows: RowData[]
  selectedRows: string[]
  onRowClick: (row: RowData) => void
  onCellSave?: (rowId: string, field: string, value: string) => void
  onRowCreation?: (rowData: Record<string, unknown>) => void | Promise<void>
  allowRowCreation?: boolean
  creationRowPosition?: 'top' | 'bottom'
  onManage?: (selectedRows: string[]) => void
  onDelete?: (selectedRows: string[]) => void
  onDuplicate?: (selectedRows: string[]) => void
  onShow?: (selectedRows: string[]) => void
  onSelectionChange?: (newSelectedIds: string[]) => void
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
  allowRowCreation = false,
  creationRowPosition = 'top',
  onManage,
  onDelete,
  onDuplicate,
  onShow,
  onSelectionChange,
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
  // Initialize portal container with lazy initialization
  const [portalContainer] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined' ? document.body : null
  )
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
  const computedStyles = getDataGridStyles({ ...styles, theme })

  // Create custom theme colors for properties not in DataGridTheme
  const getThemeColors = (themeName: 'light' | 'dark' | 'sacred') => {
    switch (themeName) {
      case 'dark':
        return {
          background: '#1E293B',
          text: '#E2E8F0',
          primary: '#3B82F6',
          border: '#334155',
          headerBackground: '#0F172A',
          secondaryText: '#94A3B8',
        }
      case 'sacred':
        return {
          background: 'rgba(0, 0, 0, 0.9)',
          text: '#FBBF24',
          primary: '#FFD700',
          border: 'rgba(255, 215, 0, 0.5)',
          headerBackground: 'rgba(0, 0, 0, 0.95)',
          secondaryText: '#D97706',
        }
      default: // light
        return {
          background: '#FFFFFF',
          text: '#374151',
          primary: '#3B82F6',
          border: '#E2E8F0',
          headerBackground: '#F8FAFC',
          secondaryText: '#6B7280',
        }
    }
  }

  const themeConfig = getThemeColors(theme)

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
      if (col.creationField?.defaultValue !== undefined) {
        initialData[col.field] = col.creationField.defaultValue
      } else {
        initialData[col.field] = ''
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
      if (col.creationField?.required) {
        const value = creationRowData[col.field]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[col.field] = `${col.headerName} is required`
          hasErrors = true
        }
      }

      // Run custom validation if provided
      if (col.creationField?.validation) {
        const validationError = col.creationField.validation(
          creationRowData[col.field]
        )
        if (validationError) {
          errors[col.field] = validationError
          hasErrors = true
        }
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

  const mobileStyles = {
    container: {
      ...computedStyles.container,
      padding: '0',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
    },
    header: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 10,
      backgroundColor: themeConfig.background,
      borderBottom: `1px solid ${themeConfig.border}`,
      padding: '0.5rem',
    },
    cardsContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      padding: '0.5rem',
      paddingBottom: '5rem', // Extra padding for pagination and FAB
      position: 'relative' as const,
    },
    fab: {
      position: 'fixed' as const,
      bottom: showActions ? '5rem' : '1.5rem',
      right: '1.5rem',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: theme === 'sacred' ? '#FFD700' : themeConfig.primary,
      color: theme === 'sacred' ? '#000000' : 'white',
      border: theme === 'sacred' ? '2px solid rgba(255, 215, 0, 0.8)' : 'none',
      fontSize: '28px',
      fontWeight: 'bold' as const,
      boxShadow:
        theme === 'sacred'
          ? '0 0 20px rgba(255, 215, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 6px 10px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      backgroundImage:
        theme === 'sacred'
          ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
          : 'none',
    },
    actionBar: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: themeConfig.background,
      borderTop: `1px solid ${themeConfig.border}`,
      padding: '0.75rem',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 20,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: themeConfig.text,
    },
    selectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: themeConfig.headerBackground,
      borderBottom: `1px solid ${themeConfig.border}`,
    },
    pagination: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: themeConfig.background,
      borderTop: `1px solid ${themeConfig.border}`,
      padding: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
      height: '48px',
    },
    paginationButton: {
      padding: '0.5rem 1rem',
      backgroundColor:
        theme === 'sacred' ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
      border: `1px solid ${theme === 'sacred' ? '#FFD700' : themeConfig.border}`,
      borderRadius: '0.375rem',
      color: theme === 'sacred' ? '#FFD700' : themeConfig.text,
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '80px',
    },
    paginationInfo: {
      fontSize: '0.875rem',
      color: theme === 'sacred' ? '#FFD700' : themeConfig.text,
      fontWeight: 500,
    },
  }

  return (
    <div style={mobileStyles.container}>
      {/* Selection Mode Header */}
      {selectionMode && (
        <div style={mobileStyles.selectionHeader}>
          <span style={{ fontWeight: 500 }}>
            {selectedRows.length} selected
          </span>
          <button
            onClick={handleExitSelectionMode}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              border: '1px solid currentColor',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Search Bar */}
      {!selectionMode && (
        <div style={mobileStyles.header}>
          <Searchbar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
            styles={{
              theme: theme,
              width: '100%',
            }}
          />
        </div>
      )}

      {/* Cards Container */}
      <div style={mobileStyles.cardsContainer}>
        {/* Add Card - Top Position */}
        {isAddingCard && creationRowPosition === 'top' && (
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

        {/* Add Card - Bottom Position */}
        {isAddingCard && creationRowPosition === 'bottom' && (
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

        {/* Empty State */}
        {paginatedRows.length === 0 && !isAddingCard && (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: themeConfig.secondaryText,
            }}
          >
            {searchQuery ? 'No results found' : 'No data available'}
          </div>
        )}
      </div>

      {/* Mobile Pagination */}
      {filteredRows.length > itemsPerPage && (
        <div style={mobileStyles.pagination}>
          <button
            style={{
              ...mobileStyles.paginationButton,
              opacity: currentPage === 0 ? 0.5 : 1,
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </button>

          <span style={mobileStyles.paginationInfo}>
            {currentPage + 1} of {totalPages}
          </span>

          <button
            style={{
              ...mobileStyles.paginationButton,
              opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              cursor:
                currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            }}
            onClick={() =>
              setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      {/* Floating Action Buttons - Portal to body */}
      {portalContainer &&
        createPortal(
          <>
            {/* Delete Button - shows when cards are selected, onDelete is provided, and user has write permissions */}
            {selectedRows.length > 0 &&
              onDelete &&
              (!permissions || permissions.access === 'write') && (
                <button
                  style={{
                    ...mobileStyles.fab,
                    position: 'fixed' as const,
                    bottom: onDuplicate ? '210px' : '140px',
                    right: '20px',
                    backgroundColor: '#ef4444',
                    backgroundImage: 'none',
                    border: theme === 'sacred' ? '2px solid #ef4444' : 'none',
                    boxShadow:
                      '0 4px 8px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => {
                    onDelete(selectedRows)
                    onSelectionChange?.([])
                  }}
                  aria-label="Delete selected items"
                >
                  🗑️
                </button>
              )}

            {/* Duplicate Button - shows when cards are selected, onDuplicate is provided, and user has write permissions */}
            {selectedRows.length > 0 &&
              onDuplicate &&
              (!permissions || permissions.access === 'write') && (
                <button
                  style={{
                    ...mobileStyles.fab,
                    position: 'fixed' as const,
                    bottom: '140px',
                    right: '20px',
                    backgroundColor: theme === 'sacred' ? '#FFD700' : '#10b981',
                    backgroundImage:
                      theme === 'sacred'
                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                        : 'none',
                    border:
                      theme === 'sacred'
                        ? '2px solid rgba(255, 215, 0, 0.8)'
                        : 'none',
                  }}
                  onClick={() => {
                    onDuplicate?.(selectedRows)
                    onSelectionChange?.([])
                  }}
                  aria-label="Duplicate selected items"
                >
                  📋
                </button>
              )}

            {/* Add Button - shows when allowRowCreation is true and user has write permissions */}
            {allowRowCreation &&
              !selectionMode &&
              !isAddingCard &&
              (!permissions || permissions.access === 'write') && (
                <button
                  style={{
                    ...mobileStyles.fab,
                    position: 'fixed' as const,
                    bottom: '70px',
                    right: '20px',
                  }}
                  onClick={handleStartRowCreation}
                  aria-label="Add new item"
                >
                  +
                </button>
              )}
          </>,
          portalContainer
        )}

      {/* Action Bar */}
      {showActions && selectedRows.length > 0 && (
        <div style={mobileStyles.actionBar}>
          {onShow && (
            <button style={mobileStyles.actionButton} onClick={handleShow}>
              Show
            </button>
          )}
          {onManage && (!permissions || permissions.access === 'write') && (
            <button style={mobileStyles.actionButton} onClick={handleManage}>
              Manage
            </button>
          )}
          {onDuplicate && (!permissions || permissions.access === 'write') && (
            <button style={mobileStyles.actionButton} onClick={handleDuplicate}>
              Duplicate
            </button>
          )}
          {onDelete && (!permissions || permissions.access === 'write') && (
            <button
              style={{ ...mobileStyles.actionButton, color: '#ef4444' }}
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

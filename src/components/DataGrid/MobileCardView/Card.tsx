'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import CardField from './CardField'
import type { ColumnDef, RowData } from '../types'

interface CardProps {
  row: RowData
  columns: ColumnDef[]
  isSelected: boolean
  selectionMode: boolean
  onTap: () => void
  onLongPress: () => void
  editingCell: { rowId: string; field: string } | null
  editingValue: string
  onCellClick: (rowId: string, field: string, currentValue: unknown) => void
  onCellSave?: (rowId: string, field: string, value: string) => void
  onCellCancel: () => void
  onEditingValueChange: (value: string) => void
  styles?: {
    theme?: 'light' | 'dark' | 'sacred'
    backgroundColor?: string
    borderColor?: string
    borderRadius?: string
  }
}

function Card({
  row,
  columns,
  isSelected,
  selectionMode,
  onTap,
  onLongPress,
  editingCell,
  editingValue,
  onCellClick,
  onCellSave,
  onCellCancel,
  onEditingValueChange,
  styles,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | undefined>(undefined)
  const rowId = String(row._id ?? row.id ?? '')

  const theme = styles?.theme || 'sacred'

  // Create custom theme colors for properties not in DataGridTheme
  const getThemeColors = (themeName: 'light' | 'dark' | 'sacred') => {
    switch (themeName) {
      case 'dark':
        return {
          background: '#1E293B',
          border: '#334155',
          primary: '#3B82F6',
          secondaryText: '#94A3B8',
        }
      case 'sacred':
        return {
          background: 'rgba(0, 0, 0, 0.9)',
          border: 'rgba(255, 215, 0, 0.5)',
          primary: '#FFD700',
          secondaryText: '#D97706',
        }
      default: // light
        return {
          background: '#FFFFFF',
          border: '#E2E8F0',
          primary: '#3B82F6',
          secondaryText: '#6B7280',
        }
    }
  }

  const themeConfig = getThemeColors(theme)

  // Determine which fields to show prominently
  const primaryFields = columns.slice(0, 3)
  const secondaryFields = columns.slice(3)
  const hasSecondaryFields = secondaryFields.length > 0

  // Handle touch events for long press
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      onLongPress()
    }, 500)
  }, [onLongPress])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Get the target element
      const target = e.target as HTMLElement
      const isFieldValue = target.closest('[data-field-value]')

      if (!selectionMode) {
        // If clicking on a field value and card is already selected, allow edit
        if (isFieldValue && isSelected) {
          const fieldElement = target.closest('[data-field]') as HTMLElement
          if (fieldElement) {
            const field = fieldElement.dataset.field
            const fieldValue = row[field!]
            onCellClick(rowId, field!, fieldValue)
          }
        } else {
          // Otherwise, select/deselect the card
          onTap()
        }
      } else {
        // In selection mode, always toggle selection
        onTap()
      }
    },
    [selectionMode, onTap, isSelected, onCellClick, rowId, row]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  const cardStyles = {
    card: {
      backgroundColor:
        isSelected && theme === 'sacred'
          ? 'rgba(255, 215, 0, 0.1)'
          : themeConfig.background,
      backgroundImage:
        isSelected && theme === 'sacred'
          ? 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 40%, transparent 70%)'
          : 'none',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '0.75rem',
      border: `1px solid ${
        isSelected
          ? themeConfig.primary
          : theme === 'sacred'
            ? '#FFD700'
            : themeConfig.border
      }`,
      boxShadow: isSelected
        ? theme === 'sacred'
          ? '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)'
          : '0 0 0 2px rgba(37, 99, 235, 0.2)'
        : theme === 'sacred'
          ? '0 1px 3px rgba(255, 215, 0, 0.1)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      transition: 'all 0.3s ease',
      position: 'relative' as const,
    },
    checkbox: {
      position: 'absolute' as const,
      top: '0.75rem',
      right: '0.75rem',
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: `2px solid ${themeConfig.border}`,
      backgroundColor: isSelected ? themeConfig.primary : 'transparent',
      display: selectionMode ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      color: theme === 'sacred' ? '#000000' : 'white',
      fontSize: '14px',
      fontWeight: 'bold' as const,
    },
    expandButton: {
      marginTop: '0.5rem',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      color: theme === 'sacred' ? '#FFD700' : themeConfig.secondaryText,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    expandIcon: {
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    },
  }

  return (
    <div
      style={cardStyles.card}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Selection Checkbox */}
      <div style={cardStyles.checkbox}>
        {isSelected && <span style={cardStyles.checkmark}>✓</span>}
      </div>

      {/* All Fields - no separation between primary and secondary */}
      <div>
        {/* Always show first 3 fields */}
        {primaryFields.map(column => (
          <CardField
            key={column.field}
            column={column}
            value={row[column.field]}
            rowId={rowId}
            isEditing={
              editingCell?.rowId === rowId &&
              editingCell?.field === column.field
            }
            editingValue={editingValue}
            onCellSave={onCellSave}
            onCellCancel={onCellCancel}
            onEditingValueChange={onEditingValueChange}
            styles={styles}
          />
        ))}

        {/* Show remaining fields based on count and expand state */}
        {hasSecondaryFields &&
          (secondaryFields.length <= 3 || isExpanded
            ? secondaryFields.map(column => (
                <CardField
                  key={column.field}
                  column={column}
                  value={row[column.field]}
                  rowId={rowId}
                  isEditing={
                    editingCell?.rowId === rowId &&
                    editingCell?.field === column.field
                  }
                  editingValue={editingValue}
                  onCellSave={onCellSave}
                  onCellCancel={onCellCancel}
                  onEditingValueChange={onEditingValueChange}
                  styles={styles}
                />
              ))
            : null)}
      </div>

      {/* Expand/Collapse Button - only show if more than 3 secondary fields */}
      {hasSecondaryFields && secondaryFields.length > 3 && (
        <button
          style={cardStyles.expandButton}
          onClick={e => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          <span style={cardStyles.expandIcon}>▼</span>
          {isExpanded
            ? 'Show less'
            : `Show ${secondaryFields.length} more fields`}
        </button>
      )}
    </div>
  )
}

export default Card

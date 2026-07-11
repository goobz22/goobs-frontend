'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import CardField from './CardField'
import type { ColumnDef, RowData } from '../types'
import cssStyles from '../DataGrid.module.css'

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
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
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
  permissions,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const rowId = String(row._id ?? row.id ?? '')

  // Determine which fields to show prominently
  const primaryFields = columns.slice(0, 3)
  const secondaryFields = columns.slice(3)
  const hasSecondaryFields = secondaryFields.length > 0

  // Handle touch events for long press
  const handleTouchStart = useCallback(() => {
    setIsPressed(true)
    longPressTimer.current = setTimeout(() => {
      onLongPress()
    }, 500)
  }, [onLongPress])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
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
        // If clicking on a field value and card is already selected, allow edit only if user has write permissions
        if (
          isFieldValue &&
          isSelected &&
          (!permissions || permissions.access === 'write')
        ) {
          const fieldElement = target.closest('[data-field]') as HTMLElement
          if (fieldElement) {
            const field = fieldElement.dataset.field
            // Check if the column is editable
            const column = columns.find(col => col.field === field)
            if (column?.editable !== false) {
              const fieldValue = row[field!]
              onCellClick(rowId, field!, fieldValue)
            } else {
              // Column is not editable, just select/deselect the card
              onTap()
            }
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
    [
      selectionMode,
      onTap,
      isSelected,
      onCellClick,
      rowId,
      row,
      permissions,
      columns,
    ]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  return (
    <div
      className={cssStyles.card}
      data-selected={isSelected}
      data-pressed={isPressed}
      data-selection-mode={selectionMode}
      // Mirrors the desktop <tr> contract so tests don't have to know
      // whether the page rendered the table or the card view:
      //   - data-row-id: stable row identifier (same source as <tr>)
      //   - data-card="true": marks this as a DataGrid row card
      //     specifically (vs. a generic Card component on the page)
      //   - aria-selected: matches the visual selected state for AT
      //   - role="row": keep the same semantics as the table row
      data-row-id={rowId}
      data-card="true"
      aria-selected={isSelected || undefined}
      role="row"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Left accent bar */}
      <div className={cssStyles.accentBar} />

      {/* Selection Indicator - Always visible. Decorative: the selected state
          is conveyed programmatically via aria-selected on the row above. */}
      <div className={cssStyles.selectionIndicator} aria-hidden="true">
        {isSelected ? (
          <span className={cssStyles.checkmark}>✓</span>
        ) : (
          <div className={cssStyles.innerDot} />
        )}
      </div>

      {/* Tap hint for first-time users */}
      <span className={cssStyles.tapHint}>Tap to select</span>

      {/* All Fields */}
      <div className={cssStyles.fields}>
        {/* Always show first 3 fields */}
        {primaryFields.map(column => (
          <CardField
            key={column.field}
            column={column}
            value={row[column.field]}
            row={row}
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
                  row={row}
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
          type="button"
          aria-expanded={isExpanded}
          className={cssStyles.expandBtn}
          onClick={e => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          <span
            className={cssStyles.expandIcon}
            data-expanded={isExpanded}
            aria-hidden="true"
          >
            ▼
          </span>
          {isExpanded
            ? 'Show less'
            : `Show ${secondaryFields.length} more fields`}
        </button>
      )}
    </div>
  )
}

export default Card

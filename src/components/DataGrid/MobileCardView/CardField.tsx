'use client'

import React, { useCallback, useRef, useEffect } from 'react'
import MultiSelectChip from '../../Field/Dropdown/MultiSelect'
import type { ColumnDef } from '../types'
import cssStyles from '../DataGrid.module.css'

interface CardFieldProps {
  column: ColumnDef
  value: unknown
  row?: any // Add row prop to pass full row data for renderCell
  rowId: string
  isEditing: boolean
  editingValue: string
  onCellSave?:
    | ((rowId: string, field: string, value: string) => void)
    | undefined
  onCellCancel: () => void
  onEditingValueChange: (value: string) => void
  styles?:
    | {
        theme?: 'light' | 'dark' | 'sacred'
        backgroundColor?: string
        borderColor?: string
        borderRadius?: string
      }
    | undefined
}

function CardField({
  column,
  value,
  row,
  rowId,
  isEditing,
  editingValue,
  onCellSave,
  onCellCancel,
  onEditingValueChange,
  styles,
}: CardFieldProps) {
  const inputRef = useRef<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(null)

  const theme = styles?.theme || 'sacred'

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if ('select' in inputRef.current) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  // Format value for display
  const formatValue = useCallback(
    (val: unknown): string | React.ReactNode => {
      // If column has a renderCell function and we have full row data, use it
      if (column.renderCell && row) {
        const result = column.renderCell({
          row: row,
          value: val,
        } as any)
        return result || '—'
      }

      if (val == null || val === '') return '—'

      // Handle dropdown fields - show label instead of value
      if (column.type === 'dropdown' && column.dropdownOptions) {
        const option = column.dropdownOptions.find(
          opt => String(opt.value) === String(val)
        )
        if (option) {
          // Use value for display
          return String(option.value)
        }
      }

      // Handle array values for multiselect fields
      if (Array.isArray(val)) {
        if (val.length === 0) return '—'
        return val.map(v => `{{${v}}}`).join(', ')
      }

      if (column.type === 'currency') {
        const num = typeof val === 'number' ? val : parseFloat(String(val))
        if (!isNaN(num)) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(num)
        }
      }

      if (typeof val === 'boolean') {
        return val ? 'Yes' : 'No'
      }

      return String(val)
    },
    [column, row]
  )

  // Handle save - need to handle multiselect differently
  const handleSave = useCallback(() => {
    if (column.creationField?.type === 'multiselect') {
      // For multiselect, parse the editingValue as JSON array
      try {
        const arrayValue = JSON.parse(editingValue)
        onCellSave?.(rowId, column.field, arrayValue as any)
      } catch {
        // If parsing fails, treat as empty array
        onCellSave?.(rowId, column.field, [] as any)
      }
    } else {
      onCellSave?.(rowId, column.field, editingValue)
    }
  }, [
    rowId,
    column.field,
    editingValue,
    onCellSave,
    column.creationField?.type,
  ])

  // Handle key events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCellCancel()
      }
    },
    [handleSave, onCellCancel]
  )

  // Render input based on column type
  const renderInput = () => {
    // Handle multiselect for inline editing
    if (
      column.creationField?.type === 'multiselect' &&
      column.creationField.options
    ) {
      let currentValues: string[] = []
      try {
        currentValues = Array.isArray(value) ? value : JSON.parse(editingValue)
      } catch {
        currentValues = Array.isArray(value) ? value : []
      }

      return (
        <MultiSelectChip
          label=""
          defaultSelected={currentValues}
          onChange={selectedIds => {
            // Convert array to JSON string for editingValue compatibility
            onEditingValueChange(JSON.stringify(selectedIds))
          }}
          options={column.creationField.options.map(opt => ({
            value: String(opt.value),
            _id: opt._id || String(opt.value),
          }))}
          helperText="Select variables..."
          styles={{
            theme: theme,
            width: '100%',
          }}
        />
      )
    }

    if (column.type === 'dropdown' && column.dropdownOptions) {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editingValue}
          onChange={e => onEditingValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cssStyles.fieldInput}
        >
          <option value="">Select...</option>
          {column.dropdownOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      )
    }

    // Handle date field
    if (column.type === 'date') {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="date"
          value={editingValue ? editingValue.split('T')[0] : ''}
          onChange={e => onEditingValueChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cssStyles.fieldInput}
        />
      )
    }

    const inputType = column.type === 'currency' ? 'number' : 'text'

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={inputType}
        value={editingValue}
        onChange={e => onEditingValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cssStyles.fieldInput}
      />
    )
  }

  return (
    <div className={cssStyles.field} data-field={column.field}>
      <label className={cssStyles.fieldLabel}>{column.headerName}</label>
      {isEditing ? (
        <div className={cssStyles.fieldEditContainer}>
          {renderInput()}
          <button
            className={`${cssStyles.fieldBtn} ${cssStyles.fieldBtnSave}`}
            onClick={e => {
              e.stopPropagation()
              handleSave()
            }}
          >
            ✓
          </button>
          <button
            className={`${cssStyles.fieldBtn} ${cssStyles.fieldBtnCancel}`}
            onClick={e => {
              e.stopPropagation()
              onCellCancel()
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={cssStyles.fieldValue} data-field-value="true">
          {column.renderCell && row ? formatValue(row) : formatValue(value)}
        </div>
      )}
    </div>
  )
}

export default CardField

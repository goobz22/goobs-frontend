'use client'

import React, { useCallback, useRef, useEffect } from 'react'
import MultiSelectChip from '../../Field/Dropdown/MultiSelect'
import type { ColumnDef } from '../types'

interface CardFieldProps {
  column: ColumnDef
  value: unknown
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

  // Create custom theme colors for properties not in DataGridTheme
  const getThemeColors = (themeName: 'light' | 'dark' | 'sacred') => {
    switch (themeName) {
      case 'dark':
        return {
          text: '#E2E8F0',
          secondaryText: '#94A3B8',
          border: '#334155',
          inputBackground: '#1E293B',
          buttonBackground: '#334155',
          primary: '#3B82F6',
        }
      case 'sacred':
        return {
          text: '#FBBF24',
          secondaryText: '#D97706',
          border: 'rgba(255, 215, 0, 0.5)',
          inputBackground: 'rgba(0, 0, 0, 0.9)',
          buttonBackground: 'rgba(255, 215, 0, 0.2)',
          primary: '#FFD700',
        }
      default: // light
        return {
          text: '#374151',
          secondaryText: '#6B7280',
          border: '#E2E8F0',
          inputBackground: '#FFFFFF',
          buttonBackground: '#F3F4F6',
          primary: '#3B82F6',
        }
    }
  }

  const customColors = getThemeColors(theme)

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
    (val: unknown): string => {
      if (val == null || val === '') return '—'

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
    [column.type]
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
  }, [rowId, column.field, editingValue, onCellSave, column.creationField?.type])

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
    const inputStyles = {
      width: '100%',
      padding: '0.375rem 0.5rem',
      fontSize: '0.875rem',
      borderRadius: '0.25rem',
      border: `1px solid ${customColors.border}`,
      backgroundColor: customColors.inputBackground,
      color: customColors.text,
      outline: 'none',
    }

    // Handle multiselect for inline editing
    if (column.creationField?.type === 'multiselect' && column.creationField.options) {
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
          style={inputStyles}
        >
          <option value="">Select...</option>
          {column.dropdownOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label || option.value}
            </option>
          ))}
        </select>
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
        style={inputStyles}
      />
    )
  }

  const fieldStyles = {
    container: {
      marginBottom: '0.5rem',
      minHeight: '44px', // Touch-friendly height
    },
    label: {
      fontSize: '0.925rem',
      fontWeight: 600,
      color: theme === 'sacred' ? '#FFD700' : customColors.secondaryText,
      marginBottom: '0.25rem',
      display: 'block',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
    },
    value: {
      fontSize: '0.875rem',
      color: customColors.text,
      padding: '0.375rem 0',
      minHeight: '32px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: '0.25rem',
      transition: 'background-color 0.15s ease',
    },
    editContainer: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
    },
    button: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: 500,
      borderRadius: '0.25rem',
      border: 'none',
      cursor: 'pointer',
      minWidth: '48px',
      height: '32px',
    },
    saveButton: {
      backgroundColor: customColors.primary,
      color: theme === 'sacred' ? '#000000' : 'white',
    },
    cancelButton: {
      backgroundColor: customColors.buttonBackground,
      color: customColors.text,
    },
  }

  return (
    <div style={fieldStyles.container} data-field={column.field}>
      <label style={fieldStyles.label}>{column.headerName}</label>
      {isEditing ? (
        <div style={fieldStyles.editContainer}>
          {renderInput()}
          <button
            style={{ ...fieldStyles.button, ...fieldStyles.saveButton }}
            onClick={e => {
              e.stopPropagation()
              handleSave()
            }}
          >
            ✓
          </button>
          <button
            style={{ ...fieldStyles.button, ...fieldStyles.cancelButton }}
            onClick={e => {
              e.stopPropagation()
              onCellCancel()
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div style={fieldStyles.value} data-field-value="true">
          {formatValue(value)}
        </div>
      )}
    </div>
  )
}

export default CardField

'use client'

import React, { useState, useCallback } from 'react'
import TextField from '../../Field/Text'
import DateField from '../../Field/Date/DateField'
import SearchableDropdown from '../../Field/Dropdown/SearchableSimple'
import MultiSelectChip from '../../Field/Dropdown/MultiSelect'
import InternalIncrement from '../../Field/Number/InternalIncrement'
import Button from '../../Button'
import type { ColumnDef } from '../types'

// Type for creation field configuration
interface CreationFieldConfig {
  type?:
    | 'text'
    | 'date'
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
  required?: boolean
  placeholder?: string
  options?: Array<{
    value: string
    label?: string
    attribute1?: string
    attribute2?: string
    _id?: string
  }>
  defaultValue?: string | string[] | Date | null
  helperText?: string
  validation?: (value: any) => string | undefined
  min?: number
  max?: number
  step?: number
}

interface AddCardProps {
  columns: ColumnDef[]
  creationRowData: Record<string, unknown>
  creationRowErrors: Record<string, string>
  onCreationFieldChange: (field: string, value: unknown) => void
  onSave: () => void | Promise<void>
  onCancel: () => void
  styles?: {
    theme?: 'light' | 'dark' | 'sacred'
    backgroundColor?: string
    borderColor?: string
    borderRadius?: string
  }
}

function AddCard({
  columns,
  creationRowData,
  creationRowErrors,
  onCreationFieldChange,
  onSave,
  onCancel,
  styles,
}: AddCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const theme = styles?.theme || 'sacred'

  // Create custom theme colors for properties not in DataGridTheme
  const getThemeColors = (themeName: 'light' | 'dark' | 'sacred') => {
    switch (themeName) {
      case 'dark':
        return {
          background: '#1E293B',
          text: '#E2E8F0',
          secondaryText: '#94A3B8',
          primary: '#3B82F6',
        }
      case 'sacred':
        return {
          background: 'rgba(0, 0, 0, 0.9)',
          text: '#FBBF24',
          secondaryText: '#D97706',
          primary: '#FFD700',
        }
      default: // light
        return {
          background: '#FFFFFF',
          text: '#374151',
          secondaryText: '#6B7280',
          primary: '#3B82F6',
        }
    }
  }

  const themeConfig = getThemeColors(theme)

  // Handle field change - just pass through to parent
  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      onCreationFieldChange(field, value)
    },
    [onCreationFieldChange]
  )

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await onSave()
    } catch (error) {
      console.error('Error saving card:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSave])

  // Render field input based on type
  const renderField = (column: ColumnDef) => {
    const fieldConfig: CreationFieldConfig = column.creationField || {}
    const value = creationRowData[column.field]
    const error = creationRowErrors[column.field]

    const fieldStyles = {
      theme: theme,
      width: '100%',
      error: !!error,
    }

    // Handle searchable dropdown
    if (fieldConfig.type === 'searchableDropdown' && fieldConfig.options) {
      return (
        <SearchableDropdown
          label=""
          defaultValue={value ? String(value) : ''}
          onChange={selected =>
            handleFieldChange(column.field, selected?.value || '')
          }
          options={fieldConfig.options.map(opt => ({
            value: String(opt.value),
            attribute1: opt.label || String(opt.value),
            ...(opt._id && { _id: opt._id }),
          }))}
          placeholder={fieldConfig.placeholder || 'Select...'}
          styles={fieldStyles}
        />
      )
    }

    // Handle multiselect
    if (fieldConfig.type === 'multiselect' && fieldConfig.options) {
      return (
        <MultiSelectChip
          label=""
          defaultSelected={Array.isArray(value) ? value : []}
          onChange={selectedIds => handleFieldChange(column.field, selectedIds)}
          options={fieldConfig.options.map(opt => ({
            value: String(opt.value),
            _id: opt._id || String(opt.value),
          }))}
          helperText={fieldConfig.placeholder || 'Select...'}
          styles={{
            ...fieldStyles,
            width: '100%',
          }}
        />
      )
    }

    // Handle date field
    if (fieldConfig.type === 'date') {
      return (
        <DateField
          value={value ? new Date(String(value)) : null}
          onChange={date => {
            // Store date as ISO string or empty string
            const dateValue = date ? date.toISOString().split('T')[0] : ''
            handleFieldChange(column.field, dateValue)
          }}
          {...(fieldConfig.placeholder && {
            helperText: fieldConfig.placeholder,
          })}
          styles={fieldStyles}
        />
      )
    }

    // Handle internal increment (number field)
    if (fieldConfig.type === 'internalIncrement') {
      return (
        <InternalIncrement
          value={String(Number(value) || 0)}
          onChange={newValue => {
            const numericValue =
              typeof newValue === 'number'
                ? newValue
                : parseInt(String(newValue), 10) || 0
            handleFieldChange(column.field, numericValue)
          }}
          {...(fieldConfig.min !== undefined && { min: fieldConfig.min })}
          {...(fieldConfig.max !== undefined && { max: fieldConfig.max })}
          styles={fieldStyles}
        />
      )
    }

    // Handle regular dropdown
    if (fieldConfig.type === 'dropdown' && fieldConfig.options) {
      return (
        <SearchableDropdown
          label=""
          defaultValue={value ? String(value) : ''}
          onChange={selected =>
            handleFieldChange(column.field, selected?.value || '')
          }
          options={fieldConfig.options.map(opt => ({
            value: String(opt.value),
            attribute1: opt.label || String(opt.value),
            ...(opt._id && { _id: opt._id }),
          }))}
          placeholder={fieldConfig.placeholder || 'Select...'}
          styles={fieldStyles}
        />
      )
    }

    // Handle dropdown from column definition (legacy support)
    if (column.type === 'dropdown' && column.dropdownOptions) {
      return (
        <SearchableDropdown
          label=""
          defaultValue={value ? String(value) : ''}
          onChange={selected =>
            handleFieldChange(column.field, selected?.value || '')
          }
          options={column.dropdownOptions.map(opt => ({
            value: String(opt.value),
            attribute1: opt.label || String(opt.value),
            ...(opt._id && { _id: opt._id }),
          }))}
          placeholder={fieldConfig.placeholder || 'Select...'}
          styles={fieldStyles}
        />
      )
    }

    // Default text input
    return (
      <TextField
        value={String(value || '')}
        onChange={textValue => {
          handleFieldChange(column.field, textValue)
        }}
        placeholder={fieldConfig.placeholder || `Enter ${column.headerName}`}
        styles={fieldStyles}
      />
    )
  }

  const cardStyles = {
    card: {
      backgroundColor: themeConfig.background,
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '0.75rem',
      border: `2px dashed ${themeConfig.primary}`,
    },
    header: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: themeConfig.text,
    },
    fieldContainer: {
      marginBottom: '1rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: themeConfig.secondaryText,
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    required: {
      color: '#ef4444',
      fontSize: '0.875rem',
    },
    error: {
      fontSize: '0.75rem',
      color: '#ef4444',
      marginTop: '0.25rem',
    },
    buttonContainer: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1.5rem',
      justifyContent: 'space-between',
    },
  }

  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.header}>Add New Item</div>

      {columns
        .filter(col => col.creationField)
        .map(column => (
          <div key={column.field} style={cardStyles.fieldContainer}>
            <label style={cardStyles.label}>
              {column.headerName}
              {column.creationField?.required && (
                <span style={cardStyles.required}>*</span>
              )}
            </label>
            {renderField(column)}
            {creationRowErrors[column.field] && (
              <div style={cardStyles.error}>
                {creationRowErrors[column.field]}
              </div>
            )}
          </div>
        ))}

      <div style={cardStyles.buttonContainer}>
        <Button
          text={isSubmitting ? 'Saving...' : 'Save'}
          onClick={handleSave}
          disabled={isSubmitting}
          styles={{
            theme: theme,
            width: '48%',
            height: '44px',
          }}
        />
        <Button
          text="Cancel"
          onClick={onCancel}
          disabled={isSubmitting}
          styles={{
            theme: theme,
            width: '48%',
            height: '44px',
            ...(theme === 'sacred' && {
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              borderColor: '#FFD700',
            }),
          }}
        />
      </div>
    </div>
  )
}

export default AddCard

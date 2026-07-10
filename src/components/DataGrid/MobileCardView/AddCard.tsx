'use client'

import React, { useState, useCallback, useMemo } from 'react'
import TextField from '../../Field/Text'
import DateField from '../../Field/Date/DateField'
import TimeField from '../../Field/Time/TimeField'
import SearchableDropdown from '../../Field/Dropdown/SearchableSimple'
import MultiSelectChip from '../../Field/Dropdown/MultiSelect'
import InternalIncrement from '../../Field/Number/InternalIncrement'
import PhoneNumberField from '../../Field/PhoneNumber'
import ComplexTextEditor from '../../ComplexTextEditor'
import Button from '../../Button'
import type { ColumnDef, CompositeFieldConfig } from '../types'

// Unified field definition for rendering
interface RenderableField {
  field: string
  label: string
  type: string
  required?: boolean | undefined
  placeholder?: string | undefined
  helperText?: string | undefined
  options?: Array<{ value: string; _id?: string }> | undefined
  min?: number | undefined
  max?: number | undefined
  step?: number | undefined
  minRows?: number | undefined
  validation?: ((value: unknown) => string | undefined) | undefined
}

// Helper to check if column type is a composite field array
function isCompositeFieldArray(
  type: ColumnDef['type']
): type is CompositeFieldConfig[] {
  return Array.isArray(type)
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
          // dark-danger-text: #f87171 is 5.29:1 on #1E293B; the bare #ef4444
          // (used on the near-black sacred card) is only 3.89:1 here.
          danger: '#F87171',
        }
      case 'sacred':
        return {
          background: 'rgba(0, 0, 0, 0.9)',
          text: '#FBBF24',
          secondaryText: '#D97706',
          primary: '#FFD700',
          danger: '#EF4444',
        }
      default: // light
        return {
          background: '#FFFFFF',
          text: '#374151',
          secondaryText: '#6B7280',
          primary: '#3B82F6',
          // light-danger-text: #b91c1c is 6.47:1 on #FFFFFF; #ef4444 is 3.76:1.
          danger: '#B91C1C',
        }
    }
  }

  const themeConfig = getThemeColors(theme)

  // Extract all renderable fields from columns
  // This handles both creationField columns AND composite field columns
  const renderableFields = useMemo((): RenderableField[] => {
    const fields: RenderableField[] = []

    columns.forEach(col => {
      // Check if column has creationField (traditional approach)
      if (col.creationField) {
        fields.push({
          field: col.field,
          label: col.headerName,
          type: col.creationField.type || 'text',
          required: col.creationField.required,
          placeholder: col.creationField.placeholder,
          helperText: col.creationField.helperText,
          options: col.creationField.options,
          min: col.creationField.min,
          max: col.creationField.max,
          step: col.creationField.step,
          minRows: (col.creationField as { minRows?: number }).minRows,
          validation: col.creationField.validation,
        })
      }
      // Check if column has composite fields (type is an array)
      else if (isCompositeFieldArray(col.type)) {
        col.type.forEach(compositeField => {
          fields.push({
            field: compositeField.field,
            label: compositeField.label,
            type: compositeField.type || 'text',
            required: compositeField.required,
            placeholder: compositeField.placeholder,
            helperText: compositeField.helperText,
            options: compositeField.options,
            min: compositeField.min,
            max: compositeField.max,
            step: compositeField.step,
            minRows: compositeField.minRows,
            validation: compositeField.validation,
          })
        })
      }
    })

    return fields
  }, [columns])

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
  const renderField = (fieldDef: RenderableField) => {
    const value = creationRowData[fieldDef.field]
    const error = creationRowErrors[fieldDef.field]

    const fieldStyles = {
      theme: theme,
      width: '100%',
      error: !!error,
    }

    // Handle searchable dropdown
    if (fieldDef.type === 'searchableDropdown' && fieldDef.options) {
      return (
        <SearchableDropdown
          label=""
          defaultValue={value ? String(value) : ''}
          onChange={selected =>
            handleFieldChange(fieldDef.field, selected?.value || '')
          }
          options={fieldDef.options.map(opt => ({
            value: String(opt.value),
            ...(opt._id && { _id: opt._id }),
          }))}
          placeholder={
            fieldDef.placeholder || fieldDef.helperText || 'Select...'
          }
          styles={fieldStyles}
        />
      )
    }

    // Handle multiselect
    if (fieldDef.type === 'multiselect' && fieldDef.options) {
      return (
        <MultiSelectChip
          label=""
          defaultSelected={Array.isArray(value) ? value : []}
          onChange={selectedIds =>
            handleFieldChange(fieldDef.field, selectedIds)
          }
          options={fieldDef.options.map(opt => ({
            value: String(opt.value),
            _id: opt._id || String(opt.value),
          }))}
          helperText={
            fieldDef.placeholder || fieldDef.helperText || 'Select...'
          }
          styles={{
            ...fieldStyles,
            width: '100%',
          }}
        />
      )
    }

    // Handle date field
    if (fieldDef.type === 'date') {
      return (
        <DateField
          value={value ? new Date(String(value)) : null}
          onChange={date => {
            const dateValue = date ? date.toISOString().split('T')[0] : ''
            handleFieldChange(fieldDef.field, dateValue)
          }}
          {...(fieldDef.helperText && { helperText: fieldDef.helperText })}
          styles={fieldStyles}
        />
      )
    }

    // Handle monthYear field
    if (fieldDef.type === 'monthYear') {
      return (
        <DateField
          value={value ? new Date(String(value)) : null}
          onChange={date => {
            const dateValue = date ? date.toISOString().split('T')[0] : ''
            handleFieldChange(fieldDef.field, dateValue)
          }}
          variant="month-year"
          {...(fieldDef.helperText && { helperText: fieldDef.helperText })}
          styles={fieldStyles}
        />
      )
    }

    // Handle time field
    if (fieldDef.type === 'time') {
      const timeValue = (() => {
        if (!value) return null
        const timeStr = String(value)
        const [hours, minutes] = timeStr.split(':').map(Number)
        if (isNaN(hours!) || isNaN(minutes!)) return null
        const date = new Date()
        date.setHours(hours!, minutes!, 0, 0)
        return date
      })()
      return (
        <TimeField
          value={timeValue}
          onChange={(newTime: Date | null) => {
            if (!newTime) {
              handleFieldChange(fieldDef.field, '')
              return
            }
            const hours = String(newTime.getHours()).padStart(2, '0')
            const minutes = String(newTime.getMinutes()).padStart(2, '0')
            handleFieldChange(fieldDef.field, `${hours}:${minutes}`)
          }}
          {...(fieldDef.helperText && { helperText: fieldDef.helperText })}
          styles={fieldStyles}
        />
      )
    }

    // Handle internal increment (number field)
    if (fieldDef.type === 'internalIncrement') {
      return (
        <InternalIncrement
          value={String(Number(value) || 0)}
          onChange={newValue => {
            const numericValue =
              typeof newValue === 'number'
                ? newValue
                : parseInt(String(newValue), 10) || 0
            handleFieldChange(fieldDef.field, numericValue)
          }}
          {...(fieldDef.min !== undefined && { min: fieldDef.min })}
          {...(fieldDef.max !== undefined && { max: fieldDef.max })}
          styles={fieldStyles}
        />
      )
    }

    // Handle regular dropdown
    if (fieldDef.type === 'dropdown' && fieldDef.options) {
      return (
        <SearchableDropdown
          label=""
          defaultValue={value ? String(value) : ''}
          onChange={selected =>
            handleFieldChange(fieldDef.field, selected?.value || '')
          }
          options={fieldDef.options.map(opt => ({
            value: String(opt.value),
            ...(opt._id && { _id: opt._id }),
          }))}
          placeholder={
            fieldDef.placeholder || fieldDef.helperText || 'Select...'
          }
          styles={fieldStyles}
        />
      )
    }

    // Handle phone number field
    if (fieldDef.type === 'phoneNumber') {
      return (
        <PhoneNumberField
          value={String(value || '')}
          onChange={phoneValue => {
            handleFieldChange(fieldDef.field, phoneValue)
          }}
          styles={fieldStyles}
        />
      )
    }

    // Handle simple editor
    if (fieldDef.type === 'simpleeditor') {
      return (
        <ComplexTextEditor
          value={String(value || '')}
          onChange={(textValue: string) => {
            handleFieldChange(fieldDef.field, textValue)
          }}
          editorType="simple"
          minRows={fieldDef.minRows || 4}
          styles={{
            theme: fieldStyles.theme,
            width: '100%',
          }}
        />
      )
    }

    // Default text input
    return (
      <TextField
        value={String(value || '')}
        onChange={textValue => {
          handleFieldChange(fieldDef.field, textValue)
        }}
        placeholder={
          fieldDef.placeholder ||
          fieldDef.helperText ||
          `Enter ${fieldDef.label}`
        }
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
      color: themeConfig.danger,
      fontSize: '0.875rem',
    },
    error: {
      fontSize: '0.75rem',
      color: themeConfig.danger,
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
    <div
      style={cardStyles.card}
      // Mobile equivalent of the desktop CreationRow's `data-creation-row`.
      // Tests can wait for `[data-creation-card="true"]` and then submit
      // via `[data-action="save-creation"]` regardless of viewport.
      data-creation-card="true"
      role="form"
      aria-label="Add new item"
    >
      <div style={cardStyles.header}>Add New Item</div>

      {renderableFields.map(fieldDef => (
        <div
          key={fieldDef.field}
          style={cardStyles.fieldContainer}
          // Per-field wrapper carries the field key so tests can
          // target a specific input as
          // `[data-creation-card] [data-field-name="email"] input`.
          data-field-name={fieldDef.field}
        >
          <label style={cardStyles.label}>
            {fieldDef.label}
            {fieldDef.required && <span style={cardStyles.required}>*</span>}
          </label>
          {renderField(fieldDef)}
          {creationRowErrors[fieldDef.field] && (
            <div style={cardStyles.error} role="alert">
              {creationRowErrors[fieldDef.field]}
            </div>
          )}
        </div>
      ))}

      <div style={cardStyles.buttonContainer}>
        <Button
          text={isSubmitting ? 'Saving...' : 'Save'}
          onClick={handleSave}
          disabled={isSubmitting}
          action="save-creation"
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
          action="cancel-creation"
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

'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Dialog from '../../Dialog'
import Typography from '../../Typography'
import CustomButton from '../../Button'
import type { CompositeFieldConfig, RowData } from '../types'
import type { DataGridStyles } from '../../../theme'

// Field component imports - same as EditableCell
import TextField from '../../Field/Text'
import DateField from '../../Field/Date/DateField'
import TimeField from '../../Field/Time/TimeField'
import SearchableSimple, {
  type DropdownOption,
} from '../../Field/Dropdown/SearchableSimple'
import MultiSelectChip from '../../Field/Dropdown/MultiSelect'
import InternalIncrementNumberField from '../../Field/Number/InternalIncrement'
import PhoneNumberField from '../../Field/PhoneNumber'
import CVV from '../../Field/Number/CVV'
import CreditCardNumber from '../../Field/Number/CreditCardNumber'
import AccountNumber from '../../Field/Number/AccountNumber'
import RoutingNumber from '../../Field/Number/RoutingNumber'
import USDField from '../../Field/USD'
import ComplexTextEditor from '../../ComplexTextEditor'
// IPAM field imports
import IPAddressField from '../../Field/IPAM/Address'
import SubnetField, { type SubnetFieldValue } from '../../Field/IPAM/Subnet'
import VLANField from '../../Field/IPAM/VLAN'
import CIDRField from '../../Field/IPAM/CIDR'
import SupernetField from '../../Field/IPAM/Supernet'
import MACAddressField from '../../Field/IPAM/MACAddress'

interface CompositeFieldEditModalProps {
  open: boolean
  onClose: () => void
  rowData: RowData
  compositeFields: CompositeFieldConfig[]
  onSave: (fieldUpdates: Record<string, any>) => void
  styles?: DataGridStyles
}

const CompositeFieldEditModal: React.FC<CompositeFieldEditModalProps> = ({
  open,
  onClose,
  rowData,
  compositeFields,
  onSave,
  styles,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'

  // Initialize field values from rowData
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {}
    compositeFields.forEach(field => {
      let value = rowData[field.field] ?? field.defaultValue ?? ''

      // Convert boolean values to strings for dropdown fields
      if (field.type === 'dropdown' && typeof value === 'boolean') {
        value = String(value)
      }

      initialValues[field.field] = value
    })
    return initialValues
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      setFieldValues(prev => ({
        ...prev,
        [field]: value,
      }))

      // Clear error for this field when value changes
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: '',
        }))
      }
    },
    [fieldErrors]
  )

  const validateFields = useCallback(() => {
    const errors: Record<string, string> = {}
    let hasErrors = false

    compositeFields.forEach(fieldConfig => {
      const value = fieldValues[fieldConfig.field]

      // Check required validation
      if (fieldConfig.required) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[fieldConfig.field] = `${fieldConfig.label} is required`
          hasErrors = true
        }
      }

      // Run custom validation if provided
      if (fieldConfig.validation && value) {
        const validationError = fieldConfig.validation(value)
        if (validationError) {
          errors[fieldConfig.field] = validationError
          hasErrors = true
        }
      }
    })

    setFieldErrors(errors)
    return !hasErrors
  }, [compositeFields, fieldValues])

  const handleSave = useCallback(() => {
    if (validateFields()) {
      // Process field values to convert string values back to appropriate types
      const processedValues: Record<string, any> = {}

      compositeFields.forEach(field => {
        let value = fieldValues[field.field]

        // Convert string boolean values back to booleans for dropdown fields
        if (
          field.type === 'dropdown' &&
          (value === 'true' || value === 'false')
        ) {
          // Check if the original value was a boolean
          const originalValue = rowData[field.field]
          if (typeof originalValue === 'boolean') {
            value = value === 'true'
          }
        }

        processedValues[field.field] = value
      })

      onSave(processedValues)
      onClose()
    }
  }, [validateFields, onSave, fieldValues, onClose, compositeFields, rowData])

  const handleCancel = useCallback(() => {
    // Reset field values to original data
    const resetValues: Record<string, any> = {}
    compositeFields.forEach(field => {
      let value = rowData[field.field] ?? field.defaultValue ?? ''

      // Convert boolean values to strings for dropdown fields
      if (field.type === 'dropdown' && typeof value === 'boolean') {
        value = String(value)
      }

      resetValues[field.field] = value
    })
    setFieldValues(resetValues)
    setFieldErrors({})
    onClose()
  }, [compositeFields, rowData, onClose])

  // Common field styles for all field components
  const fieldStyles = useMemo(
    () => ({
      theme: (isSacredTheme ? 'sacred' : 'light') as
        | 'light'
        | 'dark'
        | 'sacred',
      fontSize: '14px',
      height: '45px',
      minHeight: '45px',
      padding: '10px 12px',
      borderRadius: '4px',
      width: '100%',
      backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.8)' : 'white',
      borderColor: isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#ccc',
    }),
    [isSacredTheme]
  )

  const renderField = useCallback(
    (fieldConfig: CompositeFieldConfig) => {
      const value = fieldValues[fieldConfig.field]
      const error = fieldErrors[fieldConfig.field]

      // Field container with label and error
      const fieldContainer = (fieldElement: React.ReactNode) => (
        <div
          key={fieldConfig.field}
          // Per-composite-field wrapper carries the field key so tests
          // can target a specific control inside the composite modal:
          //   `[data-composite-modal] [data-field-name="address1"] input`
          // Same selector shape as the desktop CreationRow cells, so a
          // single helper can drive both forms.
          data-field-name={fieldConfig.field}
          data-field-required={fieldConfig.required ? 'true' : undefined}
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '8px' }}>
            <Typography
              text={fieldConfig.label + (fieldConfig.required ? ' *' : '')}
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
                fontSize: '14px',
                fontWeight: 600,
                color: isSacredTheme ? 'rgba(255, 215, 0, 0.9)' : '#333',
              }}
            />
          </div>
          {fieldElement}
          {error && (
            <div style={{ marginTop: '4px' }}>
              <Typography
                text={error}
                styles={{
                  theme: isSacredTheme ? 'sacred' : 'light',
                  fontSize: '12px',
                  color: '#ff4444',
                }}
              />
            </div>
          )}
          {fieldConfig.helperText && !error && (
            <div style={{ marginTop: '4px' }}>
              <Typography
                text={fieldConfig.helperText}
                styles={{
                  theme: isSacredTheme ? 'sacred' : 'light',
                  fontSize: '12px',
                  color: isSacredTheme ? 'rgba(255, 255, 255, 0.7)' : '#666',
                }}
              />
            </div>
          )}
        </div>
      )

      // Render the appropriate field component based on type
      switch (fieldConfig.type) {
        case 'simpleeditor':
          return fieldContainer(
            <ComplexTextEditor
              value={value || ''}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              editorType="simple"
              minRows={fieldConfig.minRows || 4}
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
                backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.8)' : 'white',
                borderColor: isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#ccc',
              }}
            />
          )

        case 'currency':
        case 'usd':
          return fieldContainer(
            <USDField
              label=""
              initialValue={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )

        case 'text':
          return fieldContainer(
            <TextField
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              placeholder={fieldConfig.placeholder}
              styles={fieldStyles}
            />
          )

        case 'date':
          return fieldContainer(
            <DateField
              value={value ? new Date(value) : null}
              onChange={(newValue: Date | null) =>
                handleFieldChange(
                  fieldConfig.field,
                  newValue ? newValue.toISOString() : ''
                )
              }
              styles={fieldStyles}
            />
          )

        case 'monthYear': {
          // Parse MM/YY or MM/YYYY format to Date
          let dateValue: Date | null = null
          if (value) {
            const parts = String(value).split('/')
            if (parts.length === 2 && parts[0] && parts[1]) {
              const month = parseInt(parts[0], 10)
              const yearStr = parts[1]
              let year = parseInt(yearStr, 10)

              // Handle 2-digit year
              if (yearStr.length === 2) {
                year = year < 50 ? 2000 + year : 1900 + year
              }

              if (!isNaN(month) && !isNaN(year)) {
                dateValue = new Date(year, month - 1, 1)
              }
            }
          }

          return fieldContainer(
            <DateField
              value={dateValue}
              onChange={(newValue: Date | null) => {
                if (newValue) {
                  const month = String(newValue.getMonth() + 1).padStart(2, '0')
                  const year = String(newValue.getFullYear()).slice(-2)
                  handleFieldChange(fieldConfig.field, `${month}/${year}`)
                } else {
                  handleFieldChange(fieldConfig.field, '')
                }
              }}
              variant="month-year"
              styles={fieldStyles}
            />
          )
        }

        case 'time': {
          // Convert string value to Date for TimeField
          const timeValue = (() => {
            if (!value) return null
            const timeStr = String(value)
            const [hours, minutes] = timeStr.split(':').map(Number)
            if (isNaN(hours!) || isNaN(minutes!)) return null
            const date = new Date()
            date.setHours(hours!, minutes!, 0, 0)
            return date
          })()
          return fieldContainer(
            <TimeField
              value={timeValue}
              onChange={(newTime: Date | null) => {
                if (!newTime) {
                  handleFieldChange(fieldConfig.field, '')
                  return
                }
                const hours = String(newTime.getHours()).padStart(2, '0')
                const minutes = String(newTime.getMinutes()).padStart(2, '0')
                handleFieldChange(fieldConfig.field, `${hours}:${minutes}`)
              }}
              styles={fieldStyles}
            />
          )
        }

        case 'searchableDropdown':
        case 'dropdown': {
          const options = fieldConfig.options || []
          return fieldContainer(
            <SearchableSimple
              label=""
              options={options}
              defaultValue={String(value || '')}
              onChange={(option: DropdownOption | null) => {
                // For ID fields (ending with 'Id'), use _id; otherwise use value
                const fieldEndsWithId = fieldConfig.field.endsWith('Id')
                const valueToUse = fieldEndsWithId
                  ? option?._id || ''
                  : option?.value || ''
                handleFieldChange(fieldConfig.field, valueToUse)
              }}
              placeholder={fieldConfig.placeholder || ''}
              styles={fieldStyles}
            />
          )
        }

        case 'multiselect': {
          const multiOptions = fieldConfig.options || []
          let currentValues: string[] = []
          try {
            currentValues = Array.isArray(value)
              ? value
              : value
                ? JSON.parse(String(value))
                : []
          } catch {
            currentValues = Array.isArray(value) ? value : []
          }

          return fieldContainer(
            <MultiSelectChip
              label=""
              defaultSelected={currentValues}
              onChange={(selectedIds: string[]) => {
                handleFieldChange(fieldConfig.field, selectedIds)
              }}
              options={multiOptions.map(opt => ({
                value: String(opt.value),
                _id: opt._id || String(opt.value),
              }))}
              styles={{
                ...fieldStyles,
                height: 'auto',
                minHeight: '40px',
              }}
            />
          )
        }

        case 'internalIncrement':
          return fieldContainer(
            <InternalIncrementNumberField
              initialValue={String(value || '')}
              onChange={(
                eventOrValue: React.ChangeEvent<HTMLInputElement> | number
              ) => {
                let numValue: number
                if (typeof eventOrValue === 'number') {
                  numValue = eventOrValue
                } else {
                  numValue = parseInt(eventOrValue.target.value, 10)
                }
                handleFieldChange(
                  fieldConfig.field,
                  isNaN(numValue) ? 0 : numValue
                )
              }}
              styles={fieldStyles}
            />
          )

        case 'phoneNumber':
          return fieldContainer(
            <PhoneNumberField
              label=""
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )

        case 'cvv':
          return fieldContainer(
            <CVV
              label=""
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )

        case 'creditCardNumber':
          return fieldContainer(
            <CreditCardNumber
              label=""
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )

        case 'accountNumber':
          return fieldContainer(
            <AccountNumber
              label=""
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )

        case 'routingNumber':
          return fieldContainer(
            <RoutingNumber
              label=""
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )

        case 'ipAddress':
          return fieldContainer(
            <IPAddressField
              label=""
              initialValue={String(value || '')}
              onChange={value => handleFieldChange(fieldConfig.field, value)}
              styles={fieldStyles}
            />
          )

        case 'subnet': {
          const subnetValue = (() => {
            try {
              return typeof value === 'object'
                ? value
                : JSON.parse(String(value || '{}'))
            } catch {
              return { address: '', mask: 24 }
            }
          })() as SubnetFieldValue

          return fieldContainer(
            <SubnetField
              label=""
              value={subnetValue}
              onChange={(newValue: SubnetFieldValue) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )
        }

        case 'vlan':
          return fieldContainer(
            <VLANField
              label=""
              initialValue={String(value || '')}
              onChange={value => handleFieldChange(fieldConfig.field, value)}
              styles={fieldStyles}
            />
          )

        case 'cidr':
          return fieldContainer(
            <CIDRField
              label=""
              initialValue={String(value || '')}
              onChange={(
                eventOrNumber: React.ChangeEvent<HTMLInputElement> | number
              ) => {
                let cidrValue: number
                if (typeof eventOrNumber === 'number') {
                  cidrValue = eventOrNumber
                } else {
                  cidrValue = parseInt(
                    eventOrNumber.target.value.replace('/', ''),
                    10
                  )
                }
                handleFieldChange(
                  fieldConfig.field,
                  isNaN(cidrValue) ? 24 : cidrValue
                )
              }}
              styles={fieldStyles}
            />
          )

        case 'supernet': {
          const supernetValue = (() => {
            try {
              return typeof value === 'object'
                ? value
                : JSON.parse(String(value || '{}'))
            } catch {
              return { address: '', mask: 16 }
            }
          })() as SubnetFieldValue

          return fieldContainer(
            <SupernetField
              label=""
              value={supernetValue}
              onChange={(newValue: SubnetFieldValue) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              styles={fieldStyles}
            />
          )
        }

        case 'macAddress':
          return fieldContainer(
            <MACAddressField
              label=""
              initialValue={String(value || '')}
              onChange={value => handleFieldChange(fieldConfig.field, value)}
              styles={fieldStyles}
            />
          )

        default:
          // Default to TextField for any unknown types
          return fieldContainer(
            <TextField
              value={String(value || '')}
              onChange={(newValue: string) =>
                handleFieldChange(fieldConfig.field, newValue)
              }
              placeholder={fieldConfig.placeholder}
              styles={fieldStyles}
            />
          )
      }
    },
    [fieldValues, fieldErrors, fieldStyles, isSacredTheme, handleFieldChange]
  )

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
    >
      <div
        // Marks this Dialog as the composite-field editor so tests can
        // distinguish it from any other Dialog open on the page (e.g.
        // a confirm dialog or app-level modal).
        // - data-composite-modal: presence flag
        // - data-composite-row-id: the row being edited (when known)
        data-composite-modal="true"
        data-composite-row-id={(rowData?._id ?? rowData?.id) || undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Edit fields"
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 24px 0 24px',
            borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
            marginBottom: '24px',
          }}
        >
          <Typography
            text="Edit Fields"
            styles={{
              variant: 'cinzelh5',
              theme: isSacredTheme ? 'sacred' : 'light',
              fontSize: '24px',
              fontWeight: 700,
              color: isSacredTheme ? '#FFD700' : '#333',
            }}
          />
        </div>

        {/* Fields */}
        <div
          style={{
            padding: '0 24px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {compositeFields.map(renderField)}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '24px',
            borderTop: '1px solid rgba(255, 215, 0, 0.2)',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}
        >
          <CustomButton
            text="Cancel"
            onClick={handleCancel}
            action="cancel-composite"
            styles={{
              theme: isSacredTheme ? 'sacred' : 'light',
            }}
          />
          <CustomButton
            text="Save Changes"
            onClick={handleSave}
            action="save-composite"
            styles={{
              theme: isSacredTheme ? 'sacred' : 'light',
            }}
          />
        </div>
      </div>
    </Dialog>
  )
}

export default CompositeFieldEditModal

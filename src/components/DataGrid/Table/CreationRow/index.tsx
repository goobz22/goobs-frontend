'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { ColumnDef } from '../../types'
import type { DataGridStyles } from '../../../../theme'
import cssStyles from '../../DataGrid.module.css'
import TextField from '../../../Field/Text'
import DateField from '../../../Field/Date/DateField'
import SearchableSimple, {
  type DropdownOption,
} from '../../../Field/Dropdown/SearchableSimple'
import MultiSelectChip from '../../../Field/Dropdown/MultiSelect'
import InternalIncrementNumberField from '../../../Field/Number/InternalIncrement'
import PhoneNumberField from '../../../Field/PhoneNumber'
import CVV from '../../../Field/Number/CVV'
import CreditCardNumber from '../../../Field/Number/CreditCardNumber'
import AccountNumber from '../../../Field/Number/AccountNumber'
import RoutingNumber from '../../../Field/Number/RoutingNumber'
import Button from '../../../Button'
// IPAM field imports
import IPAddressField from '../../../Field/IPAM/Address'
import SubnetField, { type SubnetFieldValue } from '../../../Field/IPAM/Subnet'
import VLANField from '../../../Field/IPAM/VLAN'
import CIDRField from '../../../Field/IPAM/CIDR'
import SupernetField from '../../../Field/IPAM/Supernet'
import MACAddressField from '../../../Field/IPAM/MACAddress'
import USDField from '../../../Field/USD'
import CompositeFieldEditModal from '../../CompositeFieldEditModal'

interface CreationRowProps {
  columns: ColumnDef[]
  creationRowData: Record<string, any>
  onCreationFieldChange?: (field: string, value: any) => void
  onCreateRowSave?: () => void
  onCreateRowCancel?: () => void
  styles?: DataGridStyles
}

const CreationRow: React.FC<CreationRowProps> = ({
  columns,
  creationRowData,
  onCreationFieldChange,
  onCreateRowSave,
  onCreateRowCancel,
  styles,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const theme = styles?.theme || 'light'
  const [openModalField, setOpenModalField] = useState<string | null>(null)

  const renderCompositeFields = (column: ColumnDef) => {
    // Check if column.type is an array (composite fields)
    if (!Array.isArray(column.type)) return null

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        {column.type.map((fieldConfig: any) => {
          const value = creationRowData[fieldConfig.field]
          const fieldStyles = {
            theme: (isSacredTheme ? 'sacred' : 'light') as
              | 'light'
              | 'dark'
              | 'sacred',
            required: !!fieldConfig.required,
            fontSize: '12px',
            height: '35px',
            minHeight: '35px',
            padding: '6px 8px',
            borderRadius: '4px',
            helperTextType: 'error' as const,
            width: '100%',
          }

          return (
            <div key={fieldConfig.field} style={{ width: '100%' }}>
              <div
                style={{
                  fontSize: '10px',
                  marginBottom: '2px',
                  color: isSacredTheme ? 'rgba(255, 215, 0, 0.7)' : '#666',
                }}
              >
                {fieldConfig.label}
              </div>
              {renderFieldByConfig(fieldConfig, value, fieldStyles)}
            </div>
          )
        })}
      </div>
    )
  }

  const renderModalBasedCompositeField = (column: ColumnDef) => {
    if (!Array.isArray(column.type)) return null

    // Check if any of the composite fields have values
    const hasValues = column.type.some((fieldConfig: any) => {
      const value = creationRowData[fieldConfig.field]
      return (
        value !== undefined && value !== null && value !== '' && value !== 0
      )
    })

    // Always show button for modal-based composite fields
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '8px',
          width: '100%',
        }}
      >
        <button
          onClick={() => setOpenModalField(column.field)}
          style={{
            background: isSacredTheme
              ? 'rgba(255, 215, 0, 0.15)'
              : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
            color: isSacredTheme ? '#FFD700' : '#3B82F6',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: isSacredTheme ? 'Cinzel, serif' : 'inherit',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            padding: '4px 10px',
            borderRadius: '3px',
          }}
          type="button"
        >
          {hasValues ? 'Edit Details' : 'Add Details'}
        </button>
      </div>
    )
  }

  const handleModalSave = (field: string, values: Record<string, any>) => {
    // Update all the composite field values
    Object.keys(values).forEach(key => {
      onCreationFieldChange?.(key, values[key])
    })
  }

  const renderFieldByConfig = (
    fieldConfig: any,
    value: any,
    fieldStyles: any
  ) => {
    switch (fieldConfig.type) {
      case 'currency':
      case 'usd': {
        return (
          <USDField
            label="" // Explicitly pass empty label to override default
            initialValue={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )
      }
      case 'text':
        return (
          <TextField
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'date':
        return (
          <DateField
            value={
              value instanceof Date
                ? value
                : value
                  ? new Date(String(value))
                  : null
            }
            onChange={(newValue: Date | null) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'monthYear': {
        // Parse MM/YY or MM/YYYY format to Date
        let dateValue: Date | null = null
        if (value instanceof Date) {
          dateValue = value
        } else if (value) {
          const valueStr = String(value)
          const parts = valueStr.split('/')
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

        return (
          <DateField
            value={dateValue}
            onChange={(newValue: Date | null) => {
              if (newValue) {
                const month = String(newValue.getMonth() + 1).padStart(2, '0')
                const year = String(newValue.getFullYear()).slice(-2)
                onCreationFieldChange?.(fieldConfig.field, `${month}/${year}`)
              } else {
                onCreationFieldChange?.(fieldConfig.field, null)
              }
            }}
            variant="month-year"
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )
      }

      case 'searchableDropdown':
        return (
          <SearchableSimple
            label=""
            options={fieldConfig.options || []}
            defaultValue={String(value ?? '')}
            onChange={(option: DropdownOption | null) => {
              const valueToUse = String(option?.value || '')
              onCreationFieldChange?.(fieldConfig.field, valueToUse)
            }}
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'multiselect':
        return (
          <MultiSelectChip
            label=""
            options={fieldConfig.options || []}
            defaultSelected={Array.isArray(value) ? (value as string[]) : []}
            onChange={(values: string[]) =>
              onCreationFieldChange?.(fieldConfig.field, values)
            }
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'internalIncrement':
        return (
          <InternalIncrementNumberField
            initialValue={value?.toString() ?? '0'}
            onChange={(
              eventOrValue: React.ChangeEvent<HTMLInputElement> | number
            ) => {
              // Handle both React event and number values from the component
              let numValue: number
              if (typeof eventOrValue === 'number') {
                numValue = eventOrValue
              } else {
                // It's a React.ChangeEvent<HTMLInputElement>
                numValue = parseInt(eventOrValue.target.value, 10)
              }
              onCreationFieldChange?.(
                fieldConfig.field,
                isNaN(numValue) ? 0 : numValue
              )
            }}
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            {...(typeof fieldConfig.min === 'number'
              ? { min: fieldConfig.min }
              : {})}
            {...(typeof fieldConfig.max === 'number'
              ? { max: fieldConfig.max }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'dropdown':
        return (
          <SearchableSimple
            label=""
            options={fieldConfig.options || []}
            defaultValue={String(value ?? '')}
            onChange={(option: DropdownOption | null) => {
              const valueToUse = String(option?.value || '')
              onCreationFieldChange?.(fieldConfig.field, valueToUse)
            }}
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'phoneNumber':
        return (
          <PhoneNumberField
            label="" // Explicitly pass empty label to override default
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'cvv':
        return (
          <CVV
            label="" // Explicitly pass empty label to override default
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'creditCardNumber':
        return (
          <CreditCardNumber
            label="" // Explicitly pass empty label to override default
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'accountNumber':
        return (
          <AccountNumber
            label="" // Explicitly pass empty label to override default
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'routingNumber':
        return (
          <RoutingNumber
            label="" // Explicitly pass empty label to override default
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'ipAddress':
        return (
          <IPAddressField
            label="" // Explicitly pass empty label to override default
            initialValue={String(value ?? '')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onCreationFieldChange?.(fieldConfig.field, event.target.value)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.subnetAddress
              ? { subnetAddress: fieldConfig.subnetAddress }
              : {})}
            {...(typeof fieldConfig.subnetCIDR === 'number'
              ? { subnetCIDR: fieldConfig.subnetCIDR }
              : {})}
            {...(typeof fieldConfig.allowIncomplete === 'boolean'
              ? { allowIncomplete: fieldConfig.allowIncomplete }
              : {})}
            {...(typeof fieldConfig.autoInsertDots === 'boolean'
              ? { autoInsertDots: fieldConfig.autoInsertDots }
              : {})}
            {...(typeof fieldConfig.isGateway === 'boolean'
              ? { isGateway: fieldConfig.isGateway }
              : {})}
            {...(typeof fieldConfig.isRange === 'boolean'
              ? { isRange: fieldConfig.isRange }
              : {})}
            {...(typeof fieldConfig.isStartIP === 'boolean'
              ? { isStartIP: fieldConfig.isStartIP }
              : {})}
            {...(typeof fieldConfig.isEndIP === 'boolean'
              ? { isEndIP: fieldConfig.isEndIP }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'subnet':
        return (
          <SubnetField
            label="" // Explicitly pass empty label to override default
            value={
              (value as unknown as {
                address: string
                mask: number
              } | null) ?? {
                address: '',
                mask: 24,
              }
            }
            onChange={(newValue: SubnetFieldValue) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(typeof fieldConfig.required === 'boolean'
              ? { required: fieldConfig.required }
              : {})}
            {...(typeof fieldConfig.min === 'number'
              ? { min: fieldConfig.min }
              : {})}
            {...(typeof fieldConfig.max === 'number'
              ? { max: fieldConfig.max }
              : {})}
            {...(fieldConfig.maskType
              ? { maskType: fieldConfig.maskType }
              : {})}
            {...(fieldConfig.supernetAddress
              ? { supernetAddress: fieldConfig.supernetAddress }
              : {})}
            {...(fieldConfig.supernetMask !== undefined
              ? { supernetMask: fieldConfig.supernetMask?.toString() }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'vlan':
        return (
          <VLANField
            label="" // Explicitly pass empty label to override default
            initialValue={value?.toString() ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onCreationFieldChange?.(
                fieldConfig.field,
                parseInt(event.target.value) || 0
              )
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(Array.isArray(fieldConfig.reservedVLANs)
              ? { reservedVLANs: fieldConfig.reservedVLANs }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'cidr':
        return (
          <CIDRField
            label="" // Explicitly pass empty label to override default
            initialValue={value?.toString() ?? '24'}
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
              onCreationFieldChange?.(
                fieldConfig.field,
                isNaN(cidrValue) ? 24 : cidrValue
              )
            }}
            {...(typeof fieldConfig.min === 'number'
              ? { minCidr: fieldConfig.min }
              : {})}
            {...(typeof fieldConfig.max === 'number'
              ? { maxCidr: fieldConfig.max }
              : {})}
            {...(typeof fieldConfig.showSubnetInfo === 'boolean'
              ? { showSubnetInfo: fieldConfig.showSubnetInfo }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'supernet':
        return (
          <SupernetField
            label="" // Explicitly pass empty label to override default
            value={
              (value as unknown as {
                address: string
                mask: number
              } | null) ?? {
                address: '',
                mask: 16,
              }
            }
            onChange={(newValue: SubnetFieldValue) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(typeof fieldConfig.required === 'boolean'
              ? { required: fieldConfig.required }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'macAddress':
        return (
          <MACAddressField
            label="" // Explicitly pass empty label to override default
            initialValue={String(value ?? '')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onCreationFieldChange?.(fieldConfig.field, event.target.value)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            styles={fieldStyles}
          />
        )

      default:
        return (
          <TextField
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(fieldConfig.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { placeholder: fieldConfig.placeholder }
              : {})}
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )
    }
  }

  const renderCreationField = (column: ColumnDef) => {
    // Check if this is a composite field (type is an array)
    if (Array.isArray(column.type)) {
      // Check if column has useModalForCreation flag
      const columnWithModal = column as any
      if (columnWithModal.useModalForCreation) {
        return renderModalBasedCompositeField(column)
      }
      return renderCompositeFields(column)
    }

    // Otherwise, render single field using creationField config
    const fieldConfig = column.creationField
    if (!fieldConfig) return null

    const value = creationRowData[column.field] as
      | string
      | number
      | boolean
      | Date
      | string[]
      | null
      | undefined
    const fieldStyles = {
      theme: (isSacredTheme ? 'sacred' : 'light') as
        | 'light'
        | 'dark'
        | 'sacred',
      required: !!fieldConfig.required,
      fontSize: '14px',
      height: fieldConfig.type === 'internalIncrement' ? '48px' : '45px',
      minHeight: '45px',
      padding: '10px 12px',
      borderRadius: '4px',
      helperTextType: 'error' as const,
      width: '100%',
    }

    // Create a unified field config that works with renderFieldByConfig
    const unifiedFieldConfig = {
      ...fieldConfig,
      field: column.field,
    }

    return renderFieldByConfig(unifiedFieldConfig, value, fieldStyles)
  }

  // Render modal outside of table using portal
  const renderModal = () => {
    if (!openModalField || typeof document === 'undefined') return null

    const column = columns.find(
      col => col.field === openModalField && Array.isArray(col.type)
    )
    if (!column) return null

    const compositeFields = column.type as any[]

    return createPortal(
      <CompositeFieldEditModal
        open={true}
        onClose={() => setOpenModalField(null)}
        rowData={creationRowData}
        compositeFields={compositeFields}
        onSave={fieldUpdates => handleModalSave(column.field, fieldUpdates)}
        {...(styles ? { styles } : {})}
      />,
      document.body
    )
  }

  return (
    <>
      <tr className={cssStyles.creationRow} data-theme={theme}>
        {/* Checkbox column */}
        <td className={cssStyles.creationCell}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              text="Save"
              onClick={onCreateRowSave}
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
                fontSize: '12px',
                height: '28px',
                padding: '2px 8px',
                backgroundColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.1)'
                  : 'rgba(34, 197, 94, 0.1)',
                borderColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.5)'
                  : 'rgba(34, 197, 94, 0.5)',
              }}
            />
            <Button
              text="Cancel"
              onClick={onCreateRowCancel}
              styles={{
                theme: isSacredTheme ? 'sacred' : 'light',
                fontSize: '12px',
                height: '28px',
                padding: '2px 8px',
                backgroundColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                borderColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.5)'
                  : 'rgba(239, 68, 68, 0.5)',
              }}
            />
          </div>
        </td>

        {/* Data columns */}
        {columns.map(column => {
          const isComposite = Array.isArray(column.type)
          const hasCreationField = column.creationField || isComposite

          return (
            <td
              key={column.field}
              className={cssStyles.creationCell}
              style={{
                verticalAlign: isComposite ? 'top' : 'middle',
                height: isComposite ? 'auto' : '53px',
                minHeight: '53px',
              }}
            >
              {hasCreationField ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: isComposite ? 'flex-start' : 'center',
                    paddingTop: isComposite ? '4px' : '0',
                  }}
                >
                  {renderCreationField(column)}
                </div>
              ) : (
                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>—</span>
              )}
            </td>
          )
        })}
      </tr>

      {/* Render modal outside of table using portal */}
      {renderModal()}
    </>
  )
}

export default CreationRow

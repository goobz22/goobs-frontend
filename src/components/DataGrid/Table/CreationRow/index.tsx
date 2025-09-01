'use client'

import React from 'react'
import { ColumnDef } from '../../types'
import { getDataGridStyles } from '../../../../theme'
import type { DataGridStyles } from '../../../../theme'
import TextField from '../../../Field/Text'
import DateField from '../../../Field/Date/DateField'
import SearchableSimple from '../../../Field/Dropdown/SearchableSimple'
import MultiSelectChip from '../../../Field/Dropdown/MultiSelect'
import InternalIncrementNumberField from '../../../Field/Number/InternalIncrement'
import PhoneNumberField from '../../../Field/PhoneNumber'
import CVV from '../../../Field/Number/CVV'
import CreditCardNumber from '../../../Field/Number/CreditCardNumber'
import AccountNumber from '../../../Field/Number/AccountNumber'
import RoutingNumber from '../../../Field/Number/RoutingNumber'
import Button from '../../../Button'
import type { DropdownOption } from '../../../Field/Dropdown/SearchableSimple'
import type { SubnetFieldValue } from '../../../Field/IPAM/Subnet'
// IPAM field imports
import IPAddressField from '../../../Field/IPAM/Address'
import SubnetField from '../../../Field/IPAM/Subnet'
import VLANField from '../../../Field/IPAM/VLAN'
import CIDRField from '../../../Field/IPAM/CIDR'
import SupernetField from '../../../Field/IPAM/Supernet'
import MACAddressField from '../../../Field/IPAM/MACAddress'
import USDField from '../../../Field/USD'

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
  const computedStyles = getDataGridStyles(styles)
  const isSacredTheme = styles?.theme === 'sacred'

  const renderCreationField = (column: ColumnDef) => {
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
      height: fieldConfig.type === 'internalIncrement' ? '40px' : '32px', // 8px bigger for internal increment
      padding: '4px 8px',
      borderRadius: '4px',
      helperTextType: 'error' as const,
    }

    switch (fieldConfig.type) {
      case 'currency':
      case 'usd': {
        return (
          <USDField
            initialValue={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(column.field, newValue)
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
              onCreationFieldChange?.(column.field, newValue)
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
              onCreationFieldChange?.(column.field, newValue)
            }
            {...(fieldConfig.helperText
              ? { helperText: fieldConfig.helperText }
              : {})}
            styles={fieldStyles}
          />
        )

      case 'searchableDropdown':
        return (
          <SearchableSimple
            label=""
            options={fieldConfig.options || []}
            defaultValue={String(value ?? '')}
            onChange={(option: DropdownOption | null) => {
              // For state fields, use the abbreviation (attribute1) instead of the full name (value)
              const valueToUse =
                column.field === 'state'
                  ? option?.attribute1 || ''
                  : String(option?.value || '')
              onCreationFieldChange?.(column.field, valueToUse)
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
              onCreationFieldChange?.(column.field, values)
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
                column.field,
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
              // For state fields, use the abbreviation (attribute1) instead of the full name (value)
              const valueToUse =
                column.field === 'state'
                  ? option?.attribute1 || ''
                  : String(option?.value || '')
              onCreationFieldChange?.(column.field, valueToUse)
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
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(column.field, newValue)
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
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(column.field, newValue)
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
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(column.field, newValue)
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
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(column.field, newValue)
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
            value={String(value ?? '')}
            onChange={(newValue: string) =>
              onCreationFieldChange?.(column.field, newValue)
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
            initialValue={String(value ?? '')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onCreationFieldChange?.(column.field, event.target.value)
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
              onCreationFieldChange?.(column.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { label: fieldConfig.placeholder }
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
            initialValue={value?.toString() ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onCreationFieldChange?.(
                column.field,
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
                column.field,
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
              onCreationFieldChange?.(column.field, newValue)
            }
            {...(fieldConfig.placeholder
              ? { label: fieldConfig.placeholder }
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
            initialValue={String(value ?? '')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onCreationFieldChange?.(column.field, event.target.value)
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
              onCreationFieldChange?.(column.field, newValue)
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

  return (
    <tr
      style={{
        ...computedStyles.table.tableRow,
        backgroundColor: isSacredTheme
          ? 'rgba(255, 215, 0, 0.05)'
          : 'rgba(59, 130, 246, 0.05)',
        borderBottom: `2px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
      }}
    >
      {/* Checkbox column */}
      <td style={computedStyles.table.tableCell}>
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
      {columns.map(column => (
        <td
          key={column.field}
          style={{
            ...computedStyles.table.tableCell,
            padding: '8px',
            verticalAlign: 'top',
          }}
        >
          {column.creationField ? (
            <div style={{ width: '100%' }}>{renderCreationField(column)}</div>
          ) : (
            <span style={{ color: '#9CA3AF', fontSize: '12px' }}>—</span>
          )}
        </td>
      ))}
    </tr>
  )
}

export default CreationRow

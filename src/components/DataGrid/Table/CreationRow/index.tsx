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
// IPAM field imports
import IPAddressField from '../../../Field/IPAM/Address'
import SubnetField from '../../../Field/IPAM/Subnet'
import VLANField from '../../../Field/IPAM/VLAN'
import CIDRField from '../../../Field/IPAM/CIDR'
import SupernetField from '../../../Field/IPAM/Supernet'
import MACAddressField from '../../../Field/IPAM/MACAddress'

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

    const value = creationRowData[column.field]
    const fieldStyles = {
      theme: (isSacredTheme ? 'sacred' : 'light') as
        | 'light'
        | 'dark'
        | 'sacred',
      required: fieldConfig.required,
      fontSize: '14px',
      height: fieldConfig.type === 'internalIncrement' ? '40px' : '32px', // 8px bigger for internal increment
      padding: '4px 8px',
      borderRadius: '4px',
      helperTextType: 'error' as const,
    }

    switch (fieldConfig.type) {
      case 'text':
        return (
          <TextField
            value={value || ''}
            onChange={newValue =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'date':
        return (
          <DateField
            value={value || null}
            onChange={newValue =>
              onCreationFieldChange?.(column.field, newValue)
            }
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'searchableDropdown':
        return (
          <SearchableSimple
            label=""
            options={fieldConfig.options || []}
            defaultValue={value || ''}
            onChange={option => {
              // For state fields, use the abbreviation (attribute1) instead of the full name (value)
              const valueToUse =
                column.field === 'state'
                  ? option?.attribute1 || ''
                  : option?.value || ''
              onCreationFieldChange?.(column.field, valueToUse)
            }}
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'multiselect':
        return (
          <MultiSelectChip
            label=""
            options={fieldConfig.options || []}
            defaultSelected={Array.isArray(value) ? value : []}
            onChange={values => onCreationFieldChange?.(column.field, values)}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'internalIncrement':
        return (
          <InternalIncrementNumberField
            initialValue={value?.toString() || '0'}
            onChange={eventOrValue => {
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
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            min={fieldConfig.min}
            max={fieldConfig.max}
            styles={fieldStyles}
          />
        )

      case 'dropdown':
        return (
          <SearchableSimple
            label=""
            options={fieldConfig.options || []}
            defaultValue={value || ''}
            onChange={option => {
              // For state fields, use the abbreviation (attribute1) instead of the full name (value)
              const valueToUse =
                column.field === 'state'
                  ? option?.attribute1 || ''
                  : option?.value || ''
              onCreationFieldChange?.(column.field, valueToUse)
            }}
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'phoneNumber':
        return (
          <PhoneNumberField
            value={value || ''}
            onChange={newValue =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'cvv':
        return (
          <CVV
            value={value || ''}
            onChange={(newValue, _isValid) =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'creditCardNumber':
        return (
          <CreditCardNumber
            value={value || ''}
            onChange={(newValue, _isValid, _cardType) =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'accountNumber':
        return (
          <AccountNumber
            value={value || ''}
            onChange={(newValue, _isValid) =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'routingNumber':
        return (
          <RoutingNumber
            value={value || ''}
            onChange={(newValue, _isValid) =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'ipAddress':
        return (
          <IPAddressField
            initialValue={value || ''}
            onChange={event =>
              onCreationFieldChange?.(column.field, event.target.value)
            }
            placeholder={fieldConfig.placeholder}
            subnetAddress={fieldConfig.subnetAddress}
            subnetCIDR={fieldConfig.subnetCIDR}
            allowIncomplete={fieldConfig.allowIncomplete}
            autoInsertDots={fieldConfig.autoInsertDots}
            isGateway={fieldConfig.isGateway}
            isRange={fieldConfig.isRange}
            isStartIP={fieldConfig.isStartIP}
            isEndIP={fieldConfig.isEndIP}
            styles={fieldStyles}
          />
        )

      case 'subnet':
        return (
          <SubnetField
            value={value || { address: '', mask: 24 }}
            onChange={newValue =>
              onCreationFieldChange?.(column.field, newValue)
            }
            label={fieldConfig.placeholder}
            required={fieldConfig.required}
            min={fieldConfig.min}
            max={fieldConfig.max}
            maskType={fieldConfig.maskType}
            supernetAddress={fieldConfig.supernetAddress}
            supernetMask={fieldConfig.supernetMask?.toString()}
            styles={fieldStyles}
          />
        )

      case 'vlan':
        return (
          <VLANField
            initialValue={value?.toString() || ''}
            onChange={event =>
              onCreationFieldChange?.(
                column.field,
                parseInt(event.target.value) || 0
              )
            }
            placeholder={fieldConfig.placeholder}
            reservedVLANs={fieldConfig.reservedVLANs}
            styles={fieldStyles}
          />
        )

      case 'cidr':
        return (
          <CIDRField
            initialValue={value?.toString() || '24'}
            onChange={eventOrNumber => {
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
            minCidr={fieldConfig.min}
            maxCidr={fieldConfig.max}
            showSubnetInfo={fieldConfig.showSubnetInfo}
            helperText={fieldConfig.helperText}
            styles={fieldStyles}
          />
        )

      case 'supernet':
        return (
          <SupernetField
            value={value || { address: '', mask: 16 }}
            onChange={newValue =>
              onCreationFieldChange?.(column.field, newValue)
            }
            label={fieldConfig.placeholder}
            required={fieldConfig.required}
            styles={fieldStyles}
          />
        )

      case 'macAddress':
        return (
          <MACAddressField
            initialValue={value || ''}
            onChange={event =>
              onCreationFieldChange?.(column.field, event.target.value)
            }
            placeholder={fieldConfig.placeholder}
            styles={fieldStyles}
          />
        )

      default:
        return (
          <TextField
            value={value || ''}
            onChange={newValue =>
              onCreationFieldChange?.(column.field, newValue)
            }
            placeholder={fieldConfig.placeholder}
            helperText={fieldConfig.helperText}
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

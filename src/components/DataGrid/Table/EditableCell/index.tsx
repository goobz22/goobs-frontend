'use client'

import React from 'react'
import { ColumnDef } from '../../types'
import type { DataGridStyles } from '../../../../theme'
// Field component imports
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
import USDField from '../../../Field/USD'
// IPAM field imports
import IPAddressField from '../../../Field/IPAM/Address'
import SubnetField from '../../../Field/IPAM/Subnet'
import VLANField from '../../../Field/IPAM/VLAN'
import CIDRField from '../../../Field/IPAM/CIDR'
import SupernetField from '../../../Field/IPAM/Supernet'
import MACAddressField from '../../../Field/IPAM/MACAddress'
import type { SubnetFieldValue } from '../../../Field/IPAM/Subnet'
import type { DropdownOption } from '../../../Field/Dropdown/SearchableSimple'

interface EditableCellProps {
  column: ColumnDef
  value: unknown
  editingValue: string
  onEditingValueChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  styles?: DataGridStyles | undefined
}

const EditableCell: React.FC<EditableCellProps> = ({
  column,
  value,
  editingValue,
  onEditingValueChange,
  onSave,
  onCancel,
  styles,
}) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const cellRef = React.useRef<HTMLDivElement>(null)

  // Handle click outside the entire cell to save
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Find the table cell (td) that contains our field
      const tdElement = cellRef.current?.closest('td')

      // If click is outside the entire table cell, save and exit
      if (tdElement && !tdElement.contains(event.target as Node)) {
        onSave()
      }
      // If click is inside the cell (whether on field or not), do nothing
      // This prevents the re-edit issue while still allowing interaction with the field
    }

    // Add event listener with a small delay to avoid catching the initial click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onSave])

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  // Common field styles for all field components - matching creation row
  const fieldStyles = {
    theme: (isSacredTheme ? 'sacred' : 'light') as 'light' | 'dark' | 'sacred',
    fontSize: '14px',
    height: '45px', // Match creation row height
    minHeight: '45px',
    padding: '10px 12px', // Match creation row padding
    borderRadius: '4px',
    width: '100%',
    backgroundColor: isSacredTheme ? 'rgba(0, 0, 0, 0.8)' : 'white',
    borderColor: isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#ccc',
  }

  // Get the field configuration from creationField or column type
  const fieldConfig = column.creationField
  const fieldType = fieldConfig?.type || column.type || 'text'

  // Render the appropriate field component based on type
  switch (fieldType) {
    case 'currency':
    case 'usd':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <USDField
            label=""
            initialValue={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            styles={fieldStyles}
          />
        </div>
      )

    case 'text':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <TextField
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onKeyDown={handleKeyDown}
            styles={fieldStyles}
          />
        </div>
      )

    case 'date':
      return (
        <div
          ref={cellRef}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%' }}
        >
          <DateField
            value={editingValue ? new Date(editingValue) : null}
            onChange={(newValue: Date | null) =>
              onEditingValueChange(newValue ? newValue.toISOString() : '')
            }
            styles={fieldStyles}
          />
        </div>
      )

    case 'monthYear': {
      // Parse MM/YY or MM/YYYY format to Date
      let dateValue: Date | null = null
      if (editingValue) {
        const parts = editingValue.split('/')
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
        <div
          ref={cellRef}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%' }}
        >
          <DateField
            value={dateValue}
            onChange={(newValue: Date | null) => {
              if (newValue) {
                const month = String(newValue.getMonth() + 1).padStart(2, '0')
                const year = String(newValue.getFullYear()).slice(-2)
                onEditingValueChange(`${month}/${year}`)
              } else {
                onEditingValueChange('')
              }
            }}
            variant="month-year"
            styles={fieldStyles}
          />
        </div>
      )
    }

    case 'searchableDropdown':
    case 'dropdown':
      const options = fieldConfig?.options || column.dropdownOptions || []
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <SearchableSimple
            label=""
            options={options}
            defaultValue={editingValue}
            onChange={(option: DropdownOption | null) => {
              const valueToUse = String(option?.value || '')
              onEditingValueChange(valueToUse)
              // Auto-save on selection
              setTimeout(onSave, 0)
            }}
            styles={fieldStyles}
          />
        </div>
      )

    case 'multiselect':
      const multiOptions = fieldConfig?.options || []
      let currentValues: string[] = []
      try {
        currentValues = Array.isArray(value) ? value : JSON.parse(editingValue)
      } catch {
        currentValues = Array.isArray(value) ? value : []
      }

      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <MultiSelectChip
            label=""
            defaultSelected={currentValues}
            onChange={(selectedIds: string[]) => {
              onEditingValueChange(JSON.stringify(selectedIds))
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
        </div>
      )

    case 'internalIncrement':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <InternalIncrementNumberField
            initialValue={editingValue}
            onChange={(
              eventOrValue: React.ChangeEvent<HTMLInputElement> | number
            ) => {
              let numValue: number
              if (typeof eventOrValue === 'number') {
                numValue = eventOrValue
              } else {
                numValue = parseInt(eventOrValue.target.value, 10)
              }
              onEditingValueChange(isNaN(numValue) ? '0' : String(numValue))
            }}
            styles={fieldStyles}
          />
        </div>
      )

    case 'phoneNumber':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <PhoneNumberField
            label=""
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onBlur={onSave}
            styles={fieldStyles}
          />
        </div>
      )

    case 'cvv':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <CVV
            label=""
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onBlur={onSave}
            styles={fieldStyles}
          />
        </div>
      )

    case 'creditCardNumber':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <CreditCardNumber
            label=""
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onBlur={onSave}
            styles={fieldStyles}
          />
        </div>
      )

    case 'accountNumber':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <AccountNumber
            label=""
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onBlur={onSave}
            styles={fieldStyles}
          />
        </div>
      )

    case 'routingNumber':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <RoutingNumber
            label=""
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onBlur={onSave}
            styles={fieldStyles}
          />
        </div>
      )

    case 'ipAddress':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <IPAddressField
            label=""
            initialValue={editingValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onEditingValueChange(event.target.value)
            }
            styles={fieldStyles}
          />
        </div>
      )

    case 'subnet':
      const subnetValue = (() => {
        try {
          return typeof value === 'object' ? value : JSON.parse(editingValue)
        } catch {
          return { address: '', mask: 24 }
        }
      })() as SubnetFieldValue

      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <SubnetField
            label=""
            value={subnetValue}
            onChange={(newValue: SubnetFieldValue) =>
              onEditingValueChange(JSON.stringify(newValue))
            }
            styles={fieldStyles}
          />
        </div>
      )

    case 'vlan':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <VLANField
            label=""
            initialValue={editingValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onEditingValueChange(event.target.value)
            }
            styles={fieldStyles}
          />
        </div>
      )

    case 'cidr':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <CIDRField
            label=""
            initialValue={editingValue}
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
              onEditingValueChange(isNaN(cidrValue) ? '24' : String(cidrValue))
            }}
            styles={fieldStyles}
          />
        </div>
      )

    case 'supernet':
      const supernetValue = (() => {
        try {
          return typeof value === 'object' ? value : JSON.parse(editingValue)
        } catch {
          return { address: '', mask: 16 }
        }
      })() as SubnetFieldValue

      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <SupernetField
            label=""
            value={supernetValue}
            onChange={(newValue: SubnetFieldValue) =>
              onEditingValueChange(JSON.stringify(newValue))
            }
            styles={fieldStyles}
          />
        </div>
      )

    case 'macAddress':
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <MACAddressField
            label=""
            initialValue={editingValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onEditingValueChange(event.target.value)
            }
            styles={fieldStyles}
          />
        </div>
      )

    default:
      // Default to TextField for any unknown types
      return (
        <div ref={cellRef} style={{ width: '100%' }}>
          <TextField
            value={editingValue}
            onChange={(newValue: string) => onEditingValueChange(newValue)}
            onKeyDown={handleKeyDown}
            styles={fieldStyles}
          />
        </div>
      )
  }
}

export default EditableCell

'use client'

import React from 'react'
import SubnetField from '../Subnet'
import type { FieldStyleOverrides } from '../../Shell'

export interface SupernetFieldValue {
  address: string
  mask: number
}

export interface SupernetFieldProps {
  /**
   * Object payload — same `{ address, mask }` shape as SubnetFieldValue
   * (this component is a thin Subnet wrapper with /8-/23 mask range).
   */
  value: SupernetFieldValue
  onChange: (value: SupernetFieldValue) => void
  label?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  styles?: FieldStyleOverrides
}

// SupernetField now uses SubnetField for both address and mask, with
// the mask range narrowed to the supernet bracket (/8 - /23).
const SupernetField: React.FC<SupernetFieldProps> = ({
  value,
  onChange,
  label = 'Supernet',
  required = false,
  disabled = false,
  helperText,
  error,
  dataField,
  dataFieldName,
  styles,
}) => {
  return (
    <SubnetField
      value={value}
      onChange={onChange}
      label={label}
      required={required}
      disabled={disabled}
      min={8}
      max={23}
      maskType="supernet"
      {...(helperText !== undefined ? { helperText } : {})}
      {...(error !== undefined ? { error } : {})}
      {...(dataField !== undefined ? { dataField } : {})}
      {...(dataFieldName !== undefined ? { dataFieldName } : {})}
      {...(styles !== undefined ? { styles } : {})}
    />
  )
}

SupernetField.displayName = 'SupernetField'

export default SupernetField

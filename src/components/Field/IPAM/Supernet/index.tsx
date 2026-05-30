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
  /**
   * Form-engine binding key. Forwarded to the underlying SubnetField, which
   * owns the Tier-1 `{ address, mask }` binding. Inside a `<Form>` with `name`
   * and no explicit `value`, the object is read from / written to the engine;
   * outside a form (every existing callsite passes a `value`) it is inert.
   */
  name?: string
  styles?: FieldStyleOverrides
}

// SupernetField now uses SubnetField for both address and mask, with
// the mask range narrowed to the supernet bracket (/8 - /23). The Tier-1
// form binding is owned by SubnetField; SupernetField simply forwards `name`
// so the engine binds the supernet object under that key.
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
  name,
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
      {...(name !== undefined ? { name } : {})}
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

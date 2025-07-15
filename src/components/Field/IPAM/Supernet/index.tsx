'use client'

import React from 'react'
import SubnetField from '../Subnet'
import { FormFieldStyles } from '../../../../theme'

export interface SupernetFieldValue {
  address: string
  mask: number
}

export interface SupernetFieldProps {
  value: SupernetFieldValue
  onChange: (value: SupernetFieldValue) => void
  label?: string
  required?: boolean
  styles?: FormFieldStyles
  // ...other props as needed
}

// SupernetField now uses SubnetField for both address and mask
const SupernetField: React.FC<SupernetFieldProps> = ({
  value,
  onChange,
  label = 'Supernet',
  required = false,
  styles,
}) => {
  return (
    <SubnetField
      value={value}
      onChange={onChange}
      label={label}
      required={required}
      min={8}
      max={23}
      maskType="supernet"
      styles={styles}
    />
  )
}

export default SupernetField

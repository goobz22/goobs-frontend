'use client'
import React from 'react'
import DateField, { DateFieldProps } from '../../../Field/Date/DateField'

export interface UseDateFieldProps {
  dateField?: DateFieldProps | DateFieldProps[]
}

export type { DateFieldProps }

const DateFieldComponent: React.FC<DateFieldProps> = ({
  onChange,
  label = 'Select Date',
  value,
  helperText,
  styles,
  ...rest
}) => {
  return (
    <DateField
      onChange={onChange}
      label={label}
      value={value}
      helperText={helperText}
      styles={styles}
      {...rest}
    />
  )
}

export const useDateField = ({
  dateField,
}: UseDateFieldProps): React.ReactElement[] => {
  if (!dateField) return []

  const fields = Array.isArray(dateField) ? dateField : [dateField]

  return fields.map((field, index) => (
    <DateFieldComponent key={index} {...field} />
  ))
}

export default useDateField

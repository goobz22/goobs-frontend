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
  sacredtheme = false,
  disabled = false,
  error = false,
  helperText,
  style,
  ...rest
}) => {
  return (
    <div style={style}>
      <DateField
        onChange={onChange}
        label={label}
        value={value}
        sacredtheme={sacredtheme}
        disabled={disabled}
        error={error}
        helperText={helperText}
        {...rest}
      />
    </div>
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

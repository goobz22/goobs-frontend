'use client'
import React from 'react'
import { Box } from '@mui/material'
import DateField, { DateFieldProps } from '../../../Field/Date/DateField'

export interface UseDateFieldProps {
  dateField?: DateFieldProps | DateFieldProps[]
}

export type { DateFieldProps }

const DateFieldComponent: React.FC<DateFieldProps> = ({
  onChange,
  label = 'Select Date',
  value,
  sacredTheme = false,
  disabled = false,
  error = false,
  helperText,
  sx,
  style,
  ...rest
}) => {
  return (
    <Box style={style}>
      <DateField
        onChange={onChange}
        label={label}
        value={value}
        sacredTheme={sacredTheme}
        disabled={disabled}
        error={error}
        helperText={helperText}
        sx={sx}
        {...rest}
      />
    </Box>
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

'use client'

import React, { useState, useCallback } from 'react'
import { Box, InputAdornment } from '@mui/material'
import TextField, { TextFieldProps } from '../Text'
import { black } from '../../../styles/palette'

export interface USDFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (value: string) => void
  label?: string
  min?: number
  max?: number
  precision?: number
  readOnly?: boolean
}

const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')

  // Handle empty input
  if (!numericValue) return ''

  // Allow manual decimal input
  if (numericValue === '.') return '.'

  // Handle multiple decimal points - keep only the first one
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`
  }

  // If there's a decimal point, allow manual input
  if (numericValue.includes('.')) {
    return numericValue
  }

  // For whole numbers, convert and format
  const number = parseFloat(numericValue)
  if (isNaN(number)) return ''

  return number.toString()
}

const USDField: React.FC<USDFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'Amount',
  min,
  max,
  precision = 2,
  readOnly = false,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return

      const newValue = event.target.value
      const formattedValue = formatCurrency(newValue)

      // Validate min/max if provided
      const numericValue = parseFloat(formattedValue)
      if (!isNaN(numericValue)) {
        if (min !== undefined && numericValue < min) {
          setValue(min.toFixed(precision))
          onChange?.(min.toFixed(precision))
          return
        }
        if (max !== undefined && numericValue > max) {
          setValue(max.toFixed(precision))
          onChange?.(max.toFixed(precision))
          return
        }
      }

      setValue(formattedValue)
      onChange?.(formattedValue)
    },
    [onChange, precision, min, max, readOnly]
  )

  return (
    <Box>
      <TextField
        value={value}
        onChange={handleChange}
        label={label}
        type="text"
        inputMode="decimal"
        variant="outlined"
        slotProps={{
          input: {
            readOnly,
            startAdornment: (
              <InputAdornment position="start" sx={{ color: black.main }}>
                $
              </InputAdornment>
            ),
            sx: {
              '& .MuiInputBase-input': {
                marginLeft: '-10px',
              },
              '&::placeholder': {
                marginLeft: '-10px',
              },
            },
          },
        }}
        {...rest}
      />
    </Box>
  )
}

export default USDField

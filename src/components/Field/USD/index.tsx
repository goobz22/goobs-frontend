'use client'

import React, { useState, useCallback } from 'react'
import { Box, InputAdornment, alpha, keyframes } from '@mui/material'
import TextField, { TextFieldProps } from '../Text'
import { black } from '../../../styles/palette'

// Sacred animations
const goldShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.1); }
  100% { transform: translateY(0px) scale(1); }
`

export interface USDFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (value: string) => void
  label?: string
  min?: number
  max?: number
  precision?: number
  readOnly?: boolean
  /** Enable sacred Egyptian theme */
  sacredTheme?: boolean
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
  sacredTheme = false,
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

  const DollarAdornment = () => (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {sacredTheme && (
        <Box
          sx={{
            position: 'absolute',
            left: '-15px',
            color: alpha('#FFD700', 0.4),
            fontSize: '12px',
            animation: `${floatGlyph} 3s ease-in-out infinite`,
          }}
        >
          𓊹
        </Box>
      )}
      <Box
        sx={{
          color: sacredTheme ? '#FFD700' : black.main,
          fontWeight: sacredTheme ? 600 : 400,
          fontSize: sacredTheme ? '18px' : '16px',
          ...(sacredTheme && {
            background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
            backgroundSize: '200% 100%',
            animation: `${goldShimmer} 3s linear infinite`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
          }),
        }}
      >
        $
      </Box>
    </Box>
  )

  return (
    <Box>
      <TextField
        value={value}
        onChange={handleChange}
        label={sacredTheme ? 'Sacred Treasury' : label}
        type="text"
        inputMode="decimal"
        variant="outlined"
        placeholder={sacredTheme ? 'Divine wealth...' : undefined}
        sacredTheme={sacredTheme}
        slotProps={{
          input: {
            readOnly,
            startAdornment: (
              <InputAdornment position="start">
                <DollarAdornment />
              </InputAdornment>
            ),
            sx: {
              '& .MuiInputBase-input': {
                marginLeft: sacredTheme ? '5px' : '-10px',
              },
              '&::placeholder': {
                marginLeft: sacredTheme ? '5px' : '-10px',
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

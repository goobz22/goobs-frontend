'use client'
import React, { useState, useCallback } from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface NumberFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: () => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
  min?: number
  max?: number
}

const StyledTextField = styled(TextField)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}>(({ theme, backgroundcolor, outlinecolor, fontcolor }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: backgroundcolor || theme.palette.background.paper,
    '& fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: fontcolor || theme.palette.text.primary,
    '&.Mui-focused': {
      color: fontcolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: fontcolor || theme.palette.text.primary,
  },
}))

const NumberField: React.FC<NumberFieldProps> = ({
  initialValue = '',
  onChange,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  label,
  min,
  max,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value.replace(/[^0-9]/g, '')
      if (newValue === '') {
        setValue('')
        onChange?.()
        return
      }
      const numValue = parseInt(newValue, 10)
      if (min !== undefined && numValue < min) {
        setValue(min.toString())
      } else if (max !== undefined && numValue > max) {
        setValue(max.toString())
      } else {
        setValue(newValue)
      }
      onChange?.()
    },
    [onChange, min, max]
  )

  return (
    <StyledTextField
      value={value}
      onChange={handleChange}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      fontcolor={fontcolor}
      label={label}
      variant="outlined"
      type="text"
      inputMode="numeric"
      {...rest}
    />
  )
}

export default NumberField

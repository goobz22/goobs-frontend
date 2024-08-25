'use client'
import React, { useState, useCallback } from 'react'
import { TextField, Button, Box, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface IncrementNumberFieldProps
  extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: () => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
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
    textAlign: 'center',
    padding: '8px 0',
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  padding: 0,
  height: '100%',
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[400],
  },
}))

const IncrementNumberField: React.FC<IncrementNumberFieldProps> = ({
  initialValue = '0',
  onChange,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  label,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)

  const handleIncrement = useCallback(() => {
    setValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '0'
      }
      const newValue = (num + 1).toString()
      onChange?.()
      return newValue
    })
  }, [onChange])

  const handleDecrement = useCallback(() => {
    setValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '0'
      }
      const newValue = Math.max(0, num - 1).toString()
      onChange?.()
      return newValue
    })
  }, [onChange])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = event.target.value.replace(/[^0-9]/g, '')
      const newValue = numValue === '' ? '0' : numValue
      setValue(newValue)
      onChange?.()
    },
    [onChange]
  )

  return (
    <Box display="flex" alignItems="center">
      <StyledButton onClick={handleDecrement}>-</StyledButton>
      <StyledTextField
        value={value}
        onChange={handleChange}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        label={label}
        variant="outlined"
        size="small"
        inputProps={{ style: { width: '40px' } }}
        {...rest}
      />
      <StyledButton onClick={handleIncrement}>+</StyledButton>
    </Box>
  )
}

export default IncrementNumberField

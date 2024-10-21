'use client'

import React, { useState } from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
  FormHelperText,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'

export interface SimpleDropdownOption {
  value: string
}

export interface ComplexDropdownOption extends SimpleDropdownOption {
  attribute1?: string
  attribute2?: string
}

export type DropdownOption = SimpleDropdownOption | ComplexDropdownOption

export interface DropdownProps extends Omit<SelectProps, 'onChange'> {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
  onChange?: SelectProps['onChange']
  error?: boolean
  helperText?: string
  name?: string
  required?: boolean
  onBlur?: SelectProps['onBlur']
  onFocus?: SelectProps['onFocus']
}

const StyledFormControl = styled(FormControl)<{
  backgroundcolor?: string
  outlinecolor?: string
}>(({ theme, backgroundcolor, outlinecolor }) => ({
  width: '100%',
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
}))

const StyledInputLabel = styled(InputLabel)<{ shrunkfontcolor?: string }>(
  ({ theme, shrunkfontcolor }) => ({
    '&.Mui-focused': {
      color: shrunkfontcolor || theme.palette.primary.main,
    },
  })
)

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}))

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  shrunkfontcolor,
  onChange,
  error = false,
  helperText,
  name,
  required = false,
  onBlur,
  onFocus,
  ...rest
}) => {
  const [selectedValue, setSelectedValue] = useState(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    return defaultOption ? defaultOption.value : ''
  })

  const handleChange: SelectProps['onChange'] = (event, child) => {
    const newValue = event.target.value as string
    setSelectedValue(newValue)
    onChange?.(event, child)
  }

  const handleBlur: SelectProps['onBlur'] = event => {
    onBlur?.(event)
  }

  const handleFocus: SelectProps['onFocus'] = event => {
    onFocus?.(event)
  }

  const renderMenuItem = (option: DropdownOption) => {
    const label = capitalizeFirstLetter(option.value.replace(/_/g, ' '))
    if (!('attribute1' in option)) {
      return (
        <MenuItem key={option.value} value={option.value}>
          {label}
        </MenuItem>
      )
    } else {
      return (
        <StyledMenuItem key={option.value} value={option.value}>
          <Typography variant="body1">{label}</Typography>
          <Typography variant="caption" color="textSecondary">
            {option.attribute1}
            {option.attribute2 && ` | ${option.attribute2}`}
          </Typography>
        </StyledMenuItem>
      )
    }
  }

  return (
    <StyledFormControl
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      error={error}
      required={required}
    >
      <StyledInputLabel id={`${name}-label`} shrunkfontcolor={shrunkfontcolor}>
        {label}
      </StyledInputLabel>
      <Select
        labelId={`${name}-label`}
        value={selectedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        label={label}
        sx={{ color: fontcolor }}
        name={name}
        aria-labelledby={`${name}-label`}
        {...rest}
      >
        {options.map(renderMenuItem)}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  )
}

export default Dropdown

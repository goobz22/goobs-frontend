'use client'

import React, { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
  FormHelperText,
  Box,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../styles/palette'
import Typography from '../Typography'

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

const StyledBox = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '50px',
  marginTop: '5px',
}))

const StyledFormControl = styled(FormControl)<{
  backgroundcolor?: string
  outlinecolor?: string
}>(({ outlinecolor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  '& .MuiOutlinedInput-root': {
    backgroundColor: white.main,
    height: '45px',
    '& fieldset': {
      borderColor: outlinecolor || black.main,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor || black.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor || black.main,
    },
  },
}))

const StyledInputLabel = styled(InputLabel)<{ shrunkfontcolor?: string }>(
  () => ({
    color: black.main,
    '&.Mui-focused': {
      color: black.main,
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(13px, -7px) scale(0.75)',
      color: black.main,
    },
  })
)

const StyledMenuItem = styled(MenuItem)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: white.main,
}))

const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50px',
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
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    setSelectedValue(defaultOption ? defaultOption.value : '')
    setIsLoading(false)
  }, [defaultValue, options])

  const handleChange: SelectProps['onChange'] = (event, child) => {
    const newValue = event.target.value as string
    setSelectedValue(newValue)
    if (onChange) {
      onChange(event, child)
    }
  }

  const handleBlur: SelectProps['onBlur'] = event => {
    if (onBlur) {
      onBlur(event)
    }
  }

  const handleFocus: SelectProps['onFocus'] = event => {
    if (onFocus) {
      onFocus(event)
    }
  }

  const renderMenuItem = (option: DropdownOption) => {
    const label = capitalizeFirstLetter(option.value.replace(/_/g, ' '))
    if (!('attribute1' in option)) {
      return (
        <MenuItem key={option.value} value={option.value}>
          <Typography fontvariant="merriparagraph" text={label} />
        </MenuItem>
      )
    } else {
      return (
        <StyledMenuItem key={option.value} value={option.value}>
          <Typography fontvariant="merriparagraph" text={label} />
          <Typography
            fontvariant="merriparagraph"
            text={`${option.attribute1}${option.attribute2 ? ` | ${option.attribute2}` : ''}`}
            fontcolor="textSecondary"
          />
        </StyledMenuItem>
      )
    }
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress size={24} />
      </LoadingContainer>
    )
  }

  return (
    <StyledBox>
      <StyledFormControl
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        error={error}
        required={required}
        fullWidth
      >
        <StyledInputLabel
          id={`${name}-label`}
          shrunkfontcolor={shrunkfontcolor}
        >
          {label}
        </StyledInputLabel>
        <Select
          labelId={`${name}-label`}
          value={selectedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          label={label}
          sx={{
            color: fontcolor || black.main,
            height: '45px',
            backgroundColor: white.main,
            '& .MuiSelect-select': {
              paddingTop: '10px',
              paddingBottom: '10px',
            },
            '& .MuiSvgIcon-root': {
              color: black.main,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: black.main,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: black.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: black.main,
            },
            '& .MuiInputBase-input': {
              color: black.main,
            },
            '& .MuiInputBase-input::placeholder': {
              color: black.main,
              opacity: 1,
            },
            '& .MuiPaper-root': {
              backgroundColor: white.main,
            },
            '& .MuiMenu-list': {
              backgroundColor: white.main,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: white.main,
              },
            },
          }}
          name={name}
          aria-labelledby={`${name}-label`}
          {...rest}
        >
          {options.map(renderMenuItem)}
        </Select>
        {helperText && (
          <FormHelperText>
            <Typography fontvariant="merriparagraph" text={helperText} />
          </FormHelperText>
        )}
      </StyledFormControl>
    </StyledBox>
  )
}

export default Dropdown

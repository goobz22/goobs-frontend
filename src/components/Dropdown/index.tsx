'use client'

import React, { useState, useEffect } from 'react'
import { MenuItem, Box, styled } from '@mui/material'
import Typography from '../Typography'
import TextField from '../TextField' // <-- Import your custom TextField here
import { white } from '../../styles/palette' // <-- removed 'black' since we don't use it

// -----------------------------
// Types
// -----------------------------
export interface SimpleDropdownOption {
  value: string
}

export interface ComplexDropdownOption extends SimpleDropdownOption {
  attribute1?: string
  attribute2?: string
}

export type DropdownOption = SimpleDropdownOption | ComplexDropdownOption

export interface DropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  name?: string
  required?: boolean
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  /**
   * Set this to true if you want the browser to allow autocompletion
   */
  autocomplete?: boolean
  /**
   * If you need to control the value from outside, pass it via `value`.
   * Otherwise, rely on `defaultValue`.
   */
  value?: string
}

// -----------------------------
// Styles
// -----------------------------
const StyledBox = styled(Box)(() => ({
  width: '100%',
  marginTop: '10px',
}))

const StyledMenuItem = styled(MenuItem)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: white.main,
}))

// -----------------------------
// Utility
// -----------------------------
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

// -----------------------------
// Component
// -----------------------------
const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  shrunkfontcolor,
  unshrunkfontcolor,
  shrunklabelposition = 'onNotch',
  onChange,
  error = false,
  helperText,
  name,
  required = false,
  onBlur,
  onFocus,
  autocomplete,
  value: externalValue,
}) => {
  // -----------------------------
  // Determine initial value
  // -----------------------------
  let initialSelected = ''

  if (externalValue !== undefined && externalValue !== '') {
    initialSelected = externalValue
  } else if (defaultValue) {
    const defaultOption = options.find(opt => opt.value === defaultValue)
    if (defaultOption) {
      initialSelected = defaultOption.value
    }
  }

  // -----------------------------
  // Local State
  // -----------------------------
  const [selectedValue, setSelectedValue] = useState<string>(initialSelected)

  // -----------------------------
  // Sync with external value
  // -----------------------------
  useEffect(() => {
    if (externalValue !== undefined) {
      setSelectedValue(externalValue)
    }
  }, [externalValue])

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSelectedValue(newValue)
    onChange?.(event)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
  }

  // -----------------------------
  // Render function
  // -----------------------------
  const renderMenuItem = (option: DropdownOption) => {
    const itemLabel = capitalizeFirstLetter(option.value.replace(/_/g, ' '))

    if (!('attribute1' in option)) {
      // Simple
      return (
        <MenuItem key={option.value} value={option.value}>
          <Typography fontvariant="merriparagraph" text={itemLabel} />
        </MenuItem>
      )
    } else {
      // Complex
      return (
        <StyledMenuItem key={option.value} value={option.value}>
          <Typography fontvariant="merriparagraph" text={itemLabel} />
          <Typography
            fontvariant="merriparagraph"
            text={`${option.attribute1}${
              option.attribute2 ? ` | ${option.attribute2}` : ''
            }`}
            fontcolor="textSecondary"
          />
        </StyledMenuItem>
      )
    }
  }

  return (
    <StyledBox>
      <TextField
        select
        fullWidth
        variant="outlined"
        name={name}
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={selectedValue}
        autoComplete={autocomplete ? 'on' : 'off'}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        shrunkfontcolor={shrunkfontcolor}
        unshrunkfontcolor={unshrunkfontcolor}
        shrunklabelposition={shrunklabelposition}
        // If you need more MUI Select menu props, pass via `SelectProps` in `slotProps`
        slotProps={{
          select: {
            MenuProps: {
              PaperProps: {
                sx: {
                  backgroundColor: white.main,
                },
              },
            },
          },
        }}
      >
        {options.map(renderMenuItem)}
      </TextField>
    </StyledBox>
  )
}

export default Dropdown

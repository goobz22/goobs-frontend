'use client'

import { Checkbox } from '@mui/material'
import React from 'react'
import * as palette from '../../styles/palette'

export interface CheckboxProps {
  onClick?: (event: React.MouseEvent) => void
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

function CustomCheckbox({
  onClick,
  checked,
  indeterminate,
  onChange,
  disabled,
  ...props
}: CheckboxProps) {
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(event)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()

    if (onChange) {
      onChange(event)
    }
  }

  return (
    <Checkbox
      sx={{
        color: palette.marine.main,
        '&.Mui-checked': {
          color: palette.marine.main,
        },
        '&.Mui-indeterminate': {
          color: palette.marine.main,
        },
        '&.Mui-disabled': {
          color: palette.grey.main,
        },
        '&:hover': {
          backgroundColor: palette.marine.light,
          opacity: 0.1,
        },
      }}
      checked={checked}
      indeterminate={indeterminate}
      onClick={handleClick}
      onChange={handleChange}
      disabled={disabled}
      {...props}
    />
  )
}

export default CustomCheckbox

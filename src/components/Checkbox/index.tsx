'use client'

import { Checkbox, styled } from '@mui/material'
import React from 'react'
import * as palette from '../../styles/palette'

export interface CheckboxProps {
  onClick?: (event: React.MouseEvent) => void
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

// Create a styled version of MUI Checkbox with our custom styles
const StyledCheckbox = styled(Checkbox)(() => ({
  padding: '8px',
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  },
  // Style for unchecked state
  '&:not(.Mui-checked):not(.Mui-indeterminate):not(.Mui-disabled)': {
    '& .MuiSvgIcon-root': {
      color: 'transparent',
      // Add a visible background to make it obvious it's a checkbox
      backgroundColor: palette.grey.light,
      border: `2px solid ${palette.marine.main}`,
      borderRadius: '3px',
    },
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    color: palette.marine.main,
    border: 'none',
  },
  '&.Mui-indeterminate .MuiSvgIcon-root': {
    color: palette.marine.main,
    border: 'none',
  },
  '&.Mui-disabled .MuiSvgIcon-root': {
    color: palette.grey.main,
    border: `2px solid ${palette.grey.main}`,
    borderRadius: '3px',
  },
  '&:hover': {
    backgroundColor: `${palette.marine.light}33`,
  },
}))

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
    <StyledCheckbox
      checked={checked}
      indeterminate={indeterminate}
      onClick={handleClick}
      onChange={handleChange}
      disabled={disabled}
      disableRipple
      {...props}
    />
  )
}

export default CustomCheckbox

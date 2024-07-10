import React, { useState } from 'react'
import { InputAdornment, Button, Box } from '@mui/material'
import SearchIcon from '../../Icons/Search'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'
import DownArrowFilledIcon from '../../Icons/DownArrowFilled'

/**
 * Props interface for the Adornment components
 */
export interface AdornmentProps {
  componentvariant: string
  iconcolor?: string
  passwordVisible?: boolean
  marginRight?: number | string
  handleIncrement?: () => void
  handleDecrement?: () => void
}

/**
 * StartAdornment component renders the start adornment for the input component.
 * @param props The props for the StartAdornment component.
 * @returns The start adornment component or null.
 */
export const StartAdornment: React.FC<AdornmentProps> = props => {
  const { componentvariant, iconcolor } = props
  // Render the search icon for the search bar variant
  if (componentvariant === 'searchbar') {
    return (
      <InputAdornment position="start">
        <SearchIcon color={iconcolor} />
      </InputAdornment>
    )
  }
  return null
}

/**
 * EndAdornment component renders the end adornment for the input component.
 * @param props The props for the EndAdornment component.
 * @returns The end adornment component or null.
 */
export const EndAdornment: React.FC<AdornmentProps> = props => {
  const {
    componentvariant,
    passwordVisible,
    handleIncrement,
    handleDecrement,
  } = props
  const [isPasswordVisible, setIsPasswordVisible] = useState(
    passwordVisible || false
  )
  const adornmentStyle = {
    cursor: 'pointer',
  }
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  // Render the show/hide eye icon for the password variant
  if (componentvariant === 'password') {
    return (
      <InputAdornment
        position="end"
        onClick={togglePasswordVisibility}
        style={adornmentStyle}
      >
        <ShowHideEyeIcon visible={isPasswordVisible} />
      </InputAdornment>
    )
  }
  // Render the down arrow icon for the dropdown variant
  else if (componentvariant === 'dropdown') {
    return (
      <InputAdornment position="end" style={adornmentStyle}>
        <DownArrowFilledIcon />
      </InputAdornment>
    )
  }
  // Render the increment/decrement buttons for the splitbutton variant
  else if (componentvariant === 'splitbutton') {
    return (
      <InputAdornment position="end">
        <Button
          sx={{
            minWidth: '20px',
            padding: 0,
            height: '100%',
            borderLeft: '1px solid #c4c4c4',
            borderRadius: '0 4px 4px 0',
            backgroundColor: '#f0f0f0',
            color: 'black',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{ fontSize: '10px', lineHeight: 1, cursor: 'pointer' }}
              onClick={handleIncrement}
            >
              ▲
            </Box>
            <Box
              sx={{ fontSize: '10px', lineHeight: 1, cursor: 'pointer' }}
              onClick={handleDecrement}
            >
              ▼
            </Box>
          </Box>
        </Button>
      </InputAdornment>
    )
  }
  // Render an empty end adornment for the search bar variant
  else if (componentvariant === 'searchbar') {
    return (
      <InputAdornment position="end" style={adornmentStyle}></InputAdornment>
    )
  }
  return null
}

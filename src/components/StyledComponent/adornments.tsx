import React from 'react'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@/components/Icons/Search'
import ShowHideEyeIcon from '@/components/Icons/ShowHideEye'
import DownArrowFilledIcon from '@/components/Icons/DownArrowFilled'

interface AdornmentProps {
  componentvariant: string
  passwordVisible?: boolean
  // eslint-disable-next-line no-unused-vars
  togglePasswordVisibility?: (event: React.MouseEvent<HTMLDivElement>) => void
  // eslint-disable-next-line no-unused-vars
  marginRight?: number | string
}

export const StartAdornment: React.FC<AdornmentProps> = ({
  componentvariant,
}) => {
  if (componentvariant === 'searchbar') {
    return (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    )
  }
  return null
}

export const EndAdornment: React.FC<AdornmentProps> = ({
  componentvariant,
  passwordVisible,
  togglePasswordVisibility,
  marginRight,
}) => {
  const adornmentStyle = {
    cursor: 'pointer',
    marginRight: marginRight !== undefined ? marginRight : undefined,
  }

  if (componentvariant === 'password' && togglePasswordVisibility) {
    return (
      <InputAdornment
        position="end"
        onClick={togglePasswordVisibility}
        style={adornmentStyle}
      >
        <ShowHideEyeIcon visible={passwordVisible || false} />
      </InputAdornment>
    )
  } else if (componentvariant === 'dropdown') {
    return (
      <InputAdornment position="end" style={adornmentStyle}>
        <DownArrowFilledIcon />
      </InputAdornment>
    )
  } else if (componentvariant === 'searchbar') {
    return (
      <InputAdornment position="end" style={adornmentStyle}></InputAdornment>
    )
  }

  return null
}

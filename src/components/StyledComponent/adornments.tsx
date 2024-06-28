import React from 'react'
import { InputAdornment } from '@mui/material'
import SearchIcon from '../../components/Icons/Search'
import ShowHideEyeIcon from '../../components/Icons/ShowHideEye'
import DownArrowFilledIcon from '../../components/Icons/DownArrowFilled'
import { AdornmentProps } from './index'

/**
 * StartAdornment component renders the start adornment for the input component based on the component variant.
 * It displays a search icon for the 'searchbar' variant.
 * @param props The props for the StartAdornment component.
 * @returns The rendered start adornment or null.
 */
const StartAdornment: React.FC<AdornmentProps> = props => {
  const { componentvariant, iconcolor } = props

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
 * EndAdornment component renders the end adornment for the input component based on the component variant.
 * It displays a show/hide eye icon for the 'password' variant, a down arrow icon for the 'dropdown' variant,
 * and an empty adornment for the 'searchbar' variant.
 * @param props The props for the EndAdornment component.
 * @returns The rendered end adornment or null.
 */
const EndAdornment: React.FC<AdornmentProps> = props => {
  const { componentvariant, passwordVisible, togglePasswordVisibility } = props

  const adornmentStyle = {
    cursor: 'pointer',
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

export { StartAdornment, EndAdornment }

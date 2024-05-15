import React from 'react'
import { InputAdornment } from '@mui/material'
import SearchIcon from '../../components/Icons/Search'
import ShowHideEyeIcon from '../../components/Icons/ShowHideEye'
import DownArrowFilledIcon from '../../components/Icons/DownArrowFilled'
import { AdornmentProps } from '../../types/styledcomponent'

const StartAdornment: React.FC<AdornmentProps> = props => {
  const { componentvariant } = props

  if (componentvariant === 'searchbar') {
    return (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    )
  }
  return null
}

const EndAdornment: React.FC<AdornmentProps> = props => {
  const {
    componentvariant,
    passwordVisible,
    togglePasswordVisibility,
    marginRight,
  } = props

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

export { StartAdornment, EndAdornment }

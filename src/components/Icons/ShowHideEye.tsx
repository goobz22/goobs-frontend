'use client'

import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

interface ShowHideEyeIconProps {
  visible?: boolean
}

const ShowHideEyeIcon: React.FC<ShowHideEyeIconProps> = ({
  visible = false,
}) => {
  const iconStyle = { color: 'black' }
  return visible ? (
    <VisibilityIcon style={iconStyle} />
  ) : (
    <VisibilityOffIcon style={iconStyle} />
  )
}

export default ShowHideEyeIcon

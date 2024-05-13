// src/components/Icons/ShowHideEyeIcon.tsx

import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const ShowHideEyeIcon = ({ visible }: { visible: boolean }) => {
  const iconStyle = { color: 'black' }
  return visible ? (
    <VisibilityIcon style={iconStyle} />
  ) : (
    <VisibilityOffIcon style={iconStyle} />
  )
}

export default ShowHideEyeIcon

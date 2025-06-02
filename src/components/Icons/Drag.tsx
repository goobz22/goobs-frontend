import React from 'react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { keyframes } from '@mui/material'

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

interface DragIconProps {
  sacredTheme?: boolean
}

const DragIcon: React.FC<DragIconProps> = ({ sacredTheme }) => {
  const iconStyle = {
    color: sacredTheme ? '#FFD700' : 'black',
    ...(sacredTheme && {
      animation: `${floatAnimation} 3s ease-in-out infinite`,
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
    }),
  }
  return <DragIndicatorIcon style={iconStyle} />
}

export default DragIcon

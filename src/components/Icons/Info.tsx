import { SvgIcon, SvgIconProps, keyframes } from '@mui/material'
import React from 'react'

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

interface InfoIconProps extends SvgIconProps {
  sacredTheme?: boolean
}

const InfoIcon: React.FC<InfoIconProps> = ({ sacredTheme, ...props }) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      {...props}
      sx={{
        ...(sacredTheme && {
          color: '#FFD700',
          animation: `${rotateGlyph} 20s linear infinite`,
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
        }),
        ...props.sx,
      }}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 17C11.45 17 11 16.55 11 16V12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12V16C13 16.55 12.55 17 12 17ZM13 9H11V7H13V9Z" />
    </SvgIcon>
  )
}

export default InfoIcon

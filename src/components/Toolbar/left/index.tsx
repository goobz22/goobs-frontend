// src/components/Toolbar/Left/index.tsx

'use client'

import React, { FC } from 'react'
import { Box, styled, alpha } from '@mui/material'
import CustomButton, { CustomButtonProps } from '../../Button'
import { white, grey, black } from '../../../styles/palette'

/** A simple vertical divider */
const VerticalDivider = styled(Box, {
  shouldForwardProp: prop => prop !== 'sacredtheme',
})<{ sacredtheme?: boolean }>(({ sacredtheme }) => ({
  borderLeft: sacredtheme
    ? `2px solid ${alpha('#FFD700', 0.6)}`
    : '2px solid black',
  height: '20px',
  ...(sacredtheme && {
    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
  }),
}))

export interface LeftProps {
  /** Array of button configs to render on the left side */
  buttons?: CustomButtonProps[]
  sacredtheme?: boolean
}

const Left: FC<LeftProps> = ({ buttons, sacredtheme }) => {
  const buttonHeight = '45px'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Vertical Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
        <VerticalDivider sacredtheme={sacredtheme} />
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 15px',
        }}
      >
        {buttons?.map((btn, i) => {
          const isDisabled = !!btn.disabled
          return (
            <CustomButton
              key={i}
              text={btn.text}
              onClick={btn.onClick}
              disabled={isDisabled}
              disableButton={isDisabled ? 'true' : 'false'}
              fontcolor={sacredtheme ? '#000000' : white.main}
              backgroundcolor={
                isDisabled
                  ? sacredtheme
                    ? alpha('#FFD700', 0.3)
                    : grey.main
                  : sacredtheme
                    ? '#FFD700'
                    : black.main
              }
              fontvariant="merriparagraph"
              variant="contained"
              height={buttonHeight}
              sacredtheme={sacredtheme}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default Left

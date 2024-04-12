// src/components/Button/index.tsx

import { Button, useTheme } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { CustomButtonProps } from '@/types/button'
import Typography from '@/components/Typography'
import React from 'react'

const CustomButton: React.FC<CustomButtonProps> = props => {
  const {
    text,
    variant,
    fontsize = 'merriparagraph',
    icon = <StarIcon />,
    iconlocation,
    type,
    onClick,
    fontcolor,
    helperfooter,
  } = props

  const theme = useTheme()

  const buttonStylingProps: CustomButtonProps = {
    outlinecolor: props.outlinecolor,
    backgroundcolor: props.backgroundcolor,
    fontlocation: props.fontlocation,
    iconcolor: props.iconcolor,
  }

  const renderIcon = () => {
    if (icon) {
      return icon
    }
    return null
  }

  return (
    <>
      <Button
        disableElevation
        variant={variant}
        startIcon={iconlocation === 'left' ? renderIcon() : null}
        endIcon={iconlocation === 'right' ? renderIcon() : null}
        type={type}
        onClick={onClick}
        {...buttonStylingProps}
      >
        <Typography variant={fontsize} fontcolor={fontcolor}>
          {text}
        </Typography>
      </Button>
      {helperfooter && (
        <Typography
          variant="merrihelperfooter"
          fontcolor={
            helperfooter.status === 'error'
              ? theme.palette.red.main
              : helperfooter.status === 'success'
                ? theme.palette.green.dark
                : undefined
          }
          marginTop={0.5}
          marginBottom={0}
        >
          {helperfooter.statusMessage}
        </Typography>
      )}
    </>
  )
}

export default CustomButton

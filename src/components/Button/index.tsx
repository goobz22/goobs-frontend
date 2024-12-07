'use client'
import React from 'react'
import { Button, Box, ButtonProps, SxProps, Theme } from '@mui/material'
import Typography from '../Typography'
import { SvgIconProps } from '@mui/material/SvgIcon'

export interface CustomButtonProps extends ButtonProps {
  text?: string
  backgroundcolor?: string
  fontcolor?: string
  fontvariant?: 'merriparagraph' | 'merrihelperfooter'
  width?: string
  height?: string
  disableButton?: 'true' | 'false'
  icon?: React.ReactElement<SvgIconProps>
  iconcolor?: string
  iconsize?: string
  iconlocation?: 'left' | 'right' | 'above'
  fontlocation?: 'left' | 'center' | 'right'
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  variant,
  fontvariant = 'merriparagraph',
  onClick,
  fontcolor,
  backgroundcolor,
  width,
  height,
  disableButton,
  icon,
  iconcolor,
  iconsize,
  iconlocation = 'left',
  fontlocation = 'center',
  sx,
  ...restProps
}) => {
  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault()
    onClick?.(event)
  }

  const buttonSx: SxProps<Theme> = {
    ...(backgroundcolor && { backgroundColor: backgroundcolor }),
    ...(width && { width }),
    ...(height && { height }),
    flexDirection: iconlocation === 'above' ? 'column' : 'row',
    justifyContent:
      fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center',
    ...(sx as object),
  }

  const isDisabled = disableButton === 'true'

  const IconComponent = icon
    ? React.cloneElement(icon, {
        sx: {
          color: iconcolor,
          fontSize: iconsize,
        },
      } as Partial<SvgIconProps>)
    : null

  const buttonContent = (
    <>
      {iconlocation === 'above' && IconComponent}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={
          fontlocation === 'left'
            ? 'flex-start'
            : fontlocation === 'right'
              ? 'flex-end'
              : 'center'
        }
        width="100%"
        height="100%"
      >
        {iconlocation === 'left' && IconComponent}
        <Typography
          fontvariant={fontvariant}
          fontcolor={isDisabled ? 'grey' : fontcolor}
          text={text || ''}
        />
        {iconlocation === 'right' && IconComponent}
      </Box>
    </>
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={width}
      height={height}
    >
      <Button
        {...restProps}
        variant={variant}
        onClick={handleButtonClick}
        sx={buttonSx}
        disabled={isDisabled}
      >
        {buttonContent}
      </Button>
    </Box>
  )
}

CustomButton.displayName = 'CustomButton'
export default CustomButton

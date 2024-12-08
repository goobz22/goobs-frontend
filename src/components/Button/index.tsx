'use client'
import React from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import Typography from '../Typography'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { styled } from '@mui/material/styles'

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

const StyledButton = styled(Button, {
  shouldForwardProp: prop =>
    prop !== 'backgroundcolor' &&
    prop !== 'iconlocation' &&
    prop !== 'fontlocation',
})<{
  backgroundcolor?: string
  iconlocation?: 'left' | 'right' | 'above'
  fontlocation?: 'left' | 'center' | 'right'
}>(({ backgroundcolor, iconlocation, fontlocation }) => ({
  minWidth: 'auto',
  width: '100%',
  height: '40px',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: iconlocation === 'above' ? 'column' : 'row',
  alignItems: 'center',
  justifyContent:
    fontlocation === 'left'
      ? 'flex-start'
      : fontlocation === 'right'
        ? 'flex-end'
        : 'center',
  gap: '8px',
  ...(backgroundcolor && {
    backgroundColor: backgroundcolor,
    '&:hover': {
      backgroundColor: backgroundcolor,
      opacity: 0.9,
    },
  }),
  '& .MuiButton-startIcon': {
    margin: 0,
  },
  '& .MuiButton-endIcon': {
    margin: 0,
  },
}))

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: '40px',
  minWidth: 'fit-content',
})

const ContentWrapper = styled(Box)<{
  fontlocation?: 'left' | 'center' | 'right'
}>(({ fontlocation }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent:
    fontlocation === 'left'
      ? 'flex-start'
      : fontlocation === 'right'
        ? 'flex-end'
        : 'center',
  width: '100%',
  height: '100%',
  gap: '8px',
}))

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  variant = 'contained',
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

  const isDisabled = disableButton === 'true'

  const IconComponent = icon
    ? React.cloneElement(icon, {
        sx: {
          color: iconcolor || 'inherit',
          fontSize: iconsize || '20px',
          minWidth: iconsize || '20px',
          minHeight: iconsize || '20px',
          margin: 0,
        },
      } as Partial<SvgIconProps>)
    : null

  const buttonContent = (
    <>
      {iconlocation === 'above' && IconComponent}
      <ContentWrapper fontlocation={fontlocation}>
        {iconlocation === 'left' && IconComponent}
        <Typography
          fontvariant={fontvariant}
          fontcolor={isDisabled ? 'grey' : fontcolor || 'white'}
          text={text || ''}
        />
        {iconlocation === 'right' && IconComponent}
      </ContentWrapper>
    </>
  )

  return (
    <StyledBox sx={{ width, height }}>
      <StyledButton
        {...restProps}
        variant={variant}
        onClick={handleButtonClick}
        disabled={isDisabled}
        disableElevation
        disableRipple
        fullWidth
        backgroundcolor={backgroundcolor}
        iconlocation={iconlocation}
        fontlocation={fontlocation}
        sx={sx}
      >
        {buttonContent}
      </StyledButton>
    </StyledBox>
  )
}

CustomButton.displayName = 'CustomButton'
export default CustomButton

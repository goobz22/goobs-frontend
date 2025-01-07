'use client'
import React, { JSX } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import { SxProps, Theme } from '@mui/system'
import Typography from '../Typography'
import { SvgIconProps } from '@mui/material/SvgIcon'

export interface CustomButtonProps extends ButtonProps {
  text?: string
  /**
   * The background color for the button when not disabled.
   * If `backgroundcolor` is "none", it behaves like a text button.
   */
  backgroundcolor?: string
  /** The text color. Defaults to white unless disabled. */
  fontcolor?: string
  fontvariant?: 'merriparagraph' | 'merrihelperfooter'
  width?: string
  height?: string
  /**
   * If you want to disable the button in a custom way (string),
   * we unify this with MUI's `disabled` boolean.
   */
  disableButton?: 'true' | 'false'

  /** Optional icon to display. */
  icon?: React.ReactElement<SvgIconProps>
  iconcolor?: string
  iconsize?: string
  iconlocation?: 'left' | 'right' | 'above'
  fontlocation?: 'left' | 'center' | 'right'
}

/**
 * CustomButton uses sx props for styling:
 *  - We define dynamic logic based on "disabled", "backgroundcolor", etc.
 */
function CustomButton({
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
  disabled,
  ...restProps
}: CustomButtonProps): JSX.Element {
  // Merge MUI's "disabled" with our "disableButton"
  const isReallyDisabled = disabled || disableButton === 'true'

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onClick?.(event)
  }

  // If user provides an icon, clone it to override color/size if desired
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

  // Construct base sx styles
  const buttonSx: SxProps<Theme> = {
    minWidth: 'fit-content',
    width: 'auto',
    height: '40px',
    padding: '8px 16px',
    display: 'inline-flex',
    flexShrink: 0,
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',

    flexDirection: iconlocation === 'above' ? 'column' : 'row',
    alignItems: 'center',
    justifyContent:
      fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center',

    gap: '8px',

    '& .MuiButton-startIcon': { margin: 0 },
    '& .MuiButton-endIcon': { margin: 0 },
  }

  // If disabled, force a grey background with no hover effect
  if (isReallyDisabled) {
    buttonSx.backgroundColor = '#cccccc'
    buttonSx['&:hover'] = {
      backgroundColor: '#cccccc',
      opacity: 1,
      cursor: 'not-allowed',
    }
  } else if (backgroundcolor && backgroundcolor !== 'none') {
    // Normal colored background
    buttonSx.backgroundColor = backgroundcolor
    buttonSx['&:hover'] = {
      backgroundColor: backgroundcolor,
      opacity: 0.9,
    }
  } else if (backgroundcolor === 'none') {
    // No background => text button
    buttonSx.backgroundColor = 'transparent'
    buttonSx['&:hover'] = {
      backgroundColor: 'transparent',
      opacity: 0.9,
    }
  }

  // Merge any sx passed in from parent
  const mergedSx = Array.isArray(sx)
    ? [buttonSx, ...sx]
    : { ...buttonSx, ...sx }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: width || 'auto',
        height: height || '40px',
        minWidth: 'fit-content',
      }}
    >
      <Button
        {...restProps}
        variant={variant}
        onClick={handleButtonClick}
        disabled={isReallyDisabled}
        disableElevation
        disableRipple
        sx={mergedSx}
      >
        {/* If iconlocation="above", show the icon first */}
        {iconlocation === 'above' && IconComponent}

        {/* The text+icon container */}
        <Box
          sx={{
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
          }}
        >
          {iconlocation === 'left' && IconComponent}

          <Typography
            fontvariant={fontvariant}
            fontcolor={isReallyDisabled ? 'grey' : fontcolor || 'white'}
            text={text || ''}
          />

          {iconlocation === 'right' && IconComponent}
        </Box>
      </Button>
    </Box>
  )
}

export default CustomButton

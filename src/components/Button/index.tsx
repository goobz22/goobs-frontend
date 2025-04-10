'use client'
import React from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
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
  disabled,
  style = {},
  ...restProps
}: CustomButtonProps) {
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
          // MUI icons accept a `sx` prop, but it's optional.
          // If you do NOT want to rely on sx, you could remove this.
          color: iconcolor || 'inherit',
          fontSize: iconsize || '20px',
          minWidth: iconsize || '20px',
          minHeight: iconsize || '20px',
          margin: 0,
        },
      } as Partial<SvgIconProps>)
    : null

  // Determine if this is an icon-only button
  const isIconOnly = !!icon && !text

  // Adjust height for icon above text layout or icon-only buttons
  const isIconAbove = iconlocation === 'above'
  const defaultHeight = isIconOnly ? '36px' : isIconAbove ? 'auto' : '40px'
  const minHeight = isIconOnly ? '36px' : isIconAbove ? '70px' : '40px'

  // Base inline styles for the button
  const buttonStyle: React.CSSProperties = {
    minWidth: isIconOnly ? '36px' : 'fit-content',
    width: width || (isIconOnly ? '36px' : 'auto'),
    height: height || defaultHeight,
    minHeight: minHeight,
    padding: isIconOnly ? '6px' : isIconAbove ? '16px 16px' : '8px 16px',
    display: 'inline-flex',
    flexShrink: 0,
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    flexDirection: isIconAbove ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: isIconOnly
      ? 'center'
      : fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center',
    gap: isIconAbove ? '12px' : '8px', // More gap for stacked layout
    // Default background color (handled below)
  }

  // If disabled, force a grey background
  if (isReallyDisabled) {
    buttonStyle.backgroundColor = '#cccccc'
    buttonStyle.opacity = 1
    buttonStyle.cursor = 'not-allowed'
    // Add pointer-events property for testing compatibility
    buttonStyle.pointerEvents = 'auto'
  } else if (backgroundcolor && backgroundcolor !== 'none') {
    // Normal colored background
    buttonStyle.backgroundColor = backgroundcolor
  } else if (backgroundcolor === 'none') {
    // No background => text button
    buttonStyle.backgroundColor = 'transparent'
  }

  // Inline styles for the top-level container (Box)
  // Merge the passed style prop with our containerStyle
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: width || (isIconOnly ? '36px' : 'auto'),
    height: height || (isIconOnly ? '36px' : isIconAbove ? 'auto' : '40px'),
    minHeight: isIconOnly ? '36px' : isIconAbove ? minHeight : 'auto',
    minWidth: isIconOnly ? '36px' : 'fit-content',
    ...style, // Apply any custom styles passed through the style prop
  }

  // Style for the inner content box
  const contentBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isIconOnly
      ? 'center'
      : fontlocation === 'left'
        ? 'flex-start'
        : fontlocation === 'right'
          ? 'flex-end'
          : 'center',
    width: '100%',
    height: '100%',
    gap: '8px',
  }

  return (
    <Box style={containerStyle}>
      <Button
        {...restProps}
        variant={variant}
        onClick={handleButtonClick}
        disabled={isReallyDisabled}
        disableElevation
        disableRipple
        style={buttonStyle}
        data-testid={isReallyDisabled ? 'disabled-button' : 'button'}
      >
        {/* If iconlocation="above", show the icon first */}
        {isIconAbove && IconComponent}

        {/* The text+icon container */}
        <Box style={contentBoxStyle}>
          {iconlocation === 'left' && IconComponent}

          {text && (
            <Typography
              fontvariant={fontvariant}
              fontcolor={isReallyDisabled ? 'grey' : fontcolor || 'white'}
              text={text}
            />
          )}

          {iconlocation === 'right' && IconComponent}
        </Box>
      </Button>
    </Box>
  )
}

export default CustomButton

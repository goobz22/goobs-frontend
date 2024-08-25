'use client'
import React from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import Typography from '../Typography'

export interface CustomButtonProps extends ButtonProps {
  text?: string
  backgroundcolor?: string
  fontcolor?: string
  fontvariant?: 'merriparagraph' | 'merrihelperfooter'
  width?: string
  disableButton?: 'true' | 'false'
  icon?: React.ReactNode
  iconcolor?: string
  iconsize?: string
  iconlocation?: 'left' | 'right' | 'above'
  fontlocation?: 'left' | 'center' | 'right'
}

const CustomButton: React.FC<CustomButtonProps> = React.memo(
  props => {
    console.log('[trace-button] CustomButton: Rendering component', { props })
    const {
      text,
      variant,
      fontvariant = 'merriparagraph',
      onClick,
      fontcolor,
      backgroundcolor,
      width,
      disableButton,
      icon,
      iconcolor,
      iconsize,
      iconlocation = 'left',
      fontlocation = 'center',
      ...restProps
    } = props

    const handleButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ): void => {
      console.log('[trace-button] CustomButton: Button clicked')
      event.preventDefault()
      onClick?.(event)
    }

    const buttonStyle = {
      backgroundColor: backgroundcolor,
      width: width,
    }

    const isDisabled = disableButton === 'true'

    const iconStyle = {
      color: iconcolor,
      fontSize: iconsize,
    }

    const IconComponent = icon
      ? React.cloneElement(icon as React.ReactElement, {
          style: { ...iconStyle, ...(icon as React.ReactElement).props.style },
        })
      : null

    console.log('[trace-button] CustomButton: Rendering button', {
      variant,
      style: buttonStyle,
      disableButton,
      isDisabled,
    })

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
      >
        <Button
          {...restProps}
          variant={variant}
          onClick={handleButtonClick}
          style={{
            ...buttonStyle,
            flexDirection: iconlocation === 'above' ? 'column' : 'row',
            justifyContent:
              fontlocation === 'left'
                ? 'flex-start'
                : fontlocation === 'right'
                  ? 'flex-end'
                  : 'center',
          }}
          disabled={isDisabled}
        >
          {buttonContent}
        </Button>
      </Box>
    )
  },
  (prevProps, nextProps) => {
    const propsAreEqual =
      prevProps.text === nextProps.text &&
      prevProps.variant === nextProps.variant &&
      prevProps.fontvariant === nextProps.fontvariant &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.fontcolor === nextProps.fontcolor &&
      prevProps.backgroundcolor === nextProps.backgroundcolor &&
      prevProps.width === nextProps.width &&
      prevProps.disableButton === nextProps.disableButton &&
      prevProps.icon === nextProps.icon &&
      prevProps.iconcolor === nextProps.iconcolor &&
      prevProps.iconsize === nextProps.iconsize &&
      prevProps.iconlocation === nextProps.iconlocation &&
      prevProps.fontlocation === nextProps.fontlocation

    console.log('[trace-button] CustomButton: Props comparison', {
      propsAreEqual,
      prevProps: Object.keys(prevProps),
      nextProps: Object.keys(nextProps),
    })
    return propsAreEqual
  }
)

CustomButton.displayName = 'CustomButton'
console.log('[trace-button] CustomButton: Component defined')
export default CustomButton

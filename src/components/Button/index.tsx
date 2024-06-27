'use client'

import React, { useEffect, useState } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { Typography, TypographyPropsVariantOverrides } from '../Typography'
import { useAtomValue } from 'jotai'
import { helperFooterAtom } from '../../atoms/helperfooter'

export type ButtonAlignment = 'left' | 'center' | 'right'

export interface HelperFooterMessage {
  status?: 'error' | 'success'
  statusMessage?: string
  spreadMessage?: string
  spreadMessagePriority?: number
  formname?: string
}

export interface CustomButtonProps
  extends Omit<ButtonProps, 'color' | 'variant'> {
  text?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  fontlocation?: ButtonAlignment
  fontvariant?: keyof TypographyPropsVariantOverrides
  icon?: React.ReactNode | false
  iconcolor?: string
  iconsize?: string
  iconlocation?: 'left' | 'top' | 'right'
  variant?: 'text' | 'outlined' | 'contained'
  onClick?: () => void
  helperfooter?: HelperFooterMessage
  width?: string
  formname?: string
  name?: string
}

const CustomButton: React.FC<CustomButtonProps> = props => {
  const {
    text,
    variant,
    fontvariant = 'merriparagraph',
    icon,
    iconlocation,
    iconsize,
    type,
    onClick,
    fontcolor,
    name,
    formname,
    outlinecolor,
    backgroundcolor,
    fontlocation,
    iconcolor,
    width,
  } = props

  const helperFooterAtomValue = useAtomValue(helperFooterAtom)
  const [currentHelperFooter, setCurrentHelperFooter] = useState<
    HelperFooterMessage | undefined
  >(undefined)

  useEffect(() => {
    console.log('helperFooterAtomValue changed:', helperFooterAtomValue)
    const errorFooter = Object.values(helperFooterAtomValue).find(
      footer => footer?.status === 'error'
    )
    if (errorFooter) {
      setCurrentHelperFooter(errorFooter)
    } else if (
      Object.values(helperFooterAtomValue).every(
        footer => footer?.status === 'success'
      )
    ) {
      setCurrentHelperFooter(undefined)
    }
  }, [helperFooterAtomValue])

  const renderIcon = () => {
    if (icon === false) {
      return null
    }
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, {
        style: { fontSize: iconsize },
      })
    }
    return <StarIcon style={{ fontSize: iconsize }} />
  }

  const handleButtonClick = async () => {
    console.log('handleButtonClick called')
    console.log('formname:', formname)
    console.log('helperFooterAtomValue:', helperFooterAtomValue)
    console.log(
      'currentHelperFooter inside handleButtonClick:',
      currentHelperFooter
    )
    if (
      currentHelperFooter?.spreadMessage &&
      currentHelperFooter?.status === 'error'
    ) {
      return
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={width}
    >
      <Button
        disableElevation
        variant={variant}
        startIcon={null}
        endIcon={null}
        type={type}
        name={name}
        onClick={handleButtonClick}
        style={{
          minWidth: text ? 'auto' : 'fit-content',
          paddingLeft: text ? '8px' : '0',
          paddingRight: text ? '8px' : '0',
          justifyContent: fontlocation || 'center',
          backgroundColor: backgroundcolor,
          border: outlinecolor ? `1px solid ${outlinecolor}` : undefined,
          color: iconcolor,
          width: width,
        }}
      >
        <Box display="flex" alignItems="center">
          {iconlocation === 'left' && renderIcon()}
          {text && (
            <Typography
              fontvariant={fontvariant}
              fontcolor={fontcolor}
              text={text}
            />
          )}
          {iconlocation === 'right' && renderIcon()}
        </Box>
      </Button>
      {currentHelperFooter?.spreadMessage && (
        <Typography
          fontvariant="merrihelperfooter"
          fontcolor={
            currentHelperFooter?.status === 'error'
              ? 'red'
              : currentHelperFooter?.status === 'success'
                ? 'green'
                : undefined
          }
          style={{
            marginTop: '0.5rem',
            marginBottom: 0,
            textAlign: 'left',
          }}
          text={currentHelperFooter?.spreadMessage}
        />
      )}
    </Box>
  )
}

export default CustomButton

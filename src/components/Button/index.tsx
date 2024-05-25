'use client'

import React, { useEffect, useState } from 'react'
import { Button, Box } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { CustomButtonProps } from '../../types/button'
import Typography from '../Typography'
import { useAtomValue } from 'jotai'
import { helperFooterAtom } from '../../atoms/helperfooter'
import { HelperFooterMessage } from '../../types/validation'

const CustomButton: React.FC<CustomButtonProps> = props => {
  const {
    text,
    variant,
    fontsize = 'merriparagraph',
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
      // @ts-ignore
      display="flex"
      flexDirection="column"
      alignItems="center"
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
          width: width || 'auto',
        }}
      >
        <Box
          // @ts-ignore
          display="flex"
          alignItems="center"
        >
          {iconlocation === 'left' && renderIcon()}
          {text && (
            <Typography variant={fontsize} fontcolor={fontcolor} text={text} />
          )}
          {iconlocation === 'right' && renderIcon()}
        </Box>
      </Button>
      {currentHelperFooter?.spreadMessage && (
        <Typography
          variant="merrihelperfooter"
          fontcolor={
            currentHelperFooter?.status === 'error'
              ? 'red'
              : currentHelperFooter?.status === 'success'
                ? 'green'
                : undefined
          }
          marginTop={0.5}
          marginBottom={0}
          align="left"
          text={currentHelperFooter?.spreadMessage}
        />
      )}
    </Box>
  )
}

export default CustomButton

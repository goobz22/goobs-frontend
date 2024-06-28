'use client'

import React, { useEffect, useState } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import Typography from '../Typography'
import { useAtom } from 'jotai'
import { helperFooterAtom, HelperFooterMessage } from '../../atoms/helperfooter'
import { red } from '../../styles/palette'

export type ButtonAlignment = 'left' | 'center' | 'right'

export interface CustomButtonProps
  extends Omit<ButtonProps, 'color' | 'variant'> {
  text?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  fontlocation?: ButtonAlignment
  fontvariant?:
    | 'arapeyh1'
    | 'arapeyh2'
    | 'arapeyh3'
    | 'arapeyh4'
    | 'arapeyh5'
    | 'arapeyh6'
    | 'arapeyparagraph'
    | 'arapeyhelperheader'
    | 'arapeyhelperfooter'
    | 'interh1'
    | 'interh2'
    | 'interh3'
    | 'interh4'
    | 'interh5'
    | 'interh6'
    | 'interparagraph'
    | 'interhelperheader'
    | 'interhelperfooter'
    | 'merrih1'
    | 'merrih2'
    | 'merrih3'
    | 'merrih4'
    | 'merrih5'
    | 'merrih6'
    | 'merriparagraph'
    | 'merrihelperheader'
    | 'merrihelperfooter'
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
  onFormSubmit?: (isSubmitted: boolean) => void
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
    onFormSubmit,
  } = props

  const [helperFooterAtomValue] = useAtom(helperFooterAtom)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  const [isFormValid, setIsFormValid] = useState<boolean>(true)
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (formname) {
      console.log('formname:', formname)
      console.log('helperFooterAtomValue:', helperFooterAtomValue)

      const relevantFooters = Object.values(helperFooterAtomValue).filter(
        footer => footer?.formname === formname
      )
      console.log('relevantFooters:', relevantFooters)

      const errorFooters = relevantFooters.filter(
        footer => footer?.status === 'error'
      )
      console.log('errorFooters:', errorFooters)

      const emptyRequiredFields = relevantFooters.filter(
        footer =>
          footer?.required && (!footer.status || footer.status === 'error')
      )
      console.log('emptyRequiredFields:', emptyRequiredFields)

      if (errorFooters.length > 0) {
        const highestPriorityError = errorFooters.reduce((prev, current) =>
          (prev.spreadMessagePriority || Infinity) <
          (current.spreadMessagePriority || Infinity)
            ? prev
            : current
        )
        console.log('highestPriorityError:', highestPriorityError)
        setErrorMessage(highestPriorityError.spreadMessage)
        setIsFormValid(false)
      } else if (emptyRequiredFields.length > 0) {
        console.log('Empty required fields found')
        setErrorMessage('Please fill in all required fields.')
        setIsFormValid(false)
      } else {
        console.log('No errors or empty required fields found')
        setErrorMessage(undefined)
        setIsFormValid(true)
      }
    }
  }, [helperFooterAtomValue, formname])

  useEffect(() => {
    if (onFormSubmit) {
      onFormSubmit(isFormSubmitted)
    }
  }, [isFormSubmitted, onFormSubmit])

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
    console.log('isFormValid:', isFormValid)

    setIsFormSubmitted(true)

    if (!isFormValid) {
      console.log('Button click prevented due to invalid form state')
      return
    }

    if (onClick) {
      onClick()
    }
  }

  console.log('errorMessage:', errorMessage)

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
      {isFormSubmitted && errorMessage && (
        <Typography
          fontvariant="merrihelperfooter"
          fontcolor={red.main}
          text={errorMessage}
          marginTop={0.5}
          marginBottom={0}
          align="center"
          width="100%"
        />
      )}
    </Box>
  )
}

export default CustomButton

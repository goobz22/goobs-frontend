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

/**
 * CustomButton component renders a customizable button with various styling and functionality options.
 * It integrates with helper footers to display error messages and form validation status.
 * @param props The props for the CustomButton component.
 * @returns The rendered CustomButton component.
 */
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

  /**
   * updateFormValidation function updates the form validation status and error message
   * based on the values in the helper footers associated with the current form.
   * It checks for error footers and empty required fields to determine the form's validity
   * and sets the error message accordingly.
   */
  const updateFormValidation = () => {
    if (formname) {
      const relevantFooters = Object.values(helperFooterAtomValue).filter(
        footer => footer?.formname === formname
      )

      const errorFooters = relevantFooters.filter(
        footer => footer?.status === 'error'
      )

      const emptyRequiredFields = relevantFooters.filter(
        footer =>
          footer?.required && (!footer.status || footer.status === 'error')
      )

      if (errorFooters.length > 0) {
        const highestPriorityError = errorFooters.reduce((prev, current) =>
          (prev.spreadMessagePriority || Infinity) <
          (current.spreadMessagePriority || Infinity)
            ? prev
            : current
        )
        setErrorMessage(highestPriorityError.spreadMessage)
        setIsFormValid(false)
      } else if (emptyRequiredFields.length > 0) {
        setErrorMessage('Please fill in all required fields.')
        setIsFormValid(false)
      } else {
        setErrorMessage(undefined)
        setIsFormValid(true)
      }
    }
  }

  /**
   * useEffect hook that triggers the updateFormValidation function whenever the
   * helperFooterAtomValue or formname changes.
   */
  useEffect(() => {
    updateFormValidation()
  }, [helperFooterAtomValue, formname])

  /**
   * useEffect hook that calls the onFormSubmit callback with the current isFormSubmitted state
   * whenever the isFormSubmitted state or onFormSubmit prop changes.
   */
  useEffect(() => {
    if (onFormSubmit) {
      onFormSubmit(isFormSubmitted)
    }
  }, [isFormSubmitted, onFormSubmit])

  /**
   * renderIcon function renders the icon element based on the provided icon prop.
   * It clones the icon element and applies the iconsize style if the icon is a valid React element.
   * If the icon prop is set to false, it returns null.
   * @returns The rendered icon element or null.
   */
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

  /**
   * handleButtonClick function is called when the button is clicked.
   * It sets the isFormSubmitted state to true and checks the form validity.
   * If the form is valid and an onClick handler is provided, it calls the onClick handler.
   */
  const handleButtonClick = async () => {
    setIsFormSubmitted(true)

    if (!isFormValid) {
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

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import Typography from '../Typography'
import { get, JSONValue } from 'goobs-cache'
import { red } from '../../styles/palette'

/**
 * Defines the possible alignment options for button content.
 */
export type ButtonAlignment = 'left' | 'center' | 'right'

/**
 * Defines the structure of helper footer messages used for form validation.
 */
export interface HelperFooterMessage {
  /** Indicates whether the message represents an error or success state */
  status: 'error' | 'success'
  /** The message to display in the status area */
  statusMessage: string
  /** The message to spread across multiple components */
  spreadMessage: string
  /** Priority of the spread message for determining which message to show */
  spreadMessagePriority: number
  /** The name of the form this message is associated with */
  formname: string
  /** Indicates if the field associated with this message is required */
  required: boolean
}

/**
 * Props for the CustomButton component.
 * Extends ButtonProps from Material-UI, omitting 'color' and 'variant'.
 */
export interface CustomButtonProps
  extends Omit<ButtonProps, 'color' | 'variant'> {
  /** Text to display on the button */
  text?: string
  /** Background color of the button */
  backgroundcolor?: string
  /** Color of the button's outline */
  outlinecolor?: string
  /** Color of the button's text */
  fontcolor?: string
  /** Alignment of the button's text */
  fontlocation?: ButtonAlignment
  /** Typography variant for the button's text */
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
  /** Icon to display on the button. Set to false to hide the icon */
  icon?: React.ReactNode | false
  /** Color of the icon */
  iconcolor?: string
  /** Size of the icon */
  iconsize?: string
  /** Position of the icon relative to the text */
  iconlocation?: 'left' | 'top' | 'right'
  /** Style variant of the button */
  variant?: 'text' | 'outlined' | 'contained'
  /** Function to call when the button is clicked */
  onClick?: () => void
  /** Helper footer message for form validation */
  helperfooter?: HelperFooterMessage
  /** Width of the button */
  width?: string
  /** Name of the form this button is associated with */
  formname?: string
  /** Name attribute for the button element */
  name?: string
}

/**
 * CustomButton component renders a customizable button with integrated form validation.
 * It displays error messages based on helper footers and form validation status.
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
  } = props

  /** State for storing the current error message */
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  /** State for tracking whether the associated form is valid */
  const [isFormValid, setIsFormValid] = useState<boolean>(true)
  /** State for storing helper footer messages */
  const [helperFooterValue, setHelperFooterValue] = useState<
    Record<string, HelperFooterMessage>
  >({})

  /**
   * Updates the form validation status and error message based on helper footers.
   * This function filters relevant footers, checks for errors and empty required fields,
   * and updates the error message and form validity accordingly.
   */
  const updateFormValidation = useCallback(() => {
    if (formname) {
      const relevantFooters = Object.values(helperFooterValue).filter(
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
  }, [formname, helperFooterValue])

  /**
   * Fetches helper footer data from the cache when formname changes.
   * This effect runs whenever the formname prop changes.
   */
  useEffect(() => {
    const fetchHelperFooter = async () => {
      const helperFooterResult = await get('helperFooter', 'client')
      if (
        helperFooterResult &&
        typeof helperFooterResult === 'object' &&
        'value' in helperFooterResult
      ) {
        setHelperFooterValue(
          (helperFooterResult as JSONValue).value as Record<
            string,
            HelperFooterMessage
          >
        )
      }
    }

    fetchHelperFooter()
  }, [formname])

  /**
   * Triggers form validation whenever helperFooterValue changes.
   * This effect ensures that the form validation is updated whenever
   * the helper footer messages change.
   */
  useEffect(() => {
    updateFormValidation()
  }, [updateFormValidation])

  /**
   * Renders the icon element based on the provided icon prop.
   * If the icon prop is false, it returns null.
   * If the icon is a valid React element, it clones it with the specified size.
   * Otherwise, it renders a default StarIcon.
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
   * Handles the button click event.
   * If the form is valid and an onClick handler is provided, it calls the handler.
   */
  const handleButtonClick = async () => {
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
      {errorMessage && (
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

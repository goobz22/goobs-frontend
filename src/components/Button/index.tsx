'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import Typography from '../Typography'
import { red } from '../../styles/palette'
import { get, JSONValue } from 'goobs-cache'

/**
 * Represents the alignment options for button text.
 */
export type ButtonAlignment = 'left' | 'center' | 'right'

/**
 * Represents the structure of a helper footer message.
 */
export interface HelperFooterMessage {
  /** The status of the message, either 'error' or 'success'. */
  status: 'error' | 'success'
  /** The status message. */
  statusMessage: string
  /** The spread message to be displayed. */
  spreadMessage: string
  /** The priority of the spread message. */
  spreadMessagePriority: number
  /** The name of the form associated with this message. */
  formname: string
  /** Indicates if the field associated with this message is required. */
  required: boolean
}

/**
 * Props for the CustomButton component.
 * @extends {Omit<ButtonProps, 'color' | 'variant'>}
 */
export interface CustomButtonProps
  extends Omit<ButtonProps, 'color' | 'variant'> {
  /** The text to be displayed on the button. */
  text?: string
  /** The background color of the button. */
  backgroundcolor?: string
  /** The outline color of the button. */
  outlinecolor?: string
  /** The font color of the button text. */
  fontcolor?: string
  /** The alignment of the button text. */
  fontlocation?: ButtonAlignment
  /** The variant of the font to be used for the button text. */
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
  /** The icon to be displayed on the button. Set to false to remove the icon. */
  icon?: React.ReactNode | false
  /** The color of the icon. */
  iconcolor?: string
  /** The size of the icon. */
  iconsize?: string
  /** The location of the icon relative to the button text. */
  iconlocation?: 'left' | 'top' | 'right'
  /** The variant of the button. */
  variant?: 'text' | 'outlined' | 'contained'
  /** The function to be called when the button is clicked. */
  onClick?: () => void
  /** The helper footer message for the button. */
  helperfooter?: HelperFooterMessage
  /** The width of the button. */
  width?: string
  /** The name of the form associated with the button. */
  formname?: string
  /** The name attribute of the button. */
  name?: string
}

/**
 * A customizable button component with advanced features.
 *
 * @component
 * @example
 * <CustomButton
 *   text="Submit"
 *   variant="contained"
 *   backgroundcolor="#007bff"
 *   fontcolor="#ffffff"
 *   onClick={() => handleSubmit()}
 *   formname="myForm"
 * />
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

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  const [isFormValid, setIsFormValid] = useState<boolean>(true)
  const [hasBeenClicked, setHasBeenClicked] = useState<boolean>(false)

  /**
   * Memoized function to extract HelperFooterMessage objects from a complex data structure.
   * @param {unknown} data - The data to extract HelperFooterMessages from.
   * @returns {HelperFooterMessage[]} An array of extracted HelperFooterMessages.
   */
  const extractHelperFooters = useMemo(() => {
    return (data: unknown): HelperFooterMessage[] => {
      if (typeof data !== 'object' || data === null) {
        return []
      }

      if ('status' in data && 'spreadMessage' in data && 'formname' in data) {
        return [data as HelperFooterMessage]
      }

      if (Array.isArray(data)) {
        return data.flatMap(extractHelperFooters)
      }

      return Object.values(data).flatMap(extractHelperFooters)
    }
  }, [])

  /**
   * Fetches HelperFooterMessages from the cache for the current form.
   * @returns {Promise<HelperFooterMessage[]>} A promise that resolves to an array of HelperFooterMessages.
   */
  const fetchHelperFooters = useCallback(async (): Promise<
    HelperFooterMessage[]
  > => {
    if (!formname) {
      return []
    }
    const helperFooterCache = (await get('helperFooter', 'client')) as JSONValue
    const allHelperFooters = extractHelperFooters(helperFooterCache)
    const relevantHelperFooters = allHelperFooters.filter(
      footer => footer.formname === formname
    )
    return relevantHelperFooters
  }, [formname, extractHelperFooters])

  /**
   * Updates the form validation state based on the current HelperFooterMessages.
   */
  const updateFormValidation = useCallback(async () => {
    const helperFooters = await fetchHelperFooters()

    const requiredFooters = helperFooters.filter(footer => footer.required)
    const errorFooters = helperFooters.filter(
      footer => footer.status === 'error'
    )

    if (errorFooters.length > 0) {
      const highestPriorityError = errorFooters.reduce((prev, current) =>
        prev.spreadMessagePriority < current.spreadMessagePriority
          ? prev
          : current
      )
      setErrorMessage(highestPriorityError.spreadMessage)
      setIsFormValid(false)
    } else if (
      requiredFooters.length > 0 &&
      requiredFooters.some(
        footer => !footer.status || footer.status === 'error'
      )
    ) {
      setErrorMessage('Please fill in required fields')
      setIsFormValid(false)
    } else if (requiredFooters.length === 0 && helperFooters.length === 0) {
      setErrorMessage('Please fill in required fields')
      setIsFormValid(false)
    } else {
      setErrorMessage(undefined)
      setIsFormValid(true)
    }
  }, [fetchHelperFooters])

  useEffect(() => {
    void updateFormValidation()
  }, [updateFormValidation])

  /**
   * Renders the icon for the button.
   * @returns {React.ReactNode | null} The rendered icon or null if no icon should be displayed.
   */
  const renderIcon = (): React.ReactNode => {
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
   * Handles the button click event, performing form validation before executing the onClick callback.
   * @param {React.MouseEvent<HTMLButtonElement>} event - The click event.
   */
  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault()
    setHasBeenClicked(true)

    await updateFormValidation()
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
      {hasBeenClicked && errorMessage && (
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

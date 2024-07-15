import React, { useState, useEffect, useCallback } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import Typography from '../Typography'
import { red } from '../../styles/palette'
import { get } from 'goobs-cache'

export type ButtonAlignment = 'left' | 'center' | 'right'

export interface HelperFooterMessage {
  status: 'error' | 'success'
  statusMessage: string
  spreadMessage: string
  spreadMessagePriority: number
  formname: string
  required: boolean
}

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

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  const [, setIsFormValid] = useState<boolean>(true)
  const [hasBeenClicked, setHasBeenClicked] = useState<boolean>(false)

  const fetchHelperFooters = useCallback(async (): Promise<
    HelperFooterMessage[]
  > => {
    if (!formname) {
      console.log('CustomButton: No formname provided, returning empty array')
      return []
    }
    console.log('CustomButton: Fetching helper footers for formname:', formname)

    // Wait for 2 seconds before fetching to allow time for cache update
    await new Promise(resolve => setTimeout(resolve, 3000))

    const helperFooterResult = await get('helperfooter', formname, 'client')
    console.log('CustomButton: Helper footer result:', helperFooterResult)

    if (
      helperFooterResult &&
      typeof helperFooterResult === 'object' &&
      'type' in helperFooterResult &&
      helperFooterResult.type === 'json' &&
      'value' in helperFooterResult &&
      typeof helperFooterResult.value === 'object' &&
      helperFooterResult.value !== null
    ) {
      const helperFooters = Object.entries(
        helperFooterResult.value as Record<string, unknown>
      )
        .map(([key, value]): HelperFooterMessage | null => {
          if (
            typeof value === 'object' &&
            value !== null &&
            'status' in value &&
            'statusMessage' in value &&
            'spreadMessage' in value &&
            'spreadMessagePriority' in value &&
            'required' in value
          ) {
            return {
              status: value.status as 'error' | 'success',
              statusMessage: String(value.statusMessage),
              spreadMessage: String(value.spreadMessage),
              spreadMessagePriority: Number(value.spreadMessagePriority),
              required: Boolean(value.required),
              formname: key,
            }
          }
          return null
        })
        .filter((value): value is HelperFooterMessage => value !== null)

      console.log('CustomButton: Valid helper footers:', helperFooters)
      return helperFooters
    }

    console.log('CustomButton: No valid helper footers found in cache')
    return []
  }, [formname])

  const updateFormValidation = useCallback(async (): Promise<boolean> => {
    console.log('CustomButton: Starting form validation')
    const helperFooters = await fetchHelperFooters()
    console.log('CustomButton: Fetched helper footers:', helperFooters)

    if (helperFooters.length === 0) {
      console.log('CustomButton: No helper footers found, form is valid')
      setErrorMessage(undefined)
      setIsFormValid(true)
      return true
    }

    const errorFooters = helperFooters.filter(
      footer => footer.status === 'error'
    )
    console.log('CustomButton: Error footers:', errorFooters)

    if (errorFooters.length > 0) {
      console.log('CustomButton: Found error footers, form is invalid')
      const highestPriorityError = errorFooters.reduce((prev, current) =>
        prev.spreadMessagePriority < current.spreadMessagePriority
          ? prev
          : current
      )
      setErrorMessage(highestPriorityError.spreadMessage)
      setIsFormValid(false)
      return false
    }

    console.log('CustomButton: No error footers found, form is valid')
    setErrorMessage(undefined)
    setIsFormValid(true)
    return true
  }, [fetchHelperFooters])

  useEffect(() => {
    console.log('CustomButton: Running effect to update form validation')
    void updateFormValidation()
  }, [updateFormValidation])

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

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    console.log('CustomButton: Button clicked')
    event.preventDefault()
    setHasBeenClicked(true)

    const isValid = await updateFormValidation()
    console.log('CustomButton: Form validation result:', isValid)
    if (isValid && onClick) {
      console.log('CustomButton: Form is valid, calling onClick')
      onClick()
    } else {
      console.log('CustomButton: Form is invalid or no onClick provided')
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

import React, { useMemo, useCallback } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import Typography from '../Typography'
import { red } from '../../styles/palette'
import useHelperFooter from './hook/useHelperFooter'

/**
 * Defines the possible alignment options for the button text.
 */
export type ButtonAlignment = 'left' | 'center' | 'right'

/**
 * Interface for the CustomButton component props.
 * Extends ButtonProps from Material-UI, omitting 'color' and 'variant'.
 */
export interface CustomButtonProps
  extends Omit<ButtonProps, 'color' | 'variant'> {
  /** The text to display on the button */
  text?: string
  /** The background color of the button */
  backgroundcolor?: string
  /** The outline color of the button */
  outlinecolor?: string
  /** The font color of the button text */
  fontcolor?: string
  /** The alignment of the button text */
  fontlocation?: ButtonAlignment
  /** The variant of the font to use for the button text */
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
  /** The icon to display on the button */
  icon?: React.ReactNode | false
  /** The color of the icon */
  iconcolor?: string
  /** The size of the icon */
  iconsize?: string
  /** The location of the icon relative to the text */
  iconlocation?: 'left' | 'top' | 'right'
  /** The variant of the button */
  variant?: 'text' | 'outlined' | 'contained'
  /** The function to call when the button is clicked */
  onClick?: () => void
  /** The width of the button */
  width?: string
  /** The name of the form associated with this button */
  formname?: string
  /** The name attribute of the button */
  name?: string
}

/**
 * CustomButton component that extends Material-UI's Button with additional styling and functionality.
 *
 * @param props - The props for the CustomButton component
 * @returns A React functional component
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

  const { errorMessage, isFormValid, updateFormValidation } =
    useHelperFooter(formname)

  /**
   * Renders the icon for the button based on the provided props.
   *
   * @returns {React.ReactNode} The rendered icon or null
   */
  const renderIcon = useCallback((): React.ReactNode => {
    if (icon === false) {
      return null
    }
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, {
        style: { fontSize: iconsize },
      })
    }
    return <StarIcon style={{ fontSize: iconsize }} />
  }, [icon, iconsize])

  /**
   * Handles the button click event. Prevents default behavior, validates the form,
   * and calls the onClick prop if the form is valid.
   *
   * @param event - The mouse event from clicking the button
   */
  const handleButtonClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault()
      const validationResult = await updateFormValidation(formname)
      if (validationResult && onClick) {
        onClick()
      }
    },
    [updateFormValidation, onClick, formname]
  )

  /**
   * Memoized style object for the button.
   */
  const buttonStyle = useMemo(
    () => ({
      minWidth: text ? 'auto' : 'fit-content',
      paddingLeft: text ? '8px' : '0',
      paddingRight: text ? '8px' : '0',
      justifyContent: fontlocation || 'center',
      backgroundColor: backgroundcolor,
      border: outlinecolor ? `1px solid ${outlinecolor}` : undefined,
      color: iconcolor,
      width: width,
    }),
    [text, fontlocation, backgroundcolor, outlinecolor, iconcolor, width]
  )

  /**
   * Memoized content for the button, including icon and text.
   */
  const buttonContent = useMemo(
    () => (
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
    ),
    [iconlocation, renderIcon, text, fontvariant, fontcolor]
  )

  /**
   * Memoized error message component that displays when the form is invalid.
   */
  const errorMessageComponent = useMemo(
    () =>
      !isFormValid && errorMessage ? (
        <Typography
          fontvariant="merrihelperfooter"
          fontcolor={red.main}
          text={errorMessage}
          marginTop={0.5}
          marginBottom={0}
          align="center"
          width="100%"
        />
      ) : null,
    [errorMessage, isFormValid]
  )

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
        style={buttonStyle}
      >
        {buttonContent}
      </Button>
      {errorMessageComponent}
    </Box>
  )
}

export default React.memo(CustomButton)

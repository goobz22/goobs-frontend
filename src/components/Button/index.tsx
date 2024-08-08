import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Button, Box, ButtonProps } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import Typography from '../Typography'
import { red } from '../../styles/palette'
import useHelperFooter from './hook/useHelperFooter'

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
  width?: string
  formname?: string
  name?: string
}

const CustomButton: React.FC<CustomButtonProps> = React.memo(
  props => {
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

    const [isFormFinished, setIsFormFinished] = useState<boolean>(false)
    const [isCheckingForm, setIsCheckingForm] = useState<boolean>(true)

    const {
      updateFormValidation,
      checkFormStatus,
      getEmptyRequiredFields,
      fetchHelperFooters,
    } = useHelperFooter(formname)

    const checkFormState = useCallback(async (): Promise<void> => {
      console.log('CustomButton: Checking form state...')
      setIsCheckingForm(true)

      const formStatus = await checkFormStatus()
      const emptyFields = await getEmptyRequiredFields()
      const helperFooters = await fetchHelperFooters()

      console.log('CustomButton: Form status:', formStatus)
      console.log('CustomButton: Empty fields:', emptyFields)
      console.log('CustomButton: Helper footers:', helperFooters)

      const newIsFormFinished =
        formStatus &&
        emptyFields.length === 0 &&
        (!helperFooters || Object.keys(helperFooters).length === 0)

      setIsFormFinished(newIsFormFinished)
      setIsCheckingForm(false)

      console.log(
        'CustomButton: Form status changed. Is form finished:',
        newIsFormFinished
      )
    }, [checkFormStatus, getEmptyRequiredFields, fetchHelperFooters])

    useEffect(() => {
      console.log('CustomButton: Performing initial check')
      checkFormState()
    }, [checkFormState])

    const handleButtonClick = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault()
        console.log(
          'CustomButton: Button clicked. Is form finished:',
          isFormFinished,
          'Is checking form:',
          isCheckingForm
        )
        if (!isFormFinished || isCheckingForm) return

        const validationResult = await updateFormValidation()
        console.log('CustomButton: Validation result:', validationResult)
        if (validationResult && onClick) {
          onClick()
        }
        checkFormState()
      },
      [
        isFormFinished,
        isCheckingForm,
        updateFormValidation,
        onClick,
        checkFormState,
      ]
    )

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
        opacity: !isFormFinished || isCheckingForm ? 0.5 : 1,
      }),
      [
        text,
        fontlocation,
        backgroundcolor,
        outlinecolor,
        iconcolor,
        width,
        isFormFinished,
        isCheckingForm,
      ]
    )

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

    const messageComponent = useMemo(
      () =>
        !isFormFinished || isCheckingForm ? (
          <Typography
            fontvariant="merrihelperfooter"
            fontcolor={red.main}
            text="Fill in required fields"
            marginTop={0.5}
            marginBottom={0}
            align="center"
            width="100%"
          />
        ) : null,
      [isFormFinished, isCheckingForm]
    )

    console.log(
      `CustomButton: Rendering. Is form finished: ${isFormFinished} Is checking form: ${isCheckingForm}`
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
          disabled={!isFormFinished || isCheckingForm}
        >
          {buttonContent}
        </Button>
        {messageComponent}
      </Box>
    )
  },
  (prevProps, nextProps) => {
    const propsAreEqual =
      prevProps.text === nextProps.text &&
      prevProps.variant === nextProps.variant &&
      prevProps.fontvariant === nextProps.fontvariant &&
      prevProps.icon === nextProps.icon &&
      prevProps.iconlocation === nextProps.iconlocation &&
      prevProps.iconsize === nextProps.iconsize &&
      prevProps.type === nextProps.type &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.fontcolor === nextProps.fontcolor &&
      prevProps.name === nextProps.name &&
      prevProps.formname === nextProps.formname &&
      prevProps.outlinecolor === nextProps.outlinecolor &&
      prevProps.backgroundcolor === nextProps.backgroundcolor &&
      prevProps.fontlocation === nextProps.fontlocation &&
      prevProps.iconcolor === nextProps.iconcolor &&
      prevProps.width === nextProps.width
    console.log('CustomButton: Props changed:', !propsAreEqual)
    return propsAreEqual
  }
)

CustomButton.displayName = 'CustomButton'

export default CustomButton

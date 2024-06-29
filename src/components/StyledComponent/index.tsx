'use client'

import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  RefObject,
} from 'react'
import { Box, InputLabel, OutlinedInput, styled } from '@mui/material'
import { useDropdown } from './hooks/useDropdown'
import { usePhoneNumber } from './hooks/usePhoneNumber'
import { usePassword } from './hooks/usePassword'
import { useSplitButton } from './hooks/useSplitButton'
import { Typography } from './../Typography'
import { red, green } from '../../styles/palette'
import { StartAdornment, EndAdornment } from './adornments'
import { useHelperFooter } from './helperfooter/useHelperFooter'
import labelStyles from '../../styles/StyledComponent/Label'
import { HelperFooterMessage } from '../../atoms/helperfooter'

export interface StyledComponentProps {
  name?: string
  outlinecolor?: string
  iconcolor?: string
  backgroundcolor?: string
  notched?: boolean
  combinedfontcolor?: string
  unshrunkfontcolor?: string
  shrunkfontcolor?: string
  autoComplete?: string
  componentvariant?:
    | 'multilinetextfield'
    | 'dropdown'
    | 'searchbar'
    | 'textfield'
    | 'phonenumber'
    | 'password'
    | 'ip-address'
    | 'email'
    | 'url'
    | 'credit-card'
    | 'number'
    | 'hostname'
    | 'domain'
    | 'time'
    | 'date'
    | 'splitbutton'
  options?: readonly string[]
  helperfooter?: HelperFooterMessage
  placeholder?: string
  minRows?: number
  formname?: string
  label?: string
  shrunklabellocation?: 'onnotch' | 'above'
  value?: string
  valuestatus?: boolean
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  defaultValue?: string
  inputRef?: RefObject<HTMLInputElement>
  serverActionValidation?: (
    formData: FormData
  ) => Promise<HelperFooterMessage | undefined>
  focused?: boolean
  required?: boolean
  formSubmitted?: boolean
}

export interface AdornmentProps {
  componentvariant: string
  iconcolor?: string
  passwordVisible?: boolean
  togglePasswordVisibility?: (event: React.MouseEvent<HTMLDivElement>) => void
  marginRight?: number | string
  handleIncrement?: () => void
  handleDecrement?: () => void
}

const NoAutofillOutlinedInput = styled(OutlinedInput)(() => ({
  '& .MuiInputBase-input': {
    '&:-webkit-autofill': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
    '&:-webkit-autofill:hover': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
    '&:-webkit-autofill:focus': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
    '&:-webkit-autofill:active': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
  },
}))

/**
 * StyledComponent is a customizable input component with various variants and features.
 * @param props The props for the StyledComponent.
 * @returns The rendered StyledComponent.
 */
const StyledComponent: React.FC<StyledComponentProps> = props => {
  const {
    label,
    componentvariant,
    inputRef,
    name,
    serverActionValidation,
    onChange,
    backgroundcolor,
    iconcolor,
    unshrunkfontcolor,
    combinedfontcolor,
    shrunkfontcolor,
    shrunklabellocation,
    value,
    valuestatus,
    placeholder,
    required = false,
    formname,
    formSubmitted = false,
  } = props

  const { validateField, helperFooterAtomValue } = useHelperFooter()
  const [isFocused, setIsFocused] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [showError, setShowError] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  /**
   * Update the hasInput state when the value or valuestatus props change.
   */
  useEffect(() => {
    setHasInput(!!value || !!valuestatus)
  }, [value, valuestatus])

  /**
   * Set autocomplete, autocorrect, autocapitalize, and spellcheck attributes on the input element.
   */
  useEffect(() => {
    const input = inputRefInternal.current || inputRef?.current
    if (input) {
      input.setAttribute('autocomplete', 'new-password')
      input.setAttribute('autocorrect', 'off')
      input.setAttribute('autocapitalize', 'none')
      input.setAttribute('spellcheck', 'false')
    }
  }, [inputRef])

  /**
   * Validate the field if it is required and the form name, name, and label are provided.
   */
  useEffect(() => {
    if (required && formname && name && label) {
      const emptyFormData = new FormData()
      emptyFormData.append(name, '')
      validateField(name, emptyFormData, label, required, formname)
    }
  }, [required, formname, name, label, validateField])

  /**
   * Update the showError state based on the formSubmitted, hasInput, and isFocused states.
   */
  useEffect(() => {
    setShowError(formSubmitted || (hasInput && !isFocused))
  }, [formSubmitted, hasInput, isFocused])

  const { handleDropdownClick, renderMenu, selectedOption, isDropdownOpen } =
    useDropdown(props, inputBoxRef)

  const { handlePhoneNumberChange } = usePhoneNumber({ ...props, onChange })

  const { passwordVisible, togglePasswordVisibility } = usePassword()

  const {
    value: splitButtonValue,
    handleIncrement,
    handleDecrement,
  } = useSplitButton(props)

  /**
   * Handle the change event of the input element.
   * @param e The change event.
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (componentvariant === 'phonenumber') {
        handlePhoneNumberChange(e)
      } else if (componentvariant === 'splitbutton') {
        // Only allow numbers for splitbutton
        const numValue = e.target.value.replace(/[^0-9]/g, '')
        if (onChange) {
          onChange({ ...e, target: { ...e.target, value: numValue } })
        }
      } else {
        if (onChange) {
          onChange(e)
        }
      }

      setHasInput(!!e.target.value)

      const formData = new FormData()
      formData.append(e.target.name, e.target.value)

      if (name && label && formname) {
        validateField(name, formData, label, required, formname)
      }

      if (serverActionValidation && name) {
        serverActionValidation(formData)
      }
    },
    [
      componentvariant,
      onChange,
      handlePhoneNumberChange,
      validateField,
      name,
      label,
      required,
      formname,
      serverActionValidation,
    ]
  )

  const currentHelperFooter = name ? helperFooterAtomValue[name] : undefined

  /**
   * Handle the focus event of the input element.
   */
  const handleFocus = () => {
    setIsFocused(true)
  }

  /**
   * Handle the blur event of the input element.
   */
  const handleBlur = () => {
    setIsFocused(false)
    if (name && label && !hasInput && formname) {
      const formData = new FormData()
      formData.append(name, '')
      validateField(name, formData, label, required, formname)
    }
  }

  const isDropdownVariant = componentvariant === 'dropdown'
  const isSplitButtonVariant = componentvariant === 'splitbutton'
  const isNotchedVariant =
    !isDropdownVariant &&
    !isSplitButtonVariant &&
    shrunklabellocation !== 'above' &&
    !!label
  const hasPlaceholder = !!placeholder

  /**
   * Determine if the label should be shrunk based on various conditions.
   */
  const shouldShrinkLabel =
    isFocused ||
    isDropdownVariant ||
    isSplitButtonVariant ||
    hasPlaceholder ||
    hasInput ||
    componentvariant === 'phonenumber'

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: shrunklabellocation === 'above' ? '20px' : '5px',
        }}
      >
        {label && (
          <InputLabel
            style={labelStyles({
              componentvariant,
              unshrunkfontcolor,
              shrunkfontcolor,
              shrunklabellocation,
              combinedfontcolor,
              focused: shouldShrinkLabel,
            })}
            shrink={shouldShrinkLabel}
          >
            {label}
          </InputLabel>
        )}
        <Box ref={inputBoxRef} sx={{ width: '100%' }}>
          <NoAutofillOutlinedInput
            ref={inputRef || inputRefInternal}
            style={{
              backgroundColor: backgroundcolor || 'inherit',
              width: '100%',
              height: 40,
              cursor: isSplitButtonVariant
                ? 'default'
                : isDropdownVariant
                  ? 'pointer'
                  : 'text',
              boxSizing: 'border-box',
              borderRadius: 5,
              marginTop: 'auto',
              paddingRight: 6,
            }}
            inputProps={{
              style: {
                width: '100%',
                color: combinedfontcolor || unshrunkfontcolor || 'inherit',
                height: '100%',
                cursor: isSplitButtonVariant
                  ? 'default'
                  : isDropdownVariant
                    ? 'pointer'
                    : 'text',
              },
              placeholder: placeholder || '',
            }}
            type={
              componentvariant === 'password' && !passwordVisible
                ? 'password'
                : 'text'
            }
            startAdornment={
              <StartAdornment
                componentvariant={componentvariant || ''}
                iconcolor={iconcolor}
              />
            }
            endAdornment={
              <EndAdornment
                componentvariant={componentvariant || ''}
                passwordVisible={passwordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
                iconcolor={iconcolor}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
              />
            }
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            fullWidth
            multiline={componentvariant === 'multilinetextfield'}
            label={label}
            autoComplete="off"
            name={name}
            value={
              isDropdownVariant
                ? selectedOption
                : isSplitButtonVariant
                  ? splitButtonValue
                  : value
            }
            readOnly={isDropdownVariant}
            notched={
              (isNotchedVariant && shouldShrinkLabel) ||
              ((isDropdownVariant || isSplitButtonVariant) &&
                shrunklabellocation !== 'above') ||
              hasPlaceholder ||
              componentvariant === 'phonenumber'
            }
          />
          {isDropdownVariant && isDropdownOpen && renderMenu}
        </Box>
      </Box>
      {showError && currentHelperFooter?.statusMessage && (
        <Typography
          fontvariant="merrihelperfooter"
          fontcolor={
            currentHelperFooter?.status === 'error'
              ? red.main
              : currentHelperFooter?.status === 'success'
                ? green.dark
                : undefined
          }
          marginTop={0.5}
          marginBottom={0}
          align="left"
          text={currentHelperFooter?.statusMessage}
        />
      )}
    </Box>
  )
}

export default StyledComponent

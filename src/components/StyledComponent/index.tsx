'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Box, InputLabel, OutlinedInput, styled } from '@mui/material'
import { session } from 'goobs-cache'
import { useDropdown } from './hooks/useDropdown'
import { usePhoneNumber } from './hooks/usePhoneNumber'
import { useSplitButton } from './hooks/useSplitButton'
import { Typography } from './../Typography'
import { red, green } from '../../styles/palette'
import { StartAdornment, EndAdornment } from './adornment'
import {
  useInputHelperFooter,
  HelperFooterMessage,
} from './hooks/useInputHelperFooter'
import { useRequiredFieldsValidator } from './hooks/useRequiredFieldsValidator'
import labelStyles from '../../styles/StyledComponent/Label'
import { useHasInputEffect, usePreventAutocompleteEffect } from './useEffects'

/**
 * Props interface for the StyledComponent.
 * @interface
 */
export interface StyledComponentProps {
  /** Name attribute for the input element */
  name?: string
  /** Color of the input outline */
  outlinecolor?: string
  /** Color of the icon */
  iconcolor?: string
  /** Background color of the input */
  backgroundcolor?: string
  /** Whether the input is notched */
  notched?: boolean
  /** Combined font color for the input */
  combinedfontcolor?: string
  /** Font color when the label is not shrunk */
  unshrunkfontcolor?: string
  /** Font color when the label is shrunk */
  shrunkfontcolor?: string
  /** Autocomplete attribute for the input */
  autoComplete?: string
  /** Variant of the component */
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
  /** Options for dropdown variant */
  options?: readonly string[]
  /** Default option for dropdown variant */
  defaultOption?: string
  /** Helper footer message */
  helperfooter?: HelperFooterMessage
  /** Placeholder text for the input */
  placeholder?: string
  /** Minimum number of rows for multiline text field */
  minRows?: number
  /** Name of the form the input belongs to */
  formname?: string
  /** Label text for the input */
  label?: string
  /** Location of the shrunk label */
  shrunklabellocation?: 'onnotch' | 'above'
  /** Value of the input */
  value?: string
  /** Status of the value */
  valuestatus?: boolean
  /** Whether the input is focused */
  focused?: boolean
  /** Whether the input is required */
  required?: boolean
  /** Whether the form has been submitted */
  formSubmitted?: boolean
  /** ARIA label for the input */
  'aria-label'?: string
  /** ARIA required attribute */
  'aria-required'?: boolean
  /** ARIA invalid attribute */
  'aria-invalid'?: boolean
  /** ARIA describedby attribute */
  'aria-describedby'?: string
  /** Callback function when an option is selected (for dropdown variant) */
  onOptionSelect?: (option: string) => void
  /** Callback function when the input value changes */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Priority of the spread message */
  spreadMessagePriority?: number
}

/**
 * Styled OutlinedInput component that prevents autofill styling.
 */
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
 * StyledComponent is a versatile input component that can render various types of inputs based on the provided props.
 * @param {StyledComponentProps} props - The props for the StyledComponent
 * @returns {React.ReactElement} The rendered StyledComponent
 */
const StyledComponent: React.FC<StyledComponentProps> = props => {
  const {
    label,
    componentvariant,
    name,
    backgroundcolor,
    iconcolor,
    unshrunkfontcolor,
    combinedfontcolor,
    shrunkfontcolor,
    shrunklabellocation,
    value,
    valuestatus,
    placeholder,
    formname,
    formSubmitted = false,
    'aria-label': ariaLabel,
    'aria-required': ariaRequired,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    onOptionSelect,
    onChange,
    spreadMessagePriority,
  } = props

  const { validateField } = useInputHelperFooter()
  const helperFooterAtom = session.atom<Record<string, HelperFooterMessage>>({})
  const [helperFooterValue] = session.useAtom(helperFooterAtom)

  const showErrorAtom = session.atom<boolean>(false)
  const [showError, setShowError] = session.useAtom(showErrorAtom)

  const hasInputRef = useRef(false)

  useRequiredFieldsValidator(formname || '', [props], hasInputRef)

  const [isFocused, setIsFocused] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  const { renderMenu, selectedOption, handleDropdownClick } = useDropdown(
    props,
    inputBoxRef,
    onOptionSelect
  )
  const { phoneNumber, handlePhoneNumberChange } = usePhoneNumber(
    value || '',
    componentvariant
  )
  const {
    value: splitButtonValue,
    handleIncrement,
    handleDecrement,
  } = useSplitButton(props)

  useHasInputEffect(value, valuestatus, setHasInput)
  usePreventAutocompleteEffect(inputRefInternal)

  /**
   * Show error after a delay when form is submitted or input has value
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(formSubmitted || hasInput)
    }, 1000)

    return () => clearTimeout(timer)
  }, [formSubmitted, hasInput, setShowError])

  useEffect(() => {
    hasInputRef.current = !!value
  }, [value])

  const currentHelperFooter = name ? helperFooterValue[name] : undefined

  /**
   * Handle change event for the input
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (componentvariant === 'phonenumber') {
      handlePhoneNumberChange(e)
      if (onChange) {
        onChange(e as React.ChangeEvent<HTMLInputElement>)
      }
    } else if (componentvariant === 'splitbutton') {
      const numValue = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = numValue
      if (onChange) {
        onChange(e as React.ChangeEvent<HTMLInputElement>)
      }
    } else if (onChange) {
      onChange(e as React.ChangeEvent<HTMLInputElement>)
    }

    setHasInput(!!e.target.value)
    hasInputRef.current = !!e.target.value

    const formData = new FormData()
    formData.append(e.target.name, e.target.value)
    if (name && label && formname) {
      validateField(name, formData, label, formname, spreadMessagePriority)
    }
  }

  /**
   * Handle focus event for the input
   */
  const handleFocus = () => {
    setIsFocused(true)
  }

  /**
   * Handle blur event for the input
   */
  const handleBlur = () => {
    setIsFocused(false)
    if (name && label && !hasInput && formname) {
      const formData = new FormData()
      formData.append(name, '')
      validateField(name, formData, label, formname, spreadMessagePriority)
    }
  }

  /**
   * Toggle password visibility for password input
   */
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const isDropdownVariant = componentvariant === 'dropdown'
  const isSplitButtonVariant = componentvariant === 'splitbutton'
  const isNotchedVariant =
    !isDropdownVariant &&
    !isSplitButtonVariant &&
    shrunklabellocation !== 'above' &&
    !!label
  const hasPlaceholder = !!placeholder

  const shouldShrinkLabel =
    isFocused ||
    isDropdownVariant ||
    isSplitButtonVariant ||
    hasPlaceholder ||
    hasInput ||
    (componentvariant === 'phonenumber' && phoneNumber !== '')

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
            htmlFor={name}
          >
            {label}
          </InputLabel>
        )}
        <Box ref={inputBoxRef} sx={{ width: '100%' }}>
          <NoAutofillOutlinedInput
            ref={inputRefInternal}
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
              'aria-label': ariaLabel,
              'aria-invalid': ariaInvalid,
              'aria-required': ariaRequired,
              'aria-describedby':
                ariaDescribedBy || currentHelperFooter?.statusMessage
                  ? `${name}-helper-text`
                  : undefined,
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
            onClick={isDropdownVariant ? handleDropdownClick : undefined}
            fullWidth
            multiline={componentvariant === 'multilinetextfield'}
            label={label}
            autoComplete="off"
            name={name}
            value={
              componentvariant === 'phonenumber'
                ? phoneNumber
                : isDropdownVariant
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
              (componentvariant === 'phonenumber' && phoneNumber !== '')
            }
          />
          {isDropdownVariant && renderMenu}
        </Box>
      </Box>
      {showError && currentHelperFooter?.statusMessage && (
        <Typography
          id={`${name}-helper-text`}
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

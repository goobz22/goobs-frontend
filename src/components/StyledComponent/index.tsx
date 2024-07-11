'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Box, InputLabel, OutlinedInput, styled } from '@mui/material'
import { useDropdown } from './hooks/useDropdown'
import { usePhoneNumber } from './hooks/usePhoneNumber'
import { usePassword } from './hooks/usePassword'
import { useSplitButton } from './hooks/useSplitButton'
import { Typography } from './../Typography'
import { red, green } from '../../styles/palette'
import { StartAdornment, EndAdornment } from './adornment'
import {
  useHelperFooter,
  HelperFooterMessage,
} from './helperfooter/useHelperFooter'
import labelStyles from '../../styles/StyledComponent/Label'
import { useHasInputEffect, usePreventAutocompleteEffect } from './useEffects'

/**
 * Props interface for the StyledComponent
 */
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
  focused?: boolean
  required?: boolean
  formSubmitted?: boolean
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/**
 * Styled component to prevent autofill styles
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
 * StyledComponent is a customizable input component with various variants and features.
 * @param props The props for the StyledComponent.
 * @returns The rendered StyledComponent.
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
    required = false,
    formname,
    formSubmitted = false,
    'aria-label': ariaLabel,
    'aria-required': ariaRequired,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
  } = props

  console.log('StyledComponent: Initializing with props', {
    name,
    label,
    required,
    formname,
    formSubmitted,
  })

  const { validateField, validateRequiredField, helperFooterValue } =
    useHelperFooter()
  const [isFocused, setIsFocused] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [showError, setShowError] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  // Custom hooks
  const { renderMenu, selectedOption, isDropdownOpen } = useDropdown(
    props,
    inputBoxRef
  )
  const { handlePhoneNumberChange } = usePhoneNumber()
  const { passwordVisible } = usePassword()
  const {
    value: splitButtonValue,
    handleIncrement,
    handleDecrement,
  } = useSplitButton(props)

  // useEffect hooks
  useHasInputEffect(value, valuestatus, setHasInput)
  usePreventAutocompleteEffect(inputRefInternal)

  useEffect(() => {
    if (required && formname && name && label) {
      validateRequiredField(required, formname, name, label)
    }
  }, [required, formname, name, label, validateRequiredField])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(formSubmitted || hasInput)
    }, 1000)

    return () => clearTimeout(timer)
  }, [formSubmitted, hasInput])

  const currentHelperFooter = name ? helperFooterValue[name] : undefined
  console.log('StyledComponent: Current helper footer', currentHelperFooter)

  /**
   * Handle the change event of the input element.
   * @param e The change event.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log('StyledComponent: handleChange called', {
      name: e.target.name,
      value: e.target.value,
    })

    if (componentvariant === 'phonenumber') {
      handlePhoneNumberChange(e)
    } else if (componentvariant === 'splitbutton') {
      // Only allow numbers for splitbutton
      const numValue = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = numValue
    }

    setHasInput(!!e.target.value)

    const formData = new FormData()
    formData.append(e.target.name, e.target.value)
    if (name && label && formname) {
      console.log('StyledComponent: Calling validateField', {
        name,
        label,
        required,
        formname,
      })
      validateField(name, formData, label, required, formname)
    }
  }

  /**
   * Handle the focus event of the input element.
   */
  const handleFocus = () => {
    console.log('StyledComponent: handleFocus called')
    setIsFocused(true)
  }

  /**
   * Handle the blur event of the input element.
   */
  const handleBlur = () => {
    console.log('StyledComponent: handleBlur called')
    setIsFocused(false)
    if (name && label && !hasInput && formname) {
      console.log('StyledComponent: Calling validateField on blur', {
        name,
        label,
        required,
        formname,
      })
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

  console.log('StyledComponent: Rendering', {
    name,
    showError,
    hasHelperFooter: !!currentHelperFooter,
    helperFooterStatus: currentHelperFooter?.status,
    helperFooterMessage: currentHelperFooter?.statusMessage,
  })

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

'use client'

import React, { useRef, useCallback, useMemo } from 'react'
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
import { usePreventAutocomplete } from './useCallbacks'
import { ClientLogger } from 'goobs-testing'

export interface StyledComponentProps
  extends React.ComponentPropsWithoutRef<'div'> {
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
  defaultOption?: string
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
  onOptionSelect?: (option: string) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  spreadMessagePriority?: number
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

const StyledComponent: React.FC<StyledComponentProps> = React.memo(props => {
  ClientLogger.debug('StyledComponent render', { props })

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
    minRows,
    ...restProps
  } = props

  const helperFooterAtom = useMemo(
    () => session.atom<Record<string, HelperFooterMessage>>({}),
    []
  )
  const [helperFooters] = session.useAtom(helperFooterAtom)
  const { validateField, useShowErrorEffect } =
    useInputHelperFooter(helperFooterAtom)

  const inputValueAtom = useMemo(() => session.atom(value || ''), [value])
  const [inputValue, setInputValue] = session.useAtom(inputValueAtom)
  const hasInput = useMemo(() => !!inputValue, [inputValue])
  const hasInputRef = useRef(hasInput)
  hasInputRef.current = hasInput

  const memoizedRequiredFieldsProps = useMemo(() => [props], [props])
  useRequiredFieldsValidator(
    formname || '',
    memoizedRequiredFieldsProps,
    hasInputRef,
    helperFooterAtom
  )

  const isFocusedAtom = useMemo(() => session.atom(false), [])
  const [isFocused, setIsFocused] = session.useAtom(isFocusedAtom)
  const passwordVisibleAtom = useMemo(() => session.atom(false), [])
  const [passwordVisible, setPasswordVisible] =
    session.useAtom(passwordVisibleAtom)
  const inputRefInternal = useRef<HTMLInputElement | null>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  const memoizedDropdownProps = useMemo(
    () => ({
      componentvariant,
      options: props.options,
      value: inputValue,
      defaultOption: props.defaultOption,
    }),
    [componentvariant, props.options, inputValue, props.defaultOption]
  )

  const {
    renderMenu,
    selectedOption,
    handleDropdownClick,
    updateDropdownState,
  } = useDropdown(memoizedDropdownProps, inputBoxRef, onOptionSelect)

  const { phoneNumber, handlePhoneNumberChange, checkAndUpdatePhoneNumber } =
    usePhoneNumber(inputValue, componentvariant)

  const memoizedSplitButtonProps = useMemo(
    () => ({ value: inputValue }),
    [inputValue]
  )
  const {
    value: splitButtonValue,
    handleIncrement,
    handleDecrement,
    updateValueFromProps,
  } = useSplitButton(memoizedSplitButtonProps)

  const setInputAttributes = usePreventAutocomplete()

  const inputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRefInternal.current = node
      if (node) {
        setInputAttributes(node)
      }
    },
    [setInputAttributes]
  )

  const showError = useShowErrorEffect(formSubmitted, hasInput, isFocused)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      ClientLogger.debug('handleChange', {
        componentvariant,
        value: e.target.value,
        name: e.target.name,
      })

      setInputValue(e.target.value)

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

      const newHasInput = !!e.target.value
      hasInputRef.current = newHasInput

      const formData = new FormData()
      formData.append(e.target.name, e.target.value)
      if (name && label && formname) {
        validateField(name, formData, label, formname, spreadMessagePriority)
      }

      if (componentvariant === 'dropdown') {
        updateDropdownState()
      } else if (componentvariant === 'phonenumber') {
        checkAndUpdatePhoneNumber()
      } else if (componentvariant === 'splitbutton') {
        updateValueFromProps()
      }
    },
    [
      componentvariant,
      handlePhoneNumberChange,
      onChange,
      name,
      label,
      formname,
      validateField,
      spreadMessagePriority,
      updateDropdownState,
      checkAndUpdatePhoneNumber,
      updateValueFromProps,
      setInputValue,
    ]
  )

  const handleFocus = useCallback(() => {
    ClientLogger.debug('handleFocus')
    setIsFocused(true)
  }, [setIsFocused])

  const handleBlur = useCallback(() => {
    ClientLogger.debug('handleBlur', {
      name,
      label,
      hasInput: hasInputRef.current,
      formname,
    })
    setIsFocused(false)
    if (name && label && !hasInputRef.current && formname) {
      const formData = new FormData()
      formData.append(name, '')
      validateField(name, formData, label, formname, spreadMessagePriority)
    }
  }, [
    name,
    label,
    formname,
    validateField,
    spreadMessagePriority,
    setIsFocused,
  ])

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(prev => {
      ClientLogger.debug('togglePasswordVisibility', { passwordVisible: !prev })
      return !prev
    })
  }, [setPasswordVisible])

  const isDropdownVariant = useMemo(
    () => componentvariant === 'dropdown',
    [componentvariant]
  )
  const isSplitButtonVariant = useMemo(
    () => componentvariant === 'splitbutton',
    [componentvariant]
  )
  const isNotchedVariant = useMemo(
    () =>
      !isDropdownVariant &&
      !isSplitButtonVariant &&
      shrunklabellocation !== 'above' &&
      !!label,
    [isDropdownVariant, isSplitButtonVariant, shrunklabellocation, label]
  )
  const hasPlaceholder = useMemo(() => !!placeholder, [placeholder])

  const shouldShrinkLabel = useMemo(
    () => !!inputValue || isFocused || hasPlaceholder,
    [inputValue, isFocused, hasPlaceholder]
  )

  const shouldNotch = useMemo(
    () => shouldShrinkLabel && isNotchedVariant,
    [shouldShrinkLabel, isNotchedVariant]
  )

  ClientLogger.debug('Rendering StyledComponent', {
    isDropdownVariant,
    isSplitButtonVariant,
    isNotchedVariant,
    hasPlaceholder,
    shouldShrinkLabel,
    shouldNotch,
    componentvariant,
    name,
    label,
    inputValue,
    phoneNumber,
    selectedOption,
    splitButtonValue,
    showError,
    currentHelperFooter: name ? helperFooters[name]?.statusMessage : undefined,
  })

  return (
    <Box
      {...restProps}
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
            inputRef={inputRef}
            minRows={minRows}
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
                ariaDescribedBy || (name && helperFooters[name]?.statusMessage)
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
                    : inputValue
            }
            readOnly={isDropdownVariant}
            notched={shouldNotch}
          />
          {isDropdownVariant && renderMenu}
        </Box>
      </Box>
      {showError && name && helperFooters[name]?.statusMessage && (
        <Typography
          id={`${name}-helper-text`}
          fontvariant="merrihelperfooter"
          fontcolor={
            helperFooters[name]?.status === 'error'
              ? red.main
              : helperFooters[name]?.status === 'success'
                ? green.dark
                : undefined
          }
          marginTop={0.5}
          marginBottom={0}
          align="left"
          text={helperFooters[name]?.statusMessage}
        />
      )}
    </Box>
  )
})

StyledComponent.displayName = 'StyledComponent'

export default StyledComponent

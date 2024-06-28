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
import { Typography } from './../Typography'
import { red, green } from '../../styles/palette'
import { formatPhoneNumber } from './utils/formatPhoneNumber'
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
  const [phoneNumber, setPhoneNumber] = useState(value || '+1 ')
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value || valuestatus) {
      setHasInput(true)
    } else {
      setHasInput(false)
    }
  }, [value, valuestatus])

  useEffect(() => {
    const input = inputRefInternal.current || inputRef?.current
    if (input) {
      input.setAttribute('autocomplete', 'new-password')
      input.setAttribute('autocorrect', 'off')
      input.setAttribute('autocapitalize', 'none')
      input.setAttribute('spellcheck', 'false')
    }
  }, [inputRef])

  useEffect(() => {
    if (required && formname && name && label) {
      const emptyFormData = new FormData()
      emptyFormData.append(name, '')
      validateField(name, emptyFormData, label, required, formname)
    }
  }, [required, formname, name, label, validateField])

  useEffect(() => {
    setShowError(formSubmitted || (hasInput && !isFocused))
  }, [formSubmitted, hasInput, isFocused])

  const { handleDropdownClick, renderMenu, selectedOption, isDropdownOpen } =
    useDropdown(props, inputBoxRef)

  usePhoneNumber(props)

  const { passwordVisible, togglePasswordVisibility } = usePassword()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (componentvariant === 'phonenumber') {
        let inputValue = e.target.value
        if (!inputValue.startsWith('+1')) {
          inputValue = '+1' + inputValue.slice(2)
        }
        const digitsOnly = inputValue.replace(/\D/g, '')
        const formattedValue = formatPhoneNumber(digitsOnly)
        setPhoneNumber(formattedValue)

        if (onChange) {
          onChange({
            ...e,
            target: {
              ...e.target,
              value: formattedValue,
            },
          })
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
      validateField,
      name,
      label,
      required,
      formname,
      serverActionValidation,
    ]
  )

  const currentHelperFooter = name ? helperFooterAtomValue[name] : undefined

  const handleFocus = () => {
    setIsFocused(true)
    if (componentvariant === 'phonenumber' && phoneNumber === '') {
      setPhoneNumber('+1 ')
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (name && label && !hasInput && formname) {
      const formData = new FormData()
      formData.append(name, '')
      validateField(name, formData, label, required, formname)
    }
  }

  const isDropdownVariant = componentvariant === 'dropdown'
  const isNotchedVariant =
    !isDropdownVariant && shrunklabellocation !== 'above' && !!label
  const hasPlaceholder = !!placeholder

  const shouldShrinkLabel =
    isFocused ||
    isDropdownVariant ||
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
            onClick={handleDropdownClick}
            style={{
              backgroundColor: backgroundcolor || 'inherit',
              width: '100%',
              height: 40,
              cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
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
                cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
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
              componentvariant === 'phonenumber'
                ? phoneNumber
                : componentvariant === 'dropdown'
                  ? selectedOption
                  : value
            }
            readOnly={componentvariant === 'dropdown'}
            notched={
              (isNotchedVariant && shouldShrinkLabel) ||
              (isDropdownVariant && shrunklabellocation !== 'above') ||
              hasPlaceholder ||
              componentvariant === 'phonenumber'
            }
          />
          {componentvariant === 'dropdown' && isDropdownOpen && renderMenu}
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

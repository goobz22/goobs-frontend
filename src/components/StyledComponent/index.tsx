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
import { get, JSONValue } from 'goobs-cache'

/**
 * Interface for helper footer messages
 */
export interface HelperFooterMessage {
  status: 'error' | 'success'
  statusMessage: string
  spreadMessage: string
  spreadMessagePriority: number
  formname: string
  required: boolean
}

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
  defaultValue?: string
  inputRef?: RefObject<HTMLInputElement>
  focused?: boolean
  required?: boolean
  formSubmitted?: boolean
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}

/**
 * Props interface for the Adornment components
 */
export interface AdornmentProps {
  componentvariant: string
  iconcolor?: string
  passwordVisible?: boolean
  marginRight?: number | string
  handleIncrement?: () => void
  handleDecrement?: () => void
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
    inputRef,
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
    onChange,
  } = props

  const { validateField } = useHelperFooter()
  const [helperFooterValue, setHelperFooterValue] = useState<
    Record<string, HelperFooterMessage>
  >({})
  const [isFocused, setIsFocused] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [showError, setShowError] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  // Fetch helper footer values from cache
  useEffect(() => {
    const fetchHelperFooter = async () => {
      const result = await get('helperFooter', 'client')
      if (result && typeof result === 'object' && 'value' in result) {
        setHelperFooterValue(
          (result as JSONValue).value as Record<string, HelperFooterMessage>
        )
      }
    }
    fetchHelperFooter()
  }, [])

  // Update hasInput state when value or valuestatus changes
  useEffect(() => {
    setHasInput(!!value || !!valuestatus)
  }, [value, valuestatus])

  // Set input attributes to prevent autocomplete and related features
  useEffect(() => {
    const input = inputRefInternal.current || inputRef?.current
    if (input) {
      input.setAttribute('autocomplete', 'new-password')
      input.setAttribute('autocorrect', 'off')
      input.setAttribute('autocapitalize', 'none')
      input.setAttribute('spellcheck', 'false')
    }
  }, [inputRef])

  // Validate field if required and necessary props are provided
  useEffect(() => {
    if (required && formname && name && label) {
      const emptyFormData = new FormData()
      emptyFormData.append(name, '')
      validateField(name, emptyFormData, label, required, formname)
    }
  }, [required, formname, name, label, validateField])

  // Update showError state based on form submission and input state
  useEffect(() => {
    setShowError(formSubmitted || (hasInput && !isFocused))
  }, [formSubmitted, hasInput, isFocused])

  // Custom hooks for specific component variants
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

  /**
   * Handle the change event of the input element.
   * @param e The change event.
   */
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (componentvariant === 'phonenumber') {
        handlePhoneNumberChange(e)
      } else if (componentvariant === 'splitbutton') {
        // Only allow numbers for splitbutton
        const numValue = e.target.value.replace(/[^0-9]/g, '')
        e.target.value = numValue
      }

      if (onChange) {
        onChange(e)
      }

      setHasInput(!!e.target.value)

      const formData = new FormData()
      formData.append(e.target.name, e.target.value)

      if (name && label && formname) {
        validateField(name, formData, label, required, formname)
      }

      // Implement validation logic directly
      if (name) {
        let result: HelperFooterMessage | undefined

        // Basic validation logic (you can expand this based on your requirements)
        if (required && !e.target.value) {
          result = {
            status: 'error',
            statusMessage: `${label} is required.`,
            spreadMessage: `${label} is required.`,
            spreadMessagePriority: 1,
            formname: formname || '',
            required: true,
          }
        } else if (
          componentvariant === 'email' &&
          !/\S+@\S+\.\S+/.test(e.target.value)
        ) {
          result = {
            status: 'error',
            statusMessage: 'Invalid email format.',
            spreadMessage: 'Invalid email format.',
            spreadMessagePriority: 1,
            formname: formname || '',
            required: required,
          }
        }
        // Add more validation rules here as needed

        if (result) {
          setHelperFooterValue(prevState => ({
            ...prevState,
            [name]: result,
          }))
        } else {
          // Clear any existing error for this field
          setHelperFooterValue(prevState => {
            const newState = { ...prevState }
            delete newState[name]
            return newState
          })
        }
      }

      // Fetch updated helper footer state
      const helperFooterResult = await get('helperFooter', 'client')
      if (
        helperFooterResult &&
        typeof helperFooterResult === 'object' &&
        'value' in helperFooterResult
      ) {
        setHelperFooterValue(prevState => ({
          ...prevState,
          ...((helperFooterResult as JSONValue).value as Record<
            string,
            HelperFooterMessage
          >),
        }))
      }
    },
    [
      componentvariant,
      handlePhoneNumberChange,
      onChange,
      validateField,
      name,
      label,
      required,
      formname,
    ]
  )

  const currentHelperFooter = name ? helperFooterValue[name] : undefined

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

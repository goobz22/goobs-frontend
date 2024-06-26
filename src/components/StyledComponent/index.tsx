'use client'

import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  RefObject,
} from 'react'
import { Box, InputLabel, OutlinedInput } from '@mui/material'
import { useDropdown } from '../../hooks/styledcomponent/useDropdown'
import { usePhoneNumber } from '../../hooks/styledcomponent/usePhoneNumber'
import { usePassword } from '../../hooks/styledcomponent/usePassword'
import { Typography } from 'goobs-repo'
import { red, green } from '../../styles/palette'
import { formatPhoneNumber } from '../../utils/phone/format'
import { StartAdornment, EndAdornment } from './adornments'
import { useAtom } from 'jotai'
import { helperFooterAtom } from '../../atoms/helperfooter'
import { debounce } from 'lodash'
import labelStyles from '../../styles/StyledComponent/Label'

interface HelperFooterMessage {
  status?: 'error' | 'success'
  statusMessage?: string
  spreadMessage?: string
  spreadMessagePriority?: number
  formname?: string
}

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
}

export interface AdornmentProps {
  componentvariant: string
  iconcolor?: string
  passwordVisible?: boolean
  // eslint-disable-next-line no-unused-vars
  togglePasswordVisibility?: (event: React.MouseEvent<HTMLDivElement>) => void
  // eslint-disable-next-line no-unused-vars
  marginRight?: number | string
}

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
  } = props

  const [helperFooterResult, setHelperFooterResult] = useAtom(helperFooterAtom)
  const [isFocused, setIsFocused] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)
  const formDataRef = useRef<FormData | null>(null)

  useEffect(() => {
    if (value || valuestatus) {
      setIsFocused(true)
    } else {
      setIsFocused(false)
    }
  }, [value, valuestatus])

  const { handleDropdownClick, renderMenu, selectedOption, isDropdownOpen } =
    useDropdown(props, inputBoxRef)

  const { handlePhoneNumberChange } = usePhoneNumber(props)

  const { passwordVisible, togglePasswordVisibility } = usePassword()

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e)
      }

      if (componentvariant === 'phonenumber') {
        const formattedValue = formatPhoneNumber(e.target.value)
        const formattedEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        }
        handlePhoneNumberChange(formattedEvent)
      }

      const formData = new FormData()
      formData.append(e.target.name, e.target.value)
      formDataRef.current = formData

      if (serverActionValidation && name) {
        const debouncedServerActionValidation = debounce(async () => {
          if (serverActionValidation && name && formDataRef.current) {
            const validationResult = await serverActionValidation(
              formDataRef.current
            )
            if (validationResult) {
              setHelperFooterResult(prevState => ({
                ...prevState,
                [name]: validationResult as HelperFooterMessage,
              }))
            }
          }
        }, 1000)

        debouncedServerActionValidation()
      }
    },
    [
      componentvariant,
      onChange,
      handlePhoneNumberChange,
      serverActionValidation,
      name,
      setHelperFooterResult,
    ]
  )

  const currentHelperFooter = name ? helperFooterResult[name] : undefined

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    if (!value && !valuestatus) {
      setIsFocused(false)
    }
  }

  const isDropdownVariant = componentvariant === 'dropdown'
  const isNotchedVariant =
    !isDropdownVariant && shrunklabellocation !== 'above' && !!label
  const hasPlaceholder = !!placeholder

  return (
    <Box
      // @ts-ignore
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
              focused: isFocused || isDropdownVariant || hasPlaceholder,
            })}
            shrink={isFocused || isDropdownVariant || hasPlaceholder}
          >
            {label}
          </InputLabel>
        )}
        <Box ref={inputBoxRef} sx={{ width: '100%' }}>
          <OutlinedInput
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
            autoComplete={props.autoComplete}
            name={name}
            value={componentvariant === 'dropdown' ? selectedOption : value}
            readOnly={componentvariant === 'dropdown'}
            notched={
              (isNotchedVariant && isFocused) ||
              (isDropdownVariant && shrunklabellocation !== 'above') ||
              hasPlaceholder
            }
          />
          {componentvariant === 'dropdown' && isDropdownOpen && renderMenu}
        </Box>
      </Box>
      {currentHelperFooter?.statusMessage && (
        <Typography
          variant="merrihelperfooter"
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

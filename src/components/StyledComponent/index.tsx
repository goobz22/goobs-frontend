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
import { HelperFooterMessage } from '../../types/validation'
import { debounce } from 'lodash'
import labelStyles from '../../styles/StyledComponent/Label'
import { columnconfig } from '../../components/Grid'

declare module '@mui/material/OutlinedInput' {
  interface OutlinedInputPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/FormControl' {
  interface FormControlPropsColorOverrides {
    [key: string]: true
  }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides {
    [key: string]: true
  }
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
  endAdornmentMarginRight?: number | string
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
  shrunklabellocation?: 'onnotch' | 'above' | 'left'
  value?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  defaultValue?: string
  inputRef?: RefObject<HTMLInputElement>
  columnconfig?: columnconfig
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
  } = props

  const [helperFooterResult, setHelperFooterResult] = useAtom(helperFooterAtom)
  const [isFocused, setIsFocused] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.value && inputRefInternal.current) {
      inputRefInternal.current.focus()
    }
  }, [props.value])

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

      if (serverActionValidation && name) {
        const formData = new FormData()
        formData.append(e.target.name, e.target.value)

        const debouncedServerActionValidation = debounce(async () => {
          if (serverActionValidation && name) {
            const validationResult = await serverActionValidation(formData)
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
    setIsFocused(false)
  }

  const isNotchedVariant = componentvariant !== 'dropdown'

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
      <InputLabel
        style={labelStyles({
          componentvariant,
          unshrunkfontcolor,
          shrunkfontcolor,
          shrunklabellocation,
          combinedfontcolor,
          focused: isFocused || !!props.value,
        })}
        shrink={isFocused || !!props.value || componentvariant === 'dropdown'}
      >
        {label}
      </InputLabel>
      <Box ref={inputBoxRef} sx={{ width: '100%', paddingTop: '5px' }}>
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
          }}
          inputProps={{
            style: {
              width: '100%',
              color: combinedfontcolor || unshrunkfontcolor || 'inherit',
              height: '100%',
              cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
            },
            placeholder: props.placeholder || '',
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
              marginRight={props.endAdornmentMarginRight}
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
          value={componentvariant === 'dropdown' ? selectedOption : props.value}
          readOnly={componentvariant === 'dropdown'}
          notched={isNotchedVariant && (isFocused || !!props.value)}
        />
        {componentvariant === 'dropdown' && isDropdownOpen && renderMenu}
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

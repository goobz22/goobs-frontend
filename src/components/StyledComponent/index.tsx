'use client'

import React, { useCallback } from 'react'
import { FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { StyledComponentProps } from '@/types/styledcomponent'
import { useDropdown } from '@/hooks/styledcomponent/useDropdown'
import { usePhoneNumber } from '@/hooks/styledcomponent/usePhoneNumber'
import { usePassword } from '@/hooks/styledcomponent/usePassword'
import Typography from '@/components/Typography'
import { theme as customTheme } from '@/themes/palette'
import { formatPhoneNumber } from '@/utils/phone/format'
import { StartAdornment, EndAdornment } from './adornments'
import { useAtom } from 'jotai'
import { helperFooterAtom } from '@/atoms/helperfooter'
import { HelperFooterMessage } from '@/types/validation'
import { debounce } from 'lodash'

const StyledComponent: React.FC<StyledComponentProps> = props => {
  const {
    label,
    componentvariant,
    outlinecolor,
    inputRef,
    name,
    serverActionValidation,
    onChange,
  } = props

  const theme = customTheme

  const [helperFooterResult, setHelperFooterResult] = useAtom(helperFooterAtom)

  const {
    handleDropdownClick,
    handleMouseEnter,
    handleMouseLeave,
    renderMenu,
    selectedOption,
  } = useDropdown(props)

  const { handlePhoneNumberChange } = usePhoneNumber(props)

  const { passwordVisible, togglePasswordVisibility } = usePassword()

  const inputLabelProps = {
    componentvariant,
    unshrunkfontcolor: props.unshrunkfontcolor,
    shrunkfontcolor: props.shrunkfontcolor,
    shrunklabellocation: props.shrunklabellocation,
    combinedfontcolor: props.combinedfontcolor,
  }

  const formControlStylingProps = {
    backgroundcolor: props.backgroundcolor,
    outlinecolor,
    iconcolor: props.iconcolor,
    componentvariant,
    unshrunkfontcolor: props.unshrunkfontcolor,
    combinedfontcolor: props.combinedfontcolor,
  }

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

  return (
    <FormControl
      ref={inputRef}
      {...formControlStylingProps}
      fullWidth
      onClick={handleDropdownClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ flexDirection: 'column' }}
    >
      <InputLabel {...inputLabelProps}>{label}</InputLabel>
      <OutlinedInput
        type={
          componentvariant === 'password' && !passwordVisible
            ? 'password'
            : 'text'
        }
        startAdornment={
          <StartAdornment componentvariant={componentvariant || ''} />
        }
        endAdornment={
          <EndAdornment
            componentvariant={componentvariant || ''}
            passwordVisible={passwordVisible}
            togglePasswordVisibility={togglePasswordVisibility}
            marginRight={props.endAdornmentMarginRight}
          />
        }
        onChange={handleChange}
        multiline={componentvariant === 'multilinetextfield'}
        label={label}
        autoComplete={props.autoComplete}
        name={props.name}
        value={componentvariant === 'dropdown' ? selectedOption : props.value}
        readOnly={componentvariant === 'dropdown'}
      />
      {currentHelperFooter?.statusMessage && (
        <Typography
          variant="merrihelperfooter"
          fontcolor={
            currentHelperFooter?.status === 'error'
              ? theme.palette.red.main
              : currentHelperFooter?.status === 'success'
                ? theme.palette.green.dark
                : undefined
          }
          marginTop={0.5}
          marginBottom={0}
          align="left"
          text={currentHelperFooter?.statusMessage}
        />
      )}
      {componentvariant === 'dropdown' && renderMenu}
    </FormControl>
  )
}

export default StyledComponent

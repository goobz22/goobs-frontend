'use client'

import React, { useCallback } from 'react'
import { FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { StyledComponentProps } from '../../types/styledcomponent'
import { useDropdown } from '../../hooks/styledcomponent/useDropdown'
import { usePhoneNumber } from '../../hooks/styledcomponent/usePhoneNumber'
import { usePassword } from '../../hooks/styledcomponent/usePassword'
import Typography from '../../components/Typography'
import { red, green } from '../../styles/palette'
import { formatPhoneNumber } from '../../utils/phone/format'
import { StartAdornment, EndAdornment } from './adornments'
import { useAtom } from 'jotai'
import { helperFooterAtom } from '../../atoms/helperfooter'
import { HelperFooterMessage } from '../../types/validation'
import { debounce } from 'lodash'
import labelStyles from '../../styles/StyledComponent/Label'
import formControlStyles from '../../styles/StyledComponent/FormControl'
import outlinedInputStyles from '../../styles/StyledComponent/OutlinedInput'

const StyledComponent: React.FC<StyledComponentProps> = props => {
  const {
    label,
    componentvariant,
    outlinecolor,
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

  const {
    handleDropdownClick,
    handleMouseEnter,
    handleMouseLeave,
    renderMenu,
    selectedOption,
  } = useDropdown(props)

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

  return (
    <FormControl
      ref={inputRef}
      style={formControlStyles({
        outlinecolor,
        backgroundcolor,
        componentvariant,
        unshrunkfontcolor,
        shrunkfontcolor,
        combinedfontcolor,
        iconcolor,
        shrunklabellocation,
      })}
      fullWidth
      onClick={handleDropdownClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InputLabel
        style={labelStyles({
          componentvariant,
          unshrunkfontcolor,
          shrunkfontcolor,
          shrunklabellocation,
          combinedfontcolor,
        })}
        shrink
      >
        {label}
      </InputLabel>
      <OutlinedInput
        style={outlinedInputStyles({
          outlinecolor,
          backgroundcolor,
          componentvariant,
          unshrunkfontcolor,
          shrunkfontcolor,
          combinedfontcolor,
          iconcolor,
          shrunklabellocation,
        })}
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
        multiline={componentvariant === 'multilinetextfield'}
        label={label}
        autoComplete={props.autoComplete}
        name={name}
        value={componentvariant === 'dropdown' ? selectedOption : props.value}
        readOnly={componentvariant === 'dropdown'}
      />
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
      {componentvariant === 'dropdown' && renderMenu}
    </FormControl>
  )
}

export default StyledComponent

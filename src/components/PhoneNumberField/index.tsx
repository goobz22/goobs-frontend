'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { Box, TextField as MuiTextField, TextFieldProps } from '@mui/material'

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  const limitedDigits = digits.slice(0, 10)
  let formattedNumber = '+1 '
  if (limitedDigits.length > 0) {
    formattedNumber += limitedDigits.slice(0, 3)
    if (limitedDigits.length > 3) {
      formattedNumber += '-' + limitedDigits.slice(3, 6)
      if (limitedDigits.length > 6) {
        formattedNumber += '-' + limitedDigits.slice(6)
      }
    }
  }
  return formattedNumber.trim()
}

const PhoneNumberField: React.FC<TextFieldProps> = React.memo(props => {
  const {
    name,
    label = 'Phone Number',
    placeholder,
    onChange,
    onFocus,
    onBlur,
    value = '',
    error,
    ...restProps
  } = props

  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(value as string)
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      let strippedInput = input.replace(/^\+1\s?/, '').replace(/\D/g, '')
      strippedInput = strippedInput.slice(0, 10)
      const formattedValue =
        strippedInput.length > 0 ? formatPhoneNumber(strippedInput) : '+1 '
      setPhoneNumber(formattedValue)
      if (onChange) {
        onChange(e)
      }
    },
    [onChange]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e)
      }
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e)
      }
    },
    [onBlur]
  )

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const inputProps = useMemo(
    () => ({
      style: {
        height: '40px',
        padding: '8px 14px',
      },
    }),
    []
  )

  const InputProps = useMemo(
    () => ({
      style: {
        height: '45px',
      },
    }),
    []
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        marginTop: '5px',
        height: '70px',
      }}
      onClick={handleClick}
    >
      <MuiTextField
        name={name}
        label={label}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={phoneNumber}
        error={error}
        fullWidth
        variant="outlined"
        inputProps={inputProps}
        InputProps={InputProps}
        {...restProps}
      />
    </Box>
  )
})

PhoneNumberField.displayName = 'PhoneNumberField'

export default PhoneNumberField

'use client'
import React, { useCallback, useState, useMemo } from 'react'
import { Box } from '@mui/material'
import TextField, { TextFieldProps } from '../TextField'

const formatPhoneNumber = (inputValue: string): string => {
  let digits = inputValue.replace(/\D/g, '')
  // If it starts with '1', remove it because we already provide '+1'
  if (digits.startsWith('1')) {
    digits = digits.slice(1)
  }

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

      // Remove leading '1' if present
      if (strippedInput.startsWith('1')) {
        strippedInput = strippedInput.slice(1)
      }

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

  const mergedSlotProps = useMemo(() => {
    return {
      input: {
        sx: {
          height: '40px',
          padding: '8px 0px',
        },
      },
      inputLabel: {
        sx: {
          '&.MuiInputLabel-shrink': {
            top: '0px',
            left: '0px',
          },
          '&:not(.MuiInputLabel-shrink)': {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            top: '9px',
            left: '12px',
          },
        },
      },
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
      }}
      onClick={handleClick}
    >
      <TextField
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
        slotProps={mergedSlotProps}
        {...restProps}
      />
    </Box>
  )
})

PhoneNumberField.displayName = 'PhoneNumberField'

export default PhoneNumberField

'use client'
import React, { useState, useCallback } from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

interface PhoneNumberFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: () => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
}

const StyledTextField = styled(TextField)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}>(({ theme, backgroundcolor, outlinecolor, fontcolor }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: backgroundcolor || theme.palette.background.paper,
    '& fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: fontcolor || theme.palette.text.primary,
    '&.Mui-focused': {
      color: fontcolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: fontcolor || theme.palette.text.primary,
  },
}))

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

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  initialValue = '',
  onChange,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  label = 'Phone Number',
  ...rest
}) => {
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(initialValue)
  )

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = e.target.value
      let strippedInput = input.replace(/^\+1\s?/, '').replace(/\D/g, '')
      strippedInput = strippedInput.slice(0, 10)
      const formattedValue =
        strippedInput.length > 0 ? formatPhoneNumber(strippedInput) : '+1 '
      setPhoneNumber(formattedValue)
      onChange?.()
    },
    [onChange]
  )

  return (
    <StyledTextField
      label={label}
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      fontcolor={fontcolor}
      fullWidth
      inputProps={{
        maxLength: 16,
      }}
      {...rest}
    />
  )
}

export default PhoneNumberField

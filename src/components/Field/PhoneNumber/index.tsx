'use client'
import React, { useCallback, useState, useMemo } from 'react'
import { Box, alpha, keyframes, Typography } from '@mui/material'
import TextField, { TextFieldProps } from '../Text'

// Sacred animations
const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
`

const formatPhoneNumber = (inputValue: string): string => {
  let digits = inputValue.replace(/\D/g, '')

  // If it starts with '1', remove it as we'll add '+1' prefix
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

  return formattedNumber // Don't trim, keep the space after +1
}

// Helper function to clean and parse existing phone number values
const parseExistingPhoneNumber = (value: string): string => {
  if (!value) return '+1 ' // Return +1 with space for empty values

  // If it already has +1, extract just the digits and reformat
  if (value.includes('+1')) {
    const digits = value.replace(/\D/g, '').replace(/^1/, '') // Remove all non-digits and leading 1
    return formatPhoneNumber(digits)
  }

  // If it's just digits, format normally
  return formatPhoneNumber(value)
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
    sacredTheme = false,
    ...restProps
  } = props

  const [phoneNumber, setPhoneNumber] = useState(() =>
    parseExistingPhoneNumber(value as string)
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value

      // If user is deleting and we get to just '+1 ', allow it
      if (input === '+1 ' || input === '+1' || input === '+') {
        setPhoneNumber('+1 ')
        if (onChange) {
          const mockEvent = { ...e, target: { ...e.target, value: '+1 ' } }
          onChange(mockEvent)
        }
        return
      }

      // Extract digits from input, removing +1 prefix if present
      let strippedInput = input.replace(/^\+1\s?/, '').replace(/\D/g, '')

      // Remove leading '1' if present (in case user types it)
      if (strippedInput.startsWith('1')) {
        strippedInput = strippedInput.slice(1)
      }

      strippedInput = strippedInput.slice(0, 10)
      const formattedValue = formatPhoneNumber(strippedInput)
      setPhoneNumber(formattedValue)

      if (onChange) {
        // Pass the formatted value including +1 and dashes to parent
        const mockEvent = {
          ...e,
          target: { ...e.target, value: formattedValue },
        }
        onChange(mockEvent)
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

  // No longer need startAdornment since +1 is part of the value
  const endAdornment = useMemo(
    () =>
      sacredTheme ? (
        <Typography
          sx={{
            color: alpha('#FFD700', 0.4),
            fontSize: '14px',
            animation: `${glowPulse} 3s ease-in-out infinite`,
          }}
        >
          𓋴
        </Typography>
      ) : undefined,
    [sacredTheme]
  )

  const mergedSlotProps = useMemo(() => {
    return {
      input: {
        sx: {
          height: '40px',
          padding: '0px 0px 0px 0px',
          '& .MuiOutlinedInput-input': {
            paddingLeft: '14px !important', // Add left padding for the +1 that's now part of input value
          },
          '& .MuiInputAdornment-positionStart': {
            marginRight: '4px !important', // Reduce margin between adornment and input
          },
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
        label={sacredTheme ? 'Sacred Connection' : label}
        placeholder={sacredTheme ? 'Divine number...' : placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={phoneNumber}
        error={error}
        fullWidth
        variant="outlined"
        slotProps={mergedSlotProps}
        endAdornment={endAdornment}
        sacredTheme={sacredTheme}
        {...restProps}
      />
    </Box>
  )
})

PhoneNumberField.displayName = 'PhoneNumberField'

export default PhoneNumberField

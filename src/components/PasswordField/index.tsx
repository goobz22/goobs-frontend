'use client'
import React, { useState, useCallback } from 'react'
import { TextField, TextFieldProps, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles'
import ShowHideEyeIcon from '../Icons/ShowHideEye'

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
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

interface AdornmentProps {
  componentvariant: string
  passwordVisible?: boolean
  togglePasswordVisibility?: () => void
}

const EndAdornment: React.FC<AdornmentProps> = ({
  componentvariant,
  passwordVisible,
  togglePasswordVisibility,
}) => {
  if (componentvariant === 'password') {
    return (
      <InputAdornment
        position="end"
        onClick={togglePasswordVisibility}
        style={{ cursor: 'pointer' }}
      >
        <ShowHideEyeIcon visible={passwordVisible} />
      </InputAdornment>
    )
  }
  return null
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  backgroundcolor,
  outlinecolor,
  fontcolor,
  label = 'Password',
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(prev => {
      console.log('togglePasswordVisibility', { passwordVisible: !prev })
      return !prev
    })
  }, [])

  return (
    <StyledTextField
      type={passwordVisible ? 'text' : 'password'}
      label={label}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      fontcolor={fontcolor}
      fullWidth
      InputProps={{
        endAdornment: (
          <EndAdornment
            componentvariant="password"
            passwordVisible={passwordVisible}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        ),
      }}
      {...rest}
    />
  )
}

export default PasswordField

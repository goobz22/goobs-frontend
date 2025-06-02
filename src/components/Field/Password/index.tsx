'use client'
import React, { useState, useCallback } from 'react'
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  alpha,
  keyframes,
  Box,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ShowHideEyeIcon from '../../Icons/ShowHideEye'

// Sacred animations
const sacredGlow = keyframes`
  0% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9)); }
  100% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
  /** Enable sacred Egyptian theme */
  sacredTheme?: boolean
}

const StyledTextField = styled(TextField)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  sacredtheme?: boolean
}>(({ theme, backgroundcolor, outlinecolor, fontcolor, sacredtheme }) => ({
  position: 'relative',
  '& .MuiOutlinedInput-root': {
    backgroundColor: sacredtheme
      ? alpha('#000000', 0.8)
      : backgroundcolor || theme.palette.background.paper,
    ...(sacredtheme && {
      backgroundImage: `
        linear-gradient(rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05)),
        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
      `,
      '&::after': {
        content: '"𓊨"',
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        color: alpha('#FFD700', 0.3),
        fontSize: '14px',
        pointerEvents: 'none',
        zIndex: 1,
        animation: `${floatGlyph} 4s ease-in-out infinite`,
      },
    }),
    '& fieldset': {
      borderColor: sacredtheme
        ? '#FFD700'
        : outlinecolor || theme.palette.primary.main,
      ...(sacredtheme && {
        borderWidth: '2px',
      }),
    },
    '&:hover fieldset': {
      borderColor: sacredtheme
        ? '#FFD700'
        : outlinecolor || theme.palette.primary.main,
      ...(sacredtheme && {
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
      }),
    },
    '&.Mui-focused fieldset': {
      borderColor: sacredtheme
        ? '#FFD700'
        : outlinecolor || theme.palette.primary.main,
      ...(sacredtheme && {
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
      }),
    },
  },
  '& .MuiInputLabel-root': {
    color: sacredtheme
      ? alpha('#FFD700', 0.8)
      : fontcolor || theme.palette.text.primary,
    ...(sacredtheme && {
      textShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
      fontWeight: 500,
      letterSpacing: '0.5px',
    }),
    '&.Mui-focused': {
      color: sacredtheme ? '#FFD700' : fontcolor || theme.palette.primary.main,
      ...(sacredtheme && {
        textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
      }),
    },
  },
  '& .MuiInputBase-input': {
    color: sacredtheme ? '#FFD700' : fontcolor || theme.palette.text.primary,
    ...(sacredtheme && {
      textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
      fontWeight: 500,
      paddingLeft: '30px',
    }),
    '&::placeholder': {
      color: sacredtheme ? alpha('#FFD700', 0.7) : 'rgba(0, 0, 0, 0.54)',
      ...(sacredtheme && {
        fontStyle: 'italic',
        letterSpacing: '0.5px',
      }),
    },
  },
}))

interface AdornmentProps {
  componentvariant: string
  passwordVisible?: boolean
  togglePasswordVisibility?: () => void
  sacredTheme?: boolean
}

const EndAdornment: React.FC<AdornmentProps> = ({
  componentvariant,
  passwordVisible,
  togglePasswordVisibility,
  sacredTheme,
}) => {
  if (componentvariant === 'password') {
    return (
      <InputAdornment
        position="end"
        onClick={togglePasswordVisibility}
        style={{ cursor: 'pointer' }}
      >
        <Box sx={{ position: 'relative' }}>
          {sacredTheme && (
            <Box
              sx={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: alpha('#FFD700', 0.4),
                fontSize: '12px',
                animation: `${floatGlyph} 3s ease-in-out infinite`,
              }}
            >
              {passwordVisible ? '𓁦' : '𓁟'}
            </Box>
          )}
          <ShowHideEyeIcon
            visible={passwordVisible}
            sx={{
              color: sacredTheme ? '#FFD700' : 'inherit',
              ...(sacredTheme && {
                animation: `${sacredGlow} 2s ease-in-out infinite`,
              }),
            }}
          />
        </Box>
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
  sacredTheme = false,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(prev => !prev)
  }, [])

  return (
    <StyledTextField
      type={passwordVisible ? 'text' : 'password'}
      label={sacredTheme ? 'Sacred Key' : label}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      fontcolor={fontcolor}
      sacredtheme={sacredTheme}
      fullWidth
      placeholder={sacredTheme ? 'Enter divine secret...' : undefined}
      InputProps={{
        endAdornment: (
          <EndAdornment
            componentvariant="password"
            passwordVisible={passwordVisible}
            togglePasswordVisibility={togglePasswordVisibility}
            sacredTheme={sacredTheme}
          />
        ),
      }}
      {...rest}
    />
  )
}

export default PasswordField

// src/components/ComplexTextEditor/SimpleEditor/index.tsx

import React from 'react'
import { Box, TextField, keyframes, alpha } from '@mui/material'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓋴', '𓏏', '𓊨', '𓁦']

const sacredInputGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1); }
`

const glyphPulse = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 0.5; }
  100% { opacity: 0.2; }
`

type SimpleEditorProps = {
  value: string
  setValue: (value: string) => void
  minRows?: number
  label?: string
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
  sacredTheme?: boolean
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  setValue,
  minRows = 5,
  label,
  error,
  helperText,
  required,
  style,
  sacredTheme = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const defaultStyles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  }

  const combinedStyles = {
    ...defaultStyles,
    ...style,
  }

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
      color: sacredTheme ? alpha('#FFD700', 0.9) : 'inherit',
      ...(sacredTheme && {
        animation: `${sacredInputGlow} 4s ease-in-out infinite`,
      }),
      '& fieldset': {
        borderColor: sacredTheme ? alpha('#FFD700', 0.3) : 'black',
      },
      '&:hover fieldset': {
        borderColor: sacredTheme ? alpha('#FFD700', 0.5) : 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: sacredTheme ? '#FFD700' : 'black',
        ...(sacredTheme && {
          borderWidth: '2px',
        }),
      },
      '& .MuiInputBase-input': {
        transform: 'translateY(-8px)',
        ...(sacredTheme && {
          fontFamily: 'monospace',
          letterSpacing: '0.5px',
          textShadow: '0 0 2px rgba(255, 215, 0, 0.3)',
          '&::placeholder': {
            color: alpha('#FFD700', 0.5),
            fontStyle: 'italic',
          },
        }),
      },
    },
    '& .MuiInputLabel-root': {
      color: sacredTheme ? alpha('#FFD700', 0.8) : 'black',
      ...(sacredTheme && {
        fontFamily: '"Cinzel", serif',
        fontWeight: 600,
        letterSpacing: '1px',
      }),
      '&.Mui-focused': {
        color: sacredTheme ? '#FFD700' : 'black',
        ...(sacredTheme && {
          textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
        }),
      },
    },
    '& .MuiFormHelperText-root': {
      color: sacredTheme ? alpha('#FFD700', 0.7) : undefined,
      ...(sacredTheme && {
        fontStyle: 'italic',
      }),
    },
  }

  return (
    <Box sx={combinedStyles}>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        minRows={minRows}
        label={label}
        value={value}
        error={error}
        helperText={helperText}
        required={required}
        onChange={handleChange}
        sx={textFieldStyles}
        placeholder={sacredTheme ? 'Inscribe your sacred text...' : undefined}
      />
      {/* Sacred decorative elements */}
      {sacredTheme && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: alpha('#FFD700', 0.2),
              fontSize: '20px',
              animation: `${glyphPulse} 3s ease-in-out infinite`,
              pointerEvents: 'none',
            }}
          >
            {SACRED_GLYPHS[0]}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              color: alpha('#FFD700', 0.2),
              fontSize: '20px',
              animation: `${glyphPulse} 3s ease-in-out infinite 1.5s`,
              pointerEvents: 'none',
            }}
          >
            {SACRED_GLYPHS[2]}
          </Box>
        </>
      )}
    </Box>
  )
}

export default SimpleEditor

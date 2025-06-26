'use client'
import React, { useCallback } from 'react'
import {
  Box,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  StandardTextFieldProps,
  OutlinedTextFieldProps,
  FilledTextFieldProps,
  styled,
  keyframes,
  alpha,
} from '@mui/material'

// Sacred theme animations
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

export type TextFieldProps = (
  | StandardTextFieldProps
  | OutlinedTextFieldProps
  | FilledTextFieldProps
) & {
  /** element rendered on the left side of the input */
  startAdornment?: React.ReactNode
  /** element rendered on the right side of the input */
  endAdornment?: React.ReactNode
  value?: string | number | readonly string[] | undefined
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  error?: boolean
  name?: string
  label?: React.ReactNode
  placeholder?: string
  textAlign?: 'left' | 'center' | 'right'
  inputPadding?: {
    top?: number
    left?: number
  }
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  sx?: MuiTextFieldProps['sx']
  slotProps?: MuiTextFieldProps['slotProps']
  disabled?: boolean
  /** Enable sacred Egyptian theme */
  sacredtheme?: boolean
}

interface StyledTextFieldProps {
  hasvalue: string
  textalign?: 'left' | 'center' | 'right'
  paddingleft?: number
  paddingtop?: number
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  sacredtheme?: boolean
}

const StyledMuiTextField = styled(MuiTextField, {
  shouldForwardProp: prop =>
    ![
      'hasvalue',
      'textalign',
      'paddingleft',
      'paddingtop',
      'backgroundcolor',
      'outlinecolor',
      'fontcolor',
      'inputfontcolor',
      'shrunkfontcolor',
      'unshrunkfontcolor',
      'placeholdercolor',
      'shrunklabelposition',
      'sacredtheme',
    ].includes(prop as string),
})<StyledTextFieldProps>(
  ({
    hasvalue,
    textalign = 'left',
    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    shrunkfontcolor,
    unshrunkfontcolor,
    placeholdercolor,
    shrunklabelposition,
    sacredtheme,
  }) => ({
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      minHeight: '40px',
      height: 'auto',
      backgroundColor: sacredtheme
        ? alpha('#000000', 0.8)
        : backgroundcolor || 'inherit',
      color: sacredtheme ? '#FFD700' : fontcolor || 'black',
      transition: 'all 0.3s ease',
      ...(sacredtheme && {
        backgroundImage: `
          linear-gradient(rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05)),
          radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
        `,
        '&::before': {
          content: '"𓊹"',
          position: 'absolute',
          top: '50%',
          right: '15px',
          transform: 'translateY(-50%)',
          color: alpha('#FFD700', 0.3),
          fontSize: '14px',
          pointerEvents: 'none',
          zIndex: 0,
          animation: `${floatGlyph} 3s ease-in-out infinite`,
        },
      }),
      '& .MuiSelect-icon': {
        color: sacredtheme ? '#FFD700' : 'black !important',
      },
      '& fieldset': {
        borderColor: sacredtheme
          ? '#FFD700'
          : outlinecolor ||
            (hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)'),
        ...(sacredtheme && {
          borderWidth: '2px',
        }),
        ...(shrunklabelposition === 'aboveNotch' && {
          legend: { width: '0px !important' },
        }),
      },
      '&:hover fieldset': {
        borderColor: sacredtheme
          ? '#FFD700'
          : outlinecolor ||
            (hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)'),
        ...(sacredtheme && {
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
        }),
      },
      '&.Mui-focused fieldset': {
        borderColor: sacredtheme
          ? '#FFD700'
          : outlinecolor ||
            (hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)'),
        ...(sacredtheme && {
          animation: `${sacredGlow} 2s ease-in-out infinite`,
        }),
      },
      '& input': {
        color: sacredtheme ? '#FFD700' : inputfontcolor || fontcolor || 'black',
        ...(sacredtheme && {
          textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
          fontWeight: 500,
        }),
        '&::placeholder': {
          color: sacredtheme
            ? alpha('#FFD700', 0.7)
            : placeholdercolor || 'rgba(0, 0, 0, 0.54)',
          opacity: 1,
          ...(sacredtheme && {
            fontStyle: 'italic',
            letterSpacing: '0.5px',
          }),
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: sacredtheme ? alpha('#FFD700', 0.8) : unshrunkfontcolor || 'black',
      ...(sacredtheme && {
        textShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
        fontWeight: 500,
        letterSpacing: '0.5px',
      }),
      '&.Mui-focused': {
        color: sacredtheme ? '#FFD700' : shrunkfontcolor || 'black',
        ...(sacredtheme && {
          textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
        }),
      },
      '&.MuiInputLabel-shrink': {
        color: sacredtheme ? '#FFD700' : shrunkfontcolor || 'black',
        ...(sacredtheme && {
          textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
          fontWeight: 600,
        }),
        ...(shrunklabelposition === 'aboveNotch' && {
          transform: 'translate(0px, -17px) scale(0.75)',
        }),
        ...(shrunklabelposition === 'onNotch' && {
          transform: 'translate(13px, -4px) scale(0.75)',
        }),
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      textAlign: textalign,
    },
    // Sacred adornment styling
    '& .MuiInputAdornment-root': {
      ...(sacredtheme && {
        color: '#FFD700',
        '& svg': {
          color: '#FFD700',
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
        },
      }),
    },
  })
)

const TextField = React.memo<TextFieldProps>(props => {
  const {
    name,
    label,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    value,
    error,
    disabled,
    sx,
    startAdornment,
    endAdornment,
    textAlign = 'left',
    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    shrunkfontcolor,
    unshrunkfontcolor,
    placeholdercolor,
    shrunklabelposition,
    sacredtheme = false,
    ...restProps
  } = props

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e),
    [onChange]
  )
  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => onFocus?.(e),
    [onFocus]
  )
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => onBlur?.(e),
    [onBlur]
  )

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const hasValue = Boolean(value?.toString().length).toString()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: '15px',
        height: 'auto',
        overflow: 'visible',
        position: 'relative',
        ...sx,
      }}
      onClick={handleClick}
    >
      <StyledMuiTextField
        name={name}
        label={label}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        error={error}
        disabled={disabled}
        InputProps={{
          startAdornment,
          endAdornment,
        }}
        sx={{
          // Hide the sacred hieroglyph when there's an endAdornment
          ...(sacredtheme &&
            endAdornment && {
              '& .MuiOutlinedInput-root::before': {
                display: 'none !important',
              },
            }),
        }}
        fullWidth
        variant="outlined"
        hasvalue={hasValue}
        textalign={textAlign}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        inputfontcolor={inputfontcolor}
        shrunkfontcolor={shrunkfontcolor}
        unshrunkfontcolor={unshrunkfontcolor}
        placeholdercolor={placeholdercolor}
        shrunklabelposition={shrunklabelposition}
        sacredtheme={sacredtheme}
        {...restProps}
      />
    </Box>
  )
})

TextField.displayName = 'TextField'
export default TextField

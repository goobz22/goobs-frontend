'use client'
import React, { useCallback, useMemo } from 'react'
import {
  Box,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  StandardTextFieldProps,
  OutlinedTextFieldProps,
  FilledTextFieldProps,
  styled,
} from '@mui/material'

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
  }) => ({
    '& .MuiOutlinedInput-root': {
      minHeight: '40px',
      height: 'auto',
      backgroundColor: backgroundcolor || 'inherit',
      color: fontcolor || 'black',
      '& .MuiSelect-icon': {
        color: 'black !important',
      },
      '& fieldset': {
        borderColor:
          outlinecolor ||
          (hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)'),
        ...(shrunklabelposition === 'aboveNotch' && {
          legend: { width: '0px !important' },
        }),
      },
      '&:hover fieldset': {
        borderColor:
          outlinecolor ||
          (hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)'),
      },
      '&.Mui-focused fieldset': {
        borderColor:
          outlinecolor ||
          (hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)'),
      },
      '& input': {
        color: inputfontcolor || fontcolor || 'black',
        '&::placeholder': {
          color: placeholdercolor || 'rgba(0, 0, 0, 0.54)',
          opacity: 1,
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: unshrunkfontcolor || 'black',
      '&.Mui-focused': { color: shrunkfontcolor || 'black' },
      '&.MuiInputLabel-shrink': {
        color: shrunkfontcolor || 'black',
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
    slotProps: customSlotProps = {},
    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    shrunkfontcolor,
    unshrunkfontcolor,
    placeholdercolor,
    shrunklabelposition,
    ...restProps
  } = props

  const inputStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor: backgroundcolor || 'inherit',
      width: '100%',
      cursor: 'text',
      boxSizing: 'border-box',
      borderRadius: 5,
    }),
    [backgroundcolor]
  )

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

  const mergedSlotProps = useMemo(() => {
    const adornmentSx = {
      color: '#000000 !important',
      '& svg': {
        color: '#000000 !important',
        fill: '#000000 !important',
        stroke: '#000000 !important',
      },
    }

    const defaultSlotProps = {
      input: {
        style: inputStyle,
        ...(startAdornment && {
          startAdornment: (
            <InputAdornment position="start" sx={adornmentSx}>
              {startAdornment}
            </InputAdornment>
          ),
        }),
        ...(endAdornment && {
          endAdornment: (
            <InputAdornment position="end" sx={adornmentSx}>
              {endAdornment}
            </InputAdornment>
          ),
        }),
      },
      inputLabel: {
        sx: {
          '&.MuiInputLabel-shrink': { top: '0px', left: '0px' },
          '&:not(.MuiInputLabel-shrink)': {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            top: '9px',
            left: '12px',
          },
        },
      },
    }

    return {
      ...defaultSlotProps,
      input: {
        ...defaultSlotProps.input,
        ...(customSlotProps.input || {}),
      },
      inputLabel: {
        ...defaultSlotProps.inputLabel,
        ...(customSlotProps.inputLabel || {}),
      },
    }
  }, [inputStyle, startAdornment, endAdornment, customSlotProps])

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
        slotProps={mergedSlotProps}
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
        {...restProps}
      />
    </Box>
  )
})

TextField.displayName = 'TextField'
export default TextField

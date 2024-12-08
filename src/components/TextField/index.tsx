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
  sx?: MuiTextFieldProps['sx']
  slotProps?: MuiTextFieldProps['slotProps']
}

const StyledMuiTextField = styled(MuiTextField)<{
  hasvalue: string
  textalign?: string
  paddingleft?: number
  paddingtop?: number
}>(({ hasvalue, textalign = 'left' }) => ({
  '& .MuiOutlinedInput-root': {
    minHeight: '40px',
    height: '40px',
    '& fieldset': {
      borderColor: hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)',
    },
    '&.Mui-focused fieldset': {
      borderColor: hasvalue === 'true' ? 'black' : 'rgba(0, 0, 0, 0.23)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'black',
    '&.Mui-focused': {
      color: 'black',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 14px',
    textAlign: textalign,
  },
}))

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
    sx,
    endAdornment,
    textAlign = 'left',
    slotProps: customSlotProps = {},
    ...restProps
  } = props

  const inputStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor: 'inherit',
      width: '100%',
      cursor: 'text',
      boxSizing: 'border-box',
      borderRadius: 5,
    }),
    []
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const defaultSlotProps = {
      input: {
        style: inputStyle,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : undefined,
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
  }, [inputStyle, endAdornment, customSlotProps])

  const hasValue = Boolean(value?.toString().length).toString()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: '5px',
        height: '50px',
        overflow: 'hidden',
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
        slotProps={mergedSlotProps}
        fullWidth
        variant="outlined"
        hasvalue={hasValue}
        textalign={textAlign}
        {...restProps}
      />
    </Box>
  )
})

TextField.displayName = 'TextField'

export default TextField

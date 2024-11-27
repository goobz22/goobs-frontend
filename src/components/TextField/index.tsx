'use client'
import React, { useCallback, useMemo } from 'react'
import { Box, TextField as MuiTextField, TextFieldProps } from '@mui/material'

const TextField: React.FC<TextFieldProps> = React.memo(props => {
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
    ...restProps
  } = props

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

  const inputStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor: 'inherit',
      width: '100%',
      height: 40,
      cursor: 'text',
      boxSizing: 'border-box',
      borderRadius: 5,
      paddingRight: 6,
    }),
    []
  )

  const slotProps = useMemo(
    () => ({
      input: {
        style: inputStyle,
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
    }),
    [inputStyle]
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
        ...sx,
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
        value={value}
        error={error}
        slotProps={slotProps}
        fullWidth
        variant="outlined"
        {...restProps}
      />
    </Box>
  )
})

TextField.displayName = 'TextField'

export default TextField

import React from 'react'
import { Box, TextField } from '@mui/material'

type SimpleEditorProps = {
  value: string
  setValue: (value: string) => void
  minRows?: number
  label?: string
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
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
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const defaultStyles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  const combinedStyles = {
    ...defaultStyles,
    ...style,
  }

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
      '& .MuiInputBase-input': {
        transform: 'translateY(-8px)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'black',
      '&.Mui-focused': {
        color: 'black',
      },
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
      />
    </Box>
  )
}

export default SimpleEditor

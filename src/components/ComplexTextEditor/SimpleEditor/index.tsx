// src\components\ComplexTextEditor\SimpleEditor.tsx

import React from 'react'
import { Box, TextField } from '@mui/material'

type SimpleEditorProps = {
  value: string
  setValue: (value: string) => void
  minRows?: number
  label?: string
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  setValue,
  minRows = 5,
  label,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        multiline
        label={label}
        variant="outlined"
        minRows={minRows}
        value={value}
        onChange={handleChange}
        sx={{
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
        }}
      />
    </Box>
  )
}

export default SimpleEditor

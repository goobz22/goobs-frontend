import React from 'react'
import { TextField, InputAdornment, styled } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export interface SearchbarProps {
  label?: string
  backgroundcolor?: string
  iconcolor?: string
  outlinecolor?: string
  fontcolor?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const StyledTextField = styled(TextField)<{
  backgroundcolor?: string
  outlinecolor?: string
  $fontcolor?: string
}>(({ theme, backgroundcolor, outlinecolor, $fontcolor }) => ({
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
    color: $fontcolor || theme.palette.text.primary,
    '&.Mui-focused': {
      color: $fontcolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: $fontcolor || theme.palette.text.primary,
  },
}))

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  backgroundcolor,
  iconcolor,
  outlinecolor,
  fontcolor,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <StyledTextField
      label={label}
      variant="outlined"
      fullWidth
      placeholder={placeholder}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      $fontcolor={fontcolor}
      value={value}
      onChange={onChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: iconcolor }} />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export default Searchbar

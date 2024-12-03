'use client'
import React, { useState } from 'react'
import {
  OutlinedInput,
  styled,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import * as palette from '../../styles/palette'

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

const StyledFormControl = styled(FormControl)({
  width: '100%',
  position: 'relative',
  height: '45px',
  display: 'flex',
  justifyContent: 'flex-end',
})

const StyledOutlinedInput = styled(OutlinedInput)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}>(({ backgroundcolor, outlinecolor, fontcolor }) => ({
  height: '40px',
  backgroundColor: backgroundcolor || palette.white.main,
  '& .MuiOutlinedInput-notchedOutline': {
    border:
      outlinecolor === 'none'
        ? 'none'
        : `1px solid ${outlinecolor || palette.black.main}`,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border:
      outlinecolor === 'none'
        ? 'none'
        : `1px solid ${outlinecolor || palette.black.main}`,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border:
      outlinecolor === 'none'
        ? 'none'
        : `1px solid ${outlinecolor || palette.black.main}`,
    borderWidth: outlinecolor === 'none' ? '0' : '1px',
  },
  '& input': {
    color: fontcolor || palette.black.main,
    padding: '0 12px',
    paddingLeft: '7px',
    height: '100%',
    '&::placeholder': {
      color: fontcolor || palette.black.main,
      opacity: 0.7,
    },
  },
}))

const StyledInputLabel = styled(InputLabel)<{
  fontcolor?: string
}>(({ fontcolor }) => ({
  color: fontcolor || palette.black.main,
  transform: 'translate(44px, 20px) scale(1)',
  position: 'absolute',
  top: '-5px',
  '&.Mui-focused': {
    color: fontcolor || palette.black.main,
  },
  '&.MuiInputLabel-shrink': {
    transform: 'translate(14px, 3px) scale(0.75)',
    color: fontcolor || palette.black.main,
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
  const [focused, setFocused] = useState(false)
  const isLabelShrunken = focused || Boolean(value)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  return (
    <StyledFormControl variant="outlined">
      <StyledInputLabel
        variant="outlined"
        htmlFor="search-input"
        shrink={isLabelShrunken}
        fontcolor={fontcolor}
      >
        {label}
      </StyledInputLabel>
      <StyledOutlinedInput
        id="search-input"
        label={label}
        notched={isLabelShrunken}
        placeholder={isLabelShrunken ? placeholder : ''}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ color: iconcolor || palette.black.main }} />
          </InputAdornment>
        }
      />
    </StyledFormControl>
  )
}

export default Searchbar

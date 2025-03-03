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
import * as palette from '../../../styles/palette'

export interface SearchbarProps {
  label?: string
  backgroundcolor?: string
  iconcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholder?: string
  value: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const StyledFormControl = styled(FormControl)({
  width: '100%',
  position: 'relative',
  height: '50px',
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
    paddingLeft: '0px',
    height: '100%',
    '&::placeholder': {
      color: fontcolor || palette.black.main,
      opacity: 0.7,
    },
  },
}))

const StyledInputLabel = styled(InputLabel)<{
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
}>(
  ({ fontcolor, shrunkfontcolor, unshrunkfontcolor, shrunklabelposition }) => ({
    color: unshrunkfontcolor || fontcolor || palette.black.main,
    position: 'absolute',
    top: '-5px',
    overflow: 'visible',
    zIndex: 1,
    '&.Mui-focused': {
      color: shrunkfontcolor || fontcolor || palette.black.main,
    },
    '&.MuiInputLabel-shrink': {
      color: shrunkfontcolor || fontcolor || palette.black.main,
      ...(shrunklabelposition === 'aboveNotch' && {
        transform: 'translate(0px, 0px) scale(0.75)',
      }),
      ...(shrunklabelposition === 'onNotch' && {
        transform: 'translate(15px, 7px) scale(0.75)',
      }),
    },
    '&:not(.MuiInputLabel-shrink)': {
      transform: 'none',
      top: '18px',
      left: '44px',
    },
  })
)

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  backgroundcolor,
  iconcolor,
  outlinecolor,
  fontcolor,
  shrunkfontcolor,
  unshrunkfontcolor,
  placeholder,
  value,
  shrunklabelposition = 'onNotch',
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
        shrunkfontcolor={shrunkfontcolor}
        unshrunkfontcolor={unshrunkfontcolor}
        shrunklabelposition={shrunklabelposition}
      >
        {label}
      </StyledInputLabel>
      <StyledOutlinedInput
        id="search-input"
        label={label}
        notched={shrunklabelposition === 'onNotch' && isLabelShrunken}
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

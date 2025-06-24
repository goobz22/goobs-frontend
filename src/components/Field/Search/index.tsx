'use client'
import React, { useState } from 'react'
import {
  OutlinedInput,
  styled,
  FormControl,
  InputLabel,
  InputAdornment,
  alpha,
  keyframes,
  Box,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import * as palette from '../../../styles/palette'

// Sacred animations
const sacredPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`

const goldShimmer = keyframes`
  0% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9)); }
  100% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); }
`

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
  /** Enable sacred Egyptian theme */
  sacredtheme?: boolean
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
  sacredtheme?: boolean
}>(({ backgroundcolor, outlinecolor, fontcolor, sacredtheme }) => ({
  height: '40px',
  backgroundColor: sacredtheme
    ? alpha('#000000', 0.8)
    : backgroundcolor || palette.white.main,
  position: 'relative',
  ...(sacredtheme && {
    backgroundImage: `
      linear-gradient(rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05)),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
    `,
  }),
  '& .MuiOutlinedInput-notchedOutline': {
    border:
      outlinecolor === 'none'
        ? 'none'
        : `1px solid ${outlinecolor || (sacredtheme ? '#FFD700' : palette.black.main)}`,
    ...(sacredtheme && {
      borderWidth: '2px',
    }),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border:
      outlinecolor === 'none'
        ? 'none'
        : `1px solid ${outlinecolor || (sacredtheme ? '#FFD700' : palette.black.main)}`,
    ...(sacredtheme && {
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
    }),
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border:
      outlinecolor === 'none'
        ? 'none'
        : `1px solid ${outlinecolor || (sacredtheme ? '#FFD700' : palette.black.main)}`,
    borderWidth: outlinecolor === 'none' ? '0' : sacredtheme ? '2px' : '1px',
    ...(sacredtheme && {
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
    }),
  },
  '& input': {
    color: sacredtheme ? '#FFD700' : fontcolor || palette.black.main,
    padding: '0 12px',
    paddingLeft: '0px',
    height: '100%',
    ...(sacredtheme && {
      textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
      fontWeight: 500,
    }),
    '&::placeholder': {
      color: sacredtheme
        ? alpha('#FFD700', 0.7)
        : fontcolor || palette.black.main,
      opacity: sacredtheme ? 1 : 0.7,
      ...(sacredtheme && {
        fontStyle: 'italic',
        letterSpacing: '0.5px',
      }),
    },
  },
}))

const StyledInputLabel = styled(InputLabel)<{
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  sacredtheme?: boolean
}>(
  ({
    fontcolor,
    shrunkfontcolor,
    unshrunkfontcolor,
    shrunklabelposition,
    sacredtheme,
  }) => ({
    color: sacredtheme
      ? alpha('#FFD700', 0.8)
      : unshrunkfontcolor || fontcolor || palette.black.main,
    position: 'absolute',
    top: '-5px',
    overflow: 'visible',
    zIndex: 1,
    ...(sacredtheme && {
      textShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
      fontWeight: 500,
      letterSpacing: '0.5px',
    }),
    '&.Mui-focused': {
      color: sacredtheme
        ? '#FFD700'
        : shrunkfontcolor || fontcolor || palette.black.main,
      ...(sacredtheme && {
        textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
      }),
    },
    '&.MuiInputLabel-shrink': {
      color: sacredtheme
        ? '#FFD700'
        : shrunkfontcolor || fontcolor || palette.black.main,
      ...(sacredtheme && {
        textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
        fontWeight: 600,
      }),
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
  sacredtheme = false,
}) => {
  const [focused, setFocused] = useState(false)
  const isLabelShrunken = focused || Boolean(value)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  const SearchAdornment = () => (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            left: '-20px',
            color: alpha('#FFD700', 0.4),
            fontSize: '12px',
            animation: `${sacredPulse} 3s ease-in-out infinite`,
          }}
        >
          𓂀
        </Box>
      )}
      <SearchIcon
        sx={{
          color: sacredtheme ? '#FFD700' : iconcolor || palette.black.main,
          ...(sacredtheme && {
            animation: `${goldShimmer} 2s ease-in-out infinite`,
          }),
        }}
      />
    </Box>
  )

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
        sacredtheme={sacredtheme}
      >
        {sacredtheme ? 'Divine Search' : label}
      </StyledInputLabel>
      <StyledOutlinedInput
        id="search-input"
        label={label}
        notched={shrunklabelposition === 'onNotch' && isLabelShrunken}
        placeholder={
          isLabelShrunken
            ? sacredtheme
              ? 'Seek ancient wisdom...'
              : placeholder
            : ''
        }
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        sacredtheme={sacredtheme}
        startAdornment={
          <InputAdornment position="start">
            <SearchAdornment />
          </InputAdornment>
        }
      />
    </StyledFormControl>
  )
}

export default Searchbar

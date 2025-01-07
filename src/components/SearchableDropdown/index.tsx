'use client'

import React, { useState, useEffect, SyntheticEvent } from 'react'
import { Autocomplete } from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../styles/palette'
import Typography from '../Typography'
import TextField from '../TextField'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
}

export interface SearchableDropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange?: (value: DropdownOption | null) => void
  error?: boolean
  helperText?: string
  name?: string
  required?: boolean
  placeholder?: string
}

const StyledAutocomplete = styled(
  Autocomplete<DropdownOption, false, false, true>
)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
}>(({ outlinecolor, fontcolor, inputfontcolor }) => ({
  '& .MuiOutlinedInput-root': {
    overflow: 'visible',
    minHeight: '45px', // forced 45px
    height: '45px !important', // double-enforced
    '& fieldset': {
      borderColor: outlinecolor || black.main,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor || black.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor || black.main,
    },
  },
  '& .MuiAutocomplete-input': {
    color: inputfontcolor || fontcolor || black.main,
    // Remove extra padding so total stays at 45px:
    paddingTop: '0px',
    paddingBottom: '0px',
  },
}))

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor = black.main,
  inputfontcolor = black.main,
  shrunkfontcolor = black.main,
  unshrunkfontcolor = black.main,
  placeholdercolor = black.main,
  shrunklabelposition = 'onNotch',
  onChange,
  error = false,
  helperText,
  name,
  required = false,
  placeholder,
}) => {
  const [value, setValue] = useState<DropdownOption | string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    if (defaultOption) {
      const displayText =
        defaultOption.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
        defaultOption.value.replace(/_/g, ' ').slice(1)
      setValue(defaultOption)
      setInputValue(displayText)
    }
  }, [defaultValue, options])

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: DropdownOption | string | null
  ) => {
    if (typeof newValue === 'string') {
      setValue(newValue)
      setInputValue(newValue)
      if (onChange) {
        onChange(null)
      }
    } else {
      setValue(newValue)
      if (newValue) {
        const displayText =
          newValue.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
          newValue.value.replace(/_/g, ' ').slice(1)
        setInputValue(displayText)
        if (onChange) {
          onChange(newValue)
        }
      } else {
        setInputValue('')
        if (onChange) {
          onChange(null)
        }
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    if (!value && !inputValue) {
      setIsFocused(false)
    }
  }

  return (
    <StyledAutocomplete
      id={name}
      options={options}
      freeSolo
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(_e, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      popupIcon={null}
      disablePortal={false}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      fontcolor={fontcolor}
      inputfontcolor={inputfontcolor}
      filterOptions={(opts, state) => {
        const input = state.inputValue.toLowerCase()
        return opts.filter(o => o.value.toLowerCase().includes(input))
      }}
      getOptionLabel={(option: DropdownOption | string) => {
        if (typeof option === 'string') {
          return option
        }
        return (
          option.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
          option.value.replace(/_/g, ' ').slice(1)
        )
      }}
      renderOption={(liProps, option) => {
        const { key, ...otherLiProps } = liProps
        const opt = option as DropdownOption
        return (
          <li key={key} {...otherLiProps} style={{ color: black.main }}>
            <Typography
              fontvariant="merriparagraph"
              text={opt.value.replace(/_/g, ' ')}
              fontcolor={black.main}
            />
            {opt.attribute1 && (
              <Typography
                fontvariant="merriparagraph"
                text={`${opt.attribute1}${
                  opt.attribute2 ? ` | ${opt.attribute2}` : ''
                }`}
                fontcolor={black.main}
              />
            )}
          </li>
        )
      }}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          error={error}
          helperText={helperText}
          label={label}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          backgroundcolor={backgroundcolor}
          endAdornment={<ArrowDropDownIcon sx={{ color: black.main }} />}
          shrunklabelposition={shrunklabelposition}
          slotProps={{
            inputLabel: {
              // Dynamically shrink the label if there's focus or a value
              shrink: isFocused || !!value || !!inputValue,
              sx: {
                color: isFocused ? shrunkfontcolor : unshrunkfontcolor,
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'visible',
                '&.MuiInputLabel-shrink': {
                  color: shrunkfontcolor,
                },
              },
            },
            input: {
              ...params.InputProps,
              notched:
                shrunklabelposition === 'onNotch' &&
                (isFocused || !!value || !!inputValue),
            },
          }}
          sx={{
            overflow: 'visible',
            '& .MuiOutlinedInput-root': {
              backgroundColor: backgroundcolor || white.main,
              color: fontcolor,
              minHeight: '45px',
              height: '45px !important',
              overflow: 'visible',
              '& fieldset': {
                borderColor: outlinecolor || black.main,
                overflow: 'visible',
              },
              '&:hover fieldset': {
                borderColor: outlinecolor || black.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: outlinecolor || black.main,
              },
              '& input': {
                backgroundColor: backgroundcolor || white.main,
                color: inputfontcolor,
                paddingTop: '0px',
                paddingBottom: '0px',
                '&::placeholder': {
                  color: placeholdercolor,
                  opacity: 1,
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: unshrunkfontcolor,
              overflow: 'visible',
              zIndex: 1,
            },
            '& .MuiAutocomplete-clearIndicator': {
              color: fontcolor,
            },
            '& .MuiAutocomplete-input': {
              color: inputfontcolor,
              backgroundColor: backgroundcolor || white.main,
              paddingTop: '0px',
              paddingBottom: '0px',
              '&::placeholder': {
                color: placeholdercolor,
                opacity: 1,
              },
            },
          }}
        />
      )}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: backgroundcolor || white.main,
          color: black.main,
          zIndex: 9999, // ensure it's on top
        },
        '& .MuiAutocomplete-option': {
          color: black.main,
        },
        '& .MuiAutocomplete-option[aria-selected="true"]': {
          backgroundColor: `${black.main}08`,
        },
      }}
    />
  )
}

export default SearchableDropdown

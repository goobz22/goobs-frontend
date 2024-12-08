'use client'

import React, { useState, useEffect, SyntheticEvent } from 'react'
import {
  Autocomplete,
  Box,
  CircularProgress,
  FilterOptionsState,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material'
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
  inputfontcolor?: string // New prop for input text color
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

const StyledBox = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  marginTop: '10px',
}))

const StyledAutocomplete = styled(
  Autocomplete<DropdownOption, false, false, true>
)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
}>(
  ({
    outlinecolor,
    fontcolor,
    inputfontcolor,
    shrunkfontcolor,
    shrunklabelposition,
  }) => ({
    '& .MuiOutlinedInput-root': {
      overflow: 'visible',
      minHeight: '40px',
      '& fieldset': {
        borderColor: outlinecolor || black.main,
        ...(shrunklabelposition === 'aboveNotch' && {
          legend: {
            width: '0px !important',
          },
        }),
      },
      '&:hover fieldset': {
        borderColor: outlinecolor || black.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: outlinecolor || black.main,
        ...(shrunklabelposition === 'aboveNotch' && {
          legend: {
            width: '0px !important',
          },
        }),
      },
    },
    '& .MuiAutocomplete-input': {
      color: inputfontcolor || fontcolor || black.main,
      height: 'auto',
      paddingTop: '10px',
      paddingBottom: '10px',
    },
    '& .MuiFormLabel-root': {
      zIndex: 1,
      '&.MuiInputLabel-shrink, &.Mui-focused': {
        color: `${shrunkfontcolor} !important`,
      },
    },
  })
)

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
  const [isLoading, setIsLoading] = useState(true)
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
    setIsLoading(false)
  }, [defaultValue, options])

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: DropdownOption | string | null,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<DropdownOption>
  ) => {
    // Use _reason and _details to avoid unused variable errors
    console.debug(_reason, _details)

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

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50px"
      >
        <CircularProgress size={24} />
      </Box>
    )
  }

  const labelTransformNotFocused = 'translate(12px, 10px) scale(1) !important'
  const labelTransformShrunkAboveNotch =
    'translate(0px, -17px) scale(0.75) !important'
  const labelTransformShrunkOnNotch =
    'translate(13px, -4px) scale(0.75) !important'

  const focusedTransform =
    shrunklabelposition === 'aboveNotch'
      ? labelTransformShrunkAboveNotch
      : labelTransformShrunkOnNotch

  return (
    <StyledBox>
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
        disablePortal
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        inputfontcolor={inputfontcolor}
        shrunkfontcolor={shrunkfontcolor}
        shrunklabelposition={shrunklabelposition}
        filterOptions={(
          opts: DropdownOption[],
          state: FilterOptionsState<DropdownOption>
        ) => {
          const input = state.inputValue.toLowerCase()
          return opts.filter(o => o.value.toLowerCase().includes(input))
        }}
        // @ts-ignore - MUI freeSolo mode and TS defs conflict; runtime is fine
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
          // Extract the key and remove it from liProps, then apply it separately
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
            slotProps={{
              inputLabel: {
                shrink: isFocused || !!value || !!inputValue,
                sx: {
                  color: isFocused ? shrunkfontcolor : unshrunkfontcolor,
                  transform: isFocused
                    ? focusedTransform
                    : labelTransformNotFocused,
                  pointerEvents: 'none',
                  '&.MuiInputLabel-shrink': {
                    transform: focusedTransform,
                    color: shrunkfontcolor,
                  },
                  zIndex: 1,
                  overflow: 'visible',
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
                minHeight: '40px',
                overflow: 'visible',
                '& fieldset': {
                  borderColor: outlinecolor || black.main,
                  overflow: 'visible',
                  ...(shrunklabelposition === 'aboveNotch' && {
                    legend: {
                      width: '0px !important',
                    },
                  }),
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
                  '&::placeholder': {
                    color: placeholdercolor,
                    opacity: 1,
                  },
                  paddingTop: '16px',
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
                height: 'auto',
                paddingTop: '16px',
                paddingBottom: '10px',
                backgroundColor: backgroundcolor || white.main,
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
          },
          '& .MuiAutocomplete-option': {
            color: black.main,
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: `${black.main}08`,
          },
        }}
      />
    </StyledBox>
  )
}

export default SearchableDropdown

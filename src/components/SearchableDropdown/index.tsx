'use client'

import React, { useState, useEffect, SyntheticEvent } from 'react'
import {
  Autocomplete,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  FormControl,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../styles/palette'
import Typography from '../Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export interface DropdownOption {
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
  disabled?: boolean
  width?: string
  // Added style property to allow additional styling (e.g., marginBottom)
  style?: React.CSSProperties
}

const StyledFormControl = styled(FormControl)<{ width?: string }>(
  ({ width }) => ({
    width: width || '100%',
    marginTop: '15px',
    height: 'auto',
    overflow: 'visible',
  })
)

const StyledInputLabel = styled(InputLabel)<{
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  disabled?: boolean
}>(({ shrunkfontcolor, unshrunkfontcolor, shrunklabelposition, disabled }) => ({
  color: disabled ? 'rgba(0, 0, 0, 0.38)' : unshrunkfontcolor || black.main,
  '&.Mui-focused': {
    color: disabled ? 'rgba(0, 0, 0, 0.38)' : shrunkfontcolor || black.main,
  },
  '&.MuiInputLabel-shrink': {
    color: disabled ? 'rgba(0, 0, 0, 0.38)' : shrunkfontcolor || black.main,
    ...(shrunklabelposition === 'aboveNotch' && {
      top: '-8px',
      left: '-14px',
    }),
    ...(shrunklabelposition === 'onNotch' && {
      top: '2.5px',
      left: '0px',
    }),
  },
  '&:not(.MuiInputLabel-shrink)': {
    transform: 'scale(1)',
    transformOrigin: 'top left',
    top: '10px',
    left: '12px',
  },
}))

interface StyledAutocompleteProps {
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  disabled?: boolean
}

const StyledAutocomplete = styled(
  Autocomplete<DropdownOption, false, false, true>
)<StyledAutocompleteProps>(props => {
  const {
    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    placeholdercolor,
    shrunklabelposition,
    disabled,
  } = props

  return {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      width: '100%',
      overflow: 'visible',
      minHeight: '40px',
      height: '40px !important',
      backgroundColor: disabled
        ? 'rgba(0, 0, 0, 0.12)'
        : backgroundcolor || white.main,
      color: disabled ? 'rgba(0, 0, 0, 0.38)' : fontcolor || black.main,
      '& fieldset': {
        borderColor: disabled
          ? 'rgba(0, 0, 0, 0.26)'
          : outlinecolor || black.main,
        ...(shrunklabelposition === 'aboveNotch' && {
          legend: {
            width: '0px !important',
          },
        }),
      },
      '&:hover fieldset': {
        borderColor: disabled
          ? 'rgba(0, 0, 0, 0.26)'
          : outlinecolor || black.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: disabled
          ? 'rgba(0, 0, 0, 0.26)'
          : outlinecolor || black.main,
      },
      '& input': {
        color: disabled
          ? 'rgba(0, 0, 0, 0.38)'
          : inputfontcolor || fontcolor || black.main,
        '&::placeholder': {
          color: disabled
            ? 'rgba(0, 0, 0, 0.38)'
            : placeholdercolor || 'rgba(0, 0, 0, 0.54)',
          opacity: 1,
        },
      },
      cursor: disabled ? 'not-allowed' : 'text',
    },
    '& .MuiInputLabel-root': {
      color: black.main,
      '&.MuiInputLabel-shrink': {
        ...(shrunklabelposition === 'aboveNotch' && {
          transform: 'translate(0px, -17px) scale(0.75)',
        }),
        ...(shrunklabelposition === 'onNotch' && {
          transform: 'translate(13px, -4px) scale(0.75)',
        }),
      },
    },
    '& .MuiAutocomplete-input': {
      padding: '8px 14px',
    },
    '& .MuiAutocomplete-popper': {
      width: '100% !important',
      '& .MuiPaper-root': {
        width: '100%',
        marginTop: '4px',
      },
      '& .MuiAutocomplete-listbox': {
        padding: '4px 0',
        '& .MuiAutocomplete-option': {
          padding: '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          '& .MuiTypography-root': {
            width: '100%',
            textAlign: 'left',
          },
        },
      },
    },
  }
})

const StyledFormHelperText = styled(FormHelperText)({
  marginLeft: '14px',
})

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
  disabled = false,
  width,
  style, // destructure the style prop
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
      onChange?.(null)
    } else {
      setValue(newValue)
      if (newValue) {
        const displayText =
          newValue.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
          newValue.value.replace(/_/g, ' ').slice(1)
        setInputValue(displayText)
        onChange?.(newValue)
      } else {
        setInputValue('')
        onChange?.(null)
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

  const labelId = `${name}-label`

  return (
    <StyledFormControl
      error={error}
      disabled={disabled}
      width={width}
      style={style} // pass the style prop here
    >
      <StyledInputLabel
        id={labelId}
        shrink={isFocused || !!value || !!inputValue || !!placeholder}
        required={required}
        error={error}
        shrunkfontcolor={disabled ? 'rgba(0, 0, 0, 0.38)' : shrunkfontcolor}
        unshrunkfontcolor={disabled ? 'rgba(0, 0, 0, 0.38)' : unshrunkfontcolor}
        shrunklabelposition={shrunklabelposition}
        disabled={disabled}
      >
        {label}
      </StyledInputLabel>
      <StyledAutocomplete
        id={name}
        options={options}
        freeSolo
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_e, newInputValue) => {
          if (!disabled) {
            setInputValue(newInputValue)
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        forcePopupIcon
        popupIcon={
          <ArrowDropDownIcon
            sx={{ color: disabled ? 'rgba(0, 0, 0, 0.38)' : black.main }}
          />
        }
        disablePortal={false}
        disabled={disabled}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        inputfontcolor={inputfontcolor}
        placeholdercolor={placeholdercolor}
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
        renderOption={(
          liProps: React.HTMLAttributes<HTMLLIElement>,
          option
        ) => {
          const { key, ...restLiProps } = liProps as {
            key: string
          } & React.HTMLAttributes<HTMLLIElement>
          return (
            <li
              key={key}
              {...restLiProps}
              style={{
                color: black.main,
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '2px',
                width: '100%',
              }}
            >
              <Typography
                fontvariant="merriparagraph"
                text={option.value.replace(/_/g, ' ')}
                fontcolor={black.main}
                sx={{
                  fontSize: '14px',
                  lineHeight: '20px',
                  width: '100%',
                  textAlign: 'left',
                }}
              />
              {(option.attribute1 || option.attribute2) && (
                <Typography
                  fontvariant="merriparagraph"
                  text={[option.attribute1, option.attribute2]
                    .filter(Boolean)
                    .join(' | ')}
                  fontcolor="rgba(0, 0, 0, 0.6)"
                  sx={{
                    fontSize: '12px',
                    lineHeight: '16px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                />
              )}
            </li>
          )
        }}
        renderInput={params => (
          <OutlinedInput
            {...params.InputProps}
            inputProps={{
              ...params.inputProps,
              'aria-labelledby': labelId,
            }}
            placeholder={placeholder}
            error={error}
            required={required}
            notched={
              shrunklabelposition === 'onNotch' &&
              (isFocused || !!value || !!inputValue || !!placeholder)
            }
            label={label}
            sx={{
              '& fieldset': {
                ...(shrunklabelposition === 'aboveNotch' && {
                  legend: {
                    width: '0px !important',
                  },
                }),
              },
            }}
          />
        )}
        sx={{
          '& .MuiAutocomplete-option': {
            color: black.main,
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: `${black.main}08`,
          },
          '& .MuiAutocomplete-clearIndicator': {
            display: 'none',
          },
        }}
      />
      {helperText && (
        <StyledFormHelperText error={error} disabled={disabled}>
          {helperText}
        </StyledFormHelperText>
      )}
    </StyledFormControl>
  )
}

export default SearchableDropdown

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
import { black, white } from '../../../../styles/palette'
import Typography from '../../../Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
  attribute3?: string // New attribute for complex variant
  attribute4?: string // New attribute for complex variant
  attribute5?: string // Additional attribute for complex variant
  attribute6?: string // Additional attribute for complex variant
  uniqueKey?: string // Add uniqueKey for React key usage
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
  // New variant property to determine display style
  variant?: 'simple' | 'complex'
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
  variant?: 'simple' | 'complex'
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
    variant,
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
    // Improve dropdown menu positioning and styling
    '& .MuiAutocomplete-popper': {
      width: '100% !important',
      zIndex: 9999, // Ensure high z-index for the popup
      '& .MuiPaper-root': {
        width: '100%',
        marginTop: '4px',
        maxHeight: '300px', // Increase max height for better usability
        overflowY: 'auto',
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', // Enhanced shadow
        border: `1px solid ${black.light}`, // Add border to dropdown container
      },
      '& .MuiAutocomplete-listbox': {
        padding: '0', // Remove default padding for cleaner lines
        '& .MuiAutocomplete-option': {
          padding: variant === 'complex' ? '10px 14px' : '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          '& .MuiTypography-root': {
            width: '100%',
            textAlign: 'left',
          },
          '&:last-child': {
            borderBottom: 'none', // Remove border from last item to avoid double borders
          },
        },
        '& .MuiAutocomplete-option[aria-selected="true"]': {
          backgroundColor: `${black.main}08`,
        },
        '& .MuiAutocomplete-option:hover': {
          backgroundColor: `${black.main}15`, // Slightly darker hover state
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
  style,
  variant = 'simple', // Default to simple variant
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
      style={style}
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
        ListboxProps={{
          style: { maxHeight: '300px', overflowY: 'auto' },
        }}
        disabled={disabled}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        inputfontcolor={inputfontcolor}
        placeholdercolor={placeholdercolor}
        variant={variant}
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

          // Common styles for both variants
          const liStyle = {
            color: black.main,
            padding: variant === 'complex' ? '10px 14px' : '8px 14px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'flex-start' as const,
            gap: variant === 'complex' ? '4px' : '2px',
            width: '100%',
            borderBottom: `1px solid ${black.light}`,
          }

          // Use the uniqueKey prop if available, otherwise fall back to the provided key
          const optionKey = option.uniqueKey || key

          return (
            <li key={optionKey} {...restLiProps} style={liStyle}>
              {/* Main value - both variants */}
              <Typography
                fontvariant="merriparagraph"
                text={option.value.replace(/_/g, ' ')}
                fontcolor={black.main}
                sx={{
                  fontSize: '14px',
                  fontWeight: variant === 'complex' ? '500' : 'normal',
                  lineHeight: '20px',
                  width: '100%',
                  textAlign: 'left',
                }}
              />

              {/* For simple variant - show attribute1 and attribute2 on one line */}
              {variant === 'simple' &&
                (option.attribute1 || option.attribute2) && (
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

              {/* For complex variant - show attributes on separate lines */}
              {variant === 'complex' && (
                <>
                  {/* First line of attributes */}
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

                  {/* Second line of attributes */}
                  {(option.attribute3 || option.attribute4) && (
                    <Typography
                      fontvariant="merriparagraph"
                      text={[option.attribute3, option.attribute4]
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

                  {/* Third line of attributes */}
                  {(option.attribute5 || option.attribute6) && (
                    <Typography
                      fontvariant="merriparagraph"
                      text={[option.attribute5, option.attribute6]
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
                </>
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

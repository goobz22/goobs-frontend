import React, { useState } from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
  FormHelperText,
} from '@mui/material'
import { styled } from '@mui/material/styles'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps extends Omit<SelectProps, 'onChange'> {
  /**
   * The label for the dropdown.
   */
  label: string
  /**
   * The options for the dropdown.
   */
  options: DropdownOption[]
  /**
   * The default value for the dropdown.
   */
  defaultValue?: string
  /**
   * The background color of the dropdown.
   */
  backgroundcolor?: string
  /**
   * The outline color of the dropdown.
   */
  outlinecolor?: string
  /**
   * The font color of the dropdown.
   */
  fontcolor?: string
  /**
   * The font color of the dropdown label when shrunk.
   */
  shrunkfontcolor?: string
  /**
   * Callback function triggered when the dropdown value changes.
   */
  onChange?: SelectProps['onChange']
  /**
   * Indicates if the dropdown is in an error state.
   */
  error?: boolean
  /**
   * The helper text to display below the dropdown.
   */
  helperText?: string
  /**
   * The name of the dropdown.
   */
  name?: string
  /**
   * Indicates if the dropdown is required.
   */
  required?: boolean
  /**
   * Callback function triggered when the dropdown loses focus.
   */
  onBlur?: SelectProps['onBlur']
  /**
   * Callback function triggered when the dropdown receives focus.
   */
  onFocus?: SelectProps['onFocus']
}

const StyledFormControl = styled(FormControl)<{
  backgroundcolor?: string
  outlinecolor?: string
}>(({ theme, backgroundcolor, outlinecolor }) => ({
  width: '100%',
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
}))

const StyledInputLabel = styled(InputLabel)<{ shrunkfontcolor?: string }>(
  ({ theme, shrunkfontcolor }) => ({
    '&.Mui-focused': {
      color: shrunkfontcolor || theme.palette.primary.main,
    },
  })
)

/**
 * Dropdown component built with Material UI.
 */
const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  shrunkfontcolor,
  onChange,
  error = false,
  helperText,
  name,
  required = false,
  onBlur,
  onFocus,
  ...rest
}) => {
  const [selectedValue, setSelectedValue] = useState(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    return defaultOption ? defaultOption.value : ''
  })

  const handleChange: SelectProps['onChange'] = (event, child) => {
    const newValue = event.target.value as string
    setSelectedValue(newValue)
    onChange?.(event, child)
  }

  const handleBlur: SelectProps['onBlur'] = event => {
    onBlur?.(event)
  }

  const handleFocus: SelectProps['onFocus'] = event => {
    onFocus?.(event)
  }

  return (
    <StyledFormControl
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      error={error}
      required={required}
    >
      <StyledInputLabel id={`${name}-label`} shrunkfontcolor={shrunkfontcolor}>
        {label}
      </StyledInputLabel>
      <Select
        labelId={`${name}-label`}
        value={selectedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        label={label}
        sx={{ color: fontcolor }}
        name={name}
        aria-labelledby={`${name}-label`}
        {...rest}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  )
}

export default Dropdown

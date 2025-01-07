'use client'

import React, { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectProps,
  FormHelperText,
  Box,
  OutlinedInput,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../styles/palette'
import Typography from '../Typography'

export interface SimpleDropdownOption {
  value: string
}

export interface ComplexDropdownOption extends SimpleDropdownOption {
  attribute1?: string
  attribute2?: string
}

export type DropdownOption = SimpleDropdownOption | ComplexDropdownOption

export interface DropdownProps extends Omit<SelectProps, 'onChange'> {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange?: SelectProps['onChange']
  error?: boolean
  helperText?: string
  name?: string
  required?: boolean
  onBlur?: SelectProps['onBlur']
  onFocus?: SelectProps['onFocus']
}

const StyledBox = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '40px',
  marginTop: '10px',
}))

/**
 * We keep variant="outlined" to enable the notched outline.
 * The notch is triggered by the OutlinedInput's "notched" prop.
 */
const StyledFormControl = styled(FormControl)<{
  backgroundcolor?: string
  outlinecolor?: string
}>(({ outlinecolor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  '& .MuiOutlinedInput-root': {
    backgroundColor: white.main,
    height: '40px',
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
}))

/**
 * We manually control <InputLabel> "shrink" so it only shrinks
 * when there's a value, not on focus alone.
 */
const StyledInputLabel = styled(InputLabel, {
  shouldForwardProp: prop =>
    prop !== 'shrunkfontcolor' &&
    prop !== 'unshrunkfontcolor' &&
    prop !== 'shrunklabelposition' &&
    prop !== 'hasvalue',
})<{
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  hasvalue: 'true' | 'false'
}>(({ shrunkfontcolor, unshrunkfontcolor, shrunklabelposition, hasvalue }) => ({
  color: unshrunkfontcolor || black.main,
  transform:
    hasvalue === 'true'
      ? shrunklabelposition === 'aboveNotch'
        ? 'translate(13px, -20px) scale(0.75)'
        : 'translate(13px, -7px) scale(0.75)'
      : 'translate(14px, 12px)',
  '&.Mui-focused': {
    transform:
      hasvalue === 'true'
        ? shrunklabelposition === 'aboveNotch'
          ? 'translate(13px, -20px) scale(0.75)'
          : 'translate(13px, -7px) scale(0.75)'
        : 'translate(14px, 12px)',
    color:
      hasvalue === 'true'
        ? shrunkfontcolor || black.main
        : unshrunkfontcolor || black.main,
  },
  '&.MuiInputLabel-shrink': {
    transform:
      hasvalue === 'true'
        ? shrunklabelposition === 'aboveNotch'
          ? 'translate(0px, -20px) scale(0.75)'
          : 'translate(13px, -7px) scale(0.75)'
        : 'translate(14px, 10px)',
    color:
      hasvalue === 'true'
        ? shrunkfontcolor || black.main
        : unshrunkfontcolor || black.main,
  },
}))

const StyledMenuItem = styled(MenuItem)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: white.main,
}))

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * We'll create our <Select> that uses <OutlinedInput notched={shrink} label={label}/> via the `input` prop.
 * This is how we directly control the "notched" prop of the OutlinedInput.
 */
const StyledSelect = styled(Select)<{
  fontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
}>(({ fontcolor, shrunklabelposition }) => ({
  color: fontcolor || black.main,
  height: '40px',
  backgroundColor: white.main,
  '& .MuiSelect-select': {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  '& .MuiSvgIcon-root': {
    color: black.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: black.main,
    // Hide the legend text if label is "aboveNotch"
    legend: {
      display: shrunklabelposition === 'aboveNotch' ? 'none' : 'inherit',
    },
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: black.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: black.main,
  },
  '& .MuiInputBase-input': {
    color: black.main,
  },
  '& .MuiInputBase-input::placeholder': {
    color: black.main,
    opacity: 1,
  },
  '& .MuiPaper-root': {
    backgroundColor: white.main,
  },
  '& .MuiMenu-list': {
    backgroundColor: white.main,
  },
}))

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  shrunkfontcolor,
  unshrunkfontcolor,
  shrunklabelposition = 'onNotch',
  onChange,
  error = false,
  helperText,
  name,
  required = false,
  onBlur,
  onFocus,
  ...rest
}) => {
  // Figure out initial value
  const externalValue = rest.value as string | undefined
  let initialSelected = ''
  let initialHasSelection = false

  if (externalValue !== undefined && externalValue !== '') {
    initialSelected = externalValue
    initialHasSelection = true
  } else if (defaultValue) {
    const defaultOption = options.find(opt => opt.value === defaultValue)
    if (defaultOption) {
      initialSelected = defaultOption.value
      initialHasSelection = true
    }
  }

  const [selectedValue, setSelectedValue] = useState<string>(initialSelected)
  const [hasSelection, setHasSelection] = useState(initialHasSelection)

  // Update from externalValue changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setSelectedValue(externalValue)
      setHasSelection(externalValue !== '')
    }
  }, [externalValue])

  const handleChange: SelectProps['onChange'] = (event, child) => {
    const newValue = event.target.value as string
    setSelectedValue(newValue)
    setHasSelection(newValue !== '')
    if (onChange) {
      onChange(event, child)
    }
  }

  const handleBlur: SelectProps['onBlur'] = event => {
    if (onBlur) {
      onBlur(event)
    }
  }

  const handleFocus: SelectProps['onFocus'] = event => {
    if (onFocus) {
      onFocus(event)
    }
  }

  // Only shrink/notch if there's a selection
  const shrink = hasSelection || Boolean(selectedValue)

  const renderMenuItem = (option: DropdownOption) => {
    const itemLabel = capitalizeFirstLetter(option.value.replace(/_/g, ' '))

    if (!('attribute1' in option)) {
      return (
        <MenuItem key={option.value} value={option.value}>
          <Typography fontvariant="merriparagraph" text={itemLabel} />
        </MenuItem>
      )
    } else {
      return (
        <StyledMenuItem key={option.value} value={option.value}>
          <Typography fontvariant="merriparagraph" text={itemLabel} />
          <Typography
            fontvariant="merriparagraph"
            text={`${option.attribute1}${
              option.attribute2 ? ` | ${option.attribute2}` : ''
            }`}
            fontcolor="textSecondary"
          />
        </StyledMenuItem>
      )
    }
  }

  return (
    <StyledBox>
      <StyledFormControl
        variant="outlined"
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        error={error}
        required={required}
        fullWidth
      >
        {/* We pass shrink={shrink} to control whether the label is shrunk or not */}
        <StyledInputLabel
          id={`${name}-label`}
          shrunkfontcolor={shrunkfontcolor}
          unshrunkfontcolor={unshrunkfontcolor}
          shrunklabelposition={shrunklabelposition}
          shrink={shrink}
          hasvalue={shrink ? 'true' : 'false'}
        >
          {label}
        </StyledInputLabel>

        <StyledSelect
          // Do NOT pass "label" prop here (to avoid auto-notch on focus).
          // Instead, pass the OutlinedInput as the "input".
          labelId={`${name}-label`}
          value={selectedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          fontcolor={fontcolor}
          shrunklabelposition={shrunklabelposition}
          // We pass <OutlinedInput> with "notched" set to {shrink}
          // and label={label} so MUI calculates the correct notch width.
          input={
            <OutlinedInput
              label={label}
              notched={shrink}
              // If you want to control the "labelWidth" manually,
              // you could pass it here as well, but usually not needed.
            />
          }
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: white.main,
              },
            },
          }}
          name={name}
          aria-labelledby={`${name}-label`}
          {...rest}
        >
          {options.map(renderMenuItem)}
        </StyledSelect>

        {helperText && (
          <FormHelperText>
            <Typography fontvariant="merriparagraph" text={helperText} />
          </FormHelperText>
        )}
      </StyledFormControl>
    </StyledBox>
  )
}

export default Dropdown

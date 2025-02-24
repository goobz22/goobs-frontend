'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  FocusEventHandler,
  FocusEvent,
} from 'react'
import {
  styled,
  MenuItem,
  FormControl,
  FormControlProps,
  Select,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material'
import Typography from '../Typography'
import { black, white } from '../../styles/palette'

export interface SimpleDropdownOption {
  value: string
}

export interface ComplexDropdownOption extends SimpleDropdownOption {
  attribute1?: string
  attribute2?: string
}

export type DropdownOption = SimpleDropdownOption | ComplexDropdownOption

export interface DropdownProps extends Omit<FormControlProps, 'onChange'> {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  required?: boolean
  onBlur?: FocusEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  value?: string
  width?: string
  disabled?: boolean
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

const StyledSelect = styled(Select)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  disabled?: boolean
}>(({ backgroundcolor, outlinecolor, fontcolor, disabled }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled ? 'rgba(0, 0, 0, 0.26)' : outlinecolor || black.main,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled ? 'rgba(0, 0, 0, 0.26)' : outlinecolor || black.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled ? 'rgba(0, 0, 0, 0.26)' : outlinecolor || black.main,
  },
  backgroundColor: disabled
    ? 'rgba(0, 0, 0, 0.12)'
    : backgroundcolor || white.main,
  color: disabled ? 'rgba(0, 0, 0, 0.38)' : fontcolor || black.main,
  minHeight: '40px',
  '& .MuiSelect-select': {
    padding: '8px 14px',
  },
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'auto',
  },
  '& .MuiSelect-icon': {
    color: disabled ? 'rgba(0, 0, 0, 0.38)' : black.main,
  },
}))

const StyledMenuItem = styled(MenuItem)({
  padding: '8px 14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  width: '100%',
  backgroundColor: white.main,
  '&.Mui-selected': {
    backgroundColor: `${black.main}08`,
  },
  '&:hover': {
    backgroundColor: `${black.main}08`,
  },
  '& .MuiTypography-root': {
    width: '100%',
    textAlign: 'left',
  },
})

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      marginTop: 4,
    },
  },
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor = black.main,
  shrunkfontcolor = black.main,
  unshrunkfontcolor = black.main,
  shrunklabelposition = 'onNotch',
  onChange,
  error = false,
  helperText,
  required = false,
  onBlur,
  onFocus,
  value: externalValue,
  width,
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (externalValue !== undefined) {
      setSelectedValue(externalValue)
    } else if (defaultValue) {
      setSelectedValue(defaultValue)
    }
  }, [externalValue, defaultValue])

  const handleChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      if (disabled) return

      const newValue = event.target.value as string
      setSelectedValue(newValue)

      if (onChange) {
        onChange(event as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    },
    [onChange, disabled]
  )

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (disabled) return

      setFocused(false)
      onBlur?.(e)
    },
    [onBlur, disabled]
  )

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (disabled) return

      setFocused(true)
      onFocus?.(e)
    },
    [onFocus, disabled]
  )

  const renderMenuItem = (option: DropdownOption) => {
    const displayText = option.value
      ? option.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
        option.value.replace(/_/g, ' ').slice(1)
      : ''

    if (!('attribute1' in option)) {
      return (
        <MenuItem key={option.value} value={option.value}>
          <Typography
            fontvariant="merriparagraph"
            text={displayText}
            fontcolor={black.main}
            sx={{
              fontSize: '14px',
              lineHeight: '20px',
              width: '100%',
              textAlign: 'left',
            }}
          />
        </MenuItem>
      )
    }

    return (
      <StyledMenuItem key={option.value} value={option.value}>
        <Typography
          fontvariant="merriparagraph"
          text={displayText}
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
      </StyledMenuItem>
    )
  }

  const renderValue = (value: string) => {
    const option = options.find(opt => opt.value === value)
    if (!option) return ''

    const displayText =
      option.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
      option.value.replace(/_/g, ' ').slice(1)

    return (
      <Typography
        fontvariant="merriparagraph"
        text={displayText}
        fontcolor={disabled ? 'rgba(0, 0, 0, 0.38)' : black.main}
        sx={{
          fontSize: '14px',
          lineHeight: '20px',
          width: '100%',
          textAlign: 'left',
        }}
      />
    )
  }

  const shouldNotch =
    shrunklabelposition === 'onNotch' && (!!selectedValue || focused)
  const inputLabelForOutlined = shouldNotch ? label : ''

  return (
    <StyledFormControl error={error} width={width} disabled={disabled}>
      <StyledInputLabel
        shrink={!!selectedValue || focused}
        required={required}
        error={error}
        shrunkfontcolor={shrunkfontcolor}
        unshrunkfontcolor={unshrunkfontcolor}
        shrunklabelposition={shrunklabelposition}
        disabled={disabled}
      >
        {label}
      </StyledInputLabel>
      <StyledSelect
        value={selectedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        MenuProps={MenuProps}
        renderValue={(value: unknown) => {
          if (typeof value !== 'string') return ''
          return renderValue(value)
        }}
        input={
          <OutlinedInput
            label={inputLabelForOutlined}
            notched={shouldNotch}
            disabled={disabled}
          />
        }
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        disabled={disabled}
      >
        {options.map(renderMenuItem)}
      </StyledSelect>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default Dropdown

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
  Box,
  alpha,
  keyframes,
} from '@mui/material'
import Typography from '../../../Typography'
import { black, white } from '../../../../styles/palette'

// Sacred animations
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`

export interface SimpleDropdownOption {
  value: string
  icon?: React.ReactNode
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
  // Controls whether ID columns (containing 'id' or '_id') are visible by default
  showIdColumns?: boolean
  /** Enable sacred Egyptian theme */
  sacredTheme?: boolean
}

const StyledFormControl = styled(FormControl)<{ width?: string }>(
  ({ width }) => ({
    width: width || '100%',
    marginTop: '15px',
    height: 'auto',
    overflow: 'visible',
  })
)

const StyledInputLabel = styled(InputLabel, {
  shouldForwardProp: prop =>
    ![
      'shrunkfontcolor',
      'unshrunkfontcolor',
      'shrunklabelposition',
      'sacredtheme',
    ].includes(prop as string),
})<{
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  disabled?: boolean
  sacredtheme?: boolean
}>(
  ({
    shrunkfontcolor,
    unshrunkfontcolor,
    shrunklabelposition,
    disabled,
    sacredtheme,
  }) => ({
    color: disabled
      ? 'rgba(0, 0, 0, 0.38)'
      : sacredtheme
        ? alpha('#FFD700', 0.8)
        : unshrunkfontcolor || black.main,
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
      color: disabled
        ? 'rgba(0, 0, 0, 0.38)'
        : sacredtheme
          ? '#FFD700'
          : shrunkfontcolor || black.main,
      ...(sacredtheme && {
        textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
      }),
    },
    '&.MuiInputLabel-shrink': {
      color: disabled
        ? 'rgba(0, 0, 0, 0.38)'
        : sacredtheme
          ? '#FFD700'
          : shrunkfontcolor || black.main,
      ...(sacredtheme && {
        textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
        fontWeight: 600,
      }),
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
  })
)

const StyledSelect = styled(Select, {
  shouldForwardProp: prop =>
    !['backgroundcolor', 'outlinecolor', 'fontcolor', 'sacredtheme'].includes(
      prop as string
    ),
})<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  disabled?: boolean
  sacredtheme?: boolean
}>(({ backgroundcolor, outlinecolor, fontcolor, disabled, sacredtheme }) => ({
  position: 'relative',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled
      ? 'rgba(0, 0, 0, 0.26)'
      : sacredtheme
        ? '#FFD700'
        : outlinecolor || black.main,
    ...(sacredtheme && {
      borderWidth: '2px',
    }),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled
      ? 'rgba(0, 0, 0, 0.26)'
      : sacredtheme
        ? '#FFD700'
        : outlinecolor || black.main,
    ...(sacredtheme && {
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
    }),
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled
      ? 'rgba(0, 0, 0, 0.26)'
      : sacredtheme
        ? '#FFD700'
        : outlinecolor || black.main,
    ...(sacredtheme && {
      animation: `${sacredGlow} 2s ease-in-out infinite`,
    }),
  },
  backgroundColor: disabled
    ? 'rgba(0, 0, 0, 0.12)'
    : sacredtheme
      ? alpha('#000000', 0.8)
      : backgroundcolor || white.main,
  color: disabled
    ? 'rgba(0, 0, 0, 0.38)'
    : sacredtheme
      ? '#FFD700'
      : fontcolor || black.main,
  minHeight: '40px',
  ...(sacredtheme && {
    backgroundImage: `
      linear-gradient(rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05)),
      radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
    `,
    '&::before': {
      content: '"𓊗"',
      position: 'absolute',
      top: '50%',
      right: '45px',
      transform: 'translateY(-50%)',
      color: alpha('#FFD700', 0.3),
      fontSize: '14px',
      pointerEvents: 'none',
      zIndex: 1,
      animation: `${floatGlyph} 4s ease-in-out infinite`,
    },
  }),
  '& .MuiSelect-select': {
    padding: '8px 14px',
    ...(sacredtheme && {
      textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
      fontWeight: 500,
    }),
  },
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'auto',
  },
  '& .MuiSelect-icon': {
    color: disabled
      ? 'rgba(0, 0, 0, 0.38)'
      : sacredtheme
        ? '#FFD700'
        : black.main,
    ...(sacredtheme && {
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
    }),
  },
}))

const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: prop => prop !== 'sacredtheme',
})<{ sacredtheme?: boolean }>(({ sacredtheme }) => ({
  padding: '8px 14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  width: '100%',
  backgroundColor: sacredtheme ? alpha('#000000', 0.9) : white.main,
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    backgroundColor: sacredtheme ? alpha('#FFD700', 0.2) : `${black.main}08`,
    ...(sacredtheme && {
      color: '#FFD700',
    }),
  },
  '&:hover': {
    backgroundColor: sacredtheme ? alpha('#FFD700', 0.15) : `${black.main}08`,
    ...(sacredtheme && {
      color: '#FFD700',
      transform: 'translateX(4px)',
    }),
  },
  '& .MuiTypography-root': {
    width: '100%',
    textAlign: 'left',
  },
}))

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
  showIdColumns = false, // Default to hiding ID columns for security
  sacredTheme = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [focused, setFocused] = useState(false)

  // Filter out options with id values if showIdColumns is false
  const filteredOptions = React.useMemo(() => {
    if (showIdColumns) {
      return options
    }
    // Hide options where the value is exactly 'id' or '_id', or looks like a database ID
    return options.filter(opt => {
      const value = opt.value.toLowerCase()
      // Check if value is an ID field or looks like an ObjectId
      return !(
        value === 'id' ||
        value === '_id' ||
        /^[0-9a-f]{24}$/.test(value) // MongoDB ObjectId format
      )
    })
  }, [options, showIdColumns])

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
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {option.icon && (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                {option.icon}
              </Box>
            )}
            <Typography
              fontvariant="merriparagraph"
              text={displayText}
              fontcolor={sacredTheme ? alpha('#FFD700', 0.9) : black.main}
              sx={{
                fontSize: '14px',
                lineHeight: '20px',
                width: '100%',
                textAlign: 'left',
                ...(sacredTheme && {
                  fontWeight: 500,
                }),
              }}
            />
          </Box>
        </MenuItem>
      )
    }

    return (
      <StyledMenuItem
        key={option.value}
        value={option.value}
        sacredtheme={sacredTheme}
      >
        <Typography
          fontvariant="merriparagraph"
          text={displayText}
          fontcolor={sacredTheme ? alpha('#FFD700', 0.9) : black.main}
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            width: '100%',
            textAlign: 'left',
            ...(sacredTheme && {
              fontWeight: 500,
            }),
          }}
        />
        {(option.attribute1 || option.attribute2) && (
          <Typography
            fontvariant="merriparagraph"
            text={[option.attribute1, option.attribute2]
              .filter(Boolean)
              .join(' | ')}
            fontcolor={
              sacredTheme ? alpha('#FFD700', 0.7) : 'rgba(0, 0, 0, 0.6)'
            }
            sx={{
              fontSize: '12px',
              lineHeight: '16px',
              width: '100%',
              textAlign: 'left',
              ...(sacredTheme && {
                fontStyle: 'italic',
              }),
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {option.icon && (
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            {option.icon}
          </Box>
        )}
        <Typography
          fontvariant="merriparagraph"
          text={displayText}
          fontcolor={
            disabled
              ? 'rgba(0, 0, 0, 0.38)'
              : sacredTheme
                ? '#FFD700'
                : black.main
          }
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            width: '100%',
            textAlign: 'left',
            ...(sacredTheme && {
              fontWeight: 500,
              textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
            }),
          }}
        />
      </Box>
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
        sacredtheme={sacredTheme}
      >
        {sacredTheme ? 'Divine Selection' : label}
      </StyledInputLabel>
      <StyledSelect
        value={selectedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        MenuProps={{
          ...MenuProps,
          PaperProps: {
            ...MenuProps.PaperProps,
            sx: sacredTheme
              ? {
                  backgroundColor: alpha('#000000', 0.95),
                  border: `1px solid ${alpha('#FFD700', 0.3)}`,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(255, 215, 0, 0.5)',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.7)',
                    },
                  },
                }
              : {},
          },
        }}
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
        sacredtheme={sacredTheme}
      >
        {filteredOptions.map(renderMenuItem)}
      </StyledSelect>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default Dropdown

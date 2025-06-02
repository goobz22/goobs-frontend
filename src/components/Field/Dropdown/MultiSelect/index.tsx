'use client'

import * as React from 'react'
import {
  Theme,
  useTheme,
  styled,
  SxProps,
  alpha,
  keyframes,
} from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'

// Sacred animations
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

/**
 * Interface for dropdown options with attributes, matching SearchableDropdown format
 */
export interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
  attribute3?: string
  attribute4?: string
  attribute5?: string
  attribute6?: string
  uniqueKey?: string
}

export interface MultiSelectChipProps
  extends Omit<FormControlProps, 'onChange'> {
  label?: React.ReactNode
  /**
   * Can be either:
   * - string[] for simple options
   * - DropdownOption[] for complex options with attributes
   */
  options?: string[] | DropdownOption[]
  /**
   * The values of the selected items
   */
  defaultSelected?: string[]
  /**
   * Callback when selection changes - returns array of selected values
   */
  onChange?: (values: string[]) => void
  /**
   * Whether options are complex DropdownOption objects or simple strings
   * Defaults to auto-detect
   */
  complexOptions?: boolean

  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholdercolor?: string

  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  sx?: SxProps
  /**
   * Whether to show option details in the dropdown - only applies to complex options
   */
  showOptionDetails?: boolean
  /** Enable sacred Egyptian theme */
  sacredTheme?: boolean
}

const ITEM_HEIGHT = 40
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(
  name: string,
  selectedArray: readonly string[],
  theme: Theme
) {
  return {
    fontWeight: selectedArray.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  }
}

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: prop =>
    ![
      'backgroundcolor',
      'outlinecolor',
      'fontcolor',
      'inputfontcolor',
      'shrunkfontcolor',
      'unshrunkfontcolor',
      'placeholdercolor',
      'shrunklabelposition',
      'sacredtheme',
    ].includes(prop as string),
})<
  Pick<
    MultiSelectChipProps,
    | 'backgroundcolor'
    | 'outlinecolor'
    | 'fontcolor'
    | 'inputfontcolor'
    | 'shrunkfontcolor'
    | 'unshrunkfontcolor'
    | 'placeholdercolor'
    | 'shrunklabelposition'
  > & { hasvalue: string; sacredtheme?: boolean }
>(
  ({
    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    shrunkfontcolor,
    unshrunkfontcolor,
    placeholdercolor,
    shrunklabelposition,
    hasvalue,
    sacredtheme,
  }) => ({
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      height: hasvalue === 'true' ? 'auto' : '39px',
      backgroundColor: sacredtheme
        ? alpha('#000000', 0.8)
        : backgroundcolor || 'inherit',
      color: sacredtheme ? '#FFD700' : fontcolor || 'inherit',
      ...(sacredtheme && {
        backgroundImage: `
          linear-gradient(rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05)),
          radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
        `,
        '&::before': {
          content: '"𓊻"',
          position: 'absolute',
          top: '50%',
          right: '45px',
          transform: 'translateY(-50%)',
          color: alpha('#FFD700', 0.3),
          fontSize: '14px',
          pointerEvents: 'none',
          zIndex: 1,
          animation: `${floatGlyph} 3s ease-in-out infinite`,
        },
      }),
      '& fieldset': {
        borderColor: sacredtheme
          ? '#FFD700'
          : outlinecolor ||
            (hasvalue === 'true' ? 'black' : 'rgba(0,0,0,0.23)'),
        ...(sacredtheme && {
          borderWidth: '2px',
        }),
      },
      '&:hover fieldset': {
        borderColor: sacredtheme
          ? '#FFD700'
          : outlinecolor ||
            (hasvalue === 'true' ? 'black' : 'rgba(0,0,0,0.23)'),
        ...(sacredtheme && {
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
        }),
      },
      '&.Mui-focused fieldset': {
        borderColor: sacredtheme
          ? '#FFD700'
          : outlinecolor ||
            (hasvalue === 'true' ? 'black' : 'rgba(0,0,0,0.23)'),
        ...(sacredtheme && {
          animation: `${sacredGlow} 2s ease-in-out infinite`,
        }),
      },
      '& input': {
        color: sacredtheme
          ? '#FFD700'
          : inputfontcolor || fontcolor || 'inherit',
        ...(sacredtheme && {
          textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
          fontWeight: 500,
        }),
        '&::placeholder': {
          color: sacredtheme
            ? alpha('#FFD700', 0.7)
            : placeholdercolor || alpha('#000', 0.54),
          ...(sacredtheme && {
            fontStyle: 'italic',
            letterSpacing: '0.5px',
          }),
        },
      },
      '& .MuiSelect-icon': {
        color: sacredtheme
          ? '#FFD700'
          : inputfontcolor || fontcolor || 'inherit',
        ...(sacredtheme && {
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
        }),
      },
    },
    '& .MuiInputLabel-root': {
      color: sacredtheme
        ? alpha('#FFD700', 0.8)
        : unshrunkfontcolor || fontcolor || 'inherit',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'visible',
      ...(sacredtheme && {
        textShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
        fontWeight: 500,
        letterSpacing: '0.5px',
      }),
      '&.Mui-focused': {
        color: sacredtheme
          ? '#FFD700'
          : shrunkfontcolor || fontcolor || 'inherit',
        ...(sacredtheme && {
          textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
        }),
      },
      '&.MuiInputLabel-shrink': {
        color: sacredtheme
          ? '#FFD700'
          : shrunkfontcolor || fontcolor || 'inherit',
        ...(sacredtheme && {
          textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
          fontWeight: 600,
        }),
        ...(shrunklabelposition === 'aboveNotch' && {
          transform: 'translate(0px, -17px) scale(0.75)',
        }),
        ...(shrunklabelposition === 'onNotch' && {
          transform: 'translate(13px, -4px) scale(0.75)',
        }),
      },
      '&:not(.MuiInputLabel-shrink)': {
        transform: 'none',
        top: '9px',
        left: '14px',
      },
    },
  })
)

export default function MultipleSelectChip(props: MultiSelectChipProps) {
  const {
    label = 'Chip',
    options = [],
    defaultSelected = [],
    onChange,
    complexOptions: userSpecifiedComplexOptions,
    showOptionDetails = false,

    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    shrunkfontcolor,
    unshrunkfontcolor,
    placeholdercolor,
    shrunklabelposition,
    sx,
    sacredTheme = false,
    ...rest
  } = props

  const theme = useTheme()
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultSelected)

  // Auto-detect if options are complex (DropdownOption[]) or simple (string[])
  const isComplexOptions = React.useMemo(() => {
    if (userSpecifiedComplexOptions !== undefined) {
      return userSpecifiedComplexOptions
    }
    // Check if options is an array and the first item is an object with a value property
    return (
      options.length > 0 &&
      typeof options[0] !== 'string' &&
      'value' in options[0]
    )
  }, [options, userSpecifiedComplexOptions])

  // Parse options to get display values and lookup
  const optionsData = React.useMemo(() => {
    if (!isComplexOptions) {
      // Simple string options
      return {
        displayOptions: options as string[],
        optionsMap: new Map<string, string>(),
      }
    }

    // Complex options with attributes
    const complexOptions = options as DropdownOption[]
    // Use DropdownOption type explicitly for the map
    const optionsMap = new Map<string, DropdownOption>()

    // Create a map of value to original option object for quick lookups
    complexOptions.forEach(option => {
      optionsMap.set(option.value, option)
    })

    // Extract just the values for the dropdown
    const displayOptions = complexOptions.map(option => option.value)

    return {
      displayOptions,
      optionsMap,
    }
  }, [options, isComplexOptions])

  const hasValue = React.useMemo(
    () => (selectedValues.length > 0).toString(),
    [selectedValues]
  )

  const handleSelectChange = (
    event: SelectChangeEvent<typeof selectedValues>
  ) => {
    const { value } = event.target
    const newValue = typeof value === 'string' ? value.split(',') : value
    setSelectedValues(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  // Render menu item text appropriately based on option type
  const renderMenuItemText = (value: string) => {
    if (!isComplexOptions) {
      return value
    }

    // Cast optionsMap to the correct type with DropdownOption
    const optionsMap = optionsData.optionsMap as Map<string, DropdownOption>
    const option = optionsMap.get(value)

    // If no option found in the map, just return the value
    if (!option) return value

    // Check if we should show details and if attribute1 exists
    if (!showOptionDetails || typeof option.attribute1 === 'undefined') {
      return value
    }

    // If showing details, include attribute1 (typically description/department)
    return (
      <Box>
        <Box
          sx={{
            color: sacredTheme ? '#FFD700' : 'inherit',
            ...(sacredTheme && {
              fontWeight: 500,
            }),
          }}
        >
          {value}
        </Box>
        <Box
          sx={{
            fontSize: '0.8em',
            color: sacredTheme ? alpha('#FFD700', 0.7) : 'text.secondary',
            ...(sacredTheme && {
              fontStyle: 'italic',
            }),
          }}
        >
          {option.attribute1}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: '20px',
        height: 'auto',
        overflow: 'visible',
        ...sx,
      }}
    >
      <StyledFormControl
        sx={{ ...sx }}
        variant="outlined"
        hasvalue={hasValue}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        inputfontcolor={inputfontcolor}
        shrunkfontcolor={shrunkfontcolor}
        unshrunkfontcolor={unshrunkfontcolor}
        placeholdercolor={placeholdercolor}
        shrunklabelposition={shrunklabelposition}
        sacredtheme={sacredTheme}
        {...rest}
      >
        <InputLabel id="multi-select-chip-label">
          {sacredTheme ? 'Sacred Selections' : label}
        </InputLabel>
        <Select
          labelId="multi-select-chip-label"
          id="multi-select-chip"
          multiple
          value={selectedValues}
          onChange={handleSelectChange}
          input={
            <OutlinedInput
              label={sacredTheme ? 'Sacred Selections' : label}
              sx={{
                height: selectedValues.length > 0 ? 'auto' : '35px',
                minHeight: '35px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                alignItems: 'center',
                ...(selectedValues.length > 0 && {
                  pt: 0.5,
                  pb: 0.5,
                }),
              }}
              placeholder={
                sacredTheme
                  ? 'Divine choices...'
                  : placeholdercolor
                    ? (label as string)
                    : undefined
              }
            />
          }
          renderValue={selected => (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
              }}
            >
              {selected.map(val => (
                <Chip
                  key={val}
                  label={val}
                  size="small"
                  sx={{
                    height: '24px',
                    ...(sacredTheme && {
                      backgroundColor: alpha('#FFD700', 0.2),
                      color: '#FFD700',
                      border: `1px solid ${alpha('#FFD700', 0.4)}`,
                      '& .MuiChip-deleteIcon': {
                        color: alpha('#FFD700', 0.8),
                        '&:hover': {
                          color: '#FFD700',
                        },
                      },
                    }),
                  }}
                />
              ))}
            </Box>
          )}
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
        >
          {optionsData.displayOptions.map(value => (
            <MenuItem
              key={value}
              value={value}
              style={getStyles(value, selectedValues, theme)}
              sx={{
                ...(sacredTheme && {
                  color: alpha('#FFD700', 0.9),
                  backgroundColor: selectedValues.includes(value)
                    ? alpha('#FFD700', 0.2)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha('#FFD700', 0.15),
                    color: '#FFD700',
                  },
                }),
              }}
            >
              {renderMenuItemText(value)}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </Box>
  )
}

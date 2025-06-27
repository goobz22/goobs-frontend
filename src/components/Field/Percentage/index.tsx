'use client'
import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton, alpha, keyframes } from '@mui/material'
import TextField, { TextFieldProps } from '../../Field/Text'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { styled } from '@mui/material/styles'

// Sacred animations
const sacredGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export interface PercentageFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string | number
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => parseInt(event.target.value) ...
   * Or a direct number value from increment/decrement
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  min?: number
  max?: number
  /** Step size for increment/decrement (default: 1) */
  step?: number
  /** Initial delay before continuous increment/decrement starts (ms) */
  initialDelay?: number
  /** Interval between continuous increment/decrement actions (ms) */
  repeatInterval?: number
  /** Whether to display the % symbol (default: true) */
  showPercentSymbol?: boolean
  /** Enable sacred Egyptian theme */
  sacredtheme?: boolean
}

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'sacredtheme',
})<{ sacredtheme?: boolean }>(({ theme, sacredtheme }) => ({
  padding: 0,
  width: '16px',
  height: '16px',
  minWidth: '16px',
  minHeight: '16px',
  borderRadius: '2px',
  transition: 'all 0.3s ease',
  color: sacredtheme ? '#FFD700' : 'inherit',
  '&:hover': {
    backgroundColor: sacredtheme
      ? alpha('#FFD700', 0.1)
      : theme.palette.grey[200],
    ...(sacredtheme && {
      animation: `${sacredGlow} 1s ease-in-out infinite`,
    }),
  },
}))

const ArrowIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '16px',
  width: '16px',
  lineHeight: 1,
})

/**
 * A specialized numeric field for percentage values (0-100%)
 * with increment/decrement buttons in the right slot.
 * Holding down the buttons will continuously increment/decrement the value.
 */
const PercentageField: React.FC<PercentageFieldProps> = ({
  initialValue = '0',
  onChange,
  label,
  min = 0,
  max = 100, // Default max is 100% for percentages
  step = 1,
  initialDelay = 500,
  repeatInterval = 100,
  showPercentSymbol = true,
  sacredtheme = false,
  ...rest
}) => {
  // Convert initialValue to string if it's a number
  const initialValueString =
    typeof initialValue === 'number' ? initialValue.toString() : initialValue

  const [value, setValue] = useState(initialValueString)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) {
      clearTimeout(initialTimerRef.current)
      initialTimerRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const formatValue = useCallback(
    (val: string): string => {
      // Remove non-numeric characters first
      const numericValue = val.replace(/[^0-9.]/g, '')

      // Handle empty value
      if (numericValue === '' || numericValue === '.') {
        return ''
      }

      // Handle decimal values
      let parsedValue = parseFloat(numericValue)
      if (isNaN(parsedValue)) {
        return '0'
      }

      // Apply min/max constraints
      if (min !== undefined && parsedValue < min) {
        parsedValue = min
      } else if (max !== undefined && parsedValue > max) {
        parsedValue = max
      }

      // Return as string with up to 2 decimal places if needed
      return parsedValue % 1 === 0
        ? parsedValue.toString()
        : parsedValue.toFixed(2).replace(/\.00$/, '')
    },
    [min, max]
  )

  const handleIncrement = useCallback(() => {
    setValue(prev => {
      const num = parseFloat(prev || '0')
      if (isNaN(num)) {
        return '0'
      }

      const newValue =
        max !== undefined ? Math.min(max, num + step) : num + step
      const newValueStr = formatValue(newValue.toString())

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, max, step, formatValue])

  const handleDecrement = useCallback(() => {
    setValue(prev => {
      const num = parseFloat(prev || '0')
      if (isNaN(num)) {
        return '0'
      }

      const newValue = Math.max(min, num - step)
      const newValueStr = formatValue(newValue.toString())

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, min, step, formatValue])

  const handleIncrementMouseDown = useCallback(() => {
    // First increment happens immediately
    handleIncrement()

    // Set initial delay before rapid increment starts
    initialTimerRef.current = setTimeout(() => {
      // Start continuous increment
      timerRef.current = setInterval(handleIncrement, repeatInterval)
    }, initialDelay)

    // Capture mouse up and mouse leave events on the document
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleIncrement, initialDelay, repeatInterval, clearTimers])

  const handleDecrementMouseDown = useCallback(() => {
    // First decrement happens immediately
    handleDecrement()

    // Set initial delay before rapid decrement starts
    initialTimerRef.current = setTimeout(() => {
      // Start continuous decrement
      timerRef.current = setInterval(handleDecrement, repeatInterval)
    }, initialDelay)

    // Capture mouse up and mouse leave events on the document
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleDecrement, initialDelay, repeatInterval, clearTimers])

  // Clean up event listeners when component unmounts
  React.useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      // Remove the percentage symbol if it exists
      const numericInput = rawValue.replace(/%/g, '')
      const formattedValue = formatValue(numericInput)
      setValue(formattedValue)

      // Create a properly typed clone of the event to prevent issues with synthetic events
      const clonedEvent = {
        ...event,
        target: {
          ...event.target,
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(clonedEvent)
    },
    [onChange, formatValue]
  )

  // Format the displayed value to include the % sign
  const displayValue = showPercentSymbol && value ? `${value}%` : value

  const SacredEndAdornment = () => (
    <Box sx={{ position: 'relative' }}>
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: alpha('#FFD700', 0.3),
            fontSize: '12px',
            animation: `${rotateGlyph} 10s linear infinite`,
          }}
        >
          𓏏
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          marginRight: '-4px',
          height: '32px',
          justifyContent: 'center',
        }}
      >
        <StyledIconButton
          size="small"
          onMouseDown={handleIncrementMouseDown}
          edge="end"
          aria-label="increment"
          sx={{ marginBottom: '-2px' }}
          sacredtheme={sacredtheme}
        >
          <ArrowIcon>
            <ArrowDropUpIcon fontSize="small" sx={{ fontSize: '18px' }} />
          </ArrowIcon>
        </StyledIconButton>
        <StyledIconButton
          size="small"
          onMouseDown={handleDecrementMouseDown}
          edge="end"
          aria-label="decrement"
          sacredtheme={sacredtheme}
        >
          <ArrowIcon>
            <ArrowDropDownIcon fontSize="small" sx={{ fontSize: '18px' }} />
          </ArrowIcon>
        </StyledIconButton>
      </Box>
    </Box>
  )

  return (
    <TextField
      value={displayValue}
      onChange={handleChange}
      label={sacredtheme ? 'Sacred Portion' : label}
      type="text"
      inputMode="numeric"
      variant="outlined"
      placeholder={sacredtheme ? 'Divine percentage...' : undefined}
      sacredtheme={sacredtheme}
      endAdornment={<SacredEndAdornment />}
      {...rest}
    />
  )
}

export default PercentageField

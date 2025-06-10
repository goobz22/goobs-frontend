'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, alpha, keyframes, IconButton, styled } from '@mui/material'
import TextField, { TextFieldProps } from '../Text'
import { black } from '../../../styles/palette'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

// Sacred animations
const goldShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.1); }
  100% { transform: translateY(0px) scale(1); }
`

const sacredGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
`

const hieroglyphPulse = keyframes`
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(1); }
`

export interface USDFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (value: string) => void
  label?: string
  min?: number
  max?: number
  precision?: number
  readOnly?: boolean
  /** Enable increment/decrement arrows */
  enableIncrement?: boolean
  /** Increment step amount */
  incrementStep?: number
  /** Initial delay before continuous increment/decrement starts (ms) */
  initialDelay?: number
  /** Interval between continuous increment/decrement actions (ms) */
  repeatInterval?: number
  /** Enable sacred Egyptian theme */
  sacredTheme?: boolean
}

interface StyledIconButtonProps {
  sacredtheme?: boolean
}

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'sacredtheme',
})<StyledIconButtonProps>(({ theme, sacredtheme }) => ({
  padding: 0,
  width: '16px',
  height: '16px',
  minWidth: '16px',
  minHeight: '16px',
  borderRadius: '2px',
  transition: 'all 0.3s ease',
  ...(sacredtheme
    ? {
        backgroundColor: alpha('#FFD700', 0.1),
        color: '#FFD700',
        border: `1px solid ${alpha('#FFD700', 0.3)}`,
        position: 'relative',
        '&::before': {
          content: '"𓆙"',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '8px',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0,
          animation: `${hieroglyphPulse} 3s ease-in-out infinite`,
        },
        '&:hover': {
          backgroundColor: alpha('#FFD700', 0.2),
          boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
          transform: 'scale(1.05)',
          '&::before': {
            opacity: 0.6,
          },
        },
        '&:active': {
          animation: `${sacredGlow} 0.3s ease-in-out`,
          transform: 'scale(0.95)',
        },
      }
    : {
        '&:hover': {
          backgroundColor: theme.palette.grey[200],
        },
      }),
}))

const ArrowIcon = styled(Box, {
  shouldForwardProp: prop => prop !== 'sacredtheme',
})<{ sacredtheme?: boolean }>(({ sacredtheme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '16px',
  width: '16px',
  lineHeight: 1,
  zIndex: 1,
  position: 'relative',
  ...(sacredtheme && {
    '& svg': {
      filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.6))',
      color: '#FFD700',
    },
  }),
}))

const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')

  // Handle empty input
  if (!numericValue) return ''

  // Allow manual decimal input
  if (numericValue === '.') return '.'

  // Handle multiple decimal points - keep only the first one
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`
  }

  // If there's a decimal point, allow manual input
  if (numericValue.includes('.')) {
    return numericValue
  }

  // For whole numbers, convert and format
  const number = parseFloat(numericValue)
  if (isNaN(number)) return ''

  return number.toString()
}

const USDField: React.FC<USDFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'Amount',
  min,
  max,
  precision = 2,
  readOnly = false,
  enableIncrement = false,
  incrementStep = 1,
  initialDelay = 500,
  repeatInterval = 100,
  sacredTheme = false,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
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

  const handleIncrement = useCallback(() => {
    if (readOnly) return

    setValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue =
        max !== undefined
          ? Math.min(max, num + incrementStep)
          : num + incrementStep
      const formattedValue = newValue.toFixed(precision)

      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, max, incrementStep, precision, readOnly])

  const handleDecrement = useCallback(() => {
    if (readOnly) return

    setValue(prev => {
      const num = parseFloat(prev) || 0
      const newValue = Math.max(min || 0, num - incrementStep)
      const formattedValue = newValue.toFixed(precision)

      onChange?.(formattedValue)
      return formattedValue
    })
  }, [onChange, min, incrementStep, precision, readOnly])

  const handleIncrementMouseDown = useCallback(() => {
    if (readOnly) return

    handleIncrement()

    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleIncrement, repeatInterval)
    }, initialDelay)

    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleIncrement, initialDelay, repeatInterval, clearTimers, readOnly])

  const handleDecrementMouseDown = useCallback(() => {
    if (readOnly) return

    handleDecrement()

    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleDecrement, repeatInterval)
    }, initialDelay)

    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleDecrement, initialDelay, repeatInterval, clearTimers, readOnly])

  React.useEffect(() => {
    return () => {
      clearTimers()
      document.removeEventListener('mouseup', clearTimers)
      document.removeEventListener('mouseleave', clearTimers)
    }
  }, [clearTimers])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return

      const newValue = event.target.value
      const formattedValue = formatCurrency(newValue)

      // Validate min/max if provided
      const numericValue = parseFloat(formattedValue)
      if (!isNaN(numericValue)) {
        if (min !== undefined && numericValue < min) {
          setValue(min.toFixed(precision))
          onChange?.(min.toFixed(precision))
          return
        }
        if (max !== undefined && numericValue > max) {
          setValue(max.toFixed(precision))
          onChange?.(max.toFixed(precision))
          return
        }
      }

      setValue(formattedValue)
      onChange?.(formattedValue)
    },
    [onChange, precision, min, max, readOnly]
  )

  const DollarAdornment = () => (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {sacredTheme && (
        <Box
          sx={{
            position: 'absolute',
            left: '-15px',
            color: alpha('#FFD700', 0.4),
            fontSize: '12px',
            animation: `${floatGlyph} 3s ease-in-out infinite`,
          }}
        >
          𓊹
        </Box>
      )}
      <Box
        sx={{
          color: sacredTheme ? '#FFD700' : black.main,
          fontWeight: sacredTheme ? 600 : 400,
          fontSize: sacredTheme ? '18px' : '16px',
          ...(sacredTheme && {
            background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
            backgroundSize: '200% 100%',
            animation: `${goldShimmer} 3s linear infinite`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
          }),
        }}
      >
        $
      </Box>
    </Box>
  )

  const IncrementAdornment = () => {
    if (!enableIncrement) return null

    return (
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          marginRight: '-4px',
          height: '32px',
          justifyContent: 'center',
          ...(sacredTheme && {
            background: `linear-gradient(135deg, ${alpha('#FFD700', 0.05)} 0%, ${alpha('#FFD700', 0.15)} 100%)`,
            borderRadius: '4px',
            padding: '2px',
          }),
        }}
      >
        <StyledIconButton
          size="small"
          onMouseDown={handleIncrementMouseDown}
          edge="end"
          aria-label="increment"
          sacredtheme={sacredTheme}
          disabled={readOnly}
          sx={{ marginBottom: '-2px' }}
        >
          <ArrowIcon sacredtheme={sacredTheme}>
            <ArrowDropUpIcon fontSize="small" sx={{ fontSize: '18px' }} />
          </ArrowIcon>
        </StyledIconButton>
        <StyledIconButton
          size="small"
          onMouseDown={handleDecrementMouseDown}
          edge="end"
          aria-label="decrement"
          sacredtheme={sacredTheme}
          disabled={readOnly}
        >
          <ArrowIcon sacredtheme={sacredTheme}>
            <ArrowDropDownIcon fontSize="small" sx={{ fontSize: '18px' }} />
          </ArrowIcon>
        </StyledIconButton>
      </Box>
    )
  }

  return (
    <Box>
      <TextField
        value={value}
        onChange={handleChange}
        label={sacredTheme ? 'Sacred Treasury' : label}
        type="text"
        inputMode="decimal"
        variant="outlined"
        placeholder={sacredTheme ? 'Divine wealth...' : undefined}
        sacredTheme={sacredTheme}
        startAdornment={<DollarAdornment />}
        endAdornment={enableIncrement ? <IncrementAdornment /> : undefined}
        slotProps={{
          input: {
            readOnly,
            sx: {
              '& .MuiInputBase-input': {
                marginLeft: sacredTheme ? '-10px' : '-15px',
                marginTop: '2px',
              },
              '&::placeholder': {
                marginLeft: sacredTheme ? '-10px' : '-15px',
                marginTop: '2px',
              },
            },
          },
        }}
        {...rest}
      />
    </Box>
  )
}

export default USDField

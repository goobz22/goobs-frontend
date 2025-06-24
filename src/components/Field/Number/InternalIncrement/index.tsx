'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton } from '@mui/material'
import TextField, { TextFieldProps } from '../../../Field/Text'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { styled, keyframes, alpha } from '@mui/material/styles'

// Sacred theme animations matching TextField
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

export interface InternalIncrementNumberFieldProps
  extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => parseInt(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  min?: number
  max?: number
  /** Initial delay before continuous increment/decrement starts (ms) */
  initialDelay?: number
  /** Interval between continuous increment/decrement actions (ms) */
  repeatInterval?: number
  /** Enable sacred Egyptian theme */
  sacredtheme?: boolean
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

/**
 * A controlled numeric field that allows digits with increment/decrement buttons
 * in the right slot and optionally enforces min/max constraints.
 * Holding down the buttons will continuously increment/decrement the value.
 */
const InternalIncrementNumberField: React.FC<
  InternalIncrementNumberFieldProps
> = ({
  initialValue = '0',
  onChange,
  label,
  min = 0,
  max,
  initialDelay = 500, // wait 500ms before starting continuous increment/decrement
  repeatInterval = 100, // then repeat every 100ms
  sacredtheme = false,
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
    setValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '0'
      }

      const newValue = max !== undefined ? Math.min(max, num + 1) : num + 1
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, max])

  const handleDecrement = useCallback(() => {
    setValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '0'
      }

      const newValue = Math.max(min, num - 1)
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, min])

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
      const newValue = event.target.value.replace(/[^0-9]/g, '')

      if (newValue === '') {
        setValue('')
        onChange?.(event)
        return
      }

      const numValue = parseInt(newValue, 10)

      if (min !== undefined && numValue < min) {
        setValue(String(min))
      } else if (max !== undefined && numValue > max) {
        setValue(String(max))
      } else {
        setValue(newValue)
      }

      onChange?.(event)
    },
    [onChange, min, max]
  )

  return (
    <TextField
      value={value}
      onChange={handleChange}
      label={label}
      type="text"
      inputMode="numeric"
      variant="outlined"
      sacredtheme={sacredtheme}
      endAdornment={
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            marginRight: '-4px',
            height: '32px',
            justifyContent: 'center',
            ...(sacredtheme && {
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
            sacredtheme={sacredtheme}
            sx={{ marginBottom: '-2px' }}
          >
            <ArrowIcon sacredtheme={sacredtheme}>
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
            <ArrowIcon sacredtheme={sacredtheme}>
              <ArrowDropDownIcon fontSize="small" sx={{ fontSize: '18px' }} />
            </ArrowIcon>
          </StyledIconButton>
        </Box>
      }
      {...rest}
    />
  )
}

export default InternalIncrementNumberField

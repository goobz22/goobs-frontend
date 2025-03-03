'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton } from '@mui/material'
import TextField, { TextFieldProps } from '../../../Field/Text'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { styled } from '@mui/material/styles'

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
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  width: '16px',
  height: '16px',
  minWidth: '16px',
  minHeight: '16px',
  borderRadius: '2px',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
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
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const initialTimerRef = useRef<NodeJS.Timeout | null>(null)

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
      endAdornment={
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
          >
            <ArrowIcon>
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

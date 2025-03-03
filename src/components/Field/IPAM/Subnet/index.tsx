'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
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

const SubnetInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}))

interface SubnetData {
  mask: string
  hosts: string
  usableHosts: string
}

const calculateSubnetInfo = (cidr: number): SubnetData => {
  // Calculate subnet mask
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')

  // Calculate total hosts and usable hosts
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)

  return {
    mask,
    hosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

/**
 * A controlled numeric field that allows digits with increment/decrement buttons
 * in the right slot and optionally enforces min/max constraints.
 * Holding down the buttons will continuously increment/decrement the value.
 */
const InternalIncrementNumberField: React.FC<
  InternalIncrementNumberFieldProps
> = ({
  initialValue = '16',
  onChange,
  label = 'Subnet Mask',
  initialDelay = 500,
  repeatInterval = 100,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue)
    if (isNaN(initialNum)) return '16'
    return Math.min(Math.max(initialNum, 16), 32).toString()
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const subnetInfo = calculateSubnetInfo(parseInt(currentValue) || 16)

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
    setCurrentValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '16'
      }

      const newValue = Math.min(32, num + 1)
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return '16'
      }

      const newValue = Math.max(16, num - 1)
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange])

  const handleIncrementMouseDown = useCallback(() => {
    handleIncrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleIncrement, repeatInterval)
    }, initialDelay)
    document.addEventListener('mouseup', clearTimers)
    document.addEventListener('mouseleave', clearTimers)
  }, [handleIncrement, initialDelay, repeatInterval, clearTimers])

  const handleDecrementMouseDown = useCallback(() => {
    handleDecrement()
    initialTimerRef.current = setTimeout(() => {
      timerRef.current = setInterval(handleDecrement, repeatInterval)
    }, initialDelay)
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
        setCurrentValue('16')
        onChange?.(event)
        return
      }

      const numValue = parseInt(newValue, 10)

      if (isNaN(numValue) || numValue < 16) {
        setCurrentValue('16')
      } else if (numValue > 32) {
        setCurrentValue('32')
      } else {
        setCurrentValue(newValue)
      }

      onChange?.(event)
    },
    [onChange]
  )

  return (
    <Box>
      <TextField
        value={subnetInfo.mask}
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
      <SubnetInfo>
        <Typography variant="body2" component="div">
          CIDR: /{currentValue}
        </Typography>
        <Typography variant="body2" component="div">
          Total Hosts: {subnetInfo.hosts} ({subnetInfo.usableHosts} usable)
        </Typography>
      </SubnetInfo>
    </Box>
  )
}

export default InternalIncrementNumberField

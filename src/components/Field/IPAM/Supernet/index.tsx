'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TextField, { TextFieldProps } from '../../../Field/Text'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { styled } from '@mui/material/styles'

export interface SupernetFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  initialDelay?: number
  repeatInterval?: number
  /** The CIDR of the subnet we're finding supernets for */
  subnetCidr?: number
  /** The minimum CIDR value for supernets (default: 8) */
  minCidr?: number
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

const SupernetInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}))

interface SupernetData {
  mask: string
  networks: string
  totalHosts: string
  usableHosts: string
}

const calculateSupernetInfo = (
  cidr: number,
  subnetCidr: number
): SupernetData => {
  // Calculate subnet mask
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')

  // Calculate number of networks (subnets) this supernet can contain
  const networks = Math.pow(2, subnetCidr - cidr)

  // Calculate total hosts and usable hosts
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)

  return {
    mask,
    networks: networks.toLocaleString(),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

const SupernetField: React.FC<SupernetFieldProps> = ({
  initialValue = '16',
  onChange,
  label = 'Supernet Mask',
  initialDelay = 500,
  repeatInterval = 100,
  subnetCidr = 24, // Default to /24 subnet
  minCidr = 8, // Default minimum CIDR is /8
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue)
    if (isNaN(initialNum)) return '16'
    return Math.min(Math.max(initialNum, minCidr), subnetCidr - 1).toString()
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const supernetInfo = calculateSupernetInfo(
    parseInt(currentValue) || 16,
    subnetCidr
  )

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
        return minCidr.toString()
      }

      const newValue = Math.min(subnetCidr - 1, num + 1)
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, subnetCidr, minCidr])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      if (isNaN(num)) {
        return minCidr.toString()
      }

      const newValue = Math.max(minCidr, num - 1)
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, minCidr])

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
        setCurrentValue(minCidr.toString())
        onChange?.(event)
        return
      }

      const numValue = parseInt(newValue, 10)

      if (isNaN(numValue) || numValue < minCidr) {
        setCurrentValue(minCidr.toString())
      } else if (numValue >= subnetCidr) {
        setCurrentValue((subnetCidr - 1).toString())
      } else {
        setCurrentValue(newValue)
      }

      onChange?.(event)
    },
    [onChange, subnetCidr, minCidr]
  )

  return (
    <Box>
      <TextField
        value={supernetInfo.mask}
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
      <SupernetInfo>
        <Typography variant="body2" component="div">
          CIDR: /{currentValue}
        </Typography>
        <Typography variant="body2" component="div">
          Can contain {supernetInfo.networks} /{subnetCidr} subnets
        </Typography>
        <Typography variant="body2" component="div">
          Total Hosts: {supernetInfo.totalHosts} ({supernetInfo.usableHosts}{' '}
          usable)
        </Typography>
      </SupernetInfo>
    </Box>
  )
}

export default SupernetField

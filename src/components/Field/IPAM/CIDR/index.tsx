'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TextField, { TextFieldProps } from '../../../Field/Text'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { styled } from '@mui/material/styles'

export interface CIDRFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  initialDelay?: number
  repeatInterval?: number
  /** The minimum CIDR value (default: 8) */
  minCidr?: number
  /** The maximum CIDR value (default: 32) */
  maxCidr?: number
  /** Whether to show subnet information (default: true) */
  showSubnetInfo?: boolean
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

const CIDRInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}))

interface CIDRData {
  mask: string
  totalHosts: string
  usableHosts: string
  networks: string
}

const calculateCIDRInfo = (cidr: number): CIDRData => {
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

  // Calculate number of networks (for supernet calculation)
  const networks = Math.pow(2, 32 - cidr)

  return {
    mask,
    networks: networks.toLocaleString(),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

const CIDRField: React.FC<CIDRFieldProps> = ({
  initialValue = '24',
  onChange,
  label = 'CIDR',
  initialDelay = 500,
  repeatInterval = 100,
  minCidr = 8,
  maxCidr = 32,
  showSubnetInfo = true,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(() => {
    const initialNum = parseInt(initialValue)
    if (isNaN(initialNum)) return '24'
    return Math.min(Math.max(initialNum, minCidr), maxCidr).toString()
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cidrInfo = calculateCIDRInfo(parseInt(currentValue) || 24)

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

      const newValue = Math.min(maxCidr, num + 1)
      const newValueStr = newValue.toString()

      if (onChange) {
        onChange(newValue)
      }

      return newValueStr
    })
  }, [onChange, maxCidr, minCidr])

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
      } else if (numValue > maxCidr) {
        setCurrentValue(maxCidr.toString())
      } else {
        setCurrentValue(newValue)
      }

      onChange?.(event)
    },
    [onChange, minCidr, maxCidr]
  )

  return (
    <Box>
      <TextField
        value={`/${currentValue}`}
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
      {showSubnetInfo && (
        <CIDRInfo>
          <Typography variant="body2" component="div">
            Subnet Mask: {cidrInfo.mask}
          </Typography>
          <Typography variant="body2" component="div">
            Total Hosts: {cidrInfo.totalHosts} ({cidrInfo.usableHosts} usable)
          </Typography>
          <Typography variant="body2" component="div">
            Networks: {cidrInfo.networks}
          </Typography>
        </CIDRInfo>
      )}
    </Box>
  )
}

export default CIDRField

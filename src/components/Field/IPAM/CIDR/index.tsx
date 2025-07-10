'use client'

import React, { useState, useCallback, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'
import ArrowDropUpIcon from '../../../Icons/ArrowDropUp'
import ArrowDropDownIcon from '../../../Icons/ArrowDropDown'

export interface CIDRFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | number) => void
  label?: string
  initialDelay?: number
  repeatInterval?: number
  minCidr?: number
  maxCidr?: number
  showSubnetInfo?: boolean
}

const calculateCIDRInfo = (cidr: number) => {
  const fullMask = Math.pow(2, 32) - Math.pow(2, 32 - cidr)
  const maskParts = [
    (fullMask >> 24) & 255,
    (fullMask >> 16) & 255,
    (fullMask >> 8) & 255,
    fullMask & 255,
  ]
  const mask = maskParts.join('.')
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = Math.max(totalHosts - 2, 0)
  const networks = Math.pow(2, 32 - cidr)

  return {
    mask,
    networks: networks.toLocaleString(),
    totalHosts: totalHosts.toLocaleString(),
    usableHosts: usableHosts.toLocaleString(),
  }
}

const getStyles = () => ({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    marginRight: '-0.25rem',
  } as React.CSSProperties,
  button: {
    padding: 0,
    width: '1rem',
    height: '1rem',
    minWidth: '1rem',
    minHeight: '1rem',
    borderRadius: '0.125rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
    '&:disabled': {
      opacity: 0.5,
    },
  } as React.CSSProperties,
  infoContainer: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#4B5563',
  } as React.CSSProperties,
})

const CIDRField: React.FC<CIDRFieldProps> = ({
  initialValue = '24',
  onChange,
  label = 'CIDR',
  initialDelay = 500,
  repeatInterval = 100,
  minCidr = 8,
  maxCidr = 32,
  showSubnetInfo = true,
  disabled,
  sacredtheme,
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
  const styles = getStyles()

  const clearTimers = useCallback(() => {
    if (initialTimerRef.current) clearTimeout(initialTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    initialTimerRef.current = null
    timerRef.current = null
  }, [])

  const handleIncrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.min(maxCidr, isNaN(num) ? minCidr : num + 1)
      onChange?.(newValue)
      return newValue.toString()
    })
  }, [onChange, maxCidr, minCidr])

  const handleDecrement = useCallback(() => {
    setCurrentValue(prev => {
      const num = parseInt(prev)
      const newValue = Math.max(minCidr, isNaN(num) ? minCidr : num - 1)
      onChange?.(newValue)
      return newValue.toString()
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
      const newValue = event.target.value
        .replace(/[^0-9/]/g, '')
        .replace('/', '')
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

  const EndAdornment = () => (
    <div style={styles.buttonContainer}>
      <button
        type="button"
        onMouseDown={handleIncrementMouseDown}
        disabled={disabled}
        style={styles.button}
      >
        <ArrowDropUpIcon style={{ fontSize: '1.25rem' }} />
      </button>
      <button
        type="button"
        onMouseDown={handleDecrementMouseDown}
        disabled={disabled}
        style={styles.button}
      >
        <ArrowDropDownIcon style={{ fontSize: '1.25rem' }} />
      </button>
    </div>
  )

  return (
    <div>
      <TextField
        value={`/${currentValue}`}
        onChange={handleChange}
        label={label}
        type="text"
        inputMode="numeric"
        disabled={disabled}
        endAdornment={<EndAdornment />}
        sacredtheme={sacredtheme}
        {...rest}
      />
      {showSubnetInfo && (
        <div style={styles.infoContainer}>
          <div>Subnet Mask: {cidrInfo.mask}</div>
          <div>
            Total Hosts: {cidrInfo.totalHosts} ({cidrInfo.usableHosts} usable)
          </div>
          <div>Networks: {cidrInfo.networks}</div>
        </div>
      )}
    </div>
  )
}

export default CIDRField

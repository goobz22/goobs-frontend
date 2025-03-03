'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import TextField, { TextFieldProps } from '../../../Field/Text'
import { styled } from '@mui/material/styles'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

// VLAN ID constraints
const MIN_VLAN_ID = 1
const MAX_VLAN_ID = 4094

export interface VLANFieldProps extends Omit<TextFieldProps, 'onChange'> {
  initialValue?: string
  /**
   * A standard ChangeEvent<HTMLInputElement> so parent can do
   * e.g. (event) => getVLANValue(event.target.value) ...
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  /** The amount to increment/decrement when using the buttons */
  step?: number
  /** Delay in ms before repeating when button is held down */
  initialDelay?: number
  /** Interval in ms between repeats when button is held down */
  repeatInterval?: number
  /** Array of reserved VLAN IDs that can't be used */
  reservedVLANs?: number[]
}

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  '& .MuiButton-root': {
    minWidth: '32px',
    padding: 0,
  },
}))

/**
 * Finds the next available VLAN ID in the given direction
 */
const findNextAvailableVLAN = (
  currentValue: number,
  step: number,
  reservedVLANs: number[] = [],
  direction: 'up' | 'down' = 'up'
): number => {
  let nextValue = currentValue

  do {
    nextValue = direction === 'up' ? nextValue + step : nextValue - step

    // Handle boundaries
    if (nextValue > MAX_VLAN_ID) {
      nextValue = MIN_VLAN_ID
    } else if (nextValue < MIN_VLAN_ID) {
      nextValue = MAX_VLAN_ID
    }

    // Prevent infinite loop if all VLANs are reserved
    if (nextValue === currentValue) {
      break
    }
  } while (reservedVLANs.includes(nextValue))

  return nextValue
}

/**
 * A specialized text field for VLAN ID entry
 * - Validates VLAN ID ranges (1-4094)
 * - Provides increment/decrement buttons
 * - Supports reserved VLAN ID validation
 */
const VLANField: React.FC<VLANFieldProps> = ({
  initialValue = '',
  onChange,
  label = 'VLAN ID',
  step = 1,
  initialDelay = 500,
  repeatInterval = 100,
  reservedVLANs = [],
  InputProps,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const incrementIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decrementIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up any intervals on unmount
  useEffect(() => {
    return () => {
      if (incrementIntervalRef.current) {
        clearTimeout(incrementIntervalRef.current)
      }
      if (decrementIntervalRef.current) {
        clearTimeout(decrementIntervalRef.current)
      }
    }
  }, [])

  const formatVLAN = useCallback((input: string): string => {
    // Remove any non-digit characters
    return input.replace(/\D/g, '')
  }, [])

  const validateVLAN = useCallback(
    (vlanStr: string): boolean => {
      if (!vlanStr) {
        setIsValid(true)
        setErrorMessage(undefined)
        return true
      }

      const vlanId = parseInt(vlanStr, 10)

      if (isNaN(vlanId)) {
        setIsValid(false)
        setErrorMessage('VLAN ID must be a number')
        return false
      }

      if (vlanId < MIN_VLAN_ID) {
        setIsValid(false)
        setErrorMessage(`VLAN ID must be at least ${MIN_VLAN_ID}`)
        return false
      }

      if (vlanId > MAX_VLAN_ID) {
        setIsValid(false)
        setErrorMessage(`VLAN ID cannot exceed ${MAX_VLAN_ID}`)
        return false
      }

      if (reservedVLANs.includes(vlanId)) {
        setIsValid(false)
        setErrorMessage(`VLAN ID ${vlanId} is reserved and cannot be used`)
        return false
      }

      setIsValid(true)
      setErrorMessage(undefined)
      return true
    },
    [reservedVLANs]
  )

  // Initialize and validate initial value
  useEffect(() => {
    if (initialValue) {
      validateVLAN(initialValue)
    }
  }, [initialValue, validateVLAN])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      const formattedValue = formatVLAN(rawValue)

      setValue(formattedValue)
      validateVLAN(formattedValue)

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
    [onChange, formatVLAN, validateVLAN]
  )

  // Handle paste events
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')
      const formattedValue = formatVLAN(pastedText)

      setValue(formattedValue)
      validateVLAN(formattedValue)

      // Create a synthetic change event
      const syntheticEvent = {
        target: {
          value: formattedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)
    },
    [formatVLAN, onChange, validateVLAN]
  )

  const incrementValue = useCallback(() => {
    const currentValue = parseInt(value, 10)
    if (isNaN(currentValue)) {
      const newValue = MIN_VLAN_ID.toString()
      setValue(newValue)
      validateVLAN(newValue)

      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)
      return
    }

    const nextValue = findNextAvailableVLAN(
      currentValue,
      step,
      reservedVLANs,
      'up'
    )
    setValue(nextValue.toString())
    validateVLAN(nextValue.toString())

    const syntheticEvent = {
      target: { value: nextValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>

    onChange?.(syntheticEvent)
  }, [value, step, reservedVLANs, onChange, validateVLAN])

  const decrementValue = useCallback(() => {
    const currentValue = parseInt(value, 10)
    if (isNaN(currentValue)) {
      const newValue = MAX_VLAN_ID.toString()
      setValue(newValue)
      validateVLAN(newValue)

      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>

      onChange?.(syntheticEvent)
      return
    }

    const nextValue = findNextAvailableVLAN(
      currentValue,
      step,
      reservedVLANs,
      'down'
    )
    setValue(nextValue.toString())
    validateVLAN(nextValue.toString())

    const syntheticEvent = {
      target: { value: nextValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>

    onChange?.(syntheticEvent)
  }, [value, step, reservedVLANs, onChange, validateVLAN])

  // Handle button press and hold for increment
  const handleIncrementMouseDown = useCallback(() => {
    incrementValue()

    incrementIntervalRef.current = setTimeout(() => {
      incrementIntervalRef.current = setInterval(incrementValue, repeatInterval)
    }, initialDelay)
  }, [incrementValue, initialDelay, repeatInterval])

  // Handle button press and hold for decrement
  const handleDecrementMouseDown = useCallback(() => {
    decrementValue()

    decrementIntervalRef.current = setTimeout(() => {
      decrementIntervalRef.current = setInterval(decrementValue, repeatInterval)
    }, initialDelay)
  }, [decrementValue, initialDelay, repeatInterval])

  // Stop increment/decrement when mouse is released or leaves the button
  const handleMouseUp = useCallback(() => {
    if (incrementIntervalRef.current) {
      clearTimeout(incrementIntervalRef.current)
      incrementIntervalRef.current = null
    }
    if (decrementIntervalRef.current) {
      clearTimeout(decrementIntervalRef.current)
      decrementIntervalRef.current = null
    }
  }, [])

  // Combine custom input props with the spinner buttons
  const customInputProps = {
    ...InputProps,
    endAdornment: (
      <>
        {InputProps?.endAdornment}
        <StyledButtonGroup
          orientation="vertical"
          size="small"
          aria-label="VLAN ID increment and decrement"
        >
          <Button
            onMouseDown={handleIncrementMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            aria-label="Increment VLAN ID"
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </Button>
          <Button
            onMouseDown={handleDecrementMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            aria-label="Decrement VLAN ID"
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </Button>
        </StyledButtonGroup>
      </>
    ),
  }

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      label={label}
      error={!isValid}
      helperText={errorMessage}
      placeholder={`${MIN_VLAN_ID}-${MAX_VLAN_ID}`}
      InputProps={customInputProps}
      {...rest}
    />
  )
}

export default VLANField

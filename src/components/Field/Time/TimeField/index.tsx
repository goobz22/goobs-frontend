/**
 * @fileoverview TimeField component for time input with modern themeable styling.
 * Built on TextField with time-specific functionality and formatting.
 */
'use client'
import React, { useCallback, useState, useMemo } from 'react'
import TextField from '../../Text'
import AccessTimeIcon from '../../../Icons/AccessTime'
import type { FormFieldStyles } from '../../../../theme'

// --------------------------------------------------------------------------
// TYPE DEFINITIONS
// --------------------------------------------------------------------------

export interface TimeFieldProps {
  /** The time value in HH:MM format (24-hour) */
  value: string
  /** Callback fired when the time changes */
  onChange: (time: string) => void
  /** Label for the time field */
  label?: React.ReactNode
  /** Helper text to display */
  helperText?: string
  /** Minimum time allowed (HH:MM format) */
  minTime?: string
  /** Maximum time allowed (HH:MM format) */
  maxTime?: string
  /** Whether to show time icon */
  showIcon?: boolean
  /** Step interval in minutes */
  step?: number
  /** Comprehensive styling options */
  styles?: FormFieldStyles
  /** Additional HTML input attributes */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  /** Callback fired when focused */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Callback fired when blurred */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

// --------------------------------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------------------------------

const format24HourTime = (hours: number, minutes: number): string =>
  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

const parseTimeInput = (
  timeString: string
): { hours: number; minutes: number } | null => {
  const parts = timeString.split(':')
  if (parts.length === 2) {
    const hours = parseInt(parts[0] ?? '', 10)
    const minutes = parseInt(parts[1] ?? '', 10)
    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    )
      return { hours, minutes }
  }
  return null
}

const isValidTime = (time: string): boolean => {
  return parseTimeInput(time) !== null
}

const isTimeInRange = (
  time: string,
  minTime?: string,
  maxTime?: string
): boolean => {
  if (!minTime && !maxTime) return true

  const currentTime = parseTimeInput(time)
  if (!currentTime) return false

  const currentMinutes = currentTime.hours * 60 + currentTime.minutes

  if (minTime) {
    const min = parseTimeInput(minTime)
    if (min) {
      const minMinutes = min.hours * 60 + min.minutes
      if (currentMinutes < minMinutes) return false
    }
  }

  if (maxTime) {
    const max = parseTimeInput(maxTime)
    if (max) {
      const maxMinutes = max.hours * 60 + max.minutes
      if (currentMinutes > maxMinutes) return false
    }
  }

  return true
}

// --------------------------------------------------------------------------
// TIMEFIELD COMPONENT
// --------------------------------------------------------------------------

const TimeField: React.FC<TimeFieldProps> = ({
  value,
  onChange,
  label,
  helperText,
  minTime,
  maxTime,
  showIcon = true,
  step = 30,
  styles,
  inputProps,
  onFocus,
  onBlur,
}) => {
  const [displayValue, setDisplayValue] = useState(value || '')
  const [error, setError] = useState('')

  // Format display value as user types
  const handleChange = useCallback(
    (newValue: string) => {
      // Allow intermediate typing states
      setDisplayValue(newValue)

      // Auto-format as user types
      if (newValue.length === 2 && !newValue.includes(':')) {
        const formatted = `${newValue}:`
        setDisplayValue(formatted)
        return
      }

      // Validate complete time
      if (newValue.length === 5) {
        if (isValidTime(newValue)) {
          if (!isTimeInRange(newValue, minTime, maxTime)) {
            setError(
              `Time must be between ${minTime || '00:00'} and ${maxTime || '23:59'}`
            )
          } else {
            setError('')
            onChange(newValue)
          }
        } else {
          setError('Invalid time format (HH:MM)')
        }
      } else {
        setError('')
      }
    },
    [onChange, minTime, maxTime]
  )

  // Handle blur to validate and format
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = displayValue.trim()

      if (inputValue && inputValue.length === 5) {
        const parsed = parseTimeInput(inputValue)
        if (parsed) {
          const formatted = format24HourTime(parsed.hours, parsed.minutes)
          setDisplayValue(formatted)

          if (isTimeInRange(formatted, minTime, maxTime)) {
            onChange(formatted)
            setError('')
          } else {
            setError(
              `Time must be between ${minTime || '00:00'} and ${maxTime || '23:59'}`
            )
          }
        } else {
          setError('Invalid time format')
        }
      } else if (inputValue) {
        setError('Please enter time in HH:MM format')
      }

      onBlur?.(event)
    },
    [displayValue, onChange, minTime, maxTime, onBlur]
  )

  // Generate time options for native input
  const generateStepAttribute = useMemo(() => {
    return step * 60 // Convert minutes to seconds for HTML5 time input
  }, [step])

  const startAdornment = showIcon ? (
    <AccessTimeIcon styles={{ theme: styles?.theme || 'light' }} />
  ) : undefined

  // Ensure we have proper styles object
  const fieldStyles: FormFieldStyles | undefined = error
    ? {
        ...styles,
        helperTextType: 'error' as const,
      }
    : styles

  // Filter out value and onChange from inputProps to avoid conflicts
  const filteredInputProps = inputProps
    ? Object.fromEntries(
        Object.entries(inputProps).filter(
          ([key]) => key !== 'value' && key !== 'onChange'
        )
      )
    : {}

  // Build TextField props conditionally
  const textFieldProps: any = {
    ...filteredInputProps,
    value: displayValue,
    onChange: handleChange,
    label,
    helperText: error || helperText,
    startAdornment,
    styles: fieldStyles,
    type: 'time',
    min: minTime,
    max: maxTime,
    step: generateStepAttribute,
    pattern: '[0-9]{2}:[0-9]{2}',
    placeholder: 'HH:MM',
  }

  // Only add onFocus and onBlur if they're defined
  if (onFocus) {
    textFieldProps.onFocus = onFocus
  }
  if (handleBlur) {
    textFieldProps.onBlur = handleBlur
  }

  return <TextField {...textFieldProps} />
}

TimeField.displayName = 'TimeField'

export default TimeField

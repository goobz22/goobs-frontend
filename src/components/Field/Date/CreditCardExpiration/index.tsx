'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  alpha,
  keyframes,
  Popover,
  Typography,
  Button,
  Paper,
  IconButton,
  GlobalStyles,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TextField, { TextFieldProps } from '../../Text'

// Sacred animations
const floatGlyph = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.1); }
  100% { transform: translateY(0px) scale(1); }
`

const glowPulse = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
    border-color: ${alpha('#FFD700', 0.8)};
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
    border-color: ${alpha('#FFD700', 0.5)};
  }
`

// Egyptian calendar styles for Storybook compatibility
const EgyptianCalendarStyles = () => (
  <GlobalStyles
    styles={{
      '.react-datepicker-popper': {
        zIndex: '9999 !important',
        position: 'absolute !important',
        transform: 'translate3d(0, 0, 0) !important',
      },
      '.react-datepicker-wrapper': {
        position: 'relative !important',
        zIndex: '1 !important',
      },
      '.react-datepicker': {
        backgroundColor: 'rgba(0, 0, 0, 0.9) !important',
        border: '2px solid #FFD700 !important',
        borderRadius: '12px !important',
        boxShadow:
          '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2) !important',
        fontFamily: '"Cinzel", serif !important',
        backdropFilter: 'blur(10px) !important',
        animation: 'sacredGlow 3s ease-in-out infinite !important',
        width: '350px !important',
        maxHeight: '450px !important',
        overflow: 'visible !important',
      },
      '@keyframes sacredGlow': {
        '0%': {
          boxShadow:
            '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
        },
        '50%': {
          boxShadow:
            '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
        },
        '100%': {
          boxShadow:
            '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
        },
      },
      '.react-datepicker__triangle': {
        display: 'none !important',
      },
      '.react-datepicker__header': {
        backgroundColor: 'rgba(255, 215, 0, 0.1) !important',
        borderBottom: '1px solid #FFD700 !important',
        borderRadius: '12px 12px 0 0 !important',
        position: 'relative',
        '&::before': {
          content: '"𓊹 𓇳 𓊹"',
          position: 'absolute',
          top: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 215, 0, 0.5)',
          fontSize: '12px',
          letterSpacing: '0.5em',
        },
        '&::after': {
          content: '"𓊖 𓊗 𓊖"',
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 215, 0, 0.5)',
          fontSize: '10px',
          letterSpacing: '0.3em',
        },
      },
      '.react-datepicker__current-month': {
        color: '#FFD700 !important',
        fontWeight: '600 !important',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.7) !important',
        fontFamily: '"Cinzel", serif !important',
        letterSpacing: '0.1em !important',
      },
      '.react-datepicker__navigation': {
        display: 'none !important',
      },
      '.react-datepicker__navigation--previous': {
        display: 'none !important',
      },
      '.react-datepicker__navigation--next': {
        display: 'none !important',
      },
      '.react-datepicker__day-names': {
        borderBottom: '1px solid rgba(255, 215, 0, 0.3) !important',
      },
      '.react-datepicker__day-name': {
        color: 'rgba(255, 215, 0, 0.8) !important',
        fontWeight: '500 !important',
        fontFamily: '"Cinzel", serif !important',
      },
      '.react-datepicker__day': {
        color: 'rgba(255, 255, 255, 0.9) !important',
        fontFamily: '"Crimson Text", serif !important',
        borderRadius: '4px !important',
        transition: 'all 0.3s ease !important',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.2) !important',
          color: '#FFD700 !important',
          boxShadow: '0 0 8px rgba(255, 215, 0, 0.4) !important',
        },
      },
      '.react-datepicker__day--selected': {
        backgroundColor: '#FFD700 !important',
        color: '#000000 !important',
        fontWeight: '600 !important',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.6) !important',
      },
      '.react-datepicker__day--today': {
        backgroundColor: 'rgba(255, 215, 0, 0.3) !important',
        color: '#FFD700 !important',
        fontWeight: '500 !important',
      },
      '.react-datepicker__day--outside-month': {
        color: 'rgba(255, 255, 255, 0.3) !important',
      },
      '.react-datepicker__month-container': {
        backgroundColor: 'transparent !important',
      },
      '.react-datepicker__week': {
        display: 'flex !important',
      },
      '.react-datepicker__day--disabled': {
        color: 'rgba(255, 255, 255, 0.2) !important',
        cursor: 'not-allowed !important',
        '&:hover': {
          backgroundColor: 'transparent !important',
          boxShadow: 'none !important',
        },
        // Month/Year picker specific styles
        '.react-datepicker__month-year-read-view': {
          backgroundColor: 'rgba(255, 215, 0, 0.1) !important',
          border: '1px solid #FFD700 !important',
          borderRadius: '8px !important',
          color: '#FFD700 !important',
          fontFamily: '"Cinzel", serif !important',
          fontWeight: '600 !important',
          textShadow: '0 0 8px rgba(255, 215, 0, 0.5) !important',
        },
        '.react-datepicker__month-year-read-view:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.2) !important',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.4) !important',
        },
        '.react-datepicker__month-year-dropdown': {
          backgroundColor: 'rgba(0, 0, 0, 0.95) !important',
          border: '2px solid #FFD700 !important',
          borderRadius: '8px !important',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.4) !important',
          maxHeight: '200px !important',
          overflow: 'auto !important',
        },
        '.react-datepicker__month-year-option': {
          color: 'rgba(255, 255, 255, 0.9) !important',
          fontFamily: '"Crimson Text", serif !important',
          padding: '8px 12px !important',
          transition: 'all 0.3s ease !important',
        },
        '.react-datepicker__month-year-option:hover': {
          backgroundColor: 'rgba(255, 215, 0, 0.2) !important',
          color: '#FFD700 !important',
        },
        '.react-datepicker__month-year-option--selected': {
          backgroundColor: '#FFD700 !important',
          color: '#000000 !important',
          fontWeight: '600 !important',
        },
        // Full Month Year Picker Grid Styles
        '.react-datepicker__month-wrapper': {
          display: 'grid !important',
          gridTemplateColumns: 'repeat(3, 1fr) !important',
          gridTemplateRows: 'repeat(4, 1fr) !important',
          width: '100% !important',
          maxWidth: '300px !important',
          margin: '0 auto !important',
          padding: '16px !important',
          gap: '8px !important',
        },
        '.react-datepicker__month-text': {
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          width: '100% !important',
          height: '40px !important',
          margin: '0 !important',
          padding: '8px 4px !important',
          textAlign: 'center !important',
          borderRadius: '8px !important',
          cursor: 'pointer !important',
          color: 'rgba(255, 255, 255, 0.9) !important',
          fontFamily: '"Cinzel", serif !important',
          fontWeight: '500 !important',
          fontSize: '11px !important',
          letterSpacing: '0.05em !important',
          transition: 'all 0.3s ease !important',
          border: '1px solid rgba(255, 215, 0, 0.2) !important',
          backgroundColor: 'rgba(255, 215, 0, 0.05) !important',
          boxSizing: 'border-box !important',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.2) !important',
            color: '#FFD700 !important',
            boxShadow: '0 0 12px rgba(255, 215, 0, 0.4) !important',
            transform: 'scale(1.05) !important',
          },
        },
        '.react-datepicker__month-text--selected': {
          backgroundColor: '#FFD700 !important',
          color: '#000000 !important',
          fontWeight: '700 !important',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.6) !important',
          border: '2px solid #FFD700 !important',
        },
        '.react-datepicker__month-text--today': {
          backgroundColor: 'rgba(255, 215, 0, 0.3) !important',
          color: '#FFD700 !important',
          fontWeight: '600 !important',
          border: '1px solid #FFD700 !important',
        },
        '.react-datepicker__month-text--disabled': {
          color: 'rgba(255, 255, 255, 0.3) !important',
          backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
          cursor: 'not-allowed !important',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
            color: 'rgba(255, 255, 255, 0.3) !important',
            transform: 'none !important',
            boxShadow: 'none !important',
          },
        },
        '.react-datepicker__year-wrapper': {
          display: 'flex !important',
          flexWrap: 'wrap !important',
          width: '100% !important',
          maxWidth: '320px !important',
          justifyContent: 'space-between !important',
          padding: '16px !important',
          gap: '8px !important',
        },
        '.react-datepicker__year-text': {
          display: 'inline-flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          width: 'calc(25% - 6px) !important',
          minWidth: '60px !important',
          height: '40px !important',
          margin: '0 !important',
          padding: '8px 4px !important',
          textAlign: 'center !important',
          borderRadius: '8px !important',
          cursor: 'pointer !important',
          color: 'rgba(255, 255, 255, 0.9) !important',
          fontFamily: '"Cinzel", serif !important',
          fontWeight: '500 !important',
          fontSize: '12px !important',
          letterSpacing: '0.05em !important',
          transition: 'all 0.3s ease !important',
          border: '1px solid rgba(255, 215, 0, 0.2) !important',
          backgroundColor: 'rgba(255, 215, 0, 0.05) !important',
          boxSizing: 'border-box !important',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.2) !important',
            color: '#FFD700 !important',
            boxShadow: '0 0 12px rgba(255, 215, 0, 0.4) !important',
            transform: 'scale(1.05) !important',
          },
        },
        '.react-datepicker__year-text--selected': {
          backgroundColor: '#FFD700 !important',
          color: '#000000 !important',
          fontWeight: '700 !important',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.6) !important',
          border: '2px solid #FFD700 !important',
        },
        '.react-datepicker__year-text--today': {
          backgroundColor: 'rgba(255, 215, 0, 0.3) !important',
          color: '#FFD700 !important',
          fontWeight: '600 !important',
          border: '1px solid #FFD700 !important',
        },
        '.react-datepicker__year-text--disabled': {
          color: 'rgba(255, 255, 255, 0.3) !important',
          backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
          cursor: 'not-allowed !important',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
            color: 'rgba(255, 255, 255, 0.3) !important',
            transform: 'none !important',
            boxShadow: 'none !important',
          },
        },
        // Month/Year picker navigation
        '.react-datepicker__navigation--years': {
          border: '0.45rem solid transparent !important',
          borderBottomColor: '#FFD700 !important',
          '&:hover': {
            borderBottomColor: '#FFA500 !important',
          },
        },
        '.react-datepicker__navigation--years-previous': {
          borderRightColor: '#FFD700 !important',
          borderBottomColor: 'transparent !important',
          '&:hover': {
            borderRightColor: '#FFA500 !important',
          },
        },
        '.react-datepicker__navigation--years-upcoming': {
          borderLeftColor: '#FFD700 !important',
          borderBottomColor: 'transparent !important',
          '&:hover': {
            borderLeftColor: '#FFA500 !important',
          },
        },
        // Ensure full visibility
        '.react-datepicker__tab-loop': {
          position: 'relative !important',
          zIndex: '9999 !important',
        },
        '.react-datepicker__month-container': {
          backgroundColor: 'transparent !important',
          minHeight: 'auto !important',
        },
      },
    }}
  />
)

// Month names for display
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Generate years from current year to current year + 20
const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = 0; i < 21; i++) {
    years.push(currentYear + i)
  }
  return years
}

// Check if a date is valid and in the future (for expiration dates)
const isValidFutureDate = (year: number, month: number): boolean => {
  // Check if it's in the future or current month
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1 // getMonth() returns 0-11

  // For expiration dates, we allow current month and future months
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export interface CreditCardExpirationProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  /**
   * Callback when expiration date changes and passes validation
   */
  onChange?: (
    value: string,
    isValid: boolean,
    expirationDate: Date | null
  ) => void
  /**
   * Current expiration value (MM/YY format)
   */
  value?: string
  /**
   * Custom error message for invalid expiration dates
   */
  errorMessage?: string
  /**
   * Enable sacred Egyptian theme
   */
  sacredtheme?: boolean
  /**
   * Whether this is a default/existing value that should be partially masked
   */
  isDefaultValue?: boolean
}

const CreditCardExpiration: React.FC<CreditCardExpirationProps> = ({
  onChange,
  value = '',
  errorMessage = 'Invalid expiration date',
  sacredtheme = false,
  isDefaultValue = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(value)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)
  const [step, setStep] = useState<'month' | 'year' | 'confirmation'>('month')
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [suppressFormatting, setSuppressFormatting] = useState(false)

  /**
   * Validates an expiration date string (MM/YY format)
   */
  const validateExpiration = useCallback((expiration: string): boolean => {
    // Remove any non-digit characters except slash
    const cleanValue = expiration.replace(/[^\d/]/g, '')

    // Check if empty and consider valid if empty (for optional fields)
    if (cleanValue === '') return true

    // Check format MM/YY
    const parts = cleanValue.split('/')
    if (parts.length !== 2) return false

    const month = parseInt(parts[0], 10)
    const year = parseInt(parts[1], 10)

    // Validate month (01-12)
    if (isNaN(month) || month < 1 || month > 12) return false

    // Validate year (assume 20XX for YY format)
    if (isNaN(year) || year < 0 || year > 99) return false

    // Convert 2-digit year to full year (assume 20XX)
    const fullYear = 2000 + year

    // Use the centralized future date validation
    return isValidFutureDate(fullYear, month)
  }, [])

  // Format the input: MM/YY
  const formatInput = useCallback(
    (input: string): string => {
      // Remove all non-digits
      const digits = input.replace(/\D/g, '')

      // If suppressing formatting, just return the digits without auto-adding "/"
      if (suppressFormatting) {
        return digits.slice(0, 4)
      }

      // Apply MM/YY formatting
      if (digits.length >= 2) {
        return digits.slice(0, 2) + '/' + digits.slice(2, 4)
      }
      return digits
    },
    [suppressFormatting]
  )

  // Mask expiration for security - show M*/Y*
  const maskExpiration = useCallback((expiration: string): string => {
    if (!expiration) return expiration
    const parts = expiration.split('/')
    if (parts.length === 2) {
      const maskedMonth = parts[0].charAt(0) + '*'
      const maskedYear = parts[1].charAt(0) + '*'
      return maskedMonth + '/' + maskedYear
    }
    return '*'.repeat(expiration.length)
  }, [])

  // Parse expiration string to Date object
  const parseExpirationDate = useCallback((expiration: string): Date | null => {
    const parts = expiration.split('/')
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10)
      const year = parseInt(parts[1], 10)
      if (!isNaN(month) && !isNaN(year)) {
        // Last day of the expiration month
        const fullYear = 2000 + year
        return new Date(fullYear, month, 0) // Day 0 gives last day of previous month
      }
    }
    return null
  }, [])

  // Get display value based on focus state and default value status
  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue) {
      return maskExpiration(internalValue)
    }
    return internalValue
  }, [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskExpiration])

  useEffect(() => {
    // Update internal value when prop value changes
    setInternalValue(value)
    // Validate the new value
    setIsValid(validateExpiration(value))
  }, [value, validateExpiration])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue)

      // Limit to 5 characters (MM/YY)
      const truncatedValue = formattedValue.slice(0, 5)

      setInternalValue(truncatedValue)
      setHasBeenEdited(true)

      // Reset formatting suppression after change is processed
      if (suppressFormatting) {
        setTimeout(() => setSuppressFormatting(false), 0)
      }

      const valid = validateExpiration(truncatedValue)
      setIsValid(valid)

      const expirationDate = parseExpirationDate(truncatedValue)

      if (onChange) {
        onChange(truncatedValue, valid, expirationDate)
      }
    },
    [
      onChange,
      validateExpiration,
      formatInput,
      parseExpirationDate,
      suppressFormatting,
    ]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    },
    [props]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    },
    [props]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget
      const selectionStart = input.selectionStart || 0

      let selectedPart: 'month' | 'year'
      if (selectionStart <= 2) {
        selectedPart = 'month'
      } else {
        selectedPart = 'year'
      }

      // Handle backspace at position 2 (on the "/") or position 3 (after the "/") to go back to month
      if (
        e.key === 'Backspace' &&
        (selectionStart === 2 || selectionStart === 3) &&
        internalValue.length >= 3 &&
        internalValue.includes('/')
      ) {
        e.preventDefault()

        // Suppress formatting temporarily to prevent "/" from being re-added
        setSuppressFormatting(true)

        // Remove everything after the month (keep only first 2 characters)
        const monthOnly = internalValue.slice(0, 2)
        setInternalValue(monthOnly)
        setHasBeenEdited(true)

        const valid = validateExpiration(monthOnly)
        setIsValid(valid)

        const expirationDate = parseExpirationDate(monthOnly)

        if (onChange) {
          onChange(monthOnly, valid, expirationDate)
        }

        // Move cursor to end of month and reset formatting suppression
        setTimeout(() => {
          input.setSelectionRange(2, 2)
          setSuppressFormatting(false)
        }, 0)

        return
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()

        const parts = internalValue.split('/')
        if (parts.length === 2) {
          let month = parseInt(parts[0], 10) || 1
          let year = parseInt(parts[1], 10) || 23

          const increment = e.key === 'ArrowUp' ? 1 : -1

          if (selectedPart === 'month') {
            month += increment
            if (month > 12) month = 1
            if (month < 1) month = 12
          } else {
            year += increment
            if (year > 99) year = 23
            if (year < 23) year = 99
          }

          const newValue = `${month.toString().padStart(2, '0')}/${year
            .toString()
            .padStart(2, '0')}`

          setInternalValue(newValue)
          setHasBeenEdited(true)

          const valid = validateExpiration(newValue)
          setIsValid(valid)

          const expirationDate = parseExpirationDate(newValue)

          if (onChange) {
            onChange(newValue, valid, expirationDate)
          }

          setTimeout(() => {
            if (selectedPart === 'month') {
              input.setSelectionRange(0, 2)
            } else {
              input.setSelectionRange(3, 5)
            }
          }, 0)
        }
      }
    },
    [internalValue, validateExpiration, parseExpirationDate, onChange]
  )

  const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const clickPosition = input.selectionStart || 0

    if (clickPosition <= 2) {
      input.setSelectionRange(0, 2)
    } else {
      input.setSelectionRange(3, 5)
    }
  }, [])

  const handleCalendarIconClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCalendarOpen(true)
    setStep('month')
    // Reset position when opening
    setDragPosition({ x: 0, y: 0 })
  }, [])

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      // If starting from center (0,0), convert to absolute coordinates
      let currentX = dragPosition.x
      let currentY = dragPosition.y

      if (dragPosition.x === 0 && dragPosition.y === 0) {
        // Get the actual popup element position when centered
        const popup = document.querySelector('.MuiPopover-paper') as HTMLElement
        if (popup) {
          const rect = popup.getBoundingClientRect()
          currentX = rect.left
          currentY = rect.top
        } else {
          // Fallback to calculated center
          currentX = window.innerWidth / 2 - 175 // half popup width
          currentY = window.innerHeight / 2 - 200 // half popup height
        }
      }

      setDragOffset({
        x: e.clientX - currentX,
        y: e.clientY - currentY,
      })
    },
    [dragPosition]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Keep within reasonable bounds (allow some off-screen movement)
        const maxX = window.innerWidth - 100
        const minX = -250
        const maxY = window.innerHeight - 100
        const minY = -200

        setDragPosition({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY)),
        })
      }
    },
    [isDragging, dragOffset]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add and remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none' // Prevent text selection while dragging
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Handle month selection
  const handleMonthSelect = useCallback((monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setStep('year')
  }, [])

  // Filter months based on current date for future validation
  const getAvailableMonths = (): {
    month: string
    index: number
    isDisabled: boolean
  }[] => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() // 0-11

    return MONTHS.map((month, index) => ({
      month,
      index,
      isDisabled:
        currentYear === new Date().getFullYear() && index < currentMonth,
    }))
  }

  // Handle year selection and show confirmation
  const handleYearSelect = useCallback(
    (year: number) => {
      if (selectedMonth !== null) {
        // Validate the complete date before proceeding
        if (isValidFutureDate(year, selectedMonth + 1)) {
          setSelectedYear(year)
          setStep('confirmation')

          const month = (selectedMonth + 1).toString().padStart(2, '0')
          const yearStr = (year % 100).toString().padStart(2, '0')
          const formattedValue = `${month}/${yearStr}`

          setInternalValue(formattedValue)
          setHasBeenEdited(true)

          const valid = validateExpiration(formattedValue)
          setIsValid(valid)

          const expirationDate = parseExpirationDate(formattedValue)

          if (onChange) {
            onChange(formattedValue, valid, expirationDate)
          }

          // Close picker after showing confirmation
          setTimeout(() => {
            setIsCalendarOpen(false)
            setStep('month')
            setSelectedMonth(null)
            setSelectedYear(null)
          }, 1500)
        }
      }
    },
    [selectedMonth, validateExpiration, parseExpirationDate, onChange]
  )

  // Custom picker component
  const CustomMonthYearPicker = () => (
    <Paper
      sx={{
        backgroundColor: sacredtheme ? alpha('#000000', 0.95) : '#ffffff',
        border: sacredtheme
          ? `2px solid ${alpha('#FFD700', 0.5)}`
          : '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        minWidth: '300px',
        maxWidth: '350px',
        ...(sacredtheme && {
          boxShadow:
            '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
          animation: `${glowPulse} 4s ease-in-out infinite`,
        }),
      }}
    >
      {step === 'year' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
        >
          <IconButton
            onClick={() => setStep('month')}
            onMouseDown={e => e.stopPropagation()} // Prevent drag when clicking back button
            sx={{
              color: sacredtheme ? '#FFD700' : '#666',
              mr: 1,
              '&:hover': {
                backgroundColor: sacredtheme
                  ? alpha('#FFD700', 0.1)
                  : alpha('#666', 0.1),
                ...(sacredtheme && {
                  boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
                }),
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1, pointerEvents: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                color: sacredtheme ? '#FFD700' : '#333',
                fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                fontWeight: '600',
                ...(sacredtheme && {
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
                }),
              }}
            >
              Select Year for {MONTHS[selectedMonth || 0]}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: sacredtheme ? alpha('#FFD700', 0.7) : '#666',
                fontFamily: sacredtheme ? '"Crimson Text", serif' : 'inherit',
                display: 'block',
                mt: 0.5,
              }}
            >
              Click and drag header to move • Back arrow to change month
            </Typography>
          </Box>
        </Box>
      )}

      {step === 'month' && (
        <Box
          sx={{
            mb: 3,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            padding: '8px',
            margin: '-8px -8px 16px -8px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: sacredtheme
                ? alpha('#FFD700', 0.05)
                : alpha('#000', 0.02),
            },
          }}
          onMouseDown={handleMouseDown}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: sacredtheme ? '#FFD700' : '#333',
              fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
              fontWeight: '600',
              pointerEvents: 'none',
              ...(sacredtheme && {
                textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
              }),
            }}
          >
            Select Month
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: sacredtheme ? alpha('#FFD700', 0.6) : '#999',
              fontFamily: sacredtheme ? '"Crimson Text", serif' : 'inherit',
              mt: 0.5,
              pointerEvents: 'none',
            }}
          >
            Click and drag to move popup
          </Typography>
        </Box>
      )}

      {step === 'confirmation' && (
        <Box
          sx={{
            textAlign: 'center',
            py: 3,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            '&:hover': {
              backgroundColor: sacredtheme
                ? alpha('#FFD700', 0.02)
                : alpha('#000', 0.01),
            },
          }}
          onMouseDown={handleMouseDown}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: sacredtheme ? '#FFD700' : '#333',
              fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
              fontWeight: '700',
              pointerEvents: 'none',
              ...(sacredtheme && {
                textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
              }),
            }}
          >
            ✓ Date Selected
          </Typography>
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              color: sacredtheme ? '#FFD700' : '#333',
              fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
              fontWeight: '600',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
              ...(sacredtheme && {
                textShadow: '0 0 20px rgba(255, 215, 0, 0.9)',
              }),
            }}
          >
            {MONTHS[selectedMonth || 0]} {selectedYear}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: sacredtheme ? alpha('#FFD700', 0.8) : '#666',
              fontFamily: sacredtheme ? '"Crimson Text", serif' : 'inherit',
              pointerEvents: 'none',
            }}
          >
            Expiration: {(selectedMonth! + 1).toString().padStart(2, '0')}/
            {(selectedYear! % 100).toString().padStart(2, '0')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: sacredtheme ? alpha('#FFD700', 0.5) : '#999',
              fontFamily: sacredtheme ? '"Crimson Text", serif' : 'inherit',
              mt: 1,
              pointerEvents: 'none',
            }}
          >
            Drag to reposition • Closing automatically...
          </Typography>
        </Box>
      )}

      {step !== 'confirmation' &&
        (step === 'month' ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              maxHeight: '250px',
              overflowY: 'auto',
              overflowX: 'hidden',
              ...(sacredtheme && {
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha('#000000', 0.3),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha('#FFD700', 0.6),
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: alpha('#FFD700', 0.8),
                  },
                },
              }),
            }}
          >
            {getAvailableMonths().map(({ month, index, isDisabled }) => (
              <Button
                key={month}
                variant="outlined"
                onClick={() => !isDisabled && handleMonthSelect(index)}
                disabled={isDisabled}
                sx={{
                  py: 1.5,
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  textTransform: 'none',
                  letterSpacing: '0.05em',
                  color: isDisabled
                    ? sacredtheme
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.3)'
                    : sacredtheme
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#333',
                  borderColor: isDisabled
                    ? sacredtheme
                      ? alpha('#FFD700', 0.1)
                      : '#e0e0e0'
                    : sacredtheme
                      ? alpha('#FFD700', 0.3)
                      : '#e0e0e0',
                  backgroundColor: isDisabled
                    ? sacredtheme
                      ? alpha('#000', 0.2)
                      : alpha('#000', 0.05)
                    : sacredtheme
                      ? alpha('#FFD700', 0.05)
                      : 'transparent',
                  fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  '&:hover': !isDisabled
                    ? {
                        backgroundColor: sacredtheme
                          ? alpha('#FFD700', 0.2)
                          : alpha('#000', 0.04),
                        borderColor: sacredtheme ? '#FFD700' : '#000',
                        color: sacredtheme ? '#FFD700' : '#000',
                        ...(sacredtheme && {
                          boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
                          transform: 'scale(1.05)',
                        }),
                      }
                    : {},
                }}
              >
                {month}
              </Button>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: '300px',
              overflowY: 'auto',
              overflowX: 'hidden',
              ...(sacredtheme && {
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha('#000000', 0.3),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha('#FFD700', 0.6),
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: alpha('#FFD700', 0.8),
                  },
                },
              }),
            }}
          >
            {generateYears().map(year => (
              <Button
                key={year}
                variant="outlined"
                onClick={() => handleYearSelect(year)}
                sx={{
                  py: 1.5,
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  textTransform: 'none',
                  letterSpacing: '0.05em',
                  width: '100%',
                  color: sacredtheme ? 'rgba(255, 255, 255, 0.9)' : '#333',
                  borderColor: sacredtheme ? alpha('#FFD700', 0.3) : '#e0e0e0',
                  backgroundColor: sacredtheme
                    ? alpha('#FFD700', 0.05)
                    : 'transparent',
                  fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                  '&:hover': {
                    backgroundColor: sacredtheme
                      ? alpha('#FFD700', 0.2)
                      : alpha('#000', 0.04),
                    borderColor: sacredtheme ? '#FFD700' : '#000',
                    color: sacredtheme ? '#FFD700' : '#000',
                    ...(sacredtheme && {
                      boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
                      transform: 'scale(1.02)',
                    }),
                  },
                }}
              >
                {year}
              </Button>
            ))}
          </Box>
        ))}
    </Paper>
  )

  const ExpirationAdornment = () => (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            left: '-20px',
            color: alpha('#FFD700', 0.4),
            fontSize: '12px',
            animation: `${floatGlyph} 3s ease-in-out infinite`,
          }}
        >
          𓂝
        </Box>
      )}
      <CalendarTodayIcon
        onClick={handleCalendarIconClick}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
          fontSize: '20px',
          color: sacredtheme ? '#FFD700' : 'inherit',
          ...(sacredtheme && {
            animation: `${floatGlyph} 2s ease-in-out infinite`,
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
          }),
        }}
      />
    </Box>
  )

  return (
    <>
      {sacredtheme && <EgyptianCalendarStyles />}
      <TextField
        {...props}
        value={getDisplayValue()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        error={!isValid && internalValue !== ''}
        helperText={
          !isValid && internalValue !== '' ? errorMessage : props.helperText
        }
        label={props.label || 'Expiration Date'}
        placeholder={props.placeholder || 'MM/YY'}
        sacredtheme={sacredtheme}
        endAdornment={<ExpirationAdornment />}
        inputProps={{
          ...props.inputProps,
          maxLength: 5,
          autoComplete: 'cc-exp',
          inputMode: 'numeric',
        }}
        slotProps={{
          input: {
            sx: {
              '& .MuiInputBase-input': {
                paddingLeft: sacredtheme ? '12px' : '14px',
                marginTop: '2px',
              },
              '&::placeholder': {
                paddingLeft: sacredtheme ? '12px' : '14px',
                marginTop: '2px',
              },
            },
          },
        }}
      />
      {/* Custom Month/Year Picker */}
      <Popover
        open={isCalendarOpen}
        anchorEl={null}
        onClose={() => {
          setIsCalendarOpen(false)
          setStep('month')
        }}
        anchorReference="none"
        sx={{
          '& .MuiPopover-paper': {
            position: 'fixed',
            top: dragPosition.y === 0 ? '50%' : `${dragPosition.y}px`,
            left: dragPosition.x === 0 ? '50%' : `${dragPosition.x}px`,
            transform:
              dragPosition.x === 0 && dragPosition.y === 0
                ? 'translate(-50%, -50%)'
                : 'none',
            cursor: isDragging ? 'grabbing' : 'default',
          },
        }}
      >
        <CustomMonthYearPicker />
      </Popover>
    </>
  )
}

CreditCardExpiration.displayName = 'CreditCardExpiration'

export default CreditCardExpiration

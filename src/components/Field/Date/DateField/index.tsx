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
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TextField, { TextFieldProps } from '../../Text'

// Sacred animations
const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9)); }
  100% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)); }
`

const floatGlyph = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-2px) scale(1.1); }
  100% { transform: translateY(0px) scale(1); }
`

const sacredGlow = keyframes`
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

// Month names for display
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const SHORT_MONTHS = [
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

// Generate years from current year to current year + 20 (only future)
const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = 0; i < 21; i++) {
    years.push(currentYear + i)
  }
  return years
}

// Generate days for a given month and year (only future dates)
const generateDays = (month: number, year: number): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  const days: number[] = []
  for (let i = 1; i <= daysInMonth; i++) {
    // Only include future dates
    if (
      year > currentYear ||
      (year === currentYear && month > currentMonth) ||
      (year === currentYear && month === currentMonth && i > currentDay)
    ) {
      days.push(i)
    }
  }
  return days
}

// Check if a date is valid and in the future
const isValidFutureDate = (
  year: number,
  month: number,
  day: number
): boolean => {
  // Check if the date actually exists
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false
  }

  // Check if it's in the future
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to compare dates only
  date.setHours(0, 0, 0, 0)

  return date > today
}

type PickerStep = 'year' | 'month' | 'day' | 'confirmation'

export interface DateFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null) => void
  /**
   * Current date value
   */
  value?: Date | null
  /**
   * Enable sacred Egyptian theme
   */
  sacredtheme?: boolean
  /**
   * Disable future date validation - allows past dates to be selected
   */
  disableFutureDateValidation?: boolean
}

const DateField: React.FC<DateFieldProps> = ({
  onChange,
  label = 'Select Date',
  value,
  sacredtheme = false,
  disableFutureDateValidation = false,
  ...rest
}) => {
  const formatDate = (date: Date | null) => {
    if (date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${month}/${day}/${year}`
    }
    return ''
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(formatDate(selectedDate))

  // Custom picker state
  const [pickerStep, setPickerStep] = useState<PickerStep>('year')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setInputValue(formatDate(value))
    }
  }, [value])

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        setSelectedDate(date)
        setInputValue(formatDate(date))
        if (onChange) {
          onChange(date)
        }
      }
    },
    [onChange]
  )

  // Parse date from MM/DD/YYYY string with validation
  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)

      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        // Check if the date actually exists
        const date = new Date(year, month - 1, day)
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          // If future date validation is disabled, accept any valid date
          if (disableFutureDateValidation) {
            return date
          }
          // Otherwise, validate that the date is in the future
          if (isValidFutureDate(year, month, day)) {
            return date
          }
        }
      }
    }
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const parsedDate = parseDate(newValue)
    if (parsedDate) {
      setSelectedDate(parsedDate)
      if (onChange) {
        onChange(parsedDate)
      }
    }
  }

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(true)
    setPickerStep('year')
    setDragPosition({ x: 0, y: 0 })
  }

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      let currentX = dragPosition.x
      let currentY = dragPosition.y

      if (dragPosition.x === 0 && dragPosition.y === 0) {
        const popup = document.querySelector('.MuiPopover-paper') as HTMLElement
        if (popup) {
          const rect = popup.getBoundingClientRect()
          currentX = rect.left
          currentY = rect.top
        } else {
          currentX = window.innerWidth / 2 - 175
          currentY = window.innerHeight / 2 - 200
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

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
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

  // Handle year selection
  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year)
    setPickerStep('month')
  }, [])

  // Handle month selection
  const handleMonthSelect = useCallback((monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setPickerStep('day')
  }, [])

  // Handle day selection and show confirmation
  const handleDaySelect = useCallback(
    (day: number) => {
      if (selectedYear !== null && selectedMonth !== null) {
        // Create the date and check if it exists
        const newDate = new Date(selectedYear, selectedMonth, day)
        const isValidDate =
          newDate.getFullYear() === selectedYear &&
          newDate.getMonth() === selectedMonth &&
          newDate.getDate() === day

        // Validate the complete date before proceeding
        if (
          isValidDate &&
          (disableFutureDateValidation ||
            isValidFutureDate(selectedYear, selectedMonth + 1, day))
        ) {
          setSelectedDay(day)
          setPickerStep('confirmation')

          handleDateChange(newDate)

          // Close picker after showing confirmation
          setTimeout(() => {
            setIsOpen(false)
            setPickerStep('year')
            setSelectedYear(null)
            setSelectedMonth(null)
            setSelectedDay(null)
          }, 1500)
        }
      }
    },
    [selectedYear, selectedMonth, handleDateChange, disableFutureDateValidation]
  )

  // Filter months based on selected year
  const getAvailableMonths = (
    year: number
  ): { month: string; index: number; isDisabled: boolean }[] => {
    // If future date validation is disabled, all months are available
    if (disableFutureDateValidation) {
      return MONTHS.map((month, index) => ({
        month,
        index,
        isDisabled: false,
      }))
    }

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    return MONTHS.map((month, index) => ({
      month,
      index,
      isDisabled: year === currentYear && index <= currentMonth,
    }))
  }

  // Filter days based on selected year and month
  const getAvailableDays = (year: number, month: number): number[] => {
    // If future date validation is disabled, show all days for the month
    if (disableFutureDateValidation) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const days: number[] = []
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
      }
      return days
    }

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()

    return generateDays(month + 1, year).filter(day => {
      // If it's current year and current month, only show future days
      if (year === currentYear && month === currentMonth) {
        return day > currentDay
      }
      // Otherwise, show all days (generateDays already filters for future dates)
      return true
    })
  }

  // Custom picker component
  const CustomDatePicker = () => (
    <Paper
      sx={{
        backgroundColor: sacredtheme ? alpha('#000000', 0.95) : '#ffffff',
        border: sacredtheme
          ? `2px solid ${alpha('#FFD700', 0.5)}`
          : '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        minWidth: '300px',
        maxWidth: '400px',
        ...(sacredtheme && {
          boxShadow:
            '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
          animation: `${sacredGlow} 4s ease-in-out infinite`,
        }),
      }}
    >
      {/* Header with back button and title */}
      {(pickerStep === 'month' || pickerStep === 'day') && (
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
            onClick={() => {
              if (pickerStep === 'month') setPickerStep('year')
              if (pickerStep === 'day') setPickerStep('month')
            }}
            onMouseDown={e => e.stopPropagation()}
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
              {pickerStep === 'month' && `Select Month for ${selectedYear}`}
              {pickerStep === 'day' &&
                `Select Day for ${MONTHS[selectedMonth || 0]} ${selectedYear}`}
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
              Click and drag header to move
            </Typography>
          </Box>
        </Box>
      )}

      {pickerStep === 'year' && (
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
            Select Year
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
            Click and drag to move
          </Typography>
        </Box>
      )}

      {pickerStep === 'confirmation' && (
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
            {MONTHS[selectedMonth || 0]} {selectedDay}, {selectedYear}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: sacredtheme ? alpha('#FFD700', 0.8) : '#666',
              fontFamily: sacredtheme ? '"Crimson Text", serif' : 'inherit',
              pointerEvents: 'none',
            }}
          >
            {(selectedMonth! + 1).toString().padStart(2, '0')}/
            {selectedDay!.toString().padStart(2, '0')}/{selectedYear}
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
            Closing automatically...
          </Typography>
        </Box>
      )}

      {/* Content based on step */}
      {pickerStep !== 'confirmation' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              pickerStep === 'month'
                ? 'repeat(3, 1fr)'
                : pickerStep === 'day'
                  ? 'repeat(7, 1fr)'
                  : 'repeat(2, 1fr)',
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
          {pickerStep === 'month' &&
            selectedYear !== null &&
            getAvailableMonths(selectedYear).map(
              ({ month, index, isDisabled }) => (
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
                  {SHORT_MONTHS[index]}
                </Button>
              )
            )}

          {pickerStep === 'day' &&
            selectedYear !== null &&
            selectedMonth !== null &&
            getAvailableDays(selectedYear, selectedMonth).map(day => (
              <Button
                key={day}
                variant="outlined"
                onClick={() => handleDaySelect(day)}
                sx={{
                  py: 1,
                  minWidth: '40px',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '8px',
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
                      boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
                      transform: 'scale(1.05)',
                    }),
                  },
                }}
              >
                {day}
              </Button>
            ))}

          {pickerStep === 'year' &&
            (disableFutureDateValidation
              ? // Generate years from current year - 100 to current year + 20 when past dates allowed
                (() => {
                  const currentYear = new Date().getFullYear()
                  const years: number[] = []
                  for (let i = -100; i < 21; i++) {
                    years.push(currentYear + i)
                  }
                  return years
                })()
              : generateYears()
            ).map(year => (
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
      )}
    </Paper>
  )

  const calendarIcon = (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {sacredtheme && (
        <Box
          sx={{
            position: 'absolute',
            left: '-20px',
            color: alpha('#FFD700', 0.4),
            fontSize: '12px',
            animation: `${floatGlyph} 2s ease-in-out infinite`,
          }}
        >
          𓇳
        </Box>
      )}
      <CalendarTodayIcon
        onClick={handleIconClick}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
          fontSize: '20px',
          color: sacredtheme ? '#FFD700' : 'black',
          ...(sacredtheme && {
            animation: `${glowPulse} 2s ease-in-out infinite`,
          }),
        }}
      />
    </Box>
  )

  return (
    <>
      <TextField
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        endAdornment={calendarIcon}
        slotProps={{
          input: {
            readOnly: false,
            style: { cursor: 'text', height: '40px' },
          },
        }}
        sacredtheme={sacredtheme}
        placeholder={sacredtheme ? 'Sacred date...' : 'MM/DD/YYYY'}
        {...rest}
      />

      {/* Custom Date Picker */}
      <Popover
        open={isOpen}
        anchorEl={null}
        onClose={() => {
          setIsOpen(false)
          setPickerStep('year')
          setSelectedYear(null)
          setSelectedMonth(null)
          setSelectedDay(null)
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
        <CustomDatePicker />
      </Popover>
    </>
  )
}

export default DateField

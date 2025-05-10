'use client'
import React, { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TextField, { TextFieldProps } from '../../Field/Text'
import { Box } from '@mui/material'

/**
 * DateRange interface for range mode
 */
export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null | DateRange) => void
  /**
   * Current date value
   */
  value?: Date | null | DateRange
  /**
   * Whether to show date range picker instead of single date
   */
  isRange?: boolean
  /**
   * Start date label (for range mode)
   */
  startLabel?: string
  /**
   * End date label (for range mode)
   */
  endLabel?: string
}

interface CustomInputProps {
  value?: string
  onClick?: () => void
  style?: React.CSSProperties
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, style }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      style={{ display: 'none', ...style }}
      readOnly
    />
  )
)

CustomInput.displayName = 'CustomInput'

const DateField: React.FC<DateFieldProps> = ({
  onChange,
  label = 'Select Date',
  value,
  isRange = false,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  ...rest
}) => {
  const formatDate = (date: Date | null) => {
    if (date) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      const year = date.getFullYear()
      return `${month.toString().padStart(2, '0')}/${day
        .toString()
        .padStart(2, '0')}/${year}`
    }
    return ''
  }

  // Initialize state based on whether in range mode or single date mode
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    isRange ? null : (value as Date | null) || new Date()
  )
  const [dateRange, setDateRange] = useState<DateRange>(
    isRange
      ? (value as DateRange) || { start: new Date(), end: new Date() }
      : { start: new Date(), end: new Date() }
  )
  const [isOpen, setIsOpen] = useState(false)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    isRange ? '' : formatDate(selectedDate)
  )
  const [startDateInputValue, setStartDateInputValue] = useState(
    formatDate(dateRange.start)
  )
  const [endDateInputValue, setEndDateInputValue] = useState(
    formatDate(dateRange.end)
  )

  // Single date mode handlers
  const handleChange = (date: Date | null) => {
    if (!isRange) {
      if (date) {
        setSelectedDate(date)
        setInputValue(formatDate(date))
        setIsOpen(false)
        if (onChange) {
          onChange(date)
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRange) return // Only for single date mode

    const input = e.target
    const newValue = e.target.value
    const selectionStart = input.selectionStart || 0

    setInputValue(newValue)

    const parts = newValue.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)

      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const newDate = new Date(year, month - 1, day)
        if (
          newDate.getMonth() === month - 1 &&
          newDate.getDate() === day &&
          newDate.getFullYear() === year
        ) {
          setSelectedDate(newDate)
          if (onChange) {
            onChange(newDate)
          }
        }
      }
    }

    setTimeout(() => {
      if (selectionStart <= 2) {
        input.setSelectionRange(selectionStart, selectionStart)
      } else if (selectionStart <= 5) {
        input.setSelectionRange(selectionStart, selectionStart)
      } else {
        input.setSelectionRange(selectionStart, selectionStart)
      }
    }, 0)
  }

  // Range mode handlers
  const handleStartDateChange = (date: Date | null) => {
    if (isRange && date) {
      const newRange = { ...dateRange, start: date }
      setDateRange(newRange)
      setStartDateInputValue(formatDate(date))
      setIsStartDateOpen(false)
      if (onChange) {
        onChange(newRange)
      }
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    if (isRange && date) {
      const newRange = { ...dateRange, end: date }
      setDateRange(newRange)
      setEndDateInputValue(formatDate(date))
      setIsEndDateOpen(false)
      if (onChange) {
        onChange(newRange)
      }
    }
  }

  const handleStartDateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isRange) return

    const input = e.target
    const newValue = e.target.value
    const selectionStart = input.selectionStart || 0

    setStartDateInputValue(newValue)

    const parts = newValue.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)

      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const newDate = new Date(year, month - 1, day)
        if (
          newDate.getMonth() === month - 1 &&
          newDate.getDate() === day &&
          newDate.getFullYear() === year
        ) {
          const newRange = { ...dateRange, start: newDate }
          setDateRange(newRange)
          if (onChange) {
            onChange(newRange)
          }
        }
      }
    }

    setTimeout(() => {
      if (selectionStart <= 2) {
        input.setSelectionRange(selectionStart, selectionStart)
      } else if (selectionStart <= 5) {
        input.setSelectionRange(selectionStart, selectionStart)
      } else {
        input.setSelectionRange(selectionStart, selectionStart)
      }
    }, 0)
  }

  const handleEndDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRange) return

    const input = e.target
    const newValue = e.target.value
    const selectionStart = input.selectionStart || 0

    setEndDateInputValue(newValue)

    const parts = newValue.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)

      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const newDate = new Date(year, month - 1, day)
        if (
          newDate.getMonth() === month - 1 &&
          newDate.getDate() === day &&
          newDate.getFullYear() === year
        ) {
          const newRange = { ...dateRange, end: newDate }
          setDateRange(newRange)
          if (onChange) {
            onChange(newRange)
          }
        }
      }
    }

    setTimeout(() => {
      if (selectionStart <= 2) {
        input.setSelectionRange(selectionStart, selectionStart)
      } else if (selectionStart <= 5) {
        input.setSelectionRange(selectionStart, selectionStart)
      } else {
        input.setSelectionRange(selectionStart, selectionStart)
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const selectionStart = input.selectionStart || 0

    let selectedPart: 'month' | 'day' | 'year'
    if (selectionStart <= 2) {
      selectedPart = 'month'
    } else if (selectionStart <= 5) {
      selectedPart = 'day'
    } else {
      selectedPart = 'year'
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()

      if (!isRange) {
        // Single date mode
        const newDate = new Date(selectedDate || new Date())
        const increment = e.key === 'ArrowUp' ? 1 : -1

        switch (selectedPart) {
          case 'month':
            newDate.setMonth(newDate.getMonth() + increment)
            break
          case 'day':
            newDate.setDate(newDate.getDate() + increment)
            break
          case 'year':
            newDate.setFullYear(newDate.getFullYear() + increment)
            break
        }

        setSelectedDate(newDate)
        setInputValue(formatDate(newDate))
        if (onChange) {
          onChange(newDate)
        }
      }

      setTimeout(() => {
        switch (selectedPart) {
          case 'month':
            input.setSelectionRange(0, 2)
            break
          case 'day':
            input.setSelectionRange(3, 5)
            break
          case 'year':
            input.setSelectionRange(6, 10)
            break
        }
      }, 0)
    }
  }

  const handleStartDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRange) return

    const input = e.currentTarget
    const selectionStart = input.selectionStart || 0

    let selectedPart: 'month' | 'day' | 'year'
    if (selectionStart <= 2) {
      selectedPart = 'month'
    } else if (selectionStart <= 5) {
      selectedPart = 'day'
    } else {
      selectedPart = 'year'
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const newDate = new Date(dateRange.start || new Date())
      const increment = e.key === 'ArrowUp' ? 1 : -1

      switch (selectedPart) {
        case 'month':
          newDate.setMonth(newDate.getMonth() + increment)
          break
        case 'day':
          newDate.setDate(newDate.getDate() + increment)
          break
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + increment)
          break
      }

      const newRange = { ...dateRange, start: newDate }
      setDateRange(newRange)
      setStartDateInputValue(formatDate(newDate))
      if (onChange) {
        onChange(newRange)
      }

      setTimeout(() => {
        switch (selectedPart) {
          case 'month':
            input.setSelectionRange(0, 2)
            break
          case 'day':
            input.setSelectionRange(3, 5)
            break
          case 'year':
            input.setSelectionRange(6, 10)
            break
        }
      }, 0)
    }
  }

  const handleEndDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRange) return

    const input = e.currentTarget
    const selectionStart = input.selectionStart || 0

    let selectedPart: 'month' | 'day' | 'year'
    if (selectionStart <= 2) {
      selectedPart = 'month'
    } else if (selectionStart <= 5) {
      selectedPart = 'day'
    } else {
      selectedPart = 'year'
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const newDate = new Date(dateRange.end || new Date())
      const increment = e.key === 'ArrowUp' ? 1 : -1

      switch (selectedPart) {
        case 'month':
          newDate.setMonth(newDate.getMonth() + increment)
          break
        case 'day':
          newDate.setDate(newDate.getDate() + increment)
          break
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + increment)
          break
      }

      const newRange = { ...dateRange, end: newDate }
      setDateRange(newRange)
      setEndDateInputValue(formatDate(newDate))
      if (onChange) {
        onChange(newRange)
      }

      setTimeout(() => {
        switch (selectedPart) {
          case 'month':
            input.setSelectionRange(0, 2)
            break
          case 'day':
            input.setSelectionRange(3, 5)
            break
          case 'year':
            input.setSelectionRange(6, 10)
            break
        }
      }, 0)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const clickPosition = input.selectionStart || 0

    if (clickPosition <= 2) {
      input.setSelectionRange(0, 2)
    } else if (clickPosition <= 5) {
      input.setSelectionRange(3, 5)
    } else {
      input.setSelectionRange(6, 10)
    }
  }

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isRange) {
      setIsOpen(true)
    }
  }

  const handleStartIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isRange) {
      setIsStartDateOpen(true)
    }
  }

  const handleEndIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isRange) {
      setIsEndDateOpen(true)
    }
  }

  const calendarIcon = (
    <CalendarTodayIcon
      onClick={handleIconClick}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
        fontSize: '20px',
        color: 'black',
      }}
    />
  )

  const startCalendarIcon = (
    <CalendarTodayIcon
      onClick={handleStartIconClick}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
        fontSize: '20px',
        color: 'black',
      }}
    />
  )

  const endCalendarIcon = (
    <CalendarTodayIcon
      onClick={handleEndIconClick}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
        fontSize: '20px',
        color: 'black',
      }}
    />
  )

  if (isRange) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label={startLabel}
            value={startDateInputValue}
            onChange={handleStartDateInputChange}
            endAdornment={startCalendarIcon}
            slotProps={{
              input: {
                readOnly: false,
                style: { cursor: 'text', height: '40px' },
                onKeyDown: handleStartDateKeyDown,
                onClick: handleClick,
              },
            }}
            {...rest}
          />
          <DatePicker
            selected={dateRange.start ?? undefined}
            onChange={handleStartDateChange}
            dateFormat="MM/dd/yyyy"
            customInput={<CustomInput />}
            open={isStartDateOpen}
            onClickOutside={() => setIsStartDateOpen(false)}
            shouldCloseOnSelect
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            label={endLabel}
            value={endDateInputValue}
            onChange={handleEndDateInputChange}
            endAdornment={endCalendarIcon}
            slotProps={{
              input: {
                readOnly: false,
                style: { cursor: 'text', height: '40px' },
                onKeyDown: handleEndDateKeyDown,
                onClick: handleClick,
              },
            }}
            {...rest}
          />
          <DatePicker
            selected={dateRange.end ?? undefined}
            onChange={handleEndDateChange}
            dateFormat="MM/dd/yyyy"
            customInput={<CustomInput />}
            open={isEndDateOpen}
            onClickOutside={() => setIsEndDateOpen(false)}
            shouldCloseOnSelect
            minDate={dateRange.start ?? undefined}
          />
        </Box>
      </Box>
    )
  }

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
            onKeyDown: handleKeyDown,
            onClick: handleClick,
          },
        }}
        {...rest}
      />
      <DatePicker
        selected={selectedDate ?? undefined}
        onChange={handleChange}
        dateFormat="MM/dd/yyyy"
        customInput={<CustomInput />}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        shouldCloseOnSelect
      />
    </>
  )
}

export default DateField

'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import Calendar from '../../../Icons/Calendar'
import ArrowBack from '../../../Icons/ArrowBack'
import TextField, { TextFieldProps } from '../../Text'

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

const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 21 }, (_, i) => currentYear + i)
}

const generateDays = (month: number, year: number): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  const days: number[] = []
  for (let i = 1; i <= daysInMonth; i++) {
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

const isValidFutureDate = (
  year: number,
  month: number,
  day: number
): boolean => {
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date > today
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangeProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  onChange?: (dateRange: DateRange) => void
  value?: DateRange
  startLabel?: string
  endLabel?: string
  sacredtheme?: boolean
  helperText?: string
  error?: boolean
  style?: React.CSSProperties
}

type PickerStep = 'year' | 'month' | 'day' | 'confirmation'
type DateSelection = 'start' | 'end'

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,
  datePicker: {
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
    borderRadius: '0.5rem',
    padding: '1.25rem',
    minWidth: '300px',
    maxWidth: '400px',
    border: sacredtheme ? '2px solid rgba(255, 215, 0, 0.5)' : 'none',
    boxShadow: sacredtheme
      ? '0 0 1.5rem rgba(255,215,0,0.2)'
      : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    animation: sacredtheme
      ? 'datagrid-glow-pulse 2s infinite alternate'
      : 'none',
  } as React.CSSProperties,
  pickerHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    cursor: 'grab',
  } as React.CSSProperties,
  backButton: {
    padding: '0.25rem',
    borderRadius: '9999px',
    color: sacredtheme ? '#FFD700' : 'black',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    },
  } as React.CSSProperties,
  pickerTitle: {
    marginLeft: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: sacredtheme ? '#FFD700' : 'black',
    fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
  } as React.CSSProperties,
  grid: { display: 'grid', gap: '0.5rem' } as React.CSSProperties,
  grid3Col: { gridTemplateColumns: 'repeat(3, 1fr)' } as React.CSSProperties,
  grid7Col: { gridTemplateColumns: 'repeat(7, 1fr)' } as React.CSSProperties,
  pickerButton: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    textAlign: 'center',
    transition: 'background-color 0.2s',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.2)' : '#F3F4F6',
    },
    '&:disabled': {
      color: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#D1D5DB',
      '&:hover': { backgroundColor: 'transparent' },
    },
  } as React.CSSProperties,
  confirmationText: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '1.125rem',
    color: sacredtheme ? '#FFD700' : 'black',
  } as React.CSSProperties,
  calendarIcon: {
    height: '1.25rem',
    width: '1.25rem',
    color: sacredtheme ? '#FFD700' : '#6B7280',
    animation: sacredtheme
      ? 'sacred-icon-glow 1.5s infinite alternate'
      : 'none',
  } as React.CSSProperties,
})

const DateRangeComponent: React.FC<DateRangeProps> = ({
  onChange,
  value,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  sacredtheme = false,
  ...rest
}) => {
  const formatDate = (date: Date | null) =>
    date
      ? `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
      : ''

  const [dateRange, setDateRange] = useState<DateRange>(
    value || { start: null, end: null }
  )
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [startDateInputValue, setStartDateInputValue] = useState(
    formatDate(dateRange.start)
  )
  const [endDateInputValue, setEndDateInputValue] = useState(
    formatDate(dateRange.end)
  )
  const [pickerStep, setPickerStep] = useState<PickerStep>('year')
  const [activeSelection, setActiveSelection] = useState<DateSelection>('start')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const styles = getStyles(sacredtheme)

  useEffect(() => {
    if (value) {
      setDateRange(value)
      setStartDateInputValue(formatDate(value.start))
      setEndDateInputValue(formatDate(value.end))
    }
  }, [value])

  const handleDateChange = useCallback(
    (newRange: DateRange) => {
      setDateRange(newRange)
      if (onChange) onChange(newRange)
    },
    [onChange]
  )

  const handleStartDateChange = useCallback(
    (date: Date | null) => {
      if (date) handleDateChange({ ...dateRange, start: date })
    },
    [dateRange, handleDateChange]
  )

  const handleEndDateChange = useCallback(
    (date: Date | null) => {
      if (date) handleDateChange({ ...dateRange, end: date })
    },
    [dateRange, handleDateChange]
  )

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      if (
        !isNaN(month) &&
        !isNaN(day) &&
        !isNaN(year) &&
        isValidFutureDate(year, month, day)
      ) {
        return new Date(year, month - 1, day)
      }
    }
    return null
  }

  const handleStartDateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value
    setStartDateInputValue(newValue)
    const parsedDate = parseDate(newValue)
    if (parsedDate) handleStartDateChange(parsedDate)
  }

  const handleEndDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEndDateInputValue(newValue)
    const parsedDate = parseDate(newValue)
    if (parsedDate && (!dateRange.start || parsedDate > dateRange.start))
      handleEndDateChange(parsedDate)
  }

  const handleStartIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSelection('start')
    setIsStartDateOpen(true)
    setPickerStep('year')
  }
  const handleEndIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSelection('end')
    setIsEndDateOpen(true)
    setPickerStep('year')
  }
  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year)
    setPickerStep('month')
  }, [])
  const handleMonthSelect = useCallback((monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setPickerStep('day')
  }, [])
  const handleDaySelect = useCallback(
    (day: number) => {
      if (
        selectedYear !== null &&
        selectedMonth !== null &&
        isValidFutureDate(selectedYear, selectedMonth + 1, day)
      ) {
        setPickerStep('confirmation')
        const newDate = new Date(selectedYear, selectedMonth, day)
        if (activeSelection === 'start') handleStartDateChange(newDate)
        else if (!dateRange.start || newDate > dateRange.start)
          handleEndDateChange(newDate)
        setTimeout(() => {
          setIsStartDateOpen(false)
          setIsEndDateOpen(false)
          setPickerStep('year')
          setSelectedYear(null)
          setSelectedMonth(null)
        }, 1500)
      }
    },
    [
      selectedYear,
      selectedMonth,
      activeSelection,
      handleStartDateChange,
      handleEndDateChange,
      dateRange.start,
    ]
  )

  const getAvailableMonths = (year: number) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    return MONTHS.map((month, index) => ({
      month,
      index,
      isDisabled: year === currentYear && index <= currentMonth,
    }))
  }

  const getAvailableDays = (year: number, month: number) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()
    return generateDays(month + 1, year).filter(
      day =>
        !(year === currentYear && month === currentMonth && day <= currentDay)
    )
  }

  const CustomDatePicker = () => (
    <div ref={popoverRef} style={styles.datePicker}>
      {(pickerStep === 'month' || pickerStep === 'day') && (
        <div style={styles.pickerHeader}>
          <button
            onClick={() => {
              if (pickerStep === 'month') setPickerStep('year')
              if (pickerStep === 'day') setPickerStep('month')
            }}
            style={styles.backButton}
          >
            <ArrowBack />
          </button>
          <h3 style={styles.pickerTitle}>
            {pickerStep === 'month' ? 'Select Month' : 'Select Day'}
          </h3>
        </div>
      )}
      {pickerStep === 'year' && (
        <div style={{ ...styles.grid, ...styles.grid3Col }}>
          {generateYears().map(year => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              style={styles.pickerButton}
            >
              {year}
            </button>
          ))}
        </div>
      )}
      {pickerStep === 'month' && selectedYear && (
        <div style={{ ...styles.grid, ...styles.grid3Col }}>
          {getAvailableMonths(selectedYear).map(
            ({ month, index, isDisabled }) => (
              <button
                key={month}
                onClick={() => !isDisabled && handleMonthSelect(index)}
                disabled={isDisabled}
                style={styles.pickerButton}
              >
                {month}
              </button>
            )
          )}
        </div>
      )}
      {pickerStep === 'day' && selectedYear && selectedMonth !== null && (
        <div style={{ ...styles.grid, ...styles.grid7Col }}>
          {getAvailableDays(selectedYear, selectedMonth).map(day => (
            <button
              key={day}
              onClick={() => handleDaySelect(day)}
              style={styles.pickerButton}
            >
              {day}
            </button>
          ))}
        </div>
      )}
      {pickerStep === 'confirmation' && (
        <div style={styles.confirmationText}>Date Selected!</div>
      )}
    </div>
  )

  return (
    <div style={styles.container}>
      <TextField
        {...rest}
        label={startLabel}
        value={startDateInputValue}
        onChange={handleStartDateInputChange}
        endAdornment={
          <button onClick={handleStartIconClick} style={{ padding: '0.25rem' }}>
            <Calendar style={styles.calendarIcon} sacredtheme={sacredtheme} />
          </button>
        }
        sacredtheme={sacredtheme}
      />
      {isStartDateOpen && <CustomDatePicker />}
      <TextField
        {...rest}
        label={endLabel}
        value={endDateInputValue}
        onChange={handleEndDateInputChange}
        endAdornment={
          <button onClick={handleEndIconClick} style={{ padding: '0.25rem' }}>
            <Calendar style={styles.calendarIcon} sacredtheme={sacredtheme} />
          </button>
        }
        sacredtheme={sacredtheme}
      />
      {isEndDateOpen && <CustomDatePicker />}
    </div>
  )
}

export default DateRangeComponent

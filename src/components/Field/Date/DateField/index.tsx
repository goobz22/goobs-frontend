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
  const years: number[] = []
  for (let i = 0; i < 21; i++) {
    years.push(currentYear + i)
  }
  return years
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

type PickerStep = 'year' | 'month' | 'day' | 'confirmation'

export interface DateFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  onChange?: (date: Date | null) => void
  value?: Date | null
  sacredtheme?: boolean
  disableFutureDateValidation?: boolean
  helperText?: string
  error?: boolean
  style?: React.CSSProperties
}

const getStyles = (sacredtheme?: boolean, isDragging?: boolean) => ({
  datePicker: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    zIndex: 50,
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
    borderRadius: '0.5rem',
    padding: '1.25rem',
    minWidth: '300px',
    maxWidth: '400px',
    boxShadow: sacredtheme
      ? '0 0 1.5rem rgba(255, 215, 0, 0.2)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: sacredtheme
      ? '2px solid rgba(255, 215, 0, 0.5)'
      : '1px solid #E5E7EB',
    animation: sacredtheme
      ? 'date-field-sacred-glow 2s infinite alternate'
      : 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    cursor: isDragging ? 'grabbing' : 'grab',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.05)' : '#F9FAFB',
    },
  },
  backButton: {
    marginRight: '0.75rem',
    padding: '0.5rem',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    color: sacredtheme ? '#FFD700' : '#4B5563',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    },
  },
  headerTextContainer: {
    flex: 1,
    pointerEvents: 'none' as const,
  },
  headerTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: sacredtheme ? '#FFD700' : '#1F2937',
    fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
  },
  headerSubtitle: {
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
    fontFamily: sacredtheme ? 'Arapey, serif' : 'Inter, sans-serif',
  },
  grid: {
    display: 'grid',
    gap: '0.5rem',
  },
  grid3Col: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  grid7Col: {
    gridTemplateColumns: 'repeat(7, 1fr)',
  },
  pickerButton: {
    padding: '0.5rem',
    borderRadius: '9999px',
    textAlign: 'center' as const,
    transition: 'background-color 0.2s',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.2)' : '#E5E7EB',
    },
    '&:disabled': {
      color: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#D1D5DB',
      '&:hover': { backgroundColor: 'transparent' },
    },
  },
  confirmation: {
    textAlign: 'center' as const,
    padding: '1rem',
  },
  confirmationText: {
    fontSize: '1.125rem',
    color: sacredtheme ? '#FFD700' : 'black',
  },
  calendarIcon: {
    height: '1.25rem',
    width: '1.25rem',
    color: sacredtheme ? '#FFD700' : '#6B7280',
    animation: sacredtheme
      ? 'sacred-icon-glow 1.5s infinite alternate'
      : 'none',
  },
})

const useDatePicker = () => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const openPicker = () => setIsOpen(true)
  const closePicker = () => setIsOpen(false)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closePicker()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [containerRef])
  return { isOpen, openPicker, closePicker, containerRef }
}

const DateField: React.FC<DateFieldProps> = ({
  onChange,
  label = 'Select Date',
  value,
  sacredtheme = false,
  disableFutureDateValidation = false,
  ...rest
}) => {
  const { isOpen, openPicker, closePicker, containerRef } = useDatePicker()
  const formatDate = (date: Date | null) =>
    date
      ? `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
      : ''
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [inputValue, setInputValue] = useState(formatDate(selectedDate))
  const [pickerStep, setPickerStep] = useState<PickerStep>('year')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const styles = getStyles(sacredtheme, isDragging)

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
        if (onChange) onChange(date)
      }
    },
    [onChange]
  )

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10)
      const day = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const date = new Date(year, month - 1, day)
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          if (
            disableFutureDateValidation ||
            isValidFutureDate(year, month, day)
          )
            return date
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
      if (onChange) onChange(parsedDate)
    }
  }

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openPicker()
    setPickerStep('year')
    setDragPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      let currentX = dragPosition.x
      let currentY = dragPosition.y
      if (dragPosition.x === 0 && dragPosition.y === 0) {
        currentX = window.innerWidth / 2 - 175
        currentY = window.innerHeight / 2 - 200
      }
      setDragOffset({ x: e.clientX - currentX, y: e.clientY - currentY })
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

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

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
      if (selectedYear !== null && selectedMonth !== null) {
        const newDate = new Date(selectedYear, selectedMonth, day)
        if (
          newDate.getFullYear() === selectedYear &&
          newDate.getMonth() === selectedMonth &&
          newDate.getDate() === day &&
          (disableFutureDateValidation ||
            isValidFutureDate(selectedYear, selectedMonth + 1, day))
        ) {
          setPickerStep('confirmation')
          handleDateChange(newDate)
          setTimeout(() => {
            closePicker()
            setPickerStep('year')
            setSelectedYear(null)
            setSelectedMonth(null)
          }, 1500)
        }
      }
    },
    [
      selectedYear,
      selectedMonth,
      handleDateChange,
      disableFutureDateValidation,
      closePicker,
    ]
  )

  const getAvailableMonths = (year: number) => {
    if (disableFutureDateValidation)
      return MONTHS.map((month, index) => ({ month, index, isDisabled: false }))
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    return MONTHS.map((month, index) => ({
      month,
      index,
      isDisabled: year === currentYear && index <= currentMonth,
    }))
  }

  const getAvailableDays = (year: number, month: number) => {
    if (disableFutureDateValidation)
      return Array.from(
        { length: new Date(year, month + 1, 0).getDate() },
        (_, i) => i + 1
      )
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()
    return generateDays(month + 1, year).filter(
      day =>
        !(year === currentYear && month === currentMonth && day <= currentDay)
    )
  }

  const CustomDatePicker = () => (
    <div
      ref={containerRef}
      style={{
        ...styles.datePicker,
        left: dragPosition.x,
        top: dragPosition.y,
      }}
    >
      {(pickerStep === 'month' || pickerStep === 'day') && (
        <div style={styles.header} onMouseDown={handleMouseDown}>
          <button
            onClick={() => {
              if (pickerStep === 'month') setPickerStep('year')
              if (pickerStep === 'day') setPickerStep('month')
            }}
            onMouseDown={e => e.stopPropagation()}
            style={styles.backButton}
          >
            <ArrowBack style={{ height: '1.25rem', width: '1.25rem' }} />
          </button>
          <div style={styles.headerTextContainer}>
            <h3 style={styles.headerTitle}>
              {pickerStep === 'month'
                ? `Select Month for ${selectedYear}`
                : `Select Day for ${MONTHS[selectedMonth || 0]} ${selectedYear}`}
            </h3>
            <p style={styles.headerSubtitle}>Click and drag header to move</p>
          </div>
        </div>
      )}
      {pickerStep === 'year' && (
        <div
          onMouseDown={handleMouseDown}
          style={{ ...styles.header, marginBottom: '1.5rem' }}
        >
          <h3 style={styles.headerTitle}>Select Year</h3>
          <p style={styles.headerSubtitle}>Click and drag header to move</p>
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
        <div style={styles.confirmation}>
          <p style={styles.confirmationText}>Date Selected!</p>
        </div>
      )}
    </div>
  )

  const DateAdornment = () => (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {sacredtheme && (
        <div
          style={{
            position: 'absolute',
            left: '-1.25rem',
            color: 'rgba(255,215,0,0.4)',
            fontSize: '0.75rem',
            animation: 'date-field-float-glyph 4s infinite alternate',
          }}
        >
          𓇳
        </div>
      )}
      <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
        <Calendar style={styles.calendarIcon} />
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <TextField
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        endAdornment={<DateAdornment />}
        sacredtheme={sacredtheme}
        {...rest}
      />
      {isOpen && <CustomDatePicker />}
    </div>
  )
}

export default DateField

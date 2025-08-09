'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import Calendar from '../../../Icons/Calendar'
import ArrowBack from '../../../Icons/ArrowBack'
import Dropdown from '../../Dropdown/Regular'
import {
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedContainerStyles,
  getSharedFooterTextStyles,
  getSharedAdornmentStyles,
  getRequiredIndicatorStyle,
  getRequiredProps,
  type FormFieldStyles,
} from '../../../../theme'

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

export interface DateFieldProps {
  onChange?: (date: Date | null) => void
  value?: Date | null
  disableFutureDateValidation?: boolean
  helperText?: string
  label?: React.ReactNode
  styles?: FormFieldStyles
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  autoComplete?: string
}

const getStyles = (sacredtheme?: boolean, isDragging?: boolean) => ({
  datePicker: {
    position: 'fixed' as const,
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
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.05)' : '#F9FAFB',
    },
  },
  backButton: {
    height: '2rem',
    width: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 0.25rem',
    padding: 0,
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    color: sacredtheme ? '#FFD700' : '#4B5563',
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.2)' : '#F3F4F6',
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
    cursor: 'pointer',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
    fontFamily: sacredtheme ? 'Arapey, serif' : 'Inter, sans-serif',
    cursor: isDragging ? 'grabbing' : 'grab',
    textAlign: 'center' as const,
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
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.2)' : '#E5E7EB',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
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
  select: {
    background: 'transparent',
    border: 'none',
    color: sacredtheme ? '#FFD700' : '#1F2937',
    fontSize: '1.25rem',
    fontWeight: 600,
    fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    paddingRight: '1.5rem',
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
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [containerRef])
  return { isOpen, openPicker, closePicker, containerRef }
}

const DateField: React.FC<DateFieldProps> = ({
  onChange,
  label = 'Select Date',
  value,
  disableFutureDateValidation = false,
  styles,
  ...rest
}) => {
  const { isOpen, openPicker, closePicker, containerRef } = useDatePicker()
  const formatDate = (date: Date | null) =>
    date
      ? `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
      : ''
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [inputValue, setInputValue] = useState(formatDate(selectedDate))
  const [viewedYear, setViewedYear] = useState(new Date().getFullYear())
  const [viewedMonth, setViewedMonth] = useState(new Date().getMonth())
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isFocused, setIsFocused] = useState(false)

  const sacredtheme = styles?.theme === 'sacred'
  const pickerStyles = getStyles(sacredtheme, isDragging)

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: getSharedContainerStyles(styles),
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: styles?.height || '40px',
      width: '100%',
      border: `${styles?.borderWidth || '1px'} solid ${borderColor}`,
      borderRadius: styles?.borderRadius || '8px',
      backgroundColor: themeConfig.background,
      color: themeConfig.text,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      transition,
    },
    input: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
      padding: styles?.padding || '8px 16px',
      paddingRight: '48px', // Space for calendar icon
      fontSize: styles?.fontSize || '16px',
      fontWeight: styles?.fontWeight,
      lineHeight: styles?.lineHeight,
      fontFamily: themeConfig.fontFamily,
      color: 'inherit',
      boxSizing: 'border-box',
    },
    label: getSharedLabelStyles(labelColor, themeConfig),
    endAdornment: getSharedAdornmentStyles(adornmentColor),
    footerText: getSharedFooterTextStyles(footerTextColor, themeConfig, styles),
  }

  const formatInput = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 8)
    if (digits.length > 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    } else if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setInputValue(formatDate(value))
      setViewedYear(value.getFullYear())
      setViewedMonth(value.getMonth())
    }
  }, [value])

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const [monthStr, dayStr, yearStr] = parts
      const month = parseInt(monthStr ?? '', 10)
      const day = parseInt(dayStr ?? '', 10)
      const year = parseInt(yearStr ?? '', 10)
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

  const handleInputChange = (value: string) => {
    const formatted = formatInput(value)
    setInputValue(formatted)
    const parsed = parseDate(formatted)
    if (parsed) {
      setSelectedDate(parsed)
      if (onChange) onChange(parsed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const pos = input.selectionStart || 0
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const inc = e.key === 'ArrowUp' ? 1 : -1
      const parts = inputValue.split('/').map(p => parseInt(p ?? '', 10))
      let month = (parts[0] ?? 1) as number
      let day = (parts[1] ?? 1) as number
      let year = (parts[2] ?? new Date().getFullYear()) as number
      if (isNaN(month)) month = 1
      if (isNaN(day)) day = 1
      if (isNaN(year)) year = new Date().getFullYear()
      const selectedPart = pos <= 2 ? 'month' : pos <= 5 ? 'day' : 'year'
      if (selectedPart === 'month') {
        month = ((month + inc - 1 + 12) % 12) + 1
      } else if (selectedPart === 'day') {
        const daysInMonth = new Date(year, month, 0).getDate()
        day = ((day + inc - 1 + daysInMonth) % daysInMonth) + 1
      } else {
        year += inc
        year = Math.max(1900, Math.min(2100, year))
      }
      const newValue = `${month.toString().padStart(2, '0')}/${day
        .toString()
        .padStart(2, '0')}/${year}`
      setInputValue(newValue)
      const parsed = parseDate(newValue)
      if (parsed) setSelectedDate(parsed)
      if (onChange) onChange(parsed)
      setTimeout(() => {
        if (selectedPart === 'month') input.setSelectionRange(0, 2)
        else if (selectedPart === 'day') input.setSelectionRange(3, 5)
        else input.setSelectionRange(6, 10)
      }, 0)
    } else if (e.key === 'Backspace' && (pos === 3 || pos === 6)) {
      e.preventDefault()
      let newValue = inputValue
      if (pos === 3) {
        newValue = newValue.slice(0, 2)
      } else if (pos === 6) {
        newValue = newValue.slice(0, 5)
      }
      setInputValue(newValue)
      const parsed = parseDate(newValue)
      if (parsed) setSelectedDate(parsed)
      if (onChange) onChange(parsed)
      setTimeout(() => input.setSelectionRange(pos - 1, pos - 1), 0)
    }
    rest.onKeyDown?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const pos = input.selectionStart || 0
    let start = 0,
      end = 2
    if (pos > 2 && pos <= 5) {
      start = 3
      end = 5
    } else if (pos > 5) {
      start = 6
      end = 10
    }
    setTimeout(() => input.setSelectionRange(start, end), 0)
    rest.onClick?.(e)
  }

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openPicker()
    const centerX = window.innerWidth / 2 - 175 // assuming 350px width
    const centerY = window.innerHeight / 2 - 200 // assuming 400px height
    setDragPosition({ x: centerX, y: centerY })
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      let currentX = dragPosition.x
      let currentY = dragPosition.y
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

  const handleDaySelect = (day: number) => {
    const date = new Date(viewedYear, viewedMonth, day)
    date.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (disableFutureDateValidation || date > today) {
      setSelectedDate(date)
      setInputValue(formatDate(date))
      if (onChange) onChange(date)
      closePicker()
    }
  }

  const handlePrev = () => {
    setViewedMonth(m => {
      if (m === 0) {
        setViewedYear(y => y - 1)
        return 11
      }
      return m - 1
    })
  }
  const handleNext = () => {
    setViewedMonth(m => {
      if (m === 11) {
        setViewedYear(y => y + 1)
        return 0
      }
      return m + 1
    })
  }

  const CustomDatePicker = () => (
    <div
      ref={containerRef}
      style={{
        ...pickerStyles.datePicker,
        position: 'absolute',
        left: dragPosition.x,
        top: dragPosition.y,
      }}
    >
      <div style={{ ...pickerStyles.header, flexDirection: 'column' }}>
        <p style={pickerStyles.headerSubtitle} onMouseDown={handleMouseDown}>
          Click and drag to move
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={e => {
              e.stopPropagation()
              handlePrev()
            }}
            onMouseDown={e => e.stopPropagation()}
            style={pickerStyles.backButton}
          >
            <ArrowBack
              style={{
                height: '1.25rem',
                width: '1.25rem',
                color: sacredtheme ? '#FFD700' : '#4B5563',
              }}
            />
          </button>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              transform: 'translateY(-5px)',
            }}
          >
            <Dropdown
              options={(disableFutureDateValidation || viewedYear > currentYear
                ? MONTHS
                : MONTHS.slice(currentMonth)
              ).map(month => ({ value: month }))}
              value={MONTHS[viewedMonth] || ''}
              onChange={e => setViewedMonth(MONTHS.indexOf(e.target.value))}
              label=""
              styles={{
                theme: sacredtheme ? 'sacred' : 'light',
                height: '2rem',
                fontSize: '1rem',
                padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                width: '120px',
              }}
            />
            <Dropdown
              options={generateYears().map(y => ({ value: y.toString() }))}
              value={viewedYear.toString()}
              onChange={e => setViewedYear(parseInt(e.target.value))}
              label=""
              styles={{
                theme: sacredtheme ? 'sacred' : 'light',
                height: '2rem',
                fontSize: '1rem',
                padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                width: '80px',
              }}
            />
          </div>
          <button
            onClick={e => {
              e.stopPropagation()
              handleNext()
            }}
            onMouseDown={e => e.stopPropagation()}
            style={pickerStyles.backButton}
          >
            <ArrowBack
              style={{
                height: '1.25rem',
                width: '1.25rem',
                color: sacredtheme ? '#FFD700' : '#4B5563',
                transform: 'rotate(180deg)',
              }}
            />
          </button>
        </div>
      </div>

      {/* day grid */}
      <>
        <div
          style={{
            ...pickerStyles.grid,
            ...pickerStyles.grid7Col,
            marginBottom: '0.5rem',
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center' as const,
                fontWeight: 'bold',
                color: sacredtheme ? '#FFD700' : '#4B5563',
              }}
            >
              {day}
            </div>
          ))}
        </div>
        <div style={{ ...pickerStyles.grid, ...pickerStyles.grid7Col }}>
          {(() => {
            const firstDay = new Date(viewedYear, viewedMonth, 1).getDay()
            const daysInMonth = new Date(
              viewedYear,
              viewedMonth + 1,
              0
            ).getDate()
            const cells = []
            for (let i = 0; i < firstDay; i++) {
              cells.push(<div key={`empty-${i}`} />)
            }
            for (let d = 1; d <= daysInMonth; d++) {
              const date = new Date(viewedYear, viewedMonth, d)
              date.setHours(0, 0, 0, 0)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const isValid = disableFutureDateValidation || date > today
              cells.push(
                <button
                  key={d}
                  onClick={() => isValid && handleDaySelect(d)}
                  disabled={!isValid}
                  style={pickerStyles.pickerButton}
                >
                  {d}
                </button>
              )
            }
            return cells
          })()}
        </div>
      </>
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
        <Calendar style={pickerStyles.calendarIcon} />
      </div>
    </div>
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      rest.onFocus?.(e)
    },
    [rest]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      rest.onBlur?.(e)
    },
    [rest]
  )

  return (
    <div
      style={{
        ...componentStyles.container,
        position: 'relative',
        width: '100%',
      }}
    >
      {label && (
        <label htmlFor={rest.id} style={componentStyles.label}>
          {label}
          {styles?.required && (
            <span style={getRequiredIndicatorStyle(styles)}>
              {styles?.requiredIndicatorText || ' *'}
            </span>
          )}
        </label>
      )}

      <div style={componentStyles.inputWrapper}>
        <input
          {...rest}
          {...getRequiredProps(styles?.required)}
          value={inputValue}
          disabled={styles?.disabled}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder={rest.placeholder ?? 'MM/DD/YYYY'}
          style={componentStyles.input}
        />

        <div
          style={{
            ...componentStyles.endAdornment,
            right: '16px',
          }}
        >
          <DateAdornment />
        </div>
      </div>

      {isOpen && <CustomDatePicker />}
    </div>
  )
}

export default DateField

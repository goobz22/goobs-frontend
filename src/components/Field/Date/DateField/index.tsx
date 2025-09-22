'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  variant?: 'full' | 'month-year' // New variant prop
  // Additional HTML input props
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  autoComplete?: string
}

const getStyles = (sacredtheme?: boolean) => ({
  datePicker: {
    position: 'fixed' as const,
    top: '100%',
    left: 0,
    zIndex: 9999,
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
    borderRadius: '0.5rem',
    padding: '1.25rem',
    minWidth: '300px',
    maxWidth: '400px',
    boxShadow: sacredtheme
      ? '0 0 1.5rem rgba(255, 215, 0, 0.2)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: sacredtheme ? '2px' : '1px',
    borderStyle: 'solid',
    borderColor: sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#E5E7EB',
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
    fontSize: '0.85rem',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
    fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
    textAlign: 'center' as const,
    fontWeight: 500,
    letterSpacing: '0.05em',
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
    transition: 'all 0.2s',
    color: sacredtheme ? '#FFD700' : 'black',
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    border: sacredtheme ? '1px solid rgba(255, 215, 0, 0.3)' : 'none',
    cursor: 'pointer',
    fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
    fontWeight: sacredtheme ? 600 : 400,
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
  const ignoreNextClick = useRef(false)

  const openPicker = () => {
    console.log('[DatePicker] Opening picker')
    setIsOpen(true)
    // Ignore the next click to prevent immediate close
    ignoreNextClick.current = true
    setTimeout(() => {
      ignoreNextClick.current = false
    }, 100)
  }

  const closePicker = () => {
    console.log('[DatePicker] Closing picker')
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ignoreNextClick.current) {
        console.log('[DatePicker] Ignoring click for opening')
        return
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        console.log('[DatePicker] Click outside detected, closing')
        closePicker()
      }
    }

    if (isOpen) {
      // Add listener only when open, with a small delay to avoid catching the opening click
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 10)

      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return { isOpen, openPicker, closePicker, containerRef }
}

const DateField: React.FC<DateFieldProps> = ({
  onChange,
  label,
  value,
  disableFutureDateValidation = false,
  helperText,
  styles,
  variant = 'full',
  ...rest
}) => {
  const { isOpen, openPicker, closePicker, containerRef } = useDatePicker()
  const inputWrapperRef = useRef<HTMLDivElement>(null)

  // Add CSS animations for sacred theme if needed
  useEffect(() => {
    if (styles?.theme === 'sacred' && typeof document !== 'undefined') {
      const styleId = 'date-field-sacred-animations'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          @keyframes date-field-sacred-glow {
            0% { box-shadow: 0 0 1.5rem rgba(255, 215, 0, 0.2); }
            50% { box-shadow: 0 0 2rem rgba(255, 215, 0, 0.4); }
            100% { box-shadow: 0 0 1.5rem rgba(255, 215, 0, 0.2); }
          }
          @keyframes sacred-icon-glow {
            0% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
            50% { filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8)); }
            100% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5)); }
          }
          @keyframes date-field-float-glyph {
            0% { transform: translateY(0px); opacity: 0.4; }
            50% { transform: translateY(-5px); opacity: 0.6; }
            100% { transform: translateY(0px); opacity: 0.4; }
          }
        `
        document.head.appendChild(style)
      }
    }
  }, [styles?.theme])
  const formatDate = useCallback(
    (date: Date | null) => {
      if (!date) return ''
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      if (variant === 'month-year') {
        return `${month}/${year}`
      }
      const day = date.getDate().toString().padStart(2, '0')
      return `${month}/${day}/${year}`
    },
    [variant]
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null)
  const [inputValue, setInputValue] = useState(formatDate(selectedDate))
  const [viewedYear, setViewedYear] = useState(new Date().getFullYear())
  const [viewedMonth, setViewedMonth] = useState(new Date().getMonth())
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isFocused, setIsFocused] = useState(false)

  const sacredtheme = styles?.theme === 'sacred'
  const pickerStyles = getStyles(sacredtheme)

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
      borderWidth: styles?.borderWidth || '1px',
      borderStyle: 'solid',
      borderColor: borderColor,
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
    const digits = input.replace(/\D/g, '')
    if (variant === 'month-year') {
      const truncated = digits.slice(0, 6) // MM + YYYY = 6 digits max
      if (truncated.length > 2) {
        return `${truncated.slice(0, 2)}/${truncated.slice(2)}`
      }
      return truncated
    } else {
      const truncated = digits.slice(0, 8) // MM + DD + YYYY = 8 digits max
      if (truncated.length > 4) {
        return `${truncated.slice(0, 2)}/${truncated.slice(2, 4)}/${truncated.slice(4)}`
      } else if (truncated.length > 2) {
        return `${truncated.slice(0, 2)}/${truncated.slice(2)}`
      }
      return truncated
    }
  }

  useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setInputValue(formatDate(value))
      setViewedYear(value.getFullYear())
      setViewedMonth(value.getMonth())
    }
  }, [value, formatDate])

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/')
    if (variant === 'month-year' && parts.length === 2) {
      const [monthStr, yearStr] = parts
      const month = parseInt(monthStr ?? '', 10)
      const year = parseInt(yearStr ?? '', 10)
      if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12) {
        // For month-year, default to first day of month
        const date = new Date(year, month - 1, 1)
        if (date.getFullYear() === year && date.getMonth() === month - 1) {
          if (disableFutureDateValidation || isValidFutureDate(year, month, 1))
            return date
        }
      }
    } else if (variant === 'full' && parts.length === 3) {
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

      if (variant === 'month-year') {
        let month = (parts[0] ?? 1) as number
        let year = (parts[1] ?? new Date().getFullYear()) as number
        if (isNaN(month)) month = 1
        if (isNaN(year)) year = new Date().getFullYear()
        const selectedPart = pos <= 2 ? 'month' : 'year'
        if (selectedPart === 'month') {
          month = ((month + inc - 1 + 12) % 12) + 1
        } else {
          year += inc
          year = Math.max(1900, Math.min(2100, year))
        }
        const newValue = `${month.toString().padStart(2, '0')}/${year}`
        setInputValue(newValue)
        const parsed = parseDate(newValue)
        if (parsed) setSelectedDate(parsed)
        if (onChange) onChange(parsed)
        setTimeout(() => {
          if (selectedPart === 'month') input.setSelectionRange(0, 2)
          else input.setSelectionRange(3, 7)
        }, 0)
      } else {
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
      }
    } else if (
      e.key === 'Backspace' &&
      (pos === 3 || (variant === 'full' && pos === 6))
    ) {
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
    if (variant === 'month-year') {
      if (pos > 2) {
        start = 3
        end = 7
      }
    } else {
      if (pos > 2 && pos <= 5) {
        start = 3
        end = 5
      } else if (pos > 5) {
        start = 6
        end = 10
      }
    }
    setTimeout(() => input.setSelectionRange(start, end), 0)
    rest.onClick?.(e)
  }

  const handleIconClick = (e: React.MouseEvent) => {
    console.log('[DatePicker] Icon clicked')
    e.stopPropagation()
    e.preventDefault()
    openPicker()

    // Position the picker relative to the input field
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect()
      console.log('[DatePicker] Input wrapper rect:', rect)
      const pickerWidth = 350
      const pickerHeight = 400

      // Calculate position to show below the input if there's space, otherwise above
      let x = rect.left
      let y = rect.bottom + 5

      // Check if picker would go off screen horizontally
      if (x + pickerWidth > window.innerWidth) {
        x = window.innerWidth - pickerWidth - 10
      }

      // Check if picker would go off screen vertically
      if (y + pickerHeight > window.innerHeight) {
        y = rect.top - pickerHeight - 5
        if (y < 0) {
          // If no space above either, center it
          y = window.innerHeight / 2 - pickerHeight / 2
        }
      }

      console.log('[DatePicker] Setting position:', { x, y })
      setDragPosition({ x, y })
    } else {
      console.log('[DatePicker] No input wrapper ref, using center position')
      // Fallback to center if ref not available
      const centerX = window.innerWidth / 2 - 175
      const centerY = window.innerHeight / 2 - 200
      setDragPosition({ x: centerX, y: centerY })
    }
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      const currentX = dragPosition.x
      const currentY = dragPosition.y
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

  const handleMonthYearSelect = () => {
    const date = new Date(viewedYear, viewedMonth, 1)
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

  const CustomDatePicker = () => {
    console.log(
      '[DatePicker] CustomDatePicker rendering at position:',
      dragPosition
    )
    return (
      <div
        ref={containerRef}
        style={{
          ...pickerStyles.datePicker,
          position: 'fixed', // Changed from absolute to fixed for portal
          left: dragPosition.x,
          top: dragPosition.y,
          // Remove debug border and use theme-appropriate background
          backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
          border: sacredtheme
            ? '2px solid rgba(255, 215, 0, 0.5)'
            : '1px solid #E5E7EB',
          boxShadow: sacredtheme
            ? '0 0 1.5rem rgba(255, 215, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ ...pickerStyles.header, flexDirection: 'column' }}>
          <div
            style={{
              ...pickerStyles.headerSubtitle,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: sacredtheme
                ? 'rgba(255, 215, 0, 0.05)'
                : 'rgba(0, 0, 0, 0.05)',
            }}
            onMouseDown={handleMouseDown}
          >
            ⋮⋮⋮ Drag to move ⋮⋮⋮
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: '0.5rem',
            }}
            onMouseDown={e => e.stopPropagation()} // Prevent drag when interacting with controls
          >
            {variant !== 'month-year' && (
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
            )}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                pointerEvents: 'auto',
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              <Dropdown
                options={(disableFutureDateValidation ||
                viewedYear > currentYear
                  ? MONTHS
                  : MONTHS.slice(currentMonth)
                ).map(month => ({ value: month }))}
                value={MONTHS[viewedMonth] || ''}
                onChange={e => {
                  e.stopPropagation()
                  setViewedMonth(MONTHS.indexOf(e.target.value))
                }}
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
                onChange={e => {
                  e.stopPropagation()
                  setViewedYear(parseInt(e.target.value))
                }}
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
            {variant !== 'month-year' && (
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
            )}
          </div>
        </div>

        {/* day grid or month-year selection */}
        {variant === 'month-year' ? (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <button
              onClick={handleMonthYearSelect}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                backgroundColor: sacredtheme
                  ? 'rgba(255, 215, 0, 0.2)'
                  : '#3B82F6',
                color: sacredtheme ? '#FFD700' : 'white',
                fontWeight: 600,
                fontSize: '1rem',
                border: sacredtheme ? '2px solid #FFD700' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
                textShadow: sacredtheme
                  ? '0 0 10px rgba(255, 215, 0, 0.5)'
                  : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = sacredtheme
                  ? 'rgba(255, 215, 0, 0.3)'
                  : '#2563EB'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = sacredtheme
                  ? 'rgba(255, 215, 0, 0.2)'
                  : '#3B82F6'
              }}
            >
              Select {MONTHS[viewedMonth]} {viewedYear}
            </button>
          </div>
        ) : (
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
                const cells: React.ReactNode[] = []
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
                      style={{
                        ...pickerStyles.pickerButton,
                        opacity: !isValid ? 0.3 : 1,
                        cursor: !isValid ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (isValid) {
                          e.currentTarget.style.backgroundColor = sacredtheme
                            ? 'rgba(255, 215, 0, 0.3)'
                            : '#E5E7EB'
                          e.currentTarget.style.transform = 'scale(1.1)'
                          if (sacredtheme) {
                            e.currentTarget.style.boxShadow =
                              '0 0 10px rgba(255, 215, 0, 0.5)'
                          }
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = sacredtheme
                          ? 'rgba(255, 215, 0, 0.1)'
                          : '#F3F4F6'
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {d}
                    </button>
                  )
                }
                return cells
              })()}
            </div>
          </>
        )}
      </div>
    )
  }

  const DateAdornment = () => {
    console.log('[DatePicker] DateAdornment rendered')
    return (
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
        <div
          onClick={e => {
            console.log('[DatePicker] Calendar icon div clicked')
            handleIconClick(e)
          }}
          style={{ cursor: 'pointer', zIndex: 100 }}
        >
          <Calendar style={pickerStyles.calendarIcon} />
        </div>
      </div>
    )
  }

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

      <div ref={inputWrapperRef} style={componentStyles.inputWrapper}>
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
          placeholder={
            rest.placeholder ??
            (variant === 'month-year' ? 'MM/YYYY' : 'MM/DD/YYYY')
          }
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

      {(() => {
        console.log(
          '[DatePicker] Render check - isOpen:',
          isOpen,
          'document exists:',
          typeof document !== 'undefined',
          'dragPosition:',
          dragPosition
        )
        if (isOpen && typeof document !== 'undefined') {
          console.log('[DatePicker] Rendering picker via portal')
          return createPortal(<CustomDatePicker />, document.body)
        }
        return null
      })()}

      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default DateField

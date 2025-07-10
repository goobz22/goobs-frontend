'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import Calendar from '../../../Icons/Calendar'
import ArrowBack from '../../../Icons/ArrowBack'
import TextField, { TextFieldProps } from '../../Text'

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

const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = 0; i < 21; i++) {
    years.push(currentYear + i)
  }
  return years
}

const isValidFutureDate = (year: number, month: number): boolean => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export interface CreditCardExpirationProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  onChange?: (
    value: string,
    isValid: boolean,
    expirationDate: Date | null
  ) => void
  value?: string
  sacredtheme?: boolean
  isDefaultValue?: boolean
}

const getStyles = (sacredtheme?: boolean, isDragging?: boolean) => ({
  datePicker: {
    position: 'absolute',
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
      ? 'cc-expiration-sacred-glow 2s infinite alternate'
      : 'none',
  } as React.CSSProperties,
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
  } as React.CSSProperties,
  backButton: {
    marginRight: '0.75rem',
    padding: '0.5rem',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    color: sacredtheme ? '#FFD700' : '#4B5563',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F3F4F6',
    },
  } as React.CSSProperties,
  headerTextContainer: {
    flex: 1,
    pointerEvents: 'none' as const,
  },
  headerTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: sacredtheme ? '#FFD700' : '#1F2937',
    fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
  } as React.CSSProperties,
  headerSubtitle: {
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
    fontFamily: sacredtheme ? 'Arapey, serif' : 'Inter, sans-serif',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gap: '0.5rem',
  } as React.CSSProperties,
  grid3Col: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  } as React.CSSProperties,
  pickerButton: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
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
  } as React.CSSProperties,
  confirmation: {
    textAlign: 'center' as const,
    padding: '1rem',
  },
  confirmationText: {
    fontSize: '1.125rem',
    color: sacredtheme ? '#FFD700' : '#4B5563',
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

const usePicker = () => {
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

const CreditCardExpiration: React.FC<CreditCardExpirationProps> = ({
  onChange,
  value = '',
  sacredtheme = false,
  isDefaultValue = false,
  ...props
}) => {
  const { isOpen, openPicker, closePicker, containerRef } = usePicker()
  const [internalValue, setInternalValue] = useState<string>(value)
  const [isValid, setIsValid] = useState<boolean>(true)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false)
  const [step, setStep] = useState<'month' | 'year' | 'confirmation'>('month')
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [suppressFormatting, setSuppressFormatting] = useState(false)
  const styles = getStyles(sacredtheme, isDragging)

  const validateExpiration = useCallback((expiration: string): boolean => {
    const cleanValue = expiration.replace(/[^\d/]/g, '')
    if (cleanValue === '') return true
    const parts = cleanValue.split('/')
    if (parts.length !== 2) return false
    const month = parseInt(parts[0], 10)
    const year = parseInt(parts[1], 10)
    if (isNaN(month) || month < 1 || month > 12) return false
    if (isNaN(year) || year < 0 || year > 99) return false
    return isValidFutureDate(2000 + year, month)
  }, [])

  const formatInput = useCallback(
    (input: string): string => {
      const digits = input.replace(/\D/g, '')
      if (suppressFormatting) return digits.slice(0, 4)
      if (digits.length >= 2)
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
      return digits
    },
    [suppressFormatting]
  )

  const maskExpiration = useCallback((expiration: string): string => {
    if (!expiration) return expiration
    const parts = expiration.split('/')
    if (parts.length === 2) return `${parts[0][0]}*/${parts[1][0]}*`
    return '*'.repeat(expiration.length)
  }, [])

  const parseExpirationDate = useCallback((expiration: string): Date | null => {
    const parts = expiration.split('/')
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10)
      const year = parseInt(parts[1], 10)
      if (!isNaN(month) && !isNaN(year)) return new Date(2000 + year, month, 0)
    }
    return null
  }, [])

  const getDisplayValue = useCallback(() => {
    if (isDefaultValue && !isFocused && !hasBeenEdited && internalValue)
      return maskExpiration(internalValue)
    return internalValue
  }, [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskExpiration])

  useEffect(() => {
    setInternalValue(value)
    setIsValid(validateExpiration(value))
  }, [value, validateExpiration])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatInput(rawValue).slice(0, 5)
      setInternalValue(formattedValue)
      setHasBeenEdited(true)
      if (suppressFormatting) setTimeout(() => setSuppressFormatting(false), 0)
      const valid = validateExpiration(formattedValue)
      setIsValid(valid)
      const expirationDate = parseExpirationDate(formattedValue)
      if (onChange) onChange(formattedValue, valid, expirationDate)
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
      let selectedPart: 'month' | 'year' =
        selectionStart <= 2 ? 'month' : 'year'
      if (
        e.key === 'Backspace' &&
        (selectionStart === 2 || selectionStart === 3) &&
        internalValue.length >= 3 &&
        internalValue.includes('/')
      ) {
        e.preventDefault()
        setSuppressFormatting(true)
        const monthOnly = internalValue.slice(0, 2)
        setInternalValue(monthOnly)
        setHasBeenEdited(true)
        const valid = validateExpiration(monthOnly)
        setIsValid(valid)
        const expirationDate = parseExpirationDate(monthOnly)
        if (onChange) onChange(monthOnly, valid, expirationDate)
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
            month = ((month + increment + 11) % 12) + 1
          } else {
            year = (year + increment + 77) % 100
          }
          const newValue = `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`
          setInternalValue(newValue)
          setHasBeenEdited(true)
          const valid = validateExpiration(newValue)
          setIsValid(valid)
          const expirationDate = parseExpirationDate(newValue)
          if (onChange) onChange(newValue, valid, expirationDate)
          setTimeout(() => {
            if (selectedPart === 'month') input.setSelectionRange(0, 2)
            else input.setSelectionRange(3, 5)
          }, 0)
        }
      }
      props.onKeyDown?.(e)
    },
    [internalValue, validateExpiration, parseExpirationDate, onChange, props]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const input = e.currentTarget
      const clickPosition = input.selectionStart || 0
      if (clickPosition <= 2) input.setSelectionRange(0, 2)
      else input.setSelectionRange(3, 5)
      props.onClick?.(e)
    },
    [props]
  )

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openPicker()
    setStep('month')
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

  const handleMonthSelect = useCallback((monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setStep('year')
  }, [])

  const getAvailableMonths = (): {
    month: string
    index: number
    isDisabled: boolean
  }[] => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    return MONTHS.map((month, index) => ({
      month,
      index,
      isDisabled: selectedYear === currentYear && index < currentMonth,
    }))
  }

  const handleYearSelect = useCallback(
    (year: number) => {
      if (selectedMonth !== null) {
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
          if (onChange) onChange(formattedValue, valid, expirationDate)
          setTimeout(() => {
            closePicker()
            setStep('month')
            setSelectedYear(null)
            setSelectedMonth(null)
          }, 1500)
        }
      }
    },
    [
      selectedMonth,
      validateExpiration,
      parseExpirationDate,
      onChange,
      closePicker,
    ]
  )

  const CustomMonthYearPicker = () => (
    <div
      ref={containerRef}
      style={{
        ...styles.datePicker,
        left: dragPosition.x,
        top: dragPosition.y,
      }}
    >
      {step === 'year' && (
        <div style={styles.header} onMouseDown={handleMouseDown}>
          <button
            onClick={() => setStep('month')}
            onMouseDown={e => e.stopPropagation()}
            style={styles.backButton}
          >
            <ArrowBack style={{ height: '1.25rem', width: '1.25rem' }} />
          </button>
          <div style={styles.headerTextContainer}>
            <h3 style={styles.headerTitle}>Select Year</h3>
            <p style={styles.headerSubtitle}>Click and drag header to move</p>
          </div>
        </div>
      )}
      {step === 'month' && (
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Select Month</h3>
        </div>
      )}
      {step === 'month' && (
        <div style={{ ...styles.grid, ...styles.grid3Col }}>
          {getAvailableMonths().map(({ month, index, isDisabled }) => (
            <button
              key={month}
              onClick={() => !isDisabled && handleMonthSelect(index)}
              disabled={isDisabled}
              style={styles.pickerButton}
            >
              {month}
            </button>
          ))}
        </div>
      )}
      {step === 'year' && (
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
      {step === 'confirmation' && (
        <div style={styles.confirmation}>
          <p style={styles.confirmationText}>Date Selected!</p>
        </div>
      )}
    </div>
  )

  const ExpirationAdornment = () => (
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
            animation: 'cc-expiration-float-glyph 4s infinite alternate',
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
        label="Expiration Date"
        value={getDisplayValue()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        endAdornment={<ExpirationAdornment />}
        error={!isValid}
        sacredtheme={sacredtheme}
        {...props}
      />
      {isOpen && <CustomMonthYearPicker />}
    </div>
  )
}

export default CreditCardExpiration

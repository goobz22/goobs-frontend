'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
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
import AccessTimeIcon from '../../../Icons/AccessTime'
import Dropdown from '../../Dropdown/Regular'

export const AMERICAN_TIMEZONES = [
  {
    value: 'America/New_York',
    label: 'Eastern Time (ET)',
    offset: -5,
    military: 'R',
  },
  {
    value: 'America/Chicago',
    label: 'Central Time (CT)',
    offset: -6,
    military: 'S',
  },
  {
    value: 'America/Denver',
    label: 'Mountain Time (MT)',
    offset: -7,
    military: 'T',
  },
  {
    value: 'America/Los_Angeles',
    label: 'Pacific Time (PT)',
    offset: -8,
    military: 'U',
  },
  {
    value: 'America/Anchorage',
    label: 'Alaska Time (AKT)',
    offset: -9,
    military: 'V',
  },
  {
    value: 'Pacific/Honolulu',
    label: 'Hawaii Time (HT)',
    offset: -10,
    military: 'W',
  },
]

const formatTimeWithTimezone = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  } catch (error) {
    console.warn('Timezone formatting failed:', error)
    return formatTimeDisplay(date.getHours(), date.getMinutes())
  }
}

const formatTimeDisplay = (hours: number, minutes: number): string =>
  `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
const formatTimeInput = (hours: number, minutes: number): string =>
  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

const parseTimeInput = (
  timeString: string
): { hours: number; minutes: number } | null => {
  const parts = timeString.split(':')
  if (parts.length === 2) {
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
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

const createTimeDate = (hours: number, minutes: number): Date => {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

export interface TimeRange {
  start: Date | null
  end: Date | null
}
export interface TimeRangeProps {
  onChange?: (timeRange: TimeRange) => void
  value?: TimeRange
  startLabel?: string
  endLabel?: string
  timezone?: string
  showTimezone?: boolean
  helperText?: string
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

type TimeSelection = 'start' | 'end'

const getStyles = (theme: string = 'light', isDragging?: boolean) => {
  const sacredtheme = theme === 'sacred'
  const darktheme = theme === 'dark'

  return {
    datePicker: {
      position: 'fixed' as const,
      top: '100%',
      left: 0,
      zIndex: 50,
      backgroundColor: sacredtheme
        ? 'rgba(0,0,0,0.95)'
        : darktheme
          ? '#1e293b'
          : 'white',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      minWidth: '300px',
      maxWidth: '400px',
      boxShadow: sacredtheme
        ? '0 0 1.5rem rgba(255, 215, 0, 0.2)'
        : darktheme
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: sacredtheme
        ? '2px solid rgba(255, 215, 0, 0.5)'
        : darktheme
          ? '1px solid #475569'
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
        backgroundColor: sacredtheme
          ? 'rgba(255, 215, 0, 0.05)'
          : darktheme
            ? '#334155'
            : '#F9FAFB',
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
      color: sacredtheme ? '#FFD700' : darktheme ? '#94a3b8' : '#4B5563',
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
      '&:hover': {
        backgroundColor: sacredtheme
          ? 'rgba(255, 215, 0, 0.2)'
          : darktheme
            ? '#334155'
            : '#F3F4F6',
      },
    },
    headerTextContainer: {
      flex: 1,
      pointerEvents: 'none' as const,
    },
    headerTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: sacredtheme ? '#FFD700' : darktheme ? '#f1f5f9' : '#1F2937',
      fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
      cursor: 'pointer',
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: sacredtheme
        ? 'rgba(255, 215, 0, 0.7)'
        : darktheme
          ? '#94a3b8'
          : '#6B7280',
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
    pickerButton: {
      padding: '0.5rem',
      borderRadius: '9999px',
      textAlign: 'center' as const,
      transition: 'background-color 0.2s',
      color: sacredtheme
        ? 'rgba(255, 215, 0, 0.8)'
        : darktheme
          ? '#f1f5f9'
          : 'black',
      backgroundColor: sacredtheme
        ? 'rgba(255, 215, 0, 0.1)'
        : darktheme
          ? '#334155'
          : '#F3F4F6',
      '&:hover': {
        backgroundColor: sacredtheme
          ? 'rgba(255, 215, 0, 0.2)'
          : darktheme
            ? '#475569'
            : '#E5E7EB',
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: sacredtheme
          ? 'rgba(255, 215, 0, 0.3)'
          : darktheme
            ? '#64748b'
            : '#D1D5DB',
        '&:hover': { backgroundColor: 'transparent' },
      },
    },
    calendarIcon: {
      height: '1.25rem',
      width: '1.25rem',
      color: sacredtheme ? '#FFD700' : darktheme ? '#94a3b8' : '#6B7280',
      animation: sacredtheme
        ? 'sacred-icon-glow 1.5s infinite alternate'
        : 'none',
    },
    select: {
      background: 'transparent',
      border: 'none',
      color: sacredtheme ? '#FFD700' : darktheme ? '#f1f5f9' : '#1F2937',
      fontSize: '1.25rem',
      fontWeight: 600,
      fontFamily: sacredtheme ? 'Cinzel, serif' : 'Inter, sans-serif',
      cursor: 'pointer',
      padding: 0,
      margin: 0,
      paddingRight: '1.5rem',
    },
  }
}

const TimeRangeComponent: React.FC<TimeRangeProps> = ({
  onChange,
  value,
  startLabel = 'Start Time',
  endLabel = 'End Time',
  timezone = 'America/New_York',
  showTimezone = false,
  helperText,
  styles,
  ...rest
}) => {
  const formatTime = useCallback(
    (date: Date | null) =>
      date
        ? showTimezone
          ? formatTimeWithTimezone(date, timezone)
          : formatTimeInput(date.getHours(), date.getMinutes())
        : '',
    [showTimezone, timezone]
  )

  const [timeRange, setTimeRange] = useState<TimeRange>(
    value || { start: null, end: null }
  )
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false)
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false)
  const [startTimeInputValue, setStartTimeInputValue] = useState(
    formatTime(timeRange.start)
  )
  const [endTimeInputValue, setEndTimeInputValue] = useState(
    formatTime(timeRange.end)
  )
  const [activeSelection, setActiveSelection] = useState<TimeSelection>('start')
  const [isFocused, setIsFocused] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [viewedHour, setViewedHour] = useState(12)
  const [viewedMinute, setViewedMinute] = useState(0)
  const [viewedAmPm, setViewedAmPm] = useState('AM')
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const sacredtheme = styles?.theme === 'sacred'
  const currentTheme = styles?.theme || 'light'
  const pickerStyles = getStyles(currentTheme, isDragging)

  const {
    themeConfig,
    borderColor,
    labelColor,
    adornmentColor,
    footerTextColor,
    transition,
  } = getSharedFormFieldStyles(styles, isFocused)

  const componentStyles: Record<string, React.CSSProperties> = {
    container: {
      ...getSharedContainerStyles(styles),
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
    },
    timeInputContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '1rem',
    },
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
      paddingRight: '48px', // Space for time icon
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

  useEffect(() => {
    if (value) {
      setTimeRange(value)
      setStartTimeInputValue(formatTime(value.start))
      setEndTimeInputValue(formatTime(value.end))
    }
  }, [value, formatTime])

  useEffect(() => {
    if (isStartTimeOpen || isEndTimeOpen) {
      const centerX = window.innerWidth / 2 - 175
      const centerY = window.innerHeight / 2 - 200
      setDragPosition({ x: centerX, y: centerY })
      const selected = isStartTimeOpen ? timeRange.start : timeRange.end
      if (selected) {
        let hours = selected.getHours()
        setViewedAmPm(hours >= 12 ? 'PM' : 'AM')
        hours = hours % 12 || 12
        setViewedHour(hours)
        setViewedMinute(selected.getMinutes())
      } else {
        setViewedHour(12)
        setViewedMinute(0)
        setViewedAmPm('AM')
      }
    }
  }, [isStartTimeOpen, isEndTimeOpen, timeRange])

  const closePicker = useCallback(() => {
    if (activeSelection === 'start') {
      setIsStartTimeOpen(false)
    } else {
      setIsEndTimeOpen(false)
    }
  }, [activeSelection])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePicker()
      }
    },
    [closePicker, popoverRef]
  )

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [handleClickOutside])

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

  const handleInputChange = (newValue: string, type: TimeSelection) => {
    const formatted = formatInput(newValue)
    if (type === 'start') setStartTimeInputValue(formatted)
    else setEndTimeInputValue(formatted)

    const parsedTime = parseTimeInput(formatted)
    if (parsedTime) {
      const newTime = createTimeDate(parsedTime.hours, parsedTime.minutes)
      if (type === 'start' || (timeRange.start && newTime > timeRange.start)) {
        const newRange = { ...timeRange, [type]: newTime }
        setTimeRange(newRange)
        onChange?.(newRange)
      }
    }
  }

  const formatInput = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}:${digits.slice(2)}`
    }
    return digits
  }

  const handleStartIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSelection('start')
    setIsStartTimeOpen(true)
  }
  const handleEndIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSelection('end')
    setIsEndTimeOpen(true)
  }

  const handleTimeSelect = () => {
    let hours = viewedHour
    if (viewedAmPm === 'PM') hours += 12
    if (hours === 24) hours = 0
    const newTime = createTimeDate(hours, viewedMinute)
    if (activeSelection === 'start') {
      const newRange = { start: newTime, end: timeRange.end }
      if (timeRange.end && newTime > timeRange.end) {
        newRange.end = null
        setEndTimeInputValue('')
      }
      setTimeRange(newRange)
      setStartTimeInputValue(formatTime(newTime))
      if (onChange) onChange(newRange)
    } else {
      if (!timeRange.start || newTime > timeRange.start) {
        setTimeRange({ ...timeRange, end: newTime })
        setEndTimeInputValue(formatTime(newTime))
        if (onChange) onChange({ ...timeRange, end: newTime })
      }
    }
    closePicker()
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isStart: boolean
  ) => {
    const inputValue = isStart ? startTimeInputValue : endTimeInputValue
    const setInputValue = isStart
      ? setStartTimeInputValue
      : setEndTimeInputValue
    const handleChange = isStart
      ? (time: Date | null) => setTimeRange({ ...timeRange, start: time })
      : (time: Date | null) => setTimeRange({ ...timeRange, end: time })
    const input = e.currentTarget
    const pos = input.selectionStart || 0
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const inc = e.key === 'ArrowUp' ? 1 : -1
      const parts = inputValue.split(':').map(p => parseInt(p, 10) || 0)
      let [hours, minutes] = parts
      const selectedPart = pos <= 2 ? 'hours' : 'minutes'
      if (selectedPart === 'hours') {
        hours = (hours + inc + 24) % 24
      } else {
        minutes = (minutes + inc + 60) % 60
      }
      const newValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      setInputValue(newValue)
      const newTime = createTimeDate(hours, minutes)
      handleChange(newTime)
      if (onChange) onChange(timeRange)
      setTimeout(() => {
        if (selectedPart === 'hours') input.setSelectionRange(0, 2)
        else input.setSelectionRange(3, 5)
      }, 0)
    } else if (e.key === 'Backspace' && pos === 3) {
      e.preventDefault()
      const newValue = inputValue.slice(0, 2)
      setInputValue(newValue)
      const parsed = parseTimeInput(newValue)
      if (parsed) {
        const newTime = createTimeDate(parsed.hours, parsed.minutes)
        handleChange(newTime)
        if (onChange) onChange(timeRange)
      }
      setTimeout(() => input.setSelectionRange(2, 2), 0)
    }
    rest.onKeyDown?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const pos = input.selectionStart || 0
    let start = 0,
      end = 2
    if (pos > 2) {
      start = 3
      end = 5
    }
    setTimeout(() => input.setSelectionRange(start, end), 0)
    rest.onClick?.(e)
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

  const createInputField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    onIconClick: (e: React.MouseEvent) => void,
    isStart: boolean
  ) => (
    <div style={{ flex: 1 }}>
      {label && (
        <label style={componentStyles.label}>
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
          value={value}
          disabled={styles?.disabled}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={e => handleKeyDown(e, isStart)}
          onClick={handleClick}
          placeholder={rest.placeholder ?? 'HH:MM'}
          style={componentStyles.input}
        />

        <div
          style={{
            ...componentStyles.endAdornment,
            right: '16px',
          }}
        >
          <TimeAdornment onClick={onIconClick} />
        </div>
      </div>
    </div>
  )

  const CustomTimePicker = () => (
    <div
      ref={popoverRef}
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
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              transform: 'translateY(-5px)',
            }}
          >
            <Dropdown
              options={Array.from({ length: 12 }, (_, i) => ({
                value: (i + 1).toString(),
              }))}
              value={viewedHour.toString()}
              onChange={e => setViewedHour(parseInt(e.target.value))}
              label=""
              styles={{
                theme: currentTheme,
                height: '2rem',
                fontSize: '1rem',
                padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                width: '80px',
              }}
            />
            <Dropdown
              options={Array.from({ length: 60 }, (_, i) => ({
                value: i.toString().padStart(2, '0'),
              }))}
              value={viewedMinute.toString().padStart(2, '0')}
              onChange={e => setViewedMinute(parseInt(e.target.value))}
              label=""
              styles={{
                theme: currentTheme,
                height: '2rem',
                fontSize: '1rem',
                padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                width: '80px',
              }}
            />
            <Dropdown
              options={[{ value: 'AM' }, { value: 'PM' }]}
              value={viewedAmPm}
              onChange={e => setViewedAmPm(e.target.value)}
              label=""
              styles={{
                theme: currentTheme,
                height: '2rem',
                fontSize: '1rem',
                padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                width: '80px',
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={handleTimeSelect}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor:
              currentTheme === 'sacred'
                ? 'rgba(255, 215, 0, 0.2)'
                : currentTheme === 'dark'
                  ? '#334155'
                  : '#F3F4F6',
            color:
              currentTheme === 'sacred'
                ? '#FFD700'
                : currentTheme === 'dark'
                  ? '#f1f5f9'
                  : '#1F2937',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  )

  const TimeAdornment = ({
    onClick,
  }: {
    onClick: (e: React.MouseEvent) => void
  }) => (
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
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <AccessTimeIcon
          style={pickerStyles.calendarIcon}
          styles={{ theme: sacredtheme ? 'sacred' : currentTheme }}
        />
      </div>
    </div>
  )

  return (
    <div style={componentStyles.container}>
      <div style={componentStyles.timeInputContainer}>
        {createInputField(
          startLabel,
          startTimeInputValue,
          (value: string) => handleInputChange(value, 'start'),
          handleStartIconClick,
          true
        )}
        {createInputField(
          endLabel,
          endTimeInputValue,
          (value: string) => handleInputChange(value, 'end'),
          handleEndIconClick,
          false
        )}
      </div>
      {(isStartTimeOpen || isEndTimeOpen) && <CustomTimePicker />}
      {helperText && <div style={componentStyles.footerText}>{helperText}</div>}
    </div>
  )
}

export default TimeRangeComponent

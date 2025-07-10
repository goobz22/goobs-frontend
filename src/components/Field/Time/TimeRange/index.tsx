'use client'
import React, { useState, useCallback, useEffect } from 'react'
import Popover from '../../../Popover'
import TextField, { TextFieldProps } from '../../Text'
import AccessTimeIcon from '../../../Icons/AccessTime'

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
export interface TimeRangeProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  onChange?: (timeRange: TimeRange) => void
  value?: TimeRange
  startLabel?: string
  endLabel?: string
  sacredtheme?: boolean
  timezone?: string
  showTimezone?: boolean
}

type TimeSelection = 'start' | 'end'

const getStyles = (sacredtheme: boolean) => ({
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
  },
  timeInputContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '1rem',
  },
  inputWrapper: { flex: 1 },
  timeIcon: {
    cursor: 'pointer',
    color: sacredtheme ? '#FFD700' : '#4A5568',
    animation: sacredtheme
      ? 'sacred-icon-glow 1.5s infinite alternate'
      : 'none',
  },
  popoverContent: {
    padding: '1.25rem',
    borderRadius: '0.75rem',
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
    border: `2px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#E5E7EB'}`,
    boxShadow: sacredtheme
      ? '0 0 30px rgba(255,215,0,0.4)'
      : '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
  pickerHeader: { textAlign: 'center' as const, padding: '1rem' },
  pickerTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: sacredtheme ? '#FFD700' : '#1F2937',
  },
  pickerSubtitle: {
    fontSize: '0.875rem',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
  },
})

const TimeRangeComponent: React.FC<TimeRangeProps> = ({
  onChange,
  value,
  startLabel = 'Start Time',
  endLabel = 'End Time',
  sacredtheme = false,
  timezone = 'America/New_York',
  showTimezone = false,
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const styles = getStyles(sacredtheme)

  useEffect(() => {
    if (value) {
      setTimeRange(value)
      setStartTimeInputValue(formatTime(value.start))
      setEndTimeInputValue(formatTime(value.end))
    }
  }, [value, formatTime])

  const handleTimeChange = (newTime: Date | null, type: TimeSelection) => {
    const newRange = { ...timeRange, [type]: newTime }
    if (
      type === 'start' ||
      (newTime && timeRange.start && newTime > timeRange.start)
    ) {
      setTimeRange(newRange)
      if (type === 'start') setStartTimeInputValue(formatTime(newTime))
      else setEndTimeInputValue(formatTime(newTime))
      onChange?.(newRange)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: TimeSelection
  ) => {
    const newValue = e.target.value
    if (type === 'start') setStartTimeInputValue(newValue)
    else setEndTimeInputValue(newValue)

    const parsedTime = parseTimeInput(newValue)
    if (parsedTime)
      handleTimeChange(
        createTimeDate(parsedTime.hours, parsedTime.minutes),
        type
      )
  }

  const handleIconClick = (e: React.MouseEvent, type: TimeSelection) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget as HTMLElement)
    if (type === 'start') setIsStartTimeOpen(true)
    else setIsEndTimeOpen(true)
  }

  const CustomTimePicker = () => (
    <div style={styles.popoverContent}>
      <div style={styles.pickerHeader}>
        <p style={styles.pickerTitle}>Select Time</p>
        <p style={styles.pickerSubtitle}>This is a simplified picker.</p>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.timeInputContainer}>
        <div style={styles.inputWrapper}>
          <TextField
            label={startLabel}
            value={startTimeInputValue}
            onChange={e => handleInputChange(e, 'start')}
            endAdornment={
              <AccessTimeIcon
                style={styles.timeIcon}
                onClick={e => handleIconClick(e, 'start')}
              />
            }
            {...rest}
            sacredtheme={sacredtheme}
          />
        </div>
        <div style={styles.inputWrapper}>
          <TextField
            label={endLabel}
            value={endTimeInputValue}
            onChange={e => handleInputChange(e, 'end')}
            endAdornment={
              <AccessTimeIcon
                style={styles.timeIcon}
                onClick={e => handleIconClick(e, 'end')}
              />
            }
            {...rest}
            sacredtheme={sacredtheme}
          />
        </div>
      </div>
      <Popover
        open={isStartTimeOpen || isEndTimeOpen}
        anchorEl={anchorEl}
        onClose={() => {
          setIsStartTimeOpen(false)
          setIsEndTimeOpen(false)
          setAnchorEl(null)
        }}
      >
        <CustomTimePicker />
      </Popover>
    </div>
  )
}

export default TimeRangeComponent

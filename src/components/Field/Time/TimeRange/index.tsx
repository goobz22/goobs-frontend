'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  alpha,
  keyframes,
  Popover,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
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

// Generate hours (0-23)
const generateHours = (): number[] => {
  const hours: number[] = []
  for (let i = 0; i < 24; i++) {
    hours.push(i)
  }
  return hours
}

// Generate minutes (0, 15, 30, 45)
const generateMinutes = (): number[] => {
  return [0, 15, 30, 45]
}

// American Timezones (including military)
export const AMERICAN_TIMEZONES = [
  // Continental US
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

  // Alaska & Hawaii
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

  // US Territories & Military
  {
    value: 'America/Puerto_Rico',
    label: 'Atlantic Time (AT)',
    offset: -4,
    military: 'Q',
  },
  {
    value: 'Pacific/Guam',
    label: 'Chamorro Time (ChST)',
    offset: 10,
    military: 'K',
  },
  {
    value: 'Pacific/Wake',
    label: 'Wake Island Time',
    offset: 12,
    military: 'M',
  },
  {
    value: 'America/Adak',
    label: 'Hawaii-Aleutian Time',
    offset: -10,
    military: 'W',
  },

  // Additional US zones
  {
    value: 'America/Phoenix',
    label: 'Mountain Standard Time',
    offset: -7,
    military: 'T',
  },
  {
    value: 'America/Indiana/Indianapolis',
    label: 'Eastern Time (Indiana)',
    offset: -5,
    military: 'R',
  },
  {
    value: 'America/Kentucky/Louisville',
    label: 'Eastern Time (Kentucky)',
    offset: -5,
    military: 'R',
  },
  {
    value: 'America/North_Dakota/Center',
    label: 'Central Time (North Dakota)',
    offset: -6,
    military: 'S',
  },
]

// Timezone conversion utilities

const formatTimeWithTimezone = (date: Date, timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    return formatter.format(date)
  } catch (error) {
    console.warn('Timezone formatting failed:', error)
    return formatTimeDisplay(date.getHours(), date.getMinutes())
  }
}

const getTimezoneInfo = (timezone: string) => {
  return (
    AMERICAN_TIMEZONES.find(tz => tz.value === timezone) ||
    AMERICAN_TIMEZONES[0]
  )
}

// Format time for display
const formatTimeDisplay = (hours: number, minutes: number): string => {
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

// Format time for input (24-hour format)
const formatTimeInput = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Parse time from HH:MM format
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
    ) {
      return { hours, minutes }
    }
  }
  return null
}

// Create Date object from hours and minutes (using today's date)
const createTimeDate = (hours: number, minutes: number): Date => {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * TimeRange interface
 */
export interface TimeRange {
  start: Date | null
  end: Date | null
}

export interface TimeRangeProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  /**
   * Callback when time range changes
   */
  onChange?: (timeRange: TimeRange) => void
  /**
   * Current time range value
   */
  value?: TimeRange
  /**
   * Start time label
   */
  startLabel?: string
  /**
   * End time label
   */
  endLabel?: string
  /**
   * Enable sacred Egyptian theme
   */
  sacredtheme?: boolean
  /**
   * Timezone for time conversion (defaults to America/New_York)
   */
  timezone?: string
  /**
   * Show timezone info in the UI
   */
  showTimezone?: boolean
}

type PickerStep = 'hour' | 'minute' | 'confirmation'
type TimeSelection = 'start' | 'end'

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
  const timezoneInfo = getTimezoneInfo(timezone)

  const formatTime = useCallback(
    (date: Date | null) => {
      if (date) {
        if (showTimezone) {
          return formatTimeWithTimezone(date, timezone)
        }
        return formatTimeInput(date.getHours(), date.getMinutes())
      }
      return ''
    },
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

  // Custom picker state
  const [pickerStep, setPickerStep] = useState<PickerStep>('hour')
  const [activeSelection, setActiveSelection] = useState<TimeSelection>('start')
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setTimeRange(value)
      setStartTimeInputValue(formatTime(value.start))
      setEndTimeInputValue(formatTime(value.end))
    }
  }, [value, formatTime])

  const handleStartTimeChange = useCallback(
    (time: Date | null) => {
      if (time) {
        const newRange = { ...timeRange, start: time }
        setTimeRange(newRange)
        setStartTimeInputValue(formatTime(time))
        if (onChange) {
          onChange(newRange)
        }
      }
    },
    [timeRange, onChange, formatTime]
  )

  const handleEndTimeChange = useCallback(
    (time: Date | null) => {
      if (time) {
        const newRange = { ...timeRange, end: time }
        setTimeRange(newRange)
        setEndTimeInputValue(formatTime(time))
        if (onChange) {
          onChange(newRange)
        }
      }
    },
    [timeRange, onChange, formatTime]
  )

  const handleStartTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value
    setStartTimeInputValue(newValue)

    const parsedTime = parseTimeInput(newValue)
    if (parsedTime) {
      const newTime = createTimeDate(parsedTime.hours, parsedTime.minutes)
      const newRange = { ...timeRange, start: newTime }
      setTimeRange(newRange)
      if (onChange) {
        onChange(newRange)
      }
    }
  }

  const handleEndTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEndTimeInputValue(newValue)

    const parsedTime = parseTimeInput(newValue)
    if (parsedTime) {
      const newTime = createTimeDate(parsedTime.hours, parsedTime.minutes)
      // Ensure end time is after start time
      if (!timeRange.start || newTime > timeRange.start) {
        const newRange = { ...timeRange, end: newTime }
        setTimeRange(newRange)
        if (onChange) {
          onChange(newRange)
        }
      }
    }
  }

  const handleStartIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSelection('start')
    setIsStartTimeOpen(true)
    setPickerStep('hour')
    setDragPosition({ x: 0, y: 0 })
  }

  const handleEndIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSelection('end')
    setIsEndTimeOpen(true)
    setPickerStep('hour')
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

  // Handle hour selection
  const handleHourSelect = useCallback((hour: number) => {
    setSelectedHour(hour)
    setPickerStep('minute')
  }, [])

  // Handle minute selection and show confirmation
  const handleMinuteSelect = useCallback(
    (minute: number) => {
      if (selectedHour !== null) {
        setSelectedMinute(minute)
        setPickerStep('confirmation')

        const newTime = createTimeDate(selectedHour, minute)

        if (activeSelection === 'start') {
          handleStartTimeChange(newTime)
        } else {
          // For end time, ensure it's after start time
          if (!timeRange.start || newTime > timeRange.start) {
            handleEndTimeChange(newTime)
          }
        }

        // Close picker after showing confirmation
        setTimeout(() => {
          setIsStartTimeOpen(false)
          setIsEndTimeOpen(false)
          setPickerStep('hour')
          setSelectedHour(null)
          setSelectedMinute(null)
        }, 1500)
      }
    },
    [
      selectedHour,
      activeSelection,
      handleStartTimeChange,
      handleEndTimeChange,
      timeRange.start,
    ]
  )

  // Custom picker component
  const CustomTimePicker = () => (
    <Paper
      sx={{
        backgroundColor: sacredtheme ? alpha('#000000', 0.95) : '#ffffff',
        border: sacredtheme
          ? `2px solid ${alpha('#FFD700', 0.5)}`
          : '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        minWidth: pickerStep === 'hour' ? '420px' : '380px',
        width: pickerStep === 'hour' ? '420px' : '380px',
        height: 'auto',
        maxWidth: 'none',
        maxHeight: 'none',
        overflow: 'visible',
        ...(sacredtheme && {
          boxShadow:
            '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
          animation: `${sacredGlow} 4s ease-in-out infinite`,
        }),
      }}
    >
      {/* Header with back button and title */}
      {pickerStep === 'minute' && (
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
            onClick={() => setPickerStep('hour')}
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
              Select Minutes for {selectedHour}:00
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
              {activeSelection === 'start' ? startLabel : endLabel}
              {showTimezone
                ? ` • ${timezoneInfo.label}`
                : ' • Click and drag header to move'}
            </Typography>
          </Box>
        </Box>
      )}

      {pickerStep === 'hour' && (
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
            Select Hour
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
            {activeSelection === 'start' ? startLabel : endLabel} • Click and
            drag to move
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
            ⏰ {activeSelection === 'start' ? 'Start' : 'End'} Time Selected
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
            {formatTimeDisplay(selectedHour || 0, selectedMinute || 0)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: sacredtheme ? alpha('#FFD700', 0.8) : '#666',
              fontFamily: sacredtheme ? '"Crimson Text", serif' : 'inherit',
              pointerEvents: 'none',
            }}
          >
            {formatTimeInput(selectedHour || 0, selectedMinute || 0)}
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
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        >
          {pickerStep === 'hour' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '380px',
                position: 'relative',
                padding: 0,
                margin: 0,
              }}
            >
              {/* Outer Clock Ring */}
              <Box
                sx={{
                  width: '340px',
                  height: '340px',
                  borderRadius: '50%',
                  position: 'relative',
                  background: sacredtheme
                    ? `
                      radial-gradient(circle at center, 
                        ${alpha('#FFD700', 0.08)} 0%, 
                        ${alpha('#000000', 0.98)} 60%,
                        ${alpha('#FFD700', 0.12)} 100%
                      )
                    `
                    : '#ffffff',
                  border: sacredtheme
                    ? `4px solid transparent`
                    : '3px solid #e0e0e0',
                  ...(sacredtheme && {
                    backgroundImage: `
                      radial-gradient(circle at center, 
                        ${alpha('#FFD700', 0.08)} 0%, 
                        ${alpha('#000000', 0.98)} 60%,
                        ${alpha('#FFD700', 0.12)} 100%
                      ),
                      conic-gradient(from 0deg, 
                        ${alpha('#FFD700', 0.8)} 0deg,
                        ${alpha('#FFD700', 0.4)} 90deg,
                        ${alpha('#FFD700', 0.8)} 180deg,
                        ${alpha('#FFD700', 0.4)} 270deg,
                        ${alpha('#FFD700', 0.8)} 360deg
                      )
                    `,
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    boxShadow: `
                      0 0 40px ${alpha('#FFD700', 0.3)}, 
                      inset 0 0 40px ${alpha('#FFD700', 0.08)},
                      0 0 80px ${alpha('#FFD700', 0.15)}
                    `,
                  }),
                }}
              >
                {/* Hour Tick Marks */}
                {Array.from({ length: 12 }, (_, i) => i).map(i => {
                  const angle = (i * 30 - 90) * (Math.PI / 180)
                  const outerRadius = 155
                  const innerRadius = 135
                  const x1 = Math.cos(angle) * innerRadius
                  const y1 = Math.sin(angle) * innerRadius
                  const x2 = Math.cos(angle) * outerRadius
                  const y2 = Math.sin(angle) * outerRadius

                  return (
                    <Box
                      key={`tick-${i}`}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '3px',
                        height: '20px',
                        backgroundColor: sacredtheme
                          ? alpha('#FFD700', 0.6)
                          : '#ccc',
                        transform: `translate(-50%, -50%) translate(${(x1 + x2) / 2}px, ${(y1 + y2) / 2}px) rotate(${i * 30}deg)`,
                        borderRadius: '2px',
                        zIndex: 2,
                        ...(sacredtheme && {
                          boxShadow: `0 0 4px ${alpha('#FFD700', 0.4)}`,
                        }),
                      }}
                    />
                  )
                })}

                {/* Sacred Corner Glyphs */}
                {sacredtheme && (
                  <>
                    {['𓇳', '𓋴', '𓂀', '𓊖'].map((glyph, index) => (
                      <Box
                        key={glyph}
                        sx={{
                          position: 'absolute',
                          top:
                            index === 0
                              ? '8px'
                              : index === 1
                                ? '50%'
                                : index === 2
                                  ? 'calc(100% - 28px)'
                                  : '50%',
                          left:
                            index === 1
                              ? 'calc(100% - 28px)'
                              : index === 3
                                ? '8px'
                                : '50%',
                          transform:
                            index === 0 || index === 2
                              ? 'translateX(-50%)'
                              : 'translateY(-50%)',
                          color: alpha('#FFD700', 0.25),
                          fontSize: '18px',
                          zIndex: 1,
                          animation: `${floatGlyph} 4s ease-in-out infinite`,
                          animationDelay: `${index * 1}s`,
                          textShadow: `0 0 8px ${alpha('#FFD700', 0.4)}`,
                        }}
                      >
                        {glyph}
                      </Box>
                    ))}
                  </>
                )}

                {/* Center Sacred Symbol */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: sacredtheme
                      ? alpha('#FFD700', 0.12)
                      : alpha('#000', 0.05),
                    border: sacredtheme
                      ? `2px solid ${alpha('#FFD700', 0.4)}`
                      : '2px solid #ddd',
                    zIndex: 3,
                    ...(sacredtheme && {
                      boxShadow: `
                        0 0 20px ${alpha('#FFD700', 0.3)},
                        inset 0 0 20px ${alpha('#FFD700', 0.1)}
                      `,
                    }),
                  }}
                >
                  {sacredtheme && (
                    <Box
                      sx={{
                        color: alpha('#FFD700', 0.8),
                        fontSize: '24px',
                        mb: 0.5,
                        animation: `${floatGlyph} 6s ease-in-out infinite`,
                        textShadow: `0 0 10px ${alpha('#FFD700', 0.6)}`,
                      }}
                    >
                      ⏰
                    </Box>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: sacredtheme ? alpha('#FFD700', 0.9) : '#666',
                      fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                      fontSize: '11px',
                      fontWeight: '600',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      ...(sacredtheme && {
                        textShadow: `0 0 6px ${alpha('#FFD700', 0.5)}`,
                      }),
                    }}
                  >
                    SELECT
                    <br />
                    HOUR
                    {showTimezone && (
                      <>
                        <br />
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>
                          {timezoneInfo.military}
                        </span>
                      </>
                    )}
                  </Typography>
                </Box>

                {/* Hour Numbers */}
                {generateHours()
                  .filter(hour => hour % 6 === 0 || hour === 3 || hour === 9)
                  .map(hour => {
                    // Only show major hours (12, 3, 6, 9) as larger markers
                    const angle = (hour * 30 - 90) * (Math.PI / 180)
                    const radius = 110
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius
                    const displayHour =
                      hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

                    return (
                      <Box
                        key={`major-${hour}`}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          color: sacredtheme ? alpha('#FFD700', 0.9) : '#333',
                          fontSize: '18px',
                          fontWeight: '700',
                          fontFamily: sacredtheme
                            ? '"Cinzel", serif'
                            : 'inherit',
                          zIndex: 4,
                          textAlign: 'center',
                          ...(sacredtheme && {
                            textShadow: `0 0 8px ${alpha('#FFD700', 0.6)}`,
                          }),
                        }}
                      >
                        {displayHour}
                      </Box>
                    )
                  })}

                {/* Clickable Hour Areas */}
                {generateHours().map(hour => {
                  const angle = (hour * 30 - 90) * (Math.PI / 180)
                  const radius = 130
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  const displayHour =
                    hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

                  return (
                    <Box
                      key={hour}
                      onClick={() => handleHourSelect(hour)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: sacredtheme
                          ? 'rgba(255, 255, 255, 0.85)'
                          : '#333',
                        backgroundColor: sacredtheme
                          ? alpha('#FFD700', 0.08)
                          : alpha('#000', 0.03),
                        border: sacredtheme
                          ? `1px solid ${alpha('#FFD700', 0.25)}`
                          : '1px solid #e0e0e0',
                        fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 6,
                        '&:hover': {
                          backgroundColor: sacredtheme
                            ? alpha('#FFD700', 0.25)
                            : alpha('#000', 0.08),
                          color: sacredtheme ? '#FFD700' : '#000',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.15)`,
                          ...(sacredtheme && {
                            boxShadow: `
                              0 0 20px ${alpha('#FFD700', 0.7)},
                              0 0 40px ${alpha('#FFD700', 0.4)}
                            `,
                            border: `2px solid ${alpha('#FFD700', 0.9)}`,
                          }),
                        },
                        '&:active': {
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.0)`,
                        },
                      }}
                    >
                      {displayHour}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}

          {pickerStep === 'minute' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '360px',
                position: 'relative',
                padding: 0,
                margin: 0,
              }}
            >
              {/* Outer Clock Ring for Minutes */}
              <Box
                sx={{
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  position: 'relative',
                  background: sacredtheme
                    ? `
                      radial-gradient(circle at center, 
                        ${alpha('#FFD700', 0.06)} 0%, 
                        ${alpha('#000000', 0.98)} 70%,
                        ${alpha('#FFD700', 0.1)} 100%
                      )
                    `
                    : '#ffffff',
                  border: sacredtheme
                    ? `3px solid transparent`
                    : '2px solid #e0e0e0',
                  ...(sacredtheme && {
                    backgroundImage: `
                      radial-gradient(circle at center, 
                        ${alpha('#FFD700', 0.06)} 0%, 
                        ${alpha('#000000', 0.98)} 70%,
                        ${alpha('#FFD700', 0.1)} 100%
                      ),
                      conic-gradient(from 0deg, 
                        ${alpha('#FFD700', 0.6)} 0deg,
                        ${alpha('#FFD700', 0.3)} 90deg,
                        ${alpha('#FFD700', 0.6)} 180deg,
                        ${alpha('#FFD700', 0.3)} 270deg,
                        ${alpha('#FFD700', 0.6)} 360deg
                      )
                    `,
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    boxShadow: `
                      0 0 35px ${alpha('#FFD700', 0.25)}, 
                      inset 0 0 35px ${alpha('#FFD700', 0.06)},
                      0 0 70px ${alpha('#FFD700', 0.12)}
                    `,
                  }),
                }}
              >
                {/* Quarter Hour Tick Marks */}
                {[0, 15, 30, 45].map(minute => {
                  const angle = (minute * 6 - 90) * (Math.PI / 180) // 6 degrees per minute
                  const outerRadius = 145
                  const innerRadius = 125
                  const x1 = Math.cos(angle) * innerRadius
                  const y1 = Math.sin(angle) * innerRadius
                  const x2 = Math.cos(angle) * outerRadius
                  const y2 = Math.sin(angle) * outerRadius

                  return (
                    <Box
                      key={`tick-${minute}`}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '4px',
                        height: '20px',
                        backgroundColor: sacredtheme
                          ? alpha('#FFD700', 0.7)
                          : '#aaa',
                        transform: `translate(-50%, -50%) translate(${(x1 + x2) / 2}px, ${(y1 + y2) / 2}px) rotate(${minute * 6}deg)`,
                        borderRadius: '2px',
                        zIndex: 2,
                        ...(sacredtheme && {
                          boxShadow: `0 0 6px ${alpha('#FFD700', 0.5)}`,
                        }),
                      }}
                    />
                  )
                })}

                {/* Sacred Corner Glyphs */}
                {sacredtheme && (
                  <>
                    {['𓇼', '𓈖', '𓇳', '𓋴'].map((glyph, index) => (
                      <Box
                        key={glyph}
                        sx={{
                          position: 'absolute',
                          top:
                            index === 0
                              ? '8px'
                              : index === 1
                                ? 'calc(100% - 28px)'
                                : index === 2
                                  ? '50%'
                                  : '50%',
                          left:
                            index === 2
                              ? 'calc(100% - 28px)'
                              : index === 3
                                ? '8px'
                                : '50%',
                          transform:
                            index === 0 || index === 1
                              ? 'translateX(-50%)'
                              : 'translateY(-50%)',
                          color: alpha('#FFD700', 0.2),
                          fontSize: '16px',
                          zIndex: 1,
                          animation: `${floatGlyph} 5s ease-in-out infinite`,
                          animationDelay: `${index * 1.25}s`,
                          textShadow: `0 0 6px ${alpha('#FFD700', 0.3)}`,
                        }}
                      >
                        {glyph}
                      </Box>
                    ))}
                  </>
                )}

                {/* Center Circle with Selected Hour */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: sacredtheme
                      ? alpha('#FFD700', 0.15)
                      : alpha('#000', 0.08),
                    border: sacredtheme
                      ? `3px solid ${alpha('#FFD700', 0.5)}`
                      : '2px solid #ddd',
                    zIndex: 5,
                    ...(sacredtheme && {
                      boxShadow: `
                        0 0 25px ${alpha('#FFD700', 0.4)},
                        inset 0 0 25px ${alpha('#FFD700', 0.1)}
                      `,
                    }),
                  }}
                >
                  <Box
                    sx={{
                      color: sacredtheme ? alpha('#FFD700', 0.8) : '#666',
                      fontSize: '28px',
                      mb: 1,
                      ...(sacredtheme && {
                        animation: `${floatGlyph} 8s ease-in-out infinite`,
                        textShadow: `0 0 12px ${alpha('#FFD700', 0.6)}`,
                      }),
                    }}
                  >
                    ⏰
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: sacredtheme ? '#FFD700' : '#333',
                      fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                      fontWeight: '700',
                      fontSize: '22px',
                      lineHeight: 1,
                      mb: 0.5,
                      ...(sacredtheme && {
                        textShadow: `0 0 10px ${alpha('#FFD700', 0.7)}`,
                      }),
                    }}
                  >
                    {selectedHour === 0
                      ? 12
                      : selectedHour! > 12
                        ? selectedHour! - 12
                        : selectedHour}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: sacredtheme ? alpha('#FFD700', 0.8) : '#666',
                      fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.1em',
                      ...(sacredtheme && {
                        textShadow: `0 0 6px ${alpha('#FFD700', 0.5)}`,
                      }),
                    }}
                  >
                    {selectedHour! >= 12 ? 'PM' : 'AM'}
                  </Typography>
                </Box>

                {/* Minute Number Labels */}
                {generateMinutes().map(minute => {
                  const angle = (minute * 6 - 90) * (Math.PI / 180)
                  const radius = 100
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius

                  return (
                    <Box
                      key={`label-${minute}`}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        color: sacredtheme ? alpha('#FFD700', 0.9) : '#333',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                        zIndex: 4,
                        textAlign: 'center',
                        ...(sacredtheme && {
                          textShadow: `0 0 8px ${alpha('#FFD700', 0.6)}`,
                        }),
                      }}
                    >
                      :{minute.toString().padStart(2, '0')}
                    </Box>
                  )
                })}

                {/* Clickable Minute Areas */}
                {generateMinutes().map(minute => {
                  const angle = (minute * 6 - 90) * (Math.PI / 180)
                  const radius = 120
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius

                  return (
                    <Box
                      key={minute}
                      onClick={() => handleMinuteSelect(minute)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: sacredtheme
                          ? 'rgba(255, 255, 255, 0.8)'
                          : '#333',
                        backgroundColor: sacredtheme
                          ? alpha('#FFD700', 0.08)
                          : alpha('#000', 0.05),
                        border: sacredtheme
                          ? `2px solid ${alpha('#FFD700', 0.3)}`
                          : '1px solid #ddd',
                        fontFamily: sacredtheme ? '"Cinzel", serif' : 'inherit',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 6,
                        '&:hover': {
                          backgroundColor: sacredtheme
                            ? alpha('#FFD700', 0.3)
                            : alpha('#000', 0.12),
                          color: sacredtheme ? '#FFD700' : '#000',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.2)`,
                          ...(sacredtheme && {
                            boxShadow: `
                              0 0 25px ${alpha('#FFD700', 0.8)},
                              0 0 50px ${alpha('#FFD700', 0.5)}
                            `,
                            border: `3px solid ${alpha('#FFD700', 0.9)}`,
                          }),
                        },
                        '&:active': {
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.1)`,
                        },
                      }}
                    >
                      :{minute.toString().padStart(2, '0')}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  )

  const startTimeIcon = (
    <InputAdornment position="end">
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
        <AccessTimeIcon
          onClick={handleStartIconClick}
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
    </InputAdornment>
  )

  const endTimeIcon = (
    <InputAdornment position="end">
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
        <AccessTimeIcon
          onClick={handleEndIconClick}
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
    </InputAdornment>
  )

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label={startLabel}
            value={startTimeInputValue}
            onChange={handleStartTimeInputChange}
            slotProps={{
              input: {
                readOnly: false,
                style: { cursor: 'text', height: '40px' },
                endAdornment: startTimeIcon,
              },
            }}
            sacredtheme={sacredtheme}
            placeholder={sacredtheme ? 'Sacred dawn...' : 'HH:MM'}
            {...rest}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            label={endLabel}
            value={endTimeInputValue}
            onChange={handleEndTimeInputChange}
            slotProps={{
              input: {
                readOnly: false,
                style: { cursor: 'text', height: '40px' },
                endAdornment: endTimeIcon,
              },
            }}
            sacredtheme={sacredtheme}
            placeholder={sacredtheme ? 'Sacred dusk...' : 'HH:MM'}
            {...rest}
          />
        </Box>
      </Box>

      {/* Custom Time Picker */}
      <Popover
        open={isStartTimeOpen || isEndTimeOpen}
        anchorEl={null}
        onClose={() => {
          setIsStartTimeOpen(false)
          setIsEndTimeOpen(false)
          setPickerStep('hour')
          setSelectedHour(null)
          setSelectedMinute(null)
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
        <CustomTimePicker />
      </Popover>
    </>
  )
}

export default TimeRangeComponent

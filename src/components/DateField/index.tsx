'use client'
import React, { useState, forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TextField, { TextFieldProps } from '../TextField'

export interface DateFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'endAdornment'> {
  onChange?: (date: Date | null) => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
  value?: Date | null
}

const StyledTextField = styled(TextField)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}>(({ backgroundcolor, outlinecolor }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: backgroundcolor,
    height: '40px',
    '& fieldset': {
      borderColor: outlinecolor,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor,
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 14px',
  },
}))

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
  backgroundcolor,
  outlinecolor,
  fontcolor,
  label = 'Select Date',
  value,
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

  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(formatDate(selectedDate))

  const handleChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
      setInputValue(formatDate(date))
      setIsOpen(false)
      if (onChange) {
        onChange(date)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const newValue = e.target.value
    const selectionStart = input.selectionStart || 0

    // Keep the original value
    setInputValue(newValue)

    // Try to parse the date parts
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

    // Maintain cursor position
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
      const newDate = new Date(selectedDate)
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

      // Maintain cursor position
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
    setIsOpen(true)
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

  return (
    <>
      <StyledTextField
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        endAdornment={calendarIcon}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
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
        selected={selectedDate}
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

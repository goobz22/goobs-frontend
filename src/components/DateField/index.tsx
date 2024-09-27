'use client'
import React, { useState, useRef } from 'react'
import { TextField, InputAdornment, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export interface DateFieldProps extends Omit<TextFieldProps, 'onChange'> {
  onChange?: (date: Date) => void
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  label?: string
}

const StyledTextField = styled(TextField)<{
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}>(({ theme, backgroundcolor, outlinecolor, fontcolor }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: backgroundcolor || theme.palette.background.paper,
    '& fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: outlinecolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: fontcolor || theme.palette.text.primary,
    '&.Mui-focused': {
      color: fontcolor || theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    color: fontcolor || theme.palette.text.primary,
  },
}))

const DateField: React.FC<DateFieldProps> = ({
  onChange,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  label = 'Select Date Range',
  ...rest
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const datePickerRef = useRef<DatePicker>(null)

  const handleChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates)
    if (dates[0]) {
      onChange?.(dates[0])
    }
  }

  const formatDateRange = (range: [Date | null, Date | null]) => {
    const [start, end] = range
    if (start && end) {
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    } else if (start) {
      return start.toLocaleDateString()
    }
    return ''
  }

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true)
    }
  }

  return (
    <StyledTextField
      label={label}
      value={formatDateRange(dateRange)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CalendarTodayIcon />
          </InputAdornment>
        ),
        readOnly: true,
      }}
      backgroundcolor={backgroundcolor}
      outlinecolor={outlinecolor}
      fontcolor={fontcolor}
      onClick={openDatePicker}
      {...rest}
    >
      <DatePicker
        ref={datePickerRef}
        selectsRange={true}
        startDate={dateRange[0] || undefined}
        endDate={dateRange[1] || undefined}
        onChange={(update: [Date | null, Date | null]) => {
          handleChange(update)
        }}
        customInput={<input style={{ display: 'none' }} />}
      />
    </StyledTextField>
  )
}

export default DateField

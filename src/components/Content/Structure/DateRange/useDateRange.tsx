import React from 'react'
import { Box } from '@mui/material'
import DateRangeComponent, {
  DateRangeProps,
  DateRange,
} from '../../../Field/Date/DateRange'

export interface UseDateRangeProps {
  dateRange?: DateRangeProps | DateRangeProps[]
}

export type { DateRangeProps, DateRange }

const DateRangeWrapper: React.FC<DateRangeProps> = ({
  onChange,
  value,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  sacredTheme = false,
  disabled = false,
  error = false,
  helperText,
  sx,
  style,
  ...rest
}) => {
  return (
    <Box style={style}>
      <DateRangeComponent
        onChange={onChange}
        value={value}
        startLabel={startLabel}
        endLabel={endLabel}
        sacredTheme={sacredTheme}
        disabled={disabled}
        error={error}
        helperText={helperText}
        sx={sx}
        {...rest}
      />
    </Box>
  )
}

export const useDateRange = ({
  dateRange,
}: UseDateRangeProps): React.ReactElement[] => {
  if (!dateRange) return []

  const fields = Array.isArray(dateRange) ? dateRange : [dateRange]

  return fields.map((field, index) => (
    <DateRangeWrapper key={index} {...field} />
  ))
}

export default useDateRange

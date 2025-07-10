import React from 'react'
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
  sacredtheme = false,
  disabled = false,
  error = false,
  helperText,
  style,
  ...rest
}) => {
  return (
    <div style={style}>
      <DateRangeComponent
        onChange={onChange}
        value={value}
        startLabel={startLabel}
        endLabel={endLabel}
        sacredtheme={sacredtheme}
        disabled={disabled}
        error={error}
        helperText={helperText}
        {...rest}
      />
    </div>
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

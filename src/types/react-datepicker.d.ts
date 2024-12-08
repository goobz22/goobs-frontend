import React from 'react'

declare module 'react-datepicker' {
  import { ComponentType } from 'react'

  export interface ReactDatePickerProps {
    selected: Date | null
    onChange: (date: Date | null) => void
    dateFormat?: string | string[]
    placeholderText?: string
    className?: string
    disabled?: boolean
    minDate?: Date
    maxDate?: Date
    showTimeSelect?: boolean
    timeFormat?: string
    timeIntervals?: number
    timeCaption?: string
    showMonthDropdown?: boolean
    showYearDropdown?: boolean
    dropdownMode?: 'scroll' | 'select'
    todayButton?: string
    isClearable?: boolean
    customInput?: React.ReactElement
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
    onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void
    onCalendarOpen?: () => void
    onCalendarClose?: () => void
    open?: boolean
    shouldCloseOnSelect?: boolean
    popperPlacement?:
      | 'auto'
      | 'auto-left'
      | 'auto-right'
      | 'bottom'
      | 'bottom-end'
      | 'bottom-start'
      | 'left'
      | 'left-end'
      | 'left-start'
      | 'right'
      | 'right-end'
      | 'right-start'
      | 'top'
      | 'top-end'
      | 'top-start'
    popperModifiers?: Array<{
      name: string
      options: Record<string, unknown>
    }>
    popperProps?: Record<string, unknown>
    monthsShown?: number
    excludeDates?: Date[]
    includeDates?: Date[]
    filterDate?: (date: Date) => boolean
    inline?: boolean
    peekNextMonth?: boolean
    showMonthYearPicker?: boolean
    showFullMonthYearPicker?: boolean
    showTwoColumnMonthYearPicker?: boolean
    showFourColumnMonthYearPicker?: boolean
    showWeekNumbers?: boolean
    showYearPicker?: boolean
    startDate?: Date | null
    endDate?: Date | null
    selectsStart?: boolean
    selectsEnd?: boolean
    selectsRange?: boolean
  }

  const DatePicker: ComponentType<ReactDatePickerProps>
  export default DatePicker
}

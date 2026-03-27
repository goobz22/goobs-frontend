'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './DateRange.module.css'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangeProps {
  startLabel?: string
  endLabel?: string
  value?: DateRange
  onChange?: (dateRange: DateRange) => void
  disableFutureDateValidation?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  style?: React.CSSProperties
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: 'sacred' | 'light' | 'dark'
    helperTextType?: 'error' | 'info'
    height?: string
    fontSize?: string
    borderRadius?: string
    marginBottom?: string
    marginTop?: string
    width?: string
    minHeight?: string
    padding?: string
    gap?: string
  }
  helperText?: string
}

const DateRange: React.FC<DateRangeProps> = ({
  startLabel = 'Start Date',
  endLabel = 'End Date',
  value,
  onChange,
  disabled: disabledProp,
  required: requiredProp,
  error,
  style,
  styles,
  helperText,
}) => {
  const disabled = disabledProp || styles?.disabled || false
  const required = requiredProp || styles?.required || false
  const theme = styles?.theme || 'sacred'
  const displayHelperText = error || helperText
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      const newRange = {
        start: date,
        end: value?.end || null,
      }
      // If start date is after end date, clear end date
      if (newRange.end && date > newRange.end) {
        newRange.end = null
      }
      onChange?.(newRange)
    } else {
      onChange?.({ start: null, end: value?.end || null })
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      onChange?.({
        start: value?.start || null,
        end: date,
      })
    } else {
      onChange?.({ start: value?.start || null, end: null })
    }
  }

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const startEl = startInputRef.current
    const endEl = endInputRef.current

    const handleNativeStartInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const dateString = target.value
      if (dateString !== formatDateForInput(value?.start || null)) {
        if (dateString) {
          const date = new Date(dateString + 'T00:00:00')
          const newRange = { start: date, end: value?.end || null }
          if (newRange.end && date > newRange.end) {
            newRange.end = null
          }
          onChange?.(newRange)
        } else {
          onChange?.({ start: null, end: value?.end || null })
        }
      }
    }

    const handleNativeEndInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const dateString = target.value
      if (dateString !== formatDateForInput(value?.end || null)) {
        if (dateString) {
          const date = new Date(dateString + 'T00:00:00')
          onChange?.({ start: value?.start || null, end: date })
        } else {
          onChange?.({ start: value?.start || null, end: null })
        }
      }
    }

    if (startEl) startEl.addEventListener('input', handleNativeStartInput)
    if (endEl) endEl.addEventListener('input', handleNativeEndInput)
    return () => {
      if (startEl) startEl.removeEventListener('input', handleNativeStartInput)
      if (endEl) endEl.removeEventListener('input', handleNativeEndInput)
    }
  }, [onChange, value])

  // Build helper text class names
  const helperTextClassNames = [
    cssStyles.helperText,
    (error || styles?.helperTextType === 'error') && cssStyles.error,
  ]
    .filter(Boolean)
    .join(' ')

  // Container style overrides
  const containerStyleOverrides: React.CSSProperties = {
    ...style,
  }
  if (styles?.width) containerStyleOverrides.width = styles.width
  if (styles?.marginBottom)
    containerStyleOverrides.marginBottom = styles.marginBottom
  if (styles?.marginTop) containerStyleOverrides.marginTop = styles.marginTop
  if (styles?.minHeight) containerStyleOverrides.minHeight = styles.minHeight

  // Fields wrapper style overrides
  const fieldsWrapperStyleOverrides: React.CSSProperties = {}
  if (styles?.gap) fieldsWrapperStyleOverrides.gap = styles.gap

  // Input style overrides
  const inputStyleOverrides: React.CSSProperties = {}
  if (styles?.height) inputStyleOverrides.minHeight = styles.height
  if (styles?.fontSize) inputStyleOverrides.fontSize = styles.fontSize
  if (styles?.padding) inputStyleOverrides.padding = styles.padding
  if (styles?.borderRadius)
    inputStyleOverrides.borderRadius = styles.borderRadius

  return (
    <div
      className={cssStyles.container}
      data-theme={theme}
      style={
        Object.keys(containerStyleOverrides).length > 0
          ? containerStyleOverrides
          : undefined
      }
    >
      <div
        className={cssStyles.fieldsWrapper}
        style={
          Object.keys(fieldsWrapperStyleOverrides).length > 0
            ? fieldsWrapperStyleOverrides
            : undefined
        }
      >
        {/* Start Date */}
        <div className={cssStyles.fieldContainer}>
          <label className={cssStyles.label}>
            {startLabel}
            {required && <span className={cssStyles.requiredIndicator}>*</span>}
          </label>
          <input
            ref={startInputRef}
            type="date"
            className={cssStyles.input}
            value={formatDateForInput(value?.start || null)}
            onChange={handleStartDateChange}
            disabled={disabled}
            style={
              Object.keys(inputStyleOverrides).length > 0
                ? inputStyleOverrides
                : undefined
            }
          />
        </div>

        {/* End Date */}
        <div className={cssStyles.fieldContainer}>
          <label className={cssStyles.label}>
            {endLabel}
            {required && <span className={cssStyles.requiredIndicator}>*</span>}
          </label>
          <input
            ref={endInputRef}
            type="date"
            className={cssStyles.input}
            value={formatDateForInput(value?.end || null)}
            onChange={handleEndDateChange}
            disabled={disabled}
            min={value?.start ? formatDateForInput(value.start) : undefined}
            style={
              Object.keys(inputStyleOverrides).length > 0
                ? inputStyleOverrides
                : undefined
            }
          />
        </div>
      </div>

      {/* Helper Text / Error */}
      {displayHelperText && (
        <div className={helperTextClassNames}>{displayHelperText}</div>
      )}
    </div>
  )
}

export default DateRange

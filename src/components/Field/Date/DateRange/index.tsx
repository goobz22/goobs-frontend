'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './DateRange.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'

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
  helperText?: string
  /**
   * Error message rendered below the inputs; sets aria-invalid on the
   * shell. Top-level `disabled`/`required`/`error` were dropped from
   * this component during the FieldShell migration — pass `disabled`
   * and `required` via `styles` instead. `error` stays top-level here
   * because callers commonly compute it from cross-field validation
   * (e.g. start > end), which doesn't belong in style overrides.
   */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  style?: React.CSSProperties
  styles?: FieldStyleOverrides & {
    // DateRange-local layout overrides forwarded as inline styles
    // on the input itself.
    height?: string
    fontSize?: string
    borderRadius?: string
    padding?: string
    gap?: string
  }
}

const DateRange: React.FC<DateRangeProps> = ({
  startLabel = 'Start Date',
  endLabel = 'End Date',
  value,
  onChange,
  error,
  dataField,
  dataFieldName,
  style,
  styles,
  helperText,
}) => {
  // Top-level `disabled`/`required` props were removed during the
  // FieldShell migration — read both from styles only. This is a
  // breaking change for callers that previously passed
  // <DateRange disabled required …/> at the top level; migrate them
  // to <DateRange styles={{ disabled: true, required: true }} …/>.
  const disabled = styles?.disabled || false
  const required = styles?.required || false
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

  // Listen for native 'input' events from browser-automation tools that
  // bypass React's synthetic-event system. Two listeners — one per
  // input — keep both ends of the range in sync with agent-driven
  // input.
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

  // Per-input style overrides. Layout overrides are handled by
  // FieldShell on each shell wrapper; these apply to the inputs.
  const inputStyleOverrides: React.CSSProperties = {}
  if (styles?.height) inputStyleOverrides.minHeight = styles.height
  if (styles?.fontSize) inputStyleOverrides.fontSize = styles.fontSize
  if (styles?.padding) inputStyleOverrides.padding = styles.padding
  if (styles?.borderRadius) {
    inputStyleOverrides.borderRadius = styles.borderRadius
  }

  // Two FieldShells side-by-side share the start/end labels and helper
  // wiring. Only the start shell carries `error` + `helperText` so the
  // helper region renders once below the pair (the end shell skips
  // both, leaving the wider error message anchored to the first input
  // for screenreader announcement).
  const fieldsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    gap: styles?.gap ?? '16px',
    width: '100%',
  }

  return (
    <div style={style} data-field={dataField} data-field-name={dataFieldName}>
      <div style={fieldsWrapperStyle} className={cssStyles.fieldsWrapper}>
        <div style={{ flex: 1 }}>
          <FieldShell
            label={startLabel}
            helperText={helperText}
            error={error}
            disabled={disabled}
            required={required}
            styles={styles}
          >
            {({ inputId, inputAriaProps }) => (
              <input
                ref={startInputRef}
                id={inputId}
                type="date"
                className={cssStyles.input}
                value={formatDateForInput(value?.start || null)}
                onChange={handleStartDateChange}
                disabled={disabled}
                required={required}
                style={
                  Object.keys(inputStyleOverrides).length > 0
                    ? inputStyleOverrides
                    : undefined
                }
                {...inputAriaProps}
              />
            )}
          </FieldShell>
        </div>

        <div style={{ flex: 1 }}>
          <FieldShell
            label={endLabel}
            disabled={disabled}
            required={required}
            styles={styles}
          >
            {({ inputId, inputAriaProps }) => (
              <input
                ref={endInputRef}
                id={inputId}
                type="date"
                className={cssStyles.input}
                value={formatDateForInput(value?.end || null)}
                onChange={handleEndDateChange}
                disabled={disabled}
                required={required}
                min={value?.start ? formatDateForInput(value.start) : undefined}
                style={
                  Object.keys(inputStyleOverrides).length > 0
                    ? inputStyleOverrides
                    : undefined
                }
                {...inputAriaProps}
              />
            )}
          </FieldShell>
        </div>
      </div>
    </div>
  )
}

DateRange.displayName = 'DateRange'

export default DateRange

'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './TimeRange.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface TimeRange {
  start: Date | null
  end: Date | null
}

export interface TimeRangeProps {
  onChange?: (timeRange: TimeRange) => void
  value?: TimeRange
  startLabel?: string
  endLabel?: string
  helperText?: string
  /** Error message rendered below the inputs; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** HTML-style field name. Alias for dataFieldName so the test contract can target the field by either; data-field-name is emitted from dataFieldName ?? name. */
  name?: string
  /**
   * Accessible name for the pair. The start/end inputs are two related
   * controls that make up a single range, so the wrapper is exposed as a
   * `role="group"` and this string becomes its `aria-label` — assistive tech
   * announces the two fields as one named set (WCAG 1.3.1). Defaults to
   * `'Time range'` when omitted.
   */
  ariaLabel?: string
  styles?: FieldStyleOverrides
}

const formatTimeForInput = (date: Date | null): string => {
  if (!date) return ''
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const parseTimeInput = (timeString: string): Date | null => {
  if (!timeString) return null
  const [hours, minutes] = timeString.split(':').map(Number)
  if (isNaN(hours!) || isNaN(minutes!)) return null
  const date = new Date()
  date.setHours(hours!, minutes!, 0, 0)
  return date
}

const TimeRangeComponent: React.FC<TimeRangeProps> = ({
  onChange: onChangeProp,
  value: valueProp,
  startLabel = 'Start Time',
  endLabel = 'End Time',
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  ariaLabel,
  styles,
}) => {
  // Tier-1 form binding: when rendered inside a <Form> with a `name` and no
  // explicit `value`, the {start,end} range is read/written through the form
  // engine (stored as the object directly — no adapter). Outside a form, or
  // with an explicit value, this is a byte-for-byte pass-through. The bound
  // results take the bare value/onChange names so all downstream code is
  // unchanged; onChange stays optional (callsites already use `onChange?.`).
  const { value, onChange } = useFieldBinding<TimeRange>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })

  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = parseTimeInput(e.target.value)
    const newRange = { start: newStart, end: value?.end || null }
    onChange?.(newRange)
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseTimeInput(e.target.value)
    const newRange = { start: value?.start || null, end: newEnd }
    onChange?.(newRange)
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
      if (target.value !== formatTimeForInput(value?.start || null)) {
        const newStart = parseTimeInput(target.value)
        const newRange = { start: newStart, end: value?.end || null }
        onChange?.(newRange)
      }
    }

    const handleNativeEndInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== formatTimeForInput(value?.end || null)) {
        const newEnd = parseTimeInput(target.value)
        const newRange = { start: value?.start || null, end: newEnd }
        onChange?.(newRange)
      }
    }

    if (startEl) startEl.addEventListener('input', handleNativeStartInput)
    if (endEl) endEl.addEventListener('input', handleNativeEndInput)
    return () => {
      if (startEl) startEl.removeEventListener('input', handleNativeStartInput)
      if (endEl) endEl.removeEventListener('input', handleNativeEndInput)
    }
  }, [onChange, value])

  // Inner input styling lives in TimeRange.module.css. The sacred-gold
  // theme is the hardcoded default; the disabled chrome is driven by the
  // native `:disabled` pseudo-class (no JS `disabled ? … : …` ternaries).
  // FieldShell still owns label/helper rendering.

  // Two FieldShells side-by-side share the start/end labels. Only the
  // start shell carries `error` + `helperText` so the helper region
  // (role="alert" + aria-live) renders once below the pair — rendering it on
  // both shells would duplicate the message. To avoid marking only ONE control
  // invalid on a cross-field range error, aria-invalid is set on BOTH inputs
  // (the start input via FieldShell's inputAriaProps, the end input via the
  // explicit prop below), so both fields are programmatically invalid and both
  // pick up the themed danger border (WCAG 1.3.1 / 4.1.2). The pair is also
  // exposed as a named role="group" so assistive tech announces the two inputs
  // as one range (WCAG 1.3.1).
  const hasError = Boolean(error)

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? 'Time range'}
      data-field={dataField}
      data-field-name={dataFieldName ?? name}
    >
      <div className={cssStyles.fieldsWrapper}>
        <div className={cssStyles.fieldContainer}>
          <FieldShell
            label={startLabel}
            helperText={helperText}
            error={error}
            disabled={disabled}
            required={required}
            name={name}
            filled={value != null && (value.start != null || value.end != null)}
            styles={styles}
          >
            {({ inputId, inputAriaProps }) => (
              <input
                ref={startInputRef}
                id={inputId}
                type="time"
                className={cssStyles.input}
                value={formatTimeForInput(value?.start || null)}
                onChange={handleStartChange}
                disabled={disabled}
                required={required}
                {...inputAriaProps}
              />
            )}
          </FieldShell>
        </div>

        <div className={cssStyles.fieldContainer}>
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
                type="time"
                className={cssStyles.input}
                value={formatTimeForInput(value?.end || null)}
                onChange={handleEndChange}
                disabled={disabled}
                required={required}
                {...inputAriaProps}
                // The end shell isn't passed `error` (the message renders once
                // under the start shell), so its inputAriaProps carry no
                // aria-invalid. Set it here so a range error marks BOTH inputs
                // invalid, not just the start (WCAG 1.3.1 / 4.1.2). Undefined
                // when there's no error so aria-invalid="false" is never
                // emitted, preserving the test-selector contract.
                aria-invalid={hasError || undefined}
              />
            )}
          </FieldShell>
        </div>
      </div>
    </div>
  )
}

TimeRangeComponent.displayName = 'TimeRange'

export default TimeRangeComponent

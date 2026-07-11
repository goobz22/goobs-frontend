'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './DateRange.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

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
  /**
   * Accessible name for the pair. The start/end inputs are two related
   * controls that make up a single range, so the wrapper is exposed as a
   * `role="group"` and this string becomes its `aria-label` — assistive tech
   * announces the two fields as one named set (WCAG 1.3.1). Defaults to
   * `'Date range'` when omitted.
   */
  ariaLabel?: string
  /**
   * Form-engine binding key. When set inside a `<Form>` and no explicit
   * `value` is passed, the {start,end} range is read/written through the form
   * engine; the engine's error/required for this field also attach to the
   * start shell. Inert outside a `<Form>`.
   */
  name?: string
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
  value: valueProp,
  onChange: onChangeProp,
  error,
  dataField,
  dataFieldName,
  ariaLabel,
  name,
  style,
  styles,
  helperText,
}) => {
  // Tier-1 form binding: when rendered inside a <Form> with a `name` and no
  // explicit `value`, the {start,end} range is read/written through the form
  // engine (stored as the object directly — no adapter). Outside a form, or
  // with an explicit value, this is a byte-for-byte pass-through. The bound
  // results take the bare value/onChange names so all downstream code is
  // unchanged; onChange stays optional (callsites already use `onChange?.`).
  const { value, onChange } = useFieldBinding<DateRange>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })

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
  // helper region (role="alert" + aria-live) renders once below the pair
  // for screenreader announcement — rendering it on both shells would
  // duplicate the message. To avoid marking only ONE control invalid on a
  // cross-field range error, aria-invalid is set directly on BOTH inputs
  // (the start input via FieldShell's inputAriaProps, the end input via the
  // explicit prop below), so both fields are programmatically invalid and
  // both pick up the themed danger border (WCAG 1.3.1 / 4.1.2). The flex
  // layout lives in DateRange.module.css; the caller-supplied `gap` override
  // is passed through as the `--date-range-gap` CSS custom property.
  const hasError = Boolean(error)
  // The start FieldShell renders the ONE helper/error region for the pair
  // (below). Capture the id it generates (via useId, exposed only through its
  // render-prop slot) so the END input can point its aria-describedby at that
  // SAME region — the start input already does, via inputAriaProps. A
  // cross-field range error/helper describes BOTH controls, so a screenreader
  // that lands on the end input can read the reason instead of hearing an
  // unexplained "invalid" (WCAG 1.3.1 / 3.3.1). React evaluates the start
  // shell's render-prop before the end shell's (document order) in the same
  // render, and useId is stable across renders, so the ref holds the correct
  // id by the time the end input renders. Only used as a describedby target
  // when the region actually renders (error OR helperText present), so a
  // dangling aria-describedby is never emitted.
  const startHelperIdRef = useRef<string | undefined>(undefined)
  const startHelperRendered = hasError || helperText != null
  const fieldsWrapperStyle: React.CSSProperties | undefined =
    styles?.gap !== undefined
      ? ({ ['--date-range-gap']: styles.gap } as React.CSSProperties)
      : undefined

  return (
    <div
      style={style}
      role="group"
      aria-label={ariaLabel ?? 'Date range'}
      data-field={dataField}
      data-field-name={dataFieldName ?? name}
    >
      <div style={fieldsWrapperStyle} className={cssStyles.fieldsWrapper}>
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
            {({ inputId, inputAriaProps, helperId }) => {
              // Stash the shared helper-region id so the end input can be
              // described by the same message (see startHelperIdRef above).
              startHelperIdRef.current = helperId
              return (
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
              )
            }}
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
                // The end shell isn't passed `error` (the message renders once
                // under the start shell), so its inputAriaProps carry no
                // aria-invalid. Set it here so a range error marks BOTH inputs
                // invalid, not just the start (WCAG 1.3.1 / 4.1.2). Undefined
                // when there's no error so aria-invalid="false" is never
                // emitted, preserving the test-selector contract.
                aria-invalid={hasError || undefined}
                // Point at the SAME helper/error region the start input is
                // described by, so the reason is programmatically available on
                // this control too — not just an unexplained "invalid" (WCAG
                // 1.3.1 / 3.3.1). Undefined when the region isn't rendered so
                // no dangling aria-describedby is emitted.
                aria-describedby={
                  startHelperRendered ? startHelperIdRef.current : undefined
                }
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

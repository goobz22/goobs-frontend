'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './DateRange.module.css'
import FieldShell, {
  type FieldStyleOverrides,
  type FieldShellSlot,
} from '../../Shell'
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
  // wiring. Only the start shell carries `error` + `helperText` + `name`, so
  // the helper region (role="alert" + aria-live) renders once below the pair
  // for screenreader announcement — rendering it on both shells would
  // duplicate the message. A cross-field range error is a property of the
  // WHOLE range, so BOTH inputs must be marked invalid and BOTH must point at
  // that one message region (WCAG 1.3.1 / 4.1.2 / 3.3.1).
  //
  // Rather than RE-DERIVE the end input's error state from the explicit
  // `error` prop (`Boolean(error)`), we MIRROR the start shell's already-
  // resolved `inputAriaProps` bag onto the end input. Re-derivation was wrong
  // twice over: (a) it misses the form-engine-derived error the start shell
  // resolves from `<Form>` context (bound via `name`, no explicit `error`),
  // leaving the end input un-marked; and (b) for a boolean `error={true}` with
  // no `helperText` the shell renders NO message region (its `aria-describedby`
  // is omitted), yet a describedby gated on `Boolean(error)` would dangle at a
  // non-existent id. Mirroring the resolved bag makes the end input's ARIA
  // exactly track the start's — `aria-invalid` present iff the shell is
  // invalid, `aria-describedby` present iff the shell actually rendered the
  // region — so no dangling reference is ever emitted, the form-engine path is
  // covered, and no Shell change / engine-logic duplication is needed. React
  // evaluates the start shell's render-prop before the end shell's in the same
  // render (document order), so the ref is populated by the time the end input
  // renders. The themed danger border follows the mirrored `aria-invalid`. The
  // flex layout lives in DateRange.module.css; the caller-supplied `gap`
  // override is passed through as the `--date-range-gap` CSS custom property.
  const startInputAriaRef = useRef<FieldShellSlot['inputAriaProps']>({})
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
            {({ inputId, inputAriaProps }) => {
              // Stash the start shell's fully-resolved ARIA bag so the end
              // input can mirror its aria-invalid / aria-describedby onto
              // itself (see startInputAriaRef above).
              startInputAriaRef.current = inputAriaProps
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
                // Mirror the start shell's RESOLVED ARIA onto the end input so
                // a range-level error marks BOTH controls invalid and points
                // BOTH at the single message region (WCAG 1.3.1 / 3.3.1 /
                // 4.1.2). These read from the start shell's resolved bag
                // (captured in startInputAriaRef) — NOT a re-derivation of the
                // `error` prop — so the form-engine-derived error is covered,
                // and aria-describedby is present ONLY when the shell actually
                // rendered the region (never dangling at a boolean-`error`
                // no-message id). `|| undefined` keeps aria-invalid omitted
                // (not "false") when valid, preserving the test-selector
                // contract; the end shell's own bag carries neither attribute
                // (it gets no error/helper), so this override is clean.
                aria-invalid={
                  startInputAriaRef.current['aria-invalid'] || undefined
                }
                aria-describedby={
                  startInputAriaRef.current['aria-describedby']
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

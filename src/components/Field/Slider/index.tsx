'use client'

import React, { useCallback, useRef, useEffect } from 'react'
import cssStyles from './Slider.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'

export interface SliderProps {
  /**
   * The slider value. Optional so the field can auto-bind to the surrounding
   * `<Form>` via `name` when no explicit value is supplied; existing callsites
   * that pass an explicit value take the unchanged back-compat path.
   */
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /**
   * Maps the current numeric value to a human-readable string announced by
   * screen readers via `aria-valuetext`. Use whenever the raw number is not
   * the clearest spoken representation — units (`v => `${v} °C``), a bounded
   * scale (`v => `${v} of 5``), or a percentage (`v => `${v * 100}%``). When
   * omitted, assistive tech falls back to announcing the numeric
   * `aria-valuenow` as before (unchanged for existing callsites).
   * (WCAG 1.3.1 Info and Relationships / 4.1.2 Name, Role, Value; WAI-ARIA
   * APG slider pattern.)
   */
  formatValueText?: (value: number) => string
  label?: string
  /**
   * Accessible name for screen readers when no visible `label` is supplied.
   * FieldShell renders a real `<label htmlFor>` when `label` is set (the
   * preferred, visible-name path); but a label-less slider — a bare control in
   * a data table or a compact toolbar — would otherwise have NO accessible
   * name at all. Passing `ariaLabel` sets `aria-label` directly on the range
   * input so assistive tech can announce it. It is applied ONLY when `label`
   * is absent: a visible `<label>` always wins, so a consumer can never
   * accidentally override the visible name (WCAG 2.5.3 Label in Name). When
   * both `label` and `ariaLabel` are omitted the slider is unnamed exactly as
   * before — purely additive, zero back-compat impact.
   * (WCAG 4.1.2 Name, Role, Value; WAI-ARIA APG slider pattern.)
   */
  ariaLabel?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Form-engine binding key. Forwarded to the input as `name` for native form
   * submission and used by `useFieldBinding`/`FieldShell` to auto-bind value,
   * error, and required to the surrounding `<Form>`.
   */
  name?: string
  styles?: FieldStyleOverrides
}

const Slider: React.FC<SliderProps> = ({
  value: valueProp,
  onChange: onChangeProp,
  min = 0,
  max = 100,
  step = 1,
  formatValueText,
  label,
  ariaLabel,
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. When inside a <Form> with a `name` and no explicit
  // value, `value`/`onChange`/`onBlur` come from the form engine; otherwise the
  // caller's explicit value/onChange pass through unchanged (back-compat).
  const { value, onChange, onBlur } = useFieldBinding<number>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })
  // The range input always needs a concrete numeric value. When neither a
  // caller value nor an engine value is present, fall back to `min` (the
  // historical native default for a value-less range input).
  const currentValue = value ?? min

  // Human-readable value for screen readers. Only set aria-valuetext when a
  // formatter is supplied — otherwise leave it unset so AT announces the
  // native numeric aria-valuenow (the historical, back-compat behavior).
  const valueText = formatValueText
    ? formatValueText(currentValue)
    : undefined

  // Accessible name fallback. When FieldShell renders a visible `<label>` (any
  // non-empty `label`) that label is the accessible name, so `aria-label` is
  // left unset — a redundant/conflicting aria-label would override the visible
  // text (WCAG 2.5.3). Only a label-less slider gets `ariaLabel` applied, so a
  // bare control still has a name for AT. Mirrors FieldShell's own
  // "render a label only when label is truthy" condition (Shell/index.tsx:389).
  const accessibleName = label ? undefined : ariaLabel

  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Listen for native 'input' events to support browser automation
  // tools that bypass React's synthetic event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const numValue = Number(target.value)
      if (numValue !== currentValue) {
        onChange?.(numValue)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, currentValue])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(event.target.value))
    },
    [onChange]
  )

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      name={name}
      filled={value !== undefined && value !== null && !Number.isNaN(value)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <input
          ref={inputRef}
          type="range"
          id={inputId}
          name={name}
          data-field-name={dataFieldName}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-valuetext={valueText}
          aria-orientation="horizontal"
          aria-label={accessibleName}
          className={cssStyles.input}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

export default Slider

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
  label?: string
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
  label,
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
          aria-orientation="horizontal"
          className={cssStyles.input}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

export default Slider

'use client'

import React, { useRef, useEffect } from 'react'
import cssStyles from './TimeField.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface TimeFieldProps {
  onChange?: (time: Date | null) => void
  value?: Date | null
  label?: string
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Form-engine binding key. When set inside a `<Form>` and no explicit
   * `value` is passed, value/onChange come from the form engine; the shell
   * also derives error/required for this field. Inert outside a `<Form>`.
   */
  name?: string
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

const TimeField: React.FC<TimeFieldProps> = ({
  onChange: onChangeProp,
  value: valueProp,
  label = 'Time',
  helperText,
  error,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding: when rendered inside a <Form> with a `name` and no
  // explicit `value`, value/onChange/onBlur come from the form engine. Outside
  // a form (or with an explicit value) this is a byte-for-byte pass-through.
  // The bound results take the bare value/onChange/bindingOnBlur names so all
  // downstream code is unchanged; onChange stays optional (`onChange?.`).
  const {
    value,
    onChange,
    onBlur: bindingOnBlur,
  } = useFieldBinding<Date | null>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseTimeInput(e.target.value)
    onChange?.(newTime)
  }

  // Listen for native 'input' events from browser-automation tools
  // (e.g. agent-browser's form_input) that bypass React's synthetic
  // event system.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value !== formatTimeForInput(value || null)) {
        const newTime = parseTimeInput(target.value)
        onChange?.(newTime)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  // Input chrome (sacred-gold border + dark color scheme) lives in
  // TimeField.module.css; the disabled state is driven by :disabled.

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
      filled={value != null}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <input
          ref={inputRef}
          id={inputId}
          data-field-name={dataFieldName ?? name}
          type="time"
          value={formatTimeForInput(value || null)}
          onChange={handleChange}
          onBlur={bindingOnBlur}
          disabled={disabled}
          required={required}
          className={cssStyles.input}
          {...inputAriaProps}
        />
      )}
    </FieldShell>
  )
}

TimeField.displayName = 'TimeField'

export default TimeField

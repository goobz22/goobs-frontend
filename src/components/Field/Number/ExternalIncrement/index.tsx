'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import cssStyles from './ExternalIncrement.module.css'
import FieldShell, { type FieldStyleOverrides } from '../../Shell'
import { useFieldBinding } from '../../Shell/useFieldBinding'

export interface ExternalIncrementNumberFieldProps {
  /** Seed for the uncontrolled display (default '0'). Ignored once `value` (or a form binding) drives the field. */
  initialValue?: string
  /**
   * Controlled numeric value. Optional and additive: when omitted (the
   * historical default) the field is uncontrolled and seeds from
   * `initialValue`. When supplied — or auto-bound via `name` inside a
   * `<Form>` — it drives the displayed value.
   */
  value?: number
  /**
   * Fires whenever the value changes (typed input or +/- button).
   *
   * Bug fix: previously was `() => void` with no payload — callers
   * couldn't actually read the new value, which made the component
   * write-only. Now passes the resulting numeric value so the caller
   * can wire it up to its own state.
   */
  onChange?: (value: number) => void
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  placeholder?: string
  id?: string
  /**
   * Form-engine binding key. Forwarded to the input as `name` for native form
   * submission and used by `useFieldBinding`/`FieldShell` to auto-bind value,
   * error, and required to the surrounding `<Form>`.
   */
  name?: string
  styles?: FieldStyleOverrides
}

/**
 * Integer stepper built on FieldShell with − and + buttons flanking a
 * centered digits-only input (one step per click, floor 0, no upper bound —
 * unlike InternalIncrement there is no press-and-hold auto-repeat).
 * `onChange` emits the plain numeric value — not a DOM event. Auto-binds by
 * `name` inside a goobs `<Form>` (the engine stores the number); otherwise
 * controlled via the numeric `value` or seeded from `initialValue`.
 */
const ExternalIncrementNumberField: React.FC<
  ExternalIncrementNumberFieldProps
> = ({
  initialValue = '0',
  value: valueProp,
  onChange: onChangeProp,
  label,
  helperText,
  error,
  dataField,
  dataFieldName,
  placeholder,
  id,
  name,
  styles,
}) => {
  // Tier-1 form binding. The canonical value is numeric (onChange emits a
  // number). When inside a <Form> with a `name` and no explicit value, the
  // value/onChange/onBlur come from the engine; otherwise the field stays
  // uncontrolled and seeds from `initialValue` exactly as before.
  const {
    value: boundNumericValue,
    onChange,
    onBlur,
  } = useFieldBinding<number>({
    name,
    value: valueProp,
    onChange: onChangeProp,
  })

  const [internalValue, setInternalValue] = useState(initialValue)

  // Sync the displayed string when a controlled/bound numeric value changes
  // (derived-state pattern). No-op for the uncontrolled back-compat path where
  // `boundNumericValue` is always undefined.
  const [prevBoundValue, setPrevBoundValue] = useState(boundNumericValue)
  if (boundNumericValue !== prevBoundValue) {
    setPrevBoundValue(boundNumericValue)
    if (boundNumericValue !== undefined && boundNumericValue !== null) {
      setInternalValue(String(boundNumericValue))
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

  // Listen for native 'input' events to support browser automation tools
  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const numValue = target.value.replace(/[^0-9]/g, '')
      const newValue = numValue === '' ? '0' : numValue
      if (newValue !== internalValue) {
        setInternalValue(newValue)
        const parsed = parseInt(newValue, 10)
        onChange?.(isNaN(parsed) ? 0 : parsed)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, internalValue])

  const handleIncrement = useCallback(() => {
    if (disabled) return
    setInternalValue((prev: string) => {
      const num = parseInt(prev, 10)
      const nextNum = isNaN(num) ? 0 : num + 1
      onChange?.(nextNum)
      return nextNum.toString()
    })
  }, [onChange, disabled])

  const handleDecrement = useCallback(() => {
    if (disabled) return
    setInternalValue((prev: string) => {
      const num = parseInt(prev, 10)
      const nextNum = Math.max(0, isNaN(num) ? 0 : num - 1)
      onChange?.(nextNum)
      return nextNum.toString()
    })
  }, [onChange, disabled])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = event.target.value.replace(/[^0-9]/g, '')
      const newValue = numValue === '' ? '0' : numValue
      setInternalValue(newValue)
      const parsed = parseInt(newValue, 10)
      onChange?.(isNaN(parsed) ? 0 : parsed)
    },
    [onChange]
  )

  // Keyboard operability for the spinbutton (WCAG 2.1.1 / APG spinbutton):
  // Up/Down arrows step the value and Home jumps to the floor (0). The
  // buttons are already keyboard-operable (native <button> onClick); this
  // makes the input itself a proper stepper for keyboard/AT users.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          handleIncrement()
          break
        case 'ArrowDown':
          event.preventDefault()
          handleDecrement()
          break
        case 'Home':
          event.preventDefault()
          setInternalValue('0')
          onChange?.(0)
          break
        default:
          break
      }
    },
    [disabled, handleIncrement, handleDecrement, onChange]
  )

  // Numeric snapshot for the spinbutton ARIA value semantics. Omitted (so
  // React drops the attribute) while the field is empty/non-numeric.
  const numericValue = Number.parseInt(internalValue, 10)
  const hasNumericValue = !Number.isNaN(numericValue)

  // Chrome lives in ExternalIncrement.module.css: a flex row so the +/-
  // buttons sit on either side of the centered numeric input. Colors fall
  // back to the FieldShell CSS variables; the disabled state is driven by
  // the native :disabled pseudo-class.

  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      name={name}
      filled={Boolean(internalValue && internalValue.length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div className={cssStyles.container}>
          <button
            type="button"
            aria-label="Decrease value"
            data-action="decrement"
            onClick={handleDecrement}
            disabled={disabled}
            className={cssStyles.button}
          >
            −
          </button>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={hasNumericValue ? numericValue : undefined}
            aria-valuemin={0}
            id={inputId}
            name={name}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            data-field-name={dataFieldName}
            className={cssStyles.input}
            {...inputAriaProps}
          />
          <button
            type="button"
            aria-label="Increase value"
            data-action="increment"
            onClick={handleIncrement}
            disabled={disabled}
            className={cssStyles.button}
          >
            +
          </button>
        </div>
      )}
    </FieldShell>
  )
}

ExternalIncrementNumberField.displayName = 'ExternalIncrementNumberField'

export default ExternalIncrementNumberField

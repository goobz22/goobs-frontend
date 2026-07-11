'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import cssStyles from './TextField.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'

export interface TextFieldProps {
  /** Controlled input value; the rendered text always mirrors this prop. */
  value: string
  /** Called on every edit with the plain string value — not the DOM change event. */
  onChange: (value: string) => void
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the input; sets aria-invalid. */
  error?: string | boolean | undefined
  /**
   * Marks the field required — renders the required indicator next to the label
   * and sets `aria-required` on the input. Top-level ergonomic alias for
   * `styles.required`; DEFAULTS from `styles?.required` when omitted, so every
   * existing `styles={{ required: true }}` callsite renders identically. When
   * both are set the top-level prop wins (same precedence FieldShell uses).
   */
  required?: boolean
  /** Node rendered inside the field frame before the input (icon, unit prefix, …). */
  startAdornment?: React.ReactNode
  /** Node rendered inside the field frame after the input. */
  endAdornment?: React.ReactNode
  placeholder?: string | undefined
  /**
   * Accessible name for the input when no visible `label` is rendered (bare
   * inputs in toolbars, data-table cells, search bars, …). A placeholder is
   * NOT an accessible name — it is not exposed as one to assistive tech and
   * vanishes on input, so an unlabelled field is anonymous to screen readers.
   * Forwarded as `aria-label` on the input/textarea. Prefer a visible `label`
   * when the UI allows; use this only for genuinely label-less layouts.
   */
  ariaLabel?: string
  /**
   * IDs of the element(s) that name the input, when its accessible name lives
   * in a separate visible element rather than the `label` prop. Forwarded as
   * `aria-labelledby` on the input/textarea (takes precedence over `ariaLabel`
   * per the ARIA name-computation order).
   */
  ariaLabelledby?: string
  /** Native input `type` (default 'text'). Ignored when `multiline` is set. */
  type?: string
  /**
   * Native HTML autofill token forwarded verbatim as `autoComplete` on the
   * input/textarea (e.g. `'name'`, `'email'`, `'username'`,
   * `'current-password'`, `'postal-code'`, `'one-time-code'`). Lets the browser
   * autofill and assistive tech identify the field's purpose — the mechanism
   * WCAG 1.3.5 Identify Input Purpose (AA) requires. The component cannot infer
   * purpose, so the consumer supplies the token; omitted → the attribute is not
   * emitted, so existing callsites render byte-for-byte identically.
   */
  autoComplete?: string
  /**
   * Native `inputMode` hint forwarded to the input/textarea — tells on-screen
   * keyboards which layout to present (`'numeric'`, `'tel'`, `'email'`, `'url'`,
   * `'decimal'`, `'search'`, …). Typed as the native React union; omitted → the
   * attribute is not emitted.
   */
  inputMode?: React.HTMLAttributes<HTMLElement>['inputMode']
  /** Renders a `<textarea>` instead of a single-line input (default false). */
  multiline?: boolean
  /** Minimum textarea height in rows (default 3; applied as 1.5em per row). */
  minRows?: number
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /**
   * Forwarded to the input as `name` for native form submission, and — unless
   * `dataFieldName` is set explicitly — also emitted as `data-field-name` so a
   * single `name="<entityFieldKey>"` gives both native binding and the stable
   * test anchor the recommender targets via `[data-field-name="<key>"]`.
   */
  name?: string
  styles?: FieldStyleOverrides & {
    // Layout/typography props specific to TextField that aren't on
    // FieldStyleOverrides — they apply to the inner input/textarea
    // rather than the shell wrapper.
    startAdornmentOffset?: string
    endAdornmentOffset?: string
    color?: string
    background?: string
    border?: string
  }
}

/**
 * Single- or multiline text input built on FieldShell, with label, helper text,
 * error and required states, and optional start/end adornments. Auto-binds its
 * value by `name` when rendered inside a goobs `<Form>`; otherwise it is a
 * controlled input.
 */
const TextField: React.FC<TextFieldProps> = ({
  value: valueProp,
  onChange: onChangeProp,
  onFocus,
  onBlur,
  onKeyDown,
  label,
  helperText,
  error,
  required: requiredProp,
  startAdornment,
  endAdornment,
  placeholder,
  ariaLabel,
  ariaLabelledby,
  type = 'text',
  multiline = false,
  minRows = 3,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Tier-1 form binding. When this field is rendered inside a <Form> with a
  // `name` and no explicit `value`, the engine drives value/onChange; touched
  // is marked via the returned bindingOnBlur (chained into handleBlur below).
  // Outside a form, or with an explicit value, this is a byte-for-byte
  // pass-through. The returned value/onChange SHADOW the incoming props so all
  // downstream code uses the bound versions unchanged.
  const {
    value,
    onChange: rebindOnChange,
    onBlur: bindingOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valueProp,
    onChange: onChangeProp,
    onBlur: undefined,
  })
  // onChange is required on TextFieldProps, so it is always defined when
  // unbound; the binding hook supplies a bound handler when bound.
  const onChange = rebindOnChange ?? onChangeProp

  // Focus state still tracked for the multiline textarea wrapper because
  // CSS modules drive its border styling via a class. Inputs use
  // `:focus-visible` selectors and don't need this state.
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = styles?.disabled || false
  // Top-level `required` prop wins; falls back to `styles.required` so existing
  // `styles={{ required: true }}` callsites are unaffected (same precedence
  // FieldShell applies). The `?? false` keeps the native input attribute a
  // plain boolean.
  const required = requiredProp ?? styles?.required ?? false

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false)
      // Mark the form field touched when bound (no-op outside a <Form>),
      // then run the caller's FocusEvent onBlur unchanged.
      bindingOnBlur?.()
      onBlur?.(e)
    },
    [bindingOnBlur, onBlur]
  )

  const handleContainerClick = () => {
    if (multiline) {
      textareaRef.current?.focus()
    } else {
      inputRef.current?.focus()
    }
  }

  // Listen for native input events from browser-automation tools
  // (e.g. agent-browser's form_input) that set `input.value` directly
  // and dispatch a native `input` event, bypassing React's synthetic
  // event system. Without this listener the test-driven value gets
  // out of sync with React state.
  useEffect(() => {
    const el = multiline ? textareaRef.current : inputRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      if (target.value !== value) {
        onChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [multiline, onChange, value])

  const hasStartAdornment = !!startAdornment
  const hasEndAdornment = !!endAdornment

  const wrapperClassNames = [
    cssStyles.inputWrapper,
    multiline && cssStyles.multiline,
    isFocused && cssStyles.focused,
    disabled && cssStyles.disabled,
  ]
    .filter(Boolean)
    .join(' ')

  const inputClassNames = [
    multiline ? cssStyles.textarea : cssStyles.input,
    hasStartAdornment && cssStyles.hasStartAdornment,
    hasEndAdornment && cssStyles.hasEndAdornment,
  ]
    .filter(Boolean)
    .join(' ')

  // The TextField-local color/border overrides on the inner wrapper
  // (background/border/borderRadius). These don't fit the CSS-var
  // contract because the inner input wrapper has its own CSS module
  // classes; we still forward them as inline-style overrides for
  // back-compat with consumers who pass these props.
  const wrapperStyleOverrides: React.CSSProperties = {}
  if (styles?.background || styles?.backgroundColor) {
    wrapperStyleOverrides.backgroundColor =
      styles.background || styles.backgroundColor
  }
  if (styles?.border) wrapperStyleOverrides.border = styles.border
  if (styles?.borderWidth || styles?.borderColor) {
    if (styles.borderWidth)
      wrapperStyleOverrides.borderWidth = styles.borderWidth
    if (styles.borderColor)
      wrapperStyleOverrides.borderColor = styles.borderColor
  }
  if (styles?.borderRadius) {
    wrapperStyleOverrides.borderRadius = styles.borderRadius
  }

  const inputStyleOverrides: React.CSSProperties = {}
  if (styles?.padding) inputStyleOverrides.padding = styles.padding
  if (styles?.paddingLeft) inputStyleOverrides.paddingLeft = styles.paddingLeft
  if (styles?.paddingRight) {
    inputStyleOverrides.paddingRight = styles.paddingRight
  }
  if (styles?.paddingTop) inputStyleOverrides.paddingTop = styles.paddingTop
  if (styles?.paddingBottom) {
    inputStyleOverrides.paddingBottom = styles.paddingBottom
  }
  if (styles?.fontSize) inputStyleOverrides.fontSize = styles.fontSize
  if (styles?.fontWeight) inputStyleOverrides.fontWeight = styles.fontWeight
  if (styles?.fontFamily) inputStyleOverrides.fontFamily = styles.fontFamily
  if (styles?.lineHeight) inputStyleOverrides.lineHeight = styles.lineHeight
  if (styles?.textColor || styles?.color) {
    inputStyleOverrides.color = styles.textColor || styles.color
  }
  if (hasStartAdornment && styles?.startAdornmentOffset) {
    inputStyleOverrides.paddingLeft = styles.startAdornmentOffset
  }
  if (hasEndAdornment && styles?.endAdornmentOffset) {
    inputStyleOverrides.paddingRight = styles.endAdornmentOffset
  }
  if (multiline) {
    inputStyleOverrides.minHeight = `${minRows * 1.5}em`
  }

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
      filled={Boolean(value && value.length > 0)}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => (
        <div
          className={wrapperClassNames}
          onClick={handleContainerClick}
          style={
            Object.keys(wrapperStyleOverrides).length > 0
              ? wrapperStyleOverrides
              : undefined
          }
        >
          {startAdornment && (
            <div
              className={`${cssStyles.adornment} ${cssStyles.adornmentStart}`}
            >
              {startAdornment}
            </div>
          )}

          {multiline ? (
            <textarea
              ref={textareaRef}
              id={inputId}
              name={name}
              className={inputClassNames}
              value={value || ''}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
              disabled={disabled}
              required={required}
              placeholder={placeholder}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              data-field-name={dataFieldName ?? name}
              style={
                Object.keys(inputStyleOverrides).length > 0
                  ? inputStyleOverrides
                  : undefined
              }
              {...inputAriaProps}
            />
          ) : (
            <input
              ref={inputRef}
              id={inputId}
              name={name}
              className={inputClassNames}
              type={type}
              value={value || ''}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={onKeyDown}
              disabled={disabled}
              required={required}
              placeholder={placeholder}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              data-field-name={dataFieldName ?? name}
              style={
                Object.keys(inputStyleOverrides).length > 0
                  ? inputStyleOverrides
                  : undefined
              }
              {...inputAriaProps}
            />
          )}

          {endAdornment && (
            <div className={`${cssStyles.adornment} ${cssStyles.adornmentEnd}`}>
              {endAdornment}
            </div>
          )}
        </div>
      )}
    </FieldShell>
  )
}

TextField.displayName = 'TextField'

export default TextField

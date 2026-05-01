'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import cssStyles from './TextField.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'

export interface TextFieldProps {
  value: string
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
  error?: string | boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  placeholder?: string | undefined
  type?: string
  multiline?: boolean
  minRows?: number
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Forwarded to the input as `name` for native form submission. */
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

const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  label,
  helperText,
  error,
  startAdornment,
  endAdornment,
  placeholder,
  type = 'text',
  multiline = false,
  minRows = 3,
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Focus state still tracked for the multiline textarea wrapper because
  // CSS modules drive its border styling via a class. Inputs use
  // `:focus-visible` selectors and don't need this state.
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false

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
      onBlur?.(e)
    },
    [onBlur]
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
              data-field-name={dataFieldName}
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
              data-field-name={dataFieldName}
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

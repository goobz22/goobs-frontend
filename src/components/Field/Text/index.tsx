'use client'

import React, { useState, useRef, useCallback } from 'react'
import cssStyles from './TextField.module.css'

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
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  placeholder?: string | undefined
  type?: string
  multiline?: boolean
  minRows?: number
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: 'sacred' | 'light' | 'dark'
    width?: string
    minWidth?: string
    maxWidth?: string
    height?: string
    minHeight?: string
    maxHeight?: string
    marginTop?: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    padding?: string
    paddingLeft?: string
    paddingRight?: string
    paddingTop?: string
    paddingBottom?: string
    fontSize?: string
    fontWeight?: string | number
    fontFamily?: string
    lineHeight?: string
    borderWidth?: string
    borderRadius?: string
    startAdornmentOffset?: string
    endAdornmentOffset?: string
    helperTextType?: 'error' | 'info'
    requiredIndicatorText?: string
    backgroundColor?: string
    borderColor?: string
    color?: string
    textColor?: string
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
  startAdornment,
  endAdornment,
  placeholder,
  type = 'text',
  multiline = false,
  minRows = 3,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const theme = styles?.theme || 'sacred'

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

  const hasStartAdornment = !!startAdornment
  const hasEndAdornment = !!endAdornment

  // Build wrapper class names
  const wrapperClassNames = [
    cssStyles.inputWrapper,
    multiline && cssStyles.multiline,
    isFocused && cssStyles.focused,
    disabled && cssStyles.disabled,
  ]
    .filter(Boolean)
    .join(' ')

  // Build input class names
  const inputClassNames = [
    multiline ? cssStyles.textarea : cssStyles.input,
    hasStartAdornment && cssStyles.hasStartAdornment,
    hasEndAdornment && cssStyles.hasEndAdornment,
  ]
    .filter(Boolean)
    .join(' ')

  // Build helper text class names
  const helperTextClassNames = [
    cssStyles.helperText,
    styles?.helperTextType === 'error' && cssStyles.error,
  ]
    .filter(Boolean)
    .join(' ')

  // Container style overrides (only explicit props)
  const containerStyleOverrides: React.CSSProperties = {}
  if (styles?.width) containerStyleOverrides.width = styles.width
  if (styles?.minWidth) containerStyleOverrides.minWidth = styles.minWidth
  if (styles?.maxWidth) containerStyleOverrides.maxWidth = styles.maxWidth
  if (styles?.height) containerStyleOverrides.height = styles.height
  if (styles?.minHeight) containerStyleOverrides.minHeight = styles.minHeight
  if (styles?.maxHeight) containerStyleOverrides.maxHeight = styles.maxHeight
  if (styles?.marginTop) containerStyleOverrides.marginTop = styles.marginTop
  if (styles?.marginBottom)
    containerStyleOverrides.marginBottom = styles.marginBottom
  if (styles?.marginLeft) containerStyleOverrides.marginLeft = styles.marginLeft
  if (styles?.marginRight)
    containerStyleOverrides.marginRight = styles.marginRight

  // Input wrapper style overrides
  const wrapperStyleOverrides: React.CSSProperties = {}
  if (styles?.background || styles?.backgroundColor)
    wrapperStyleOverrides.backgroundColor =
      styles.background || styles.backgroundColor
  if (styles?.border) wrapperStyleOverrides.border = styles.border
  if (styles?.borderWidth || styles?.borderColor) {
    wrapperStyleOverrides.borderWidth = styles.borderWidth
    wrapperStyleOverrides.borderColor = styles.borderColor
  }
  if (styles?.borderRadius)
    wrapperStyleOverrides.borderRadius = styles.borderRadius

  // Input style overrides
  const inputStyleOverrides: React.CSSProperties = {}
  if (styles?.padding) inputStyleOverrides.padding = styles.padding
  if (styles?.paddingLeft) inputStyleOverrides.paddingLeft = styles.paddingLeft
  if (styles?.paddingRight)
    inputStyleOverrides.paddingRight = styles.paddingRight
  if (styles?.paddingTop) inputStyleOverrides.paddingTop = styles.paddingTop
  if (styles?.paddingBottom)
    inputStyleOverrides.paddingBottom = styles.paddingBottom
  if (styles?.fontSize) inputStyleOverrides.fontSize = styles.fontSize
  if (styles?.fontWeight) inputStyleOverrides.fontWeight = styles.fontWeight
  if (styles?.fontFamily) inputStyleOverrides.fontFamily = styles.fontFamily
  if (styles?.lineHeight) inputStyleOverrides.lineHeight = styles.lineHeight
  if (styles?.textColor || styles?.color)
    inputStyleOverrides.color = styles.textColor || styles.color
  if (hasStartAdornment && styles?.startAdornmentOffset)
    inputStyleOverrides.paddingLeft = styles.startAdornmentOffset
  if (hasEndAdornment && styles?.endAdornmentOffset)
    inputStyleOverrides.paddingRight = styles.endAdornmentOffset
  if (multiline) inputStyleOverrides.minHeight = `${minRows * 1.5}em`

  return (
    <div
      className={cssStyles.container}
      data-theme={theme}
      style={
        Object.keys(containerStyleOverrides).length > 0
          ? containerStyleOverrides
          : undefined
      }
    >
      {label && (
        <label className={cssStyles.label}>
          {typeof label === 'string' ? (
            <>
              {label}
              {required && (
                <span className={cssStyles.requiredIndicator}>
                  {styles?.requiredIndicatorText || '*'}
                </span>
              )}
            </>
          ) : (
            label
          )}
        </label>
      )}

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
          <div className={`${cssStyles.adornment} ${cssStyles.adornmentStart}`}>
            {startAdornment}
          </div>
        )}

        {multiline ? (
          <textarea
            ref={textareaRef}
            className={inputClassNames}
            value={value || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            style={
              Object.keys(inputStyleOverrides).length > 0
                ? inputStyleOverrides
                : undefined
            }
          />
        ) : (
          <input
            ref={inputRef}
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
            style={
              Object.keys(inputStyleOverrides).length > 0
                ? inputStyleOverrides
                : undefined
            }
          />
        )}

        {endAdornment && (
          <div className={`${cssStyles.adornment} ${cssStyles.adornmentEnd}`}>
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && <div className={helperTextClassNames}>{helperText}</div>}
    </div>
  )
}

TextField.displayName = 'TextField'

export default TextField

'use client'

import React from 'react'
import cssStyles from './DateField.module.css'

export interface DateFieldProps {
  label?: string
  value?: Date | null
  onChange: (date: Date | null) => void
  variant?: string
  disableFutureDateValidation?: boolean
  placeholder?: string
  styles?: {
    disabled?: boolean
    required?: boolean
    theme?: 'sacred' | 'light' | 'dark'
    helperTextType?: 'error' | 'info'
    height?: string
    fontSize?: string
    borderRadius?: string
    marginBottom?: string
    marginTop?: string
    width?: string
    minHeight?: string
    padding?: string
  }
  helperText?: string
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  styles,
  helperText,
}) => {
  const disabled = styles?.disabled || false
  const required = styles?.required || false
  const theme = styles?.theme || 'sacred'

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      const date = new Date(dateString + 'T00:00:00')
      onChange(date)
    } else {
      onChange(null)
    }
  }

  // Build helper text class names
  const helperTextClassNames = [
    cssStyles.helperText,
    styles?.helperTextType === 'error' && cssStyles.error,
  ]
    .filter(Boolean)
    .join(' ')

  // Container style overrides
  const containerStyleOverrides: React.CSSProperties = {}
  if (styles?.width) containerStyleOverrides.width = styles.width
  if (styles?.marginBottom)
    containerStyleOverrides.marginBottom = styles.marginBottom
  if (styles?.marginTop) containerStyleOverrides.marginTop = styles.marginTop
  if (styles?.minHeight) containerStyleOverrides.minHeight = styles.minHeight

  // Input style overrides
  const inputStyleOverrides: React.CSSProperties = {}
  if (styles?.height) inputStyleOverrides.minHeight = styles.height
  if (styles?.fontSize) inputStyleOverrides.fontSize = styles.fontSize
  if (styles?.padding) inputStyleOverrides.padding = styles.padding
  if (styles?.borderRadius)
    inputStyleOverrides.borderRadius = styles.borderRadius

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
      {/* Label */}
      {label && (
        <label className={cssStyles.label}>
          {label}
          {required && <span className={cssStyles.requiredIndicator}>*</span>}
        </label>
      )}

      {/* Date Input */}
      <input
        type="date"
        className={cssStyles.input}
        value={formatDateForInput(value || null)}
        onChange={handleDateChange}
        disabled={disabled}
        style={
          Object.keys(inputStyleOverrides).length > 0
            ? inputStyleOverrides
            : undefined
        }
      />

      {/* Helper Text */}
      {helperText && <div className={helperTextClassNames}>{helperText}</div>}
    </div>
  )
}

export default DateField

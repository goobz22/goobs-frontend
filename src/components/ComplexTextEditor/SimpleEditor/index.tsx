// src/components/ComplexTextEditor/SimpleEditor/index.tsx

'use client'
import React, { useState } from 'react'
import type { ComplexTextEditorStyles } from '../../../theme/'

type SimpleEditorProps = {
  value: string
  onChange: (value: string) => void
  minRows?: number
  placeholder?: string
  styles?: ComplexTextEditorStyles
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  onChange,
  minRows = 4,
  placeholder,
  styles,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const isSacred = styles?.theme === 'sacred'
  const isDark = styles?.theme === 'dark'

  const bgColor = isSacred
    ? 'rgba(0, 0, 0, 0.95)'
    : isDark
      ? '#1F2937'
      : '#FFFFFF'

  const borderColor = isSacred
    ? isFocused
      ? 'rgba(255, 215, 0, 0.5)'
      : 'rgba(255, 215, 0, 0.3)'
    : isDark
      ? '#374151'
      : '#E5E7EB'

  const textColor = isSacred ? '#FFD700' : isDark ? '#F9FAFB' : '#1F2937'

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
    color: textColor,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    minHeight: `${minRows * 1.5}rem`,
    resize: 'vertical' as const,
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
    ...(isSacred && {
      boxShadow: isFocused
        ? '0 0 20px rgba(255, 215, 0, 0.3)'
        : '0 0 8px rgba(255, 215, 0, 0.1)',
    }),
  }

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder || 'Enter text...'}
      style={textareaStyle}
    />
  )
}

export default SimpleEditor

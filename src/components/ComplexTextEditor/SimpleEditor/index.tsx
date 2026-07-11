// src/components/ComplexTextEditor/SimpleEditor/index.tsx

'use client'
import React, { useRef, useEffect } from 'react'
import type { ComplexTextEditorStyles } from '../theme'
import cssStyles from '../ComplexTextEditor.module.css'

type SimpleEditorProps = {
  value: string
  onChange: (value: string) => void
  minRows?: number
  placeholder?: string
  styles?: ComplexTextEditorStyles
  /** Accessible name for the textarea (used when no visible label is linked). */
  ariaLabel?: string
  /** Id of the visible label element to associate with the textarea. */
  ariaLabelledBy?: string
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  onChange,
  minRows = 4,
  placeholder,
  styles,
  ariaLabel,
  ariaLabelledBy,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Listen for native input events from browser automation tools
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement
      if (target.value !== value) {
        onChange(target.value)
      }
    }

    el.addEventListener('input', handleNativeInput)
    return () => el.removeEventListener('input', handleNativeInput)
  }, [onChange, value])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  // Measured min-height (minRows * 1.5rem) stays in JS as a CSS custom prop.
  const dynamicStyle = {
    ['--ct-simple-min-height']: `${minRows * 1.5}rem`,
  } as React.CSSProperties

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder || 'Enter text...'}
      className={cssStyles.simpleTextarea}
      data-theme={styles?.theme || 'light'}
      {...(ariaLabelledBy
        ? { 'aria-labelledby': ariaLabelledBy }
        : ariaLabel
          ? { 'aria-label': ariaLabel }
          : {})}
      style={dynamicStyle}
    />
  )
}

export default SimpleEditor

// src/components/ComplexTextEditor/MarkdownEditor/index.tsx

'use client'
import React, { useEffect, useState, useRef } from 'react'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Editor'
import {
  getComplexTextEditorStyles,
  type ComplexTextEditorStyles,
} from '../../../theme/'
import { mdToHtml } from '../utils/conversion'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void

  minRows?: number
  styles?: ComplexTextEditorStyles
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  minRows,
  styles,
}) => {
  // Use value prop directly - this is a controlled component
  // No internal state needed for the value itself
  const [selectedText, setSelectedText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const hasInsertedKeyframes = useRef(false)
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

  const isSacredTheme = styles?.theme === 'sacred'

  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(styles, isFocused)

  // CSS keyframes for sacred animations - only insert once
  useEffect(() => {
    if (isSacredTheme && !hasInsertedKeyframes.current) {
      const styleSheet = document.styleSheets?.[0]
      const keyframes = `
        @keyframes markdownEditorCodeGlow {
          0%, 100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
          50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        }
        @keyframes markdownEditorGlyphRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `
      try {
        if (styleSheet) {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
          hasInsertedKeyframes.current = true
        }
      } catch {
        // Keyframes might already exist
        hasInsertedKeyframes.current = true
      }
    }
  }, [isSacredTheme])

  const handleLocalMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange(event.target.value)
  }

  const handleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    setSelectedText(
      target.value.substring(target.selectionStart, target.selectionEnd)
    )
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleBold = () => handleBoldClick(selectedText, value, onChange)
  const handleItalic = () => handleItalicClick(selectedText, value, onChange)

  // Get textarea style
  const textareaStyle: React.CSSProperties = {
    ...computedStyles.editorArea,
    boxSizing: 'border-box',
    width: showPreview ? '50%' : '100%',
    maxWidth: '100%',
    minWidth: '0',
    fontFamily: 'monospace',
    border: 'none',
    outline: 'none',
    resize: 'vertical' as const,
    ...(isSacredTheme && {
      animation: 'markdownEditorCodeGlow 4s ease-in-out infinite',
    }),
  }

  // Label is now handled by parent component

  return (
    <div
      style={{
        ...computedStyles.container,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Toolbar
        handleBoldClick={handleBold}
        handleItalicClick={handleItalic}
        markdownMode={true}
        setMarkdown={onChange}
        toolbarType="markdown"
        styles={styles as ComplexTextEditorStyles}
      />
      <button onClick={() => setShowPreview(!showPreview)}>
        Toggle Preview
      </button>
      <div style={{ display: 'flex' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleLocalMarkdownChange}
          onSelect={handleSelect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={
            isSacredTheme
              ? 'Compose your markdown scripture...'
              : 'Enter markdown...'
          }
          style={textareaStyle}
          rows={minRows || 10}
        />
        {showPreview && (
          <div
            style={{ width: '50%', borderLeft: '1px solid' }}
            dangerouslySetInnerHTML={{ __html: mdToHtml(value) }}
          />
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor

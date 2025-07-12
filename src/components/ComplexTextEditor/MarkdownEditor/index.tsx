// src/components/ComplexTextEditor/MarkdownEditor/index.tsx

'use client'
import React, { useEffect, useState } from 'react'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Editor'
import { RichTextEditorTypes } from '../utils/useRichtextEditor'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
  SACRED_GLYPHS,
} from '../../../theme/'

type MarkdownEditorProps = {
  markdown: string
  setMarkdown: (value: string) => void
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setNewSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void
  styles?: ComplexTextEditorStyles
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  setMarkdown,
  markdownMode,
  setMarkdownMode,
  styles,
}) => {
  const [markdownValue, setMarkdownValue] = useState(markdown)
  const [selectedText, setSelectedText] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isSacredTheme = styles?.theme === 'sacred'

  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(styles, isFocused)

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
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
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [isSacredTheme])

  useEffect(() => {
    if (!markdownMode) {
      // Perform any action you want when markdownMode changes to false
    }
  }, [markdownMode])

  useEffect(() => {
    if (markdown !== markdownValue) {
      setMarkdownValue(markdown)
    }
  }, [markdown, markdownValue])

  const handleLocalMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value
    setMarkdownValue(newValue)
    setMarkdown(newValue)
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

  // Get textarea style
  const textareaStyle: React.CSSProperties = {
    ...computedStyles.editorArea,
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: 'monospace',
    border: 'none',
    outline: 'none',
    resize: 'vertical' as const,
    ...(isSacredTheme && {
      animation: 'markdownEditorCodeGlow 4s ease-in-out infinite',
    }),
  }

  return (
    <div style={computedStyles.editorArea}>
      <Toolbar
        markdownMode={markdownMode}
        setMarkdownMode={setMarkdownMode}
        setMarkdown={setMarkdown}
        handleBoldClick={() =>
          handleBoldClick(selectedText, markdown, setMarkdown)
        }
        handleItalicClick={() =>
          handleItalicClick(selectedText, markdown, setMarkdown)
        }
        toolbarType="markdown"
        styles={styles}
      />
      <div style={{ position: 'relative' }}>
        <textarea
          value={markdownValue}
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
          rows={10}
        />
        {isSacredTheme && (
          <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[1]}</div>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor

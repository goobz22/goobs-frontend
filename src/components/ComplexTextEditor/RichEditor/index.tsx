// src/components/ComplexTextEditor/RichEditor/index.tsx

'use client'
import React, { useState, useEffect, useRef } from 'react'
import Toolbar from '../Toolbars/Editor'
import Typography from '../../Typography'
import Accordion from '../../Accordion'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
  getSharedFormFieldStyles,
  SACRED_GLYPHS,
} from '../../../theme/'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void

  minRows?: number
  styles?: ComplexTextEditorStyles
}

export function RichTextEditor({
  value,
  onChange,
  minRows = 5,
  styles: editorStyles,
}: RichTextEditorProps) {
  const accordion = editorStyles?.accordionMode || false
  const accordionSummary = editorStyles?.accordionSummary || 'Rich Text Editor'
  const defaultExpanded = editorStyles?.accordionDefaultExpanded || false
  const isSacredTheme = editorStyles?.theme === 'sacred'

  const [isFocused, setIsFocused] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)

  const editorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])
  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }
  const execCmd = (cmd: string, val: any = null) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
    handleInput()
  }
  const handleBoldClick = () => execCmd('bold')
  const handleItalicClick = () => execCmd('italic')
  const handleUnderlineClick = () => execCmd('underline')
  const handleStrikethroughClick = () => execCmd('strikeThrough')
  const handleCodeClick = () => execCmd('formatBlock', '<pre>') // rough
  const handleLinkClick = () => {
    const url = prompt('Enter URL')
    if (url) execCmd('createLink', url)
  }
  const handleUndo = () => execCmd('undo')
  const handleRedo = () => execCmd('redo')
  const handleAlign = (align: string) =>
    execCmd(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`)
  const handleTextType = (type: string) => execCmd('formatBlock', `<${type}>`)
  const handleBulletedList = () => execCmd('insertUnorderedList')
  const handleNumberedList = () => execCmd('insertOrderedList')

  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(editorStyles, isFocused)
  const { themeConfig } = getSharedFormFieldStyles(editorStyles, isFocused)

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes richTextEditorBorderPulse {
          0%, 100% { border-color: rgba(255, 215, 0, 0.3); }
          50% { border-color: rgba(255, 215, 0, 0.6); }
        }
        @keyframes richTextEditorTextGlow {
          0%, 100% { text-shadow: 0 0 3px rgba(255, 215, 0, 0.3); }
          50% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.5); }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [isSacredTheme])

  const handleAccordionChange = () => {
    setExpanded(!expanded)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const editorContent = (
    <div
      style={{
        ...computedStyles.editorArea,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Toolbar
        handleBoldClick={handleBoldClick}
        handleItalicClick={handleItalicClick}
        handleUnderlineClick={handleUnderlineClick}
        handleStrikethroughClick={handleStrikethroughClick}
        handleCodeClick={handleCodeClick}
        handleLinkClick={handleLinkClick}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleAlign={handleAlign}
        handleTextType={handleTextType}
        handleBulletedList={handleBulletedList}
        handleNumberedList={handleNumberedList}
        markdownMode={false}
        setMarkdown={() => {}}
        toolbarType="richtext"
        styles={editorStyles}
      />
      <div style={{ position: 'relative' }}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{
            minHeight: `${minRows * 20}px`,
            outline: 'none',
            width: '100%',
            maxWidth: '100%',
            minWidth: '0',
            boxSizing: 'border-box',
          }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        {isSacredTheme && (
          <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[2]}</div>
        )}
      </div>
    </div>
  )

  // Label is now handled by parent component

  return (
    <div style={computedStyles.container}>
      {accordion ? (
        <Accordion
          expanded={expanded}
          onChange={handleAccordionChange}
          styles={{ theme: editorStyles?.theme }}
          summary={
            <Typography
              variant="merrih4"
              styles={isSacredTheme ? { color: themeConfig.text } : undefined}
            >
              {accordionSummary}
            </Typography>
          }
          details={editorContent}
        />
      ) : (
        <>{editorContent}</>
      )}
    </div>
  )
}

export default RichTextEditor

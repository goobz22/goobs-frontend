// src/components/ComplexTextEditor/MarkdownEditor/index.tsx

'use client'
import React, { useEffect, useState, useRef } from 'react'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Editor'
import {
  buildEditorAreaOverrideStyle,
  buildToolbarOverrideStyle,
  buildTransitionOverride,
  type ComplexTextEditorStyles,
} from '../theme'
import cssStyles from '../ComplexTextEditor.module.css'
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
  const [showPreview, setShowPreview] = useState(false)
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
  const theme = styles?.theme || 'light'

  // Caller overrides re-wired as CSS custom properties (was the old
  // getComplexTextEditorTheme editorArea / toolbar / transition branches).
  const editorAreaOverrideStyle = buildEditorAreaOverrideStyle(styles)
  const toolbarOverrideStyle = buildToolbarOverrideStyle(styles)
  const transitionOverride = buildTransitionOverride(styles)
  const containerOverrideStyle: React.CSSProperties | undefined =
    transitionOverride
      ? ({ ['--ct-transition']: transitionOverride } as React.CSSProperties)
      : undefined

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

  const handleBold = () => handleBoldClick(selectedText, value, onChange)
  const handleItalic = () => handleItalicClick(selectedText, value, onChange)

  // Label is now handled by parent component

  return (
    <div
      className={cssStyles.container}
      data-theme={theme}
      {...(containerOverrideStyle && { style: containerOverrideStyle })}
    >
      <Toolbar
        {...(toolbarOverrideStyle && { wrapperStyle: toolbarOverrideStyle })}
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
      <div className={cssStyles.markdownRow}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleLocalMarkdownChange}
          onSelect={handleSelect}
          placeholder={
            isSacredTheme
              ? 'Compose your markdown scripture...'
              : 'Enter markdown...'
          }
          className={cssStyles.markdownTextarea}
          data-theme={theme}
          {...(editorAreaOverrideStyle && { style: editorAreaOverrideStyle })}
          {...(showPreview && { 'data-preview': 'true' })}
          {...(styles?.helperTextType === 'error' && {
            'data-state': 'error',
          })}
          rows={minRows || 10}
        />
        {showPreview && (
          <div
            className={cssStyles.markdownPreview}
            dangerouslySetInnerHTML={{ __html: mdToHtml(value) }}
          />
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor

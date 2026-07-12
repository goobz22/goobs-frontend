// src/components/ComplexTextEditor/MarkdownEditor/index.tsx

'use client'
import React, { useEffect, useState, useRef, useId } from 'react'
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
  /** Accessible name for the textarea (used when no visible label is linked). */
  ariaLabel?: string | undefined
  /** Id of the visible label element to associate with the textarea. */
  ariaLabelledBy?: string | undefined
  /** Stable id for this editing surface — the visible `<label htmlFor>` targets it so clicking the label focuses the textarea. */
  editorId?: string | undefined
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  minRows,
  styles,
  ariaLabel,
  ariaLabelledBy,
  editorId,
}) => {
  // Use value prop directly - this is a controlled component
  // No internal state needed for the value itself
  const [selectedText, setSelectedText] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  // Screen-reader announcement channel for the preview toggle. Sighted users
  // see the preview pane appear/disappear directly; AT users need the context
  // change spoken (WCAG 4.1.3 Status Messages). Starts empty so nothing is
  // announced on mount — populated only when the user toggles.
  const [announcement, setAnnouncement] = useState('')
  const previewId = useId()
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

  const handleTogglePreview = () => {
    const next = !showPreview
    setShowPreview(next)
    setAnnouncement(next ? 'Markdown preview shown' : 'Markdown preview hidden')
  }

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
      {/* type=button so it never submits an enclosing goobs <Form>;
          aria-pressed exposes the on/off preview state; aria-controls links it
          to the rendered preview region (WCAG 4.1.2). aria-controls is only set
          while the preview is shown — the element carrying `id={previewId}` is
          only rendered then, so referencing it when collapsed would be a
          dangling IDREF (invalid ARIA relation, ARIA 1.2). */}
      <button
        type="button"
        onClick={handleTogglePreview}
        aria-pressed={showPreview}
        data-action="toggle"
        {...(showPreview && { 'aria-controls': previewId })}
      >
        Toggle Preview
      </button>
      {/* Polite live region announcing the preview show/hide to screen readers
          (WCAG 4.1.3). Visually hidden; empty until the first toggle. */}
      <span role="status" aria-live="polite" className={cssStyles.srOnly}>
        {announcement}
      </span>
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
          {...(editorId && { id: editorId })}
          {...(ariaLabelledBy
            ? { 'aria-labelledby': ariaLabelledBy }
            : ariaLabel
              ? { 'aria-label': ariaLabel }
              : {})}
          {...(editorAreaOverrideStyle && { style: editorAreaOverrideStyle })}
          {...(showPreview && { 'data-preview': 'true' })}
          {...(styles?.helperTextType === 'error' && {
            'data-state': 'error',
          })}
          rows={minRows || 10}
        />
        {showPreview && (
          <div
            id={previewId}
            className={cssStyles.markdownPreview}
            dangerouslySetInnerHTML={{ __html: mdToHtml(value) }}
          />
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor

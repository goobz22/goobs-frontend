// src/components/ComplexTextEditor/RichEditor/index.tsx

'use client'
import React, { useState, useEffect, useRef } from 'react'
import Toolbar from '../Toolbars/Editor'
import Typography from '../../Typography'
import Accordion from '../../Accordion'
import {
  buildEditorAreaOverrideStyle,
  buildToolbarOverrideStyle,
  buildTransitionOverride,
  type ComplexTextEditorStyles,
} from '../theme'
import cssStyles from '../ComplexTextEditor.module.css'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void

  minRows?: number
  styles?: ComplexTextEditorStyles
  /** Accessible name for the editable surface (used when no visible label is linked). */
  ariaLabel?: string | undefined
  /** Id of the visible label element to associate with the editable surface. */
  ariaLabelledBy?: string | undefined
}

export function RichTextEditor({
  value,
  onChange,
  minRows = 5,
  styles: editorStyles,
  ariaLabel,
  ariaLabelledBy,
}: RichTextEditorProps) {
  const accordion = editorStyles?.accordionMode || false
  const accordionSummary = editorStyles?.accordionSummary || 'Rich Text Editor'
  const defaultExpanded = editorStyles?.accordionDefaultExpanded || false
  const theme = editorStyles?.theme || 'light'

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
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
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

  const handleAccordionChange = () => {
    setExpanded(!expanded)
  }

  // Measured min-height (minRows * 20px) stays in JS as a CSS custom prop.
  const surfaceStyle = {
    ['--ct-rich-min-height']: `${minRows * 20}px`,
  } as React.CSSProperties

  // Caller overrides re-wired as CSS custom properties (was the old
  // getComplexTextEditorTheme editorArea / toolbar / transition branches).
  const editorAreaOverrideStyle = buildEditorAreaOverrideStyle(editorStyles)
  const toolbarOverrideStyle = buildToolbarOverrideStyle(editorStyles)
  const transitionOverride = buildTransitionOverride(editorStyles)
  const containerOverrideStyle: React.CSSProperties | undefined =
    transitionOverride
      ? ({ ['--ct-transition']: transitionOverride } as React.CSSProperties)
      : undefined

  const editorContent = (
    <div
      className={cssStyles.editorArea}
      data-theme={theme}
      {...(editorAreaOverrideStyle && { style: editorAreaOverrideStyle })}
      {...(editorStyles?.helperTextType === 'error' && {
        'data-state': 'error',
      })}
    >
      <Toolbar
        {...(toolbarOverrideStyle && { wrapperStyle: toolbarOverrideStyle })}
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
        styles={editorStyles as ComplexTextEditorStyles}
      />
      <div className={cssStyles.richSurfaceWrap}>
        {/* role=textbox + aria-multiline expose the contenteditable as a
            multi-line text field, and the threaded label gives it an
            accessible name (WCAG 1.3.1 / 4.1.2). */}
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          {...(ariaLabelledBy
            ? { 'aria-labelledby': ariaLabelledBy }
            : ariaLabel
              ? { 'aria-label': ariaLabel }
              : {})}
          onInput={handleInput}
          className={cssStyles.richSurface}
          style={surfaceStyle}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  )

  // Label is now handled by parent component

  return (
    <div
      className={cssStyles.container}
      data-theme={theme}
      {...(containerOverrideStyle && { style: containerOverrideStyle })}
    >
      {accordion ? (
        <Accordion
          expanded={expanded}
          onChange={handleAccordionChange}
          styles={{ theme: editorStyles?.theme || 'light' }}
          summary={
            <Typography
              styles={{
                theme: 'sacred',
                variant: 'cinzelh4',
              }}
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

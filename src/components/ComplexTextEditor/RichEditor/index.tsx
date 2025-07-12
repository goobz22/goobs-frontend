// src/components/ComplexTextEditor/RichEditor/index.tsx

'use client'
import React, { useCallback, useState, useEffect } from 'react'
import {
  Slate,
  Editable,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react'
import { Descendant } from 'slate'
import Toolbar from '../Toolbars/Editor'
import {
  useRichTextEditor,
  RichTextEditorTypes,
} from '../utils/useRichtextEditor'
import Typography from '../../Typography'
import Accordion from '../../Accordion'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  SACRED_GLYPHS,
} from '../../../theme/'

export interface RichTextEditorProps {
  value: Descendant[]
  label?: string
  minRows?: number
  onChange?: () => void
  onSelectionChange?: () => void
  onValueChange?: () => void
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setMarkdown: (value: string) => void
  styles?: ComplexTextEditorStyles
}

const Leaf: React.FC<RenderLeafProps & { sacredtheme?: boolean }> = ({
  attributes,
  children,
  leaf,
  sacredtheme = false,
}) => {
  const customLeaf = leaf as RichTextEditorTypes['CustomText']

  const linkStyle = sacredtheme
    ? { color: 'rgba(255, 215, 0, 1)', textDecoration: 'underline' }
    : { color: 'rgba(37, 99, 235, 1)', textDecoration: 'underline' }

  const codeStyle = sacredtheme
    ? {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        color: 'rgba(255, 215, 0, 1)',
        padding: '2px 4px',
        borderRadius: '4px',
        fontFamily: 'monospace',
      }
    : {
        backgroundColor: 'rgba(243, 244, 246, 1)',
        color: 'rgba(55, 65, 81, 1)',
        padding: '2px 4px',
        borderRadius: '4px',
        fontFamily: 'monospace',
      }

  const textStyle = sacredtheme
    ? { color: 'rgba(255, 215, 0, 0.9)' }
    : { color: 'rgba(0, 0, 0, 1)' }

  let formattedChildren: React.ReactNode = children as React.ReactNode

  if (customLeaf.bold) {
    formattedChildren = <strong>{formattedChildren}</strong>
  }
  if (customLeaf.italic) {
    formattedChildren = <em>{formattedChildren}</em>
  }
  if (customLeaf.underline) {
    formattedChildren = <u>{formattedChildren}</u>
  }
  if (customLeaf.strikethrough) {
    formattedChildren = <s>{formattedChildren}</s>
  }
  if (customLeaf.link) {
    formattedChildren = (
      <a href={customLeaf.link} style={linkStyle}>
        {formattedChildren}
      </a>
    )
  }
  if (customLeaf.code) {
    formattedChildren = <code style={codeStyle}>{formattedChildren}</code>
  }

  return (
    <span {...attributes} style={textStyle}>
      {formattedChildren}
    </span>
  )
}

export function RichTextEditor({
  value,
  onChange,
  label,
  minRows = 5,
  markdownMode,
  setMarkdownMode,
  setMarkdown,
  styles: editorStyles,
}: RichTextEditorProps) {
  const accordion = editorStyles?.accordionMode || false
  const accordionSummary =
    editorStyles?.accordionSummary || label || 'Rich Text Editor'
  const defaultExpanded = editorStyles?.accordionDefaultExpanded || false
  const isSacredTheme = editorStyles?.theme === 'sacred'

  const [isFocused, setIsFocused] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)

  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(editorStyles, isFocused)
  const { themeConfig } = getSharedFormFieldStyles(editorStyles, isFocused)

  const {
    editor,
    internalValue,
    handleChange,
    handleBoldClick,
    handleItalicClick,
    onKeyDown,
  } = useRichTextEditor(value, onChange ? () => onChange() : undefined)

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

  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <Element {...props} sacredtheme={isSacredTheme} />
    ),
    [isSacredTheme]
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} sacredtheme={isSacredTheme} />,
    [isSacredTheme]
  )

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
    <div style={computedStyles.editorArea}>
      <Slate
        editor={editor}
        initialValue={internalValue}
        onChange={handleChange}
      >
        <Toolbar
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setMarkdown={setMarkdown}
          handleBoldClick={handleBoldClick}
          handleItalicClick={handleItalicClick}
          toolbarType="richtext"
          editor={editor}
          styles={editorStyles}
        />
        <div style={{ position: 'relative' }}>
          <Editable
            style={{
              ...computedStyles.editorArea,
              minHeight: `${minRows * 20}px`,
              border: 'none',
              outline: 'none',
            }}
            placeholder={
              isSacredTheme ? 'Channel divine wisdom...' : 'Enter text...'
            }
            onKeyDown={onKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
          {isSacredTheme && (
            <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[2]}</div>
          )}
        </div>
      </Slate>
    </div>
  )

  // Render label if provided and not in accordion mode
  const labelElement = label && !accordion && (
    <label style={getSharedLabelStyles(themeConfig.label.default, themeConfig)}>
      {label}
    </label>
  )

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
              {accordionSummary || label || 'Rich Text Editor'}
            </Typography>
          }
          details={editorContent}
        />
      ) : (
        <>
          {labelElement}
          {editorContent}
        </>
      )}
    </div>
  )
}

const Element = ({
  attributes,
  children,
  element,
  sacredtheme = false,
}: RenderElementProps & { sacredtheme?: boolean }) => {
  const customElement = element as RichTextEditorTypes['CustomElement']

  const textStyle = sacredtheme
    ? { color: 'rgba(255, 215, 0, 0.9)' }
    : { color: 'rgba(0, 0, 0, 1)' }

  const linkStyle = sacredtheme
    ? { color: 'rgba(255, 215, 0, 1)', textDecoration: 'underline' }
    : { color: 'rgba(37, 99, 235, 1)', textDecoration: 'underline' }

  if (!customElement.type) return null

  const style = {
    textAlign: customElement.align,
    ...textStyle,
  }

  switch (customElement.type) {
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'link':
      return (
        <a
          href={customElement.url}
          {...attributes}
          style={{ ...style, ...linkStyle }}
        >
          {children}
        </a>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

export default RichTextEditor

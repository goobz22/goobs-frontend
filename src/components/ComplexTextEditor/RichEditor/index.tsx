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
import { SACRED_GLYPHS } from '../../../styles/sacredGlyphs'

export interface RichTextEditorProps {
  value: Descendant[]
  name?: string
  label?: string
  minRows?: number
  onChange?: () => void
  onSelectionChange?: () => void
  onValueChange?: () => void
  accordion?: boolean
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setMarkdown: (value: string) => void
  accordionSummary?: React.ReactNode
  defaultExpanded?: boolean
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
  } as React.CSSProperties,

  editorContainer: {
    border: '1px solid rgba(0, 0, 0, 1)',
    borderRadius: '8px',
    width: 'auto',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  } as React.CSSProperties,

  separator: {
    borderColor: 'rgba(0, 0, 0, 1)',
  } as React.CSSProperties,

  editable: {
    padding: '16px',
    color: 'rgba(0, 0, 0, 1)',
  } as React.CSSProperties,

  label: {
    marginBottom: '8px',
  } as React.CSSProperties,

  text: {
    color: 'rgba(0, 0, 0, 1)',
  } as React.CSSProperties,

  link: {
    color: 'rgba(37, 99, 235, 1)',
    textDecoration: 'underline',
  } as React.CSSProperties,

  code: {
    backgroundColor: 'rgba(243, 244, 246, 1)',
    color: 'rgba(55, 65, 81, 1)',
    padding: '2px 4px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
  } as React.CSSProperties,

  editorContainer: {
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    width: 'auto',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    backgroundImage:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.05), transparent)',
    boxShadow:
      '0 4px 6px -1px rgba(255, 215, 0, 0.2), 0 2px 4px -1px rgba(255, 215, 0, 0.1)',
    animation: 'richTextEditorBorderPulse 4s ease-in-out infinite',
  } as React.CSSProperties,

  separator: {
    borderColor: 'rgba(255, 215, 0, 0.3)',
    boxShadow:
      '0 4px 6px -1px rgba(255, 215, 0, 0.3), 0 2px 4px -1px rgba(255, 215, 0, 0.2)',
  } as React.CSSProperties,

  editable: {
    padding: '16px',
    color: 'rgba(255, 215, 0, 0.9)',
    animation: 'richTextEditorTextGlow 3s ease-in-out infinite',
  } as React.CSSProperties,

  label: {
    marginBottom: '8px',
    color: 'rgba(255, 215, 0, 1)',
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  text: {
    color: 'rgba(255, 215, 0, 0.9)',
  } as React.CSSProperties,

  link: {
    color: 'rgba(255, 215, 0, 1)',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,

  code: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    color: 'rgba(255, 215, 0, 1)',
    padding: '2px 4px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    fontSize: '48px',
    color: 'rgba(255, 215, 0, 0.1)',
    pointerEvents: 'none',
    opacity: 0.5,
  } as React.CSSProperties,
}

const Leaf: React.FC<RenderLeafProps & { sacredtheme?: boolean }> = ({
  attributes,
  children,
  leaf,
  sacredtheme = false,
}) => {
  const customLeaf = leaf as RichTextEditorTypes['CustomText']
  const styles = sacredtheme ? sacredStyles : premiumStyles

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
      <a href={customLeaf.link} style={styles.link}>
        {formattedChildren}
      </a>
    )
  }
  if (customLeaf.code) {
    formattedChildren = <code style={styles.code}>{formattedChildren}</code>
  }

  return (
    <span {...attributes} style={styles.text}>
      {formattedChildren}
    </span>
  )
}

export function RichTextEditor({
  value,
  onChange,
  label,
  minRows = 5,
  accordion = false,
  markdownMode,
  setMarkdownMode,
  setMarkdown,
  accordionSummary,
  defaultExpanded = false,
  sacredtheme = false,
}: RichTextEditorProps) {
  const {
    editor,
    internalValue,
    handleChange,
    handleBoldClick,
    handleItalicClick,
    onKeyDown,
  } = useRichTextEditor(value, onChange ? () => onChange() : undefined)

  const [expanded, setExpanded] = useState(defaultExpanded)

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
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
  }, [sacredtheme])

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <Element {...props} sacredtheme={sacredtheme} />
    ),
    [sacredtheme]
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} sacredtheme={sacredtheme} />,
    [sacredtheme]
  )

  const handleAccordionChange = () => {
    setExpanded(!expanded)
  }

  const editorContent = (
    <div style={styles.editorContainer}>
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
          sacredtheme={sacredtheme}
        />
        <hr style={styles.separator} />
        <div style={{ position: 'relative' }}>
          <Editable
            style={{
              ...styles.editable,
              minHeight: `${minRows * 20}px`,
            }}
            placeholder={
              sacredtheme ? 'Channel divine wisdom...' : 'Enter text...'
            }
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
          {sacredtheme && (
            <div style={sacredStyles.glyph}>{SACRED_GLYPHS[2]}</div>
          )}
        </div>
      </Slate>
    </div>
  )

  return (
    <div style={styles.container}>
      {accordion ? (
        <Accordion
          expanded={expanded}
          onChange={handleAccordionChange}
          sacredtheme={sacredtheme}
          summary={
            <Typography
              fontvariant="merrih4"
              style={sacredtheme ? styles.label : undefined}
            >
              {accordionSummary || label || 'Rich Text Editor'}
            </Typography>
          }
          details={editorContent}
        />
      ) : (
        <>
          {label && (
            <Typography fontvariant="merrih4" style={styles.label}>
              {label}
            </Typography>
          )}
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
  const styles = sacredtheme ? sacredStyles : premiumStyles

  if (!customElement.type) return null

  const style = {
    textAlign: customElement.align,
    ...styles.text,
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
          style={{ ...style, ...styles.link }}
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

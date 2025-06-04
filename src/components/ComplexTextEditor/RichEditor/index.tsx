// src/components/ComplexTextEditor/RichEditor/index.tsx

import React, { useCallback, useState } from 'react'
import {
  Slate,
  Editable,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react'
import { Descendant } from 'slate'
import Toolbar from '../Toolbars/Editor'
import { Box, Divider, keyframes, alpha } from '@mui/material'
import {
  useRichTextEditor,
  RichTextEditorTypes,
} from '../utils/useRichtextEditor'
import Typography from '../../Typography'
import Accordion from '../../Accordion'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓅓', '𓆄', '𓇳', '𓈖']

const sacredTextGlow = keyframes`
  0% { text-shadow: 0 0 3px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 3px rgba(255, 215, 0, 0.3); }
`

const sacredBorderPulse = keyframes`
  0% { border-color: ${alpha('#FFD700', 0.3)}; }
  50% { border-color: ${alpha('#FFD700', 0.6)}; }
  100% { border-color: ${alpha('#FFD700', 0.3)}; }
`

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
  // Accordion related props
  accordionSummary?: React.ReactNode
  defaultExpanded?: boolean
  sacredTheme?: boolean
}

const Leaf: React.FC<RenderLeafProps & { sacredTheme?: boolean }> = ({
  attributes,
  children,
  leaf,
  sacredTheme = false,
}) => {
  const customLeaf = leaf as RichTextEditorTypes['CustomText']

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
      <a
        href={customLeaf.link}
        style={
          sacredTheme
            ? {
                color: '#FFD700',
                textDecoration: 'underline',
                textDecorationColor: alpha('#FFD700', 0.5),
              }
            : undefined
        }
      >
        {formattedChildren}
      </a>
    )
  }
  if (customLeaf.code) {
    formattedChildren = (
      <code
        style={
          sacredTheme
            ? {
                backgroundColor: alpha('#FFD700', 0.1),
                color: '#FFD700',
                padding: '2px 4px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }
            : undefined
        }
      >
        {formattedChildren}
      </code>
    )
  }

  return (
    <span
      {...attributes}
      style={
        sacredTheme
          ? {
              color: alpha('#FFD700', 0.9),
            }
          : undefined
      }
    >
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
  sacredTheme = false,
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

  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <Element {...props} sacredTheme={sacredTheme} />
    ),
    [sacredTheme]
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} sacredTheme={sacredTheme} />,
    [sacredTheme]
  )

  const handleAccordionChange = () => {
    setExpanded(!expanded)
  }

  const editorContent = (
    <Box
      sx={{
        border: sacredTheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid black',
        borderRadius: '8px',
        width: 'auto',
        backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
        position: 'relative',
        overflow: 'hidden',
        ...(sacredTheme && {
          animation: `${sacredBorderPulse} 4s ease-in-out infinite`,
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
        }),
      }}
    >
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
          sacredTheme={sacredTheme}
        />
        <Divider
          sx={{
            backgroundColor: sacredTheme ? alpha('#FFD700', 0.3) : 'black',
            ...(sacredTheme && {
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
            }),
          }}
        />
        <Box sx={{ position: 'relative' }}>
          <Editable
            style={{
              minHeight: `${minRows * 20}px`,
              padding: '16px',
              color: sacredTheme ? alpha('#FFD700', 0.9) : 'inherit',
              ...(sacredTheme && {
                animation: `${sacredTextGlow} 3s ease-in-out infinite`,
              }),
            }}
            placeholder={
              sacredTheme ? 'Channel divine wisdom...' : 'Enter text...'
            }
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
          {/* Sacred decorative element */}
          {sacredTheme && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                color: alpha('#FFD700', 0.1),
                fontSize: '48px',
                pointerEvents: 'none',
                opacity: 0.5,
              }}
            >
              {SACRED_GLYPHS[2]}
            </Box>
          )}
        </Box>
      </Slate>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {accordion ? (
        <Accordion
          expanded={expanded}
          onChange={handleAccordionChange}
          sacredTheme={sacredTheme}
          summary={
            <Typography
              fontvariant="merrih4"
              sx={
                sacredTheme
                  ? {
                      color: '#FFD700',
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                    }
                  : undefined
              }
            >
              {accordionSummary || label || 'Rich Text Editor'}
            </Typography>
          }
          details={editorContent}
        />
      ) : (
        <>
          {label && (
            <Typography
              fontvariant="merrih4"
              sx={
                sacredTheme
                  ? {
                      color: '#FFD700',
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                      marginBottom: '8px',
                    }
                  : undefined
              }
            >
              {label}
            </Typography>
          )}
          {editorContent}
        </>
      )}
    </Box>
  )
}

const Element = ({
  attributes,
  children,
  element,
  sacredTheme = false,
}: RenderElementProps & { sacredTheme?: boolean }) => {
  const customElement = element as RichTextEditorTypes['CustomElement']
  if (!customElement.type) return null
  const style = {
    textAlign: customElement.align,
    ...(sacredTheme && {
      color: alpha('#FFD700', 0.9),
    }),
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
          style={
            sacredTheme
              ? {
                  color: '#FFD700',
                  textDecoration: 'underline',
                  textDecorationColor: alpha('#FFD700', 0.5),
                }
              : undefined
          }
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

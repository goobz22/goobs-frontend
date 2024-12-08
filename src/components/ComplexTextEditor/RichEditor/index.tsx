import React, { useCallback, useState } from 'react'
import {
  Slate,
  Editable,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react'
import { Descendant } from 'slate'
import Toolbar from '../Toolbars/Rich'
import {
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { useRichTextEditor } from '../utils/useRichtextEditor'
import { RichTextEditorTypes } from '../types'
import Typography from '../../Typography'

export interface RichTextEditorProps {
  value: Descendant[]
  name?: string
  label?: string
  minRows?: number
  onChange?: () => void
  onSelectionChange?: () => void
  onValueChange?: () => void
  accordion?: boolean
}

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  const customLeaf = leaf as RichTextEditorTypes['CustomText']

  if (customLeaf.bold) {
    children = <strong>{children}</strong>
  }
  if (customLeaf.italic) {
    children = <em>{children}</em>
  }
  if (customLeaf.underline) {
    children = <u>{children}</u>
  }
  if (customLeaf.strikethrough) {
    children = <s>{children}</s>
  }
  if (customLeaf.link) {
    children = <a href={customLeaf.link}>{children}</a>
  }
  if (customLeaf.code) {
    children = <code>{children}</code>
  }
  return <span {...attributes}>{children}</span>
}

export function RichTextEditor({
  value,
  onChange,
  label,
  minRows = 5,
  accordion = false,
}: RichTextEditorProps) {
  const {
    editor,
    markdownMode,
    setMarkdown,
    internalValue,
    handleChange,
    handleBoldClick,
    handleItalicClick,
    insertLink,
    onKeyDown,
  } = useRichTextEditor(value, onChange ? () => onChange() : undefined)

  const [expanded, setExpanded] = useState(false)

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  const handleAccordionChange = () => {
    setExpanded(!expanded)
  }

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
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontvariant="merrih4">{label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                border: '1px solid black',
                borderRadius: '8px',
                width: 'auto',
              }}
            >
              <Slate
                editor={editor}
                initialValue={internalValue}
                onChange={handleChange}
              >
                <Toolbar
                  editor={editor}
                  markdownMode={markdownMode}
                  setMarkdown={setMarkdown}
                  handleBoldClick={handleBoldClick}
                  handleItalicClick={handleItalicClick}
                  handleLinkClick={insertLink}
                />
                <Divider sx={{ backgroundColor: 'black' }} />
                <Editable
                  style={{ minHeight: `${minRows * 20}px` }}
                  onKeyDown={onKeyDown}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                />
              </Slate>
            </Box>
          </AccordionDetails>
        </Accordion>
      ) : (
        <>
          {label && <Typography fontvariant="merrih4">{label}</Typography>}
          <Box
            sx={{
              border: '1px solid black',
              borderRadius: '8px',
              width: 'auto',
            }}
          >
            <Slate
              editor={editor}
              initialValue={internalValue}
              onChange={handleChange}
            >
              <Toolbar
                editor={editor}
                markdownMode={markdownMode}
                setMarkdown={setMarkdown}
                handleBoldClick={handleBoldClick}
                handleItalicClick={handleItalicClick}
                handleLinkClick={insertLink}
              />
              <Divider sx={{ backgroundColor: 'black' }} />
              <Editable
                style={{ minHeight: `${minRows * 20}px` }}
                onKeyDown={onKeyDown}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Slate>
          </Box>
        </>
      )}
    </Box>
  )
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as RichTextEditorTypes['CustomElement']
  if (!customElement.type) return null
  const style = { textAlign: customElement.align }
  switch (customElement.type) {
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'link':
      return (
        <a href={customElement.url} {...attributes}>
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

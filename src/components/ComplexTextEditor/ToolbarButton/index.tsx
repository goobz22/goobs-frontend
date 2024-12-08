import React from 'react'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { useRichTextEditor } from '../utils/useRichtextEditor'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import { IconButton, IconButtonProps } from '@mui/material'
import { InlineFormat, BlockFormat, AlignmentFormat } from '../types'

interface ToolbarButtonProps extends IconButtonProps {
  format?: InlineFormat | BlockFormat | AlignmentFormat
  children: React.ReactNode
  editor?: BaseEditor & ReactEditor & HistoryEditor
  buttonAction?: 'undo' | 'redo'
  markdownMode?: boolean
  setMarkdown?: (value: string) => void
  handleMouseDown?: () => void
  activeFontColor?: string
  activeBackgroundColor?: string
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  format,
  children,
  editor,
  buttonAction,
  markdownMode,
  setMarkdown,
  activeFontColor = 'rgb(110 110 110)',
  activeBackgroundColor = 'rgba(0, 0, 0, 0.10)',
  ...props
}) => {
  const { toggleMark, toggleBlock, isMarkActive, isBlockActive } =
    useRichTextEditor([], () => {})

  const isActive =
    editor &&
    format &&
    (isMarkActive(format as InlineFormat) ||
      isBlockActive(format as BlockFormat | AlignmentFormat))

  const handleMouseDown = () => {
    if (markdownMode && setMarkdown) {
      const selection = window.getSelection()
      if (selection) {
        const selectedText = selection.toString()
        switch (format) {
          case 'bold':
            handleBoldClick(selectedText, selectedText, setMarkdown)
            break
          case 'italic':
            handleItalicClick(selectedText, selectedText, setMarkdown)
            break
          case 'code':
            setMarkdown('`' + selectedText + '`')
            break
          case 'link': {
            const url = prompt('Enter the URL')
            if (url) {
              setMarkdown('[' + selectedText + '](' + url + ')')
            }
            break
          }
        }
      }
    } else {
      // Slate mode
      if (editor) {
        if (buttonAction) {
          if (buttonAction === 'undo') {
            editor.undo()
          } else if (buttonAction === 'redo') {
            editor.redo()
          }
        } else if (format) {
          if (
            format === 'bulleted-list' ||
            format === 'numbered-list' ||
            ['left', 'center', 'right', 'justify'].includes(format as string)
          ) {
            toggleBlock(format as BlockFormat | AlignmentFormat)
          } else {
            toggleMark(format as InlineFormat)
          }
        }
      }
    }
  }

  return (
    <IconButton
      onMouseDown={handleMouseDown}
      sx={{
        borderRadius: '9%',
        color: 'black',
        ...(isActive && {
          color: activeFontColor,
          backgroundColor: activeBackgroundColor,
        }),
        '& .MuiTouchRipple-root .MuiTouchRipple-child': {
          borderRadius: '9%',
        },
      }}
      {...props}
    >
      {children}
    </IconButton>
  )
}

export default ToolbarButton

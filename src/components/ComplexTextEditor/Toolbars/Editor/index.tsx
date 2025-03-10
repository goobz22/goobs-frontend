import React, { useState } from 'react'
import { Box, Stack } from '@mui/material'
import {
  Link,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  FormatListNumbered,
  FormatListBulleted,
} from '@mui/icons-material'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import Dropdown from '../../../Field/Dropdown/Regular'
import CustomButton from '../../../Button'
import { useRichTextEditor } from '../../utils/useRichtextEditor'
import {
  handleBoldClick as markdownBoldClick,
  handleItalicClick as markdownItalicClick,
  replaceSelectedText,
} from '../../utils/useMarkdownEditor'
import { black, grey } from '../../../../styles/palette'
import {
  AlignmentFormat,
  InlineFormat,
  BlockFormat,
} from '../../utils/useRichtextEditor'

// Define types directly in this file that aren't already imported
type CustomEditor = BaseEditor & ReactEditor & HistoryEditor
export type TextType = 'paragraph' | 'h1' | 'h2' | 'h3'

interface ToolbarMarkdownProps {
  editor?: CustomEditor
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  markdownMode: boolean
  setMarkdownMode?: (value: boolean) => void
  setMarkdown: (value: string) => void
  toolbarType?: 'markdown' | 'richtext' // New prop to indicate the toolbar type
}

const ToolbarMarkdown: React.FC<ToolbarMarkdownProps> = ({
  editor,
  handleBoldClick,
  handleItalicClick,
  markdownMode,
  setMarkdown,
  toolbarType = 'richtext', // Default to richtext
}) => {
  const [alignValue, setAlignValue] = useState<AlignmentFormat>('left')
  const [textType, setTextType] = useState<TextType>('paragraph')
  const { toggleMark, toggleBlock, isMarkActive, isBlockActive } =
    useRichTextEditor([], () => {})

  // Display additional tool options based on toolbar type
  const showExtendedOptions = toolbarType === 'richtext' && !markdownMode

  const handleAlignChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlignValue(event.target.value as AlignmentFormat)
  }

  const handleTextTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextType(event.target.value as TextType)
  }

  const textTypeOptions = [
    { value: 'paragraph' },
    { value: 'h1' },
    { value: 'h2' },
    { value: 'h3' },
  ]

  const alignmentOptions = [
    {
      value: 'left',
      icon: <FormatAlignLeft fontSize="small" />,
    },
    {
      value: 'center',
      icon: <FormatAlignCenter fontSize="small" />,
    },
    {
      value: 'right',
      icon: <FormatAlignRight fontSize="small" />,
    },
  ]

  const handleEditorAction =
    (action: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      // Handle markdown mode actions
      if (markdownMode) {
        const selection = window.getSelection()
        if (selection) {
          const selectedText = selection.toString()

          switch (action) {
            case 'bold':
              if (handleBoldClick) {
                handleBoldClick()
              } else {
                markdownBoldClick(selectedText, selectedText, setMarkdown)
              }
              break

            case 'italic':
              if (handleItalicClick) {
                handleItalicClick()
              } else {
                markdownItalicClick(selectedText, selectedText, setMarkdown)
              }
              break

            case 'code':
              if (selectedText) {
                const newValue = '`' + selectedText + '`'
                replaceSelectedText(
                  newValue,
                  selectedText,
                  selectedText,
                  setMarkdown
                )
              }
              break

            case 'link': {
              const url = prompt('Enter the URL')
              if (url && selectedText) {
                const newValue = '[' + selectedText + '](' + url + ')'
                replaceSelectedText(
                  newValue,
                  selectedText,
                  selectedText,
                  setMarkdown
                )
              }
              break
            }

            case 'strikethrough':
              if (selectedText) {
                const newValue = '~~' + selectedText + '~~'
                replaceSelectedText(
                  newValue,
                  selectedText,
                  selectedText,
                  setMarkdown
                )
              }
              break

            case 'bulleted-list':
              if (selectedText) {
                // Split by lines and add bullets
                const lines = selectedText.split('\n')
                const bulletedList = lines.map(line => `* ${line}`).join('\n')
                replaceSelectedText(
                  bulletedList,
                  selectedText,
                  selectedText,
                  setMarkdown
                )
              }
              break

            case 'numbered-list':
              if (selectedText) {
                // Split by lines and add numbers
                const lines = selectedText.split('\n')
                const numberedList = lines
                  .map((line, index) => `${index + 1}. ${line}`)
                  .join('\n')
                replaceSelectedText(
                  numberedList,
                  selectedText,
                  selectedText,
                  setMarkdown
                )
              }
              break

            case 'undo':
            case 'redo':
            case 'underline':
              // These might not be supported in basic markdown
              break
          }
        }
      }
      // Handle rich text editor actions
      else if (editor) {
        switch (action) {
          case 'undo':
            if ('undo' in editor && typeof editor.undo === 'function') {
              editor.undo()
            }
            break

          case 'redo':
            if ('redo' in editor && typeof editor.redo === 'function') {
              editor.redo()
            }
            break

          case 'bulleted-list':
          case 'numbered-list':
          case 'left':
          case 'center':
          case 'right':
          case 'justify':
            toggleBlock(action as BlockFormat | AlignmentFormat)
            break

          case 'bold':
          case 'italic':
          case 'underline':
          case 'strikethrough':
          case 'code':
            toggleMark(action as InlineFormat)
            break

          case 'link':
            // Safe check for insertLink function
            if (
              editor &&
              typeof (editor as unknown as { insertLink: () => void })
                .insertLink === 'function'
            ) {
              ;(editor as unknown as { insertLink: () => void }).insertLink()
            }
            break
        }
      }
    }

  // Check if format is active for styling
  const isFormatActive = (format: string): boolean => {
    if (!editor || markdownMode) return false

    if (
      [
        'bulleted-list',
        'numbered-list',
        'left',
        'center',
        'right',
        'justify',
      ].includes(format)
    ) {
      return isBlockActive(format as BlockFormat | AlignmentFormat)
    } else {
      return isMarkActive(format as InlineFormat)
    }
  }

  // Common style for toolbar buttons
  const iconButtonStyle = {
    borderRadius: '9%',
    minWidth: '36px',
    width: '36px',
    height: '36px',
    padding: '6px',
    margin: '2px',
  }

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        {/* undo / redo */}
        <Box sx={{ display: 'flex', gap: '4px' }}>
          <CustomButton
            icon={<Undo fontSize="small" />}
            backgroundcolor="none"
            fontcolor={black.main}
            iconcolor={black.main}
            onClick={handleEditorAction('undo')}
            variant="text"
            sx={iconButtonStyle}
            disabled={markdownMode} // Disable in markdown mode as it's not supported
          />
          <CustomButton
            icon={<Redo fontSize="small" />}
            backgroundcolor="none"
            fontcolor={black.main}
            iconcolor={black.main}
            onClick={handleEditorAction('redo')}
            variant="text"
            sx={iconButtonStyle}
            disabled={markdownMode} // Disable in markdown mode as it's not supported
          />
        </Box>
        {/* text dropdown - only show in rich text mode */}
        {showExtendedOptions && (
          <Dropdown
            label="Text Type"
            options={textTypeOptions}
            value={textType}
            onChange={handleTextTypeChange}
            width="200px"
          />
        )}
        {/* alignment dropdown - only show in rich text mode */}
        {showExtendedOptions && (
          <Dropdown
            label="Alignment"
            options={alignmentOptions}
            value={alignValue}
            onChange={handleAlignChange}
            width="150px"
          />
        )}
        {/* buttons */}
        <Box sx={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          <CustomButton
            icon={<FormatBold fontSize="small" />}
            backgroundcolor={
              isFormatActive('bold') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('bold') ? grey.dark : black.main}
            iconcolor={isFormatActive('bold') ? grey.dark : black.main}
            onClick={handleEditorAction('bold')}
            variant="text"
            sx={iconButtonStyle}
          />
          <CustomButton
            icon={<FormatItalic fontSize="small" />}
            backgroundcolor={
              isFormatActive('italic') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('italic') ? grey.dark : black.main}
            iconcolor={isFormatActive('italic') ? grey.dark : black.main}
            onClick={handleEditorAction('italic')}
            variant="text"
            sx={iconButtonStyle}
          />
          <CustomButton
            icon={<FormatUnderlined fontSize="small" />}
            backgroundcolor={
              isFormatActive('underline') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('underline') ? grey.dark : black.main}
            iconcolor={isFormatActive('underline') ? grey.dark : black.main}
            onClick={handleEditorAction('underline')}
            variant="text"
            sx={iconButtonStyle}
            disabled={markdownMode} // Underline is not standard markdown
          />
          <CustomButton
            icon={<StrikethroughS fontSize="small" />}
            backgroundcolor={
              isFormatActive('strikethrough') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('strikethrough') ? grey.dark : black.main}
            iconcolor={isFormatActive('strikethrough') ? grey.dark : black.main}
            onClick={handleEditorAction('strikethrough')}
            variant="text"
            sx={iconButtonStyle}
          />
          <CustomButton
            icon={<Code fontSize="small" />}
            backgroundcolor={
              isFormatActive('code') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('code') ? grey.dark : black.main}
            iconcolor={isFormatActive('code') ? grey.dark : black.main}
            onClick={handleEditorAction('code')}
            variant="text"
            sx={iconButtonStyle}
          />
          <CustomButton
            icon={<Link fontSize="small" />}
            backgroundcolor={
              isFormatActive('link') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('link') ? grey.dark : black.main}
            iconcolor={isFormatActive('link') ? grey.dark : black.main}
            onClick={handleEditorAction('link')}
            variant="text"
            sx={iconButtonStyle}
          />
          <CustomButton
            icon={<FormatListNumbered fontSize="small" />}
            backgroundcolor={
              isFormatActive('numbered-list') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('numbered-list') ? grey.dark : black.main}
            iconcolor={isFormatActive('numbered-list') ? grey.dark : black.main}
            onClick={handleEditorAction('numbered-list')}
            variant="text"
            sx={iconButtonStyle}
          />
          <CustomButton
            icon={<FormatListBulleted fontSize="small" />}
            backgroundcolor={
              isFormatActive('bulleted-list') ? 'rgba(0, 0, 0, 0.10)' : 'none'
            }
            fontcolor={isFormatActive('bulleted-list') ? grey.dark : black.main}
            iconcolor={isFormatActive('bulleted-list') ? grey.dark : black.main}
            onClick={handleEditorAction('bulleted-list')}
            variant="text"
            sx={iconButtonStyle}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default ToolbarMarkdown

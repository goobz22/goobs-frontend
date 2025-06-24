// src/components/ComplexTextEditor/Toolbars/Editor/index.tsx

import React, { useState } from 'react'
import { Box, Stack, keyframes, alpha } from '@mui/material'
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

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const sacredIconGlow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5)); }
`

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
  toolbarType?: 'markdown' | 'richtext'
  sacredtheme?: boolean
}

const ToolbarMarkdown: React.FC<ToolbarMarkdownProps> = ({
  editor,
  handleBoldClick,
  handleItalicClick,
  markdownMode,
  setMarkdown,
  toolbarType = 'richtext',
  sacredtheme = false,
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

  const sacredButtonStyle = sacredtheme
    ? {
        '& .MuiSvgIcon-root': {
          animation: isFormatActive('')
            ? `${sacredIconGlow} 2s ease-in-out infinite`
            : 'none',
        },
      }
    : {}

  return (
    <Box
      sx={{
        padding: '8px',
        backgroundColor: sacredtheme ? alpha('#000000', 0.5) : 'transparent',
      }}
    >
      <Stack direction="row" spacing={1}>
        {/* undo / redo */}
        <Box sx={{ display: 'flex', gap: '4px' }}>
          <CustomButton
            icon={<Undo fontSize="small" />}
            backgroundcolor="none"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : black.main}
            iconcolor={sacredtheme ? alpha('#FFD700', 0.8) : black.main}
            onClick={handleEditorAction('undo')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...sacredButtonStyle,
            }}
            disabled={markdownMode}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<Redo fontSize="small" />}
            backgroundcolor="none"
            fontcolor={sacredtheme ? alpha('#FFD700', 0.8) : black.main}
            iconcolor={sacredtheme ? alpha('#FFD700', 0.8) : black.main}
            onClick={handleEditorAction('redo')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...sacredButtonStyle,
            }}
            disabled={markdownMode}
            sacredtheme={sacredtheme}
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
            sacredtheme={sacredtheme}
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
            sacredtheme={sacredtheme}
          />
        )}
        {/* buttons */}
        <Box sx={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          <CustomButton
            icon={<FormatBold fontSize="small" />}
            backgroundcolor={
              isFormatActive('bold')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('bold')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('bold')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('bold')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('bold') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<FormatItalic fontSize="small" />}
            backgroundcolor={
              isFormatActive('italic')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('italic')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('italic')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('italic')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('italic') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<FormatUnderlined fontSize="small" />}
            backgroundcolor={
              isFormatActive('underline')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('underline')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('underline')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('underline')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('underline') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            disabled={markdownMode}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<StrikethroughS fontSize="small" />}
            backgroundcolor={
              isFormatActive('strikethrough')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('strikethrough')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('strikethrough')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('strikethrough')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('strikethrough') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<Code fontSize="small" />}
            backgroundcolor={
              isFormatActive('code')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('code')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('code')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('code')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('code') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<Link fontSize="small" />}
            backgroundcolor={
              isFormatActive('link')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('link')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('link')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('link')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('link') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<FormatListNumbered fontSize="small" />}
            backgroundcolor={
              isFormatActive('numbered-list')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('numbered-list')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('numbered-list')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('numbered-list')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('numbered-list') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
          <CustomButton
            icon={<FormatListBulleted fontSize="small" />}
            backgroundcolor={
              isFormatActive('bulleted-list')
                ? sacredtheme
                  ? alpha('#FFD700', 0.2)
                  : 'rgba(0, 0, 0, 0.10)'
                : 'none'
            }
            fontcolor={
              isFormatActive('bulleted-list')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            iconcolor={
              isFormatActive('bulleted-list')
                ? sacredtheme
                  ? '#FFD700'
                  : grey.dark
                : sacredtheme
                  ? alpha('#FFD700', 0.8)
                  : black.main
            }
            onClick={handleEditorAction('bulleted-list')}
            variant="text"
            sx={{
              ...iconButtonStyle,
              ...(isFormatActive('bulleted-list') &&
                sacredtheme && {
                  '& .MuiSvgIcon-root': {
                    animation: `${sacredIconGlow} 2s ease-in-out infinite`,
                  },
                }),
            }}
            sacredtheme={sacredtheme}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default ToolbarMarkdown

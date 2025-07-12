// src/components/ComplexTextEditor/Toolbars/Editor/index.tsx

'use client'
import React, { useState, useEffect } from 'react'
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
import { black, grey } from '../../../../theme/'
import {
  AlignmentFormat,
  InlineFormat,
  BlockFormat,
} from '../../utils/useRichtextEditor'
import { ComplexTextEditorStyles } from '../../../../theme/'

import LinkIcon from '../../../Icons/Link'
import UndoIcon from '../../../Icons/Undo'
import RedoIcon from '../../../Icons/Redo'
import FormatAlignLeftIcon from '../../../Icons/FormatAlignLeft'
import FormatAlignCenterIcon from '../../../Icons/FormatAlignCenter'
import FormatAlignRightIcon from '../../../Icons/FormatAlignRight'
import FormatBoldIcon from '../../../Icons/FormatBold'
import FormatItalicIcon from '../../../Icons/FormatItalic'
import FormatUnderlinedIcon from '../../../Icons/FormatUnderlined'
import StrikethroughSIcon from '../../../Icons/StrikethroughS'
import CodeIcon from '../../../Icons/Code'
import FormatListNumberedIcon from '../../../Icons/FormatListNumbered'
import FormatListBulletedIcon from '../../../Icons/FormatListBulleted'

// --------------------------------------------------------------------------
// TOOLBAR COMPONENT INTERFACE
// --------------------------------------------------------------------------

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
  styles?: ComplexTextEditorStyles
}

// --------------------------------------------------------------------------
// STYLE CONFIGURATIONS
// --------------------------------------------------------------------------

// Premium theme styles (when theme is light/dark)
const premiumStyles = {
  container: {
    padding: '8px',
  } as React.CSSProperties,

  toolbarRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  } as React.CSSProperties,

  buttonGroup: {
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,

  buttonsContainer: {
    display: 'flex',
    gap: '2px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
}

// Sacred theme styles (when theme is sacred)
const sacredStyles = {
  container: {
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as React.CSSProperties,

  toolbarRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  } as React.CSSProperties,

  buttonGroup: {
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,

  buttonsContainer: {
    display: 'flex',
    gap: '2px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
}

const ToolbarMarkdown: React.FC<ToolbarMarkdownProps> = ({
  editor,
  handleBoldClick,
  handleItalicClick,
  markdownMode,
  setMarkdown,
  toolbarType = 'richtext',
  styles,
}) => {
  const [alignValue, setAlignValue] = useState<AlignmentFormat>('left')
  const [textType, setTextType] = useState<TextType>('paragraph')
  const { toggleMark, toggleBlock, isMarkActive, isBlockActive } =
    useRichTextEditor([], () => {})

  const isSacredTheme = styles?.theme === 'sacred'

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes toolbarIconGlow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5)); }
          50% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)); }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [isSacredTheme])

  // Display additional tool options based on toolbar type
  const showExtendedOptions = toolbarType === 'richtext' && !markdownMode

  const handleAlignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlignValue(event.target.value as AlignmentFormat)
  }

  const handleTextTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
      icon: <FormatAlignLeftIcon style={{ width: '16px', height: '16px' }} />,
    },
    {
      value: 'center',
      icon: <FormatAlignCenterIcon style={{ width: '16px', height: '16px' }} />,
    },
    {
      value: 'right',
      icon: <FormatAlignRightIcon style={{ width: '16px', height: '16px' }} />,
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

  const containerStyles = isSacredTheme ? sacredStyles : premiumStyles

  // Create button styles for the unified theme system
  const getButtonStyles = (format: string) => {
    const isActive = isFormatActive(format)

    return {
      theme: styles?.theme,
      backgroundColor: isActive
        ? isSacredTheme
          ? 'rgba(255, 215, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.10)'
        : 'transparent',
      color: isActive
        ? isSacredTheme
          ? '#FFD700'
          : grey.dark
        : isSacredTheme
          ? 'rgba(255, 215, 0, 0.8)'
          : black.main,
      borderRadius: '2px',
      minWidth: '36px',
      width: '36px',
      height: '36px',
      padding: '6px',
      margin: '2px',
    }
  }

  return (
    <div style={containerStyles.container}>
      <div style={containerStyles.toolbarRow}>
        {/* undo / redo */}
        <div style={containerStyles.buttonGroup}>
          <CustomButton
            icon={<UndoIcon style={{ width: '16px', height: '16px' }} />}
            onClick={handleEditorAction('undo')}
            styles={getButtonStyles('undo')}
            disabled={markdownMode}
          />
          <CustomButton
            icon={<RedoIcon style={{ width: '16px', height: '16px' }} />}
            onClick={handleEditorAction('redo')}
            styles={getButtonStyles('redo')}
            disabled={markdownMode}
          />
        </div>
        {/* text dropdown - only show in rich text mode */}
        {showExtendedOptions && (
          <div style={{ width: '200px' }}>
            <Dropdown
              label="Text Type"
              options={textTypeOptions}
              value={textType}
              onChange={handleTextTypeChange}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
        )}
        {/* alignment dropdown - only show in rich text mode */}
        {showExtendedOptions && (
          <div style={{ width: '150px' }}>
            <Dropdown
              label="Alignment"
              options={alignmentOptions}
              value={alignValue}
              onChange={handleAlignChange}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
        )}
        {/* buttons */}
        <div style={containerStyles.buttonsContainer}>
          <CustomButton
            icon={<FormatBoldIcon style={{ width: '16px', height: '16px' }} />}
            onClick={handleEditorAction('bold')}
            styles={getButtonStyles('bold')}
          />
          <CustomButton
            icon={
              <FormatItalicIcon style={{ width: '16px', height: '16px' }} />
            }
            onClick={handleEditorAction('italic')}
            styles={getButtonStyles('italic')}
          />
          <CustomButton
            icon={
              <FormatUnderlinedIcon style={{ width: '16px', height: '16px' }} />
            }
            onClick={handleEditorAction('underline')}
            styles={getButtonStyles('underline')}
            disabled={markdownMode}
          />
          <CustomButton
            icon={
              <StrikethroughSIcon style={{ width: '16px', height: '16px' }} />
            }
            onClick={handleEditorAction('strikethrough')}
            styles={getButtonStyles('strikethrough')}
          />
          <CustomButton
            icon={<CodeIcon style={{ width: '16px', height: '16px' }} />}
            onClick={handleEditorAction('code')}
            styles={getButtonStyles('code')}
          />
          <CustomButton
            icon={<LinkIcon style={{ width: '16px', height: '16px' }} />}
            onClick={handleEditorAction('link')}
            styles={getButtonStyles('link')}
          />
          <CustomButton
            icon={
              <FormatListNumberedIcon
                style={{ width: '16px', height: '16px' }}
              />
            }
            onClick={handleEditorAction('numbered-list')}
            styles={getButtonStyles('numbered-list')}
          />
          <CustomButton
            icon={
              <FormatListBulletedIcon
                style={{ width: '16px', height: '16px' }}
              />
            }
            onClick={handleEditorAction('bulleted-list')}
            styles={getButtonStyles('bulleted-list')}
          />
        </div>
      </div>
    </div>
  )
}

export default ToolbarMarkdown

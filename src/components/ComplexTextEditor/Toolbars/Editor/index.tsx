// src/components/ComplexTextEditor/Toolbars/Editor/index.tsx

'use client'
import React, { useState } from 'react'
import Dropdown from '../../../Field/Dropdown/Regular'
import CustomButton from '../../../Button'
import {
  handleBoldClick as markdownBoldClick,
  handleItalicClick as markdownItalicClick,
  replaceSelectedText,
} from '../../utils/useMarkdownEditor'
import type { ComplexTextEditorStyles } from '../../theme'
import cssStyles from '../../ComplexTextEditor.module.css'

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

// Inlined from the goobs palette (theme/index.ts) so this toolbar no longer
// imports from src/theme. These drive the active-button `styles` prop fed to
// the goobs Button component — a runtime value computed from
// document.queryCommandState, so it legitimately stays in JS.
const BLACK_MAIN = '#000000' // black.main
const GREY_DARK = '#BDBDBD' // grey.dark

// --------------------------------------------------------------------------
// TOOLBAR COMPONENT INTERFACE
// --------------------------------------------------------------------------

// Define types directly in this file that aren't already imported
export type TextType = 'paragraph' | 'h1' | 'h2' | 'h3'
export type AlignmentFormat = 'left' | 'center' | 'right' | 'justify'

interface ToolbarMarkdownProps {
  editor?: any // Slate editor
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  handleUnderlineClick?: () => void
  handleStrikethroughClick?: () => void
  handleCodeClick?: () => void
  handleLinkClick?: () => void

  handleUndo?: () => void
  handleRedo?: () => void
  handleAlign?: (align: string) => void
  handleTextType?: (type: string) => void
  handleBulletedList?: () => void
  handleNumberedList?: () => void
  markdownMode: boolean
  setMarkdown: (value: string) => void
  toolbarType?: 'markdown' | 'richtext' | 'rich'
  styles?: ComplexTextEditorStyles
  /**
   * Caller-override CSS-variable object (--ct-toolbar-bg / --ct-toolbar-padding
   * / --ct-toolbar-gap) applied inline on the toolbar wrapper so
   * toolbarBackground / toolbarPadding / toolbarGap are honored as in the old
   * getComplexTextEditorTheme toolbar branch.
   */
  wrapperStyle?: React.CSSProperties
}

// --------------------------------------------------------------------------
// STYLE CONFIGURATIONS — layout containers migrated to ComplexTextEditor.module.css
// (.toolbarContainer / .toolbarRow / .primaryRow / .dropdownRow / .buttonGroup /
// .toolbarDropdown). The sacred translucent backdrop is the
// .toolbarContainer[data-theme='sacred'] override.
// --------------------------------------------------------------------------

const ToolbarMarkdown: React.FC<ToolbarMarkdownProps> = ({
  editor,
  handleBoldClick,
  handleItalicClick,
  handleUnderlineClick,
  handleStrikethroughClick,
  handleCodeClick,
  handleLinkClick,

  handleUndo,
  handleRedo,
  handleAlign,
  handleTextType,
  handleBulletedList,
  handleNumberedList,
  markdownMode,
  setMarkdown,
  toolbarType = 'richtext',
  styles,
  wrapperStyle,
}) => {
  const [alignValue, setAlignValue] = useState<AlignmentFormat>('left')
  const [textType, setTextType] = useState<TextType>('paragraph')

  const isSacredTheme = styles?.theme === 'sacred'

  // Display additional tool options based on toolbar type
  const showExtendedOptions = toolbarType === 'richtext' && !markdownMode

  const handleAlignChange = (value: string) => {
    setAlignValue(value as AlignmentFormat)
  }

  const handleTextTypeChange = (value: string) => {
    const newType = value as TextType
    setTextType(newType)
    if (handleTextType) {
      handleTextType(newType)
    }
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
      icon: (
        <FormatAlignLeftIcon
          styles={{ theme: styles?.theme || 'sacred', size: 16 }}
        />
      ),
    },
    {
      value: 'center',
      icon: (
        <FormatAlignCenterIcon
          styles={{ theme: styles?.theme || 'sacred', size: 16 }}
        />
      ),
    },
    {
      value: 'right',
      icon: (
        <FormatAlignRightIcon
          styles={{ theme: styles?.theme || 'sacred', size: 16 }}
        />
      ),
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
            if (handleUndo) {
              handleUndo()
            }
            break

          case 'redo':
            if (handleRedo) {
              handleRedo()
            }
            break

          case 'bulleted-list':
            if (handleBulletedList) {
              handleBulletedList()
            }
            break

          case 'numbered-list':
            if (handleNumberedList) {
              handleNumberedList()
            }
            break

          case 'left':
            if (handleAlign) {
              handleAlign('left')
            }
            break

          case 'center':
            if (handleAlign) {
              handleAlign('center')
            }
            break

          case 'right':
            if (handleAlign) {
              handleAlign('right')
            }
            break

          case 'justify':
            if (handleAlign) {
              handleAlign('justify')
            }
            break

          case 'bold':
            if (handleBoldClick) {
              handleBoldClick()
            }
            break

          case 'italic':
            if (handleItalicClick) {
              handleItalicClick()
            }
            break

          case 'underline':
            if (handleUnderlineClick) {
              handleUnderlineClick()
            }
            break

          case 'strikethrough':
            if (handleStrikethroughClick) {
              handleStrikethroughClick()
            }
            break

          case 'code':
            if (handleCodeClick) {
              handleCodeClick()
            }
            break

          case 'link':
            if (handleLinkClick) {
              handleLinkClick()
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
      return document.queryCommandState(format)
    } else {
      return document.queryCommandState(format)
    }
  }

  // Layout containers are CSS classes; the sacred backdrop is a
  // [data-theme='sacred'] override on .toolbarContainer.
  const toolbarTheme = styles?.theme || 'light'

  // Create button styles for the unified theme system
  const getButtonStyles = (format: string) => {
    const isActive = isFormatActive(format)

    return {
      theme: styles?.theme || 'light',
      backgroundColor: isActive
        ? isSacredTheme
          ? 'rgba(255, 215, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.10)'
        : 'transparent',
      color: isActive
        ? isSacredTheme
          ? '#FFD700'
          : GREY_DARK
        : isSacredTheme
          ? 'rgba(255, 215, 0, 0.8)'
          : BLACK_MAIN,
      borderRadius: '2px',
      minWidth: '36px',
      width: '36px',
      height: '36px',
      padding: '6px',
      margin: '2px',
    }
  }

  return (
    <div
      className={cssStyles.toolbarContainer}
      data-theme={toolbarTheme}
      {...(styles?.showToolbar === false && { 'data-hidden': 'true' })}
      {...(wrapperStyle && { style: wrapperStyle })}
    >
      {/* Row 1: Primary Actions - Undo/Redo + Essential Formatting */}
      <div className={cssStyles.primaryRow}>
        {/* undo / redo */}
        <div className={cssStyles.buttonGroup}>
          <CustomButton
            icon={
              <UndoIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('undo')}
            styles={getButtonStyles('undo')}
            disabled={markdownMode}
          />
          <CustomButton
            icon={
              <RedoIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('redo')}
            styles={getButtonStyles('redo')}
            disabled={markdownMode}
          />
        </div>

        {/* Essential formatting buttons */}
        <div className={cssStyles.buttonGroup}>
          <CustomButton
            icon={
              <FormatBoldIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('bold')}
            styles={getButtonStyles('bold')}
          />
          <CustomButton
            icon={
              <FormatItalicIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('italic')}
            styles={getButtonStyles('italic')}
          />
          <CustomButton
            icon={
              <FormatUnderlinedIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('underline')}
            styles={getButtonStyles('underline')}
            disabled={markdownMode}
          />
        </div>
      </div>

      {/* Row 2: Dropdowns - Text Type & Alignment (only in rich text mode) */}
      {showExtendedOptions && (
        <div className={cssStyles.dropdownRow}>
          <div className={cssStyles.toolbarDropdown}>
            <Dropdown
              label="Text Type"
              options={textTypeOptions}
              value={textType}
              onChange={handleTextTypeChange}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
          <div className={cssStyles.toolbarDropdown}>
            <Dropdown
              label="Alignment"
              options={alignmentOptions}
              value={alignValue}
              onChange={handleAlignChange}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
        </div>
      )}

      {/* Row 3: Secondary Formatting & Structure */}
      <div className={cssStyles.toolbarRow}>
        <div className={cssStyles.buttonGroup}>
          <CustomButton
            icon={
              <StrikethroughSIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('strikethrough')}
            styles={getButtonStyles('strikethrough')}
          />
          <CustomButton
            icon={
              <CodeIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('code')}
            styles={getButtonStyles('code')}
          />
          <CustomButton
            icon={
              <LinkIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
              />
            }
            onClick={handleEditorAction('link')}
            styles={getButtonStyles('link')}
          />
        </div>

        <div className={cssStyles.buttonGroup}>
          <CustomButton
            icon={
              <FormatListNumberedIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
                style={{ width: '16px', height: '16px' }}
              />
            }
            onClick={handleEditorAction('numbered-list')}
            styles={getButtonStyles('numbered-list')}
          />
          <CustomButton
            icon={
              <FormatListBulletedIcon
                styles={{ theme: styles?.theme || 'sacred', size: 16 }}
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

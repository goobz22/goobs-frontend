// src/components/ComplexTextEditor/Toolbars/Complex/index.tsx

'use client'
import React from 'react'
import RichEditor from '../../RichEditor'
import MarkdownEditor from '../../MarkdownEditor'
import SimpleEditor from '../../SimpleEditor'
import Button, { ButtonGroup } from '../../../Button'
import { RichTextEditorTypes } from '../../utils/useRichtextEditor'
import { Descendant } from 'slate'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
} from '../../../../theme/'

export type EditorMode = 'rich' | 'markdown' | 'simple'

interface ComplexToolbarProps {
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  label?: string
  minRows?: number
  simpleValue: string
  setSimpleValue: (value: string) => void
  richValue: Descendant[]
  onRichChange?: () => void
  markdown: string
  setMarkdown: (value: string) => void
  markdownMode: boolean
  setMarkdownMode: React.Dispatch<React.SetStateAction<boolean>>
  styles?: ComplexTextEditorStyles
}

const ComplexToolbar: React.FC<ComplexToolbarProps> = ({
  mode,
  setMode,
  label,
  minRows = 5,
  simpleValue,
  setSimpleValue,
  richValue,
  onRichChange,
  markdown,
  setMarkdown,
  markdownMode,
  setMarkdownMode,
  styles,
}) => {
  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(styles, false)
  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: string | null
  ) => {
    if (newMode !== null) {
      setMode(newMode as EditorMode)
    }
  }

  const setNewSlateValue = (value: RichTextEditorTypes['CustomElement'][]) => {
    console.log('Setting new slate value:', value)
  }

  return (
    <div style={computedStyles.container}>
      {styles?.showModeToggle !== false && (
        <div style={computedStyles.toggleRow}>
          <ButtonGroup value={mode} exclusive onChange={handleModeChange}>
            <Button value="simple" text="Simple" />
            <Button value="rich" text="Rich Text" />
            <Button value="markdown" text="Markdown" />
          </ButtonGroup>
        </div>
      )}

      {mode === 'simple' && (
        <SimpleEditor
          value={simpleValue}
          setValue={setSimpleValue}
          minRows={minRows}
          label={label}
          styles={styles}
        />
      )}

      {mode === 'rich' && (
        <RichEditor
          value={richValue}
          onChange={onRichChange}
          label={label}
          minRows={minRows}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setMarkdown={setMarkdown}
          styles={styles}
        />
      )}

      {mode === 'markdown' && (
        <MarkdownEditor
          markdown={markdown}
          setMarkdown={setMarkdown}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setNewSlateValue={setNewSlateValue}
          styles={styles}
        />
      )}
    </div>
  )
}

export default ComplexToolbar

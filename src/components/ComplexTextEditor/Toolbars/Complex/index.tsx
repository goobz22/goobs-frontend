// src/components/ComplexTextEditor/Toolbars/Complex/index.tsx

'use client'
import React from 'react'
import RichEditor from '../../RichEditor'
import MarkdownEditor from '../../MarkdownEditor'
import SimpleEditor from '../../SimpleEditor'
import { ToggleButton, ToggleButtonGroup } from '../../../ToggleButton'
import { RichTextEditorTypes } from '../../utils/useRichtextEditor'
import { Descendant } from 'slate'

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
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  handleLinkClick?: () => void
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
  accordion?: boolean
  accordionSummary?: React.ReactNode
  defaultExpanded?: boolean
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
  } as React.CSSProperties,

  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
  } as React.CSSProperties,

  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '8px 8px 0 0',
  } as React.CSSProperties,
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
  error,
  helperText,
  required,
  style,
  accordion = false,
  accordionSummary,
  defaultExpanded,
  sacredtheme = false,
}) => {
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

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      <div style={styles.toggleContainer}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          sacredtheme={sacredtheme}
        >
          <ToggleButton value="simple">Simple</ToggleButton>
          <ToggleButton value="rich">Rich Text</ToggleButton>
          <ToggleButton value="markdown">Markdown</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {mode === 'simple' && (
        <SimpleEditor
          value={simpleValue}
          setValue={setSimpleValue}
          minRows={minRows}
          label={label}
          error={error}
          helperText={helperText}
          required={required}
          style={style}
          sacredtheme={sacredtheme}
        />
      )}

      {mode === 'rich' && (
        <RichEditor
          value={richValue}
          onChange={onRichChange}
          label={label}
          minRows={minRows}
          accordion={accordion}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setMarkdown={setMarkdown}
          accordionSummary={accordionSummary}
          defaultExpanded={defaultExpanded}
          sacredtheme={sacredtheme}
        />
      )}

      {mode === 'markdown' && (
        <MarkdownEditor
          markdown={markdown}
          setMarkdown={setMarkdown}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setNewSlateValue={setNewSlateValue}
          sacredtheme={sacredtheme}
        />
      )}
    </div>
  )
}

export default ComplexToolbar

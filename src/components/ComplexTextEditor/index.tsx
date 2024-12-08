import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Descendant } from 'slate'
import RichEditor from './RichEditor'
import MarkdownEditor from './MarkdownEditor'
import SimpleEditor from './SimpleEditor'
import ComplexToolbar, { EditorMode } from './Toolbars/Complex'
import { RichTextEditorTypes } from './types'

export type EditorType = 'simple' | 'markdown' | 'rich' | 'complex'

export interface ComplexTextEditorProps {
  value: Descendant[]
  onChange?: () => void
  label?: string
  minRows?: number
  accordion?: boolean
  editorType?: EditorType
}

const ComplexTextEditor: React.FC<ComplexTextEditorProps> = ({
  value,
  onChange,
  label,
  minRows = 5,
  accordion = false,
  editorType = 'complex',
}) => {
  const [mode, setMode] = useState<EditorMode>(
    editorType === 'complex' ? 'simple' : editorType
  )
  const [markdownMode, setMarkdownMode] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [simpleText, setSimpleText] = useState('')

  const setNewSlateValue = (value: RichTextEditorTypes['CustomElement'][]) => {
    // Handle conversion between markdown and rich text
    console.log('Converting markdown to rich text:', value)
  }

  const renderEditor = () => {
    switch (mode) {
      case 'simple':
        return (
          <SimpleEditor
            value={simpleText}
            setValue={setSimpleText}
            minRows={minRows}
            label={label}
          />
        )
      case 'rich':
        return (
          <RichEditor
            value={value}
            onChange={onChange}
            label={label}
            minRows={minRows}
            accordion={accordion}
          />
        )
      case 'markdown':
        return (
          <MarkdownEditor
            markdown={markdown}
            setMarkdown={setMarkdown}
            markdownMode={markdownMode}
            setMarkdownMode={setMarkdownMode}
            setNewSlateValue={setNewSlateValue}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 1,
        gap: 2,
      }}
    >
      {editorType === 'complex' && (
        <ComplexToolbar
          mode={mode}
          setMode={setMode}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setMarkdown={setMarkdown}
        />
      )}

      {renderEditor()}
    </Box>
  )
}

export default ComplexTextEditor

// src\components\ComplexTextEditor\index.tsx

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import SimpleEditor from './SimpleEditor'
import ComplexToolbar, { EditorMode } from './Toolbars/Complex'

export type EditorType = 'simple' | 'markdown' | 'rich' | 'complex'

export interface ComplexTextEditorProps {
  value: string
  onChange?: (val: string) => void
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
  editorType = 'complex',
}) => {
  // If editorType is complex, start in simple mode
  const [mode, setMode] = useState<EditorMode>(
    editorType === 'complex' ? 'simple' : editorType
  )
  const [simpleText, setSimpleText] = useState(value)

  useEffect(() => {
    // If the input value changes from outside, update simpleText
    setSimpleText(value)
  }, [value])

  const handleSimpleTextChange = (newVal: string) => {
    setSimpleText(newVal)
    if (onChange) {
      onChange(newVal)
    }
  }

  const renderEditor = () => {
    // For now, we only support 'simple' directly. You can expand to 'rich'/'markdown' if needed.
    if (mode === 'simple') {
      return (
        <SimpleEditor
          value={simpleText}
          setValue={handleSimpleTextChange}
          minRows={minRows}
          label={label}
        />
      )
    }

    // If you implement other modes (rich, markdown), handle them here.
    return (
      <SimpleEditor
        value={simpleText}
        setValue={handleSimpleTextChange}
        minRows={minRows}
        label={label}
      />
    )
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
          markdownMode={false}
          setMarkdownMode={() => {}}
          setMarkdown={() => {}}
        />
      )}

      {renderEditor()}
    </Box>
  )
}

export default ComplexTextEditor

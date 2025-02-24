'use client'
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
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
}

const ComplexTextEditor: React.FC<ComplexTextEditorProps> = ({
  value,
  onChange,
  label,
  minRows = 5,
  editorType = 'complex',
  error,
  helperText,
  required,
  style,
}) => {
  const [mode, setMode] = useState<EditorMode>(
    editorType === 'complex' ? 'simple' : editorType
  )
  const [simpleText, setSimpleText] = useState(value)

  useEffect(() => {
    setSimpleText(value)
  }, [value])

  const handleSimpleTextChange = (newVal: string) => {
    setSimpleText(newVal)
    if (onChange) {
      onChange(newVal)
    }
  }

  const renderEditor = () => {
    if (mode === 'simple') {
      return (
        <SimpleEditor
          value={simpleText}
          setValue={handleSimpleTextChange}
          minRows={minRows}
          label={label}
          error={error}
          helperText={helperText}
          required={required}
          style={style}
        />
      )
    }

    return (
      <SimpleEditor
        value={simpleText}
        setValue={handleSimpleTextChange}
        minRows={minRows}
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        style={style}
      />
    )
  }

  const defaultStyles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 1,
    gap: 2,
  }

  const combinedStyles = {
    ...defaultStyles,
    ...style,
  }

  return (
    <Box sx={combinedStyles}>
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

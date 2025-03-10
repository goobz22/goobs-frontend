'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Box } from '@mui/material'
import { Descendant } from 'slate'
import ComplexToolbar, { EditorMode } from './Toolbars/Complex'

export interface ComplexTextEditorProps {
  // For backward compatibility
  value?: string
  editorType?: 'simple' | 'markdown' | 'rich' | 'complex'

  // New API
  initialValue?: string
  initialMode?: EditorMode

  // Common props
  label?: string
  minRows?: number
  onChange?: (value: string) => void
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
  accordion?: boolean
}

// Initial empty slate value
const initialSlateValue: Descendant[] = [
  {
    children: [{ text: '' }],
  },
]

const ComplexTextEditor: React.FC<ComplexTextEditorProps> = ({
  // Handle both old and new APIs
  value,
  editorType,
  initialValue = '',
  initialMode,

  // Common props
  label,
  minRows = 5,
  onChange,
  error,
  helperText,
  required,
  style,
  accordion = false,
}) => {
  // Determine initial values based on either new or old API
  const startValue = value !== undefined ? value : initialValue
  const startMode = determineStartMode(editorType, initialMode)

  // Editor mode state
  const [mode, setMode] = useState<EditorMode>(startMode)

  // Editor content states
  const [simpleValue, setSimpleValue] = useState(startValue)
  const [richValue] = useState<Descendant[]>(initialSlateValue)
  const [markdown, setMarkdown] = useState(startValue)

  // Markdown mode state (needed for both rich and markdown editor)
  const [markdownMode, setMarkdownMode] = useState(startMode === 'markdown')

  // Update state when props change for backward compatibility
  useEffect(() => {
    if (value !== undefined && value !== simpleValue) {
      setSimpleValue(value)
      setMarkdown(value)
    }
  }, [value, simpleValue])

  // Handle changes and propagate to parent component
  const handleSimpleValueChange = useCallback(
    (value: string) => {
      setSimpleValue(value)
      if (onChange) onChange(value)
    },
    [onChange]
  )

  // This is a dummy handler for rich editor change
  // In a real implementation, you would convert the rich content to string
  const handleRichChange = useCallback(() => {
    // This would normally convert the rich content to string
    // and call onChange with that value
    console.log('Rich content changed')
  }, [])

  // Handle markdown changes
  const handleMarkdownChange = useCallback(
    (value: string) => {
      setMarkdown(value)
      if (onChange) onChange(value)
    },
    [onChange]
  )

  const defaultStyles: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  const combinedStyles = {
    ...defaultStyles,
    ...style,
  }

  return (
    <Box sx={combinedStyles}>
      <ComplexToolbar
        mode={mode}
        setMode={setMode}
        label={label}
        minRows={minRows}
        // Simple editor props
        simpleValue={simpleValue}
        setSimpleValue={handleSimpleValueChange}
        // Rich editor props
        richValue={richValue}
        onRichChange={handleRichChange}
        // Markdown editor props
        markdown={markdown}
        setMarkdown={handleMarkdownChange}
        // Shared state
        markdownMode={markdownMode}
        setMarkdownMode={setMarkdownMode}
        // Optional styling props
        error={error}
        helperText={helperText}
        required={required}
        style={style}
        // Optional accordion props
        accordion={accordion}
      />
    </Box>
  )
}

// Helper function to determine the initial mode
function determineStartMode(
  editorType?: 'simple' | 'markdown' | 'rich' | 'complex',
  initialMode?: EditorMode
): EditorMode {
  // First check the new API
  if (initialMode) {
    return initialMode
  }

  // Then fall back to the old API
  if (editorType === 'simple' || editorType === 'complex') {
    return 'simple'
  } else if (editorType === 'markdown') {
    return 'markdown'
  } else if (editorType === 'rich') {
    return 'rich'
  }

  // Default
  return 'simple'
}

export default ComplexTextEditor

// src/components/ComplexTextEditor/index.tsx

'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Box, keyframes, alpha } from '@mui/material'
import { Descendant } from 'slate'
import ComplexToolbar, { EditorMode } from './Toolbars/Complex'
import SimpleEditor from './SimpleEditor'
import Accordion from '../Accordion'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

const sacredGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2); }
`

const glyphFloat = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-5px) rotate(180deg); opacity: 0.4; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.2; }
`

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

  // Accordion props
  accordion?: boolean
  accordionSummary?: React.ReactNode
  defaultExpanded?: boolean

  // Sacred theme
  sacredTheme?: boolean
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

  // Accordion props
  accordion = false,
  accordionSummary = 'Text Editor',
  defaultExpanded = false,

  // Sacred theme
  sacredTheme = false,
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
    position: 'relative',
  }

  const combinedStyles = {
    ...defaultStyles,
    ...style,
  }

  // Create the editor content component
  const createEditorContent = () => {
    // When in accordion mode, don't pass the label to avoid duplication
    const editorLabel = accordion ? undefined : label

    // If editorType is explicitly set to 'simple', only render the SimpleEditor without toolbar
    if (editorType === 'simple') {
      return (
        <SimpleEditor
          value={simpleValue}
          setValue={handleSimpleValueChange}
          minRows={minRows}
          label={editorLabel}
          error={error}
          helperText={helperText}
          required={required}
          style={style}
          sacredTheme={sacredTheme}
        />
      )
    }

    // Otherwise, render the ComplexToolbar with mode toggling options
    return (
      <ComplexToolbar
        mode={mode}
        setMode={setMode}
        label={editorLabel}
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
        accordionSummary={accordionSummary}
        defaultExpanded={defaultExpanded}
        // Sacred theme
        sacredTheme={sacredTheme}
      />
    )
  }

  // If accordion is enabled, wrap the editor with the Accordion component
  if (accordion) {
    const summaryText = accordionSummary || label || 'Text Editor'

    return (
      <Box sx={combinedStyles}>
        <Accordion
          summary={summaryText}
          details={createEditorContent()}
          defaultExpanded={defaultExpanded}
          sacredTheme={sacredTheme}
        />
        {/* Sacred decorative elements */}
        {sacredTheme && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '-20px',
              right: '20px',
              color: alpha('#FFD700', 0.2),
              fontSize: '48px',
              animation: `${glyphFloat} 10s ease-in-out infinite`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {SACRED_GLYPHS[14]}
          </Box>
        )}
      </Box>
    )
  }

  // Otherwise, render the editor content directly
  return (
    <Box sx={combinedStyles}>
      {createEditorContent()}
      {/* Sacred decorative elements */}
      {sacredTheme && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20px',
            right: '20px',
            color: alpha('#FFD700', 0.2),
            fontSize: '48px',
            animation: `${glyphFloat} 10s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {SACRED_GLYPHS[14]}
        </Box>
      )}
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

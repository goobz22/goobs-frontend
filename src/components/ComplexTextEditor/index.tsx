// src/components/ComplexTextEditor/index.tsx

'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Descendant } from 'slate'
import ComplexToolbar, { EditorMode } from './Toolbars/Complex'
import SimpleEditor from './SimpleEditor'
import Accordion from '../Accordion'
import { SACRED_GLYPHS } from '../../styles/sacredGlyphs'

export interface ComplexTextEditorProps {
  value?: string
  editorType?: 'simple' | 'markdown' | 'rich' | 'complex'
  initialValue?: string
  initialMode?: EditorMode
  label?: string
  minRows?: number
  onChange?: (value: string) => void
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    bottom: '-20px',
    right: '20px',
    fontSize: '48px',
    color: 'rgba(255, 215, 0, 0.2)',
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'all 0.3s ease',
    animation: 'complexTextEditorGlyphFloat 10s ease-in-out infinite',
  } as React.CSSProperties,
}

const initialSlateValue: Descendant[] = [
  {
    children: [{ text: '' }],
  },
]

const ComplexTextEditor: React.FC<ComplexTextEditorProps> = ({
  value,
  editorType,
  initialValue = '',
  initialMode,
  label,
  minRows = 5,
  onChange,
  error,
  helperText,
  required,
  style,
  accordion = false,
  accordionSummary = 'Text Editor',
  defaultExpanded = false,
  sacredtheme = false,
}) => {
  const startValue = value !== undefined ? value : initialValue
  const startMode = determineStartMode(editorType, initialMode)
  const [mode, setMode] = useState<EditorMode>(startMode)
  const [simpleValue, setSimpleValue] = useState(startValue)
  const [richValue] = useState<Descendant[]>(initialSlateValue)
  const [markdown, setMarkdown] = useState(startValue)
  const [markdownMode, setMarkdownMode] = useState(startMode === 'markdown')

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes complexTextEditorGlyphFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% { 
            transform: translateY(-5px) rotate(180deg);
            opacity: 0.4;
          }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  useEffect(() => {
    if (value !== undefined && value !== simpleValue) {
      setSimpleValue(value)
      setMarkdown(value)
    }
  }, [value, simpleValue])

  const handleSimpleValueChange = useCallback(
    (value: string) => {
      setSimpleValue(value)
      if (onChange) onChange(value)
    },
    [onChange]
  )

  const handleRichChange = useCallback(() => {
    console.log('Rich content changed')
  }, [])

  const handleMarkdownChange = useCallback(
    (value: string) => {
      setMarkdown(value)
      if (onChange) onChange(value)
    },
    [onChange]
  )

  const createEditorContent = () => {
    const editorLabel = accordion ? undefined : label

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
          sacredtheme={sacredtheme}
        />
      )
    }

    return (
      <ComplexToolbar
        mode={mode}
        setMode={setMode}
        label={editorLabel}
        minRows={minRows}
        simpleValue={simpleValue}
        setSimpleValue={handleSimpleValueChange}
        richValue={richValue}
        onRichChange={handleRichChange}
        markdown={markdown}
        setMarkdown={handleMarkdownChange}
        markdownMode={markdownMode}
        setMarkdownMode={setMarkdownMode}
        error={error}
        helperText={helperText}
        required={required}
        style={style}
        accordion={accordion}
        accordionSummary={accordionSummary}
        defaultExpanded={defaultExpanded}
        sacredtheme={sacredtheme}
      />
    )
  }

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const containerStyle = {
    ...styles.container,
    ...style,
  }

  const editorComponent = (
    <div style={containerStyle}>
      {createEditorContent()}
      {sacredtheme && <div style={sacredStyles.glyph}>{SACRED_GLYPHS[14]}</div>}
    </div>
  )

  if (accordion) {
    const summaryText = accordionSummary || label || 'Text Editor'
    return (
      <div style={containerStyle}>
        <Accordion
          summary={summaryText}
          details={createEditorContent()}
          expanded={defaultExpanded}
          sacredtheme={sacredtheme}
        />
        {sacredtheme && (
          <div style={sacredStyles.glyph}>{SACRED_GLYPHS[14]}</div>
        )}
      </div>
    )
  }

  return editorComponent
}

function determineStartMode(
  editorType?: 'simple' | 'markdown' | 'rich' | 'complex',
  initialMode?: EditorMode
): EditorMode {
  if (initialMode) {
    return initialMode
  }
  if (editorType === 'simple' || editorType === 'complex') {
    return 'simple'
  } else if (editorType === 'markdown') {
    return 'markdown'
  } else if (editorType === 'rich') {
    return 'rich'
  }
  return 'simple'
}

export default ComplexTextEditor

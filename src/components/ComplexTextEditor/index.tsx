/**
 * @fileoverview Defines the ComplexTextEditor, a versatile text editor with multiple modes.
 */
'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Descendant } from 'slate'
import ComplexToolbar, { EditorMode } from './Toolbars/Complex'
import SimpleEditor from './SimpleEditor'
import Accordion from '../Accordion'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedFooterTextStyles,
  SACRED_GLYPHS,
} from '../../theme/'

export interface ComplexTextEditorProps {
  /** The current value of the editor (for controlled usage). */
  value?: string
  /** The type of editor to render. */
  editorType?: 'simple' | 'markdown' | 'rich' | 'complex'
  /** The initial value of the editor (for uncontrolled usage). */
  initialValue?: string
  /** The initial mode for complex editors. */
  initialMode?: EditorMode
  /** The label for the editor. */
  label?: string
  /** The minimum number of rows for the editor. */
  minRows?: number
  /** Callback fired when the editor value changes. */
  onChange?: (value: string) => void
  /** Helper text to display below the editor. */
  helperText?: React.ReactNode
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: ComplexTextEditorStyles
}

// Initial Slate value for rich text editor
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
  helperText,
  styles,
}) => {
  // Extract settings from styles
  const accordion = styles?.accordionMode || false
  const accordionSummary = styles?.accordionSummary || label || 'Text Editor'
  const defaultExpanded = styles?.accordionDefaultExpanded || false
  const isSacredTheme = styles?.theme === 'sacred'

  console.log('ComplexTextEditor rendered:', {
    editorType,
    theme: styles?.theme,
  })
  const startValue = value !== undefined ? value : initialValue
  const startMode = determineStartMode(
    editorType,
    initialMode,
    styles?.defaultMode
  )
  const [mode, setMode] = useState<EditorMode>(startMode)
  const [simpleValue, setSimpleValue] = useState(startValue)
  const [richValue] = useState<Descendant[]>(initialSlateValue)
  const [markdown, setMarkdown] = useState(startValue)
  const [markdownMode, setMarkdownMode] = useState(startMode === 'markdown')
  const [isFocused, _setIsFocused] = useState(false)

  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(styles, isFocused)
  const { themeConfig, footerTextColor } = getSharedFormFieldStyles(
    styles,
    isFocused
  )

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
          styles={styles}
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
        styles={styles}
      />
    )
  }

  // Render label if provided and not in accordion mode
  const labelElement = label && !accordion && (
    <label style={getSharedLabelStyles(themeConfig.label.default, themeConfig)}>
      {label}
    </label>
  )

  // Render helper text if provided
  const helperTextElement = helperText && (
    <div
      style={getSharedFooterTextStyles(footerTextColor, themeConfig, styles)}
    >
      {helperText}
    </div>
  )

  if (accordion) {
    const summaryText = accordionSummary || label || 'Text Editor'
    return (
      <div style={computedStyles.container}>
        <Accordion
          summary={summaryText}
          details={createEditorContent()}
          expanded={defaultExpanded}
          styles={{ theme: styles?.theme }}
        />
        {isSacredTheme && (
          <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[14]}</div>
        )}
      </div>
    )
  }

  return (
    <div style={computedStyles.container}>
      {labelElement}
      {createEditorContent()}
      {helperTextElement}
      {isSacredTheme && (
        <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[14]}</div>
      )}
    </div>
  )
}

function determineStartMode(
  editorType?: 'simple' | 'markdown' | 'rich' | 'complex',
  initialMode?: EditorMode,
  defaultMode?: 'simple' | 'rich' | 'markdown'
): EditorMode {
  if (initialMode) return initialMode
  if (defaultMode) return defaultMode
  switch (editorType) {
    case 'markdown':
      return 'markdown'
    case 'rich':
      return 'rich'
    case 'simple':
    case 'complex':
    default:
      return 'simple'
  }
}

export default ComplexTextEditor

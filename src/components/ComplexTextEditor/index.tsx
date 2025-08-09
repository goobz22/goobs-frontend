/**
 * @fileoverview Defines the ComplexTextEditor, a versatile text editor with multiple modes.
 */
'use client'
import React, { useState, useCallback, useEffect } from 'react'
import ComplexToolbar from './Toolbars/Complex'
import type { EditorMode } from './Toolbars/Complex'
import SimpleEditor from './SimpleEditor'
import Accordion from '../Accordion'
import {
  getComplexTextEditorStyles,
  getSharedFormFieldStyles,
  getSharedLabelStyles,
  getSharedFooterTextStyles,
  SACRED_GLYPHS,
} from '../../theme/'
import type { ComplexTextEditorStyles } from '../../theme/'

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
  autoSave?: boolean
  autoSaveKey?: string
}

const ComplexTextEditor: React.FC<ComplexTextEditorProps> = ({
  value: valueProp,
  editorType,
  initialValue = '',
  initialMode,
  label,
  minRows = 5,
  onChange,
  helperText,
  styles,
  autoSave,
  autoSaveKey,
}) => {
  // Extract settings from styles
  const accordion = styles?.accordionMode || false
  const accordionSummary = styles?.accordionSummary || label || 'Text Editor'
  const defaultExpanded = styles?.accordionDefaultExpanded || false
  const isSacredTheme = styles?.theme === 'sacred'

  const startValue = initialValue
  const startMode = determineStartMode(
    editorType,
    initialMode,
    styles?.defaultMode
  )
  const [valueState, setValueState] = useState<string>(startValue)
  const value = valueProp !== undefined ? valueProp : valueState
  const [mode, setMode] = useState<EditorMode>(startMode)
  const [isFocused, _setIsFocused] = useState(false)
  const [accordionExpanded, setAccordionExpanded] =
    useState<boolean>(defaultExpanded)

  // Get computed styles with transparent label background override
  const stylesWithTransparentLabel = {
    ...styles,
    labelShrunkBackgroundColor: 'transparent',
  }
  const computedStyles = getComplexTextEditorStyles(
    stylesWithTransparentLabel,
    isFocused
  )
  const { themeConfig, footerTextColor } = getSharedFormFieldStyles(
    stylesWithTransparentLabel,
    isFocused
  )

  useEffect(() => {
    if (autoSave && autoSaveKey) {
      const draft = localStorage.getItem(autoSaveKey)
      if (draft && !value) setValueState(draft)
    }
  }, [autoSave, autoSaveKey, value])
  useEffect(() => {
    if (autoSave && autoSaveKey) {
      const timeout = setTimeout(
        () => localStorage.setItem(autoSaveKey, value),
        1000
      )
      return () => clearTimeout(timeout)
    }
  }, [autoSave, autoSaveKey, value])

  const handleChange = useCallback(
    (newValue: string) => {
      if (valueProp === undefined) setValueState(newValue)
      if (onChange) onChange(newValue)
    },
    [onChange, valueProp]
  )

  const createEditorContent = () => {
    if (editorType === 'simple') {
      return (
        <SimpleEditor
          value={value}
          onChange={handleChange}
          minRows={minRows}
          styles={styles as ComplexTextEditorStyles}
        />
      )
    } else if (editorType === 'rich') {
      return (
        <ComplexToolbar
          mode={mode}
          setMode={setMode}
          value={value}
          onChange={handleChange}
          minRows={minRows}
          styles={styles as ComplexTextEditorStyles}
        />
      )
    } else if (editorType === 'markdown') {
      return (
        <ComplexToolbar
          mode={mode}
          setMode={setMode}
          value={value}
          onChange={handleChange}
          minRows={minRows}
          styles={styles as ComplexTextEditorStyles}
        />
      )
    } else {
      return (
        <ComplexToolbar
          mode={mode}
          setMode={setMode}
          value={value}
          onChange={handleChange}
          minRows={minRows}
          styles={styles as ComplexTextEditorStyles}
        />
      )
    }
  }

  // Render label if provided and not in accordion mode
  const labelElement = label && !accordion && (
    <label
      style={{
        ...getSharedLabelStyles(themeConfig.label.default, themeConfig),
        background: 'transparent',
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        padding: '0',
        borderRadius: '0',
        boxShadow: 'none',
        // Sacred theme styling
        ...(isSacredTheme && {
          color: 'rgba(255, 215, 0, 0.9)', // Sacred gold color
          fontFamily: '"Cinzel", serif', // Sacred font
          textShadow: '0 0 3px rgba(255, 215, 0, 0.3)', // Sacred glow
          letterSpacing: '0.05em',
          fontWeight: 700,
          textTransform: 'uppercase' as const,
        }),
      }}
    >
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

    const handleAccordionChange = (
      _event: React.SyntheticEvent,
      expanded: boolean
    ) => {
      setAccordionExpanded(expanded)
    }

    return (
      <div style={computedStyles.container}>
        <Accordion
          summary={summaryText}
          details={createEditorContent()}
          expanded={accordionExpanded}
          onChange={handleAccordionChange}
          styles={{ theme: styles?.theme || 'light' }}
        />
        {isSacredTheme && (
          <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[14]}</div>
        )}
      </div>
    )
  }

  return (
    <div>
      {labelElement}
      <div style={computedStyles.container}>
        {createEditorContent()}
        {helperTextElement}
        {isSacredTheme && (
          <div style={computedStyles.sacredGlyph}>{SACRED_GLYPHS[14]}</div>
        )}
      </div>
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

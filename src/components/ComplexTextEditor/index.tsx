/**
 * @fileoverview Defines the ComplexTextEditor, a versatile text editor with multiple modes.
 */
'use client'
import React, { useState, useCallback, useEffect } from 'react'
import ComplexToolbar, { type EditorMode } from './Toolbars/Complex'
import SimpleEditor from './SimpleEditor'
import Accordion from '../Accordion'
import { useFieldBinding } from '../Field/Shell/useFieldBinding'
import { useOptionalFormContext } from '../Form/context'
import {
  getComplexTextEditorStyles,
  getFormFieldTheme,
  type ComplexTextEditorStyles,
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
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** HTML-style field name. Alias for dataFieldName so the test contract can target the field by either; data-field-name is emitted from dataFieldName ?? name. */
  name?: string
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
  dataFieldName,
  name,
  styles,
  autoSave,
  autoSaveKey,
}) => {
  // Tier-1 form binding. Inside a <Form> with a `name` and no explicit `value`,
  // the editor's string value + onChange come from the form engine; otherwise
  // the caller's explicit value/onChange pass through unchanged (back-compat).
  const formContext = useOptionalFormContext()
  const {
    value: boundValue,
    onChange: boundOnChange,
    onBlur: boundOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valueProp,
    onChange,
  })
  const isBound = boundOnChange !== undefined && boundValue !== undefined

  // Extract settings from styles
  const accordion = styles?.accordionMode || false
  const accordionSummary = styles?.accordionSummary || label || 'Text Editor'
  const defaultExpanded = styles?.accordionDefaultExpanded || false
  const isSacredTheme = styles?.theme === 'sacred'

  const startMode = determineStartMode(
    editorType,
    initialMode,
    styles?.defaultMode
  )

  // Use lazy initialization to load draft from localStorage on mount
  // This avoids the need for an effect that calls setState
  const [valueState, setValueState] = useState<string>(() => {
    if (autoSave && autoSaveKey && typeof window !== 'undefined') {
      const draft = localStorage.getItem(autoSaveKey)
      if (draft && !initialValue) {
        return draft
      }
    }
    return initialValue
  })
  // When bound, the engine value drives the editor; otherwise the legacy
  // controlled (valueProp) / uncontrolled (valueState) resolution is kept.
  const value = isBound
    ? (boundValue ?? '')
    : valueProp !== undefined
      ? valueProp
      : valueState
  const [mode, setMode] = useState<EditorMode>(startMode)
  const [isFocused] = useState(false)
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
  // Inlined the slim slice of `getSharedFormFieldStyles` this
  // component used: the resolved theme config + the footer text color
  // (driven by `helperTextType`). Field components moved to CSS
  // modules + FieldShell; this component still uses inline styles.
  const themeConfig = getFormFieldTheme(stylesWithTransparentLabel)
  const helperTextType = stylesWithTransparentLabel.helperTextType || 'info'
  const footerTextColor =
    helperTextType === 'error'
      ? themeConfig.footerText.error
      : themeConfig.footerText.default

  // Auto-save to localStorage with debounce
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
      // When bound to the form engine, write through boundOnChange (which also
      // chains the caller's original onChange). Otherwise preserve the legacy
      // controlled/uncontrolled behavior exactly.
      if (isBound) {
        boundOnChange?.(newValue)
        return
      }
      if (valueProp === undefined) setValueState(newValue)
      if (onChange) onChange(newValue)
    },
    [isBound, boundOnChange, onChange, valueProp]
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
        // Inlined from the deleted `getSharedLabelStyles` helper.
        display: 'block',
        marginBottom: '4px',
        fontSize: '14px',
        fontFamily: themeConfig.fontFamily,
        color: themeConfig.label.default,
        transition: 'all 0.2s ease',
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

  // Render helper text if provided. Inlined from the deleted
  // `getSharedFooterTextStyles` helper.
  const helperTextElement = helperText && (
    <div
      style={{
        marginTop: '4px',
        fontSize: styles?.fontSize || '12px',
        fontFamily: themeConfig.fontFamily,
        color: footerTextColor,
        minHeight: '1em',
      }}
    >
      {helperText}
    </div>
  )

  // Tier-1 root data flags. `data-filled` reflects any editor content;
  // `data-error` surfaces the engine error when bound (this component renders
  // no error UI of its own beyond caller-supplied helperText, per the contract).
  const hasValue = value.length > 0
  const engineError =
    formContext && name ? formContext.engine.getError(name) : undefined

  if (accordion) {
    const summaryText = accordionSummary || label || 'Text Editor'

    const handleAccordionChange = (
      _event: React.SyntheticEvent,
      expanded: boolean
    ) => {
      setAccordionExpanded(expanded)
    }

    return (
      <div
        style={computedStyles.container}
        data-component="ComplexTextEditor"
        data-field-name={dataFieldName ?? name}
        data-filled={hasValue ? 'true' : undefined}
        {...(engineError && { 'data-error': 'true' })}
        onBlur={() => boundOnBlur?.()}
      >
        <Accordion
          summary={summaryText}
          details={createEditorContent()}
          expanded={accordionExpanded}
          onChange={handleAccordionChange}
          styles={{ theme: styles?.theme || 'light' }}
        />
      </div>
    )
  }

  return (
    <div
      data-component="ComplexTextEditor"
      data-field-name={dataFieldName ?? name}
      data-filled={hasValue ? 'true' : undefined}
      {...(engineError && { 'data-error': 'true' })}
      onBlur={() => boundOnBlur?.()}
    >
      {labelElement}
      <div style={computedStyles.container}>
        {createEditorContent()}
        {helperTextElement}
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

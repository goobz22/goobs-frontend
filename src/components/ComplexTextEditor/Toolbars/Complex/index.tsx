// src/components/ComplexTextEditor/Toolbars/Complex/index.tsx

'use client'
import React from 'react'
import RichEditor from '../../RichEditor'
import MarkdownEditor from '../../MarkdownEditor'
import SimpleEditor from '../../SimpleEditor'
import Button, { ButtonGroup } from '../../../Button'
import {
  ComplexTextEditorStyles,
  getComplexTextEditorStyles,
} from '../../../../theme/'
import { convertValue } from '../../utils/conversion'

export type EditorMode = 'rich' | 'markdown' | 'simple'

interface ComplexToolbarProps {
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  value: string
  onChange: (value: string) => void
  minRows?: number
  styles?: ComplexTextEditorStyles
}

const ComplexToolbar: React.FC<ComplexToolbarProps> = ({
  mode,
  setMode,
  value,
  onChange,
  minRows = 5,
  styles,
}) => {
  // Get computed styles
  const computedStyles = getComplexTextEditorStyles(styles, false)
  const handleModeChange = (newMode: EditorMode) => {
    const converted = convertValue(value, mode, newMode)
    onChange(converted)
    setMode(newMode)
  }

  const handleModeChangeWrapper = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (newValue) handleModeChange(newValue as EditorMode)
  }

  return (
    <div style={computedStyles.container}>
      {styles?.showModeToggle !== false && (
        <div style={computedStyles.toggleRow}>
          <ButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChangeWrapper}
            styles={{
              theme: styles?.theme || 'light',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              boxShadow: 'none',
              padding: '0',
              margin: '0',
            }}
          >
            <Button value="simple" text="Simple" />
            <Button value="rich" text="Rich Text" />
            <Button value="markdown" text="Markdown" />
          </ButtonGroup>
        </div>
      )}

      {mode === 'simple' && (
        <SimpleEditor
          value={value}
          onChange={onChange}
          minRows={minRows}
          styles={styles}
        />
      )}

      {mode === 'rich' && (
        <RichEditor
          value={value}
          onChange={onChange}
          minRows={minRows}
          styles={styles}
        />
      )}

      {mode === 'markdown' && (
        <MarkdownEditor
          value={value}
          onChange={onChange}
          minRows={minRows}
          styles={styles}
        />
      )}
    </div>
  )
}

export default ComplexToolbar

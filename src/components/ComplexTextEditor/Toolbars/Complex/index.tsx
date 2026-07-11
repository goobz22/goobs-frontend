// src/components/ComplexTextEditor/Toolbars/Complex/index.tsx

'use client'
import React from 'react'
import RichEditor from '../../RichEditor'
import MarkdownEditor from '../../MarkdownEditor'
import SimpleEditor from '../../SimpleEditor'
import Button, { ButtonGroup } from '../../../Button'
import type { ComplexTextEditorStyles } from '../../theme'
import cssStyles from '../../ComplexTextEditor.module.css'
import { convertValue } from '../../utils/conversion'

export type EditorMode = 'rich' | 'markdown' | 'simple'

interface ComplexToolbarProps {
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  value: string
  onChange: (value: string) => void
  minRows?: number
  styles?: ComplexTextEditorStyles
  /** Accessible name for the editing surface (used when no visible label is linked). */
  ariaLabel?: string
  /** Id of the visible label element to associate with the editing surface. */
  ariaLabelledBy?: string
}

const ComplexToolbar: React.FC<ComplexToolbarProps> = ({
  mode,
  setMode,
  value,
  onChange,
  minRows = 5,
  styles,
  ariaLabel,
  ariaLabelledBy,
}) => {
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
    <div className={cssStyles.container} data-theme={styles?.theme || 'light'}>
      {styles?.showModeToggle !== false && (
        <div
          className={cssStyles.toggleRow}
          role="group"
          aria-label="Editor mode"
        >
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
            {/* Single-select mode switch: aria-pressed exposes which mode is
                active (state was previously conveyed by the .selected class
                alone — color/visual only, WCAG 1.4.1 / 4.1.2). */}
            <Button
              value="simple"
              text="Simple"
              aria-pressed={mode === 'simple'}
            />
            <Button
              value="rich"
              text="Rich Text"
              aria-pressed={mode === 'rich'}
            />
            <Button
              value="markdown"
              text="Markdown"
              aria-pressed={mode === 'markdown'}
            />
          </ButtonGroup>
        </div>
      )}

      {mode === 'simple' && (
        <SimpleEditor
          value={value}
          onChange={onChange}
          minRows={minRows}
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          {...(styles ? { styles } : {})}
        />
      )}

      {mode === 'rich' && (
        <RichEditor
          value={value}
          onChange={onChange}
          minRows={minRows}
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          {...(styles ? { styles } : {})}
        />
      )}

      {mode === 'markdown' && (
        <MarkdownEditor
          value={value}
          onChange={onChange}
          minRows={minRows}
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          {...(styles ? { styles } : {})}
        />
      )}
    </div>
  )
}

export default ComplexToolbar

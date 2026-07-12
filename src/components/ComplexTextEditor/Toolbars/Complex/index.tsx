// src/components/ComplexTextEditor/Toolbars/Complex/index.tsx

'use client'
import React, { useState } from 'react'
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
  ariaLabel?: string | undefined
  /** Id of the visible label element to associate with the editing surface. */
  ariaLabelledBy?: string | undefined
  /** Stable id for the currently-rendered editing surface — applied as its `id` so the visible `<label htmlFor>` can target it. */
  editorId?: string | undefined
}

// Human-readable surface names announced to AT when the editing mode changes.
const MODE_LABELS: Record<EditorMode, string> = {
  simple: 'Simple text editor',
  rich: 'Rich text editor',
  markdown: 'Markdown editor',
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
  editorId,
}) => {
  // Screen-reader announcement channel for the mode switch. Sighted users see
  // the editing surface swap directly; AT users need the context change spoken
  // (WCAG 4.1.3 Status Messages). Starts empty so nothing is announced on
  // mount — populated only when the user switches mode.
  const [announcement, setAnnouncement] = useState('')

  const handleModeChange = (newMode: EditorMode) => {
    const converted = convertValue(value, mode, newMode)
    onChange(converted)
    setMode(newMode)
    setAnnouncement(`${MODE_LABELS[newMode]} selected`)
  }

  const handleModeChangeWrapper = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (newValue) handleModeChange(newValue as EditorMode)
  }

  return (
    <div className={cssStyles.container} data-theme={styles?.theme || 'light'}>
      {/* Polite live region announcing the editing-surface change to screen
          readers (WCAG 4.1.3). Visually hidden; empty until the first switch. */}
      <span role="status" aria-live="polite" className={cssStyles.srOnly}>
        {announcement}
      </span>
      {styles?.showModeToggle !== false && (
        // The accessible group name goes on ButtonGroup itself — it already
        // renders its own <div role="group">, so an outer role="group" here
        // produced a labelled group directly wrapping an unlabelled group
        // (double group announcement in some AT). One labelled group only.
        <div className={cssStyles.toggleRow}>
          <ButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChangeWrapper}
            aria-label="Editor mode"
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
          editorId={editorId}
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
          editorId={editorId}
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
          editorId={editorId}
          {...(styles ? { styles } : {})}
        />
      )}
    </div>
  )
}

export default ComplexToolbar

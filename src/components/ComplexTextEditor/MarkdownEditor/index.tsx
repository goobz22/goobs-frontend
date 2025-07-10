// src/components/ComplexTextEditor/MarkdownEditor/index.tsx

'use client'
import React, { useEffect, useState } from 'react'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Editor'
import { RichTextEditorTypes } from '../utils/useRichtextEditor'
import { SACRED_GLYPHS } from '../../../styles/sacredGlyphs'

type MarkdownEditorProps = {
  markdown: string
  setMarkdown: (value: string) => void
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setNewSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    border: '1px solid rgba(0, 0, 0, 1)',
    borderRadius: '8px',
    width: 'auto',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  } as React.CSSProperties,

  separator: {
    borderColor: 'rgba(0, 0, 0, 1)',
  } as React.CSSProperties,

  textarea: {
    boxSizing: 'border-box',
    padding: '4px',
    width: '100%',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: 'rgba(0, 0, 0, 1)',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    width: 'auto',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    backgroundImage:
      'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.05), transparent)',
    boxShadow:
      '0 4px 6px -1px rgba(255, 215, 0, 0.2), 0 2px 4px -1px rgba(255, 215, 0, 0.1)',
  } as React.CSSProperties,

  separator: {
    borderColor: 'rgba(255, 215, 0, 0.3)',
    boxShadow:
      '0 4px 6px -1px rgba(255, 215, 0, 0.3), 0 2px 4px -1px rgba(255, 215, 0, 0.2)',
  } as React.CSSProperties,

  textarea: {
    boxSizing: 'border-box',
    padding: '4px',
    width: '100%',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    color: 'rgba(255, 215, 0, 0.9)',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    animation: 'markdownEditorCodeGlow 4s ease-in-out infinite',
    '&::selection': {
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
      color: 'rgba(255, 215, 0, 1)',
    },
  } as React.CSSProperties,

  glyph: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    fontSize: '32px',
    color: 'rgba(255, 215, 0, 0.15)',
    pointerEvents: 'none',
    animation: 'markdownEditorGlyphRotate 20s linear infinite',
  } as React.CSSProperties,
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  setMarkdown,
  markdownMode,
  setMarkdownMode,
  sacredtheme = false,
}) => {
  const [markdownValue, setMarkdownValue] = useState(markdown)
  const [selectedText, setSelectedText] = useState('')

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes markdownEditorCodeGlow {
          0%, 100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
          50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
        }
        @keyframes markdownEditorGlyphRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
    if (!markdownMode) {
      // Perform any action you want when markdownMode changes to false
    }
  }, [markdownMode])

  useEffect(() => {
    if (markdown !== markdownValue) {
      setMarkdownValue(markdown)
    }
  }, [markdown, markdownValue])

  const handleLocalMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value
    setMarkdownValue(newValue)
    setMarkdown(newValue)
  }

  const handleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    setSelectedText(
      target.value.substring(target.selectionStart, target.selectionEnd)
    )
  }

  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      <Toolbar
        markdownMode={markdownMode}
        setMarkdownMode={setMarkdownMode}
        setMarkdown={setMarkdown}
        handleBoldClick={() =>
          handleBoldClick(selectedText, markdown, setMarkdown)
        }
        handleItalicClick={() =>
          handleItalicClick(selectedText, markdown, setMarkdown)
        }
        toolbarType="markdown"
        sacredtheme={sacredtheme}
      />
      <hr style={styles.separator} />
      <textarea
        value={markdownValue}
        onChange={handleLocalMarkdownChange}
        onSelect={handleSelect}
        placeholder={
          sacredtheme ? 'Compose your markdown scripture...' : undefined
        }
        style={styles.textarea}
        rows={10}
      />
      {sacredtheme && <div style={sacredStyles.glyph}>{SACRED_GLYPHS[1]}</div>}
    </div>
  )
}

export default MarkdownEditor

// src/components/ComplexTextEditor/MarkdownEditor/index.tsx

import React, { useEffect, useState } from 'react'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Editor'
import { Box, Divider, TextField, keyframes, alpha } from '@mui/material'
import { RichTextEditorTypes } from '../utils/useRichtextEditor'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const SACRED_GLYPHS = ['𓊖', '𓊗', '𓋴', '𓏏']

const sacredCodeGlow = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
`

const glyphRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

type MarkdownEditorProps = {
  markdown: string
  setMarkdown: (value: string) => void
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setNewSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void
  sacredTheme?: boolean
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  setMarkdown,
  markdownMode,
  setMarkdownMode,
  sacredTheme = false,
}) => {
  const [markdownValue, setMarkdownValue] = useState(markdown)
  const [selectedText, setSelectedText] = useState('')

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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value
    setMarkdownValue(newValue)
    setMarkdown(newValue)
  }

  const handleSelect = (event: React.SyntheticEvent<HTMLDivElement>) => {
    const target = event.target as HTMLTextAreaElement
    setSelectedText(
      target.value.substring(target.selectionStart, target.selectionEnd)
    )
  }

  return (
    <Box
      sx={{
        border: sacredTheme
          ? `1px solid ${alpha('#FFD700', 0.3)}`
          : '1px solid black',
        borderRadius: '8px',
        width: 'auto',
        backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
        position: 'relative',
        overflow: 'hidden',
        ...(sacredTheme && {
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
            radial-gradient(circle at top left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
          `,
        }),
      }}
    >
      <Toolbar
        markdownMode={markdownMode}
        setMarkdownMode={setMarkdownMode}
        setMarkdown={setMarkdown}
        /* Notice the inline `void` calls here */
        handleBoldClick={() =>
          void handleBoldClick(selectedText, markdown, setMarkdown)
        }
        handleItalicClick={() =>
          void handleItalicClick(selectedText, markdown, setMarkdown)
        }
        toolbarType="markdown"
        sacredTheme={sacredTheme}
      />
      <Divider
        sx={{
          backgroundColor: sacredTheme ? alpha('#FFD700', 0.3) : 'black',
          ...(sacredTheme && {
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          }),
        }}
      />
      <TextField
        fullWidth
        multiline
        variant="standard"
        rows={10}
        value={markdownValue}
        onChange={handleLocalMarkdownChange}
        onSelect={handleSelect}
        placeholder={
          sacredTheme ? 'Compose your markdown scripture...' : undefined
        }
        sx={{
          boxSizing: 'border-box',
          p: 1,
          '& .MuiInputBase-root': {
            color: sacredTheme ? alpha('#FFD700', 0.9) : 'inherit',
            fontFamily: 'monospace',
            fontSize: '14px',
            ...(sacredTheme && {
              animation: `${sacredCodeGlow} 4s ease-in-out infinite`,
            }),
          },
          '& .MuiInputBase-input': {
            ...(sacredTheme && {
              letterSpacing: '0.5px',
              '&::placeholder': {
                color: alpha('#FFD700', 0.5),
                fontStyle: 'italic',
              },
              '&::selection': {
                backgroundColor: alpha('#FFD700', 0.3),
                color: '#FFD700',
              },
            }),
          },
        }}
      />
      {/* Sacred decorative elements */}
      {sacredTheme && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            color: alpha('#FFD700', 0.15),
            fontSize: '32px',
            animation: `${glyphRotate} 20s linear infinite`,
            pointerEvents: 'none',
          }}
        >
          {SACRED_GLYPHS[1]}
        </Box>
      )}
    </Box>
  )
}

export default MarkdownEditor

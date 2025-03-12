// File: src/components/RichTextEditor/MarkdownEditor/index.tsx

import React, { useEffect, useState } from 'react'
import { handleBoldClick, handleItalicClick } from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Editor'
import { Box, Divider, TextField } from '@mui/material'
import { RichTextEditorTypes } from '../utils/useRichtextEditor'

type MarkdownEditorProps = {
  markdown: string
  setMarkdown: (value: string) => void
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setNewSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  setMarkdown,
  markdownMode,
  setMarkdownMode,
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
        border: '1px solid black',
        borderRadius: '8px',
        width: 'auto',
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
      />
      <Divider sx={{ backgroundColor: 'black' }} />
      <TextField
        fullWidth
        multiline
        variant="standard"
        rows={10}
        value={markdownValue}
        onChange={handleLocalMarkdownChange}
        onSelect={handleSelect}
        sx={{
          boxSizing: 'border-box',
          p: 1,
        }}
      />
    </Box>
  )
}

export default MarkdownEditor

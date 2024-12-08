// File: src/components/RichTextEditor/MarkdownEditor/index.tsx

import React, { useEffect, useState } from 'react'
import {
  handleSwitchToRichText,
  handleBoldClick,
  handleItalicClick,
} from '../utils/useMarkdownEditor'
import Toolbar from '../Toolbars/Markdown'
import { Box, Divider, TextField } from '@mui/material'
import { RichTextEditorTypes } from '../types'

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
  setNewSlateValue,
}) => {
  const [markdownValue, setMarkdownValue] = useState(markdown)
  const [selectedText, setSelectedText] = useState('')

  useEffect(() => {
    if (!markdownMode) {
      console.log('MarkdownEditor: markdownMode = ', markdownMode)
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

  const handleSwitchMode = () => {
    handleSwitchToRichText(
      markdown,
      setNewSlateValue,
      setNewSlateValue,
      setMarkdownMode
    )
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
        handleBoldClick={() =>
          handleBoldClick(selectedText, markdown, setMarkdown)
        }
        handleItalicClick={() =>
          handleItalicClick(selectedText, markdown, setMarkdown)
        }
        switchModeLabel="RichText Mode"
        onSwitchMode={handleSwitchMode}
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

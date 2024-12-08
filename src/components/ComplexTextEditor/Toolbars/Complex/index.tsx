import React from 'react'
import RichToolbar from '../Rich'
import MarkdownToolbar from '../Markdown'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'

export type EditorMode = 'rich' | 'markdown' | 'simple'

interface ComplexToolbarProps {
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  markdownMode: boolean
  setMarkdownMode: React.Dispatch<React.SetStateAction<boolean>>
  setMarkdown: React.Dispatch<React.SetStateAction<string>>
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  handleLinkClick?: () => void
}

const ComplexToolbar: React.FC<ComplexToolbarProps> = ({
  mode,
  setMode,
  markdownMode,
  setMarkdownMode,
  setMarkdown,
  handleBoldClick,
  handleItalicClick,
  handleLinkClick,
}) => {
  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: EditorMode | null
  ) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '8px',
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
        >
          <ToggleButton
            value="simple"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#E7F5FF',
                color: 'black',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#E7F5FF',
              },
            }}
          >
            Simple
          </ToggleButton>
          <ToggleButton
            value="rich"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#E7F5FF',
                color: 'black',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#E7F5FF',
              },
            }}
          >
            Rich Text
          </ToggleButton>
          <ToggleButton
            value="markdown"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#E7F5FF',
                color: 'black',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#E7F5FF',
              },
            }}
          >
            Markdown
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {mode === 'rich' && (
        <RichToolbar
          markdownMode={markdownMode}
          setMarkdown={setMarkdown}
          handleBoldClick={handleBoldClick}
          handleItalicClick={handleItalicClick}
          handleLinkClick={handleLinkClick}
        />
      )}
      {mode === 'markdown' && (
        <MarkdownToolbar
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setMarkdown={setMarkdown}
          handleBoldClick={handleBoldClick}
          handleItalicClick={handleItalicClick}
          switchModeLabel="Rich Text Mode"
          onSwitchMode={() => setMode('rich')}
        />
      )}
    </Box>
  )
}

export default ComplexToolbar

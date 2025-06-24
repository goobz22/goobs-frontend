// src/components/ComplexTextEditor/Toolbars/Complex/index.tsx

import React from 'react'
import RichEditor from '../../RichEditor'
import MarkdownEditor from '../../MarkdownEditor'
import SimpleEditor from '../../SimpleEditor'
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  keyframes,
  alpha,
} from '@mui/material'
import { RichTextEditorTypes } from '../../utils/useRichtextEditor'
import { Descendant } from 'slate'

// --------------------------------------------------------------------------
// SACRED THEMING CONSTANTS AND ANIMATIONS
// --------------------------------------------------------------------------

const sacredButtonGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
`

export type EditorMode = 'rich' | 'markdown' | 'simple'

interface ComplexToolbarProps {
  // Common props
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  label?: string
  minRows?: number

  // Simple editor props
  simpleValue: string
  setSimpleValue: (value: string) => void

  // Rich editor props
  richValue: Descendant[]
  onRichChange?: () => void

  // Markdown editor props
  markdown: string
  setMarkdown: (value: string) => void

  // Shared editor state
  markdownMode: boolean
  setMarkdownMode: React.Dispatch<React.SetStateAction<boolean>>

  // Optional toolbar handlers
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  handleLinkClick?: () => void

  // Optional styling props
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  style?: React.CSSProperties

  // Optional accordion props
  accordion?: boolean
  accordionSummary?: React.ReactNode
  defaultExpanded?: boolean

  // Sacred theme
  sacredtheme?: boolean
}

const ComplexToolbar: React.FC<ComplexToolbarProps> = ({
  mode,
  setMode,
  label,
  minRows = 5,
  simpleValue,
  setSimpleValue,
  richValue,
  onRichChange,
  markdown,
  setMarkdown,
  markdownMode,
  setMarkdownMode,
  error,
  helperText,
  required,
  style,
  accordion = false,
  accordionSummary,
  defaultExpanded,
  sacredtheme = false,
}) => {
  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: EditorMode | null
  ) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  // Function to set Slate value when switching from markdown to rich text
  const setNewSlateValue = (value: RichTextEditorTypes['CustomElement'][]) => {
    // This function would ideally update the richValue
    // For now, it's a placeholder as we would need to implement proper conversion
    console.log('Setting new slate value:', value)
    // Here you would convert and update richValue
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
          ...(sacredtheme && {
            backgroundColor: alpha('#000000', 0.5),
            borderRadius: '8px 8px 0 0',
          }),
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={
            sacredtheme
              ? {
                  '& .MuiToggleButton-root': {
                    color: alpha('#FFD700', 0.7),
                    borderColor: alpha('#FFD700', 0.3),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha('#FFD700', 0.1),
                      borderColor: alpha('#FFD700', 0.5),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha('#FFD700', 0.2),
                      color: '#FFD700',
                      borderColor: '#FFD700',
                      animation: `${sacredButtonGlow} 2s ease-in-out infinite`,
                      '&:hover': {
                        backgroundColor: alpha('#FFD700', 0.3),
                      },
                    },
                  },
                }
              : {
                  '& .MuiToggleButton-root': {
                    '&.Mui-selected': {
                      backgroundColor: '#E7F5FF',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#E7F5FF',
                      },
                    },
                  },
                }
          }
        >
          <ToggleButton value="simple">Simple</ToggleButton>
          <ToggleButton value="rich">Rich Text</ToggleButton>
          <ToggleButton value="markdown">Markdown</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Render the appropriate editor based on mode */}
      {mode === 'simple' && (
        <SimpleEditor
          value={simpleValue}
          setValue={setSimpleValue}
          minRows={minRows}
          label={label}
          error={error}
          helperText={helperText}
          required={required}
          style={style}
          sacredtheme={sacredtheme}
        />
      )}

      {mode === 'rich' && (
        <RichEditor
          value={richValue}
          onChange={onRichChange}
          label={label}
          minRows={minRows}
          accordion={accordion}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setMarkdown={setMarkdown}
          accordionSummary={accordionSummary}
          defaultExpanded={defaultExpanded}
          sacredtheme={sacredtheme}
        />
      )}

      {mode === 'markdown' && (
        <MarkdownEditor
          markdown={markdown}
          setMarkdown={setMarkdown}
          markdownMode={markdownMode}
          setMarkdownMode={setMarkdownMode}
          setNewSlateValue={setNewSlateValue}
          sacredtheme={sacredtheme}
        />
      )}
    </Box>
  )
}

export default ComplexToolbar

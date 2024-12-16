import React, { useState } from 'react'
import ToolbarButton from '../../ToolbarButton'
import {
  Box,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  MenuItem,
} from '@mui/material'
import {
  Link,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  FormatListNumbered,
  FormatListBulleted,
} from '@mui/icons-material'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { AlignmentFormat } from '../../types'

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type TextType = 'p' | 'h1' | 'h2' | 'h3'

interface ToolbarMarkdownProps {
  editor?: CustomEditor
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
  setMarkdown: (value: string) => void
  switchModeLabel: string
  onSwitchMode?: () => void
}

const ToolbarMarkdown: React.FC<ToolbarMarkdownProps> = ({
  editor,
  handleBoldClick,
  handleItalicClick,
  markdownMode,
  setMarkdown,
  switchModeLabel,
  onSwitchMode,
}) => {
  const [alignValue, setAlignValue] = useState<AlignmentFormat>('left')
  const [textType, setTextType] = useState<TextType>('p')

  const handleAlignChange = (event: SelectChangeEvent) => {
    setAlignValue(event.target.value as AlignmentFormat)
  }

  const handleTextTypeChange = (event: SelectChangeEvent) => {
    setTextType(event.target.value as TextType)
  }

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        {/* undo / redo */}
        <Box>
          <ToolbarButton buttonAction="undo" editor={editor}>
            <Undo fontSize="small" />
          </ToolbarButton>
          <ToolbarButton buttonAction="redo" editor={editor}>
            <Redo fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            onClick={onSwitchMode}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            {switchModeLabel}
          </ToolbarButton>
        </Box>
        {/* text dropdown */}
        <Select
          value={textType}
          onChange={handleTextTypeChange}
          variant="outlined"
        >
          <MenuItem value={'p'}>
            <Typography>Paragraph Text</Typography>
          </MenuItem>
          <MenuItem value={'h1'}>
            <Typography>Heading 1</Typography>
          </MenuItem>
          <MenuItem value={'h2'}>
            <Typography>Heading 2</Typography>
          </MenuItem>
          <MenuItem value={'h3'}>
            <Typography>Heading 3</Typography>
          </MenuItem>
        </Select>
        {/* alignment dropdown */}
        <Select
          value={alignValue}
          onChange={handleAlignChange}
          variant="outlined"
        >
          <MenuItem value={'left'}>
            <ToolbarButton format="left">
              <FormatAlignLeft fontSize="small" />
              <Typography>left</Typography>
            </ToolbarButton>
          </MenuItem>
          <MenuItem value={'center'}>
            <ToolbarButton format="center">
              <FormatAlignCenter fontSize="small" />
              <Typography>center</Typography>
            </ToolbarButton>
          </MenuItem>
          <MenuItem value={'right'}>
            <ToolbarButton format="right">
              <FormatAlignRight fontSize="small" />
              <Typography>right</Typography>
            </ToolbarButton>
          </MenuItem>
        </Select>
        {/* buttons */}
        <Box>
          <ToolbarButton
            format="bold"
            handleMouseDown={handleBoldClick}
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <FormatBold fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="italic"
            handleMouseDown={handleItalicClick}
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <FormatItalic fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="underline"
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <FormatUnderlined fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="strikethrough"
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <StrikethroughS fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="code"
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <Code fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="link"
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <Link fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="numbered-list"
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <FormatListNumbered fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            format="bulleted-list"
            editor={editor}
            markdownMode={markdownMode}
            setMarkdown={setMarkdown}
          >
            <FormatListBulleted fontSize="small" />
          </ToolbarButton>
        </Box>
      </Stack>
    </Box>
  )
}

export default ToolbarMarkdown

import React, { useState } from 'react'
import ToolbarButton from '../../ToolbarButton'
import {
  Box,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
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
import {
  AlignmentButton,
  AlignmentMenuItem,
  TextType,
  TextTypeMenuItem,
} from '../Rich/index'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { AlignmentFormat } from '@/components/ComplexTextEditor/types'

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
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
            sx={{
              fontSize: '14px',
              borderRadius: '4px',
              color: 'black',
              border: '1px solid black',
            }}
          >
            {switchModeLabel}
          </ToolbarButton>
        </Box>
        {/* text dropdown */}
        <Select
          value={textType}
          onChange={handleTextTypeChange}
          variant="outlined"
          sx={{
            p: '8px',
            width: '150px',
            ':hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            ':active': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '& .MuiSelect-select': { padding: 0 },
            height: '34px',
            '.MuiOutlinedInput-notchedOutline': { border: '1px solid black' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '1px solid black',
            },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                boxSizing: 'border-box',
                width: '150px',
                border: '1px solid black',
                minWidth: 0,
              },
            },
          }}
          renderValue={value => {
            if (value === 'p') {
              return (
                <Box display="flex">
                  <Typography fontSize="14px">Paragraph Text</Typography>
                </Box>
              )
            } else if (value === 'h1') {
              return (
                <Box display="flex">
                  <Typography fontSize="14px">Heading 1</Typography>
                </Box>
              )
            } else if (value === 'h2') {
              return (
                <Box display="flex">
                  <Typography fontSize="14px">Heading 2</Typography>
                </Box>
              )
            } else if (value === 'h3') {
              return (
                <Box display="flex">
                  <Typography fontSize="14px">Heading 3</Typography>
                </Box>
              )
            } else return <></>
          }}
        >
          <TextTypeMenuItem value={'p'}>
            <Typography fontSize="14px">Paragraph Text</Typography>
          </TextTypeMenuItem>
          <TextTypeMenuItem value={'h1'}>
            <Typography fontSize="24px">Heading 1</Typography>
          </TextTypeMenuItem>
          <TextTypeMenuItem value={'h2'}>
            <Typography fontSize="20px">Heading 2</Typography>
          </TextTypeMenuItem>
          <TextTypeMenuItem value={'h3'}>
            <Typography fontSize="16px">Heading 3</Typography>
          </TextTypeMenuItem>
        </Select>
        {/* alignment dropdown */}
        <Select
          value={alignValue}
          onChange={handleAlignChange}
          variant="outlined"
          sx={{
            p: '8px',
            ':hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            ':active': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '& .MuiSelect-select': { padding: 0 },
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none !important',
            },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                minWidth: 0,
              },
            },
          }}
          renderValue={value => {
            if (value === 'left') {
              return (
                <Box display="flex">
                  <FormatAlignLeft fontSize="small" />
                </Box>
              )
            } else if (value === 'center') {
              return (
                <Box display="flex">
                  <FormatAlignCenter fontSize="small" />
                </Box>
              )
            } else if (value === 'right') {
              return (
                <Box display="flex">
                  <FormatAlignRight fontSize="small" />
                </Box>
              )
            } else return <></>
          }}
        >
          <AlignmentMenuItem value={'left'}>
            <AlignmentButton format="left" activeBackgroundColor="#E7F5FF">
              <FormatAlignLeft fontSize="small" />
              <Typography fontSize={'14px'} mx={1}>
                left
              </Typography>
            </AlignmentButton>
          </AlignmentMenuItem>
          <AlignmentMenuItem value={'center'}>
            <AlignmentButton format="center" activeBackgroundColor="#E7F5FF">
              <FormatAlignCenter fontSize="small" />
              <Typography fontSize={'14px'} mx={1}>
                center
              </Typography>
            </AlignmentButton>
          </AlignmentMenuItem>
          <AlignmentMenuItem value={'right'}>
            <AlignmentButton format="right" activeBackgroundColor="#E7F5FF">
              <FormatAlignRight fontSize="small" />
              <Typography fontSize={'14px'} mx={1}>
                right
              </Typography>
            </AlignmentButton>
          </AlignmentMenuItem>
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

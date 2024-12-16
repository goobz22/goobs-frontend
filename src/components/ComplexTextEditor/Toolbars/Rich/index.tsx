import React, { useState } from 'react'
import ToolbarButton from '../../ToolbarButton'
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import {
  Code,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatUnderlined,
  Link,
  Redo,
  StrikethroughS,
  Undo,
} from '@mui/icons-material'
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { AlignmentFormat } from '../../types'

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

interface ToolbarProps {
  editor?: CustomEditor
  markdownMode: boolean
  setMarkdown: React.Dispatch<React.SetStateAction<string>>
  handleBoldClick?: () => void
  handleItalicClick?: () => void
  handleLinkClick?: () => void
}

export type TextType = 'p' | 'h1' | 'h2' | 'h3'

export const AlignmentMenuItem = styled(MenuItem)({
  '& .Mui-selected': {},
  backgroundColor: 'transparent !important',
  padding: 0,
  margin: 0,
})

export const TextTypeMenuItem = styled(MenuItem)({
  '& .Mui-selected': { backgroundColor: '#E7F5FF' },
  ':hover': {
    backgroundColor: '#E7F5FF',
  },
})

const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  markdownMode,
  setMarkdown,
  handleBoldClick,
  handleItalicClick,
  handleLinkClick,
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
      {editor && (
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
              <ToolbarButton
                format="left"
                editor={editor}
                sx={{
                  width: '100%',
                  borderRadius: 0,
                  justifyContent: 'flex-start',
                  ':hover': {
                    backgroundColor: '#E7F5FF',
                  },
                }}
              >
                <FormatAlignLeft fontSize="small" />
                <Typography fontSize={'14px'} mx={1}>
                  left
                </Typography>
              </ToolbarButton>
            </AlignmentMenuItem>
            <AlignmentMenuItem value={'center'}>
              <ToolbarButton
                format="center"
                editor={editor}
                sx={{
                  width: '100%',
                  borderRadius: 0,
                  justifyContent: 'flex-start',
                  ':hover': {
                    backgroundColor: '#E7F5FF',
                  },
                }}
              >
                <FormatAlignCenter fontSize="small" />
                <Typography fontSize={'14px'} mx={1}>
                  center
                </Typography>
              </ToolbarButton>
            </AlignmentMenuItem>
            <AlignmentMenuItem value={'right'}>
              <ToolbarButton
                format="right"
                editor={editor}
                sx={{
                  width: '100%',
                  borderRadius: 0,
                  justifyContent: 'flex-start',
                  ':hover': {
                    backgroundColor: '#E7F5FF',
                  },
                }}
              >
                <FormatAlignRight fontSize="small" />
                <Typography fontSize={'14px'} mx={1}>
                  right
                </Typography>
              </ToolbarButton>
            </AlignmentMenuItem>
          </Select>
          {/* buttons */}
          <Box>
            <ToolbarButton
              format="bold"
              editor={editor}
              handleMouseDown={handleBoldClick}
              markdownMode={markdownMode}
              setMarkdown={setMarkdown}
            >
              <FormatBold fontSize="small" />
            </ToolbarButton>
            <ToolbarButton
              format="italic"
              editor={editor}
              handleMouseDown={handleItalicClick}
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
              handleMouseDown={handleLinkClick}
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
      )}
    </Box>
  )
}

export default Toolbar

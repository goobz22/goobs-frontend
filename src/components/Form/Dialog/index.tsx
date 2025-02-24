'use client'

import React, { useMemo } from 'react'
import { Dialog, Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from '../../../styles/Form'
import { TypographyProps } from '../../Typography'

export interface CustomDialogProps {
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  width?: number
}

function CustomDialog({
  title,
  description,
  grids,
  content,
  width = 450,
}: CustomDialogProps) {
  // We render this dialog as always open (embedded in pages).

  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      typography: [
        {
          text: title,
          fontvariant: 'merrih5',
          fontcolor: 'black',
        },
        {
          text: description,
          fontvariant: 'merriparagraph',
          fontcolor: 'black',
        },
      ] as TypographyProps[],
    }),
    [title, description]
  )

  const renderHeader = useMemo(
    () => <ContentSection grids={[headerGrid]} />,
    [headerGrid]
  )

  const renderContent = useMemo(
    () => (
      <Box sx={formContainerStyle}>
        <Box mb={0}>{renderHeader}</Box>
        {content || (grids && <ContentSection grids={grids} />)}
      </Box>
    ),
    [renderHeader, content, grids]
  )

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={false}
      PaperProps={{
        style: {
          width: `${width}px`,
        },
      }}
    >
      {renderContent}
    </Dialog>
  )
}

export default CustomDialog

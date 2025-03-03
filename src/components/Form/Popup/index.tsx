'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from '../../../styles/Form'

export interface PopupProps {
  open: boolean
  /**
   * Optional flag indicating the popup should be closed from the parent.
   */
  close: boolean
  /**
   * Optional callback so the parent can be informed when user closes the dialog.
   */
  onClose: () => void
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  width?: number
}

function Popup({
  open,
  close,
  onClose,
  title,
  description,
  grids,
  content,
  width = 450,
}: PopupProps) {
  // Local state syncing with props
  const [isOpen, setIsOpen] = useState(open)
  const [, setIsClosed] = useState(!open)

  useEffect(() => {
    setIsOpen(open)
    setIsClosed(!open)
  }, [open])

  useEffect(() => {
    if (typeof close === 'boolean') {
      setIsOpen(!close)
      setIsClosed(close)
    }
  }, [close])

  // Create a header grid using the new ContentSection interface.
  // We only supply the typography array without any layout properties.
  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      typography: [
        {
          text: title,
          // Cast to literal type as expected by goobs-frontend.
          fontvariant: 'merrih5' as const,
          fontcolor: 'black',
        },
        {
          text: description,
          fontvariant: 'merriparagraph' as const,
          fontcolor: 'black',
        },
      ],
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

  const handleClose = () => {
    setIsOpen(false)
    setIsClosed(true)
    onClose?.()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose} // Clicking outside/backdrop or pressing ESC triggers this
      fullWidth
      maxWidth={false}
      slotProps={{
        paper: {
          style: {
            width: `${width}px`,
            // Ensure pointer events are enabled inside the Dialog
            pointerEvents: 'auto',
          },
        },
      }}
    >
      <IconButton
        size="small"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
          // Ensure it's on top and clickable
          zIndex: theme => theme.zIndex.modal + 1,
          cursor: 'pointer',
          '&:hover': {
            color: theme => theme.palette.grey[700],
          },
        }}
      >
        <Close />
      </IconButton>
      {renderContent}
    </Dialog>
  )
}

export default Popup

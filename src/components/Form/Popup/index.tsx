'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import CustomButton, { CustomButtonProps } from '../../Button'
import { white } from '../../../styles/palette'

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
  /** Optional array of button props for footer buttons */
  buttons?: CustomButtonProps[]
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
  buttons,
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
          fontvariant: 'merrih4' as const,
          fontcolor: 'black',
        },
        {
          text: description,
          fontvariant: 'merrih5' as const,
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

  const renderButtons = useMemo(() => {
    if (!buttons || buttons.length === 0) return null

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 2,
          marginTop: '15px',
        }}
      >
        {buttons.map((buttonProps, index) => (
          <CustomButton key={index} {...buttonProps} />
        ))}
      </Box>
    )
  }, [buttons])

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
            borderRadius: '16px',
            backgroundColor: white.main,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            padding: '24px',
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
      {renderHeader}
      {content || (grids && <ContentSection grids={grids} />)}
      {renderButtons}
    </Dialog>
  )
}

export default Popup

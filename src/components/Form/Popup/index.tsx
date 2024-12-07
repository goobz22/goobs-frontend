'use client'

import React, { useMemo } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box, DialogProps } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from './../../../styles/Form'
import { ExtendedTypographyProps } from '../../Content/Structure/typography/useGridTypography'

export interface PopupFormProps {
  title?: string
  description?: string
  grids?: ContentSectionProps['grids']
  content?: React.ReactNode
  popupType: 'dialog' | 'modal'
  open?: boolean
  onClose?: () => void
  width?: number
}

function PopupForm({
  title,
  description,
  grids,
  content,
  popupType,
  open,
  onClose,
  width = 450,
}: PopupFormProps) {
  const headerGrid = useMemo(
    (): ContentSectionProps['grids'][0] => ({
      grid: {
        gridconfig: {
          gridname: 'formHeader',
          marginbottom: 0.5,
          gridwidth: '100%',
        },
      },
      typography: [
        {
          text: title,
          fontvariant: 'merrih5',
          fontcolor: 'black',
          columnconfig: {
            row: 1,
            column: 1,
            gridname: 'formHeader',
            columnwidth: '100%',
            alignment: 'left',
            marginbottom: 1.5,
          },
        },
        {
          text: description,
          fontvariant: 'merriparagraph',
          fontcolor: 'black',
          columnconfig: {
            row: 2,
            column: 1,
            alignment: 'left',
            gridname: 'formHeader',
            columnwidth: '100%',
          },
        },
      ] as ExtendedTypographyProps[],
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
        {React.isValidElement(content)
          ? React.cloneElement(
              content as React.ReactElement<{
                onClose?: () => void
                open?: boolean
              }>,
              {
                onClose,
                open,
              }
            )
          : content || (grids && <ContentSection grids={grids} />)}
      </Box>
    ),
    [renderHeader, content, grids, onClose, open]
  )

  const dialogProps: DialogProps = {
    open: popupType === 'modal' ? true : (open ?? false),
    onClose: popupType === 'modal' ? undefined : onClose,
    fullWidth: true,
    maxWidth: false,
    PaperProps: {
      style: {
        width: `${width}px`,
      },
    },
  }

  const modalContent = (
    <>
      {onClose && (
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      )}
      {renderContent}
    </>
  )

  if (popupType === 'modal') {
    return (
      <Dialog {...dialogProps} disableEscapeKeyDown hideBackdrop>
        {modalContent}
      </Dialog>
    )
  }

  return <Dialog {...dialogProps}>{modalContent}</Dialog>
}

// Export the component directly
export default PopupForm

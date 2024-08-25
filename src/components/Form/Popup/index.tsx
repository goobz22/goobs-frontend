'use client'

import React, { useMemo } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box, DialogProps } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from './../../../styles/Form'
import { ExtendedTypographyProps } from '../../Content/Structure/typography/useGridTypography'

/**
 * Props for the PopupForm component.
 * @interface PopupFormProps
 */
export interface PopupFormProps {
  /** The title of the popup form */
  title?: string
  /** The description of the popup form */
  description?: string
  /** The grid configuration for the form content */
  grids?: ContentSectionProps['grids']
  /** Custom content to render inside the form */
  content?: React.ReactNode
  /** The type of popup to render ('dialog' or 'modal') */
  popupType: 'dialog' | 'modal'
  /** Whether the popup is open (only applicable for 'dialog' type) */
  open?: boolean
  /** Callback function to handle closing the popup (only applicable for 'dialog' type) */
  onClose?: () => void
  /** The width of the popup form in pixels */
  width?: number
}

/**
 * PopupForm Component
 *
 * A flexible popup form component that can be rendered as either a dialog or a modal.
 * It supports custom content, grids, and header configuration.
 *
 * @component
 * @example
 * <PopupForm
 *   title="Login"
 *   description="Please enter your credentials"
 *   popupType="dialog"
 *   open={isOpen}
 *   onClose={handleClose}
 *   content={<LoginForm />}
 *   width={400}
 * />
 */
const PopupForm: React.FC<PopupFormProps> = ({
  title,
  description,
  grids,
  content,
  popupType,
  open,
  onClose,
  width = 450,
}) => {
  /**
   * Memoized header grid configuration
   */
  const headerGrid: ContentSectionProps['grids'][0] = useMemo(
    () => ({
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

  /**
   * Memoized header render function
   */
  const renderHeader = useMemo(
    () => <ContentSection grids={[headerGrid]} />,
    [headerGrid]
  )

  /**
   * Memoized content render function
   */
  const renderContent = useMemo(
    () => (
      <Box
        // @ts-ignore
        sx={formContainerStyle}
      >
        <Box mb={0}>{renderHeader}</Box>
        {React.isValidElement(content)
          ? React.cloneElement(content as React.ReactElement, {
              onClose: onClose,
              open: open,
            })
          : content || (grids && <ContentSection grids={grids} />)}
      </Box>
    ),
    [renderHeader, content, grids, onClose, open]
  )

  const dialogProps: DialogProps = {
    open: popupType === 'modal' ? true : open || false,
    onClose: popupType === 'modal' ? undefined : onClose,
    fullWidth: true,
    maxWidth: false,
    PaperProps: {
      style: {
        width: `${width}px`,
      },
    },
  }

  if (popupType === 'modal') {
    return (
      <Dialog {...dialogProps} disableEscapeKeyDown hideBackdrop>
        {renderContent}
      </Dialog>
    )
  }

  return (
    <Dialog {...dialogProps}>
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
    </Dialog>
  )
}

export default PopupForm

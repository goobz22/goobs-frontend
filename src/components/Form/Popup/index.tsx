'use client'

import React from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from './../../../styles/Form'
import { ExtendedTypographyProps } from '../../Content/Structure/typography/useGridTypography'

/**
 * Props for the PopupForm component.
 */
export interface PopupFormProps {
  /** Title of the popup form */
  title?: string
  /** Description of the popup form */
  description?: string
  /** Boolean to control the open state of the dialog */
  open: boolean
  /** Function to call when closing the dialog */
  onClose: () => void
  /** Array of ContentSectionProps to render the form content */
  grids: ContentSectionProps[]
}

/**
 * PopupForm component renders a popup form with a title, description, and content sections.
 * It uses the ContentSection component to render the form content within a Material-UI Dialog.
 *
 * @param props The props for the PopupForm component.
 * @returns The rendered popup form.
 */
function PopupForm({
  title,
  description,
  open,
  onClose,
  grids,
}: PopupFormProps) {
  /**
   * headerGrid contains the grid configuration for the form header.
   * It includes the title and description as typography items.
   */
  const headerGrid: ContentSectionProps = {
    gridconfig: {
      gridname: 'formHeader',
      margintop: 0,
      marginbottom: 1,
      marginleft: 0,
      marginright: 0,
      gridwidth: '100%',
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
          marginbottom: 0.5,
        },
        cellconfig: {
          border: 'none',
        },
      },
      {
        text: description,
        fontvariant: 'merriparagraph',
        fontcolor: 'black',
        columnconfig: {
          row: 2,
          column: 1,
          gridname: 'formHeader',
          columnwidth: '100%',
          marginbottom: 0,
        },
        cellconfig: {
          border: 'none',
        },
      },
    ] as ExtendedTypographyProps[],
  }

  /** Combine the header grid with the provided content grids */
  const contentSectionGrids: ContentSectionProps[] = [headerGrid, ...grids]

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Close button */}
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

      {/* Form container */}
      <Box
        // @ts-ignore
        sx={formContainerStyle}
      >
        <form>
          {/* Render the form content using ContentSection */}
          <ContentSection grids={contentSectionGrids} />
        </form>
      </Box>
    </Dialog>
  )
}

export default PopupForm

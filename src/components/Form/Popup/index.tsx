'use client'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from './../../../styles/Form'
import { TypographyProps } from './../../../components/Typography'
import React from 'react'

export interface PopupFormProps {
  title?: string
  description?: string
  open: boolean
  onClose: () => void
  onSubmit?: (formData: FormData) => void
  grids: ContentSectionProps[]
}

/**
 * PopupForm component renders a popup form with a title, description, and content sections.
 * It uses the ContentSection component to render the form content.
 * @param props The props for the PopupForm component.
 * @returns The rendered popup form.
 */
function PopupForm({
  title,
  description,
  open,
  onClose,
  grids,
  onSubmit,
}: PopupFormProps) {
  /**
   * handleSubmit function is called when the form is submitted.
   * It prevents the default form submission behavior and creates a FormData object from the form data.
   * If an onSubmit callback is provided, it is called with the FormData object.
   * @param event The form submission event.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  /**
   * headerGrid array contains the grid configuration for the form header.
   * It includes the title and description typography props.
   */
  const headerGrid = [
    {
      gridconfig: {
        gridname: 'formHeader',
        margintop: 0,
        marginbottom: 1,
        marginleft: 0,
        marginright: 0,
        gridwidth: '100%',
      },
      subtitle: {
        text: title,
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
      } as TypographyProps,
      paragraph: {
        text: description,
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
      } as TypographyProps,
    },
  ]

  /**
   * contentSectionGrids array combines the headerGrid and the provided grids prop.
   */
  const contentSectionGrids = [...headerGrid, ...grids]

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
      <Box
        // @ts-ignore
        sx={formContainerStyle}
      >
        <form onSubmit={handleSubmit}>
          <ContentSection grids={contentSectionGrids} />
        </form>
      </Box>
    </Dialog>
  )
}

export default PopupForm

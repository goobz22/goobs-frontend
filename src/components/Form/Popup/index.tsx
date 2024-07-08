'use client'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box } from '@mui/material'
import ContentSection, { ContentSectionProps } from '../../Content'
import { formContainerStyle } from './../../../styles/Form'
import { ExtendedTypographyProps } from '../../Content/Structure/typography/useGridTypography'
import Typography from '../../Typography'

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
  /** ContentSectionProps to render the form content */
  grids: ContentSectionProps['grids']
  /** Optional function to handle form submission */
  onSubmit?: () => void
}

/**
 * PopupForm component renders a popup form with a title, description, and content sections.
 * It uses the ContentSection component to render the form content within a Material-UI Dialog.
 * Handles form submission and displays submitted data internally.
 *
 * @param props The props for the PopupForm component.
 * @param ref Ref forwarded to the form element.
 * @returns The rendered popup form.
 */
const PopupForm = forwardRef<HTMLFormElement, PopupFormProps>(
  ({ title, description, open, onClose, grids, onSubmit }, ref) => {
    const [submittedData, setSubmittedData] = React.useState<
      Record<string, string>
    >({})
    const internalFormRef = useRef<HTMLFormElement>(null)

    useImperativeHandle(ref, () => internalFormRef.current as HTMLFormElement)

    /**
     * headerGrid contains the grid configuration for the form header.
     * It includes the title and description as typography items.
     */
    const headerGrid: ContentSectionProps['grids'][0] = {
      grid: {
        gridconfig: {
          gridname: 'formHeader',
          marginbottom: 1,
          gridwidth: '100%',
        },
      },
      typography: [
        {
          text: title,
          fontvariant: 'merrih5',
          fontcolor: 'black',
          columnconfig: {
            column: 1,
            gridname: 'formHeader',
            columnwidth: '100%',
            alignment: 'left',
            marginbottom: 0.5,
          },
        },
        {
          text: description,
          fontvariant: 'merriparagraph',
          fontcolor: 'black',
          columnconfig: {
            column: 1,
            gridname: 'formHeader',
            columnwidth: '100%',
          },
        },
      ] as ExtendedTypographyProps[],
    }

    /** Combine the header grid with the provided content grids */
    const contentSectionGrids: ContentSectionProps['grids'] = [
      headerGrid,
      ...grids,
    ]

    /**
     * Handles form submission and processes form data internally.
     * @param event - The form submission event
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const data: Record<string, string> = {}

      formData.forEach((value, key) => {
        data[key] = value.toString()
      })

      setSubmittedData(data)

      if (onSubmit) {
        onSubmit()
      }
    }

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
          <form onSubmit={handleSubmit} ref={internalFormRef}>
            {/* Render the form content using ContentSection */}
            <ContentSection grids={contentSectionGrids} />
          </form>
          {/* Display submitted data */}
          {Object.keys(submittedData).length > 0 && (
            <Box mt={2}>
              <Typography fontvariant="merrih6" text="Submitted Data:" />
              {Object.entries(submittedData).map(([key, value]) => (
                <Typography
                  key={key}
                  fontvariant="merriparagraph"
                  text={`${key}: ${value}`}
                />
              ))}
            </Box>
          )}
        </Box>
      </Dialog>
    )
  }
)

PopupForm.displayName = 'PopupForm'

export default PopupForm

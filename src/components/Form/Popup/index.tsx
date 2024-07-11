'use client'

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Box } from '@mui/material'
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
  /** Callback function to handle form submission */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  /** Custom content to render inside the form */
  content?: React.ReactNode
  /** The type of popup to render ('dialog' or 'modal') */
  popupType: 'dialog' | 'modal'
  /** Whether the popup is open (only applicable for 'dialog' type) */
  open?: boolean
  /** Callback function to handle closing the popup (only applicable for 'dialog' type) */
  onClose?: () => void
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
 *   onSubmit={handleSubmit}
 *   content={<LoginForm />}
 * />
 */
const PopupForm = forwardRef<HTMLFormElement, PopupFormProps>(
  (
    { title, description, grids, onSubmit, content, popupType, open, onClose },
    ref
  ) => {
    const internalFormRef = useRef<HTMLFormElement>(null)

    // Expose the internal form ref to the parent component
    useImperativeHandle(ref, () => internalFormRef.current as HTMLFormElement)

    /**
     * Memoized header grid configuration
     */
    const headerGrid: ContentSectionProps['grids'][0] = useMemo(
      () => ({
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
     * Handle form submission
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event
     */
    const handleSubmit = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (onSubmit) {
          onSubmit(event)
        }
      },
      [onSubmit]
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
          <form onSubmit={handleSubmit} ref={internalFormRef}>
            {React.isValidElement(content)
              ? React.cloneElement(content as React.ReactElement, {
                  onSubmit: handleSubmit,
                })
              : content || (grids && <ContentSection grids={grids} />)}
          </form>
        </Box>
      ),
      [renderHeader, handleSubmit, content, grids]
    )

    if (popupType === 'modal') {
      return (
        <Dialog
          open={true}
          fullWidth
          maxWidth="sm"
          disableEscapeKeyDown
          hideBackdrop
        >
          {renderContent}
        </Dialog>
      )
    }

    return (
      <Dialog open={open || false} onClose={onClose} fullWidth maxWidth="sm">
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
)

PopupForm.displayName = 'PopupForm'

export default PopupForm
